# Porting DreamBot to Android: Audit + Execution Plan

> **Status:** plan only, nothing executed. Written 2026-09-27 from a six-area audit (native modules + config,
> iOS-isms in app code, auth + deep links + website, payments + push + server assumptions, build/release +
> Google Play policy, layout + performance + devices). **Supersedes the 2026-07-07 version of this file**
> (git history keeps it). That version called the UI layer "~0 effort"; the new audit disproves it (no Android
> Back handling anywhere, keyboard + inset problems under edge-to-edge, tablet/foldable resizing).
>
> **For the executing agent:** read CLAUDE.md first (hard rules, commit rules, migration rules). File:line refs
> below were accurate on 2026-09-27; lines drift, so re-grep before editing. Claims marked **(verified)** were
> re-checked by hand against the code or live DB; the rest are reviewer findings with file refs, so confirm
> each before relying on it. Work the phases in order: several steps are blocked on console setup or on the
> first uploaded build (see Critical path).

---

## 0. Bottom line

- **Size:** roughly **20-30 focused dev-days plus console setup, 4-6 calendar weeks** end to end. The calendar
  is dominated by Google Play's closed-testing requirement (12 testers for 14 days on a new personal account)
  and device QA, not by code.
- **The foundation is sound.** Expo SDK 54 / RN 0.81 (New Architecture on), almost every native module ships
  Android code, `app.config.js` already has an `android` block (package, adaptive icons, edge-to-edge), the
  dream engine / queue / bots / Supabase are platform-agnostic.
- **What actually needs work** (in priority order):
  1. **Payments would silently fail for Android subscribers** (server + client product-id matching, no Android
     RevenueCat key, no Play products). (verified)
  2. **Android Back button is unhandled everywhere** (zero `BackHandler` in the codebase): Back on the comments
     sheet over Home exits the app instead of closing the sheet. (verified)
  3. **Push won't work** (no FCM, no notification channel). (verified: zero `setNotificationChannelAsync`)
  4. **Sign-in:** Google has no Android/web client id; Facebook token type likely wrong for Supabase on
     Android; Apple-ID users have no way in on Android.
  5. **Per-platform release gates:** `engine_config.min_app_version` is shared, and the update button opens an
     iOS-only `itms-apps://` link (verified). The first iOS-only hard gate would lock out every Android user.
  6. **Keyboard + safe areas under edge-to-edge** (inputs under the keyboard, sheet buttons under the nav bar).
  7. **Google Play policy gaps** that are likely rejections: no way to report your OWN AI output, broad media /
     audio permissions, privacy policy mismatches, no child-safety standards page.
  8. **Performance on mid/low-end Android:** feed "display" images are full-resolution (verified) and prefetched
     aggressively; the Bots tab mounts up to 15 full-screen cards.
- **Deferred by default (v2):** home-screen widget (needs a Kotlin Glance widget), full reactive layout for
  foldables (stopgap first), Play Integrity trial-abuse (stopgap first).

---

## 1. Decisions Kevin must make before work starts

Record each answer in this file (append under the decision) before executing the dependent tasks.

| #   | Decision                                                                      | Why it matters                                                                                                                                  | Recommendation                                                                                                                                                                                  |
| --- | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D1  | **Android package name**                                                      | Permanent once published on Play. Store product ids and deep links hang off it.                                                                 | Keep `com.konakevin.radorbad` (matches the iOS bundle id and every IAP product id; already in `app.config.js`).                                                                                 |
| D2  | **Play developer account type** (Personal vs Organization, and creation date) | A Personal account created after Nov 2023 must run a closed test with **12 opted-in testers for 14 consecutive days** before production access. | Find out on day 1; if Personal, recruit 12+ testers and start the closed track the day the first build is ready.                                                                                |
| D3  | **Apple-ID users on Android**                                                 | Many iOS users signed up with Apple (some with hide-my-email). There is no native Apple sign-in on Android.                                     | Add Apple sign-in via Supabase **web OAuth** on Android (Services ID `com.konakevin.radorbad.auth` already exists per AUTH_PROVIDERS.md). Fallback today: "Forgot password" to the relay email. |
| D4  | **Home-screen widget at launch?**                                             | iOS widget is WidgetKit + App Group; Android needs a new Kotlin Glance widget.                                                                  | Defer to v2.                                                                                                                                                                                    |
| D5  | **Free-trial abuse on Android**                                               | DeviceCheck is iOS-only; Android sends no token and the server fails open, so trials are farmable.                                              | Launch with a hashed-`ANDROID_ID` stopgap (survives reinstall, not factory reset); add Play Integrity later. Must be declared in Data safety.                                                   |
| D6  | **Tablets / foldables at launch**                                             | Android 16 (targetSdk 36) ignores the portrait lock on screens >= 600dp; layout values are captured once at startup.                            | Stopgap: the API-36 resizability opt-out + QA on one tablet and one foldable; full reactive layout later.                                                                                       |
| D7  | **Minimum device** (minSdk, tiny screens, low RAM)                            | 360x640 phones scale below the iOS floor; several screens don't scroll.                                                                         | minSdk stays 24 unless QA fails; exclude low-RAM devices in the Play device catalog if jank is bad.                                                                                             |
| D8  | **Test purchases**                                                            | Play license testers / closed-test buyers would get real sparkles and Pro in the production DB (webhook ignores `environment`).                 | Grant sandbox purchases only to an allowlist of tester user ids.                                                                                                                                |
| D9  | **Stored inferred traits** (`describe-photo` stores ethnicity/age/gender)     | Must be disclosed in Privacy + Data safety, or stopped.                                                                                         | Disclose if still needed by the engine; otherwise stop storing ethnicity.                                                                                                                       |
| D10 | **Version numbering**                                                         | Shared marketing versions keep the gates simple; build numbers are separate counters.                                                           | Same `X.Y.Z` on both platforms; start Android `versionCode` at 1000 (`eas build:version:set -p android`) so it never collides with iOS build numbers in Sentry or `min_build`.                  |
| D11 | **Light mode**                                                                | `userInterfaceStyle: 'automatic'` + Android's nav-bar contrast scrim puts a white bar over the black app.                                       | Force dark (`userInterfaceStyle: 'dark'`, black system UI).                                                                                                                                     |

---

## 2. Already Android-ready (no work)

- **Native deps with Android code:** reanimated 4, gesture-handler, screens, safe-area, svg, keyboard-controller,
  FlashList, expo-image, expo-linear-gradient, masked-view, expo-haptics, expo-clipboard, expo-file-system,
  expo-image-manipulator, expo-font, expo-linking, expo-localization, expo-splash-screen, expo-status-bar,
  expo-system-ui, expo-web-browser (Custom Tabs), expo-application, async-storage, Sentry, PostHog, RevenueCat
  SDK, Google Sign-In, FBSDK, expo-notifications, expo-media-library, expo-image-picker.
