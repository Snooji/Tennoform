import { lazy, Suspense, useEffect, useState } from "react"
import { toast } from "sonner"

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { AppSidebar } from "@/components/shell/app-sidebar"
import { CommandMenu } from "@/components/shell/command-menu"
import { LegacyOutlet } from "@/components/shell/legacy-outlet"
import { MobileTabs } from "@/components/shell/mobile-tabs"
import { ChatFloat } from "@/components/shell/chat-float"
import { ThemeScene } from "@/components/shell/theme-scene"
import { SiteHeader } from "@/components/shell/site-header"
import { DemoBanner } from "@/components/shell/demo-banner"
import { SellDialog } from "@/components/tf/sell-dialog"
import { HomePage } from "@/pages/home/home-page"
import { isDark, tf, useTF } from "@/lib/tf"
import { useAccent } from "@/lib/accent"
import { useNavReset } from "@/lib/nav-reset"
import { reloadForUpdate } from "@/lib/update-reload"
import { PageError } from "@/components/shell/page-error"

/* Each page loads on first visit; Home ships with the shell. Once the first page is up, the rest load quietly in the background. */
const IMPORTS: (() => Promise<unknown>)[] = []
function page<M>(load: () => Promise<M>, pick: (m: M) => React.ComponentType) {
  IMPORTS.push(load)
  return lazy(() =>
    load().then(
      (m) => ({ default: pick(m) }),
      (err) => {
        // the site was updated while open and this page's file is gone: reload once into the new version
        if (reloadForUpdate()) return new Promise<never>(() => {})
        throw err
      }
    )
  )
}
const RanksPage = page(() => import("@/pages/ranks/ranks-page"), (m) => m.RanksPage)
const CollectionPage = page(() => import("@/pages/collection/collection-page"), (m) => m.CollectionPage)
const FarmPage = page(() => import("@/pages/farm/farm-page"), (m) => m.FarmPage)
const TodayPage = page(() => import("@/pages/today/today-page"), (m) => m.TodayPage)
const AchievementsPage = page(() => import("@/pages/achievements/achievements-page"), (m) => m.AchievementsPage)
const TasksPage = page(() => import("@/pages/tasks/tasks-page"), (m) => m.TasksPage)
const GoalsPage = page(() => import("@/pages/goals/goals-page"), (m) => m.GoalsPage)
const QuestsPage = page(() => import("@/pages/quests/quests-page"), (m) => m.QuestsPage)
const MasteryPage = page(() => import("@/pages/mastery/mastery-page"), (m) => m.MasteryPage)
const MissionsPage = page(() => import("@/pages/missions/missions-page"), (m) => m.MissionsPage)
const SyndPage = page(() => import("@/pages/synd/synd-page"), (m) => m.SyndPage)
const ResourcesPage = page(() => import("@/pages/resources/resources-page"), (m) => m.ResourcesPage)
const FramesPage = page(() => import("@/pages/frames/frames-page"), (m) => m.FramesPage)
const WorldPage = page(() => import("@/pages/world/world-page"), (m) => m.WorldPage)
const MarketPage = page(() => import("@/pages/market/market-page"), (m) => m.MarketPage)
const RelicsPage = page(() => import("@/pages/relics/relics-page"), (m) => m.RelicsPage)
const ArsenalPage = page(() => import("@/pages/arsenal/arsenal-page"), (m) => m.ArsenalPage)
const TennoPage = page(() => import("@/pages/tenno/tenno-page"), (m) => m.TennoPage)
const SupportPage = page(() => import("@/pages/info/support-page"), (m) => m.SupportPage)
const FeedbackPage = page(() => import("@/pages/info/feedback-page"), (m) => m.FeedbackPage)
const AboutPage = page(() => import("@/pages/info/about-page"), (m) => m.AboutPage)
const AdminPage = page(() => import("@/pages/info/admin-page"), (m) => m.AdminPage)
const GuidesPage = page(() => import("@/pages/guides/guides-page"), (m) => m.GuidesPage)
const ChatPage = page(() => import("@/pages/chat/chat-page"), (m) => m.ChatPage)
const SquadPage = page(() => import("@/pages/squad/squad-page"), (m) => m.SquadPage)
function preloadPages() {
  const run = () => IMPORTS.forEach((f, i) => window.setTimeout(() => void f().catch(() => {}), i * 120))
  const idle = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback
  if (idle) idle(run, { timeout: 4000 })
  else window.setTimeout(run, 2000)
}

