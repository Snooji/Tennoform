import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { ArrowLeft, Check, Copy, EllipsisVertical, Flag, ListPlus, LogOut, Plus, Send, ShieldBan, UserMinus, UserPlus, Users } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
  DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { tf, useTFData, type SquadData, type SquadMsg } from "@/lib/tf"
import { SignInCard } from "@/pages/home/side-cards"
import { HaloSegmented } from "@/components/ui/halo-segmented"
import { Community } from "./community"

const initial = (n: string) => (n.trim()[0] || "T").toUpperCase()

function Head() {
  return (
    <header className="flex flex-col gap-1">
      <span className="text-xs text-muted-foreground">Squad</span>
      <h1 className="font-heading text-3xl font-semibold">Friends</h1>
      <p className="max-w-2xl text-sm text-muted-foreground">Add friends with their friend code, chat one-on-one or in groups, and invite them to join your tasks.</p>
    </header>
  )
}

function CodeCards({ d }: { d: SquadData }) {
  const [code, setCode] = useState("")
  const add = () => { if (code.trim()) { tf().friendAdd(code); setCode("") } }
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <Card size="sm" className="flex-row items-center gap-3 px-4">
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="text-xs text-muted-foreground">Your friend code</span>
          <b className="font-mono text-2xl tracking-[0.2em] text-primary">{d.code || "……"}</b>
        </div>
        <Button variant="outline" className="h-10" disabled={!d.code} onClick={() => tf().copy(d.code, "Friend code copied")}><Copy /> Copy</Button>
      </Card>
      <Card size="sm" className="gap-2 px-4">
        <label htmlFor="sq-code" className="text-xs text-muted-foreground">Add a friend</label>
        <div className="flex gap-2">
          <Input id="sq-code" value={code} onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))} onKeyDown={(e) => e.key === "Enter" && add()}
            maxLength={6} autoComplete="off" placeholder="Their 6-character code" className="h-10 font-mono tracking-widest uppercase placeholder:font-sans placeholder:tracking-normal placeholder:normal-case" />
          <Button className="h-10 px-4" disabled={code.length !== 6} onClick={add}><UserPlus /> Send</Button>
        </div>
      </Card>
    </div>
  )
}

function Requests({ d }: { d: SquadData }) {
  if (!d.requests.length) return null
  return (
    <Card size="sm" className="gap-2 border-primary/30 px-4 ring-primary/25">
      <h2 className="font-heading text-lg leading-tight font-semibold">Friend requests</h2>
      <ul className="flex flex-col divide-y">
        {d.requests.map((r) => (
          <li key={r.id} className="flex flex-wrap items-center gap-3 py-2">
            <Avatar className="size-9"><AvatarFallback className="bg-primary/15 font-heading text-primary">{initial(r.name)}</AvatarFallback></Avatar>
            <span className="flex min-w-0 flex-1 flex-col"><b className="truncate text-sm font-medium">{r.name}</b><span className="font-mono text-xs text-muted-foreground">{r.code}</span></span>
            <span className="flex gap-2">
              <Button size="sm" className="h-9 px-3" onClick={() => tf().friendAccept(r.id)}><Check /> Accept</Button>
              <Button variant="outline" size="sm" className="h-9 px-3" onClick={() => tf().friendDecline(r.id)}>Decline</Button>
            </span>
          </li>
        ))}
      </ul>
    </Card>
  )
}

function NewGroup({ d }: { d: SquadData }) {
  const [name, setName] = useState("")
  const [pick, setPick] = useState<string[]>([])
  const close = () => tf().squadSet({ newGroup: false })
  return (
    <Card size="sm" className="gap-3 px-4">
      <h2 className="font-heading text-lg leading-tight font-semibold">New group chat</h2>
      {d.pickable.length ? (
        <>
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Group name
            <Input value={name} onChange={(e) => setName(e.target.value)} maxLength={40} placeholder="e.g. Eidolon squad" className="h-10 font-normal" />
          </label>
          <fieldset className="flex flex-col gap-1.5">
            <legend className="mb-1.5 text-sm font-medium">Who's in it</legend>
            <div className="grid gap-1 sm:grid-cols-2">
              {d.pickable.map((f) => {
                const on = pick.includes(f.uid)
                return (
                  <label key={f.uid} className="flex min-h-10 cursor-pointer items-center gap-2.5 rounded-xl px-2 text-sm hover:bg-muted/60">
                    <Checkbox className="size-5 rounded-md" checked={on} onCheckedChange={(v) => setPick(v ? [...pick, f.uid] : pick.filter((x) => x !== f.uid))} />
                    {f.name}
                  </label>
                )
              })}
            </div>
          </fieldset>
          <div className="flex gap-2">
            <Button className="h-10 px-4" onClick={async () => { if (await tf().groupCreate(name, pick)) { setName(""); setPick([]) } }}>Create group</Button>
            <Button variant="outline" className="h-10" onClick={close}>Cancel</Button>
          </div>
        </>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">Add at least one friend first, then start a group with them.</p>
          <Button variant="outline" className="h-10 self-start" onClick={close}>Close</Button>
        </>
      )}
    </Card>
  )
}

