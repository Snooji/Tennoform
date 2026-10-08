import { Check, Monitor, Moon, Sun } from "lucide-react"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ACCENTS, setAccent, useAccentChoice, type AccentChoice } from "@/lib/accent"
import { cn } from "@/lib/utils"
import { tf, useTF, type TFState } from "@/lib/tf"

const MODES: { value: TFState["theme"]; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "auto", label: "Match device", icon: Monitor },
]
const STYLES: { value: TFState["style"]; label: string; hint: string }[] = [
  { value: "default", label: "Default", hint: "Calm and plain" },
  { value: "foundry", label: "Foundry", hint: "Blueprint panels, like the in-game Foundry" },
  { value: "prime", label: "Prime", hint: "Orokin lacquer with polished metal trim" },
]
/* what each colour looks like, for the swatches (the metal stops for Prime-style swatches) */
const SWATCH: Record<Exclude<AccentChoice, "rank">, [string, string, string]> = {
  bronze: ["#a2582a", "#f6cfa8", "#c97d47"],
  silver: ["#9aa2ab", "#ffffff", "#c9d0d7"],
  gold: ["#b98a2a", "#fbeeb0", "#d6a83f"],
  radiant: ["#e6bf55", "#fffbe9", "#f2d27a"],
  jade: ["#2f8a69", "#d6f5e6", "#d1b45c"],
  teal: ["#24828f", "#d4f6f9", "#5cc5d2"],
  crimson: ["#a1232b", "#ffd2cb", "#e0655c"],
  void: ["#5f4fc8", "#ece7ff", "#a495f2"],
}
const metal = (c: [string, string, string]) => `linear-gradient(135deg, ${c[0]}, ${c[1]} 45%, ${c[2]})`

/** A small picture of each style: its backdrop, a panel and a button. */
function StylePreview({ style }: { style: TFState["style"] }) {
  if (style === "foundry")
    return (
      <span aria-hidden className="relative flex h-16 w-full items-end gap-1.5 overflow-hidden p-2" style={{ background: "linear-gradient(rgb(255 255 255/.2) 1px,transparent 1px) 0 0/10px 10px, linear-gradient(90deg,rgb(255 255 255/.2) 1px,transparent 1px) 0 0/10px 10px, #b4bfcb" }}>
        <span className="h-9 flex-1 border border-white bg-[#f4f6f8]" style={{ boxShadow: "0 4px 0 -2px #fff" }} />
        <span className="h-4 w-8 border border-[#12171c] bg-white" />
      </span>
    )
  if (style === "prime")
    return (
      <span aria-hidden className="relative flex h-16 w-full items-end gap-1.5 overflow-hidden p-2" style={{ background: "repeating-linear-gradient(60deg,rgb(214 168 63/.12) 0 1px,transparent 1px 14px), repeating-linear-gradient(-60deg,rgb(214 168 63/.12) 0 1px,transparent 1px 14px), #08070a" }}>
        <span className="h-9 flex-1 rounded-sm border border-transparent" style={{ background: `linear-gradient(#110f0c,#110f0c) padding-box, ${metal(SWATCH.gold)} border-box` }} />
        <span className="h-4 w-8 rounded-sm" style={{ background: metal(SWATCH.gold) }} />
      </span>
    )
  return (
    <span aria-hidden className="relative flex h-16 w-full items-end gap-1.5 overflow-hidden bg-[#100f0d] p-2">
      <span className="h-9 flex-1 rounded-md border border-[#2a2824] bg-[#181714]" />
      <span className="h-4 w-8 rounded-md bg-[#d2ae63]" />
    </span>
  )
}

const chip = "outline-none focus-visible:ring-3 focus-visible:ring-ring/50"

/** Appearance: mode, style and colour in one panel that fits any screen and scrolls when it has to. */
export function AppearanceDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const s = useTF()
  const accent = useAccentChoice()
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Appearance</DialogTitle>
          <DialogDescription>Pick a mode, a style and a colour. Every style has a light and a dark version, and every colour works with every style.</DialogDescription>
        </DialogHeader>

        <section className="flex flex-col gap-2" aria-labelledby="ap-mode">
          <h3 id="ap-mode" className="text-sm font-medium">Mode</h3>
          <div role="radiogroup" aria-labelledby="ap-mode" className="grid grid-cols-3 gap-2">
            {MODES.map((m) => {
              const on = s.theme === m.value
              return (
                <button key={m.value} type="button" role="radio" aria-checked={on} onClick={() => tf().theme(m.value)}
                  className={cn(chip, "flex min-h-11 flex-col items-center justify-center gap-1 rounded-lg border px-2 py-2 text-sm", on ? "border-primary bg-primary/10 font-medium" : "hover:bg-muted")}>
                  <m.icon aria-hidden className="size-4" /> {m.label}
                </button>
              )
            })}
          </div>
        </section>

        <section className="flex flex-col gap-2" aria-labelledby="ap-style">
          <h3 id="ap-style" className="text-sm font-medium">Style</h3>
          <div role="radiogroup" aria-labelledby="ap-style" className="grid gap-2 sm:grid-cols-3">
            {STYLES.map((st) => {
              const on = s.style === st.value
              return (
                <button key={st.value} type="button" role="radio" aria-checked={on} onClick={() => tf().themeStyle(st.value)}
                  className={cn(chip, "flex overflow-hidden rounded-lg border text-left sm:flex-col", on ? "border-primary ring-2 ring-primary/40" : "hover:border-foreground/30")}>
                  <span className="w-28 shrink-0 sm:w-full"><StylePreview style={st.value} /></span>
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5 px-3 py-2">
                    <span className="flex items-center gap-1.5 text-sm font-medium">{st.label}{on ? <Check aria-hidden className="size-4 text-primary" /> : null}</span>
                    <span className="text-xs text-muted-foreground">{st.hint}</span>
                  </span>
                </button>
              )
            })}
          </div>
        </section>

        <section className="flex flex-col gap-2" aria-labelledby="ap-colour">
          <h3 id="ap-colour" className="text-sm font-medium">Colour</h3>
          <div role="radiogroup" aria-labelledby="ap-colour" className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {ACCENTS.map((a) => {
              const on = accent === a.value
              const sw = a.value === "rank" ? null : SWATCH[a.value]
              return (
                <button key={a.value} type="button" role="radio" aria-checked={on} onClick={() => setAccent(a.value)}
                  className={cn(chip, "flex min-h-11 items-center gap-2 rounded-lg border px-2.5 py-2 text-left text-sm", a.value === "rank" && "col-span-2 sm:col-span-3", on ? "border-primary bg-primary/10 font-medium" : "hover:bg-muted")}>
                  <span aria-hidden className="size-5 shrink-0 rounded-full border border-black/20"
                    style={{ background: sw ? metal(sw) : `conic-gradient(${SWATCH.bronze[2]} 0 25%, ${SWATCH.silver[2]} 0 50%, ${SWATCH.gold[2]} 0 75%, ${SWATCH.radiant[1]} 0)` }} />
                  <span className="flex min-w-0 flex-col">
                    <span>{a.label}</span>
                    {a.hint ? <span className="text-xs font-normal text-muted-foreground">{a.hint}</span> : null}
                  </span>
                  {on ? <Check aria-hidden className="ml-auto size-4 shrink-0 text-primary" /> : null}
                </button>
              )
            })}
          </div>
        </section>
      </DialogContent>
    </Dialog>
  )
}
