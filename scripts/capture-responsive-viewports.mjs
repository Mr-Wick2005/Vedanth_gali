import puppeteer from 'puppeteer-core'
import path from 'path'
import fs from 'fs'

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'

const VIEWPORTS = [
  { name: 'mobile-375', width: 375, height: 812 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'laptop-1440', width: 1440, height: 900 },
  { name: 'desktop-1920', width: 1920, height: 1080 },
]

async function capture() {
  const outDir = path.resolve('docs', 'screenshots', 'phase3')
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true })
  }

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  const results = []

  try {
    for (const vp of VIEWPORTS) {
      const page = await browser.newPage()
      await page.setViewport({ width: vp.width, height: vp.height })
      await page.evaluateOnNewDocument(() => {
        sessionStorage.setItem('vg_preloader_seen', 'true')
      })

      await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 25000 })
      await new Promise((r) => setTimeout(r, 2000))

      const metrics = await page.evaluate(() => {
        return {
          windowWidth: window.innerWidth,
          clientWidth: document.documentElement.clientWidth,
          scrollWidth: document.documentElement.scrollWidth,
          bodyScrollWidth: document.body.scrollWidth,
          hasHorizontalScroll: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        }
      })

      const screenshotPath = path.join(outDir, `${vp.name}.png`)
      await page.screenshot({ path: screenshotPath, fullPage: false })
      console.log(`Saved screenshot for ${vp.name}: ${screenshotPath}`)

      results.push({ viewport: vp.name, ...metrics })
      await page.close()
    }

    console.log('RESPONSIVE_AUDIT_RESULTS:', JSON.stringify(results, null, 2))
  } finally {
    await browser.close()
  }
}

capture().catch((err) => {
  console.error('Capture error:', err)
  process.exit(1)
})