function ListItem({ active, title, sub, unread, badge, onClick, group }: {
  active: boolean; title: string; sub: string; unread: number; badge?: string; onClick: () => void; group?: boolean
}) {
  return (
    <li>
      <button type="button" onClick={onClick} aria-current={active ? "true" : undefined}
        className={cn("flex min-h-14 w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left outline-none hover:bg-muted/60 focus-visible:ring-3 focus-visible:ring-ring/50", active && "bg-primary/12 hover:bg-primary/15")}>
        <Avatar className="size-9">
          <AvatarFallback className={cn("font-heading", group ? "bg-muted text-foreground" : "bg-primary/15 text-primary")}>{group ? <Users className="size-4" /> : initial(title)}</AvatarFallback>
        </Avatar>
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="flex items-center gap-1.5"><b className="truncate text-sm font-medium">{title}</b>{badge ? <Badge variant="outline" className="text-muted-foreground">{badge}</Badge> : null}</span>
          {sub ? <span className="truncate text-xs text-muted-foreground">{sub}</span> : null}
        </span>
        {unread ? <span className="grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1.5 text-xs font-semibold text-primary-foreground" aria-label={`${unread} unread`}>{unread > 9 ? "9+" : unread}</span> : null}
      </button>
    </li>
  )
}

function People({ d }: { d: SquadData }) {
  const cur = d.chat ? (d.chat.type === "group" ? "g:" + d.chat.id : d.chat.id) : null
  return (
    <nav aria-label="Chats" className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-medium text-muted-foreground">Groups</h2>
          <Button variant="ghost" size="sm" className="h-8" onClick={() => tf().squadSet({ newGroup: true })}><Plus /> New group</Button>
        </div>
        {d.groups.length ? (
          <ul className="flex flex-col gap-0.5">
            {d.groups.map((g) => <ListItem key={g.id} group active={cur === "g:" + g.id} title={g.name} sub={`${g.members} members`} unread={g.unread} onClick={() => tf().squadSet({ chat: "g:" + g.id })} />)}
          </ul>
        ) : <p className="px-1 text-sm text-muted-foreground">No groups yet.</p>}
      </div>
      <div className="flex flex-col gap-1">
        <h2 className="px-1 text-xs font-medium text-muted-foreground">Friends</h2>
        {d.friends.length ? (
          <ul className="flex flex-col gap-0.5">
            {d.friends.map((f) => (
              <ListItem key={f.uid} active={cur === f.uid} title={f.name} badge={f.pending ? "Pending" : ""} sub={[f.mr, f.xp].filter(Boolean).join(" · ")} unread={f.unread}
                onClick={() => tf().squadSet({ chat: f.uid })} />
            ))}
          </ul>
        ) : <p className="px-1 text-sm text-muted-foreground">No friends yet. Share your code, or enter theirs above.</p>}
      </div>
    </nav>
  )
}

function Bubble({ m, group }: { m: SquadMsg; group: boolean }) {
  if (m.kind === "sys") return <li className="self-center rounded-full bg-muted/60 px-3 py-1 text-xs text-muted-foreground">{m.text}</li>
  let body: React.ReactNode = m.text
  if (m.kind === "invite") body = (
    <>
      <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground"><ListPlus className="size-3.5" aria-hidden /> Task invite</span>
      <b className="font-medium">{m.task}</b>
      {m.ans ? <span className="text-xs text-muted-foreground">{m.ans === "ok" ? "You joined" : "You declined"}</span> : (
        <span className="mt-1 flex gap-2">
          <Button size="sm" className="h-8 px-3" onClick={() => tf().inviteAnswer(m.id, true)}>Join</Button>
          {!group ? <Button variant="outline" size="sm" className="h-8 px-3" onClick={() => tf().inviteAnswer(m.id, false)}>Decline</Button> : null}
        </span>
      )}
    </>
  )
  if (m.kind === "sentInvite") body = <><span className="text-xs opacity-80">{group ? "You invited the group to" : "You invited them to"}</span><b className="font-medium">{m.task}</b></>
  if (m.kind === "joined") body = <span>Joined: <b className="font-medium">{m.task || "your task"}</b></span>
  if (m.kind === "declined") body = <span>Can't join: <b className="font-medium">{m.task || "your task"}</b></span>
  if (m.kind === "done") body = <span className="flex items-center gap-1.5"><Check className="size-4" aria-hidden /> Finished: <b className="font-medium">{m.task}</b></span>
  return (
    <li className={cn("flex max-w-[85%] flex-col gap-0.5", m.mine ? "items-end self-end" : "items-start self-start")}>
      {m.who ? <span className="px-1 text-xs font-medium text-muted-foreground">{m.who}</span> : null}
      <div className={cn("flex flex-col gap-0.5 rounded-2xl px-3.5 py-2 text-sm break-words whitespace-pre-wrap", m.mine ? "rounded-br-md bg-primary text-primary-foreground" : "rounded-bl-md bg-muted")}>{body}</div>
      <span className="px-1 text-[11px] text-muted-foreground tabular-nums">{m.time}</span>
    </li>
  )
}

