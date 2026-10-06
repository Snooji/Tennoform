import { FlaskConical } from "lucide-react"

import { Button } from "@/components/ui/button"
import { tf } from "@/lib/tf"

/** Shown on every page while the sample account is open. */
export function DemoBanner() {
  return (
    <div role="status" className="flex flex-wrap items-center gap-3 border-b border-primary/30 bg-primary/10 px-4 py-2 text-sm md:px-6">
      <FlaskConical aria-hidden className="size-4 text-primary" />
      <span className="flex-1">
        <b className="font-semibold">Sample account.</b> Nothing here is saved.
      </span>
      <Button size="sm" className="h-8" onClick={() => tf().act("button", { "data-demox": "" })}>
        Use my own
      </Button>
    </div>
  )
}
