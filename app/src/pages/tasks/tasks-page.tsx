import { useState, type FormEvent } from "react"
import { PairTabs } from "@/components/tf/pair-tabs"
import { CalendarClock, MoreHorizontal, NotebookPen, Plus, Repeat, Trash2, UserPlus, Users, MapPin } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { hrefOf, runAct, tf, useTFData, type TaskRow, type TasksData } from "@/lib/tf"
import { SortDir } from "@/components/tf/sort-dir"

const FILTERS = [
  { value: "open", label: "To do" }, { value: "done", label: "Done" }, { value: "shared", label: "Shared with friends" }, { value: "all", label: "All" },
  { value: "res", label: "Resources" }, { value: "item", label: "Builds" }, { value: "relic", label: "Relics" }, { value: "quest", label: "Quests" },
  { value: "synd", label: "Syndicates" }, { value: "note", label: "My notes" },
]
const SORTS = [{ value: "new", label: "Newest first" }, { value: "due", label: "By due date" }, { value: "old", label: "Oldest first" }, { value: "kind", label: "By type" }]
const REPEAT = [{ value: "", label: "Never" }, { value: "d", label: "Every daily reset" }, { value: "w", label: "Every weekly reset" }]

function Editor({ x }: { x: TaskRow }) {
  const [note, setNote] = useState(x.note)
  return (
    <div className="mt-2 grid gap-3 rounded-lg border bg-muted/40 p-3 sm:grid-cols-2">
      <label className="flex flex-col gap-1.5 text-xs font-medium text-muted-foreground sm:col-span-2">
        Notes
        <Textarea
          value={note}
          maxLength={1000}
          onChange={(e) => setNote(e.target.value)}
          onBlur={() => note !== x.note && tf().taskEdit(x.id, { note })}
          placeholder="Anything to remember: node, squad, how many…"
          className="min-h-20 text-sm text-foreground"
        />
      </label>
      <div className="flex flex-col gap-1.5 text-xs font-medium text-muted-foreground">
        <span id={`rep-${x.id}`}>Repeat</span>
        <Select items={REPEAT} value={x.rep} onValueChange={(v) => tf().taskEdit(x.id, { rep: String(v ?? "") })}>
          <SelectTrigger className="h-9 w-full text-foreground" aria-labelledby={`rep-${x.id}`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {REPEAT.map((o) => <SelectItem key={o.value || "never"} value={o.value}>{o.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <label className="flex flex-col gap-1.5 text-xs font-medium text-muted-foreground">
        Due
        <Input type="date" value={x.due} onChange={(e) => tf().taskEdit(x.id, { due: e.target.value })} className="h-9 text-foreground" />
      </label>
    </div>
  )
}

function Row({ x, d }: { x: TaskRow; d: TasksData }) {
  const [edit, setEdit] = useState(false)
  return (
    <li className={cn("flex gap-3 px-4 py-3", x.done && "bg-muted/30")}>
      <Checkbox
        className="mt-0.5 size-5 rounded-md"
        checked={x.done}
        onCheckedChange={(v) => (v ? tf().taskDone(x.id, true) : tf().taskUndone(x.id))}
        aria-label={(x.done ? "Not done: " : "Done: ") + x.title}
      />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {x.open ? (
          <a
            href={hrefOf(x.open)}
            onClick={(e) => {
              e.preventDefault()
              runAct(x.open!)
            }}
            className={cn("self-start leading-snug underline decoration-primary/50 underline-offset-4 hover:decoration-primary", x.done && "text-muted-foreground line-through")}
          >
            {x.title}
          </a>
        ) : (
          <span className={cn("leading-snug", x.done && "text-muted-foreground line-through")}>{x.title}</span>
        )}
        {x.how ? <span className={cn("flex gap-1.5 text-xs text-muted-foreground", x.done && "opacity-70")}><MapPin className="mt-px size-3.5 shrink-0 text-primary/70" aria-hidden />{x.how}</span> : null}
        {x.kind || x.rep || x.due || x.note || x.with.length || x.from ? (
          <span className="flex flex-wrap items-center gap-1">
            {x.kind ? <Badge variant="outline">{x.kind}</Badge> : null}
            {x.rep ? <Badge variant="outline"><Repeat /> {x.rep === "d" ? "Daily" : "Weekly"}</Badge> : null}
            {x.due ? <Badge variant="outline" className={x.over ? "border-red-500/50 text-red-700 dark:text-red-300" : undefined}><CalendarClock /> {x.over ? "Overdue · " : "Due "}{x.due}</Badge> : null}
            {x.note ? <Badge variant="outline" className="text-muted-foreground"><NotebookPen /> Notes</Badge> : null}
            {x.with.length ? <span className="text-xs text-muted-foreground">with {x.with.join(", ")}</span> : null}
            {x.from ? <span className="text-xs text-muted-foreground">from {x.from}</span> : null}
          </span>
        ) : null}
        {edit ? <Editor x={x} /> : null}
      </div>
      <div className="flex shrink-0 items-start gap-1">
        <Button variant={edit ? "secondary" : "ghost"} size="icon-lg" className="size-9" onClick={() => setEdit(!edit)} aria-expanded={edit} aria-label={`Notes, repeat and due date: ${x.title}`}>
          <NotebookPen />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" size="icon-lg" className="size-9" aria-label={`More for ${x.title}`} />}>
            <MoreHorizontal />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-48">
            {d.signedIn && !x.done ? (
              <DropdownMenuSub>
                <DropdownMenuSubTrigger><UserPlus /> Invite a friend</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {d.friends.length ? (
                    d.friends.map((f) => (
                      <DropdownMenuItem key={f.uid} onClick={() => tf().taskInvite(x.id, f.uid)}>
                        <Users /> {f.name}
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <DropdownMenuItem onClick={() => tf().go("friends")}>Add friends first</DropdownMenuItem>
                  )}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            ) : null}
            <DropdownMenuItem onClick={() => setEdit(true)}><NotebookPen /> Notes, repeat and due</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={() => tf().taskDel(x.id)}><Trash2 /> Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </li>
  )
}

export function TasksPage() {
  const d = useTFData(() => tf().tasks())
  const [text, setText] = useState("")
  const add = (e: FormEvent) => {
    e.preventDefault()
    if (tf().addTask(text)) setText("")
  }
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-4 py-5 md:px-6 md:py-6">
      <header className="flex flex-col gap-1">
        <h1 className="font-heading text-3xl font-semibold">To-do list</h1>
        <p className="text-sm text-muted-foreground">
          Your own to-do list. Add anything, or tap <b className="text-foreground">+ Task</b> on a resource, item, relic, quest, mod, syndicate, fish or ore
          anywhere in the app. Invite friends to join you.
        </p>
      </header>
      <PairTabs pair="goals" current="tasks" />
      <form onSubmit={add} className="flex gap-2">
        <Input value={text} onChange={(e) => setText(e.target.value)} maxLength={120} placeholder="Add something you want to do" aria-label="New task" className="h-10" />
        <Button type="submit" className="h-10 px-4" disabled={!text.trim()}><Plus /> Add</Button>
      </form>
      <div className="flex flex-wrap items-center gap-2">
        <Select items={FILTERS} value={d.filter} onValueChange={(v) => tf().tasksSet({ f: String(v) })}>
          <SelectTrigger className="h-9 min-w-40" aria-label="Filter tasks"><SelectValue /></SelectTrigger>
          <SelectContent>{FILTERS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
        </Select>
        <Select items={SORTS} value={d.sort} onValueChange={(v) => tf().tasksSet({ s: String(v) })}>
          <SelectTrigger className="h-9 min-w-40" aria-label="Sort tasks"><SelectValue /></SelectTrigger>
          <SelectContent>{SORTS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
        </Select>
        <SortDir k="tkS" className="size-9" />
        <span className="text-sm text-muted-foreground tabular-nums">{d.todo} to do · {d.done} done</span>
        {d.done ? <Button variant="ghost" size="sm" className="ml-auto h-8" onClick={() => tf().taskClearDone()}>Clear done</Button> : null}
      </div>
      <Card className="gap-0 py-0">
        {d.list.length ? (
          <ul className="flex flex-col divide-y">
            {d.list.map((x) => <Row key={x.id} x={x} d={d} />)}
          </ul>
        ) : (
          <div className="flex flex-col items-start gap-2 p-6 text-sm">
            <b className="font-heading text-base font-semibold">{d.filter === "open" ? "No tasks yet." : "Nothing matches this filter."}</b>
            <p className="text-muted-foreground">
              Type above and press Enter, or add tasks from anywhere in Tennoform. For example, open{" "}
              <a href="#goals" className="text-foreground underline decoration-primary/60 underline-offset-4">Goals</a>, find a material you're short on and tap{" "}
              <b className="text-foreground">+ Task</b>.
            </p>
            {d.filter !== "open" ? <Button variant="outline" size="sm" onClick={() => tf().tasksSet({ f: "open" })}>Show my to-do tasks</Button> : null}
          </div>
        )}
      </Card>
    </div>
  )
}
