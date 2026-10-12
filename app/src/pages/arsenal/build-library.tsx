import { useEffect, useState } from "react"
import { ArrowLeft, BookOpen, Check, Copy, ExternalLink, Flag, RefreshCw, Search, Shield, Target, ThumbsDown, ThumbsUp, Trash2, Users, X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ModCard, ModList } from "@/components/tf/mod-card"
import { BuildInsight } from "@/components/tf/build-insight"
import { MoreBuilds } from "@/components/tf/more-builds"
import { Thumb } from "@/components/tf/thumb"
import { PersonMenu } from "@/components/tf/person"
import { cn } from "@/lib/utils"
import { tf, useTFData, type BuildCard, type BuildDetail } from "@/lib/tf"
import { SortDir } from "@/components/tf/sort-dir"

const KINDS = [{ value: "all", label: "Everything" }, { value: "Warframe", label: "Warframes" }, { value: "Weapon", label: "Weapons" }, { value: "Companion", label: "Companions" }]
const SRCS = [{ value: "all", label: "Tennoform + players" }, { value: "meta", label: "Tennoform picks" }, { value: "players", label: "Player builds" }, { value: "wiki", label: "Warframe Wiki builds" }]
const fday = (d: string) => (d ? new Date(d + "T12:00:00Z").toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" }) : "unknown")
const GOALS = [
  { value: "all", label: "Any build", hint: "" },
  { value: "sp", label: "Steel Path", hint: "Built to handle level 100+ enemies" },
  { value: "budget", label: "First Steel Path", hint: "Steel Path builds from mods you can get early" },
  { value: "starter", label: "Starter", hint: "Simple builds for new players" },
] as const
const TAG_L: Record<string, string> = { sp: "Steel Path", budget: "Cheap mods", starter: "Starter" }
/** What a build is for, as small badges: Steel Path, cheap mods, starter. */
function Tags({ tags }: { tags: BuildCard["tags"] }) {
  return <>{tags.map((t) => <Badge key={t} variant="outline" className={cn(t === "sp" ? "border-sky-600/40 text-sky-800 dark:text-sky-300" : t === "budget" ? "border-emerald-600/40 text-emerald-800 dark:text-emerald-300" : "text-muted-foreground")}>{TAG_L[t]}</Badge>)}</>
}
const SORTS = [{ value: "top", label: "Top voted" }, { value: "new", label: "Newest" }, { value: "own", label: "Items I own" }, { value: "ready", label: "Mods I own" }, { value: "name", label: "Name" }]

export function Votes({ b, size = "sm" }: { b: BuildCard; size?: "sm" | "lg" }) {
  const lg = size === "lg"
  return (
    <span className={cn("inline-flex shrink-0 items-center rounded-full border bg-background/40", lg ? "gap-1 p-1" : "gap-0.5 p-0.5")}>
      <Button variant="ghost" size={lg ? "sm" : "icon-sm"} className={cn("rounded-full", lg && "h-8 px-2.5", b.myVote === 1 && "bg-primary/15 text-primary")} aria-pressed={b.myVote === 1}
        aria-label={`Vote up ${b.name}`} onClick={() => tf().buildVote(b.id, 1)}>
        <ThumbsUp />{lg ? <span className="tabular-nums">{b.up}</span> : null}
      </Button>
      {!lg ? <b className={cn("min-w-6 text-center text-sm tabular-nums", b.score > 0 && "text-primary", b.score < 0 && "text-muted-foreground")} aria-label={`Score ${b.score}`}>{b.score}</b> : null}
      <Button variant="ghost" size={lg ? "sm" : "icon-sm"} className={cn("rounded-full", lg && "h-8 px-2.5", b.myVote === -1 && "bg-muted text-foreground")} aria-pressed={b.myVote === -1}
        aria-label={`Vote down ${b.name}`} onClick={() => tf().buildVote(b.id, -1)}>
        <ThumbsDown />{lg ? <span className="tabular-nums">{b.down}</span> : null}
      </Button>
    </span>
  )
}

function Progress({ have, total }: { have: number; total: number }) {
  const pct = total ? (have / total) * 100 : 0
  return (
    <span className="flex items-center gap-2 text-xs text-muted-foreground">
      <span className="h-1.5 w-16 overflow-hidden rounded-full bg-muted" aria-hidden><span className="block h-full rounded-full bg-primary" style={{ width: `${pct}%` }} /></span>
      <span className="tabular-nums">You own {have}/{total}</span>
    </span>
  )
}

function Row({ b }: { b: BuildCard }) {
  return (
    <li className="flex h-full items-center gap-2 rounded-xl border bg-card pr-3 hover:bg-muted/40">
      <button type="button" onClick={() => tf().buildLibSet({ sel: b.id })} aria-label={`${b.item}: ${b.name}${b.src === "player" ? ", by " + (b.author || "a player") : ""}. You own ${b.have} of ${b.total}`}
        className="flex min-w-0 flex-1 items-center gap-3 rounded-xl p-3 text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
        <Thumb src={b.img} className="size-12 shrink-0 rounded-xl" />
        <span className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="text-xs text-muted-foreground">{b.item}{b.fits?.length ? ` · also ${b.fits.join(", ")}` : ""}</span>
          <b className="truncate font-heading text-base leading-tight font-semibold">{b.name}</b>
          <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
            {b.src === "wiki" ? <Badge variant="outline" className="text-muted-foreground"><BookOpen /> Wiki · {b.author || "unknown"}</Badge> : b.src === "player" ? <Badge variant="outline" className="text-muted-foreground"><Users /> {b.author || "Player"}</Badge> : <Badge variant="outline" className="border-primary/40 text-primary">Tennoform pick</Badge>}
            <Tags tags={b.tags} />
            {b.role ? <span className="truncate text-xs text-muted-foreground">{b.role}</span> : null}
            {b.dated ? <span className={cn("text-xs", b.stale ? "text-amber-800 dark:text-amber-300" : "text-muted-foreground")}>{b.dated}{b.stale ? " · may be out of date" : ""}</span> : null}
            {b.goal ? <Badge variant="outline" className="border-primary/40 text-primary"><Target /> Goal</Badge> : null}
          </span>
          <Progress have={b.have} total={b.total} />
        </span>
      </button>
      {b.src === "player" ? <Votes b={b} /> : null}
    </li>
  )
}

export function BuildView({ b, back }: { b: BuildDetail; back?: () => void }) {
  return (
    <div className="flex flex-col gap-4">
      {back ? <Button variant="ghost" className="h-9 self-start px-2" onClick={back}><ArrowLeft /> All builds</Button> : null}
      <Card className="gap-4 px-5">
        <div className="flex flex-wrap items-start gap-4">
          <Thumb src={b.img} className="size-16 shrink-0 rounded-xl" />
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <a href="#" className="text-xs text-muted-foreground underline-offset-4 hover:underline" onClick={(e) => { e.preventDefault(); tf().act("a", { href: "#", "data-go": "item|" + b.item }) }}>{b.item}</a>
            {b.fits?.length ? (
              <span className="text-xs text-muted-foreground">Also fits{" "}
                {b.fits.map((f, i) => <span key={f}>{i ? ", " : ""}<a href="#" className="underline-offset-4 hover:underline" onClick={(e) => { e.preventDefault(); tf().act("a", { href: "#", "data-go": "item|" + f }) }}>{f}</a></span>)}
              </span>
            ) : null}
            <h2 className="font-heading text-2xl leading-tight font-semibold">{b.name}</h2>
            <span className="flex flex-wrap items-center gap-2 text-sm">
              {b.src === "wiki" ? <Badge variant="outline" className="text-muted-foreground"><BookOpen /> By {b.author || "unknown"} on the Warframe Wiki</Badge> : b.src === "player" ? (b.authorUid
                ? <PersonMenu uid={b.authorUid} name={b.author || "Player"} className="rounded-4xl" label={`Shared by ${b.author || "a player"}: add friend or block`}><Badge variant="outline" className="text-muted-foreground hover:bg-muted"><Users /> Shared by {b.author || "a player"}</Badge></PersonMenu>
                : <Badge variant="outline" className="text-muted-foreground"><Users /> Shared by {b.author || "a player"}</Badge>) : <Badge variant="outline" className="border-primary/40 text-primary">Tennoform pick</Badge>}
              <Tags tags={b.tags} />
              {b.helminth ? <span>Helminth: <b className="font-medium">{b.helminth}</b></span> : null}
            </span>
            {b.dated ? (
              <span className={cn("text-xs", b.stale ? "text-amber-800 dark:text-amber-300" : "text-muted-foreground")}>
                {b.dated}{b.stale ? ". Over 6 months old: game updates may have changed the mods or numbers since." : ""}
              </span>
            ) : null}
          </div>
          {b.src === "player" ? <Votes b={b} size="lg" /> : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button className="h-10 px-4" onClick={() => tf().buildGoal(b.id)} aria-pressed={b.goal}>{b.goal ? <><Check /> Saved as goal</> : <><Target /> Save as goal</>}</Button>
          <Button variant="outline" className="h-10" onClick={() => tf().buildCopy(b.id)}><Copy /> Copy to my builds</Button>
          {b.mine && b.doc ? <Button variant="outline" className="h-10" onClick={() => tf().sharedDelete(b.doc)}><Trash2 /> Stop sharing</Button> : null}
          {b.src === "player" && !b.mine ? (
            <Button variant="ghost" className="h-10" onClick={() => tf().act("a", { href: "#feedback" })}><Flag /> Report</Button>
          ) : null}
        </div>
        <Progress have={b.have} total={b.total} />
        {!b.itemOwned ? <p className="text-sm text-muted-foreground">You don't have {b.item} yet. {b.itemGoal ? "It's in your Goals." : "Saving this build as a goal adds it to your Goals too."}</p> : null}
        {b.link ? (
          <a href={b.link} target="_blank" rel="noopener nofollow ugc" className="inline-flex items-center gap-1.5 self-start text-sm font-medium underline decoration-primary/50 underline-offset-4 hover:decoration-primary">
            <ExternalLink aria-hidden className="size-4" /> This build on Overframe{b.author ? ` (by ${b.author})` : ""}
          </a>
        ) : null}
        {b.wiki ? (
          <div className="flex flex-col gap-1 rounded-xl border bg-muted/30 px-4 py-3 text-sm">
            <span>
              Build by <b className="font-medium">{b.author || "unknown"}</b> on the Warframe Wiki. Made {fday(b.wiki.created)}{b.wiki.updated && b.wiki.updated !== b.wiki.created ? <>, last updated {fday(b.wiki.updated)}</> : null}.
              {b.wiki.forma ? ` Uses ${b.wiki.forma} Forma.` : ""}
            </span>
            {!b.wiki.exact ? <span className="text-muted-foreground">The mods here were picked out of the author's write-up, which sometimes names a mod to say not to use it. Read the original for the exact setup.</span> : null}
            {b.wiki.gone.length ? <span className="text-muted-foreground">No longer in the game, left out: {b.wiki.gone.join(", ")}.</span> : null}
            <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <a href={b.wiki.url} target="_blank" rel="noopener" className="inline-flex items-center gap-1 font-medium underline decoration-primary/50 underline-offset-4 hover:decoration-primary"><ExternalLink aria-hidden className="size-4" /> Original page</a>
              <span className="text-xs text-muted-foreground">Text and build © {b.author || "its author"}, <a href="https://creativecommons.org/licenses/by-nc-sa/3.0/" target="_blank" rel="noopener license" className="underline underline-offset-2">CC BY-NC-SA 3.0</a></span>
            </span>
          </div>
        ) : null}
        <MoreBuilds item={b.item} />
      </Card>
      <Card className="gap-4 px-5">
        <BuildInsight id={b.id} role={b.role} notes={b.notes} item={b.item} mods={b.mods} arcanes={b.arcanes} />
      </Card>
      <Card className="gap-3 px-5">
        <h3 className="font-heading text-lg leading-tight font-semibold">Mods and where to get them</h3>
        <p className="-mt-1 text-xs text-muted-foreground">What each one does at max rank. Tick what you own; tap a mod for how to get it and its warframe.market prices.</p>
        <ModList>
          {b.mods.map((m, i) => <ModCard key={m.key + i} m={m} />)}
          {b.arcanes.map((m, i) => <ModCard key={m.key + "a" + i} m={m} />)}
        </ModList>
      </Card>
    </div>
  )
}

export function BuildLibrary() {
  const d = useTFData(() => tf().buildLib())
  const [q, setQ] = useState(d.q)
  useEffect(() => setQ(d.q), [d.q])
  useEffect(() => {
    const t = window.setTimeout(() => q !== d.q && tf().buildLibSet({ q }), 160)
    return () => window.clearTimeout(t)
  }, [q, d.q])
  if (d.sel) return <BuildView b={d.sel} back={() => tf().buildLibSet({ sel: null })} />
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted-foreground">
        Tennoform's picks (based on widely used community setups), builds shared by players, and player builds from the Warframe Wiki, credited to their authors. Open one to see every mod and where it drops, save it as a goal, or copy it to tweak. {d.signedIn ? "Vote on player builds to push the best ones up." : "Sign in to vote and share your own."}
      </p>
      <div className="relative">
        <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find a Warframe, weapon, build or player" aria-label="Search builds" className="h-11 rounded-full pr-10 pl-9" />
        {q ? <Button variant="ghost" size="icon-sm" className="absolute top-1/2 right-2 -translate-y-1/2" onClick={() => setQ("")} aria-label="Clear search"><X /></Button> : null}
      </div>
      <div role="radiogroup" aria-label="What the build is for" className="flex flex-wrap gap-2">
        {GOALS.map((g) => (
          <Button key={g.value} type="button" role="radio" aria-checked={d.goal === g.value} variant={d.goal === g.value ? "default" : "outline"} className="h-9 rounded-full"
            title={g.hint || undefined} onClick={() => tf().buildLibSet({ goal: g.value })}>{d.goal === g.value && g.value !== "all" ? <Check /> : null}{g.label}</Button>
        ))}
      </div>
      {d.goal === "sp" || d.goal === "budget" ? (
        <Card size="sm" className="gap-1.5 px-4">
          <b className="flex items-center gap-2 text-sm font-medium"><Shield className="size-4 text-primary" aria-hidden /> New to the Steel Path?</b>
          <p className="text-sm text-muted-foreground">
            {d.goal === "budget" ? "These builds use mods you can farm or buy cheaply, and each one says what to upgrade later. " : "Steel Path builds lean on Galvanized mods, armor strip and survival mods. Pick First Steel Path to see cheaper versions. "}
            Start with one tanky Warframe and one weapon built for Viral damage.
          </p>
          <a href="#" className="self-start text-sm font-medium underline decoration-primary/50 underline-offset-4 hover:decoration-primary" onClick={(e) => { e.preventDefault(); tf().act("a", { href: "#", "data-go": "guide|steel-path-loadout" }) }}>
            Read: Getting ready for the Steel Path
          </a>
        </Card>
      ) : null}
      <div className="flex flex-wrap gap-2">
        {[["kind", KINDS, d.kind, "Show"], ["src", SRCS, d.src, "Source"], ["sort", SORTS, d.sort, "Sort"]].map(([k, items, v, label]) => (
          <Select key={k as string} items={items as typeof KINDS} value={v as string} onValueChange={(x) => tf().buildLibSet({ [k as string]: String(x) })}>
            <SelectTrigger className="h-9 min-w-36" aria-label={label as string}><SelectValue /></SelectTrigger>
            <SelectContent>{(items as typeof KINDS).map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
          </Select>
        ))}
        <SortDir k="blO" className="size-9" />
        {d.shared.online ? <Button variant="ghost" className="h-9" onClick={() => tf().buildLibReload()} disabled={d.shared.loading}><RefreshCw className={cn(d.shared.loading && "animate-spin")} /> Refresh</Button> : null}
      </div>
      {d.shared.err ? <p className="text-sm text-muted-foreground">Player builds are offline for a moment. Top community builds below still work.</p> : null}
      {d.src === "players" && !d.shared.loading && !d.shared.count ? (
        <p className="rounded-xl border border-dashed px-4 py-3 text-sm text-muted-foreground">No player builds yet. Make one under <b className="font-medium text-foreground">My builds</b> and share it to be the first.</p>
      ) : null}
      {d.list.length ? <ul className="grid gap-3 md:grid-cols-2">{d.list.map((b) => <Row key={b.id} b={b} />)}</ul> : d.src !== "players" ? <p className="py-6 text-center text-sm text-muted-foreground">No builds match.</p> : null}
      {d.more ? <Button variant="outline" className="h-10 self-center" onClick={() => tf().buildLibSet({ more: true })}>Show more ({d.total - d.list.length} left)</Button> : null}
    </div>
  )
}
