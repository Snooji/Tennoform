import { useState } from "react"
import { Bell, ChevronRight, Database, FileUp, Info, LogIn, MessageSquare, Palette, ShieldCheck, Trash2, UserRound, type LucideIcon } from "lucide-react"

import { Card } from "@/components/ui/card"
import { Segmented } from "@/components/ui/segmented"
import { AppearanceDialog } from "@/components/shell/appearance"
import { NotificationsDialog } from "@/components/shell/notifications"
import { setSimple, useSimple } from "@/lib/detail"
import { tf, useTFData } from "@/lib/tf"
import { PageHead } from "./page-head"

function Row({ icon: Icon, label, hint, onClick, danger }: { icon: LucideIcon; label: string; hint?: string; onClick: () => void; danger?: boolean }) {
  return (
    <li>
      <button type="button" onClick={onClick} className="flex min-h-14 w-full items-center gap-3 px-5 py-3 text-left transition-colors hover:bg-muted/60 focus-visible:bg-muted/60 focus-visible:outline-none">
        <Icon aria-hidden className={danger ? "size-5 shrink-0 text-destructive" : "size-5 shrink-0 text-muted-foreground"} />
        <span className="flex min-w-0 flex-1 flex-col">
          <span className={danger ? "text-sm font-medium text-destructive" : "text-sm font-medium"}>{label}</span>
          {hint ? <span className="text-xs text-muted-foreground">{hint}</span> : null}
        </span>
        <ChevronRight aria-hidden className="size-4 shrink-0 text-muted-foreground" />
      </button>
    </li>
  )
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-2" aria-label={title}>
      <h2 className="px-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">{title}</h2>
      <Card className="gap-0 py-0"><ul className="flex flex-col divide-y">{children}</ul></Card>
    </section>
  )
}

const goTab = (tab: string) => { tf().tennoSet({ tab }); tf().go("tenno") }

/** Settings: everything you can change, in one place. */
export function SettingsPage() {
  const d = useTFData(() => tf().settings())
  const simple = useSimple()
  const [look, setLook] = useState(false)
  const [ntf, setNtf] = useState(false)
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-5 px-4 py-5 md:px-6 md:py-6">
      <PageHead eyebrow="Tennoform" title="Settings" lede="Appearance, notifications, your account and your data." />
      <Group title="Look and feel">
        <Row icon={Palette} label="Appearance" hint="Light or dark, style and colour" onClick={() => setLook(true)} />
        <li className="flex flex-wrap items-center gap-3 px-5 py-3">
          <Info aria-hidden className="size-5 shrink-0 text-muted-foreground" />
          <span className="flex min-w-0 flex-1 flex-col"><span className="text-sm font-medium">Detail</span><span className="text-xs text-muted-foreground">Simple keeps guides short and hides side notes</span></span>
          <Segmented value={simple ? "simple" : "detailed"} onValueChange={(v) => setSimple(v === "simple")} items={[{ value: "detailed", label: "Detailed" }, { value: "simple", label: "Simple" }]} />
        </li>
      </Group>
      <Group title="Notifications">
        <Row icon={Bell} label="Notifications" hint="Messages, friend requests, Foundry builds and reset reminders" onClick={() => setNtf(true)} />
      </Group>
      <Group title="Account and sync">
        {d.signedIn
          ? <Row icon={UserRound} label="Account" hint={d.email ? `Signed in as ${d.email}` : "Signed in"} onClick={() => goTab("account")} />
          : d.canAcct ? <Row icon={LogIn} label="Sign in" hint="Save your progress and use it on every device" onClick={() => goTab("account")} /> : null}
        <Row icon={FileUp} label="Upload profile file" hint={d.profileFile ? `Last synced ${d.profileFile}` : "Fill in ranks, star chart and quests from your saved profile"} onClick={() => goTab("account")} />
        <Row icon={Database} label="Backup and restore" hint="Save a backup file, or restore one" onClick={() => goTab("backup")} />
      </Group>
      <Group title="About">
        <Row icon={ShieldCheck} label="About, data and privacy" hint="What's stored, where the data comes from" onClick={() => tf().go("about")} />
        <Row icon={MessageSquare} label="Send feedback" hint="Bugs, ideas or wrong data" onClick={() => tf().go("feedback")} />
        {d.signedIn ? <Row icon={Trash2} label="Delete account" hint="Deletes your account and everything saved with it" onClick={() => goTab("account")} danger /> : null}
      </Group>
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 px-1 text-xs text-muted-foreground">
        <dt>Game data</dt><dd className="tabular-nums">{d.gameData}</dd>
        <dt>Market prices</dt><dd className="tabular-nums">{d.prices}</dd>
        {d.appVersion ? <><dt>App version</dt><dd className="tabular-nums">{d.appVersion}</dd></> : null}
        <dt>Saved by you</dt><dd>{d.notes} note{d.notes === 1 ? "" : "s"} · {d.pins} pinned</dd>
      </dl>
      <AppearanceDialog open={look} onOpenChange={setLook} />
      <NotificationsDialog open={ntf} onOpenChange={setNtf} />
    </div>
  )
}
