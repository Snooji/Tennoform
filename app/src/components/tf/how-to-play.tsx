import { Gamepad2, TriangleAlert } from "lucide-react"

import { Card } from "@/components/ui/card"
import { tf, useTFData } from "@/lib/tf"

/** How to play a Warframe: the abilities to keep up, the play loop step by step, and the usual mistake. */
export function HowToPlay({ frame, plain }: { frame: string; plain?: boolean }) {
  const h = useTFData(() => tf().howto(frame))
  if (!h) return null
  const body = (
    <>
      <h2 className="flex items-center gap-2 font-heading text-lg leading-tight font-semibold"><Gamepad2 className="size-5 text-primary" aria-hidden /> How to play {h.frame}</h2>
      {h.keep.length ? (
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Keep up</span>
          <ul className="flex flex-col gap-1.5">
            {h.keep.map((a) => (
              <li key={a.n} className="text-sm"><b className="font-medium">{a.n}</b>{a.d ? <span className="text-muted-foreground"> · {a.d}</span> : null}</li>
            ))}
          </ul>
        </div>
      ) : null}
      <ol className="flex list-decimal flex-col gap-1 pl-5 text-sm marker:text-muted-foreground">
        {h.loop.map((s, i) => <li key={i}>{s}</li>)}
      </ol>
      {h.watch ? <p className="flex gap-2 rounded-lg bg-amber-500/10 px-3 py-2 text-sm text-amber-900 dark:text-amber-200"><TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />{h.watch}</p> : null}
    </>
  )
  return plain ? <section className="flex flex-col gap-3">{body}</section> : <Card className="gap-3 px-5">{body}</Card>
}
