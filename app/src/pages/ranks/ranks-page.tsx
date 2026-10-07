import { memo, useEffect, useRef, useState, type KeyboardEvent } from "react"
import { Check, ChevronsUp, CircleSlash, ExternalLink, Hexagon, Info, Minus, PackageCheck, Plus, RotateCcw, Search, X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { cn } from "@/lib/utils"
import { fmt, tf, useTF, useTFData, type RankItem, type RanksExtra } from "@/lib/tf"
import { useNavReset } from "@/lib/nav-reset"
import { MasteryRing } from "@/pages/home/mastery-hero"
import { Thumb } from "@/components/tf/thumb"
import { Island } from "@/components/tf/island"
import { SortDir } from "@/components/tf/sort-dir"

const FILTERS = [
  { value: "all", label: "All" },
  { value: "notmax", label: "Not mastered" },
  { value: "todo", label: "Not started" },
  { value: "prog", label: "In progress" },
  { value: "max", label: "Mastered" },
  { value: "own", label: "Owned" },
  { value: "nown", label: "Not owned" },
]
const TYPES = [
  { value: "all", label: "Prime and normal" },
  { value: "prime", label: "Prime only" },
  { value: "normal", label: "Normal only" },
  { value: "relics", label: "Your relics drop parts" },
]
const SORTS = [
  { value: "name", label: "Name" },
  { value: "mr", label: "MR needed" },
  { value: "close", label: "Closest to mastered" },
  { value: "left", label: "Most XP left" },
]

function MasteryStrip() {
  const s = useTF()
  return (
    <Card size="sm" className="flex-row items-center gap-4 px-4">
      <MasteryRing pct={s.pct} label={s.mrLabel.replace(/^(MR|Legendary) /, (m) => (m.startsWith("L") ? "L" : ""))} size={64} />
      <div className="flex min-w-0 flex-col">
        <b className="font-heading text-lg leading-tight font-semibold">{s.mrLabel}</b>
        <span className="text-sm text-muted-foreground tabular-nums">
          {fmt(s.xp)} XP · {fmt(s.toNext)} to {s.nextLabel}
        </span>
      </div>
    </Card>
  )
}

function HowToGet({ n }: { n: string }) {
  const h = tf().howToGet(n)
  return (
    <div className="flex flex-col gap-1.5 rounded-xl bg-muted/40 px-3 py-2.5 text-sm">
      <p>{h.text}</p>
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {h.craft ? (
          <a href="#" className="text-primary underline underline-offset-4" onClick={(e) => { e.preventDefault(); tf().act("a", { href: "#", "data-go": "item|" + n }) }}>
            Where the parts drop
          </a>
        ) : null}
        <a href={h.wiki} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-primary underline underline-offset-4">
          Wiki <ExternalLink className="size-3.5" aria-hidden /><span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>
    </div>
  )
}

/** Rank entry: type a number, or use − / + / Max. Enter saves and moves to the next item. */
const RankRow = memo(function RankRow({ it }: { it: RankItem }) {
  const [v, setV] = useState(String(it.r))
  const [how, setHow] = useState(false)
  useEffect(() => setV(String(it.r)), [it.r])
  const done = it.r >= it.mx
  const commit = () => {
    const n = Math.round(Number(v))
    if (v.trim() === "" || !Number.isFinite(n)) return setV(String(it.r))
    if (n !== it.r) tf().setRank(it.n, n)
  }
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return
    e.preventDefault()
    commit()
    const all = Array.from(document.querySelectorAll<HTMLInputElement>("[data-rank-input]"))
    const next = all[all.indexOf(e.currentTarget) + 1]
    if (next) {
      next.focus()
      next.select()
    }
  }
  return (
    <li className={cn("grid grid-cols-[2.5rem_minmax(0,1fr)] items-center gap-x-3 gap-y-2 px-4 py-3 sm:grid-cols-[2.5rem_minmax(0,1fr)_auto]", done && "bg-primary/[0.04]")}>
      <Thumb src={it.img} className="size-10" />
      <div className="flex min-w-0 flex-col gap-1.5">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              if (!tf().howToGet(it.n).craft) return setHow(true)
              tf().act("a", { href: "#", "data-go": "item|" + it.n })
            }}
            className="truncate font-medium underline decoration-primary/40 underline-offset-4 hover:decoration-primary"
          >
            {it.n}
          </a>
          {it.mr ? <Badge variant="outline">MR {it.mr}</Badge> : null}
          {done ? (
            <Badge variant="outline" className="border-primary/40 text-primary">
              <Check /> Mastered
            </Badge>
          ) : null}
          {!done && it.owned ? <Badge variant="outline" className="text-muted-foreground">Owned</Badge> : null}
          {it.notOwned ? <Badge variant="outline" className="text-muted-foreground"><CircleSlash /> Not owned</Badge> : null}
          {it.vaulted ? <Badge variant="outline" className="border-red-500/40 text-red-700 dark:text-red-300">Vaulted</Badge> : null}
          {it.resurgence ? <Badge variant="outline" className="border-emerald-500/40 text-emerald-700 dark:text-emerald-400">Resurgence</Badge> : null}
          {it.relics ? <Badge variant="outline" className="border-primary/40 text-primary"><Hexagon /> Your relics drop parts</Badge> : null}
        </div>
        <div className="flex items-center gap-3">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted" aria-hidden>
            <div className="h-full rounded-full bg-primary transition-[width] duration-300" style={{ width: `${(it.r / it.mx) * 100}%` }} />
          </div>
          <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
            {fmt(it.xp)} / {fmt(it.max)} XP
          </span>
        </div>
        <div className="-ml-2 flex flex-wrap items-center gap-x-1">
          {!it.has ? (
            <Button variant="ghost" size="sm" className="h-8 px-2 text-xs text-muted-foreground" aria-expanded={how} onClick={() => setHow(!how)}>
              <Info /> How to get it
            </Button>
          ) : null}
          {it.r > 0 ? (
            <Button variant="ghost" size="sm" className="h-8 px-2 text-xs text-muted-foreground" onClick={() => tf().clearRank(it.n)}
              aria-label={done ? `Mark ${it.n} as not mastered` : `Clear the rank of ${it.n}`}>
              <RotateCcw /> {done ? "Not mastered" : "Clear rank"}
            </Button>
          ) : null}
          <Button variant="ghost" size="sm" className="h-8 px-2 text-xs text-muted-foreground" onClick={() => tf().setOwned(it.n, !it.has)}
            aria-label={it.has ? `I don't own ${it.n}` : `I own ${it.n}`}>
            {it.has ? <><CircleSlash /> Don't own it</> : <><PackageCheck /> I own it</>}
          </Button>
        </div>
        {how ? <HowToGet n={it.n} /> : null}
      </div>
      <div className="col-span-2 flex items-center gap-1 justify-self-end sm:col-span-1">
        <Button variant="outline" size="icon-lg" className="size-10 md:size-9" disabled={it.r <= 0} onClick={() => tf().setRank(it.n, it.r - 1)} aria-label={`Lower rank of ${it.n}`}>
          <Minus />
        </Button>
        <Input
          data-rank-input
          type="number"
          inputMode="numeric"
          min={0}
          max={it.mx}
          value={v}
          onChange={(e) => setV(e.target.value)}
          onBlur={commit}
          onKeyDown={onKey}
          onFocus={(e) => e.currentTarget.select()}
          aria-label={`Rank of ${it.n}, 0 to ${it.mx}`}
          className="h-10 w-14 text-center font-medium tabular-nums md:h-9 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
        />
        <Button variant="outline" size="icon-lg" className="size-10 md:size-9" disabled={done} onClick={() => tf().setRank(it.n, it.r + 1)} aria-label={`Raise rank of ${it.n}`}>
          <Plus />
        </Button>
        <Button variant={done ? "ghost" : "outline"} className="h-10 px-3 md:h-9" disabled={done} onClick={() => tf().setRank(it.n, 99)} aria-label={`Set ${it.n} to max rank`}>
          Max
        </Button>
      </div>
    </li>
  )
})

