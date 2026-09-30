import puppeteer from 'puppeteer-core';
import path from 'path';

const ARTIFACT_DIR = 'C:\\Users\\vaiss\\.gemini\\antigravity-ide\\brain\\1d9f24ed-0650-4fdd-9a53-b0854b4b27a4';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function run() {
  console.log('Launching Edge browser...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  // 1. Set Desktop Viewport 1440x900
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  console.log('Navigating to http://localhost:3000/scan...');
  await page.goto('http://localhost:3000/scan', { waitUntil: 'networkidle2' });

  // Step 1: Consent -> Check box and click continue
  console.log('Agreeing to consent...');
  await page.waitForSelector('#consent-checkbox');
  await page.click('#consent-checkbox');
  await new Promise(r => setTimeout(r, 400));
  await page.click('#consent-continue-btn');
  await new Promise(r => setTimeout(r, 1200));

  // Step 2: Webcam -> Click manual capture
  console.log('Triggering capture in StepWebcam...');
  await page.waitForSelector('#manual-capture-btn');
  await page.click('#manual-capture-btn');
  await new Promise(r => setTimeout(r, 1200));

  // Step 3: Analysis Review -> Confirm
  console.log('Confirming analysis traits in StepAnalysis...');
  await page.waitForSelector('#confirm-traits-btn');
  await page.click('#confirm-traits-btn');
  await new Promise(r => setTimeout(r, 1200));

  // Step 4: Requirements -> Click Get My Cosmic Picks
  console.log('Submitting requirements for picks...');
  await page.waitForSelector('#generate-picks-btn');
  await page.click('#generate-picks-btn');

  // Step 5: Wait for Results to render
  console.log('Waiting for Step 5 results...');
  await page.waitForSelector('#demo-data-badge', { timeout: 20000 });
  await new Promise(r => setTimeout(r, 2500)); // Allow animations & SVG to settle

  // Ensure Dark Mode is active
  await page.evaluate(() => {
    document.documentElement.classList.add('dark');
  });
  await new Promise(r => setTimeout(r, 600));

  console.log('Capturing Desktop Dark Mode screenshot (viewport)...');
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'redesigned_results_desktop_dark.png'),
    fullPage: false,
  });

  console.log('Capturing Desktop Dark Mode full-page screenshot...');
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'redesigned_results_desktop_dark_full.png'),
    fullPage: true,
  });

  // Click on "Compare" on Hero card and card #2 to show bottom compare tray
  console.log('Testing Compare selection & Tray...');
  const compareButtons = await page.$$('button');
  let clickedCount = 0;
  for (const btn of compareButtons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('Compare') && !text.includes('Side-by-Side')) {
      await btn.click();
      clickedCount++;
      if (clickedCount >= 2) break;
    }
  }
  await new Promise(r => setTimeout(r, 1000));

  console.log('Capturing Compare Tray screenshot...');
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'redesigned_results_compare_tray.png'),
    fullPage: false,
  });

  // Expand score breakdown on Hero card and a grid card
  console.log('Expanding Score Breakdown...');
  const breakdownButtons = await page.$$('button');
  for (const btn of breakdownButtons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && (text.includes('Score Breakdown') || text.includes('Full Score Breakdown'))) {
      await btn.click();
    }
  }
  await new Promise(r => setTimeout(r, 800));

  console.log('Capturing Score Breakdown screenshot...');
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'redesigned_results_score_breakdown.png'),
    fullPage: false,
  });

  // Switch to Light Mode
  console.log('Switching to Light Mode...');
  await page.evaluate(() => {
    document.documentElement.classList.remove('dark');
  });
  await new Promise(r => setTimeout(r, 800));

  console.log('Capturing Desktop Light Mode screenshot...');
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'redesigned_results_desktop_light.png'),
    fullPage: false,
  });

  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'redesigned_results_desktop_light_full.png'),
    fullPage: true,
  });

  // Mobile Viewport 390x844
  console.log('Switching to Mobile Viewport (390px)...');
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true });
  await page.evaluate(() => {
    document.documentElement.classList.add('dark');
  });
  await new Promise(r => setTimeout(r, 800));

  console.log('Capturing Mobile Dark Mode screenshot...');
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'redesigned_results_mobile_dark.png'),
    fullPage: false,
  });

  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'redesigned_results_mobile_dark_full.png'),
    fullPage: true,
  });

  console.log('All screenshots captured successfully!');
  await browser.close();
}

run().catch(err => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
