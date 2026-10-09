import { useState, type FormEvent } from "react"
import { Award, ChevronRight, Plus } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { Thumb } from "@/components/tf/thumb"
import { fmt, hrefOf, runAct, tf, type HomeData, type HomeTile } from "@/lib/tf"

const cardLink = "text-xs font-medium text-muted-foreground underline decoration-primary/50 underline-offset-4 hover:text-foreground relative after:absolute after:-inset-x-2 after:-inset-y-3 after:content-['']"

function Tile({ t }: { t: HomeTile }) {
  const href = "#" + t.route
  return (
    <a
      href={href}
      onClick={(e) => {
        if (!t.ttab) return
        e.preventDefault()
        tf().act("a", { href, "data-ttab": t.ttab })
      }}
      className="-mx-2 flex min-w-0 flex-col rounded-md px-2 py-2 transition-colors hover:bg-muted/60 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
    >
      <span className="flex items-baseline justify-between gap-3">
        <span className="truncate text-sm text-muted-foreground">{t.k}</span>
        <b className="shrink-0 font-heading text-base leading-tight font-semibold tabular-nums">{t.v}</b>
      </span>
      <span className="truncate text-xs text-muted-foreground">{t.x}</span>
      {t.total ? <Progress value={(100 * (t.done || 0)) / t.total} className="mt-1.5" aria-label={`${t.done} of ${t.total} daily items done`} /> : null}
    </a>
  )
}

export function TodayCard({ d }: { d: HomeData }) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>
          <h2 className="font-heading text-lg leading-tight font-semibold">Today</h2>
        </CardTitle>
        <CardAction>
          <a href="/today/" className={cardLink}>
            All of today
          </a>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col divide-y">
          {d.today.map((t) => (
            <li key={t.k} className="py-0.5">
              <Tile t={t} />
            </li>
          ))}
        </ul>
        <a
          href="/achievements/"
          className="-mx-2 mt-1 flex items-center gap-3 rounded-md border-t px-2 py-2.5 transition-colors hover:bg-muted/60 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          <Award aria-hidden className="size-4 text-muted-foreground" />
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="text-sm font-medium">
              Done today: {d.doneToday.n} thing{d.doneToday.n === 1 ? "" : "s"}
            </span>
            <span className="text-xs text-muted-foreground">
              {d.doneToday.xp ? `+${fmt(d.doneToday.xp)} Mastery XP · ` : ""}See or undo in Achievements
            </span>
          </span>
          <ChevronRight aria-hidden className="size-4 text-muted-foreground" />
        </a>
      </CardContent>
    </Card>
  )
}

/** What you have: owned and mastered gear, with a link to the full collection. */
export function CollectionCard() {
  const c = tf().collection()
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>
          <h2 className="font-heading text-lg leading-tight font-semibold">My collection</h2>
        </CardTitle>
        <CardAction>
          <a href="/collection/" className={cardLink}>See all</a>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
          {[["owned", c.owned], ["mastered", c.mastered], ["to level", c.level]].map(([k, v]) => (
            <a key={k as string} href="/collection/" onClick={() => tf().collectionSet({ f: k === "owned" ? "owned" : k === "mastered" ? "mastered" : "level" })} className="rounded-sm text-muted-foreground underline decoration-border underline-offset-4 hover:text-foreground hover:decoration-primary focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none">
              <b className="font-semibold text-foreground tabular-nums">{v as number}</b> {k as string}
            </a>
          ))}
        </p>
        <ul className="flex flex-col gap-1.5 text-sm">
          {c.cats.filter((x) => x.owned).sort((a, b) => b.owned - a.owned).slice(0, 4).map((x) => (
            <li key={x.id} className="flex items-center gap-2">
              <span className="min-w-0 flex-1 truncate">{x.label}</span>
              <span className="text-xs text-muted-foreground tabular-nums">{x.owned} owned · {x.mastered}/{x.total} mastered</span>
            </li>
          ))}
          {!c.owned ? <li className="text-muted-foreground">Nothing yet. Sync your profile or tap what you own on Ranks.</li> : null}
        </ul>
      </CardContent>
    </Card>
  )
}

