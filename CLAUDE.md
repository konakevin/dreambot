# DreamBot — Claude Code Guidelines

## Session Startup

**Before doing anything else, read this entire file.** You are a senior principal engineer on this project. Jump straight into whatever Kevin needs.

Do NOT auto-start the dev environment. Let Kevin know he can run `/dream` to spin up the dev tools.

---

## What This App Is

DreamBot is an AI-powered dream image generator for iOS. Users set up a "Vibe Profile" during onboarding (aesthetics, art styles, interests, mood sliders, personal anchors, spirit companion), and the app generates unique AI dreams personalized to their taste. Users can also fuse dreams genetically, twin dreams, set dream wishes, and share/comment/like in a social feed. Dark, high-energy aesthetic. Built for fun and delight.

**Key features:**

- Personality-driven AI image generation via a two-pass prompt engine
- 7 prompt modes (Dream Me, Chaos, Cinematic, Minimal, Nature, Character, Nostalgia)
- Photo reimagining (upload → AI transforms while keeping the subject)
- Re-dream: iteratively feed generated images back through the engine
- Genetic dream fusion (merge two users' recipes)
- Dream twinning (create variations)
- Dream wishes (request specific dream subjects)
- Nightly automatic dream generation with bot messages
- Social feed with likes, comments, shares, friend system
- Sparkle currency (in-app purchases via RevenueCat)
- Lightweight wordlist-based text moderation (no external API)

---

## Stack

- **Framework:** React Native + Expo SDK 54, Expo Router v4 (file-based routing)
- **Styling:** NativeWind v4 (Tailwind CSS) — always use className, never StyleSheet
- **State:** Zustand (client state), TanStack Query (server/async state)
- **Backend:** Supabase (Postgres, auth, storage, realtime, Edge Functions)
- **AI Image Gen:** Replicate API (Flux Dev for text-to-image, Flux Kontext Pro for photo-to-image)
- **AI Prompt Engine:** Anthropic API (Claude Haiku 4.5) — two-pass concept generator + prompt polisher
- **Moderation:** Local wordlist filter for text only (no external API). Generated images rely on Flux's built-in safety.
- **Payments:** RevenueCat (sparkle currency IAP)
- **Auth:** Supabase Auth (email/password, Google, Apple, Facebook OAuth)
- **Animations:** Reanimated 3 + Gesture Handler
- **Images:** expo-image (not react-native-fast-image)
- **Language:** TypeScript strict mode — no `any`, no `// @ts-ignore`

---

## The Vibe Engine — How Dreams Are Generated

### Vibe Profile (types/vibeProfile.ts)

Every user has a `VibeProfile` (version: 2) with:

- **aesthetics[]** — cyberpunk, cozy, liminal, dreamy, etc. (20 options, min 3)
- **art_styles[]** — anime, watercolor, 35mm, oil painting, etc. (19 options, min 2)
- **interests[]** — nature, space, fantasy, animals, etc. (20 options, min 3)
- **moods** — 4 bipolar sliders (0-1): peaceful↔chaotic, cute↔terrifying, minimal↔maximal, realistic↔surreal
- **personal_anchors** — free text: places you love, objects you love, eras you vibe with, how your dreams should feel
- **avoid[]** — things to never include (text, watermarks, etc.)
- **spirit_companion** — one of 12 creatures (fox, cat, owl, dragon, etc.)

### Two-Pass Prompt Engine (lib/vibeEngine.ts)

**Pass 1 — Concept Generator:** Haiku receives the user's vibe profile + prompt mode config + weighting rules. It invents a unique "scene angle" (creative constraint) per dream to prevent repetition. Outputs structured JSON concept with: subject, environment, lighting, camera, style, palette, twist, composition, mood.

**Pass 2 — Prompt Polisher:** Takes the concept JSON and formats it into an optimized 50-70 word Flux prompt. Comma-separated phrases, starts with art style, ends with quality terms.

**Fallbacks:** If Pass 1 fails (bad JSON), `buildFallbackConcept()` constructs mechanically from arrays. If Pass 2 fails, `buildFallbackFluxPrompt()` concatenates concept fields.

### 7 Prompt Modes (constants/promptModes.ts)

| Mode      | User/Surprise | Description                   |
| --------- | ------------- | ----------------------------- |
| Dream Me  | 70/30         | Personalized to taste         |
| Chaos     | 30/70         | Wild and unpredictable        |
| Cinematic | 70/30         | Movie poster vibes            |
| Minimal   | 80/20         | One subject, one mood         |
| Nature    | 60/40         | Pure landscape, no characters |
| Character | 70/30         | Creature or figure focus      |
| Nostalgia | 80/20         | Warm memories, golden tones   |

### Photo Reimagining

When user uploads a photo, the same two-pass engine runs with an additional constraint: "KEEP THE MAIN SUBJECT — whatever or whoever is in the photo MUST remain the focus. Reimagine everything AROUND the subject."

### Re-Dream

Users can check "Re-dream this image" to feed a generated dream back into Flux Kontext as input, creating iterative creative chains. Each re-dream gets a fresh scene angle.

### Personal Anchors

Places, objects, eras, and dream vibe are included in ~40% of dreams (randomly gated per anchor to prevent overuse). Dream vibe (the creative north star) is always included.

### Nightly User Dreams

Every night, each active user receives one personalized dream. The system uses **slotted seed templates** from the `nightly_seeds` DB table (8 pools × 100 seeds each). Three paths roll at 40/30/30:

- **Path 1 (40%):** Cast photo (face swap) + personal location/object/both
- **Path 2 (30%):** Personal location/object/both, no cast
- **Path 3 (30%):** Cast photo (face swap) in a completely random scene

The runtime maps the roll to a seed category (`nightly_char`, `nightly_char_loc`, `nightly_obj`, etc.), picks a random seed, fills `${character}/${place}/${thing}` slots with the user's actual data, then feeds to Sonnet + medium directive + vibe. Face swap pastes real photo onto the rendered character for face-swap mediums (self/+1 only, not pets).

See `BOTS.md` for the full architecture, all 8 seed pools, face swap rules, and the database table structure.

### Bot Dreams

Bots post 2x daily via GitHub Actions cron. Each bot has curated seed prompts in the `bot_seeds` DB table with `used_at` tracking and auto-regeneration. See `BOTS.md` for the complete bot training process, all 19 active image bots + 2 content bots.

### Bot Messages

Each nightly dream gets a short whimsical message from DreamBot via a dedicated Haiku call. The bot has a personality — playful, warm, a little weird. Messages reference the dream's content and occasionally recall past dreams/wishes.

### Legacy Support

Old users with Recipe (no version field) still work through `lib/recipeEngine.ts`. Migration helper exists at `lib/migrateRecipe.ts`. Both paths coexist in the Edge Function.

---

## Sparkle Economy

### Costs

- **1 sparkle** per dream (all types: Dream Me, photo, twin, re-dream, custom prompt)
- **3 sparkles** per fusion
- **Free:** nightly dreams (server-side), weekly free dream (future)
- **25 sparkles** welcome bonus on onboarding

### IAP Packs (via RevenueCat)

Product IDs centralized in `constants/sparklePacks.ts`:

- `com.konakevin.radorbad.sparkles.25` → 25 sparkles ($2.99)
- `com.konakevin.radorbad.sparkles.50` → 50 sparkles ($4.99)
- `com.konakevin.radorbad.sparkles.100__` → 100 sparkles ($7.99)
- `com.konakevin.radorbad.sparkles.500` → 500 sparkles ($24.99)

### Purchase Flow

App → RevenueCat SDK → Apple payment → RevenueCat webhook → `revenuecat-webhook` Edge Function → `grant_sparkles` RPC → balance updated → client refreshes.

**RevenueCat key:** Production iOS key (`appl_`) in `lib/revenuecat.ts`.
**Webhook secret:** `REVENUECAT_WEBHOOK_SECRET` in Supabase Edge Function secrets.

### Balance Display

Sparkle pill (tappable → sparkle store) on Dream screen pick/reveal/photo headers. "Not enough sparkles" alert with "Get Sparkles" button when balance = 0.

---

## Onboarding (8 steps)

1. **Welcome** — intro screen, "Get Started" CTA
2. **Mediums** — pick art styles (min 2) from pill grid, fetched from `dream_mediums` DB
3. **Vibes** — pick aesthetics (min 3) from pill grid, fetched from `dream_vibes` DB
4. **Mood Sliders** — 4 bipolar sliders (peaceful↔chaotic, cute↔terrifying, minimal↔maximal, realistic↔surreal)
5. **Choose Locations** — curated picker from 63 pre-built location cards. Starter packs, category filters, sticky chips. Min 3, max 10. Stored as `dream_seeds.places[]`.
6. **Choose Objects** — curated 2-column grid from 58 pre-built object cards. Starter packs, category filters. Min 3, max 10. Stored as `dream_seeds.things[]`.
7. **Dream Cast** — photo upload for self + plus_one (pet removed). Llama Vision generates descriptions. Relationship picker for +1.
8. **Reveal** — generate first dream, post it, 25 sparkle welcome, welcome notification

**Key architecture rule:** locations and objects are selected from pre-curated lists with pre-generated essence cards. No free-text input. Every selection maps to a card in the DB with 50 fusion settings (locations) or 20 fusion forms (objects). The dream engine picks randomly from the user's selections — no smart selection logic in the engine.

Profile saves on first dream generation (not just on post). Welcome notification sent from DreamBot with emojis.

---

## Architecture & File Structure

```
app/                              # Expo Router (file-based routing)
  _layout.tsx                     # Root — providers, auth init, push, realtime
  (auth)/                         # Auth screens (login, signup)
  (onboarding)/                   # 7-step vibe profile builder
  (tabs)/                         # Main app — 5 tabs
    index.tsx                     # Home feed (forYou, following, dreamers)
    top.tsx                       # Top posts grid with category pills
    upload.tsx                    # Dream generation screen (modes, custom prompts, re-dream)
    inbox.tsx                     # Notifications (comments, shares, likes, bot messages)
    profile.tsx                   # User profile + settings
  photo/[id].tsx                  # Full-screen dream detail
  user/[userId].tsx               # Other user profiles
  fusion.tsx                      # Dream fusion interface
  sparkleStore.tsx                # Sparkle shop (IAP)
  comments.tsx                    # Comment thread (legacy route)
  search.tsx                      # User search (fullscreen)
  settings.tsx                    # Account settings

components/
  DreamCard.tsx                   # Full-screen image card (double-tap, swipe, pinch)
  FullScreenFeed.tsx              # Vertical scrolling feed container
  CommentOverlay.tsx              # Inline comment pane (image slides to thumbnail)
  DreamFamilySheet.tsx            # Twin/fusion overlay (same slide-up pattern)
  DreamWishBadge.tsx              # Wish status button
  DreamWishSheet.tsx              # Wish form
  onboarding/*.tsx                # 7 onboarding step components

hooks/                            # TanStack Query hooks (58+ hooks)
store/                            # Zustand stores (auth, onboarding, feed, fusion, album)

lib/
  supabase.ts                     # Supabase client
  vibeEngine.ts                   # Two-pass concept generator + prompt polisher
  dreamApi.ts                     # Edge Function client (generateDream, generateFromVibeProfile, etc.)
  migrateRecipe.ts                # Recipe → VibeProfile converter
  recipeEngine.ts                 # LEGACY — old single-pass recipe engine
  moderation.ts                   # Local wordlist text moderation
  revenuecat.ts                   # RevenueCat IAP setup
  dreamPost.ts                    # Insert dream into uploads, pin to feed
  geneticMerge.ts                 # Genetic recipe fusion

types/
  vibeProfile.ts                  # VibeProfile, MoodAxes, PersonalAnchors, ConceptRecipe, PromptMode
  recipe.ts                       # LEGACY Recipe types
  database.ts                     # Supabase auto-generated DB types

constants/
  promptModes.ts                  # 7 prompt mode configs + tiles
  sparklePacks.ts                 # IAP product IDs (source of truth)
  onboarding.ts                   # Aesthetic, art style, interest, companion tile definitions
  theme.ts                        # Fire palette, dark backgrounds, semantic colors

supabase/
  migrations/                     # 72+ SQL migrations
  functions/
    generate-dream/index.ts       # Main dream generation (two-pass + legacy paths)
    nightly-dreams/index.ts       # Scheduled Edge Function (3am UTC)
    revenuecat-webhook/index.ts   # Purchase event handler
    moderate-content/index.ts     # Content moderation
    send-push/index.ts            # Expo Push API dispatcher
    _shared/                      # Shared types + engine for Edge Functions
      vibeProfile.ts              # Deploy copy of types/vibeProfile.ts
      vibeEngine.ts               # Deploy copy of lib/vibeEngine.ts
      recipe.ts                   # Legacy recipe types
      recipeEngine.ts             # Legacy recipe engine

scripts/
  nightly-dreams.js               # Node.js version for GitHub Actions cron
  seed.js                         # Main seed (wipes + recreates test data)
```

---

## Adding New Mediums/Styles

A "medium" is an art style (e.g., "Anime", "Gothic", "Twilight"). The `dream_mediums` DB table is the single source of truth for medium identity, but **5 places outside the DB MUST also be updated** or the photo restyle path silently breaks.

**Critical rule: `key` MUST equal `label.toLowerCase().replace(/ /g, '_')`.** Legacy mismatches caused the big rename of April 2026 — never create new ones.

### Step 1 — Insert DB row in `dream_mediums`

```sql
INSERT INTO public.dream_mediums (
  key, label, directive, flux_fragment,
  is_active, is_scene_only, is_character_only, face_swaps, nightly_skip,
  sort_order
) VALUES (
  'newmedium', 'NewMedium',                       -- key MUST match snake_case label
  '...tight ~120-150 word directive...',
  '...compact comma-separated flux phrase...',
  true, false, false, false, false, 99
);
```

**Directive rules** (all learned from real bugs):
- **Cap at ~120-150 words** — long directives dilute the user's subject and hamper Sonnet creativity.
- **Front-load identity rules** (gender preservation, no horns, no Jack Skellington bans).
- **Avoid horns/demons** as defaults — AI gravitates there. Push for varied accessories (hair, hats, masks, jewelry, tattoos, scars).
- **Avoid female-coded language** if the medium should render any gender: ban "shojo", "gowns", "veils", "delicate jewelry" — they skew Flux/Kontext feminine. Use neutral terms or split by "if male: X / if female: Y".
- **No camera/composition language** — conflicts with user photos.

**Classification flag meanings:**

| Flag | Effect |
|---|---|
| `is_scene_only` | Pure environment, no people. Cast excluded. |
| `is_character_only` | Always uses character composition path (LEGO, Claymation, Vinyl). |
| `face_swaps` | Photo path will face-swap from user's cast thumb. |
| `nightly_skip` | Re-rolled if picked in nightly cron. |

### Step 2 — `supabase/functions/_shared/photoPrompts.ts` MEDIUM_CONFIGS (CRITICAL — never skip)

**This is the most-forgotten step and causes the worst bugs.** Without an entry, the photo restyle path falls through to a generic 1-liner (`generate-dream/index.ts:~943`) that ignores the directive entirely. Result: zero gender preservation, Kontext defaults to "young woman in dress" regardless of subject. (Twilight Apr 2026.)

```typescript
newmedium: {
  model: 'kontext-max',  // 'flux-dev' only for full rebuild like LEGO
  buildPrompt: (_photo, vibe, hint) =>
    `COMPLETELY transform this photo into [style description].

CRITICAL — preserve identity: keep the person's exact face, gender, skin tone, age, and core features. Male subjects stay male with masculine features and clothing. Female subjects stay female. NEVER change their gender. NEVER put a male subject in a dress, gown, skirt, corset, or feminine bodice.

[Element-by-element transformation: skin, hair, clothing, background, lighting].

Express the mood through [DIMENSION] and [DIMENSION]:
${vibe.slice(0, 200)}${hint ? `\n${hint}` : ''}`,
},
```

**Required elements in every photo config:**
1. `COMPLETELY transform this photo into [X]` opening
2. CRITICAL identity preservation block with explicit gender lock
3. Element-by-element transformation rules (skin, hair, clothing, background, lighting)
4. Mood via "Express the mood through X and Y: [vibe]" — never just append vibe at the end
5. `Portrait 9:16`
6. Hint inclusion: `${hint ? '\n' + hint : ''}`

**After adding, grep the file for the key to confirm there are no duplicates.** Duplicate keys silently let the LATER definition win — caused Claymation to render as Sack Boy and Neon to render as cyberpunk cybernetics in Apr 2026.

### Step 3 — Path override sets (mirror in 3 files)

If the new medium needs path overrides, update ALL THREE locations to keep them in sync:

- `supabase/functions/_shared/dreamAlgorithm.ts` — `SCENE_ONLY_MEDIUMS`, `CHARACTER_MEDIUMS`, `NIGHTLY_SKIP_MEDIUMS`
- `lib/dreamAlgorithm.ts` — same three sets (must match)
- `scripts/nightly-dreams.js` — `SCENE_ONLY_SET`, `CHARACTER_SET`, `STYLIZED_MEDIUMS`

These should mirror the DB columns. (Tech debt: should read from DB at startup.)

### Step 4 — Bot config (`scripts/generate-bot-dreams.js`)

If a bot should post in this style, add the new key to that bot's `mediums` array:
```javascript
gothbot: { mediums: ['gothic', 'twilight', 'anime', 'canvas'], ... },
```

### Step 5 — Deploy

```bash
supabase functions deploy generate-dream --no-verify-jwt
```

### Verification (run after every add)

```sql
-- Should return 0 rows
SELECT key, label FROM dream_mediums
WHERE is_active = true AND key != lower(replace(label, ' ', '_'));
```

**Smoke test all 5 user paths** before declaring done:
1. Create + medium + no hint + no photo → renders a scene that showcases the medium
2. Create + medium + text prompt → renders the user's subject in this medium's style
3. Create + medium + self-reference text ("put me in...") → user appears as themselves with correct gender
4. Create + medium + photo upload (restyle) → renders YOU in the medium without gender swap
5. Create + medium + photo + prompt → reimagines using both inputs

If any path renders generic / wrong gender → you missed step 2 (photoPrompts.ts).

### What does NOT need updating (auto-derived)

- **UI tiles** — `MediumVibeSelector` queries `dream_mediums` directly via the `get_dream_mediums` RPC. New active mediums appear automatically.
- **`ArtStyle` type** — defined as `string`, no union to maintain.
- **`constants/dreamEngine.ts`** — gutted; medium data lives only in the DB.
- **`supabase/functions/_shared/dreamEngine.ts`** — gutted; only helper functions remain.
- **Tests** — iterate exported sets, pick up changes automatically.

### Edge Function Gotcha: No Optional Chaining in Top-Level Code

**NEVER use `?.` in top-level module expressions** in `supabase/functions/_shared/*.ts`. Deno Edge runtime crashes (BOOT_ERROR). Use explicit null checks instead:
```typescript
// BAD — causes BOOT_ERROR:
export const X = arr.filter(m => m.foo?.length);

// GOOD:
export const X = arr.filter(m => m.foo && m.foo.length > 0);
```

---

## 3rd Party Services

### Supabase (Backend)

- **Client:** `lib/supabase.ts`, auth tokens in Expo SecureStore
- **Env vars:** `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- **Key RPCs:** `get_feed`, `get_comments`, `spend_sparkles`, `grant_sparkles`

### Replicate (AI Image Generation)

- **Flux Dev** — text-to-image, ~$0.03/image
- **Flux Kontext Pro** — photo-to-image reimagining
- All generation goes through `generate-dream` Edge Function

### Anthropic (Prompt Engine)

- **Haiku 4.5** — concept generator (Pass 1) + prompt polisher (Pass 2) + bot messages
- ~$0.002 per dream for both passes
- All calls server-side in Edge Functions

### RevenueCat (In-App Purchases)

- Production iOS key in `lib/revenuecat.ts`
- Webhook → `revenuecat-webhook` Edge Function → `grant_sparkles` RPC
- Product IDs in `constants/sparklePacks.ts`

### Moderation (Local Wordlist)

- Text-only moderation via `lib/moderation.ts` — small wordlist of slurs
- No external API, no per-call cost
- Generated images rely on Flux Dev's built-in NSFW filters
- Used by: useAddComment, useDreamWish, settings (username), signup

---

## Database Schema (Key Tables)

### Core

- **`users`** — id, email, username, avatar_url, sparkle_balance, last_active_at
- **`uploads`** — id, user_id, image_url, ai_prompt, bot_message, from_wish, is_ai_generated, is_approved, comment_count, like_count
- **`user_recipes`** — user_id, recipe (JSONB — VibeProfile or legacy Recipe), onboarding_completed, ai_enabled, dream_wish

### Social

- **`likes`**, **`favorites`**, **`follows`**, **`friendships`**, **`comments`**, **`post_shares`**, **`blocked_users`**

### System

- **`notifications`** — recipient_id, actor_id, type, body (prefixed: dream:/wish:/welcome:)
- **`sparkle_transactions`** — user_id, amount, reason (spend/grant audit log)
- **`ai_generation_log`** — recipe_snapshot, enhanced_prompt, model_used, cost_cents
- **`ai_generation_budget`** — daily per-user generation tracking

---

## Design System

### Colors

- Background: `#0F0F1A` | Surface: `#1A1A2E` | Border: `#2D2D44`
- Accent (purple): `colors.accent` | Like (red): `colors.like`
- Text primary: `#FFFFFF` | Text secondary: `#9CA3AF`

### Key Rules

1. **Styling:** NativeWind `className` is preferred for new components, but the existing codebase uses `StyleSheet.create` extensively (53+ files) — both are acceptable. Don't bulk-migrate one to the other; match the file's existing style.
2. Never use `any` type
3. Always handle loading and error states in UI
4. Supabase queries go in TanStack Query hooks inside `hooks/`
5. Keep screens thin — logic in hooks, UI in components
6. Dark-mode only — no light theme
7. Use `expo-image` not React Native's Image

---

## GitHub & CI/CD

**Repo:** `konakevin/dreambot` on GitHub. Single `main` branch, push directly.

**CI pipeline** (`.github/workflows/ci.yml`): tsc, lint, prettier, jest on every push.

**Nightly dreams** (`.github/workflows/nightly-dreams.yml`): GitHub Actions cron at 1am MST + random delay. Secrets: `SUPABASE_SERVICE_ROLE_KEY`, `REPLICATE_API_TOKEN`, `ANTHROPIC_API_KEY`.

---

## Team

Kevin is the sole human developer. Claude is the other dev. No team, no PR process. Push directly to `main`.

---

## Pre-Commit Checklist

**A husky pre-commit hook auto-runs `npm run check` on every `git commit`.** It runs prettier → lint → tsc → jest in sequence and blocks the commit if any fails. This prevents the "green locally, red on GitHub" failure mode.

**Manual invocation:**
```bash
npm run check   # same thing the hook runs — use before pushing
npm run fix     # auto-fix prettier + lint issues
```

**Individual steps (if you need to debug one in isolation):**
```bash
npm run format:check   # prettier --check
npm run lint           # expo lint
npm run typecheck      # tsc --noEmit
npm run test           # jest
```

**To bypass the hook in an emergency:** `git commit --no-verify`. Don't abuse this — every bypassed commit has historically broken CI.

---

## After-Change Checklist (READ THIS — bug classes that have bitten us)

The April 2026 audit found 14 issues, several silently broken for months. The pattern: a step that needed to happen elsewhere when X was added got forgotten, and nothing in CI caught it. This checklist exists so it stops happening. See `memory/feedback_audit_lessons.md` for the full root-cause writeup.

### After adding/changing a Supabase table, column, or RPC

1. **Regenerate types** — `supabase gen types typescript --linked 2>/dev/null > types/database.ts`. Forgetting this leads to `(supabase.from as Function)('table_name')` workarounds that bypass the type system entirely.
2. **For UPDATE policies on user-writable tables:** verify a `WITH CHECK` clause OR an UPDATE trigger freezes sensitive columns (`is_approved`, `user_id`, etc.). Postgres does NOT require WITH CHECK on UPDATE policies — you have to remember. Reference pattern: `migrations/108_uploads_rls_lockdown.sql` `freeze_upload_columns_on_update`.
3. **Smoke-test new RPCs** — especially fire-and-forget ones. `record_impression` was broken for the entire app's lifetime (boolean = integer crash) and silently returned errors that nobody saw because clients didn't `.catch`.

### After adding a migration file

1. `ls supabase/migrations/ | grep ^NNN` to check for prefix collisions before saving.
2. `npx jest __tests__/lib/migrations.test.ts` to verify hygiene (this test enforces unique numeric prefixes).
3. If you must add a follow-up to an existing number, use `NNNa_`, `NNNb_` suffixes — alphabetical order will resolve them deterministically.
4. Run the migration in the Supabase SQL editor (DDL can't go through the JS client).

### After adding a medium to `dream_mediums`

1. Update `__tests__/lib/photoPrompts.test.ts` `ACTIVE_MEDIUMS` list.
2. Add the matching `MEDIUM_CONFIGS` entry in `supabase/functions/_shared/photoPrompts.ts`. The test will fail if you forget.
3. See the full medium-add checklist in the "Adding New Mediums/Styles" section above.

### After ripping out a feature

1. Audit DB columns it owned — write a cleanup migration for vestigial columns. (SightEngine removal left `is_moderated`/`is_approved` as confusing dead state for months.)
2. Search for hanging RLS references, triggers, RPCs that read those columns.
3. Search for type definitions that mention the feature.

### Seed tables — `bot_seeds` and `nightly_seeds` (SEPARATE tables, never cross-contaminate)

Bot dreams and nightly user dreams use **separate DB tables** to prevent accidental cross-deletion:

- **`bot_seeds`** — bot-specific seeds with `used_at` lifecycle tracking. Used by `scripts/generate-bot-dreams.js`. Auto-regenerates when exhausted.
- **`nightly_seeds`** — 8 pools of slotted templates for user dreams. Used by `generate-dream` Edge Function nightly path. Permanent pool, random pick, no usage tracking.
- **`dream_templates`** — LEGACY table, still exists but no longer read by any code. Will be dropped.

**The April 2026 incident:** An unscoped delete on the old shared `dream_templates` table wiped ALL bot seeds AND all nightly templates in one command. Both systems broke. Bot seeds were partially recovered from a Supabase backup, nightly templates had to be redesigned from scratch. This incident is why the tables were split.

**Hard rules:**
- NEVER run unscoped deletes on either seed table
- Bot seed cleanup: `.delete().like('category', 'botname_%')` — scoped to one bot
- Nightly seed refresh: run `node scripts/generate-nightly-seeds.js` — regenerates all 8 pools
- Always query first: `SELECT category, count(*) GROUP BY category` before any delete operation

### Hard rules (no exceptions)

- **NEVER run unscoped deletes on `bot_seeds` or `nightly_seeds`.** Always scope by category prefix. The April 2026 incident destroyed all bot seeds + nightly templates in one unscoped delete. Query `SELECT category, count(*) GROUP BY category` BEFORE any delete.
- **NEVER comment out a rate limit, security check, or RLS policy "for now".** If you need to disable, delete it AND create a follow-up task. Comments rot.
- **NEVER use `as Function`, `as any`, or `as unknown as <type>` to bypass types.** If a table isn't in the generated types, regenerate the types instead.
- **NEVER fire-and-forget critical RPCs without a `.catch` that logs in dev mode.** Silent failures lived for months.
- **NEVER write a SQL migration without checking `ls supabase/migrations/` for the next free number.**

---

## Working With Kevin

### Screenshots

When Kevin asks to view a screenshot: `ls -t ~/Desktop/*.png | head -1` then read it.

### Running Node Scripts

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && node <script>
```

### Deploying Edge Functions

```bash
supabase functions deploy <function-name> --no-verify-jwt
```

**Always use `--no-verify-jwt`.** Deploy immediately after editing — don't wait to be asked. Active functions: `generate-dream`, `nightly-dreams`, `send-push`, `revenuecat-webhook`, `moderate-content`, `describe-photo`, `extract-style`.

### Dev Build

Uses native modules — must use dev build via Xcode, not Expo Go. After adding native packages: `cd ios && pod install && cd ..` then rebuild.

### Database Migrations

Files in `supabase/migrations/`. Run manually in Supabase dashboard SQL editor. `get_feed` RPC must be DROPped before recreating.

### Running Nightly Dreams Locally

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && node scripts/nightly-dreams.js
```

Reads keys from `.env.local` automatically. Clear budget first if testing specific users.

### Setting Sparkle Balance

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && SUPABASE_SERVICE_ROLE_KEY=$(grep SUPABASE_SERVICE_ROLE_KEY .env.local | cut -d= -f2) node -e "const{createClient}=require('@supabase/supabase-js');const sb=createClient('https://jimftynwrinwenonjrlj.supabase.co',process.env.SUPABASE_SERVICE_ROLE_KEY);(async()=>{await sb.from('users').update({sparkle_balance:25}).eq('id','eab700d8-f11a-4f47-a3a1-addda6fb67ec');console.log('Done')})();"
```

### Kevin's User ID

`eab700d8-f11a-4f47-a3a1-addda6fb67ec`
