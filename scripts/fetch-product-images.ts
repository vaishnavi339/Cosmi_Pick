import fs from 'fs';
import path from 'path';
import { Jimp } from 'jimp';
import { Product } from '../src/types';
import {
  brandMatches,
  computeNameSimilarity,
  evaluateCandidateMatch,
  normalizeString,
} from '../src/lib/name-matching';

const OBF_SEARCH_API = 'https://world.openbeautyfacts.org/api/v2/search';
const USER_AGENT = 'CosmicPick/1.0 (student portfolio project - contact: vaishnavi339@users.noreply.github.com)';
const CACHE_FILE = path.join(process.cwd(), 'data', 'obf-cache.json');
const PRODUCTS_FILE = path.join(process.cwd(), 'src', 'data', 'products.json');
const CHECKLIST_FILE = path.join(process.cwd(), 'products-images-checklist.csv');
const REPORT_FILE = path.join(process.cwd(), 'scripts', 'image-review-report.html');
const IMAGES_DIR = path.join(process.cwd(), 'public', 'images', 'products');

// Strict match threshold required by user
const SIMILARITY_THRESHOLD = 0.8;
// OBF rate limit: max 10 search req/min => >6000ms delay between live API calls
const RATE_LIMIT_DELAY_MS = 6200;

interface ObfCandidate {
  code: string;
  product_name?: string;
  product_name_en?: string;
  brands?: string;
  image_front_url?: string;
  image_url?: string;
  ingredients_text?: string;
  categories?: string;
  creator?: string;
  url?: string;
}

interface ReviewReportItem {
  id: string;
  brand: string;
  name: string;
  category: string;
  expectedFilename: string;
  status: 'accepted' | 'rejected' | 'not_found';
  matchedName?: string;
  matchedBrand?: string;
  similarity: number;
  barcode?: string;
  imageUrl?: string;
  localImagePath?: string;
  obfUrl?: string;
  reason?: string;
}

// Ensure directories exist
if (!fs.existsSync(path.dirname(CACHE_FILE))) {
  fs.mkdirSync(path.dirname(CACHE_FILE), { recursive: true });
}
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

// Load cache
let cache: Record<string, ObfCandidate[]> = {};
if (fs.existsSync(CACHE_FILE)) {
  try {
    cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
  } catch {
    cache = {};
  }
}

function saveCache() {
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), 'utf-8');
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Searches OBF by brand tag (returns full brand catalog up to 100 items).
 */
async function fetchBrandCatalog(brand: string): Promise<ObfCandidate[]> {
  const normBrand = normalizeString(brand).replace(/\s+/g, '-');
  const cacheKey = `brand:::${normBrand}`;

  if (cache[cacheKey]) {
    return cache[cacheKey];
  }

  const params = new URLSearchParams({
    brands_tags: normBrand,
    fields: 'code,product_name,product_name_en,brands,image_front_url,image_url,ingredients_text,categories,creator,url',
    page_size: '100',
  });

  const url = `${OBF_SEARCH_API}?${params.toString()}`;
  console.log(`[OBF API] Fetching brand catalog for: ${brand} (${url})`);

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      console.warn(`[OBF API] HTTP ${res.status} for brand ${brand}`);
      cache[cacheKey] = [];
      saveCache();
      return [];
    }

    const data = await res.json();
    const products: ObfCandidate[] = Array.isArray(data.products) ? data.products : [];
    cache[cacheKey] = products;
    saveCache();

    console.log(`[OBF API] Found ${products.length} products for brand ${brand}. Sleeping ${RATE_LIMIT_DELAY_MS / 1000}s...`);
    await sleep(RATE_LIMIT_DELAY_MS);

    return products;
  } catch (err) {
    console.error(`[OBF API] Error fetching brand catalog for ${brand}:`, err);
    return [];
  }
}

/**
 * Fallback search for a specific product query if brand catalog is empty.
 */
async function searchProductFallback(brand: string, query: string): Promise<ObfCandidate[]> {
  const cacheKey = `query:::${normalizeString(brand)}:::${normalizeString(query)}`;
  if (cache[cacheKey]) {
    return cache[cacheKey];
  }

  // Simplified keywords (first 3 key terms)
  const cleanTerms = normalizeString(query)
    .split(' ')
    .filter(w => w.length > 2 && !['with', 'and', 'the', 'for'].includes(w))
    .slice(0, 3)
    .join(' ');

  const params = new URLSearchParams({
    search_terms: `${brand} ${cleanTerms}`,
    fields: 'code,product_name,product_name_en,brands,image_front_url,image_url,ingredients_text,categories,creator,url',
    page_size: '10',
  });

  const url = `${OBF_SEARCH_API}?${params.toString()}`;
  console.log(`[OBF API] Fallback search: "${brand} ${cleanTerms}"`);

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      cache[cacheKey] = [];
      saveCache();
      return [];
    }

    const data = await res.json();
    const products: ObfCandidate[] = Array.isArray(data.products) ? data.products : [];
    cache[cacheKey] = products;
    saveCache();

    console.log(`[OBF API] Found ${products.length} fallback candidates. Sleeping ${RATE_LIMIT_DELAY_MS / 1000}s...`);
    await sleep(RATE_LIMIT_DELAY_MS);

    return products;
  } catch (err) {
    console.error(`[OBF API] Fallback search error:`, err);
    return [];
  }
}

