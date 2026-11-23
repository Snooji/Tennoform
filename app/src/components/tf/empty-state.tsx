import type { LucideIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/** An empty list that says what to do next: an icon in a soft ring, a title, one sentence and one action
    (pattern from 21st.dev's serafimcloud/empty-state). Every action must work signed out. */
export function EmptyState({ icon: Icon, title, body, action, secondary, className }: {
  icon: LucideIcon; title: string; body: string
  action: { label: string; onClick: () => void }
  secondary?: { label: string; onClick: () => void }
  className?: string
}) {
  return (
    <div data-slot="empty-state" className={cn("flex flex-col items-center gap-3 px-6 py-8 text-center", className)}>
      <span aria-hidden className="grid size-14 place-items-center rounded-full bg-primary/10 ring-1 ring-primary/30 ring-offset-4 ring-offset-transparent">
        <Icon className="size-6 text-primary" />
      </span>
      <div className="flex max-w-sm flex-col gap-1">
        <b className="font-heading text-lg leading-tight font-semibold">{title}</b>
        <p className="text-sm text-muted-foreground">{body}</p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button className="h-10 px-4" onClick={action.onClick}>{action.label}</Button>
        {secondary ? <Button variant="ghost" className="h-10" onClick={secondary.onClick}>{secondary.label}</Button> : null}
      </div>
    </div>
  )
}
