# Launch UI Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Polish Tennoform's phone experience for the App Store / Play launch in the Prime-matched-to-logo look: logo gold by default, drag-to-close bottom sheets, calmer Market rows, empty states with one action, and motivation cues (progress to next rank, rank-up moment, next step first).

**Architecture:** React shell (`app/src`) reading data and calling actions through `window.TF` (`src/js/46*-bridge-*.js`, typed in `app/src/lib/tf.ts`, re-rendered by `useTFData`). New UI goes in `app/src/components/{ui,tf,shell}`; styling follows `DESIGN.md` and `app/src/prime-logo.css`. Phone = below Tailwind `md` (768px).

**Tech Stack:** React 19, Tailwind v4, Base UI 1.8 (`@base-ui/react/drawer` present), motion, lucide-react; Playwright browser checks in `tests/`.

**Spec:** The owner's requests in this session (direction B "lean towards the logo"; "fits app structure and psychology"; "use 21st dev"), `DESIGN.md` (rewritten 2026-11-23), and the review findings listed in the session (Market rows crowded, empty states, sign-in prominence, thumb reach).

## Global Constraints

- Built files are never committed: run `python3 build/built_files.py --reset` before every commit.
- `tests/smoke.js` must end with `All checks passed` (every page, both modes, every style, axe WCAG 2.1 AA).
- Every control has a visible text label; touch targets ≥ 40px on phones; nothing floats over content on a phone except temporary bars above the tab bar.
- All motion stops for `prefers-reduced-motion` and Appearance → Calm.
- Words: plain English, say what a number means next to it.
- 21st.dev component: coss.com Drawer (21st id 11443), adapted to the app's own `Button` and `cn` from `@/lib/utils`.

## Review Focus

