/* Tennoform's service worker: works offline and shows notifications.
   - Built files in /bundle/ and /assets/ are named by their contents, so they are cached for good (cache first).
   - Pages and the game data files are fetched fresh when online and served from the cache when offline (network first).
   - Nothing from other sites (sign-in, chat, prices) is cached here. */
const CACHE = 'tf-v1'
const SHELL = ['/', '/manifest.webmanifest', '/favicon.svg', '/icon-192.png', '/firebase-config.js']
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).catch(() => {}).then(() => self.skipWaiting()))
})
self.addEventListener('activate', (e) => e.waitUntil((async () => {
  for (const k of await caches.keys()) if (k !== CACHE) await caches.delete(k)
  await self.clients.claim()
})()))
const immutable = (p) => p.startsWith('/bundle/') || p.startsWith('/assets/') || p.startsWith('/fonts/')
self.addEventListener('fetch', (e) => {
  const r = e.request
  if (r.method !== 'GET') return
  const u = new URL(r.url)
  if (u.origin !== self.location.origin) return
  if (immutable(u.pathname)) {
    e.respondWith(caches.match(r).then((hit) => hit || fetch(r).then((res) => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(r, copy)) }
      return res
    })))
    return
  }
  e.respondWith(fetch(r).then((res) => {
    if (res.ok && (r.mode === 'navigate' || /\.(json|js|css|png|svg|webmanifest)$/.test(u.pathname))) {
      const copy = res.clone(); caches.open(CACHE).then((c) => c.put(r, copy))
    }
    return res
  }).catch(async () => (await caches.match(r)) || (r.mode === 'navigate' ? caches.match('/') : Response.error())))
})
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
