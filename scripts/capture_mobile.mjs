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

  // ==========================================
  // SESSION 1: MOBILE VIEWPORT (390px)
  // ==========================================
  console.log('Starting Mobile Session (390x844)...');
  const mobilePage = await browser.newPage();
  await mobilePage.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true });

  await mobilePage.goto('http://localhost:3000/scan', { waitUntil: 'networkidle2' });

  // Step 1
  await mobilePage.waitForSelector('#consent-checkbox');
  await mobilePage.click('#consent-checkbox');
  await new Promise(r => setTimeout(r, 300));
  await mobilePage.click('#consent-continue-btn');
  await new Promise(r => setTimeout(r, 1000));

  // Step 2
  await mobilePage.waitForSelector('#manual-capture-btn');
  await mobilePage.click('#manual-capture-btn');
  await new Promise(r => setTimeout(r, 1000));

  // Step 3
  await mobilePage.waitForSelector('#confirm-traits-btn');
  await mobilePage.click('#confirm-traits-btn');
  await new Promise(r => setTimeout(r, 1000));

  // Step 4
  await mobilePage.waitForSelector('#generate-picks-btn');
  await mobilePage.click('#generate-picks-btn');

  // Step 5
  await mobilePage.waitForSelector('#demo-data-badge', { timeout: 20000 });
  await new Promise(r => setTimeout(r, 2500));

  // Ensure Dark Mode
  await mobilePage.evaluate(() => {
    document.documentElement.classList.add('dark');
  });
  await new Promise(r => setTimeout(r, 500));

  console.log('Capturing Mobile Dark Mode screenshots at 390px...');
  await mobilePage.screenshot({
    path: path.join(ARTIFACT_DIR, 'redesigned_results_mobile_dark.png'),
    fullPage: false,
  });

  await mobilePage.screenshot({
    path: path.join(ARTIFACT_DIR, 'redesigned_results_mobile_dark_full.png'),
    fullPage: true,
  });

  await mobilePage.close();

  console.log('Mobile capture complete!');
  await browser.close();
}

run().catch(err => {
  console.error('Mobile capture failed:', err);
  process.exit(1);
});
