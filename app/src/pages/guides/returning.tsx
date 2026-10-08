import { History } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { linkCls } from "@/components/tf/go-link"
import { tf, useTFData } from "@/lib/tf"

/** "Coming back after a break?": pick when you stopped, see what changed since, and the quests to play next in order. */
export function Returning() {
  const d = useTFData(() => tf().returning())
  const items = [{ value: "none", label: "Choose…" }, ...d.options]
  return (
    <Card className="gap-0 py-0">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3">
        <History aria-hidden className="size-4 text-muted-foreground" />
        <h2 className="font-heading text-lg leading-tight font-semibold">Coming back after a break?</h2>
        <label className="ml-auto flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">I last played</span>
          <Select items={items} value={d.from || "none"} onValueChange={(v) => tf().returningSet(v === "none" ? "" : String(v ?? ""))}>
            <SelectTrigger className="h-9 min-w-36" aria-label="When did you last play?">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {items.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </label>
      </div>
      {d.from ? (
        <div className="grid gap-x-6 border-t md:grid-cols-2">
          <section className="flex flex-col gap-2 px-4 py-3">
            <h3 className="font-heading text-base font-semibold">Play these next, in this order</h3>
            {d.quests.length ? (
              <ol className="flex list-decimal flex-col gap-1.5 pl-5 text-sm marker:text-muted-foreground">
                {d.quests.map((q) => (
                  <li key={q.n}>
                    <a href="#quests" className={linkCls} onClick={(e) => { e.preventDefault(); tf().act("a", { href: "#quests", "data-q": q.n }) }}>{q.n}</a>
                    {q.isNew && !d.assumed ? <Badge variant="outline" className="ml-2 text-muted-foreground">New since you left</Badge> : null}
                    {q.why ? <div className="text-muted-foreground">{q.why}</div> : null}
                  </li>
                ))}
              </ol>
            ) : <p className="text-sm">You've done every main quest. Nice.</p>}
            <p className="text-xs text-muted-foreground">
              {[d.assumed ? "" : `${d.questsDone}/${d.questsTotal} main quests done.`, d.moreQuests ? `${d.moreQuests} more after these.` : ""].filter(Boolean).join(" ")}{" "}
              {d.assumed
                ? "This assumes you finished the quests that were out before you stopped. Sync your profile (Tenno page) for an exact list."
                : d.synced ? "Quests come from your last sync and your own ticks on the Quests page." : "Tick quests on the Quests page, or sync your profile, so finished ones drop off this list."}
            </p>
          </section>
          <section className="flex flex-col gap-2 border-t px-4 py-3 md:border-t-0 md:border-l">
            <h3 className="font-heading text-base font-semibold">What's new since then</h3>
            {d.updates.length ? (
              <ul className="flex flex-col divide-y border-y text-sm">
                {d.updates.slice().reverse().map((u) => (
                  <li key={u.n} className="flex flex-col gap-0.5 py-2">
                    <span className="flex flex-wrap items-baseline justify-between gap-x-3"><b className="font-medium">{u.n}</b><span className="text-xs text-muted-foreground tabular-nums">{u.date}</span></span>
                    <span className="text-muted-foreground">{u.t}</span>
                  </li>
                ))}
              </ul>
            ) : <p className="text-sm text-muted-foreground">No major updates since then.</p>}
            <p className="text-xs text-muted-foreground">Newest first. Major updates only; see the Warframe wiki for every patch.</p>
          </section>
        </div>
      ) : (
        <p className="border-t px-4 py-3 text-sm text-muted-foreground">Pick roughly when you stopped playing to see what changed since then and which quests to play next.</p>
      )}
    </Card>
  )
}
