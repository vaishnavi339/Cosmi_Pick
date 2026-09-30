import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import https from 'https';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const MOOD_DIR = 'c:\\Users\\vaiss\\Cosmic\\public\\images\\mood';

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed ${url}: ${res.statusCode}`));
      }
      const stream = fs.createWriteStream(dest);
      res.pipe(stream);
      stream.on('finish', () => stream.close(resolve));
    }).on('error', reject);
  });
}

async function scrapeAssets() {
  console.log('Scraping high quality assets from Pexels...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');

  const targets = [
    { search: 'cream-texture', url: 'https://www.pexels.com/search/cream%20texture/', tag: 'texture' },
    { search: 'skincare-flatlay', url: 'https://www.pexels.com/search/skincare%20flatlay/', tag: 'flatlay' },
    { search: 'skincare-serum', url: 'https://www.pexels.com/search/skincare%20serum/', tag: 'serum' },
    { search: 'natural-beauty-face', url: 'https://www.pexels.com/search/natural%20beauty%20face/', tag: 'face' },
  ];

  const harvested = [];

  for (const t of targets) {
    console.log(`Navigating to ${t.url}...`);
    await page.goto(t.url, { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => {});
    await page.evaluate(() => window.scrollBy(0, 800));
    await new Promise(r => setTimeout(r, 2000));

    const items = await page.evaluate((tag) => {
      const results = [];
      const links = Array.from(document.querySelectorAll('a[href*="/photo/"]'));
      for (const link of links) {
        const img = link.querySelector('img');
        if (img && img.src && img.src.includes('pexels.com/photos/')) {
          const match = img.src.match(/photos\/(\d+)\//);
          if (match) {
            results.push({
              id: match[1],
              tag,
              alt: img.alt || '',
              pageUrl: 'https://www.pexels.com' + link.getAttribute('href'),
              imgUrl: `https://images.pexels.com/photos/${match[1]}/pexels-photo-${match[1]}.jpeg?auto=compress&cs=tinysrgb&w=1600`,
            });
          }
        }
      }
      return results.slice(0, 5);
    }, t.tag);

    console.log(`Harvested ${items.length} items for ${t.tag}`);
    harvested.push(...items);
  }

  // Also search for short skincare videos
  console.log('Searching for short skincare videos...');
  await page.goto('https://www.pexels.com/search/videos/skincare/', { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => {});
  await new Promise(r => setTimeout(r, 2500));

  const videos = await page.evaluate(() => {
    const list = [];
    const videoElements = Array.from(document.querySelectorAll('a[href*="/video/"]'));
    for (const el of videoElements) {
      const video = el.querySelector('video source');
      const img = el.querySelector('img');
      if (video && video.src) {
        list.push({
          pageUrl: 'https://www.pexels.com' + el.getAttribute('href'),
          videoSrc: video.src,
          poster: img ? img.src : '',
        });
      }
    }
    return list.slice(0, 3);
  });

  console.log(`Found ${videos.length} videos`);
  await browser.close();

  fs.writeFileSync('c:\\Users\\vaiss\\Cosmic\\scripts\\harvested_assets.json', JSON.stringify({ photos: harvested, videos }, null, 2));
}

scrapeAssets().catch(console.error);
