import type { ReactNode } from "react"
import { Progress as ProgressPrimitive } from "@base-ui/react/progress"

import { cn } from "@/lib/utils"

export interface ProgressBarProps extends Omit<ProgressPrimitive.Root.Props, "children"> {
  /** Optional label wired to the progress element's accessible name. */
  label?: ReactNode
  /** Show the formatted percentage. */
  showValue?: boolean
}

/** A flat bar: a muted track and a solid fill in the accent colour. */
export function ProgressBar({ className, label, showValue, value, min = 0, max = 100, ...rootProps }: ProgressBarProps) {
  const pct = value == null || !Number.isFinite(value) || max <= min ? 0 : Math.min(1, Math.max(0, (value - min) / (max - min)))
  return (
    <ProgressPrimitive.Root className={cn("flex w-full min-w-[8rem] flex-wrap gap-1.5", className)} max={max} min={min} value={value} {...rootProps}>
      {(label != null || showValue) && (
        <div className="flex w-full items-baseline justify-between gap-3">
          {label == null ? (
            <span className="sr-only">Progress</span>
          ) : (
            <ProgressPrimitive.Label className="text-xs/relaxed font-medium text-foreground">{label}</ProgressPrimitive.Label>
          )}
          {showValue ? <ProgressPrimitive.Value className="text-xs/relaxed text-muted-foreground tabular-nums" /> : null}
        </div>
      )}
      <ProgressPrimitive.Track className="relative h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div aria-hidden className="h-full rounded-full bg-primary transition-[width] duration-300 ease-out" style={{ width: `${pct * 100}%` }} />
      </ProgressPrimitive.Track>
    </ProgressPrimitive.Root>
  )
}
