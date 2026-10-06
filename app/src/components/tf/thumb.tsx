import { useState } from "react"

import { cn } from "@/lib/utils"

/** Item art from the game CDN with a quiet placeholder if it's missing or fails to load. */
export function Thumb({ src, className }: { src: string; className?: string }) {
  const [failed, setFailed] = useState(false)
  return (
    <span data-thumb aria-hidden className={cn("block shrink-0 overflow-hidden rounded-md bg-muted", className)}>
      {src && !failed ? (
        <img src={src} alt="" loading="lazy" decoding="async" onError={() => setFailed(true)} className="size-full object-contain p-0.5" />
      ) : null}
    </span>
  )
}
