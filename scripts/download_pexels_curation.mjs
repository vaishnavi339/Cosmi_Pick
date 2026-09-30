import fs from 'fs';
import path from 'path';
import https from 'https';

const MOOD_DIR = 'c:\\Users\\vaiss\\Cosmic\\public\\images\\mood';

const list = [
  {
    name: 'candidate-hero-serum-dropper-4735937.webp',
    url: 'https://images.pexels.com/photos/4735937/pexels-photo-4735937.jpeg?auto=compress&cs=tinysrgb&w=1920',
    photographer: 'Karolina Grabowska',
    pageUrl: 'https://www.pexels.com/photo/person-holding-clear-glass-dropper-bottle-4735937/'
  },
  {
    name: 'candidate-hero-woman-serum-33794143.webp',
    url: 'https://images.pexels.com/photos/33794143/pexels-photo-33794143.jpeg?auto=compress&cs=tinysrgb&w=1920',
    photographer: 'Pexels Contributor',
    pageUrl: 'https://www.pexels.com/photo/close-up-of-woman-applying-serum-to-face-33794143/'
  },
  {
    name: 'candidate-flatlay-jars-leaves-6690234.webp',
    url: 'https://images.pexels.com/photos/6690234/pexels-photo-6690234.jpeg?auto=compress&cs=tinysrgb&w=1600',
    photographer: 'Pexels Contributor',
    pageUrl: 'https://www.pexels.com/photo/top-view-of-cream-jars-6690234/'
  },
  {
    name: 'candidate-face-daylight-34615418.webp',
    url: 'https://images.pexels.com/photos/34615418/pexels-photo-34615418.jpeg?auto=compress&cs=tinysrgb&w=1200',
    photographer: 'Pexels Contributor',
    pageUrl: 'https://www.pexels.com/photo/close-up-portrait-of-a-young-woman-s-face-34615418/'
  },
  {
    name: 'candidate-serum-green-bottle-7321710.webp',
    url: 'https://images.pexels.com/photos/7321710/pexels-photo-7321710.jpeg?auto=compress&cs=tinysrgb&w=1200',
    photographer: 'Pexels Contributor',
    pageUrl: 'https://www.pexels.com/photo/colored-liquid-in-serum-bottle-7321710/'
  },
  {
    name: 'candidate-hand-cream-7020247.webp',
    url: 'https://images.pexels.com/photos/7020247/pexels-photo-7020247.jpeg?auto=compress&cs=tinysrgb&w=1200',
    photographer: 'Pexels Contributor',
    pageUrl: 'https://www.pexels.com/photo/applying-of-cream-on-hands-7020247/'
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
    const dest = path.join(MOOD_DIR, item.name);
    console.log(`Downloading ${item.name}...`);
    try {
      await download(item.url, dest);
      const sz = fs.statSync(dest).size;
      console.log(`✓ Saved ${item.name} (${Math.round(sz / 1024)} KB)`);
    } catch (e) {
      console.error(`✗ Error: ${e.message}`);
    }
  }
}

run();
