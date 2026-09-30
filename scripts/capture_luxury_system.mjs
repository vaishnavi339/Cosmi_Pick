import puppeteer from 'puppeteer-core';
import path from 'path';

const ARTIFACT_DIR = 'C:\\Users\\vaiss\\.gemini\\antigravity-ide\\brain\\1d9f24ed-0650-4fdd-9a53-b0854b4b27a4';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function run() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  // 1. Step 1: Consent (Light mode)
  console.log('Navigating to http://localhost:3000/scan...');
  await page.goto('http://localhost:3000/scan', { waitUntil: 'networkidle2' });
  await page.evaluate(() => document.documentElement.classList.remove('dark'));
  await new Promise(r => setTimeout(r, 600));

  console.log('Capturing Step 1: Consent...');
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'luxury_step1_consent.png'),
    fullPage: false,
  });

  // Consent & move to Step 2
  await page.waitForSelector('#consent-checkbox');
  await page.click('#consent-checkbox');
  await new Promise(r => setTimeout(r, 300));
  await page.click('#consent-continue-btn');
  await new Promise(r => setTimeout(r, 1200));

  // 2. Step 2: Webcam
  console.log('Capturing Step 2: Alignment Frame...');
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'luxury_step2_webcam.png'),
    fullPage: false,
  });

  // Trigger manual capture
  await page.waitForSelector('#manual-capture-btn');
  await page.click('#manual-capture-btn');
  await new Promise(r => setTimeout(r, 1600));

  // 3. Step 3: Analysis Review
  console.log('Capturing Step 3: Skin Traits Review...');
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'luxury_step3_traits.png'),
    fullPage: false,
  });

  // Confirm traits
  await page.waitForSelector('#confirm-traits-btn');
  await page.click('#confirm-traits-btn');
  await new Promise(r => setTimeout(r, 1000));

  // 4. Step 4: Requirements
  console.log('Capturing Step 4: Goals & Preferences...');
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'luxury_step4_requirements.png'),
    fullPage: false,
  });

  // Submit requirements
  await page.waitForSelector('#generate-picks-btn');
  await page.click('#generate-picks-btn');

  // 5. Step 5: Wait for Results
  console.log('Waiting for Step 5 Results...');
  await page.waitForSelector('#demo-data-badge', { timeout: 25000 });
  await new Promise(r => setTimeout(r, 2000));

  // Click on a heart button to show favorited state
  console.log('Clicking favorite heart...');
  const heartButtons = await page.$$('button[aria-label*="favorites"]');
  if (heartButtons.length > 0) {
    await heartButtons[0].click();
    await new Promise(r => setTimeout(r, 400));
  }

  // Capture Desktop Light Mode
  console.log('Capturing Desktop Light Mode Results (viewport)...');
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'luxury_results_desktop_light.png'),
    fullPage: false,
  });

  console.log('Capturing Desktop Light Mode Results (full page)...');
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'luxury_results_desktop_light_full.png'),
    fullPage: true,
  });

  // Open Routine Builder Modal
  console.log('Opening Routine Builder Modal...');
  const routineBtn = await page.$('#open-routine-builder-btn');
  if (routineBtn) {
    await routineBtn.click();
    await new Promise(r => setTimeout(r, 800));

    console.log('Capturing Routine Builder Modal...');
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'luxury_routine_builder_modal.png'),
      fullPage: false,
    });

    // Close modal
    const closeBtn = await page.$('button[aria-label="Close routine modal"]') || await page.$('button:has-text("Done")');
    if (closeBtn) {
      await closeBtn.click();
      await new Promise(r => setTimeout(r, 600));
    } else {
      // Escape key fallback
      await page.keyboard.press('Escape');
      await new Promise(r => setTimeout(r, 600));
    }
  }

  // Dark Mode Results
  console.log('Switching to Dark Mode...');
  await page.evaluate(() => document.documentElement.classList.add('dark'));
  await new Promise(r => setTimeout(r, 800));

  console.log('Capturing Desktop Dark Mode Results (viewport)...');
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'luxury_results_desktop_dark.png'),
    fullPage: false,
  });

  console.log('Capturing Desktop Dark Mode Results (full page)...');
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'luxury_results_desktop_dark_full.png'),
    fullPage: true,
  });

  // Mobile Viewport 390px
  console.log('Switching to Mobile Viewport (390px)...');
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true });
  await page.evaluate(() => document.documentElement.classList.remove('dark'));
  await new Promise(r => setTimeout(r, 800));

  console.log('Capturing Mobile Light Mode Results (full page)...');
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'luxury_results_mobile_light_full.png'),
    fullPage: true,
  });

  console.log('All luxury screenshots successfully captured!');
  await browser.close();
}

run().catch(err => {
  console.error('Capture failed:', err);
  process.exit(1);
});
