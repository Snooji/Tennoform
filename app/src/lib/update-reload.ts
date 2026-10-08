/**
 * Pages load their code on first visit. When the site is updated while it's open, those files get new names,
 * so an old tab can ask for one that's gone. Reload once to pick up the new version (same page, same hash);
 * if that just happened, don't loop: let the page show its "couldn't load" message instead.
 */
const KEY = "tf-update-reload"

export function reloadForUpdate(): boolean {
  try {
    const last = Number(sessionStorage.getItem(KEY) || 0)
    if (Date.now() - last < 20000) return false
    sessionStorage.setItem(KEY, String(Date.now()))
  } catch {
    return false
  }
  location.reload()
  return true
}
