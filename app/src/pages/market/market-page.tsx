import { useEffect, useState } from "react"
import { Check, ChevronDown, ExternalLink, MessageSquare, Search, X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { HaloSegmented } from "@/components/ui/halo-segmented"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GoLink } from "@/components/tf/go-link"
import { Thumb } from "@/components/tf/thumb"
import { cn } from "@/lib/utils"
import { fmt, tf, useTFData, type MarketData, type VaultCard } from "@/lib/tf"

const SORTS = [{ value: "a7", label: "7-day price" }, { value: "low", label: "Cheapest seller" }, { value: "v7", label: "Trades" }, { value: "ps", label: "Parts total" }, { value: "du", label: "Ducats" }, { value: "n", label: "Name" }]
const FILTERS = [{ value: "all", label: "All sets" }, { value: "farm", label: "Farmable now" }, { value: "now", label: "In Prime Resurgence" }, { value: "vault", label: "Vaulted" }, { value: "goals", label: "In my goals" }]
const VAULT_CLS = { vaulted: "border-red-500/40 text-red-700 dark:text-red-300", now: "border-emerald-500/40 text-emerald-700 dark:text-emerald-400", farmable: "text-muted-foreground" }

function Sets({ d }: { d: MarketData }) {
  const [q, setQ] = useState(d.q || "")
  useEffect(() => {
    const t = window.setTimeout(() => q !== d.q && tf().marketSet({ q }), 160)
    return () => window.clearTimeout(t)
  }, [q, d.q])
  return (
    <>
      <p className="text-xs text-muted-foreground">7-day average price. Whisper copies a message to the cheapest seller in the daily snapshot; they may be offline.</p>
      <div className="flex flex-wrap gap-2">
        <div className="relative min-w-48 flex-1">
          <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter sets" aria-label="Filter sets by name" className="h-10 pr-9 pl-9" />
          {q ? <Button variant="ghost" size="icon-sm" className="absolute top-1/2 right-1.5 -translate-y-1/2" onClick={() => setQ("")} aria-label="Clear search"><X /></Button> : null}
        </div>
        <Select items={SORTS} value={d.sort} onValueChange={(v) => tf().marketSet({ sort: String(v) })}>
          <SelectTrigger className="h-10 min-w-44" aria-label="Sort by"><span className="text-muted-foreground">Sort:</span><SelectValue /></SelectTrigger>
          <SelectContent>{SORTS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
        </Select>
        <Select items={FILTERS} value={d.filter} onValueChange={(v) => tf().marketSet({ f: String(v) })}>
          <SelectTrigger className="h-10 min-w-44" aria-label="Show sets"><SelectValue /></SelectTrigger>
          <SelectContent>{FILTERS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <p role="status" className="text-xs text-muted-foreground">
        {d.count === d.total ? `${fmt(d.total!)} sets` : `Showing ${fmt(d.count!)} of ${fmt(d.total!)} sets`}
        {d.count !== d.total ? <> · <button type="button" className="underline decoration-primary/50 underline-offset-4 hover:text-foreground" onClick={() => { setQ(""); tf().marketSet({ q: "", f: "all" }) }}>Clear filters</button></> : null}
      </p>
      <Card className="gap-0 py-0">
        <ul className="flex flex-col divide-y">
          {d.sets!.map((x) => (
            <li key={x.n} className="flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3">
              <Thumb src={x.img} className="size-10" />
              <span className="flex min-w-0 flex-1 basis-48 flex-col gap-1">
                <span className="flex flex-wrap items-center gap-1.5">
                  <GoLink k={"item|" + x.base} className="font-medium">{x.base}</GoLink>
                  {x.vault ? <Badge variant="outline" className={VAULT_CLS[x.vault.kind]}>{x.vault.text}</Badge> : null}
                  {x.xp ? (x.left > 0 ? <Badge variant="outline" className="border-primary/40 text-primary">+{fmt(x.left)} MR XP</Badge> : <Badge variant="outline" className="text-muted-foreground"><Check /> Mastered</Badge>) : null}
                </span>
                {x.meta ? <span className="text-xs text-muted-foreground">{x.meta}</span> : null}
              </span>
              <span className="flex items-center gap-2">
                <b className="w-14 text-right font-heading text-lg font-semibold tabular-nums">{x.price != null ? `${x.price}p` : "—"}</b>
                {x.seller ? (
                  <Button variant="outline" size="sm" className="h-8" onClick={() => tf().whisper(x.seller!.wh)} aria-label={`Copy a whisper to ${x.seller.name}, selling at ${x.seller.price} platinum`}>
                    <MessageSquare /> {x.seller.price}p
                  </Button>
                ) : null}
                <a href={x.url} target="_blank" rel="noopener" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "h-8")} aria-label={`${x.base} listings on warframe.market (opens in a new tab)`}>
                  <ExternalLink /> Listings
                </a>
              </span>
            </li>
          ))}
        </ul>
        {d.more ? <div className="border-t px-4 py-3"><Button variant="outline" className="h-9 w-full" onClick={() => tf().marketMore()}>Show {fmt(Math.min(60, d.more))} more</Button></div> : null}
      </Card>
    </>
  )
}

