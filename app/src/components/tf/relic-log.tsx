import { ScrollText } from "lucide-react"

import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { fmt, tf, useTFData } from "@/lib/tf"

const RAR = { C: "Common", U: "Uncommon", R: "Rare" } as const
const RARC = { C: "text-[#c58b5a]", U: "text-[#b8c0c8]", R: "text-[#e4c25a]" } as const

/** Tap what a relic gave you. Keeps a count per reward, a ducat total, and uses up one intact relic from your count. */
export function RelicLogCard({ relic }: { relic: string }) {
  const d = useTFData(() => tf().relicLog(relic))
  if (!d) return null
  return (
    <Card className="gap-3 px-5">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h2 className="flex items-center gap-2 font-heading text-lg font-semibold"><ScrollText className="size-4 text-primary" aria-hidden /> My openings</h2>
        <span className="text-xs text-muted-foreground tabular-nums">
          {d.opens ? `${d.opens} opened · ${fmt(d.ducats)} ducats' worth · ${d.rare} rare` : "Tap what you got each time you open one"}{d.intact ? ` · ${d.intact} intact left` : ""}
        </span>
      </div>
      <ul className="grid gap-1.5 sm:grid-cols-2" aria-label="What did you get?">
        {d.rewards.map((r) => (
          <li key={r.n}>
            <button type="button" onClick={() => tf().relicOpen(relic, r.n)} className="flex min-h-11 w-full items-center gap-2 rounded-xl border px-3 py-1.5 text-left transition-colors hover:bg-muted/60 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none">
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="text-sm leading-tight font-medium">{r.n}</span>
                <span className="text-xs text-muted-foreground"><span className={cn("font-medium", RARC[r.rar])}>{RAR[r.rar]}</span> · {r.chance}% intact{r.du ? ` · ${r.du} ducats` : ""}</span>
              </span>
              {d.counts[r.n] ? <span className="shrink-0 rounded-full border px-2 text-xs tabular-nums">×{d.counts[r.n]}</span> : null}
            </button>
          </li>
        ))}
      </ul>
      <p className="text-xs text-muted-foreground">Each tap logs one opening. Undo is in the message that pops up.</p>
    </Card>
  )
}
