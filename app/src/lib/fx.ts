/**
 * Pointer effects shared by the themes, in one small module with no dependencies:
 *  - panels know where the pointer is (--mx/--my in px, plus data-hot while it's over them), so a theme's CSS can
 *    light the panel and its border from that point (a spotlight that follows the pointer);
 *  - small panels lean a few degrees toward the pointer (--rx/--ry), for the styles that want it;
 *  - buttons get a ripple from the point they were pressed (a span the CSS animates, removed when it ends).
 * One passive listener each, throttled to one update per frame. Nothing runs for touch hover, and the theme CSS
 * decides whether these show at all (and hides them for reduced motion or the "Calm" setting).
 */
const PANEL = '[data-slot="card"], .welcome, .panel, [data-fx-panel]'
const PRESS = '[data-slot="button"], .btn, [data-fx-press]'

let hot: HTMLElement | null = null
let frame = 0
let last: PointerEvent | null = null

function paint() {
  frame = 0
  const e = last
  if (!e) return
  const el = (e.target as Element | null)?.closest?.(PANEL) as HTMLElement | null
  if (hot && hot !== el) hot.removeAttribute("data-hot")
  hot = el
  if (!el) return
  const r = el.getBoundingClientRect()
  el.style.setProperty("--mx", `${Math.round(e.clientX - r.left)}px`)
  el.style.setProperty("--my", `${Math.round(e.clientY - r.top)}px`)
  // a gentle tilt toward the pointer, only for small panels (a big page-sized panel never moves)
  const small = r.width < 640 && r.height < 340
  el.style.setProperty("--rx", small ? `${(((e.clientY - r.top) / r.height - 0.5) * -4).toFixed(2)}deg` : "0deg")
  el.style.setProperty("--ry", small ? `${(((e.clientX - r.left) / r.width - 0.5) * 4).toFixed(2)}deg` : "0deg")
  el.setAttribute("data-hot", "")
}

function onMove(e: PointerEvent) {
  if (e.pointerType === "touch") return
  last = e
  if (!frame) frame = requestAnimationFrame(paint)
}

function onLeave() {
  if (hot) hot.removeAttribute("data-hot")
  hot = null
}

function onPress(e: PointerEvent) {
  if (document.documentElement.classList.contains("tf-calm") || matchMedia("(prefers-reduced-motion: reduce)").matches) return
  const b = (e.target as Element | null)?.closest?.(PRESS) as HTMLElement | null
  if (!b || (b as HTMLButtonElement).disabled) return
  const r = b.getBoundingClientRect()
  const size = Math.max(r.width, r.height) * 2.2
  // the ripple sits in a clipping box of its own, so the button keeps its overflow (badges on a button stay visible)
  const box = document.createElement("span")
  box.className = "tf-ripple-box"
  box.setAttribute("aria-hidden", "true")
  const s = document.createElement("span")
  s.className = "tf-ripple"
  s.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - r.left - size / 2}px;top:${e.clientY - r.top - size / 2}px`
  box.appendChild(s)
  const placed = getComputedStyle(b).position === "static"
  if (placed) b.style.position = "relative"
  b.appendChild(box)
  const done = () => { box.remove(); if (placed && !b.querySelector(".tf-ripple-box")) b.style.position = "" }
  s.addEventListener("animationend", done, { once: true })
  window.setTimeout(done, 1200)
}

let on = false
export function installFx() {
  if (on || typeof document === "undefined") return
  on = true
  document.addEventListener("pointermove", onMove, { passive: true })
  document.addEventListener("pointerleave", onLeave, { passive: true })
  document.addEventListener("pointerdown", onPress, { passive: true })
}

/** "Calm" turns off the living backdrops and pointer effects in every style. */
const CALM_KEY = "tf-calm"
export function calmGet() {
  try { return localStorage.getItem(CALM_KEY) === "1" } catch { return false }
}
export function calmSet(v: boolean) {
  try { if (v) localStorage.setItem(CALM_KEY, "1"); else localStorage.removeItem(CALM_KEY) } catch { /* private mode */ }
  document.documentElement.classList.toggle("tf-calm", v)
  window.dispatchEvent(new CustomEvent("tf:update"))
}
export function calmApply() {
  document.documentElement.classList.toggle("tf-calm", calmGet())
}
