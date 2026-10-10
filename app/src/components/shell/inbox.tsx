import { useState } from "react"
import { Bell, CheckCheck, ListTodo, MessagesSquare, Settings2, UserPlus, Users, type LucideIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { NotificationsDialog } from "./notifications"
import { tf, useTF, useTFData, type TFNotification } from "@/lib/tf"

const ICON: Record<TFNotification["kind"], LucideIcon> = { friend: UserPlus, dm: MessagesSquare, invite: ListTodo, group: Users, other: MessagesSquare }

const ago = (t: number) => {
  const m = Math.round((Date.now() - t) / 60000)
  return !t ? "" : m < 1 ? "just now" : m < 60 ? `${m} min ago` : m < 1440 ? `${Math.round(m / 60)} h ago` : `${Math.round(m / 1440)} d ago`
}

/** What each unread badge is about, with buttons to open it or deal with it right there. */
export function NotificationList({ onDone }: { onDone?: () => void }) {
  const list = useTFData(() => tf().notifications())
  if (!list.length) return <p className="px-1 py-6 text-center text-sm text-muted-foreground">You're all caught up.</p>
  return (
    <div className="flex flex-col gap-2">
      <ul className="flex flex-col gap-2">
        {list.map((x) => {
          const Icon = ICON[x.kind] ?? Bell
          return (
            <li key={x.id} className="flex gap-3 rounded-lg border bg-card p-3">
              <Icon className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <b className="text-sm font-medium leading-snug">{x.title}</b>
                {x.text ? <span className="line-clamp-2 text-xs text-muted-foreground">{x.text}</span> : null}
                {x.at ? <span className="text-xs text-muted-foreground">{ago(x.at)}</span> : null}
                <span className="mt-1 flex flex-wrap gap-1.5">
                  {x.actions.map((a) => (
                    <Button key={a.label} size="sm" variant={a.primary ? "default" : "outline"} className="h-8"
                      onClick={() => { tf().notifAct(a.act, a.arg); if (a.act === "chat") onDone?.() }}>
                      {a.label}
                    </Button>
                  ))}
                </span>
              </div>
            </li>
          )
        })}
      </ul>
      {list.length > 1 ? (
        <Button variant="ghost" size="sm" className="self-end" onClick={() => tf().notifAct("readall", "")}><CheckCheck /> Mark all messages read</Button>
      ) : null}
    </div>
  )
}

/** A bell with the unread count; opens the list. */
export function NotificationsButton({ className, compact }: { className?: string; compact?: boolean }) {
  const s = useTF()
  const [open, setOpen] = useState(false)
  const [settings, setSettings] = useState(false)
  if (!s.signedIn) return null
  const n = s.unread
  return (
    <>
      <Button variant={compact ? "ghost" : "outline"} size="icon" className={cn("relative", compact ? "size-8" : "size-9", className)}
        onClick={() => setOpen(true)} aria-label={n ? `Notifications, ${n} unread` : "Notifications"} title="Notifications" data-nodrag>
        <Bell />
        {n ? <span className="absolute -top-1 -right-1 grid h-4.5 min-w-4.5 place-items-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">{n > 9 ? "9+" : n}</span> : null}
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-full gap-0 sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Notifications</SheetTitle>
            <SheetDescription>Friend requests, messages and task invites. Open one or answer it right here.</SheetDescription>
          </SheetHeader>
          <div className="overflow-y-auto px-4 pb-6"><NotificationList onDone={() => setOpen(false)} /></div>
          <div className="mt-auto border-t px-4 pt-3 pb-[calc(4.75rem+env(safe-area-inset-bottom))] md:pb-3"><Button variant="outline" size="sm" onClick={() => setSettings(true)}><Settings2 /> Phone and desktop alerts</Button></div>
        </SheetContent>
      </Sheet>
      <NotificationsDialog open={settings} onOpenChange={setSettings} />
    </>
  )
}
