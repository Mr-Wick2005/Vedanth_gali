// scripts/db-verify.mjs
// Verification script testing Supabase RLS policies using ONLY the anonymous publishable key.
// Checks public read access, unpublished draft isolation, mutation blocking, and bucket upload restrictions.

import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'
import path from 'node:path'

// Load environment variables from .env.local if present
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env.local')
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n')
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const [key, ...values] = trimmed.split('=')
      if (key && values.length > 0) {
        process.env[key.trim()] = values.join('=').trim()
      }
    }
  }
}

loadEnv()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabasePublishableKey) {
  console.error('\n❌ Missing Supabase credentials in environment or .env.local')
  console.error('Expected NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY\n')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: { persistSession: false },
})

const results = []

async function runTest(testName, testFn) {
  try {
    const outcome = await testFn()
    results.push({
      Test: testName,
      Status: outcome.pass ? 'PASS' : 'FAIL',
      Details: outcome.details || (outcome.pass ? 'Enforced correctly' : 'Violation detected'),
    })
  } catch (err) {
    results.push({
      Test: testName,
      Status: 'FAIL',
      Details: `Unexpected exception: ${err.message}`,
    })
  }
}

async function verifyAll() {
  console.log(`\n🔍 Running Supabase Security & RLS Verification...`)
  console.log(`Target: ${supabaseUrl}`)
  console.log(`Role: anon (publishable key only)\n`)

  // 1. Public Read: Profile
  await runTest('Public can read profile', async () => {
    const { data, error } = await supabase.from('profile').select('name, email').limit(1)
    if (error) return { pass: false, details: error.message }
    return { pass: Array.isArray(data) && data.length > 0, details: `Read ${data.length} row(s)` }
  })

  // 2. Public Read: Site Settings
  await runTest('Public can read site_settings', async () => {
    const { data, error } = await supabase.from('site_settings').select('seo_title').limit(1)
    if (error) return { pass: false, details: error.message }
    return { pass: Array.isArray(data) && data.length > 0, details: `Read ${data.length} row(s)` }
  })

  // 3. Public Read: Published Projects
  await runTest('Public can read published projects', async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('slug, title, is_published')
      .eq('is_published', true)
    if (error) return { pass: false, details: error.message }
    return { pass: Array.isArray(data) && data.length > 0, details: `Read ${data.length} published project(s)` }
  })

  // 4. Isolation: Anon CANNOT read unpublished draft projects
  await runTest('Anon cannot read unpublished draft projects', async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('slug, title, is_published')
      .eq('is_published', false)
    if (error) return { pass: false, details: error.message }
    const passed = Array.isArray(data) && data.length === 0
    return {
      pass: passed,
      details: passed ? '0 draft rows returned (RLS filtered)' : `LEAK: returned ${data.length} draft row(s)`,
    }
  })

  // 5. Public Read: Experience
  await runTest('Public can read published experience', async () => {
    const { data, error } = await supabase.from('experience').select('company, title').eq('is_published', true)
    if (error) return { pass: false, details: error.message }
    return { pass: Array.isArray(data) && data.length > 0, details: `Read ${data.length} row(s)` }
  })

  // 6. Public Read: Education
  await runTest('Public can read published education', async () => {
    const { data, error } = await supabase.from('education').select('institution, degree').eq('is_published', true)
    if (error) return { pass: false, details: error.message }
    return { pass: Array.isArray(data) && data.length > 0, details: `Read ${data.length} row(s)` }
  })

  // 7. Public Read: Certifications
  await runTest('Public can read published certifications', async () => {
    const { data, error } = await supabase.from('certifications').select('title, issuer').eq('is_published', true)
    if (error) return { pass: false, details: error.message }
    return { pass: Array.isArray(data) && data.length > 0, details: `Read ${data.length} row(s)` }
  })

  // 8. Public Read: Skills
  await runTest('Public can read published skills', async () => {
    const { data, error } = await supabase.from('skills').select('name, category').eq('is_published', true)
    if (error) return { pass: false, details: error.message }
    return { pass: Array.isArray(data) && data.length > 0, details: `Read ${data.length} skill(s)` }
  })

  // 9. Public Read: Social Links (including Phone)
  await runTest('Public can read published social_links', async () => {
    const { data, error } = await supabase.from('social_links').select('label, url').eq('is_published', true)
    if (error) return { pass: false, details: error.message }
    return { pass: Array.isArray(data) && data.length > 0, details: `Read ${data.length} link(s)` }
  })

  // 10. Security: Anon CANNOT read admin_users
  await runTest('Anon cannot read admin_users', async () => {
    const { data, error } = await supabase.from('admin_users').select('*')
    const passed = error !== null || (Array.isArray(data) && data.length === 0)
    return {
      pass: passed,
      details: passed ? 'Blocked by RLS' : `LEAK: returned ${data.length} admin rows`,
    }
  })

  // 11. Security: Anon CANNOT insert into profile
  await runTest('Anon cannot insert into profile', async () => {
    const { error } = await supabase.from('profile').insert({
      name: 'Attacker',
      headline: 'Hacker',
      short_bio: 'Bio',
      long_bio: 'Long bio',
      location: 'Unknown',
      email: 'hacker@example.com',
    })
    const passed = error !== null
    return {
      pass: passed,
      details: passed ? `Blocked by RLS (${error.code || error.message})` : 'FAILED: Anon insert succeeded!',
    }
  })

  // 12. Security: Anon CANNOT insert into projects
  await runTest('Anon cannot insert into projects', async () => {
    const { error } = await supabase.from('projects').insert({
      slug: 'malicious-project',
      title: 'Malicious',
      summary: 'Malicious summary',
    })
    const passed = error !== null
    return {
      pass: passed,
      details: passed ? `Blocked by RLS (${error.code || error.message})` : 'FAILED: Anon insert succeeded!',
    }
  })

  // 13. Security: Anon CANNOT update profile
  await runTest('Anon cannot update profile', async () => {
    const { error } = await supabase.from('profile').update({ name: 'Tampered' }).neq('id', '00000000-0000-0000-0000-000000000000')
    const passed = error !== null
    return {
      pass: passed,
      details: passed ? `Blocked by RLS (${error.code || error.message})` : 'FAILED: Anon update succeeded!',
    }
  })

  // 14. Security: Anon CANNOT delete from skills
  await runTest('Anon cannot delete from skills', async () => {
    const { error } = await supabase.from('skills').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    const passed = error !== null
    return {
      pass: passed,
      details: passed ? `Blocked by RLS (${error.code || error.message})` : 'FAILED: Anon delete succeeded!',
    }
  })

  // 15. Security: Anon CANNOT upload to media bucket
  await runTest('Anon cannot upload to media bucket', async () => {
    const testContent = Buffer.from('test malicious file')
    const { error } = await supabase.storage.from('media').upload('test/malicious.txt', testContent)
    const passed = error !== null
    return {
      pass: passed,
      details: passed ? `Blocked by storage RLS (${error.message})` : 'FAILED: Anon upload succeeded!',
    }
  })

  console.table(results)

  const allPassed = results.every((r) => r.Status === 'PASS')
  if (allPassed) {
    console.log('\n🎉 ALL 15 SECURITY & RLS VERIFICATION CHECKS PASSED!\n')
    process.exit(0)
  } else {
    const failedCount = results.filter((r) => r.Status === 'FAIL').length
    console.error(`\n⚠️  ${failedCount} CHECK(S) FAILED. Please review the table above.\n`)
    process.exit(1)
  }
}

verifyAll()
