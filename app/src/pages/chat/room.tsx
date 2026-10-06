import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { ImageOff, ImagePlus, Send, ShieldAlert, ShieldBan, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { tf, useTFData, type ChatTab, type CommunityMsg } from "@/lib/tf"
import { PersonAvatar, PersonMenu } from "@/components/tf/person"

/** A public, clan or alliance room: anyone can read, sign in to post. */
export function RoomView({ tab }: { tab: ChatTab }) {
  const d = useTFData(() => tf().community())
  const [text, setText] = useState("")
  const log = useRef<HTMLOListElement>(null)
  useLayoutEffect(() => { const el = log.current; if (el) el.scrollTop = el.scrollHeight }, [d.room, d.msgs.length])
  useEffect(() => setText(""), [tab.id])
  const send = async () => { const v = text; if (!v.trim()) return; setText(""); if (!(await tf().communitySend(v))) setText(v) }
  return (
    <section aria-label={tab.title} className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-center gap-2 border-b px-4 py-2.5">
        <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground"><span className="md:hidden">Doesn't reach in-game chat · </span>{tab.hint}</span>
        {d.leadRoom && d.lead ? (
          <>
            <Button variant="ghost" size="sm" className="h-8" onClick={() => tf().roomBgSet()}><ImagePlus /> <span className="max-sm:sr-only">{d.bg ? "Change background" : "Add background"}</span></Button>
            {d.bg ? <Button variant="ghost" size="sm" className="h-8" onClick={() => tf().roomBgRemove()} aria-label="Remove background"><ImageOff /></Button> : null}
          </>
        ) : null}
        {d.admin ? <span className="flex items-center gap-1 text-xs text-muted-foreground"><ShieldAlert className="size-3.5" aria-hidden /> Admin</span> : null}
      </div>
      <ol ref={log} aria-live="polite" className={cn("flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto bg-cover bg-center p-4", !d.bg && "chat-surface")}
        style={d.bg ? { backgroundImage: `linear-gradient(color-mix(in oklab, var(--card) 35%, transparent), color-mix(in oklab, var(--card) 35%, transparent)), url("${d.bg}")` } : undefined}>
        {d.err ? <li className="m-auto max-w-xs text-center text-sm text-muted-foreground">{d.err === "perm" ? "This room is only for its members. Sync your profile to join your clan and alliance rooms." : "Couldn't load messages. Check your connection."}</li>
          : d.loading ? <li className="m-auto text-sm text-muted-foreground" role="status">Loading…</li>
          : d.msgs.length ? d.msgs.map((m) => <Line key={m.id} m={m} admin={d.admin} onBg={!!d.bg} />)
          : <li className="m-auto max-w-xs rounded-xl bg-card/90 px-3 py-2 text-center text-sm text-muted-foreground">No messages yet. Start the conversation.</li>}
      </ol>
      {d.banned ? <p className="border-t px-4 py-3 text-sm text-muted-foreground">You can't post in chat.</p> : !d.signed ? (
        <p className="border-t px-4 py-3 text-sm text-muted-foreground">Anyone can read. Sign in above to post.</p>
      ) : (
        <form className="flex gap-2 border-t p-3" onSubmit={(e) => { e.preventDefault(); send() }}>
          <Input value={text} onChange={(e) => setText(e.target.value)} maxLength={500} placeholder={`Message ${tab.title}`} aria-label={`Message ${tab.title}`} className="h-10" />
          <Button type="submit" className="h-10 px-4" disabled={!text.trim()} aria-label="Send message"><Send /><span className="hidden sm:inline">Send</span></Button>
        </form>
      )}
    </section>
  )
}

function Line({ m, admin, onBg }: { m: CommunityMsg; admin: boolean; onBg: boolean }) {
  const [armed, setArmed] = useState(false)
  const meta = cn("px-1 text-xs", onBg ? "rounded-md bg-card/90 py-0.5 text-foreground" : "text-muted-foreground")
  return (
    <li className={cn("flex max-w-[85%] items-end gap-2", m.mine ? "flex-row-reverse self-end" : "self-start")}>
      {!m.mine ? <PersonMenu uid={m.uid} name={m.who} label={`${m.who}: add friend or block`}><PersonAvatar name={m.who} src={m.av} /></PersonMenu> : null}
      <div className={cn("flex min-w-0 flex-col gap-0.5", m.mine ? "items-end" : "items-start")}>
        {m.mine ? <span className={cn(meta, "font-medium")}>You</span>
          : <PersonMenu uid={m.uid} name={m.who} className="rounded-md" label={`${m.who}: add friend or block`}><span className={cn(meta, "font-medium hover:underline")}>{m.who}</span></PersonMenu>}
        <div className={cn("rounded-2xl px-3.5 py-2 text-sm break-words whitespace-pre-wrap shadow-sm", m.held ? "border border-dashed border-amber-500/60 bg-card" : m.mine ? "rounded-br-md bg-primary text-primary-foreground" : "rounded-bl-md bubble-in")}>{m.text}</div>
        <span className={cn("flex items-center gap-1 tabular-nums", meta, "text-[11px]")}>
          {m.held ? "Held for review · only you can see this" : m.time}
          {admin && !m.held ? (
            <>
              <Button variant="ghost" size="icon-sm" className="size-7" onClick={() => tf().chatDelete(m.id)} aria-label={`Delete message from ${m.who}`}><Trash2 /></Button>
              {!m.mine && m.av ? <Button variant="ghost" size="icon-sm" className="size-7" onClick={() => tf().avatarRemove(m.uid)} aria-label={`Remove ${m.who}'s profile picture`}><ImageOff /></Button> : null}
              {!m.mine ? <Button variant="ghost" size="sm" className="h-7 px-1.5 text-[11px]" onClick={() => { if (armed) { tf().modBan(m.uid, m.who, "From chat: " + m.text.slice(0, 80)); setArmed(false) } else setArmed(true) }}
                aria-label={`Ban ${m.who} from chat`}><ShieldBan /> {armed ? "Tap again to ban" : "Ban"}</Button> : null}
            </>
          ) : null}
        </span>
      </div>
    </li>
  )
}
