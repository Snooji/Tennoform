import { History, Pin } from "lucide-react"

import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Thumb } from "@/components/tf/thumb"
import { tf, useTFData, type ShortcutItem } from "@/lib/tf"

function Row({ it }: { it: ShortcutItem }) {
  return (
    <li>
      <button
        type="button"
        onClick={() => tf().openDetails(it.key)}
        className="-mx-2 flex min-h-11 w-[calc(100%+1rem)] items-center gap-3 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-muted/60 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        {it.img ? <Thumb src={it.img} className="size-8 shrink-0" /> : <span aria-hidden className="size-8 shrink-0 rounded-md bg-muted" />}
        <span className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-medium">{it.name}</span>
          <span className="text-xs text-muted-foreground">{it.kind}</span>
        </span>
      </button>
    </li>
  )
}

/** Pinned things first, then what you looked at recently. Hidden until there's something to show. */
export function ShortcutsCard() {
  const d = useTFData(() => tf().shortcuts())
  if (!d.pins.length && !d.recent.length) return null
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>
          <h2 className="font-heading text-lg leading-tight font-semibold">{d.pins.length ? "Pinned" : "Recently viewed"}</h2>
        </CardTitle>
        {d.recent.length ? (
          <CardAction>
            <button type="button" className="text-sm text-muted-foreground underline-offset-4 hover:underline" onClick={() => tf().recentClear()}>Clear recent</button>
          </CardAction>
        ) : null}
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {d.pins.length ? (
          <ul className="flex flex-col" aria-label="Pinned">
            {d.pins.map((it) => <Row key={it.key} it={it} />)}
          </ul>
        ) : null}
        {d.recent.length ? (
          <div className="flex flex-col gap-1">
            {d.pins.length ? <h3 className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground"><History className="size-3.5" aria-hidden /> Recently viewed</h3> : null}
            <ul className="flex flex-col" aria-label="Recently viewed">
              {d.recent.map((it) => <Row key={it.key} it={it} />)}
            </ul>
          </div>
        ) : null}
        {!d.pins.length ? <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><Pin className="size-3.5" aria-hidden /> Pin anything from its page to keep it here.</p> : null}
      </CardContent>
    </Card>
  )
}
