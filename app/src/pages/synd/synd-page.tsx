import { memo, useEffect, useState } from "react"
import { Check, ChevronDown, Lock, Plus, RefreshCw, TriangleAlert } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Toggle } from "@/components/ui/toggle"
import { cn } from "@/lib/utils"
import { fmt, tf, useTFData, type SyndCard } from "@/lib/tf"
import { StatList } from "@/components/tf/stat-list"
import { SortDir } from "@/components/tf/sort-dir"

const FILTERS = [{ value: "all", label: "All syndicates" }, { value: "faction", label: "Factions" }, { value: "open", label: "Open world" }, { value: "other", label: "Other" }]
const SORTS = [{ value: "next", label: "Closest to rank-up" }, { value: "rank", label: "Highest rank" }, { value: "name", label: "Name" }]
const linkCls = "underline decoration-primary/50 underline-offset-4 hover:decoration-primary"

function Go({ k, children }: { k: string; children: React.ReactNode }) {
  if (!k) return <>{children}</>
  return <a href="#" className={linkCls} onClick={(e) => { e.preventDefault(); tf().act("a", { href: "#", "data-go": k }) }}>{children}</a>
}

function More({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Collapsible>
      <CollapsibleTrigger className="group inline-flex min-h-10 cursor-pointer items-center gap-1.5 rounded-md text-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50">
        {label} <ChevronDown aria-hidden className="size-3.5 transition-transform group-data-[panel-open]:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent><div className="mt-2">{children}</div></CollapsibleContent>
    </Collapsible>
  )
}

function Standing({ e }: { e: SyndCard }) {
  const [v, setV] = useState(e.standing ? String(e.standing) : "")
  useEffect(() => setV(e.standing ? String(e.standing) : ""), [e.standing])
  return (
    <Input type="number" inputMode="numeric" value={v} placeholder="Standing" onChange={(x) => setV(x.target.value)}
      onBlur={() => v !== (e.standing ? String(e.standing) : "") && tf().synSet(e.n, { s: v })}
      onKeyDown={(x) => x.key === "Enter" && (x.currentTarget as HTMLInputElement).blur()}
      aria-label={`Standing with ${e.n}`} className="h-9 w-36 tabular-nums" />
  )
}

