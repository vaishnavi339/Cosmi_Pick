import fs from 'fs';
import path from 'path';
import { z } from 'zod';
import { Product } from '@/types';
import { computeNameSimilarity, normalizeString } from './name-matching';

const OBF_SEARCH_API = 'https://world.openbeautyfacts.org/api/v2/search';
const OBF_PRODUCT_API = 'https://world.openbeautyfacts.org/api/v2/product';
const USER_AGENT = 'CosmicPick/1.0 (student portfolio project - contact: vaishnavi339@users.noreply.github.com)';
const CACHE_FILE = path.join(process.cwd(), 'data', 'obf-search-cache.json');
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

// Zod schemas for Open Beauty Facts API responses
export const ObfProductSchema = z.object({
  code: z.string().default(''),
  product_name: z.string().optional().default(''),
  product_name_en: z.string().optional(),
  brands: z.string().optional().default(''),
  image_front_url: z.string().optional(),
  image_url: z.string().optional(),
  ingredients_text: z.string().optional().default(''),
  ingredients_text_en: z.string().optional(),
  categories: z.string().optional().default(''),
  creator: z.string().optional(),
  url: z.string().optional(),
});

export const ObfSearchResponseSchema = z.object({
  count: z.number().optional().default(0),
  page: z.number().optional().default(1),
  page_size: z.number().optional().default(20),
  products: z.array(ObfProductSchema).optional().default([]),
  status: z.number().optional(),
  status_verbose: z.string().optional(),
});

export const ObfSingleProductResponseSchema = z.object({
  code: z.string().optional(),
  status: z.number().optional(),
  status_verbose: z.string().optional(),
  product: ObfProductSchema.optional(),
});

export type ObfProduct = z.infer<typeof ObfProductSchema>;

export interface SearchResultItem {
  id: string;
  name: string;
  brand: string;
  imageUrl: string;
  barcode: string;
  ingredientsText: string;
  category: string;
  source: 'local_catalog' | 'open_beauty_facts';
  obfUrl?: string;
}

// ---------------- Cache Storage (LRU + Disk) ----------------
interface CacheEntry<T> {
  timestamp: number;
  data: T;
}

const memoryCache = new Map<string, CacheEntry<unknown>>();
const MAX_MEMORY_ITEMS = 500;

function getCache<T>(key: string): T | null {
  const mem = memoryCache.get(key);
  if (mem) {
    if (Date.now() - mem.timestamp < CACHE_TTL_MS) {
      return mem.data as T;
    }
    memoryCache.delete(key);
  }

  // Check file cache
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const content = fs.readFileSync(CACHE_FILE, 'utf-8');
      const fileStore: Record<string, CacheEntry<unknown>> = JSON.parse(content);
      const entry = fileStore[key];
      if (entry && Date.now() - entry.timestamp < CACHE_TTL_MS) {
        memoryCache.set(key, entry);
        return entry.data as T;
      }
    }
  } catch {
    // Ignore read error
  }

  return null;
}

function setCache<T>(key: string, data: T): void {
  const entry: CacheEntry<T> = {
    timestamp: Date.now(),
    data,
  };

  // LRU eviction
  if (memoryCache.size >= MAX_MEMORY_ITEMS) {
    const oldestKey = memoryCache.keys().next().value;
    if (oldestKey) memoryCache.delete(oldestKey);
  }
  memoryCache.set(key, entry);

  // Write to disk
  try {
    const dir = path.dirname(CACHE_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    let fileStore: Record<string, CacheEntry<unknown>> = {};
    if (fs.existsSync(CACHE_FILE)) {
      try {
        fileStore = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
      } catch {
        fileStore = {};
      }
    }
    fileStore[key] = entry;
    fs.writeFileSync(CACHE_FILE, JSON.stringify(fileStore, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write to OBF cache file:', err);
  }
}

// ---------------- Rate Limiter Queue for Outgoing Calls ----------------
// Search requests: max 10/min => 6200ms spacing
// Product requests: max 100/min => 650ms spacing
class RequestQueue {
  private lastCallTime = 0;
  private queue: Array<() => void> = [];
  private isProcessing = false;

  constructor(private intervalMs: number) {}

  async enqueue<T>(task: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await task();
          resolve(result);
        } catch (err) {
          reject(err);
        }
      });
      this.processNext();
    });
  }

  private async processNext() {
    if (this.isProcessing || this.queue.length === 0) return;
    this.isProcessing = true;

    const elapsed = Date.now() - this.lastCallTime;
    if (elapsed < this.intervalMs) {
      await new Promise((r) => setTimeout(r, this.intervalMs - elapsed));
    }

    const nextTask = this.queue.shift();
    if (nextTask) {
      this.lastCallTime = Date.now();
      try {
        await nextTask();
      } catch {
        // Handled in enqueue
      }
    }

    this.isProcessing = false;
    if (this.queue.length > 0) {
      this.processNext();
    }
  }
}

