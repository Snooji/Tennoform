import { useState } from "react"
import { Camera, Check, MessageSquare, ShieldBan, Trash2, UserPlus } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { tf, useTF, useTFData } from "@/lib/tf"

const initial = (n: string) => (n.trim()[0] || "T").toUpperCase()

/** A player's picture, or their initial when they haven't added one. */
export function PersonAvatar({ name, src, className }: { name: string; src?: string; className?: string }) {
  return (
    <Avatar className={cn("size-8", className)}>
      {src ? <AvatarImage src={src} alt="" /> : null}
      <AvatarFallback className="bg-primary/15 font-heading text-primary">{initial(name)}</AvatarFallback>
    </Avatar>
  )
}

/** Tap someone's picture or name: add them as a friend (they still have to accept), message them, or block them. */
export function PersonMenu({ uid, name, children, className, label }: { uid: string; name: string; children: React.ReactNode; className?: string; label?: string }) {
  const p = useTFData(() => tf().person(uid))
  const [armed, setArmed] = useState(false)
  if (!uid || p.rel === "me") return <span className={className}>{children}</span>
  return (
    <DropdownMenu onOpenChange={(o) => !o && setArmed(false)}>
      <DropdownMenuTrigger render={<button type="button" aria-label={label || `${name}: add friend or block`}
        className={cn("rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50", className)} />}>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center gap-2"><PersonAvatar name={name} src={p.av} className="size-7" /><span className="truncate">{name}</span></DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {!p.signed ? <DropdownMenuItem disabled>Sign in to add friends</DropdownMenuItem>
          : p.rel === "friend" ? <DropdownMenuItem onClick={() => tf().chatGo("f:" + uid)}><MessageSquare /> Message</DropdownMenuItem>
          : p.rel === "pending" ? <DropdownMenuItem disabled><Check /> Request sent</DropdownMenuItem>
          : p.rel === "blocked" ? <DropdownMenuItem onClick={() => tf().unblockPerson(uid)}><ShieldBan /> Unblock</DropdownMenuItem>
          : <DropdownMenuItem onClick={() => tf().friendAddUid(uid, name)}><UserPlus /> {p.rel === "asked" ? "Accept friend request" : "Add friend"}</DropdownMenuItem>}
        {p.signed && p.rel !== "blocked" ? (
          <DropdownMenuItem variant="destructive" closeOnClick={false} onClick={() => { if (armed) { tf().blockPerson(uid, name); setArmed(false) } else setArmed(true) }}>
            <ShieldBan /> {armed ? "Tap again to block" : "Block"}
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/** Your own picture, with a menu to change or remove it. */
export function MyPicture({ name, className }: { name: string; className?: string }) {
  const src = useTFData(() => tf().myAvatar())
  const s = useTF()
  if (!s.signedIn) return null
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<button type="button" aria-label={src ? "Change your profile picture" : "Add a profile picture"}
        className={cn("group relative shrink-0 rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50", className)} />}>
        <PersonAvatar name={name} src={src} className="size-full" />
        <span aria-hidden className="absolute -right-0.5 -bottom-0.5 grid size-6 place-items-center rounded-full border-2 border-background bg-primary text-primary-foreground"><Camera className="size-3" /></span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuItem onClick={() => tf().avatarSet()}><Camera /> {src ? "Change picture" : "Upload a picture"}</DropdownMenuItem>
        {src ? <DropdownMenuItem variant="destructive" onClick={() => tf().avatarRemove()}><Trash2 /> Remove picture</DropdownMenuItem> : null}
        <DropdownMenuSeparator />
        <p className="px-2 py-1.5 text-xs text-muted-foreground">Shown in chat and to your friends. Keep it clean: explicit pictures get removed and can get you banned.</p>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
