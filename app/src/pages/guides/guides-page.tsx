import { useEffect, useState } from "react"
import { ArrowLeft, BookOpen, Check, CircleCheck, Clock, ExternalLink, Gift, Lock, Plus, RotateCcw, Search, Swords, Unlock, X, Zap } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { tf, useTFData, type GuideCard, type GuideDetail, type GuideKind } from "@/lib/tf"

const KIND: Record<GuideKind, { label: string; icon: typeof BookOpen }> = {
  quest: { label: "Quest", icon: BookOpen },
  system: { label: "Unlock", icon: Unlock },
  mode: { label: "Mission", icon: Swords },
}
const TABS = [{ value: "all", label: "All" }, { value: "quest", label: "Quests" }, { value: "system", label: "Unlocks" }, { value: "mode", label: "Missions" }] as const
const linkCls = "underline decoration-primary/50 underline-offset-4 hover:decoration-primary"

function Status({ g }: { g: GuideCard }) {
  if (g.done) return <Badge variant="outline" className="border-emerald-600/40 text-emerald-700 dark:text-emerald-400"><Check /> Done</Badge>
  if (g.doneSteps) return <Badge variant="outline" className="border-primary/40 text-primary">{g.doneSteps}/{g.steps} steps</Badge>
  if (!g.ready) return <Badge variant="outline" className="text-muted-foreground"><Lock /> Needs more</Badge>
  return null
}

function GuideList({ list }: { list: GuideCard[] }) {
  if (!list.length) return <p className="py-8 text-center text-sm text-muted-foreground">No guides match. Try a shorter word, like "helminth" or "railjack".</p>
  return (
    <ul className="grid gap-3 md:grid-cols-2">
      {list.map((g) => {
        const K = KIND[g.kind]
        return (
          <li key={g.id}>
            <button type="button" onClick={() => tf().guidesSet({ sel: g.id })}
              className="tf-glass flex h-full w-full flex-col gap-2 rounded-2xl p-4 text-left ring-1 ring-foreground/8 transition-colors outline-none hover:bg-muted/40 focus-visible:ring-3 focus-visible:ring-ring/50">
              <span className="flex items-start gap-3">
                <span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/12 text-primary"><K.icon className="size-4" /></span>
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <b className="font-heading text-lg leading-tight font-semibold">{g.n}</b>
                  <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                    {K.label}{g.steps ? ` · ${g.steps} steps` : ""}
                  </span>
                </span>
                <Status g={g} />
              </span>
              {g.sum ? <span className="line-clamp-2 text-sm text-muted-foreground">{g.sum}</span> : null}
            </button>
          </li>
        )
      })}
    </ul>
  )
}

function Section({ icon: Icon, title, children }: { icon: typeof BookOpen; title: string; children: React.ReactNode }) {
  return (
    <Card className="gap-3 px-5">
      <h2 className="flex items-center gap-2 font-heading text-lg leading-tight font-semibold"><Icon className="size-4.5 text-primary" aria-hidden /> {title}</h2>
      {children}
    </Card>
  )
}

