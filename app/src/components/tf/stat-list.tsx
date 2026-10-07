import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

export type Stat = { k: ReactNode; v: ReactNode; x?: ReactNode; strong?: boolean; key?: string }

const COLS = { 1: "", 2: "sm:grid-cols-2", 3: "sm:grid-cols-2 lg:grid-cols-3", 4: "sm:grid-cols-2 lg:grid-cols-4" }

/**
 * Numbers as a list of label/value rows separated by hairlines, read like a spec sheet.
 * Use this instead of a grid of boxed stat tiles: same facts, no boxes inside the panel.
 */
export function StatList({ items, cols = 2, className }: { items: Stat[]; cols?: 1 | 2 | 3 | 4; className?: string }) {
  return (
    <dl className={cn("grid gap-x-8", COLS[cols], className)}>
      {items.map((s, i) => (
        <div key={s.key ?? (typeof s.k === "string" ? s.k : i)} className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-3 border-t py-2">
          <dt className="min-w-0 truncate text-sm text-muted-foreground">{s.k}</dt>
          <dd className={cn("text-right font-heading text-base leading-tight font-semibold tabular-nums", s.strong && "text-primary")}>{s.v}</dd>
          {s.x ? <dd className="col-span-2 truncate text-xs text-muted-foreground">{s.x}</dd> : null}
        </div>
      ))}
    </dl>
  )
}