/**
 * Downloads and optimizes image to max 800px with white background preserved.
 */
async function downloadAndOptimizeImage(imageUrl: string, targetPath: string): Promise<boolean> {
  try {
    const res = await fetch(imageUrl, {
      headers: { 'User-Agent': USER_AGENT },
    });
    if (!res.ok) return false;

    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const img = await Jimp.read(buffer);
    if (img.width > 800 || img.height > 800) {
      img.scaleToFit({ w: 800, h: 800 });
    }
    const outBuffer = await img.getBuffer('image/jpeg');
    fs.writeFileSync(targetPath, outBuffer);

    return true;
  } catch (err) {
    console.error(`[Image Error] Failed to process image from ${imageUrl}:`, err);
    return false;
  }
}

function parseChecklist(): Map<string, string> {
  const map = new Map<string, string>();
  if (!fs.existsSync(CHECKLIST_FILE)) return map;

  const content = fs.readFileSync(CHECKLIST_FILE, 'utf-8');
  const lines = content.split('\n');
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const parts = line.split('","').map(p => p.replace(/^"|"$/g, ''));
    if (parts.length >= 5) {
      map.set(parts[0], parts[4]);
    }
  }
  return map;
}

function updateChecklist(results: ReviewReportItem[]) {
  const header = 'id,brand,name,category,expected_filename,status,notes';
  const rows = results.map(r => {
    const status = r.status === 'accepted' ? 'downloaded' : 'needs_manual';
    const notes = r.status === 'accepted'
      ? `Auto-accepted (score: ${r.similarity}, OBF: ${r.barcode})`
      : (r.reason || 'Below threshold or not in OBF');
    return `"${r.id}","${r.brand.replace(/"/g, '""')}","${r.name.replace(/"/g, '""')}","${r.category}","${r.expectedFilename}","${status}","${notes}"`;
  });

  fs.writeFileSync(CHECKLIST_FILE, [header, ...rows].join('\n') + '\n', 'utf-8');
}

