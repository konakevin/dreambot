# DreamBot — Launch Checklist (single source of truth)

> The one doc for shipping DreamBot to the iOS App Store. Consolidated 2026-05-28
> from the old `SHIP_IT.md` + `APP_STORE_CHECKLIST.md` (both deleted; they had
> drifted out of sync — e.g. wrong EAS project id, "7-step" onboarding, and
> SightEngine references from the removed image-moderation vendor). The old
> `docs/ROADMAP.md` (Rad-or-Bad swipe-app feature ideas) was deleted as obsolete.
>
> **Keep this doc current** — check items off as they land, and fix any value that
> drifts. Quick-reference values below are verified against the repo.

App: **DreamBot** — personalized AI dream-image generator with a social feed,
user-generated + AI content, face-swap (Dream Cast), and in-app purchases.

---

## Status at a glance

The **app code is essentially submission-ready.** The bulk of remaining work is
**App Store Connect configuration, IAP/RevenueCat setup, store assets, EAS env
vars, and the build → TestFlight → submit mechanics** — not app code.

The two things that still touch the build: confirm production **EAS env vars**
(incl. the analytics/crash keys) and the **`eas.json` submit credentials**.

---

## 1. Code & native config

### Done (verified in repo)

- [x] Sign in with Apple (+ Google + Facebook) — `lib/appleAuth.ts`, `app/(auth)/`
- [x] In-app account deletion — Settings → Delete account → `delete_own_account` RPC
- [x] Report content + users — `hooks/useReport.ts`, `reports` table
- [x] Block users — `hooks/useBlockUser.ts`, `block_user` RPC, Settings → Blocked users
- [x] Text moderation — `lib/moderation.ts` wordlist (images rely on Flux's NSFW
      filter; the old SightEngine vendor was removed)
- [x] IAP: sparkle packs + Pro subscription via RevenueCat + **Restore Purchases**
- [x] Push notifications — `expo-notifications`, `push_tokens`, DB-trigger →
      `send-push`; **APNs configured + delivering end-to-end (verified 2026-05-27)**
- [x] Camera + Photo Library permission strings (`app.config.js` infoPlist + plugins)
- [x] Privacy manifest — `PrivacyInfo.xcprivacy` present
- [x] App icon (1024) + splash
- [x] Terms/Privacy disclosure on auth screen + **tappable links** + links in Settings
- [x] `ITSAppUsesNonExemptEncryption: false` — skips the export-compliance prompt
- [x] Removed unused **Face ID** + **Microphone** permissions (were auto-injected)
- [x] Privacy + Terms pages live — `https://dreambotapp.com/privacy` + `/terms`
- [x] Crash reporting (Sentry) wired — `lib/sentry.ts` (gated; see §9)
- [x] Product analytics (PostHog) wired — `lib/posthog.ts` (gated; admins opted out; see §9)

### Remaining

- [ ] **Support URL or email** for the ASC listing (e.g. `https://dreambotapp.com/support`
      or `support@dreambotapp.com`) — Apple requires a contact path.
- [ ] Confirm the **Facebook client token** ships via env (`EXPO_PUBLIC_FB_CLIENT_TOKEN`)
      rather than a literal in `app.config.js`.

---

## 2. Apple Developer + App Store Connect account

