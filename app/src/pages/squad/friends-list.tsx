import { useEffect, useState } from "react"
import { ArrowRightLeft, BookOpen, ChevronDown, Copy, Gem, Hammer, HandHelping, MessageSquare, MoreHorizontal, Search, Star, UserMinus, UserX } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { GoLink } from "@/components/tf/go-link"
import { PersonAvatar } from "@/components/tf/person"
import { cn } from "@/lib/utils"
import { fmt, tf, useTFData, type FriendCard, type FriendHelp } from "@/lib/tf"

const SORTS = [{ value: "active", label: "Recently active" }, { value: "mr", label: "Mastery rank" }, { value: "name", label: "Name" }]
const HELP_ICON: Record<FriendHelp["k"], typeof Gem> = { give: ArrowRightLeft, relic: Gem, know: Hammer, build: BookOpen, lf: HandHelping }

/** Friends: where each one is at, how you can help them, and the usual message / remove / block. */
export function FriendsList() {
  const d = useTFData(() => tf().friendsHub())
  const [q, setQ] = useState(d.q || "")
  useEffect(() => { const t = window.setTimeout(() => { if (q !== (d.q || "")) tf().friendsHubSet({ q }) }, 150); return () => window.clearTimeout(t) }, [q, d.q])
  if (d.status !== "ok" || !d.friends) return null
  return (
    <Card className="gap-3 px-4">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="mr-auto font-heading text-lg leading-tight font-semibold">Friends <span className="text-sm font-normal text-muted-foreground tabular-nums">{d.count}</span></h2>
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find a friend" aria-label="Find a friend" className="h-9 w-44 pl-8" />
        </div>
        <Select items={SORTS} value={d.sort} onValueChange={(v) => tf().friendsHubSet({ sort: String(v) })}>
          <SelectTrigger className="h-9 min-w-36" aria-label="Sort friends"><SelectValue /></SelectTrigger>
          <SelectContent>{SORTS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      {d.friends.length ? (
        <ul className="-mx-4 flex flex-col divide-y border-t">
          {d.friends.map((f) => <Friend key={f.uid} f={f} open={d.open === f.uid} />)}
        </ul>
      ) : <p className="text-sm text-muted-foreground">{q ? "No friends match that." : "No friends yet. Share your code, or enter theirs above."}</p>}
    </Card>
  )
}

function Friend({ f, open }: { f: FriendCard; open: boolean }) {
  const helpN = f.help.length
  return (
    <li className={cn("flex flex-col gap-3 px-4 py-3", open && "bg-muted/30")}>
      <div className="flex items-start gap-3">
        <PersonAvatar name={f.name} src={f.av} className="size-11" />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="flex flex-wrap items-center gap-1.5">
            <b className="truncate font-medium">{f.name}</b>
            {f.pinned ? <Star className="size-3.5 fill-primary text-primary" aria-label="Pinned" /> : null}
            {f.pending ? <Badge variant="outline" className="text-muted-foreground">Request sent</Badge>
              : f.mrLabel ? <Badge variant="outline" className="border-primary/40 text-primary">{f.mrLabel}</Badge> : null}
            {!f.pending && f.mr != null && f.diff !== 0 ? <span className="text-xs text-muted-foreground">{Math.abs(f.diff)} {Math.abs(f.diff) === 1 ? "rank" : "ranks"} {f.diff > 0 ? "ahead of you" : "behind you"}</span> : null}
          </span>
          {f.pending ? <span className="text-xs text-muted-foreground">Waiting for them to accept your request.</span> : (
            <>
              {f.mr != null ? (
                <span className="flex items-center gap-2">
                  <Progress value={f.pct} className="h-1.5 max-w-56 flex-1" aria-label={`${f.name}: ${f.pct}% of the way to ${f.nextLabel}`} />
                  <span className="text-xs text-muted-foreground tabular-nums">{fmt(f.toNext)} XP to {f.nextLabel}</span>
                </span>
              ) : <span className="text-xs text-muted-foreground">Hasn't synced their rank yet.</span>}
              <span className="text-xs text-muted-foreground">{[f.active, f.maxed ? `${fmt(f.maxed)} mastered` : "", f.nodes ? `${fmt(f.nodes)} nodes` : ""].filter(Boolean).join(" · ")}</span>
            </>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {!f.pending ? (
            <Button variant="outline" size="sm" className="relative h-9" onClick={() => tf().chatGo("f:" + f.uid)} aria-label={`Message ${f.name}${f.unread ? `, ${f.unread} unread` : ""}`}>
              <MessageSquare /><span className="max-sm:sr-only">Message</span>
              {f.unread ? <span className="absolute -top-1.5 -right-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-xs font-semibold text-primary-foreground" aria-hidden>{f.unread > 9 ? "9+" : f.unread}</span> : null}
            </Button>
          ) : (
            <Button variant="outline" size="sm" className="h-9" onClick={() => tf().friendRemove(f.uid)}>Cancel request</Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="size-9" aria-label={`More for ${f.name}`} />}><MoreHorizontal /></DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuItem onClick={() => tf().friendPin(f.uid)}><Star /> {f.pinned ? "Unpin" : "Pin to top"}</DropdownMenuItem>
              {f.code ? <DropdownMenuItem onClick={() => tf().copy(f.code, "Friend code copied")}><Copy /> Copy their friend code</DropdownMenuItem> : null}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => { if (window.confirm(`Remove ${f.name} from your friends?`)) tf().friendRemove(f.uid) }}><UserMinus /> Remove friend</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive" onClick={() => { if (window.confirm(`Block ${f.name}? They won't be able to message you or send requests.`)) tf().friendBlock(f.uid) }}><UserX /> Block</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {!f.pending ? (
        <button type="button" onClick={() => tf().friendsHubSet({ open: f.uid })} aria-expanded={open}
          className="group flex min-h-9 items-center gap-1.5 self-start rounded-md text-sm font-medium outline-none hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50 sm:ml-14">
          <HandHelping className="size-4 text-primary" aria-hidden />
          {helpN ? `${helpN} way${helpN > 1 ? "s" : ""} you can help` : "What they're working on"}
          <ChevronDown className={cn("size-4 text-muted-foreground transition-transform", open && "rotate-180")} aria-hidden />
        </button>
      ) : null}
      {open && !f.pending ? <HelpPanel f={f} /> : null}
    </li>
  )
}

function HelpPanel({ f }: { f: FriendCard }) {
  if (f.shared === "loading") return <p className="text-sm text-muted-foreground sm:ml-14" role="status">Loading what they're working on…</p>
  if (f.shared !== "ok") return <p className="text-sm text-muted-foreground sm:ml-14">{f.name} hasn't shared what they're working on yet. It shows up here once they open Tennoform with sharing on (it's on by default).</p>
  return (
    <div className="flex flex-col gap-3 sm:ml-14">
      {f.note ? <blockquote className="border-l-2 border-primary/50 pl-3 text-sm italic">"{f.note}"</blockquote> : null}
      {f.help.length ? (
        <ul className="flex flex-col gap-1.5">
          {f.help.map((h, i) => {
            const Icon = HELP_ICON[h.k]
            return (
              <li key={i} className="flex items-start gap-2 text-sm">
                <Icon className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                <span>{h.go ? <GoLink k={h.go} className="no-underline hover:underline">{h.t}</GoLink> : h.t}</span>
              </li>
            )
          })}
        </ul>
      ) : <p className="text-sm text-muted-foreground">Nothing you own matches what they need right now. Their list is below if you want to farm with them.</p>}
      {f.lf.length ? (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-muted-foreground">Looking for help with</span>
          {f.lf.map((t) => <Badge key={t} variant="outline">{t}</Badge>)}
        </div>
      ) : null}
      {f.goals.length ? (
        <p className="text-sm"><span className="text-muted-foreground">Working on: </span>
          {f.goals.map((g, i) => <span key={g}>{i ? ", " : ""}<GoLink k={"item|" + g}>{g}</GoLink></span>)}
        </p>
      ) : null}
      {f.need.length ? (
        <details className="text-sm">
          <summary className="cursor-pointer text-muted-foreground">Still needs {f.need.length} part{f.need.length > 1 ? "s" : ""}</summary>
          <p className="mt-1">{f.need.map((n, i) => <span key={n}>{i ? ", " : ""}<GoLink k={"part|" + n}>{n}</GoLink></span>)}</p>
        </details>
      ) : null}
    </div>
  )
}

/** What you share with your friends, and what you'd like help with. */
export function MyShare() {
  const d = useTFData(() => tf().friendsHub())
  const me = d.me
  const [note, setNote] = useState(me?.note || "")
  if (d.status !== "ok" || !me) return null
  return (
    <Card size="sm" className="gap-3 px-4">
      <h2 className="font-heading text-lg leading-tight font-semibold">What your friends see</h2>
      <label className="flex min-h-10 cursor-pointer items-start gap-2.5 text-sm">
        <Checkbox className="mt-0.5 size-5 rounded-md" checked={me.on} onCheckedChange={(v) => tf().shareSet({ on: !!v })} />
        <span className="flex flex-col">
          <span className="font-medium">Share what I'm working on with my friends</span>
          <span className="text-xs text-muted-foreground">
            {me.on ? `They see the ${me.goals} gear you're tracking, the ${me.need} parts you still need, and what you'd like help with, so they can see how to help. Only people on your friends list can see it.` : "Off. Friends only see your rank and stats."}
          </span>
        </span>
      </label>
      {me.on ? (
        <>
          <fieldset className="flex flex-col gap-1.5">
            <legend className="mb-1.5 text-sm font-medium">I'd like help with</legend>
            <div className="flex flex-wrap gap-1.5">
              {d.lfTags!.map((t) => {
                const on = me.lf.includes(t)
                return (
                  <button key={t} type="button" aria-pressed={on} onClick={() => tf().shareSet({ lf: t })}
                    className={cn("min-h-9 rounded-full border px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50", on ? "border-primary/60 bg-primary/15 font-medium" : "hover:bg-muted")}>
                    {t}
                  </button>
                )
              })}
            </div>
          </fieldset>
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            A note for your friends
            <Input value={note} maxLength={120} onChange={(e) => setNote(e.target.value)} onBlur={() => note !== me.note && tf().shareSet({ note })}
              placeholder="e.g. Need a Revenant Prime Systems, can trade plat" className="h-10 font-normal" />
          </label>
        </>
      ) : null}
    </Card>
  )
}
