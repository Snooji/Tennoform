import { useEffect, useState } from "react"
import { ChevronDown, CircleAlert, CircleCheck, CircleMinus, Clock, Cloud, EyeOff, HardDrive, MessageSquare, Trash2, Users, ShieldCheck, KeyRound, Gauge, Coins, Handshake } from "lucide-react"

import { Card } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"
import { tf, useTFData } from "@/lib/tf"
import { PageHead, linkCls } from "./page-head"

const Ext = ({ href, children }: { href: string; children: React.ReactNode }) => <a href={href} target="_blank" rel="noopener" className={linkCls}>{children}</a>
/** Feed freshness as an icon beside the words, so it never depends on colour alone. */
const FEED = {
  ok: { Icon: CircleCheck, cls: "text-emerald-700 dark:text-emerald-400" },
  warn: { Icon: Clock, cls: "text-amber-700 dark:text-amber-300" },
  bad: { Icon: CircleAlert, cls: "text-destructive" },
  off: { Icon: CircleMinus, cls: "text-muted-foreground" },
}

/** "Title: a, b, c" → heading plus a list, so long entries scan on a phone. */
function splitChange(t: string) {
  const i = t.indexOf(": ")
  const head = i > 0 && i < 40 ? t.slice(0, i) : ""
  const items = (head ? t.slice(i + 2) : t).replace(/\.$/, "").split(/,\s+(?:and\s+)?/).map((x) => x.charAt(0).toUpperCase() + x.slice(1))
  return { head, items }
}

const PRIVACY: [typeof Cloud, string, string][] = [
  [HardDrive, "Without an account", "Your progress stays in this browser only."],
  [Cloud, "With an account", "Progress, tasks and settings are stored in Google Firebase so they follow you between devices. Only you can read them. Tennoform also notes when you were last active and which days you visited, only to count live and daily players; deleting your account removes it."],
  [Users, "Friends", "See your display name, friend code, MR, total Mastery XP and node counts. Messages are kept until you or they delete them."],
  [MessageSquare, "Feedback", "Readable only by the developer."],
  [Cloud, "Chat", "Messages in General, Trading and LFG can be read by anyone; clan and alliance rooms only by their members. Messages the filter flags are held, and only the site owner reviews them. Delete your own messages any time."],
  [Cloud, "Profile pictures", "If you add one, anyone who sees your name in Chat can see it. Remove it any time from your Profile. Clan and alliance backgrounds are only shown to that room's members."],
  [EyeOff, "No ads, no third-party analytics, no tracking", "Your browser only contacts warframestat.us (live data and item images), Tennoform's profile relay on Google Apps Script (when you sync) and Firebase when you're signed in."],
  [Trash2, "Your data, your call", "Export it any time (Profile → Backup & export), or delete your account and everything stored with it (Profile → Account & sync)."],
]

/** Other open data and tools the Warframe community uses. Linked for credit and for players who want more; Tennoform doesn't depend on them. */
const OTHERS: [string, string, string][] = [
  ["Official drop tables", "https://www.warframe.com/droptables", "Digital Extremes' own list of every drop chance (PC). The source behind all drop data."],
  ["WFCD warframe-drop-data", "https://github.com/WFCD/warframe-drop-data", "The official drop tables as open JSON (MIT licence), at drops.warframestat.us."],
  ["WFCD on GitHub", "https://github.com/WFCD", "The Warframe Community Developers: open item data, world-state API, parsers and bots that most Warframe tools build on."],
  ["Warframe Public Export Plus", "https://github.com/calamity-inc/warframe-public-export-plus", "A cleaned-up, expanded copy of the game's public data export (MIT licence)."],
  ["browse.wf", "https://browse.wf", "Open-source browser for game data, world state and profiles."],
  ["WFinfo", "https://github.com/WFCD/WFinfo", "Open-source PC app that reads the relic reward screen and shows each part's platinum value."],
  ["FrameHub", "https://github.com/Paroxity/FrameHub", "Open-source Mastery Rank tracker."],
  ["AlecaFrame", "https://alecaframe.com", "Closed-source desktop companion (Overwolf) with inventory, relic and trading tools."],
  ["Overframe", "https://overframe.gg", "Large community build database and build planner."],
  ["warframe.market", "https://warframe.market", "Player-to-player price listings, also Tennoform's price source."],
  ["Official Warframe Companion app", "https://www.warframe.com", "Digital Extremes' own app for Foundry, inventory and chat on your phone."],
]

