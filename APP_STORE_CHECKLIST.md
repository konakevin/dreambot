# DreamBot — App Store Submission Checklist

> Path to a submittable build for the iOS App Store. App: **DreamBot** — AI dream
> image generator with a social feed, user-generated content, and in-app purchases.
> Bundle ID `com.konakevin.radorbad` · version `1.0.0` · EAS project
> `014926a1-297b-4abf-9184-a01979a83879`.
>
> (Replaced the old "Rad or Bad" checklist on 2026-05-26 — that described a
> different app and cited SightEngine moderation that's since been removed.)

---

## Status at a glance

The **app code is essentially submission-ready.** The remaining work is mostly
**App Store Connect configuration, IAP product setup, assets, and the build/submit
mechanics** — not code.

---

## 1. Code & native config

Already done (verified in repo):

- [x] Sign in with Apple (+ Google + Facebook) — `lib/appleAuth.ts`, `app/(auth)/`
- [x] In-app account deletion — Settings → Delete account → `delete_own_account` RPC
- [x] Report content + users — `hooks/useReport.ts`, `reports` table
- [x] Block users — `hooks/useBlockUser.ts`, `block_user` RPC, Settings → Blocked users
- [x] Text moderation — `lib/moderation.ts` wordlist (images rely on Flux's NSFW filter; SightEngine removed)
- [x] IAP: sparkle packs + Pro subscription via RevenueCat + **Restore Purchases** on both stores
- [x] Push notifications — `expo-notifications`, `push_tokens`, `send-push`
- [x] Camera + Photo Library permission strings (`app.config.js` infoPlist + plugins)
- [x] Privacy manifest — `PrivacyInfo.xcprivacy` present
- [x] App icon (1024) + splash
- [x] Terms/Privacy disclosure on auth screen + links in Settings
- [x] **(2026-05-26)** `ITSAppUsesNonExemptEncryption: false` — skips export-compliance prompt
- [x] **(2026-05-26)** Removed unused Face ID permission (`expo-secure-store faceIDPermission:false`)
- [x] **(2026-05-26)** Made auth-screen Terms/Privacy tappable links

- [x] **(2026-05-26)** Removed unused Microphone permission — `expo-camera` (autolinked)
      was injecting `NSMicrophoneUsageDescription`; configured `microphonePermission:false`.
      Verified the resolved Info.plist via `expo config --type introspect` (no mic/FaceID
      keys, camera string preserved).
- [x] **(2026-05-26)** Privacy + Terms pages verified live —
      `https://dreambotapp.com/privacy` + `/terms` (real content, updated 2026-04-06).

Remaining code/verification items:

- [ ] **Set up a support URL or support email** (e.g. a support page on dreambotapp.com
      or `support@…`) — required for the App Store Connect listing.

---

## 2. Apple Developer + App Store Connect account

- [ ] Apple Developer Program membership active ($99/yr).
- [ ] Create the app record in [App Store Connect](https://appstoreconnect.apple.com):
  - Bundle ID: `com.konakevin.radorbad`
  - Name: **DreamBot** · Category: **Photo & Video** or **Entertainment** (pick fit)
  - Primary language, SKU
- [ ] Confirm signing — let EAS manage credentials, or set up distribution cert + provisioning profile.

---

## 3. In-app purchases + RevenueCat

- [ ] Create the IAP products in App Store Connect matching `constants/sparklePacks.ts`
      (prefix `com.konakevin.radorbad.sparkles.*`) — all sparkle packs.
- [ ] Create the Pro subscription products (monthly + yearly) — see `constants/proPlan.ts`.
- [ ] Fill IAP metadata (display name, description, screenshot) — required for review.
- [ ] **Submit the IAPs with the first app version** (Apple requires the first IAP to
      accompany a binary or it won't review).
- [ ] RevenueCat: map Offerings → these products, set the **App Store shared secret**,
      confirm the `revenuecat-webhook` Edge Function URL is configured + live.
- [ ] Sandbox-test a purchase + **Restore Purchases** on a real device (TestFlight).

---

## 4. App Store Connect listing

- [ ] **Description / subtitle / keywords** — written fresh for DreamBot (AI dream
      image generator + social feed). Do NOT reuse the old "Rad or Bad" copy.
- [ ] **Screenshots** — min 3 at **6.7" (1290×2796)** of DreamBot's real screens
      (onboarding vibe profile, a generated dream, the feed, create modes, profile).
- [ ] **Age rating** questionnaire — expect **17+** (user-generated content + AI image
      generation + face-swap of personal photos).
- [ ] **App Privacy "nutrition label"** — disclose data collected (account/email,
      photos, usage, purchases, push token).
- [ ] **Privacy Policy URL** + **Support URL** (from §1).
- [ ] **Content rights** answer — content is user-generated / AI-generated.
- [ ] **Demo account in App Review notes** — the app is login-gated, so provide working
      test credentials (and note any IAP behavior) or it gets auto-rejected.

---

## 5. Build, upload, TestFlight

- [ ] APNs key uploaded to Expo/EAS so production push works (you use Expo Push + `send-push`).
- [ ] `eas.json` → `submit.production` is currently empty `{}` — add Apple submit
      credentials for `eas submit`, or plan to upload via Xcode/Transporter.
- [ ] Production build: `eas build --platform ios --profile production`
      (`autoIncrement` is on, so build number bumps automatically).
- [ ] Upload to App Store Connect; wait for processing (~15–30 min).
- [ ] **TestFlight pass first** — verify on a real device: push notifications, IAP
      (sandbox), face-swap/cast flow, account deletion, login providers. Don't skip this.

---

## 6. Submit for review

- [ ] Attach the processed build to the app version.
- [ ] All metadata + screenshots + IAPs + privacy answers complete.
- [ ] Export compliance — already handled by `ITSAppUsesNonExemptEncryption: false`.
- [ ] Submit. First-review turnaround is typically 24–48h.

---

## 7. Known review-risk areas (be ready to respond)

- **AI face-swap (Dream Cast):** the most likely area Apple probes. Your terms page
  should state users may only upload photos they have rights to, and the
  report/block + 17+ rating cover objectionable use.
- **Image moderation** now relies on Flux's built-in NSFW filter (no human/3rd-party
  image scan). Combined with the report/block flow + text wordlist this is generally
  acceptable, but be prepared to explain the moderation approach if asked (Guideline 1.2).
- **Common first rejections:** missing demo account, screenshots not matching the app,
  or unclear UGC moderation policy → fix and resubmit (~24h turnaround).