- **Config:** `app.config.js` `android` block (package `com.konakevin.radorbad`, adaptive icon
  foreground/background/monochrome at 1024px, `edgeToEdgeEnabled: true`, `predictiveBackGestureEnabled: false`).
- **Already gated:** Apple sign-in buttons are hidden on Android (`app/(auth)/index.tsx:112`,
  `app/(auth)/login.tsx:160`); `expo-apple-authentication`, the widget module and DeviceCheck no-op safely on
  Android.
- **Fonts:** each weight is loaded as its own family and `components/AppText.tsx` maps `fontWeight` to the right
  face (no faux-bold) except where NativeWind `font-bold` classes bypass it (see I-3).
- **Server:** Supabase, the dream engine, queue, worker, bots, `send-push` (Expo push is cross-platform),
  `push_tokens.platform` column, account deletion (in-app).
- **Sharing:** in-app share copies `https://dreambotapp.com/post|user/<id>`, works on both platforms.

---

## 3. Critical path and phases

```
Day 1   D1-D11 answered · Play Console account (+ closed-test clock if Personal) · Firebase project
        · Google Cloud project · EAS Android credentials
Wk 1    Phase 1 infra: eas.json, app.config (permissions, intentFilters, icons, splash, dark), first internal
        AAB uploaded by hand  ──► unlocks: Play product creation, Play App Signing SHA-256/SHA-1
Wk 1-2  Phase 2 server (gates, webhook, push payload, trial signal) + Phase 3 client blockers
        (payments, push, auth, Back handling)
        Console: RevenueCat Play app + products + RTDN, OAuth clients (needs SHA-1s), Meta key hashes,
        assetlinks.json (needs SHA-256s), FCM V1 key in EAS
Wk 2-3  Phase 4 UX (keyboard, insets, polish, perf) + Phase 5 policy/website
Wk 3-5  Phase 6 QA on the device matrix · closed track (12 testers x 14 days if required) · store listing
Wk 5-6  Production: staged rollout 5% → 20% → 50% → 100%
```

**Hard ordering constraints:**

1. Play only lets you create in-app products and subscriptions **after a signed AAB is uploaded** to a track.
2. Google OAuth (Android clients), Meta key hashes and `assetlinks.json` all need the **SHA-1/SHA-256 of the EAS
   upload key AND the Play App Signing key**, which exist only after the first upload.
3. The first AAB must be uploaded **manually** in Play Console; automation (`fastlane supply` /
   `eas submit -p android`) only works after that.
4. Deploy server changes that Android depends on (gates, webhook) **before** the first Android production
   release, never after.
5. The per-platform version gate (C-1) must be live **before any release after Android launches**, or the next
   iOS hard gate locks out Android.

---

## 4. Workstreams and tasks

Task format: **ID · what · where · change · size (S <0.5d, M 0.5-2d, L >2d) · owner · done when**.
Owner: **agent** = code/SQL/docs in this repo or `../dreambot-web`; **Kevin** = a console/dashboard only he can
reach (Play Console, Firebase, Google Cloud, Meta, RevenueCat, Supabase dashboard, Apple developer).

### WS-A · Accounts and consoles (Kevin, with agent-prepared checklists)

- **A-1 Play Console:** create the app (package from D1), app category (Art & Design), contact
  `support@dreambotapp.com`, target audience 18+, content rating questionnaire (user interaction, digital
  purchases, no ads). If Personal account: set up the closed track and tester list. **S · Kevin.**
- **A-2 Firebase:** project for FCM, download `google-services.json` (keep out of git; reference via
  `android.googleServicesFile`, supply via EAS file secret), create an FCM V1 service-account key and upload it
  with `eas credentials -p android`. **S · Kevin.**
- **A-3 Google Cloud OAuth:** a **Web** OAuth client (its id becomes `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`) and
  **Android** OAuth clients for `com.konakevin.radorbad`, one per SHA-1 (local debug keystore, EAS upload key,
  Play App Signing key). Add the Web client id to Supabase → Auth → Google → Authorized Client IDs (next to the
  iOS one; "skip nonce" already on). **S · Kevin.**
- **A-4 Meta (Facebook) dashboard:** add an Android platform: package `com.konakevin.radorbad`, class
  `com.konakevin.radorbad.MainActivity`, key hashes for debug + upload + Play signing keys. Classic trap: without
  the Play signing hash, login fails only on store builds. **S · Kevin.**
- **A-5 RevenueCat:** add a Google Play app to the project → real `goog_` public key; upload a Google Cloud
  service account with Play Developer API access; enable Real-Time Developer Notifications (Pub/Sub). Attach the
  Play products to the existing entitlements and to the `subscriptions` offering packages. **M · Kevin.**
