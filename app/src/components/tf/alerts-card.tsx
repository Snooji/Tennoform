import { useState } from "react"
import { Bell, BellOff, Hexagon, Swords, History, Settings2, Store, Tag, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { tf, useTFData, type AlertItem } from "@/lib/tf"

const ICON = { baro: Store, resurgence: History, fissure: Hexagon, circuit: Swords, price: Tag }
const KINDS = [["baro", "Baro Ki'Teer arriving or here"], ["resurgence", "Prime Resurgence for gear you need"], ["fissure", "Fissures for relics you own"]] as const

/** Alerts from the live feed and your own progress: Baro, a Prime Resurgence you need, fissures for relics you own. */
export function AlertsCard({ hideEmpty = false }: { hideEmpty?: boolean }) {
  const d = useTFData(() => tf().alerts())
  const [edit, setEdit] = useState(false)
  if (hideEmpty && !d.list.length && !edit) return null
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle><h2 className="font-heading text-lg leading-tight font-semibold">Alerts</h2></CardTitle>
        <CardAction>
          <Button variant="ghost" size="icon-sm" className="size-8" aria-expanded={edit} aria-label="Alert settings" onClick={() => setEdit(!edit)}><Settings2 /></Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {edit ? (
          <fieldset className="flex flex-col gap-2 border-b pb-3">
            <legend className="sr-only">Which alerts to show</legend>
            {KINDS.map(([k, label]) => (
              <label key={k} className="flex min-h-9 cursor-pointer items-center gap-2.5 text-sm">
                <Checkbox className="size-5 rounded-md" checked={d.prefs[k]} onCheckedChange={(v) => tf().alertPrefsSet({ [k]: !!v })} />{label}
              </label>
            ))}
            {d.canNotify ? (
              <Button variant="outline" className="h-9 self-start" onClick={() => tf().alertNotify(!d.prefs.notify)}>
                {d.prefs.notify ? <><BellOff /> Stop notifications</> : <><Bell /> Notify me while Tennoform is open</>}
              </Button>
            ) : null}
            <p className="text-xs text-muted-foreground">Alerts use the live feed Tennoform already loads, so they don't add any requests.{d.hidden ? <> <button type="button" className="underline underline-offset-4" onClick={() => tf().alertShowHidden()}>Show {d.hidden} dismissed</button></> : null}</p>
          </fieldset>
        ) : null}
        {d.list.length ? (
          <ul className="flex flex-col divide-y">{d.list.map((a) => <Alert key={a.id} a={a} />)}</ul>
        ) : (
          <p className="text-sm text-muted-foreground">{d.live ? "Nothing right now. You'll see Baro, a Prime Resurgence you need and fissures for your relics here." : "Waiting for the live feed…"}</p>
        )}
      </CardContent>
    </Card>
  )
}

function Alert({ a }: { a: AlertItem }) {
  const Icon = ICON[a.kind]
  return (
    <li className="flex gap-3 py-3 first:pt-0 last:pb-0">
      <Icon aria-hidden className="mt-1 size-4 shrink-0 text-muted-foreground" />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <a href={`#${a.href}`} className="font-medium underline-offset-4 hover:underline">{a.title}</a>
        <span className="text-sm text-muted-foreground">{a.text}</span>
        {a.items.length ? <ul className="flex flex-col gap-0.5 text-xs text-muted-foreground">{a.items.map((x) => <li key={x}>{x}</li>)}</ul> : null}
      </div>
      <Button variant="ghost" size="icon-sm" className="size-8 shrink-0" aria-label={`Dismiss: ${a.title}`} onClick={() => tf().alertDismiss(a.id)}><X /></Button>
    </li>
  )
}
