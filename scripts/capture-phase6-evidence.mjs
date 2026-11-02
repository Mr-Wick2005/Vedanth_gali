import puppeteer from 'puppeteer-core'
import fs from 'node:fs'
import path from 'node:path'

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'

async function run() {
  const dir = path.resolve('docs/screenshots/phase6')
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

  const consoleErrors = []
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text())
    }
  })

  console.log('Navigating to http://localhost:3000/admin/login...')
  await page.goto('http://localhost:3000/admin/login', { waitUntil: 'networkidle2', timeout: 30000 })
  await new Promise(r => setTimeout(r, 1500))

  await page.screenshot({ path: path.join(dir, 'admin-login.png') })
  console.log('Saved docs/screenshots/phase6/admin-login.png')

  console.log('Navigating to http://localhost:3000...')
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 })
  await new Promise(r => setTimeout(r, 1500))

  await page.screenshot({ path: path.join(dir, 'public-homepage.png') })
  console.log('Saved docs/screenshots/phase6/public-homepage.png')

  await browser.close()

  if (consoleErrors.length > 0) {
    console.log('Observed console errors:', consoleErrors)
  } else {
    console.log('Zero console errors detected!')
  }

  console.log('Phase 6 verification completed successfully!')
}

run().catch(err => {
  console.error(err)
  process.exit(1)
})
