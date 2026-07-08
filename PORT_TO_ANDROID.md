# Porting DreamBot to Android — Audit + Work Plan

> Deep-dive audit 2026-07-08 (two-agent sweep: code-level iOS-isms + services/infra, both
> verified against the repo with file:line refs). Bottom line up front: **this is a 2-3 week
> port, not a rewrite.** The Expo/RN foundation is genuinely cross-platform, `app.config.js`
> already carries a complete `android` block (package `com.konakevin.radorbad`, adaptive icons,
> edge-to-edge), the `android/` folder is prebuilt, and the UI layer has almost no iOS-isms.
> The work is concentrated in **service configuration** (Google/Firebase/Play/RevenueCat/Meta
> consoles), a handful of code fixes, and device QA.

## Executive summary

| Area | State | Effort |
|---|---|---|
| UI / components / navigation / gestures | Already cross-platform (custom sheets, not native iOS ones; keyboard + haptics + shadows already branched) | ~0 |
| App config (icons, splash, package, permissions) | Already done in app.config.js + plugins | ~0 |
| Google Sign-In | **Broken on Android** (no webClientId) | 0.5 day + console setup |
| Push notifications | **Broken on Android** (no FCM, no channel) | 1 day + Firebase setup |
| Payments (RevenueCat + Play Billing) | Code ready; **Android key is a placeholder**, Play products don't exist | 1 day code/config + 1-2 days console + review wait |
| Webhook refund clawback | **Apple-only logic** — Play refunds wouldn't reclaim sparkles | 0.5 day |
| Deep links (App Links) | Not set up (scheme-only) | 0.5 day + website assetlinks.json |
| Facebook login | Plugin ready; Meta console needs Android platform + key hashes | 0.5 day console |
| EAS build/submit profiles | iOS-only today | 0.5 day |
| Copy fixes (Apple ID → Google Play, store links) | 4 small spots | 0.5 day |
| Store listing, Data Safety form, screenshots, review | Net-new | 1-2 days + Play review |
| Device QA (keyboard, media saves, permissions, notches/softnav) | Net-new | 3-5 days |

**Total: roughly 8-12 focused dev-days, 2-3 calendar weeks including store review and QA.**
No server-side rework beyond one webhook fix; Supabase, the dream engine, the queue, and the
bots are platform-agnostic.

## What's already done (verified, not assumed)

- `app.config.js:57-67`: full `android` block — package name, adaptive icon
  (foreground/background/monochrome assets exist), `edgeToEdgeEnabled`,
  `predictiveBackGestureEnabled:false`. Splash is density-independent.
- Every `Platform.OS` branch audited already has a correct Android side: keyboard event names
  (`create.tsx:118`, `newPost.tsx:74`), KeyboardAvoidingView iOS-gating (Android uses
  adjustResize — correct), photo-picker modal deferral (`create.tsx:1529`), Apple-button hidden
  on Android (`(auth)/index.tsx:109`, `login.tsx:154`), LayoutAnimation enablement for Android
  already present (`LocationPickerStep.tsx:25`).
- All sheets/action menus are **custom animated components**, not `ActionSheetIOS` — identical
  on Android. Shadows are paired with `elevation`. `lib/responsive.ts` is pure Dimensions math;
  `isTabletDevice` (width ≥ 600) works for Android tablets.
- Dependency sweep: everything bundled is cross-platform (expo-image, reanimated v4,
  gesture-handler, keyboard-controller, NativeWind v4, Sentry, PostHog, RevenueCat SDK,
  media-library/camera/picker, compressor, thumbhash). `expo-apple-authentication` is iOS-only
  and already gated. `expo-blur` is an unused dep. TF/face-api/sharp/pg are script-side only.
- `push_tokens.platform` column already stores `Platform.OS`; `send-push` posts to the Expo
  push service, which is cross-platform. `lib/revenuecat.ts:34` already selects the API key by
  platform. Sentry + PostHog need zero platform work (env-service vars apply to both).
