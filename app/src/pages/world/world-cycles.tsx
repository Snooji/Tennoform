import { useEffect, useState } from "react"
import { Drama, Flame, Moon, Snowflake, Sparkles, Sun, type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { tf, type WorldCycle, type WorldData } from "@/lib/tf"

const ICON: Record<string, LucideIcon> = { Day: Sun, Night: Moon, Warm: Flame, Cold: Snowflake, Fass: Sparkles, Vome: Moon }

function left(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000)), h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60)
  return h ? `${h}h ${m}m` : m ? `${m}m ${String(s % 60).padStart(2, "0")}s` : `${s % 60}s`
}

function Clock({ c, on, now }: { c: WorldCycle; on: boolean; now: number }) {
  const ms = new Date(c.expiry).getTime() - now
  const Icon = ICON[c.now] || Drama
  return (
    <li className={cn("flex min-w-0 items-center gap-2.5 rounded-lg border bg-card px-3 py-2", on && "border-primary/60 bg-primary/10")} aria-current={on ? "true" : undefined}>
      <Icon className={cn("size-5 shrink-0", on ? "text-primary" : "text-muted-foreground")} aria-hidden />
      <div className="min-w-0">
        <div className="truncate text-xs text-muted-foreground">{c.hub}</div>
        <div className="font-heading text-base leading-tight font-semibold">{c.now}</div>
        <div className="text-xs text-muted-foreground tabular-nums">
          {ms > 0 ? (c.next ? `${c.next} in ${left(ms)}` : `Changes in ${left(ms)}`) : `Changing${c.next ? " to " + c.next : ""}…`}
        </div>
      </div>
    </li>
  )
}

/** Day and night, warm and cold, Fass and Vome, and Duviri's mood, live and counting down. The world in view is highlighted. */
export function WorldCycles({ d, region }: { d: WorldData; region: string }) {
  const [now, setNow] = useState(() => Date.now())
  const cy = d.cycles
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])
  // once a cycle runs out, fetch the next one (the bridge limits how often)
  const ended = cy?.list.some((c) => new Date(c.expiry).getTime() <= now)
  useEffect(() => {
    if (ended) tf().wsRefresh()
  }, [ended])
  if (!cy) return null
  if (cy.state !== "ok" || !cy.list.length)
    return <p className="text-xs text-muted-foreground" role="status">{cy.state === "error" ? "Couldn't load the live cycles right now." : "Loading the live cycles…"}</p>
  return (
    <section aria-label="Live cycles">
      <ul className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {cy.list.map((c) => <Clock key={c.region} c={c} on={c.region === region} now={now} />)}
      </ul>
    </section>
  )
}
