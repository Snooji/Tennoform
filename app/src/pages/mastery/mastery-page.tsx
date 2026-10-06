import { useState } from "react"
import { Check, ChevronDown, Info } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GearRow } from "@/components/tf/gear-row"
import { Island } from "@/components/tf/island"
import { cn } from "@/lib/utils"
import { fmt, tf, useTF, useTFData, type GearRow as Gear, type MasteryData, type RouteStep } from "@/lib/tf"
import { MasteryRing } from "@/pages/home/mastery-hero"
import { Helper } from "./helper"

const TABS = [
  { value: "path", label: "Path to max" }, { value: "helper", label: "Quick wins" }, { value: "ladder", label: "Rank ladder" }, { value: "sheet", label: "Starter weapons (MR 0–12)" },
  { value: "sframes", label: "Easy Warframes" }, { value: "craft", label: "Crafting chains" }, { value: "xp", label: "XP farms" },
]
const linkCls = "underline decoration-primary/50 underline-offset-4 hover:decoration-primary"

function Section({ title, items, xp, open = true, children }: { title: string; items: Gear[]; xp?: number; open?: boolean; children?: React.ReactNode }) {
  const [o, setO] = useState(open)
  const done = items.filter((g) => g.done).length
  return (
    <Card className="gap-0 py-0">
      <Collapsible open={o} onOpenChange={setO}>
        <CollapsibleTrigger className="group flex w-full cursor-pointer flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3 text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
          <h3 className="font-heading text-base leading-tight font-semibold">{title}</h3>
          <span className="text-xs text-muted-foreground tabular-nums">{done}/{items.length}{xp ? ` · ${fmt(xp)} XP` : ""}</span>
          <Progress value={(100 * done) / (items.length || 1)} className="h-1 min-w-20 flex-1" aria-label={`${title}: ${done} of ${items.length} mastered`} />
          <ChevronDown aria-hidden className="size-4 text-muted-foreground transition-transform group-data-[panel-open]:rotate-180" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          {children}
          <ul className="flex flex-col divide-y border-t">{items.map((g) => <GearRow key={g.n} g={g} />)}</ul>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}

function Path({ d }: { d: MasteryData }) {
  const stat = (k: string, v: number, strong = false) => (
    <div className="flex flex-col gap-0.5 rounded-lg border bg-background/40 p-3">
      <span className="text-xs text-muted-foreground">{k}</span>
      <b className={cn("font-heading text-xl leading-tight tabular-nums", strong ? "font-semibold text-primary" : "font-semibold")}>{fmt(v)}</b>
    </div>
  )
  return (
    <>
      <Card size="sm">
        <CardHeader>
          <CardTitle><h2 className="font-heading text-lg leading-tight font-semibold">Plan to rank {d.targetLabel}</h2></CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Select items={d.targets} value={d.target} onValueChange={(v) => tf().masterySet({ target: String(v) })}>
            <SelectTrigger className="h-9 min-w-56 self-start" aria-label="Target rank"><span className="text-muted-foreground">Target:</span><SelectValue /></SelectTrigger>
            <SelectContent>{d.targets!.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
          </Select>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            {stat("XP still needed", d.need!, true)}
            {stat("XP left in gear you can use", d.gearLeft!)}
            {stat("XP left on the star chart", d.nx!)}
            {stat("XP left on Steel Path", d.sx!)}
          </div>
          {d.overflow ? (
            <p className="flex gap-2 rounded-lg border border-amber-500/40 bg-amber-500/5 p-3 text-sm">
              <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-amber-700 dark:text-amber-400" />
              That's more XP than everything below can give right now. The rest comes from gear that unlocks at a higher rank, modular companions and new releases.
            </p>
          ) : null}
          <p className="text-xs text-muted-foreground">Every source of mastery counts: gear, star chart and Steel Path nodes, Junctions, Railjack and Drifter intrinsics, and modular companions. The steps below go quickest first and stop where you reach {d.targetLabel}.</p>
        </CardContent>
      </Card>
      <Route d={d} />
    </>
  )
}

function Route({ d }: { d: MasteryData }) {
  const steps = d.route || []
  const now = steps.filter((x) => !x.beyond)
  const later = steps.filter((x) => x.beyond)
  const [more, setMore] = useState(false)
  return (
    <>
      <ol className="flex flex-col gap-3" aria-label={`Steps to rank ${d.targetLabel}`}>
        {now.map((x, i) => <Step key={x.id} x={x} n={i + 1} />)}
      </ol>
      {later.length ? (
        <Collapsible open={more} onOpenChange={setMore}>
          <CollapsibleTrigger className="group inline-flex cursor-pointer items-center gap-1.5 rounded-md text-sm font-medium text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50">
            After {d.targetLabel}: {later.length} more {later.length === 1 ? "step" : "steps"} for the ranks beyond
            <ChevronDown aria-hidden className="size-4 transition-transform group-data-[panel-open]:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <ol className="mt-3 flex flex-col gap-3" start={now.length + 1}>{later.map((x, i) => <Step key={x.id} x={x} n={now.length + i + 1} />)}</ol>
          </CollapsibleContent>
        </Collapsible>
      ) : null}
    </>
  )
}

function Step({ x, n }: { x: RouteStep; n: number }) {
  const [open, setOpen] = useState(x.kind === "gear" && n <= 2 && !x.beyond)
  return (
    <li>
      <Card size="sm" className={cn("gap-2 px-4", x.reach && "ring-2 ring-primary/60", x.locked && "opacity-80")}>
        <div className="flex flex-wrap items-start gap-x-3 gap-y-1">
          <span aria-hidden className="grid size-7 shrink-0 place-items-center rounded-full border border-primary/40 font-heading text-sm font-semibold text-primary">{n}</span>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <h3 className="font-heading text-base leading-tight font-semibold">{x.title}</h3>
            <span className="text-xs text-muted-foreground tabular-nums">
              {x.xp ? `${fmt(x.xp)} XP` : "XP varies"}{x.count ? ` · ${fmt(x.count)} ${x.unit}` : ""}
              {x.locked ? " · locked for now" : x.reach ? "" : x.xp ? ` · rank ${x.mrAfter} after all of it` : ""}
            </span>
          </div>
          {x.reach ? <Badge className="border-primary/40 bg-primary/15 text-primary"><Check /> Reaches your target</Badge> : null}
        </div>
        <p className="text-sm text-muted-foreground">{x.how}</p>
        {x.pick ? <p className="text-sm font-medium">Ranking {x.pick === x.count ? "all of these" : `about ${x.pick} of these`} gets you to your target. The biggest XP is listed first.</p> : null}
        {x.planets?.length ? (
          <ul className="flex flex-wrap gap-1.5" aria-label="Where the most node XP is left">
            {x.planets.map((p) => <li key={p.p}><Badge variant="outline" className="text-muted-foreground">{p.p}: {p.n} · {fmt(p.xp)} XP</Badge></li>)}
          </ul>
        ) : null}
        {x.link ? <a href={`#${x.link}`} className={cn(linkCls, "self-start text-sm")}>{x.link === "missions" ? "Open the Star chart" : "Open Ranks"}</a> : null}
        {x.items.length ? (
          <Collapsible open={open} onOpenChange={setOpen}>
            <CollapsibleTrigger className="group inline-flex cursor-pointer items-center gap-1.5 rounded-md text-sm font-medium outline-none hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50">
              {open ? "Hide" : "Show"} the {x.count} {x.unit}
              <ChevronDown aria-hidden className="size-4 transition-transform group-data-[panel-open]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <ul className="mt-2 flex flex-col divide-y rounded-lg border">{x.items.map((g) => <GearRow key={g.n} g={g} />)}</ul>
              {x.more ? <p className="mt-2 text-xs text-muted-foreground">And {x.more} more. Ranks lists them all.</p> : null}
            </CollapsibleContent>
          </Collapsible>
        ) : null}
      </Card>
    </li>
  )
}

function Ladder({ d }: { d: MasteryData }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {d.ladder!.map((r) => {
        const gd = r.gear.filter((g) => g.done).length
        return (
          <Card key={r.m} size="sm" className={cn("gap-2 px-4", r.next && "ring-2 ring-primary/60", r.reached && "opacity-90")}>
            <div className="flex items-center gap-2">
              <b className="font-heading text-lg font-semibold">{r.label}</b>
              {r.reached ? <Badge className="border-primary/40 bg-primary/15 text-primary"><Check /> Reached</Badge> : r.next ? <Badge variant="outline" className="border-primary/50 text-primary">Next</Badge> : null}
              <span className="ml-auto text-xs text-muted-foreground tabular-nums">{fmt(r.xp)} XP</span>
            </div>
            <p className="text-xs text-muted-foreground">{r.trades ? `Trades per day: ${r.trades} · Daily standing cap: ${fmt(r.cap)}` : "Each Legendary rank needs 147,500 more XP."}</p>
            {r.quests.length ? (
              <p className="text-sm">
                Quests unlocked:{" "}
                {r.quests.map((q, i) => (
                  <span key={q}>{i ? ", " : ""}<a href="#quests" className={linkCls} onClick={(e) => { e.preventDefault(); tf().act("a", { href: "#quests", "data-q": q }) }}>{q}</a></span>
                ))}
              </p>
            ) : null}
            {r.gear.length ? (
              <Collapsible>
                <CollapsibleTrigger className="group inline-flex cursor-pointer items-center gap-1.5 rounded-md text-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50">
                  Gear that needs {r.label} ({gd}/{r.gear.length} mastered)
                  <ChevronDown aria-hidden className="size-3.5 transition-transform group-data-[panel-open]:rotate-180" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {r.gear.map((g) => (
                      <button key={g.n} type="button" onClick={() => tf().act("a", { href: "#", "data-go": "item|" + g.n })}
                        className={cn("rounded-md border px-2 py-1 text-xs transition-colors hover:border-primary/50", g.done && "border-primary/30 bg-primary/10")}>
                        {g.n}{g.done ? " ✓" : ""}
                      </button>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ) : null}
          </Card>
        )
      })}
    </div>
  )
}

export function MasteryPage() {
  const s = useTF()
  const d = useTFData(() => tf().mastery())
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-5 md:px-6 md:py-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="flex max-w-2xl flex-col gap-1">
          <h1 className="font-heading text-3xl font-semibold">MR plan</h1>
          <p className="text-sm text-muted-foreground">
            What to do next to reach your target rank, the full rank ladder, and the easiest gear to rank first. Enter what you've already ranked on the{" "}
            <a href="#ranks" className={linkCls}>Ranks</a> page.
          </p>
        </div>
        <Card size="sm" className="flex-row items-center gap-4 px-4">
          <MasteryRing pct={s.pct} label={s.mrLabel.replace(/^(MR|Legendary) /, (m) => (m.startsWith("L") ? "L" : ""))} size={64} />
          <div className="flex flex-col">
            <b className="font-heading text-lg leading-tight font-semibold">{s.mrLabel}</b>
            <span className="text-sm text-muted-foreground tabular-nums">{fmt(s.xp)} XP · {fmt(s.toNext)} to {s.nextLabel}</span>
          </div>
        </Card>
      </header>
      <Tabs value={d.tab} onValueChange={(v) => tf().masterySet({ tab: String(v) })}>
        <div className="-mx-4 overflow-x-auto px-4 pb-1 md:mx-0 md:px-0">
        <TabsList className="min-w-max justify-start">
          {TABS.map((t) => <TabsTrigger key={t.value} value={t.value} className="flex-none px-3">{t.label}</TabsTrigger>)}
        </TabsList>
        </div>
      </Tabs>
      {d.tab === "path" ? <Path d={d} /> : null}
      {d.tab === "helper" && d.helper ? <Helper h={d.helper} /> : null}
      {d.tab === "ladder" ? <Ladder d={d} /> : null}
      {d.tab === "sheet" ? (
        <>
          <p className="text-xs text-muted-foreground">The cheapest weapons to rank, grouped by the Mastery Rank you need to build them. Together they give {fmt(d.sheetXp || 0)} XP, enough to reach MR 12. "Path to max" carries on from there.</p>
          {d.groups!.map((g) => <Section key={g.title} title={g.title} items={g.items} open={g.open} />)}
        </>
      ) : null}
      {d.tab === "sframes" ? d.groups!.map((g) => <Section key={g.title} title={g.title} items={g.items} />) : null}
      {d.tab === "craft" ? (
        <>
          <p className="flex gap-2 rounded-lg border bg-muted/40 p-3 text-sm"><Info aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" />Weapons used to craft other weapons. Rank the ingredient for its XP first, then build a spare copy for the recipe.</p>
          {d.craft!.map((c) => (
            <Section key={c.title} title={c.title} items={c.recipes.flatMap((r) => r.items)}>
              <ul className="flex flex-col gap-1 border-t px-4 py-2 text-xs text-muted-foreground">
                {c.recipes.map((r) => (
                  <li key={r.recipe}>
                    <span className="font-medium text-foreground">{r.recipe}</span> · {fmt(r.xp)} XP{r.note ? <span className="text-amber-700 dark:text-amber-400"> · {r.note}</span> : null}
                  </li>
                ))}
              </ul>
            </Section>
          ))}
        </>
      ) : null}
      {d.tab === "xp" && d.xpHtml ? <Island html={d.xpHtml} /> : null}
    </div>
  )
}
