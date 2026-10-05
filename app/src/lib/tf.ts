import { useEffect, useState, useSyncExternalStore } from "react"

/** What the existing Tennoform app exposes on window.TF (see src/js/465-bridge.js). */
export type TFState = {
  route: string
  title: string
  place: { id: string; label: string } | null
  mr: number
  mrLabel: string
  nextLabel: string
  xp: number
  next: number
  pct: number
  toNext: number
  name: string
  signedIn: boolean
  canAcct: boolean
  acctName: string
  acctEmail: string
  admin: boolean
  unread: number
  theme: "dark" | "light" | "auto"
  demo: boolean
  isNew: boolean
  qs: boolean
}
export type TFNavPlace = { id: string; label: string; pages: { route: string; label: string }[] }
export type TFHit = { name: string; group: string; act: string; sub: string; img: string }
export type TFApi = {
  state(): TFState
  nav(): TFNavPlace[]
  menu(): { route: string; label: string }[]
  search(q: string): TFHit[]
  open(act: string): void
  go(route: string): void
  google(): void
  signOut(): void
  account(): void
  theme(t: TFState["theme"]): void
  logo(): string
  share(): void
  keys(): void
  refresh(): void
  home(): HomeData
  act(tag: string, attrs: Record<string, string>): void
  nuDone(i: number): void
  nuSnooze(i: number): void
  nuUnsnooze(): void
  addTaskFrom(key: string, label: string): void
  taskDone(id: string, v: boolean): Promise<void>
  addTask(text: string): boolean
  sync(): void
  ranks(fresh?: boolean): RanksData
  ranksSet(o: { cat?: string; q?: string; f?: string; s?: string }): void
  ranksMore(all?: boolean): void
  ranksRefresh(): void
  setRank(n: string, r: number): void
  maxAll(): number
  farm(): FarmData
  farmSet(o: { q?: string; ty?: string; cat?: string; unv?: boolean }): void
  farmClear(): void
  farmMore(): void
  farmPick(key: string | null): void
  island(el: HTMLElement | null): void
  today(): TodayData
  todaySet(o: { ckF?: string; fiF?: string; fiM?: string }): void
  ckTick(id: string, v: boolean): void
  ckPin(id: string): void
  ckHide(id: string): void
  ckAdd(text: string, per: string): boolean
  liveTask(text: string, expiry: string): void
  fisRelics(era: string): void
  retryLive(): void
  ach(): AchData
  achSet(p: string): void
  logUndo(id: string): void
}
/** An existing handler to run: the bridge builds an element with these attributes and clicks it. */
export type TFAction = { tag: "a" | "button"; attrs: Record<string, string> }
export type HomeNext = {
  i: number; id: string; title: string; why: string; steps: string[]; done: boolean; doneLabel: string; img: string
  open: TFAction | null; task: { has: boolean; key: string; label: string } | null
}
export type HomeTile = { k: string; v: string; x: string; route: string; ttab?: string; done?: number; total?: number }
export type HomeData = {
  name: string; mr: number; mrLabel: string; mrShort: string; inGame: string; maxed: number
  xp: number; next: number; toNext: number; nextLabel: string; pct: number; parts: { label: string; xp: number }[]
  action: "link" | "sync" | "plan"; since: string[]; foundryReady: number
  upNext: HomeNext[]; snoozed: number; today: HomeTile[]; doneToday: { n: number; xp: number }
  goals: { name: string; img: string; done: number; total: number }[]; goalCount: number
  tasks: { id: string; title: string; kind: string; due: string; over: boolean; rep: string; open: TFAction | null }[]; taskCount: number
  showSign: boolean; demo: boolean; stage: string
}
export type RankItem = { n: string; img: string; mr: number; r: number; mx: number; xp: number; max: number; per: number }
export type RanksData = {
  cat: string; q: string; f: string; s: string
  cats: { id: string; label: string; m: number; t: number }[]
  island: string; items: RankItem[]; total: number; shown: number; notMax: number
  head: { label: string; m: number; t: number; p: number; x: number; search: boolean }
}
export type FarmItem = { n: string; t: string; label: string; key: string; xp: number; left: number; img: string }
export type FarmData = {
  q: string; ty: string; cat: string; unv: boolean
  types: { value: string; label: string }[]; cats: { value: string; label: string; n: number }[]
  total: number; count: number; items: FarmItem[]; more: number; filtered: boolean
  sel: string; selName: string; detail: string
}
export type LiveList = { head: string; list: { t: string; s: string; n: string }[] }
export type CheckRow = {
  id: string; per: "d" | "w"; title: string; desc: string; gate: string; locked: boolean; done: boolean; doneAt: number
  pinned: boolean; hidden: boolean; custom: boolean; resetIn: string; resetAt: string; endIso: string; hasTask: boolean
  link: { route: string; label: string } | null; live: LiveList | null
}
type Tasky = { task: string; hasTask: boolean; expiry: string; left: string }
export type TodayLive = {
  cycles: { name: string; state: string; left: string }[]
  sortie?: Tasky & { boss: string; faction: string; variants: { t: string; s: string; n: string }[] }
  archon?: Tasky & { boss: string; missions: { t: string; s: string }[] }
  baro?: { here: boolean; left: string; location: string; inv: { item: string; ducats: number; credits: number }[] }
  steel?: { name: string; cost: number }
  arbitration?: Tasky & { type: string; node: string; enemy: string }
  nightwave?: (Tasky & { id: string; title: string; desc: string; rep: number; kind: string; done: boolean })[]
  fissures: {
    era: string; mode: string; need: { era: string; relics: string[]; more: number }[]
    list: (Tasky & { id: string; tier: string; need: boolean; mission: string; node: string; hard: boolean; storm: boolean; mine: number })[]
  }
  invasions: { id: string; node: string; desc: string; rewards: string; good: boolean; pct: number }[]
}
export type TodayData = {
  filter: string; rows: CheckRow[]; hiddenCount: number; hosted: boolean
  tiles: { k: string; v: string; x: string; done?: number; total?: number }[]
  live: TodayLive | null; liveState: "ok" | "loading" | "error" | "offline"
}
export type AchData = {
  period: "today" | "week" | "all"
  tiles: { k: string; v: string; x: string }[]
  days: { label: string; n: number; xp: number; today: boolean }[]
  groups: { d: string; items: { id: string; k: string; label: string; time: string; extra: string; xp: number; canUndo: boolean }[] }[]
  note: string; empty: boolean
}
export type TFUi = {
  toast?: (text: string, action?: { label: string; fn: () => void }) => void
  openSearch?: () => void
  openMenu?: () => void
  /** Routes the shell draws itself; the old page renders nothing for them. */
  owns?: (route: string) => boolean
}

