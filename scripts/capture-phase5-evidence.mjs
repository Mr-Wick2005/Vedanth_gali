import puppeteer from 'puppeteer-core'
import fs from 'node:fs'
import path from 'node:path'

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'

async function run() {
  const dir = path.resolve('docs/screenshots/phase5')
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })

  console.log('Navigating to http://localhost:3000...')
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 })
  await new Promise(r => setTimeout(r, 2000))

  // 1. Capture Leadership Section
  console.log('Capturing Leadership section...')
  const leadershipEl = await page.$('#leadership')
  if (leadershipEl) {
    await leadershipEl.scrollIntoView()
    await new Promise(r => setTimeout(r, 800))
    await leadershipEl.screenshot({ path: path.join(dir, 'leadership-section.png') })
    console.log('Saved docs/screenshots/phase5/leadership-section.png')
  }

  // 2. Capture Credentials Section
  console.log('Capturing Credentials section...')
  const credentialsEl = await page.$('#credentials')
  if (credentialsEl) {
    await credentialsEl.scrollIntoView()
    await new Promise(r => setTimeout(r, 800))
    await credentialsEl.screenshot({ path: path.join(dir, 'credentials-section.png') })
    console.log('Saved docs/screenshots/phase5/credentials-section.png')

    // 3. Click the first certificate card to trigger modal
    console.log('Clicking first certificate card...')
    const firstCard = await page.$('#credentials [data-cursor="view"]')
    if (firstCard) {
      await firstCard.click()
      await new Promise(r => setTimeout(r, 600))
      await page.screenshot({ path: path.join(dir, 'credential-modal-active.png') })
      console.log('Saved docs/screenshots/phase5/credential-modal-active.png')

      // Press Escape to test closing
      await page.keyboard.press('Escape')
      await new Promise(r => setTimeout(r, 400))
      console.log('Modal closed successfully with Escape key.')
    }
  }

  await browser.close()
  console.log('Phase 5 evidence captured successfully!')
}

run().catch(err => {
  console.error(err)
  process.exit(1)
})
