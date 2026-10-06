import { useRef } from "react"
import { Hash, MessageSquarePlus, Plus, Shield, Users, UserRound, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { tf, useTFData, type ChatTab } from "@/lib/tf"
import { SignInCard } from "@/pages/home/side-cards"
import { RoomView } from "./room"
import { Conversation } from "./conversation"

const KIND_ICON = { public: Hash, clan: Shield, alliance: Shield, friend: UserRound, group: Users }

/** One chat window, like an MMO's: a tab for each room and each open conversation. */
export function ChatPage() {
  const d = useTFData(() => tf().chat())
  const cur = d.tabs.find((t) => t.id === d.cur) || d.tabs[0]
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-4 md:px-6 md:py-6">
      <header className="flex flex-col gap-1">
        <span className="text-xs text-muted-foreground max-md:hidden">Squad</span>
        <h1 className="font-heading text-3xl font-semibold max-md:text-2xl">Chat</h1>
        <p className="max-w-3xl text-sm text-muted-foreground max-md:hidden">
          Tennoform's own chat: messages here don't reach in-game chat. Swearing's fine; anything illegal or extremely explicit is held for review and can get you banned.
        </p>
      </header>
      {!d.signed ? <SignInCard /> : null}
      <Card className="h-[clamp(26rem,calc(100dvh-15rem),48rem)] gap-0 overflow-hidden p-0 max-md:h-[calc(100dvh-14.5rem-env(safe-area-inset-bottom))]">
        <TabStrip d={d} />
        {cur ? (d.conv ? <ConvTab key={cur.id} /> : <RoomView key={cur.id} tab={cur} />) : null}
      </Card>
    </div>
  )
}

function ConvTab() {
  const s = useTFData(() => tf().squad())
  if (s.status !== "ok" || !s.chat) return <p className="m-auto text-sm text-muted-foreground" role="status">{s.status === "loading" ? "Loading…" : s.status === "signin" ? "Sign in to see your conversations." : "Loading this conversation…"}</p>
  return <Conversation d={s} />
}

function TabStrip({ d }: { d: ReturnType<ReturnType<typeof tf>["chat"]> }) {
  const list = useRef<HTMLElement>(null)
  const keys = (e: React.KeyboardEvent) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) return
    const ids = d.tabs.map((t) => t.id); const i = ids.indexOf(d.cur)
    const n = e.key === "Home" ? 0 : e.key === "End" ? ids.length - 1 : (i + (e.key === "ArrowRight" ? 1 : -1) + ids.length) % ids.length
    e.preventDefault(); tf().chatGo(ids[n], false)
    window.setTimeout(() => list.current?.querySelector<HTMLElement>(`[data-tab="${CSS.escape(ids[n])}"]`)?.focus(), 0)
  }
  return (
    <div className="flex items-stretch border-b bg-muted/40">
      <nav ref={list} aria-label="Chat tabs" onKeyDown={keys} className="flex min-w-0 flex-1 items-end gap-0.5 overflow-x-auto px-1.5 pt-1.5 [scrollbar-width:thin]">
        {d.tabs.map((t) => <Tab key={t.id} t={t} active={t.id === d.cur} />)}
      </nav>
      <NewTab d={d} />
    </div>
  )
}

function Tab({ t, active }: { t: ChatTab; active: boolean }) {
  const Icon = KIND_ICON[t.kind]
  return (
    <div className={cn("group flex shrink-0 items-center rounded-t-lg border border-b-0 border-transparent", active ? "border-border bg-card" : "hover:bg-muted")}>
      <button type="button" data-tab={t.id} aria-current={active ? "page" : undefined} title={t.hint} onClick={() => tf().chatGo(t.id, false)}
        className={cn("flex h-10 items-center gap-1.5 rounded-t-lg pl-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50", t.closable ? "pr-1" : "pr-3", active ? "font-medium text-foreground" : "text-muted-foreground")}>
        <Icon aria-hidden className={cn("size-3.5", active && "text-primary")} />
        <span className="max-w-[9rem] truncate">{t.label}</span>
        {t.unread ? <span className="grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1.5 text-xs font-semibold text-primary-foreground" aria-label={`${t.unread} unread`}>{t.unread > 9 ? "9+" : t.unread}</span> : null}
      </button>
      {t.closable ? (
        <Button variant="ghost" size="icon-sm" className="mr-1 size-7 text-muted-foreground" onClick={() => tf().chatCloseTab(t.id)} aria-label={`Close ${t.label}`}><X /></Button>
      ) : null}
    </div>
  )
}

function NewTab({ d }: { d: ReturnType<ReturnType<typeof tf>["chat"]> }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="m-1 size-10 shrink-0" aria-label="Open a conversation" />}><Plus /></DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-h-80 w-64 overflow-y-auto">
        {!d.signed ? <DropdownMenuItem disabled>Sign in to message friends</DropdownMenuItem> : (
          <>
            {d.openable.length ? (
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs">Open a conversation</DropdownMenuLabel>
                {d.openable.map((o) => (
                  <DropdownMenuItem key={o.id} onClick={() => tf().chatGo(o.id, false)}>
                    {o.kind === "group" ? <Users /> : <UserRound />}<span className="truncate">{o.label}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            ) : <DropdownMenuItem disabled>All your friends and groups are open</DropdownMenuItem>}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => { tf().squadSet({ newGroup: true }); tf().go("friends") }}><MessageSquarePlus /> New group chat</DropdownMenuItem>
            <DropdownMenuItem onClick={() => tf().go("friends")}><UserRound /> Add friends</DropdownMenuItem>
          </>
        )}
        {!d.synced ? <><DropdownMenuSeparator /><DropdownMenuItem onClick={() => tf().go("tenno")}><Shield /> Sync your profile for clan and alliance tabs</DropdownMenuItem></> : null}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
