# Switching on sign-in (free)

Accounts use Firebase's free Spark plan. No credit card needed.

1. Go to https://console.firebase.google.com, tap **Add project**, name it (e.g. `tennoform`), and skip Google Analytics.
2. **Build → Authentication → Get started.** Enable **Google** and **Email/Password**.
3. **Authentication → Settings → Authorized domains:** add `tennoform.com`, `www.tennoform.com` and `snooji.github.io`.
4. **Build → Firestore Database → Create database.** Pick a location near your players, start in **production mode**.
5. **Firestore → Rules:** replace everything with the contents of `firestore.rules` in this repo, then **Publish**. Do this again whenever `firestore.rules` changes (friends, messages and shared tasks need the latest rules).
6. **Project settings (gear icon) → Your apps → Web (`</>`).** Register an app (no hosting needed) and copy the `firebaseConfig` values.
7. Paste them into `firebase-config.js` in this repo and commit. The site picks it up on the next page load.

Free limits: about 50,000 reads and 20,000 saves per day. The site batches saves, so that covers roughly a thousand active players a day. If a limit is hit, saving pauses until the next day; nothing is ever charged on the Spark plan.

# One-tap profile sync

Works out of the box: the site syncs through warframestat.us's public profile service when someone taps **Sync**.

`cloudflare-worker.js` (deployed by Cloudflare from `wrangler.jsonc` on every push) is a backup relay. Warframe's API currently refuses requests coming from Cloudflare Workers, so it isn't switched on in `firebase-config.js`. If that changes, set `TENNO_PROXY` to the worker's address.

# Reading feedback (owner only)

Feedback from the **Feedback** page is stored in Firestore and only admins can read it.

1. Sign in to the site once with the account you want to read feedback with.
2. Firebase console → **Security → Authentication → Users**: copy that account's **User UID**.
3. **Firestore Database → Data → + Start collection**: Collection ID `admins`, Document ID = the UID you copied, add a field `role` = `owner`, **Save**.
4. Open the site's **Feedback** page while signed in. The **Feedback inbox** appears under the form.
