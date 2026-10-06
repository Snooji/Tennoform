import { useEffect, useState } from "react"
import { Check, Hexagon, Plus, ShoppingBasket, Target, X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Toggle } from "@/components/ui/toggle"
import { ModCard } from "@/components/tf/mod-card"
import { Thumb } from "@/components/tf/thumb"
import { cn } from "@/lib/utils"
import { fmt, tf, useTFData, type BuildGoal, type GoalsData } from "@/lib/tf"

const SORTS = [{ value: "added", label: "Order added" }, { value: "progress", label: "Most complete" }, { value: "name", label: "Name" }]
const go = (key: string) => (e: React.MouseEvent) => {
  e.preventDefault()
  tf().act("a", { href: "#", "data-go": key })
}
const linkCls = "underline decoration-primary/50 underline-offset-4 hover:decoration-primary"

function VaultBadge({ v }: { v: GoalsData["goals"][number]["vault"] }) {
  if (!v) return null
  const cls =
    v.kind === "vaulted"
      ? "border-red-500/40 text-red-700 dark:text-red-300"
      : v.kind === "now"
        ? "border-emerald-500/40 text-emerald-700 dark:text-emerald-400"
        : "text-muted-foreground"
  return <Badge variant="outline" className={cls}>{v.text}</Badge>
}

function Have({ n, have }: { n: string; have: number | null }) {
  const [v, setV] = useState(have == null ? "" : String(have))
  useEffect(() => setV(have == null ? "" : String(have)), [have])
  return (
    <Input
      type="number"
      inputMode="numeric"
      min={0}
      value={v}
      placeholder="?"
      onChange={(e) => setV(e.target.value)}
      onBlur={() => v !== (have == null ? "" : String(have)) && tf().setInv(n, v)}
      onKeyDown={(e) => e.key === "Enter" && (e.currentTarget as HTMLInputElement).blur()}
      aria-label={`How many ${n} you have`}
      className="h-8 w-24 text-right tabular-nums [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
    />
  )
}

function BuildGoals({ list }: { list: BuildGoal[] }) {
  if (!list.length) return null
  return (
    <section className="flex flex-col gap-3" aria-labelledby="bg-h">
      <h2 id="bg-h" className="font-heading text-xl font-semibold">Build goals</h2>
      {list.map((g) => (
        <Card key={g.id} size="sm" className="gap-3 px-4">
          <div className="flex items-start gap-3">
            <Thumb src={g.img} className="size-12" />
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <a href="#" onClick={(e) => { e.preventDefault(); tf().buildLibSet({ sel: g.from }); tf().arsenalSet({ tab: "top" }); location.hash = "arsenal" }} className={cn("truncate font-heading text-base font-semibold", linkCls)}>{g.name}</a>
              <span className="text-xs text-muted-foreground tabular-nums">{g.have}/{g.total} mods and arcanes owned{g.missing.length ? ` · ${g.missing.length} to get` : " · complete"}</span>
            </div>
            <Button variant="ghost" size="icon-sm" onClick={() => tf().buildGoalRemove(g.id)} aria-label={`Remove the ${g.name} goal`}><X /></Button>
          </div>
          <Progress value={(100 * g.have) / (g.total || 1)} className="h-1.5" aria-label={`${g.name}: ${g.have} of ${g.total} parts`} />
          {g.missing.length ? <ul className="grid gap-2 sm:grid-cols-2">{g.missing.map((m, i) => <ModCard key={m.key + i} m={m} />)}</ul> : <p className="text-sm text-primary">You own every part. Time to Forma it up.</p>}
        </Card>
      ))}
    </section>
  )
}