/** Pages rebuilt in React. The old app renders nothing for these. */
const PAGES: Record<string, React.ComponentType> = {
  ranks: RanksPage,
  collection: CollectionPage,
  farm: FarmPage,
  today: TodayPage,
  achievements: AchievementsPage,
  tasks: TasksPage,
  goals: GoalsPage,
  quests: QuestsPage,
  mastery: MasteryPage,
  missions: MissionsPage,
  synd: SyndPage,
  resources: ResourcesPage,
  frames: FramesPage,
  world: WorldPage,
  market: MarketPage,
  relics: RelicsPage,
  arsenal: ArsenalPage,
  tenno: TennoPage,
  donate: SupportPage,
  feedback: FeedbackPage,
  about: AboutPage,
  admin: AdminPage,
  friends: SquadPage,
  chat: ChatPage,
  guides: GuidesPage,
}
const OWNED = new Set(["home", ...Object.keys(PAGES)])

/** Page-shaped placeholder: same column, header and card rhythm as a real page, so nothing jumps when it arrives. */
function PageLoading() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const t = window.setTimeout(() => setShow(true), 180)
    return () => window.clearTimeout(t)
  }, [])
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-5 md:px-6 md:py-6" aria-busy="true">
      <span className="sr-only" role="status">Loading</span>
      <div className={cn("flex flex-col gap-4 transition-opacity duration-300", show ? "opacity-100" : "opacity-0")} aria-hidden>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-9 w-48 rounded-xl" />
          <Skeleton className="h-4 w-full max-w-md" />
        </div>
        <div className="grid gap-2 sm:grid-cols-3">
          {[0, 1, 2].map((i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
        </div>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <Skeleton className="h-72 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
      </div>
    </div>
  )
}

const sidebarOpen = () => !document.cookie.includes("sidebar_state=false")

export default function App() {
  const s = useTF()
  const [searchOpen, setSearchOpen] = useState(false)
  const Page = PAGES[s.route]
  useAccent(s.mr, s.style)
  const [menuOpen, setMenuOpen] = useState(false)
  useNavReset(() => { setSearchOpen(false); setMenuOpen(false) })

  useEffect(() => {
    window.TF_UI = {
      toast: (text, action) =>
        action
          ? toast(text, { action: { label: action.label, onClick: action.fn }, duration: 7000 })
          : toast(text),
      openSearch: () => setSearchOpen(true),
      openMenu: () => setMenuOpen(true),
      owns: (route) => OWNED.has(route),
    }
    tf().refresh()
    preloadPages()
    return () => {
      window.TF_UI = undefined
    }
  }, [])

  return (
    <TooltipProvider delay={300}>
      <SidebarProvider defaultOpen={sidebarOpen()}>
        <a
          href="#app"
          className="sr-only z-50 rounded-md bg-primary px-3 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
        >
          Skip to content
        </a>
        <AppSidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <SidebarInset className="min-w-0">
          <SiteHeader onSearch={() => setSearchOpen(true)} />
          {s.demo ? <DemoBanner /> : null}
          <div className="flex min-w-0 flex-1 flex-col pb-20 md:pb-0">
            {s.route === "home" && !s.isNew && !s.qs ? <HomePage /> : null}
            {Page ? <PageError key={s.route}><Suspense fallback={<PageLoading />}><Page /></Suspense></PageError> : null}
            <LegacyOutlet />
          </div>
        </SidebarInset>
        <MobileTabs />
        <ChatFloat />
        <ThemeScene />
        <CommandMenu open={searchOpen} setOpen={setSearchOpen} />
        <SellDialog />
        <Toaster theme={isDark(s.theme) ? "dark" : "light"} position="bottom-center" offset={{ bottom: 88 }} mobileOffset={{ bottom: 88 }} />
      </SidebarProvider>
    </TooltipProvider>
  )
}
