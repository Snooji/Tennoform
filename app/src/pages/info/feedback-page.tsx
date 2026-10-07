import { useState } from "react"
import { Check, Eye, Hammer, Send } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { tf, useTFData } from "@/lib/tf"
import { SignInCard } from "@/pages/home/side-cards"
import { PageHead, linkCls } from "./page-head"

const STATUS_CLS: Record<string, string> = { seen: "text-foreground", working: "border-primary/40 text-primary", done: "border-emerald-500/40 text-emerald-700 dark:text-emerald-300" }
const KINDS = [{ value: "bug", label: "Something is wrong" }, { value: "idea", label: "Idea or request" }, { value: "other", label: "Other" }]

export function FeedbackPage() {
  const d = useTFData(() => tf().feedback())
  const [text, setText] = useState(d.prefill)
  const [contact, setContact] = useState("")
  const [busy, setBusy] = useState(false)
  const send = async () => {
    setBusy(true)
    const ok = await tf().feedbackSend(d.kind, text, contact)
    setBusy(false)
    if (ok) { setText(""); setContact("") }
  }
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-5 md:px-6 md:py-6">
      <PageHead eyebrow="Feedback" title="Send feedback" lede="Found a bug, missing data or have an idea? Tennoform is built by one developer, and every message gets read." />
      {!d.hosted ? (
        <Card className="px-5 text-sm">
          <p>Send feedback from <a href="https://tennoform.com/#feedback" target="_blank" rel="noopener" className={linkCls}>tennoform.com</a>.</p>
        </Card>
      ) : !d.ready ? (
        <Card className="px-5 text-sm text-muted-foreground" role="status">Loading…</Card>
      ) : !d.signed ? (
        <>
          <p className="text-sm">Sign in to send feedback. It only takes a moment with Google, and keeps spam out so every message gets read.</p>
          <SignInCard />
        </>
      ) : (
        <Card className="gap-4 px-5">
          <div className="flex flex-col gap-2">
            <span id="fbk-l" className="text-sm font-medium">What's it about?</span>
            <div role="radiogroup" aria-labelledby="fbk-l" className="flex flex-wrap gap-2">
              {KINDS.map((k) => {
                const on = d.kind === k.value
                return (
                  <button key={k.value} type="button" role="radio" aria-checked={on} onClick={() => tf().feedbackSet({ kind: k.value })}
                    className={cn("h-10 rounded-full border px-4 text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                      on ? "border-primary/60 bg-primary/15 text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground")}>
                    {k.label}
                  </button>
                )
              })}
            </div>
            {d.from ? <span className="text-xs text-muted-foreground">Sent from the {d.from} page</span> : null}
          </div>
          <label className="flex flex-col gap-2 text-sm font-medium">
            Your message
            <Textarea value={text} onChange={(e) => setText(e.target.value)} maxLength={2000} rows={6}
              placeholder="What happened, or what would you like to see? The more detail the better." className="min-h-36 font-normal" />
            <span className="self-end text-xs font-normal text-muted-foreground tabular-nums">{text.length} / 2,000</span>
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium">
            <span>How to reach you <span className="font-normal text-muted-foreground">(optional)</span></span>
            <Input value={contact} onChange={(e) => setContact(e.target.value)} maxLength={120} placeholder="Discord, email or in-game name if you'd like a reply" className="h-10 font-normal" />
          </label>
          <div className="flex flex-wrap items-center gap-3">
            <Button className="h-10 px-5" disabled={busy || text.trim().length < 3} onClick={send}><Send /> {busy ? "Sending…" : "Send feedback"}</Button>
            <span className="text-xs text-muted-foreground">Only the developer can read this. You'll see when it's been read and worked on.</span>
          </div>
        </Card>
      )}
      {d.signed && (d.mineLoading || d.mine.length) ? (
        <Card className="gap-3 px-5">
          <h2 className="font-heading text-lg leading-tight font-semibold">What you've sent</h2>
          {d.mineLoading ? <p className="text-sm text-muted-foreground" role="status">Loading…</p> : (
            <ul className="flex flex-col divide-y">
              {d.mine.map((m) => (
                <li key={m.id} className="flex flex-col gap-1 py-2.5">
                  <span className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span className="tabular-nums">{m.at}</span>
                    <Badge variant="outline" className={STATUS_CLS[m.status] || "text-muted-foreground"}>{m.status === "working" ? <Hammer /> : m.status === "done" ? <Check /> : m.status === "seen" ? <Eye /> : null}{m.label}</Badge>
                  </span>
                  <p className="line-clamp-3 text-sm whitespace-pre-wrap">{m.text}</p>
                </li>
              ))}
            </ul>
          )}
          <p className="text-xs text-muted-foreground">Seen means the developer has read it; Working on it means a fix or feature is underway.</p>
        </Card>
      ) : null}
      {d.admin ? (
        <p className="rounded-xl border border-dashed px-4 py-3 text-sm">You're an admin. <a href="#admin" className={linkCls}>Open the Backend</a> to read feedback and log donations.</p>
      ) : null}
    </div>
  )
}
