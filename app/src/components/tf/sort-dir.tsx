import { ArrowDownWideNarrow, ArrowUpNarrowWide } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { tf, useTFData } from "@/lib/tf"

/** Flips the order of the sort next to it (ascending/descending). `k` is that sort's state name; the choice is remembered on this device. */
export function SortDir({ k, className }: { k: string; className?: string }) {
  const rev = useTFData(() => tf().isRev(k))
  return (
    <Button variant="outline" size="icon" className={cn("size-10 shrink-0", className)} aria-pressed={rev} onClick={() => tf().sortRev(k)}
      aria-label={rev ? "Reversed order. Tap for the normal order" : "Reverse the order"} title={rev ? "Reversed order" : "Reverse the order"}>
      {rev ? <ArrowUpNarrowWide /> : <ArrowDownWideNarrow />}
    </Button>
  )
}