declare global {
  interface Window {
    TF?: TFApi
    TF_UI?: TFUi
  }
}

export const tf = () => window.TF as TFApi

let version = 0
let cached: TFState | null = null
function subscribe(cb: () => void) {
  const on = () => {
    version++
    cached = null
    cb()
  }
  window.addEventListener("tf:update", on)
  window.addEventListener("hashchange", on)
  return () => {
    window.removeEventListener("tf:update", on)
    window.removeEventListener("hashchange", on)
  }
}
function snapshot() {
  if (!cached) cached = tf().state()
  return cached
}

/** Live app state; re-renders whenever the app renders a page or progress changes. */
export function useTF(): TFState {
  return useSyncExternalStore(subscribe, snapshot)
}

/** True while a phone-sized layout is shown (matches the app's own 900px breakpoint). */
export function useNarrow(bp = 900) {
  const [narrow, setNarrow] = useState(() => window.innerWidth < bp)
  useEffect(() => {
    const m = window.matchMedia(`(max-width: ${bp - 1}px)`)
    const on = () => setNarrow(m.matches)
    m.addEventListener("change", on)
    return () => m.removeEventListener("change", on)
  }, [bp])
  return narrow
}

export const isDark = (t: TFState["theme"]) =>
  t === "dark" || (t === "auto" && !window.matchMedia("(prefers-color-scheme: light)").matches)

export const fmt = (n: number) => Math.round(n).toLocaleString("en-US")
export { version as _tfVersion }

/** Read derived data from the app (e.g. tf().home()); recomputed whenever the app updates. */
export function useTFData<T>(read: () => T): T {
  const [, force] = useState(0)
  useEffect(() => {
    const on = () => force((n) => n + 1)
    window.addEventListener("tf:update", on)
    window.addEventListener("hashchange", on)
    const tick = window.setInterval(on, 30000)
    return () => {
      window.removeEventListener("tf:update", on)
      window.removeEventListener("hashchange", on)
      window.clearInterval(tick)
    }
  }, [])
  return read()
}

/** Run an existing action from the app, e.g. open an item or a quest. */
export const runAct = (a: TFAction) => tf().act(a.tag, a.attrs)
export const hrefOf = (a: TFAction | null) => (a && a.attrs.href && a.attrs.href !== "#" ? a.attrs.href : "#")
