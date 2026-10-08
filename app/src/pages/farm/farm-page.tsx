import { useEffect, useState } from "react"
import { Check, Coins, Crosshair, Gem, Hexagon, Search, X, type LucideIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Toggle } from "@/components/ui/toggle"
import { Island } from "@/components/tf/island"
import { WayView } from "./way-detail"
import { Thumb } from "@/components/tf/thumb"
import { cn } from "@/lib/utils"
import { fmt, tf, useNarrow, useTFData, type FarmItem } from "@/lib/tf"
import { useNavReset } from "@/lib/nav-reset"

function Hit({ x, selected }: { x: FarmItem; selected: boolean }) {
  return (
    <li>
      <button
        type="button"
        onClick={() => tf().farmPick(x.key)}
        aria-current={selected ? "true" : undefined}
        className={cn(
          "flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors outline-none hover:bg-muted/60 focus-visible:ring-3 focus-visible:ring-ring/50",
          selected && "bg-primary/10 ring-1 ring-primary/40 hover:bg-primary/15"
        )}
      >
        {x.img ? <Thumb src={x.img} className="size-8" /> : <span aria-hidden className="grid size-8 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground"><Crosshair className="size-4" /></span>}
        <span className="min-w-0 flex-1 truncate font-medium">{x.n}</span>
        <span className="flex shrink-0 items-center gap-1.5">
          {x.xp ? (
            x.left > 0 ? (
              <Badge variant="outline" className="border-primary/40 text-primary">+{fmt(x.left)} MR XP</Badge>
            ) : (
              <Badge variant="outline" className="text-muted-foreground"><Check /> Mastered</Badge>
            )
          ) : null}
          <span className="hidden text-xs text-muted-foreground sm:inline">{x.label}</span>
        </span>
      </button>
    </li>
  )
}

function EmptyDetail() {
  return (
    <Card className="items-start gap-2 p-6 text-sm text-muted-foreground">
      <Crosshair aria-hidden className="size-6 text-primary" />
      <b className="font-heading text-base font-semibold text-foreground">Pick something to farm</b>
      <p>
        Choose any result to see exactly where it drops: relics and whether they're vaulted, missions and enemies, vendors, blueprints and every part
        you still need. Tick parts off as you get them.
      </p>
    </Card>
  )
}

/* the things players farm most, one tap away; the game's own icon where there is one */
const CDN = "https://cdn.warframestat.us/img/"
const QUICK: { key: string; label: string; img?: string; icon?: LucideIcon }[] = [
  { key: "res|Orokin Cell", label: "Orokin Cell", img: CDN + "ComponentCell.png" },
  { key: "res|Argon Crystal", label: "Argon Crystal", img: CDN + "ArgonCrystal.png" },
  { key: "res|Neural Sensors", label: "Neural Sensors", img: CDN + "NeuralSensor.png" },
  { key: "way|Kuva", label: "Kuva", img: CDN + "Kuva.png" },
  { key: "way|Endo", label: "Endo", icon: Hexagon },
  { key: "way|Credits", label: "Credits", icon: Coins },
  { key: "way|Platinum", label: "Platinum", icon: Gem },
]