const searchQueue = new RequestQueue(6200);
const productQueue = new RequestQueue(650);

/**
 * Proxies remote Open Beauty Facts image URL to prevent client-side hotlinking
 */
export function formatImageUrl(remoteUrl: string | undefined, localFallback?: string): string {
  if (localFallback && localFallback.startsWith('/images/')) {
    return localFallback;
  }
  if (!remoteUrl) {
    return '';
  }
  if (remoteUrl.startsWith('/')) {
    return remoteUrl;
  }
  // Wrap remote image in secure local proxy route
  return `/api/product-image?url=${encodeURIComponent(remoteUrl)}`;
}

/**
 * Searches local catalog products matching query terms
 */
function searchLocalCatalog(query: string): SearchResultItem[] {
  try {
    const productsPath = path.join(process.cwd(), 'src', 'data', 'products.json');
    if (!fs.existsSync(productsPath)) return [];
    const products: Product[] = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));

    const normQ = normalizeString(query);
    const results: SearchResultItem[] = [];

    for (const p of products) {
      const normName = normalizeString(p.name);
      const normBrand = normalizeString(p.brand);
      const combined = `${normBrand} ${normName}`;

      const similarity = computeNameSimilarity(normQ, combined);
      const matchesKeyword = normName.includes(normQ) || normBrand.includes(normQ) || combined.includes(normQ) || normQ.includes(normName);

      if (matchesKeyword || similarity >= 0.5) {
        results.push({
          id: p.id,
          name: p.name,
          brand: p.brand,
          imageUrl: p.image || '',
          barcode: p.barcode || '',
          ingredientsText: Array.isArray(p.keyIngredients) ? p.keyIngredients.join(', ') : '',
          category: p.category,
          source: 'local_catalog',
          obfUrl: p.imageSource?.url,
        });
      }
    }

    return results;
  } catch (err) {
    console.error('Error searching local catalog:', err);
    return [];
  }
}

/**
 * Fetch a single product by barcode from OBF v2
 */
export async function getProductByBarcode(barcode: string): Promise<SearchResultItem | null> {
  const cleanBarcode = barcode.trim().replace(/[^0-9]/g, '');
  if (!cleanBarcode || cleanBarcode.length < 8 || cleanBarcode.length > 14) {
    return null;
  }

  const cacheKey = `barcode:${cleanBarcode}`;
  const cached = getCache<SearchResultItem>(cacheKey);
  if (cached) return cached;

  return productQueue.enqueue(async () => {
    const url = `${OBF_PRODUCT_API}/${cleanBarcode}?fields=code,product_name,product_name_en,brands,image_front_url,image_url,ingredients_text,ingredients_text_en,categories,creator,url`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': USER_AGENT,
          Accept: 'application/json',
        },
        signal: controller.signal,
      });

      if (!res.ok) {
        return null;
      }

      const raw = await res.json();
      const parsed = ObfSingleProductResponseSchema.safeParse(raw);
      if (!parsed.success || !parsed.data.product || parsed.data.status !== 1) {
        return null;
      }

      const p = parsed.data.product;
      const name = p.product_name || p.product_name_en || 'Unknown Product';
      const rawImg = p.image_front_url || p.image_url;
      const ingredients = p.ingredients_text || p.ingredients_text_en || '';

      const item: SearchResultItem = {
        id: `obf-${p.code}`,
        name,
        brand: p.brands || 'Cosmetics',
        imageUrl: formatImageUrl(rawImg),
        barcode: p.code,
        ingredientsText: ingredients,
        category: p.categories?.split(',')[0]?.trim() || 'Skincare',
        source: 'open_beauty_facts',
        obfUrl: p.url || `https://world.openbeautyfacts.org/product/${p.code}`,
      };

      setCache(cacheKey, item);
      return item;
    } catch (err) {
      console.error(`Failed to fetch product by barcode ${cleanBarcode}:`, err);
      return null;
    } finally {
      clearTimeout(timeout);
    }
  });
}

/**
 * Searches Open Beauty Facts using structured v2 search with queue and caching
 */