1. A drawer opened while the page scrolls must still close on swipe-down and on the system Back gesture (Android back button closes the sheet before leaving the page).
2. A rank-up that happens because of a profile upload of many items at once must celebrate once (the new rank), not once per rank passed.
3. The celebration must never fire on first load, on sign-in pulling an account with a higher rank, or when leaving the sample account.
4. Empty-state actions must work signed out (no action that needs an account without saying so).
5. Light mode: gold-by-default and the new rows must keep AA contrast (smoke's axe covers it; check the light Market row by eye too).

---

### Task 1: Logo gold by default

**Files:**
- Modify: `app/src/lib/accent.ts` (default choice)
- Modify: `app/src/components/shell/appearance.tsx` (order/hint so "Follow my rank" reads as the option)
- Test: `tests/launch-ui.js` (new; Playwright, same `BASE`/`context` style as `smoke.js`)

**Interfaces:**
- Produces: `read()` in accent.ts returns `"gold"` when nothing is stored; stored choices are kept.

- [ ] **Step 1: Write the failing check** `goldDefault`: fresh storage, open `/`, expect `document.documentElement.dataset.accent === "gold"`; with `tf-accent` = `"rank"` stored and MR 0, expect `"bronze"`.
- [ ] **Step 2: Run** `node tests/launch-ui.js` (site served on :8765). Expected: FAIL "accent bronze, expected gold".
- [ ] **Step 3: Implement** default `"gold"` in `read()`; ACCENTS hint for `rank`: "Changes as you rank up: bronze, silver at MR 10, gold at MR 20, Legendary at 30".
- [ ] **Step 4: Run** launch-ui.js → PASS; smoke.js → All checks passed.
- [ ] **Step 5: Commit** "Gold by default; rank colours optional".

### Task 2: Drag-to-close bottom sheet (21st.dev Drawer)

**Files:**
- Create: `app/src/components/ui/drawer.tsx` (coss.com Drawer: `Drawer`, `DrawerPopup`, `DrawerHeader`, `DrawerTitle`, `DrawerDescription`, `DrawerPanel`, `DrawerFooter`, `DrawerClose`, `DrawerBar`; drop its inline Button/cn, use `@/components/ui/button` and `@/lib/utils`; skip the menu/checkbox/radio parts)
- Create: `app/src/components/tf/phone-sheet.tsx`
- Modify: `app/src/pages/farm/farm-page.tsx:249-260`, `app/src/pages/resources/resources-page.tsx` (their `<Sheet side="bottom">`)
- Modify: `app/src/prime-logo.css` (drawer popup: metal top edge, cut corners at the top)
- Modify: `src/js/4699977-native.js` (Android back closes an open drawer first)
- Test: `tests/launch-ui.js`

**Interfaces:**
- Produces: `PhoneSheet({ open, onOpenChange, title, description?, children, footer? }: { open: boolean; onOpenChange(o: boolean): void; title: string; description?: string; children: ReactNode; footer?: ReactNode })` — a bottom Drawer with the bar, title, scrollable panel and optional footer. Used by Tasks 2–3.
- Produces: `window.TF_SHEET_OPEN` (number of open sheets) and a `tf:sheet-close` window event the native back handler dispatches.

- [ ] **Step 1: Write the failing check** `sheetSwipe`: 390px, `/farm/`, tap the first result, expect `[data-slot="drawer-popup"]` visible with `[data-slot="drawer-bar"]`; mouse-drag from the bar down 300px; expect the popup gone within 1s.
- [ ] **Step 2: Run** → FAIL (no drawer-popup).
- [ ] **Step 3: Implement** drawer.tsx and `PhoneSheet`; swap the two bottom Sheets for `PhoneSheet`; PhoneSheet increments/decrements `TF_SHEET_OPEN` and closes on `tf:sheet-close`; native back handler: if `TF_SHEET_OPEN>0` dispatch `tf:sheet-close` and stop.
- [ ] **Step 4: Run** launch-ui.js → PASS; smoke.js → All checks passed (axe covers the drawer's dialog role and title).
- [ ] **Step 5: Commit** "Bottom sheets drag to close (21st.dev Drawer)".

### Task 3: Market rows: one row, details in the sheet

**Files:**
- Create: `app/src/pages/market/market-sheet.tsx` (`MarketSheet` for one set/mod: price with "7-day average", cheapest seller + Whisper, Sell, Listings, vault/resurgence, MR XP, parts/ducats when present)
- Modify: `app/src/pages/market/market-page.tsx` (prime-set rows ~120-150 and mod rows 50-71)
- Test: `tests/launch-ui.js`

**Interfaces:**
- Consumes: `PhoneSheet` (Task 2); existing row data from `tf().market()` / `tf().marketMods()` (unchanged).
- Produces: `MarketSheet({ row, open, onOpenChange })`.

- [ ] **Step 1: Write the failing check** `marketRow`: 390px, `/market/`, first row has at most one `button` besides the row itself (the price-whisper), and tapping the row name area opens a drawer containing buttons named /Sell/ and a link named /warframe.market/.
- [ ] **Step 2: Run** → FAIL (3 buttons in row).
- [ ] **Step 3: Implement:** on phones (`useIsMobile`) the row is a button opening `MarketSheet`, showing name, one status chip (Vaulted or +MR XP, Vaulted wins), price and "7-day avg"; Sell/Listings/Whisper move into the sheet. Desktop keeps today's row.
- [ ] **Step 4: Run** launch-ui.js → PASS; smoke.js → All checks passed.
- [ ] **Step 5: Commit** "Market: calm rows on phones, details in a sheet".

### Task 4: Empty states with one action

**Files:**
- Create: `app/src/components/tf/empty-state.tsx` (pattern from 21st.dev serafimcloud/empty-state: icon in a soft ring, title, one sentence, one primary action, optional secondary link)
- Modify: `app/src/pages/collection/collection-page.tsx` (no history yet → "Upload profile file"), `app/src/pages/ranks/ranks-page.tsx:378-386` (nothing matches → "Show everything"), `app/src/pages/market/market-page.tsx` (no prices for search → "Clear search"), goals/tasks pages' empty lists (→ add the first one)
- Test: `tests/launch-ui.js`

**Interfaces:**
- Produces: `EmptyState({ icon, title, body, action, secondary? }: { icon: LucideIcon; title: string; body: string; action: { label: string; onClick(): void }; secondary?: { label: string; onClick(): void } })`.

- [ ] **Step 1: Write the failing check** `emptyStates`: fresh storage, `/collection/` shows a button named "Upload profile file" that leads to `/tenno/` with `#proffile` present; `/ranks/` searching "zzzz" shows "Show everything" which clears the search.
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement** the component and the four uses; signed-out actions only.
- [ ] **Step 4: Run** launch-ui.js → PASS; smoke.js → All checks passed.
- [ ] **Step 5: Commit** "Empty states say what to do next".

### Task 5: Motivation: progress, rank-up moment, next step first

**Files:**
- Modify: `app/src/pages/home/mastery-hero.tsx` (goal gradient line under the XP: "{pct}% of the way to {nextLabel}" plus, when ≥ 80%, "Almost there")
- Create: `app/src/components/shell/rank-up.tsx` (full-screen moment: logo, "Mastery Rank N", one line on what unlocked — "New gear and trading limits unlock at this rank", Continue button; haptic via `navigator.vibrate`; gold burst with motion; reduced motion = no burst)
- Modify: `app/src/App.tsx` (mount `RankUp`), `app/src/pages/home/home-page.tsx` (phones: `NextUp` before `SignInCard`; sign-in card after first progress only)
- Test: `tests/launch-ui.js`

**Interfaces:**
- Consumes: `tf().state().mr`, `.pct`, `.nextLabel`, `.demo`, `.signedIn`.
- Produces: `RankUp()` — watches `state().mr`; stores the last celebrated rank in `localStorage["tf-rank-seen"]`; fires only when mr rises above it during this visit, not on first load, not in demo, not within 3s after sign-in; one moment for the highest new rank.

- [ ] **Step 1: Write the failing checks** `rankUp`: MR 0 user maxes items on Ranks until MR 1 → dialog "Mastery Rank 1" appears once; reload → no dialog; demo start → no dialog. `goalGradient`: Home shows text matching /% of the way to MR \d+/.
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement** per Interfaces; Review Focus 2–3 rules inside `RankUp`.
- [ ] **Step 4: Run** launch-ui.js → PASS; smoke.js → All checks passed.
- [ ] **Step 5: Commit** "Progress to next rank, a rank-up moment, next step first".

### Task 6: Wire the new checks into CI and document

**Files:**
- Modify: `.github/workflows/checks.yml` (run `node launch-ui.js` after `node smoke.js`)
- Modify: `DESIGN.md` (Behaviour: "Motivation" bullets — progress shown as distance to the next rank, one celebration per rank, the next step comes first, one action per empty state; "Sheets drag to close")
- Modify: `tests/package.json` script `"launch": "node launch-ui.js"`

- [ ] **Step 1: Run** both suites locally → both pass.
- [ ] **Step 2: Commit and push** "Run the launch UI checks in CI; design notes".
