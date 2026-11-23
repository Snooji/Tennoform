/* Launch UI checks (serve the site on :8765, then `node launch-ui.js` or `node launch-ui.js <check> [...]`).
   Same isolation as smoke.js: the live feed is a stub, every outside request is blocked. Exits non-zero if any check fails.
   goldDefault: logo gold is the colour unless the player picked one. Later checks cover the phone sheet, Market rows,
   empty states and the rank-up moment. */
const { chromium } = require('playwright')
const WSD = require('./world-state.js')
const BASE = process.env.SITE || 'http://localhost:8765/'
const fails = []
const fail = (m) => { fails.push(m); console.log('FAIL', m) }

async function context(b, w) {
  const ctx = await b.newContext({ viewport: { width: w, height: 844 }, colorScheme: 'dark', bypassCSP: true, isMobile: w < 500, hasTouch: w < 500 })
  await ctx.route(/./, (r) => {
    const u = r.request().url()
    if (u.startsWith(BASE) && !u.includes('firebase-config.js')) return r.continue()
    if (u.includes('firebase-config.js')) return r.fulfill({ contentType: 'text/javascript', body: 'window.TENNO_FIREBASE={};' })
    if (/api\.warframestat\.us\/pc/.test(u)) return r.fulfill({ contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(WSD) })
    return r.abort()
  })
  return ctx
}
/* open the site with exactly this storage (values are JSON-encoded) */
async function fresh(ctx, store, path) {
  const p = await ctx.newPage()
  await p.goto(BASE)
  await p.evaluate((s) => { localStorage.clear(); for (const [k, v] of Object.entries(s)) localStorage.setItem(k, JSON.stringify(v)) }, store)
  await p.goto(BASE + (path || ''))
  await p.waitForTimeout(1500)
  return p
}

const CHECKS = {
  async goldDefault(b) {
    const ctx = await context(b, 390)
    let p = await fresh(ctx, {})
    const a = await p.evaluate(() => document.documentElement.dataset.accent)
    if (a !== 'gold') fail(`goldDefault: accent ${a}, expected gold for a new player`)
    p = await fresh(ctx, { 'tf-accent': 'rank' })
    const r = await p.evaluate(() => document.documentElement.dataset.accent)
    if (r !== 'bronze') fail(`goldDefault: "Follow my rank" at MR 0 gave ${r}, expected bronze`)
    await ctx.close(); console.log('goldDefault checked')
  },
  async sheetSwipe(b) {
    const ctx = await context(b, 390)
    const p = await fresh(ctx, { 'tenno-profile': { onb: 1 } }, 'farm/')
    await p.locator('main li button').filter({ hasText: /\w/ }).nth(8).click(); await p.waitForTimeout(900)
    const pop = p.locator('[data-slot="drawer-popup"]')
    if (!(await pop.isVisible().catch(() => false))) { fail('sheetSwipe: tapping a Farm finder result did not open a drawer'); await ctx.close(); return }
    const bar = p.locator('[data-slot="drawer-bar"]')
    if (!(await bar.count())) fail('sheetSwipe: the drawer has no drag bar')
    const box = await pop.boundingBox()
    await p.mouse.move(box.x + box.width / 2, box.y + 12); await p.mouse.down()
    for (let i = 1; i <= 10; i++) { await p.mouse.move(box.x + box.width / 2, box.y + 12 + i * 40); await p.waitForTimeout(16) }
    await p.mouse.up(); await p.waitForTimeout(1000)
    if (await pop.isVisible().catch(() => false)) fail('sheetSwipe: dragging the drawer down 400px did not close it')
    await ctx.close(); console.log('sheetSwipe checked')
  },
  async marketRow(b) {
    const ctx = await context(b, 390)
    const p = await fresh(ctx, { 'tenno-profile': { onb: 1 } }, 'market/')
    const row = p.locator('main ul li').first()
    const n = await row.locator('button, a').count()
    if (n > 1) fail(`marketRow: a phone row has ${n} buttons/links, expected one (the row)`)
    await row.locator('button, a').first().click(); await p.waitForTimeout(900)
    const pop = p.locator('[data-slot="drawer-popup"]')
    if (!(await pop.isVisible().catch(() => false))) { fail('marketRow: tapping a row did not open its sheet'); await ctx.close(); return }
    if (!(await pop.getByRole('button', { name: /Sell/ }).count())) fail('marketRow: the sheet has no Sell button')
    if (!(await pop.getByRole('link', { name: /warframe\.market/ }).count())) fail('marketRow: the sheet has no warframe.market link')
    await ctx.close(); console.log('marketRow checked')
  },
  async emptyStates(b) {
    const ctx = await context(b, 390)
    let p = await fresh(ctx, { 'tenno-profile': { onb: 1 } }, 'collection/')
    const es = p.locator('[data-slot="empty-state"]')
    const up = es.getByRole('button', { name: 'Upload profile file' })
    if (!(await up.count())) fail('emptyStates: an empty collection has no "Upload profile file" action')
    else { await up.first().click(); await p.waitForTimeout(1200); if (!/\/tenno\//.test(p.url()) || !(await p.locator('#proffile').count())) fail('emptyStates: "Upload profile file" did not open the upload step') }
    p = await fresh(ctx, { 'tenno-profile': { onb: 1 } }, 'ranks/')
    await p.getByPlaceholder(/Search gear/).fill('zzzzqq'); await p.waitForTimeout(900)
    const show = p.locator('[data-slot="empty-state"]').getByRole('button', { name: 'Show everything' })
    if (!(await show.count())) fail('emptyStates: a search with no results has no "Show everything" empty state')
    else { await show.click(); await p.waitForTimeout(700); if (await p.getByPlaceholder(/Search gear/).inputValue()) fail('emptyStates: "Show everything" did not clear the search') }
    await ctx.close(); console.log('emptyStates checked')
  },
}

;(async () => {
  const want = process.argv.slice(2)
  const b = await chromium.launch()
  for (const [name, fn] of Object.entries(CHECKS)) if (!want.length || want.includes(name)) await fn(b).catch((e) => fail(`${name}: ${e.message.split('\n')[0]}`))
  await b.close()
  console.log(fails.length ? `\n${fails.length} check(s) failed` : '\nAll launch checks passed')
  process.exit(fails.length ? 1 : 0)
})()
