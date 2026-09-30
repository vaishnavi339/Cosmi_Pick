import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const productsPath = path.join(root, 'src/data/products.json');
const imagesDir = path.join(root, 'public/images/products');
const products = JSON.parse(await fs.readFile(productsPath, 'utf8'));
const existingObf = JSON.parse(await fs.readFile(path.join(root, 'data/obf-cache.json'), 'utf8'));

const brandStores = {
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

const manuallyVerified = {
  'ord-01': {
    name: 'Hyaluronic Acid 2% + B5',
    imageUrl: 'https://images.openbeautyfacts.org/images/products/076/991/523/3506/front_en.8.400.jpg',
    sourceUrl: 'https://world.openbeautyfacts.org/product/0769915233506/hyaluronic-acid-2-b5-the-ordinary',
    contributor: 'smoothie-app', source: 'Open Beauty Facts', license: 'CC BY-SA',
  },
  'ord-02': {
    name: 'Azelaic Acid Suspension 10%',
    imageUrl: 'https://hencevision.com/cdn/shop/files/img_scz102-5.jpg?v=1693621435',
    sourceUrl: 'https://hencevision.com/ja/products/scz102',
    contributor: 'Hencevision', source: 'Hencevision', license: 'Retailer product image',
  },
  'min-05': {
    name: 'Granactive Retinoid 2% Anti-Aging Serum',
    imageUrl: 'https://cdn01.pharmeasy.in/dam/products_otc/P23485/minimalist-retinoid-2-anti-aging-serum-emulsion-for-wrinkles-fine-lines-30ml-6.1-1627895203.jpg',
    sourceUrl: 'https://pharmeasy.in/health-care/products/minimalist-retinoid-2-anti-aging-serum-emulsion-for-wrinkles-fine-lines-30ml--3514855',
    contributor: 'PharmEasy', source: 'PharmEasy', license: 'Retailer product image',
  },
  'cet-02': {
    name: 'Cetaphil moisturizing cream',
    imageUrl: 'https://images.openbeautyfacts.org/images/products/349/932/000/5678/front_fr.3.400.jpg',
    sourceUrl: 'https://world.openbeautyfacts.org/product/3499320005678',
    contributor: 'Open Beauty Facts contributors', source: 'Open Beauty Facts', license: 'CC BY-SA',
  },
  'dnk-01': {
    name: 'Watermelon Cooling Sunscreen SPF 50+',
    imageUrl: 'https://cdn.shopify.com/s/files/1/0361/8553/8692/files/1-80G_bb347e61-11ee-4d8b-ad8e-4e3602e69164.jpg?v=1790680752',
    sourceUrl: 'https://www.dotandkey.com/products/watermelon-cooling-spf-50-face-sunscreen',
    contributor: 'Dot & Key', source: 'Dot & Key official product catalog', license: 'Brand product image',
  },
  'dnk-02': {
    name: 'Cica Calming Night Gel',
    imageUrl: 'https://cdn.shopify.com/s/files/1/0361/8553/8692/files/1_075c2747-6b39-4135-9da9-07001a430971.jpg?v=1778925428',
    sourceUrl: 'https://www.dotandkey.com/products/cica-calming-skin-renewing-night-gel',
    contributor: 'Dot & Key', source: 'Dot & Key official product catalog', license: 'Brand product image',
  },
  'cet-01': {
    name: 'Gentle Skin Cleanser',
    imageUrl: 'https://images.openbeautyfacts.org/images/products/349/932/001/5431/front_en.8.400.jpg',
    sourceUrl: 'https://world.openbeautyfacts.org/product/3499320015431',
    contributor: 'Open Beauty Facts contributors', source: 'Open Beauty Facts', license: 'CC BY-SA',
  },
  'lrp-01': {
    name: 'Cicaplast Baume B5+',
    imageUrl: 'https://images.openbeautyfacts.org/images/products/333/787/581/6847/front_fr.12.400.jpg',
    sourceUrl: 'https://world.openbeautyfacts.org/product/3337875816847',
    contributor: 'Open Beauty Facts contributors', source: 'Open Beauty Facts', license: 'CC BY-SA',
  },
  'lrp-02': {
    name: 'Effaclar Duo+',
    imageUrl: 'https://images.openbeautyfacts.org/images/products/333/787/586/3377/front_fr.3.400.jpg',
    sourceUrl: 'https://world.openbeautyfacts.org/product/3337875863377',
    contributor: 'Open Beauty Facts contributors', source: 'Open Beauty Facts', license: 'CC BY-SA',
  },
  'pc-02': {
    name: 'C15 Super Booster',
    imageUrl: 'https://cdn.shopify.com/s/files/1/0709/4118/0185/products/SKU7770.png?v=1674009356',
    sourceUrl: 'https://www.paulaschoice.in/products/resist-c15-super-booster',
    contributor: "Paula's Choice", source: "Paula's Choice official product catalog", license: 'Brand product image',
  },
  'boj-01': {
    name: 'Relief Sun : Rice + Probiotics SPF50+ PA++++',
    imageUrl: 'https://cdn.shopify.com/s/files/1/0558/4135/7989/files/01_0805__-_EU_UK.jpg?v=1787280568',
    sourceUrl: 'https://beautyofjoseon.com/products/relief-sun-rice-probiotics',
    contributor: 'Beauty of Joseon', source: 'Beauty of Joseon official product catalog', license: 'Brand product image',
  },
  'lan-01': {
    name: 'Water Bank Blue Hyaluronic Cream',
    imageUrl: 'https://images.openbeautyfacts.org/images/products/880/992/513/6649/front_fr.11.400.jpg',
    sourceUrl: 'https://world.openbeautyfacts.org/product/8809925136649',
    contributor: 'Open Beauty Facts contributors', source: 'Open Beauty Facts', license: 'CC BY-SA',
  },
  'lan-02': {
    name: 'Laneige Lip sleeping mask',
    imageUrl: 'https://images.openbeautyfacts.org/images/products/880/964/305/3273/front_en.4.400.jpg',
    sourceUrl: 'https://world.openbeautyfacts.org/product/8809643053273',
    contributor: 'Open Beauty Facts contributors', source: 'Open Beauty Facts', license: 'CC BY-SA',
  },
  'smp-02': {
    name: 'Simple Water Boost Hydrating Gel Cream',
    imageUrl: 'https://cdn.mafrservices.com/sys-master-root/h26/h61/16147919994910/1601226_main.jpg',
    sourceUrl: 'https://www.carrefouruae.com/mafuae/en/gels-lotions/simple-waterbost-hydrtng-gel-50ml/p/1601226',
    contributor: 'Carrefour', source: 'Carrefour product catalog', license: 'Retailer product image',
  },
  'drs-01': {
    name: "Dr. Sheth's Centella & 10% Niacinamide Ampoule Serum",
    imageUrl: 'https://images-static.nykaa.com/media/catalog/product/5/a/5a8377b8906148702092_1.jpg',
    sourceUrl: 'https://www.nykaa.com/dr-sheth-s-centella-10percent-niacinamide-ampoule-serum/p/22343578',
    contributor: 'Nykaa', source: 'Nykaa product catalog', license: 'Retailer product image',
  },
  'drs-02': {
    name: 'Kesar and 2% Kojic Acid Ampoule Serum - 30ml',
    imageUrl: 'https://cdn.shopify.com/s/files/1/0490/6011/8686/files/1_Website.jpg?v=1746015642',
    sourceUrl: 'https://drsheths.com/products/kesar-kojic-acid-serum-30ml',
    contributor: "Dr. Sheth's", source: "Dr. Sheth's official product catalog", license: 'Brand product image',
  },
  'fox-01': {
    name: 'Foxtale Dewy Finish Sunscreen SPF 70 PA++++',
    imageUrl: 'https://cdn.tirabeauty.com/v2/billowing-snowflake-434234/tira-p/wrkr/products/pictures/item/free/resize-w%3A1080/1132048/l3cxuSouz-1132048-1.jpg',
    sourceUrl: 'https://www.tirabeauty.com/product/foxtale-coverup-spf-50-broad-spectrum-dewy-sunscreen-50ml-7579043',
    contributor: 'Tira', source: 'Tira product catalog', license: 'Retailer product image',
  },
  'fox-02': {
    name: 'Foxtale 15% Vitamin C Face Serum',
    imageUrl: 'https://cdn.shopify.com/s/files/1/0609/6096/4855/files/VIT_C_0659240f-5236-4ec0-9291-8f75da0552d9.png?v=1775542663',
    sourceUrl: 'https://foxtale.in/products/c-for-yourself-vitamin-c-serum',
    contributor: 'Foxtale', source: 'Foxtale official product catalog', license: 'Brand product image',
  },
  'bio-01': {
    name: 'Bioré UV Aqua Rich Watery Essence SPF 50+',
    imageUrl: 'https://digitalcontent.api.tesco.com/v2/media/ghs/f5d1c3b5-11a9-4d9a-8a18-9e222453699b/6fd56897-f00b-4439-a329-afdfb9d81550_1307735694.jpeg',
    sourceUrl: 'https://www.tesco.com/groceries/en-GB/products/320570359',
    contributor: 'Tesco', source: 'Tesco product catalog', license: 'Retailer product image',
  },
};

const excludedWords = new Set(['the','and','with','for','face','facial','skin','daily','new','ml','g','spf','pa','plus','of','in','a','an','to','by','size','oz']);
const tokens = (s) => (s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').match(/[a-z0-9]+/g) || []).filter(w => w.length > 1 && !excludedWords.has(w));
const similarity = (a, b) => {
  const left = new Set(tokens(a));
  const right = new Set(tokens(b));
  if (!left.size || !right.size) return 0;
  let overlap = 0;
  for (const word of left) if (right.has(word)) overlap++;
  return (2 * overlap) / (left.size + right.size);
};
const safeSegment = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const storeCatalogs = {};
await Promise.all(Object.entries(brandStores).map(async ([brand, endpoint]) => {
  try {
    const response = await fetch(endpoint, { headers: { accept: 'application/json' } });
    if (!response.ok) return;
    const json = await response.json();
    const host = new URL(endpoint).hostname;
    storeCatalogs[brand] = (json.products || []).flatMap((entry) => {
      const image = entry.images?.[0];
      const imageUrl = typeof image === 'string' ? image : image?.src;
      if (!entry.title || !imageUrl) return [];
      return [{
        title: entry.title,
        imageUrl,
        sourceUrl: `https://${host}/products/${entry.handle}`,
        contributor: brand,
        source: `${brand} official product catalog`,
        license: 'Brand product image',
        score: similarity(entry.title, ''),
      }];
    });
    console.log(`Loaded ${storeCatalogs[brand].length} images from ${brand}.`);
  } catch (error) {
    console.warn(`Could not load ${brand} catalog: ${error.message}`);
  }
}));

const mimeExtensions = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
};
await fs.mkdir(imagesDir, { recursive: true });
let added = 0;
const missing = [];

for (const product of products) {
  if (product.image?.startsWith('/images/products/')) {
    try {
      await fs.access(path.join(root, 'public', product.image.replace(/^\//, '')));
      continue;
    } catch {
      // Regenerate entries whose local asset is missing.
    }
  }

  const brandKey = `brand:::${safeSegment(product.brand)}`;
  const obfCandidates = (existingObf[brandKey] || []).filter(candidate => candidate.image_front_url || candidate.image_url).map(candidate => ({
    title: candidate.product_name || candidate.product_name_en || '',
    imageUrl: candidate.image_front_url || candidate.image_url,
    sourceUrl: candidate.url || `https://world.openbeautyfacts.org/product/${candidate.code}`,
    contributor: candidate.creator || 'Open Beauty Facts contributors',
    source: 'Open Beauty Facts',
    license: 'CC BY-SA',
  })).filter(candidate => candidate.title && candidate.imageUrl);
  const shopCandidates = storeCatalogs[product.brand] || [];
  const candidates = [...shopCandidates, ...obfCandidates]
    .map(candidate => ({ ...candidate, score: similarity(product.name, candidate.title) }))
    .sort((a, b) => b.score - a.score);
  const candidate = manuallyVerified[product.id] || candidates.find(item => item.score >= 0.78);

  if (!candidate) {
    missing.push(`${product.brand} — ${product.name}`);
    continue;
  }

  try {
    const response = await fetch(candidate.imageUrl, {
      headers: { 'User-Agent': 'CosmicPick/1.0 product image catalog' },
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) throw new Error(`image request returned ${response.status}`);
    const contentType = (response.headers.get('content-type') || '').split(';')[0].toLowerCase();
    const extension = mimeExtensions[contentType];
    if (!extension) throw new Error(`unsupported image content type: ${contentType || 'unknown'}`);
    const bytes = Buffer.from(await response.arrayBuffer());
    if (bytes.length < 1000 || bytes.length > 12 * 1024 * 1024) throw new Error(`unexpected image size: ${bytes.length} bytes`);

    const filename = `${product.id}.${extension}`;
    await fs.writeFile(path.join(imagesDir, filename), bytes);
    product.image = `/images/products/${filename}`;
    product.imageSource = {
      name: candidate.source,
      url: candidate.sourceUrl,
      license: candidate.license,
      contributor: candidate.contributor,
    };
    added++;
    console.log(`Added ${product.id}: ${candidate.title} (${candidate.source})`);
  } catch (error) {
    missing.push(`${product.brand} — ${product.name}: ${error.message}`);
  }
}

await fs.writeFile(productsPath, `${JSON.stringify(products, null, 2)}\n`, 'utf8');
console.log(`\nAdded ${added} product photos for ${products.length} catalog products.`);
if (missing.length) console.log(`Needs an image source (${missing.length}):\n${missing.join('\n')}`);
