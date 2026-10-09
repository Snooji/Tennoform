import { useState } from "react"
import { Check, ChevronDown, CircleAlert, CircleCheck, Clock, LoaderCircle, Plus, RefreshCw, Star, WifiOff, X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { fmt, tf, useTFData, type TodayLive } from "@/lib/tf"
import { TaskButton } from "./checklist"

const H = ({ children }: { children: React.ReactNode }) => <h3 className="font-heading text-base leading-tight font-semibold">{children}</h3>

const ended = (t: string) => t.startsWith("Ended")

function Left({ t }: { t: string }) {
  return <Badge variant="outline" className={cn("tabular-nums", ended(t) ? "border-amber-500/40 text-amber-800 dark:text-amber-300" : "text-muted-foreground")}>{t}</Badge>
}

/** Feed state as an icon next to the words (never colour alone). */
const STATE = {
  ok: { Icon: CircleCheck, cls: "text-emerald-700 dark:text-emerald-400" },
  loading: { Icon: LoaderCircle, cls: "animate-spin text-muted-foreground" },
  delayed: { Icon: Clock, cls: "text-amber-700 dark:text-amber-300" },
  stale: { Icon: Clock, cls: "text-amber-700 dark:text-amber-300" },
  error: { Icon: CircleAlert, cls: "text-destructive" },
  offline: { Icon: WifiOff, cls: "text-muted-foreground" },
}

/** Connection and freshness of the live feed, shown above the live sections at all times. */
export function LiveStatus() {
  const L = useTFData(() => tf().liveInfo())
  const st = STATE[L.state] ?? STATE.offline
  return (
    <div className="flex flex-col gap-1 border-b pb-3" role="status" aria-live="polite">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="flex min-w-0 flex-1 items-center gap-2 text-sm">
          <st.Icon aria-hidden className={cn("size-4 shrink-0", st.cls)} />
          <span className="min-w-0"><b className="font-medium">{L.conn}</b>{L.at ? <span className="text-muted-foreground"> · updated {L.at}</span> : null}</span>
        </span>
        {L.retry ? (
          <Button variant="outline" size="sm" className="h-8" disabled={L.busy} onClick={() => tf().retryLive()}>
            <RefreshCw className={cn(L.busy && "animate-spin")} /> {L.state === "error" ? "Try again" : "Refresh"}
          </Button>
        ) : null}
      </div>
      {L.state === "offline" ? <p className="text-sm text-muted-foreground">Cycles, fissures, Baro and the Sortie show live on tennoform.com.</p> : null}
      {L.state === "loading" ? <p className="text-sm text-muted-foreground">Getting cycles, fissures, Baro and the Sortie…</p> : null}
      {L.state === "error" && !L.at ? <p className="text-sm text-muted-foreground">Couldn't get live game info. Check your connection, then try again.</p> : null}
      {L.fresh && L.state !== "ok" ? <p className={cn("text-sm", L.state === "delayed" || L.state === "stale" ? "text-amber-800 dark:text-amber-300" : "text-muted-foreground")}>{L.fresh}</p> : null}
    </div>
  )
}

export function Cycles({ L }: { L: TodayLive }) {
  if (!L.cycles.length) return null
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {L.cycles.map((c) => (
        <Card key={c.name} size="sm" className="gap-0.5 px-3">
          <span className="text-xs text-muted-foreground">{c.name}</span>
          <b className="font-heading text-lg leading-tight font-semibold">{c.state}</b>
          <span className={cn("text-xs tabular-nums", ended(c.left) ? "text-amber-800 dark:text-amber-300" : "text-muted-foreground")}>{c.left}</span>
        </Card>
      ))}
    </div>
  )
}

export function Missions({ L }: { L: TodayLive }) {
  return (
    <>
      {L.sortie ? (
        <Card size="sm">
          <CardHeader>
            <CardTitle><H>Sortie{L.sortie.boss ? " · " + L.sortie.boss : ""}</H></CardTitle>
            <CardAction className="flex items-center gap-1.5"><Left t={L.sortie.left} /></CardAction>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <ol className="flex flex-col gap-2 text-sm">
              {L.sortie.variants.map((v, i) => (
                <li key={i} className="flex gap-3">
                  <span aria-hidden className="w-4 shrink-0 font-semibold text-muted-foreground tabular-nums">{i + 1}</span>
                  <span>
                    <b className="font-medium">{v.t}</b> · {v.s}
                    <span className="block text-muted-foreground">{v.n}</span>
                  </span>
                </li>
              ))}
            </ol>
            <div><TaskButton text={L.sortie.task} expiry={L.sortie.expiry} has={L.sortie.hasTask} /></div>
          </CardContent>
        </Card>
      ) : null}
      {L.archon ? (
        <Card size="sm">
          <CardHeader>
            <CardTitle><H>Archon Hunt{L.archon.boss ? " · " + L.archon.boss : ""}</H></CardTitle>
            <CardAction><Left t={L.archon.left} /></CardAction>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <ol className="flex list-decimal flex-col gap-1 pl-5 text-sm marker:text-muted-foreground">
              {L.archon.missions.map((v, i) => (
                <li key={i}><b className="font-medium">{v.t}</b> · {v.s}</li>
              ))}
            </ol>
            <div><TaskButton text={L.archon.task} expiry={L.archon.expiry} has={L.archon.hasTask} /></div>
          </CardContent>
        </Card>
      ) : null}
      {L.arbitration ? (
        <Card size="sm">
          <CardHeader>
            <CardTitle><H>Arbitration · {L.arbitration.type}</H></CardTitle>
            <CardAction><Left t={L.arbitration.left} /></CardAction>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm">
            <span>{L.arbitration.node}{L.arbitration.enemy ? <span className="text-muted-foreground"> · {L.arbitration.enemy}</span> : null}</span>
            <div><TaskButton text={L.arbitration.task} expiry={L.arbitration.expiry} has={L.arbitration.hasTask} /></div>
          </CardContent>
        </Card>
      ) : null}
      {L.steel ? (
        <Card size="sm" className="flex-row items-center justify-between gap-3 px-4">
          <span className="flex flex-col">
            <span className="text-xs text-muted-foreground">Steel Path Honors this week</span>
            <b className="font-heading text-base font-semibold">{L.steel.name}</b>
          </span>
          <Badge variant="outline" className="border-primary/40 text-primary">{L.steel.cost} Steel Essence</Badge>
        </Card>
      ) : null}
      {L.baro ? (
        <Card size="sm">
          <CardHeader>
            <CardTitle><H>Baro Ki'Teer</H></CardTitle>
            <CardAction>
              <Badge variant="outline" className={cn(L.baro.gone ? "border-amber-500/40 text-amber-800 dark:text-amber-300" : L.baro.here ? "border-emerald-500/40 text-emerald-700 dark:text-emerald-400" : "text-muted-foreground")}>
                {L.baro.gone ? "Left · next visit loading" : L.baro.here ? "Here now · " + (L.baro.left ? "leaves in " + L.baro.left : "leaving now") : L.baro.left ? "Arrives in " + L.baro.left : "Arriving now"}
              </Badge>
            </CardAction>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 text-sm">
            {L.baro.location ? <span className="text-muted-foreground">{L.baro.location}</span> : null}
            {L.baro.inv.length ? (
              <ul className="flex flex-col divide-y rounded-lg border">
                {L.baro.inv.map((x) => (
                  <li key={x.item} className={cn("flex items-center gap-2 py-1 pr-3 pl-1", x.wish && "bg-primary/10")}>
                    <Button variant="ghost" size="icon" className="size-8 shrink-0" aria-pressed={!!x.wish} aria-label={(x.wish ? "Remove from" : "Add to") + " your Baro wishlist: " + x.item} onClick={() => tf().baroWish(x.item, !x.wish)}>
                      <Star className={cn("size-4", x.wish && "fill-primary text-primary")} />
                    </Button>
                    <span className="min-w-0 flex-1 truncate">{x.item}</span>
                    {x.own ? <Badge variant="outline" className="shrink-0 text-muted-foreground">Owned</Badge> : null}
                    <span className="shrink-0 text-xs text-muted-foreground tabular-nums">{x.ducats} ducats · {fmt(x.credits)} cr</span>
                  </li>
                ))}
              </ul>
            ) : null}
            <BaroWishlist wish={L.baro.wish || []} here={L.baro.here} />
          </CardContent>
        </Card>
      ) : null}
    </>
  )
}

/** What you want Baro to bring. His stock is only known once he arrives, so the alert fires then. */
function BaroWishlist({ wish, here }: { wish: { n: string; here: boolean }[]; here: boolean }) {
  const [q, setQ] = useState("")
  const sug = q.trim().length >= 2 ? tf().baroSuggest(q) : []
  const add = (n: string) => { if (n.trim()) { tf().baroWish(n.trim(), true); setQ("") } }
  return (
    <div className="flex flex-col gap-2 border-t pt-3">
      <span className="flex items-center gap-1.5 font-medium"><Star aria-hidden className="size-4 text-primary" /> Your Baro wishlist</span>
      {wish.length ? (
        <ul className="flex flex-wrap gap-1.5">
          {wish.map((w) => (
            <li key={w.n}>
              <Badge variant="outline" className={cn("h-8 gap-1 pr-1", w.here && "border-emerald-500/50 text-emerald-700 dark:text-emerald-400")}>
                {w.here ? <Check aria-hidden /> : null}{w.n}{w.here ? <span className="sr-only"> (he has it now)</span> : null}
                <Button variant="ghost" size="icon" className="size-7" aria-label={"Remove " + w.n + " from your Baro wishlist"} onClick={() => tf().baroWish(w.n, false)}><X /></Button>
              </Badge>
            </li>
          ))}
        </ul>
      ) : <p className="text-xs text-muted-foreground">Add what you're waiting for, like Primed Flow or a Prisma weapon. When Baro brings any of it, you'll get an alert on Home and Today.</p>}
      <form className="relative flex gap-2" onSubmit={(e) => { e.preventDefault(); add(q) }}>
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Add an item, e.g. Primed Flow" aria-label="Add an item to your Baro wishlist" className="h-9 flex-1" maxLength={60} />
        <Button type="submit" variant="outline" className="h-9" disabled={!q.trim()}><Plus /> Add</Button>
      </form>
      {sug.length ? (
        <ul className="flex flex-wrap gap-1.5" aria-label="Suggestions">
          {sug.map((n) => <li key={n}><Button variant="outline" size="sm" className="h-8" onClick={() => add(n)}><Plus /> {n}</Button></li>)}
        </ul>
      ) : null}
      {!here ? <p className="text-xs text-muted-foreground">Baro's stock shows here when he arrives.</p> : null}
    </div>
  )
}

export function Nightwave({ L }: { L: TodayLive }) {
  if (!L.nightwave || !L.nightwave.length) return null
  const done = L.nightwave.filter((x) => x.done).length
  return (
    <Card className="gap-0 py-0">
      <CardHeader className="border-b py-3">
        <CardTitle><H>Nightwave acts</H></CardTitle>
        <CardAction><Badge variant="outline" className="tabular-nums">{done}/{L.nightwave.length} done</Badge></CardAction>
      </CardHeader>
      <ul className="flex flex-col divide-y">
        {L.nightwave.map((c) => (
          <li key={c.id} className={cn("flex gap-3 px-4 py-3", c.done && "bg-muted/30")}>
            <Checkbox className="mt-0.5 size-5 rounded-md" checked={c.done} onCheckedChange={(v) => tf().ckTick(c.id, !!v)} aria-label={`Mark done: ${c.title}`} />
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <span className="flex flex-wrap items-center gap-1.5">
                <span className={cn("font-medium", c.done && "text-muted-foreground line-through decoration-primary/70")}>{c.title}</span>
                <Badge variant="outline" className="text-muted-foreground">{c.kind}</Badge>
                <Badge variant="outline" className="border-primary/40 text-primary tabular-nums">{fmt(c.rep)}</Badge>
              </span>
              <span className="text-sm text-muted-foreground">{c.desc} · {c.left}</span>
            </div>
            <TaskButton text={c.task} expiry={c.expiry} has={c.hasTask} />
          </li>
        ))}
      </ul>
    </Card>
  )
}

const ERAS = [
  { value: "all", label: "All eras" }, { value: "need", label: "Eras I need" }, { value: "Lith", label: "Lith" }, { value: "Meso", label: "Meso" },
  { value: "Neo", label: "Neo" }, { value: "Axi", label: "Axi" }, { value: "Requiem", label: "Requiem" }, { value: "Omnia", label: "Omnia" },
]
const MODES = [
  { value: "all", label: "All modes" }, { value: "n", label: "Normal" }, { value: "sp", label: "Steel Path" }, { value: "storm", label: "Void Storm (Railjack)" },
]

export function Fissures({ L }: { L: TodayLive }) {
  const F = L.fissures
  return (
    <Card className="gap-0 py-0">
      <CardHeader className="border-b py-3">
        <CardTitle><H>Void Fissures</H></CardTitle>
        <CardAction><Badge variant="outline" className="tabular-nums">{F.list.length}</Badge></CardAction>
      </CardHeader>
      <div className="flex flex-col gap-3 px-4 py-3">
        <div className="flex flex-wrap gap-2">
          <Select items={ERAS} value={F.era} onValueChange={(v) => tf().todaySet({ fiF: String(v) })}>
            <SelectTrigger className="h-9 min-w-36" aria-label="Relic era"><SelectValue /></SelectTrigger>
            <SelectContent>{ERAS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
          </Select>
          <Select items={MODES} value={F.mode} onValueChange={(v) => tf().todaySet({ fiM: String(v) })}>
            <SelectTrigger className="h-9 min-w-36" aria-label="Mode"><SelectValue /></SelectTrigger>
            <SelectContent>{MODES.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <p className="text-sm text-muted-foreground">
          {F.need.length ? (
            <>
              You need relics from:{" "}
              {F.need.map((n, i) => (
                <span key={n.era}>
                  {i ? " · " : ""}
                  <b className="font-medium text-foreground">{n.era}</b> ({n.relics.join(", ")}{n.more ? "…" : ""})
                </span>
              ))}
            </>
          ) : (
            <>Track a Prime item under <a href="/goals/" className="underline decoration-primary/60 underline-offset-4">Goals</a> to highlight the fissures you need.</>
          )}
        </p>
      </div>
      {F.list.length ? (
        <ul className="flex flex-col divide-y border-t">
          {F.list.map((x) => (
            <li key={x.id} className={cn("flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-2.5", x.need && "bg-primary/[0.05]")}>
              <span className="flex min-w-0 flex-1 basis-56 flex-col">
                <span className="flex flex-wrap items-center gap-1.5">
                  <b className={cn("font-medium", x.need && "text-primary")}>{x.tier}</b>
                  {x.need ? <Badge variant="outline" className="border-primary/40 text-primary"><Star className="fill-current" /> You need</Badge> : null}
                  {x.hard ? <Badge variant="outline" className="border-amber-500/40 text-amber-700 dark:text-amber-400">Steel Path</Badge> : null}
                  {x.storm ? <Badge variant="outline" className="text-muted-foreground">Void Storm</Badge> : null}
                </span>
                <span className="text-sm text-muted-foreground">{x.mission} · {x.node} · <span className="tabular-nums">{x.left}</span></span>
              </span>
              <span className="flex gap-1.5">
                <Button variant="ghost" size="sm" className="h-8" onClick={() => tf().fisRelics(x.tier)}>
                  {x.mine ? `My ${x.tier} relics (${x.mine})` : `Find ${x.tier} relics`}
                </Button>
                <TaskButton text={x.task} expiry={x.expiry} has={x.hasTask} />
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="border-t px-4 py-6 text-sm text-muted-foreground">No fissures match these filters right now.</p>
      )}
    </Card>
  )
}

export function Invasions({ L }: { L: TodayLive }) {
  if (!L.invasions.length) return null
  return (
    <Card className="gap-0 py-0">
      <Collapsible>
        <CollapsibleTrigger className="group flex w-full cursor-pointer items-center gap-2 px-4 py-3 text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
          <H>Invasions</H>
          <Badge variant="outline" className="tabular-nums">{L.invasions.length}</Badge>
          <ChevronDown aria-hidden className="ml-auto size-4 text-muted-foreground transition-transform group-data-[panel-open]:rotate-180" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <ul className="flex flex-col divide-y border-t">
            {L.invasions.map((x) => (
              <li key={x.id} className="flex items-center gap-3 px-4 py-2.5 text-sm">
                <span className="flex min-w-0 flex-1 flex-col">
                  <span>{x.node} · {x.desc}</span>
                  <span className={cn(x.good ? "font-medium text-primary" : "text-muted-foreground")}>{x.rewards}</span>
                </span>
                <span className="text-xs text-muted-foreground tabular-nums">{x.pct}%</span>
              </li>
            ))}
          </ul>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
