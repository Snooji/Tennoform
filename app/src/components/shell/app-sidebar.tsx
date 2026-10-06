import { ChevronsUpDown, Palette, Coffee, Info, LogIn, LogOut, MessageSquare, Monitor, Moon, ShieldCheck, Sun, UserRound } from "lucide-react"

import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader,
  SidebarMenu, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem, SidebarRail, useSidebar,
} from "@/components/ui/sidebar"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuSub,
  DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { HaloProgress } from "@/components/ui/halo-progress"
import { PAGE_ICON } from "./nav-icons"
import { ACCENTS, setAccent, useAccentChoice, type AccentChoice } from "@/lib/accent"
import { TF_LINKS, openLink } from "./tennoform-links"
import { fmt, tf, useTF, type TFState } from "@/lib/tf"
import { useNavReset } from "@/lib/nav-reset"

export function Logo({ className }: { className?: string }) {
  return <span aria-hidden className={className} dangerouslySetInnerHTML={{ __html: tf().logo() }} />
}

export function AppSidebar({ menuOpen, setMenuOpen }: { menuOpen: boolean; setMenuOpen: (o: boolean) => void }) {
  const s = useTF()
  const nav = tf().nav()
  const { setOpenMobile } = useSidebar()
  const close = () => setOpenMobile(false)
  useNavReset(close)
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
      <SidebarContent>
        {nav.map((place) => (
          <SidebarGroup key={place.id}>
            {place.pages.length > 1 && <SidebarGroupLabel>{place.label}</SidebarGroupLabel>}
            <SidebarMenu>
              {place.pages.map((p) => {
                const Icon = PAGE_ICON[p.route] ?? PAGE_ICON.home
                const active = s.route === p.route
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
                    {p.route === "friends" && s.unread > 0 && <SidebarMenuBadge>{s.unread}</SidebarMenuBadge>}
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
          <SidebarGroup className="p-0">
            <SidebarGroupLabel className="sr-only">Tennoform</SidebarGroupLabel>
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
      <HaloProgress
        value={Math.round(s.pct)}
        translucent={false}
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
  return (
    <SidebarMenu>
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
                  <DropdownMenuLabel className="text-xs">Keep your progress on every device</DropdownMenuLabel>
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
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                {s.theme === "light" ? <Sun /> : s.theme === "auto" ? <Monitor /> : <Moon />} Theme
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup value={s.theme} onValueChange={(v) => tf().theme(v as TFState["theme"])}>
                  <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="auto">Match device</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <AccentMenu />
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

function AccentMenu() {
  const choice = useAccentChoice()
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <Palette /> Colour
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent className="min-w-56">
        <DropdownMenuRadioGroup value={choice} onValueChange={(v) => setAccent(v as AccentChoice)}>
          {ACCENTS.map((a) => (
            <DropdownMenuRadioItem key={a.value} value={a.value} className="flex-col items-start gap-0">
              <span>{a.label}</span>
              {a.hint ? <span className="text-xs text-muted-foreground">{a.hint}</span> : null}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  )
}
