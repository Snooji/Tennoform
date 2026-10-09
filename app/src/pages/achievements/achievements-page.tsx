import { motion, useReducedMotion } from "motion/react"
import { BarChart3, BookOpen, CalendarCheck, Check, ListTodo, Map, RefreshCw, Star, Undo2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Segmented } from "@/components/ui/segmented"
import { cn } from "@/lib/utils"
import { fmt, tf, useTFData, type AchData } from "@/lib/tf"

const ICON: Record<string, typeof Star> = {
  m: Star, rk: BarChart3, n: Map, sp: Map, q: BookOpen, build: Check, bp: Check, part: Check, dw: CalendarCheck, t: ListTodo, sync: RefreshCw, bulk: Check,
}

function Week({ days }: { days: AchData["days"] }) {
  const reduce = useReducedMotion()
  const max = Math.max(1, ...days.map((d) => d.n))
  return (
    <Card size="sm" className="px-4">
      <div className="grid grid-cols-7 items-end gap-2" role="img" aria-label={"Last 7 days: " + days.map((d) => `${d.label} ${d.n}`).join(", ")}>
        {days.map((d, i) => (
          <div key={i} className="flex flex-col items-center gap-1" title={`${d.n} things · +${fmt(d.xp)} XP`}>
            <div className="flex h-16 w-full max-w-9 items-end overflow-hidden rounded-md bg-muted">
              <motion.div
                className={cn("w-full rounded-md", d.today ? "bg-primary" : "bg-primary/60")}
                initial={{ height: reduce ? `${(d.n / max) * 100}%` : 0 }}
                animate={{ height: `${Math.max(d.n ? 6 : 0, (d.n / max) * 100)}%` }}
                transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : i * 0.04, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <span className={cn("text-xs", d.today ? "font-semibold text-foreground" : "text-muted-foreground")}>{d.label}</span>
            <span className="text-xs tabular-nums text-muted-foreground">{d.n}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}

export function AchievementsPage() {
  const d = useTFData(() => tf().ach())
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-4 py-5 md:px-6 md:py-6">
      <header className="flex flex-col gap-1">
        <h1 className="font-heading text-3xl font-semibold">Achievements</h1>
        <p className="text-sm text-muted-foreground">Everything you've ticked off, ranked up or mastered. Tapped something by mistake? Undo it here.</p>
      </header>
      <Segmented
        className="self-start"
        value={d.period}
        onValueChange={(v) => tf().achSet(v)}
        items={[
          { value: "today", label: "Today" },
          { value: "week", label: "This week" },
          { value: "all", label: "All time" },
        ]}
      />
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {d.tiles.map((t) => (
          <Card key={t.k} size="sm" className="gap-0.5 px-4">
            <span className="text-xs text-muted-foreground">{t.k}</span>
            <b className="font-heading text-2xl leading-tight font-semibold tabular-nums">{t.v}</b>
            {t.x ? <span className="text-xs text-muted-foreground">{t.x}</span> : null}
          </Card>
        ))}
      </div>
      <Week days={d.days} />
      {d.note ? <p className="text-xs text-muted-foreground">{d.note}</p> : null}
      {d.empty ? (
        <Card className="items-start gap-2 p-6 text-sm">
          <b className="font-heading text-base font-semibold">
            {d.period === "today" ? "Nothing yet today." : d.period === "week" ? "Nothing yet this week." : "Nothing logged yet."}
          </b>
          <p className="text-muted-foreground">
            Tick a checklist item on{" "}
            <a href="/today/" className="text-foreground underline decoration-primary/60 underline-offset-4">Today</a>, update a rank on{" "}
            <a href="/ranks/" className="text-foreground underline decoration-primary/60 underline-offset-4">Ranks</a>, or finish a task, and it shows up here.
          </p>
        </Card>
      ) : (
        d.groups.map((g) => (
          <Card key={g.d} className="gap-0 py-0">
            <h2 className="border-b px-4 py-3 font-heading text-base leading-tight font-semibold">{g.d}</h2>
            <ul className="flex flex-col divide-y">
              {g.items.map((e) => {
                const Icon = ICON[e.k] || Check
                return (
                  <li key={e.id} className="grid grid-cols-[1.75rem_minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 px-4 py-2.5 sm:grid-cols-[1.75rem_minmax(0,1fr)_auto_auto]">
                    <Icon aria-hidden className="size-4 justify-self-center text-primary" />
                    <span className="flex min-w-0 flex-col">
                      <span className="font-medium [overflow-wrap:anywhere]">{e.label}</span>
                      <span className="text-xs text-muted-foreground">{e.time}{e.extra ? " · " + e.extra : ""}</span>
                    </span>
                    {e.xp ? (
                      <Badge variant="outline" className="col-start-2 row-start-2 border-primary/40 text-primary tabular-nums sm:col-start-auto sm:row-start-auto">
                        {e.xp > 0 ? "+" : ""}{fmt(e.xp)} XP
                      </Badge>
                    ) : (
                      <span className="hidden sm:block" />
                    )}
                    {e.canUndo ? (
                      <Button variant="outline" size="sm" className="col-start-3 row-start-1 h-8" onClick={() => tf().logUndo(e.id)} aria-label={`Undo: ${e.label}`}>
                        <Undo2 /> Undo
                      </Button>
                    ) : (
                      <span className="col-start-3 row-start-1 text-xs text-muted-foreground">Sync</span>
                    )}
                  </li>
                )
              })}
            </ul>
          </Card>
        ))
      )}
    </div>
  )
}
