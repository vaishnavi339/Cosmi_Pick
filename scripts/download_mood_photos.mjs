import fs from 'fs';
import path from 'path';
import https from 'https';

const MOOD_DIR = 'c:\\Users\\vaiss\\Cosmic\\public\\images\\mood';

const candidates = [
  {
    filename: 'hero-skincare-wide.webp',
    url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1920&q=80&fm=webp',
    photographer: 'Content Pixie',
    profileUrl: 'https://unsplash.com/@contentpixie',
    unsplashUrl: 'https://unsplash.com/photos/1556228720-195a672e8a03',
    description: 'Wide calm bright skincare scene with serum bottle and dropper on neutral marble',
  },
  {
    filename: 'hero-woman-glow.webp',
    url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1920&q=80&fm=webp',
    photographer: 'Aiony Haust',
    profileUrl: 'https://unsplash.com/@aiony',
    unsplashUrl: 'https://unsplash.com/photos/1570172619644-dfd03ed5d881',
    description: 'Woman with radiant, glowing skin applying serum in soft natural morning light',
  },
  {
    filename: 'step-01-scan-daylight.webp',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80&fm=webp',
    photographer: 'Christian Buehner',
    profileUrl: 'https://unsplash.com/@christianbuehner',
    unsplashUrl: 'https://unsplash.com/photos/1544005313-94ddf0286df2',
    description: 'Clean natural face in daylight demonstrating optical scan alignment',
  },
  {
    filename: 'step-02-custom-rules.webp',
    url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80&fm=webp',
    photographer: 'Deanna Alys',
    profileUrl: 'https://unsplash.com/@deannaalys',
    unsplashUrl: 'https://unsplash.com/photos/1620916566398-39f1143ab7be',
    description: 'Minimalist serum dropper bottle highlighting precise formulation actives',
  },
  {
    filename: 'step-03-routine-picks.webp',
    url: 'https://images.unsplash.com/photo-1556228722-d0b71e16f396?auto=format&fit=crop&w=800&q=80&fm=webp',
    photographer: 'Content Pixie',
    profileUrl: 'https://unsplash.com/@contentpixie',
    unsplashUrl: 'https://unsplash.com/photos/1556228722-d0b71e16f396',
    description: 'Curated skincare routine bottles arranged in clean morning light',
  },
  {
    filename: 'ingredients-flatlay.webp',
    url: 'https://images.unsplash.com/photo-1608248545938-1636b048590c?auto=format&fit=crop&w=1200&q=80&fm=webp',
    photographer: 'Kari Shea',
    profileUrl: 'https://unsplash.com/@karishea',
    unsplashUrl: 'https://unsplash.com/photos/1608248545938-1636b048590c',
    description: 'Botanical ingredients flat-lay with clean cosmetic oils and fresh botanicals',
  },
  {
    filename: 'texture-closeup.webp',
    url: 'https://images.unsplash.com/photo-1570554886111-e80fcca6a029?auto=format&fit=crop&w=1400&q=80&fm=webp',
    photographer: 'Sarah Chai',
    profileUrl: 'https://unsplash.com/@sarahchai',
    unsplashUrl: 'https://unsplash.com/photos/1570554886111-e80fcca6a029',
    description: 'Macro detail of whipped velvety moisturizer cream texture',
  },
];

async function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to download ${url}: status ${res.statusCode}`));
      }
      const fileStream = fs.createWriteStream(dest);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close(resolve);
      });
    }).on('error', reject);
  });
}

async function main() {
  if (!fs.existsSync(MOOD_DIR)) {
    fs.mkdirSync(MOOD_DIR, { recursive: true });
  }

  for (const item of candidates) {
    const dest = path.join(MOOD_DIR, item.filename);
    console.log(`Downloading ${item.filename} from Unsplash...`);
    try {
      await download(item.url, dest);
      const stats = fs.statSync(dest);
      console.log(`✓ Saved ${item.filename} (${Math.round(stats.size / 1024)} KB)`);
    } catch (err) {
      console.error(`✗ Error downloading ${item.filename}:`, err.message);
    }
  }
}

main();
