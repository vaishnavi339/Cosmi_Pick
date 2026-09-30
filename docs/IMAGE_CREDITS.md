# Image Credits & License Manifest

This document records the provenance, attribution, and license details for all photography utilized across CosmicPick. Every photo has been directly verified and inspected to ensure authentic commercial skincare relevance and zero synthetic or AI generation.

## Policy & Attribution Standards
- **Zero AI / Synthetic Art**: Strictly prohibited. All assets are genuine high-resolution photographs.
- **Licensing**: Permitted sources are Unsplash (Unsplash License) and Pexels (Pexels License), granting free commercial and non-commercial rights without mandatory attribution.
- **Local Optimization**: All assets are served locally from `/public/images/mood/` in optimized WebP format with responsive sizing and zero remote hotlinks.

## Mood & Editorial Photography Manifest

| Asset Path | Subject | Source & ID | Direct URL | License | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/images/mood/hero-skincare-wide.webp` | Calm, bright skincare scene with serum droplets & fresh botanical leaves; clean negative space | Unsplash (`photo-1748543669178-efd3de4e64e0`) | [Unsplash Photo](https://unsplash.com/photos/photo-1748543669178-efd3de4e64e0) | Unsplash Commercial License | Active Hero Background |
| `/images/mood/hero-woman-applying.webp` | Woman applying serum using a dropper to cheek in warm natural light | Pexels (`photo-33794143`) | [Pexels Photo](https://www.pexels.com/photo/close-up-of-woman-applying-serum-to-face-33794143/) | Pexels Free License | Active Hero Secondary / Fallback |
| `/images/mood/step-01-daylight-scan.webp` | Close-up of natural skin and facial contour in soft daylight | Pexels (`photo-34615418`) | [Pexels Photo](https://www.pexels.com/photo/close-up-portrait-of-a-young-woman-s-face-34615418/) | Pexels Free License | Active Step 1 Pinned Story |
| `/images/mood/step-02-dropper-rules.webp` | Amber dropper pipette dripping serum with jade facial roller in golden light | Unsplash (`photo-1747303969063-3b90bcb3942e`) | [Unsplash Photo](https://unsplash.com/photos/photo-1747303969063-3b90bcb3942e) | Unsplash Commercial License | Active Step 2 Pinned Story |
| `/images/mood/step-03-routine-picks.webp` | Curated skincare bottles arranged with gentle pink flower petals | Unsplash (`photo-1580870069867-74c57ee1bb07`) | [Unsplash Photo](https://unsplash.com/photos/photo-1580870069867-74c57ee1bb07) | Unsplash Commercial License | Active Step 3 Pinned Story |
| `/images/mood/ingredients-flatlay.webp` | Open cosmetic cream jars with fresh leaves and flower petals on white marble | Pexels (`photo-6690234`) | [Pexels Photo](https://www.pexels.com/photo/top-view-of-cream-jars-6690234/) | Pexels Free License | Active Ingredients Section |
| `/images/mood/texture-closeup.webp` | Velvety moisturizer cream swatch with rich brush strokes on warm beige | Unsplash (`photo-1585945037805-5fd82c2e60b1`) | [Unsplash Photo](https://unsplash.com/photos/photo-1585945037805-5fd82c2e60b1) | Unsplash Commercial License | Active Texture Parallax Section |

## Product Photo Attribution
- **Sources**: Product images come from [Open Beauty Facts](https://world.openbeautyfacts.org/) and official brand or retailer product catalogs. Each entry in `src/data/products.json` records its source page, contributor, and applicable license or source terms.
- **Open Beauty Facts**: Product photos are contributor-uploaded and shared under CC BY-SA; its product and ingredient database is under ODbL.
- **Brand and retailer catalogs**: Product photos remain subject to their owners' terms and are credited to the listed brand or retailer.
- **Local images**: Catalog images are stored under `/public/images/products/` so the website does not hotlink product photos.
- **Public Credits Page**: The interactive source list is available at [`/credits`](http://localhost:3000/credits) and linked from the footer.
- **Catalog refresh**: Run `node scripts/populate-catalog-images.mjs` to retrieve main images and `npm run fetch:galleries` to add verified alternate views and ingredient-panel photos.
