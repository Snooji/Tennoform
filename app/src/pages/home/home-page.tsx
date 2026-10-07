import { motion, useReducedMotion } from "motion/react"

import { tf, useTFData } from "@/lib/tf"
import { MasteryHero } from "./mastery-hero"
import { NextUp } from "./next-up"
import { GoalsCard, SignInCard, TasksCard, TodayCard, CollectionCard } from "./side-cards"
import { buttonVariants } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { TF_LINKS, openLink } from "@/components/shell/tennoform-links"
import { cn } from "@/lib/utils"
import { AlertsCard } from "@/components/tf/alerts-card"

/** Home dashboard: rank progress first, then what to do next, then today, goals and tasks. */
export function HomePage() {
  const d = useTFData(() => tf().home())
  const reduce = useReducedMotion()
  const rise = (i: number) =>
    reduce ? {} : { initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.25, delay: i * 0.04 } }
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-5 md:px-6 md:py-6">
      <motion.div {...rise(0)}>
        <MasteryHero d={d} />
      </motion.div>
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
              href="#tenno"
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
      {d.showSign ? (
        <motion.div {...rise(1)}>
          <SignInCard />
        </motion.div>
      ) : null}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
        <motion.div {...rise(2)} className="min-w-0">
          <NextUp d={d} stage={d.stage} />
        </motion.div>
        <div className="flex min-w-0 flex-col gap-4">
          <motion.div {...rise(3)}>
            <AlertsCard hideEmpty />
          </motion.div>
          <motion.div {...rise(3)}>
            <TodayCard d={d} />
          </motion.div>
          <motion.div {...rise(4)}>
            <CollectionCard />
          </motion.div>
          <motion.div {...rise(4)}>
            <GoalsCard d={d} />
          </motion.div>
          <motion.div {...rise(5)}>
            <TasksCard d={d} />
          </motion.div>
        </div>
      </div>
      <motion.div {...rise(6)}>
        <Card id="tf-home-links" size="sm" className="flex-row flex-wrap items-center gap-3 px-4">
          <p className="min-w-0 flex-1 basis-56 text-sm text-muted-foreground">
            <b className="font-medium text-foreground">Tennoform is free and made by one player.</b> Support helps keep it running, and feedback decides what gets built next.
          </p>
          <div className="flex flex-wrap gap-2">
            {TF_LINKS.map((l) => (
              <a key={l.label} href={`#${l.route}`} onClick={(e) => openLink(l, e)} className={cn(buttonVariants({ variant: l.accent ? "default" : "outline" }), "h-9 px-3")}>
                <l.icon /> {l.label}
              </a>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
