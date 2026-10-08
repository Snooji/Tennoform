import { memo, useState } from "react"
import { ChevronDown } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Island } from "@/components/tf/island"
import { Thumb } from "@/components/tf/thumb"
import { cn } from "@/lib/utils"
import { fmt, tf, type GearRow as Gear } from "@/lib/tf"

/** One piece of gear: tick when mastered; open it for every step to build it (blueprint, parts, resources). */
export const GearRow = memo(function GearRow({ g }: { g: Gear }) {
  const [open, setOpen] = useState(false)
  const [tree, setTree] = useState("")
  return (
    <li className={cn("flex gap-3 px-4 py-2.5", g.done && "bg-muted/30")}>
      <Checkbox className="mt-2 size-5 rounded-md" checked={g.done} onCheckedChange={(v) => tf().gearTick(g.n, !!v)} aria-label={(g.done ? "Not mastered: " : "Mastered: ") + g.n} />
      <Collapsible
        className="min-w-0 flex-1"
        open={open}
        onOpenChange={(o) => {
          if (o && !tree) setTree(tf().itemTree(g.n, g.note))
          setOpen(o)
        }}
      >
        <CollapsibleTrigger className="group flex w-full cursor-pointer items-center gap-3 rounded-md text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
          <Thumb src={g.img} className="size-9" />
          <span className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="flex flex-wrap items-center gap-1.5">
              <span className={cn("font-medium", g.done && "text-muted-foreground line-through decoration-primary/70")}>{g.n}</span>
              {g.mr ? <Badge variant="outline">MR {g.mr}</Badge> : null}
              {g.rk ? <Badge variant="outline" className="text-muted-foreground">R{g.rk}</Badge> : null}
              <Badge variant="outline" className="border-primary/40 text-primary tabular-nums">{fmt(g.xp)} XP</Badge>
              {g.price ? <span className="text-xs text-muted-foreground">{g.price}</span> : null}
            </span>
            {g.note ? <span className="text-xs text-muted-foreground">{g.note}</span> : null}
          </span>
          <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
            Steps <ChevronDown aria-hidden className="size-4 transition-transform group-data-[panel-open]:rotate-180" />
          </span>
        </CollapsibleTrigger>
        <CollapsibleContent>{tree ? <Island html={tree} className="tf-flat mt-2" /> : null}</CollapsibleContent>
      </Collapsible>
    </li>
  )
})
