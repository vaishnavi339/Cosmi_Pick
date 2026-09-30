import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const productFile = path.join(root, 'src/data/products.json');
const imageRoot = path.join(root, 'public/images/products');
const products = JSON.parse(await fs.readFile(productFile, 'utf8'));

const catalogs = {
  Minimalist: 'https://beminimalist.co/products.json?limit=250',
  COSRX: 'https://cosrx.com/products.json?limit=250',
  Plum: 'https://plumgoodness.com/products.json?limit=250',
  'Dot & Key': 'https://www.dotandkey.com/products.json?limit=250',
  'The Derma Co': 'https://thedermaco.com/products.json?limit=250',
  "Paula's Choice": 'https://www.paulaschoice.in/products.json?limit=250',
  'Beauty of Joseon': 'https://beautyofjoseon.com/products.json?limit=250',
  "Re'equil": 'https://reequil.com/products.json?limit=250',
  "Dr. Sheth's": 'https://drsheths.com/products.json?limit=250',
  'Dear, Klairs': 'https://klairs.com/products.json?limit=250',
};

const ignored = new Set(['the','and','with','for','face','facial','skin','daily','new','ml','g','spf','pa','plus','of','in','a','an','to','by','size','oz']);
const tokens = (value) => (value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').match(/[a-z0-9]+/g) || []).filter((word) => word.length > 1 && !ignored.has(word));
const similarity = (a, b) => {
  const left = new Set(tokens(a));
  const right = new Set(tokens(b));
  if (!left.size || !right.size) return 0;
  let overlap = 0;
  for (const word of left) if (right.has(word)) overlap++;
  return (2 * overlap) / (left.size + right.size);
};
const extensions = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/avif': 'avif' };

const storeItems = {};
await Promise.all(Object.entries(catalogs).map(async ([brand, url]) => {
  try {
    const response = await fetch(url, { headers: { accept: 'application/json' } });
    if (!response.ok) return;
    const json = await response.json();
    const host = new URL(url).hostname;
    storeItems[brand] = (json.products || []).map((item) => ({
      title: item.title || '',
      images: (item.images || []).map((image) => typeof image === 'string' ? image : image.src).filter(Boolean),
      sourceUrl: `https://${host}/products/${item.handle}`,
      sourceName: `${brand} official product catalog`,
      contributor: brand,
      license: 'Brand product image',
    })).filter((item) => item.title && item.images.length > 1);
  } catch (error) {
    console.warn(`Could not load ${brand} image gallery: ${error.message}`);
  }
}));

async function saveImage(product, url, index, source) {
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'CosmicPick/1.0 product image gallery' },
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) throw new Error(`image returned ${response.status}`);
    const mime = (response.headers.get('content-type') || '').split(';')[0].toLowerCase();
    const ext = extensions[mime];
    if (!ext) throw new Error(`unsupported image type ${mime}`);
    const data = Buffer.from(await response.arrayBuffer());
    if (data.length < 1000 || data.length > 12 * 1024 * 1024) throw new Error('unexpected image size');

    const filename = `${product.id}-view-${index}.${ext}`;
    await fs.writeFile(path.join(imageRoot, filename), data);
    return {
      image: `/images/products/${filename}`,
      alt: `${product.brand} ${product.name}, product photo ${index + 1}`,
      imageSource: source,
    };
  } catch (error) {
    console.warn(`Skipping extra image for ${product.id}: ${error.message}`);
    return null;
  }
}

await fs.mkdir(imageRoot, { recursive: true });
let productsWithGalleries = 0;
let imageCount = 0;

for (const product of products) {
  const current = [];
  const currentSources = new Set();
  const sourceIsBrand = product.imageSource?.name?.includes('official product catalog');
  const candidates = (storeItems[product.brand] || [])
    .map((item) => ({ ...item, score: similarity(product.name, item.title) }))
    .sort((a, b) => b.score - a.score);
  const bestStore = candidates[0];
  // Use multiple views only from a product record that closely identifies the
  // pictured product; slightly broader matching is reserved for entries whose
  // primary image was already manually verified against the same brand store.
  const storeThreshold = sourceIsBrand ? 0.58 : 0.82;

  if (bestStore && bestStore.score >= storeThreshold) {
    for (const url of bestStore.images.slice(1, 4)) {
      if (currentSources.has(url)) continue;
      currentSources.add(url);
      const item = await saveImage(product, url, current.length + 1, {
        name: bestStore.sourceName,
        url: bestStore.sourceUrl,
        contributor: bestStore.contributor,
        license: bestStore.license,
      });
      if (item) current.push(item);
    }
  }

  if (product.imageSource?.name === 'Open Beauty Facts') {
    const code = product.imageSource.url.match(/\/product\/(\d+)/)?.[1] || product.barcode;
    if (code) {
      try {
        const fields = 'code,product_name,brands,images,selected_images,image_front_url';
        const url = `https://world.openbeautyfacts.org/api/v2/product/${code}?fields=${fields}`;
        const response = await fetch(url, { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(10000) });
        const json = await response.json();
        const productData = json.product;
        const selected = productData?.selected_images || {};
        const imageSources = [];
        for (const [kind, sizes] of Object.entries(selected)) {
          if (kind === 'front') continue;
          for (const [language, imageUrl] of Object.entries(sizes?.display || {})) {
            imageSources.push({ kind, language, imageUrl });
          }
        }
        for (const selectedImage of imageSources.slice(0, 2)) {
          if (currentSources.has(selectedImage.imageUrl)) continue;
          currentSources.add(selectedImage.imageUrl);
          const selectedImageKey = `${selectedImage.kind}_${selectedImage.language}`;
          const rawImageId = productData?.images?.[selectedImageKey]?.imgid;
          const photoContributor = productData?.images?.[String(rawImageId)]?.uploader;
          const item = await saveImage(product, selectedImage.imageUrl, current.length + 1, {
            name: 'Open Beauty Facts',
            url: product.imageSource.url,
            contributor: photoContributor || 'Open Beauty Facts contributors',
            license: 'CC BY-SA',
          });
          if (item) current.push(item);
        }
      } catch (error) {
        console.warn(`Could not load Open Beauty Facts gallery for ${product.id}: ${error.message}`);
      }
    }
  }

  product.imageGallery = current;
  if (current.length) {
    productsWithGalleries++;
    imageCount += current.length;
  }
  console.log(`${product.id}: ${current.length} additional product photo${current.length === 1 ? '' : 's'}`);
}

await fs.writeFile(productFile, `${JSON.stringify(products, null, 2)}\n`, 'utf8');
console.log(`\nAdded ${imageCount} additional photos across ${productsWithGalleries} product galleries.`);