function Detail({ g }: { g: GuideDetail }) {
  const K = KIND[g.kind]
  const u = g.unlock
  const hasReq = u.mr != null || u.quests.length || u.other.length
  const left = g.stepList.length - g.stepList.filter((s) => s.done).length
  return (
    <div className="flex flex-col gap-4">
      <Button variant="ghost" className="h-9 self-start px-2" onClick={() => tf().guidesSet({ sel: null })}><ArrowLeft /> All guides</Button>
      <header className="flex flex-col gap-2">
        <span className="flex items-center gap-2 text-xs text-muted-foreground"><K.icon className="size-3.5" aria-hidden /> {K.label} guide{g.time ? <><span aria-hidden>·</span><Clock className="size-3.5" aria-hidden /> {g.time}</> : null}</span>
        <h1 className="font-heading text-3xl font-semibold">{g.n}</h1>
        {g.sum ? <p className="max-w-3xl text-sm text-muted-foreground">{g.sum}</p> : null}
        <div className="flex flex-wrap gap-2 pt-1">
          <Button variant="outline" className="h-9" disabled={g.hasTask} onClick={() => tf().guideTask(g.id)}>{g.hasTask ? <Check /> : <Plus />} {g.hasTask ? "In tasks" : "Add to tasks"}</Button>
          {g.questKey ? <Button variant="outline" className="h-9" onClick={() => tf().open(g.questKey)}><BookOpen /> Open in Quests</Button> : null}
          {g.w ? <a href={g.w} target="_blank" rel="noopener" className="inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-sm font-medium hover:bg-muted">Wiki <ExternalLink className="size-3.5" aria-hidden /><span className="sr-only">(opens in a new tab)</span></a> : null}
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
        <div className="flex min-w-0 flex-col gap-4">
          {hasReq ? (
            <Section icon={u.ready ? CircleCheck : Lock} title={u.ready ? "You can do this now" : "What you need first"}>
              <ul className="flex flex-col gap-2 text-sm">
                {u.mr != null ? (
                  <li className="flex items-center gap-2">
                    {u.mrOk ? <Check className="size-4 text-emerald-700 dark:text-emerald-400" aria-label="Met" /> : <Lock className="size-4 text-amber-700 dark:text-amber-400" aria-label="Not yet" />}
                    Mastery Rank {u.mr} <span className="text-muted-foreground">(you're MR {u.mrHave})</span>
                  </li>
                ) : null}
                {u.quests.map((q) => (
                  <li key={q.n} className="flex flex-wrap items-center gap-2">
                    {q.done ? <Check className="size-4 text-emerald-700 dark:text-emerald-400" aria-label="Done" /> : <Lock className="size-4 text-amber-700 dark:text-amber-400" aria-label="Not done" />}
                    Finish {q.guide ? <a href="#guides" className={linkCls} onClick={(e) => { e.preventDefault(); tf().guidesSet({ sel: q.guide }) }}>{q.n}</a> : <b className="font-medium">{q.n}</b>}
                  </li>
                ))}
                {u.other.map((o) => <li key={o} className="flex gap-2"><span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-primary/60" />{o}</li>)}
              </ul>
            </Section>
          ) : null}

          {g.stepList.length ? (
            <Section icon={BookOpen} title="Step by step">
              <p className="-mt-1 text-xs text-muted-foreground">Tick each step as you go. {left ? `${left} left.` : "All done!"} Your progress is saved.</p>
              <ol className="flex flex-col">
                {g.stepList.map((s, i) => (
                  <li key={i} className="flex gap-3 border-b py-3 last:border-0">
                    <Checkbox className="mt-0.5 size-5 rounded-md" checked={s.done} onCheckedChange={(v) => tf().guideStep(g.id, i, !!v)} aria-label={`Step ${i + 1} done`} />
                    <div className="flex min-w-0 flex-col gap-1">
                      <span className={cn("text-sm", s.done && "text-muted-foreground line-through decoration-primary/60")}>
                        <b className="mr-1.5 font-heading font-semibold text-primary">{i + 1}.</b>{s.t}
                      </span>
                      {s.tip ? <span className="rounded-lg bg-muted/50 px-2.5 py-1.5 text-xs text-muted-foreground">Tip: {s.tip}</span> : null}
                    </div>
                  </li>
                ))}
              </ol>
              {g.doneSteps ? <Button variant="ghost" size="sm" className="h-8 self-start" onClick={() => tf().guideReset(g.id)}><RotateCcw /> Clear ticks</Button> : null}
            </Section>
          ) : null}
        </div>

        <div className="flex min-w-0 flex-col gap-4">
          {g.fast.length ? (
            <Section icon={Zap} title="Fastest way">
              <ul className="flex flex-col gap-2 text-sm">
                {g.fast.map((f) => <li key={f} className="flex gap-2"><Zap className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden />{f}</li>)}
              </ul>
            </Section>
          ) : null}
          {g.rw.length ? (
            <Section icon={Gift} title="Rewards">
              <ul className="flex flex-wrap gap-1.5">{g.rw.map((r) => <li key={r} className="rounded-full border px-2.5 py-0.5 text-xs">{r}</li>)}</ul>
            </Section>
          ) : null}
          {g.go.length || g.opens.length ? (
            <Section icon={ExternalLink} title="Related">
              {g.go.length ? (
                <ul className="flex flex-wrap gap-1.5">
                  {g.go.map((x) => <li key={x.n}><Button variant="outline" size="sm" className="h-8 rounded-full" onClick={() => tf().open(x.key)}>{x.n}</Button></li>)}
                </ul>
              ) : null}
              {g.opens.length ? (
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs text-muted-foreground">Finishing this opens up</span>
                  <ul className="flex flex-wrap gap-1.5">
                    {g.opens.map((x) => <li key={x.id}><Button variant="outline" size="sm" className="h-8 rounded-full" onClick={() => tf().guidesSet({ sel: x.id })}>{x.n}</Button></li>)}
                  </ul>
                </div>
              ) : null}
            </Section>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export function GuidesPage() {
  const d = useTFData(() => tf().guides())
  const [q, setQ] = useState(d.q)
  useEffect(() => {
    const t = window.setTimeout(() => q !== d.q && tf().guidesSet({ q }), 140)
    return () => window.clearTimeout(t)
  }, [q, d.q])
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-5 md:px-6 md:py-6">
      {d.sel ? <Detail g={d.sel} /> : (
        <>
          <header className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Plan</span>
            <h1 className="font-heading text-3xl font-semibold">Guides</h1>
            <p className="max-w-2xl text-sm text-muted-foreground">
              How to unlock and finish every quest, system and mission type, step by step, with the quickest way through. {d.total ? `${d.total} guides.` : ""}
            </p>
          </header>
          <div className="relative">
            <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder='What do you want to unlock? e.g. "helminth", "railjack", "steel path"' aria-label="Search guides" className="h-11 rounded-full pr-10 pl-9" />
            {q ? <Button variant="ghost" size="icon-sm" className="absolute top-1/2 right-2 -translate-y-1/2" onClick={() => setQ("")} aria-label="Clear search"><X /></Button> : null}
          </div>
          <Tabs value={d.filter} onValueChange={(v) => tf().guidesSet({ filter: String(v) })}>
            <div className="-mx-4 overflow-x-auto px-4 pb-1 md:mx-0 md:px-0">
              <TabsList className="min-w-max justify-start">
                {TABS.map((t) => <TabsTrigger key={t.value} value={t.value} className="flex-none px-3">{t.label} <span className="ml-1 text-xs tabular-nums">{d.counts[t.value]}</span></TabsTrigger>)}
              </TabsList>
            </div>
          </Tabs>
          <GuideList list={d.list} />
        </>
      )}
    </div>
  )
}