const FAIRPLAY: [typeof Cloud, string, string][] = [
  [ShieldCheck, "Never touches the game", "Tennoform is a website. It doesn't install anything, read or change game files or memory, sit between the game and its servers, automate play, or add macros, overlays or mods. Warframe's End User License Agreement forbids those, and Tennoform does none of them."],
  [KeyRound, "Never asks for your Warframe password", "Your account ID is read from warframe.com in your own browser. The console line and bookmark only read the ID warframe.com already stores for you; they send nothing to Warframe."],
  [Gauge, "Gentle with Warframe's servers", "Profile sync only reads the public profile page Warframe itself serves. Answers are reused for 10 minutes, there's a firm limit on how often anyone can sync, and if Warframe ever refuses a request, Tennoform stops asking for hours instead of retrying. It never disguises itself or hides where requests come from."],
  [Coins, "Free and unofficial", "Nothing is sold or behind a paywall. Donations only help keep the site running and buy nothing. Item pictures and game data come from Warframe and belong to Digital Extremes; Tennoform shows them under Digital Extremes' fan content policy and uses no Warframe or Digital Extremes logos. It isn't affiliated with or endorsed by Digital Extremes."],
  [Handshake, "Trades happen in the game", "Market prices come from warframe.market. Tennoform never signs in there or posts for you, and it doesn't sell platinum or items."],
]

function Section({ title, id, children }: { title: string; id?: string; children: React.ReactNode }) {
  return (
    <Card id={id} className="scroll-mt-20 gap-3 px-5">
      <h2 className="font-heading text-xl leading-tight font-semibold">{title}</h2>
      {children}
    </Card>
  )
}