- Play-relevant compliance already built for Apple: account deletion, content reporting SLA.

## The blockers (ship-stoppers, in priority order)

### 1. Payments: `RC_ANDROID_KEY` is a placeholder → RevenueCat is a silent no-op on Android
`lib/revenuecat.ts:23` is `'YOUR_REVENUECAT_ANDROID_API_KEY'` and `configureRevenueCat`
early-returns on placeholder keys — no paywall, no offerings, no purchases.
**Work:** add a Google Play app in the RevenueCat project → real `goog_` key into the constant.
Play Console: create the consumable in-app products for every sparkle pack id
(`com.konakevin.radorbad.sparkles.{15,40,90,200,500}_v2`) and subscriptions with base plans for
`pro.monthly`/`pro.yearly` (+ basic tiers), map `$rc_monthly`/`$rc_annual` packages per-store in
the `subscriptions` offering. Create a Google Cloud service account with Play Developer API
access, upload creds to RevenueCat, wire Play RTDN Pub/Sub. **Gotcha:** Play only lets you
create IAP products after a signed AAB is uploaded to a track — sequence the first build early.

### 2. Push: no FCM, no notification channel
No `google-services.json` anywhere, no `android.googleServicesFile` in app.config, and zero
`setNotificationChannelAsync` calls — Android tokens won't mint, and even after FCM the custom
`notification.wav` + heads-up importance need a channel (Android 8+).
**Work:** Firebase project → `google-services.json` (reference via `android.googleServicesFile`)
→ upload the FCM V1 service-account JSON to EAS credentials. Add a startup channel registration
(`importance HIGH`, sound `notification.wav`). Verify `POST_NOTIFICATIONS` (Android 13+) lands
in the manifest after prebuild (expo-notifications should inject it). `send-push` needs no
changes. Launcher badges are a silent no-op on most Android launchers — acceptable.

### 3. Google Sign-In: missing `webClientId` → login throws on Android
`lib/googleAuth.ts:5-7` configures `iosClientId` only; Android requires a **Web-type** OAuth
client id to return an idToken.
**Work:** Google Cloud Console: create an Android OAuth client (package + SHA-1/SHA-256 of the
Play app-signing key AND the EAS keystore) + a Web OAuth client. Add
`EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` to the EAS env service (NOT eas.json — see gotcha below)
and pass as `webClientId`. Add the Web client id to Supabase Auth → Google authorized client
ids. The `signInWithIdToken` exchange itself is store-agnostic.

### 4. Facebook login: Meta console lacks an Android platform
The config plugin already wrote the Android manifest entries. **Work is console-only:** add the
Android platform to the Meta app — package name, activity, and **key hashes** for debug + the
Play app-signing key. Without the release hash, FB login fails only on production builds (a
classic trap — test with a Play internal-track build, not just dev).

### 5. Webhook refund clawback is Apple-only
`revenuecat-webhook/index.ts:261` claws back sparkles only on
`CANCELLATION && cancel_reason === 'CUSTOMER_SUPPORT'` — an Apple-specific reason. Google Play
refunds arrive with different cancel reasons → **refunded Android users keep their sparkles.**
Everything else in the webhook is store-neutral (RevenueCat normalizes event types; Play
transaction ids are unique strings so `purchase:<txId>` idempotency holds).
**Work:** add a Play refund branch keyed on RevenueCat's store/cancel-reason semantics for
Google, mirroring the existing `refund:purchase:<txId>` clawback. Redeploy; add a dbspec-style
test if practical.

### 6. Android App Links: not configured
The manifest has only the `dreambot://` scheme — an `https://dreambotapp.com/post/<id>` tap
opens the browser. **Work:** `android.intentFilters` in app.config (autoVerify, https,
host `dreambotapp.com`, paths `/post/*`, `/user/*`) + publish
`/.well-known/assetlinks.json` on dreambotapp.com (website repo) with the Play app-signing
SHA-256 for `com.konakevin.radorbad`. Mirror the AASA path set.

