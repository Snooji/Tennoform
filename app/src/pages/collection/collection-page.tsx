import { useEffect, useState } from "react"
import { Check, ChevronDown, Search, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Segmented } from "@/components/ui/segmented"
import { Input } from "@/components/ui/input"
import { Thumb } from "@/components/tf/thumb"
import { HistoryCard } from "@/components/tf/history-chart"
import { fmt, tf, useTFData } from "@/lib/tf"

const VIEWS = [{ value: "owned", label: "Owned" }, { value: "mastered", label: "Mastered" }, { value: "level", label: "Owned, not mastered" }, { value: "all", label: "Everything" }]

/** Everything you have, in one place: owned and mastered gear across every category. */
export function CollectionPage() {
  const d = useTFData(() => tf().collection())
  const [q, setQ] = useState(d.q)
  useEffect(() => {
    const t = window.setTimeout(() => q !== d.q && tf().collectionSet({ q }), 160)
    return () => window.clearTimeout(t)
  }, [q, d.q])
  /* the counts live in the filter itself, so there's one control instead of tiles plus a switch */
  const n = (v: number) => <span className="ml-1.5 font-normal text-muted-foreground tabular-nums">{fmt(v)}</span>
  const views = VIEWS.map((o) => ({ ...o, label: <>{o.label}{o.value === "owned" ? n(d.owned) : o.value === "mastered" ? n(d.mastered) : o.value === "level" ? n(d.level) : n(d.total)}</> }))
  const shown = d.cats.reduce((a, c) => a + c.items.length, 0)
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-5 md:px-6 md:py-6">
      <header className="flex flex-col gap-1">
        <h1 className="font-heading text-3xl font-semibold">My collection</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Everything you have, by category. Owned and mastered are separate: Warframe keeps mastery after you sell or release something.
          Change either on <a href="#ranks" className="underline decoration-primary/50 underline-offset-4">Ranks</a>.
        </p>
      </header>
      <HistoryCard />
      <div className="flex flex-wrap items-center gap-2">
        <div className="scroll-fade -mx-4 max-w-[calc(100%+2rem)] overflow-x-auto px-4 sm:mx-0 sm:max-w-full sm:px-0"><Segmented className="min-w-max" value={d.f} onValueChange={(v) => tf().collectionSet({ f: v })} items={views} /></div>
        <div className="relative min-w-48 flex-1">
          <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find something you have" aria-label="Find in your collection" className="h-10 pr-9 pl-9" />
          {q ? <Button variant="ghost" size="icon-sm" className="absolute top-1/2 right-1.5 -translate-y-1/2" onClick={() => setQ("")} aria-label="Clear search"><X /></Button> : null}
        </div>
      </div>
      <p role="status" className="text-xs text-muted-foreground">{fmt(shown)} {shown === 1 ? "item" : "items"} shown{d.inv ? <> · {fmt(d.inv)} resource types counted in <a href="#tenno" onClick={(e) => { e.preventDefault(); tf().tennoSet({ tab: "inventory" }); location.hash = "tenno" }} className="underline decoration-primary/50 underline-offset-4">Profile → Inventory</a></> : null}</p>
      {d.cats.map((c) => (
        <Collapsible key={c.id} defaultOpen={c.items.length > 0 && c.items.length <= 40}>
          <Card className="gap-0 py-0">
            <CollapsibleTrigger className="group flex w-full cursor-pointer flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3 text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
              <span className="font-heading text-lg leading-tight font-semibold">{c.label}</span>
              <span className="text-xs text-muted-foreground tabular-nums">{c.owned} owned · {c.mastered}/{c.total} mastered</span>
              <span className="ml-auto text-xs text-muted-foreground tabular-nums">{c.items.length} shown</span>
              <ChevronDown aria-hidden className="size-4 text-muted-foreground transition-transform group-data-[panel-open]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              {c.items.length ? (
                <ul className="grid grid-cols-2 gap-x-2 border-t px-2 py-2 sm:grid-cols-3 lg:grid-cols-4">
                  {c.items.map((x) => (
                    <li key={x.n}>
                      <button type="button" onClick={() => tf().showInRanks(x.n)} className="flex h-full w-full items-center gap-2.5 rounded-md p-2 text-left outline-none hover:bg-muted/60 focus-visible:ring-3 focus-visible:ring-ring/50"
                        aria-label={`${x.n}: ${x.has ? "owned" : "not owned"}, ${x.done ? "mastered" : `rank ${x.r} of ${x.mx}`}. Open in Ranks`}>
                        <Thumb src={x.img} className="size-10 shrink-0" />
                        <span className="flex min-w-0 flex-1 flex-col">
                          <span className="text-sm leading-tight font-medium break-words">{x.n}</span>
                          <span className="text-xs text-muted-foreground">{x.has ? "Owned" : "Not owned"} · {x.done ? "Mastered" : `Rank ${x.r}/${x.mx}`}</span>
                        </span>
                        {x.done ? <Check aria-hidden className="size-4 shrink-0 text-primary" /> : null}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : <p className="border-t px-4 py-3 text-sm text-muted-foreground">Nothing here yet.</p>}
            </CollapsibleContent>
          </Card>
        </Collapsible>
      ))}
    </div>
  )
}
