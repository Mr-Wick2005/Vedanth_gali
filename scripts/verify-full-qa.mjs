import puppeteer from 'puppeteer-core'
import path from 'path'
import fs from 'fs'

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'

const VIEWPORTS = [
  { name: 'mobile-375', width: 375, height: 812 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'laptop-1280', width: 1280, height: 800 },
  { name: 'desktop-1920', width: 1920, height: 1080 },
]

async function runQA() {
  const outDir = path.resolve('docs', 'screenshots', 'qa-rebuild')
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true })
  }

  console.log('🚀 Starting Full Visual QA & Responsive Verification...')

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  const auditReport = []

  try {
    // 1. Responsive Viewport Captures
    for (const vp of VIEWPORTS) {
      const page = await browser.newPage()
      await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 1 })
      
      const consoleErrors = []
      page.on('console', (msg) => {
        if (msg.type() === 'error') consoleErrors.push(msg.text())
      })

      await page.evaluateOnNewDocument(() => {
        sessionStorage.setItem('vg_preloader_seen', 'true')
      })

      console.log(`📸 Capturing ${vp.name} (${vp.width}x${vp.height})...`)
      await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 })
      await new Promise((r) => setTimeout(r, 2000))

      const metrics = await page.evaluate(() => {
        const clientW = document.documentElement.clientWidth
        const scrollW = document.documentElement.scrollWidth
        return {
          clientWidth: clientW,
          scrollWidth: scrollW,
          hasHorizontalOverflow: scrollW > clientW,
          overflowDelta: scrollW - clientW,
        }
      })

      const screenshotPath = path.join(outDir, `${vp.name}.png`)
      await page.screenshot({ path: screenshotPath, fullPage: false })
      console.log(`✅ Saved ${vp.name}.png`)

      // If desktop-1920, capture section zooms
      if (vp.name === 'desktop-1920') {
        // Hero
        const heroShot = path.join(outDir, 'hero-desktop-1920.png')
        await page.screenshot({ path: heroShot, clip: { x: 0, y: 0, width: 1920, height: 960 } })
        
        // Work
        const workEl = await page.$('#work')
        if (workEl) {
          await workEl.screenshot({ path: path.join(outDir, 'work-section.png') })
        }

        // Leadership
        const leadEl = await page.$('#leadership')
        if (leadEl) {
          await leadEl.screenshot({ path: path.join(outDir, 'leadership-section.png') })
        }

        // Credentials
        const credEl = await page.$('#credentials')
        if (credEl) {
          await credEl.screenshot({ path: path.join(outDir, 'credentials-section.png') })
        }
      }

      auditReport.push({
        viewport: vp.name,
        width: vp.width,
        height: vp.height,
        ...metrics,
        consoleErrorsCount: consoleErrors.length,
        consoleErrors: consoleErrors.slice(0, 5),
      })

      await page.close()
    }

    // 2. Case study page check
    const csPage = await browser.newPage()
    await csPage.setViewport({ width: 1280, height: 800 })
    console.log(`📸 Capturing Case Study (/work/the-rkive)...`)
    await csPage.goto('http://localhost:3000/work/the-rkive', { waitUntil: 'networkidle2', timeout: 25000 })
    await new Promise((r) => setTimeout(r, 1500))
    await csPage.screenshot({ path: path.join(outDir, 'case-study-the-rkive.png') })
    await csPage.close()

    console.log('\n📊 FULL QA AUDIT SUMMARY:')
    console.table(auditReport)

    const allPassed = auditReport.every((r) => !r.hasHorizontalOverflow && r.consoleErrorsCount === 0)
    if (allPassed) {
      console.log('\n🎉 ALL RESPONSIVE & CONSOLE ERROR CHECKS PASSED WITH ZERO OVERFLOW!')
    } else {
      console.log('\n⚠️ Some issues detected, inspect table above.')
    }
  } catch (err) {
    console.error('QA script error:', err)
  } finally {
    await browser.close()
  }
}

runQA()
