import { useSyncExternalStore } from "react"

/** Detailed (the default) or Simple: Simple hides the long explanations, sellers and side notes and keeps the steps short. Kept on this device. */
const KEY = "tf-detail"
const read = () => { try { return JSON.parse(localStorage.getItem(KEY) || '"detailed"') === "simple" } catch { return false } }
let simple = read()
const apply = () => { document.documentElement.dataset.detail = simple ? "simple" : "detailed" }
apply()
const subs = new Set<() => void>()
export function setSimple(v: boolean) {
  simple = v
  try { localStorage.setItem(KEY, JSON.stringify(v ? "simple" : "detailed")) } catch { /* private mode: still works for this visit */ }
  apply()
  window.TF?.detailChanged?.()
  subs.forEach((f) => f())
}
export function useSimple() {
  return useSyncExternalStore((f) => { subs.add(f); return () => subs.delete(f) }, () => simple)
}
/** The first sentence of a longer explanation, for Simple view. */
export const firstSentence = (s: string) => { const m = s.match(/^.*?[.!?](?=\s|$)/); return m ? m[0] : s }
