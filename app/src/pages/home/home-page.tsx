import { tf, useTFData } from "@/lib/tf"
import { MasteryHero } from "./mastery-hero"
import { NextUp } from "./next-up"
import { GoalsCard, SignInCard, TasksCard, TodayCard, CollectionCard } from "./side-cards"
import { buttonVariants } from "@/components/ui/button"
import { TF_LINKS, openLink } from "@/components/shell/tennoform-links"
import { cn } from "@/lib/utils"
import { AlertsCard } from "@/components/tf/alerts-card"
import { pagePath } from "@/lib/page-path"

/** Home dashboard: rank progress first, then what to do next, then today, goals and tasks. */
export function HomePage() {
  const d = useTFData(() => tf().home())
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-5 md:px-6 md:py-6">
      <MasteryHero d={d} />
      {d.since.length || d.foundryReady ? (
        <p className="-mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 px-1 text-sm">
          <span className="text-muted-foreground">Since last time:</span>
          {d.since.map((s) => (
            <span key={s} className="font-medium">
              {s}
            </span>
          ))}
          {d.foundryReady ? (
            <a
              href="/tenno/"
              onClick={(e) => {
                e.preventDefault()
                tf().act("a", { href: "#tenno", "data-ttab": "foundry" })
              }}
              className="font-medium underline decoration-primary/60 underline-offset-4"
            >
              {d.foundryReady} ready in the Foundry
            </a>
          ) : null}
        </p>
      ) : null}
      {d.showSign ? <SignInCard /> : null}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
        <div className="min-w-0">
          <NextUp d={d} stage={d.stage} />
        </div>
        <div className="flex min-w-0 flex-col gap-4">
          <AlertsCard hideEmpty />
          <TodayCard d={d} />
          <CollectionCard />
          <GoalsCard d={d} />
          <TasksCard d={d} />
        </div>
      </div>
      <section id="tf-home-links" aria-label="Support Tennoform" className="flex flex-wrap items-center gap-3 border-t pt-4">
          <p className="min-w-0 flex-1 basis-56 text-sm text-muted-foreground">
            <b className="font-medium text-foreground">Tennoform is free and made by one player.</b> Support helps keep it running, and feedback decides what gets built next.
          </p>
          <div className="flex flex-wrap gap-2">
            {TF_LINKS.map((l) => (
              <a key={l.label} href={pagePath(l.route)} onClick={(e) => openLink(l, e)} className={cn(buttonVariants({ variant: l.accent ? "default" : "outline" }), "h-9 px-3")}>
                <l.icon /> {l.label}
              </a>
            ))}
          </div>
      </section>
    </div>
  )
}
