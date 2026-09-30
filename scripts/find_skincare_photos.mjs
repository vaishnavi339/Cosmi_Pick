import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import https from 'https';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const MOOD_DIR = 'c:\\Users\\vaiss\\Cosmic\\public\\images\\mood';

async function download(url, dest) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith('https') ? https : http;
    proto.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Status ${res.statusCode}`));
      }
      const stream = fs.createWriteStream(dest);
      res.pipe(stream);
      stream.on('finish', () => stream.close(resolve));
    }).on('error', reject);
  });
}

async function findPhotos() {
  console.log('Launching browser to find real skincare photos...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1600,1000'],
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');

  // Search terms to find:
  // 1. "skincare serum dropper"
  // 2. "face wash water splash" or "clean skin portrait daylight"
  // 3. "skincare flatlay botanicals"
  // 4. "skincare cream texture"
  
  const searchQueries = [
    { query: 'skincare serum dropper', category: 'hero_or_dropper' },
    { query: 'skincare cream texture', category: 'texture' },
    { query: 'skincare flatlay', category: 'flatlay' },
    { query: 'skincare routine bottles', category: 'routine' },
    { query: 'woman applying serum skincare face', category: 'face' }
  ];

  const results = [];

  for (const item of searchQueries) {
    console.log(`Searching Pexels for "${item.query}"...`);
    const searchUrl = `https://www.pexels.com/search/${encodeURIComponent(item.query)}/`;
    await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000));

    const photos = await page.evaluate((category) => {
      const items = [];
      const cards = document.querySelectorAll('article, [data-testid="item"], a[href^="/photo/"]');
      
      cards.forEach(card => {
        const img = card.querySelector('img');
        const link = card.tagName === 'A' ? card : card.querySelector('a[href^="/photo/"]');
        if (img && img.src && img.src.includes('pexels.com/photos/')) {
          const photographer = img.alt ? img.alt.replace(/.*photo by\s*/i, '').trim() : 'Pexels Contributor';
          // Clean base URL to get high-res webp
          const baseSrc = img.src.split('?')[0];
          items.push({
            category,
            alt: img.alt || '',
            photographer,
            pageUrl: link ? 'https://www.pexels.com' + link.getAttribute('href') : '',
            imgUrl: `${baseSrc}?auto=compress&cs=tinysrgb&w=1600`,
          });
        }
      });
      return items.slice(0, 4);
    }, item.category);

    console.log(`Found ${photos.length} photos for ${item.category}`);
    results.push(...photos);
  }

  await browser.close();
  console.log('Total photos found:', results.length);
  fs.writeFileSync('c:\\Users\\vaiss\\Cosmic\\scripts\\found_photos.json', JSON.stringify(results, null, 2));
}

findPhotos().catch(console.error);
