import { tf } from "@/lib/tf"

/**
 * Keep the inventory up to date without choosing the file every time (Chrome and Edge on a computer).
 * The player links WFHelper's inventory.json once; the browser remembers that file (the handle lives in IndexedDB,
 * on this device only). Whenever Tennoform opens or comes back into view, it reads the file again and imports it
 * if WFHelper has saved a newer one. Nothing is uploaded: the file is read here, like a normal import.
 * Chrome asks once whether Tennoform may keep reading the file; "Allow on every visit" makes it fully automatic,
 * otherwise one tap on "Update now" re-allows it for the visit.
 */
type Handle = FileSystemFileHandle & {
  queryPermission?: (o: { mode: "read" }) => Promise<PermissionState>
  requestPermission?: (o: { mode: "read" }) => Promise<PermissionState>
}
type Picker = (o: object) => Promise<Handle[]>

export type InvLink = { supported: boolean; linked: boolean; name: string; state: "idle" | "needs-permission" | "missing" | "busy"; checked: number; fileAt: number }

const DB = "tf-inv-link", STORE = "h", KEY = "inventory", SEEN = "tf-inv-mtime"
const picker = () => (typeof window !== "undefined" ? (window as unknown as { showOpenFilePicker?: Picker }).showOpenFilePicker : undefined)
let S: InvLink = { supported: !!picker(), linked: false, name: "", state: "idle", checked: 0, fileAt: 0 }
let handle: Handle | null = null
const subs = new Set<() => void>()
const set = (o: Partial<InvLink>) => { S = { ...S, ...o }; subs.forEach((f) => f()) }
export const invLinkState = () => S
export const invLinkSubscribe = (f: () => void) => { subs.add(f); return () => { subs.delete(f) } }

function idb<T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return new Promise((res, rej) => {
    const o = indexedDB.open(DB, 1)
    o.onupgradeneeded = () => o.result.createObjectStore(STORE)
    o.onerror = () => rej(o.error)
    o.onsuccess = () => {
      try {
        const tx = o.result.transaction(STORE, mode)
        const r = fn(tx.objectStore(STORE))
        r.onsuccess = () => res(r.result)
        r.onerror = () => rej(r.error)
        tx.oncomplete = () => o.result.close()
      } catch (e) { o.result.close(); rej(e) }
    }
  })
}
const seen = () => { try { return +(localStorage.getItem(SEEN) || 0) } catch { return 0 } }
const markSeen = (t: number) => { try { localStorage.setItem(SEEN, String(t)) } catch { /* private mode */ } }

/** Read the linked file and import it if it changed since the last import (or always, when forced). */
async function readNow(force: boolean, quiet: boolean) {
  if (!handle) return
  set({ state: "busy" })
  try {
    const f = await handle.getFile()
    set({ fileAt: f.lastModified })
    if (force || f.lastModified > seen()) {
      const r = await tf().importInventory(await f.text())
      if (r.ok) {
        markSeen(f.lastModified)
        if (quiet) window.TF_UI?.toast?.("Inventory updated from WFHelper")
      } else if (!quiet) window.TF_UI?.toast?.(r.msg)
      set({ state: "idle", checked: Date.now() })
      return r
    }
    set({ state: "idle", checked: Date.now() })
    return { ok: true, msg: "Already up to date: WFHelper hasn't saved a newer inventory since the last import." }
  } catch {
    // the file was moved or deleted (WFHelper reinstalled, a different folder): ask to link it again
    set({ state: "missing" })
    return { ok: false, msg: "Couldn't find inventory.json where it was. Link the file again." }
  }
}

/** On load and whenever the tab comes back: update silently if the browser still lets us read the file. */
async function check() {
  if (!handle || S.state === "busy" || tf().state().demo) return
  const p = (await handle.queryPermission?.({ mode: "read" })) ?? "granted"
  if (p !== "granted") return set({ state: "needs-permission" })
  await readNow(false, true)
}

export async function invLinkInit() {
  if (!S.supported) return
  try { handle = (await idb<Handle | undefined>("readonly", (s) => s.get(KEY))) || null } catch { handle = null }
  if (!handle) return
  set({ linked: true, name: handle.name })
  window.setTimeout(check, 2500) // after the app has drawn, so the "updated" note can show
  document.addEventListener("visibilitychange", () => { if (!document.hidden) check() })
  // while the tab stays open (a second monitor next to the game), look again every few minutes
  window.setInterval(() => { if (!document.hidden) check() }, 3 * 60 * 1000)
}

/** Choose inventory.json once (a click), import it now, and remember it for next time. */
export async function invLink() {
  const pick = picker()
  if (!pick) return null
  let h: Handle
  try { [h] = await pick({ id: "tf-inventory", types: [{ description: "Inventory file", accept: { "application/json": [".json"] } }] }) } catch { return null }
  handle = h
  try { await idb("readwrite", (s) => s.put(h, KEY)) } catch { /* still works for this visit */ }
  const first = !S.linked
  set({ linked: true, name: h.name, state: "idle" })
  if (first) {
    document.addEventListener("visibilitychange", () => { if (!document.hidden) check() })
    window.setInterval(() => { if (!document.hidden) check() }, 3 * 60 * 1000)
  }
  return readNow(true, false)
}

/** "Update now": a click, so the browser may ask for permission again, then import. */
export async function invUpdateNow() {
  if (!handle) return null
  const p = (await handle.requestPermission?.({ mode: "read" })) ?? "granted"
  if (p !== "granted") { set({ state: "needs-permission" }); return { ok: false, msg: "Tennoform needs permission to read the file. Choose Allow (or Allow on every visit) when your browser asks." } }
  return readNow(true, false)
}

export async function invUnlink() {
  handle = null
  try { await idb("readwrite", (s) => s.delete(KEY)) } catch { /* nothing stored */ }
  set({ linked: false, name: "", state: "idle", checked: 0, fileAt: 0 })
}
