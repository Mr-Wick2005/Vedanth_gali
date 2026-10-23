import puppeteer from 'puppeteer-core'
import path from 'path'

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const OUT_DIR = path.resolve('docs', 'screenshots')

const VIEWPORTS = [
  { name: 'hero-1440.png', width: 1440, height: 900 },
  { name: 'hero-768.png', width: 768, height: 1024 },
  { name: 'hero-375.png', width: 375, height: 812 },
]

async function run() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  })

  try {
    for (const vp of VIEWPORTS) {
      console.log(`Capturing: ${vp.width}x${vp.height} -> ${vp.name}`)
      const page = await browser.newPage()
      await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 1.5 })
      
      // Set sessionStorage before page scripts run so preloader is skipped immediately
      await page.evaluateOnNewDocument(() => {
        sessionStorage.setItem('vg_preloader_seen', 'true')
      })

      await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 15000 })
      await new Promise((r) => setTimeout(r, 1600))

      const targetPath = path.join(OUT_DIR, vp.name)
      await page.screenshot({ path: targetPath, fullPage: false })
      console.log(`Saved: ${targetPath}`)
      await page.close()
    }
  } catch (err) {
    console.error('Error:', err)
  } finally {
    await browser.close()
  }
}

run()
