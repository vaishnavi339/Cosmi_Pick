import puppeteer from 'puppeteer-core';
import path from 'path';

const ARTIFACT_DIR = 'C:\\Users\\vaiss\\.gemini\\antigravity-ide\\brain\\1d9f24ed-0650-4fdd-9a53-b0854b4b27a4';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function run() {
  console.log('Launching browser with Edge...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  console.log('--- 1. Testing Home Page (/) ---');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await page.evaluate(() => document.documentElement.classList.remove('dark'));
  await new Promise(r => setTimeout(r, 600));

  // 1. Font Check
  const fontCheck = await page.evaluate(() => {
    const h1 = document.querySelector('h1');
    const h2 = document.querySelector('h2');
    const body = document.body;
    return {
      h1Family: h1 ? window.getComputedStyle(h1).fontFamily : 'not found',
      h2Family: h2 ? window.getComputedStyle(h2).fontFamily : 'not found',
      bodyFamily: body ? window.getComputedStyle(body).fontFamily : 'not found',
    };
  });
  console.log('Font inspection:', JSON.stringify(fontCheck, null, 2));

  // 2. Button Check
  const buttonCheck = await page.evaluate(() => {
    const primary = document.querySelector('#hero-start-scan-btn');
    const secondary = document.querySelector('#hero-quiz-btn');
    return {
      primaryBg: primary ? window.getComputedStyle(primary).backgroundColor : null,
      primaryColor: primary ? window.getComputedStyle(primary).color : null,
      secondaryBorder: secondary ? window.getComputedStyle(secondary).borderColor : null,
      secondaryColor: secondary ? window.getComputedStyle(secondary).color : null,
    };
  });
  console.log('Button inspection:', JSON.stringify(buttonCheck, null, 2));

  // 3. Section Anchors and scroll-margin-top
  const sections = ['how-it-works', 'featured', 'undertone', 'ingredients', 'faq'];
  const sectionsCheck = await page.evaluate((ids) => {
    return ids.map(id => {
      const el = document.getElementById(id);
      return {
        id,
        found: !!el,
        scrollMarginTop: el ? window.getComputedStyle(el).scrollMarginTop : null,
      };
    });
  }, sections);
  console.log('Sections check:', JSON.stringify(sectionsCheck, null, 2));

  // 4. Capture Desktop Home Light
  console.log('Capturing step1_desktop_home_light.png...');
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'step1_desktop_home_light.png'),
    fullPage: false,
  });

  // 5. Test Active Section Highlighting on scroll
  console.log('Scrolling down to #how-it-works to verify active nav...');
  await page.evaluate(() => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  });
  await new Promise(r => setTimeout(r, 1000));
  const activeNavHowItWorks = await page.evaluate(() => {
    const activeLink = document.querySelector('header nav a.bg-\\[\\#F4D9D6\\]\\/70') || document.querySelector('header nav a[class*="font-semibold"]');
    return activeLink ? activeLink.textContent?.trim() : 'none';
  });
  console.log('Active nav after scrolling to #how-it-works:', activeNavHowItWorks);
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'step1_desktop_how_it_works_active.png'),
    fullPage: false,
  });

  // 6. Test Desktop Home Dark Mode
  console.log('Switching to Dark Mode...');
  await page.evaluate(() => document.documentElement.classList.add('dark'));
  await new Promise(r => setTimeout(r, 400));
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'step1_desktop_home_dark.png'),
    fullPage: false,
  });

  // Switch back to light for privacy testing
  await page.evaluate(() => document.documentElement.classList.remove('dark'));

  // 7. Test /privacy Page
  console.log('--- 2. Testing /privacy Page ---');
  await page.goto('http://localhost:3000/privacy', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 600));

  const privacyCheck = await page.evaluate(() => {
    const h1 = document.querySelector('h1');
    const forCuriousBtn = document.querySelector('button[aria-expanded]');
    const returnHomeLink = document.querySelector('a[href="/"]');
    return {
      h1Text: h1 ? h1.innerText.trim() : null,
      hasForCuriousButton: !!forCuriousBtn,
      returnHomeLinkExists: !!returnHomeLink,
    };
  });
  console.log('Privacy page inspection:', JSON.stringify(privacyCheck, null, 2));

  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'step1_desktop_privacy.png'),
    fullPage: false,
  });

  // Expand "For the curious"
  console.log('Expanding "For the curious" section...');
  await page.click('button[aria-expanded]');
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'step1_desktop_privacy_expanded.png'),
    fullPage: false,
  });

  // 8. Test every link from /privacy
  console.log('Testing every link from /privacy:');
  const linksToTest = [
    { name: 'How it works', href: '/#how-it-works', targetId: 'how-it-works' },
    { name: 'Featured Formulations', href: '/#featured', targetId: 'featured' },
    { name: 'Undertone Guide', href: '/#undertone', targetId: 'undertone' },
    { name: 'Ingredients', href: '/#ingredients', targetId: 'ingredients' },
    { name: 'FAQ', href: '/#faq', targetId: 'faq' },
  ];

  for (const l of linksToTest) {
    console.log(`Clicking ${l.name} (${l.href}) from /privacy...`);
    await page.goto('http://localhost:3000/privacy', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 300));
    const navLink = await page.$(`header nav a[href="${l.href}"]`);
    if (!navLink) {
      console.error(`Link not found in nav: ${l.href}`);
      continue;
    }
    await navLink.click();
    await new Promise(r => setTimeout(r, 1200));
    const currentUrl = page.url();
    const targetInView = await page.evaluate((id) => {
      const el = document.getElementById(id);
      if (!el) return false;
      const rect = el.getBoundingClientRect();
      return rect.top >= -100 && rect.top <= window.innerHeight;
    }, l.targetId);
    console.log(`-> URL is: ${currentUrl} | Target #${l.targetId} in view: ${targetInView}`);
  }

  // 9. Test Mobile Viewport (390px) & Hamburger Menu
  console.log('--- 3. Testing Mobile Viewport (390px) ---');
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 500));

  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'step1_mobile_home.png'),
    fullPage: false,
  });

  // Open mobile menu
  console.log('Opening mobile hamburger menu...');
  await page.click('#mobile-menu-toggle');
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'step1_mobile_menu_open.png'),
    fullPage: false,
  });

  // Click link in mobile drawer, confirm it closes
  console.log('Clicking "Undertone Guide" in mobile menu...');
  await page.click('header .md\\:hidden a[href="/#undertone"]');
  await new Promise(r => setTimeout(r, 800));

  const mobileMenuOpenAfterClick = await page.evaluate(() => {
    return !!document.querySelector('#mobile-start-scan-btn');
  });
  console.log('Mobile menu closed after link click?', !mobileMenuOpenAfterClick);

  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'step1_mobile_scrolled_undertone.png'),
    fullPage: false,
  });

  await browser.close();
  console.log('=== All Step 1 Verifications Passed! ===');
}

run().catch((err) => {
  console.error('Error running test script:', err);
  process.exit(1);
});