export function AboutPage() {
  const d = useTFData(() => tf().about())
  const [open, setOpen] = useState(d.sec === "changes")
  useEffect(() => { if (d.sec === "changes") setOpen(true) }, [d.sec])
  const sources: [string, React.ReactNode, string][] = [
    ["Items, parts, Mastery, relics and their rewards, mods, arcanes, Foundry recipes, item stats, mod effects, enemies (stats, weaknesses, the planets they spawn on, what they drop)",
      <><Ext href="https://github.com/WFCD/warframe-items">WFCD warframe-items</Ext>{d.wfcd ? ` v${d.wfcd}` : ""}, the open data set built from the game's public export and Digital Extremes' official drop tables</>,
      "Checked every day; new content goes live automatically"],
    ["Drop chances and mission rewards", <><Ext href="https://www.warframe.com/droptables">Digital Extremes' official drop tables</Ext>, through WFCD</>, "With each game data update"],
    ["Guides, quests, junctions, syndicates, resource sources, open-world locations, fishing and mining",
      <><Ext href="https://wiki.warframe.com">Warframe Wiki</Ext>, rewritten in Tennoform's own words; each guide links its wiki page</>, "Reviewed by hand"],
    ["Live cycles, fissures, Baro Ki'Teer, Sortie, Archon Hunt, Nightwave, Prime Resurgence, invasions",
      <><Ext href="https://docs.warframestat.us">warframestat.us</Ext> (WFCD's open world-state API), read by your browser</>, "Live, when you open Today"],
    ["Item pictures", <><Ext href="https://github.com/WFCD/warframe-items">WFCD</Ext> image CDN (cdn.warframestat.us)</>, "With each game data update"],
    ["Prices, trade volume and cheapest sellers", <><Ext href="https://warframe.market">warframe.market</Ext> public API</>, "Refreshed daily"],
    ["Your ranks, star chart, syndicates and quests", "Warframe's public profile for your account ID, read-only, through Tennoform's relay", "When you sync"],
    ["Your owned gear, mods, relics, resources and Foundry (optional, PC)",
      <><Ext href="https://wfhelper.com">WFHelper</Ext>'s inventory.json, read on your own device; nothing is uploaded</>, "When you import, or by itself once linked"],
    ["Tennoform picks (builds)",
      "Written by Tennoform from widely used community setups, then checked by a script so every mod exists and no two mods clash. Each build says what it's for and what to upgrade later. They're guidance, not the only way to play. Every build also links searches for more builds on Overframe, YouTube and Reddit.",
      `Last reviewed ${d.buildsReviewed || "recently"}`],
    ["Player builds", "Shared by players on Tennoform and ranked by their votes", "Live"],
    ["Warframe Wiki builds",
      <>Player-written builds from the <Ext href="https://wiki.warframe.com/w/Category:User_Builds">Warframe Wiki's User Builds</Ext>, each credited to its author with the date it was made and last updated, a link to the original page, and the wiki's licence (<Ext href="https://creativecommons.org/licenses/by-nc-sa/3.0/">CC BY-NC-SA 3.0</Ext>). Many are years old, and each one says so.</>,
      "Imported Oct 2026"],
    ["Farm routes, Steel Path advice, recommendations", "Tennoform's own guidance, based on the data above and community knowledge", "Reviewed by hand"],
  ]
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-4 py-5 md:px-6 md:py-6">
      <PageHead eyebrow="About" title="About Tennoform" lede={d.pitch} />
      <p className="max-w-[68ch] text-sm">
        Tennoform is made and maintained by <b>Snooji</b>, a Warframe player, on their own time. Ideas and bug reports go straight to them through{" "}
        <a href="/feedback/" className={linkCls}>Feedback</a>, and every change is listed under What's new below.
      </p>
      <p className="rounded-xl border border-amber-500/40 bg-amber-500/5 px-4 py-3 text-sm">
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
            <ol className="mt-4 flex flex-col divide-y">
              {d.changes.map((c, i) => {
                const { head, items } = splitChange(c.t)
                const short = items.every((x) => x.length < 28)
                return (
                  <li key={i} className="grid gap-x-6 gap-y-1 py-3 text-sm first:pt-0 sm:grid-cols-[7rem_minmax(0,1fr)]">
                    <span className="text-xs text-muted-foreground tabular-nums sm:pt-0.5">{c.d}{i === 0 ? " · latest" : ""}</span>
                    <span className="flex min-w-0 flex-col gap-1">
                      {head ? <b className="font-heading text-base font-semibold">{head}</b> : null}
                      {short ? (
                        <p className="text-muted-foreground">{items.join(", ")}</p>
                      ) : (
                        <ul className="flex list-disc flex-col gap-1 pl-4 text-muted-foreground marker:text-muted-foreground/60">{items.map((x) => <li key={x}>{x}</li>)}</ul>
                      )}
                    </span>
                  </li>
                )
              })}
            </ol>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      <Section title="Where the data comes from" id="sources">
        <dl className="flex flex-col divide-y text-sm">
          {sources.map(([k, v, when]) => (
            <div key={k} className="flex flex-col gap-0.5 py-2.5 first:pt-0 sm:flex-row sm:gap-6">
              <dt className="text-muted-foreground sm:w-2/5 sm:shrink-0">{k}</dt>
              <dd className="flex flex-col gap-0.5"><span>{v}</span><span className="text-xs text-muted-foreground">{when}</span></dd>
            </div>
          ))}
        </dl>
        <ul className="flex flex-col gap-1.5 border-t pt-3 text-sm sm:flex-row sm:flex-wrap sm:gap-x-5" aria-label="Data freshness">
          {d.feeds.map((f) => {
            const { Icon, cls } = FEED[f.k] ?? FEED.off
            return <li key={f.t} className="flex items-center gap-2"><Icon aria-hidden className={cn("size-4 shrink-0", cls)} />{f.t}</li>
          })}
        </ul>
        <div className="flex flex-col gap-2 border-t pt-3">
          <h3 className="text-sm font-medium">Other open sources and tools players use</h3>
          <p className="text-xs text-muted-foreground">Credited and linked for anyone who wants more. Third-party tools that read your game account aren't approved by Digital Extremes, so use them at your own risk, and never give any site or tool your Warframe password.</p>
          <ul className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
            {OTHERS.map(([n, href, t]) => (
              <li key={n} className="flex flex-col"><Ext href={href}>{n}</Ext><span className="text-xs text-muted-foreground">{t}</span></li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-muted-foreground">
          New game content is checked daily against the WFCD data set and goes live automatically. Recommendations such as farms and builds are community guidance, not guarantees.
          If something looks wrong, <a href="/feedback/" className={linkCls}>send feedback</a>.
        </p>
      </Section>

      <Section title="Privacy">
        <ul className="flex flex-col divide-y text-sm">
          {PRIVACY.map(([Icon, t, x]) => (
            <li key={t} className="flex gap-3 py-2.5 first:pt-0 last:pb-0">
              <Icon aria-hidden className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <span className="flex min-w-0 flex-col gap-0.5"><b className="font-medium">{t}</b><span className="text-muted-foreground">{x}</span></span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Playing by Warframe's rules">
        <ul className="flex flex-col divide-y text-sm">
          {FAIRPLAY.map(([Icon, t, x]) => (
            <li key={t} className="flex gap-3 py-2.5 first:pt-0 last:pb-0">
              <Icon aria-hidden className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <span className="flex min-w-0 flex-col gap-0.5"><b className="font-medium">{t}</b><span className="text-muted-foreground">{x}</span></span>
            </li>
          ))}
        </ul>
        <p className="text-xs text-muted-foreground">
          Read them yourself: Warframe's <a href="https://www.warframe.com/en/EULA" target="_blank" rel="noopener" className={linkCls}>EULA</a>,{" "}
          <a href="https://www.warframe.com/en/terms" target="_blank" rel="noopener" className={linkCls}>Terms of Use</a> and{" "}
          <a href="https://www.warframe.com/contentpolicy" target="_blank" rel="noopener" className={linkCls}>fan content policy</a>.
        </p>
      </Section>

      <Section title="Contact">
        <p className="text-sm">
          Bugs, ideas or wrong data: <a href="/feedback/" className={linkCls}>Feedback page</a>. Like the app? <a href="/donate/" className={linkCls}>Support Tennoform</a>.
        </p>
      </Section>
    </div>
  )
}
