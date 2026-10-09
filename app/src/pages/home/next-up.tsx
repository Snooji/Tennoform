import { ChevronDown, ExternalLink, Plus, Check, MoonStar } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"
import { Thumb } from "@/components/tf/thumb"
import { hrefOf, runAct, tf, type HomeData, type HomeNext } from "@/lib/tf"

function NextRow({ x, n }: { x: HomeNext; n: number }) {
  return (
    <li className="flex gap-3 py-3 first:pt-0 last:pb-0">
      <div className="flex w-7 shrink-0 justify-center pt-1">
        {x.done ? (
          <Checkbox
            className="size-5 rounded-md"
            checked={false}
            onCheckedChange={() => tf().nuDone(x.i)}
            aria-label={`${x.doneLabel}: ${x.title}`}
          />
        ) : (
          <span aria-hidden className="text-sm font-semibold text-muted-foreground tabular-nums">
            {n}
          </span>
        )}
      </div>
      <Collapsible className="min-w-0 flex-1">
        <CollapsibleTrigger className="group flex w-full cursor-pointer items-start gap-3 rounded-md text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
          {x.img ? <Thumb src={x.img} className="size-10" /> : null}
          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="font-medium leading-snug group-hover:underline group-hover:decoration-primary/60 group-hover:underline-offset-4">
              {x.title}
            </span>
            {x.why ? <span className="text-sm text-muted-foreground">{x.why}</span> : null}
          </span>
          <ChevronDown aria-hidden className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform group-data-[panel-open]:rotate-180" />
        </CollapsibleTrigger>
        <CollapsibleContent className="overflow-hidden">
          <div className="mt-3 flex flex-col gap-3">
            {x.steps.length ? (
              <ul className="flex list-disc flex-col gap-1 pl-5 text-sm text-muted-foreground marker:text-primary/70">
                {x.steps.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            ) : null}
            <div className="flex flex-wrap gap-2">
              {x.open ? (
                <a
                  href={hrefOf(x.open)}
                  className={cn(buttonVariants({ variant: "outline" }), "h-9")}
                  onClick={(e) => {
                    e.preventDefault()
                    runAct(x.open!)
                  }}
                >
                  <ExternalLink /> Open
                </a>
              ) : null}
              {x.task ? (
                <Button
                  variant="outline"
                  className="h-9"
                  disabled={x.task.has}
                  onClick={() => tf().addTaskFrom(x.task!.key, x.task!.label)}
                >
                  {x.task.has ? <Check /> : <Plus />} {x.task.has ? "In your tasks" : "Task"}
                </Button>
              ) : null}
              <Button variant="ghost" className="h-9" onClick={() => tf().nuSnooze(x.i)} aria-label={`Not now: ${x.title}`}>
                <MoonStar /> Not now
              </Button>
            </div>
            {x.done ? (
              <p className="text-xs text-muted-foreground">
                Tick the box when it's done. Mistake? Undo it from{" "}
                <a href="/achievements/" className="text-foreground underline decoration-primary/60 underline-offset-4">
                  Achievements
                </a>
                .
              </p>
            ) : null}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </li>
  )
}

export function NextUp({ d, stage }: { d: HomeData; stage?: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2 id="nu-h" className="font-heading text-lg leading-tight font-semibold">Next up</h2>
        </CardTitle>
        {stage ? (
          <CardAction className="text-xs text-muted-foreground">{stage}</CardAction>
        ) : null}
        <CardDescription className="col-span-full">The most useful things to do now. Tap one for details.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {d.upNext.length ? (
          <ol className="flex flex-col divide-y" aria-labelledby="nu-h">
            {d.upNext.map((x, n) => (
              <NextRow key={x.id} x={x} n={n + 1} />
            ))}
          </ol>
        ) : (
          <p className="text-sm text-muted-foreground">
            You're all caught up. Pick something from <a className="underline decoration-primary/60 underline-offset-4" href="/goals/">Goals</a> or
            the <a className="underline decoration-primary/60 underline-offset-4" href="/mastery/">rank-up plan</a>.
          </p>
        )}
        {d.snoozed ? (
          <Button variant="link" className="h-8 self-start px-0 text-muted-foreground" onClick={() => tf().nuUnsnooze()}>
            Show {d.snoozed} snoozed suggestion{d.snoozed > 1 ? "s" : ""}
          </Button>
        ) : null}
      </CardContent>
    </Card>
  )
}
