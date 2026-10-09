import { useState, type FormEvent } from "react"
import { Check, ChevronDown, Clock, EyeOff, Eye, Lock, Pin, PinOff, Plus, Trash2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { tf, type CheckRow, type TodayData } from "@/lib/tf"

export function TaskButton({ text, expiry, has }: { text: string; expiry: string; has: boolean }) {
  return (
    <Button variant="outline" size="sm" className="h-8" disabled={has} onClick={() => tf().liveTask(text, expiry)} aria-label={(has ? "In your tasks: " : "Add to your tasks: ") + text}>
      {has ? <Check /> : <Plus />} {has ? "In tasks" : "Task"}
    </Button>
  )
}

function Row({ c }: { c: CheckRow }) {
  return (
    <li className={cn("flex gap-3 px-4 py-3", c.done && "bg-muted/30")}>
      <Checkbox
        className="mt-0.5 size-5 rounded-md"
        checked={c.done}
        disabled={c.locked}
        onCheckedChange={(v) => tf().ckTick(c.id, !!v)}
        aria-label={`Mark done: ${c.title}`}
      />
      <Collapsible className="min-w-0 flex-1">
        <CollapsibleTrigger className="group flex w-full cursor-pointer items-start gap-2 rounded-md text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="flex flex-wrap items-center gap-1.5">
              <span className={cn("font-medium", c.done && "text-muted-foreground line-through decoration-primary/70")}>{c.title}</span>
              <Badge variant="outline" className="text-muted-foreground">{c.per === "d" ? "Daily" : c.per === "b" ? "This visit" : "Weekly"}</Badge>
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground tabular-nums">
                <Clock aria-hidden className="size-3" />
                {c.done ? `resets in ${c.resetIn}` : c.per === "b" ? `leaves in ${c.resetIn}` : `${c.resetIn} left`}
              </span>
              {c.locked ? (
                <Badge variant="outline" className="border-amber-500/40 text-amber-700 dark:text-amber-400">
                  <Lock /> Locked
                </Badge>
              ) : null}
              {c.pinned ? <Pin aria-label="Pinned" className="size-3.5 fill-primary text-primary" /> : null}
            </span>
            <span className="tf-more text-sm text-muted-foreground">{c.desc}</span>
          </span>
          <ChevronDown aria-hidden className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform group-data-[panel-open]:rotate-180" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="mt-3 flex flex-col gap-3 rounded-lg border bg-muted/40 p-3 text-sm">
            {c.live ? (
              <div className="flex flex-col gap-1.5">
                {c.live.head ? <b className="font-medium">{c.live.head}</b> : null}
                {c.live.list.length ? (
                  <ol className="flex list-decimal flex-col gap-1 pl-5 marker:text-muted-foreground">
                    {c.live.list.map((l, i) => (
                      <li key={i}>
                        <b className="font-medium">{l.t}</b> · {l.s}
                        {l.n ? <div className="text-muted-foreground">{l.n}</div> : null}
                      </li>
                    ))}
                  </ol>
                ) : null}
              </div>
            ) : null}
            <p className="text-xs text-muted-foreground">
              {c.done && c.doneAt
                ? "Done " + new Date(c.doneAt).toLocaleString([], { weekday: "short", hour: "numeric", minute: "2-digit" }) + " · "
                : ""}
              {c.per === "b" ? "Leaves" : "Resets"} in {c.resetIn} ({c.resetAt} your time)
            </p>
            {c.locked ? (
              <p className="text-xs">
                Unlocks after the quest{" "}
                <a
                  href="/quests/"
                  className="underline decoration-primary/60 underline-offset-4"
                  onClick={(e) => {
                    e.preventDefault()
                    tf().act("a", { href: "#quests", "data-q": c.gate })
                  }}
                >
                  {c.gate}
                </a>
                .
              </p>
            ) : null}
            <div className="flex flex-wrap items-center gap-2">
              {c.link ? (
                <a href={"#" + c.link.route} className={cn(buttonVariants({ variant: "outline", size: "sm" }), "h-8")}>
                  {c.link.label}
                </a>
              ) : null}
              <TaskButton text={c.title} expiry={c.endIso} has={c.hasTask} />
              <span className="ml-auto flex gap-1.5">
                <Button variant="ghost" size="sm" className="h-8" onClick={() => tf().ckPin(c.id)} aria-label={(c.pinned ? "Unpin " : "Pin ") + c.title}>
                  {c.pinned ? <PinOff /> : <Pin />} {c.pinned ? "Unpin" : "Pin"}
                </Button>
                <Button variant="ghost" size="sm" className="h-8" onClick={() => tf().ckHide(c.id)} aria-label={(c.custom ? "Delete " : c.hidden ? "Show " : "Hide ") + c.title}>
                  {c.custom ? <Trash2 /> : c.hidden ? <Eye /> : <EyeOff />} {c.custom ? "Delete" : c.hidden ? "Show" : "Hide"}
                </Button>
              </span>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </li>
  )
}

export function Checklist({ d }: { d: TodayData }) {
  const FILTERS = [
    { value: "todo", label: "To do (unlocked)" },
    { value: "d", label: "Daily" },
    { value: "w", label: "Weekly" },
    { value: "all", label: "Everything" },
    { value: "locked", label: "Locked by quests" },
    { value: "hidden", label: `Hidden (${d.hiddenCount})` },
  ]
  const [text, setText] = useState("")
  const [per, setPer] = useState("d")
  const add = (e: FormEvent) => {
    e.preventDefault()
    if (tf().ckAdd(text, per)) setText("")
  }
  return (
    <Card className="gap-0 py-0">
      <CardHeader className="border-b py-3">
        <CardTitle>
          <h2 className="font-heading text-lg leading-tight font-semibold">Checklist</h2>
        </CardTitle>
        <CardAction>
          <Select items={FILTERS} value={d.filter} onValueChange={(v) => tf().todaySet({ ckF: String(v) })}>
            <SelectTrigger className="h-9 min-w-44" aria-label="Filter checklist">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FILTERS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-0">
        {d.rows.length ? (
          <ul className="flex flex-col divide-y">
            {d.rows.map((c) => (
              <Row key={c.id} c={c} />
            ))}
          </ul>
        ) : (
          <p className="px-4 py-8 text-sm text-muted-foreground">{d.filter === "todo" ? `Done for now. ${d.tiles[0]?.v ? "Daily reset in " + d.tiles[0].v + "." : ""}` : "Nothing here."}</p>
        )}
        <form onSubmit={add} className="flex flex-wrap gap-2 border-t px-4 py-3">
          <Input value={text} onChange={(e) => setText(e.target.value)} maxLength={80} placeholder="Add your own (e.g. Run Arbitration)" aria-label="Add your own checklist item" className="h-9 min-w-48 flex-1" />
          <Select items={[{ value: "d", label: "Daily" }, { value: "w", label: "Weekly" }]} value={per} onValueChange={(v) => setPer(String(v))}>
            <SelectTrigger className="h-9 w-28" aria-label="Repeats">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="d">Daily</SelectItem>
              <SelectItem value="w">Weekly</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit" className="h-9" disabled={!text.trim()}>
            <Plus /> Add
          </Button>
        </form>
        <p className="border-t px-4 py-3 text-xs text-muted-foreground">
          Warframe doesn't share daily progress, so these ticks are yours: they're saved and clear themselves at each reset. Tap an item for details; only
          the box marks it done. Pin what matters, hide what you never do.
        </p>
      </CardContent>
    </Card>
  )
}
