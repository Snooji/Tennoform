import { useState } from "react"
import { Check, Copy, Download, RefreshCw, RotateCcw, Trash2, X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { tf, useTFData, type AdminData, type AdminDonation } from "@/lib/tf"
import { PageHead } from "./page-head"

const FILTERS = [{ value: "open", label: "Open" }, { value: "done", label: "Done" }, { value: "all", label: "All" }, { value: "bug", label: "Bugs" }, { value: "idea", label: "Ideas" }, { value: "other", label: "Other" }]
const DKINDS = [{ value: "paypal", label: "PayPal ($)" }, { value: "plat", label: "Platinum (in game)" }, { value: "other", label: "Other ($)" }]
const KIND_CLS: Record<string, string> = { bug: "border-red-500/40 text-red-700 dark:text-red-300", idea: "border-primary/40 text-primary", other: "text-muted-foreground" }

function Tile({ k, v, x }: { k: string; v: string; x: string }) {
  return (
    <Card size="sm" className="gap-0.5 px-4">
      <span className="text-xs text-muted-foreground">{k}</span>
      <b className="font-heading text-2xl leading-tight font-semibold tabular-nums">{v}</b>
      <span className="text-xs text-muted-foreground">{x}</span>
    </Card>
  )
}

function Inbox({ d }: { d: AdminData }) {
  const list = d.feedback || []
  return (
    <Card className="gap-3 px-4">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="mr-auto font-heading text-lg leading-tight font-semibold">Feedback inbox</h2>
        <Select items={FILTERS} value={d.filter} onValueChange={(v) => tf().adminSet({ filter: String(v) })}>
          <SelectTrigger className="h-9 min-w-32" aria-label="Filter feedback"><SelectValue /></SelectTrigger>
          <SelectContent>{FILTERS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
        </Select>
        <Button variant="outline" className="h-9" onClick={() => tf().fbReload()}><RefreshCw /> Refresh</Button>
      </div>
      {list.length ? (
        <ul className="flex flex-col divide-y">
          {list.map((x) => (
            <li key={x.id} className={cn("flex flex-col gap-1.5 py-3", x.done && "opacity-75")}>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <Badge variant="outline" className={KIND_CLS[x.kind] || KIND_CLS.other}>{x.kind}</Badge>
                <span className="text-muted-foreground tabular-nums">{x.at}</span>
                {x.page ? <span className="text-muted-foreground">· {x.page}</span> : null}
                <span className="ml-auto flex gap-1.5">
                  <Button variant="outline" size="sm" className="h-8" onClick={() => tf().fbDone(x.id)}>{x.done ? <><RotateCcw /> Reopen</> : <><Check /> Done</>}</Button>
                  <Button variant="outline" size="sm" className="h-8" onClick={() => tf().fbDel(x.id)} aria-label={`Delete feedback from ${x.name || "Anonymous"}`}><Trash2 /></Button>
                </span>
              </div>
              <p className="text-sm whitespace-pre-wrap">{x.text}</p>
              <span className="text-xs text-muted-foreground">{x.name || "Anonymous"}{x.contact ? ` · ${x.contact}` : ""}</span>
            </li>
          ))}
        </ul>
      ) : <p className="py-4 text-sm text-muted-foreground">Nothing here.</p>}
    </Card>
  )
}

function DonRow({ x }: { x: AdminDonation }) {
  const [armed, setArmed] = useState(false)
  return (
    <li className="flex items-center gap-3 py-2.5">
      <b className="w-20 shrink-0 font-heading text-lg font-semibold tabular-nums">{x.amount}</b>
      <span className="flex min-w-0 flex-1 flex-col">
        <b className="truncate text-sm font-medium">{x.who || "Anonymous"}</b>
        <span className="truncate text-xs text-muted-foreground">{x.date} · {x.kind}{x.note ? ` · ${x.note}` : ""}</span>
      </span>
      <Button variant={armed ? "destructive" : "outline"} size="sm" className="h-8"
        onClick={() => { if (armed) tf().donDel(x.id); else { setArmed(true); window.setTimeout(() => setArmed(false), 4000) } }}
        aria-label={armed ? "Confirm delete" : `Delete donation from ${x.who || "Anonymous"}`}>
        {armed ? "Delete?" : <X />}
      </Button>
    </li>
  )
}

function Donations({ d }: { d: AdminData }) {
  const today = new Date().toISOString().slice(0, 10)
  const blank = { kind: "paypal", amount: "", who: "", date: today, note: "" }
  const [f, setF] = useState(blank)
  const [busy, setBusy] = useState(false)
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value })
  const add = async () => { setBusy(true); if (await tf().donAdd(f)) setF({ ...blank, kind: f.kind }); setBusy(false) }
  const field = "flex flex-col gap-1.5 text-sm font-medium"
  return (
    <>
      <Card className="gap-3 px-4">
        <h2 className="font-heading text-lg leading-tight font-semibold">Log a donation</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className={field}>
            <span id="dkind-l">Type</span>
            <Select items={DKINDS} value={f.kind} onValueChange={(v) => setF({ ...f, kind: String(v) })}>
              <SelectTrigger className="h-10 w-full" aria-labelledby="dkind-l"><SelectValue /></SelectTrigger>
              <SelectContent>{DKINDS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <label className={field}>Amount<Input type="number" inputMode="decimal" min="0" step="0.01" placeholder="5" value={f.amount} onChange={set("amount")} className="h-10 font-normal" /></label>
          <label className={field}>From<Input maxLength={60} placeholder="Name or in-game name" value={f.who} onChange={set("who")} className="h-10 font-normal" /></label>
          <label className={field}>Date<Input type="date" value={f.date} onChange={set("date")} className="h-10 font-normal" /></label>
          <label className={cn(field, "sm:col-span-2 lg:col-span-4")}>Note<Input maxLength={200} placeholder="Optional, e.g. message they sent" value={f.note} onChange={set("note")} className="h-10 font-normal" /></label>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button className="h-10 px-5" disabled={busy} onClick={add}>Add donation</Button>
          <span className="text-xs text-muted-foreground">Only admins can see this log. PayPal and in-game trades don't report to the site, so log each one here.</span>
        </div>
      </Card>
      <Card className="gap-2 px-4">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="mr-auto font-heading text-lg leading-tight font-semibold">Donations</h2>
          <Button variant="outline" className="h-9" onClick={() => tf().donCSV()}><Download /> Export CSV</Button>
          <Button variant="outline" className="h-9" onClick={() => tf().donReload()}><RefreshCw /> Refresh</Button>
        </div>
        {d.donErr ? <p className="text-sm text-muted-foreground">Couldn't load the log. Publish the latest Firestore rules (they add the donations collection), then tap Refresh.</p>
          : d.donLoading ? <p className="text-sm text-muted-foreground" role="status">Loading…</p>
          : d.donations!.length ? <ul className="flex flex-col divide-y">{d.donations!.map((x) => <DonRow key={x.id} x={x} />)}</ul>
          : <p className="text-sm text-muted-foreground">No donations logged yet.</p>}
      </Card>
    </>
  )
}

/** Signed-in players: live now, today, this week and month, total, and the last 14 days. */
function Players() {
  const s = useTFData(() => tf().playerStats())
  const d = s.data
  const max = d ? Math.max(1, ...d.hist.map((h) => h.n)) : 1
  return (
    <Card className="gap-3 px-5">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="font-heading text-lg leading-tight font-semibold">Players</h2>
        <span className="text-xs text-muted-foreground">{d ? `Signed-in players · updated ${d.ago} · refreshes every minute` : s.loading ? "Loading…" : ""}</span>
        <Button variant="ghost" size="sm" className="ml-auto h-8" disabled={s.loading} onClick={() => tf().playerStatsReload()}><RefreshCw className={s.loading ? "animate-spin" : ""} /> Refresh</Button>
      </div>
      {s.err ? (
        <p className="text-sm text-amber-800 dark:text-amber-300">{s.err === "permission" ? "Firebase blocked the player counts. Publish the latest firestore.rules from GitHub (Firestore Database → Rules → Publish), then tap Refresh." : `Couldn't load player counts (${s.err}).`}</p>
      ) : d ? (
        <>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
            <Tile k="Live now" v={String(d.live)} x="active in the last 5 min" />
            <Tile k="Last hour" v={String(d.hour)} x="active in the last hour" />
            <Tile k="Today (DAU)" v={String(d.dau)} x="since 00:00 UTC" />
            <Tile k="7 days" v={String(d.wau)} x="weekly active" />
            <Tile k="30 days" v={String(d.mau)} x="monthly active" />
            <Tile k="Total users" v={String(d.total)} x="have signed in" />
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-muted-foreground">Daily players, last 14 days (UTC)</span>
            <ol className="flex h-24 items-end gap-1" aria-label="Daily players, last 14 days">
              {d.hist.map((h) => (
                <li key={h.d} className="flex h-full flex-1 flex-col items-center justify-end gap-1" aria-label={`${h.d}: ${h.n}`}>
                  <span className="text-[10px] text-muted-foreground tabular-nums">{h.n || ""}</span>
                  <span className="w-full rounded-t bg-primary/70" style={{ height: `${(h.n / max) * 100}%`, minHeight: h.n ? 4 : 1 }} />
                  <span className="text-[10px] text-muted-foreground tabular-nums">{h.d.slice(8)}</span>
                </li>
              ))}
            </ol>
          </div>
          <p className="text-xs text-muted-foreground">Counts only signed-in players. Live and daily numbers start from this update; total includes everyone who has signed in before.</p>
        </>
      ) : <p className="text-sm text-muted-foreground" role="status">Loading player counts…</p>}
    </Card>
  )
}

/** Community chat review: flagged messages wait here; publish, remove, or remove and ban. Bans can be lifted. */
function ChatReview() {
  const m = useTFData(() => tf().modData())
  const [armed, setArmed] = useState("")
  return (
    <div className="flex flex-col gap-4">
      <Card className="gap-3 px-5">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="font-heading text-lg leading-tight font-semibold">Held for review ({m.list.length})</h2>
          <Button variant="outline" size="sm" className="ml-auto h-8" onClick={() => tf().modReload()}><RefreshCw /> Refresh</Button>
        </div>
        <p className="text-xs text-muted-foreground">Messages the filter caught (illegal or extremely explicit). Nobody else has seen them. Publish puts one in its room as sent; Remove deletes it.</p>
        {m.err ? <p className="text-sm text-amber-800 dark:text-amber-300">{/permission/.test(m.err) ? "Firebase blocked this. Publish the latest firestore.rules from GitHub, then tap Refresh." : `Couldn't load (${m.err}).`}</p>
          : m.loading ? <p className="text-sm text-muted-foreground" role="status">Loading…</p>
          : m.list.length ? (
            <ul className="flex flex-col divide-y">
              {m.list.map((x) => (
                <li key={x.id} className="flex flex-col gap-2 py-3">
                  <span className="flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground"><b className="text-sm font-medium text-foreground">{x.name || "Player"}</b> in {x.room} · {x.at} · <span className="rounded-full border border-amber-500/40 px-2 text-amber-800 dark:text-amber-300">{x.flag}</span></span>
                  <p className="rounded-xl bg-muted/40 px-3 py-2 text-sm break-words whitespace-pre-wrap">{x.text}</p>
                  <span className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" className="h-8" onClick={() => tf().modPublish(x.id)}><Check /> Publish</Button>
                    <Button variant="outline" size="sm" className="h-8" onClick={() => tf().modRemove(x.id, false)}><Trash2 /> Remove</Button>
                    <Button variant="destructive" size="sm" className="h-8" onClick={() => { if (armed === x.id) { tf().modRemove(x.id, true); setArmed("") } else setArmed(x.id) }}>
                      <X /> {armed === x.id ? "Tap again: remove and ban" : "Remove and ban"}
                    </Button>
                  </span>
                </li>
              ))}
            </ul>
          ) : <p className="text-sm text-muted-foreground">Nothing waiting for review.</p>}
      </Card>
      <Card className="gap-3 px-5">
        <h2 className="font-heading text-lg leading-tight font-semibold">Banned from chat ({m.bans.length})</h2>
        {m.bans.length ? (
          <ul className="flex flex-col divide-y">
            {m.bans.map((b) => (
              <li key={b.uid} className="flex flex-wrap items-center gap-2 py-2.5 text-sm">
                <span className="flex min-w-0 flex-1 flex-col"><b className="font-medium">{b.name || "Player"}</b><span className="truncate text-xs text-muted-foreground">{b.reason}{b.at ? ` · ${b.at}` : ""}</span></span>
                <Button variant="outline" size="sm" className="h-8" onClick={() => tf().modUnban(b.uid)}><RotateCcw /> Unban</Button>
              </li>
            ))}
          </ul>
        ) : <p className="text-sm text-muted-foreground">No one is banned.</p>}
        <p className="text-xs text-muted-foreground">Banned players can still read but can't post or send anything to review. You can also delete messages, remove profile pictures and ban from inside any chat room.</p>
      </Card>
      <Leaders />
    </div>
  )
}

/** Clan and alliance chat leaders: only they (and you) can change that room's background. */
function Leaders() {
  const l = useTFData(() => tf().leadData())
  const [q, setQ] = useState("")
  const rooms = l.rooms.filter((r) => !q.trim() || (r.label + " " + r.members.map((m) => m.name).join(" ")).toLowerCase().includes(q.trim().toLowerCase()))
  return (
    <Card className="gap-3 px-5">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="font-heading text-lg leading-tight font-semibold">Clan and alliance leaders</h2>
        <Button variant="outline" size="sm" className="ml-auto h-8" onClick={() => tf().leadReload()}><RefreshCw /> Refresh</Button>
      </div>
      <p className="text-xs text-muted-foreground">Warframe doesn't say who leads a clan, so you choose. Leaders can change their room's background; nobody else can. Members appear here once they've synced their profile and opened Chat.</p>
      {l.rooms.length > 6 ? <Input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find a clan or player" aria-label="Find a clan or player" className="h-9" /> : null}
      {l.err ? <p className="text-sm text-amber-800 dark:text-amber-300">{/permission/.test(l.err) ? "Firebase blocked this. Publish the latest firestore.rules from GitHub, then tap Refresh." : `Couldn't load (${l.err}).`}</p>
        : l.loading ? <p className="text-sm text-muted-foreground" role="status">Loading…</p>
        : rooms.length ? (
          <ul className="flex flex-col divide-y">
            {rooms.slice(0, 60).map((r) => (
              <li key={r.id} className="flex flex-col gap-2 py-3">
                <b className="text-sm font-medium">{r.label} <span className="font-normal text-muted-foreground">· {r.members.length} {r.members.length === 1 ? "member" : "members"}</span></b>
                <span className="flex flex-wrap gap-1.5">
                  {r.members.map((m) => (
                    <Button key={m.uid} variant={m.lead ? "default" : "outline"} size="sm" className="h-8" aria-pressed={m.lead} onClick={() => tf().leadToggle(r.id, m.uid)}>
                      {m.lead ? <Check /> : null}{m.name}
                    </Button>
                  ))}
                </span>
              </li>
            ))}
          </ul>
        ) : <p className="text-sm text-muted-foreground">No clan or alliance rooms yet.</p>}
    </Card>
  )
}

export function AdminPage() {
  const d = useTFData(() => tf().admin())
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-5 md:px-6 md:py-6">
      <PageHead eyebrow="Admin" title="Backend" />
      {d.state === "signin" ? <Card className="px-5 text-sm">Sign in with your admin account on tennoform.com to see this page.</Card>
        : d.state === "checking" ? <Card className="px-5 text-sm text-muted-foreground" role="status">Checking access…</Card>
        : d.state === "denied" ? (
          <Card className="gap-3 px-5 text-sm">
            <b className="text-base">No admin access for this account yet.</b>
            <p>Signed in as <b>{d.email || "this account"}</b>. Your user ID:</p>
            <div className="flex flex-wrap items-center gap-2">
              <code className="rounded-lg bg-muted px-2.5 py-1.5 font-mono text-xs break-all">{d.uid}</code>
              <Button variant="outline" size="sm" className="h-8" onClick={() => tf().copy(d.uid)}><Copy /> Copy</Button>
            </div>
            <ol className="flex list-decimal flex-col gap-1 pl-5">
              <li>In Firebase, open <b>Firestore Database → Data</b>.</li>
              <li>Open the <code>admins</code> collection. There must be a document whose ID is exactly the user ID above (no spaces).</li>
              <li>On the <b>Rules</b> tab, paste the rules from GitHub and tap <b>Publish</b>.</li>
              <li>Come back here and tap <b>Check again</b>.</li>
            </ol>
            <p className="text-xs text-muted-foreground">Firebase said: {d.err}</p>
            <Button className="h-10 self-start px-5" onClick={() => tf().adminRecheck()}>Check again</Button>
          </Card>
        ) : (
          <>
            <Players />
            <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
              <Tile k="Open feedback" v={String(d.open)} x={`${d.fbTotal} total`} />
              <Tile k="PayPal this month" v={d.totals!.usdM} x={`${d.totals!.usd} all time`} />
              <Tile k="Platinum this month" v={d.totals!.platM} x={`${d.totals!.plat} all time`} />
              <Tile k="Donations logged" v={String(d.totals!.n)} x={`${d.totals!.who} ${d.totals!.who === 1 ? "supporter" : "supporters"}`} />
            </div>
            <Tabs value={d.tab} onValueChange={(v) => tf().adminSet({ tab: String(v) })}>
              <TabsList>
                <TabsTrigger value="feedback" className="px-3">Feedback ({d.open})</TabsTrigger>
                <TabsTrigger value="donations" className="px-3">Donations</TabsTrigger>
                <TabsTrigger value="chat" className="px-3">Chat review{d.state === "ok" && tf().modData().list.length ? ` (${tf().modData().list.length})` : ""}</TabsTrigger>
              </TabsList>
            </Tabs>
            {d.tab === "donations" ? <Donations d={d} /> : d.tab === "chat" ? <ChatReview /> : <Inbox d={d} />}
          </>
        )}
    </div>
  )
}
