import { BookOpen, Crosshair, ExternalLink, Hammer, SearchX, Swords } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Island } from "@/components/tf/island"
import { ModInfoBody } from "@/components/tf/mod-card"
import { Thumb } from "@/components/tf/thumb"
import { WayView } from "@/pages/farm/way-detail"
import { cn } from "@/lib/utils"
import { tf, useTFData } from "@/lib/tf"

/** Everything about one mod or arcane, laid out as a page. */
function ModPage({ name }: { name: string }) {
  const d = useTFData(() => tf().modInfo(name))
  if (!d) return null
  return <Card className="gap-4 px-5"><ModInfoBody d={d} /></Card>
}

/** One thing on its own page: what it is, where to get it, prices, stats, what uses it, and where to read more. */
export function DetailsPage() {
  const d = useTFData(() => tf().details())
  if (!d.key || !d.found)
    return (
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-3 px-4 py-16 text-center">
        <SearchX className="size-8 text-muted-foreground" aria-hidden />
        <h1 className="font-heading text-2xl font-semibold">Nothing to show here</h1>
        <p className="text-sm text-muted-foreground">This link doesn't point to anything Tennoform knows. Find it in Farm finder instead.</p>
        <Button className="h-10" onClick={() => tf().go("farm")}><Crosshair /> Open Farm finder</Button>
      </div>
    )
  const mod = d.kind === "mod" || d.kind === "arc"
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-4 py-5 md:px-6 md:py-6">
      <header className="flex items-start gap-4">
        {d.img ? <Thumb src={d.img} className="size-16 shrink-0 rounded-xl" /> : null}
        <div className="flex min-w-0 flex-col gap-1">
          <span className="text-xs text-muted-foreground">{[d.kindLabel, d.cat && d.cat !== d.kindLabel ? d.cat : ""].filter(Boolean).join(" · ")}</span>
          <h1 className="font-heading text-3xl leading-tight font-semibold">{d.name}</h1>
          <div className="mt-1 flex flex-wrap gap-2">
            <Button variant="outline" className="h-9" onClick={() => { tf().act("a", { href: "#", "data-go": d.key }) }}><Crosshair /> Open in Farm finder</Button>
            {d.builds ? <Button variant="outline" className="h-9" onClick={() => { tf().buildLibSet({ q: d.name, goal: "all", kind: "all", src: "all" }); tf().arsenalSet({ tab: "top" }); tf().go("arsenal") }}><Swords /> {d.builds} build{d.builds > 1 ? "s" : ""}</Button> : null}
            {d.wiki ? (
              <a href={d.wiki} target="_blank" rel="noopener" className={cn(buttonVariants({ variant: "ghost" }), "h-9")}>
                <BookOpen /> Warframe Wiki <ExternalLink className="size-3.5" /><span className="sr-only">(opens in a new tab)</span>
              </a>
            ) : null}
          </div>
        </div>
      </header>
      {mod ? <ModPage name={d.name} /> : d.way ? <WayView w={d.way} /> : d.html ? <Island html={d.html} /> : null}
      {d.used?.length ? (
        <Card className="gap-2 px-5">
          <h2 className="flex items-center gap-2 font-heading text-lg font-semibold"><Hammer className="size-4 text-primary" aria-hidden /> Used in builds for</h2>
          <ul className="flex flex-wrap gap-1.5">
            {d.used.map((n) => (
              <li key={n}><button type="button" className="h-8 rounded-full border px-3 text-sm hover:bg-muted" onClick={() => tf().openDetails("item|" + n)}>{n}</button></li>
            ))}
          </ul>
        </Card>
      ) : null}
    </div>
  )
}
