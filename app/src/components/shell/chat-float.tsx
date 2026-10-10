import { lazy, Suspense, useEffect, useRef, useState } from "react"
import { ChevronUp, EyeOff, GripHorizontal, Maximize2, MessagesSquare, Minus, MoveDiagonal2, X } from "lucide-react"

import { NotificationsButton } from "./inbox"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { tf, useTF } from "@/lib/tf"
import { setChatWin, useChatWin } from "@/lib/chat-win"

const Body = lazy(() => import("@/pages/chat/chat-window-body").then((m) => ({ default: m.ChatWindowBody })))

const GAP = 8, BUBBLE = 56, HEAD = 44, MIN_W = 280, MIN_H = 280

/** The visible area: shrinks when a phone keyboard opens, and keeps clear of the phone tab bar. */
function useViewport() {
  const read = () => {
    const vv = window.visualViewport
    const narrow = window.innerWidth < 768
    const typing = document.body.classList.contains("typing")
    return { w: vv ? vv.width : window.innerWidth, h: vv ? vv.height : window.innerHeight, bottom: narrow && !typing ? 72 : 0, narrow }
  }
  const [v, setV] = useState(read)
  useEffect(() => {
    const on = () => setV(read())
    window.addEventListener("resize", on)
    window.visualViewport?.addEventListener("resize", on)
    const mo = new MutationObserver(on)
    mo.observe(document.body, { attributes: true, attributeFilter: ["class"] })
    return () => { window.removeEventListener("resize", on); window.visualViewport?.removeEventListener("resize", on); mo.disconnect() }
  }, [])
  return v
}
const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n))

/** Pointer drag (mouse, pen or finger). Reports how far it has moved from where it started; `moved` is false for a plain tap. */
function useDrag(onMove: (dx: number, dy: number) => void, onEnd: (moved: boolean) => void) {
  const st = useRef<{ x: number; y: number; moved: boolean; id: number } | null>(null)
  return {
    onPointerDown: (e: React.PointerEvent) => {
      if (e.button !== 0 || (e.target as HTMLElement).closest("[data-nodrag]")) return
      st.current = { x: e.clientX, y: e.clientY, moved: false, id: e.pointerId }
      ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    },
    onPointerMove: (e: React.PointerEvent) => {
      const s = st.current
      if (!s || s.id !== e.pointerId) return
      const dx = e.clientX - s.x, dy = e.clientY - s.y
      if (!s.moved && Math.hypot(dx, dy) < 6) return
      s.moved = true
      onMove(dx, dy)
    },
    onPointerUp: (e: React.PointerEvent) => {
      const s = st.current
      if (!s || s.id !== e.pointerId) return
      st.current = null
      onEnd(s.moved)
    },
    onPointerCancel: () => { if (st.current) { st.current = null; onEnd(true) } },
  }
}

/** Arrow keys move or resize by a step; Shift takes bigger steps. */
const arrows = (e: React.KeyboardEvent, f: (dx: number, dy: number) => void) => {
  const s = e.shiftKey ? 64 : 16
  const d = { ArrowLeft: [-s, 0], ArrowRight: [s, 0], ArrowUp: [0, -s], ArrowDown: [0, s] }[e.key]
  if (!d) return
  e.preventDefault()
  f(d[0], d[1])
}

