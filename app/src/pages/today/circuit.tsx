import { useState } from "react"
import { Bell, BellRing, Check, CircleAlert } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { GoLink } from "@/components/tf/go-link"
import { cn } from "@/lib/utils"
import { tf, useTFData, type CircuitWeek } from "@/lib/tf"

/** Ring the bell to get an alert in the week the Circuit offers it. */
function Watch({ n, on }: { n: string; on?: boolean }) {
  return (
    <Button variant="ghost" size="icon" className="size-8 shrink-0" aria-pressed={!!on} aria-label={(on ? "Stop alerts for " : "Alert me when the Circuit offers ") + n} onClick={() => tf().circuitWatch(n, !on)}>
      {on ? <BellRing className="size-4 fill-primary/30 text-primary" /> : <Bell className="size-4 text-muted-foreground" />}
    </Button>
  )
}

function Week({ w }: { w: CircuitWeek }) {
  return (
    <li className="flex flex-col gap-2 px-4 py-3">
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <b className="font-heading text-base font-semibold">{w.label}</b>
        <span className="text-xs text-muted-foreground">{w.endsIn ? `ends in ${w.endsIn}` : `starts in ${w.startsIn}`}</span>
        <span className="ml-auto">
          {w.need ? <Badge variant="outline">{w.need} you don't have</Badge> : <Badge variant="outline" className="text-muted-foreground"><Check /> Nothing new for you</Badge>}
        </span>
      </div>
      <div className="flex flex-col gap-1 text-sm">
        <span className="text-xs text-muted-foreground">Warframes (normal Circuit)</span>
        <ul className="flex flex-wrap gap-x-4 gap-y-1">
          {w.frames.map((f) => (
            <li key={f.n} className="flex items-center gap-1.5">
              <Watch n={f.n} on={f.watch} />
              {f.owned ? <Check aria-hidden className="size-4 text-primary" /> : <span aria-hidden className="size-4" />}
              <GoLink k={"item|" + f.n} className={cn(f.owned && "text-muted-foreground")}>{f.n}</GoLink>
              <span className="sr-only">{f.owned ? "(you have it)" : "(you don't have it)"}</span>
              {!f.owned && f.prime ? <span className="text-xs text-muted-foreground">(you have the Prime)</span> : null}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col gap-1 text-sm">
        <span className="text-xs text-muted-foreground">Incarnon Genesis adapters (Steel Path Circuit). Tick the ones you have.</span>
        <ul className="grid gap-x-4 gap-y-1 sm:grid-cols-2">
          {w.adapters.map((a) => (
            <li key={a.n} className="flex items-center gap-1">
              <Watch n={a.n} on={a.watch} />
              <label className="flex min-h-8 cursor-pointer items-center gap-2">
                <Checkbox className="size-5 rounded-md" checked={a.have} onCheckedChange={(v) => tf().nodeTick(a.key, !!v)} aria-label={`I have the ${a.full}`} />
                <span className={cn(a.have && "text-muted-foreground line-through decoration-primary/70")}>{a.n}</span>
                {!a.weapon ? <span className="text-xs text-muted-foreground">· weapon not owned</span> : null}
              </label>
            </li>
          ))}
        </ul>
      </div>
    </li>
  )
}

/** The Circuit's weekly rewards for the next few weeks, so you know which Monday to show up. */
export function CircuitForecast() {
  const d = useTFData(() => tf().circuit())
  const [more, setMore] = useState(false)
  const weeks = more ? d.weeks : d.weeks.slice(0, 4)
  return (
    <Card className="gap-0 py-0" id="circuit">
      <CardHeader className="border-b py-3">
        <CardTitle>
          <h2 className="font-heading text-lg leading-tight font-semibold">Duviri Circuit forecast</h2>
        </CardTitle>
        <CardAction>
          <span className="text-xs text-muted-foreground tabular-nums">{d.adaptersHave}/{d.adaptersTotal} adapters</span>
        </CardAction>
      </CardHeader>
      <CardContent className="px-0">
        <p className="border-b px-4 py-3 text-sm text-muted-foreground">
          The Circuit's rewards change every Monday at 00:00 UTC, and each week you choose which of that week's rewards to earn. Plan your runs for
          the weeks that have what you're missing.
        </p>
        {d.changed ? (
          <p className="flex gap-2 border-b px-4 py-3 text-sm">
            <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0 text-amber-700 dark:text-amber-400" />
            This week's rewards don't match the usual rotation, so the game may have changed it. This week shows what the game reports; later weeks may be off until the forecast is updated.
          </p>
        ) : null}
        {d.watching && d.watching.length ? (
          <div className="flex flex-col gap-1 border-b px-4 py-3 text-sm">
            <span className="flex items-center gap-1.5 font-medium"><BellRing aria-hidden className="size-4 text-primary" /> Alerts on</span>
            <ul className="flex flex-wrap gap-x-4 gap-y-1">
              {d.watching.map((x) => <li key={x.n}>{x.n} <span className="text-muted-foreground">· {x.label}</span></li>)}
            </ul>
          </div>
        ) : (
          <p className="border-b px-4 py-3 text-xs text-muted-foreground">Tap a bell to get an alert in the week the Circuit offers that Warframe or adapter.</p>
        )}
        <ul className="flex flex-col divide-y">{weeks.map((w) => <Week key={w.start} w={w} />)}</ul>
        <div className="flex flex-wrap items-center gap-2 border-t px-4 py-3">
          <Button variant="outline" size="sm" className="h-9" onClick={() => setMore(!more)}>{more ? "Show fewer weeks" : `Show ${d.weeks.length - 4} more weeks`}</Button>
          <span className="text-xs text-muted-foreground">Your Warframes come from your collection. Adapter ticks are saved on this device.</span>
        </div>
      </CardContent>
    </Card>
  )
}
