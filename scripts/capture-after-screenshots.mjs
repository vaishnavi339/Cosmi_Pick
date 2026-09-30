import path from 'path';
import puppeteer from 'puppeteer-core';
import fs from 'fs';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACTS_DIR = 'C:\\Users\\vaiss\\.gemini\\antigravity-ide\\brain\\e5943e70-a3da-4ea6-9968-edc60ad54370';

async function main() {
  console.log('Launching browser to capture enhanced AFTER verification screenshots...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  try {
    // ---------------- 1. Desktop 1440px: Pinned Story Step 3 Verification ----------------
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0', timeout: 30000 });
    await sleep(1500);

    // Scroll to how-it-works pinned section and then down to Step 3
    await page.evaluate(() => {
      const el = document.getElementById('how-it-works');
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: top + 1800, behavior: 'instant' });
      }
    });
    await sleep(1200);
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'after-1-step3-stage-1440.png') });
    console.log('Saved after-1-step3-stage-1440.png');

    // ---------------- 2. Desktop 1440px: Real Photography in Featured Track ----------------
    await page.evaluate(() => {
      const el = document.getElementById('featured');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await sleep(600);
    // Scroll carousel track to reveal CeraVe and The Ordinary
    await page.evaluate(() => {
      const track = document.querySelector('#featured .overflow-x-auto');
      if (track) track.scrollLeft = 1400;
    });
    await sleep(1000);
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'after-2-real-photos-1440.png') });
    console.log('Saved after-2-real-photos-1440.png');

    // ---------------- 3. Mobile 390px: Real Photography in Featured Track ----------------
    await page.setViewport({ width: 390, height: 844 });
    await page.evaluate(() => {
      const el = document.getElementById('featured');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await sleep(600);
    await page.evaluate(() => {
      const track = document.querySelector('#featured .overflow-x-auto');
      if (track) track.scrollLeft = 1500;
    });
    await sleep(1000);
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'after-2-real-photos-390.png') });
    console.log('Saved after-2-real-photos-390.png');

  } catch (err) {
    console.error('Error during enhanced screenshot capture:', err);
  } finally {
    await browser.close();
  }
}

main();
