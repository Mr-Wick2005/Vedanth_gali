import puppeteer from 'puppeteer-core'
import path from 'path'
import fs from 'fs'

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'

const SLUGS = [
  'the-rkive',
  'escape-placement-cell',
  'plant-leaf-disease-detection',
]

const VIEWPORTS = [
  { name: 'desktop-1920', width: 1920, height: 1080 },
  { name: 'mobile-375', width: 375, height: 812 },
]

async function capture() {
  const outDir = path.resolve('docs', 'screenshots', 'phase4')
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true })
  }

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  const auditLog = []

  try {
    for (const slug of SLUGS) {
      for (const vp of VIEWPORTS) {
        const page = await browser.newPage()
        await page.setViewport({ width: vp.width, height: vp.height })

        const url = `http://localhost:3000/work/${slug}`
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 25000 })
        await new Promise((r) => setTimeout(r, 2000))

        const metrics = await page.evaluate(() => {
          return {
            title: document.title,
            clientWidth: document.documentElement.clientWidth,
            scrollWidth: document.documentElement.scrollWidth,
            hasHorizontalScroll: document.documentElement.scrollWidth > document.documentElement.clientWidth,
          }
        })

        const shotName = `${slug}-${vp.name}.png`
        const shotPath = path.join(outDir, shotName)
        await page.screenshot({ path: shotPath, fullPage: false })
        console.log(`Captured ${shotName}: ${shotPath}`)

        auditLog.push({ slug, viewport: vp.name, ...metrics })
        await page.close()
      }
    }

    console.log('CASE_STUDIES_AUDIT:', JSON.stringify(auditLog, null, 2))
  } finally {
    await browser.close()
  }
}

capture().catch((err) => {
  console.error('Case study capture error:', err)
  process.exit(1)
})
