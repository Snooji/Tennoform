import { useRef, useState, useSyncExternalStore } from "react"
import { BookOpen, ChevronDown, CircleCheck, Copy, FileUp, Link2, Link2Off, LoaderCircle, RefreshCw, Terminal, TriangleAlert, Undo2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { INV_COPY_DIR, INV_COPY_REMOVE, INV_COPY_SETUP } from "@/lib/inv-copy-setup"
import { cn } from "@/lib/utils"
import { tf, useTFData } from "@/lib/tf"
import { invLink, invLinkState, invLinkSubscribe, invUnlink, invUpdateNow } from "@/lib/inv-link"

const ago = (t: number) => { const m = Math.round((Date.now() - t) / 60000); return m < 1 ? "just now" : m < 60 ? `${m} min ago` : m < 1440 ? `${Math.round(m / 60)} h ago` : `${Math.round(m / 1440)} d ago` }

/** A line of PowerShell with a Copy button. */
function Cmd({ code, label }: { code: string; label: string }) {
  const copy = async () => {
    try { await navigator.clipboard.writeText(code); window.TF_UI?.toast?.("Copied. Paste it into PowerShell and press Enter.") }
    catch { window.TF_UI?.toast?.("Couldn't copy. Select the text and copy it instead.") }
  }
  return (
    <div className="flex flex-col gap-1.5">
      <pre className="max-h-40 overflow-auto rounded-lg border bg-background px-3 py-2 font-mono text-[11px] leading-snug whitespace-pre" tabIndex={0} aria-label={label}>{code}</pre>
      <Button variant="outline" className="h-9 self-start" onClick={copy}><Copy /> {label}</Button>
    </div>
  )
}

/** The one-time Windows setup that keeps a linkable copy of WFHelper's inventory.json in Documents (see lib/inv-copy-setup). */
function CopySetup() {
  return (
    <Collapsible className="rounded-lg border">
      <CollapsibleTrigger className="group flex w-full cursor-pointer items-center gap-2 px-3 py-2.5 text-left text-sm font-medium outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
        <Terminal className="size-4 text-primary" aria-hidden /> Set up the copy (once, Windows)
        <ChevronDown aria-hidden className="ml-auto size-4 text-muted-foreground transition-transform group-data-[panel-open]:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="flex flex-col gap-3 border-t px-3 py-3 text-sm">
          <ol className="flex list-decimal flex-col gap-1.5 pl-5">
            <li>Open the Start menu, type <b className="font-medium">PowerShell</b> and press Enter. No admin needed.</li>
            <li>Copy the lines below, paste them into PowerShell and press Enter. It says "Done" when it's set up.</li>
            <li>Come back here, tap <b className="font-medium">Link inventory.json</b> and pick <span className="font-mono text-xs">{INV_COPY_DIR}</span>.</li>
          </ol>
          <Cmd code={INV_COPY_SETUP} label="Copy setup lines" />
          <p className="text-muted-foreground">
            What it does: it saves a small script, <span className="font-mono text-xs">keep-inventory-copied.ps1</span>, in Documents\Tennoform (open it in Notepad to read it), and adds a
            shortcut to your Windows Startup folder so it runs hidden each time you sign in. Once a minute it copies WFHelper's inventory.json to Documents\Tennoform if WFHelper saved
            a newer one. Nothing is sent anywhere, and Tennoform still only reads the file in your browser.
          </p>
          <p className="text-muted-foreground">To turn it off, paste this into PowerShell. The copying stops within a minute, and you can delete the Documents\Tennoform folder afterwards.</p>
          <Cmd code={INV_COPY_REMOVE} label="Copy turn-off line" />
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

/** Link inventory.json once and Tennoform re-reads it whenever you come back (Chrome and Edge on a computer). */
function AutoUpdate({ onResult }: { onResult: (r: { ok: boolean; msg: string } | null | undefined) => void }) {
  const l = useSyncExternalStore(invLinkSubscribe, invLinkState)
  if (!l.supported) return <p className="text-xs text-muted-foreground">Tip: in Chrome or Edge on a computer you can link inventory.json once, and Tennoform keeps your inventory updated by itself.</p>
  const busy = l.state === "busy"
  return (
    <div className="flex flex-col gap-2 rounded-xl border bg-muted/30 px-4 py-3">
      <span className="flex items-center gap-2 text-sm font-medium"><RefreshCw className="size-4 text-primary" aria-hidden /> Keep it updated automatically</span>
      {!l.linked ? (
        <>
          <p className="text-sm text-muted-foreground">Link an inventory.json once and Tennoform reads it again every time you open or come back to this site, so you never have to upload it by hand. When your browser asks, choose <b className="font-medium text-foreground">Allow on every visit</b>.</p>
          <p className="text-sm text-muted-foreground">
            <b className="font-medium text-foreground">Linking only works outside %AppData%.</b> Chrome and Edge won't link files in that folder, which is where WFHelper saves inventory.json
            (you'd see "can't open files in this folder because it contains system files"). The setup below keeps a copy in Documents that you can link. Until then, use <b className="font-medium text-foreground">Choose file</b> below: uploading works from any folder.
          </p>
          <CopySetup />
          <p className="text-sm text-muted-foreground">Then link <span className="rounded bg-muted px-1 py-0.5 font-mono text-xs text-foreground">{INV_COPY_DIR}</span>:</p>
          <Button className="h-10 self-start px-4" disabled={busy} onClick={async () => onResult(await invLink())}><Link2 /> Link inventory.json</Button>
        </>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            Linked to <b className="font-medium text-foreground">{l.name}</b>.{" "}
            {l.state === "needs-permission" ? "Your browser wants permission again before Tennoform can read it. Tap Update now and choose Allow on every visit."
              : l.state === "missing" ? "The file has moved or was deleted. Link it again."
              : <>Updates by itself whenever you come back to Tennoform{l.fileAt ? <>; WFHelper last saved it {ago(l.fileAt)}</> : null}.</>}
          </p>
          <div className="flex flex-wrap gap-2">
            {l.state === "missing" ? <Button className="h-9" onClick={async () => onResult(await invLink())}><Link2 /> Link again</Button>
              : <Button variant={l.state === "needs-permission" ? "default" : "outline"} className="h-9" disabled={busy} onClick={async () => onResult(await invUpdateNow())}>{busy ? <LoaderCircle className="animate-spin" /> : <RefreshCw />} Update now</Button>}
            <Button variant="ghost" className="h-9" onClick={() => { invUnlink(); onResult(null) }}><Link2Off /> Unlink</Button>
          </div>
        </>
      )}
    </div>
  )
}

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
        <p className="text-sm text-muted-foreground">
          Easiest way to get it: install <b className="font-medium text-foreground">WFHelper</b> (free, wfhelper.com), let it load your inventory, then choose{" "}
          <span className="rounded bg-muted px-1 py-0.5 font-mono text-xs break-all text-foreground">%appdata%\WFHelper\api-helper\inventory.json</span> with Choose file below.
        </p>
      </div>
      <AutoUpdate onResult={(r) => setRes(r ?? null)} />
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); read(e.dataTransfer.files?.[0]) }}
        className={cn("flex flex-col items-center gap-2 rounded-xl border-2 border-dashed px-4 py-6 text-center transition-colors", drag ? "border-primary bg-primary/10" : "border-border")}
      >
        {busy ? <LoaderCircle className="size-6 animate-spin text-primary" aria-hidden /> : <FileUp className="size-6 text-primary" aria-hidden />}
        <span className="text-sm">{busy ? "Reading your inventory…" : "Or upload it once: drop inventory.json here, or"}</span>
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