const Synd = memo(function Synd({ e }: { e: SyndCard }) {
  return (
    <Card size="sm" className={cn("relative gap-2.5 overflow-hidden pl-5", e.locked && "bg-muted/40")}>
      <span aria-hidden className="absolute inset-y-0 left-0 w-1" style={{ background: e.color || "var(--border)" }} />
      <div className="flex flex-wrap items-start gap-2 pr-4">
        <b className="font-heading text-lg leading-tight font-semibold">{e.n}</b>
        <span className="ml-auto flex flex-wrap items-center gap-1.5">
          {e.synced ? <Badge variant="outline" className="text-muted-foreground"><RefreshCw /> From game sync</Badge> : e.set ? <Badge variant="outline" className="text-muted-foreground">Set by you</Badge> : null}
          {e.locked ? (
            <a href="#quests" onClick={(x) => { x.preventDefault(); tf().act("a", { href: "#quests", "data-q": e.gate }) }}>
              <Badge variant="outline" className="border-amber-500/40 text-amber-700 dark:text-amber-400"><Lock /> After {e.gate}</Badge>
            </a>
          ) : null}
        </span>
      </div>
      {e.hasRanks ? (
        <>
          <div className="flex flex-wrap items-baseline gap-x-2 pr-4 text-sm">
            <b className="font-semibold text-primary">{e.title}</b>
            <span className="text-muted-foreground">{e.rank}{e.top ? ` of ${e.top}` : ""}</span>
            <span className="ml-auto tabular-nums">{fmt(e.standing)}{e.max != null && !e.ready ? <span className="text-muted-foreground"> / {fmt(e.max)}</span> : null}</span>
          </div>
          <div className="mr-4 h-1.5 overflow-hidden rounded-full bg-muted" aria-hidden><div className="h-full rounded-full transition-[width]" style={{ width: `${e.pct}%`, background: e.color || "var(--primary)" }} /></div>
          {e.ready ? <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Ready to rank up</p> : null}
          {e.next ? (
            <p className="pr-4 text-sm">
              <span className="text-muted-foreground">Next: </span><b className="font-medium">{e.next.t}</b>
              {e.next.in ? <span className="text-muted-foreground"> in {fmt(e.next.in)}{e.next.days ? ` (~${e.next.days} d)` : ""}</span> : null}
              {e.next.cr || e.next.items.length ? " · " : ""}
              {e.next.cr ? `${fmt(e.next.cr)} cr` : ""}
              {e.next.items.map((it, i) => (
                <span key={it.n}>{e.next!.cr || i ? (i ? ", " : " + ") : ""}{it.q > 1 ? fmt(it.q) + " " : ""}<Go k={it.go}>{it.n}</Go></span>
              ))}
            </p>
          ) : (
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Max rank</p>
          )}
        </>
      ) : null}
      {e.dailyLeft != null ? <p className="text-xs text-muted-foreground">{fmt(e.dailyLeft)} left today</p> : null}
      {e.effects ? (
        <p className="pr-4 text-xs">
          <span className="text-muted-foreground">Per 1,000 earned: </span>
          <span className="text-emerald-700 dark:text-emerald-400">+500 {e.effects.ally}</span> ·{" "}
          <span className="text-amber-700 dark:text-amber-400">−500 {e.effects.opp}</span> ·{" "}
          <span className="text-red-700 dark:text-red-300">−1,000 {e.effects.enemy}</span>
          {e.effects.warn.length ? <span className="mt-1 flex items-center gap-1 text-amber-700 dark:text-amber-400"><TriangleAlert className="size-3.5" aria-hidden /> Lowers your rank with {e.effects.warn.join(" and ")}.</span> : null}
        </p>
      ) : null}
      {e.mrxp ? <p className="text-xs"><Badge variant="outline" className="border-primary/40 text-primary">+{fmt(e.mrxp)} MR XP</Badge> <span className="text-muted-foreground">to buy here</span></p> : null}
      <div className="flex flex-col gap-2 pr-4">
        {e.earn ? (
          <More label="How to earn standing">
            <ul className="flex list-disc flex-col gap-1 pl-5 text-sm marker:text-primary/60">{e.earn.now.map((t) => <li key={t}>{t}</li>)}</ul>
            {e.earn.later.length ? <p className="mt-1.5 text-xs text-muted-foreground">Later: {e.earn.later.join(" ")}</p> : null}
          </More>
        ) : null}
        {e.offers.length ? (
          <More label={`What you can buy (${e.offers.length})`}>
            <ul className="flex flex-col divide-y rounded-lg border text-sm">
              {e.offers.map((o) => (
                <li key={o.n} className="flex items-center gap-2 px-3 py-1.5">
                  <span className="min-w-0 flex-1"><Go k={o.go}>{o.n}</Go>{o.nextRank ? <Badge variant="outline" className="ml-1.5 text-muted-foreground">next rank</Badge> : null}</span>
                  {o.xp ? (o.left > 0 ? <Badge variant="outline" className="border-primary/40 text-primary">+{fmt(o.left)}</Badge> : <Check className="size-4 text-primary" aria-label="Mastered" />) : null}
                  <span className="shrink-0 text-xs text-muted-foreground tabular-nums">{fmt(o.cost)}</span>
                </li>
              ))}
            </ul>
          </More>
        ) : null}
        {e.ranks.length ? (
          <More label="Set rank by hand">
            <div className="flex flex-wrap gap-2">
              <Select items={e.ranks} value={String(e.rank)} onValueChange={(v) => tf().synSet(e.n, { r: String(v) })}>
                <SelectTrigger className="h-9 min-w-40" aria-label={`Rank with ${e.n}`}><SelectValue /></SelectTrigger>
                <SelectContent>{e.ranks.map((r) => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}</SelectContent>
              </Select>
              <Standing e={e} />
            </div>
          </More>
        ) : null}
      </div>
      <div className="pr-4">
        <Button variant="outline" size="sm" className="h-8" disabled={e.hasTask} onClick={() => tf().addTaskFrom("synd|" + e.n, "Rank up " + e.n)} aria-label={(e.hasTask ? "In your tasks: " : "Add task: ") + "Rank up " + e.n}>
          {e.hasTask ? <Check /> : <Plus />} {e.hasTask ? "In tasks" : "Task"}
        </Button>
      </div>
    </Card>
  )
})

export function SyndPage() {
  const d = useTFData(() => tf().synd())
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-5 md:px-6 md:py-6">
      <header className="flex flex-col gap-1">
        <h1 className="font-heading text-3xl font-semibold">Syndicates</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">Your rank with every syndicate, what the next rank costs, and the easiest way to earn standing at your stage. Sync your account to fill this in, or set ranks by hand.</p>
      </header>
      <StatList cols={3} items={[
        { k: "Daily cap (each)", v: fmt(d.cap), x: "16,000 + 500 × MR" },
        { k: "Faction standing left today", v: d.factionLeft == null ? "—" : fmt(d.factionLeft), x: d.synced ? "From today's sync" : "Sync to see today's caps" },
        { k: "Daily reset", v: d.reset, x: "00:00 UTC" },
      ]} />
      <div className="flex flex-wrap gap-2">
        <Select items={FILTERS} value={d.filter} onValueChange={(v) => tf().syndSet({ f: String(v) })}>
          <SelectTrigger className="h-9 min-w-40" aria-label="Filter"><SelectValue /></SelectTrigger>
          <SelectContent>{FILTERS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
        </Select>
        <Select items={SORTS} value={d.sort} onValueChange={(v) => tf().syndSet({ s: String(v) })}>
          <SelectTrigger className="h-9 min-w-48" aria-label="Sort"><span className="text-muted-foreground">Sort:</span><SelectValue /></SelectTrigger>
          <SelectContent>{SORTS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
        </Select>
        <SortDir k="syS" className="size-9" />
        <Toggle variant="outline" pressed={d.hide} onPressedChange={(v) => tf().syndSet({ hide: v })} className="h-9 px-3 data-[pressed]:border-primary/60 data-[pressed]:bg-primary/15">Unlocked only</Toggle>
      </div>
      <div className="grid gap-3 md:grid-cols-2">{d.list.map((e) => <Synd key={e.n} e={e} />)}</div>
      {d.nightwave.length ? (
        <Card size="sm" className="px-4">
          <span className="text-xs text-muted-foreground">Nightwave</span>
          <ul className="flex flex-col gap-1 text-sm">{d.nightwave.map((n) => <li key={n.t} className="flex justify-between gap-3"><span>{n.t}</span><span className="tabular-nums text-muted-foreground">Rank {n.r} · {fmt(n.s)}</span></li>)}</ul>
        </Card>
      ) : null}
    </div>
  )
}
