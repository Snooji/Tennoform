import { useState, type ReactNode } from "react"
import { ChevronRight, Copy, ExternalLink, Tag } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { StatList } from "@/components/tf/stat-list"
import { cn } from "@/lib/utils"
import { fmt, tf, useTFData, type ModSlot } from "@/lib/tf"

/** The list that holds a build's mods: one row each, divided by hairlines. */
export function ModList({ children, className }: { children: ReactNode; className?: string }) {
  return <ul className={cn("flex flex-col divide-y border-y", className)}>{children}</ul>
}

/** A mod or arcane in a build: tick when you own it, see what it does; tap it for the full details. */
export function ModCard({ m }: { m: ModSlot }) {
  const [open, setOpen] = useState(false)
  return (
    <li className="flex gap-3 py-2.5">
      <Checkbox className="mt-0.5 size-5 rounded-md" checked={m.done} onCheckedChange={(v) => tf().nodeTick(m.key, !!v)} aria-label={(m.done ? "Don't have: " : "Have: ") + m.m} />
      <button type="button" onClick={() => setOpen(true)} className="group flex min-w-0 flex-1 items-start gap-2 rounded-md text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50" aria-label={`${m.m}: details, how to get it and prices`}>
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="flex flex-wrap items-baseline gap-x-2">
            <b className={cn("font-medium group-hover:underline group-hover:underline-offset-4", m.done && "text-muted-foreground line-through decoration-primary/70")}>{m.m}</b>
            <span className="text-xs text-muted-foreground">{m.slot}{m.pol ? ` · ${m.pol}` : ""}</span>
            {m.price ? <span className="text-xs text-muted-foreground tabular-nums">{m.price}</span> : null}
          </span>
          {m.fx ? <span className="text-sm">{m.fx}</span> : null}
          {!m.done ? <span className="text-xs text-muted-foreground">{m.src}</span> : null}
        </span>
        <ChevronRight aria-hidden className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
      </button>
      {open ? <ModDialog name={m.m} onClose={() => setOpen(false)} /> : null}
    </li>
  )
}

/** Everything about one mod or arcane: what it does, how to get it, and what it costs on warframe.market. */
export function ModDialog({ name, onClose }: { name: string; onClose: () => void }) {
  const d = useTFData(() => tf().modInfo(name))
  if (!d) return null
  const facts = [
    d.rarity ? { k: "Rarity", v: d.rarity } : null,
    d.polarity ? { k: "Polarity", v: d.polarity } : null,
    d.rank != null ? { k: "Max rank", v: d.rank } : null,
    d.drain != null ? { k: d.drain < 0 ? "Adds capacity" : "Capacity cost at max rank", v: Math.abs(d.drain) } : null,
    d.fits ? { k: "Fits", v: d.fits } : null,
  ].filter(Boolean) as { k: string; v: string | number }[]
  return (
    <Dialog open onOpenChange={(o) => { if (!o) onClose() }}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{d.n}</DialogTitle>
          <DialogDescription>{d.type}{d.augment && !d.arc ? " · Augment" : ""}</DialogDescription>
        </DialogHeader>
        <label className="flex min-h-9 cursor-pointer items-center gap-2.5 text-sm">
          <Checkbox className="size-5 rounded-md" checked={d.owned} onCheckedChange={(v) => tf().nodeTick(d.key, !!v)} /> I have this
        </label>

        <section className="flex flex-col gap-1.5">
          <h3 className="font-heading text-base font-semibold">What it does{d.rank ? ` at rank ${d.rank}` : ""}</h3>
          {d.loading ? <p className="text-sm text-muted-foreground">Loading…</p> : d.fx.length ? (
            <ul className="flex flex-col gap-1 text-sm">{d.fx.map((l) => <li key={l} className="whitespace-pre-line">{l}</li>)}</ul>
          ) : <p className="text-sm text-muted-foreground">No effect text for this one in the game data.</p>}
          {d.fx0.length ? <p className="text-xs text-muted-foreground">At rank 0: {d.fx0.join(" · ").replace(/\n/g, " ")}</p> : null}
        </section>

        {facts.length ? <StatList cols={2} items={facts} /> : null}

        <section className="flex flex-col gap-1.5">
          <h3 className="font-heading text-base font-semibold">How to get it</h3>
          {d.drops.length ? (
            <ul className="flex flex-col divide-y border-y text-sm">
              {d.drops.map((x) => (
                <li key={x.where} className="flex items-baseline justify-between gap-3 py-1.5">
                  <span className="min-w-0">{x.where}</span>
                  <span className="shrink-0 text-muted-foreground tabular-nums">{x.chance}%</span>
                </li>
              ))}
            </ul>
          ) : null}
          {d.moreDrops ? <p className="text-xs text-muted-foreground">And {d.moreDrops} more places with lower chances.</p> : null}
          {d.src ? <p className="text-sm">{d.src}</p> : null}
          {!d.drops.length && !d.src ? <p className="text-sm text-muted-foreground">{d.tradable ? "Not a regular drop. Players trade it on warframe.market." : "No drop locations in the game data."}</p> : null}
        </section>

        {d.tradable ? (
          <section className="flex flex-col gap-1.5">
            <h3 className="font-heading text-base font-semibold">warframe.market</h3>
            <StatList cols={2} items={[
              { k: "7-day average", v: d.a7 != null ? `${Math.round(d.a7)}p` : "—" },
              { k: "30-day average", v: d.a30 != null ? `${Math.round(d.a30)}p` : "—" },
              ...(d.v7 != null ? [{ k: "Sold last week", v: fmt(d.v7) }] : []),
            ]} />
            {d.sellers.length ? (
              <ul className="flex flex-col divide-y border-y text-sm" aria-label="Cheapest sellers">
                {d.sellers.map((s) => (
                  <li key={s.name} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2">
                    <span className="min-w-0 flex-1">
                      <b className="font-medium">{s.name}</b>
                      <span className="text-muted-foreground"> · {s.price}p{s.rank != null ? ` · ${s.rank ? "rank " + s.rank : "unranked"}` : ""}{s.qty > 1 ? ` · ×${s.qty}` : ""}{s.status ? ` · ${s.status}` : ""}</span>
                    </span>
                    <Button variant="outline" size="sm" className="h-8" onClick={() => tf().copy(s.whisper, "Whisper copied. Paste it in game chat.")}><Copy /> Copy whisper</Button>
                  </li>
                ))}
              </ul>
            ) : null}
            <p className="text-xs text-muted-foreground">Prices from warframe.market's snapshot of {d.date}.</p>
            <div className="flex flex-wrap gap-2">
              <a href={d.wfm} target="_blank" rel="noopener" className={cn(buttonVariants({ variant: "outline" }), "h-9")}>
                Open on warframe.market <ExternalLink /><span className="sr-only">(opens in a new tab)</span>
              </a>
              <Button variant="ghost" className="h-9" onClick={() => { onClose(); tf().sellOpen(d.n) }}><Tag /> Sell yours</Button>
            </div>
          </section>
        ) : <Badge variant="outline" className="text-muted-foreground">Not tradable</Badge>}
      </DialogContent>
    </Dialog>
  )
}