function QuickPicks({ sel }: { sel: string }) {
  return (
    <nav aria-label="Most farmed" className="flex flex-col gap-1.5">
      <span className="text-xs text-muted-foreground">Most farmed</span>
      <ul className="scroll-fade -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:overflow-visible md:px-0">
        {QUICK.map((q) => (
          <li key={q.key} className="shrink-0">
            <button
              type="button"
              onClick={() => tf().farmPick(q.key)}
              aria-current={sel === q.key ? "true" : undefined}
              className={cn(
                "flex h-10 items-center gap-2 rounded-lg border bg-card pr-3 pl-1.5 text-sm font-medium transition-colors outline-none hover:bg-muted/60 focus-visible:ring-3 focus-visible:ring-ring/50",
                sel === q.key && "border-primary/50 bg-muted"
              )}
            >
              {q.img ? <Thumb src={q.img} className="size-7" /> : q.icon ? <q.icon aria-hidden className="mx-1 size-5 text-muted-foreground" /> : null}
              {q.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export function FarmPage() {
  const d = useTFData(() => tf().farm())
  const narrow = useNarrow()
  const [q, setQ] = useState(d.q)
  const [sheet, setSheet] = useState(false)
  useNavReset(() => setSheet(false))
  useEffect(() => {
    const t = window.setTimeout(() => {
      if (q !== d.q) tf().farmSet({ q })
    }, 160)
    return () => window.clearTimeout(t)
  }, [q, d.q])
  // a pick on a phone opens the detail over the list
  const [lastSel, setLastSel] = useState(d.sel)
  if (d.sel !== lastSel) {
    setLastSel(d.sel)
    if (d.sel && narrow) setSheet(true)
  }
  const typeLabel = (d.types.find((t) => t.value === d.ty) || { label: "results" }).label.toLowerCase()
  const catItems = [{ value: "", label: `All ${typeLabel}` }, ...d.cats.map((c) => ({ value: c.value, label: `${c.label} (${c.n})` }))]
  const what = d.ty === "all" ? "results" : typeLabel
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-5 md:px-6 md:py-6">
      <header className="flex flex-col gap-1">
        <h1 className="font-heading text-3xl font-semibold">Farm finder</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">Search any item, part, mod, relic, arcane or resource to see where it drops. Or pick a type to browse everything.</p>
      </header>
      <QuickPicks sel={d.sel || ""} />
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        <div className="flex min-w-0 flex-col gap-3">
          <div className="relative">
            <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search, or pick a type to browse everything"
              aria-label="Search"
              enterKeyHint="search"
              autoComplete="off"
              className="h-10 pr-9 pl-9"
            />
            {q ? (
              <Button variant="ghost" size="icon-sm" className="absolute top-1/2 right-1.5 -translate-y-1/2" onClick={() => setQ("")} aria-label="Clear search">
                <X />
              </Button>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2">
            <Select items={d.types} value={d.ty} onValueChange={(v) => tf().farmSet({ ty: String(v) })}>
              <SelectTrigger className="h-10 min-w-36 flex-1 sm:flex-none" aria-label="Result type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {d.types.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {d.cats.length ? (
              <Select items={catItems} value={d.cat} onValueChange={(v) => tf().farmSet({ cat: String(v ?? "") })}>
                <SelectTrigger className="h-10 min-w-40 flex-1 sm:flex-none" aria-label="Category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {catItems.map((o) => (
                    <SelectItem key={o.value || "all"} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : null}
            <Toggle
              variant="outline"
              pressed={d.unv}
              onPressedChange={(v) => tf().farmSet({ unv: v })}
              className="h-10 px-3 data-[pressed]:border-primary/60 data-[pressed]:bg-primary/15"
            >
              Farmable now only
            </Toggle>
          </div>
          <Card size="sm" className="gap-1 py-2">
            <p role="status" className="flex flex-wrap items-center gap-x-2 px-3 py-1 text-xs text-muted-foreground">
              {d.count === d.total ? `${fmt(d.total)} ${what}` : `Showing ${fmt(d.count)} of ${fmt(d.total)} ${what}`}
              {d.filtered ? (
                <button
                  type="button"
                  className="underline decoration-primary/50 underline-offset-4 hover:text-foreground"
                  onClick={() => {
                    setQ("")
                    tf().farmClear()
                  }}
                >
                  Clear filters
                </button>
              ) : null}
            </p>
            {d.items.length ? (
              <ul className="flex flex-col gap-0.5 px-1.5">
                {d.items.map((x) => (
                  <Hit key={x.key} x={x} selected={x.key === d.sel} />
                ))}
              </ul>
            ) : (
              <p className="px-3 py-6 text-sm text-muted-foreground">No matches. Try fewer letters, or a different type.</p>
            )}
            {d.more ? (
              <div className="px-3 pt-1 pb-2">
                <Button variant="outline" className="h-9 w-full" onClick={() => tf().farmMore()}>
                  Show {fmt(Math.min(60, d.more))} more
                </Button>
              </div>
            ) : null}
          </Card>
        </div>
        {narrow ? null : (
          <div className="min-w-0">
            <div className="lg:sticky lg:top-16">{d.way ? <WayView w={d.way} /> : d.sel && d.detail ? <Island html={d.detail} /> : <EmptyDetail />}</div>
          </div>
        )}
      </div>
      {narrow ? (
        <Sheet open={sheet && !!d.detail} onOpenChange={setSheet}>
          <SheetContent side="bottom" className="max-h-[calc(88dvh-4rem)] gap-0 rounded-t-2xl p-0">
            <SheetHeader className="shrink-0 border-b px-4 py-3">
              <SheetTitle className="pr-8 font-heading text-lg">{d.selName}</SheetTitle>
              <SheetDescription className="sr-only">Where to farm {d.selName}</SheetDescription>
            </SheetHeader>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3">{d.way ? <WayView w={d.way} inSheet /> : d.detail ? <Island html={d.detail} /> : null}</div>
          </SheetContent>
        </Sheet>
      ) : null}
    </div>
  )
}
