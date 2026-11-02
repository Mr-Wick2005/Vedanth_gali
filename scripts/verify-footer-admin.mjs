import puppeteer from 'puppeteer-core';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function testFooter() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });

  const adminLink = await page.$('footer a[href="/admin"]');
  if (adminLink) {
    const text = await page.evaluate(el => el.textContent, adminLink);
    const href = await page.evaluate(el => el.getAttribute('href'), adminLink);
    console.log('SUCCESS: Found admin link in footer!');
    console.log('Text:', text.trim());
    console.log('Href:', href);
  } else {
    console.error('FAILURE: Admin link not found in footer');
  }

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'docs/screenshots/footer-admin-link.png' });
  console.log('Screenshot saved to docs/screenshots/footer-admin-link.png');
  await browser.close();
}

testFooter().catch(console.error);
