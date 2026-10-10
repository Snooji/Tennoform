import { useState } from "react"
import { Check, ChevronRight, Fish, MapPin, Wrench, PawPrint, Pickaxe, Plus, Search } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Segmented } from "@/components/ui/segmented"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { GoLink } from "@/components/tf/go-link"
import { WorldCycles } from "./world-cycles"
import { cn } from "@/lib/utils"
import { tf, useTFData, type ConservationData, type WorldData } from "@/lib/tf"

const RARE = (r: string) => (r === "Rare" || r === "Legendary" || r === "Special" ? "border-primary/40 text-primary" : "text-muted-foreground")

function TaskBtn({ has, k, label }: { has: boolean; k: string; label: string }) {
  return (
    <Button variant="outline" size="sm" className="h-8" disabled={has} onClick={() => tf().addTaskFrom(k, label)} aria-label={(has ? "In your tasks: " : "Add task: ") + label}>
      {has ? <Check /> : <Plus />} {has ? "In tasks" : "Task"}
    </Button>
  )
}

function Regions({ d }: { d: WorldData }) {
  return (
    <ToggleGroup aria-label="Region" value={[d.region]} onValueChange={(v: string[]) => v[0] && tf().worldSet({ region: v[0] })} spacing={1}
      className="scroll-fade -mx-4 w-auto flex-nowrap overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:px-0">
      {d.regions.map((r) => (
        <ToggleGroupItem key={r} value={r} variant="outline" className="h-9 rounded-full px-3 data-[pressed]:border-primary/60 data-[pressed]:bg-primary/15">{r}</ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}

function Fishing({ d }: { d: WorldData }) {
  const rar = [{ value: "all", label: "All rarities" }, { value: "todo", label: "Not caught yet" }, ...["Common", "Uncommon", "Rare", "Legendary"].map((x) => ({ value: x, label: x }))]
  const times = [{ value: "all", label: "Any time" }, ...d.times!.map((t) => ({ value: t, label: t }))]
  return (
    <>
      <Regions d={d} />
      <Card size="sm">
        <CardHeader>
          <CardTitle className="flex flex-wrap items-center gap-2">
            <h2 className="font-heading text-lg leading-tight font-semibold">{d.region}</h2>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-1.5 text-sm">
          <p><b className="font-medium">Spears:</b> {d.info!.spears}</p>
          <p><b className="font-medium">Vendor:</b> {d.info!.vendor}. {d.info!.use}</p>
          {d.info!.tips.length ? <ul className="tf-more mt-1 flex list-disc flex-col gap-1 pl-5 text-muted-foreground marker:text-primary/60">{d.info!.tips.map((t) => <li key={t}>{t}</li>)}</ul> : null}
        </CardContent>
      </Card>
      <div className="flex flex-wrap gap-2">
        <Select items={rar} value={d.rarity} onValueChange={(v) => tf().worldSet({ rarity: String(v) })}>
          <SelectTrigger className="h-9 min-w-40" aria-label="Rarity"><SelectValue /></SelectTrigger>
          <SelectContent>{rar.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
        </Select>
        <Select items={times} value={d.time} onValueChange={(v) => tf().worldSet({ time: String(v) })}>
          <SelectTrigger className="h-9 min-w-32" aria-label="Time"><SelectValue /></SelectTrigger>
          <SelectContent>{times.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <Card className="gap-0 py-0">
        <div className="flex flex-wrap items-center gap-3 border-b px-4 py-3">
          <b className="font-heading text-base font-semibold">{d.fish!.length} fish</b>
          <span className="text-xs text-muted-foreground tabular-nums">{d.caught}/{d.total} caught</span>
          <Progress value={(100 * d.caught!) / (d.total || 1)} className="h-1 min-w-20 flex-1" aria-label={`${d.caught} of ${d.total} caught`} />
        </div>
        <ul className="flex flex-col divide-y">
          {d.fish!.map((f) => (
            <li key={f.n} className={cn("flex gap-3 px-4 py-3", f.done && "bg-muted/30")}>
              <Checkbox className="mt-0.5 size-5 rounded-md" checked={f.done} onCheckedChange={(v) => tf().nodeTick(f.key, !!v)} aria-label={(f.done ? "Not caught: " : "Caught: ") + f.n} />
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="flex flex-wrap items-center gap-1.5">
                  <b className={cn("font-medium", f.done && "text-muted-foreground line-through decoration-primary/70")}>{f.n}</b>
                  <Badge variant="outline" className={RARE(f.rarity)}>{f.rarity}</Badge>
                </span>
                <span className="text-sm text-muted-foreground">
                  <b className="font-medium text-foreground">{f.bio}</b> · {f.time} · spear: {f.spear}{f.bait ? <> · bait: <b className="font-medium text-foreground">{f.bait}</b></> : null}
                </span>
                {f.spots.length ? (
                  <ul className="flex flex-col gap-0.5 text-sm" aria-label={`Where to catch ${f.n}`}>
                    {f.spots.map((sp) => <li key={sp} className="flex gap-1.5"><MapPin className="mt-0.5 size-3.5 shrink-0 text-primary/70" aria-hidden />{sp}</li>)}
                  </ul>
                ) : null}
                {f.gives.length ? (
                  <span className="text-xs text-muted-foreground">Gives {f.gives.map((g, i) => <span key={g.n}>{i ? ", " : ""}<GoLink k={g.go}>{g.n}</GoLink></span>)}</span>
                ) : null}
              </div>
              <TaskBtn has={f.hasTask} k={"fish|" + f.n} label={"Catch " + f.n} />
            </li>
          ))}
        </ul>
      </Card>
    </>
  )
}

function Mining({ d }: { d: WorldData }) {
  const done = d.ores!.filter((o) => o.done).length
  return (
    <>
      <Regions d={d} />
      <Card size="sm">
        <CardHeader><CardTitle><h2 className="font-heading text-lg leading-tight font-semibold">Best spots in {d.region}</h2></CardTitle></CardHeader>
        <CardContent className="flex flex-col gap-1.5 text-sm">
          <ul className="flex list-disc flex-col gap-1 pl-5 marker:text-primary/60">{d.spots!.map((s) => <li key={s}>{s}</li>)}</ul>
          <p className="text-muted-foreground">{d.vendor}</p>
        </CardContent>
      </Card>
      <Card className="gap-0 py-0">
        <div className="flex flex-wrap items-center gap-3 border-b px-4 py-3">
          <b className="font-heading text-base font-semibold">Ores and gems</b>
          <span className="text-xs text-muted-foreground tabular-nums">{done}/{d.ores!.length} mined</span>
          <Progress value={(100 * done) / (d.ores!.length || 1)} className="h-1 min-w-20 flex-1" aria-label={`${done} of ${d.ores!.length} mined`} />
        </div>
        <ul className="flex flex-col divide-y">
          {d.ores!.map((o) => (
            <li key={o.n} className={cn("flex items-center gap-3 px-4 py-2.5", o.done && "bg-muted/30")}>
              <Checkbox className="size-5 rounded-md" checked={o.done} onCheckedChange={(v) => tf().nodeTick(o.key, !!v)} aria-label={(o.done ? "Not mined: " : "Mined: ") + o.n} />
              <span className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
                <GoLink k={o.go} className={cn("font-medium", o.done && "text-muted-foreground line-through")}>{o.n}</GoLink>
                <Badge variant="outline" className={RARE(o.rarity)}>{o.rarity}</Badge>
                <span className="text-xs text-muted-foreground">{o.kind}</span>
              </span>
              <TaskBtn has={o.hasTask} k={"ore|" + o.n} label={"Mine " + o.n} />
            </li>
          ))}
        </ul>
      </Card>
      <Card className="gap-0 py-0">
        <h3 className="border-b px-4 py-3 font-heading text-base leading-tight font-semibold">Cutters</h3>
        <ul className="flex flex-col divide-y">
          {d.cutters!.map((c) => (
            <li key={c.n} className={cn("flex gap-3 px-4 py-2.5", c.done && "bg-muted/30")}>
              <Checkbox className="mt-0.5 size-5 rounded-md" checked={c.done} onCheckedChange={(v) => tf().nodeTick(c.key, !!v)} aria-label={(c.done ? "Don't have: " : "Have: ") + c.n} />
              <span className="flex flex-col"><b className="font-medium">{c.n}</b><span className="text-xs text-muted-foreground">{c.where} · {c.desc}</span></span>
            </li>
          ))}
        </ul>
      </Card>
      <Card size="sm" className="tf-more px-4"><ul className="flex list-disc flex-col gap-1 pl-5 text-sm text-muted-foreground marker:text-primary/60">{d.tips!.map((t) => <li key={t}>{t}</li>)}</ul></Card>
    </>
  )
}

function WorldSearch() {
  const [q, setQ] = useState("")
  const hits = useTFData(() => tf().worldSearch(q))
  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <Input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find a fish, ore, gem or animal" aria-label="Find a fish, ore, gem or animal" className="h-10 pl-9" />
      </div>
      {q.trim().length >= 2 ? (
        <Card className="gap-0 py-0" aria-live="polite">
          {hits.length ? (
            <ul className="flex flex-col divide-y">
              {hits.map((h) => (
                <li key={h.key} className="flex flex-wrap items-center gap-x-2 gap-y-0.5 px-4 py-2.5 text-sm">
                  <GoLink k={h.key} className={cn("font-medium", h.done && "text-muted-foreground line-through")}>{h.n}</GoLink>
                  <Badge variant="outline" className="text-muted-foreground">{h.kind}</Badge>
                  <span className="text-xs text-muted-foreground">{h.reg}{h.line ? " · " + h.line : ""}</span>
                </li>
              ))}
            </ul>
          ) : <p className="px-4 py-3 text-sm text-muted-foreground">Nothing in the open worlds matches “{q.trim()}”.</p>}
        </Card>
      ) : null}
    </div>
  )
}

function Conservation({ c }: { c: ConservationData }) {
  const done = c.species.filter((a) => a.done).length
  return (
    <>
      <ToggleGroup aria-label="Region" value={[c.region]} onValueChange={(v: string[]) => v[0] && tf().conservationSet(v[0])} spacing={1}
        className="scroll-fade -mx-4 w-auto flex-nowrap overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:px-0">
        {c.regions.map((r) => (
          <ToggleGroupItem key={r} value={r} variant="outline" className="h-9 rounded-full px-3 data-[pressed]:border-primary/60 data-[pressed]:bg-primary/15">{r}</ToggleGroupItem>
        ))}
      </ToggleGroup>
      <Card size="sm" className="py-0">
        <details className="group px-4 py-3">
          <summary className="flex cursor-pointer list-none items-center gap-2 font-heading text-base font-semibold [&::-webkit-details-marker]:hidden">
            <ChevronRight className="size-4 text-muted-foreground transition-transform group-open:rotate-90" aria-hidden /> How Conservation works
          </summary>
          <ol className="mt-2 flex list-decimal flex-col gap-1 pl-5 text-sm text-muted-foreground marker:text-primary/70">{c.steps.map((t) => <li key={t}>{t}</li>)}</ol>
        </details>
      </Card>
      <Card className="gap-0 py-0">
        <div className="flex flex-wrap items-center gap-3 border-b px-4 py-3">
          <b className="font-heading text-base font-semibold">{c.region}</b>
          <span className="text-xs text-muted-foreground">{c.vendor}</span>
          <span className="text-xs text-muted-foreground tabular-nums">{done}/{c.species.length} captured</span>
          <Progress value={(100 * done) / (c.species.length || 1)} className="h-1 min-w-20 flex-1" aria-label={`${done} of ${c.species.length} captured`} />
        </div>
        <ul className="flex flex-col divide-y">
          {c.species.map((a) => (
            <li key={a.n} className={cn("flex gap-3 px-4 py-3", a.done && "bg-muted/30")}>
              <Checkbox className="mt-0.5 size-5 rounded-md" checked={a.done} onCheckedChange={(v) => tf().nodeTick(a.key, !!v)} aria-label={(a.done ? "Not captured: " : "Captured: ") + a.n} />
              <div className="flex min-w-0 flex-1 flex-col gap-1 text-sm">
                <span className="flex flex-wrap items-center gap-1.5">
                  <GoLink k={"ow|" + a.n} className={cn("font-medium", a.done && "text-muted-foreground line-through decoration-primary/70")}>{a.n}</GoLink>
                  {a.variants.map((v) => <Badge key={v} variant="outline" className={a.rare.includes(v) ? "border-primary/40 text-primary" : "text-muted-foreground"}>{v}</Badge>)}
                </span>
                <span className="text-muted-foreground"><b className="font-medium text-foreground">Where:</b> {a.where}{a.time ? <> · <b className="font-medium text-foreground">When:</b> {a.time}</> : null}</span>
                <span className="text-muted-foreground"><b className="font-medium text-foreground">Call it:</b> {a.lure}</span>
                <span className="text-muted-foreground"><b className="font-medium text-foreground">Perfect capture:</b> {a.reward}</span>
                <span className="text-xs text-muted-foreground">Tip: {a.tip}</span>
              </div>
              <TaskBtn has={a.hasTask} k={"animal|" + a.n} label={"Capture " + a.n} />
            </li>
          ))}
        </ul>
      </Card>
    </>
  )
}

const TOOL_WORD = { fish: "fish", mine: "mine", cons: "capture animals" } as const

/** What to buy, from whom and for how much before you can fish, mine or capture animals in this world. */
function Tools({ d }: { d: WorldData }) {
  const t = d.tools
  const rg = d.tab === "cons" ? d.cons?.region : d.region
  if (!t || (!t.list.length && !t.first)) return null
  return (
    <Card size="sm" className="py-0">
      <details className="group px-4 py-3" open>
        <summary className="flex cursor-pointer list-none items-center gap-2 font-heading text-base font-semibold [&::-webkit-details-marker]:hidden">
          <ChevronRight className="size-4 text-muted-foreground transition-transform group-open:rotate-90" aria-hidden />
          <Wrench className="size-4 text-primary/80" aria-hidden /> Tools you need to {TOOL_WORD[d.tab]}{rg ? ` in ${rg}` : ""}
        </summary>
        {t.first ? <p className="mt-2 text-sm text-muted-foreground">{t.first}</p> : null}
        {t.list.length ? (
          <ul className="mt-2 flex flex-col divide-y rounded-md border">
            {t.list.map((x) => (
              <li key={x.n} className="flex flex-col gap-0.5 px-3 py-2 text-sm">
                <span className="flex flex-wrap items-baseline gap-x-2"><b className="font-medium">{x.n}</b>{x.cost ? <span className="text-xs text-primary">{x.cost}</span> : null}</span>
                {x.from ? <span className="text-xs text-muted-foreground">From {x.from}</span> : null}
                {x.note ? <span className="text-xs text-muted-foreground">{x.note}</span> : null}
              </li>
            ))}
          </ul>
        ) : null}
      </details>
    </Card>
  )
}

export function WorldPage() {
  const d = useTFData(() => tf().world())
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-5 md:px-6 md:py-6">
      <header className="flex flex-col gap-1">
        <h1 className="font-heading text-3xl font-semibold">Open worlds</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">Where and when each fish bites, which spear and bait to bring, the best mining spots, and how to find and capture every animal. Search everything at once below.</p>
      </header>
      <WorldSearch />
      <Segmented
        className="self-start"
        value={d.tab}
        onValueChange={(v) => tf().worldSet({ tab: v })}
        items={[
          { value: "fish", label: <span className="flex items-center gap-1.5"><Fish className="size-4" aria-hidden /> Fishing</span> },
          { value: "mine", label: <span className="flex items-center gap-1.5"><Pickaxe className="size-4" aria-hidden /> Mining</span> },
          { value: "cons", label: <span className="flex items-center gap-1.5"><PawPrint className="size-4" aria-hidden /> Conservation</span> },
        ]}
      />
      <WorldCycles d={d} region={d.tab === "cons" ? d.cons?.region || "" : d.region} />
      <Tools d={d} />
      {d.tab === "cons" ? (d.cons ? <Conservation c={d.cons} /> : null) : d.tab === "mine" ? <Mining d={d} /> : <Fishing d={d} />}
    </div>
  )
}
