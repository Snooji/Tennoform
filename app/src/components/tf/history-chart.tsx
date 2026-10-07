import { useEffect, useMemo, useRef, useState } from "react"

import { Card } from "@/components/ui/card"
import { Segmented } from "@/components/ui/segmented"
import { StatList } from "@/components/tf/stat-list"
import { fmt, tf, useTFData } from "@/lib/tf"

type Key = "xp" | "mastered" | "owned" | "nodes"
const METRICS: { value: Key; label: string; long: string }[] = [
  { value: "xp", label: "Mastery XP", long: "Mastery XP" },
  { value: "mastered", label: "Mastered", long: "Items mastered" },
  { value: "owned", label: "Owned", long: "Items owned" },
  { value: "nodes", label: "Nodes", long: "Star chart nodes" },
]
const H = 180, PAD = { l: 52, r: 16, t: 12, b: 26 }

const niceStep = (span: number) => { const p = Math.pow(10, Math.floor(Math.log10(Math.max(1, span / 4)))); const s = span / 4 / p; return (s <= 1 ? 1 : s <= 2 ? 2 : s <= 5 ? 5 : 10) * p }
const short = (d: string) => new Date(d + "T12:00:00").toLocaleDateString([], { month: "short", day: "numeric" })
const signed = (n: number) => (n > 0 ? "+" : n < 0 ? "−" : "") + fmt(Math.abs(n))

