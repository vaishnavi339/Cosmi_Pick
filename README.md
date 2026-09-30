# CosmicPick 🌌
### Precision AI-Powered Product Recommendations with On-Device Face Analysis

CosmicPick is a privacy-first, on-device AI recommendation web application. Users perform a live biometric face scan via webcam (or photo upload fallback), describe their personal preferences in natural language, and receive hyper-personalized product recommendations with transparent match scores and 2–3 sentence clinical justifications.

The default category is **Skincare & Clinical Beauty**, seeded with 40 realistic products with authentic pricing in Indian Rupees (₹ INR). The entire product category, trait taxonomy, and scoring weights are abstracted into a single modular configuration file (`src/config/category.config.ts`) so the domain can easily be swapped to eyewear, hair care, apparel, or grooming.

---

## 🌟 Key Features

1. **100% On-Device Facial Biometrics**:
   - Executes Google MediaPipe Face Landmarker (`@mediapipe/tasks-vision`) client-side in WebAssembly.
   - Evaluates 478 biometric facial landmarks, facial shape ratios, chromatic skin tone & undertone, and optical surface concerns (sebum shine, erythema/redness, periorbital dark circles, barrier dehydration).
   - Real-time quality verification HUD (Face Detected, Centered, Good Lighting, Hold Still) with automated capture.
   - **Zero Cloud Storage**: Camera streams run in temporary memory and hardware tracks terminate immediately upon scan completion. No photographs or video streams are ever uploaded, logged, or stored.

2. **Conversational AI & Hybrid Scoring Engine**:
   - Claude AI parses unstructured natural language queries (e.g., *"oily T-zone, prone to breakouts, budget under ₹1500, fragrance-free"*) into structured constraints.
   - Multi-factor deterministic scoring algorithm incorporating trait match, concern match, user constraints, budget compliance, and verified user ratings.
   - Generates personalized 2–3 sentence justifications referencing exact facial indicators and product actives.
   - Resilient offline fallback: seamlessly operates with high-accuracy local regex parsing and template explanations if the API key is not configured.

3. **Live Conversational Re-Ranking**:
   - Type conversational refinements (e.g., *"show me cheaper ones"*, *"only sunscreens"*, *"more gentle & soothing"*) to dynamically re-weight and re-order recommendations in real time.

4. **Interactive Side-by-Side Comparison**:
   - Compare up to 3 products across price, formulation category, active ingredients, target concerns, avoid flags, and ratings.

5. **Downloadable Celestial Profile Card**:
   - Generate and export a shareable, high-resolution PNG profile card summarizing facial traits, primary concerns, and top 3 product matches—with **zero face photographs** included for privacy.

6. **Refined Cosmic Design System**:
   - Deep `#070B1A` stellar palette, violet-to-cyan gradient accents, glassmorphic cards with subtle glows.
   - Full light and dark mode with persistent toggle.
   - Responsive across mobile (360px) to ultra-wide desktop displays (1536px).
   - WCAG AA contrast, keyboard accessibility, and reduced-motion support.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS + Custom CSS Variables + Glassmorphism
- **Icons**: Lucide React
- **Animations**: CSS animations + Canvas particle starfield + Canvas confetti
- **Biometrics**: Google MediaPipe Face Landmarker (`@mediapipe/tasks-vision` via WebAssembly)
- **AI / LLM**: Anthropic Claude API (`claude-3-haiku-20240307` / `claude-3-5-sonnet`)
- **Exporting**: `html-to-image` for client-side PNG rendering
- **Data**: 40 curated sample skincare products in `src/data/products.json` (seeded with realistic demo pricing in ₹ INR, placeholder images, and placeholder store links)

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18.17+ or 20+
- npm or yarn

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/your-username/cosmic-pick.git
cd cosmic-pick

# Install dependencies
npm install
```

### 3. Environment Variables (Optional)
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Add your Anthropic API key to enable Claude-powered query parsing and personalized explanations:
```env
ANTHROPIC_API_KEY=sk-ant-api03-...
```
> **Note**: If `ANTHROPIC_API_KEY` is omitted, CosmicPick automatically runs its high-accuracy deterministic scoring engine and template-based explanation generator with zero downtime.

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build
```bash
npm run build
npm run start
```

---

## 🔄 How to Swap the Product Category

CosmicPick was intentionally engineered with a decoupled category architecture. All category-specific taxonomy, trait labels, filter chips, and mathematical scoring weights reside in:
📁 `src/config/category.config.ts`

### Example: Swapping to Eyewear & Optical Frames
1. In `src/config/category.config.ts`, change:
   - `id`: `'eyewear'`
   - `name`: `'Eyewear & Frame Styling'`
   - `traitLabels.faceShapes`: Keep face shapes (Oval, Round, Square, Heart, Oblong) and adjust styling advice (e.g., Square faces match round frames).
   - `filterOptions.concerns`: Replace with frame styles (e.g., "Blue Light Filtering", "Progressive", "Polarized", "Titanium").
   - `filterOptions.productTypes`: Replace with ["Aviator", "Wayfarer", "Round", "Cat-Eye", "Geometric"].
2. In `src/data/products.json`, populate eyewear products with corresponding `faceShapesSupported`, frame dimensions, and pricing.
3. The UI, scan flow, trait review, filters, compare drawer, and recommendation engine will instantly reflect the new domain without editing layout code.

---

## ⚖️ Skin-Tone & Lighting Bias Mitigations

Computer vision models and optical sensors can exhibit bias across varying skin tones and challenging lighting conditions. CosmicPick actively addresses these limitations:
1. **Confidence Metrics**: Every derived trait (tone, shape, undertone, shine, erythema) is surfaced with an explicit 0–100% confidence score.
2. **Lighting Evaluator**: Live HUD warns the user if lighting is too dim ($L < 65$) or overexposed ($L > 225$), advising them to reposition rather than returning inaccurate results.
3. **Manual Trait Correction**: In Step 3 (Analysis & Trait Verification), users have full agency to correct or override any detected trait via intuitive dropdowns and level selectors.
4. **Clinical Disclaimer**: Prominently notes that all outputs are cosmetic formulation suggestions, never medical diagnoses.

---

## 🔒 Privacy & Security Blueprint

- **No Remote Frames**: Video feeds are drawn onto an off-screen HTML5 canvas element solely for WebAssembly analysis in volatile browser RAM.
- **Immediate Disconnect**: Camera hardware tracks are stopped immediately upon completing the capture or navigating away.
- **Zero Facial Storage**: No facial image is ever uploaded, cached in local storage, or transmitted to any server.
- **Rate-Limited API**: Route handlers feature an in-memory sliding window rate limiter (30 requests/min) to prevent abuse.

---

## 📄 License
MIT © CosmicPick.
