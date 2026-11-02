import puppeteer from 'puppeteer-core'
import path from 'node:path'

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'

async function run() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 1200, height: 630 })

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1200px;
    height: 630px;
    background-color: #060611;
    color: #ffffff;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 70px 80px;
    position: relative;
    overflow: hidden;
  }
  .bg-glow-1 {
    position: absolute;
    top: -100px;
    right: -100px;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(139, 92, 246, 0.22) 0%, transparent 70%);
    border-radius: 50%;
  }
  .bg-glow-2 {
    position: absolute;
    bottom: -150px;
    left: -150px;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 70%);
    border-radius: 50%;
  }
  .grid-pattern {
    position: absolute;
    inset: 0;
    background-image: radial-gradient(#8b5cf6 1px, transparent 1px);
    background-size: 24px 24px;
    opacity: 0.12;
  }
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 14px;
    border-radius: 9999px;
    background: rgba(139, 92, 246, 0.12);
    border: 1px solid rgba(139, 92, 246, 0.35);
    color: #c4b5fd;
    font-size: 13px;
    font-weight: 600;
    font-family: monospace;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    width: fit-content;
  }
  .title {
    font-size: 64px;
    font-weight: 800;
    line-height: 1.05;
    letter-spacing: -0.03em;
    text-transform: uppercase;
    margin-top: 24px;
  }
  .title span {
    color: #a78bfa;
  }
  .subtitle {
    font-size: 22px;
    color: #94a3b8;
    line-height: 1.5;
    margin-top: 18px;
    max-width: 850px;
  }
  .footer-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding-top: 28px;
    z-index: 10;
  }
  .tags {
    display: flex;
    gap: 10px;
  }
  .tag {
    padding: 4px 12px;
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.12);
    font-family: monospace;
    font-size: 12px;
    color: #cbd5e1;
  }
  .domain {
    font-family: monospace;
    font-size: 14px;
    color: #a78bfa;
    font-weight: 600;
  }
</style>
</head>
<body>
  <div class="bg-glow-1"></div>
  <div class="bg-glow-2"></div>
  <div class="grid-pattern"></div>

  <div style="z-index: 10;">
    <div class="badge">
      <span>●</span> Vedanth Gali • Engineering Portfolio
    </div>
    <h1 class="title">Frontend &<br><span>Full-Stack</span> Developer</h1>
    <p class="subtitle">Building scalable web architectures, high-performance canvas systems, and deep learning platforms in Mumbai.</p>
  </div>

  <div class="footer-row">
    <div class="tags">
      <div class="tag">Next.js 16</div>
      <div class="tag">React 19</div>
      <div class="tag">TypeScript</div>
      <div class="tag">Supabase</div>
      <div class="tag">Tailwind CSS</div>
    </div>
    <div class="domain">vedanthgali.dev</div>
  </div>
</body>
</html>
`
  await page.setContent(html, { waitUntil: 'load' })
  await page.screenshot({ path: path.resolve('public/og-image.png') })
  console.log('Saved public/og-image.png (1200x630)')
  await browser.close()
}

run().catch(err => {
  console.error(err)
  process.exit(1)
})
