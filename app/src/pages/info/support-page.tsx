import { ExternalLink, Heart } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { tf, useTFData } from "@/lib/tf"
import { PageHead } from "./page-head"

function Way({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3 px-5 py-5">
      <h2 className="flex items-center gap-2 font-heading text-xl leading-tight font-semibold"><span aria-hidden className="text-muted-foreground">{icon}</span>{title}</h2>
      {children}
    </section>
  )
}

export function SupportPage() {
  const d = useTFData(() => tf().support())
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-4 py-5 md:px-6 md:py-6">
      <PageHead eyebrow="Support" title="Support Tennoform" lede="Free, no ads. Made by Snooji. If it saved you time, a PayPal donation helps keep it running." />
      <Card className="gap-0 py-0">
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
      </Card>
      <p className="text-sm text-muted-foreground">Donations don't unlock anything. Every feature stays free for everyone.</p>
    </div>
  )
}
