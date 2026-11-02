import puppeteer from 'puppeteer-core'
import fs from 'node:fs'
import path from 'node:path'

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'

async function run() {
  const dir = path.resolve('docs/screenshots/phase7')
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

  // 1. Visit homepage and verify project card view-transition-name
  console.log('Navigating to http://localhost:3000/#work...')
  await page.goto('http://localhost:3000/#work', { waitUntil: 'networkidle2', timeout: 30000 })
  await new Promise(r => setTimeout(r, 1500))

  const homepageVt = await page.evaluate(() => {
    const titles = Array.from(document.querySelectorAll('h3')).map(h => ({
      text: h.textContent.trim(),
      vt: getComputedStyle(h).viewTransitionName
    }))
    const covers = Array.from(document.querySelectorAll('[style*="view-transition-name"]')).map(el => ({
      tag: el.tagName,
      vt: getComputedStyle(el).viewTransitionName
    }))
    return { titles, covers }
  })
  console.log('Homepage VT Names:', JSON.stringify(homepageVt, null, 2))
  await page.screenshot({ path: path.join(dir, 'work-cards-vt.png') })

  // 2. Navigate to /work/the-rkive
  console.log('Navigating to http://localhost:3000/work/the-rkive...')
  await page.goto('http://localhost:3000/work/the-rkive', { waitUntil: 'networkidle2', timeout: 30000 })
  await new Promise(r => setTimeout(r, 1500))

  const caseStudyVt = await page.evaluate(() => {
    const h1 = document.querySelector('h1')
    const cover = document.querySelector('[style*="view-transition-name:project-cover"]') || document.querySelector('[style*="view-transition-name: project-cover"]')
    return {
      h1Text: h1 ? h1.textContent.trim() : null,
      h1VT: h1 ? getComputedStyle(h1).viewTransitionName : null,
      coverVT: cover ? getComputedStyle(cover).viewTransitionName : null
    }
  })
  console.log('Case Study VT Names:', JSON.stringify(caseStudyVt, null, 2))
  await page.screenshot({ path: path.join(dir, 'case-study-hero-vt.png') })

  // 3. Mobile Viewport 3D Canvas Throttling Check
  console.log('Testing mobile viewport (375x812)...')
  await page.setViewport({ width: 375, height: 812 })
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 })
  await new Promise(r => setTimeout(r, 1200))
  await page.screenshot({ path: path.join(dir, 'mobile-hero-fallback.png') })
  console.log('Saved mobile viewport screenshot')

  await browser.close()
  console.log('Phase 7 verification completed successfully!')
}

run().catch(err => {
  console.error(err)
  process.exit(1)
})
