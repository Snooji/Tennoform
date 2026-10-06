import { useEffect, useState } from "react"
import { Pencil, Plus, Share2, Trash2, Undo2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Thumb } from "@/components/tf/thumb"
import { tf, useTFData, type BuildDraft, type MyBuildsData } from "@/lib/tf"
import { Votes } from "./build-library"

function Pick({ items, value, onChange, label, placeholder }: { items: string[]; value: string; onChange: (v: string) => void; label: string; placeholder: string }) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <Combobox items={items} value={value || null} onValueChange={(v) => onChange(v ? String(v) : "")}>
        <ComboboxInput placeholder={placeholder} aria-label={label} className="h-10 w-full" showClear />
        <ComboboxContent>
          <ComboboxEmpty>Nothing by that name.</ComboboxEmpty>
          <ComboboxList>{(n: string) => <ComboboxItem key={n} value={n}>{n}</ComboboxItem>}</ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  )
}

function Editor({ e, items }: { e: NonNullable<MyBuildsData["edit"]>; items: string[] }) {
  const [d, setD] = useState<BuildDraft>(e)
  useEffect(() => setD(e), [e.id, e.item]) // eslint-disable-line react-hooks/exhaustive-deps
  const set = <K extends keyof BuildDraft>(k: K, v: BuildDraft[K]) => setD((x) => ({ ...x, [k]: v }))
  const o = e.opts
  const field = "flex flex-col gap-1.5 text-xs font-medium text-muted-foreground"
  return (
    <Card className="gap-4 px-5">
      <h2 className="font-heading text-xl leading-tight font-semibold">{e.id ? "Edit build" : "New build"}</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <Pick items={items} value={d.item} label="Warframe, weapon or companion" placeholder="e.g. Saryn Prime"
          onChange={(v) => { setD((x) => ({ ...x, item: v })); if (v !== e.item) tf().myBuildEdit({ ...d, item: v } as never) }} />
        <label className={field}>Build name<Input value={d.name} onChange={(x) => set("name", x.target.value)} maxLength={60} placeholder="e.g. Steel Path spore nuke" className="h-10 text-sm font-normal text-foreground" /></label>
        <label className={field}>What it's for<Input value={d.role} onChange={(x) => set("role", x.target.value)} maxLength={60} placeholder="e.g. Survival, endurance, budget" className="h-10 text-sm font-normal text-foreground" /></label>
        {o?.slots.helminth ? <label className={field}>Helminth ability<Input value={d.helminth} onChange={(x) => set("helminth", x.target.value)} maxLength={60} placeholder="e.g. Roar → Spores" className="h-10 text-sm font-normal text-foreground" /></label> : null}
      </div>
      {o ? (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            {o.slots.aura ? <Pick items={o.mods} value={d.aura} label={o.slots.aura} placeholder={`Pick ${o.slots.aura.toLowerCase()}`} onChange={(v) => set("aura", v)} /> : null}
            {o.slots.exilus ? <Pick items={o.mods} value={d.exilus} label="Exilus" placeholder="Pick exilus mod" onChange={(v) => set("exilus", v)} /> : null}
          </div>
          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 text-sm font-medium">Mods</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {d.mods.map((m, i) => <Pick key={i} items={o.mods} value={m} label={`Slot ${i + 1}`} placeholder="Pick a mod" onChange={(v) => set("mods", d.mods.map((x, j) => (j === i ? v : x)))} />)}
            </div>
          </fieldset>
          {o.slots.arcanes ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {Array.from({ length: o.slots.arcanes }, (_, i) => (
                <Pick key={i} items={o.arcanes} value={d.arcanes[i] || ""} label={`Arcane ${i + 1}`} placeholder="Pick an arcane"
                  onChange={(v) => { const a = [...d.arcanes]; a[i] = v; set("arcanes", a) }} />
              ))}
            </div>
          ) : null}
        </>
      ) : <p className="text-sm text-muted-foreground">Pick what you're building first; the mod slots then show only mods that fit it.</p>}
      <label className={field}>Notes for players who copy it<Textarea value={d.notes} onChange={(x) => set("notes", x.target.value)} maxLength={600} rows={3} placeholder="How to play it, what to swap on a budget, Forma tips" className="text-sm font-normal text-foreground" /></label>
      <div className="flex flex-wrap gap-2">
        <Button className="h-10 px-5" onClick={() => tf().myBuildSave(d)}>Save build</Button>
        <Button variant="outline" className="h-10" onClick={() => tf().myBuildEdit(null)}><Undo2 /> Cancel</Button>
      </div>
    </Card>
  )
}

export function MyBuilds() {
  const d = useTFData(() => tf().myBuilds())
  if (d.edit) return <Editor e={d.edit} items={d.items} />
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <p className="min-w-0 flex-1 text-sm text-muted-foreground">
          Your own setups. Saved to your profile; share one and other players can vote on it and copy it.{!d.signedIn && d.online ? " Sign in to share." : ""}
        </p>
        <Button className="h-10 px-4" onClick={() => tf().myBuildEdit({})}><Plus /> New build</Button>
      </div>
      {d.list.length ? (
        <ul className="grid gap-3 md:grid-cols-2">
          {d.list.map((b) => {
            const id = b.id.replace(/^mine:/, "")
            return (
              <li key={b.id}>
                <Card size="sm" className="h-full gap-3 px-4">
                  <div className="flex items-center gap-3">
                    <Thumb src={b.img} className="size-12 shrink-0 rounded-xl" />
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="text-xs text-muted-foreground">{b.item}</span>
                      <b className="truncate font-heading text-base leading-tight font-semibold">{b.name}</b>
                      <span className="text-xs text-muted-foreground tabular-nums">You own {b.have}/{b.total} parts{b.role ? ` · ${b.role}` : ""}</span>
                    </span>
                    {b.pub ? <Badge variant="outline" className="border-primary/40 text-primary"><Share2 /> Shared</Badge> : null}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" className="h-9" onClick={() => tf().myBuildEdit({ id })}><Pencil /> Edit</Button>
                    {d.online ? (b.pub
                      ? <Button variant="outline" size="sm" className="h-9" onClick={() => tf().myBuildUnpublish(id)}>Stop sharing</Button>
                      : <Button variant="outline" size="sm" className="h-9" disabled={!d.signedIn} onClick={() => tf().myBuildPublish(id)}><Share2 /> Share</Button>) : null}
                    <Button variant="ghost" size="sm" className="h-9" onClick={() => tf().myBuildDel(id)} aria-label={`Delete ${b.name}`}><Trash2 /></Button>
                  </div>
                </Card>
              </li>
            )
          })}
        </ul>
      ) : (
        <p className="rounded-2xl border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">
          No builds yet. Start one with <b className="font-medium text-foreground">New build</b>, or open any build in <b className="font-medium text-foreground">Top builds</b> and copy it.
        </p>
      )}
    </div>
  )
}

export { Votes }
