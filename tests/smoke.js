/* Browser checks run on every pull request (and locally: serve the site on :8765, then `node smoke.js`).
   No request ever reaches warframe.com, warframestat.us or the relay: the live feed is a fixed stub and everything else
   outside the site is blocked. Exits non-zero if any check fails.
   1. pages: every page in dark and light, phone and desktop, loads without script errors and passes axe (WCAG 2.1 AA)
   2. grey screens: tapping every tab and switch on every page never leaves an empty overlay or a locked page
   3. styles: Foundry, Prime and the five faction styles, light and dark, with a few colour palettes, pass axe
   4. simple view: every page in Simple view loads without script errors and passes axe
   5. chat window: the pop-up chat opens from its button, moves, resizes, minimises, closes and passes axe */
const { chromium } = require('playwright')
const fs = require('fs')
const AXE = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8')
const WSD = require('./world-state.js')
const BASE = process.env.SITE || 'http://localhost:8765/'
const PAGES = ['home', 'ranks', 'mastery', 'goals', 'tasks', 'missions', 'quests', 'farm', 'resources', 'relics', 'world', 'market', 'arsenal', 'frames',
  'today', 'synd', 'achievements', 'tenno', 'friends', 'donate', 'feedback', 'about', 'guides', 'collection']
const fails = []
const where = (p) => { try { return new URL(p.url()).hash || '#home' } catch { return '?' } }
const fail = (m) => { fails.push(m); console.log('FAIL', m) }

async function context(b, w, scheme) {
  const ctx = await b.newContext({ viewport: { width: w, height: 900 }, colorScheme: scheme, bypassCSP: true, isMobile: w < 500, hasTouch: w < 500 })
  await ctx.route(/./, (r) => {
    const u = r.request().url()
    if (u.startsWith(BASE) && !u.includes('firebase-config.js')) return r.continue()
    if (u.includes('firebase-config.js')) return r.fulfill({ contentType: 'text/javascript', body: 'window.TENNO_FIREBASE={};' })
    if (/api\.warframestat\.us\/pc/.test(u)) return r.fulfill({ contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(WSD) })
    return r.abort()
  })
  return ctx
}
async function axe(p) {
  await p.addScriptTag({ content: AXE })
  return p.evaluate(async () => (await axe.run(document, { resultTypes: ['violations'], runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] } }))
    .violations.map((v) => `${v.id} x${v.nodes.length} (${v.nodes[0].target.join(' ').slice(0, 70)})`))
}
/* wait for one-off entrance animations to finish (faction panels fade or flicker in); looping backdrop motion is ignored */
const settle = (p) => p.evaluate(async () => {
  const until = Date.now() + 3000
  for (;;) {
    const running = document.getAnimations().filter((a) => a.playState === 'running' && Number.isFinite(a.effect?.getComputedTiming().endTime))
    if (!running.length || Date.now() > until) return
    await Promise.all(running.map((a) => a.finished.catch(() => {})))
    await new Promise((r) => setTimeout(r, 120)) // panels that mount a moment later start their own entrance
  }
})

async function open(p, set) {
  await p.goto(BASE + '#home')
  await p.evaluate((s) => { localStorage.clear(); for (const [k, v] of Object.entries(s)) localStorage.setItem(k, JSON.stringify(v)) }, set)
  await p.reload(); await p.waitForTimeout(700)
  await p.click('[data-demo]'); await p.waitForTimeout(900)
}

