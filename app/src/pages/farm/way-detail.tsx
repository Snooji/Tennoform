import { Check, ExternalLink, Lightbulb, Lock, MapPin, Plus } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Thumb } from "@/components/tf/thumb"
import { fmt, tf, type WayDetail } from "@/lib/tf"

const TAG: Record<string, string> = {
  fastest: "Fastest", beginner: "Beginner friendly", afk: "Low effort", solo: "Solo", squad: "Best in a squad",
  endgame: "Endgame", daily: "Daily", weekly: "Weekly",
}

/** "Ways to farm" something that isn't a single drop: the best routes first, each with what to do and why it works. */
export function WayView({ w, inSheet }: { w: WayDetail; inSheet?: boolean }) {
  return (
    <Card className={cn("gap-4 px-5", inSheet && "border-0 bg-transparent px-1 py-1 shadow-none ring-0")}>
      {!inSheet ? (
        <header className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">{w.cat}</span>
          <h2 className="font-heading text-2xl leading-tight font-semibold">{w.n}</h2>
        </header>
      ) : null}
      {w.sum ? <p className="text-sm">{w.sum}</p> : null}
      {w.plat?.groups.length ? (
        <section className="flex flex-col gap-3" aria-labelledby="pf-h">
          <div className="flex flex-col gap-0.5">
            <h3 id="pf-h" className="font-heading text-lg leading-tight font-semibold">Easy to farm, sells well on warframe.market</h3>
            <p className="text-xs text-muted-foreground">Ranked by platinum you can expect per attempt: the 7-day average price times your chance of getting it. Only things that sold at least 10 last week, from the {w.plat.date} snapshot.</p>
          </div>
          {w.plat.groups.map((g) => (
            <div key={g.t} className="flex flex-col gap-1">
              <h4 className="text-sm font-semibold">{g.t}</h4>
              <ul className="flex flex-col divide-y border-y">
                {g.items.map((x) => (
                  <li key={x.key}>
                    <button type="button" onClick={() => tf().farmPick(x.key)} className="flex w-full items-start gap-3 py-2 text-left outline-none hover:bg-muted/50 focus-visible:ring-3 focus-visible:ring-ring/50">
                      {x.img ? <Thumb src={x.img} className="mt-0.5 size-8" /> : null}
                      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <span className="flex items-baseline justify-between gap-3">
                          <b className="truncate text-sm font-medium">{x.n}</b>
                          <b className="shrink-0 font-heading text-base font-semibold tabular-nums">{x.price}p</b>
                        </span>
                        <span className="text-xs text-muted-foreground">{x.how}</span>
                        <span className="text-xs text-muted-foreground tabular-nums">
                          {x.chance < 100 ? `${x.chance}% chance · about ${x.per}p ${g.per}` : "Guaranteed"} · {fmt(x.sold)} sold last week
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      ) : null}
      <ol className="flex flex-col divide-y border-y" aria-label="Ways to get it, best first">
        {w.ways.map((x, i) => (
          <li key={x.t} className="flex gap-3 py-3">
            <span aria-hidden className={cn("w-5 shrink-0 pt-px font-heading text-base leading-tight font-semibold tabular-nums", i === 0 ? "text-foreground" : "text-muted-foreground")}>{i + 1}.</span>
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <b className="font-heading text-base leading-tight font-semibold">{x.t}</b>
                {x.tags.map((t) => <Badge key={t} variant="outline" className={cn(t === "fastest" ? "border-primary/40 text-primary" : "text-muted-foreground")}>{TAG[t] || t}</Badge>)}
              </div>
              {x.how ? <p className="text-sm">{x.how}</p> : null}
              {x.why ? <p className="text-sm text-muted-foreground">{x.why}</p> : null}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                {x.req ? <span className="inline-flex items-center gap-1 text-muted-foreground"><Lock className="size-3.5" aria-hidden /> Needs: {x.req}</span> : null}
                {x.planet ? (
                  <a href="#missions" className="inline-flex items-center gap-1 underline decoration-primary/50 underline-offset-4 hover:decoration-primary"
                    onClick={(e) => { e.preventDefault(); tf().act("a", { href: "#", "data-go": "node|" + x.planet }) }}>
                    <MapPin className="size-3.5" aria-hidden /> {x.node} on the star chart
                  </a>
                ) : null}
              </div>
            </div>
          </li>
        ))}
      </ol>
      {w.tips.length ? (
        <div className="flex flex-col gap-2">
          <span className="flex items-center gap-1.5 text-sm font-medium"><Lightbulb className="size-4 text-muted-foreground" aria-hidden /> Make it faster</span>
          <ul className="flex list-disc flex-col gap-1.5 pl-5 text-sm text-muted-foreground">{w.tips.map((t) => <li key={t}>{t}</li>)}</ul>
        </div>
      ) : null}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" className="h-9" disabled={w.hasTask} onClick={() => tf().wayTask(w.n)}>{w.hasTask ? <Check /> : <Plus />} {w.hasTask ? "In tasks" : "Add to tasks"}</Button>
        {w.w ? <a href={w.w} target="_blank" rel="noopener" className="inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-sm font-medium hover:bg-muted">Wiki <ExternalLink className="size-3.5" aria-hidden /><span className="sr-only">(opens in a new tab)</span></a> : null}
      </div>
    </Card>
  )
}
