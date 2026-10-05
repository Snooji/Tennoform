import { useEffect, useState } from "react"
import { ChevronDown, Gem, Search, X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Island } from "@/components/tf/island"
import { cn } from "@/lib/utils"
import { fmt, tf, useNarrow, useTFData, type ResRow } from "@/lib/tf"

const FILTERS = [
  { value: "all", label: "All materials" }, { value: "planet", label: "Planet resources" }, { value: "goal", label: "Needed for my goals" },
  { value: "short", label: "Short for my goals" }, { value: "inv", label: "In my inventory" },
]

function Hits({ rows, sel }: { rows: ResRow[]; sel: string }) {
  return (
    <ul className="flex flex-col gap-0.5">
      {rows.map((r) => (
        <li key={r.n}>
          <button
            type="button"
            onClick={() => tf().resPick(r.n)}
            aria-current={r.n === sel ? "true" : undefined}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors outline-none hover:bg-muted/60 focus-visible:ring-3 focus-visible:ring-ring/50",
              r.n === sel && "bg-primary/10 ring-1 ring-primary/40 hover:bg-primary/15"
            )}
          >
            <span className="min-w-0 flex-1 truncate font-medium">{r.n}</span>
            {r.have != null ? <Badge variant="outline" className="tabular-nums">have {fmt(r.have)}</Badge> : null}
            {r.need ? <Badge variant="outline" className="border-primary/40 text-primary tabular-nums">need {fmt(r.need)}</Badge> : null}
            <span className="hidden shrink-0 text-xs text-muted-foreground sm:inline">{r.label}</span>
          </button>
        </li>
      ))}
    </ul>
  )
}

export function ResourcesPage() {
  const d = useTFData(() => tf().res())
  const narrow = useNarrow()
  const [q, setQ] = useState(d.q)
  const [sheet, setSheet] = useState(false)
  const [lastSel, setLastSel] = useState(d.sel)
  if (d.sel !== lastSel) {
    setLastSel(d.sel)
    if (d.sel && narrow) setSheet(true)
  }
  useEffect(() => {
    const t = window.setTimeout(() => q !== d.q && tf().resSet({ q }), 160)
    return () => window.clearTimeout(t)
  }, [q, d.q])
  const empty = (
    <Card className="items-start gap-2 p-6 text-sm text-muted-foreground">
      <Gem aria-hidden className="size-6 text-primary" />
      <b className="font-heading text-base font-semibold text-foreground">Pick a material</b>
      <p>See the best farms for early, mid and late game, how many you have, and what uses it.</p>
    </Card>
  )
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-5 md:px-6 md:py-6">
      <header className="flex flex-col gap-1">
        <h1 className="font-heading text-3xl font-semibold">Resources</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">Tap a material to see the best farms for early, mid and late game, picked from real node levels and mission types.</p>
      </header>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div className="flex min-w-0 flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            <div className="relative min-w-48 flex-1">
              <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find a material" aria-label="Find a material" autoComplete="off" className="h-10 pr-9 pl-9" />
              {q ? <Button variant="ghost" size="icon-sm" className="absolute top-1/2 right-1.5 -translate-y-1/2" onClick={() => setQ("")} aria-label="Clear search"><X /></Button> : null}
            </div>
            <Select items={FILTERS} value={d.filter} onValueChange={(v) => tf().resSet({ f: String(v) })}>
              <SelectTrigger className="h-10 min-w-44" aria-label="Filter materials"><SelectValue /></SelectTrigger>
              <SelectContent>{FILTERS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <Card size="sm" className="gap-1 px-1.5 py-2">
            {d.list ? (
              <>
                <p role="status" className="px-2 py-1 text-xs text-muted-foreground">
                  {d.list.length === d.total ? `${fmt(d.total)} materials` : `Showing ${fmt(d.list.length)} of ${fmt(d.total)} materials`}{" "}
                  <button type="button" className="underline decoration-primary/50 underline-offset-4 hover:text-foreground" onClick={() => { setQ(""); tf().resSet({ q: "", f: "all" }) }}>Clear filters</button>
                </p>
                {d.list.length ? <Hits rows={d.list} sel={d.sel} /> : <p className="px-2 py-6 text-sm text-muted-foreground">No matches.</p>}
              </>
            ) : (
              <>
                <p className="px-2 py-1 text-xs font-medium text-muted-foreground">Planet resources</p>
                <Hits rows={d.main} sel={d.sel} />
                <Collapsible>
                  <CollapsibleTrigger className="group mx-2 mt-1 inline-flex cursor-pointer items-center gap-1.5 rounded-md py-1 text-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50">
                    All other materials ({d.rest.length}) <ChevronDown aria-hidden className="size-3.5 transition-transform group-data-[panel-open]:rotate-180" />
                  </CollapsibleTrigger>
                  <CollapsibleContent><Hits rows={d.rest} sel={d.sel} /></CollapsibleContent>
                </Collapsible>
              </>
            )}
          </Card>
        </div>
        {narrow ? null : <div className="min-w-0"><div className="lg:sticky lg:top-16">{d.detail ? <Island html={d.detail} /> : empty}</div></div>}
      </div>
      {narrow ? (
        <Sheet open={sheet && !!d.detail} onOpenChange={setSheet}>
          <SheetContent side="bottom" className="max-h-[88dvh] gap-0 rounded-t-2xl p-0">
            <SheetHeader className="shrink-0 border-b px-4 py-3">
              <SheetTitle className="pr-8 font-heading text-lg">{d.sel}</SheetTitle>
              <SheetDescription className="sr-only">Where to farm {d.sel}</SheetDescription>
            </SheetHeader>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3">{d.detail ? <Island html={d.detail} /> : null}</div>
          </SheetContent>
        </Sheet>
      ) : null}
    </div>
  )
}
