# DreamBot — App Store Listing (copy-paste into App Store Connect)

Draft listing copy, App Review notes, privacy-label answers, and the EAS env-var
checklist for submission. Edit to taste. Char limits noted — verify in ASC, which
counts exactly. Companion to `LAUNCH.md` (the master checklist).

---

## Listing fields

**App Name** (30 chars)
```
DreamBot
```

**Subtitle** (30 chars) — final
```
Dream it. Make it. Explore it.
```

**Promotional text** (170 chars — editable anytime without review) — final
```
Your personal AI dream machine 🌙 turn any idea into stunning art, wake to a new dream starring you each night, and explore a gallery of bots dreaming nonstop. ✨
```

**Keywords** (100 chars, comma-separated, NO spaces — single words; Apple auto-combines; don't repeat the app name/subtitle) — final
```
ai,art,image,generator,photo,avatar,selfie,wallpaper,anime,portrait,aesthetic,fantasy,maker,creator
```

**Description** (817 chars; limit 4,000 — first ~3 lines show above the "more" fold) — final
```
DreamBot is a little dream machine — three ways to play.

🌙 DREAMS MADE FOR YOU
Tell DreamBot what you love, and every night it dreams up a brand-new piece of AI art just for you — with you (and a +1) cast right into the scene. Wake up to something new, every morning.

🎨 A FULL AI ART STUDIO
Dream up anything, anytime. Describe a scene, pick from dozens of art styles, restyle your own photos, or drop yourself into a whole new world. Your imagination, rendered in seconds.

🖼️ A GALLERY THAT NEVER SLEEPS
Explore an endless feed of original AI art from DreamBot's cast of dreaming bots — each with its own world and style — plus dreams from people like you. Like, follow, share, and get inspired.

Sparkles power your creations. DreamBot Pro unlocks HQ downloads + a guaranteed dream every night.

Sweet dreams. ✨
```

**Category:** Photo & Video (primary) — or Entertainment
**Age Rating:** 17+ (user-generated content + AI image generation + face-swap of personal photos)
**Support URL:** https://dreambotapp.com/support
**Privacy Policy URL:** https://dreambotapp.com/privacy
**Copyright:** 2026 Kevin McHenry

---

## App Review notes (paste into "Notes" for the reviewer)

```
DEMO ACCOUNT (please use this to review. The app requires sign in.):
  Email: apptester@dreambotapp.com
  Password: l3tm3!nn2026DR34MB0T

ABOUT THE APP
- DreamBot creates personalized art from a "Vibe Profile" the user sets up during
  onboarding. This demo account is already set up with locations and Dream Cast
  photos, so you can generate art right away from the Create tab, including a
  Dream Cast face swap. You will still see a few short feature tips the first time
  you open the Feed and Create tabs. That is normal.
- In-app purchases. "Sparkles" are a consumable currency that powers art
  generation, at one sparkle per image. This account already has sparkles loaded.
  "DreamBot Pro" is an auto-renewing subscription for high quality downloads and a
  nightly image. This account already has Pro turned on, so you can review the Pro
  features without buying anything. You can still test the purchase and Restore
  Purchases flows in the StoreKit sandbox.
- Dream Cast face swap. Users can upload photos of themselves to place their
  likeness into generated art. Our terms require users to only upload photos they
  have the rights to.

CONTENT MODERATION
- Image generation runs through providers that have built-in NSFW safety filters.
- Text that users enter (usernames, captions, comments, prompts) is screened by an
  automated word filter.
- Any post, comment, or user can be reported. Users can block other users.
  Violating content is removed. The app also has an in-app account deletion flow.
```

---

## App Privacy "nutrition label" answers (ASC → App Privacy)

Data collected (all **linked to the user's identity**; **NOT used for tracking**
across other apps/companies — DreamBot shows no ATT prompt):

| Category | Data | Purpose |
|----------|------|---------|
| Contact Info | Email | Account, auth |
| User Content | Photos uploaded (Dream Cast + reimagine), generated images, captions, comments | App functionality |
| Identifiers | User ID | App functionality |
| Usage Data | Product interactions (screens, taps, features) | Analytics (PostHog) |
| Diagnostics | Crash + error data | App functionality (Sentry) |
| Purchases | Purchase history | App functionality (via Apple/RevenueCat) |
| Other | Push notification token | Notifications |

- **Tracking:** No. Data is first-party, not shared with data brokers/advertisers.
- Mirror this with `https://dreambotapp.com/privacy` (already live + consistent).

---

## EAS production env vars (set in expo.dev → project → Environment Variables, "production")

⚠️ **REQUIRED — the app breaks without these** (read with `!` in `lib/supabase.ts`,
and NOT present in `eas.json` env blocks, so they must be set in the dashboard):
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID`

Already referenced in `eas.json` (set the values in EAS):
- `FACEBOOK_APP_ID`, `FACEBOOK_CLIENT_TOKEN`
- `EXPO_PUBLIC_SENTRY_DSN` — without it, crash reporting is a no-op
- `EXPO_PUBLIC_POSTHOG_KEY` — without it, analytics is a no-op
- `EXPO_PUBLIC_APP_ENV` — already hard-set to `production` in the production profile

Sentry source-map upload (so production traces are symbolicated) — set as EAS secrets:
- `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN`

---

## `eas submit` credentials (`eas.json` → `submit.production.ios`)

Scaffolded with the real `appleTeamId` (`43VMZ5KMW4`). To finish, EITHER:
- **Option A (recommended):** run `eas submit -p ios --profile production` and let
  EAS prompt for + store your App Store Connect API key (no file in the repo), or
- **Option B:** download the ASC API key (App Store Connect → Users and Access →
  Integrations → App Store Connect API → generate a key), drop the `.p8` at
  `secrets/asc-api-key.p8` (gitignored via `*.p8`), and replace `REPLACE_ASC_API_KEY_ID`
  + `REPLACE_ASC_API_KEY_ISSUER_ID` in `eas.json`.
- `ascAppId` (the numeric App Store app ID) can also go here once the app record exists.
```

---

## App Store Connect submission walkthrough (step-by-step)

Do these in App Store Connect (appstoreconnect.apple.com → Apps → **DreamBot**).
Order below is the sensible sequence. Screenshots should wait until the UI is
visually final; everything else can be filled anytime.

### 1. App Information (app-level — left sidebar → "App Information")
- **Name:** DreamBot · **Subtitle:** see listing fields above
- **Category:** Primary = Photo & Video (or Entertainment); Secondary optional
- **Content Rights:** "Does it contain third-party content?" → No (content is
  user-generated / AI-generated, no licensed third-party media)
- **Age Rating → Edit:** complete the questionnaire honestly. UGC + AI-generated
  imagery + user photo upload → lands at the **17+ tier** (Apple's newer system may
  label it 16+/18+ — pick the highest the questionnaire produces; don't fight it).

### 2. App Privacy (left sidebar → "App Privacy" → Get Started)
- Use the **nutrition-label table above**. For each data type mark it Collected,
  **Linked to the user**, and **NOT used for tracking**.
- Types: Email; Photos/User Content; User ID; Usage Data (analytics); Diagnostics
  (crash); Purchases; Push token. Tracking = **No** (no ATT prompt).
- Must match the live privacy policy (it does).

### 3. Version page (the "1.0 Prepare for Submission" section)
- **Promotional Text · Description · Keywords** — paste from "Listing fields" above
- **Support URL:** https://dreambotapp.com/support
- **Copyright:** 2026 Kevin McHenry

### 4. Screenshots (Version page → "App Previews and Screenshots")
- **6.7" Display** is required: **1290 × 2796 px**, min 3 (up to 10).
- Easiest exact-size capture: run the app in the **iOS Simulator → iPhone 16 Pro Max**,
  then File → Save Screen (or ⌘S) — produces exact 1290×2796. (Real-device screenshots
  from a non-Pro-Max phone are the wrong size.)
- Suggested shots: onboarding Vibe Profile · a full-screen generated dream · the feed ·
  a Create mode · profile.

### 5. In-App Purchases + subscriptions (left sidebar → Monetization → In-App Purchases / Subscriptions)
- Products already exist. For EACH (5 sparkle packs + Pro monthly/yearly):
  - Fill **Display Name** + **Description**
  - Upload a **review screenshot** (a shot of the in-app store screen showing it —
    the Sparkle Store / Pro screen works for all)
  - Confirm price tier
- ⚠️ First submission: the IAPs must be **attached to the app version** so they're
  reviewed together — on the version page there's an "In-App Purchases" section to add them.

### 6. App Review Information (Version page → scroll to "App Review Information")
- **Sign-In required:** Yes → enter the **demo account** email + password (create a
  real account first, finish onboarding, preload sparkles).
- **Notes:** paste the "App Review notes" block above (demo creds + moderation explanation).

### 7. Build + Submit (Version page → "Build" section)
- Click **+** / Select the processed TestFlight build (app ID 6761505205).
- **Export compliance:** auto-handled (`ITSAppUsesNonExemptEncryption: false`) — no prompt.
- Verify every section shows a green check, then **Add for Review → Submit for Review**.
- ⏳ Review is typically 24–48h. ⚠️ Only do this when the app is actually code-complete.
