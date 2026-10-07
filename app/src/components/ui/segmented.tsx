import { useCallback, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react"
import { Toggle } from "@base-ui/react/toggle"
import { ToggleGroup } from "@base-ui/react/toggle-group"
import { motion, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"

export interface SegmentedItem {
  value: string
  label: ReactNode
  disabled?: boolean
}

export interface SegmentedProps {
  items: SegmentedItem[]
  /** Selected value; omit for uncontrolled usage with `defaultValue`. */
  value?: string
  defaultValue?: string
  onValueChange?: (next: string) => void
  className?: string
  disabled?: boolean
}

/**
 * Pick one of a few views. A sunken track with a solid thumb that slides to the chosen option,
 * so the selection reads as a physical switch rather than a highlighted word.
 */
export function Segmented({ items, value: valueProp, defaultValue, onValueChange, className, disabled = false }: SegmentedProps) {
  const reduceMotion = useReducedMotion() ?? false
  const trackRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<Map<string, HTMLButtonElement>>(new Map())
  const [thumb, setThumb] = useState({ x: 0, width: 0 })

  const isControlled = valueProp !== undefined
  const [uncontrolled, setUncontrolled] = useState(defaultValue ?? items[0]?.value ?? "")
  const selected = isControlled ? (valueProp ?? "") : uncontrolled

  const setSelected = useCallback(
    (next: string) => {
      if (!isControlled) setUncontrolled(next)
      onValueChange?.(next)
    },
    [isControlled, onValueChange]
  )

  const groupValue = useMemo(() => (selected ? [selected] : []), [selected])

  const measureThumb = useCallback(() => {
    const track = trackRef.current
    const active = selected ? itemRefs.current.get(selected) : undefined
    if (!(track && active)) {
      setThumb({ x: 0, width: 0 })
      return
    }
    const tr = track.getBoundingClientRect()
    const br = active.getBoundingClientRect()
    setThumb({ x: br.left - tr.left, width: br.width })
  }, [selected])

  useLayoutEffect(() => {
    measureThumb()
  }, [measureThumb])

  useLayoutEffect(() => {
    const track = trackRef.current
    if (!track || typeof ResizeObserver === "undefined") return
    const ro = new ResizeObserver(() => measureThumb())
    ro.observe(track)
    return () => ro.disconnect()
  }, [measureThumb])

  return (
    <div className={cn("relative inline-flex max-w-full rounded-lg border bg-muted p-0.5", className)}>
      <div className="relative min-w-0" ref={trackRef}>
        <motion.div
          animate={{ x: thumb.width > 0 ? thumb.x : 0, width: thumb.width }}
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 rounded-md border bg-card"
          initial={false}
          transition={reduceMotion ? { duration: 0 } : { type: "tween", duration: 0.16, ease: "easeOut" }}
        />
        <ToggleGroup
          className="relative z-1 flex min-w-0 gap-0"
          disabled={disabled}
          multiple={false}
          onValueChange={(next) => {
            const first = next[0]
            if (typeof first === "string") setSelected(first)
          }}
          value={groupValue}
        >
          {items.map((item) => (
            <Toggle
              className={cn(
                "relative flex min-h-9 flex-auto shrink-0 items-center justify-center whitespace-nowrap rounded-md px-2.5 py-1.5 sm:px-3.5",
                "text-[13px] font-medium text-muted-foreground sm:text-sm",
                "outline-none transition-colors duration-150 hover:text-foreground",
                "focus-visible:ring-2 focus-visible:ring-ring/50",
                "disabled:pointer-events-none disabled:opacity-50",
                "aria-pressed:font-semibold aria-pressed:text-foreground"
              )}
              disabled={item.disabled}
              key={item.value}
              ref={(el) => {
                if (el) itemRefs.current.set(item.value, el)
                else itemRefs.current.delete(item.value)
              }}
              value={item.value}
            >
              {item.label}
            </Toggle>
          ))}
        </ToggleGroup>
      </div>
    </div>
  )
}
