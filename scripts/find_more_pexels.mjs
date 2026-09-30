import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function findMorePhotos() {
  console.log('Launching browser to find real skincare photos on Pexels...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');

  const searches = [
    { query: 'skincare', tag: 'skincare_general' },
    { query: 'serum dropper', tag: 'serum_dropper' },
    { query: 'facial cream', tag: 'cream' },
    { query: 'woman face skin', tag: 'face_skin' },
    { query: 'cosmetics flatlay', tag: 'flatlay' }
  ];

  const allItems = [];

  for (const s of searches) {
    console.log(`Searching Pexels for "${s.query}"...`);
    await page.goto(`https://www.pexels.com/search/${encodeURIComponent(s.query)}/`, {
      waitUntil: 'networkidle2',
      timeout: 30000
    }).catch(() => {});

    // Scroll down to load images
    await page.evaluate(() => window.scrollBy(0, 1000));
    await new Promise(r => setTimeout(r, 2000));

    const photos = await page.evaluate((tag) => {
      const list = [];
      const links = Array.from(document.querySelectorAll('a[href*="/photo/"]'));
      
      for (const link of links) {
        const img = link.querySelector('img');
        if (img && img.src && img.src.includes('pexels.com/photos/')) {
          const match = img.src.match(/photos\/(\d+)\//);
          if (match) {
            const id = match[1];
            const alt = img.alt || '';
            list.push({
              id,
              tag,
              alt,
              pageUrl: 'https://www.pexels.com' + link.getAttribute('href'),
              imgUrl: `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1600`,
            });
          }
        }
      }
      // Deduplicate by id
      const unique = [];
      const seen = new Set();
      for (const item of list) {
        if (!seen.has(item.id)) {
          seen.add(item.id);
          unique.push(item);
        }
      }
      return unique.slice(0, 8);
    }, s.tag);

    console.log(`Found ${photos.length} unique photos for "${s.query}"`);
    allItems.push(...photos);
  }

  await browser.close();
  fs.writeFileSync('c:\\Users\\vaiss\\Cosmic\\scripts\\pexels_skincare_candidates.json', JSON.stringify(allItems, null, 2));
  console.log(`Saved ${allItems.length} candidates.`);
}

findMorePhotos().catch(console.error);
