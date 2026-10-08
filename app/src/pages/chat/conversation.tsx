import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { Check, EllipsisVertical, Flag, ListPlus, LogOut, Send, ShieldBan, UserMinus, UserPlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
  DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { MuteButton } from "@/components/shell/notifications"
import { tf, type SquadData, type SquadMsg } from "@/lib/tf"

/** A friend or group conversation: the same messages, task invites and menu the Friends page used to show. */
function Bubble({ m, group }: { m: SquadMsg; group: boolean }) {
  if (m.kind === "sys") return <li className="self-center rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">{m.text}</li>
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
      <div className={cn("flex flex-col gap-0.5 rounded-2xl px-3.5 py-2 text-sm break-words whitespace-pre-wrap", m.mine ? "rounded-br-md bg-primary text-primary-foreground" : "rounded-bl-md bubble-in")}>{body}</div>
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

export function Conversation({ d }: { d: SquadData }) {
  const c = d.chat!
  const [text, setText] = useState("")
  const log = useRef<HTMLOListElement>(null)
  useEffect(() => setText(""), [c.id])
  useLayoutEffect(() => { const el = log.current; if (el) el.scrollTop = el.scrollHeight }, [c.id, c.log.length])
  const send = async () => { const v = text; if (!v.trim()) return; setText(""); if (!(await tf().msgSend(v))) setText(v) }
  return (
    <section aria-label={`Chat with ${c.name}`} className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-center gap-2 border-b px-4 py-2">
                <span className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-xs text-muted-foreground">{c.members || (c.pending ? "Friend request sent" : "Friend")}</span>
        </span>
        <MuteButton conv={c.type === "group" ? "g:" + c.id : "dm:" + c.id} name={c.name} />
        <ChatMenu d={d} />
      </div>
      {c.pending ? <p className="mx-4 mt-3 rounded-xl bg-muted/50 px-3 py-2 text-sm text-muted-foreground">Waiting for them to accept. You can message once they do.</p> : null}
      <ol ref={log} className="chat-surface flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4" aria-live="polite">
        {c.log.length ? c.log.map((m) => <Bubble key={m.id} m={m} group={c.type === "group"} />)
          : <li className="m-auto max-w-xs text-center text-sm text-muted-foreground">No messages yet. {c.type === "group" ? "Say hi to the group." : "Say hi, or invite them to a task from the ⋮ menu."}</li>}
      </ol>
      <form className="flex gap-2 border-t p-3" onSubmit={(e) => { e.preventDefault(); send() }}>
        <Input value={text} onChange={(e) => setText(e.target.value)} maxLength={1000} disabled={c.pending} placeholder={c.type === "group" ? `Message ${c.name}` : "Message"} aria-label={`Message ${c.name}`} className="h-10" />
        <Button type="submit" className="h-10 px-4" disabled={c.pending || !text.trim()} aria-label="Send message"><Send /><span className="hidden sm:inline">Send</span></Button>
      </form>
    </section>
  )
}
