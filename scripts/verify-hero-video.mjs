import puppeteer from 'puppeteer-core'

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'

const VIEWPORTS = [
  { name: 'mobile-375', width: 375, height: 812 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'laptop-1366', width: 1366, height: 700 },
  { name: 'laptop-1440', width: 1440, height: 800 },
  { name: 'desktop-1920', width: 1920, height: 1080 },
]

async function verifyAll() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  const results = []

  for (const vp of VIEWPORTS) {
    const page = await browser.newPage()
    await page.setViewport({ width: vp.width, height: vp.height })

    const errors = []
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text())
    })
    page.on('pageerror', err => errors.push(err.message))

    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' })
    // Wait for preloader to dismiss completely
    await new Promise(r => setTimeout(r, 2200))

    const metrics = await page.evaluate(() => {
      const doc = document.documentElement
      const nav = document.querySelector('header')
      const hero = document.querySelector('section')
      const heroContent = hero ? hero.querySelector('div.grid') : null
      const marquee = hero ? hero.lastElementChild : null

      const navRect = nav ? nav.getBoundingClientRect() : null
      const contentRect = heroContent ? heroContent.getBoundingClientRect() : null
      const heroRect = hero ? hero.getBoundingClientRect() : null

      return {
        clientWidth: doc.clientWidth,
        scrollWidth: doc.scrollWidth,
        hasHorizontalOverflow: doc.scrollWidth > doc.clientWidth,
        gapBelowNav: contentRect && navRect ? Math.round(contentRect.top - navRect.bottom) : null,
        heroHeight: heroRect ? Math.round(heroRect.height) : null,
        fitsInViewportWithoutScroll: heroRect ? heroRect.bottom <= window.innerHeight + 1 : false,
      }
    })

    await page.screenshot({ path: `docs/screenshots/qa-rebuild/hero-lifted-${vp.name}.png` })

    results.push({
      viewport: vp.name,
      ...metrics,
      errorsCount: errors.length,
    })

    await page.close()
  }

  console.table(results)
  await browser.close()
}

verifyAll().catch(console.error)