- **A-6 Play products** (after the first AAB, see §3): create with the **same ids as iOS**:

  | Kind         | Product id                               | Notes                                                            |
  | ------------ | ---------------------------------------- | ---------------------------------------------------------------- |
  | Consumable   | `com.konakevin.radorbad.sparkles.15_v2`  | amounts live in the `sparkle_packs` table                        |
  | Consumable   | `com.konakevin.radorbad.sparkles.40_v2`  |                                                                  |
  | Consumable   | `com.konakevin.radorbad.sparkles.90_v2`  |                                                                  |
  | Consumable   | `com.konakevin.radorbad.sparkles.200_v2` |                                                                  |
  | Consumable   | `com.konakevin.radorbad.sparkles.500_v2` | grants 550                                                       |
  | Subscription | `com.konakevin.radorbad.pro.monthly`     | one base plan, e.g. id `p1m` (base plan ids cannot contain dots) |
  | Subscription | `com.konakevin.radorbad.pro.yearly`      | base plan e.g. `p1y`                                             |
  | Subscription | `com.konakevin.radorbad.basic.monthly`   |                                                                  |
  | Subscription | `com.konakevin.radorbad.basic.yearly`    |                                                                  |

  Turn **off** subscription pause (the app doesn't model it). Add license testers. **M · Kevin.**

- **A-7 Apple (only if D3 = web OAuth):** Services ID return URL
  `https://jimftynwrinwenonjrlj.supabase.co/auth/v1/callback`; Supabase Apple provider client ids = Services ID +
  bundle id; regenerate the 180-day client secret with the Services ID as subject (AUTH_PROVIDERS.md:36 notes it
  currently uses the bundle id). **S · Kevin.**
- **A-8 Supabase redirect allow-list:** add `https://dreambotapp.com/auth/callback` (preferred) only if web
  OAuth ships (D3, or the Facebook fallback in D-2). Password reset needs nothing new. **S · Kevin.**

### WS-B · Build, config and release infrastructure (agent)

- **B-1 eas.json:** add `android` to each build profile: development/preview `buildType: "apk"`, production
  `"app-bundle"` (keep `autoIncrement`; `appVersionSource: remote` already manages versionCode). Add
  `submit.production.android` (`serviceAccountKeyPath` outside the repo, `track: "internal"`,
  `releaseStatus: "draft"`). **Never** add `"$EXPO_PUBLIC_*"` references to eas.json env blocks (they clobber the
  env-service values; this shipped a dead-analytics iOS build once). **S.**
- **B-2 Where to build:** this Mac has no Android toolchain (no `~/Library/Android/sdk`, no JDK). Use **EAS
  cloud builds** for Android, or install JDK 17 + Android SDK 36 + build-tools 36.0.0 + NDK 27.1.12297006 +
  CMake for `--local`. **Never ship from the committed/prebuilt `android/` folder** (gitignored and stale:
  `versionName "1.9.0"`, release signed with the debug keystore at `android/app/build.gradle:116`); always
  `expo prebuild --clean`. **S.**
- **B-3 Permissions (Play policy):** in `app.config.js` add
  `android.blockedPermissions: ["android.permission.RECORD_AUDIO", "android.permission.READ_MEDIA_AUDIO",
"android.permission.READ_MEDIA_VIDEO", "android.permission.SYSTEM_ALERT_WINDOW",
"android.permission.READ_EXTERNAL_STORAGE", "android.permission.WRITE_EXTERNAL_STORAGE",
"com.google.android.gms.permission.AD_ID"]` (confirm each against the merged manifest after prebuild), add
  `["expo-image-picker", { microphonePermission: false }]`, set expo-media-library
  `granularPermissions: ["photo"]`, and request **write-only** access when saving
  (`lib/savePhoto.ts:38,64` → `requestPermissionsAsync(true)`). Picking already uses the system picker
  (`launchImageLibraryAsync`), so READ_MEDIA_IMAGES should not be needed; verify saves on Android 11/13/14. **S.**
- **B-4 App Links:** `android.intentFilters` with `autoVerify: true`, scheme `https`, host `dreambotapp.com`,
  path prefixes `/post/`, `/photo/`, `/user/`, `/reset-password` (mirror the iOS AASA paths from
  `../dreambot-web/app/.well-known/apple-app-site-association/route.ts`; leave `/join` out, Dream Off is disabled).
  Pairs with M-1 (`assetlinks.json`). **S.**
- **B-5 Icons, splash, notification icon:** expo-notifications plugin `icon` (96x96 white-on-transparent, can
  derive from `android-icon-monochrome.png`), `color`, `defaultChannel`; splash Android `imageWidth` ~170 so the
  Android 12+ 192dp circle doesn't clip the wordmark; consider a mascot-based adaptive-icon foreground (the
  current wordmark foreground is unreadable at 48dp, design task). **S.**
