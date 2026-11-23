import { useMemo, useState } from "react"
import { ArrowLeftRight, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Thumb } from "@/components/tf/thumb"
import { cn } from "@/lib/utils"
import { tf, useTFData } from "@/lib/tf"

function Table({ a, b }: { a: string; b: string }) {
  const d = useTFData(() => tf().compare(a, b))
  if (d.loading) return <p className="py-6 text-sm text-muted-foreground">Loading stats…</p>
  if (!d.rows.length) return <p className="py-6 text-sm text-muted-foreground">No stats to compare for these two.</p>
  return (
    <table className="w-full text-sm">
      <caption className="sr-only">{a} compared with {b}. The better value is marked.</caption>
      <thead>
        <tr className="border-b">
          <th scope="col" className="py-2 text-left font-normal text-muted-foreground"><span className="sr-only">Stat</span></th>
          {[[a, d.imgA, d.mrA], [b, d.imgB, d.mrB]].map(([n, img, mr]) => (
            <th key={String(n)} scope="col" className="w-[36%] py-2 text-right align-bottom">
              <span className="flex flex-col items-end gap-1">
                {img ? <Thumb src={String(img)} className="size-8" /> : null}
                <span className="leading-tight font-semibold">{n}</span>
                {mr ? <span className="text-xs font-normal text-muted-foreground">MR {mr}</span> : null}
              </span>
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y">
        {d.rows.map((r) => (
          <tr key={r.label}>
            <th scope="row" className="py-2 pr-2 text-left font-normal text-muted-foreground">{r.label}</th>
            {(["a", "b"] as const).map((k) => (
              <td key={k} className={cn("py-2 text-right tabular-nums", r.better === k && "font-semibold text-primary")}>
                {r[k]}{r.better === k ? <span className="sr-only"> (better)</span> : null}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

/** Pick a second frame or weapon from the same category, then see both side by side. */
export function CompareButton({ name }: { name: string }) {
  const [open, setOpen] = useState(false)
  const [other, setOther] = useState("")
  const [q, setQ] = useState("")
  const list = useTFData(() => (open ? tf().compareList(name) : []))
  const shown = useMemo(() => list.filter((n) => n.toLowerCase().includes(q.trim().toLowerCase())).slice(0, 40), [list, q])
  return (
    <>
      <Button variant="outline" className="h-9" onClick={() => { setOther(""); setQ(""); setOpen(true) }}><ArrowLeftRight /> Compare</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{other ? `${name} vs ${other}` : `Compare ${name} with…`}</DialogTitle>
            <DialogDescription>{other ? "Base stats, unmodded. The better value is highlighted." : "Pick another one from the same category."}</DialogDescription>
          </DialogHeader>
          {other ? (
            <>
              <Table a={name} b={other} />
              <Button variant="outline" className="h-9 self-start" onClick={() => setOther("")}>Pick a different one</Button>
            </>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="relative">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                <Input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search" aria-label="Search for the second item" className="h-10 pl-9" />
              </div>
              {list.length ? (
                <ul className="flex max-h-80 flex-col overflow-y-auto" aria-label="Pick one to compare">
                  {shown.map((n) => (
                    <li key={n}>
                      <button type="button" className="flex min-h-10 w-full items-center rounded-md px-2 text-left text-sm hover:bg-muted/60 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none" onClick={() => setOther(n)}>{n}</button>
                    </li>
                  ))}
                  {!shown.length ? <li className="px-2 py-3 text-sm text-muted-foreground">Nothing matches.</li> : null}
                </ul>
              ) : <p className="py-4 text-sm text-muted-foreground">Loading…</p>}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