/** Chat that floats over every page: a window you can drag, resize, minimise or close, and a button to reopen it that you can put anywhere. */
export function ChatFloat() {
  const s = useTF()
  const c = useChatWin()
  const v = useViewport()
  const onChat = s.route === "chat"

  // geometry, with defaults that suit the screen and always kept on screen
  const maxW = v.w - 2 * GAP, maxH = v.h - v.bottom - 2 * GAP
  const w = clamp(c.w ?? (v.narrow ? maxW : 400), Math.min(MIN_W, maxW), maxW)
  const fullH = clamp(c.h ?? (v.narrow ? Math.min(520, Math.round(v.h * 0.62)) : 560), Math.min(MIN_H, maxH), maxH)
  const h = c.min ? HEAD : fullH
  const x = clamp(c.x ?? (v.narrow ? GAP : v.w - w - 24), GAP, v.w - w - GAP)
  const y = clamp(c.y ?? v.h - v.bottom - h - (v.narrow ? GAP : 24), GAP, v.h - v.bottom - h - GAP)
  const bx = clamp(c.bx ?? v.w - BUBBLE - 16, GAP, v.w - BUBBLE - GAP)
  const by = clamp(c.by ?? v.h - v.bottom - BUBBLE - 16, GAP, v.h - v.bottom - BUBBLE - GAP)

  // the chat stays live on other pages only while the window is open and not minimised
  const live = c.open && !c.min && !onChat
  useEffect(() => { tf().chatWin(live) }, [live])

  const base = useRef({ x, y, w, h: fullH, bx, by })
  const start = () => { base.current = { x, y, w, h: fullH, bx, by } }

  const move = useDrag((dx, dy) => setChatWin({ x: base.current.x + dx, y: base.current.y + dy }, false), () => setChatWin({}))
  const size = useDrag((dx, dy) => setChatWin({ w: base.current.w + dx, h: base.current.h + dy, min: false }, false), () => setChatWin({}))

  // the reopen button: tap to open, drag to move, drop on "Hide" to remove it
  const [dragB, setDragB] = useState<{ over: boolean } | null>(null)
  const hideZone = (px: number, py: number) => Math.abs(px + BUBBLE / 2 - v.w / 2) < 70 && py + BUBBLE / 2 > v.h - v.bottom - 110
  const bubble = useDrag(
    (dx, dy) => {
      const nx = base.current.bx + dx, ny = base.current.by + dy
      setDragB({ over: hideZone(nx, ny) })
      setChatWin({ bx: nx, by: ny }, false)
    },
    (moved) => {
      if (!moved) { setChatWin({ open: true, min: false }); return }
      const over = hideZone(c.bx ?? bx, c.by ?? by)
      setDragB(null)
      if (over) {
        setChatWin({ bubble: false, bx: null, by: null })
        window.TF_UI?.toast?.("Chat button hidden. Bring it back from your account menu.", { label: "Undo", fn: () => setChatWin({ bubble: true }) })
      } else setChatWin({})
    }
  )

  if (onChat) return null

  if (!c.open) {
    if (!c.bubble) return null
    return (
      <>
        {dragB ? (
          <div aria-hidden className={cn("pointer-events-none fixed z-40 flex -translate-x-1/2 items-center gap-1.5 rounded-full border px-4 py-2 text-sm shadow-lg transition-colors",
            dragB.over ? "border-destructive bg-destructive text-white" : "bg-background text-muted-foreground")}
            style={{ left: v.w / 2, top: v.h - v.bottom - 64 }}>
            <EyeOff className="size-4" /> Hide
          </div>
        ) : null}
        <button
          type="button"
          {...bubble}
          onPointerDown={(e) => { start(); bubble.onPointerDown(e) }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setChatWin({ open: true, min: false }); return }
            arrows(e, (dx, dy) => setChatWin({ bx: bx + dx, by: by + dy }))
          }}
          aria-label={`Open chat${s.unread ? `, ${s.unread} unread` : ""}`}
          aria-keyshortcuts="ArrowUp ArrowDown ArrowLeft ArrowRight"
          title="Open chat. Drag to move it; drop it on Hide to remove it."
          className="fixed z-40 grid size-14 touch-none place-items-center rounded-full bg-primary text-primary-foreground shadow-lg ring-1 ring-black/10 outline-none select-none focus-visible:ring-4 focus-visible:ring-ring/60 active:scale-95"
          style={{ left: bx, top: by }}
        >
          <MessagesSquare className="size-6" aria-hidden />
          {s.unread ? (
            <span className="absolute -top-1 -right-1 grid h-5 min-w-5 place-items-center rounded-full bg-destructive px-1 text-xs font-semibold text-white ring-2 ring-background">
              {s.unread > 9 ? "9+" : s.unread}
            </span>
          ) : null}
        </button>
      </>
    )
  }

  return (
    <section
      role="dialog"
      aria-modal="false"
      aria-label="Chat window"
      className="fixed z-40 flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-2xl ring-1 ring-black/5"
      style={{ left: x, top: y, width: w, height: h }}
    >
      <div
        {...move}
        onPointerDown={(e) => { start(); move.onPointerDown(e) }}
        onDoubleClick={(e) => { if (!(e.target as HTMLElement).closest("[data-nodrag]")) setChatWin({ min: !c.min }) }}
        className="flex h-11 shrink-0 cursor-grab touch-none items-center gap-1 border-b bg-muted/60 pr-1 pl-1 select-none active:cursor-grabbing"
      >
        <button
          type="button"
          data-nodrag
          onKeyDown={(e) => arrows(e, (dx, dy) => setChatWin({ x: x + dx, y: y + dy }))}
          aria-label="Move chat window with the arrow keys"
          title="Drag the bar to move"
          className="grid size-8 place-items-center rounded-md text-muted-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <GripHorizontal className="size-4" aria-hidden />
        </button>
        <MessagesSquare className="size-4 text-primary" aria-hidden />
        <b className="min-w-0 flex-1 truncate font-heading text-sm font-semibold">Chat</b>
        {c.min && s.unread ? <span className="grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1.5 text-xs font-semibold text-primary-foreground" aria-label={`${s.unread} unread`}>{s.unread > 9 ? "9+" : s.unread}</span> : null}
        <span data-nodrag className="flex items-center">
          <NotificationsButton compact />
          <Button variant="ghost" size="icon-sm" className="size-8" onClick={() => tf().go("chat")} aria-label="Open the full Chat page" title="Full page"><Maximize2 /></Button>
          <Button variant="ghost" size="icon-sm" className="size-8" onClick={() => setChatWin({ min: !c.min })} aria-label={c.min ? "Restore chat window" : "Minimise chat window"} aria-expanded={!c.min} title={c.min ? "Restore" : "Minimise"}>
            {c.min ? <ChevronUp /> : <Minus />}
          </Button>
          <Button variant="ghost" size="icon-sm" className="size-8" onClick={() => setChatWin({ open: false, min: false })} aria-label="Close chat window" title="Close"><X /></Button>
        </span>
      </div>
      {!c.min ? (
        <>
          <Suspense fallback={<p className="m-auto text-sm text-muted-foreground" role="status">Loading chat…</p>}><Body /></Suspense>
          <button
            type="button"
            {...size}
            onPointerDown={(e) => { start(); size.onPointerDown(e) }}
            onKeyDown={(e) => arrows(e, (dx, dy) => setChatWin({ w: w + dx, h: fullH + dy }))}
            aria-label="Resize chat window with the arrow keys"
            title="Drag to resize"
            className="absolute right-0 bottom-0 z-10 grid size-6 cursor-nwse-resize touch-none place-items-center rounded-tl-md bg-card/80 text-muted-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <MoveDiagonal2 className="size-3.5" aria-hidden />
          </button>
        </>
      ) : null}
    </section>
  )
}
