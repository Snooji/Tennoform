import { Check, Minus, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { tf, useTFData } from "@/lib/tf"

const tap = () => { try { navigator.vibrate?.(8) } catch { /* not supported */ } }

/** The farming counter: stays above the tab bar while a session runs. Big + buttons for one-handed use mid-game. */
export function FarmSessionBar() {
  const d = useTFData(() => tf().sess())
  const a = d.active
  if (!a) return null
  const rate = a.runs ? a.drops / a.runs : 0
  const perHour = a.mins && a.mins >= 5 ? Math.round((a.runs / a.mins) * 60) : 0
  return (
    <div role="region" aria-label={`Farming ${a.name}`} className="fixed inset-x-3 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-[74] mx-auto flex max-w-lg flex-col gap-2 rounded-2xl border bg-card/95 p-3 shadow-lg backdrop-blur md:right-6 md:bottom-6 md:left-auto md:w-[26rem]">
      <div className="flex items-baseline gap-2">
        <b className="min-w-0 truncate font-heading text-base font-semibold">{a.name}</b>
        <span className="ml-auto shrink-0 text-xs text-muted-foreground tabular-nums">
          {a.runs ? `${(rate * 100).toFixed(rate < 0.1 ? 1 : 0)}% per run` : "No runs yet"}{perHour ? ` · ${perHour} runs/h` : ""}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center gap-1 rounded-xl border p-1">
          <Button variant="ghost" size="icon" className="size-10" aria-label="Remove a run" disabled={!a.runs} onClick={() => tf().sessRun(-1)}><Minus /></Button>
          <button type="button" className="flex h-10 flex-1 flex-col items-center justify-center rounded-lg bg-muted/60 text-sm font-medium" onClick={() => { tap(); tf().sessRun(1) }}>
            <span className="tabular-nums">{a.runs}</span><span className="text-[11px] leading-none text-muted-foreground">+ Run</span>
          </button>
        </div>
        <div className="flex items-center gap-1 rounded-xl border p-1">
          <Button variant="ghost" size="icon" className="size-10" aria-label="Remove a drop" disabled={!a.drops} onClick={() => tf().sessDrop(-1)}><Minus /></Button>
          <button type="button" className="flex h-10 flex-1 flex-col items-center justify-center rounded-lg bg-primary text-sm font-medium text-primary-foreground" onClick={() => { tap(); tf().sessDrop(1) }}>
            <span className="tabular-nums">{a.drops}</span><span className="text-[11px] leading-none opacity-80">+ Drop</span>
          </button>
        </div>
      </div>
      <Button variant="ghost" className="h-8 self-end text-xs" onClick={() => tf().sessEnd()}><Check className="size-3.5" /> End and save</Button>
    </div>
  )
}

/** "Start farming" for a details page. */
export function FarmStartButton({ k, name }: { k: string; name: string }) {
  const d = useTFData(() => tf().sess())
  const on = d.active?.key === k
  return (
    <Button variant="outline" className="h-9" disabled={on} onClick={() => tf().sessStart(k, name)}>
      <Plus /> {on ? "Farming now" : "Count my runs"}
    </Button>
  )
}
