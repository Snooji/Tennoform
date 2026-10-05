import { cn } from "@/lib/utils"
import { tf } from "@/lib/tf"

export const linkCls = "underline decoration-primary/50 underline-offset-4 hover:decoration-primary"

/** A link to anything in the app (item, resource, relic, mod…) by its key, e.g. "res|Ferrite". Plain text when there's nowhere to go. */
export function GoLink({ k, className, children }: { k: string; className?: string; children: React.ReactNode }) {
  if (!k) return <span className={className}>{children}</span>
  return (
    <a
      href="#"
      className={cn(linkCls, className)}
      onClick={(e) => {
        e.preventDefault()
        tf().act("a", { href: "#", "data-go": k })
      }}
    >
      {children}
    </a>
  )
}