export function GoalsCard({ d }: { d: HomeData }) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>
          <h2 className="font-heading text-lg leading-tight font-semibold">Goals</h2>
        </CardTitle>
        <CardAction>
          <a href="/goals/" className={cardLink}>
            {d.goalCount > 4 ? `All ${d.goalCount}` : "Goals"}
          </a>
        </CardAction>
      </CardHeader>
      <CardContent>
        {d.goals.length ? (
          <ul className="flex flex-col gap-1">
            {d.goals.map((g) => (
              <li key={g.name}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    tf().act("a", { href: "#", "data-go": "item|" + g.name })
                  }}
                  className="flex items-center gap-3 rounded-lg p-1.5 transition-colors hover:bg-muted/50 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  <Thumb src={g.img} className="size-9" />
                  <span className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className="truncate text-sm font-medium">{g.name}</span>
                    <Progress value={(100 * g.done) / (g.total || 1)} className="h-1" aria-label={`${g.name}: ${g.done} of ${g.total} steps`} />
                  </span>
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {g.done}/{g.total}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            Nothing tracked yet. Open any item and choose <b className="text-foreground">Track</b>.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

export function TasksCard({ d }: { d: HomeData }) {
  const [text, setText] = useState("")
  const add = (e: FormEvent) => {
    e.preventDefault()
    if (tf().addTask(text)) setText("")
  }
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>
          <h2 className="font-heading text-lg leading-tight font-semibold">My tasks</h2>
        </CardTitle>
        <CardAction>
          <a href="/tasks/" className={cardLink}>
            {d.taskCount > 6 ? `All ${d.taskCount}` : "All tasks"}
          </a>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <form onSubmit={add} className="flex gap-2">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={120}
            placeholder="Add something you want to do"
            aria-label="New task"
            className="h-9"
          />
          <Button type="submit" className="h-9" disabled={!text.trim()}>
            <Plus /> Add
          </Button>
        </form>
        {d.tasks.length ? (
          <ul className="flex flex-col divide-y">
            {d.tasks.map((x) => (
              <li key={x.id} className="flex items-start gap-3 py-2 first:pt-0 last:pb-0">
                <Checkbox className="mt-0.5 size-5 rounded-md" checked={false} onCheckedChange={() => tf().taskDone(x.id, true)} aria-label={`Done: ${x.title}`} />
                <span className="flex min-w-0 flex-1 flex-col gap-1">
                  {x.open ? (
                    <a
                      href={hrefOf(x.open)}
                      onClick={(e) => {
                        e.preventDefault()
                        runAct(x.open!)
                      }}
                      className="text-sm leading-snug underline decoration-primary/50 underline-offset-4"
                    >
                      {x.title}
                    </a>
                  ) : (
                    <span className="text-sm leading-snug">{x.title}</span>
                  )}
                  {x.kind || x.due || x.rep ? (
                    <span className="flex flex-wrap gap-1">
                      {x.kind ? <Badge variant="outline">{x.kind}</Badge> : null}
                      {x.rep ? <Badge variant="outline">{x.rep === "d" ? "Daily" : "Weekly"}</Badge> : null}
                      {x.due ? <Badge variant="outline" className={x.over ? "border-red-500/50 text-red-700 dark:text-red-300" : undefined}>{x.over ? "Overdue" : "Due " + x.due}</Badge> : null}
                    </span>
                  ) : null}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            Nothing yet. Type above, or tap <b className="text-foreground">+ Task</b> on any resource, item, relic, quest or syndicate.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

const G_LOGO = (
  <svg viewBox="0 0 48 48" aria-hidden className="size-4">
    <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.6 5.4 2.7 13.3l7.9 6.2C12.5 13.6 17.8 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.2 5.3-4.6 7l7.2 5.6c4.2-3.9 7.1-9.6 7.1-17.1z" />
    <path fill="#FBBC05" d="M10.6 28.5c-.5-1.4-.8-2.9-.8-4.5s.3-3.1.8-4.5l-7.9-6.2C1 16.6 0 20.2 0 24s1 7.4 2.7 10.7l7.9-6.2z" />
    <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.2-5.6c-2 1.4-4.7 2.3-8.7 2.3-6.2 0-11.5-4.1-13.4-9.9l-7.9 6.2C6.6 42.6 14.6 48 24 48z" />
  </svg>
)

export function SignInCard() {
  return (
    <Card size="sm" className="flex-row flex-wrap items-center gap-3 border-primary/40 px-4">
      <div className="flex min-w-0 flex-1 basis-64 flex-col gap-0.5">
        <b className="font-heading text-base font-semibold">Save your Tennoform progress to an account</b>
        <span className="text-sm text-muted-foreground">
          Free. Your ranks, goals, tasks and friends are there on any phone or computer. Linking your Warframe profile only reads the game; signing in is what saves Tennoform.
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" className="h-10 gap-2 bg-background px-4" onClick={() => tf().google()}>
          {G_LOGO} Continue with Google
        </Button>
        <a
          href="/tenno/"
          className={cn(buttonVariants({ variant: "ghost" }), "h-10 px-3")}
          onClick={(e) => {
            e.preventDefault()
            tf().account()
          }}
        >
          Use email instead
        </a>
      </div>
    </Card>
  )
}