/** Progress over time: one snapshot a day of your mastery and collection. One measure at a time, so there's only ever one axis. */
export function HistoryCard() {
  const d = useTFData(() => tf().history())
  const [k, setK] = useState<Key>("xp")
  const [hi, setHi] = useState<number | null>(null)
  const box = useRef<HTMLDivElement>(null)
  const [w, setW] = useState(600)
  useEffect(() => {
    const el = box.current; if (!el) return
    const ro = new ResizeObserver(() => setW(Math.max(260, el.clientWidth)))
    ro.observe(el); setW(Math.max(260, el.clientWidth))
    return () => ro.disconnect()
  }, [])
  const m = METRICS.find((x) => x.value === k)!
  const pts = d.points
  const geo = useMemo(() => {
    if (pts.length < 2) return null
    const t0 = Date.parse(pts[0].d), t1 = Date.parse(pts[pts.length - 1].d)
    const vals = pts.map((p) => p[k]); let lo = Math.min(...vals), hi2 = Math.max(...vals)
    if (lo === hi2) { lo = Math.max(0, lo - 1); hi2 = hi2 + 1 }
    const step = niceStep(hi2 - lo); const y0 = Math.floor(lo / step) * step, y1 = Math.ceil(hi2 / step) * step
    const x = (d: string) => PAD.l + ((Date.parse(d) - t0) / Math.max(1, t1 - t0)) * (w - PAD.l - PAD.r)
    const y = (v: number) => PAD.t + (1 - (v - y0) / (y1 - y0 || 1)) * (H - PAD.t - PAD.b)
    const ticks: number[] = []; for (let v = y0; v <= y1 + 1e-9; v += step) ticks.push(v)
    const line = pts.map((p, i) => `${i ? "L" : "M"}${x(p.d).toFixed(1)},${y(p[k]).toFixed(1)}`).join("")
    const area = `${line}L${x(pts[pts.length - 1].d).toFixed(1)},${H - PAD.b}L${x(pts[0].d).toFixed(1)},${H - PAD.b}Z`
    return { x, y, ticks, line, area }
  }, [pts, k, w])
  const pick = (cx: number) => {
    if (!geo) return
    let best = 0, bd = Infinity
    pts.forEach((p, i) => { const dd = Math.abs(geo.x(p.d) - cx); if (dd < bd) { bd = dd; best = i } })
    setHi(best)
  }
  const sel = hi != null ? pts[hi] : null
  const delta = (o: typeof d.week) => (o ? o[k] : null)
  return (
    <Card className="gap-3 px-5">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <h2 className="mr-auto font-heading text-lg leading-tight font-semibold">Progress over time</h2>
        <Segmented value={k} onValueChange={(v) => { setK(v as Key); setHi(null) }} items={METRICS.map(({ value, label }) => ({ value, label }))} />
      </div>
      <StatList cols={3} items={[
        { k: "Now", v: fmt(d.now[k]) },
        { k: "Last 7 days", v: delta(d.week) == null ? "—" : signed(delta(d.week) as number), x: d.week ? `since ${short(d.week.since)}` : "no history yet" },
        { k: "Last 30 days", v: delta(d.month) == null ? "—" : signed(delta(d.month) as number), x: d.month ? `since ${short(d.month.since)}` : "no history yet" },
      ]} />
      <div ref={box} className="relative">
        {geo ? (
          <>
            <svg width={w} height={H} role="img" aria-label={`${m.long} over time, from ${fmt(pts[0][k])} on ${short(pts[0].d)} to ${fmt(pts[pts.length - 1][k])} on ${short(pts[pts.length - 1].d)}. A table is below.`}
              tabIndex={0} className="block touch-none rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              onPointerMove={(e) => pick(e.clientX - e.currentTarget.getBoundingClientRect().left)} onPointerLeave={() => setHi(null)}
              onKeyDown={(e) => {
                if (e.key === "ArrowLeft" || e.key === "ArrowRight") { e.preventDefault(); setHi((h) => Math.max(0, Math.min(pts.length - 1, (h ?? pts.length - 1) + (e.key === "ArrowRight" ? 1 : -1)))) }
                if (e.key === "Escape") setHi(null)
              }} onBlur={() => setHi(null)}>
              {geo.ticks.map((v) => (
                <g key={v}>
                  <line x1={PAD.l} x2={w - PAD.r} y1={geo.y(v)} y2={geo.y(v)} stroke="var(--border)" strokeWidth={1} />
                  <text x={PAD.l - 8} y={geo.y(v)} dy="0.32em" textAnchor="end" className="fill-muted-foreground text-[11px] tabular-nums">{fmt(v)}</text>
                </g>
              ))}
              <text x={PAD.l} y={H - 6} className="fill-muted-foreground text-[11px]">{short(pts[0].d)}</text>
              <text x={w - PAD.r} y={H - 6} textAnchor="end" className="fill-muted-foreground text-[11px]">{short(pts[pts.length - 1].d)}</text>
              <path d={geo.area} fill="var(--primary)" opacity={0.1} />
              <path d={geo.line} fill="none" stroke="var(--primary)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
              {sel ? (
                <>
                  <line x1={geo.x(sel.d)} x2={geo.x(sel.d)} y1={PAD.t} y2={H - PAD.b} stroke="var(--muted-foreground)" strokeWidth={1} />
                  <circle cx={geo.x(sel.d)} cy={geo.y(sel[k])} r={5} fill="var(--primary)" stroke="var(--card)" strokeWidth={2} />
                </>
              ) : (
                <circle cx={geo.x(pts[pts.length - 1].d)} cy={geo.y(pts[pts.length - 1][k])} r={4} fill="var(--primary)" stroke="var(--card)" strokeWidth={2} />
              )}
            </svg>
            {sel ? (
              <div role="status" className="pointer-events-none absolute top-1 rounded-lg border bg-popover px-2.5 py-1.5 text-xs shadow-md"
                style={{ left: Math.min(Math.max(0, geo.x(sel.d) - 70), w - 150) }}>
                <b className="block font-medium">{short(sel.d)}</b>
                <span className="text-muted-foreground">{m.long}: </span><span className="tabular-nums">{fmt(sel[k])}</span>
              </div>
            ) : null}
          </>
        ) : (
          <p className="py-4 text-sm text-muted-foreground">
            Your history starts {d.first ? short(d.first) : "today"}. Tennoform saves a snapshot each day you make progress, so the chart fills in as you play and sync.
          </p>
        )}
      </div>
      {pts.length ? (
        <details className="text-sm">
          <summary className="cursor-pointer text-muted-foreground hover:text-foreground">Show as a table</summary>
          <div className="mt-2 max-h-64 overflow-auto rounded-lg border">
            <table className="w-full text-right tabular-nums">
              <thead className="sticky top-0 bg-card text-xs text-muted-foreground"><tr><th scope="col" className="px-3 py-1.5 text-left font-normal">Day</th>{METRICS.map((x) => <th key={x.value} scope="col" className="px-3 py-1.5 font-normal">{x.long}</th>)}</tr></thead>
              <tbody>{[...pts].reverse().map((p) => <tr key={p.d} className="border-t"><th scope="row" className="px-3 py-1.5 text-left font-normal">{short(p.d)}</th>{METRICS.map((x) => <td key={x.value} className="px-3 py-1.5">{fmt(p[x.value])}</td>)}</tr>)}</tbody>
            </table>
          </div>
        </details>
      ) : null}
    </Card>
  )
}
