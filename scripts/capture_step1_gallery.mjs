import puppeteer from 'puppeteer-core';
import path from 'path';

const ARTIFACT_DIR = 'C:\\Users\\vaiss\\.gemini\\antigravity-ide\\brain\\1d9f24ed-0650-4fdd-9a53-b0854b4b27a4';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  // 1. Desktop Home Light
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await page.evaluate(() => document.documentElement.classList.remove('dark'));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'step1_desktop_home_light.png'), fullPage: false });

  // 2. Desktop Home Dark
  await page.evaluate(() => document.documentElement.classList.add('dark'));
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'step1_desktop_home_dark.png'), fullPage: false });

  // 3. Footer Cleaned Up
  await page.evaluate(() => {
    document.querySelector('footer')?.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'step1_footer_clean.png'), fullPage: false });

  // 4. Desktop Privacy Light
  await page.goto('http://localhost:3000/privacy', { waitUntil: 'networkidle2' });
  await page.evaluate(() => document.documentElement.classList.remove('dark'));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'step1_desktop_privacy_light.png'), fullPage: false });

  // 5. Expand "For the curious" and scroll into view
  await page.click('button[aria-expanded]');
  await new Promise(r => setTimeout(r, 500));
  await page.evaluate(() => {
    const el = document.querySelector('button[aria-expanded]');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'step1_desktop_privacy_expanded.png'), fullPage: false });

  // 6. Mobile Viewport (390px)
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await page.evaluate(() => document.documentElement.classList.remove('dark'));
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'step1_mobile_home.png'), fullPage: false });

  // Mobile menu open
  await page.click('#mobile-menu-toggle');
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'step1_mobile_menu.png'), fullPage: false });

  await browser.close();
  console.log('Step 1 gallery captured successfully!');
}

run().catch(console.error);
