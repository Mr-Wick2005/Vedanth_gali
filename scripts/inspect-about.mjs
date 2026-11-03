import puppeteer from 'puppeteer-core'

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'

async function inspectAboutLayout() {
  const browser = await puppeteer.launch({ executablePath: EDGE_PATH, headless: true })
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' })
  await new Promise(r => setTimeout(r, 2000))

  const metrics = await page.evaluate(() => {
    const aboutSection = document.getElementById('about')
    if (!aboutSection) return { error: 'About section not found' }

    const leftCol = aboutSection.querySelector('div.lg\\:col-span-7')
    const rightCol = aboutSection.querySelector('div.lg\\:col-span-5')
    const terminalWindow = leftCol ? leftCol.firstElementChild : null
    const dossierCard = rightCol ? rightCol.querySelector('div.rounded-2xl') : null
    const disciplinesGrid = leftCol ? leftCol.lastElementChild : null

    return {
      leftColRect: leftCol ? leftCol.getBoundingClientRect() : null,
      rightColRect: rightCol ? rightCol.getBoundingClientRect() : null,
      terminalTop: terminalWindow ? terminalWindow.getBoundingClientRect().top : null,
      dossierTop: dossierCard ? dossierCard.getBoundingClientRect().top : null,
      topDifference: dossierCard && terminalWindow ? dossierCard.getBoundingClientRect().top - terminalWindow.getBoundingClientRect().top : null,
      leftTotalHeight: leftCol ? leftCol.getBoundingClientRect().height : null,
      dossierHeight: dossierCard ? dossierCard.getBoundingClientRect().height : null,
      heightDifference: dossierCard && leftCol ? dossierCard.getBoundingClientRect().height - leftCol.getBoundingClientRect().height : null,
      terminalHeight: terminalWindow ? terminalWindow.getBoundingClientRect().height : null,
      disciplinesHeight: disciplinesGrid ? disciplinesGrid.getBoundingClientRect().height : null,
    }
  })

  console.log('About section metrics:', metrics)
  await page.screenshot({ path: 'docs/screenshots/qa-rebuild/about-section-inspection.png' })
  await browser.close()
}

inspectAboutLayout().catch(console.error)