- **B-6 Dark system UI (D11):** `userInterfaceStyle: 'dark'`, black navigation bar. **S.**
- **B-7 Sentry on Android:** `sentry.gradle` reads `SENTRY_ORG/PROJECT/AUTH_TOKEN` from the environment. Either
  make those EAS vars readable by the build (sensitive, not secret) or set `SENTRY_DISABLE_AUTO_UPLOAD=true` and
  upload Hermes source maps with `sentry-cli` afterwards (`plugins/withSentryNoLocalUpload.js` only fixes iOS).
  Set a release/dist that includes the platform so iOS build N and Android versionCode N never merge
  (`lib/sentry.ts:26-31` sets none; D10's offset also fixes this). **S.**
- **B-8 Hygiene:** `.gitignore` `*.aab`, `*.apk`, `*.keystore`, `google-services.json`, the service-account
  JSON. Remove unused native deps (`expo-blur`, `expo-video`, `expo-video-thumbnails`, `expo-secure-store`,
  `react-native-compressor`, `@react-native-community/slider`, `expo-auth-session` are imported nowhere, per the
  audit; re-grep first). Move `@tensorflow/tfjs-node` / `@vladmandic/face-api` to devDependencies (script-only).
  **S.**
- **B-9 CI:** optional `expo prebuild -p android --no-install` step in `.github/workflows/ci.yml` to catch broken
  config plugins without spending build quota. **S.**
- **B-10 Release docs + skill:** Android sections in `RELEASE.md`, `.claude/skills/release/SKILL.md` and
  `scripts/release.sh` (prints iOS next steps only, ~lines 139-140). `RELEASES.md`: add Platform, versionCode,
  track/rollout columns. Tags: `vX.Y.Z` per shared version; `vX.Y.Z-android-vc<N>` for Android-only rebuilds.
  Upload path after the first manual AAB: `fastlane supply --aab <file> --track internal --json_key <SA>`
  (fastlane is installed), `eas submit -p android` as fallback. Verify every AAB before upload:
  `unzip -p x.aab base/assets/index.android.bundle | grep -ac phc_` (real PostHog key baked in). **M.**

### WS-C · Server and database (agent; migrations via `scripts/apply-migration.mjs`)

- **C-1 Per-platform app update gate (must ship before Android launch).** Live today:
  `engine_config.min_app_version = latest_app_version = '1.9.0'` (hard gate), one pair for both platforms, and
  `constants/appStore.ts:18` opens `itms-apps://` (verified). Change:
  ```sql
  ALTER TABLE public.engine_config
    ADD COLUMN IF NOT EXISTS min_app_version_android text,
    ADD COLUMN IF NOT EXISTS latest_app_version_android text;
  -- then CREATE OR REPLACE public.get_engine_config() with the latest body + the two keys
  ```
  Keep the existing columns as the iOS values (shipped iOS builds read them). `hooks/useEngineConfig.ts`
  (~132-139) picks the pair by `Platform.OS`; null = no gate (fail-open, as today). `ForceUpdateGate.tsx:65`
  opens `market://details?id=com.konakevin.radorbad` on Android (fallback
  `https://play.google.com/store/apps/details?id=com.konakevin.radorbad`). Update the release skill's go-live
  runbook (two systems → per platform). **M.**
- **C-2 Announcements `min_build`:** compared with `Application.nativeBuildVersion`
  (`hooks/useAnnouncement.ts:58-59`, `lib/announcementEligibility.ts:66`); Android versionCode is an unrelated
  counter. Live rows only use `min_app_version` (one inactive row has `min_build = 47`). Either retire
  `min_build` or add `min_build_android`. **S.**
- **C-3 RevenueCat webhook, Play product ids (blocker, verified).** For Play subscriptions RevenueCat sends
  `product_id` as `<subscriptionId>:<basePlanId>`. `resolveTier` (`supabase/functions/revenuecat-webhook/index.ts:135-136`,
  exact `Set.has`) and the yearly checks (~431, ~505) won't match, so the event falls to "Unhandled" 200: Android
  subscribers silently get no Pro and no sparkles. Fix: normalize every incoming product id with
  `id.split(':')[0]` in one helper used everywhere. **S.**
- **C-4 Webhook `PRODUCT_CHANGE`:** reads only `product_id`; RevenueCat puts the new product in
  `new_product_id` (confirm against current RevenueCat docs). Matters more on Play (upgrades are product changes).
  **S.**
- **C-5 Webhook refund clawback:** only `CANCELLATION` + `cancel_reason = 'CUSTOMER_SUPPORT'` (~266) claws back
  sparkles, an Apple-specific reason. Determine in the RevenueCat sandbox what Play refunds and voided
  consumables send, add that branch mirroring `refund:purchase:<txId>`, and make the clawback atomic and
  error-checked (the 2026-09-27 audit found it non-atomic with ignored errors, ~278-331). **M.**
- **C-6 Grace period:** `BILLING_ISSUE` is only logged (~170-173). Extend `expires_at` to
  `grace_period_expiration_at_ms` so `lib/proStatus.ts` / `is_pro_active()` keep Pro through Play's grace
  period, matching RevenueCat. **S.**
- **C-7 Sandbox purchases (D8):** gate SANDBOX-environment grants to an allowlist of tester user ids. **S.**
- **C-8 Store in analytics:** add `event.store` / platform to server-side purchase captures (~389-394,
  ~496-510) and `_shared/posthogCapture.ts:83`. **S.**
- **C-9 send-push payload:** `supabase/functions/send-push/index.ts:528-535` sends iOS `sound`/`badge` only. Add
  `channelId: '<the id from F-1>'` and `priority: 'high'` (no Doze delay) when the token's platform is
  `android` (`push_tokens.platform` exists; column default is `'ios'` from migration 044:9 and all 45 rows are
  iOS today). Keep `sound` for iOS. **S.**
- **C-10 Trial abuse on Android (D5):** the client sends no token on Android (`lib/deviceCheck.ts`,
  `lib/firstDreamQueue.ts:48-54`) and `enqueue-dream` (~172-182) fails open on `no_token`. Send `platform` with
  the first-dream request so the server can tell "Android, no DeviceCheck" from "iOS, missing token". Stopgap:
  hashed `ANDROID_ID` (via expo-application) in a `trial_device_claims` table checked in
  `_shared/trialEligibility.ts`. Later: `_shared/playIntegrity.ts` (Play Integrity, device recall) returning the
  existing `DeviceTrialSignal`. Declare in Data safety. **M (stopgap) / L (Play Integrity).**

### WS-D · Auth and deep links (agent + Kevin consoles)

- **D-1 Google:** `lib/googleAuth.ts:5-7` sets only `iosClientId`, so Android returns no `idToken`. Add
  `webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` (set in the EAS environment service and
  `.env.local`, never as a `$` ref in eas.json). Depends on A-3. Test early on a real device (the free
  google-signin API sits on Google's legacy Android sign-in). **S.**
- **D-2 Facebook token type (verify first):** `lib/facebookAuth.ts:10-26` passes a classic access token to
  `supabase.auth.signInWithIdToken`, which expects an OIDC ID token; Android never issues Limited Login ID
  tokens. First check whether any `facebook` identities exist from iOS. If Supabase rejects these tokens on
  Android, switch Android to `signInWithOAuth({ provider: 'facebook' })` in a browser (needs A-8). Also confirm
  the Facebook SDK's `AD_ID` permission is blocked (B-3). **M.**
- **D-3 Apple on Android (D3):** Supabase web OAuth (`signInWithOAuth({ provider: 'apple' })`) behind an
  Android-only "Continue with Apple" button. Needs A-7 + A-8. **M.**
- **D-4 Sign-out of provider SDKs:** `store/auth.ts:136-137` signs out of Supabase only; on Android Google then
  silently reuses the same account. Add `GoogleSignin.signOut()` and `LoginManager.logOut()`. **S.**
- **D-5 Wrong error label:** `app/(auth)/index.tsx:88` says "Apple Sign-In failed" for a Facebook failure. **S.**
- **D-6 Auth callbacks on a verified link:** any Android app can register the `dreambot://` scheme; recovery
  tokens arriving via the custom scheme can be intercepted. Route auth callbacks through the verified https
  App Link (B-4 + M-1) and, per the 2026-09-27 audit, only accept `token_hash` on `reset-password` with
  `type=recovery` in `app/_layout.tsx` (~83-199). **S.**
- **D-7 Cold-start deep links:** a post/user link opened from a cold start has no `initialRouteName`, so Back
  exits the app instead of going Home. Set the root layout's initial route / stack so Back lands on the tabs.
  **S.**

### WS-E · Payments, client (agent)

- **E-1 RevenueCat key:** `lib/revenuecat.ts:23` is `'YOUR_REVENUECAT_ANDROID_API_KEY'` and
  `configureRevenueCat` early-returns (~35), so Android has no paywall. Put the `goog_` key from A-5 (public key,
  fine in code like the iOS `appl_` key). **S.**
- **E-2 Package matching (blocker, verified):** `findPackage` (`app/subscribe.tsx:118-121`) compares
  `p.product.identifier === productId` exactly; on Play that identifier is `sub:basePlan`, so every plan shows
  "Plan unavailable" and hardcoded USD prices. Use the same normalization helper as C-3 (put it in
  `lib/` and mirror in the webhook). **S.**
- **E-3 Upgrades / crossgrades:** Play has no subscription groups. `purchaseProPackage`
  (`lib/revenuecat.ts:100-111`) must pass `googleProductChangeInfo` (old product id + proration mode) when the
  user already has Basic/Pro, or Basic→Pro creates a **second live subscription** and the webhook's tier-clear
  logic flips Pro/Basic on each renewal. **M.**
- **E-4 Manage subscription:** `Purchases.showManageSubscriptions()` throws on Android; the fallback opens
  `apps.apple.com` (`lib/revenuecat.ts:130-142`, called from `app/subscribe.tsx:186`,
  `app/settings/index.tsx:567`). Use `customerInfo.managementURL`, else
  `https://play.google.com/store/account/subscriptions?package=com.konakevin.radorbad`. **S.**
- **E-5 Store copy:** `app/subscribe.tsx:418-419` ("charged to your Apple ID… App Store settings"),
  `app/sparkleStore.tsx:402` ("Connecting to App Store…") → `Platform.select` Google Play wording (subscription
  disclosure text is required by both stores). **S.**

### WS-F · Push, client (agent)

- **F-1 Notification channel:** create one channel at startup, **before** the permission request in
  `hooks/usePushNotifications.ts` (~28-40): importance HIGH, `sound: 'notification.wav'` (already in `res/raw`).
  Android 13 won't show the permission prompt without a channel, and a channel's sound can't be changed later,
  so pick the id once and use it in C-9. **S.**
- **F-2 Prompt timing:** the permission prompt fires at launch; on Android 13+ ask at a meaningful moment (e.g.
  after the first dream) to avoid a permanent deny. **S.**
- **F-3 Copy:** "iOS Settings" in `app/settings/notifications.tsx:147,164`. Launcher badges
  (`useBadgeSync.ts:33`) no-op on most Android launchers; acceptable. **S.**

### WS-G · Android Back button and navigation (agent): the biggest UX gap

There is **no `BackHandler` anywhere in the codebase (verified)**. Build one hook, e.g.
`hooks/useAndroidBack.ts` → `useAndroidBack(active: boolean, onBack: () => boolean)`, and register it inside each
overlay component (not at call sites) so every mount is covered.

- **G-1 Custom overlays** (plain views, not RN Modals; Back currently pops the screen underneath or exits the
  app from a tab root): `PostActionSheet` (mounted in `DreamCard.tsx` on the feed, profile, create, inbox,
  user, edit-profile, settings/reports), `FilterPickerSheet` (`top.tsx`), `StylePickerSheet` (`create.tsx`),
  `CommentOverlay` + `LikesOverlay` (`FullScreenFeed.tsx`, `inboxFeed.tsx`), `EditDescriptionModalHost` +
  `UpscaleModalHost` (`app/_layout.tsx`), `MentionSheet` (`post/new.tsx`). **M.**
- **G-2 In-screen modes:** profile grid multi-select (`profile.tsx`), inbox select mode + menu (`inbox.tsx`),
  Explore search (`top.tsx`), reveal full-size preview (`dream/reveal.tsx`): Back should exit the mode first.
  **S.**
- **G-3 RN Modals without `onRequestClose`** (Back is swallowed): `create.tsx` (~2066),
  `user/[userId].tsx` (~552), `ConfirmDialog.tsx:28`, `dreamTest.tsx` (~566). **S.**
- **G-4 Decide what Back means on teaching sheets (UX call, not a bug):** `SparkleIntroSheet` is the one-time
  explainer shown after the user taps Dream; by design "Got it" dismisses AND proceeds, and
  `onRequestClose={onClose}` makes Android Back (and iOS swipe-down on the pageSheet) proceed too
  (`create.tsx` ~2117-2126, verified). Android users read Back as "cancel", so decide per sheet whether Back
  cancels or proceeds (`CreateIntroSheet`, `SparkleIntroSheet`, `MediumsIntroSheet`, `GroupPhotoIntroSheet`),
  and make sure no sheet's Back path does work the user didn't expect. **S.**
- **G-5 Locked flows:** `gestureEnabled: false` does not block hardware Back. Onboarding is one route with
  internal steps (`(onboarding)/index.tsx` ~159: Back exits the whole flow), and `dream/loading`,
  `dream/reveal`, `avatarFrame`, `reset-password` can be popped. Use `usePreventRemove` / BackHandler to step
  back within onboarding and block or confirm on the others. `settings/locations.tsx` lacks the `beforeRemove`
  guard that `dream-cast.tsx` has. **M.**
- **G-6 Tab state:** `activeTab` updates only on `tabPress` (`(tabs)/_layout.tsx` ~192-269,
  `profile.tsx` ~430); Back to Home doesn't fire one. Derive from navigation state. **S.**
- **G-7 Edge swipes:** swipe-left-to-profile (`useCardGestures`) and the Bots pagers start at screen edges that
  Android reserves for the Back gesture (on Home this backgrounds the app). Add horizontal edge insets to those
  gesture areas / `Gesture.hitSlop`, and test with gesture navigation. **M.**

### WS-H · Keyboard, insets and edge-to-edge (agent)

Edge-to-edge is on and `KeyboardProvider` (react-native-keyboard-controller) wraps the app, so `adjustResize`
does nothing on Android. The old plan's "Android uses adjustResize, correct" is wrong.

- **H-1 Inputs under the keyboard:** `app/(tabs)/top.tsx` (~627) and `components/EditDescriptionModal.tsx` (~108)
  pass `behavior={undefined}` on Android; give Android a behavior or use keyboard-controller's
  `KeyboardAvoidingView`. `automaticallyAdjustKeyboardInsets` is iOS-only (`DreamCastRoster.tsx` ~778,
  `acknowledgements.tsx` ~146). `app/comments.tsx` looks unreachable: delete it after confirming. **M.**
- **H-2 Blur-on-Back:** Back closes the keyboard without blurring the field, so save-on-blur in
  `DreamCastRoster.tsx` (~670) and `DreamCastStep.tsx` (~293) never fires; listen to keyboard hide too. **S.**
- **H-3 Modal sheets under the nav bar:** in RN 0.81 with edge-to-edge, RN Modals are edge-to-edge too
  (`ReactModalHostView.kt` ~88-98). Add `useSafeAreaInsets().bottom` padding to: `ModelPicker`,
  `RestyleModelPicker`, `CastPickerSheet`, `GiftSparklesSheet` (hardcoded `34` ~324), `GiftFriendPicker`,
  `DreamSmartSwapSheet`, `PremiumGateSheet`, `AiConsentSheet`, `AnnouncementSheet`. **M.**
- **H-4 Hardcoded top offsets:** `photo/[id].tsx` (~485, 497: `54`, status bar hidden), `inboxFeed.tsx`
  (~455, 469), `user/[userId].tsx` (~1019: `60`), `RevealStep.tsx` (~852: `60`) → `insets.top`. **S.**
- **H-5 Nav-bar height math:** Android window height excludes the 3-button nav bar while edge-to-edge draws
  under it, so the prompt-fill in `create.tsx` (~648-657), the pinch focal point in `useCardGestures.ts` and
  sheets sized from `SCREEN_HEIGHT` (`PostActionSheet.tsx` ~33-36) are off. Use `useSafeAreaFrame()` or screen
  dimensions on Android. **M.**
- **H-6 Keyboard timing:** Android fires `keyboardDidShow` after the animation (`create.tsx` ~193,
  `KeyboardSwipeDismiss.tsx` ~24, `CommentOverlay.tsx` ~266, 303); acceptable, verify on device. **S.**

### WS-I · Visual polish (agent)

- **I-1 Shadows:** coloured glow shadows have no Android equivalent: `welcome-gift.tsx` (~331),
  `dream/loading.tsx` (~682), `profile.tsx` (~1229), `InfoStep.tsx` (~178), `PostTile.tsx` (~389-462) → use the
  `boxShadow` style prop (supported on Android with the New Architecture). **S.**
- **I-2 Font padding:** set `includeFontPadding: false` in `components/AppText.tsx` for Android (only
  `OverlayPill.tsx` and one profile style do it today); gradient wordmarks (`GradientTitle`,
  `AnimatedGradientTitle`, `LocationPickerStep`, ~32 screens) clip glyphs when height is locked to lineHeight.
  QA each. **M.**
- **I-3 Faux bold:** ~38 NativeWind `font-bold`/`font-semibold` classes bypass AppText's weight→face mapping
  (auth screens, `create.tsx`); map them to the family classes. `acknowledgements.tsx` (~238) uses `'Courier'`
  → `'monospace'`. **S.**
- **I-4 Font scale:** nothing sets `maxFontSizeMultiplier` and Android 14 allows 200%; set ~1.3 in AppText.
  `fontScale()` in `lib/responsive.ts` (~104) scales by height only, so narrow 20:9 phones and the 344dp Fold
  cover screen truncate chips: use the smaller of the height and width ratios. **S.**
- **I-5 Haptics:** ~80 files call expo-haptics directly; add `lib/haptics.ts` that uses
  `performAndroidHapticsAsync` on Android (subtler, platform-correct) and migrate call sites. Tab haptic in
  `components/haptic-tab.tsx` is iOS-gated (taste call). **M.**
- **I-6 Pull to refresh:** `profile.tsx` (~1131), `top.tsx` (~597), `PostGrid.tsx` (~752-757) pin
  `refreshing` false with a custom indicator, so Android also shows its stock spinner; `tintColor`
  (`inbox`, `user`) is iOS-only → Android `colors`/`progressBackgroundColor`/`progressViewOffset`. **S.**
- **I-7 iOS-only scroll/input props:** `bounces={false}` (`CommentOverlay`, `LikesOverlay`, `MentionSheet`) →
  add `overScrollMode="never"`; `clearButtonMode`; `keyboardDismissMode="interactive"` (`create.tsx`). **S.**
- **I-8 `pageSheet` intro sheets** become full-screen pages on Android (fine), but see G-4. Clipboard: Android
  13+ shows its own "copied" toast; skip the app toast there (`sharePost`, `profile`). **S.**

### WS-J · Performance (agent; J-1 is server-side and helps iOS too)

- **J-1 Real display variant (verified):** `image_url_display` is the full-resolution render re-encoded as JPEG
  q80, never downscaled (`services/image-ops/src/persist.ts` ~317-330). Add a real ~1080px-long-edge display
  variant in image-ops (backfill optional; new renders first). expo-image's Android prefetch decodes at original
  size, so this is the single biggest memory lever. **M.**
- **J-2 Prefetch on Android:** ~95 images prefetched at launch and on Bots (`useDreamFeed.ts` ~131, 171,
  `bots.tsx` ~126-131) plus `PostGrid.tsx` (~526), `PostTile.tsx` (~130), `FullScreenFeed.tsx` (~510). On
  Android cut to 1-2 per feed and no grid prefetch until J-1 lands. **S.**
- **J-3 Bots tab mounts:** 3 pagers x 5 cards = up to 15 full-screen cards with gestures, gradients and masked
  views; mount only the active card for off-screen pagers. **M.**
- **J-4 MaskedView cost:** per-instance offscreen layers in every feed card and comment row
  (`GradientUsername`, `GradientTitle`, `AnimatedGradientTitle`); verify rendering under the New Architecture
  and consider SVG gradient text. **M.**
- **J-5** `useRefreshGap.ts` (~27) animates height on the JS thread; move to reanimated. **S.**

### WS-K · Device variety (agent)

- **K-1 Tablets / foldables stopgap (D6):** module-scope `Dimensions.get` in `lib/responsive.ts` (~31-143),
  `constants/grid.ts` (~26-32) and ~21 more files (`DreamCard.tsx` ~59, `CommentOverlay.tsx` ~55,
  `PostActionSheet.tsx` ~33, …). Add the API-36 manifest opt-out
  `android.window.PROPERTY_COMPAT_ALLOW_RESTRICTED_RESIZABILITY` (verify the exact name/behaviour in current
  Android docs) via a config plugin. **S.** Full fix = a reactive `useResponsive()` replacing module-scope
  values. **L, v2.**
- **K-2 Small screens:** 360x640 phones scale to 0.76; auth landing, `dream/loading` and `dream/reveal` don't
  scroll. Make them scroll or exclude such devices (D7). **S.**
- **K-3 Camera process death:** Android may kill the app during `launchCameraAsync` (`create.tsx` ~1060,
  `useChangeAvatar.ts` ~44); handle `ImagePicker.getPendingResultAsync()` on resume. **S.**

### WS-L · Google Play policy and compliance (agent drafts, Kevin approves / submits)

| ID   | Policy                                                             | Status in app                                                                                         | Gap                                                                                                                                                                                                                                                                                                                                                                                                                 | Fix                                                                                                                                                                     | Size |
| ---- | ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- |
| L-1  | **AI-generated content: users must be able to flag output in-app** | Report exists for others' posts, comments, users, bots (`lib/reportContent.ts`, `lib/postOptions.ts`) | Hidden on your OWN content (`lib/imageLongPress.ts` ~519 `if (!opts.isOwn)`): a user can't flag their own Create/nightly result. **Most likely rejection.**                                                                                                                                                                                                                                                         | Add "Report this dream" to own dreams + the reveal screen, routed to the existing reports pipeline                                                                      | S    |
| L-2  | Photo & Video permissions                                          | System picker already used                                                                            | Manifest carries READ*MEDIA*\* / audio / overlay perms                                                                                                                                                                                                                                                                                                                                                              | B-3                                                                                                                                                                     | S    |
| L-3  | User data / privacy policy accuracy                                | Consent sheet before photo upload (`components/AiConsentSheet.tsx`)                                   | xAI (Grok) selectable in Create (`constants/imageModels.ts` ~164) but not named; policy says "never create a biometric template" while face-swap computes ArcFace embeddings (`services/face-swap-dual/src/faceEmbed.ts`); inferred gender/age/ethnicity stored (`describe-photo` → `lib/castUpload.ts` ~177), not disclosed (D9); purchases described as Apple-only; PostHog GeoIP not disabled (`lib/posthog.ts`) | Update policy + consent sheet: list xAI, describe embeddings as transient processing, disclose/stop inferred traits, add Google Play billing, disclose or disable GeoIP | M    |
| L-4  | Child Safety Standards (social apps)                               | Terms 17+, UGC moderation                                                                             | No published child-safety standards page                                                                                                                                                                                                                                                                                                                                                                            | Add a page on dreambotapp.com + contact; declare in Play Console                                                                                                        | S    |
| L-5  | Account deletion (in-app + web)                                    | In-app works (`app/settings/index.tsx` ~231, 303); web section at `/support#delete-account`           | No dedicated URL; retention not stated (Sentry, PostHog, RevenueCat, 30-day logs)                                                                                                                                                                                                                                                                                                                                   | `/delete-account` page (M-5) + enter URL in Data safety                                                                                                                 | S    |
| L-6  | Subscriptions transparency                                         | RevenueCat paywall                                                                                    | Apple-only copy (E-5); Terms/Privacy Apple-only                                                                                                                                                                                                                                                                                                                                                                     | E-5 + legal copy (M-4)                                                                                                                                                  | S    |
| L-7  | Face swap of other people                                          | Terms require consent; takedown path; "Uses my face or photo" report reason                           | No explicit "I have their permission" when adding a +1                                                                                                                                                                                                                                                                                                                                                              | Add a one-time confirm when adding a +1 cast member                                                                                                                     | S    |
| L-8  | Generative AI restricted content                                   | Flux safety tolerance, provider filters, prompt sanitize                                              | `sanitizePrompt` comment says it rewrites child terms "so the generation doesn't get rejected" (reads badly to a reviewer); no own output scanning                                                                                                                                                                                                                                                                  | Reword the code comment; prepare a moderation explanation for review notes; consider output scanning later                                                              | S    |
| L-9  | Ads / Advertising ID                                               | No ads                                                                                                | Facebook SDK may add AD_ID                                                                                                                                                                                                                                                                                                                                                                                          | Block AD_ID (B-3); answer "No ads"                                                                                                                                      | S    |
| L-10 | Target audience / rating                                           | 17+ in Terms                                                                                          | none                                                                                                                                                                                                                                                                                                                                                                                                                | Target 18+, IARC questionnaire (A-1)                                                                                                                                    | S    |

**Data safety form draft** (Kevin enters; agent keeps it in sync with the privacy policy):

- _Collected:_ email, name (from social sign-in), user id, photos (uploads + cast photos), app interactions,
  user content (prompts, captions, comments), search history, crash logs + diagnostics, purchase history,
  device/other ids (push token, PostHog id), approximate location only if GeoIP stays on, inferred traits per D9.
- _Shared:_ none (Replicate, Google Gemini, OpenAI, xAI, Anthropic, Fly.io, Supabase, PostHog, Sentry,
  RevenueCat, Expo are service providers/processors).
- _Security:_ encrypted in transit; users can request deletion (URL from L-5).

### WS-M · Website `../dreambot-web` (agent; deploy = `git push main`, Vercel)

- **M-1 `/.well-known/assetlinks.json`:** route like the AASA one, listing `com.konakevin.radorbad` with the
  SHA-256 of the Play App Signing key and the upload key (Kevin supplies fingerprints from Play Console). Verify
  with Google's Statement List tester. **S.**
- **M-2 Store badges by platform:** App Store is hardcoded in `AppStoreButton.tsx`, `page.tsx`,
  `post/[id]/route.ts`, `user/[userId]/route.ts`, `join/*`, `ResetForm.tsx` ("Open DreamBot" → App Store).
  Detect the user agent (route handlers get the request): Play badge on Android, both on desktop. Add
  `play.google.com` to conversion tracking (`PostHogProvider.tsx` ~42, `posthogSnippet.ts` ~36). **M.**
- **M-3 Open-in-app on share pages:** add an Android `intent://…#Intent;scheme=https;package=com.konakevin.radorbad;S.browser_fallback_url=<Play URL>;end`
  link and `al:android:*` meta next to `al:ios:*` on the post and user pages. **S.**
- **M-4 Copy + legal:** "iPhone & iPad" (`layout.tsx`, `page.tsx`, `opengraph-image.tsx`), JSON-LD
  `operatingSystem: "iOS"`; Terms (Apple refunds, manage in Apple ID), Privacy (purchases "handled by Apple",
  Apple tracking prompt, DeviceCheck → name Play Integrity/Android device check if C-10 ships), Support
  (reportaproblem.apple.com, "iOS version"). Agent drafts, Kevin approves. **S.**
- **M-5 `/delete-account` page:** names DreamBot; request steps that don't need the app; what's deleted and
  what's retained and for how long. **S.**
- **M-6 Child-safety standards page** (L-4). **S.**

### WS-N · Home-screen widget (v2, optional)

iOS: `targets/widget` (SwiftUI, 3 sizes, rotates the user's 6 latest dreams from App Group UserDefaults
`widget_state` + images, taps open `dreambot://photo/<id>` or `dreambot://create`), fed by
`modules/dreambot-widget` (Swift-only, `platforms: ["apple"]`) and `lib/widgetSync.ts`. Android equivalent: a
Kotlin Glance `AppWidget` in a local Expo module (or `react-native-android-widget`), fed from SharedPreferences +
app files, refreshed by WorkManager, same deep links. Also clear widget state on sign-out on both platforms
(iOS leaves the previous user's private dreams on the home screen today). **L.**

---

## 5. QA plan and launch

### Device matrix (physical where noted; emulators otherwise)

| Device                                                          | Why                                                    |
| --------------------------------------------------------------- | ------------------------------------------------------ |
| Galaxy A15/A16 (4 GB, Mali) · physical                          | Memory + jank on the feed pager, Bots tab, grids       |
| Galaxy S24 base (360x780dp, 3-button nav by default) · physical | Narrow width, nav-bar insets                           |
| Pixel 7a/8a on Android 16, gesture nav · physical               | Reference device; edge-swipe vs Back, font scale 200%  |
| Galaxy Z Fold 5/6                                               | 344dp cover screen, fold/unfold, rotation              |
| Pixel Tablet or Tab S9 FE on API 36                             | Forced resizability, split-screen                      |
| Redmi Note 13 (HyperOS)                                         | Aggressive background killing, OEM font scaling        |
| 360x640 emulator on API 24/26                                   | minSdk + small-screen decision (D7)                    |
| Pixel 9 (punch-hole)                                            | Cutouts in fullscreen views with the status bar hidden |

### Acceptance checklist (every item must pass on the closed track build)

- [ ] Email, Google, Facebook sign-in and sign-out (switch accounts); Apple via web OAuth if D3.
- [ ] Password reset link opens the app via the verified App Link (not the browser) and sets a password.
- [ ] Post/user share links from Messages/Chrome open the app; cold start then Back lands on Home.
- [ ] Push: permission prompt, token registered with `platform = 'android'`, dream-ready + social pushes arrive
      heads-up with the custom sound and correct small icon; tap routing cold and warm.
- [ ] Payments with license testers: each sparkle pack grants the right amount once; Pro and Basic
      monthly/yearly grant the entitlement + bundle; upgrade Basic→Pro replaces (not duplicates) the
      subscription; cancel, refund (clawback), grace period; Manage Subscription opens Play.
- [ ] Back closes every overlay/mode in WS-G and never triggers an action; onboarding steps back one step;
      loading/reveal can't be popped mid-render.
- [ ] Keyboard never covers an input (Create, comments, Explore search, edit description, cast names, username).
- [ ] No sheet button sits under the nav bar in 3-button mode; no content under the status bar/cutout.
- [ ] Save to gallery on Android 11, 13, 14 (write-only permission); camera capture survives process death.
- [ ] Feed scrolls at 60fps on the Galaxy A-series with no OOM after 10 minutes; Bots tab swipes smoothly.
- [ ] Merged manifest contains no blocked permissions; AAB bundle contains the real PostHog key.
- [ ] Update gate: Android reads its own min/latest versions and opens the Play listing.
- [ ] Report is available on your own dream (L-1); account deletion works in-app and via the web page.

### Rollout

Internal track (no review) → closed track (12 testers x 14 days if D2 requires; also where purchases are
tested) → production **staged rollout** 5% → 20% → 50% → 100%, watching Sentry (crash-free sessions by
platform), PostHog (funnel by `$os`), `ai_generation_log` and webhook logs (`store = PLAY_STORE`) between steps.
Set `latest_app_version_android` (soft) on launch; only hard-gate Android per the release skill's rules.

**Rollback:** halt the staged rollout in Play Console; server changes are additive and platform-scoped
(C-1/C-2 null = no gate), so iOS is unaffected.

---

## 6. Risk register

| Risk                                                                     | Likelihood                        | Impact                           | Mitigation                         |
| ------------------------------------------------------------------------ | --------------------------------- | -------------------------------- | ---------------------------------- |
| Play rejects for AI-content reporting / permissions / privacy mismatches | High if not fixed                 | Launch slip                      | L-1, B-3, L-3 before first review  |
| Personal account 12-tester/14-day gate                                   | Medium                            | +2-3 weeks                       | D2 on day 1; recruit testers early |
| Android subscribers get nothing (product id format)                      | Certain if unfixed                | Revenue + trust                  | C-3 + E-2 + sandbox tests          |
| Shared hard update gate locks out Android                                | Certain on the next iOS hard gate | All Android users blocked        | C-1 before launch                  |
| Duplicate subscriptions on Basic→Pro                                     | High if unfixed                   | Refunds, support load            | E-3                                |
| Memory jank / OOM on low-end devices                                     | Medium                            | Bad reviews                      | J-1..J-3, device matrix            |
| Apple-ID users locked out on Android                                     | Medium                            | Support load, duplicate accounts | D3 / D-3                           |
| Facebook login fails on Android                                          | Medium                            | One provider down                | D-2 verify early                   |
| Trial farming on Android                                                 | Medium                            | AI cost                          | C-10 stopgap                       |
| Tablet/foldable layouts broken                                           | Medium                            | Bad reviews on those devices     | K-1 stopgap + QA                   |

---

## 7. Carry-over rules for the executing agent

- Follow CLAUDE.md hard rules: commit with `git commit -m … -- <paths>` (shared working tree, never
  `git add -A`), read the staged diff, deploy edge functions with `--no-verify-jwt` immediately after editing,
  apply migrations with `node scripts/apply-migration.mjs <NNN>` (next free prefix; never `supabase db push`),
  new `users`/`uploads` columns need column grants, new client RPCs need an explicit `GRANT EXECUTE` (default
  privileges were locked down in migration 567).
- Never add `"$VAR"` env refs to eas.json; verify every build's bundle for the real `phc_` key.
- Never ship from a stale `android/` folder; always prebuild clean.
- Server changes Android depends on go live before the Android build that needs them.
- Test every server change live (smoke as a real user, as in the 2026-09-27 security fixes) and every client
  change on a physical Android device before calling it done.
- Update this file as tasks complete: mark each task ID done with the commit hash, and record decisions under §1.

---

## 8. Findings that also help iOS (do these regardless of Android)

| Item                                                                                       | Benefit on iOS                                                                                   | Where                                         | Needs an app build?                                                                                        |
| ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ | --------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| J-1 real ~1080px display image                                                             | Less memory and bandwidth, faster feed/grid loads (the "display" image is full-resolution today) | `services/image-ops` (server)                 | **No** (the app already loads `image_url_display`; new renders get the smaller file, old ones on backfill) |
| C-4 webhook `PRODUCT_CHANGE` uses `new_product_id`                                         | Correct tier/sparkles after monthly↔yearly or Basic↔Pro changes on iOS too                       | `revenuecat-webhook`                          | **No**                                                                                                     |
| C-6 grace period extends `expires_at`                                                      | iOS billing-retry users keep Pro while Apple retries the card, matching RevenueCat               | `revenuecat-webhook`                          | **No**                                                                                                     |
| C-5 clawback atomic + error-checked                                                        | A failed refund clawback can no longer double-deduct or silently skip                            | `revenuecat-webhook`                          | **No**                                                                                                     |
| C-7 sandbox purchases gated to testers                                                     | TestFlight / App Review purchases stop minting real sparkles/Pro                                 | `revenuecat-webhook`                          | **No**                                                                                                     |
| C-8 store/platform on server analytics                                                     | Revenue split by store once Android exists                                                       | edge functions                                | **No**                                                                                                     |
| L-3 / M-4 privacy policy + terms accuracy (xAI, embeddings, inferred traits, GeoIP)        | Same disclosures are owed to Apple's review and users                                            | website                                       | **No** (consent-sheet wording is in-app: yes)                                                              |
| L-8 reword the `sanitizePrompt` child-terms comment                                        | Reads badly to any reviewer                                                                      | server comment                                | **No**                                                                                                     |
| L-1 "Report this dream" on your own dreams                                                 | App Store guideline 1.2 (UGC) expects the same                                                   | app                                           | Yes                                                                                                        |
| L-7 "I have their permission" when adding a +1                                             | Consent evidence for face swap of friends                                                        | app                                           | Yes                                                                                                        |
| D-4 sign out of Google/Facebook SDKs                                                       | Account switching (the Google SDK silently reuses the last account)                              | `store/auth.ts`                               | Yes                                                                                                        |
| D-5 "Apple Sign-In failed" shown for Facebook failures                                     | Wrong error text on iOS today                                                                    | `app/(auth)/index.tsx`                        | Yes                                                                                                        |
| D-6 auth callbacks only via verified links, recovery token accepted only on reset-password | Closes the session-injection path the 2026-09-27 security audit found on iOS                     | `app/_layout.tsx`                             | Yes                                                                                                        |
| N (part) clear the home-screen widget on sign-out                                          | The previous user's private dreams stay on the iOS widget today                                  | `lib/widgetSync.ts`                           | Yes                                                                                                        |
| I-4 font-scale cap + width-aware `fontScale()`                                             | Layouts at the largest Dynamic Type sizes and on narrow iPhones (SE/mini)                        | `components/AppText.tsx`, `lib/responsive.ts` | Yes                                                                                                        |
| F-2 ask for push permission after the first dream                                          | Fewer permanent denials (iOS asks once)                                                          | `hooks/usePushNotifications.ts`               | Yes                                                                                                        |
| J-3 mount only the active card on off-screen Bots pagers                                   | Smoother Bots tab and less memory on older iPhones                                               | `app/(tabs)/bots.tsx`                         | Yes                                                                                                        |
| B-8 remove unused native deps                                                              | Smaller binary, faster builds                                                                    | `package.json`                                | Yes                                                                                                        |
| B-7 platform in the Sentry release                                                         | Cleaner crash grouping                                                                           | `lib/sentry.ts`                               | Yes                                                                                                        |
