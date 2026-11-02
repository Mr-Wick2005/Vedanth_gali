import puppeteer from 'puppeteer-core'
import path from 'path'

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'

async function captureSections() {
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

    const sections = ['about', 'work', 'stack', 'leadership', 'credentials', 'contact']
    for (const sec of sections) {
      const el = await page.$(`#${sec}`)
      if (el) {
        await el.screenshot({ path: path.resolve('docs', 'screenshots', `section-${sec}.png`) })
        console.log(`Captured #${sec}`)
      }
    }
  } finally {
    await browser.close()
  }
}

captureSections().catch(console.error)
