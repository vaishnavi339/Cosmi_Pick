import puppeteer from 'puppeteer-core';
import path from 'path';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACT_DIR = 'C:\\Users\\vaiss\\.gemini\\antigravity-ide\\brain\\1d9f24ed-0650-4fdd-9a53-b0854b4b27a4';

async function main() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/scan?mode=quiz', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 800));

  // Check the checkbox
  await page.evaluate(() => {
    const checkbox = document.querySelector('input[type="checkbox"]');
    if (checkbox) {
      checkbox.click();
    }
  });
  await new Promise((r) => setTimeout(r, 400));

  // Click proceed
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const proceed = buttons.find(b => b.textContent.includes('Proceed') || b.textContent.includes('Continue') || b.textContent.includes('Start'));
    if (proceed) proceed.click();
  });
  await new Promise((r) => setTimeout(r, 800));

  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'scan_quiz_step2_fixed.png'),
  });
  console.log('Captured scan_quiz_step2_fixed.png');

  await browser.close();
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
