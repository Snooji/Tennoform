import { useEffect, useState } from "react"
import { toast } from "sonner"

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AppSidebar } from "@/components/shell/app-sidebar"
import { CommandMenu } from "@/components/shell/command-menu"
import { LegacyOutlet } from "@/components/shell/legacy-outlet"
import { MobileTabs } from "@/components/shell/mobile-tabs"
import { SiteHeader } from "@/components/shell/site-header"
import { isDark, tf, useTF } from "@/lib/tf"

const sidebarOpen = () => !document.cookie.includes("sidebar_state=false")

export default function App() {
  const s = useTF()
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    window.TF_UI = {
      toast: (text, action) =>
        action
          ? toast(text, { action: { label: action.label, onClick: action.fn }, duration: 7000 })
          : toast(text),
      openSearch: () => setSearchOpen(true),
      openMenu: () => setMenuOpen(true),
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
          <div className="flex min-w-0 flex-1 flex-col pb-20 md:pb-0">
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
