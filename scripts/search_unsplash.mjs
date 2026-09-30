import puppeteer from 'puppeteer-core';
import fs from 'fs';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function searchUnsplash() {
  console.log('Searching Unsplash with Edge browser...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');

  const searches = [
    { name: 'serum_dropper', url: 'https://unsplash.com/s/photos/serum-dropper' },
    { name: 'cream_texture', url: 'https://unsplash.com/s/photos/skincare-texture' },
    { name: 'skincare_routine', url: 'https://unsplash.com/s/photos/skincare-bottles' },
    { name: 'skincare_hero', url: 'https://unsplash.com/s/photos/skincare-aesthetic' }
  ];

  const results = {};

  for (const s of searches) {
    console.log(`Navigating to ${s.url}...`);
    try {
      await page.goto(s.url, { waitUntil: 'networkidle2', timeout: 30000 });
      await page.evaluate(() => window.scrollBy(0, 1000));
      await new Promise(r => setTimeout(r, 2500));

      const photos = await page.evaluate(() => {
        const items = [];
        const imgs = Array.from(document.querySelectorAll('figure img, [data-test="photo-grid-masonry-img"]'));
        for (const img of imgs) {
          if (img.src && img.src.includes('images.unsplash.com/photo-')) {
            const match = img.src.match(/photo-([a-zA-Z0-9_-]+)/);
            if (match) {
              const photoId = match[0];
              const alt = img.alt || '';
              // find photographer from parent links
              let photographer = 'Unsplash Contributor';
              const figure = img.closest('figure');
              if (figure) {
                const authorLink = figure.querySelector('a[href^="/@"]');
                if (authorLink) photographer = authorLink.textContent?.trim() || photographer;
              }
              items.push({
                photoId,
                alt,
                photographer,
                fullUrl: `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=1920&q=85&fm=webp`,
                pageUrl: `https://unsplash.com/photos/${photoId}`
              });
            }
          }
        }
        // Deduplicate
        const seen = new Set();
        return items.filter(i => {
          if (seen.has(i.photoId)) return false;
          seen.add(i.photoId);
          return true;
        }).slice(0, 5);
      });

      results[s.name] = photos;
      console.log(`Found ${photos.length} for ${s.name}`);
    } catch (e) {
      console.error(`Error on ${s.name}: ${e.message}`);
    }
  }

  await browser.close();
  fs.writeFileSync('c:\\Users\\vaiss\\Cosmic\\scripts\\unsplash_candidates.json', JSON.stringify(results, null, 2));
}

searchUnsplash().catch(console.error);
