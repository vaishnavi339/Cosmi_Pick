import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

interface PageMetrics {
  route: string;
  viewport: 'desktop' | 'mobile';
  fcp: number;
  lcp: number;
  cls: number;
  tbt: number;
  scriptDurationMs: number;
  layoutDurationMs: number;
  taskDurationMs: number;
  longTasksCount: number;
  maxLongTaskMs: number;
  jsHeapUsedMB: number;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function auditPage(
  browser: any,
  url: string,
  routeLabel: string,
  isMobile: boolean,
  actionBeforeAudit?: (page: any) => Promise<void>
): Promise<PageMetrics> {
  const page = await browser.newPage();
  const client = await page.target().createCDPSession();

  // Enable Performance domain
  await client.send('Performance.enable');

  if (isMobile) {
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    // Emulate 4x CPU slowdown for mobile
    await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  } else {
    await page.setViewport({ width: 1440, height: 900 });
    await client.send('Emulation.setCPUThrottlingRate', { rate: 1 });
  }

  // Inject Web Vitals observer before page load
  await page.evaluateOnNewDocument(() => {
    (window as any).__vitals = {
      fcp: 0,
      lcp: 0,
      cls: 0,
      longTasks: [] as number[],
      tbt: 0,
    };

    // FCP Observer
    try {
      const paintObs = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            (window as any).__vitals.fcp = entry.startTime;
          }
        }
      });
      paintObs.observe({ type: 'paint', buffered: true });
    } catch {}

    // LCP Observer
    try {
      const lcpObs = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          (window as any).__vitals.lcp = lastEntry.startTime;
        }
      });
      lcpObs.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch {}

    // CLS Observer
    try {
      const clsObs = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            (window as any).__vitals.cls += (entry as any).value;
          }
        }
      });
      clsObs.observe({ type: 'layout-shift', buffered: true });
    } catch {}

    // Long Tasks Observer (for TBT)
    try {
      const ltObs = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          const duration = entry.duration;
          (window as any).__vitals.longTasks.push(duration);
          if (duration > 50) {
            (window as any).__vitals.tbt += duration - 50;
          }
        }
      });
      ltObs.observe({ type: 'longtask', buffered: true });
    } catch {}
  });

  await page.goto(url, { waitUntil: 'networkidle0', timeout: 35000 });
  await sleep(1500);

  if (actionBeforeAudit) {
    await actionBeforeAudit(page);
    await sleep(2000);
  }

  // Retrieve in-page vitals
  const vitals = await page.evaluate(() => {
    return (window as any).__vitals || { fcp: 0, lcp: 0, cls: 0, tbt: 0, longTasks: [] };
  });

  // Retrieve CDP Performance Metrics
  const cdpMetrics = await client.send('Performance.getMetrics');
  const metricMap: Record<string, number> = {};
  for (const m of cdpMetrics.metrics) {
    metricMap[m.name] = m.value;
  }

  const scriptDurationMs = Math.round((metricMap['ScriptDuration'] || 0) * 1000);
  const layoutDurationMs = Math.round((metricMap['LayoutDuration'] || 0) * 1000);
  const taskDurationMs = Math.round((metricMap['TaskDuration'] || 0) * 1000);
  const jsHeapUsedMB = Math.round(((metricMap['JSHeapUsedSize'] || 0) / (1024 * 1024)) * 10) / 10;

  const longTasks: number[] = vitals.longTasks || [];
  const maxLongTaskMs = longTasks.length > 0 ? Math.round(Math.max(...longTasks)) : 0;

  await page.close();

  return {
    route: routeLabel,
    viewport: isMobile ? 'mobile' : 'desktop',
    fcp: Math.round(vitals.fcp),
    lcp: Math.round(vitals.lcp),
    cls: Math.round(vitals.cls * 1000) / 1000,
    tbt: Math.round(vitals.tbt),
    scriptDurationMs,
    layoutDurationMs,
    taskDurationMs,
    longTasksCount: longTasks.length,
    maxLongTaskMs,
    jsHeapUsedMB,
  };
}

async function main() {
  console.log('--- Starting CosmicPick Baseline Performance Audit ---');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream'],
  });

  const results: PageMetrics[] = [];

  try {
    // 1. Landing Page (Desktop)
    console.log('Auditing [Desktop] Landing Page (/) ...');
    const dHome = await auditPage(browser, 'http://localhost:3000/', '/', false);
    results.push(dHome);

    // 2. Landing Page (Mobile)
    console.log('Auditing [Mobile] Landing Page (/) ...');
    const mHome = await auditPage(browser, 'http://localhost:3000/', '/', true);
    results.push(mHome);

    // 3. Scan Page (Desktop)
    console.log('Auditing [Desktop] Scan Page (/scan) ...');
    const dScan = await auditPage(browser, 'http://localhost:3000/scan', '/scan', false);
    results.push(dScan);

    // 4. Scan Page (Mobile)
    console.log('Auditing [Mobile] Scan Page (/scan) ...');
    const mScan = await auditPage(browser, 'http://localhost:3000/scan', '/scan', true);
    results.push(mScan);

    // 5. Results Page (Desktop)
    console.log('Auditing [Desktop] Results Page ...');
    const dResults = await auditPage(browser, 'http://localhost:3000/scan', 'Results Page', false, async (page) => {
      // Complete scan steps quickly to reach results
      try {
        await page.click('#consent-checkbox');
        await sleep(200);
        await page.click('#consent-continue-btn');
        await sleep(1200);

        await page.waitForSelector('#manual-capture-btn', { timeout: 10000 });
        await page.click('#manual-capture-btn');
        await sleep(1200);

        await page.waitForSelector('#confirm-traits-btn', { timeout: 10000 });
        await page.click('#confirm-traits-btn');
        await sleep(800);

        await page.waitForSelector('#generate-picks-btn', { timeout: 10000 });
        await page.click('#generate-picks-btn');
        await page.waitForSelector('#product-lookup-input', { timeout: 25000 });
      } catch (err) {
        console.error('Error navigating to results page:', err);
      }
    });
    results.push(dResults);

    // 6. Results Page (Mobile)
    console.log('Auditing [Mobile] Results Page ...');
    const mResults = await auditPage(browser, 'http://localhost:3000/scan', 'Results Page', true, async (page) => {
      try {
        await page.click('#consent-checkbox');
        await sleep(200);
        await page.click('#consent-continue-btn');
        await sleep(1200);

        await page.waitForSelector('#manual-capture-btn', { timeout: 10000 });
        await page.click('#manual-capture-btn');
        await sleep(1200);

        await page.waitForSelector('#confirm-traits-btn', { timeout: 10000 });
        await page.click('#confirm-traits-btn');
        await sleep(800);

        await page.waitForSelector('#generate-picks-btn', { timeout: 10000 });
        await page.click('#generate-picks-btn');
        await page.waitForSelector('#product-lookup-input', { timeout: 25000 });
      } catch (err) {
        console.error('Error navigating to mobile results page:', err);
      }
    });
    results.push(mResults);

    console.log('\n===============================================================');
    console.log('BASELINE PERFORMANCE MEASUREMENTS (PRODUCTION BUILD)');
    console.log('===============================================================');
    console.table(results);

    fs.writeFileSync(
      path.join(process.cwd(), 'baseline-metrics.json'),
      JSON.stringify(results, null, 2),
      'utf-8'
    );
  } catch (err) {
    console.error('Error during performance measurement:', err);
  } finally {
    await browser.close();
  }
}

main().catch(console.error);
