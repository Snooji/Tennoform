# Switching on sign-in (free)

Accounts use Firebase's free Spark plan. No credit card needed.

1. Go to https://console.firebase.google.com, tap **Add project**, name it (e.g. `tennoform`), and skip Google Analytics.
2. **Build → Authentication → Get started.** Enable **Google** and **Email/Password**.
3. **Authentication → Settings → Authorized domains:** add `snooji.github.io` (and your own domain if you add one).
4. **Build → Firestore Database → Create database.** Pick a location near your players, start in **production mode**.
5. **Firestore → Rules:** replace everything with the contents of `firestore.rules` in this repo, then **Publish**.
6. **Project settings (gear icon) → Your apps → Web (`</>`).** Register an app (no hosting needed) and copy the `firebaseConfig` values.
7. Paste them into `firebase-config.js` in this repo and commit. The site picks it up on the next page load.

Free limits: about 50,000 reads and 20,000 saves per day. The site batches saves, so that covers roughly a thousand active players a day. If a limit is hit, saving pauses until the next day; nothing is ever charged on the Spark plan.

# One-tap profile sync

Works out of the box: the site syncs through warframestat.us's public profile service when someone taps **Sync**.

`cloudflare-worker.js` (deployed by Cloudflare from `wrangler.jsonc` on every push) is a backup relay. Warframe's API currently refuses requests coming from Cloudflare Workers, so it isn't switched on in `firebase-config.js`. If that changes, set `TENNO_PROXY` to the worker's address.
