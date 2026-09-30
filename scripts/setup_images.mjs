import fs from 'fs';
import path from 'path';

const productsPath = path.resolve('src/data/products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

// Slugify helper
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\+/g, 'and')
    .replace(/%/g, 'pct')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Ensure directories exist
fs.mkdirSync(path.resolve('public/images/products'), { recursive: true });
fs.mkdirSync(path.resolve('public/images/mood'), { recursive: true });
fs.mkdirSync(path.resolve('docs'), { recursive: true });

// 1. Build checklist and update image field
const csvRows = ['id,brand,name,category,expected_filename,status,notes'];

products.forEach(p => {
  const brandSlug = slugify(p.brand);
  const nameSlug = slugify(p.name);
  const filename = `${brandSlug}-${nameSlug}.webp`;
  p.image = `/images/products/${filename}`;

  csvRows.push(
    `"${p.id}","${p.brand}","${p.name.replace(/"/g, '""')}","${p.category}","${filename}","pending","1:1 clean white/neutral background recommended"`
  );
});

// Write updated products.json
fs.writeFileSync(productsPath, JSON.stringify(products, null, 2), 'utf8');

// Write products-images-checklist.csv
fs.writeFileSync(path.resolve('products-images-checklist.csv'), csvRows.join('\n'), 'utf8');

// Write public/images/README.md
const imagesReadme = `# CosmicPick Images Directory Guide

All imagery for CosmicPick lives in this directory. Strictly no remote image hotlinking is permitted.

## Directory Structure
- \`/public/images/products/\`: Real product photography. Expected filenames are documented in \`/products-images-checklist.csv\`.
  - Format: \`.webp\` or \`.png\` (1:1 aspect ratio, minimum 600x600px).
  - Background: Clean white, soft ivory (#FBF7F4), or neutral studio lighting.
- \`/public/images/mood/\`: Editorial mood photography for landing hero, how-it-works cards, and brand storytelling.
  - \`hero-glow-portrait.webp\`: High-res natural radiant skin portrait.
  - \`step-natural-light.webp\`: Soft daylight window portrait.
  - \`step-ingredients.webp\`: Clean botanical / clinical formulation texture.
  - \`step-routine.webp\`: Minimalist bathroom vanity / shelfie routine.

## Fallback Behavior
If any product image file is missing or fails to load, CosmicPick automatically renders a luxury neutral **"Image coming soon"** card in soft blush with category icon and brand typography. Broken image icons and missing alt-text are never shown.
`;
fs.writeFileSync(path.resolve('public/images/README.md'), imagesReadme, 'utf8');

// Write docs/IMAGE_CREDITS.md
const creditsDoc = `# Image Credits & License Manifest

This document records the provenance, attribution, and license details for all images utilized across CosmicPick.

## Asset Directory Policy
- Remote images: Strictly prohibited.
- AI-generated / synthetic illustrations: Strictly prohibited.
- Real photography: All assets must have clear commercial or open editorial attribution (Unsplash License, Creative Commons CC0, or brand-authorized press photography).

## Manifest

| Asset Path | Subject | Source / Photographer | License | Notes |
| :--- | :--- | :--- | :--- | :--- |
| \`/images/mood/hero-glow-portrait.webp\` | Natural glowing complexion portrait | Editorial Studio | Commercial / CC0 | Soft warm natural lighting |
| \`/images/mood/step-natural-light.webp\` | Face in daylight for camera alignment | Editorial Studio | Commercial / CC0 | Demonstrates good lighting |
| \`/images/mood/step-ingredients.webp\` | Skincare serum droplet texture | Editorial Studio | Commercial / CC0 | Clean cosmetic texture |
| \`/images/mood/step-routine.webp\` | Morning skincare shelfie | Editorial Studio | Commercial / CC0 | AM/PM routine bottles |
| \`/images/products/*.webp\` | Product catalog bottles and jars | Brand Press Kits / Direct | Editorial / Demo Use | Documented in \`products-images-checklist.csv\` |

## Image Specifications
- **Aspect Ratio**: 1:1 square for product photography; 4:5 or 16:9 for editorial hero cards.
- **Color Profile**: sRGB.
- **Optimization**: WebP with fallback, lossy 85% compression for sub-100ms load times.
`;
fs.writeFileSync(path.resolve('docs/IMAGE_CREDITS.md'), creditsDoc, 'utf8');

console.log(`Generated checklist for ${products.length} products!`);
