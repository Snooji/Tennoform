import { FlaskConical } from "lucide-react"

import { Button } from "@/components/ui/button"
import { tf } from "@/lib/tf"

/** Shown on every page while the sample account is open, and stays in view under the header while scrolling. */
export function DemoBanner() {
  return (
    <div role="status" className="sticky top-[calc(3.5rem+env(safe-area-inset-top))] z-[19] flex flex-wrap items-center gap-x-3 gap-y-2 border-b bg-muted px-4 py-2 text-sm md:px-6">
      <FlaskConical aria-hidden className="size-4 text-primary" />
      <span className="min-w-0 flex-1">
        <b className="font-semibold">Sample account.</b> <span className="max-sm:hidden">These ranks, goals and tasks are examples, not yours, and nothing here is saved.</span><span className="sm:hidden">Example data, not saved.</span>
      </span>
      <Button size="sm" className="h-8 shrink-0" onClick={() => tf().act("button", { "data-demox": "" })}>
        Use my own
      </Button>
    </div>
  )
}
