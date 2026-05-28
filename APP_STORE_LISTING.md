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

**Subtitle** (30 chars)
```
AI dreams made just for you
```

**Promotional text** (170 chars — editable anytime without review)
```
Build your Vibe Profile and DreamBot dreams up personalized AI art — every night, automatically. Remix your photos, cast yourself into the scene, and share to the feed.
```

**Keywords** (100 chars, comma-separated, NO spaces after commas — don't repeat the app name)
```
ai art,ai image generator,dream,ai photo,art styles,anime,fantasy,avatar maker,creative,personalized
```

**Description**
```
DreamBot turns your taste into art. Tell it what you love — art styles, aesthetics, moods, the places and things that feel like you — and it dreams up stunning, personalized AI images made just for you.

PERSONALIZED AI DREAMS
Build your Vibe Profile once, and every dream is tailored to you. Pick from a huge range of art styles — oil painting, anime, watercolor, neon, pixel art, claymation, and many more.

A NEW DREAM EVERY NIGHT
DreamBot quietly creates a fresh dream for you each night, with a little message about it. Wake up to something new.

MANY WAYS TO CREATE
- Dream Me, Chaos, Cinematic, Nature, Character, and more creation modes
- Reimagine your own photos in any art style
- Dream Cast: place yourself (and a plus-one) into your dreams
- Write your own prompt, or riff on a dream you love

A FEED THAT'S ACTUALLY FUN
Share your dreams, follow friends, like and comment, and discover a constant stream of imaginative art from the community.

DreamBot Pro unlocks HQ downloads and a guaranteed dream every night. Sparkles power your creations.

Sweet dreams.
```

**Category:** Photo & Video (primary) — or Entertainment
**Age Rating:** 17+ (user-generated content + AI image generation + face-swap of personal photos)
**Support URL:** https://dreambotapp.com/support
**Privacy Policy URL:** https://dreambotapp.com/privacy
**Copyright:** 2026 Kevin McHenry

---

## App Review notes (paste into "Notes" for the reviewer)

```
DEMO ACCOUNT (please use to review — the app is login-gated):
  Email: <CREATE A DEMO ACCOUNT AND PUT CREDENTIALS HERE>
  Password: <...>

ABOUT THE APP
- DreamBot generates personalized AI art from a "Vibe Profile" the user builds in
  onboarding. The demo account is pre-onboarded so you can generate immediately
  from the Create tab.
- IN-APP PURCHASES: "Sparkles" are a consumable currency that powers dream
  generation (1 sparkle per dream). The demo account has sparkles preloaded.
  "DreamBot Pro" is an auto-renewing subscription for HQ downloads + a nightly dream.
- DREAM CAST (face-swap): users may upload photos of themselves to place their
  likeness into generated art. Our terms require users to only upload photos they
  have the rights to.

CONTENT MODERATION
- AI image generation runs through providers with built-in NSFW safety filters.
- User-submitted text (usernames, captions, comments, prompts) is screened by an
  automated word filter.
- Every post, comment, and user can be reported; users can block other users;
  violating content is removed. There is an in-app account deletion flow.
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
