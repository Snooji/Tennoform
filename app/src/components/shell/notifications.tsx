import { Bell, BellOff, Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { tf, useTFData, useTF } from "@/lib/tf"

const KINDS = [
  { k: "dm", label: "Direct messages", hint: "Messages and task invites from friends" },
  { k: "group", label: "Group chats", hint: "New messages in your groups" },
  { k: "friend", label: "Friend requests and new friends", hint: "When someone asks to add you, or accepts your request" },
  { k: "room", label: "Community chat", hint: "New messages in the room you have open" },
] as const

/** Notifications for chat and friends: on or off, silent or with sound, and which kinds. Mute single chats from the chat itself. */
export function NotificationsDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const d = useTFData(() => tf().notif())
  const s = useTF()
  const blocked = d.perm === "denied"
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Notifications</DialogTitle>
          <DialogDescription>Get a notification for new messages and friend requests, on your computer or phone.</DialogDescription>
        </DialogHeader>
        {!s.signedIn ? <p className="rounded-md border px-3 py-2 text-sm">Sign in to chat with friends. Notifications cover your messages once you're signed in.</p> : null}
        <div className="flex items-center justify-between gap-3">
          <span className="flex flex-col">
            <span className="text-sm font-medium">Chat and friend notifications</span>
            <span className="text-xs text-muted-foreground">{blocked ? "Blocked in your browser settings" : d.on ? "On" : "Off"}</span>
          </span>
          {d.on ? (
            <Button variant="outline" className="h-9" onClick={() => tf().notifSet({ on: false })}><BellOff /> Turn off</Button>
          ) : (
            <Button className="h-9" disabled={d.perm === "unsupported"} onClick={() => tf().notifEnable()}><Bell /> Turn on</Button>
          )}
        </div>
        {blocked ? <p className="text-xs text-muted-foreground">Your browser is blocking notifications for tennoform.com. Allow them in the site settings (the icon left of the address), then turn this on.</p> : null}
        {d.ios ? (
          <p className="flex gap-2 rounded-md border px-3 py-2 text-xs"><Info aria-hidden className="mt-0.5 size-4 shrink-0" /> On iPhone and iPad, notifications only work once Tennoform is on your Home Screen: tap Share, then Add to Home Screen, and open it from there.</p>
        ) : null}
        <fieldset className="flex flex-col gap-2" disabled={!d.on}>
          <legend className="mb-1 text-sm font-medium">Notify me about</legend>
          {KINDS.map((x) => (
            <label key={x.k} className="flex min-h-10 cursor-pointer items-start gap-2.5">
              <Checkbox className="mt-0.5 size-5 rounded-md" checked={d[x.k]} onCheckedChange={(v) => tf().notifSet({ [x.k]: !!v })} />
              <span className="flex flex-col"><span className="text-sm">{x.label}</span><span className="text-xs text-muted-foreground">{x.hint}</span></span>
            </label>
          ))}
        </fieldset>
        <label className="flex min-h-10 cursor-pointer items-start gap-2.5">
          <Checkbox className="mt-0.5 size-5 rounded-md" checked={d.sound} disabled={!d.on} onCheckedChange={(v) => tf().notifSet({ sound: !!v })} />
          <span className="flex flex-col"><span className="text-sm">Play a sound</span><span className="text-xs text-muted-foreground">Untick for silent notifications</span></span>
        </label>
        <div className="flex flex-wrap items-center gap-2 border-t pt-3">
          <Button variant="outline" className="h-9" disabled={!d.on} onClick={() => tf().notifTest()}>Send a test notification</Button>
          <span className="text-xs text-muted-foreground">Mute a single chat with the bell in that chat.</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Notifications arrive while Tennoform is open, including in a background tab or a minimized window. You won't be notified about the chat you're reading.
        </p>
      </DialogContent>
    </Dialog>
  )
}

/** The bell in a conversation: mute or unmute notifications for just this chat. */
export function MuteButton({ conv, name }: { conv: string; name: string }) {
  const d = useTFData(() => tf().notif())
  if (!d.on) return null
  const muted = !!d.mute[conv]
  return (
    <Button variant="ghost" size="icon" className="size-9" aria-pressed={muted} aria-label={(muted ? "Unmute notifications for " : "Mute notifications for ") + name} onClick={() => tf().notifMute(conv, !muted)}>
      {muted ? <BellOff className="text-muted-foreground" /> : <Bell />}
    </Button>
  )
}