export function GoalsPage() {
  const d = useTFData(() => tf().goals())
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-5 md:px-6 md:py-6">
      <header className="flex flex-col gap-1">
        <h1 className="font-heading text-3xl font-semibold">Goals</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Tap <b className="text-foreground">Track</b> on any item to add it here. You get one combined shopping list, the relics you still need, and progress for each goal.
        </p>
      </header>
      <BuildGoals list={d.bgoals} />
      {!d.goals.length && d.bgoals.length ? null : !d.goals.length ? (
        <Card className="items-start gap-3 p-6 text-sm">
          <Target aria-hidden className="size-6 text-primary" />
          <b className="font-heading text-base font-semibold">No goals yet</b>
          <p className="text-muted-foreground">Open any Warframe, weapon or Prime set and tap Track, or save a build from Builds as a goal.</p>
          <a href="#frames" className={cn(buttonVariants(), "h-9")}>Browse Warframes</a>
        </Card>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <Select items={SORTS} value={d.sort} onValueChange={(v) => tf().goalsSet({ s: String(v) })}>
              <SelectTrigger className="h-9 min-w-44" aria-label="Sort goals"><span className="text-muted-foreground">Sort:</span><SelectValue /></SelectTrigger>
              <SelectContent>{SORTS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {d.goals.map((g) => (
              <Card key={g.name} size="sm" className={cn("gap-3 px-4", g.built && "ring-primary/30")}>
                <div className="flex items-start gap-3">
                  <Thumb src={g.img} className="size-12" />
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <a href="#" onClick={go("item|" + g.name)} className={cn("truncate font-heading text-base font-semibold", linkCls)}>{g.name}</a>
                    <span className="flex flex-wrap gap-1">
                      <VaultBadge v={g.vault} />
                      {g.built ? <Badge className="border-primary/40 bg-primary/15 text-primary"><Check /> Built</Badge> : null}
                    </span>
                  </div>
                  <Button variant="ghost" size="icon-sm" onClick={() => tf().goalRemove(g.name)} aria-label={`Remove ${g.name} from Goals`}><X /></Button>
                </div>
                <Progress value={(100 * g.done) / (g.total || 1)} className="h-1.5" aria-label={`${g.name}: ${g.done} of ${g.total} steps`} />
                <span className="text-xs text-muted-foreground tabular-nums">{g.done}/{g.total} steps · {fmt(g.xp)} Mastery XP</span>
              </Card>
            ))}
          </div>
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
            <Card className="gap-0 py-0">
              <CardHeader className="border-b py-3">
                <CardTitle><h2 className="flex items-center gap-2 font-heading text-lg leading-tight font-semibold"><ShoppingBasket aria-hidden className="size-4 text-primary" /> Shopping list</h2></CardTitle>
                <CardAction>
                  <Toggle variant="outline" size="sm" pressed={d.short} onPressedChange={(v) => tf().goalsSet({ short: v })} className="h-8 data-[pressed]:border-primary/60 data-[pressed]:bg-primary/15">
                    Only what I'm short on
                  </Toggle>
                </CardAction>
              </CardHeader>
              <p className="border-b px-4 py-2.5 text-xs text-muted-foreground">
                {fmt(d.credits)} credits for everything not built yet. Enter what you have to see what's left, then turn the rest into tasks.
              </p>
              {d.shop.length ? (
                <ul className="flex flex-col divide-y">
                  {d.shop.map((r) => (
                    <li key={r.n} className="flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-2.5">
                      <span className="flex min-w-0 flex-1 basis-48 flex-col">
                        <a href="#" onClick={go("res|" + r.n)} className={cn("self-start font-medium", linkCls)}>{r.n}</a>
                        <span className="text-xs text-muted-foreground">{r.where}</span>
                      </span>
                      <span className="flex items-center gap-2 text-sm tabular-nums">
                        <span className="text-muted-foreground">need {fmt(r.need)} · have</span>
                        <Have n={r.n} have={r.have} />
                        {r.have != null ? (
                          r.left ? <b className="font-semibold">{fmt(r.left)} left</b> : <span className="text-emerald-700 dark:text-emerald-400"><Check className="inline size-4" /> enough</span>
                        ) : null}
                      </span>
                      {r.left ? (
                        <Button variant="outline" size="sm" className="h-8" disabled={r.task.has} onClick={() => tf().addTaskFrom(r.task.key, r.task.label)} aria-label={(r.task.has ? "In your tasks: " : "Add task: ") + r.task.label}>
                          {r.task.has ? <Check /> : <Plus />} {r.task.has ? "In tasks" : "Task"}
                        </Button>
                      ) : null}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-4 py-6 text-sm text-muted-foreground">Nothing left to farm.</p>
              )}
            </Card>
            {d.relics.length ? (
              <Card size="sm" className="self-start">
                <CardHeader>
                  <CardTitle><h2 className="flex items-center gap-2 font-heading text-lg leading-tight font-semibold"><Hexagon aria-hidden className="size-4 text-primary" /> Relics to crack</h2></CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 text-sm">
                  {d.relics.map((e) => (
                    <div key={e.era}>
                      <b className="font-medium">{e.era}</b>
                      <div className="mt-1 flex flex-wrap gap-x-2 gap-y-1">
                        {e.relics.map((r) => <a key={r} href="#" onClick={go("relic|" + r)} className={cn("text-muted-foreground hover:text-foreground", linkCls)}>{r}</a>)}
                      </div>
                    </div>
                  ))}
                  <a href="#today" className={cn(buttonVariants({ variant: "outline", size: "sm" }), "h-8 self-start")}>See open fissures</a>
                </CardContent>
              </Card>
            ) : null}
          </div>
        </>
      )}
    </div>
  )
}