function ChatMenu({ d }: { d: SquadData }) {
  const c = d.chat!
  const [armed, setArmed] = useState<string | null>(null)
  const confirm = (k: string, fn: () => void) => () => {
    if (armed === k) { fn(); setArmed(null); return }
    setArmed(k)
  }
  return (
    <DropdownMenu onOpenChange={(o) => !o && setArmed(null)}>
      <DropdownMenuTrigger render={<Button variant="outline" size="icon" className="size-10" aria-label={`More for ${c.name}`} />}><EllipsisVertical /></DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuSub>
          <DropdownMenuSubTrigger disabled={c.pending || !d.tasks.length}><ListPlus /> Invite to a task</DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="max-h-72 w-64 overflow-y-auto">
            {d.tasks.map((t) => <DropdownMenuItem key={t.id} onClick={() => tf().inviteTask(t.id)}><span className="truncate">{t.t}</span></DropdownMenuItem>)}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        {c.type === "group" ? (
          <>
            {c.addable.length ? (
              <DropdownMenuSub>
                <DropdownMenuSubTrigger><UserPlus /> Add a friend</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>{c.addable.map((f) => <DropdownMenuItem key={f.uid} onClick={() => tf().groupAdd(f.uid)}>{f.name}</DropdownMenuItem>)}</DropdownMenuSubContent>
              </DropdownMenuSub>
            ) : null}
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" closeOnClick={false} onClick={confirm("leave", () => tf().groupLeave())}><LogOut /> {armed === "leave" ? "Tap again to leave" : "Leave group"}</DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs">{c.name}</DropdownMenuLabel>
              <DropdownMenuItem closeOnClick={false} onClick={confirm("remove", () => tf().friendRemove(c.id))}><UserMinus /> {armed === "remove" ? "Tap again to remove" : "Remove friend"}</DropdownMenuItem>
              <DropdownMenuItem variant="destructive" closeOnClick={false} onClick={confirm("block", () => tf().friendBlock(c.id))}><ShieldBan /> {armed === "block" ? "Tap again to block" : "Block"}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => tf().friendReport(c.id)}><Flag /> Report</DropdownMenuItem>
            </DropdownMenuGroup>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function Chat({ d }: { d: SquadData }) {
  const c = d.chat!
  const [text, setText] = useState("")
  const log = useRef<HTMLOListElement>(null)
  useEffect(() => setText(""), [c.id])
  useLayoutEffect(() => { const el = log.current; if (el) el.scrollTop = el.scrollHeight }, [c.id, c.log.length])
  const send = async () => { const v = text; if (!v.trim()) return; setText(""); if (!(await tf().msgSend(v))) setText(v) }
  return (
    <section aria-label={`Chat with ${c.name}`} className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-center gap-2 border-b pb-3">
        <Button variant="ghost" size="icon" className="size-10 md:hidden" onClick={() => tf().squadSet({ chat: null })} aria-label="Back to chats"><ArrowLeft /></Button>
        <Avatar className="size-9"><AvatarFallback className={cn("font-heading", c.type === "group" ? "bg-muted" : "bg-primary/15 text-primary")}>{c.type === "group" ? <Users className="size-4" /> : initial(c.name)}</AvatarFallback></Avatar>
        <span className="flex min-w-0 flex-1 flex-col">
          <b className="truncate font-heading text-lg leading-tight font-semibold">{c.name}</b>
          {c.members ? <span className="truncate text-xs text-muted-foreground">{c.members}</span> : null}
        </span>
        <ChatMenu d={d} />
      </div>
      {c.pending ? <p className="mt-3 rounded-xl bg-muted/50 px-3 py-2 text-sm text-muted-foreground">Waiting for them to accept. You can message once they do.</p> : null}
      <ol ref={log} className="flex h-[clamp(16rem,calc(100dvh-29rem),34rem)] flex-col gap-3 overflow-y-auto py-4 max-md:h-[calc(100dvh-17rem)]" aria-live="polite">
        {c.log.length ? c.log.map((m) => <Bubble key={m.id} m={m} group={c.type === "group"} />)
          : <li className="m-auto max-w-xs text-center text-sm text-muted-foreground">No messages yet. {c.type === "group" ? "Say hi to the group." : "Say hi, or invite them to a task from the ⋮ menu."}</li>}
      </ol>
      <form className="flex gap-2 border-t pt-3" onSubmit={(e) => { e.preventDefault(); send() }}>
        <Input value={text} onChange={(e) => setText(e.target.value)} maxLength={1000} disabled={c.pending} placeholder={c.type === "group" ? `Message ${c.name}` : "Message"} aria-label="Message" className="h-10" />
        <Button type="submit" className="h-10 px-4" disabled={c.pending || !text.trim()} aria-label="Send message"><Send /><span className="hidden sm:inline">Send</span></Button>
      </form>
    </section>
  )
}

function Compare({ d }: { d: SquadData }) {
  const c = d.compare!
  return (
    <Card className="gap-3 px-4">
      <h2 className="font-heading text-lg leading-tight font-semibold">Compare</h2>
      <div className="-mx-4 overflow-x-auto px-4">
        <table className="w-full min-w-max text-sm">
          <thead>
            <tr className="border-b">
              <th scope="col" className="py-2 pr-4 text-left font-normal text-muted-foreground"><span className="sr-only">Stat</span></th>
              {c.names.map((n, i) => <th key={i} scope="col" className="px-3 py-2 text-right font-medium">{n}</th>)}
            </tr>
          </thead>
          <tbody>
            {c.rows.map((r) => (
              <tr key={r.label} className="border-b last:border-0">
                <th scope="row" className="py-2 pr-4 text-left font-normal text-muted-foreground">{r.label}</th>
                {r.vals.map((v, i) => <td key={i} className={cn("px-3 py-2 text-right tabular-nums", v.top && "font-semibold text-primary")}>{v.v}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground">Highest in each row is highlighted. Friends' numbers update when they open Tennoform.</p>
    </Card>
  )
}

export function SquadPage() {
  const [view, setViewS] = useState<"friends" | "community">(() => { try { return localStorage.getItem("tf-squadview") === "community" ? "community" : "friends" } catch { return "friends" } })
  const setView = (v: string) => { const x = v === "community" ? "community" : "friends"; setViewS(x); try { localStorage.setItem("tf-squadview", x) } catch { /* private mode */ } }
  const sw = <HaloSegmented className="self-start" value={view} onValueChange={setView} items={[{ value: "friends", label: "Friends" }, { value: "community", label: "Community" }]} />
  if (view === "community") {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-5 md:px-6 md:py-6">
        <header className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">Squad</span>
          <h1 className="font-heading text-3xl font-semibold">Community</h1>
        </header>
        {sw}
        <Community />
      </div>
    )
  }
  return <Friends sw={sw} />
}

function Friends({ sw }: { sw: React.ReactNode }) {
  const d = useTFData(() => tf().squad())
  if (d.status !== "ok") {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-5 md:px-6 md:py-6">
        <Head />
        {sw}
        {d.status === "signin" ? <><p className="text-sm">Friends, messages and shared tasks are tied to your account. Sign in to add friends.</p><SignInCard /></>
          : <Card className="px-5 text-sm" role="status">
              {d.status === "offline" ? <>Friends and messages work on <a href="https://tennoform.com/#friends" target="_blank" rel="noopener" className="underline decoration-primary/50 underline-offset-4">tennoform.com</a> after you sign in.</>
                : d.status === "loading" ? "Loading…" : "Accounts aren't available right now. Try again later."}
            </Card>}
      </div>
    )
  }
  const inChat = !!d.chat
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-5 md:px-6 md:py-6">
      <div className={cn("flex flex-col gap-4", inChat && "max-md:hidden")}>
        <Head />
        {sw}
        <CodeCards d={d} />
        <Requests d={d} />
        {d.newGroup ? <NewGroup d={d} /> : null}
      </div>
      <Card className="gap-0 p-0 md:grid md:grid-cols-[18rem_minmax(0,1fr)]">
        <div className={cn("p-3 md:border-r", inChat && "max-md:hidden")}><People d={d} /></div>
        <div className={cn("flex min-w-0 flex-col p-4", !inChat && "max-md:hidden")}>
          {d.chat ? <Chat d={d} /> : (
            <div className="m-auto flex max-w-xs flex-col items-center gap-2 py-16 text-center text-sm text-muted-foreground">
              <Users className="size-8 text-primary/60" aria-hidden />
              Pick a friend or group to start chatting.
            </div>
          )}
        </div>
      </Card>
      {d.compare && !inChat ? <Compare d={d} /> : d.compare ? <div className="max-md:hidden"><Compare d={d} /></div> : null}
    </div>
  )
}
