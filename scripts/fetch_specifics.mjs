import puppeteer from 'puppeteer-core';
import fs from 'fs';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function fetchSpecifics() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');

  const queries = [
    { name: 'face_portrait', url: 'https://www.pexels.com/search/woman%20face%20natural%20skin%20daylight/' },
    { name: 'cream_swatch', url: 'https://www.pexels.com/search/cream%20swatch/' },
    { name: 'skincare_bottles', url: 'https://www.pexels.com/search/skincare%20bottles/' },
  ];

  const results = {};

  for (const q of queries) {
    console.log(`Searching Pexels for ${q.name}...`);
    await page.goto(q.url, { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => {});
    await page.evaluate(() => window.scrollBy(0, 1000));
    await new Promise(r => setTimeout(r, 2000));

    const photos = await page.evaluate(() => {
      const items = [];
      const links = Array.from(document.querySelectorAll('a[href*="/photo/"]'));
      for (const link of links) {
        const img = link.querySelector('img');
        if (img && img.src && img.src.includes('pexels.com/photos/')) {
          const match = img.src.match(/photos\/(\d+)\//);
          if (match) {
            items.push({
              id: match[1],
              alt: img.alt || '',
              pageUrl: 'https://www.pexels.com' + link.getAttribute('href'),
              imgUrl: `https://images.pexels.com/photos/${match[1]}/pexels-photo-${match[1]}.jpeg?auto=compress&cs=tinysrgb&w=1600`,
            });
          }
        }
      }
      return items.slice(0, 6);
    });

    results[q.name] = photos;
    console.log(`Found ${photos.length} for ${q.name}`);
  }

  await browser.close();
  fs.writeFileSync('c:\\Users\\vaiss\\Cosmic\\scripts\\specific_candidates.json', JSON.stringify(results, null, 2));
}

fetchSpecifics().catch(console.error);
