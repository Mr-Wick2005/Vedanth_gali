import puppeteer from 'puppeteer-core'

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'

async function testAboutSymmetry() {
  const browser = await puppeteer.launch({ executablePath: EDGE_PATH, headless: true })
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' })
  await new Promise(r => setTimeout(r, 2000))

  // Apply symmetrical styling to About section
  await page.evaluate(() => {
    const aboutSection = document.getElementById('about')
    if (!aboutSection) return

    const grid = aboutSection.querySelector('div.grid.items-start')
    if (grid) {
      grid.className = 'grid items-stretch gap-6 lg:grid-cols-12 lg:gap-8'
    }

    const leftCol = aboutSection.querySelector('div.lg\\:col-span-7')
    if (leftCol) {
      leftCol.className = 'flex flex-col justify-between gap-4 lg:col-span-7 h-full'
      const terminal = leftCol.firstElementChild
      if (terminal) {
        terminal.className = terminal.className + ' flex-1 flex flex-col'
      }
    }

    const rightCol = aboutSection.querySelector('div.lg\\:col-span-5')
    if (rightCol) {
      rightCol.className = 'flex justify-center lg:col-span-5 lg:justify-end h-full'
      const tilt = rightCol.firstElementChild
      if (tilt) {
        tilt.className = 'w-full max-w-[380px] xl:max-w-[420px] h-full flex flex-col'
        const innerCard = tilt.firstElementChild
        if (innerCard) {
          innerCard.className = 'relative overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-[#10131d] via-[#0a0c14] to-[#05060a] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_25px_rgba(37,99,235,0.15)] h-full flex flex-col justify-between'
          // Adjust portrait box
          const portraitBox = innerCard.querySelector('div.aspect-square')
          if (portraitBox) {
            portraitBox.className = 'relative my-3 flex-1 min-h-[180px] max-h-[240px] w-full overflow-hidden rounded-xl border border-blue-500/20 bg-black flex items-center justify-center'
          }
        }
      }
    }
  })

  await new Promise(r => setTimeout(r, 600))

  const metrics = await page.evaluate(() => {
    const aboutSection = document.getElementById('about')
    const leftCol = aboutSection.querySelector('div.lg\\:col-span-7')
    const rightCol = aboutSection.querySelector('div.lg\\:col-span-5')
    const terminal = leftCol.firstElementChild
    const dossier = rightCol.querySelector('div.rounded-2xl')

    const tRect = terminal.getBoundingClientRect()
    const dRect = dossier.getBoundingClientRect()
    const lRect = leftCol.getBoundingClientRect()

    return {
      terminalTop: Math.round(tRect.top),
      dossierTop: Math.round(dRect.top),
      topDelta: Math.round(Math.abs(tRect.top - dRect.top)),
      leftHeight: Math.round(lRect.height),
      dossierHeight: Math.round(dRect.height),
      heightDelta: Math.round(Math.abs(lRect.height - dRect.height)),
      terminalBottom: Math.round(tRect.bottom),
      leftBottom: Math.round(lRect.bottom),
      dossierBottom: Math.round(dRect.bottom),
      bottomDelta: Math.round(Math.abs(lRect.bottom - dRect.bottom)),
    }
  })

  console.log('About symmetry metrics:', metrics)

  const el = await page.$('#about')
  if (el) {
    await el.screenshot({ path: 'docs/screenshots/qa-rebuild/about-symmetrical-test.png' })
  }

  await browser.close()
}

testAboutSymmetry().catch(console.error)
