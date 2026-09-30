import fs from 'fs';
import path from 'path';
import https from 'https';

const MOOD_DIR = 'c:\\Users\\vaiss\\Cosmic\\public\\images\\mood';

const list = [
  {
    filename: 'unsplash-ordinary-routine-petals.webp',
    url: 'https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?auto=format&fit=crop&w=1920&q=85&fm=webp',
    photographer: 'Unsplash / The Ordinary Arranged',
    pageUrl: 'https://unsplash.com/photos/photo-1580870069867-74c57ee1bb07'
  },
  {
    filename: 'unsplash-cream-smear-white.webp',
    url: 'https://images.unsplash.com/photo-1608068811588-3a67006b7489?auto=format&fit=crop&w=1600&q=85&fm=webp',
    photographer: 'Unsplash / Cream Texture',
    pageUrl: 'https://unsplash.com/photos/photo-1608068811588-3a67006b7489'
  },
  {
    filename: 'unsplash-cream-smear-beige.webp',
    url: 'https://images.unsplash.com/photo-1585945037805-5fd82c2e60b1?auto=format&fit=crop&w=1600&q=85&fm=webp',
    photographer: 'Unsplash / Beige Cream Swatch',
    pageUrl: 'https://unsplash.com/photos/photo-1585945037805-5fd82c2e60b1'
  },
  {
    filename: 'unsplash-serums-leaves-flatlay.webp',
    url: 'https://images.unsplash.com/photo-1748543669178-efd3de4e64e0?auto=format&fit=crop&w=1600&q=85&fm=webp',
    photographer: 'Unsplash / Serums & Leaves',
    pageUrl: 'https://unsplash.com/photos/photo-1748543669178-efd3de4e64e0'
  },
  {
    filename: 'unsplash-serum-dropper-pouring.webp',
    url: 'https://images.unsplash.com/photo-1747303969063-3b90bcb3942e?auto=format&fit=crop&w=1920&q=85&fm=webp',
    photographer: 'Unsplash / Serum Pouring Dropper',
    pageUrl: 'https://unsplash.com/photos/photo-1747303969063-3b90bcb3942e'
  }
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
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

async function run() {
  for (const item of list) {
    const dest = path.join(MOOD_DIR, item.filename);
    console.log(`Downloading ${item.filename}...`);
    try {
      await download(item.url, dest);
      const sz = fs.statSync(dest).size;
      console.log(`✓ Saved ${item.filename} (${Math.round(sz / 1024)} KB)`);
    } catch (e) {
      console.error(`✗ Error: ${e.message}`);
    }
  }
}

run();
