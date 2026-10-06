import { useEffect, useLayoutEffect, useRef } from "react"

import { cn } from "@/lib/utils"
import { tf } from "@/lib/tf"

const typingIn = (el: HTMLElement) => {
  const a = document.activeElement
  return !!a && el.contains(a) && a.matches("input:not([type=checkbox]):not([type=radio]),textarea,select,[contenteditable]")
}

/**
 * Markup from the existing app, shown as is until that part is rebuilt. Its buttons and ticks keep working.
 * While you're typing in it, updates wait until you leave the field, so nothing you typed is lost.
 */
export function Island({ html, id, className }: { html: string; id?: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const shown = useRef<string | null>(null)
  const waiting = useRef<string | null>(null)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el || shown.current === html) return
    if (shown.current != null && typingIn(el)) {
      waiting.current = html
      return
    }
    el.innerHTML = html
    shown.current = html
    waiting.current = null
    tf().island(el)
  }, [html])
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const out = () =>
      window.setTimeout(() => {
        if (waiting.current == null || typingIn(el)) return
        el.innerHTML = waiting.current
        shown.current = waiting.current
        waiting.current = null
        tf().island(el)
      }, 0)
    el.addEventListener("focusout", out)
    return () => el.removeEventListener("focusout", out)
  }, [])
  return <div ref={ref} id={id} className={cn("tf-island", className)} />
}
