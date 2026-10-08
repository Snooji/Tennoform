import { useEffect, useState } from "react"
import { Bell, ChevronsUpDown, MessagesSquare, Palette, Coffee, Info, LogIn, LogOut, MessageSquare, ShieldCheck, UserRound } from "lucide-react"

import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader,
  SidebarMenu, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem, SidebarRail, useSidebar,
} from "@/components/ui/sidebar"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ProgressBar } from "@/components/ui/progress-bar"
import { PAGE_ICON } from "./nav-icons"
import { AppearanceDialog } from "./appearance"
import { NotificationsDialog } from "./notifications"
import { TF_LINKS, openLink } from "./tennoform-links"
import { fmt, tf, useTF, type TFState } from "@/lib/tf"
import { useNavReset } from "@/lib/nav-reset"
import { setChatWin, useChatWin } from "@/lib/chat-win"

export function Logo({ className }: { className?: string }) {
  return <span aria-hidden className={className} dangerouslySetInnerHTML={{ __html: tf().logo() }} />
}

/** Pages that share a menu entry with another page (the switch at the top of each moves between them). */
const PAIRED_WITH: Record<string, string> = { tasks: "goals", quests: "missions" }

export function AppSidebar({ menuOpen, setMenuOpen }: { menuOpen: boolean; setMenuOpen: (o: boolean) => void }) {
  const s = useTF()
  const nav = tf().nav()
  const { setOpenMobile } = useSidebar()
  const close = () => setOpenMobile(false)
  useNavReset(close)
  /* fade the bottom edge while there's more of the list below, so a cut-off row reads as "scroll for more" */
  const [list, setList] = useState<HTMLDivElement | null>(null)
  const [more, setMore] = useState(false)
  useEffect(() => {
    const el = list
    if (!el) return
    const check = () => setMore(el.scrollTop + el.clientHeight < el.scrollHeight - 4)
    check()
    el.addEventListener("scroll", check, { passive: true })
    const ro = new ResizeObserver(check)
    ro.observe(el)
    return () => { el.removeEventListener("scroll", check); ro.disconnect() }
  }, [list])
  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" tooltip="Tennoform" render={<a href="#home" onClick={close} />}>
              <Logo className="grid size-8 shrink-0 place-items-center [&_svg]:size-8" />
              <span className="font-heading text-lg font-semibold tracking-wide">
                Tenno<span className="text-primary">form</span>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent ref={setList} data-more={more || undefined} className="data-[more]:[mask-image:linear-gradient(to_bottom,#000_calc(100%-2.5rem),transparent)]">
        {nav.map((place) => (
          <SidebarGroup key={place.id}>
            {place.pages.length > 1 && <SidebarGroupLabel>{place.label}</SidebarGroupLabel>}
            <SidebarMenu>
              {place.pages.map((p) => {
                const Icon = PAGE_ICON[p.route] ?? PAGE_ICON.home
                const active = s.route === p.route || PAIRED_WITH[s.route] === p.route
                return (
                  <SidebarMenuItem key={p.route}>
                    <SidebarMenuButton
                      isActive={active}
                      tooltip={p.label}
                      render={<a href={`#${p.route}`} aria-current={active ? "page" : undefined} onClick={close} />}
                    >
                      <Icon />
                      <span>{p.label}</span>
                    </SidebarMenuButton>
                    {p.route === "chat" && s.unread > 0 && <SidebarMenuBadge>{s.unread}</SidebarMenuBadge>}
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}
        <SidebarGroup>
          <SidebarGroupLabel>Tennoform</SidebarGroupLabel>
          <SidebarMenu>
            {TF_LINKS.map((l) => {
              const active = s.route === l.route && !("whatsNew" in l)
              return (
                <SidebarMenuItem key={l.label}>
                  <SidebarMenuButton
                    isActive={active}
                    tooltip={l.label}
                    render={<a href={`#${l.route}`} aria-current={active ? "page" : undefined} onClick={(e) => { openLink(l, e); close() }} />}
                  >
                    <l.icon className={l.accent ? "text-primary" : undefined} />
                    <span>{l.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <MasteryMeter s={s} />
        <AccountMenu s={s} open={menuOpen} setOpen={setMenuOpen} onNavigate={close} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

function MasteryMeter({ s }: { s: TFState }) {
  return (
    <a
      href="#mastery"
      className="block rounded-md px-2 py-2 hover:bg-sidebar-accent group-data-[collapsible=icon]:hidden"
      aria-label={`${s.mrLabel}, ${fmt(s.toNext)} XP to ${s.nextLabel}`}
    >
      <ProgressBar
        value={Math.round(s.pct)}
        className="min-w-0"
        label={
          <span className="flex w-full items-baseline justify-between gap-2">
            <span className="font-heading text-sm font-semibold">{s.mrLabel}</span>
            <span className="text-muted-foreground">{fmt(s.toNext)} XP to {s.nextLabel}</span>
          </span>
        }
      />
    </a>
  )
}

function AccountMenu({ s, open, setOpen, onNavigate }: { s: TFState; open: boolean; setOpen: (o: boolean) => void; onNavigate: () => void }) {
  const go = (r: string) => { onNavigate(); tf().go(r) }
  const initial = (s.acctName || s.name || "T").trim()[0]?.toUpperCase() ?? "T"
  const [look, setLook] = useState(false)
  const [ntf, setNtf] = useState(false)
  const cw = useChatWin()
  return (
    <SidebarMenu>
      <AppearanceDialog open={look} onOpenChange={setLook} />
      <NotificationsDialog open={ntf} onOpenChange={setNtf} />
      <SidebarMenuItem>
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton size="lg" tooltip={s.signedIn ? s.acctName : "Account"} aria-label="Account, settings and more" />
            }
          >
            <Avatar className="size-8 rounded-md">
              <AvatarFallback className="rounded-md bg-primary/15 font-heading text-primary">
                {s.signedIn ? initial : <UserRound className="size-4" />}
              </AvatarFallback>
            </Avatar>
            <span className="grid min-w-0 flex-1 text-left leading-tight">
              <span className="truncate font-medium">{s.signedIn ? s.acctName : s.name || "Not signed in"}</span>
              <span className="truncate text-xs text-muted-foreground">
                {s.signedIn ? "Saved to your account" : "Saved on this device"}
              </span>
            </span>
            <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="w-64">
            {!s.signedIn && s.canAcct && (
              <>
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="text-xs">Save Tennoform progress to an account</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => tf().google()}>
                    <LogIn /> Continue with Google
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { onNavigate(); tf().account() }}>
                    <UserRound /> Sign up or sign in with email
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuGroup>
              {s.admin && (
                <DropdownMenuItem onClick={() => go("admin")}>
                  <ShieldCheck /> Backend
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => go("tenno")}>
                <UserRound /> Profile &amp; account
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => go("donate")}>
                <Coffee /> Support Tennoform
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => go("feedback")}>
                <MessageSquare /> Feedback
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => go("about")}>
                <Info /> About &amp; privacy
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => { setOpen(false); setNtf(true) }}>
              <Bell /> Notifications
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setOpen(false); setChatWin(cw.bubble || cw.open ? { bubble: false, open: false } : { bubble: true }) }}>
              <MessagesSquare /> {cw.bubble || cw.open ? "Hide chat button" : "Show chat button"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setOpen(false); setLook(true) }}>
              <Palette /> Appearance
              <span className="ml-auto text-xs text-muted-foreground">{s.style === "prime" ? "Prime" : s.style === "foundry" ? "Foundry" : "Default"}</span>
            </DropdownMenuItem>
            {s.signedIn && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => tf().signOut()}>
                  <LogOut /> Sign out
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
