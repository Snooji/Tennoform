import { useState, type KeyboardEvent, type PointerEvent } from "react"

import { cn } from "@/lib/utils"
import { tf, useTFData } from "@/lib/tf"

const W = 320, H = 96, PX = 4, PY = 8
const fdate = (d: string) => new Date(d + "T00:00:00Z").toLocaleDateString([], { month: "short", day: "numeric", timeZone: "UTC" })

/** 90 days of warframe.market's daily average price for one item: a single 2px line, a crosshair with the day's price
 *  on hover or with the arrow keys, and the same numbers as a table for anyone who'd rather read them. */
export function PriceChart({ n, className }: { n: string; className?: string }) {
  const h = useTFData(() => tf().priceHist(n))
  const [i, setI] = useState<number | null>(null)
  if (h.state !== "ok")
    return (
      <p className={cn("text-xs text-muted-foreground", className)}>
        {h.state === "none" ? "Price history starts with the next daily price update." : h.state === "loading" ? "Loading price history…" : h.state === "error" ? "Couldn't load the price history." : "No recent sales to chart for this one."}
      </p>
    )
  const pts = h.points
  const lo = h.min!, hi = h.max!, span = Math.max(1, hi - lo)
  const x = (k: number) => PX + (k / Math.max(1, pts.length - 1)) * (W - 2 * PX)
  const y = (p: number) => PY + (1 - (p - lo) / span) * (H - 2 * PY)
  // a gap in the line where a day had no sales
  let d = "", pen = false
  pts.forEach((pt, k) => { if (pt.p == null) { pen = false; return } d += `${pen ? "L" : "M"}${x(k).toFixed(1)},${y(pt.p).toFixed(1)}`; pen = true })
  const near = (k: number) => { for (let r = 0; r < pts.length; r++) for (const c of [k - r, k + r]) if (c >= 0 && c < pts.length && pts[c].p != null) return c; return null }
  const move = (e: PointerEvent<SVGSVGElement>) => { const r = e.currentTarget.getBoundingClientRect(); setI(near(Math.round(((e.clientX - r.left) / r.width) * (pts.length - 1)))) }
  const key = (e: KeyboardEvent<SVGSVGElement>) => {
    const step = { ArrowLeft: -1, ArrowRight: 1, Home: -pts.length, End: pts.length }[e.key]
    if (step != null) { e.preventDefault(); setI(near(Math.max(0, Math.min(pts.length - 1, (i ?? pts.length - 1) + step)))) }
    else if (e.key === "Escape") setI(null)
  }
  const cur = i != null ? pts[i] : null
  const weekly = pts.filter((pt, k) => pt.p != null && (k % 7 === 0 || k === pts.length - 1))
  return (
    <figure className={cn("flex flex-col gap-1", className)}>
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-3 text-xs text-muted-foreground">
        <span>Daily average price, last {pts.length} days</span>
        <span role="status" className="tabular-nums">
          {cur && cur.p != null ? <span className="text-foreground">{fdate(cur.d)} · <b className="font-medium">{cur.p}p</b></span> : `${lo}–${hi}p · latest ${h.last}p`}
        </span>
      </figcaption>
      <div className="relative">
        <svg
          viewBox={`0 0 ${W} ${H}`} className="h-24 w-full touch-none overflow-visible rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          role="img" tabIndex={0}
          aria-label={`${n}: daily average price from ${lo} to ${hi} platinum over ${pts.length} days, latest ${h.last} platinum. Use the arrow keys to read each day.`}
          onPointerMove={move} onPointerDown={move} onPointerLeave={() => setI(null)} onKeyDown={key} onBlur={() => setI(null)}
        >
          <line x1={PX} x2={W - PX} y1={y(lo)} y2={y(lo)} className="stroke-border" strokeWidth={1} />
          <line x1={PX} x2={W - PX} y1={y(hi)} y2={y(hi)} className="stroke-border" strokeWidth={1} strokeDasharray="2 3" />
          <path d={d} fill="none" className="stroke-primary" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          {cur && cur.p != null ? (
            <>
              <line x1={x(i!)} x2={x(i!)} y1={PY / 2} y2={H - PY / 2} className="stroke-muted-foreground" strokeWidth={1} vectorEffect="non-scaling-stroke" />
              <circle cx={x(i!)} cy={y(cur.p)} r={4} className="fill-primary stroke-card" strokeWidth={2} vectorEffect="non-scaling-stroke" />
            </>
          ) : null}
        </svg>
      </div>
      <div className="flex justify-between text-[11px] text-muted-foreground tabular-nums" aria-hidden><span>{fdate(pts[0].d)}</span><span>{fdate(pts[pts.length - 1].d)}</span></div>
      <details className="text-xs">
        <summary className="cursor-pointer text-muted-foreground">Show as a table</summary>
        <table className="mt-1 w-full tabular-nums">
          <thead><tr className="text-left text-muted-foreground"><th className="font-normal">Day</th><th className="text-right font-normal">Average price</th></tr></thead>
          <tbody>{weekly.map((pt) => <tr key={pt.d}><td>{fdate(pt.d)}</td><td className="text-right">{pt.p}p</td></tr>)}</tbody>
        </table>
      </details>
    </figure>
  )
}
