import { useEffect, useState } from "react"
import { Minus, Plus, Search, X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { HaloSegmented } from "@/components/ui/halo-segmented"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GoLink } from "@/components/tf/go-link"
import { NumField } from "@/components/tf/num-field"
import { Planner } from "./planner"
import { cn } from "@/lib/utils"
import { fmt, tf, useTFData, type RelicCard, type RelicsData } from "@/lib/tf"
import { SortDir } from "@/components/tf/sort-dir"

const RAR: Record<string, string> = { C: "text-[#b07a4a] dark:text-[#d8a274]", U: "text-slate-600 dark:text-slate-300", R: "text-primary font-medium" }
const DOT: Record<string, string> = { C: "bg-[#b07a4a]", U: "bg-slate-400", R: "bg-primary" }
const REF: [keyof RelicCard["counts"], string][] = [["i", "Intact"], ["e", "Exceptional"], ["f", "Flawless"], ["r", "Radiant"]]

function SearchBox({ value, onChange, placeholder, label }: { value: string; onChange: (v: string) => void; placeholder: string; label: string }) {
  const [q, setQ] = useState(value)
  useEffect(() => {
    const t = window.setTimeout(() => q !== value && onChange(q), 160)
    return () => window.clearTimeout(t)
  }, [q, value, onChange])
  return (
    <div className="relative min-w-44 flex-1">
      <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={placeholder} aria-label={label} className="h-10 pr-9 pl-9" />
      {q ? <Button variant="ghost" size="icon-sm" className="absolute top-1/2 right-1.5 -translate-y-1/2" onClick={() => setQ("")} aria-label="Clear search"><X /></Button> : null}
    </div>
  )
}

