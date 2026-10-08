import { useEffect, useState } from "react"
import { Search, ShieldCheck, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GoLink } from "@/components/tf/go-link"
import { Island } from "@/components/tf/island"
import { NumField } from "@/components/tf/num-field"
import { fmt, tf, useTF, useTFData, type TennoData } from "@/lib/tf"
import { MasteryRing } from "@/pages/home/mastery-hero"
import { SignInCard } from "@/pages/home/side-cards"
import { InventoryImport } from "./inventory-import"
import { MyPicture } from "@/components/tf/person"

function Inventory({ d }: { d: TennoData }) {
  const [q, setQ] = useState(d.q || "")
  useEffect(() => {
    const t = window.setTimeout(() => q !== d.q && tf().tennoSet({ q }), 160)
    return () => window.clearTimeout(t)
  }, [q, d.q])
  return (
    <Card className="gap-3 px-4">
      <h2 className="font-heading text-lg leading-tight font-semibold">Inventory</h2>
      <p className="text-sm text-muted-foreground">Type what you have. Shopping lists across the app then show how much is left of each material.</p>
      <div className="relative">
        <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find another material" aria-label="Find another material" className="h-10 pr-9 pl-9" />
        {q ? <Button variant="ghost" size="icon-sm" className="absolute top-1/2 right-1.5 -translate-y-1/2" onClick={() => setQ("")} aria-label="Clear search"><X /></Button> : null}
      </div>
      <ul className="grid gap-x-6 sm:grid-cols-2">
        {d.inv!.map((r) => (
          <li key={r.n} className="flex items-center justify-between gap-3 border-b py-1.5">
            <GoLink k={"res|" + r.n} className="min-w-0 truncate text-sm">{r.n}</GoLink>
            <NumField value={r.have} onCommit={(v) => tf().setInv(r.n, v)} label={`How many ${r.n} you have`} className="w-24 text-right" />
          </li>
        ))}
      </ul>
      {d.total! > 120 ? <p className="text-xs text-muted-foreground">Showing 120 of {fmt(d.total!)}. Search to narrow it down.</p> : null}
      {!d.inv!.length ? <p className="text-sm text-muted-foreground">No material by that name.</p> : null}
    </Card>
  )
}

export function TennoPage() {
  const d = useTFData(() => tf().tenno())
  const s = useTF()
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-5 md:px-6 md:py-6">
      <header className="flex items-center gap-4">
        <MasteryRing pct={d.pct} label={d.mrLabel} size={72} />
        <MyPicture name={d.name} className="size-14" />
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="text-xs text-muted-foreground">Profile</span>
          <h1 className="truncate font-heading text-3xl font-semibold">{d.name}</h1>
          {d.synced ? <span className="text-sm text-muted-foreground">Last synced {d.synced}{d.inGame ? ` · In-game MR ${d.inGame}` : ""}</span> : null}
        </div>
        {s.admin ? <Button variant="outline" className="ml-auto h-10 shrink-0" onClick={() => tf().go("admin")}><ShieldCheck /> Backend</Button> : null}
      </header>
      {d.showSign && d.tab !== "account" ? <SignInCard /> : null}
      <Tabs value={d.tab} onValueChange={(v) => tf().tennoSet({ tab: String(v) })}>
        <div className="scroll-fade -mx-4 overflow-x-auto px-4 pb-1 md:mx-0 md:px-0">
        <TabsList className="min-w-max justify-start">
          {d.tabs.map((t) => <TabsTrigger key={t.value} value={t.value} className="flex-none px-3">{t.label}</TabsTrigger>)}
        </TabsList>
        </div>
      </Tabs>
      {d.tab === "inventory" ? <Inventory d={d} /> : <Island key={d.tab} html={d.html} />}
      {d.tab === "account" ? <InventoryImport /> : null}
    </div>
  )
}
