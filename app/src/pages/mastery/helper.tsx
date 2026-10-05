import { Coins, Hexagon, Zap } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { HaloSegmented } from "@/components/ui/halo-segmented"
import { Progress } from "@/components/ui/progress"
import { GoLink } from "@/components/tf/go-link"
import { Thumb } from "@/components/tf/thumb"
import { cn } from "@/lib/utils"
import { fmt, tf, type HelperData } from "@/lib/tf"

const pct = (p: number) => (p >= 0.995 ? "99%+" : p < 0.01 ? "<1%" : Math.round(p * 100) + "%")
const tone = (p: number) => (p >= 0.75 ? "border-emerald-500/40 text-emerald-700 dark:text-emerald-400" : p >= 0.35 ? "border-amber-500/40 text-amber-700 dark:text-amber-400" : "text-muted-foreground")

function Row({ img, n, right, children }: { img: string; n: string; right: React.ReactNode; children?: React.ReactNode }) {
  return (
    <li className="flex gap-3 px-4 py-3">
      <Thumb src={img} className="size-10" />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1"><GoLink k={"item|" + n} className="font-medium">{n}</GoLink>{right}</div>
        {children}
      </div>
    </li>
  )
}

/** Like AlecaFrame's mastery helper: what's free, what your relics can finish, and what's cheapest to buy. */
export function Helper({ h }: { h: HelperData }) {
  return (
    <>
      <HaloSegmented
        className="self-start"
        value={h.mode}
        onValueChange={(v) => tf().helperSet(v)}
        items={[
          { value: "easy", label: <span className="flex items-center gap-1.5"><Zap className="size-4" aria-hidden /> Easy wins</span> },
          { value: "relics", label: <span className="flex items-center gap-1.5"><Hexagon className="size-4" aria-hidden /> From your relics</span> },
          { value: "plat", label: <span className="flex items-center gap-1.5"><Coins className="size-4" aria-hidden /> With platinum</span> },
        ]}
      />
      {h.mode === "easy" ? (
        <>
          <p className="text-sm text-muted-foreground">
            Mastery you can earn without farming anything: gear you've already started, things you've built but not ranked, and intrinsics.
            {h.total ? <> About <b className="font-medium text-foreground">{fmt(h.total)} XP</b> waiting.</> : null}
          </p>
          {h.built!.length ? (
            <Card className="gap-0 py-0">
              <h3 className="border-b px-4 py-3 font-heading text-base font-semibold">Built or building, not ranked yet</h3>
              <ul className="flex flex-col divide-y">{h.built!.map((b) => <Row key={b.n} img={b.img} n={b.n} right={<Badge variant="outline" className="border-primary/40 text-primary">+{fmt(b.xp)} XP</Badge>}><span className="text-xs text-muted-foreground">{b.state}</span></Row>)}</ul>
            </Card>
          ) : null}
          <Card className="gap-0 py-0">
            <h3 className="border-b px-4 py-3 font-heading text-base font-semibold">Started, keep levelling ({h.leveling!.length})</h3>
            {h.leveling!.length ? (
              <ul className="flex flex-col divide-y">
                {h.leveling!.slice(0, 60).map((x) => (
                  <Row key={x.n} img={x.img} n={x.n} right={<Badge variant="outline" className="border-primary/40 text-primary">+{fmt(x.left)} XP</Badge>}>
                    <span className="flex items-center gap-2"><Progress value={(100 * x.rank) / x.mx} className="h-1 flex-1" aria-label={`${x.n} rank ${x.rank} of ${x.mx}`} /><span className="text-xs text-muted-foreground tabular-nums">rank {x.rank}/{x.mx}</span></span>
                  </Row>
                ))}
              </ul>
            ) : <p className="px-4 py-5 text-sm text-muted-foreground">Nothing half-levelled. Set ranks on the Ranks page or sync your profile.</p>}
          </Card>
          {h.intr!.length ? (
            <Card className="gap-0 py-0">
              <h3 className="border-b px-4 py-3 font-heading text-base font-semibold">Intrinsics</h3>
              <ul className="flex flex-col divide-y">{h.intr!.map((x) => <li key={x.n} className="flex items-center gap-3 px-4 py-3"><a href="#ranks" onClick={(e) => { e.preventDefault(); tf().act("button", { "data-rkcat": "Intrinsics" }) }} className="flex-1 font-medium underline decoration-primary/50 underline-offset-4">{x.n}</a><Badge variant="outline" className="border-primary/40 text-primary">+{fmt(x.left)} XP</Badge></li>)}</ul>
            </Card>
          ) : null}
        </>
      ) : h.mode === "relics" ? (
        <>
          <p className="text-sm text-muted-foreground">Prime gear you haven't mastered whose missing parts all drop from relics you own, with the chance you get every part before you run out. Refined relics count at their better odds.</p>
          {!h.relicCount ? (
            <Card className="items-start gap-2 p-6 text-sm"><b className="font-heading text-base font-semibold">No relics entered yet</b><p className="text-muted-foreground">Add the relics in your inventory and this list fills in.</p><a href="#relics" onClick={(e) => { e.preventDefault(); tf().act("button", { "data-rltab": "add" }) }} className="font-medium underline decoration-primary/60 underline-offset-4">Add relics</a></Card>
          ) : h.items.length ? (
            <Card className="gap-0 py-0">
              <ul className="flex flex-col divide-y">
                {h.items.map((x) => (
                  <Row key={x.n} img={x.img} n={x.n} right={<><Badge variant="outline" className={tone(x.p!)}>{pct(x.p!)} to finish</Badge><Badge variant="outline" className="border-primary/40 text-primary">+{fmt(x.xp)} XP</Badge></>}>
                    <ul className="flex flex-col gap-0.5 text-xs text-muted-foreground">
                      {x.parts.map((p) => <li key={p.full}><span className={cn("font-medium", p.p! >= 0.75 ? "text-foreground" : "")}>{p.full}</span> · {pct(p.p!)} from {p.relics!.join(", ")}</li>)}
                    </ul>
                  </Row>
                ))}
              </ul>
            </Card>
          ) : <Card className="p-6 text-sm text-muted-foreground">None of your relics finish an unmastered item on their own yet. Add more relics or check With platinum.</Card>}
        </>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">Prime gear you haven't mastered, by what the parts you're missing cost on warframe.market (7-day average). Where buying the full set is cheaper, that's what's shown.</p>
          <Card className="gap-0 py-0">
            <ul className="flex flex-col divide-y">
              {h.items.map((x) => (
                <Row key={x.n} img={x.img} n={x.n} right={<><Badge variant="outline" className="border-primary/40 text-primary">+{fmt(x.xp)} XP</Badge><b className="ml-auto font-heading text-lg font-semibold tabular-nums">{fmt(x.cost!)}p</b></>}>
                  <span className="text-xs text-muted-foreground">
                    {x.useSet ? "Full set" : x.parts.map((p) => `${p.full.replace(x.n + " ", "")} ${p.plat}p`).join(" · ")} · {Math.round(x.per1k!)}p per 1,000 XP
                  </span>
                </Row>
              ))}
            </ul>
          </Card>
        </>
      )}
    </>
  )
}
