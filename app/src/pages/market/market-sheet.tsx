import { useState, type ReactNode } from "react"
import { ChevronRight, ExternalLink, Info, MessageSquare, Tag } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { PhoneSheet } from "@/components/tf/phone-sheet"
import { Thumb } from "@/components/tf/thumb"
import { cn } from "@/lib/utils"
import { tf } from "@/lib/tf"

export type MarketRowView = {
  title: string; img?: string; price: number | null; chip?: ReactNode; chips?: ReactNode; meta?: string; detailsKey: string
  seller: { label: ReactNode; aria: string; wh: string } | null; sellName: string; url: string
}

/** One thing's market details on a phone: the price and what it means, then the actions. */
export function MarketSheet({ row, open, onOpenChange }: { row: MarketRowView; open: boolean; onOpenChange: (o: boolean) => void }) {
  return (
    <PhoneSheet
      open={open}
      onOpenChange={onOpenChange}
      title={row.title}
      description="Prices from warframe.market's daily snapshot"
      footer={
        <>
          {row.seller ? (
            <Button className="h-11 flex-1" onClick={() => tf().whisper(row.seller!.wh)} aria-label={row.seller.aria}>
              <MessageSquare /> Whisper cheapest · {row.seller.label}
            </Button>
          ) : null}
          <Button variant="outline" className="h-11 flex-1" onClick={() => { onOpenChange(false); tf().sellOpen(row.sellName) }}><Tag /> Sell</Button>
        </>
      }
    >
      <div className="flex items-center gap-3 py-1">
        {row.img ? <Thumb src={row.img} className="size-12" /> : null}
        <div className="flex flex-col">
          <b className="font-heading text-3xl leading-none font-semibold tabular-nums">{row.price != null ? `${row.price}p` : "—"}</b>
          <span className="text-xs text-muted-foreground">7-day average price</span>
        </div>
      </div>
      {row.chips ? <div className="flex flex-wrap gap-1.5">{row.chips}</div> : null}
      {row.meta ? <p className="text-sm text-muted-foreground">{row.meta}</p> : null}
      <p className="flex gap-2 rounded-md border px-3 py-2 text-xs text-muted-foreground"><Info aria-hidden className="mt-0.5 size-3.5 shrink-0" /> Whisper copies a message to the cheapest seller in the daily snapshot. They may be offline.</p>
      <div className="flex flex-wrap gap-2">
        <a href={row.url} target="_blank" rel="noopener" className={cn(buttonVariants({ variant: "outline" }), "h-10")}>
          <ExternalLink /> Listings on warframe.market<span className="sr-only"> (opens in a new tab)</span>
        </a>
        <Button variant="ghost" className="h-10" onClick={() => { onOpenChange(false); tf().act("a", { href: "#", "data-go": row.detailsKey }) }}>All about it</Button>
      </div>
    </PhoneSheet>
  )
}

/** A phone row: picture, name, one status, price. The whole row opens the sheet. */
export function PhoneMarketRow({ row }: { row: MarketRowView }) {
  const [open, setOpen] = useState(false)
  return (
    <li>
      <button type="button" onClick={() => setOpen(true)} className="flex min-h-16 w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-muted/50 focus-visible:bg-muted/50 focus-visible:outline-none">
        {row.img ? <Thumb src={row.img} className="size-10" /> : null}
        <span className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="truncate font-medium">{row.title}</span>
          {row.chip ? <span className="flex">{row.chip}</span> : null}
        </span>
        <span className="flex shrink-0 flex-col items-end">
          <b className="font-heading text-lg leading-tight font-semibold tabular-nums">{row.price != null ? `${row.price}p` : "—"}</b>
          <span className="text-[11px] text-muted-foreground">7-day avg</span>
        </span>
        <ChevronRight aria-hidden className="size-4 shrink-0 text-muted-foreground" />
      </button>
      <MarketSheet row={row} open={open} onOpenChange={setOpen} />
    </li>
  )
}
