import { useEffect, useState } from "react"
import { Check, Hammer, MapPin, Search, Timer, X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GoLink } from "@/components/tf/go-link"
import { Island } from "@/components/tf/island"
import { NumField } from "@/components/tf/num-field"
import { cn } from "@/lib/utils"
import { fmt, tf, useTFData, type FoundryData, type FoundryRow } from "@/lib/tf"

const hrs = (s: number) => (s >= 86400 ? `${+(s / 86400).toFixed(1)} d` : s >= 3600 ? `${+(s / 3600).toFixed(1)} h` : s >= 60 ? `${Math.round(s / 60)} min` : `${s} s`)

/** One ingredient: what you need, a box for what you have, and where to farm it underneath. */
function Ingredient({ r, sub }: { r: FoundryRow; sub?: boolean }) {
  const short = r.left > 0
  return (
    <li className={cn("flex flex-col gap-1 py-2", sub && "pl-4")}>
      <div className="flex items-center gap-3">
        <span className="min-w-0 flex-1 truncate text-sm">
          {r.go ? <GoLink k={r.go}>{r.n}</GoLink> : r.n}
        </span>
        <span className="text-xs text-muted-foreground tabular-nums">needs {fmt(r.need)}</span>
        <NumField value={r.have} onCommit={(v) => tf().setInv(r.n, v)} label={`How many ${r.n} you have`} className="h-8 w-24 text-right" />
        <span className={cn("w-16 text-right text-xs tabular-nums", short ? "text-primary" : "text-muted-foreground")}>{short ? `${fmt(r.left)} left` : <Check className="ml-auto size-4" aria-label="Enough" />}</span>
      </div>
      {short && r.where ? (
        <span className="flex gap-1.5 text-xs text-muted-foreground"><MapPin className="mt-px size-3.5 shrink-0 text-primary/70" aria-hidden />{r.where}</span>
      ) : null}
    </li>
  )
}

function Detail({ d }: { d: NonNullable<FoundryData["detail"]> }) {
  return (
    <Card className="gap-3 px-4">
      <div className="flex flex-wrap items-start gap-3">
        {d.img ? <img src={d.img} alt="" className="size-14 shrink-0 object-contain" /> : <Hammer className="size-10 shrink-0 text-muted-foreground" aria-hidden />}
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h2 className="font-heading text-xl leading-tight font-semibold">{d.n}</h2>
          <span className="flex flex-wrap gap-1.5">
            <Badge variant="outline">{d.kind}</Badge>
            <Badge variant="outline">{fmt(d.credits)} credits</Badge>
            {d.time ? <Badge variant="outline"><Timer /> {hrs(d.time)}</Badge> : null}
            {d.makes > 1 ? <Badge variant="outline">Makes {d.makes} per build</Badge> : null}
          </span>
        </div>
        <Button variant="ghost" size="icon-sm" onClick={() => tf().foundrySet({ sel: null })} aria-label="Close"><X /></Button>
      </div>
      {d.bp ? <p className="text-sm text-muted-foreground"><b className="font-medium text-foreground">Blueprint:</b> {d.bp}</p> : null}
      <div className="flex flex-wrap items-center gap-2">
        {!d.gear ? (
          <label className="flex items-center gap-2 text-sm">How many
            <Input type="number" min={1} max={999} value={d.qty} onChange={(e) => tf().foundrySet({ qty: +e.target.value || 1 })} className="h-9 w-20" />
          </label>
        ) : null}
        {d.tracked ? (
          <Button variant="outline" className="h-9" onClick={() => tf().foundryUntrack(d.n)}><Check /> Tracking · stop</Button>
        ) : (
          <Button className="h-9" onClick={() => tf().foundryTrack(d.n, d.qty)}><Hammer /> Track</Button>
        )}
        <Button variant="outline" className="h-9" onClick={() => tf().foundryTimer(d.n)}><Timer /> Start timer</Button>
      </div>
      <p className="text-xs text-muted-foreground">Type what you have. Track puts what's left on Goals and adds a farming task for each material you're short of.</p>
      <section className="flex flex-col">
        <h3 className="font-heading text-base font-semibold">Ingredients</h3>
        <ul className="flex flex-col divide-y">
          {d.parts.map((p) =>
            "sub" in p && p.sub ? (
              <li key={p.n} className="flex flex-col py-2">
                <span className="text-sm font-medium">{p.q > 1 ? `${p.q} × ` : ""}{p.n} <span className="text-xs font-normal text-muted-foreground">· {fmt(p.cr ?? 0)} credits{p.t ? ` · ${hrs(p.t)}` : ""}</span></span>
                <ul className="flex flex-col divide-y">{p.sub.map((r) => <Ingredient key={r.n} r={r} sub />)}</ul>
              </li>
            ) : (
              <Ingredient key={p.n} r={p as FoundryRow} />
            ),
          )}
        </ul>
      </section>
      {d.raw.length > 1 ? (
        <details className="group">
          <summary className="cursor-pointer text-sm font-medium">All materials in total ({d.raw.length})</summary>
          <ul className="flex flex-col divide-y">{d.raw.map((r) => <Ingredient key={r.n} r={r} />)}</ul>
        </details>
      ) : null}
    </Card>
  )
}

