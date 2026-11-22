# Tennoform app (iPhone and Android)

The app is the built website packaged with [Capacitor](https://capacitorjs.com). It ships every page and the game data inside the app, so it opens and works offline; sign-in, chat and prices use the network when there is one.

```
cd ../app && npm install && npm run build && cd ..
python3 build/make_site.py         # build the site
cd mobile && npm install
npm run sync                       # copy the site into www/ and into both native projects
npm run android                    # opens Android Studio
npm run ios                        # opens Xcode (macOS only)
```

Run `npm run sync` again after every site build. `www/` and the copies inside `android/` and `ios/` are not committed.

## What's different inside the app (`src/js/4699977-native.js`)

- **Sign-in**: Google uses the phone's own Google sign-in (Google blocks its web sign-in page inside apps). iPhone also offers **Sign in with Apple** (App Store rule 4.8). Both sign in to the same Firebase account as the website, so saved progress and uploaded profile data carry over.
- **Notifications**: Foundry builds and reset reminders are scheduled as local notifications, so they arrive while the app is closed.
- **No payment links**: "Support Tennoform" and PayPal are hidden (store payment rules).
- Haptics, the share sheet, the status bar and Android's back button use the phone's own.

## One-time setup only you can do

1. **Firebase** (console → Project settings → Your apps):
   - Add an **Android app** with package `com.tennoform.app`, add your SHA-1 and SHA-256 signing fingerprints, download `google-services.json` to `android/app/`.
   - Add an **iOS app** with bundle ID `com.tennoform.app`, download `GoogleService-Info.plist` to `ios/App/App/` and add it to the App target in Xcode.
   - Authentication → Sign-in method: turn on **Apple** (needs a Services ID and key from the Apple Developer site).
   Both files are git-ignored; keep them out of the repository.
2. **Xcode**: in the App target, Signing & Capabilities → add **Sign in with Apple** and **Push Notifications**; add the `REVERSED_CLIENT_ID` from `GoogleService-Info.plist` as a URL scheme (Info → URL Types).
3. **Android signing**: create an upload key (Android Studio → Build → Generate Signed Bundle) and keep it somewhere safe; Play App Signing holds the release key.
4. **Store accounts**: Apple Developer Program (yearly fee) and a Google Play Console account (one-off fee).

## Before submitting

- App icons and splash screens: generate from the new logo (`npx @capacitor/assets generate` with `assets/icon.png` 1024×1024 and `assets/splash.png` 2732×2732).
- Store listing: say it's a fan-made companion, "not affiliated with Digital Extremes", in the description; don't use Warframe in the app name.
- Privacy: App Store privacy labels and the Play Data safety form. What's collected: email (sign-in), chat messages, the progress players save. Link the About & privacy page as the privacy policy.
- Chat (user-generated content): report, block, the message filter and account deletion (Profile → Account → Delete account) are in place. **Still to add:** players agree to the chat rules before their first message (App Store rule 1.2).
- Test on a real phone: sign in with Google and Apple, upload a profile file, go offline, get a Foundry notification with the app closed.