async function pages(b) {
  for (const mode of ['dark', 'light']) for (const w of [1280, 390]) {
    const ctx = await context(b, w, mode), p = await ctx.newPage(), errs = []
    p.on('pageerror', (e) => errs.push(`${e.message} @ ${where(p)} ${String(e.stack || '').split('\n').slice(1, 3).map((l) => l.trim()).join(' < ')}`))
    await open(p, { 'tf-theme': mode })
    for (const r of PAGES) {
      await p.evaluate((r) => (location.hash = r), r); await p.waitForTimeout(450)
      const h1 = await p.evaluate(() => (document.querySelector('main h1') || {}).textContent || '')
      if (/didn't load/i.test(h1)) fail(`${mode} ${w} #${r}: page didn't load`)
      const v = await axe(p)
      if (v.length) fail(`${mode} ${w} #${r} axe: ${v.join('; ')}`)
    }
    if (errs.length) fail(`${mode} ${w} script errors: ${errs.slice(0, 3).join(' | ')}`)
    console.log('pages', mode, w, 'checked'); await ctx.close()
  }
}

async function grey(b) {
  for (const w of [390, 1280]) {
    const ctx = await context(b, w, 'dark'), p = await ctx.newPage(), errs = []
    p.on('pageerror', (e) => errs.push(`${e.message} @ ${where(p)} ${String(e.stack || '').split('\n').slice(1, 3).map((l) => l.trim()).join(' < ')}`))
    await open(p, {})
    const state = () => p.evaluate(() => {
      const ov = [...document.querySelectorAll('[data-slot$=overlay],.dlgbk')].filter((e) => getComputedStyle(e).display !== 'none').length
      const content = !!document.querySelector('[data-slot=dialog-content],[data-slot=sheet-content],.dlgbk .dlg')
      return { ov, content, lock: getComputedStyle(document.body).overflow, pe: getComputedStyle(document.body).pointerEvents }
    })
    const sel = 'main [role=tab], #tf-root [role=tab], [data-slot=toggle-group] button, button[aria-pressed]'
    for (const r of PAGES) {
      await p.evaluate((r) => (location.hash = r), r); await p.waitForTimeout(450)
      const n = Math.min(await p.locator(sel).count(), 12)
      for (let i = 0; i < n; i++) {
        const el = p.locator(sel).nth(i)
        if (!(await el.isVisible().catch(() => false))) continue
        const label = ((await el.textContent()) || '').trim().slice(0, 24)
        await el.click({ timeout: 3000 }).catch(() => {}); await p.waitForTimeout(300)
        const s = await state()
        if ((s.ov && !s.content) || (s.lock === 'hidden' && !s.content) || s.pe === 'none') fail(`grey ${w} #${r} after "${label}": ${JSON.stringify(s)}`)
        if (s.content) { await p.keyboard.press('Escape'); await p.waitForTimeout(250) }
        if (await p.evaluate((r) => location.hash.slice(1) !== r, r)) { await p.evaluate((r) => (location.hash = r), r); await p.waitForTimeout(350) }
      }
    }
    if (errs.length) fail(`grey ${w} script errors: ${errs.slice(0, 3).join(' | ')}`)
    console.log('grey screens', w, 'checked'); await ctx.close()
  }
}

async function styles(b) {
  const combos = [['foundry', 'light', 'bronze'], ['foundry', 'dark', 'teal'], ['prime', 'dark', 'gold'], ['prime', 'light', 'crimson'], ['default', 'dark', 'void'],
    ['grineer', 'dark', 'faction'], ['grineer', 'light', 'crimson'], ['corpus', 'light', 'faction'], ['corpus', 'dark', 'teal'], ['entrati', 'dark', 'faction'],
    ['entrati', 'light', 'jade'], ['lotus', 'dark', 'faction'], ['lotus', 'light', 'void'], ['infested', 'dark', 'faction'], ['infested', 'light', 'bronze']]
  for (const [style, mode, accent] of combos) for (const w of [1280, 390]) {
    const ctx = await context(b, w, mode), p = await ctx.newPage()
    await open(p, { 'tf-style': style, 'tf-theme': mode, 'tf-accent': accent })
    for (const r of ['home', 'today', 'farm', 'mastery']) {
      await p.evaluate((r) => (location.hash = r), r); await p.waitForTimeout(450); await settle(p)
      const v = await axe(p)
      if (v.length) fail(`${style} ${mode} ${accent} ${w} #${r} axe: ${v.join('; ')}`)
    }
    console.log('style', style, mode, accent, w, 'checked'); await ctx.close()
  }
}

async function simpleView(b) {
  for (const w of [1280, 390]) {
    const ctx = await context(b, w, 'dark'), p = await ctx.newPage(), errs = []
    p.on('pageerror', (e) => errs.push(`${e.message} @ ${where(p)}`))
    await open(p, { 'tf-detail': 'simple' })
    if ((await p.evaluate(() => document.documentElement.dataset.detail)) !== 'simple') fail(`simple ${w}: Simple view didn't switch on`)
    for (const r of PAGES) {
      await p.evaluate((r) => (location.hash = r), r); await p.waitForTimeout(400)
      const h1 = await p.evaluate(() => (document.querySelector('main h1') || {}).textContent || '')
      if (/didn't load/i.test(h1)) fail(`simple ${w} #${r}: page didn't load`)
      const v = await axe(p)
      if (v.length) fail(`simple ${w} #${r} axe: ${v.join('; ')}`)
    }
    if (errs.length) fail(`simple ${w} script errors: ${errs.slice(0, 3).join(' | ')}`)
    console.log('simple view', w, 'checked'); await ctx.close()
  }
}

async function chatWindow(b) {
  for (const w of [1280, 390]) {
    const ctx = await context(b, w, 'dark'), p = await ctx.newPage(), errs = []
    p.on('pageerror', (e) => errs.push(e.message))
    await open(p, {})
    const B = 'button[aria-label^="Open chat"]', W = '[aria-label="Chat window"]'
    const box = async (s) => { const r = await p.locator(s).first().boundingBox(); return r && [r.x, r.y, r.width, r.height].map(Math.round) }
    if (!(await p.locator(B).count())) { fail(`chat ${w}: no chat button`); await ctx.close(); continue }
    await p.locator(B).click(); await p.waitForTimeout(700)
    const a = await box(W)
    if (!a) { fail(`chat ${w}: button didn't open the window`); await ctx.close(); continue }
    const v = await axe(p)
    if (v.length) fail(`chat ${w} axe: ${v.join('; ')}`)
    await p.mouse.move(a[0] + 120, a[1] + 20); await p.mouse.down(); await p.mouse.move(a[0] + 100, a[1] - 100, { steps: 4 }); await p.mouse.up()
    const m = await box(W)
    if (m[1] >= a[1]) fail(`chat ${w}: window didn't move (${a} -> ${m})`)
    const r = await box('button[aria-label^="Resize chat"]')
    await p.mouse.move(r[0] + 10, r[1] + 10); await p.mouse.down(); await p.mouse.move(r[0] - 40, r[1] - 60, { steps: 4 }); await p.mouse.up()
    const z = await box(W)
    if (z[3] >= m[3]) fail(`chat ${w}: window didn't resize (${m} -> ${z})`)
    await p.locator('button[aria-label="Minimise chat window"]').click(); await p.waitForTimeout(200)
    if ((await box(W))[3] > 60) fail(`chat ${w}: window didn't minimise`)
    await p.locator('button[aria-label="Close chat window"]').click(); await p.waitForTimeout(200)
    if (await p.locator(W).count() || !(await p.locator(B).count())) fail(`chat ${w}: close didn't bring the button back`)
    if (errs.length) fail(`chat ${w} script errors: ${errs.slice(0, 3).join(' | ')}`)
    console.log('chat window', w, 'checked'); await ctx.close()
  }
}

;(async () => {
    // full Chromium (what visitors run), not Playwright's stripped-down headless shell
  const b = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : { channel: 'chromium' })
  await pages(b); await grey(b); await styles(b); await simpleView(b); await chatWindow(b)
  await b.close()
  console.log(fails.length ? `\n${fails.length} problem(s) found` : '\nAll checks passed')
  process.exit(fails.length ? 1 : 0)
})().catch((e) => { console.error(e); process.exit(1) })
