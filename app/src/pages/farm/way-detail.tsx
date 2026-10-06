import { Check, ExternalLink, Lightbulb, Lock, MapPin, Plus } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { tf, type WayDetail } from "@/lib/tf"

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
      <ol className="flex flex-col gap-3">
        {w.ways.map((x, i) => (
          <li key={x.t} className={cn("flex gap-3 rounded-2xl border p-3.5", i === 0 && "border-primary/40 bg-primary/5")}>
            <span aria-hidden className={cn("grid size-7 shrink-0 place-items-center rounded-full font-heading text-sm font-semibold", i === 0 ? "bg-primary text-primary-foreground" : "bg-muted")}>{i + 1}</span>
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
        <div className="flex flex-col gap-2 rounded-2xl bg-muted/40 p-3.5">
          <span className="flex items-center gap-1.5 text-sm font-medium"><Lightbulb className="size-4 text-primary" aria-hidden /> Make it faster</span>
          <ul className="flex flex-col gap-1.5 text-sm text-muted-foreground">{w.tips.map((t) => <li key={t}>{t}</li>)}</ul>
        </div>
      ) : null}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" className="h-9" disabled={w.hasTask} onClick={() => tf().wayTask(w.n)}>{w.hasTask ? <Check /> : <Plus />} {w.hasTask ? "In tasks" : "Add to tasks"}</Button>
        {w.w ? <a href={w.w} target="_blank" rel="noopener" className="inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-sm font-medium hover:bg-muted">Wiki <ExternalLink className="size-3.5" aria-hidden /><span className="sr-only">(opens in a new tab)</span></a> : null}
      </div>
    </Card>
  )
}
