import path from 'path';
import puppeteer from 'puppeteer-core';
import fs from 'fs';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACTS_DIR = 'C:\\Users\\vaiss\\.gemini\\antigravity-ide\\brain\\e5943e70-a3da-4ea6-9968-edc60ad54370';

if (!fs.existsSync(ARTIFACTS_DIR)) {
  fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
}

async function main() {
  console.log('Launching browser to capture BEFORE screenshots...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  try {
    // ---------------- 1. Desktop 1440px: Layering Bug (Pinned Story) ----------------
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0', timeout: 30000 });
    await sleep(1500);

    // Scroll to how-it-works pinned section
    await page.evaluate(() => {
      const el = document.getElementById('how-it-works');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await sleep(1000);
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'before-1-layering-1440.png') });
    console.log('Saved before-1-layering-1440.png');

    // ---------------- 1. Mobile 390px: Layering Bug (Mobile Story) ----------------
    await page.setViewport({ width: 390, height: 844 });
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0', timeout: 30000 });
    await sleep(1000);
    await page.evaluate(() => {
      const el = document.getElementById('how-it-works');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await sleep(1000);
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'before-1-layering-390.png') });
    console.log('Saved before-1-layering-390.png');

    // ---------------- 2. Desktop 1440px: Product Images / Fallback Card ----------------
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0', timeout: 30000 });
    await sleep(1000);
    await page.evaluate(() => {
      const el = document.getElementById('featured');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await sleep(1000);
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'before-2-images-1440.png') });
    console.log('Saved before-2-images-1440.png');

    // ---------------- 2. Mobile 390px: Product Images / Fallback Card ----------------
    await page.setViewport({ width: 390, height: 844 });
    await sleep(1000);
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'before-2-images-390.png') });
    console.log('Saved before-2-images-390.png');

    // ---------------- 3. Desktop 1440px: Unsupported Claims ----------------
    await page.setViewport({ width: 1440, height: 900 });
    await page.evaluate(() => {
      const el = document.getElementById('featured');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await sleep(1000);
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'before-3-claims-1440.png') });
    console.log('Saved before-3-claims-1440.png');

    // ---------------- 3. Mobile 390px: Unsupported Claims ----------------
    await page.setViewport({ width: 390, height: 844 });
    await page.evaluate(() => {
      const el = document.getElementById('featured');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await sleep(1000);
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'before-3-claims-390.png') });
    console.log('Saved before-3-claims-390.png');

  } catch (err) {
    console.error('Error taking screenshots:', err);
  } finally {
    await browser.close();
  }
}

main();
