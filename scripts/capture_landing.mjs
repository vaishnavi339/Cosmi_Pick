import puppeteer from 'puppeteer-core';
import path from 'path';

const ARTIFACT_DIR = 'C:\\Users\\vaiss\\.gemini\\antigravity-ide\\brain\\1d9f24ed-0650-4fdd-9a53-b0854b4b27a4';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function run() {
  console.log('Launching Edge browser for Landing Page capture...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  // 1. Desktop Light Mode (1440px)
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));

  // Ensure Light Mode
  await page.evaluate(() => {
    document.documentElement.classList.remove('dark');
  });
  await new Promise(r => setTimeout(r, 600));

  console.log('Capturing Desktop Light Mode Landing Page...');
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'luxury_landing_desktop_light.png'),
    fullPage: false,
  });

  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'luxury_landing_desktop_light_full.png'),
    fullPage: true,
  });

  // 2. Desktop Dark Mode (1440px)
  console.log('Capturing Desktop Dark Mode Landing Page...');
  await page.evaluate(() => {
    document.documentElement.classList.add('dark');
  });
  await new Promise(r => setTimeout(r, 600));

  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'luxury_landing_desktop_dark.png'),
    fullPage: false,
  });

  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'luxury_landing_desktop_dark_full.png'),
    fullPage: true,
  });

  await page.close();

  // 3. Mobile Viewport (390px)
  console.log('Capturing Mobile Viewport Landing Page (390px)...');
  const mobilePage = await browser.newPage();
  await mobilePage.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true });
  await mobilePage.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));

  await mobilePage.screenshot({
    path: path.join(ARTIFACT_DIR, 'luxury_landing_mobile_light_full.png'),
    fullPage: true,
  });

  await mobilePage.close();
  await browser.close();
  console.log('Landing page screenshots captured successfully!');
}

run().catch(err => {
  console.error('Landing capture failed:', err);
  process.exit(1);
});
