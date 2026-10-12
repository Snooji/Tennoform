import { ExternalLink } from "lucide-react"

import { linkCls } from "@/components/tf/go-link"

/** Where else players post builds for this item. Searches only: Tennoform doesn't copy other sites' builds. */
export function MoreBuilds({ item }: { item: string }) {
  const q = encodeURIComponent
  const links: [string, string][] = [
    ["Overframe", `https://duckduckgo.com/?q=${q(`site:overframe.gg ${item} build`)}`],
    ["YouTube", `https://www.youtube.com/results?search_query=${q(`${item} build warframe`)}`],
    ["Reddit", `https://www.reddit.com/r/Warframe/search/?q=${q(`${item} build`)}`],
  ]
  return (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
      <span className="text-muted-foreground">More {item} builds online:</span>
      {links.map(([n, href]) => (
        <a key={n} href={href} target="_blank" rel="noopener" className={`${linkCls} inline-flex items-center gap-1`} aria-label={`${n}: ${item} builds (opens in a new tab)`}>
          {n}<ExternalLink aria-hidden className="size-3.5" />
        </a>
      ))}
    </p>
  )
}
