import { useEffect, useRef, useState } from "react"
import { motion, useReducedMotion } from "motion/react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { useTF } from "@/lib/tf"

const KEY = "tf-rank-seen"
const readSeen = () => { try { const v = Number(localStorage.getItem(KEY)); return Number.isFinite(v) && localStorage.getItem(KEY) != null ? v : null } catch { return null } }
const saveSeen = (n: number) => { try { localStorage.setItem(KEY, String(n)) } catch { /* private mode */ } }
/* when the player last tapped, typed or picked a file: a rank-up only counts as theirs if it follows one of these */
let lastAct = 0
for (const ev of ["pointerdown", "keydown", "change"]) window.addEventListener(ev, () => { lastAct = Date.now() }, { capture: true, passive: true })

/** The rank-up moment: one celebration when your Mastery Rank goes up while you use the app (the highest new rank,
    once). Only for a rise that follows something the player just did here (a tap, a key, a file); never on first load,
    in the sample account, from signing in, or from progress syncing in from another device. */
export function RankUp() {
  const s = useTF()
  const reduce = useReducedMotion()
  const [show, setShow] = useState<number | null>(null)
  const base = useRef<number | null>(null)
  const quietUntil = useRef(0)
  const lastSigned = useRef(s.signedIn)
  useEffect(() => {
    if (s.signedIn !== lastSigned.current) { lastSigned.current = s.signedIn; quietUntil.current = Date.now() + 4000 }
    if (s.demo) return
    if (base.current == null) { base.current = Math.max(readSeen() ?? s.mr, s.mr); saveSeen(base.current); return }
    if (s.mr <= base.current) return
    const quiet = Date.now() < quietUntil.current || Date.now() - lastAct > 8000
    base.current = s.mr; saveSeen(s.mr)
    if (quiet) return
    setShow(s.mr)
    try { navigator.vibrate?.([20, 40, 30]) } catch { /* not supported */ }
  }, [s.mr, s.demo, s.signedIn])
  const label = show == null ? "" : show > 30 ? `Legendary ${show - 30}` : `Mastery Rank ${show}`
  return (
    <Dialog open={show != null} onOpenChange={(o) => { if (!o) setShow(null) }}>
      <DialogContent showCloseButton={false} className="overflow-hidden border-primary/40 text-center sm:max-w-sm">
        <div aria-hidden className="relative mx-auto grid size-36 place-items-center">
          {!reduce ? (
            <motion.span className="absolute inset-0 rounded-full" style={{ background: "radial-gradient(circle, color-mix(in srgb, var(--primary) 55%, transparent), transparent 70%)" }}
              initial={{ scale: 0.3, opacity: 0 }} animate={{ scale: [0.3, 1.25, 1], opacity: [0, 1, 0.7] }} transition={{ duration: 1.1, ease: "easeOut" }} />
          ) : null}
          <motion.img src="/logo-256.png" alt="" className="relative size-28 object-contain drop-shadow-[0_0_18px_rgb(111_214_232/0.45)]"
            initial={reduce ? false : { scale: 0.6, rotate: -8, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.1 }} />
        </div>
        <DialogTitle className="font-heading text-3xl leading-tight font-semibold">{label}</DialogTitle>
        <DialogDescription>You ranked up. New gear and higher trading limits open up at this rank.</DialogDescription>
        <Button className="mt-2 h-11 w-full text-base" onClick={() => setShow(null)}>Continue</Button>
      </DialogContent>
    </Dialog>
  )
}
