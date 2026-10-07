import { useEffect, useState } from "react"
import { Check, ChevronDown, Copy, Minus, Plus, Search, Target, X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox"
import { BuildLibrary } from "./build-library"
import { MyBuilds } from "./my-builds"
import { Segmented } from "@/components/ui/segmented"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GoLink } from "@/components/tf/go-link"
import { Island } from "@/components/tf/island"
import { ModCard } from "@/components/tf/mod-card"
import { NumField } from "@/components/tf/num-field"
import { Thumb } from "@/components/tf/thumb"
import { cn } from "@/lib/utils"
import { fmt, tf, useTFData, type ArsenalData } from "@/lib/tf"
import { SortDir } from "@/components/tf/sort-dir"

const TABS = [
  { value: "top", label: "Top builds" }, { value: "mine", label: "My builds" },
  { value: "builds", label: "Weapons" }, { value: "comp", label: "Companions" }, { value: "lich", label: "Lich weapons" },
  { value: "arc", label: "Arcanes" }, { value: "mods", label: "Key mods" },
]
type Opt = { value: string; label: string }
function Pick({ items, value, onChange, label, prefix, className }: { items: Opt[]; value?: string; onChange: (v: string) => void; label: string; prefix?: string; className?: string }) {
  return (
    <Select items={items} value={value} onValueChange={(v) => onChange(String(v ?? ""))}>
      <SelectTrigger className={cn("h-10 min-w-36", className)} aria-label={label}>{prefix ? <span className="text-muted-foreground">{prefix}</span> : null}<SelectValue /></SelectTrigger>
      <SelectContent>{items.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
    </Select>
  )
}
const opts = (all: string, xs: string[]) => [{ value: "all", label: all }, ...xs.map((x) => ({ value: x, label: x }))]

function Builds({ d, kind }: { d: ArsenalData; kind: "w" | "c" }) {
  const b = d.build
  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        {kind === "w" ? <Pick items={opts("All weapons", d.cats!)} value={d.cat} onChange={(v) => d.cat !== v && tf().arsenalSet({ cat: v })} label="Weapon type" /> : null}
        <Pick items={[{ value: "all", label: "Owned or not" }, { value: "own", label: "Owned" }, { value: "not", label: "Not owned" }, { value: "unmastered", label: "Not mastered" }]} value={d.own} onChange={(v) => tf().arsenalSet({ own: v })} label="Ownership" />
        <Combobox items={d.names!} value={d.cur} onValueChange={(v) => v && tf().arsenalSet({ sel: String(v) })}>
          <ComboboxInput placeholder={kind === "w" ? "Find a weapon" : "Find a companion"} aria-label={kind === "w" ? "Weapon" : "Companion"} className="h-10 min-w-56 flex-1" />
          <ComboboxContent>
            <ComboboxEmpty>Nothing by that name.</ComboboxEmpty>
            <ComboboxList>{(n: string) => <ComboboxItem key={n} value={n}>{n}</ComboboxItem>}</ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>
      {d.filteredEmpty ? <p className="text-sm text-muted-foreground">Nothing matches those filters, so everything is listed.</p> : null}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <div className="flex min-w-0 flex-col gap-3">
          <div className="flex items-center gap-3"><Thumb src={d.img!} className="size-12" /><h2 className="font-heading text-2xl font-semibold">{d.cur}</h2></div>
          {d.tree ? <Island html={d.tree} /> : null}
        </div>
        {b ? (
          <Card className="self-start">
            <CardHeader><CardTitle><h2 className="font-heading text-lg leading-tight font-semibold">Build</h2></CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-3">
              {d.builds!.length > 1 ? <Segmented className="self-start" items={d.builds!} value={d.bi} onValueChange={(v) => tf().arsenalSet({ bi: v })} /> : null}
              <div className="flex flex-wrap items-center gap-2 text-sm"><Badge variant="outline" className="border-primary/40 text-primary">{b.role}</Badge><b className="font-medium">{b.name}</b></div>
              {b.notes ? <p className="text-sm text-muted-foreground">{b.notes}</p> : null}
              <div className="flex flex-wrap gap-2">
                <Button className="h-9" onClick={() => tf().buildGoal(`m:${d.cur}:${d.bi}`)}><Target /> Save as goal</Button>
                <Button variant="outline" className="h-9" onClick={() => tf().buildCopy(`m:${d.cur}:${d.bi}`)}><Copy /> Copy to my builds</Button>
              </div>
              <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {b.mods.map((m, i) => <ModCard key={m.key + i} m={m} />)}
                {b.arcanes.map((m, i) => <ModCard key={m.key + "a" + i} m={m} />)}
              </ul>
              <p className="text-xs text-muted-foreground">A proven setup that players run today. Swap the elements to match the faction you're fighting.</p>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </>
  )
}

function Lich({ d }: { d: ArsenalData }) {
  const els = [{ value: "", label: "Element" }, ...d.elements!.map((e) => ({ value: e, label: e }))]
  const tile = (k: string, have: number, total: number, x?: string) => (
    <Card size="sm" className="gap-1 px-4">
      <span className="text-xs text-muted-foreground">{k}</span>
      <b className="font-heading text-2xl leading-tight font-semibold tabular-nums">{have}<span className="text-base font-normal text-muted-foreground">/{total}</span></b>
      <Progress value={(100 * have) / (total || 1)} className="h-1" aria-label={`${k}: ${have} of ${total}`} />
      {x ? <span className="text-xs text-muted-foreground">{x}</span> : null}
    </Card>
  )
  return (
    <>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
        {tile("Owned", d.have!, d.total!)}
        {tile("Mastered", d.mastered!, d.total!, "rank 40 · 4,000 XP each")}
        {d.factions!.map((f) => <div key={f.f}>{tile(f.f, f.have, f.total)}</div>)}
      </div>
      <Card className="gap-0 py-0">
        <Collapsible>
          <CollapsibleTrigger className="group flex w-full cursor-pointer items-center gap-2 px-4 py-3 text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
            <h2 className="font-heading text-base font-semibold">How to get them</h2>
            <ChevronDown aria-hidden className="ml-auto size-4 text-muted-foreground transition-transform group-data-[panel-open]:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="flex flex-col gap-3 border-t px-4 py-3 text-sm">
              {d.how!.map((h) => (
                <div key={h.f}><b className="font-medium">{h.f} · {h.who}</b><p>{h.how}</p><p className="text-xs text-muted-foreground">Vanquish: {h.vanq} {h.alt}</p></div>
              ))}
              <p className="text-xs text-muted-foreground">Valence Fusion: combine two copies of the same weapon to raise its bonus element. Max is 60%.</p>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </Card>
      <div className="flex flex-wrap gap-2">
        <Pick items={opts("All factions", ["Kuva", "Tenet", "Coda"])} value={d.faction} onChange={(v) => tf().arsenalSet({ lf: v })} label="Faction" />
        <Pick items={[{ value: "all", label: "All weapons" }, { value: "own", label: "Owned" }, { value: "miss", label: "Missing" }, { value: "low", label: "Owned, under 60%" }, { value: "unm", label: "Not mastered" }]} value={d.status} onChange={(v) => tf().arsenalSet({ ls: v })} label="Status" />
      </div>
      <Card className="gap-0 py-0">
        <ul className="flex flex-col divide-y">
          {d.list!.map((w) => (
            <li key={w.n} className={cn("flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-2.5", w.own && "bg-muted/30")}>
              <Checkbox className="size-5 rounded-md" checked={w.own} onCheckedChange={(v) => tf().nodeTick(w.key, !!v)} aria-label={(w.own ? "Don't own: " : "Own: ") + w.n} />
              <span className="flex min-w-0 flex-1 basis-40 flex-col">
                <span className="flex flex-wrap items-center gap-1.5">
                  <GoLink k={w.go} className="font-medium">{w.n}</GoLink>
                  {w.xp ? (w.left > 0 ? <Badge variant="outline" className="border-primary/40 text-primary">+{fmt(w.left)} MR XP</Badge> : <Badge variant="outline" className="text-muted-foreground"><Check /> Mastered</Badge>) : null}
                  {w.price ? <span className="text-xs text-primary">{w.price}</span> : null}
                </span>
                <span className="text-xs text-muted-foreground">{w.f} · {w.c}{w.rank ? ` · rank ${w.rank}` : ""}</span>
              </span>
              <span className="flex items-center gap-2">
                <Pick items={els} value={w.el} onChange={(v) => tf().lichSet(w.n, { e: v })} label={`Bonus element for ${w.n}`} className="h-8 min-w-28" />
                <NumField value={w.bonus} onCommit={(v) => tf().lichSet(w.n, { b: v })} label={`Bonus percent for ${w.n}`} placeholder="%" />
                {w.bonus >= 60 ? <Badge variant="outline" className="border-emerald-500/40 text-emerald-700 dark:text-emerald-400">60%</Badge> : null}
              </span>
            </li>
          ))}
        </ul>
        {!d.list!.length ? <p className="px-4 py-6 text-sm text-muted-foreground">Nothing matches.</p> : null}
      </Card>
    </>
  )
}

function Arcanes({ d }: { d: ArsenalData }) {
  const [q, setQ] = useState(d.q || "")
  useEffect(() => {
    const t = window.setTimeout(() => q !== d.q && tf().arsenalSet({ arq: q }), 160)
    return () => window.clearTimeout(t)
  }, [q, d.q])
  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <Card size="sm" className="gap-0.5 px-4"><span className="text-xs text-muted-foreground">Arcanes owned</span><b className="font-heading text-2xl font-semibold tabular-nums">{d.owned}<span className="text-base font-normal text-muted-foreground">/{d.count}</span></b></Card>
        <Card size="sm" className="gap-0.5 px-4"><span className="text-xs text-muted-foreground">Max rank</span><b className="font-heading text-2xl font-semibold tabular-nums">{d.maxed}</b><span className="text-xs text-muted-foreground">rank 5 takes 21 copies</span></Card>
      </div>
      <p className="text-sm text-muted-foreground">Enter how many copies you have in total (ranked ones count every copy fused into them). The rank and copies left to max are worked out for you.</p>
      <div className="flex flex-wrap gap-2">
        <div className="relative min-w-44 flex-1">
          <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find an arcane" aria-label="Find an arcane" className="h-10 pr-9 pl-9" />
          {q ? <Button variant="ghost" size="icon-sm" className="absolute top-1/2 right-1.5 -translate-y-1/2" onClick={() => setQ("")} aria-label="Clear search"><X /></Button> : null}
        </div>
        <Pick items={opts("All types", d.types!)} value={d.type} onChange={(v) => tf().arsenalSet({ art: v })} label="Arcane type" />
        <Pick items={[{ value: "all", label: "All" }, { value: "used", label: "Used in builds" }, { value: "own", label: "Owned" }, { value: "part", label: "Not maxed" }, { value: "max", label: "Maxed" }, { value: "none", label: "Missing" }]} value={d.status} onChange={(v) => tf().arsenalSet({ ars: v })} label="Status" />
        <Pick items={[{ value: "use", label: "Most used" }, { value: "need", label: "Copies needed" }, { value: "price", label: "Price" }, { value: "name", label: "Name" }]} value={d.sort} onChange={(v) => tf().arsenalSet({ aro: v })} label="Sort" prefix="Sort:" />
        <SortDir k="arO" className="size-9" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {d.arcs!.map((a) => (
          <Card key={a.n} size="sm" className="gap-2 px-4">
            <div className="flex flex-wrap items-center gap-1.5">
              <GoLink k={a.go} className="font-medium">{a.n}</GoLink>
              {a.copies >= a.need ? <Badge variant="outline" className="border-emerald-500/40 text-emerald-700 dark:text-emerald-400">Max</Badge> : a.copies ? <Badge variant="outline">Rank {a.rank}</Badge> : null}
              {a.price ? <span className="ml-auto text-xs text-primary">{a.price}</span> : null}
            </div>
            <div className="flex items-center gap-1.5">
              <Button variant="outline" size="icon-sm" className="size-8" disabled={!a.copies} onClick={() => tf().arcAdj(a.n, -1)} aria-label={`One fewer ${a.n}`}><Minus /></Button>
              <NumField value={a.copies} onCommit={(v) => tf().arcSet(a.n, v)} label={`Copies of ${a.n}`} />
              <Button variant="outline" size="icon-sm" className="size-8" onClick={() => tf().arcAdj(a.n, 1)} aria-label={`One more ${a.n}`}><Plus /></Button>
              <span className="text-xs text-muted-foreground">{a.copies >= a.need ? "maxed" : `${a.need - a.copies} more to rank ${a.maxRank}`}</span>
            </div>
            <Progress value={Math.min(100, (100 * a.copies) / a.need)} className="h-1" aria-label={`${a.copies} of ${a.need} copies`} />
            <p className="text-xs text-muted-foreground">{a.type}{a.uses.length ? ` · used in ${a.uses.slice(0, 4).join(", ")}${a.uses.length > 4 ? " +" + (a.uses.length - 4) : ""}` : ""}</p>
            {a.drops ? <p className="text-xs">{a.drops}</p> : null}
          </Card>
        ))}
      </div>
      {!d.arcs!.length ? <p className="text-sm text-muted-foreground">Nothing matches.</p> : null}
    </>
  )
}

function KeyMods({ d }: { d: ArsenalData }) {
  return (
    <>
      <p className="text-sm text-muted-foreground">Every mod used by the builds in this app, most-used first. Tick the ones you own; the same ticks show on every build.</p>
      <div className="flex flex-wrap items-center gap-2">
        <Pick items={opts("All mod types", d.types!)} value={d.type} onChange={(v) => tf().arsenalSet({ kmt: v })} label="Mod type" />
        <Pick items={[{ value: "all", label: "All" }, { value: "miss", label: "Missing" }, { value: "have", label: "Owned" }, { value: "trade", label: "Tradeable" }]} value={d.status} onChange={(v) => tf().arsenalSet({ kms: v })} label="Status" />
        <Badge variant="outline" className="border-primary/40 text-primary tabular-nums">{d.have}/{d.total} owned</Badge>
      </div>
      <Card className="gap-0 py-0">
        <ul className="flex flex-col divide-y">
          {d.mods!.map((m) => (
            <li key={m.n} className={cn("flex gap-3 px-4 py-2.5", m.done && "bg-muted/30")}>
              <Checkbox className="mt-0.5 size-5 rounded-md" checked={m.done} onCheckedChange={(v) => tf().nodeTick(m.key, !!v)} aria-label={(m.done ? "Don't have: " : "Have: ") + m.n} />
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="flex flex-wrap items-center gap-x-2">
                  <GoLink k={m.go} className={cn("font-medium", m.done && "text-muted-foreground line-through")}>{m.n}</GoLink>
                  {m.price ? <span className="text-xs text-primary">{m.price}</span> : null}
                  <span className="text-xs text-muted-foreground">{m.type} · in {m.uses} build{m.uses > 1 ? "s" : ""}</span>
                </span>
                <span className="text-xs text-muted-foreground">{m.src}</span>
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </>
  )
}

export function ArsenalPage() {
  const d = useTFData(() => tf().arsenal())
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-5 md:px-6 md:py-6">
      <header className="flex flex-col gap-1">
        <h1 className="font-heading text-3xl font-semibold">Builds</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">Top community and player builds for every Warframe, weapon and companion, your own builds, your Kuva, Tenet and Coda weapons, arcanes and key mods.</p>
      </header>
      <div className="-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
        <Segmented className="min-w-max" value={d.tab} onValueChange={(v) => tf().arsenalSet({ tab: v })} items={TABS} />
      </div>
      {d.tab === "top" ? <BuildLibrary /> : d.tab === "mine" ? <MyBuilds /> : d.tab === "builds" ? <Builds d={d} kind="w" /> : d.tab === "comp" ? <Builds d={d} kind="c" /> : d.tab === "lich" ? <Lich d={d} /> : d.tab === "arc" ? <Arcanes d={d} /> : <KeyMods d={d} />}
    </div>
  )
}
