import { useLayoutEffect, useRef } from "react"

import { cn } from "@/lib/utils"
import { tf } from "@/lib/tf"

/** Markup from the existing app, shown as is until that part is rebuilt. Its buttons and ticks keep working. */
export function Island({ html, id, className }: { html: string; id?: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    tf().island(ref.current)
  }, [html])
  return <div ref={ref} id={id} className={cn("tf-island", className)} dangerouslySetInnerHTML={{ __html: html }} />
}
