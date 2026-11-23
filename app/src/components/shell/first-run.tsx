import { useState } from "react"
import { Bell, Check, Crosshair, ListChecks, Timer } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { tf, useTFData } from "@/lib/tf"

const POINTS = [
  { icon: ListChecks, t: "Know what to rank next", d: "Your mastery, what's left and the quickest gear to level." },
  { icon: Crosshair, t: "Find where to farm anything", d: "Every item, part, resource and relic, with the best place to get it." },
  { icon: Timer, t: "Never miss a reset or a build", d: "Daily and weekly resets, Foundry timers and what's live today." },
]

/** Three screens on the very first open of the app. Skippable at every step; never shown again. */
export function FirstRun() {
  const d = useTFData(() => tf().intro())
  const [step, setStep] = useState(0)
  if (!d.show) return null
  const done = () => tf().introDone()
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="fr-title" className="fixed inset-0 z-[100] flex flex-col bg-background px-6 pt-[calc(env(safe-area-inset-top)+1.5rem)] pb-[calc(env(safe-area-inset-bottom)+1.5rem)]">
      <div className="flex justify-end"><Button variant="ghost" className="h-9" onClick={done}>Skip</Button></div>
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-6">
        {step === 0 ? (
          <>
            <h1 id="fr-title" className="font-heading text-4xl leading-tight font-semibold">Welcome to Tennoform</h1>
            <ul className="flex flex-col gap-4">
              {POINTS.map((p) => (
                <li key={p.t} className="flex gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary"><p.icon className="size-5" aria-hidden /></span>
                  <span className="flex flex-col"><b className="font-medium">{p.t}</b><span className="text-sm text-muted-foreground">{p.d}</span></span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-muted-foreground">Free and fan-made. Not affiliated with Digital Extremes.</p>
          </>
        ) : step === 1 ? (
          <>
            <div className="flex flex-col gap-2">
              <h1 id="fr-title" className="font-heading text-3xl leading-tight font-semibold">Where do you play?</h1>
              <p className="text-sm text-muted-foreground">So the profile link opens the right server. Cross-save accounts pick PC. You can change it later.</p>
            </div>
            <ul className="grid grid-cols-2 gap-2" aria-label="Platform">
              {d.plats.map((p) => (
                <li key={p.id}>
                  <button type="button" aria-pressed={d.plat === p.id} onClick={() => tf().introPlat(p.id)} className={cn("flex min-h-14 w-full items-center justify-between gap-2 rounded-xl border px-3 text-left text-sm font-medium transition-colors", d.plat === p.id ? "border-primary bg-primary/10" : "hover:bg-muted/60")}>
                    {p.label}{d.plat === p.id ? <Check className="size-4 shrink-0 text-primary" aria-hidden /> : null}
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <>
            <span className="grid size-14 place-items-center rounded-2xl bg-primary/15 text-primary"><Bell className="size-7" aria-hidden /></span>
            <div className="flex flex-col gap-2">
              <h1 id="fr-title" className="font-heading text-3xl leading-tight font-semibold">Want a heads-up?</h1>
              <p className="text-sm text-muted-foreground">Tennoform can tell you when something in your Foundry is ready, and when friends message you. Reset reminders are off until you turn them on in Settings.</p>
            </div>
          </>
        )}
      </div>
      <div className="mx-auto flex w-full max-w-md flex-col gap-3">
        <div className="flex justify-center gap-1.5" aria-hidden>
          {[0, 1, 2].map((i) => <span key={i} className={cn("h-1.5 rounded-full transition-all", i === step ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/40")} />)}
        </div>
        {step < 2 ? (
          <Button className="h-12 text-base" onClick={() => setStep(step + 1)}>Continue</Button>
        ) : (
          <>
            <Button className="h-12 text-base" onClick={async () => { await tf().notifEnable(); done() }}><Bell /> Turn on notifications</Button>
            <Button variant="ghost" className="h-11" onClick={done}>Not now</Button>
          </>
        )}
      </div>
    </div>
  )
}