function Group({ title, cards, open, tone }: { title: string; cards: VaultCard[]; open: boolean; tone: string }) {
  return (
    <Card className="gap-0 py-0">
      <Collapsible defaultOpen={open}>
        <CollapsibleTrigger className="group flex w-full cursor-pointer items-center gap-2 px-4 py-3 text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
          <h2 className="font-heading text-base leading-tight font-semibold">{title}</h2>
          <Badge variant="outline" className={cn("tabular-nums", tone)}>{cards.length}</Badge>
          <ChevronDown aria-hidden className="ml-auto size-4 text-muted-foreground transition-transform group-data-[panel-open]:rotate-180" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          {cards.length ? (
            <ul className="grid gap-2 border-t p-3 sm:grid-cols-2 lg:grid-cols-3">
              {cards.map((c) => (
                <li key={c.n} className="flex gap-3 rounded-lg border bg-background/40 p-3">
                  <Thumb src={c.img} className="size-10" />
                  <span className="flex min-w-0 flex-col gap-0.5">
                    <span className="flex flex-wrap items-center gap-1.5"><GoLink k={"item|" + c.n} className="font-medium">{c.n}</GoLink><span className="text-xs text-muted-foreground">{c.c}</span></span>
                    <span className="text-xs text-muted-foreground">{c.text}</span>
                  </span>
                </li>
              ))}
            </ul>
          ) : <p className="border-t px-4 py-4 text-sm text-muted-foreground">Nothing right now.</p>}
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}

export function MarketPage() {
  const d = useTFData(() => tf().market())
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-5 md:px-6 md:py-6">
      <header className="flex flex-col gap-1">
        <span className="text-xs text-muted-foreground">warframe.market · snapshot {d.snapshot}</span>
        <h1 className="font-heading text-3xl font-semibold">Market</h1>
      </header>
      <HaloSegmented className="self-start" value={d.tab} onValueChange={(v) => tf().marketSet({ tab: v })} items={[{ value: "sets", label: "Prime sets" }, { value: "vault", label: "Vault tracker" }]} />
      {d.tab === "vault" ? (
        <>
          <p className="text-xs text-muted-foreground">Prime Resurgence brings back two vaulted Warframes with their weapons every 4 weeks. Return dates are rough estimates from each pair's past appearances (typical gap about {d.gapMonths} months). Digital Extremes doesn't publish a schedule.</p>
          <Group title="Unvaulted now: Prime Resurgence" cards={d.now!} open tone="border-emerald-500/40 text-emerald-700 dark:text-emerald-400" />
          <Group title="Farmable from relics" cards={d.farm!} open tone="text-muted-foreground" />
          <Group title="Vaulted · soonest return first" cards={d.vault!} open={false} tone="border-red-500/40 text-red-700 dark:text-red-300" />
        </>
      ) : <Sets d={d} />}
    </div>
  )
}
