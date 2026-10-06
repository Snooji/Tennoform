import { useEffect, useState } from "react"
import { ChevronDown, Cloud, EyeOff, HardDrive, MessageSquare, Trash2, Users } from "lucide-react"

import { Card } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"
import { tf, useTFData } from "@/lib/tf"
import { PageHead, linkCls } from "./page-head"

const Ext = ({ href, children }: { href: string; children: React.ReactNode }) => <a href={href} target="_blank" rel="noopener" className={linkCls}>{children}</a>
const DOT: Record<string, string> = { ok: "bg-emerald-500", warn: "bg-amber-500", bad: "bg-red-500", off: "bg-muted-foreground/50" }

/** "Title: a, b, c" → heading plus a list, so long entries scan on a phone. */
function splitChange(t: string) {
  const i = t.indexOf(": ")
  const head = i > 0 && i < 40 ? t.slice(0, i) : ""
  const items = (head ? t.slice(i + 2) : t).replace(/\.$/, "").split(/,\s+(?:and\s+)?/).map((x) => x.charAt(0).toUpperCase() + x.slice(1))
  return { head, items }
}

const PRIVACY: [typeof Cloud, string, string][] = [
  [HardDrive, "Without an account", "Your progress stays in this browser only."],
  [Cloud, "With an account", "Progress, tasks and settings are stored in Google Firebase so they follow you between devices. Only you can read them."],
  [Users, "Friends", "See your display name, friend code, MR, total Mastery XP and node counts. Messages are kept until you or they delete them."],
  [MessageSquare, "Feedback", "Readable only by the developer."],
  [EyeOff, "No ads, no analytics, no tracking", "Your browser only contacts Google Fonts, warframestat.us (live data, item images, profile sync) and Firebase when you're signed in."],
  [Trash2, "Your data, your call", "Export it any time (Profile → Backup & export), or delete your account and everything stored with it (Profile → Account & sync)."],
]

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="gap-3 px-5">
      <h2 className="font-heading text-xl leading-tight font-semibold">{title}</h2>
      {children}
    </Card>
  )
}

export function AboutPage() {
  const d = useTFData(() => tf().about())
  const [open, setOpen] = useState(d.sec === "changes")
  useEffect(() => { if (d.sec === "changes") setOpen(true) }, [d.sec])
  const sources: [string, React.ReactNode][] = [
    ["Items, mastery, relics, mods, arcanes", <><Ext href="https://github.com/WFCD/warframe-items">WFCD warframe-items</Ext>{d.wfcd ? ` v${d.wfcd}` : ""}</>],
    ["Drop locations, quests, junctions, syndicates, fishing and mining", <Ext href="https://wiki.warframe.com">Warframe Wiki</Ext>],
    ["Live cycles, fissures, Baro, Sortie, Prime Resurgence", <><Ext href="https://docs.warframestat.us">warframestat.us</Ext> (checked when you open Today)</>],
    ["Prices and cheapest sellers", <><Ext href="https://warframe.market">warframe.market</Ext> (refreshed daily)</>],
    ["Your profile sync", "Warframe's public profile for your account ID, read-only"],
  ]
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-4 py-5 md:px-6 md:py-6">
      <PageHead eyebrow="About" title="About Tennoform" lede={d.pitch} />
      <p className="max-w-[68ch] text-sm">
        Tennoform is made and maintained by <b>Snooji</b>, a Warframe player, on their own time. Ideas and bug reports go straight to them through{" "}
        <a href="#feedback" className={linkCls}>Feedback</a>, and every change is listed under What's new below.
      </p>
      <p className="rounded-2xl border border-amber-500/40 bg-amber-500/5 px-4 py-3 text-sm">
        <b>Unofficial community tool.</b> Tennoform is made by one independent developer. It is not affiliated with, endorsed or sponsored by Digital Extremes,
        and it is not an official Warframe service. For Foundry orders and in-game actions, use Warframe or the official Warframe Companion app.
      </p>

      <Card id="changes" className="scroll-mt-20 gap-0 px-5">
        <Collapsible open={open} onOpenChange={setOpen}>
          <CollapsibleTrigger className="group flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
            <span className="flex flex-col">
              <h2 className="font-heading text-xl leading-tight font-semibold">What's new</h2>
              <span className="text-sm text-muted-foreground">Site updated {d.site}</span>
            </span>
            <ChevronDown aria-hidden className="size-5 text-muted-foreground transition-transform group-data-[panel-open]:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <ol className="mt-4 flex flex-col gap-4 border-l border-primary/30 pl-5">
              {d.changes.map((c, i) => {
                const { head, items } = splitChange(c.t)
                const short = items.every((x) => x.length < 28)
                return (
                  <li key={i} className="relative flex flex-col gap-1.5 text-sm">
                    <span aria-hidden className={cn("absolute top-1.5 -left-[26px] size-2.5 rounded-full ring-4 ring-card", i ? "bg-muted-foreground/60" : "bg-primary")} />
                    <span className="flex flex-wrap items-baseline gap-x-2">
                      <b className="font-heading text-base font-semibold">{head || c.d}</b>
                      {head ? <span className="text-xs text-muted-foreground">{c.d}</span> : null}
                    </span>
                    {short ? (
                      <ul className="flex flex-wrap gap-1.5">{items.map((x) => <li key={x} className="rounded-full border px-2.5 py-0.5 text-xs text-muted-foreground">{x}</li>)}</ul>
                    ) : (
                      <ul className="flex list-disc flex-col gap-1 pl-4 text-muted-foreground marker:text-primary/50">{items.map((x) => <li key={x}>{x}</li>)}</ul>
                    )}
                  </li>
                )
              })}
            </ol>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      <Section title="Where the data comes from">
        <dl className="flex flex-col divide-y text-sm">
          {sources.map(([k, v]) => (
            <div key={k} className="flex flex-col gap-0.5 py-2.5 first:pt-0 sm:flex-row sm:gap-6">
              <dt className="text-muted-foreground sm:w-1/2 sm:shrink-0">{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
        <ul className="flex flex-col gap-1.5 rounded-xl bg-muted/40 px-3 py-2.5 text-sm sm:flex-row sm:flex-wrap sm:gap-x-5" aria-label="Data freshness">
          {d.feeds.map((f) => <li key={f.t} className="flex items-center gap-2"><span aria-hidden className={cn("size-2 rounded-full", DOT[f.k])} />{f.t}</li>)}
        </ul>
        <p className="text-xs text-muted-foreground">
          New game content is checked weekly against the WFCD data set. Recommendations such as farms and builds are community guidance, not guarantees.
          If something looks wrong, <a href="#feedback" className={linkCls}>send feedback</a>.
        </p>
      </Section>

      <Section title="Privacy">
        <ul className="flex flex-col divide-y text-sm">
          {PRIVACY.map(([Icon, t, x]) => (
            <li key={t} className="flex gap-3 py-2.5 first:pt-0 last:pb-0">
              <span aria-hidden className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-primary/10 text-primary"><Icon className="size-4" /></span>
              <span className="flex min-w-0 flex-col gap-0.5"><b className="font-medium">{t}</b><span className="text-muted-foreground">{x}</span></span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Contact">
        <p className="text-sm">
          Bugs, ideas or wrong data: <a href="#feedback" className={linkCls}>Feedback page</a>. Like the app? <a href="#donate" className={linkCls}>Support Tennoform</a>.
        </p>
      </Section>
    </div>
  )
}
