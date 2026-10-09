import { LogIn, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { tf, useTF } from "@/lib/tf"

export function SiteHeader({ onSearch }: { onSearch: () => void }) {
  const s = useTF()
  const showPlace = s.place && s.place.id !== "home" && s.place.label !== s.title
  const mac = /Mac|iPhone|iPad/.test(navigator.platform)
  return (
    <header className="sticky top-0 z-20 flex h-[calc(3.5rem+env(safe-area-inset-top))] shrink-0 items-center pt-[env(safe-area-inset-top)] gap-2 border-b bg-background px-3 md:px-4">
      <SidebarTrigger className="-ml-1 size-9" aria-label="Show or hide navigation" />
      <Separator orientation="vertical" className="mx-1 h-5" />
      <Breadcrumb className="min-w-0">
        <BreadcrumbList className="flex-nowrap">
          {showPlace && (
            <>
              <BreadcrumbItem className="hidden sm:inline-flex">
                <BreadcrumbLink render={<a href={`#${tf().nav().find((p) => p.id === s.place!.id)?.pages[0].route ?? "home"}`} />}>
                  {s.place!.label}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden sm:inline-flex" />
            </>
          )}
          <BreadcrumbItem className="min-w-0">
            <BreadcrumbPage className="truncate font-heading text-base font-semibold">{s.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="ml-auto flex items-center gap-2">
        <Button
          variant="outline"
          onClick={onSearch}
          className="h-9 gap-2 text-muted-foreground md:w-64 md:justify-start"
          aria-label="Search Tennoform"
          aria-keyshortcuts="Control+K"
        >
          <Search className="size-4" />
          <span className="hidden sm:inline">Search…</span>
          <Kbd className="ml-auto hidden md:inline-flex">{mac ? "⌘" : "Ctrl"} K</Kbd>
        </Button>
        {s.canAcct && !s.signedIn && (
          <Button className="h-9" onClick={() => tf().google()}>
            <LogIn className="size-4" />
            <span>Sign in</span>
          </Button>
        )}
      </div>
    </header>
  )
}
