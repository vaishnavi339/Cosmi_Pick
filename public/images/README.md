# CosmicPick Images Directory Guide

All imagery for CosmicPick lives in this directory. Strictly no remote image hotlinking is permitted.

## Directory Structure
- `/public/images/products/`: Real product photography. Expected filenames are documented in `/products-images-checklist.csv`.
  - Format: `.webp` or `.png` (1:1 aspect ratio, minimum 600x600px).
  - Background: Clean white, soft ivory (#FBF7F4), or neutral studio lighting.
- `/public/images/mood/`: Editorial mood photography for landing hero, how-it-works cards, and brand storytelling.
  - `hero-glow-portrait.webp`: High-res natural radiant skin portrait.
  - `step-natural-light.webp`: Soft daylight window portrait.
  - `step-ingredients.webp`: Clean botanical / clinical formulation texture.
  - `step-routine.webp`: Minimalist bathroom vanity / shelfie routine.

## Fallback Behavior
If any product image file is missing or fails to load, CosmicPick automatically renders a luxury neutral **"Image coming soon"** card in soft blush with category icon and brand typography. Broken image icons and missing alt-text are never shown.
