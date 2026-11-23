import { Zap } from "lucide-react"

import { Card } from "@/components/ui/card"
import { Thumb } from "@/components/tf/thumb"
import { fmt, tf, useTFData, type AmpPart } from "@/lib/tf"

const hrs = (s: number) => (s >= 3600 ? `${Math.round(s / 3600)} h` : `${Math.round(s / 60)} min`)

function Part({ p }: { p: AmpPart }) {
  return (
    <li className="flex items-start gap-3 py-2.5">
      {p.img ? <Thumb src={p.img} className="size-9" /> : null}
      <span className="flex min-w-0 flex-col gap-0.5">
        <b className="text-sm font-medium">{p.n}</b>
        <span className="text-xs text-muted-foreground">
          {p.res.length ? p.res.map(([r, q]) => `${fmt(q)} ${r}`).join(" · ") : "No resources"}
          {p.cr ? ` · ${fmt(p.cr)} credits` : ""}{p.t ? ` · ${hrs(p.t)} to build` : ""}
        </span>
      </span>
    </li>
  )
}

/** On a prism's page: an amp is a Prism (the barrel, which is what counts for mastery), a Scaffold and a Brace.
    Lists the scaffolds and braces from the same seller with what each costs, from the WFCD data pack. */
export function AmpBuilder({ name }: { name: string }) {
  const d = useTFData(() => tf().amp(name))
  if (!d) return null
  return (
    <Card className="gap-3 px-5">
      <h2 className="flex items-center gap-2 font-heading text-lg font-semibold"><Zap className="size-4 text-primary" aria-hidden /> Build an amp</h2>
      <p className="text-sm text-muted-foreground">
        {d.mote
          ? "The Mote Amp is the starter amp: all three parts are free from The Quills."
          : `An amp is three parts: this Prism, a Scaffold and a Brace, all bought as blueprints from ${d.seller}, then built in your Foundry. Mastery is tracked per prism (3,000 XP each), whatever scaffold and brace you pair it with. Most amps only count once you gild them at rank 30 and level them again.`}
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <section aria-label="Scaffolds">
          <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Scaffolds · the amp's special ability</h3>
          <ul className="flex flex-col divide-y">{d.scaffolds.map((p) => <Part key={p.n} p={p} />)}</ul>
        </section>
        <section aria-label="Braces">
          <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Braces · stat bonuses</h3>
          <ul className="flex flex-col divide-y">{d.braces.map((p) => <Part key={p.n} p={p} />)}</ul>
        </section>
      </div>
      <p className="text-xs text-muted-foreground">Costs and build times come from the game data pack. Each part also needs standing with {d.mote ? "The Quills" : d.seller.split(" (")[0]}.</p>
    </Card>
  )
}
