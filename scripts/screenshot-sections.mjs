import puppeteer from 'puppeteer-core'

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'

async function screenshotAllSections() {
  const browser = await puppeteer.launch({ executablePath: EDGE_PATH, headless: true })
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' })
  await new Promise(r => setTimeout(r, 2000))

  const sectionIds = ['about', 'work', 'stack', 'leadership', 'credentials']

  for (const id of sectionIds) {
    const el = await page.$(`#${id}`)
    if (el) {
      await el.screenshot({ path: `docs/screenshots/qa-rebuild/section-${id}.png` })
      console.log(`Saved section-${id}.png`)
    }
  }

  const footer = await page.$('footer')
  if (footer) {
    await footer.screenshot({ path: `docs/screenshots/qa-rebuild/section-footer.png` })
    console.log(`Saved section-footer.png`)
  }

  await browser.close()
}

screenshotAllSections().catch(console.error)
