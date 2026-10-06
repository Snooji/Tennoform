import { Copy, ExternalLink, Gem, Heart } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { tf, useTFData } from "@/lib/tf"
import { PageHead } from "./page-head"

function Way({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <Card className="gap-3 px-5">
      <span aria-hidden className="grid size-12 place-items-center rounded-full bg-primary/12 text-primary ring-1 ring-primary/25">{icon}</span>
      <h2 className="font-heading text-xl leading-tight font-semibold">{title}</h2>
      {children}
    </Card>
  )
}

export function SupportPage() {
  const d = useTFData(() => tf().support())
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-4 py-5 md:px-6 md:py-6">
      <PageHead eyebrow="Support" title="Support Tennoform" lede="Free, no ads. Made by Snooji. If it saved you time, platinum or PayPal both help." />
      <div className="grid gap-4 md:grid-cols-2">
        <Way icon={<Heart className="size-5" />} title="Donate with PayPal">
          {d.paypal ? (
            <>
              <p className="text-sm">A one-off donation of any amount. You don't need a PayPal account to pay by card.</p>
              <a href={d.paypal} target="_blank" rel="noopener" className={cn(buttonVariants(), "h-10 self-start px-4")}>
                Donate on PayPal <ExternalLink />
              </a>
            </>
          ) : <p className="text-sm text-muted-foreground">PayPal donations open soon.</p>}
        </Way>
        <Way icon={<Gem className="size-5" />} title="Donate platinum">
          {d.ign ? (
            <>
              <p className="text-sm">Send any amount of platinum in game to <b className="font-mono text-primary">{d.ign}</b>.</p>
              <ol className="flex list-decimal flex-col gap-1 pl-5 text-sm marker:text-muted-foreground">
                <li>Copy the whisper below and paste it into in-game chat.</li>
                <li>Meet in Maroo's Bazaar (Mars) or a Clan Dojo Trading Post.</li>
                <li>Open a trade and add the platinum. Trading needs MR 2 and two-factor sign-in, and costs a small credit tax.</li>
              </ol>
              <div className="flex flex-wrap gap-2">
                <Button className="h-10 px-4" onClick={() => tf().copy(d.whisper)}><Copy /> Copy whisper</Button>
                <Button variant="outline" className="h-10 px-4" onClick={() => tf().copy(d.ign)}>Copy name</Button>
              </div>
            </>
          ) : <p className="text-sm text-muted-foreground">Platinum donations open soon.</p>}
        </Way>
      </div>
      <p className="rounded-2xl border border-dashed px-4 py-3 text-sm text-muted-foreground">Donations don't unlock anything. Every feature stays free for everyone.</p>
    </div>
  )
}
