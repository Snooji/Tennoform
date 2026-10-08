import { useSyncExternalStore } from "react"

/** The pop-up chat window: where it sits, its size, whether it's open or minimised, and the reopen button. Kept on this device. */
export type ChatWin = {
  open: boolean; min: boolean; bubble: boolean
  x: number | null; y: number | null; w: number | null; h: number | null
  bx: number | null; by: number | null
}
const KEY = "tf-chatwin"
const DEF: ChatWin = { open: false, min: false, bubble: true, x: null, y: null, w: null, h: null, bx: null, by: null }
let cur: ChatWin = (() => {
  try { return { ...DEF, ...JSON.parse(localStorage.getItem(KEY) || "{}") } } catch { return DEF }
})()
const subs = new Set<() => void>()
export function setChatWin(p: Partial<ChatWin>, save = true) {
  cur = { ...cur, ...p }
  if (save) try { localStorage.setItem(KEY, JSON.stringify(cur)) } catch { /* private mode: still works for this visit */ }
  subs.forEach((f) => f())
}
export function useChatWin() {
  return useSyncExternalStore((f) => { subs.add(f); return () => subs.delete(f) }, () => cur)
}
