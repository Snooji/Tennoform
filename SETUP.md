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

# Profile sync (upload only)

Tennoform doesn't fetch anything from Digital Extremes. Players sync by saving their own public profile page (it opens in their browser from the **Account & sync** tab) and then pasting it or uploading the saved `.json`/`.txt`. WFHelper files and Tennoform backups upload through the same button. The file is read on the device; the result is saved locally and, when signed in, to the player's Firestore documents, so it follows them to every device.

The Google Apps Script relay and the Cloudflare Worker relay are both retired: their files are deleted, `window.TENNO_PROXY` is empty and the site's security policy no longer allows connections to them. If you still have the Apps Script deployed, archive it in script.google.com (Deploy → Manage deployments → Archive).

# Reading feedback (owner only)

Feedback from the **Feedback** page is stored in Firestore and only admins can read it.

1. Sign in to the site once with the account you want to read feedback with.
2. Firebase console → **Security → Authentication → Users**: copy that account's **User UID**.
3. **Firestore Database → Data → + Start collection**: Collection ID `admins`, Document ID = the UID you copied, add a field `role` = `owner`, **Save**.
4. Open the site's **Feedback** page while signed in. The **Feedback inbox** appears under the form.

# Staying signed in on iPhone (home-screen app)

Safari blocks the cross-site cookies Google sign-in normally relies on. The site hosts Firebase's sign-in helper itself (`__/auth/`), so sign-in can stay on tennoform.com:

1. console.cloud.google.com → project **tennoform** → **APIs & Services → Credentials** → open the **OAuth 2.0 Client ID** called "Web client (auto created by Google Service)".
2. **Authorized JavaScript origins:** add `https://tennoform.com`.
3. **Authorized redirect URIs:** add `https://tennoform.com/__/auth/handler`. **Save**.
4. In `firebase-config.js`, set `window.TENNO_SELF_AUTH = true;` and commit.

# Getting listed on Google and Bing

The site already gives search engines what they need: a page with its own title and description for every section, and for every item, mod, arcane, relic, resource and enemy (`tennoform.com/mod/serration/`, written by `build/seo_pages.py`), all listed in `sitemap.xml`. These steps tell Google and Bing the site exists and is yours.

**Google (Search Console)**
1. Go to https://search.google.com/search-console and choose **Add property → Domain**, then enter `tennoform.com`.
2. Google shows a TXT record. Because the domain is on Cloudflare, use the **Verify with Cloudflare** button if Google offers it; otherwise, in Cloudflare open **DNS → Records → Add record**, choose type **TXT**, name `@`, paste the value, and save. Back in Search Console, press **Verify** (it can take a few minutes).
3. **Sitemaps** (left menu): enter `sitemap.xml` and press **Submit**.
4. **URL inspection** (top bar): paste `https://tennoform.com/` and press **Request indexing**. Do the same for a few key pages, such as `/farm/`, `/relics/` and `/mastery/`.
5. Check **Pages** after a few days to see what's indexed and why anything isn't.

Prefer a meta tag to DNS? Choose **URL prefix** instead of Domain, pick **HTML tag**, and put the `content` value in `build/verify.json` as `{"google": "…"}`. Every page then carries it after the next build.

**Bing (also used by DuckDuckGo, Yahoo and ChatGPT search)**
1. Go to https://www.bing.com/webmasters, sign in, and choose **Import from Google Search Console**. It copies the verified site and its sitemap.
2. (Or add the site by hand and put Bing's `msvalidate.01` value in `build/verify.json` as `"bing": "…"`.)
