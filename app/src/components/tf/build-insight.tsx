import { ChevronDown } from "lucide-react"

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { StatList } from "@/components/tf/stat-list"
import { tf, useTFData, type ModSlot } from "@/lib/tf"

/**
 * Why a build works and what it adds up to: the role and notes, the biggest stat changes from its mods
 * (max rank, always-on bonuses only), the elements it ends up dealing, and the conditional effects on top.
 */
export function BuildInsight({ id, role, notes, item, mods, arcanes }: { id: string; role?: string; notes?: string; item: string; mods: ModSlot[]; arcanes: ModSlot[] }) {
  const d = useTFData(() => tf().buildInsight(id, { mods: mods.map((m) => m.m), arcanes: arcanes.map((m) => m.m) }))
  if (!d) return null
  return (
    <div className="flex flex-col gap-4">
      <section className="flex flex-col gap-2">
        <h3 className="font-heading text-lg leading-tight font-semibold">Why it works</h3>
        {role ? <p className="text-sm"><span className="text-muted-foreground">Role:</span> <b className="font-medium">{role}</b></p> : null}
        {notes ? <p className="text-sm whitespace-pre-wrap">{notes}</p> : null}
        {!d.ready ? <p className="text-sm text-muted-foreground">{d.failed ? "Couldn't load the mod details. Check your connection and open the build again." : "Adding up the mods…"}</p> : d.highlights.length ? (
          <ul className="flex list-disc flex-col gap-1 pl-5 text-sm marker:text-muted-foreground">{d.highlights.map((h) => <li key={h}>{h}</li>)}</ul>
        ) : null}
      </section>

      {d.ready && d.rows.length ? (
        <section className="flex flex-col gap-2">
          <h3 className="font-heading text-lg leading-tight font-semibold">Overall stats</h3>
          <StatList cols={2} items={d.rows.map((r) => ({
            k: r.k,
            v: r.from ? <><span className="font-normal text-muted-foreground">{r.from} → </span>{r.to}</> : r.to,
            x: r.note || undefined,
            key: r.k,
          }))} />
          {d.elements.length ? (
            <p className="text-sm"><span className="text-muted-foreground">Elements:</span>{" "}
              {d.elements.map((e, i) => <span key={e.t}>{i ? ", " : ""}<b className="font-medium">{e.t}</b>{e.from ? ` (${e.from.join(" + ")})` : ""} {Math.round(e.v)}</span>)}
            </p>
          ) : null}
          <p className="text-xs text-muted-foreground">
            {d.kind === "weapon"
              ? `Unmodded ${item} → this build, with every mod at max rank. Leaves out conditional bonuses, Arcanes, Rivens, faction mods and enemy armor, so real damage in a fight is usually higher.`
              : d.kind === "frame"
                ? "Base 100% → this build, with every mod at max rank and the aura included. Conditional bonuses and Arcanes aren't counted."
                : "With every mod at max rank."}
            {d.missing.length ? ` Not counted (no game data): ${d.missing.join(", ")}.` : ""}
          </p>
        </section>
      ) : null}

      {d.ready && d.cond.length ? (
        <Collapsible>
          <CollapsibleTrigger className="group inline-flex min-h-10 cursor-pointer items-center gap-1.5 rounded-md text-sm font-medium outline-none hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50">
            {d.cond.length} effects that kick in during a fight
            <ChevronDown aria-hidden className="size-4 transition-transform group-data-[panel-open]:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <ul className="flex flex-col divide-y border-y text-sm">
              {d.cond.map((c, i) => (
                <li key={c.m + i} className="flex flex-col gap-0.5 py-2">
                  <b className="font-medium">{c.m}</b>
                  <span className="text-muted-foreground">{c.t}</span>
                </li>
              ))}
            </ul>
          </CollapsibleContent>
        </Collapsible>
      ) : null}
    </div>
  )
}
