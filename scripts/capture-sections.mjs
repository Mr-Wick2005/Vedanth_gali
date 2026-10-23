import puppeteer from 'puppeteer-core'
import path from 'path'
import fs from 'fs'

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const OUT_DIR = path.resolve('docs', 'screenshots')

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true })
}

async function run() {
  console.log('Launching browser via puppeteer-core...')
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  })

  try {
    const page = await browser.newPage()
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1.5 })
    console.log('Navigating to http://localhost:3000 ...')
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 20000 })
    
    // Wait for preloader to finish
    await new Promise((r) => setTimeout(r, 2000))

    // Capture About section
    const aboutEl = await page.$('#about')
    if (aboutEl) {
      await aboutEl.screenshot({ path: path.join(OUT_DIR, 'section-about.png') })
      console.log('Captured About section')
    }

    // Capture Work section
    const workEl = await page.$('#work')
    if (workEl) {
      await workEl.screenshot({ path: path.join(OUT_DIR, 'section-work.png') })
      console.log('Captured Work section')
    }

    // Capture Tech Stack section
    const stackEl = await page.$('#stack')
    if (stackEl) {
      await stackEl.screenshot({ path: path.join(OUT_DIR, 'section-stack.png') })
      console.log('Captured Tech Stack section')
    }

    // Capture Certifications section
    const certEl = await page.$('#credentials')
    if (certEl) {
      await certEl.screenshot({ path: path.join(OUT_DIR, 'section-credentials.png') })
      console.log('Captured Credentials section')
    }

    await page.close()
  } catch (err) {
    console.error('Error during capture:', err)
  } finally {
    await browser.close()
    console.log('Browser closed.')
  }
}

run()