export async function searchOpenBeautyFacts(query: string, limit = 6): Promise<SearchResultItem[]> {
  const trimmed = query.trim();
  const cacheKey = `search:${normalizeString(trimmed)}`;
  const cached = getCache<SearchResultItem[]>(cacheKey);
  if (cached) {
    return cached.slice(0, limit);
  }

  // 1. If query is a barcode
  if (/^\d{8,14}$/.test(trimmed)) {
    const direct = await getProductByBarcode(trimmed);
    if (direct) {
      setCache(cacheKey, [direct]);
      return [direct];
    }
  }

  // 2. Search local catalog first for immediate high-confidence hits
  const localHits = searchLocalCatalog(trimmed);

  // 3. Search Open Beauty Facts via tag query in queue
  const obfHits = await searchQueue.enqueue(async (): Promise<SearchResultItem[]> => {
    const norm = normalizeString(trimmed);
    const words = norm.split(' ').filter((w) => w.length > 2);

    // Identify brand tag candidate
    const brandAliases: Record<string, string> = {
      cerave: 'cerave',
      ordinary: 'the-ordinary',
      minimalist: 'minimalist',
      cetaphil: 'cetaphil',
      cosrx: 'cosrx',
      roche: 'la-roche-posay',
      posay: 'la-roche-posay',
      plum: 'plum',
      foxtale: 'foxtale',
      laneige: 'laneige',
      simple: 'simple',
      biore: 'biore',
      klairs: 'dear-klairs',
      sheth: 'dr-sheths',
      reequil: 'reequil',
      paula: 'paulas-choice',
    };

    let brandTag: string | undefined;
    for (const [key, tag] of Object.entries(brandAliases)) {
      if (norm.includes(key)) {
        brandTag = tag;
        break;
      }
    }

    const params = new URLSearchParams({
      fields: 'code,product_name,product_name_en,brands,image_front_url,image_url,ingredients_text,ingredients_text_en,categories,creator,url',
      page_size: '20',
    });

    if (brandTag) {
      params.set('brands_tags', brandTag);
    } else {
      // If no recognized brand, try category or general tag
      const categories: Record<string, string> = {
        cleanser: 'cleansers',
        serum: 'serums',
        moisturizer: 'creams',
        cream: 'creams',
        sunscreen: 'sunscreens',
        sun: 'sunscreens',
        spf: 'sunscreens',
        toner: 'toners',
        lotion: 'lotions',
      };
      let categoryTag: string | undefined;
      for (const [key, tag] of Object.entries(categories)) {
        if (norm.includes(key)) {
          categoryTag = tag;
          break;
        }
      }

      if (categoryTag) {
        params.set('categories_tags', categoryTag);
      } else if (words.length > 0) {
        params.set('brands_tags', words[0]);
      }
    }

    const url = `${OBF_SEARCH_API}?${params.toString()}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 9000);

    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': USER_AGENT,
          Accept: 'application/json',
        },
        signal: controller.signal,
      });

      if (!res.ok) {
        return [];
      }

      const raw = await res.json();
      const parsed = ObfSearchResponseSchema.safeParse(raw);
      if (!parsed.success || !parsed.data.products) {
        return [];
      }

      const items: SearchResultItem[] = [];
      for (const p of parsed.data.products) {
        const name = p.product_name || p.product_name_en;
        if (!name) continue;

        const rawImg = p.image_front_url || p.image_url;
        const ingredients = p.ingredients_text || p.ingredients_text_en || '';

        items.push({
          id: `obf-${p.code}`,
          name,
          brand: p.brands || 'Skincare',
          imageUrl: formatImageUrl(rawImg),
          barcode: p.code,
          ingredientsText: ingredients,
          category: p.categories?.split(',')[0]?.trim() || 'Skincare',
          source: 'open_beauty_facts',
          obfUrl: p.url || `https://world.openbeautyfacts.org/product/${p.code}`,
        });
      }

      // Sort items by relevance to query
      items.sort((a, b) => {
        const simA = computeNameSimilarity(norm, `${normalizeString(a.brand)} ${normalizeString(a.name)}`);
        const simB = computeNameSimilarity(norm, `${normalizeString(b.brand)} ${normalizeString(b.name)}`);
        return simB - simA;
      });

      return items;
    } catch (err) {
      console.error('Error fetching OBF search results:', err);
      return [];
    } finally {
      clearTimeout(timeout);
    }
  });

  // Combine local catalog hits and OBF hits, avoiding duplicate barcodes/names
  const seen = new Set<string>();
  const combined: SearchResultItem[] = [];

  for (const item of [...localHits, ...obfHits]) {
    const key = (item.barcode || `${normalizeString(item.brand)}-${normalizeString(item.name)}`).toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      combined.push(item);
    }
    if (combined.length >= limit) break;
  }

  setCache(cacheKey, combined);
  return combined;
}
