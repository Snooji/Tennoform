import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { tf, useTFData } from "@/lib/tf"
import { Checklist } from "./checklist"
import { Cycles, Fissures, Invasions, LiveStatus, Missions, Nightwave } from "./live"

export function TodayPage() {
  const d = useTFData(() => tf().today())
  const L = d.live
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-5 md:px-6 md:py-6">
      <header className="flex flex-col gap-1">
        <h1 className="font-heading text-3xl font-semibold">Today</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">Resets, your daily and weekly checklist, and what's live in the game right now.</p>
      </header>
      <div className="grid gap-2 sm:grid-cols-3">
        {d.tiles.map((t) => (
          <Card key={t.k} size="sm" className="gap-0.5 px-4">
            <span className="text-xs text-muted-foreground">{t.k}</span>
            <b className="font-heading text-2xl leading-tight font-semibold tabular-nums">{t.v}</b>
            <span className="text-xs text-muted-foreground">{t.total != null ? `${t.done}/${t.total} done · ` : ""}{t.x}</span>
            {t.total ? <Progress value={(100 * (t.done || 0)) / t.total} className="mt-2 h-1" aria-label={`${t.k}: ${t.done} of ${t.total} done`} /> : null}
          </Card>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div className="flex min-w-0 flex-col gap-4">
          <Checklist d={d} />
          {L ? <Nightwave L={L} /> : null}
        </div>
        <section aria-labelledby="live-h" className="flex min-w-0 flex-col gap-4">
          <h2 id="live-h" className="font-heading text-lg leading-tight font-semibold">Live in the game</h2>
          <LiveStatus />
          {L ? (
            <>
              <Cycles L={L} />
              <Missions L={L} />
            </>
          ) : null}
        </section>
      </div>
      {L ? (
        <>
          <Fissures L={L} />
          <Invasions L={L} />
        </>
      ) : null}
    </div>
  )
}