/** Quick check: a grid of names to tap, like the in-game inventory. Tapping only changes ownership, never mastery. */
function OwnGrid({ items, owned, total, signedIn }: { items: RankItem[]; owned: number; total: number; signedIn: boolean }) {
  const [last, setLast] = useState("")
  const where = signedIn ? "on this device and to your account" : "on this device"
  return (
    <>
    <p role="status" aria-live="polite" className="flex flex-wrap items-center gap-x-2 border-b px-4 py-2.5 text-sm">
      <Check aria-hidden className="size-4 text-emerald-600 dark:text-emerald-400" />
      <b className="font-medium">{last ? `Saved: ${last}.` : "Every tap saves straight away."}</b>
      <span className="text-muted-foreground">You own {owned} of {total} here · saved {where}</span>
    </p>
    <ul className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-3 lg:grid-cols-4" aria-label="Tap what you own">
      {items.map((it) => {
        const done = it.r >= it.mx
        return (
          <li key={it.n}>
            <button
              type="button"
              aria-pressed={it.has}
              onClick={() => { tf().setOwned(it.n, !it.has, true); setLast(`${it.n} ${it.has ? "not owned" : "owned"}`) }}
              className={cn(
                "flex h-full w-full items-center gap-2.5 rounded-xl border p-2 text-left transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                it.has ? "border-primary/50 bg-primary/10" : "border-border opacity-70 hover:opacity-100",
              )}
            >
              <Thumb src={it.img} className="size-10 shrink-0" />
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="text-sm leading-tight font-medium break-words">{it.n}</span>
                <span className="text-xs text-muted-foreground">{it.has ? "Owned" : "Not owned"}{done ? " · Mastered" : ""}</span>
              </span>
              {it.has ? <Check aria-hidden className="size-4 shrink-0 text-primary" /> : null}
            </button>
          </li>
        )
      })}
    </ul>
    </>
  )
}

