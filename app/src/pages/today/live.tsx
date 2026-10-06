import { ChevronDown, RefreshCw, Star } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { fmt, tf, type TodayData, type TodayLive } from "@/lib/tf"
import { TaskButton } from "./checklist"

const H = ({ children }: { children: React.ReactNode }) => <h3 className="font-heading text-base leading-tight font-semibold">{children}</h3>

function Left({ t }: { t: string }) {
  return <Badge variant="outline" className="text-muted-foreground tabular-nums">{t} left</Badge>
}

export function LiveStatus({ d }: { d: TodayData }) {
  if (d.liveState === "ok") return null
  return (
    <Card size="sm" className="flex-row items-center gap-3 px-4 text-sm text-muted-foreground">
      <span className="flex-1">
        {d.liveState === "offline"
          ? "Live game info (cycles, fissures, Baro, Sortie) works on tennoform.com."
          : d.liveState === "error"
            ? "Couldn't reach the live game feed. Check your connection, then try again."
            : "Loading live game info…"}
      </span>
      {d.liveState === "error" ? (
        <Button variant="outline" size="sm" className="h-8" onClick={() => tf().retryLive()}>
          <RefreshCw /> Retry
        </Button>
      ) : null}
    </Card>
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
          <span className="text-xs text-muted-foreground tabular-nums">{c.left} left</span>
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
                  <span aria-hidden className="grid size-6 shrink-0 place-items-center rounded-md border border-primary/40 text-xs font-semibold text-primary">{i + 1}</span>
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
              <Badge variant="outline" className={cn(L.baro.here ? "border-emerald-500/40 text-emerald-700 dark:text-emerald-400" : "text-muted-foreground")}>
                {L.baro.here ? "Here now · leaves in " + L.baro.left : "Arrives in " + L.baro.left}
              </Badge>
            </CardAction>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 text-sm">
            {L.baro.location ? <span className="text-muted-foreground">{L.baro.location}</span> : null}
            {L.baro.inv.length ? (
              <ul className="flex flex-col divide-y rounded-lg border">
                {L.baro.inv.map((x) => (
                  <li key={x.item} className="flex items-center justify-between gap-3 px-3 py-1.5">
                    <span className="min-w-0 truncate">{x.item}</span>
                    <span className="shrink-0 text-xs text-muted-foreground tabular-nums">{x.ducats} ducats · {fmt(x.credits)} cr</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </CardContent>
        </Card>
      ) : null}
    </>
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
              <span className="text-sm text-muted-foreground">{c.desc} · {c.left} left</span>
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
            <>Track a Prime item under <a href="#goals" className="underline decoration-primary/60 underline-offset-4">Goals</a> to highlight the fissures you need.</>
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
