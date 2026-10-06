import { lazy, Suspense, useEffect, useState } from "react"
import { toast } from "sonner"

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AppSidebar } from "@/components/shell/app-sidebar"
import { CommandMenu } from "@/components/shell/command-menu"
import { LegacyOutlet } from "@/components/shell/legacy-outlet"
import { MobileTabs } from "@/components/shell/mobile-tabs"
import { SiteHeader } from "@/components/shell/site-header"
import { DemoBanner } from "@/components/shell/demo-banner"
import { HomePage } from "@/pages/home/home-page"
import { isDark, tf, useTF } from "@/lib/tf"
import { useAccent } from "@/lib/accent"
import { useNavReset } from "@/lib/nav-reset"

/* Each page loads on first visit; Home ships with the shell. */
const RanksPage = lazy(() => import("@/pages/ranks/ranks-page").then((m) => ({ default: m.RanksPage })))
const FarmPage = lazy(() => import("@/pages/farm/farm-page").then((m) => ({ default: m.FarmPage })))
const TodayPage = lazy(() => import("@/pages/today/today-page").then((m) => ({ default: m.TodayPage })))
const AchievementsPage = lazy(() => import("@/pages/achievements/achievements-page").then((m) => ({ default: m.AchievementsPage })))
const TasksPage = lazy(() => import("@/pages/tasks/tasks-page").then((m) => ({ default: m.TasksPage })))
const GoalsPage = lazy(() => import("@/pages/goals/goals-page").then((m) => ({ default: m.GoalsPage })))
const QuestsPage = lazy(() => import("@/pages/quests/quests-page").then((m) => ({ default: m.QuestsPage })))
const MasteryPage = lazy(() => import("@/pages/mastery/mastery-page").then((m) => ({ default: m.MasteryPage })))
const MissionsPage = lazy(() => import("@/pages/missions/missions-page").then((m) => ({ default: m.MissionsPage })))
const SyndPage = lazy(() => import("@/pages/synd/synd-page").then((m) => ({ default: m.SyndPage })))
const ResourcesPage = lazy(() => import("@/pages/resources/resources-page").then((m) => ({ default: m.ResourcesPage })))
const FramesPage = lazy(() => import("@/pages/frames/frames-page").then((m) => ({ default: m.FramesPage })))
const WorldPage = lazy(() => import("@/pages/world/world-page").then((m) => ({ default: m.WorldPage })))
const MarketPage = lazy(() => import("@/pages/market/market-page").then((m) => ({ default: m.MarketPage })))
const RelicsPage = lazy(() => import("@/pages/relics/relics-page").then((m) => ({ default: m.RelicsPage })))
const ArsenalPage = lazy(() => import("@/pages/arsenal/arsenal-page").then((m) => ({ default: m.ArsenalPage })))
const TennoPage = lazy(() => import("@/pages/tenno/tenno-page").then((m) => ({ default: m.TennoPage })))
const SupportPage = lazy(() => import("@/pages/info/support-page").then((m) => ({ default: m.SupportPage })))
const FeedbackPage = lazy(() => import("@/pages/info/feedback-page").then((m) => ({ default: m.FeedbackPage })))
const AboutPage = lazy(() => import("@/pages/info/about-page").then((m) => ({ default: m.AboutPage })))
const AdminPage = lazy(() => import("@/pages/info/admin-page").then((m) => ({ default: m.AdminPage })))
const GuidesPage = lazy(() => import("@/pages/guides/guides-page").then((m) => ({ default: m.GuidesPage })))
const SquadPage = lazy(() => import("@/pages/squad/squad-page").then((m) => ({ default: m.SquadPage })))

/** Pages rebuilt in React. The old app renders nothing for these. */
const PAGES: Record<string, React.ComponentType> = {
  ranks: RanksPage,
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
  guides: GuidesPage,
}
const OWNED = new Set(["home", ...Object.keys(PAGES)])

function PageLoading() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-5 md:px-6 md:py-6" role="status" aria-label="Loading page">
      <div className="h-9 w-56 animate-pulse rounded-xl bg-muted" />
      <div className="h-40 animate-pulse rounded-2xl bg-muted/60" />
      <div className="h-64 animate-pulse rounded-2xl bg-muted/40" />
    </div>
  )
}

const sidebarOpen = () => !document.cookie.includes("sidebar_state=false")

export default function App() {
  const s = useTF()
  const [searchOpen, setSearchOpen] = useState(false)
  const Page = PAGES[s.route]
  useAccent(s.mr, s.pct)
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
            {Page ? <Suspense fallback={<PageLoading />}><Page key={s.route} /></Suspense> : null}
            <LegacyOutlet />
          </div>
        </SidebarInset>
        <MobileTabs />
        <CommandMenu open={searchOpen} setOpen={setSearchOpen} />
        <Toaster theme={isDark(s.theme) ? "dark" : "light"} position="bottom-center" offset={{ bottom: 88 }} mobileOffset={{ bottom: 88 }} />
      </SidebarProvider>
    </TooltipProvider>
  )
}