function Pick({ items, value, onChange, label, prefix }: { items: { value: string; label: string }[]; value?: string; onChange: (v: string) => void; label: string; prefix?: string }) {
  return (
    <Select items={items} value={value} onValueChange={(v) => onChange(String(v))}>
      <SelectTrigger className="h-10 min-w-40" aria-label={label}>{prefix ? <span className="text-muted-foreground">{prefix}</span> : null}<SelectValue /></SelectTrigger>
      <SelectContent>{items.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
    </Select>
  )
}

const tile = (k: string, v: React.ReactNode, x?: string) => (
  <Card size="sm" className="gap-0.5 px-4">
    <span className="text-xs text-muted-foreground">{k}</span>
    <b className="font-heading text-2xl leading-tight font-semibold tabular-nums">{v}</b>
    {x ? <span className="text-xs text-muted-foreground">{x}</span> : null}
  </Card>
)

function Mine({ d }: { d: RelicsData }) {
  const eras = [{ value: "all", label: "All eras" }, { value: "need", label: "Has parts I need" }, ...["Lith", "Meso", "Neo", "Axi", "Requiem"].map((x) => ({ value: x, label: x }))]
  const sorts = [{ value: "need", label: "Parts I need" }, { value: "plat", label: "Plat value" }, { value: "count", label: "How many" }, { value: "name", label: "Name" }]
  return (
    <>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {tile("Relics", fmt(d.tot!), `${d.kinds} kinds`)}
        {tile("Hold parts you need", fmt(d.withNeed!))}
        {tile("Expected value", `${fmt(d.totPl!)}p`, "cracking all Intact")}
        <Card size="sm" className="gap-1 px-4">
          <span className="text-xs text-muted-foreground">Void traces</span>
          <NumField value={d.traces!} onCommit={(v) => tf().setTraces(v)} label="Void traces" className="h-9 w-24 text-left" />
          <span className="text-xs text-muted-foreground">Radiant costs 100</span>
        </Card>
      </div>
      {!d.kinds ? (
        <Card className="items-start gap-2 p-6 text-sm">
          <b className="font-heading text-base font-semibold">No relics yet</b>
          <p className="text-muted-foreground">Enter what's in your inventory and Tennoform tells you which to refine and what each is worth.</p>
          <Button className="h-9" onClick={() => tf().relicsSet({ tab: "add" })}><Plus /> Add relics</Button>
        </Card>
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            <Pick items={eras} value={d.era} onChange={(v) => tf().relicsSet({ era: v })} label="Era" />
            <Pick items={sorts} value={d.sort} onChange={(v) => tf().relicsSet({ sort: v })} label="Sort" prefix="Sort:" />
            <SortDir k="rlO" className="size-9" />
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {d.cards!.map((c) => (
              <Card key={c.r} size="sm" className="gap-3 px-4">
                <div className="flex flex-wrap items-center gap-1.5">
                  <GoLink k={"relic|" + c.r} className="font-heading text-lg font-semibold">{c.r}</GoLink>
                  {c.vaulted ? <Badge variant="outline" className="border-red-500/40 text-red-700 dark:text-red-300">Vaulted</Badge> : null}
                  <Badge variant="outline" className={cn("ml-auto", c.advice.k === "r" ? "border-primary/50 text-primary" : "text-muted-foreground")}>{c.advice.t}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{c.advice.why}</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {REF.map(([k, lab]) => (
                    <div key={k} className="flex flex-col gap-1">
                      <span className="text-xs text-muted-foreground">{lab}</span>
                      <span className="flex items-center gap-1">
                        <Button variant="outline" size="icon-sm" className="size-8" disabled={!c.counts[k]} onClick={() => tf().relAdj(c.r, k, -1)} aria-label={`One fewer ${lab} ${c.r}`}><Minus /></Button>
                        <NumField value={c.counts[k]} onCommit={(v) => tf().relSet(c.r, k, v)} label={`${lab} ${c.r}`} className="w-12" />
                        <Button variant="outline" size="icon-sm" className="size-8" onClick={() => tf().relAdj(c.r, k, 1)} aria-label={`One more ${lab} ${c.r}`}><Plus /></Button>
                      </span>
                    </div>
                  ))}
                </div>
                <ul className="flex flex-col gap-1 rounded-lg border p-2.5 text-sm">
                  {c.rewards.map((w) => (
                    <li key={w.n} className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                      <span aria-hidden className={cn("size-2 shrink-0 rounded-full", DOT[w.rar])} />
                      <GoLink k={w.go} className={RAR[w.rar]}>{w.n}</GoLink>
                      {w.need ? <Badge variant="outline" className="border-amber-500/40 text-amber-700 dark:text-amber-400">need</Badge> : null}
                      {w.goal ? <Badge variant="outline" className="border-primary/40 text-primary">goal</Badge> : null}
                      <span className="ml-auto text-xs text-muted-foreground tabular-nums">{w.plat != null ? `${w.plat}p` : ""}{w.du ? ` · ${w.du}d` : ""}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-muted-foreground">Value per run: Intact {c.evI}p · Radiant {c.evR}p</p>
              </Card>
            ))}
          </div>
        </>
      )}
    </>
  )
}

function Add({ d }: { d: RelicsData }) {
  const f = [{ value: "all", label: "All relics" }, { value: "open", label: "Farmable now" }, { value: "need", label: "Drops a goal part" }, ...["Lith", "Meso", "Neo", "Axi", "Requiem"].map((x) => ({ value: x, label: x }))]
  return (
    <>
      <p className="text-sm text-muted-foreground">Search a relic and tap + for each one you own. Most players type the era and letter, like “neo s”. Set refined relics on the My relics tab.</p>
      <div className="flex flex-wrap gap-2">
        <SearchBox value={d.q!} onChange={(v) => tf().relicsSet({ raq: v })} placeholder="Lith A1, Neo S10…" label="Find a relic" />
        <Pick items={f} value={d.filter} onChange={(v) => tf().relicsSet({ rae: v })} label="Relic filter" />
      </div>
      <Card className="gap-0 py-0">
        <ul className="grid divide-y sm:grid-cols-2 sm:divide-y-0">
          {d.list!.map((r) => (
            <li key={r.r} className="flex items-center gap-3 border-b px-4 py-2.5 sm:odd:border-r">
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="flex items-center gap-1.5"><b className="font-medium">{r.r}</b>{r.vaulted ? <span className="text-xs text-muted-foreground">vaulted</span> : null}</span>
                <span className="truncate text-xs text-muted-foreground">Rare: {r.rare || "—"}</span>
              </span>
              <Button variant="outline" size="icon-sm" className="size-9" disabled={!r.count} onClick={() => tf().relAdj(r.r, "i", -1)} aria-label={`Remove one ${r.r}`}><Minus /></Button>
              <span className="w-6 text-center font-medium tabular-nums" aria-live="polite">{r.count}</span>
              <Button size="icon-sm" className="size-9" onClick={() => tf().relAdj(r.r, "i", 1)} aria-label={`Add one ${r.r}`}><Plus /></Button>
            </li>
          ))}
        </ul>
        {d.total! > 150 ? <p className="px-4 py-3 text-xs text-muted-foreground">Showing 150 of {fmt(d.total!)}. Search to narrow it down.</p> : null}
      </Card>
    </>
  )
}

function Ducats({ d }: { d: RelicsData }) {
  const f = [{ value: "all", label: "All prime parts" }, { value: "mine", label: "My spares" }, { value: "baro", label: "Best for ducats" }, { value: "plat", label: "Worth selling (8p+)" }, { value: "junk", label: "Cheap (≤4p)" }]
  const s = [{ value: "ratio", label: "Ducats per plat" }, { value: "plat", label: "Plat" }, { value: "du", label: "Ducats" }, { value: "mine", label: "My spares" }, { value: "name", label: "Name" }]
  return (
    <>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {tile("Spare parts", fmt(d.spares!))}
        {tile("Worth in plat", `${fmt(d.plat!)}p`, "7-day averages")}
        {tile("Worth in ducats", fmt(d.ducats!))}
        {tile("Baro Ki'Teer", <span className="text-lg">{d.baro!.state}</span>, d.baro!.text)}
      </div>
      <Card size="sm" className="gap-1 px-4 text-sm">
        <b className="font-medium">Rule of thumb</b>
        <p>Sell to players when a part is worth 8p or more. Give it to Baro when it's worth 10 or more ducats per platinum, so a 45-ducat part selling for 3p goes to Baro.</p>
        <p className="text-xs text-muted-foreground">Ducat kiosks are in every relay. Prices are a {d.snapshot} snapshot.</p>
      </Card>
      <div className="flex flex-wrap gap-2">
        <SearchBox value={d.q!} onChange={(v) => tf().relicsSet({ duq: v })} placeholder="Find a prime part" label="Find a prime part" />
        <Pick items={f} value={d.filter} onChange={(v) => tf().relicsSet({ duf: v })} label="Filter" />
        <Pick items={s} value={d.sort} onChange={(v) => tf().relicsSet({ duo: v })} label="Sort" prefix="Sort:" />
        <SortDir k="duO" className="size-9" />
      </div>
      <Card className="gap-0 py-0">
        <div className="grid grid-cols-[minmax(0,1fr)_3.5rem_3.5rem_4.5rem] gap-2 border-b px-4 py-2 text-xs text-muted-foreground"><span>Part</span><span className="text-right">Plat</span><span className="text-right">Ducats</span><span className="text-center">Spares</span></div>
        <ul className="flex flex-col divide-y">
          {d.rows!.map((r) => (
            <li key={r.n} className="grid grid-cols-[minmax(0,1fr)_3.5rem_3.5rem_4.5rem] items-center gap-2 px-4 py-1.5 text-sm">
              <span className="flex min-w-0 items-center gap-1.5">
                <GoLink k={r.go} className="truncate">{r.n}</GoLink>
                {r.tag ? <Badge variant="outline" className={r.tag === "Baro" ? "border-amber-500/40 text-amber-700 dark:text-amber-400" : "border-emerald-500/40 text-emerald-700 dark:text-emerald-400"}>{r.tag}</Badge> : null}
              </span>
              <span className="text-right tabular-nums">{r.plat ?? "—"}</span>
              <span className="text-right tabular-nums">{r.du}</span>
              <span className="grid place-items-center"><NumField value={r.spares} onCommit={(v) => tf().setDup(r.n, v)} label={`Spare ${r.n}`} /></span>
            </li>
          ))}
        </ul>
      </Card>
      {d.stock!.length ? (
        <Card className="gap-0 py-0">
          <h2 className="border-b px-4 py-3 font-heading text-base font-semibold">Baro's stock</h2>
          <ul className="flex flex-col divide-y">{d.stock!.map((i) => <li key={i.item} className="flex items-center gap-3 px-4 py-1.5 text-sm"><GoLink k={i.go} className="flex-1">{i.item}</GoLink><span className="text-xs text-muted-foreground tabular-nums">{fmt(i.ducats)} ducats · {fmt(i.credits)} cr</span></li>)}</ul>
        </Card>
      ) : null}
    </>
  )
}

export function RelicsPage() {
  const d = useTFData(() => tf().relics())
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-5 md:px-6 md:py-6">
      <header className="flex flex-col gap-1">
        <h1 className="font-heading text-3xl font-semibold">Relics</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">Track the relics you own, see which to refine, and decide what to sell for platinum or ducats.</p>
      </header>
      <div className="-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0"><HaloSegmented className="min-w-max" value={d.tab} onValueChange={(v) => tf().relicsSet({ tab: v })}
        items={[{ value: "mine", label: "My relics" }, { value: "plan", label: "Planner" }, { value: "add", label: "Add relics" }, { value: "ducats", label: "Ducats & trading" }]} /></div>
      {d.tab === "plan" && d.plan ? <Planner d={d.plan} /> : d.tab === "add" ? <Add d={d} /> : d.tab === "ducats" ? <Ducats d={d} /> : <Mine d={d} />}
    </div>
  )
}
