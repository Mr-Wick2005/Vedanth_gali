import puppeteer from 'puppeteer-core';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function testFixes() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });

  // 1. Screenshot Hero Section
  const heroEl = await page.$('section');
  if (heroEl) {
    await heroEl.screenshot({ path: 'docs/screenshots/hero-fixed.png' });
    console.log('Saved docs/screenshots/hero-fixed.png');
  }

  // 2. Screenshot Credentials Section
  const certsEl = await page.$('#credentials');
  if (certsEl) {
    await certsEl.scrollIntoView();
    await new Promise(r => setTimeout(r, 600));
    await certsEl.screenshot({ path: 'docs/screenshots/credentials-fixed.png' });
    console.log('Saved docs/screenshots/credentials-fixed.png');
  }

  await browser.close();
}

testFixes().catch(console.error);