export function RanksPage() {
  const fresh = useRef(true)
  const d = useTFData(() => {
    const r = tf().ranks(fresh.current)
    fresh.current = false
    return r
  })
  const [q, setQ] = useState(d.q)
  const [confirm, setConfirm] = useState(false)
  const [view, setViewS] = useState<"list" | "own">(() => { try { return localStorage.getItem("tf-rkview") === "own" ? "own" : "list" } catch { return "list" } })
  const setView = (v: "list" | "own") => { setViewS(v); try { localStorage.setItem("tf-rkview", v) } catch { /* private mode */ } }
  useNavReset(() => setConfirm(false))
  useEffect(() => {
    const t = window.setTimeout(() => {
      if (q !== d.q) tf().ranksSet({ q })
    }, 180)
    return () => window.clearTimeout(t)
  }, [q, d.q])
  const searching = !!d.q.trim()
  const left = d.items.length ? d.notMax : 0
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-5 md:px-6 md:py-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="flex max-w-2xl flex-col gap-1">
          <h1 className="font-heading text-3xl font-semibold">Ranks</h1>
          <p className="text-sm text-muted-foreground">
            Set the rank of everything you've levelled. Mastered gear counts in full and partial ranks count too. Frames and companions earn
            200 XP a rank, weapons 100; Kuva, Tenet, Coda, Paracesis and Necramechs go to rank 40.
          </p>
        </div>
        <MasteryStrip />
      </header>

      <ToggleGroup
        aria-label="Gear categories"
        value={searching ? [] : [d.cat]}
        onValueChange={(v: string[]) => {
          if (v[0]) {
            setQ("")
            tf().ranksSet({ cat: v[0] })
          }
        }}
        spacing={1}
        className="scroll-fade -mx-4 w-auto flex-nowrap overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:overflow-visible md:px-0"
      >
        {d.cats.map((c) => (
          <ToggleGroupItem
            key={c.id}
            value={c.id}
            variant="outline"
            className="h-9 gap-1.5 rounded-full px-3 data-[pressed]:border-primary/60 data-[pressed]:bg-primary/15 data-[pressed]:text-foreground"
          >
            {c.label}
            {c.t ? (
              <span className="text-xs text-muted-foreground tabular-nums">
                {c.m}/{c.t}
              </span>
            ) : null}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      <div className="flex flex-wrap gap-2">
        <div className="relative min-w-52 flex-1">
          <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search gear or parts"
            aria-label="Search gear"
            className="h-10 pr-9 pl-9"
          />
          {q ? (
            <Button variant="ghost" size="icon-sm" className="absolute top-1/2 right-1.5 -translate-y-1/2" onClick={() => setQ("")} aria-label="Clear search">
              <X />
            </Button>
          ) : null}
        </div>
        <div className="grid flex-1 basis-full grid-cols-2 gap-2 sm:flex sm:flex-none sm:basis-auto">
        <Select items={FILTERS} value={d.f} onValueChange={(v) => tf().ranksSet({ f: String(v) })}>
          <SelectTrigger className="h-10 w-full sm:w-auto sm:min-w-40" aria-label="Filter">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FILTERS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select items={TYPES} value={d.t} onValueChange={(v) => tf().ranksSet({ t: String(v) })}>
          <SelectTrigger className="h-10 w-full sm:w-auto sm:min-w-44" aria-label="Prime or normal">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TYPES.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select items={SORTS} value={d.s} onValueChange={(v) => tf().ranksSet({ s: String(v) })}>
          <SelectTrigger className="h-10 w-full sm:w-auto sm:min-w-48" aria-label="Sort">
            <span className="hidden text-muted-foreground sm:inline">Sort:</span>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORTS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <SortDir k="rkS" className="size-10" />
        </div>
      </div>

      <Card className="gap-0 py-0">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b px-4 py-3">
          <div className="flex flex-col">
            <h2 className="font-heading text-lg leading-tight font-semibold">{d.head.label}</h2>
            <span className="text-xs text-muted-foreground tabular-nums">
              {d.island
                ? `${fmt(d.head.x)} XP`
                : searching
                  ? `${fmt(d.total)} items`
                  : `${d.head.m}/${d.head.t} mastered · ${d.head.p} in progress · ${fmt(d.head.x)} XP`}
            </span>
          </div>
          {!d.island ? (
            <div className="flex rounded-full border p-0.5" role="group" aria-label="View">
              <Button variant="ghost" size="sm" aria-pressed={view === "list"} className={cn("h-8 rounded-full px-3", view === "list" && "bg-primary/15 text-foreground")} onClick={() => setView("list")}>Ranks</Button>
              <Button variant="ghost" size="sm" aria-pressed={view === "own"} className={cn("h-8 rounded-full px-3", view === "own" && "bg-primary/15 text-foreground")} onClick={() => setView("own")}>Tap what you own</Button>
            </div>
          ) : null}
          {!d.island && left && view === "list" ? (
            <Button variant="outline" className="h-9" onClick={() => setConfirm(true)}>
              <ChevronsUp /> Max all in this list
            </Button>
          ) : null}
        </div>
        {d.island ? (
          <Island html={d.island} />
        ) : d.items.length && view === "own" ? (
          <>
            <p className="border-b px-4 py-2.5 text-sm text-muted-foreground">Tap everything you have in your inventory right now. It doesn't change mastery; use the Owned and Not owned filters afterwards.</p>
            <OwnGrid items={d.items} owned={(d as typeof d & RanksExtra).owned ?? 0} total={d.total} signedIn={!!(d as typeof d & RanksExtra).signedIn} />
          </>
        ) : d.items.length ? (
          <ul className="flex flex-col divide-y">
            {d.items.map((it) => (
              <RankRow key={it.n} it={it} />
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-start gap-2 px-4 py-8 text-sm text-muted-foreground">
            Nothing matches this filter.
            <Button variant="outline" size="sm" onClick={() => { setQ(""); tf().ranksSet({ q: "", f: "all" }) }}>
              Show everything
            </Button>
          </div>
        )}
        {d.total > d.shown ? (
          <div role="status" className="flex flex-wrap items-center gap-2 border-t px-4 py-3">
            <span className="mr-auto text-sm text-muted-foreground">
              Showing {fmt(d.shown)} of {fmt(d.total)}
            </span>
            <Button variant="outline" className="h-9" onClick={() => tf().ranksMore()}>
              Show {fmt(Math.min(60, d.total - d.shown))} more
            </Button>
            <Button variant="ghost" className="h-9" onClick={() => tf().ranksMore(true)}>
              Show all
            </Button>
          </div>
        ) : null}
      </Card>

      <Dialog open={confirm} onOpenChange={setConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Mark {left} item{left === 1 ? "" : "s"} mastered?
            </DialogTitle>
            <DialogDescription>
              Everything in this list that isn't mastered yet goes to max rank. You can undo it right after, or later from Achievements.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
            <Button
              onClick={() => {
                setConfirm(false)
                tf().maxAll()
              }}
            >
              Mark mastered
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
