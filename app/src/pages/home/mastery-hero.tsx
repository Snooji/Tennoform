import { motion, useReducedMotion } from "motion/react"
import { CircleCheck, RefreshCw, Route, Share2 } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { RollingNumber } from "@/components/ui/rolling-number"
import { cn } from "@/lib/utils"
import { fmt, tf, useTFData, type HomeData } from "@/lib/tf"

/** Progress to the next rank as a ring; fills once on load, then follows the numbers. */
export function MasteryRing({ pct, label, size = 132 }: { pct: number; label: string; size?: number }) {
  const reduce = useReducedMotion()
  const r = 44
  const c = 2 * Math.PI * r
  const p = Math.max(0.005, Math.min(1, pct / 100))
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="size-full -rotate-90" aria-hidden>
        <circle cx="50" cy="50" r={r} fill="none" strokeWidth="6" className="stroke-muted" />
        <motion.circle
          cx="50" cy="50" r={r} fill="none" strokeWidth="6" strokeLinecap="butt" className="stroke-primary"
          strokeDasharray={c}
          initial={{ strokeDashoffset: reduce ? c * (1 - p) : c }}
          animate={{ strokeDashoffset: c * (1 - p) }}
          transition={{ duration: reduce ? 0 : 1.1, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <span className="absolute inset-0 grid place-items-center font-heading text-4xl font-semibold tabular-nums">
        {label}
      </span>
    </div>
  )
}

const SEG = ["bg-primary", "bg-primary/70", "bg-primary/45", "bg-muted-foreground/45", "bg-muted-foreground/25"]

function Breakdown({ parts }: { parts: HomeData["parts"] }) {
  const sum = parts.reduce((a, p) => a + p.xp, 0) || 1
  if (!parts.length) return null
  return (
    <div className="flex flex-col gap-2">
      <div className="text-xs text-muted-foreground">Where your Mastery XP comes from</div>
      <div
        role="img"
        aria-label={"Mastery XP by source: " + parts.map((p) => `${p.label} ${fmt(p.xp)}`).join(", ")}
        className="flex h-2 w-full gap-0.5 overflow-hidden rounded-full"
      >
        {parts.map((p, i) => (
          <i key={p.label} className={cn("block h-full first:rounded-l-full last:rounded-r-full", SEG[i])} style={{ width: `${(p.xp / sum) * 100}%` }} />
        ))}
      </div>
      <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        {parts.map((p, i) => (
          <li key={p.label} className="flex items-center gap-1.5">
            <i aria-hidden className={cn("size-2 rounded-full", SEG[i])} />
            {p.label} <b className="font-semibold text-foreground tabular-nums">{fmt(p.xp)}</b>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Fast sync from Home: a button until the profile is synced, then a green "Synced" status (tap to sync again). */
function SyncControl() {
  const st = useTFData(() => tf().syncStatus())
  if (st.state === "off") return null
  const run = () => (st.linked ? tf().sync() : tf().account())
  if (st.state === "ok")
    return (
      <Button variant="ghost" size="sm" className="h-8 gap-1.5 self-start rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 text-emerald-700 hover:bg-emerald-500/15 dark:text-emerald-400"
        onClick={run} aria-label={`Synced ${st.at}. Sync again`} title="Sync again">
        <CircleCheck /> Synced <span className="font-normal opacity-80">· {st.at}</span>
      </Button>
    )
  return (
    <Button size="sm" className="h-8 gap-1.5 self-start rounded-full px-3" disabled={st.state === "busy"} onClick={run}>
      <RefreshCw className={cn(st.state === "busy" && "animate-spin")} />
      {st.state === "busy" ? "Syncing…" : st.state === "stale" ? <>Sync now <span className="font-normal opacity-80">· last {st.at}</span></> : "Sync profile"}
    </Button>
  )
}

export function MasteryHero({ d }: { d: HomeData }) {
  const title = d.name || d.mrLabel
  const primary = (
    <a href="#mastery" className={cn(buttonVariants({ size: "lg" }), "h-10 px-4")}>
      <Route /> See rank-up plan
    </a>
  )
  return (
    <Card className="gap-5 p-5 md:p-6">
      <div className="flex items-center gap-5 md:gap-7">
        <MasteryRing pct={d.pct} label={d.mrShort} size={window.innerWidth < 500 ? 104 : 132} />
        <div className="flex min-w-0 flex-col gap-1">
          <SyncControl />
          <h1 className="truncate font-heading text-2xl leading-tight font-semibold md:text-3xl">{title}</h1>
          <p className="text-sm text-muted-foreground">
            {d.name ? d.mrLabel.replace("Mastery rank", "MR") + " · " : ""}
            {d.inGame ? `in game MR ${d.inGame} · ` : ""}
            {fmt(d.maxed)} items mastered
          </p>
          <p className="mt-1 flex flex-wrap items-baseline gap-x-2 text-sm">
            <b className="font-heading text-2xl font-semibold tabular-nums">
              <RollingNumber value={d.xp} format={fmt} />
            </b>
            <span className="text-muted-foreground tabular-nums">
              / {fmt(d.next)} XP · {fmt(d.toNext)} to {d.nextLabel}
            </span>
          </p>
        </div>
      </div>
      <Breakdown parts={d.parts} />
      <div className="flex flex-wrap items-center gap-2">
        {primary}
        <a href="#ranks" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-10 px-4")}>
          Update ranks
        </a>
        <a
          href="#tenno"
          className={cn(buttonVariants({ variant: "ghost", size: "lg" }), "h-10 px-3")}
          onClick={(e) => {
            e.preventDefault()
            tf().act("a", { href: "#tenno", "data-ttab": "breakdown" })
          }}
        >
          Full breakdown
        </a>
        <Button variant="ghost" size="lg" className="h-10 px-3 sm:ml-auto" onClick={() => tf().share()}>
          <Share2 /> Share
        </Button>
      </div>
    </Card>
  )
}
