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

- [x] **Support email** — `support@dreambotapp.com` (ImprovMX free forwarding → Gmail;
      MX + SPF live in Wix DNS, verified 2026-05-28). Sending-as is paid on ImprovMX;
      reply from Gmail for now, or switch to Zoho free later if you want a real mailbox.
- [x] **Support URL (webpage)** — `https://dreambotapp.com/support` shipped in the
      `dreambot-web` repo (Next.js → Vercel), contact email + quick self-serve answers.
- [x] **Facebook client token** is env-driven — `app.config.js` reads
      `process.env.FACEBOOK_CLIENT_TOKEN` (not a literal). Just ensure that env var
      is set in EAS production (see §6).

---

## 2. Apple Developer + App Store Connect account

- [x] Apple Developer Program membership active (confirmed 2026-05-28).
- [x] App record created in App Store Connect (bundle `com.konakevin.radorbad`,
      name DreamBot). Confirmed 2026-05-28.
- [x] Signing — EAS manages the distribution credentials (set up automatically during
      the successful production build 2026-05-28).

---

## 3. In-app purchases + RevenueCat

- [x] IAP code complete — RevenueCat fully integrated (`lib/revenuecat.ts`:
      configure-on-login, offerings, `purchasePackage`, `restorePurchases`, customer
      info, Pro entitlement); **Restore Purchases** in `proStore` + `sparkleStore`;
      product IDs defined (`constants/sparklePacks.ts` + `constants/proPlan.ts`).
- [x] Sparkle IAP products created in ASC (15/40/90/200/500_v2). Confirmed 2026-05-28.
- [x] Pro subscription products created in ASC (monthly + yearly). Confirmed 2026-05-28.
- [x] RevenueCat dashboard: offerings/entitlement (`pro`) mapped + **App Store shared
      secret** set (confirmed 2026-05-28); webhook → Supabase Edge Function (confirmed).
- [x] Per-IAP metadata + **review screenshots** added to all packs + subscriptions (2026-05-28).
- [ ] **Submit the IAPs with the first app version** (Apple won't review the first IAP
      without an accompanying binary).
- [x] Sandbox-tested purchase + Restore Purchases on-device via TestFlight (2026-05-28) — IAP working.

---

## 4. App Store Connect listing

- [x] **Description / subtitle / keywords** entered in ASC (2026-05-28). Final copy in
      `APP_STORE_LISTING.md` (subtitle "Dream it. Make it. Explore it.", 3-pillar description).
- [ ] **Screenshots** — min 3 at **6.7" (1290×2796)** of real DreamBot screens
      (onboarding vibe profile, a generated dream, the feed, create modes, profile).
      Recommended 6–8; 6.1" optional.
- [x] **Age rating** completed in ASC (2026-05-28) — 17+ tier.
- [x] **App Privacy "nutrition label"** filled in ASC (2026-05-28) — 10 data types,
      all App-Functionality/Analytics + linked to identity, matches the privacy policy.
      ⚠️ Confirm the **Tracking** answer is "No" (no ATT prompt in the app, so a
      tracking=yes label would be an auto-reject).
- [x] **Privacy Policy + Support URLs** entered in ASC (both live). 2026-05-28.
- [x] **Content rights** answered — user-generated / AI-generated. 2026-05-28.
- [x] **Demo account in App Review notes** (2026-06-18) — `apptester@dreambotapp.com`
      created + pre-onboarded (4 locations + male/female Dream Cast), 500 sparkles,
      1-year Pro, follows all bots. Credentials + moderation explanation are filled
      into the review-notes block in `APP_STORE_LISTING.md`, ready to paste into ASC.

---

## 5. Web properties (dreambotapp.com)

- [x] **Privacy Policy** + **Terms** pages live (verified) — real content.
- [x] **Support email** live — `support@dreambotapp.com` → Gmail (ImprovMX, see §1).
- [x] **Support page** live — `https://dreambotapp.com/support` (in the `dreambot-web`
      Next.js repo, served by Vercel).
- [x] **Apple App Site Association** for universal links — already live at
      `https://dreambotapp.com/.well-known/apple-app-site-association` (in `dreambot-web`:
      `public/.well-known/...` + the `application/json` header in `next.config.ts`).
      appID `43VMZ5KMW4.com.konakevin.radorbad`, paths `/post/*` + `/user/*`. Keep it in
      sync if the bundle ID or deep-link routes change.

---

## 6. Build, upload, TestFlight

- [x] **EAS production env vars** — all set (verified `eas env:list production` 2026-05-28).
      Sentry (DSN/org/project/token) + Facebook (app id/token) were already there; the
      4 missing ones were created 2026-05-28: `EXPO_PUBLIC_SUPABASE_URL`,
      `EXPO_PUBLIC_SUPABASE_ANON_KEY` (new `sb_publishable_…` key format),
      `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID`, `EXPO_PUBLIC_POSTHOG_KEY`.
      `EXPO_PUBLIC_APP_ENV` is hard-set to `production` in the eas.json production profile.
- [x] Supabase edge secrets verified set: `REPLICATE_API_TOKEN`, `ANTHROPIC_API_KEY`,
      `REVENUECAT_WEBHOOK_SECRET`, `DREAM_QUEUE_WORKER_TOKEN` (2026-05-28).
- [x] APNs configured + push verified end-to-end on-device (2026-05-27).
- [x] `eas.json` submit configured — `appleTeamId 43VMZ5KMW4`; `eas submit` generated +
      stored an App Store Connect API key (APP_MANAGER role) on 2026-05-28.
- [x] **First production build** — `eas build -p ios --profile production` succeeded
      2026-05-28 (signed `.ipa`; EAS now manages the signing credentials). App version
      source = `remote`.
- [x] **Uploaded to App Store Connect** via `eas submit` 2026-05-28 (app ID **6761505205**)
      → processing → TestFlight.
- [x] **TestFlight pass on a real device** (2026-05-28) — IAP purchase, dream
      generation, etc. confirmed working on-device. Re-run this smoke list after any
      significant change before the final submit:
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
| App Store app ID | `6761505205` | App Store Connect (created 2026-05-28) |
| Apple Team ID | `43VMZ5KMW4` | `eas.json` / AASA |
| App scheme | `dreambot://` | `app.config.js` |
| Associated domain | `applinks:dreambotapp.com` | `app.config.js` |
| RevenueCat iOS key | `appl_gDwFXEmOsQLWUTUndcldpmruekW` | `lib/revenuecat.ts` |
| RevenueCat Pro offering | `pro` | `lib/revenuecat.ts` |
| Sparkle IAP prefix | `com.konakevin.radorbad.sparkles.*` | `constants/sparklePacks.ts` |
| Supabase project | `jimftynwrinwenonjrlj` | `CLAUDE.md` |

**Related setup docs:** `SPARKLE_PAYMENTS_SETUP.md`, `PRO_SUBSCRIPTION_SETUP.md`,
`AUTH_PROVIDERS.md`, `BUNDLE_ID_MIGRATION.md`, `ANALYTICS_PLAN.md`.
