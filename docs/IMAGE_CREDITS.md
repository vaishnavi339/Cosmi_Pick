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

## Open Beauty Facts Product Photography & Data Attribution
- **Source**: [Open Beauty Facts](https://world.openbeautyfacts.org/)
- **Product Photography License**: Creative Commons Attribution-ShareAlike 3.0 / 4.0 (CC BY-SA) by Open Beauty Facts contributors.
- **Database & Ingredients License**: Open Database License (ODbL).
- **Public Credits Page**: Full interactive credits list available at [`/credits`](http://localhost:3000/credits) and linked from the footer.
- **Verification Threshold**: Real images are automatically matched only with strict name similarity &ge; 0.80 and exact brand match, then downloaded locally to `/public/images/products/{slug}.webp` (optimized, max 800px, white background preserved).
- **Fallback Rule**: Products without an approved Open Beauty Facts photo display an elegant "Image coming soon" tile. Never a wrong or broken image.
- **Image Checklist**: Tracked in [`products-images-checklist.csv`](../products-images-checklist.csv).
- **Automated Verification Report**: Generated in [`scripts/image-review-report.html`](../scripts/image-review-report.html).
