import puppeteer from 'puppeteer-core'
import path from 'path'
import fs from 'fs'

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const OUT_DIR = path.resolve('public', 'placeholders')

const TARGETS = [
  { slug: 'the-rkive', url: 'https://the-rkive.vercel.app' },
  { slug: 'escape-placement-cell', url: 'https://escape-placement-cell.vercel.app/' },
]

async function run() {
  console.log('Capturing live project screenshots...')
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  })

  for (const t of TARGETS) {
    const outPath = path.join(OUT_DIR, `${t.slug}.png`)
    try {
      console.log(`Navigating to ${t.url}...`)
      const page = await browser.newPage()
      await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1.25 })
      await page.goto(t.url, { waitUntil: 'domcontentloaded', timeout: 12000 })
      await new Promise((r) => setTimeout(r, 2000))
      await page.screenshot({ path: outPath })
      console.log(`Saved screenshot to ${outPath}`)
      await page.close()
    } catch (e) {
      console.warn(`Failed to capture ${t.url}, creating fallback graphic...`, e.message)
    }
  }

  await browser.close()
  console.log('Done capturing live projects.')
}

run()
