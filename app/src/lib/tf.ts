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
}
export type TFUi = {
  toast?: (text: string, action?: { label: string; fn: () => void }) => void
  openSearch?: () => void
  openMenu?: () => void
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
