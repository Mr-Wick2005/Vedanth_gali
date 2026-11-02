import puppeteer from 'puppeteer-core'

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'

async function run() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })

  console.log('Auditing Homepage SEO & A11y...')
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 })

  const homepageAudit = await page.evaluate(() => {
    // 1. Meta Tags
    const title = document.title
    const metaDesc = document.querySelector('meta[name="description"]')?.getAttribute('content')
    const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute('content')
    const ogImage = document.querySelector('meta[property="og:image"]')?.getAttribute('content')
    const twitterCard = document.querySelector('meta[name="twitter:card"]')?.getAttribute('content')

    // 2. JSON-LD
    const jsonLdScripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
    const parsedJsonLd = jsonLdScripts.map(s => {
      try { return JSON.parse(s.innerHTML) } catch { return null }
    })

    // 3. Accessibility checks
    const skipLink = document.querySelector('a[href="#main-content"]')
    const allImages = Array.from(document.querySelectorAll('img'))
    const imagesWithoutAlt = allImages.filter(img => !img.hasAttribute('alt') || img.getAttribute('alt') === '')
    const iconButtons = Array.from(document.querySelectorAll('button:not(:has(span:not(.sr-only)))'))
    const iconButtonsWithoutAria = iconButtons.filter(b => !b.hasAttribute('aria-label') && !b.hasAttribute('aria-labelledby'))

    return {
      title,
      metaDesc,
      ogTitle,
      ogImage,
      twitterCard,
      jsonLdTypes: parsedJsonLd.map(j => j?.['@type']),
      hasSkipLink: !!skipLink,
      totalImages: allImages.length,
      imagesWithoutAltCount: imagesWithoutAlt.length,
      iconButtonsWithoutAriaCount: iconButtonsWithoutAria.length
    }
  })

  console.log('Homepage Audit Results:', JSON.stringify(homepageAudit, null, 2))

  // 4. Case Study Audit
  console.log('\nAuditing Case Study /work/the-rkive...')
  await page.goto('http://localhost:3000/work/the-rkive', { waitUntil: 'networkidle2', timeout: 30000 })

  const caseStudyAudit = await page.evaluate(() => {
    const title = document.title
    const jsonLdScripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
    const parsedJsonLd = jsonLdScripts.map(s => {
      try { return JSON.parse(s.innerHTML) } catch { return null }
    })
    return {
      title,
      jsonLdTypes: parsedJsonLd.map(j => j?.['@type'])
    }
  })

  console.log('Case Study Audit Results:', JSON.stringify(caseStudyAudit, null, 2))

  // 5. Sitemap & Robots
  console.log('\nChecking /sitemap.xml and /robots.txt...')
  const sitemapRes = await page.goto('http://localhost:3000/sitemap.xml')
  const sitemapStatus = sitemapRes.status()
  const robotsRes = await page.goto('http://localhost:3000/robots.txt')
  const robotsStatus = robotsRes.status()

  console.log(`sitemap.xml HTTP Status: ${sitemapStatus}`)
  console.log(`robots.txt HTTP Status: ${robotsStatus}`)

  await browser.close()
  console.log('\nPhase 8 SEO & Accessibility Audit completed successfully!')
}

run().catch(err => {
  console.error(err)
  process.exit(1)
})
