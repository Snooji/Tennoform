import { Check, Copy, Sparkles, Target } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox"
import { HaloSegmented } from "@/components/ui/halo-segmented"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Toggle } from "@/components/ui/toggle"
import { Island } from "@/components/tf/island"
import { ModCard } from "@/components/tf/mod-card"
import { Thumb } from "@/components/tf/thumb"
import { tf, useTFData } from "@/lib/tf"

const FILTERS = [
  { value: "all", label: "All Warframes" }, { value: "owned", label: "Owned" }, { value: "not", label: "Not owned" }, { value: "mastered", label: "Mastered" },
  { value: "prime", label: "Prime" }, { value: "farm", label: "Prime, farmable now" }, { value: "goals", label: "In my goals" },
]

export function FramesPage() {
  const d = useTFData(() => tf().frames())
  const b = d.build
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-5 md:px-6 md:py-6">
      <header className="flex items-center gap-4">
        <Thumb src={d.img} className="size-16 rounded-xl" />
        <div className="flex min-w-0 flex-col gap-1">
          <span className="text-xs text-muted-foreground">Warframes</span>
          <h1 className="truncate font-heading text-3xl font-semibold">{d.name}</h1>
        </div>
      </header>
      <div className="flex flex-wrap items-center gap-2">
        <Select items={FILTERS} value={d.filter} onValueChange={(v) => tf().framesSet({ f: String(v) })}>
          <SelectTrigger className="h-10 min-w-44" aria-label="Filter Warframes"><SelectValue /></SelectTrigger>
          <SelectContent>{FILTERS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
        </Select>
        <Combobox items={d.list} value={d.name} onValueChange={(v) => v && tf().framesSet({ frame: String(v) })}>
          <ComboboxInput placeholder="Find a Warframe" aria-label="Choose a Warframe" className="h-10 min-w-56 flex-1" />
          <ComboboxContent>
            <ComboboxEmpty>No Warframe by that name.</ComboboxEmpty>
            <ComboboxList>{(n: string) => <ComboboxItem key={n} value={n}>{n}</ComboboxItem>}</ComboboxList>
          </ComboboxContent>
        </Combobox>
        {d.prime ? <Button variant="outline" className="h-10" onClick={() => tf().framesSet({ frame: d.prime })}><Sparkles /> Prime version</Button> : null}
        {d.baseVer ? <Button variant="outline" className="h-10" onClick={() => tf().framesSet({ frame: d.baseVer })}>Base version</Button> : null}
      </div>
      {d.filteredEmpty ? <p className="text-sm text-muted-foreground">No Warframes match that filter, so all of them are listed.</p> : null}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <div className="min-w-0"><Island html={d.tree} /></div>
        {b ? (
          <Card className="self-start">
            <CardHeader>
              <CardTitle><h2 className="font-heading text-lg leading-tight font-semibold">Meta build</h2></CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {d.builds.length > 1 ? <HaloSegmented items={d.builds} value={d.bi} onValueChange={(v) => tf().framesSet({ build: v })} /> : null}
                <Toggle variant="outline" pressed={d.budget} onPressedChange={(v) => tf().framesSet({ budget: v })} className="h-9 px-3 data-[pressed]:border-primary/60 data-[pressed]:bg-primary/15">Budget mods</Toggle>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <Badge variant="outline" className="border-primary/40 text-primary">{b.role}</Badge>
                <span>Helminth: <b className="font-medium">{b.helminth}</b></span>
              </div>
              {b.notes ? <p className="text-sm text-muted-foreground">{b.notes}</p> : null}
              <div className="flex flex-wrap gap-2">
                <Button className="h-9" onClick={() => tf().buildGoal(`m:${d.name}:${d.bi}`)}><Target /> Save as goal</Button>
                <Button variant="outline" className="h-9" onClick={() => tf().buildCopy(`m:${d.name}:${d.bi}`)}><Copy /> Copy to my builds</Button>
              </div>
              <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {b.mods.map((m, i) => <ModCard key={m.key + i} m={m} />)}
                {b.arcanes.map((m, i) => <ModCard key={m.key + "a" + i} m={m} />)}
              </ul>
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><Check className="size-3.5" aria-hidden /> Tick what you own. Based on current community consensus; Forma the slots to match each mod's polarity.</p>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  )
}
