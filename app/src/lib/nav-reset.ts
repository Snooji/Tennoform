import { useEffect, useRef } from "react"

/** The bottom tabs fire this before switching section: every open sheet, dialog, menu and search closes. */
export const NAV_RESET = "tf:navreset"
export const navReset = () => window.dispatchEvent(new Event(NAV_RESET))
export function useNavReset(fn: () => void) {
  const ref = useRef(fn)
  ref.current = fn
  useEffect(() => {
    const on = () => ref.current()
    window.addEventListener(NAV_RESET, on)
    return () => window.removeEventListener(NAV_RESET, on)
  }, [])
}
