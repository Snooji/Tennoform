import { useEffect, useState } from "react"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

/** A number box that saves when you leave it or press Enter. Empty means "not set". */
export function NumField({ value, onCommit, label, placeholder = "0", className }: {
  value: number | null; onCommit: (v: string) => void; label: string; placeholder?: string; className?: string
}) {
  const shown = value == null || value === 0 ? "" : String(value)
  const [v, setV] = useState(shown)
  useEffect(() => setV(shown), [shown])
  return (
    <Input
      type="number"
      inputMode="numeric"
      min={0}
      value={v}
      placeholder={placeholder}
      onChange={(e) => setV(e.target.value)}
      onBlur={() => v !== shown && onCommit(v)}
      onKeyDown={(e) => e.key === "Enter" && (e.currentTarget as HTMLInputElement).blur()}
      aria-label={label}
      className={cn("h-8 w-16 text-center tabular-nums [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none", className)}
    />
  )
}
