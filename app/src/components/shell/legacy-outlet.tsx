import { useLayoutEffect, useRef } from "react"

/** Moves the existing app's page container (#app) into the shell. Pages not yet rebuilt keep rendering there. */
export function LegacyOutlet() {
  const slot = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const app = document.getElementById("app")
    if (app && slot.current && app.parentElement !== slot.current) slot.current.appendChild(app)
  }, [])
  return <div ref={slot} className="tf-legacy min-w-0 flex-1" />
}
