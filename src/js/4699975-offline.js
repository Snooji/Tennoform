/* ---------- Offline: register the service worker on every visit so the app opens without a connection ---------- */
if(('serviceWorker' in navigator)&&(location.protocol==='https:'||location.hostname==='localhost')){window.addEventListener('load',()=>{try{navigator.serviceWorker.register('/sw.js',{scope:'/'}).catch(()=>{})}catch(e){}})}
window.addEventListener('offline',()=>toast('You\'re offline. Everything you track still works; sign-in, chat and prices come back when you reconnect.'));
window.addEventListener('online',()=>toast('Back online.'));
