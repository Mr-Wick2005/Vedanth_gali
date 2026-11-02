import puppeteer from 'puppeteer-core'
import path from 'path'

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'

async function checkFullPage() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  try {
    const page = await browser.newPage()
    await page.setViewport({ width: 1920, height: 1080 })
    await page.evaluateOnNewDocument(() => {
      sessionStorage.setItem('vg_preloader_seen', 'true')
    })

    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 20000 })
    await new Promise((r) => setTimeout(r, 2000))

    await page.screenshot({ path: path.resolve('docs', 'screenshots', 'fullpage-1920.png'), fullPage: true })
    console.log('Full-page screenshot saved to docs/screenshots/fullpage-1920.png')
  } finally {
    await browser.close()
  }
}

checkFullPage().catch(console.error)
