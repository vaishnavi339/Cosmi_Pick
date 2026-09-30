import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACT_DIR = 'C:\\Users\\vaiss\\.gemini\\antigravity-ide\\brain\\1d9f24ed-0650-4fdd-9a53-b0854b4b27a4';

async function main() {
  console.log('Launching browser with Edge...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  // Test 1: Desktop 1440px
  console.log('Testing 1440px desktop...');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1500));

  // Capture Hero at 1440px
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'step2_desktop_1440_hero.png'),
  });
  console.log('Captured step2_desktop_1440_hero.png');

  // Check section anchors
  const anchors = ['how-it-works', 'featured', 'undertone', 'ingredients', 'faq'];
  for (const id of anchors) {
    const el = await page.$(`#${id}`);
    if (el) {
      console.log(`Found anchor #${id}`);
    } else {
      console.error(`Missing anchor #${id}`);
    }
  }

  // Scroll to Pinned Scroll Story
  const howItWorks = await page.$('#how-it-works');
  if (howItWorks) {
    await page.evaluate(() => {
      document.querySelector('#how-it-works').scrollIntoView({ behavior: 'instant' });
    });
    await new Promise((r) => setTimeout(r, 1000));
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'step2_desktop_1440_pinned_story.png'),
    });
    console.log('Captured step2_desktop_1440_pinned_story.png');
  }

  // Scroll down slightly inside pinned story to trigger step 2
  await page.evaluate(() => {
    window.scrollBy({ top: 800, behavior: 'instant' });
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'step2_desktop_1440_pinned_step2.png'),
  });
  console.log('Captured step2_desktop_1440_pinned_step2.png');

  // Scroll to Featured Carousel
  await page.evaluate(() => {
    document.querySelector('#featured').scrollIntoView({ behavior: 'instant' });
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'step2_desktop_1440_featured.png'),
  });
  console.log('Captured step2_desktop_1440_featured.png');

  // Scroll to Undertone Picker and test clicking Cool undertone
  await page.evaluate(() => {
    document.querySelector('#undertone').scrollIntoView({ behavior: 'instant' });
  });
  await new Promise((r) => setTimeout(r, 800));
  
  // Click on "Cool" button
  const buttons = await page.$$('button');
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('Cool')) {
      await btn.click();
      console.log('Clicked Cool undertone button');
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'step2_desktop_1440_undertone.png'),
  });
  console.log('Captured step2_desktop_1440_undertone.png');

  // Scroll to Ingredients Marquee and tap an ingredient
  await page.evaluate(() => {
    document.querySelector('#ingredients').scrollIntoView({ behavior: 'instant' });
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'step2_desktop_1440_ingredients.png'),
  });
  console.log('Captured step2_desktop_1440_ingredients.png');

  // Scroll to Texture Section
  await page.evaluate(() => {
    window.scrollBy({ top: 700, behavior: 'instant' });
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'step2_desktop_1440_texture.png'),
  });
  console.log('Captured step2_desktop_1440_texture.png');

  // Scroll to Final CTA and Footer
  await page.evaluate(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' });
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'step2_desktop_1440_cta_footer.png'),
  });
  console.log('Captured step2_desktop_1440_cta_footer.png');

  // Test 2: Tablet 768px
  console.log('Testing 768px tablet...');
  await page.setViewport({ width: 768, height: 1024 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'step2_tablet_768_hero.png'),
  });
  console.log('Captured step2_tablet_768_hero.png');

  // Test 3: Mobile 390px
  console.log('Testing 390px mobile...');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'step2_mobile_390_hero.png'),
  });
  console.log('Captured step2_mobile_390_hero.png');

  // Scroll down mobile page to how it works
  await page.evaluate(() => {
    document.querySelector('#how-it-works').scrollIntoView({ behavior: 'instant' });
  });
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'step2_mobile_390_how_it_works.png'),
  });
  console.log('Captured step2_mobile_390_how_it_works.png');

  // Scroll to bottom on mobile
  await page.evaluate(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' });
  });
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'step2_mobile_390_cta_footer.png'),
  });
  console.log('Captured step2_mobile_390_cta_footer.png');

  await browser.close();
  console.log('All tests and screenshots completed successfully!');
}

main().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