- [ ] Apple Developer Program membership active ($99/yr).
- [ ] Create the app record in [App Store Connect](https://appstoreconnect.apple.com):
  - Bundle ID: **`com.konakevin.radorbad`** (legacy from the Rad-or-Bad era — **kept**;
    cannot change after first submission. See `BUNDLE_ID_MIGRATION.md` for history.)
  - Name: **DreamBot** · Category: **Photo & Video** or **Entertainment**
  - Primary language: English (U.S.) · SKU
- [ ] Confirm signing — let EAS manage credentials (recommended), or set up the
      distribution cert + provisioning profile manually.

---

## 3. In-app purchases + RevenueCat

- [ ] Create the IAP products in ASC matching `constants/sparklePacks.ts`
      (prefix `com.konakevin.radorbad.sparkles.*`) — all sparkle packs.
- [ ] Create the **Pro subscription** products (monthly + yearly) — see `constants/proPlan.ts`.
- [ ] Fill IAP metadata (display name, description, screenshot) — required for review.
- [ ] **Submit the IAPs with the first app version** (Apple won't review the first IAP
      without an accompanying binary).
- [ ] RevenueCat: map Offerings → products (Pro offering id is **`pro`**, per
      `lib/revenuecat.ts`), set the **App Store shared secret**, confirm the
      `revenuecat-webhook` Edge Function URL is configured + live, and that
      `REVENUECAT_WEBHOOK_SECRET` matches the Supabase edge secret.
- [ ] Sandbox-test a purchase **and Restore Purchases** on a real device (TestFlight).

---

## 4. App Store Connect listing

- [ ] **Description / subtitle / keywords** — written fresh for DreamBot (AI dream
      generator + social feed). Do NOT reuse old "Rad or Bad" copy.
- [ ] **Screenshots** — min 3 at **6.7" (1290×2796)** of real DreamBot screens
      (onboarding vibe profile, a generated dream, the feed, create modes, profile).
      Recommended 6–8; 6.1" optional.
- [ ] **Age rating** — expect **17+** (user-generated content + AI image generation +
      face-swap of personal photos).
- [ ] **App Privacy "nutrition label"** — disclose data collected: account/email,
      photos, usage/analytics (PostHog), purchases, push token, crash data (Sentry).
- [ ] **Privacy Policy URL** (live) + **Support URL** (from §1).
- [ ] **Content rights** answer — content is user-generated / AI-generated.
- [ ] **Demo account in App Review notes** — the app is login-gated, so provide working
      test credentials + note IAP behavior, or it gets auto-rejected.

---

## 5. Web properties (dreambotapp.com)

- [x] **Privacy Policy** + **Terms** pages live (verified) — real content.
- [ ] **Support page / email** (also tracked in §1) — required for the listing.
- [ ] **Apple App Site Association** for universal links (the app declares
      `applinks:dreambotapp.com`). Host `https://dreambotapp.com/.well-known/apple-app-site-association`,
      served as `application/json` with **no redirect**:
  ```json
  {
    "applinks": {
      "apps": [],
      "details": [
        { "appID": "TEAM_ID.com.konakevin.radorbad", "paths": ["/post/*", "/user/*"] }
      ]
    }
  }
  ```
  Replace `TEAM_ID` with your Apple Developer Team ID. (Skip only if you're not
  shipping universal links in v1 — the custom `dreambot://` scheme works regardless.)

---

## 6. Build, upload, TestFlight

- [ ] **EAS production env vars** set at [expo.dev](https://expo.dev) → project → Environment Variables:
  - `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`
  - `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID`, `EXPO_PUBLIC_FB_CLIENT_TOKEN`
  - `EXPO_PUBLIC_POSTHOG_KEY` (analytics is a no-op without it — see §9)
  - `EXPO_PUBLIC_SENTRY_DSN` (crash reporting is a no-op without it — see §9)
  - `EXPO_PUBLIC_APP_ENV=production` (tags analytics/crash events as production)
  - Sentry source-map upload secrets for `production`: `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN`
- [ ] Verify Supabase edge secrets: `REPLICATE_API_TOKEN`, `ANTHROPIC_API_KEY`,
      `REVENUECAT_WEBHOOK_SECRET`, `DREAM_QUEUE_WORKER_TOKEN` (`supabase secrets list`).
- [ ] APNs key uploaded to Expo/EAS (done — push verified 2026-05-27; re-confirm for prod).
- [ ] `eas.json` → `submit.production` is currently `{}` — add Apple submit credentials
      for `eas submit`, or plan to upload via Xcode/Transporter.
- [ ] Build: `eas build --platform ios --profile production` (`autoIncrement` bumps the
      build number).
- [ ] Upload to ASC; wait for processing (~15–30 min).
- [ ] **TestFlight pass on a real device FIRST** — don't skip:
  - Sign up via each provider (email + Apple + Google + Facebook)
  - Full onboarding (vibe profile → first-dream banger)
  - Generate a dream (prompt / photo restyle / Dream Cast face-swap)
  - Post, like, comment, share, save, follow, friend request
  - Nightly dream + bot message (trigger or wait)
  - Push: token registers, notification arrives + deep-links correctly
  - IAP in Sandbox: buy each pack, balance updates, webhook → `grant_sparkles`;
    Pro subscribe + **Restore Purchases**; "not enough sparkles" flow
  - Deep links: `dreambotapp.com/post/{id}` (needs AASA) + `dreambot://photo/{id}`
  - Edge cases: offline, 0 sparkles, kill-app-mid-render (no stuck state), blocked prompt

---

## 7. Submit for review

- [ ] Attach the processed build to the version; all metadata/screenshots/IAPs/privacy complete.
- [ ] Export compliance — already handled by `ITSAppUsesNonExemptEncryption: false`.
- [ ] App Review notes: demo account creds, that AI content is personalized to user taste,
      consumable-sparkle IAP behavior, and the moderation approach (§8).
- [ ] Submit. First-review turnaround typically 24–48h.

---

## 8. Known review-risk areas (be ready to respond)

- **AI face-swap (Dream Cast)** — the most likely probe. Terms must state users may only
  upload photos they have rights to; report/block + 17+ rating cover misuse.
- **Image moderation** relies on Flux's built-in NSFW filter (no 3rd-party image scan),
  plus the text wordlist + report/block flow. Be ready to explain this (Guideline 1.2).
- **Common first rejections:** missing/broken demo account, screenshots not matching the
  app, unclear UGC moderation policy → fix + resubmit (~24h).

---

## 9. Observability + post-launch

Wiring is in the repo; both client SDKs are **gated and no-op until their keys are set
in EAS** (see §6) and only active in release builds (`!__DEV__`). Full picture:
`memory/project_observability_setup.md`.

- **Crash reporting — Sentry** (`lib/sentry.ts`): set `EXPO_PUBLIC_SENTRY_DSN`; prod
  EAS build uploads source maps (org/project/token secrets) for symbolicated traces.
- **Product analytics — PostHog** (`lib/posthog.ts`): set `EXPO_PUBLIC_POSTHOG_KEY`;
  events tagged with `APP_ENV`. **Admin users are opted out** so internal testing
  doesn't pollute reports. Event taxonomy: `ANALYTICS_PLAN.md`.
- **Fail-loud cron monitors** (GitHub Actions → failure email): `dream-queue-monitor`
  (hourly), `ai-failure-monitor` (6h), `push-failure-monitor`, upscale smoke-test.
- After launch: watch ASC reviews, Supabase Edge logs, RevenueCat dashboard, and the
  monitors above; plan v1.1 from real feedback.

---

## Quick reference (verified against repo 2026-05-28)

| Item | Value | Source |
|------|-------|--------|
| Bundle ID (iOS + Android) | `com.konakevin.radorbad` | `app.config.js` |
| Version | `1.0.0` | `app.config.js` |
| EAS Project ID | `014926a1-297b-4abf-9184-a01979a83879` | `app.config.js` |
| App scheme | `dreambot://` | `app.config.js` |
| Associated domain | `applinks:dreambotapp.com` | `app.config.js` |
| RevenueCat iOS key | `appl_gDwFXEmOsQLWUTUndcldpmruekW` | `lib/revenuecat.ts` |
| RevenueCat Pro offering | `pro` | `lib/revenuecat.ts` |
| Sparkle IAP prefix | `com.konakevin.radorbad.sparkles.*` | `constants/sparklePacks.ts` |
| Supabase project | `jimftynwrinwenonjrlj` | `CLAUDE.md` |

**Related setup docs:** `SPARKLE_PAYMENTS_SETUP.md`, `PRO_SUBSCRIPTION_SETUP.md`,
`AUTH_PROVIDERS.md`, `BUNDLE_ID_MIGRATION.md`, `ANALYTICS_PLAN.md`.
