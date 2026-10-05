import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { tf, type ModSlot } from "@/lib/tf"

/** A mod or arcane in a build: tick when you own it; where it drops and the cheapest seller. */
export function ModCard({ m }: { m: ModSlot }) {
  return (
    <li className={cn("flex gap-3 rounded-lg border bg-background/40 p-3", m.done && "border-primary/30 bg-primary/5")}>
      <Checkbox className="mt-0.5 size-5 rounded-md" checked={m.done} onCheckedChange={(v) => tf().nodeTick(m.key, !!v)} aria-label={(m.done ? "Don't have: " : "Have: ") + m.m} />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-xs text-muted-foreground">{m.slot}{m.pol ? ` · ${m.pol}` : ""}</span>
        <span className="flex flex-wrap items-baseline gap-x-2">
          <b className={cn("font-medium", m.done && "text-muted-foreground line-through decoration-primary/70")}>{m.m}</b>
          {m.price ? <span className="text-xs text-primary">{m.price}</span> : null}
        </span>
        <span className="text-xs text-muted-foreground">{m.src}</span>
        {m.seller ? <span className="tf-island text-xs" dangerouslySetInnerHTML={{ __html: m.seller }} /> : null}
      </div>
    </li>
  )
}

