import { useEffect, useMemo, useState } from "react"
import { Keyboard, Moon, Sun } from "lucide-react"

import {
  CommandDialog, CommandEmpty, CommandGroup, Command, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut,
} from "@/components/ui/command"
import { PAGE_ICON } from "./nav-icons"
import { isDark, tf, useTF, type TFHit } from "@/lib/tf"

/** Global search: shadcn Command over the app's own index (gear, relics, mods, quests, planets, pages). */
export function CommandMenu({ open, setOpen }: { open: boolean; setOpen: (o: boolean) => void }) {
  const [q, setQ] = useState("")
  const s = useTF()
  useEffect(() => {
    if (!open) setQ("")
  }, [open])
  const hits = useMemo(() => (q.trim() ? tf().search(q) : []), [q])
  const groups = useMemo(() => {
    const m = new Map<string, TFHit[]>()
    for (const h of hits) m.set(h.group, [...(m.get(h.group) ?? []), h])
    return [...m.entries()]
  }, [hits])
  const run = (fn: () => void) => {
    setOpen(false)
    setTimeout(fn, 0)
  }
  const pages = tf().nav().flatMap((p) => p.pages)
  return (
    <CommandDialog open={open} onOpenChange={setOpen} title="Search Tennoform" description="Find gear, relics, mods, quests, planets and pages">
      <Command shouldFilter={false} loop>
        <CommandInput value={q} onValueChange={setQ} placeholder="Search gear, relics, mods, quests, planets…" />
        <CommandList className="max-h-[min(60vh,480px)]">
          {q.trim() ? (
            <>
              <CommandEmpty>Nothing matches “{q}”.</CommandEmpty>
              {groups.map(([g, list]) => (
                <CommandGroup key={g} heading={g}>
                  {list.map((h) => (
                    <CommandItem key={h.act} value={h.act} onSelect={() => run(() => tf().open(h.act))}>
                      {h.img ? (
                        <img src={h.img} alt="" className="size-7 shrink-0 object-contain" loading="lazy" />
                      ) : (
                        <span className="size-7 shrink-0" />
                      )}
                      <span className="truncate">{h.name}</span>
                      <CommandShortcut>{h.sub}</CommandShortcut>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </>
          ) : (
            <>
              <CommandGroup heading="Go to">
                {pages.map((p) => {
                  const Icon = PAGE_ICON[p.route] ?? PAGE_ICON.home
                  return (
                    <CommandItem key={p.route} value={p.route} onSelect={() => run(() => tf().go(p.route))}>
                      <Icon />
                      {p.label}
                    </CommandItem>
                  )
                })}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Actions">
                <CommandItem value="theme" onSelect={() => run(() => tf().theme(isDark(s.theme) ? "light" : "dark"))}>
                  {isDark(s.theme) ? <Sun /> : <Moon />}
                  Switch to {isDark(s.theme) ? "light" : "dark"} theme
                </CommandItem>
                <CommandItem value="keys" onSelect={() => run(() => tf().keys())}>
                  <Keyboard />
                  Keyboard shortcuts
                  <CommandShortcut>?</CommandShortcut>
                </CommandItem>
              </CommandGroup>
            </>
          )}
        </CommandList>
      </Command>
    </CommandDialog>
  )
}