function Planner({ d }: { d: FoundryData }) {
  const [q, setQ] = useState(d.q)
  useEffect(() => {
    const t = window.setTimeout(() => q !== d.q && tf().foundrySet({ q }), 160)
    return () => window.clearTimeout(t)
  }, [q, d.q])
  const kinds = d.kinds.map((k) => ({ value: k, label: k === "all" ? "Every blueprint" : k }))
  return (
    <div className="flex flex-col gap-4">
      {d.tracked.length ? (
        <Card className="gap-2 px-4">
          <h2 className="font-heading text-lg font-semibold">Tracking</h2>
          <ul className="flex flex-wrap gap-2">
            {d.tracked.map((t) => (
              <li key={t.n} className="flex items-center gap-1 rounded-full border px-3 py-1 text-sm">
                <button type="button" className="underline-offset-4 hover:underline" onClick={() => tf().foundrySet({ sel: t.n })}>{t.qty > 1 ? `${t.qty} × ` : ""}{t.n}</button>
                <button type="button" className="ml-1 text-muted-foreground hover:text-foreground" onClick={() => tf().foundryUntrack(t.n)} aria-label={`Stop tracking ${t.n}`}><X className="size-3.5" /></button>
              </li>
            ))}
          </ul>
          <p className="text-xs text-muted-foreground">Everything you track adds up on <a href="#goals" className="underline underline-offset-4">Goals</a>, with where to farm each material.</p>
        </Card>
      ) : null}
      {d.detail ? <Detail d={d.detail} /> : null}
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find a blueprint: Forma, Ash Prime, Cipher, Fieldron…" aria-label="Find a blueprint" className="h-10 pl-9" />
        </div>
        <Select items={kinds} value={d.kind} onValueChange={(v) => tf().foundrySet({ kind: String(v) })}>
          <SelectTrigger className="h-10 sm:w-52" aria-label="Kind of blueprint"><SelectValue /></SelectTrigger>
          <SelectContent>{kinds.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <p className="text-xs text-muted-foreground" role="status">{fmt(d.total)} blueprints{d.total > d.results.length ? `, showing ${d.results.length}` : ""}</p>
      <ul className="grid gap-2 sm:grid-cols-2">
        {d.results.map((r) => (
          <li key={r.n}>
            <button type="button" onClick={() => tf().foundrySet({ sel: r.n })}
              className={cn("flex w-full items-center gap-3 rounded-lg border bg-card px-3 py-2 text-left hover:border-primary/50", d.sel === r.n && "border-primary/60 bg-primary/10")}>
              {r.img ? <img src={r.img} alt="" className="size-8 shrink-0 object-contain" loading="lazy" /> : <Hammer className="size-5 shrink-0 text-muted-foreground" aria-hidden />}
              <span className="min-w-0 flex-1 truncate text-sm font-medium">{r.n}</span>
              <span className="shrink-0 text-xs text-muted-foreground">{r.kind}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function FoundryPage() {
  const d = useTFData(() => tf().foundry())
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-5 md:px-6 md:py-6">
      <header className="flex flex-col gap-1">
        <h1 className="font-heading text-3xl font-semibold">Foundry</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">Every blueprint and what goes into it. Enter what you have, track what you want to build, and your goals and to-do list show what to farm and where. Your build timers are here too.</p>
      </header>
      <Tabs value={d.tab} onValueChange={(v) => tf().foundrySet({ tab: String(v) })}>
        <TabsList>
          <TabsTrigger value="planner" className="px-3"><Hammer /> Planner</TabsTrigger>
          <TabsTrigger value="timers" className="px-3"><Timer /> Timers{d.timers ? ` (${d.ready ? d.ready + " ready" : d.timers})` : ""}</TabsTrigger>
        </TabsList>
      </Tabs>
      {d.tab === "timers" ? <Island key="timers" html={d.html} /> : <Planner d={d} />}
    </div>
  )
}