### 7. EAS profiles: no android build/submit config
Add `android` to the three build profiles (dev client / preview APK / production AAB with
autoIncrement) and a `submit.production.android` (service-account JSON + track).
**⚠️ Env-var gotcha (learned the hard way on iOS, 2026-07-07):** do NOT add
`"$EXPO_PUBLIC_*"` references to eas.json env blocks — `$`-refs expand only against legacy EAS
*secrets*, and the literal string clobbers the good env-service value (this shipped the iOS
launch build with dead PostHog + Sentry). Plain `EXPO_PUBLIC_*` vars must come from the EAS
environment service, which injects per-environment automatically. Verify every production AAB
by grepping the bundle for the real `phc_` key before submitting.

## Small fixes (copy + one-liners)

- `app/subscribe.tsx:357-359`: "charged to your Apple ID… App Store settings" →
  `Platform.select` for Google Play wording (required disclosure both stores).
- `app/sparkleStore.tsx:402`: "Connecting to App Store…" → platform copy.
- `constants/appStore.ts:18` + `ForceUpdateGate.tsx:66`: update URL needs
  `market://details?id=com.konakevin.radorbad` on Android.
- `components/haptic-tab.tsx:10`: tab haptic is iOS-gated; expo-haptics works on Android —
  flip to always-on if parity wanted (taste call).
- `hooks/useAnnouncement.ts:37,63`: `min_build` compares against `nativeBuildVersion`, but iOS
  build numbers and Android versionCode are independent counters that diverge immediately.
  Either add `min_build_android` (or a platform column) to `announcements`, or manually align
  Android versionCode. Small, but silently wrong if forgotten.

## Store + QA workstream

- **Play Console:** account (one-time $25), app listing (reuse App Store copy/screenshots at
  Android sizes), content rating questionnaire, **Data Safety form** (map from the Apple
  privacy answers), target-API compliance (SDK 54 targets current API — fine).
- **Review realities:** Play review is usually faster than Apple, but new developer accounts
  face a 12-tester/14-day closed-testing requirement before production access — check whether
  the account qualifies; this is the single biggest calendar-time risk for a new account.
- **Device QA (the real tail):** keyboard behavior on the comment overlay + create screen
  (adjustResize vs the iOS padding paths), HD save-to-gallery on Android 11/13/14
  (scoped storage), camera/photo permissions flow, share sheet, notch/punch-hole + soft-nav
  safe areas (edge-to-edge is enabled — verify bottom insets on gesture-nav and 3-button-nav),
  push channel sound, App Links verification, RevenueCat sandbox purchases with license
  testers, low-end device performance on the feed pager (reanimated is fine, but verify the
  morph overlays at 60fps on a mid-range device).

## Suggested sequencing

1. **Day 1-2 — accounts + first build:** Play Console account (start the closed-testing clock
   if new), Firebase project + google-services.json, EAS android profiles, first internal AAB.
2. **Day 3-4 — auth + push:** Google web/Android OAuth clients + webClientId code change +
   Supabase authorized ids; Meta Android platform + key hashes; FCM creds in EAS; notification
   channel code. Verify all three logins + a push on a physical device.
3. **Day 5-6 — payments:** RevenueCat Android app + key, Play products/subscriptions (build
   already uploaded, so IAP creation unblocks), service account + RTDN, webhook refund branch +
   redeploy, sandbox purchase QA.
4. **Day 7 — links + copy:** App Links intent filters + assetlinks.json (website repo), the
   four copy fixes, min_build decision.
5. **Day 8-12 — QA + listing:** device matrix QA, Data Safety + listing, closed testing track,
   then production rollout (staged %).

## What deliberately does NOT change

Supabase (auth exchange, RLS, edge functions, queue, bots), the dream engine, RevenueCat
webhook architecture (beyond the refund branch), send-push, the website deep-link share pages
(plus one static assetlinks.json), analytics/crash wiring, and the entire UI component layer.
