import { useLayoutEffect, useRef, useState } from "react"
import { ArrowLeft, Hash, Send, ShieldAlert, ShieldBan, Trash2, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { tf, useTFData, type CommunityMsg } from "@/lib/tf"
import { SignInCard } from "@/pages/home/side-cards"

/** Community rooms (General, Trading, LFG) plus clan and alliance rooms from the synced profile. */
export function Community() {
  const d = useTFData(() => tf().community())
  const [text, setText] = useState("")
  const [open, setOpen] = useState(false)
  const log = useRef<HTMLOListElement>(null)
  const room = d.rooms.find((r) => r.id === d.room) || d.rooms[0]
  useLayoutEffect(() => { const el = log.current; if (el) el.scrollTop = el.scrollHeight }, [d.room, d.msgs.length])
  if (!d.hosted) return <Card className="px-5 text-sm">Community chat works on <a href="https://tennoform.com/#friends" target="_blank" rel="noopener" className="underline decoration-primary/50 underline-offset-4">tennoform.com</a>.</Card>
  const send = async () => { const v = text; if (!v.trim()) return; setText(""); if (!(await tf().communitySend(v))) setText(v) }
  return (
    <div className="flex flex-col gap-4">
      <p className="max-w-3xl text-sm text-muted-foreground">
        Tennoform's own chat rooms: messages here don't reach in-game chat. Anyone can read; sign in to post. Swearing's fine; anything illegal or
        extremely explicit is held for review and can get you banned.
      </p>
      {!d.signed ? <SignInCard /> : null}
      <Card className="gap-0 p-0 md:grid md:grid-cols-[16rem_minmax(0,1fr)]">
        <nav aria-label="Chat rooms" className={cn("flex flex-col gap-1 p-3 md:border-r", open && "max-md:hidden")}>
          {d.rooms.map((r) => (
            <button key={r.id} type="button" aria-current={r.id === d.room ? "page" : undefined} onClick={() => { tf().communitySet({ room: r.id }); setOpen(true) }}
              className={cn("flex items-start gap-2.5 rounded-xl px-3 py-2.5 text-left outline-none hover:bg-muted/50 focus-visible:ring-3 focus-visible:ring-ring/50", r.id === d.room && "bg-primary/10")}>
              {r.kind === "public" ? <Hash aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" /> : <Users aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" />}
              <span className="flex min-w-0 flex-col"><b className="truncate text-sm font-medium">{r.label}</b><span className="text-xs text-muted-foreground">{r.hint}</span></span>
            </button>
          ))}
          {!d.synced ? <p className="px-3 pt-2 text-xs text-muted-foreground">Sync your Warframe profile (Profile → Account &amp; sync) to get your clan and alliance rooms.</p> : null}
        </nav>
        <section aria-label={room ? room.label : "Chat"} className={cn("flex min-w-0 flex-col p-4", !open && "max-md:hidden")}>
          <div className="flex items-center gap-2 border-b pb-3">
            <Button variant="ghost" size="icon" className="size-10 md:hidden" onClick={() => setOpen(false)} aria-label="Back to rooms"><ArrowLeft /></Button>
            <b className="min-w-0 flex-1 truncate font-heading text-lg leading-tight font-semibold">{room?.label}</b>
            {d.admin ? <span className="flex items-center gap-1 text-xs text-muted-foreground"><ShieldAlert className="size-3.5" aria-hidden /> Admin</span> : null}
          </div>
          <ol ref={log} aria-live="polite" className="flex h-[clamp(16rem,calc(100dvh-27rem),34rem)] flex-col gap-3 overflow-y-auto py-4 max-md:h-[calc(100dvh-19rem)]">
            {d.err ? <li className="m-auto max-w-xs text-center text-sm text-muted-foreground">{d.err === "perm" ? "This room is only for its members. Sync your profile to join your clan and alliance rooms." : "Couldn't load messages. Check your connection."}</li>
              : d.loading ? <li className="m-auto text-sm text-muted-foreground" role="status">Loading…</li>
              : d.msgs.length ? d.msgs.map((m) => <Line key={m.id} m={m} admin={d.admin} />)
              : <li className="m-auto max-w-xs text-center text-sm text-muted-foreground">No messages yet. Start the conversation.</li>}
          </ol>
          {d.banned ? <p className="border-t pt-3 text-sm text-muted-foreground">You can't post in community chat.</p> : (
            <form className="flex gap-2 border-t pt-3" onSubmit={(e) => { e.preventDefault(); send() }}>
              <Input value={text} onChange={(e) => setText(e.target.value)} maxLength={500} disabled={!d.signed} placeholder={d.signed ? `Message ${room?.label ?? ""}` : "Sign in to post"} aria-label="Message" className="h-10" />
              <Button type="submit" className="h-10 px-4" disabled={!d.signed || !text.trim()} aria-label="Send message"><Send /><span className="hidden sm:inline">Send</span></Button>
            </form>
          )}
        </section>
      </Card>
    </div>
  )
}

function Line({ m, admin }: { m: CommunityMsg; admin: boolean }) {
  const [armed, setArmed] = useState(false)
  return (
    <li className={cn("flex max-w-[85%] flex-col gap-0.5", m.mine ? "items-end self-end" : "items-start self-start")}>
      <span className="px-1 text-xs font-medium text-muted-foreground">{m.mine ? "You" : m.who}</span>
      <div className={cn("rounded-2xl px-3.5 py-2 text-sm break-words whitespace-pre-wrap", m.held ? "border border-dashed border-amber-500/50 bg-amber-500/10" : m.mine ? "rounded-br-md bg-primary text-primary-foreground" : "rounded-bl-md bg-muted")}>{m.text}</div>
      <span className="flex items-center gap-1 px-1 text-[11px] text-muted-foreground tabular-nums">
        {m.held ? "Held for review · only you can see this" : m.time}
        {admin && !m.held ? (
          <>
            <Button variant="ghost" size="icon-sm" className="size-7" onClick={() => tf().chatDelete(m.id)} aria-label={`Delete message from ${m.who}`}><Trash2 /></Button>
            {!m.mine ? <Button variant="ghost" size="sm" className="h-7 px-1.5 text-[11px]" onClick={() => { if (armed) { tf().modBan(m.uid, m.who, "From chat: " + m.text.slice(0, 80)); setArmed(false) } else setArmed(true) }}
              aria-label={`Ban ${m.who} from community chat`}><ShieldBan /> {armed ? "Tap again to ban" : "Ban"}</Button> : null}
          </>
        ) : null}
      </span>
    </li>
  )
}