function generateHtmlReport(results: ReviewReportItem[]) {
  const acceptedCount = results.filter(r => r.status === 'accepted').length;
  const needsManualCount = results.length - acceptedCount;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>CosmicPick · Open Beauty Facts Image Review Report</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #FAF7F5; color: #3B1F2B; margin: 0; padding: 30px; }
    .container { max-width: 1200px; margin: 0 auto; background: #fff; border-radius: 20px; box-shadow: 0 10px 30px rgba(59,31,43,0.06); padding: 32px; }
    h1 { font-family: Georgia, serif; color: #3B1F2B; margin-top: 0; }
    .stats { display: flex; gap: 20px; margin: 24px 0; }
    .stat-card { flex: 1; padding: 20px; border-radius: 14px; background: #FBF7F4; border: 1px solid #E8D3C0; }
    .stat-number { font-size: 32px; font-weight: bold; color: #3B1F2B; }
    .stat-label { font-size: 13px; color: #7E636E; text-transform: uppercase; letter-spacing: 0.5px; }
    table { width: 100%; border-collapse: collapse; margin-top: 24px; font-size: 13px; }
    th { text-align: left; padding: 12px; background: #3B1F2B; color: #FAF3F0; font-weight: 600; }
    td { padding: 14px 12px; border-bottom: 1px solid #EFE4DC; vertical-align: middle; }
    tr:hover { background: #FDF9F6; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: bold; }
    .badge-accepted { background: #D1E7DD; color: #0F5132; }
    .badge-rejected { background: #F8D7DA; color: #842029; }
    .badge-missing { background: #FFF3CD; color: #664D03; }
    .img-thumb { width: 70px; height: 70px; object-fit: contain; background: #FAFAFA; border: 1px solid #E8D3C0; border-radius: 10px; padding: 4px; }
    .img-placeholder { width: 70px; height: 70px; background: #F4D9D6; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #3B1F2B; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <h1>CosmicPick · Product Image Verification Report</h1>
    <p>Automated verification against <strong>Open Beauty Facts API v2</strong>. Threshold required: <strong>&ge; 0.80</strong> + brand match.</p>
    
    <div class="stats">
      <div class="stat-card">
        <div class="stat-number">${results.length}</div>
        <div class="stat-label">Total Catalog Products</div>
      </div>
      <div class="stat-card" style="border-left: 4px solid #198754;">
        <div class="stat-number" style="color: #198754;">${acceptedCount}</div>
        <div class="stat-label">Auto-Accepted (&ge;0.80)</div>
      </div>
      <div class="stat-card" style="border-left: 4px solid #dc3545;">
        <div class="stat-number" style="color: #dc3545;">${needsManualCount}</div>
        <div class="stat-label">Needs Manual Image</div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Preview</th>
          <th>Catalog Product</th>
          <th>OBF Matched Product</th>
          <th>Similarity</th>
          <th>Barcode</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${results.map(r => `
          <tr>
            <td>
              ${r.localImagePath && fs.existsSync(path.join(process.cwd(), 'public', r.localImagePath.replace(/^\//, '')))
                ? `<img class="img-thumb" src="../public${r.localImagePath}" alt="${r.name}" />`
                : (r.imageUrl ? `<img class="img-thumb" src="${r.imageUrl}" alt="${r.name}" />` : `<div class="img-placeholder">Coming Soon</div>`)}
            </td>
            <td>
              <strong>${r.brand}</strong><br/>
              ${r.name}<br/>
              <small style="color: #888;">${r.category} · ${r.id}</small>
            </td>
            <td>
              ${r.matchedName ? `<strong>${r.matchedBrand || ''}</strong><br/>${r.matchedName}` : '<em style="color: #999;">No candidate found</em>'}
              ${r.obfUrl ? `<br/><a href="${r.obfUrl}" target="_blank" style="color: #3B1F2B; font-size: 11px;">View on Open Beauty Facts &rarr;</a>` : ''}
            </td>
            <td>
              <strong style="color: ${r.similarity >= 0.8 ? '#198754' : (r.similarity >= 0.5 ? '#e67e22' : '#dc3545')};">
                ${(r.similarity * 100).toFixed(0)}%
              </strong>
            </td>
            <td><code>${r.barcode || '—'}</code></td>
            <td>
              <span class="badge ${r.status === 'accepted' ? 'badge-accepted' : (r.status === 'rejected' ? 'badge-rejected' : 'badge-missing')}">
                ${r.status === 'accepted' ? 'Auto-Accepted' : (r.status === 'rejected' ? 'Low Match' : 'Not in OBF')}
              </span>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
</body>
</html>`;

  fs.writeFileSync(REPORT_FILE, html, 'utf-8');
  console.log(`[Report] Generated review report at: ${REPORT_FILE}`);
}

async function main() {
  console.log('--- CosmicPick: Fetching Product Images from Open Beauty Facts ---');

  if (!fs.existsSync(PRODUCTS_FILE)) {
    console.error(`Products file not found: ${PRODUCTS_FILE}`);
    process.exit(1);
  }

  const products: Product[] = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf-8'));
  const checklist = parseChecklist();
  const reportItems: ReviewReportItem[] = [];

  console.log(`Loaded ${products.length} products to evaluate.`);

  // Group products by brand so we fetch brand catalogs efficiently
  const brandMap = new Map<string, Product[]>();
  for (const p of products) {
    if (!brandMap.has(p.brand)) {
      brandMap.set(p.brand, []);
    }
    brandMap.get(p.brand)!.push(p);
  }

  console.log(`Total unique brands: ${brandMap.size}`);

  for (const [brand, brandProducts] of brandMap.entries()) {
    console.log(`\n========================================`);
    console.log(`Processing Brand: ${brand} (${brandProducts.length} products)`);
    console.log(`========================================`);

    // Fetch full brand catalog
    let candidates = await fetchBrandCatalog(brand);

    for (const product of brandProducts) {
      const expectedFilename = checklist.get(product.id) || `${normalizeString(product.brand)}-${normalizeString(product.name)}.webp`.replace(/\s+/g, '-');
      const localRelativePath = `/images/products/${expectedFilename}`;
      const localDiskPath = path.join(IMAGES_DIR, expectedFilename);

      console.log(`\nEvaluating: ${product.id} - ${product.name}`);

      // If already downloaded and valid, reuse
      if (product.barcode && product.image && fs.existsSync(localDiskPath)) {
        console.log(`  -> Already downloaded and cached locally: ${product.image}`);
        reportItems.push({
          id: product.id,
          brand: product.brand,
          name: product.name,
          category: product.category,
          expectedFilename,
          status: 'accepted',
          matchedName: product.name,
          matchedBrand: product.brand,
          similarity: 1.0,
          barcode: product.barcode,
          localImagePath: product.image,
          obfUrl: product.imageSource?.url,
        });
        continue;
      }

      // If brand catalog had 0 results, try fallback query
      let productCandidates = candidates;
      if (productCandidates.length === 0) {
        productCandidates = await searchProductFallback(product.brand, product.name);
      }

      if (productCandidates.length === 0) {
        console.log('  -> No candidates found in Open Beauty Facts.');
        if (product.image && !fs.existsSync(path.join(process.cwd(), 'public', product.image.replace(/^\//, '')))) {
          delete product.image;
          delete product.barcode;
          delete product.imageSource;
        }
        reportItems.push({
          id: product.id,
          brand: product.brand,
          name: product.name,
          category: product.category,
          expectedFilename,
          status: 'not_found',
          similarity: 0,
          reason: 'Not found in Open Beauty Facts catalog',
        });
        continue;
      }

      // Find best match with strict similarity >= 0.8
      let bestMatch: ObfCandidate | null = null;
      let highestSim = 0;

      for (const cand of productCandidates) {
        const candidateName = cand.product_name || cand.product_name_en || '';
        const candidateBrand = cand.brands || '';
        const evaluation = evaluateCandidateMatch(
          { name: product.name, brand: product.brand },
          { name: candidateName, brand: candidateBrand },
          SIMILARITY_THRESHOLD
        );

        if (evaluation.brandMatched && evaluation.similarity > highestSim) {
          highestSim = evaluation.similarity;
          if (evaluation.isMatch && (cand.image_front_url || cand.image_url)) {
            bestMatch = cand;
          }
        }
      }

      if (bestMatch && highestSim >= SIMILARITY_THRESHOLD) {
        const candidateName = bestMatch.product_name || bestMatch.product_name_en || '';
        const imageUrl = bestMatch.image_front_url || bestMatch.image_url;
        console.log(`  -> MATCH ACCEPTED! (score: ${highestSim.toFixed(2)})`);
        console.log(`     Candidate: ${bestMatch.brands} - ${candidateName}`);
        console.log(`     Barcode: ${bestMatch.code}`);

        let downloaded = false;
        if (imageUrl) {
          downloaded = await downloadAndOptimizeImage(imageUrl, localDiskPath);
        }

        if (downloaded) {
          console.log(`     Saved optimized image to: ${localRelativePath}`);
          product.barcode = bestMatch.code;
          product.image = localRelativePath;
          product.imageSource = {
            name: 'Open Beauty Facts',
            url: bestMatch.url || `https://world.openbeautyfacts.org/product/${bestMatch.code}`,
            license: 'CC BY-SA',
            contributor: bestMatch.creator || 'Open Beauty Facts contributors',
          };

          reportItems.push({
            id: product.id,
            brand: product.brand,
            name: product.name,
            category: product.category,
            expectedFilename,
            status: 'accepted',
            matchedName: candidateName,
            matchedBrand: bestMatch.brands,
            similarity: highestSim,
            barcode: bestMatch.code,
            imageUrl,
            localImagePath: localRelativePath,
            obfUrl: bestMatch.url,
          });
        } else {
          console.warn('     Image download failed or candidate had no front image.');
          reportItems.push({
            id: product.id,
            brand: product.brand,
            name: product.name,
            category: product.category,
            expectedFilename,
            status: 'rejected',
            matchedName: candidateName,
            matchedBrand: bestMatch.brands,
            similarity: highestSim,
            barcode: bestMatch.code,
            reason: 'Candidate image unavailable or failed to download',
          });
        }
      } else {
        console.log(`  -> Below threshold (score: ${highestSim.toFixed(2)} < ${SIMILARITY_THRESHOLD})`);
        if (product.image && !fs.existsSync(path.join(process.cwd(), 'public', product.image.replace(/^\//, '')))) {
          delete product.image;
          delete product.barcode;
          delete product.imageSource;
        }

        const topCand = productCandidates[0];
        reportItems.push({
          id: product.id,
          brand: product.brand,
          name: product.name,
          category: product.category,
          expectedFilename,
          status: 'rejected',
          matchedName: topCand ? (topCand.product_name || topCand.product_name_en) : undefined,
          matchedBrand: topCand ? topCand.brands : undefined,
          similarity: highestSim,
          barcode: topCand?.code,
          reason: `Similarity ${highestSim.toFixed(2)} is below strict threshold ${SIMILARITY_THRESHOLD}`,
        });
      }
    }
  }

  // Write updated products back to products.json
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf-8');
  console.log(`\nUpdated ${PRODUCTS_FILE}`);

  // Update checklist and generate HTML review report
  updateChecklist(reportItems);
  generateHtmlReport(reportItems);

  console.log('\n--- Fetch complete! ---');
  console.log(`Auto-accepted images: ${reportItems.filter(r => r.status === 'accepted').length}/${products.length}`);
  console.log(`Review report generated at: ${REPORT_FILE}`);
}

main().catch(err => {
  console.error('Fatal error running fetch-product-images:', err);
  process.exit(1);
});
