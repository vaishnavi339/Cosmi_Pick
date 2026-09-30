import fs from 'fs';
import path from 'path';

const MOOD_DIR = 'c:\\Users\\vaiss\\Cosmic\\public\\images\\mood';

const mappings = [
  { from: 'unsplash-serums-leaves-flatlay.webp', to: 'hero-skincare-wide.webp' },
  { from: 'candidate-hero-woman-serum-33794143.webp', to: 'hero-woman-applying.webp' },
  { from: 'candidate-face-daylight-34615418.webp', to: 'step-01-daylight-scan.webp' },
  { from: 'unsplash-serum-dropper-pouring.webp', to: 'step-02-dropper-rules.webp' },
  { from: 'unsplash-ordinary-routine-petals.webp', to: 'step-03-routine-picks.webp' },
  { from: 'candidate-flatlay-jars-leaves-6690234.webp', to: 'ingredients-flatlay.webp' },
  { from: 'unsplash-cream-smear-beige.webp', to: 'texture-closeup.webp' }
];

for (const m of mappings) {
  const src = path.join(MOOD_DIR, m.from);
  const dst = path.join(MOOD_DIR, m.to);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dst);
    console.log(`Copied ${m.from} -> ${m.to}`);
  }
}

// Clean up temporary files in MOOD_DIR
const finalFiles = new Set(mappings.map(m => m.to));
const allFiles = fs.readdirSync(MOOD_DIR);
for (const f of allFiles) {
  if (!finalFiles.has(f)) {
    fs.unlinkSync(path.join(MOOD_DIR, f));
    console.log(`Cleaned up temporary: ${f}`);
  }
}

console.log('Final mood directory contents:', fs.readdirSync(MOOD_DIR));
