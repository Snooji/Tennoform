import { useRef, useState } from "react"
import { BookOpen, CircleCheck, FileUp, LoaderCircle, TriangleAlert, Undo2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { tf, useTFData } from "@/lib/tf"

/** Upload an inventory.json: everything the public profile can't see (owned gear, parts, mods, arcanes, relics, resources, Foundry). */
export function InventoryImport() {
  const info = useTFData(() => tf().inventoryInfo())
  const input = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [drag, setDrag] = useState(false)
  const [res, setRes] = useState<{ ok: boolean; msg: string } | null>(null)
  const read = async (f: File | undefined | null) => {
    if (!f) return
    setBusy(true)
    setRes(null)
    try {
      setRes(await tf().importInventory(await f.text()))
    } catch {
      setRes({ ok: false, msg: "Couldn't read that file. Try choosing it again." })
    }
    setBusy(false)
    if (input.current) input.current.value = ""
  }
  return (
    <Card className="gap-3 px-5">
      <div className="flex flex-col gap-1">
        <span className="text-xs text-muted-foreground">Optional · PC players</span>
        <h2 className="font-heading text-lg leading-tight font-semibold">Add your full inventory</h2>
        <p className="text-sm text-muted-foreground">
          Linking your account ID above is all most players need: it keeps your ranks, star chart, syndicates and quests in sync. If you play on PC and want
          Tennoform to also know the gear you own, blueprints and parts, mods, arcanes, relics, resources and your Foundry, upload an <b className="font-medium text-foreground">inventory.json</b> here.
          It's read on this device; only the results are saved.
        </p>
      </div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); read(e.dataTransfer.files?.[0]) }}
        className={cn("flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed px-4 py-6 text-center transition-colors", drag ? "border-primary bg-primary/10" : "border-border")}
      >
        {busy ? <LoaderCircle className="size-6 animate-spin text-primary" aria-hidden /> : <FileUp className="size-6 text-primary" aria-hidden />}
        <span className="text-sm">{busy ? "Reading your inventory…" : "Drop inventory.json here, or"}</span>
        <input ref={input} type="file" accept=".json,application/json" className="sr-only" id="inv-file" aria-label="Inventory file (inventory.json)" tabIndex={-1} onChange={(e) => read(e.target.files?.[0])} />
        <Button className="h-10 px-5" disabled={busy} onClick={() => input.current?.click()}>Choose file</Button>
      </div>
      {res ? (
        <p role="status" className={cn("flex items-start gap-2 rounded-xl px-3 py-2 text-sm", res.ok ? "bg-primary/10" : "bg-amber-500/10 text-amber-800 dark:text-amber-300")}>
          {res.ok ? <CircleCheck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden /> : <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />}
          {res.msg}
        </p>
      ) : null}
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" className="h-9" onClick={() => tf().open("guide|import-inventory")}><BookOpen /> How to get the file</Button>
        {info.canUndo && (res?.ok || info.at) ? <Button variant="ghost" className="h-9" onClick={() => { tf().undoSync(); setRes(null) }}><Undo2 /> Undo last import</Button> : null}
        {info.at ? <span className="text-xs text-muted-foreground">Last imported {info.at}</span> : null}
      </div>
    </Card>
  )
}
