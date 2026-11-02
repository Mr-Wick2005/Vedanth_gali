import puppeteer from 'puppeteer-core'
import path from 'path'

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'

async function check() {
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
    await new Promise((r) => setTimeout(r, 2500))

    const audit = await page.evaluate(() => {
      const portal = document.querySelector('nextjs-portal')
      let issuesText = 'No issues'
      let hasIssues = false
      if (portal && portal.shadowRoot) {
        const errorPill = portal.shadowRoot.querySelector('[data-next-badge][data-error="true"]')
        if (errorPill) {
          hasIssues = true
          issuesText = errorPill.textContent || 'Issues found'
        }
      }
      return {
        windowWidth: window.innerWidth,
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
        bodyScrollWidth: document.body.scrollWidth,
        hasHorizontalScroll: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        hasIssues,
        issuesText,
      }
    })

    console.log('AUDIT_RESULT:', JSON.stringify(audit))

    await page.screenshot({ path: path.resolve('docs', 'screenshots', 'hero-1920-final.png') })
    console.log('Screenshot saved to docs/screenshots/hero-1920-final.png')
  } finally {
    await browser.close()
  }
}

check().catch(console.error)
