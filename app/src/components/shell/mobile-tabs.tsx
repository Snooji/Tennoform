import { PLACE_ICON } from "./nav-icons"
import { cn } from "@/lib/utils"
import { tf, useTF } from "@/lib/tf"

/** Phones: the five places stay one thumb away. */
export function MobileTabs() {
  const s = useTF()
  const nav = tf().nav()
  let last: Record<string, string> = {}
  try {
    last = JSON.parse(localStorage.getItem("tf-place") || "{}") || {}
  } catch {
    last = {}
  }
  return (
    <nav
      aria-label="Sections"
      className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t bg-background/90 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70 pb-[env(safe-area-inset-bottom)] md:hidden [body.typing_&]:hidden"
    >
      {nav.map((p) => {
        const Icon = PLACE_ICON[p.id]
        const active = s.place?.id === p.id
        const route = p.pages.some((x) => x.route === last[p.id]) ? last[p.id] : p.pages[0].route
        return (
          <a
            key={p.id}
            href={`#${route}`}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative flex h-16 flex-col items-center justify-center gap-1 text-xs font-medium text-muted-foreground",
              active && "text-foreground after:absolute after:inset-x-6 after:top-0 after:h-0.5 after:rounded-full after:bg-primary"
            )}
          >
            <Icon className="size-5" aria-hidden />
            {p.label}
            {p.id === "squad" && s.unread > 0 && (
              <span className="absolute top-2 left-1/2 ml-2 rounded-full bg-primary px-1.5 text-[10px] leading-4 text-primary-foreground">
                {s.unread}
              </span>
            )}
          </a>
        )
      })}
    </nav>
  )
}
