import puppeteer from 'puppeteer-core';
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
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Light Mode Full Page & Sections
  console.log('Testing Light Mode...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await page.evaluate(() => {
    localStorage.setItem('cosmic-theme', 'light');
    document.documentElement.classList.remove('dark');
  });
  await page.reload({ waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1200));

  // Light Mode Hero
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'step2_desktop_light_01_hero.png'),
  });
  console.log('Captured step2_desktop_light_01_hero.png');

  // Light Mode Pinned Story
  await page.evaluate(() => {
    document.querySelector('#how-it-works').scrollIntoView({ behavior: 'instant' });
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'step2_desktop_light_02_pinned_story.png'),
  });
  console.log('Captured step2_desktop_light_02_pinned_story.png');

  // Light Mode Featured Carousel
  await page.evaluate(() => {
    document.querySelector('#featured').scrollIntoView({ behavior: 'instant' });
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'step2_desktop_light_03_featured.png'),
  });
  console.log('Captured step2_desktop_light_03_featured.png');

  // Light Mode Undertone Picker
  await page.evaluate(() => {
    document.querySelector('#undertone').scrollIntoView({ behavior: 'instant' });
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'step2_desktop_light_04_undertone.png'),
  });
  console.log('Captured step2_desktop_light_04_undertone.png');

  // Light Mode Ingredients & Texture
  await page.evaluate(() => {
    document.querySelector('#ingredients').scrollIntoView({ behavior: 'instant' });
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'step2_desktop_light_05_ingredients.png'),
  });
  console.log('Captured step2_desktop_light_05_ingredients.png');

  // Light Mode Texture & CTA
  await page.evaluate(() => {
    window.scrollBy({ top: 900, behavior: 'instant' });
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'step2_desktop_light_06_texture_cta.png'),
  });
  console.log('Captured step2_desktop_light_06_texture_cta.png');

  // 2. Dark Mode Pinned Story & Texture (refined)
  console.log('Testing Dark Mode Refinements...');
  await page.evaluate(() => {
    localStorage.setItem('cosmic-theme', 'dark');
    document.documentElement.classList.add('dark');
  });
  await page.reload({ waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1200));

  await page.evaluate(() => {
    document.querySelector('#how-it-works').scrollIntoView({ behavior: 'instant' });
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'step2_desktop_dark_02_pinned_story.png'),
  });
  console.log('Captured step2_desktop_dark_02_pinned_story.png');

  // Scroll to Texture in dark mode
  await page.evaluate(() => {
    window.scrollBy({ top: 2200, behavior: 'instant' });
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'step2_desktop_dark_06_texture.png'),
  });
  console.log('Captured step2_desktop_dark_06_texture.png');

  await browser.close();
  console.log('Gallery capture complete!');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
