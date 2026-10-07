import { Copy, ExternalLink, Info } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { fmt, tf, useTFData } from "@/lib/tf"

/** Sell on warframe.market: suggested prices from the daily snapshot, a trade-chat line, and the item's page. Tennoform never signs in for you. */
export function SellDialog() {
  const d = useTFData(() => tf().sell())
  const copy = (t: string, msg: string) => tf().copy(t, msg)
  return (
    <Dialog open={!!d} onOpenChange={(o) => { if (!o) tf().sellClose() }}>
      {d ? (
        <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Sell {d.n}</DialogTitle>
            <DialogDescription>Prices from warframe.market's snapshot of {d.date}{d.v7 ? `, ${fmt(d.v7)} sold last week` : ""}.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 sm:grid-cols-2">
            {d.quick != null ? (
              <PriceCard label="Sell fast" price={d.quick} note={d.low != null ? `Just under the cheapest seller (${d.low}p)` : "A little under the usual price"}
                onCopy={() => copy(String(d.quick), `${d.quick}p copied`)} />
            ) : null}
            {d.fair != null ? (
              <PriceCard label="Usual price" price={d.fair} note={d.avg != null ? `7-day average${d.a30 != null ? ` (30-day: ${d.a30}p)` : ""}` : "Cheapest seller right now"}
                onCopy={() => copy(String(d.fair), `${d.fair}p copied`)} />
            ) : null}
          </div>
          {d.quick == null && d.fair == null ? <p className="text-sm text-muted-foreground">No recent prices for this one. Check the listings on warframe.market before you set a price.</p> : null}
          {d.du ? (
            <p className="flex gap-2 rounded-lg border bg-muted/40 p-3 text-sm">
              <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>{d.n.endsWith(" Set") ? "Or trade the parts at a Ducat Kiosk for " : "Or trade it at a Ducat Kiosk for "}<b className="font-medium">{d.du} ducats</b>{d.n.endsWith(" Set") ? " in total" : ""} to spend with Baro Ki'Teer.{d.fair != null && d.du / Math.max(1, d.fair) >= 10 ? " That's a good rate for this one." : ""}</span>
            </p>
          ) : null}
          <ol className="flex flex-col gap-2 text-sm">
            <li><b className="font-medium">1.</b> Open the item on warframe.market and sign in there with your own account.</li>
            <li><b className="font-medium">2.</b> Tap <b className="font-medium">Place order</b>, choose <b className="font-medium">Sell</b>, enter the price{d.rank ? " and the rank you have" : ""}, and post it.</li>
            <li><b className="font-medium">3.</b> Set your status to In game while you play, so buyers know they can whisper you.</li>
          </ol>
          <div className="flex flex-wrap gap-2">
            <a href={d.url} target="_blank" rel="noopener" className={cn(buttonVariants(), "h-10 px-4")}><ExternalLink /> Open on warframe.market</a>
            {d.chatQuick ? <Button variant="outline" className="h-10" onClick={() => copy(d.chatFair || d.chatQuick, "Trade chat message copied")}><Copy /> Copy trade chat message</Button> : null}
          </div>
          {d.sellers.length ? (
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-muted-foreground">Cheapest sellers in the snapshot</span>
              <ul className="flex flex-col divide-y rounded-lg border text-sm">
                {d.sellers.map((s) => (
                  <li key={s.name} className="flex items-center gap-2 px-3 py-1.5">
                    <span className="min-w-0 flex-1 truncate">{s.name}</span>
                    {s.rank != null ? <span className="text-xs text-muted-foreground">Rank {s.rank}</span> : null}
                    {s.status ? <span className="text-xs text-muted-foreground">{s.status}</span> : null}
                    <b className="font-heading tabular-nums">{s.price}p</b>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <p className="text-xs text-muted-foreground">Tennoform never signs in to warframe.market or posts for you. Trades happen in game.</p>
        </DialogContent>
      ) : null}
    </Dialog>
  )
}

function PriceCard({ label, price, note, onCopy }: { label: string; price: number; note: string; onCopy: () => void }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border bg-background/40 p-3">
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-xs text-muted-foreground">{label}</span>
        <b className="font-heading text-2xl leading-tight font-semibold text-primary tabular-nums">{price}p</b>
        <span className="text-xs text-muted-foreground">{note}</span>
      </span>
      <Button variant="outline" size="sm" className="h-9" onClick={onCopy} aria-label={`Copy ${price} platinum`}><Copy /> Copy</Button>
    </div>
  )
}
