import puppeteer from 'puppeteer-core';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function verifyAboutPortrait() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();

    // 1. Desktop 1920x1080
    await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });

    const aboutSection = await page.$('#about');
    if (!aboutSection) {
      console.error('About section not found!');
      return;
    }

    await page.evaluate(() => {
      document.querySelector('#about')?.scrollIntoView({ behavior: 'instant' });
    });
    await new Promise((r) => setTimeout(r, 1500));

    // Capture About section directly via element screenshot
    await aboutSection.screenshot({
      path: 'docs/screenshots/qa-rebuild/about-portrait-desktop-1920.png',
    });

    // 2. Laptop 1440x900
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
    await page.evaluate(() => {
      document.querySelector('#about')?.scrollIntoView({ behavior: 'instant' });
    });
    await new Promise((r) => setTimeout(r, 1000));

    const aboutSectionLaptop = await page.$('#about');
    await aboutSectionLaptop.screenshot({
      path: 'docs/screenshots/qa-rebuild/about-portrait-laptop-1440.png',
    });

    // 3. Mobile 375x812
    await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 2 });
    await page.evaluate(() => {
      document.querySelector('#about')?.scrollIntoView({ behavior: 'instant' });
    });
    await new Promise((r) => setTimeout(r, 1000));

    const aboutSectionMobile = await page.$('#about');
    await aboutSectionMobile.screenshot({
      path: 'docs/screenshots/qa-rebuild/about-portrait-mobile-375.png',
    });

    console.log('Element screenshots captured successfully!');
  } finally {
    await browser.close();
  }
}

verifyAboutPortrait().catch(console.error);
