import { memo, useEffect, useState } from "react"
import { Check, ChevronDown, ChevronsDown, ExternalLink, Gift, Lock, Plus, Sparkles } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { fmt, tf, useTFData, type QuestRow } from "@/lib/tf"

const FILTERS = [{ value: "all", label: "All quests" }, { value: "avail", label: "Available now" }, { value: "todo", label: "Not done" }, { value: "locked", label: "Locked" }, { value: "done", label: "Done" }]
const linkCls = "underline decoration-primary/50 underline-offset-4 hover:decoration-primary"
const goQuest = (n: string) => (e: React.MouseEvent) => {
  e.preventDefault()
  tf().act("a", { href: "#quests", "data-q": n })
}

const Quest = memo(function Quest({ q }: { q: QuestRow }) {
  return (
    <li id={q.id} className={cn("flex gap-3 px-4 py-3 transition-colors duration-700", q.done && "bg-muted/30")}>
      <Checkbox className="mt-0.5 size-5 rounded-md" checked={q.done} onCheckedChange={(v) => tf().questTick(q.n, !!v)} aria-label={(q.done ? "Not done: " : "Mark done: ") + q.n} />
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className={cn("font-medium", q.done && "text-muted-foreground line-through decoration-primary/70")}>{q.n}</span>
          {q.locked && !q.done ? <Badge variant="outline" className="border-amber-500/40 text-amber-700 dark:text-amber-400"><Lock /> Locked</Badge> : null}
          {q.wiki ? (
            <a href={q.wiki} target="_blank" rel="noopener" className={cn("inline-flex items-center gap-1 text-xs text-muted-foreground", linkCls)}>
              Wiki <ExternalLink className="size-3" aria-hidden /><span className="sr-only">(opens in a new tab)</span>
            </a>
          ) : null}
        </div>
        {q.desc && !q.done ? <p className="text-sm text-muted-foreground">{q.desc}</p> : null}
        {q.req.length ? (
          <p className="text-sm">
            <span className="text-muted-foreground">Needs: </span>
            {q.req.map((r, i) => (
              <span key={i}>
                {i ? " · " : ""}
                {r.quest ? (
                  <a href="#quests" onClick={goQuest(r.quest)} className={cn(linkCls, r.done ? "text-emerald-700 dark:text-emerald-400" : "text-amber-700 dark:text-amber-400")}>
                    {r.done ? <Check className="mr-0.5 inline size-3.5" aria-label="done" /> : null}{r.text}
                  </a>
                ) : (
                  r.text
                )}
              </span>
            ))}
          </p>
        ) : null}
        {q.rewards.length || !q.done ? (
          <div className="flex flex-wrap items-center gap-2">
            {!q.done ? (
              <Button variant="outline" size="sm" className="h-8" disabled={q.hasTask} onClick={() => tf().addTaskFrom("quest|" + q.n, "Do quest: " + q.n)} aria-label={(q.hasTask ? "In your tasks: " : "Add task: ") + q.n}>
                {q.hasTask ? <Check /> : <Plus />} {q.hasTask ? "In tasks" : "Task"}
              </Button>
            ) : null}
            {!q.done && q.upto ? (
              <Button variant="ghost" size="sm" className="h-8" onClick={() => tf().questUpto(q.n)} aria-label={`Mark every quest up to ${q.n} done`}>
                <ChevronsDown /> Done to here
              </Button>
            ) : null}
            {q.rewards.length ? (
              <Collapsible className="basis-full">
                <CollapsibleTrigger className="group inline-flex cursor-pointer items-center gap-1.5 rounded-md text-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50">
                  <Gift className="size-4" aria-hidden /> Rewards ({q.rewards.length})
                  <ChevronDown aria-hidden className="size-3.5 transition-transform group-data-[panel-open]:rotate-180" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <ul className="mt-2 flex flex-col gap-1 border-l-2 border-primary/30 pl-3 text-sm">
                    {q.rewards.map((r, i) => (
                      <li key={i} className="flex flex-wrap items-center gap-2">
                        {r.go ? (
                          <a href="#" onClick={(e) => { e.preventDefault(); tf().act("a", { href: "#", "data-go": r.go }) }} className={linkCls}>{r.text}</a>
                        ) : (
                          <span>{r.text}</span>
                        )}
                        {r.xp ? (
                          r.left > 0 ? <Badge variant="outline" className="border-primary/40 text-primary">+{fmt(r.left)} MR XP</Badge> : <Badge variant="outline" className="text-muted-foreground"><Check /> Mastered</Badge>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </CollapsibleContent>
              </Collapsible>
            ) : null}
          </div>
        ) : null}
      </div>
    </li>
  )
})

export function QuestsPage() {
  const d = useTFData(() => tf().quests())
  const [closed, setClosed] = useState<Record<string, boolean>>({})
  useEffect(() => {
    if (!d.focus) return
    const id = "q-" + d.focus.replace(/\W/g, "")
    const g = d.groups.find((x) => x.quests.some((q) => q.id === id))
    if (g && closed[g.name]) setClosed((c) => ({ ...c, [g.name]: false }))
    const t = window.setTimeout(() => {
      tf().questFocused()
      const el = document.getElementById(id)
      if (!el) return
      el.scrollIntoView({ block: "center", behavior: "smooth" })
      el.classList.add("bg-primary/15")
      window.setTimeout(() => el.classList.remove("bg-primary/15"), 1600)
    }, 60)
    return () => window.clearTimeout(t)
  }, [d.focus, d.groups, closed])
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-4 py-5 md:px-6 md:py-6">
      <header className="flex flex-col gap-1">
        <h1 className="font-heading text-3xl font-semibold">Quests</h1>
        <p className="text-sm text-muted-foreground">Story order from the in-game Codex, with requirements and rewards from the wiki. {d.done}/{d.total} done.</p>
      </header>
      {d.next ? (
        <Card size="sm" className="flex-row items-center gap-3 border-primary/30 bg-primary/5 px-4 ring-primary/25">
          <Sparkles aria-hidden className="size-5 shrink-0 text-primary" />
          <span className="flex-1 text-sm">
            Next: <a href="#quests" onClick={goQuest(d.next)} className={cn("font-semibold", linkCls)}>{d.next}</a>
          </span>
        </Card>
      ) : null}
      <Select items={FILTERS} value={d.filter} onValueChange={(v) => tf().questsSet({ f: String(v) })}>
        <SelectTrigger className="h-9 min-w-44 self-start" aria-label="Filter quests"><SelectValue /></SelectTrigger>
        <SelectContent>{FILTERS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
      </Select>
      {d.groups.length ? (
        d.groups.map((g) => (
          <Card key={g.name} className="gap-0 py-0">
            <Collapsible open={!closed[g.name]} onOpenChange={(o) => setClosed((c) => ({ ...c, [g.name]: !o }))}>
              <CollapsibleTrigger className="group flex w-full cursor-pointer flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3 text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
                <h2 className="font-heading text-lg leading-tight font-semibold">{g.name}</h2>
                <span className="text-xs text-muted-foreground tabular-nums">{g.done}/{g.total}</span>
                <Progress value={(100 * g.done) / (g.total || 1)} className="h-1 min-w-24 flex-1" aria-label={`${g.name}: ${g.done} of ${g.total} done`} />
                <ChevronDown aria-hidden className="size-4 text-muted-foreground transition-transform group-data-[panel-open]:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <ul className="flex flex-col divide-y border-t">
                  {g.quests.map((q) => <Quest key={q.n} q={q} />)}
                </ul>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))
      ) : (
        <Card className="p-6 text-sm text-muted-foreground">No quests match this filter.</Card>
      )}
    </div>
  )
}
