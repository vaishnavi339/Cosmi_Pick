import path from 'path';
import puppeteer from 'puppeteer-core';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACTS_DIR = 'C:\\Users\\vaiss\\.gemini\\antigravity-ide\\brain\\1d9f24ed-0650-4fdd-9a53-b0854b4b27a4';

async function main() {
  console.log('Launching Microsoft Edge for screenshot verification...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream'],
  });

  const page = await browser.newPage();
  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  try {
    // ---------------- 1. Desktop 1440px: Home & Featured Products ----------------
    console.log('[1/6] Capturing Desktop Landing & Featured Products (1440px)...');
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0', timeout: 30000 });
    await sleep(1500);

    const landingPath = path.join(ARTIFACTS_DIR, 'desktop-landing-1440.png');
    await page.screenshot({ path: landingPath });
    console.log(`Saved: ${landingPath}`);

    // Scroll to featured products
    await page.evaluate(() => {
      const el = document.getElementById('featured');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await sleep(1000);
    const featuredPath = path.join(ARTIFACTS_DIR, 'desktop-featured-products-1440.png');
    await page.screenshot({ path: featuredPath });
    console.log(`Saved: ${featuredPath}`);

    // ---------------- 2. Desktop 1440px: Credits Page ----------------
    console.log('[2/6] Capturing Desktop /credits page (1440px)...');
    await page.goto('http://localhost:3000/credits', { waitUntil: 'networkidle0', timeout: 30000 });
    await sleep(1000);
    const creditsPath = path.join(ARTIFACTS_DIR, 'desktop-credits-1440.png');
    await page.screenshot({ path: creditsPath, fullPage: false });
    console.log(`Saved: ${creditsPath}`);

    // ---------------- 3. Desktop 1440px: Scan Wizard to Results ----------------
    console.log('[3/6] Running Scan Wizard flow to Results (1440px)...');
    await page.goto('http://localhost:3000/scan', { waitUntil: 'networkidle0', timeout: 30000 });
    await sleep(1000);

    // Step 1: Consent
    await page.click('#consent-checkbox');
    await sleep(300);
    await page.click('#consent-continue-btn');
    await sleep(1500);

    // Step 2: Camera scan
    await page.waitForSelector('#manual-capture-btn', { timeout: 15000 });
    await page.click('#manual-capture-btn');
    await sleep(1500);

    // Step 3: Analysis Confirmation
    await page.waitForSelector('#confirm-traits-btn', { timeout: 10000 });
    await page.click('#confirm-traits-btn');
    await sleep(1000);

    // Step 4: Requirements
    await page.waitForSelector('#user-query-input', { timeout: 15000 });
    await page.type('#user-query-input', 'I have dry skin and want hydration, strictly avoid fragrance and parabens', { delay: 15 });
    await sleep(300);
    await page.click('#generate-picks-btn');

    // Wait for recommendation results (Step 5)
    await page.waitForSelector('#product-lookup-input', { timeout: 30000 });
    await sleep(2000);

    const resultsPath = path.join(ARTIFACTS_DIR, 'desktop-scan-results-1440.png');
    await page.screenshot({ path: resultsPath });
    console.log(`Saved: ${resultsPath}`);

    // ---------------- 4. Desktop 1440px: Product Lookup on Results Page ----------------
    console.log('[4/6] Testing Product Lookup & Ingredient Checker (1440px)...');
    await page.evaluate(() => {
      const el = document.getElementById('product-lookup-input');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
    });
    await sleep(600);

    // Type "CeraVe Hydrating"
    await page.type('#product-lookup-input', 'CeraVe Hydrating', { delay: 30 });
    await sleep(300);
    await page.click('#product-lookup-submit-btn');

    // Wait for search results
    await sleep(2500);
    const lookupPath = path.join(ARTIFACTS_DIR, 'desktop-product-lookup-1440.png');
    await page.screenshot({ path: lookupPath });
    console.log(`Saved: ${lookupPath}`);

    // ---------------- 5. Desktop 1440px: Manual Ingredient Paste Checker ----------------
    console.log('[5/6] Testing Manual Ingredient Paste Checker (1440px)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const toggle = buttons.find((b) => b.textContent?.includes('Paste Ingredients Manually'));
      if (toggle) toggle.click();
    });
    await sleep(500);

    await page.type(
      '#manual-ingredients-textarea',
      'Water, Glycerin, Methylparaben, Fragrance, Ceramide NP, Hyaluronic Acid, Dimethicone',
      { delay: 15 }
    );
    await sleep(300);

    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const checkBtn = buttons.find((b) => b.textContent?.includes('Check Ingredients'));
      if (checkBtn) checkBtn.click();
    });
    await sleep(800);

    const manualPath = path.join(ARTIFACTS_DIR, 'desktop-manual-ingredient-check-1440.png');
    await page.screenshot({ path: manualPath });
    console.log(`Saved: ${manualPath}`);

    // ---------------- 6. Mobile 390px Viewport ----------------
    console.log('[6/6] Capturing Mobile (390px) Viewport...');
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    
    // Credits page on mobile
    await page.goto('http://localhost:3000/credits', { waitUntil: 'networkidle0', timeout: 30000 });
    await sleep(1000);
    const mobileCreditsPath = path.join(ARTIFACTS_DIR, 'mobile-credits-390.png');
    await page.screenshot({ path: mobileCreditsPath });
    console.log(`Saved: ${mobileCreditsPath}`);

    // Credits page on desktop (clean single navbar)
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto('http://localhost:3000/credits', { waitUntil: 'networkidle0', timeout: 30000 });
    await sleep(1000);
    const updatedCreditsPath = path.join(ARTIFACTS_DIR, 'desktop-credits-1440.png');
    await page.screenshot({ path: updatedCreditsPath, fullPage: false });
    console.log(`Saved: ${updatedCreditsPath}`);

    // Mobile landing page
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0', timeout: 30000 });
    await sleep(1000);
    const mobileLandingPath = path.join(ARTIFACTS_DIR, 'mobile-landing-390.png');
    await page.screenshot({ path: mobileLandingPath });
    console.log(`Saved: ${mobileLandingPath}`);

    console.log('All screenshots captured successfully!');
  } catch (err) {
    console.error('Error during screenshot capture:', err);
  } finally {
    await browser.close();
  }
}

main().catch(console.error);
