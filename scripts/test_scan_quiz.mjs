import puppeteer from 'puppeteer-core';
import path from 'path';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACT_DIR = 'C:\\Users\\vaiss\\.gemini\\antigravity-ide\\brain\\1d9f24ed-0650-4fdd-9a53-b0854b4b27a4';

async function main() {
  console.log('Testing /scan?mode=quiz with Edge...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  
  // Track 404s
  const failedRequests = [];
  page.on('response', response => {
    if (response.status() === 404) {
      failedRequests.push(`${response.status()} ${response.url()}`);
    }
  });

  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/scan?mode=quiz', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1500));

  console.log('Failed requests count:', failedRequests.length);
  if (failedRequests.length > 0) {
    console.log('Failed requests:', failedRequests);
  }

  // Check computed styles on body and heading
  const bodyStyles = await page.evaluate(() => {
    const body = document.body;
    const computed = window.getComputedStyle(body);
    const h1 = document.querySelector('h1') || document.querySelector('h2');
    const h1Computed = h1 ? window.getComputedStyle(h1) : null;
    return {
      bodyBg: computed.backgroundColor,
      bodyFont: computed.fontFamily,
      headingFont: h1Computed ? h1Computed.fontFamily : 'no heading',
    };
  });
  console.log('Body styles:', bodyStyles);

  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'scan_quiz_fixed_desktop.png'),
  });
  console.log('Captured scan_quiz_fixed_desktop.png');

  await browser.close();
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
