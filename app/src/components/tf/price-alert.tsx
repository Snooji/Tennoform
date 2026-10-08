import { useState, type FormEvent } from "react"
import { Bell, BellOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { tf, useTFData } from "@/lib/tf"

/** "Alert me when this is at or below N platinum", checked against each day's warframe.market snapshot. */
export function PriceAlertField({ n }: { n: string }) {
  const d = useTFData(() => tf().priceAlerts())
  const cur = d.list.find((x) => x.n === n)
  const [v, setV] = useState("")
  const save = (e: FormEvent) => { e.preventDefault(); const p = Math.round(Number(v)); if (p > 0) { tf().priceAlert(n, p); setV("") } }
  if (cur)
    return (
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <Bell aria-hidden className="size-4 text-primary" />
        <span>Alert at <b className="font-medium tabular-nums">{cur.below}p</b> or less{cur.now != null ? <span className="text-muted-foreground"> · now {cur.now}p</span> : null}</span>
        <Button variant="ghost" size="sm" className="h-8" onClick={() => tf().priceAlert(n, null)}><BellOff /> Remove</Button>
      </div>
    )
  return (
    <form onSubmit={save} className="flex flex-wrap items-center gap-2 text-sm">
      <label htmlFor={"pa-" + n} className="text-muted-foreground">Alert me at or below</label>
      <Input id={"pa-" + n} type="number" inputMode="numeric" min={1} value={v} onChange={(e) => setV(e.target.value)} className="h-8 w-20" placeholder="price" />
      <span className="text-muted-foreground">p</span>
      <Button type="submit" variant="outline" size="sm" className="h-8" disabled={!(Number(v) > 0)}><Bell /> Set alert</Button>
    </form>
  )
}
