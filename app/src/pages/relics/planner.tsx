import { useEffect, useState } from "react"
import { Search, Users, X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Segmented } from "@/components/ui/segmented"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Toggle } from "@/components/ui/toggle"
import { GoLink } from "@/components/tf/go-link"
import { cn } from "@/lib/utils"
import { tf, type PlanData } from "@/lib/tf"
import { SortDir } from "@/components/tf/sort-dir"

const pct = (p: number) => (p >= 0.995 ? "99%+" : p < 0.01 ? "<1%" : Math.round(p * 100) + "%")
type Opt = { value: string; label: string }
function Pick({ items, value, onChange, label, prefix }: { items: Opt[]; value: string; onChange: (v: string) => void; label: string; prefix?: string }) {
  return (
    <Select items={items} value={value} onValueChange={(v) => onChange(String(v))}>
      <SelectTrigger className="h-10 min-w-36" aria-label={label}>{prefix ? <span className="text-muted-foreground">{prefix}</span> : null}<SelectValue /></SelectTrigger>
      <SelectContent>{items.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
    </Select>
  )
}

/** Like AlecaFrame's relic planner: value per run for your squad size and refinement, and your odds at what you need. */
export function Planner({ d }: { d: PlanData }) {
  const [q, setQ] = useState(d.q)
  useEffect(() => {
    const t = window.setTimeout(() => q !== d.q && tf().planSet({ q }), 160)
    return () => window.clearTimeout(t)
  }, [q, d.q])
  return (
    <>
      <p className="text-sm text-muted-foreground">
        What each relic is worth per run. With a squad, everyone opens the same relic and you pick the best of the rewards, so value and odds go up with squad size.
        Platinum is the 7-day average; ducats are what Baro pays. Parts for your tracked goals show their odds.
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1.5 text-sm text-muted-foreground"><Users className="size-4" aria-hidden /> Squad</span>
        <Segmented value={d.squad} onValueChange={(v) => tf().planSet({ squad: v })} items={["1", "2", "3", "4"].map((v) => ({ value: v, label: v }))} />
        <Pick items={[{ value: "i", label: "Intact" }, { value: "e", label: "Exceptional" }, { value: "f", label: "Flawless" }, { value: "r", label: "Radiant" }]} value={d.ref} onChange={(v) => tf().planSet({ ref: v })} label="Refinement" />
      </div>
      <div className="flex flex-wrap gap-2">
        <div className="relative min-w-44 flex-1">
          <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Relic or reward, e.g. Neo S1 or Saryn" aria-label="Find a relic or reward" className="h-10 pr-9 pl-9" />
          {q ? <Button variant="ghost" size="icon-sm" className="absolute top-1/2 right-1.5 -translate-y-1/2" onClick={() => setQ("")} aria-label="Clear search"><X /></Button> : null}
        </div>
        <Pick items={[{ value: "all", label: "All eras" }, { value: "open", label: "Farmable now" }, ...["Lith", "Meso", "Neo", "Axi", "Requiem"].map((x) => ({ value: x, label: x }))]} value={d.era} onChange={(v) => tf().planSet({ era: v })} label="Era" />
        <Pick items={[{ value: "plat", label: "Platinum per run" }, { value: "du", label: "Ducats per run" }, { value: "need", label: "Chance at goal parts" }, { value: "name", label: "Name" }]} value={d.sort} onChange={(v) => tf().planSet({ sort: v })} label="Sort" prefix="Sort:" />
        <SortDir k="rpS" className="size-9" />
        <Toggle variant="outline" pressed={d.own} onPressedChange={(v) => tf().planSet({ own: v })} className="h-10 px-3 data-[pressed]:border-primary/60 data-[pressed]:bg-primary/15">Only relics I own</Toggle>
      </div>
      {d.own && !d.owned ? (
        <Card className="items-start gap-2 p-6 text-sm">
          <b className="font-heading text-base font-semibold">No relics entered yet</b>
          <p className="text-muted-foreground">Add your relics, or turn off “Only relics I own” to plan with every relic in the game.</p>
          <Button variant="outline" className="h-9" onClick={() => tf().relicsSet({ tab: "add" })}>Add relics</Button>
        </Card>
      ) : (
        <Card className="gap-0 py-0">
          <div className="hidden grid-cols-[minmax(0,1.2fr)_5rem_5rem_minmax(0,1.6fr)] gap-3 border-b px-4 py-2 text-xs text-muted-foreground md:grid">
            <span>Relic</span><span className="text-right">Plat / run</span><span className="text-right">Ducats / run</span><span>Odds</span>
          </div>
          <ul className="flex flex-col divide-y">
            {d.rows.map((x) => (
              <li key={x.r} className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 gap-y-1.5 px-4 py-3 md:grid-cols-[minmax(0,1.2fr)_5rem_5rem_minmax(0,1.6fr)] md:items-center">
                <span className="flex min-w-0 flex-wrap items-center gap-1.5">
                  <GoLink k={"relic|" + x.r} className="font-medium">{x.r}</GoLink>
                  {x.vaulted ? <Badge variant="outline" className="border-red-500/40 text-red-700 dark:text-red-300">Vaulted</Badge> : null}
                  {x.count ? <Badge variant="outline" className="tabular-nums">×{x.count}</Badge> : null}
                </span>
                <span className="text-right md:contents">
                  <b className="font-heading text-lg font-semibold tabular-nums md:text-right">{x.plat}p</b>
                  <span className="ml-2 text-sm text-muted-foreground tabular-nums md:ml-0 md:text-right">{x.du}d</span>
                </span>
                <span className="col-span-2 flex flex-col gap-0.5 text-xs md:col-span-1">
                  {x.rare ? (
                    <span className="text-muted-foreground">Rare: <GoLink k={x.rare.go} className="text-primary">{x.rare.n}</GoLink>{x.rare.plat != null ? ` (${x.rare.plat}p)` : ""} · <b className="font-medium text-foreground">{pct(x.rare.p)}</b></span>
                  ) : null}
                  {x.need.length ? (
                    <span className={cn("text-muted-foreground")}>
                      For your goals: {x.need.map((n, i) => <span key={n.n}>{i ? ", " : ""}<GoLink k={n.go}>{n.n}</GoLink> <b className="font-medium text-foreground">{pct(n.p)}</b></span>)}
                    </span>
                  ) : null}
                </span>
              </li>
            ))}
          </ul>
          {d.total > d.rows.length ? <p className="border-t px-4 py-3 text-xs text-muted-foreground">Showing {d.rows.length} of {d.total}. Search or filter to narrow it down.</p> : null}
          {!d.rows.length ? <p className="px-4 py-6 text-sm text-muted-foreground">Nothing matches.</p> : null}
        </Card>
      )}
    </>
  )
}
