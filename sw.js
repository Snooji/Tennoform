/* Tennoform's service worker. It only shows notifications and opens the site when you tap one.
   It doesn't cache pages or files, so the site always loads fresh. */
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()))
self.addEventListener('notificationclick', (e) => {
  e.notification.close()
  const url = new URL((e.notification.data && e.notification.data.url) || '/', self.location.origin).href
  e.waitUntil((async () => {
    const tabs = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
    for (const t of tabs) if (new URL(t.url).origin === self.location.origin) { await t.focus(); if ('navigate' in t) return t.navigate(url); return }
    return self.clients.openWindow(url)
  })())
})
/* push messages (for notifications while the site is closed), once a sender is set up */
self.addEventListener('push', (e) => {
  let d = {}
  try { d = e.data ? e.data.json() : {} } catch (x) { d = { title: 'Tennoform', body: e.data ? e.data.text() : '' } }
  const n = d.notification || d
  e.waitUntil(self.registration.showNotification(n.title || 'Tennoform', { body: n.body || '', tag: n.tag || d.tag, silent: !!d.silent, icon: '/icon-192.png', badge: '/icon-192.png', data: { url: (d.data && d.data.url) || d.url || '/' } }))
})
