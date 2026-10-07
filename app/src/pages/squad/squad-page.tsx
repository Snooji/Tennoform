import { useState } from "react"
import { Check, Copy, Plus, UserPlus, Users } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { tf, useTFData, type SquadData } from "@/lib/tf"
import { SignInCard } from "@/pages/home/side-cards"
import { MyPicture, PersonAvatar } from "@/components/tf/person"

const initial = (n: string) => (n.trim()[0] || "T").toUpperCase()

function Head() {
  return (
    <header className="flex flex-col gap-1">
      <span className="text-xs text-muted-foreground">Squad</span>
      <h1 className="font-heading text-3xl font-semibold">Friends</h1>
      <p className="max-w-2xl text-sm text-muted-foreground">Add friends with their friend code and start group chats. Tap a friend or group to open it in Chat, where you can also invite them to your tasks. You can add people by tapping their name in Chat or on a shared build too; they have to accept.</p>
    </header>
  )
}

function CodeCards({ d }: { d: SquadData }) {
  const [code, setCode] = useState("")
  const add = () => { if (code.trim()) { tf().friendAdd(code); setCode("") } }
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <Card size="sm" className="flex-row items-center gap-3 px-4">
        <MyPicture name={d.me || "You"} className="size-12" />
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
    <Card size="sm" className="gap-2 border-primary/40 px-4">
      <h2 className="font-heading text-lg leading-tight font-semibold">Friend requests</h2>
      <ul className="flex flex-col divide-y">
        {d.requests.map((r) => (
          <li key={r.id} className="flex flex-wrap items-center gap-3 py-2">
            <Avatar className="size-9"><AvatarFallback className="bg-primary/15 font-heading text-primary">{initial(r.name)}</AvatarFallback></Avatar>
            <span className="flex min-w-0 flex-1 flex-col"><b className="truncate text-sm font-medium">{r.name}</b><span className="font-mono text-xs text-muted-foreground">{r.code}</span></span>
            <span className="flex gap-2">
              <Button size="sm" className="h-9 px-3" onClick={() => tf().friendAccept(r.id)}><Check /> Accept</Button>
              <Button variant="outline" size="sm" className="h-9 px-3" onClick={() => tf().friendDecline(r.id)}>Decline</Button>
              {r.from ? <Button variant="ghost" size="sm" className="h-9 px-3 text-destructive" onClick={() => { tf().friendDecline(r.id); tf().blockPerson(r.from, r.name) }}>Block</Button> : null}
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

function ListItem({ active, title, sub, unread, badge, onClick, group, av }: {
  active: boolean; title: string; sub: string; unread: number; badge?: string; onClick: () => void; group?: boolean; av?: string
}) {
  return (
    <li>
      <button type="button" onClick={onClick} aria-current={active ? "true" : undefined}
        className={cn("flex min-h-14 w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left outline-none hover:bg-muted/60 focus-visible:ring-3 focus-visible:ring-ring/50", active && "bg-primary/12 hover:bg-primary/15")}>
        {group ? <Avatar className="size-9"><AvatarFallback className="bg-muted font-heading text-foreground"><Users className="size-4" /></AvatarFallback></Avatar>
          : <PersonAvatar name={title} src={av} className="size-9" />}
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
  return (
    <nav aria-label="Chats" className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-medium text-muted-foreground">Groups</h2>
          <Button variant="ghost" size="sm" className="h-8" onClick={() => tf().squadSet({ newGroup: true })}><Plus /> New group</Button>
        </div>
        {d.groups.length ? (
          <ul className="flex flex-col gap-0.5">
            {d.groups.map((g) => <ListItem key={g.id} group active={false} title={g.name} sub={`${g.members} members`} unread={g.unread} onClick={() => tf().chatGo("g:" + g.id)} />)}
          </ul>
        ) : <p className="px-1 text-sm text-muted-foreground">No groups yet.</p>}
      </div>
      <div className="flex flex-col gap-1">
        <h2 className="px-1 text-xs font-medium text-muted-foreground">Friends</h2>
        {d.friends.length ? (
          <ul className="flex flex-col gap-0.5">
            {d.friends.map((f) => (
              <ListItem key={f.uid} active={false} av={f.av} title={f.name} badge={f.pending ? "Pending" : ""} sub={[f.mr, f.xp].filter(Boolean).join(" · ")} unread={f.unread}
                onClick={() => tf().chatGo("f:" + f.uid)} />
            ))}
          </ul>
        ) : <p className="px-1 text-sm text-muted-foreground">No friends yet. Share your code, or enter theirs above.</p>}
      </div>
    </nav>
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
  return <Friends />
}

function Friends() {
  const d = useTFData(() => tf().squad())
  if (d.status !== "ok") {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-5 md:px-6 md:py-6">
        <Head />
        {d.status === "signin" ? <><p className="text-sm">Friends, messages and shared tasks are tied to your account. Sign in to add friends.</p><SignInCard /></>
          : <Card className="px-5 text-sm" role="status">
              {d.status === "offline" ? <>Friends and messages work on <a href="https://tennoform.com/#friends" target="_blank" rel="noopener" className="underline decoration-primary/50 underline-offset-4">tennoform.com</a> after you sign in.</>
                : d.status === "loading" ? "Loading…" : "Accounts aren't available right now. Try again later."}
            </Card>}
      </div>
    )
  }
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-4 py-5 md:px-6 md:py-6">
      <Head />
      <CodeCards d={d} />
      <Requests d={d} />
      {d.newGroup ? <NewGroup d={d} /> : null}
      <Card className="px-3"><People d={d} /></Card>
      {d.compare ? <Compare d={d} /> : null}
      {d.blocked.length ? (
        <Card size="sm" className="gap-2 px-4">
          <h2 className="font-heading text-lg leading-tight font-semibold">Blocked</h2>
          <p className="text-sm text-muted-foreground">They can't send you requests or messages, and you won't see their chat messages.</p>
          <ul className="flex flex-col divide-y">
            {d.blocked.map((b) => (
              <li key={b.uid} className="flex items-center gap-3 py-2">
                <span className="min-w-0 flex-1 truncate text-sm">{b.name}</span>
                <Button variant="outline" size="sm" className="h-9 px-3" onClick={() => tf().unblockPerson(b.uid)}>Unblock</Button>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}
    </div>
  )
}
