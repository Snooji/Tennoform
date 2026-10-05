import { useEffect, useState } from "react"
import { ArrowLeft, Check, CheckCheck, Plus, Search, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Toggle } from "@/components/ui/toggle"
import { Island } from "@/components/tf/island"
import { cn } from "@/lib/utils"
import { fmt, tf, useTFData, type ChartData, type JunctionRow } from "@/lib/tf"

/** A planet drawn as a lit sphere from its two colours, with a progress ring around it. */
function Orb({ colors, size = 44, pct }: { colors: string[]; size?: number; pct?: number }) {
  const ring = pct != null
  return (
    <span aria-hidden className="relative grid shrink-0 place-items-center" style={{ width: size + (ring ? 10 : 0), height: size + (ring ? 10 : 0) }}>
      {ring ? (
        <span className="absolute inset-0 rounded-full" style={{ background: `conic-gradient(var(--primary) ${pct}%, var(--muted) 0)` }}>
          <span className="absolute inset-[3px] rounded-full bg-card" />
        </span>
      ) : null}
      <span className="relative rounded-full shadow-inner" style={{ width: size, height: size, background: `radial-gradient(circle at 32% 30%, ${colors[0]}, ${colors[1]} 72%)` }} />
    </span>
  )
}

function Tick({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return <Checkbox className="size-5 rounded-md" checked={checked} onCheckedChange={(v) => onChange(!!v)} aria-label={label} />
}

function Junctions({ rows }: { rows: JunctionRow[] }) {
  return (
    <ul className="flex flex-col divide-y">
      <li className="grid grid-cols-[minmax(0,1fr)_3.5rem_3.5rem] px-4 py-2 text-xs text-muted-foreground"><span>Junction</span><span className="text-center">Done</span><span className="text-center">Steel</span></li>
      {rows.map((j) => (
        <li key={j.id} className="grid grid-cols-[minmax(0,1fr)_3.5rem_3.5rem] items-center px-4 py-2">
          <span className="flex min-w-0 items-center gap-2"><b className="truncate font-medium">{j.label}</b><span className="text-xs text-muted-foreground">1,000 XP</span></span>
          <span className="grid place-items-center"><Tick label={`Done: ${j.label}`} checked={j.done} onChange={(v) => tf().nodeTick("n|" + j.id, v)} /></span>
          <span className="grid place-items-center"><Tick label={`Steel Path: ${j.label}`} checked={j.sp} onChange={(v) => tf().nodeTick("sp|" + j.id, v)} /></span>
        </li>
      ))}
    </ul>
  )
}

function Overview({ d }: { d: ChartData }) {
  const tile = (k: string, v: number, t: number, x?: string) => (
    <Card size="sm" className="gap-1 px-4">
      <span className="text-xs text-muted-foreground">{k}</span>
      <b className="font-heading text-2xl leading-tight font-semibold tabular-nums">{fmt(v)}<span className="text-base font-normal text-muted-foreground">/{fmt(t)}</span></b>
      <Progress value={(100 * v) / (t || 1)} className="h-1" aria-label={`${k}: ${v} of ${t}`} />
      {x ? <span className="text-xs text-muted-foreground">{x}</span> : null}
    </Card>
  )
  return (
    <>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {tile("Nodes", d.nd, d.total)}
        {tile("Junctions", d.jd!, d.jt!, "1,000 XP each")}
        {tile("Steel Path", d.sd, d.total)}
        <Card size="sm" className="gap-1 px-4">
          <span className="text-xs text-muted-foreground">Mission XP</span>
          <b className="font-heading text-2xl leading-tight font-semibold tabular-nums">{fmt(d.xp!)}</b>
          <span className="text-xs text-muted-foreground">of {fmt(d.xpMax!)}</span>
        </Card>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {d.planets!.map((p) => (
          <button
            key={p.name}
            type="button"
            onClick={() => tf().chartSet({ p: p.name })}
            className={cn(
              "flex items-center gap-3 rounded-xl border bg-card p-3 text-left transition-colors hover:border-primary/50 hover:bg-muted/40 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
              p.done === p.total && "border-primary/40"
            )}
          >
            <Orb colors={p.colors} size={36} pct={p.total ? (100 * p.done) / p.total : 0} />
            <span className="flex min-w-0 flex-col">
              <b className="truncate font-heading text-base font-semibold">{p.name}</b>
              <span className="text-xs text-muted-foreground tabular-nums">{p.done}/{p.total}{p.sp ? ` · SP ${p.sp}` : ""}</span>
            </span>
            {p.done === p.total ? <Check aria-label="All cleared" className="ml-auto size-4 text-primary" /> : null}
          </button>
        ))}
      </div>
      <Card className="gap-0 py-0">
        <CardHeader className="border-b py-3">
          <CardTitle><h2 className="font-heading text-lg leading-tight font-semibold">Junctions</h2></CardTitle>
          <p className="text-xs text-muted-foreground">Beat the junction's Specter after finishing its tasks to open the next planet. 1,000 Mastery XP each, and again on Steel Path.</p>
        </CardHeader>
        <Junctions rows={d.junctions} />
      </Card>
      {d.juncHtml ? <Island html={d.juncHtml} /> : null}
    </>
  )
}

function Planet({ d }: { d: ChartData }) {
  const [q, setQ] = useState(d.q || "")
  useEffect(() => {
    const t = window.setTimeout(() => q !== d.q && tf().chartSet({ q }), 160)
    return () => window.clearTimeout(t)
  }, [q, d.q])
  const types = [{ value: "all", label: "All types" }, ...d.types!.map((t) => ({ value: t, label: t }))]
  const sorts = [{ value: "lv", label: "Level" }, { value: "xp", label: "XP" }, { value: "name", label: "Name" }]
  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="outline" className="h-9" onClick={() => tf().chartSet({ p: "" })}><ArrowLeft /> All planets</Button>
        <Orb colors={d.colors!} size={30} />
        <span className="text-sm text-muted-foreground tabular-nums">{d.nd}/{d.total} nodes · SP {d.sd}/{d.total} · {fmt(d.xd!)} XP earned</span>
        <Button variant="outline" size="sm" className="h-8" disabled={d.hasTask} onClick={() => tf().addTaskFrom("node|" + d.sel, "Clear " + d.sel + " nodes")}>
          {d.hasTask ? <Check /> : <Plus />} {d.hasTask ? "In tasks" : "Task"}
        </Button>
      </div>
      {d.resources!.length ? (
        <p className="text-sm">
          <span className="text-muted-foreground">Resources here: </span>
          {d.resources!.map((r, i) => (
            <span key={r}>{i ? " · " : ""}<a href="#" onClick={(e) => { e.preventDefault(); tf().act("a", { href: "#", "data-go": "res|" + r }) }} className="underline decoration-primary/50 underline-offset-4">{r}</a></span>
          ))}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-2">
        <div className="relative min-w-44 flex-1">
          <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find a node" aria-label="Find a node" className="h-9 pr-9 pl-9" />
          {q ? <Button variant="ghost" size="icon-sm" className="absolute top-1/2 right-1 -translate-y-1/2" onClick={() => setQ("")} aria-label="Clear search"><X /></Button> : null}
        </div>
        <Select items={types} value={d.type} onValueChange={(v) => tf().chartSet({ type: String(v) })}>
          <SelectTrigger className="h-9 min-w-36" aria-label="Mission type"><SelectValue /></SelectTrigger>
          <SelectContent>{types.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
        </Select>
        <Select items={sorts} value={d.sort} onValueChange={(v) => tf().chartSet({ sort: String(v) })}>
          <SelectTrigger className="h-9 min-w-32" aria-label="Sort"><span className="text-muted-foreground">Sort:</span><SelectValue /></SelectTrigger>
          <SelectContent>{sorts.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
        </Select>
        <Toggle variant="outline" pressed={d.hide} onPressedChange={(v) => tf().chartSet({ hide: v })} className="h-9 px-3 data-[pressed]:border-primary/60 data-[pressed]:bg-primary/15">Unfinished only</Toggle>
      </div>
      <Card className="gap-0 py-0">
        <div className="flex flex-wrap items-center gap-2 border-b px-4 py-3">
          <Progress value={(100 * d.nd) / (d.total || 1)} className="h-1.5 min-w-24 flex-1" aria-label={`${d.nd} of ${d.total} nodes done`} />
          <Button variant="outline" size="sm" className="h-8" onClick={() => tf().planetAll(d.sel, "n")}><CheckCheck /> Mark all done</Button>
          <Button variant="outline" size="sm" className="h-8" onClick={() => tf().planetAll(d.sel, "sp")}><CheckCheck /> Mark all Steel Path</Button>
        </div>
        <ul className="flex flex-col divide-y">
          <li className="grid grid-cols-[minmax(0,1fr)_3.5rem_3.5rem] px-4 py-2 text-xs text-muted-foreground"><span>Node</span><span className="text-center">Done</span><span className="text-center">Steel</span></li>
          {d.nodes!.length ? (
            d.nodes!.map((n) => (
              <li key={n.id} className={cn("grid grid-cols-[minmax(0,1fr)_3.5rem_3.5rem] items-center px-4 py-2", n.done && n.sp && "bg-muted/30")}>
                <span className="flex min-w-0 flex-col">
                  <b className="truncate font-medium">{n.name}</b>
                  <span className="text-xs text-muted-foreground">
                    {n.type} · Lv {n.lv}{n.xp ? ` · ${n.xp} XP` : ""}{n.ds ? " · Dark Sector" : ""}{n.runs ? ` · ${fmt(n.runs)} runs` : ""}
                  </span>
                </span>
                <span className="grid place-items-center"><Tick label={`Done: ${n.name}`} checked={n.done} onChange={(v) => tf().nodeTick("n|" + n.id, v)} /></span>
                <span className="grid place-items-center"><Tick label={`Steel Path: ${n.name}`} checked={n.sp} onChange={(v) => tf().nodeTick("sp|" + n.id, v)} /></span>
              </li>
            ))
          ) : (
            <li className="px-4 py-6 text-sm text-muted-foreground">No nodes match.</li>
          )}
        </ul>
      </Card>
      {d.junctions.length ? (
        <Card className="gap-0 py-0">
          <CardHeader className="border-b py-3"><CardTitle><h2 className="font-heading text-base leading-tight font-semibold">Junctions from {d.sel}</h2></CardTitle></CardHeader>
          <CardContent className="px-0"><Junctions rows={d.junctions} /></CardContent>
        </Card>
      ) : null}
    </>
  )
}

export function MissionsPage() {
  const d = useTFData(() => tf().chart())
  useEffect(() => window.scrollTo(0, 0), [d.sel])
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-5 md:px-6 md:py-6">
      <header className="flex flex-col gap-1">
        <h1 className="font-heading text-3xl font-semibold">{d.sel || "Star chart"}</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          {d.sel
            ? "Tick each node you've cleared. Steel Path pays the Mastery XP a second time."
            : "Pick a planet to tick off its nodes, and clear every junction. Each node and junction gives Mastery XP the first time you complete it."}
        </p>
      </header>
      {d.sel ? <Planet key={d.sel} d={d} /> : <Overview d={d} />}
    </div>
  )
}
