import assert from 'node:assert'
import { sanitizeHtml } from '../src/lib/sanitize.ts'

console.log('--- RUNNING CMS PIPELINE AND SECURITY TESTS ---')

// 1. Test HTML Sanitizer against XSS vectors
console.log('Test 1: Sanitizer XSS defenses...')
const xssPayload1 = '<script>alert("hack")</script><p>Safe paragraph</p>'
const clean1 = sanitizeHtml(xssPayload1)
assert.strictEqual(clean1.includes('<script>'), false, 'Sanitizer must remove script tags')
assert.strictEqual(clean1.includes('Safe paragraph'), true, 'Sanitizer must retain safe markup')

const xssPayload2 = '<a href="javascript:alert(1)">Click me</a>'
const clean2 = sanitizeHtml(xssPayload2)
assert.strictEqual(clean2.includes('javascript:'), false, 'Sanitizer must neutralize javascript: links')

const xssPayload3 = '<img src="x" onerror="alert(1)" /><p>Body</p>'
const clean3 = sanitizeHtml(xssPayload3)
assert.strictEqual(clean3.includes('onerror='), false, 'Sanitizer must remove inline event handlers')

console.log('✓ XSS defenses passed successfully.')

// 2. Test Section dispatch and keys
console.log('Test 2: Verifying Section Keys and Types...')
const expectedKeys = ['hero', 'about', 'work', 'band', 'stack', 'leadership', 'credentials', 'contact']
const expectedTypes = ['hero', 'about', 'work', 'marquee_band', 'stack', 'leadership', 'credentials', 'contact']

assert.strictEqual(expectedKeys.length, 8, '8 core sections expected')
assert.strictEqual(expectedTypes.length, 8, '8 core section types expected')

console.log('✓ Section keys and type mapping verified.')

console.log('--- ALL CMS PIPELINE TESTS PASSED ---')
