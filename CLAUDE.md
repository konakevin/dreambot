# DreamBot — Claude Code Guidelines

## Session Startup

**Read this entire file before doing anything else.** You are a senior principal engineer on this project. Jump straight into whatever Kevin needs.

Do NOT auto-start the dev environment. Tell Kevin he can run `/dream` to spin up the dev tools.

---

## What This App Is

DreamBot is an AI-powered dream image generator for iOS. Users build a "Vibe Profile" during onboarding (art styles, aesthetics, mood sliders, personal locations + objects, dream cast photos), and the app generates personalized AI dreams. Dark, high-energy aesthetic. Built for fun and delight.

**Key features:**

- Personalized AI image generation via Sonnet brief → Flux render pipeline
- Multiple creation modes (Dream Me, Chaos, Cinematic, Minimal, Nature, Character, Nostalgia, photo restyle, photo reimagine, Dream Like This, custom prompt)
- Dream Cast — face-swap your real photo (self + plus_one) into stylized dreams
- Nightly automatic dreams with bot messages from DreamBot
- 16 image-generation bots posting to a public feed 2× daily
- Social feed with likes, comments, shares, follows, friends, share-to-friend
- Sparkle currency (in-app purchases via RevenueCat) + Pro subscription for HQ downloads
- Lightweight wordlist text moderation (no external API; Flux handles image NSFW)

---

## Stack

- **Framework:** React Native + Expo SDK 54, Expo Router v4 (file-based routing)
- **Styling:** NativeWind v4 (Tailwind) preferred for new code; existing `StyleSheet.create` files are fine — match each file's existing style
- **State:** Zustand (client) + TanStack Query (server/async)
- **Backend:** Supabase (Postgres, auth, storage, realtime, Edge Functions on Deno)
- **AI Image Gen:** Replicate (Flux Dev, Flux 1.1 Pro / Pro Ultra, Flux Kontext Pro / Max)
- **AI Text:** Anthropic Claude Sonnet (briefs) + Haiku (vision, polishing, bot messages)
- **Payments:** RevenueCat (sparkle IAP + Pro subscription)
- **Auth:** Supabase Auth (email + Google + Apple + Facebook OAuth)
- **Animations:** Reanimated 3 + Gesture Handler
- **Images:** `expo-image` (NEVER React Native `Image`)
- **Language:** TypeScript strict — no `any`, no `// @ts-ignore`, no `as any` / `as Function` / `as unknown as <type>` to bypass types

---

## Generation Architecture (Current)

The dream engine has evolved beyond the legacy two-pass `vibeEngine.ts`. Current flow for user-initiated dreams (the `generate-dream` Edge Function):

1. **Resolve medium + vibe** from `dream_mediums` / `dream_vibes` DB tables (`_shared/dreamStyles.ts` with caching).
2. **Resolve cast + dream seeds** — load the user's `dream_cast` rows (self / plus_one photos + descriptions) and `dream_seeds.places[] / things[]` (curated location + object selections).
3. **Roll the scene** (`_shared/dreamAlgorithm.ts:rollDream()`) — picks one of three composition paths based on context (cast+location, location/object only, cast in random scene). Pulls biome config (`_shared/biomeAxes.ts`) for time/weather/camera/phenomena axes per medium+vibe.
4. **Detect intent** — `selfInsertDetector` ("put me in...") and `dualActionDetector` (multi-character) route to specialized brief builders (`dualBriefBuilder` for two-person renders).
5. **Build a Sonnet brief** (`_shared/recipeBuilder.ts` + `sceneEngine.ts`) — structured prompt that includes scene DNA, axes, character slots, medium directive, vibe directive, personal anchors, optional chaos layer.
6. **Sonnet writes the Flux prompt** (`_shared/llm.ts:callSonnet()`) — short, comma-separated, ~50–90 words. Sanitized (`sanitize.ts`) and post-processed (`promptCompiler.ts:postProcessPrompt()`).
7. **Flux renders** (`_shared/generateImage.ts`) — model picked per-medium by `modelPicker.ts`, with NSFW retry.
8. **Face swap** (`_shared/faceSwap.ts` for single, `dualSwapDispatch.ts` → `face-swap-dual` Edge Function for dual) when the medium has `face_swaps=true` and user has cast photos.
9. **Persist** — upload to Supabase Storage, dedup via `aHashHex()`, insert `uploads` row, log to `ai_generation_log`.

**Photo restyle path** (`restyle-photo` Edge Function) — separate Kontext-based transformation for "upload photo + pick medium" flow. Uses per-medium `MEDIUM_CONFIGS` in `_shared/photoPrompts.ts`.

**Nightly dreams** (`nightly-dreams` Edge Function, GitHub Actions cron `0 8 * * *` = 08:00 UTC daily, no jitter; `scripts/nightly-dreams.js` selects users + invokes the Edge Function per user) — same scene engine, runs once per **Pro-or-in-trial** user per night (free users post-trial get none). Personalizes from `user_recipes.recipe` JSONB (places/things/cast/moods), NOT the `dream_seeds`/`dream_cast` tables. Three composition paths roll 40/30/30: cast+anchor, anchor-only, cast-in-random-scene.

**First dream** (`generate-first-dream` Edge Function) — persona-locked medium/vibe picking for guaranteed-banger first-render quality. See `FIRST_DREAM_BANGER_SPEC.md`.

**Async queue + worker** (`dream-queue-worker`, `dream_queue` table) — see Scaling Initiative section below.

### Vibe Profile (`types/vibeProfile.ts`)

Stored as JSONB in `user_recipes.recipe`. Version: 2. Keys:

- `aesthetics[]` (vibes — min 3) | `art_styles[]` (mediums — min 2) | `interests[]` (min 3)
- `moods` — 4 bipolar sliders (peaceful↔chaotic, cute↔terrifying, minimal↔maximal, realistic↔surreal)
- `personal_anchors` — free text: places, objects, eras, dream vibe
- `avoid[]` | `spirit_companion`

VibeProfile v2 is the only supported format. Legacy v1 `Recipe` engine + migration helper were deleted 2026-04-30. The runtime `isVibeProfile()` type guard lives at `types/vibeProfile.ts`.

### Personal Anchors

Places, objects, eras, and dream vibe are gated per anchor (~40% inclusion) to prevent overuse. Dream vibe (the creative north star) is always included.

### Bot Messages

Each nightly dream gets a short whimsical message from DreamBot via a dedicated Haiku call. Personality-tuned, references the dream content, occasionally recalls past dreams/wishes.

---

## Bot System (16 image-generation bots)

> **STOP — read this before any bot work.** ANY task that touches bot config, path files, pools, seeds, brief composition, archetypes, render quality, or even just _answers a question_ about how a specific bot works (DragonBot, GothBot, StarBot, SteamBot, MechBot, DinoBot, BrickBot, BloomBot, ChibiBot, FaeBot, MangaBot, PixelBot, RetroBot, TinyBot, ToyBot, EarthBot) REQUIRES re-reading `BOT_SCENE_QUALITY_PLAYBOOK.md` in full first. The playbook is the canonical brain for the bot pipeline — its bar (every render = 10/10 poster-worthy frame), its 8 components of memorable scenes, its per-bot Round-N iteration logs, its cross-bot lessons table, and its failure-mode catalog are how this system stays coherent across 16 bots and dozens of paths. Skipping it produces one-off fixes that contradict prior lessons. **And: UPDATE the playbook with every new lesson learned the moment you learn it — don't wait to be asked.**

Bots post via a single DB-driven dispatcher (`.github/workflows/bots-dispatcher.yml`, every 15 min) that reads `bot_schedules` for due bots and shells out to `scripts/run-bot.js` per bot. Cadence is owned per-bot in the DB: `UPDATE bot_schedules SET posts_per_day = N WHERE bot_name = '<name>';` (no code commit, no app deploy). Each bot is a self-contained module under `scripts/bots/<botname>/`:

- **`index.js`** — bot config (username, mediums, vibes, allowedModels, modelByPath, vibesByPath, mediumByPath, mediumStyles, enhancement layer toggles, `rollSharedDNA()` + `buildBrief()` entry points).
- **`paths/*.js`** — one file per creative path (e.g., `dark-landscape.js`, `goth-closeup.js`). Each path declares either an inline brief or an archetype (`builder.archetype`) consumed by `scripts/lib/brief-composer.js`.
- **`pools.js`** — bespoke axis pools (lighting, atmosphere, era, accessory, etc.) drawn during `rollSharedDNA()`.
- **`seeds/*.json`** — generated seed rows that get loaded into the `bot_seeds` DB table by `scripts/generate-bot-seeds.js`.
- **`paths/legacy/`** — superseded path implementations (DragonBot, StarBot, GothBot have these). Don't edit; reference only.

EarthBot is a stub. All others have full path/pool/seed implementations.

**Shared infrastructure (`scripts/lib/`):**

- `botEngine.js` — orchestrator. `runBot()` rolls path/vibe/medium, fetches directives, calls `bot.rollSharedDNA()` + `bot.buildBrief()`, invokes Sonnet → Flux → upload → DB insert. Standalone (no coupling to `generate-dream`).
- `brief-composer.js` — archetype-based brief builder for paths using the declarative `builder.archetype` shape.
- `chaosLayer.js` — perception-distortion layer (geometry, reflection, scale, framing, secondary-light) at ~70% probability. Per-bot config: `chaos: { enabled, skipPaths, allowSubjectChaosPaths }`.
- `sensoryAnchors.js` — non-visual sensory enhancement (smell, sound, touch, temp, weight, air). Per-bot pools by context (female / male / scene) × channel.
- `twoPassPolish.js` — Sonnet (~150 words) → Haiku (~65–90 words) compression. Per-bot config: `twoPassPolish: { enabled, conceptWords, polishedWords, polishedWordsByPath, preservePhrasesByPath, skipPaths }`.
- `modelPicker.js` — intersects `dream_mediums.allowed_models` with `bot.allowedModels` + per-path overrides via `bot.modelByPath`.
- `seed-generator.js` — auto-regenerates a bot's pool when exhausted (`used_at` lifecycle).
- `archetype-templates.js` — brief templates extracted from path files for archetype migration parity.

**Bot iteration entry points:**

- `scripts/iter-bot.js` — dev iteration. `--bot, --count, --mode random|mixed|<path>, --vibe, --label, --post, --dry-run`. Default count = **5** and you must `--post` for renders to land in Kevin's feed (`/tmp` only is useless).
- `scripts/run-bot.js` — single-bot production entry; fails loud (no swallowed errors, unlike iter-bot). Called by the dispatcher per due-bot row.
- `scripts/dispatch-bots.js` — fleet dispatcher; reads `bot_schedules`, runs each due bot via `run-bot.js`, marks `last_posted_at` on success (DB trigger advances `next_due_at`). Auto-deactivates a new bot that never posts within 6h.
- `scripts/gen-<bot>-pool.js` — regenerates seed pools for a specific bot.

### Bot scene quality — CRITICAL workflow

`BOT_SCENE_QUALITY_PLAYBOOK.md` is the canonical reference for everything bot-render-quality. **It is not optional reading — re-read it BEFORE proposing any path migration or pool change, and UPDATE it with every new lesson learned (don't wait to be asked).** Building a repeatable cross-bot algorithm is the goal — not one-off fixes.

**The bar:** every bot render must be a 10/10 poster-worthy frame. Not "pretty but empty" — visible story, multi-tier depth, an entity in the scene, genre-coded specificity, material/atmospheric richness. If you wouldn't save it to a folder or screenshot it, the pools need more iteration.

**The 8 components of a memorable scene** (full detail in the playbook): monumental anchor, multi-tier composition (4+ depth layers), scale provers, narrative beat, readable focus, material truth, light drama, emotional DNA.

**Per-bot iteration logs live in the playbook's per-bot sections.** Add Round-N entries as you tune; surface anti-patterns to the cross-bot lessons table at the top so the pattern compounds.

**Bot axis refactor plan** lives at `BOT_AXIS_REFACTOR_PLAN.md` — extracts 6 archetypes + shared composer from hand-written paths. Phase 0 not started.

---

## Sparkle Economy + Pro Subscription

### Costs

- **1 sparkle** per dream (Dream Me, photo, twin, re-dream, custom prompt)
- **3 sparkles** per fusion
- **Free:** first-dream banger (server-side). Nightly dreams are **Pro/trial-only** (free users post-trial get none — gated in `scripts/nightly-dreams.js`)
- **25 sparkles** welcome bonus on onboarding completion

### IAP Packs

4 sparkle packs (25 / 50 / 100 / 500). Product IDs in `constants/sparklePacks.ts` (source of truth — bundle prefix `com.konakevin.radorbad.sparkles.*`).

### Pro Subscription

Long-press save-to-photos for HQ downloads (and other future Pro features). Setup details in `PRO_SUBSCRIPTION_SETUP.md` and `SPARKLE_PAYMENTS_SETUP.md`. Pricing strategy in `SPARKLE_PRICING_STRATEGY.md`.

### Purchase Flow

App → RevenueCat SDK → Apple payment → RevenueCat webhook → `revenuecat-webhook` Edge Function → `grant_sparkles` RPC (or pro flag flip) → balance/entitlement updated → client refreshes.

- RevenueCat key: production iOS in `lib/revenuecat.ts`
- Webhook secret: `REVENUECAT_WEBHOOK_SECRET` (Supabase Edge secrets)
- Refund path: `refund-self-moderation` Edge Function refunds sparkle when client-side text moderation rejects a prompt before server invocation.

---

## Onboarding (8 steps)

1. **Welcome** — intro
2. **Mediums** — pick art styles (min 2) from DB-driven pill grid (`dream_mediums`)
3. **Vibes** — pick aesthetics (min 3) from DB-driven pill grid (`dream_vibes`)
4. **Mood Sliders** — 4 bipolar sliders
5. **Locations** — curated 63 location cards (`location_cards` DB table). Starter packs, category filters. Min 3, max 10. Stored as `dream_seeds.places[]`.
6. **Objects** — curated 58 object cards (`object_cards`). Min 3, max 10. Stored as `dream_seeds.things[]`.
7. **Dream Cast** — photo upload for self + plus_one. Llama Vision (`describe-photo` Edge Function) generates descriptions. Relationship picker for +1.
8. **Reveal** — first-dream banger generation, post, 25-sparkle welcome, welcome notification.

**Architecture rule:** locations and objects are selected from pre-curated cards with rich essence data (palette, atmosphere, architecture, light signature, fusion settings, iconic spots). NEVER free-text. The dream engine picks randomly from the user's selections — no smart selection logic in the engine.

Profile saves on first dream generation (not just on post).

---

## File Structure (high-level)

```
app/                 Expo Router routes
  (auth)/            login, signup, OAuth
  (onboarding)/      8-step vibe profile builder
  (tabs)/            5 tabs: index, top, create, inbox, profile
  settings/          11 settings sub-screens (advanced-mode, vibes, mood, dream-cast, etc.)
  dream/             loading, newPost, reveal
  photo/[id], post/[id], user/[userId]   detail routes
  comments, dreamLikeThis, sharePost, sparkleStore, proStore, dreamTest

components/          ~44 components: DreamCard, FullScreenFeed, CommentOverlay,
                     onboarding/*, sheets, bot UI, themed primitives

hooks/               ~48 TanStack Query hooks grouped by domain
                     (dream, feed, social, sparkles, auth, profile, gestures/)

store/               Zustand stores: auth, dream, onboarding, feed, album, explore

lib/                 Engine glue + utilities
  supabase.ts        Supabase client (Expo SecureStore for tokens)
  dreamApi.ts        Edge Function client
  dreamAlgorithm.ts  Medium/vibe resolution + prompt mode config (mirror of _shared/)
  dreamPost.ts       Insert dream → uploads, pin to feed
  revenuecat.ts      RevenueCat SDK setup
  moderation.ts      Local wordlist text moderation
  appleAuth/googleAuth/facebookAuth.ts
  imageLongPress.ts  Pro feature: long-press save-to-photos
  feedDiversity.ts, feedHelpers.ts, balancedMix.ts
  curatedBots.ts, botProfiles.ts

types/
  vibeProfile.ts     VibeProfile v2 + isVibeProfile() guard
  database.ts        Supabase auto-generated DB types (regen after schema change)
  firstDream.ts

constants/
  promptModes.ts     7 modes + UI tiles
  sparklePacks.ts    IAP product IDs (source of truth)
  proPlan.ts         Pro entitlement features
  theme.ts           Dark palette
  onboarding.ts, gestures.ts, grid.ts, layout.ts, mascots.ts, etc.

supabase/
  migrations/        170 SQL migrations (highest prefix: 171)
  functions/         13 Edge Functions (full list under "Deploying Edge Functions" below)
    _shared/         37 shared modules (scene engine, casting, LLM, image,
                     persistence, face swap, prompt compiler, etc.)

scripts/
  bots/<botname>/    17 self-contained bots (index.js, paths/, pools.js, seeds/)
  lib/               Shared bot infra (botEngine, brief-composer, chaos, etc.)
  dispatch-bots.js, run-bot.js, iter-bot.js, nightly-dreams.js (cron)
  gen-*.js, test-*.js, qa-*.js  pool gen + testing scripts

__tests__/           24 jest test files (~3.8K LOC) — engine, bots, hooks, utils
```

---

## Adding New Mediums/Styles

A "medium" is an art style. The `dream_mediums` DB row is the single source of truth, but **the photo restyle path silently breaks if you skip step 2**.

**Critical naming rule: `key` MUST equal `label.toLowerCase().replace(/ /g, '_')`.** Legacy mismatches caused the April 2026 rename — don't create new ones.

### Step 1 — Insert DB row

```sql
INSERT INTO public.dream_mediums (
  key, label, directive, flux_fragment,
  is_active, is_bot_only, is_character_only, face_swaps, character_render_mode,
  sort_order
) VALUES (
  'newmedium', 'NewMedium',
  '...tight ~120-150 word directive...',
  '...compact comma-separated flux phrase...',
  true, false, false, false, 'natural', 99
);
```

**Directive rules** (all from real bugs):

- Cap at ~120–150 words. Long directives dilute the user's subject and hamper Sonnet creativity.
- Front-load identity rules (gender preservation, no horns, no Jack Skellington bans).
- Avoid horns/demons defaults — Flux gravitates there. Push for varied accessories (hair, hats, masks, jewelry, tattoos, scars).
- Avoid female-coded language for any-gender mediums: ban "shojo", "gowns", "veils", "delicate jewelry". Use neutral terms or split "if male: X / if female: Y".
- No camera/composition language — conflicts with user photos.

**Active classification flags:**

| Flag                    | Effect                                                                                        |
| ----------------------- | --------------------------------------------------------------------------------------------- |
| `is_active`             | Visible in user picker. `false` hides but engine can still resolve.                           |
| `is_bot_only`           | Pair with `is_active=false` so picker hides but resolver finds it.                            |
| `is_character_only`     | Always uses character composition path (LEGO, Claymation, Vinyl).                             |
| `face_swaps`            | Photo path will face-swap from user's cast thumb.                                             |
| `character_render_mode` | `'natural'` = swap onto stylized rendering. `'embodied'` = medium IS the body (LEGO Minifig). |

**Flags that don't exist (despite older docs):** `is_scene_only`, `nightly_skip`. The only hardcoded medium classification today is `NIGHTLY_BANNED_MEDIUMS = new Set(['photography'])` at `nightly-dreams/index.ts:216`. To ban another medium from nightly, add it there OR ship the `nightly_skip` column refactor in `memory/project_medium_flags_audit.md`.

### Step 2 — `_shared/photoPrompts.ts` MEDIUM_CONFIGS (CRITICAL — never skip)

Without an entry, photo restyle falls through to a generic 1-liner that ignores the directive entirely → zero gender preservation, Kontext defaults to "young woman in dress" regardless of subject (Twilight April 2026).

```typescript
newmedium: {
  model: 'kontext-max',  // 'flux-dev' for full rebuild like LEGO
  buildPrompt: (_photo, vibe, hint) =>
    `COMPLETELY transform this photo into [style description].

CRITICAL — preserve identity: keep the person's exact face, gender, skin tone, age, and core features. Male subjects stay male with masculine features and clothing. Female subjects stay female. NEVER change their gender. NEVER put a male subject in a dress, gown, skirt, corset, or feminine bodice.

[Element-by-element transformation: skin, hair, clothing, background, lighting].

Express the mood through [DIMENSION] and [DIMENSION]:
${vibe.slice(0, 200)}${hint ? `\n${hint}` : ''}`,
},
```

**Required elements:** `COMPLETELY transform` opener, identity/gender lock, element-by-element rules, `Express the mood through X and Y: [vibe]` (never just append vibe), `Portrait 9:16`, hint inclusion.

**After adding, grep the file for the key to confirm no duplicates.** Duplicate keys silently let the LATER definition win (Claymation rendered as Sack Boy, Neon as cyberpunk cybernetics, April 2026).

### Step 3 — `__tests__/lib/photoPrompts.test.ts`

Add the new key to the `ACTIVE_MEDIUMS` list. The test fails if you forget step 2.

### Step 4 — Bot config (optional)

If a bot should post in this style, add the key to that bot's `mediums` array in `scripts/bots/<botname>/index.js`.

### Step 5 — Deploy

```bash
supabase functions deploy generate-dream --no-verify-jwt
supabase functions deploy restyle-photo --no-verify-jwt
```

### Verification

```sql
-- Should return 0 rows
SELECT key, label FROM dream_mediums
WHERE is_active = true AND key != lower(replace(label, ' ', '_'));
```

**Smoke test all 5 user paths:**

1. Create + medium + no hint + no photo → renders a scene that showcases the medium
2. Create + medium + text prompt → user's subject in this medium
3. Create + medium + self-reference text ("put me in...") → user appears with correct gender
4. Create + medium + photo upload (restyle) → renders YOU in the medium, no gender swap
5. Create + medium + photo + prompt → reimagines using both inputs

If any path renders generic/wrong gender → you missed step 2.

### What does NOT need updating

UI tiles (`MediumVibeSelector` queries `get_dream_mediums` RPC), `ArtStyle` type (string, no union), `constants/dreamEngine.ts` (gutted; DB-only).

### Edge Function Gotcha — No Optional Chaining in Top-Level Code

**NEVER use `?.` in top-level module expressions** in `supabase/functions/_shared/*.ts`. Deno Edge runtime crashes (BOOT_ERROR). Use explicit null checks:

```typescript
// BAD — BOOT_ERROR:
export const X = arr.filter((m) => m.foo?.length);
// GOOD:
export const X = arr.filter((m) => m.foo && m.foo.length > 0);
```

---

## Dual Character Face Swap

When a user has both self + plus_one cast photos, the engine renders both in a single scene with both faces swapped. **7-layer system — every layer must align or the render breaks.** Full QA history in commit log.

**The 7 layers:**

1. **Composition path** — 6 camera presets (candid, portrait, cinematic, environmental, editorial; `intimate` was removed) controlling framing/angle. Prepended to the Flux prompt.
2. **Action pool** — Sonnet-seeded poses describing BOTH characters' body language. Rules: side-by-side, stationary, body-only, scene-neutral.
3. **Flux fragment override** (`_shared/faceSwapFluxOverrides.ts`) — runtime override of medium's art-style prefix ONLY when face swap is active. Strips stylized character design language, adds face realism.
4. **Directive override** — overrides the STYLE GUIDE paragraph Sonnet reads. Must agree with the flux fragment.
5. **Sonnet brief** (`_shared/dualBriefBuilder.ts`) — mandatory face-lock phrase, left/right separation, face realism rule, action injection.
6. **Post-processing prepend** — composition path's camera string prepended after Sonnet writes.
7. **Face swap execution** (`dualFaceSwap()` via `dualSwapDispatch` → `face-swap-dual` Edge Function) — crop left 55% → crop right 55% → swap each in parallel → stitch at midpoint. Retries 3× before fallback.

**Recipe for great dual renders:**

- Front-load face realism in flux fragment BEFORE any style language (Flux early-token weighting).
- **Style separation:** apply style modifiers to the WORLD, not the characters. "Illustration set in a fairy tale world" NOT "fairy tale animation style." Single most important insight.
- Explicit negatives ("NOT cartoon eyes, NOT anime eyes") — weak alone, useful as reinforcement.
- Eyebrow fix: "thin subtle eyebrows" in flux fragment + "Do NOT draw thick or prominent eyebrows" in Sonnet brief.
- `isDualFaceSwap ? 300 : 200` max tokens — dual prompts need room or second character truncates (both-male renders).
- Medium shot, waist-up, filling the frame (small characters = face swap can't detect faces).
- Three-quarter toward viewer — clean face for swap.

**Current FACE_SWAP_FLUX_OVERRIDES:** fairytale, storybook, pencil. DB `dream_mediums` rows are unchanged — overrides are runtime-only so non-face-swap renders keep their original style.

### Automated QA feedback loop

When Kevin says "run an automated QA loop on path X" — Claude does the **entire** loop without human review. Detailed protocol:

1. **Tag the run** — every render force-posted with `auto-qa: <path-name> R<round>` caption. Kevin filters and hearts later.
2. **Run a batch of 5** — use `force_*` body params on the relevant Edge Function. `is_posted=true`. Always 5 per round.
3. **Pull renders from DB** — `uploads.image_url, ai_prompt, dream_medium, dream_vibe, output_phash`. Use Read tool on the JPEG to actually look.
4. **Self-grade 0–5** on dimensions that matter for the path. 5/5 = ship it. 3/5 = visible problems. Be brutal.
5. **Identify the failing layer** — composition prepend? Sonnet brief? action pool? medium directive? swap pipeline? Pick ONE.
6. **Make ONE change** — never multi-variate. Document in `memory/project_auto_qa_<path>.md` under "Round N".
7. **Deploy + run round N+1**.
8. **Stop conditions:** 3 consecutive 4.5+/5 rounds → production-ready, summary to memory; 20 rounds cap; Kevin says stop.
9. **Cross-reference Kevin's hearts** every ~5 rounds — query `likes` joined to `uploads` filtered by caption pattern. Mismatch with your scoring = grader miscalibrated; recalibrate.

**Memory protocol:** `memory/project_auto_qa_<path>.md` with round-by-round log, running config, hearted IDs + their prompts, final config when converged.

**Caption taxonomy:** `auto-qa: <path> R<N>` during iteration; `auto-qa: <path> FINAL` after convergence.

**Don't fake-converge.** If 3 rounds score 4.5+ but you suspect leniency, run another with stricter criteria. "I can't tell if this is good" beats shipping something Kevin will reject.

---

## Database (170 migrations, key tables)

### Core

- **`users`** — id, email, username, avatar_url, sparkle_balance, pro_subscription, first_dream_completed_at, last_active_at
- **`uploads`** — id, user_id, image_url, ai_prompt, caption, dream_medium, dream_vibe, is_ai_generated, is_posted, is_first_dream, comment_count, like_count, created_at
- **`user_recipes`** — user_id (PK), recipe (JSONB VibeProfile v2), onboarding_completed, ai_enabled, dream_wish, created_at, updated_at
- **`push_tokens`** — Expo push tokens

### Dream system

- **`dream_mediums`** — art style definitions (key, label, directive, flux_fragment, kontext_directive, is_active, is_bot_only, is_character_only, face_swaps, character_render_mode, sort_order, allowed_models)
- **`dream_vibes`** — vibe definitions (key, label, directive, sort_order, is_active)
- **`dream_cast`** — user's cast photos (cast_role, photo_url, description, relationship)
- **`dream_seeds`** — user's selected places + things (text[])
- **`location_cards`** — 63 curated locations (palette, atmosphere, architecture, light_signature, texture_details, cinematic_phrases, fusion_settings, biome_config, is_approved)
- **`location_iconic_spots`** — per-location signature spots
- **`object_cards`** — 58 curated objects (visual_forms, material_textures, signature_details, scale_contexts, role_options, soft_presence_forms, faceswap_forbidden)
- **`bot_seeds`** — bot-specific seeds with `used_at` lifecycle
- **`nightly_seeds`** — 8 pools × 100 slotted templates for user nightly dreams. Permanent, no usage tracking.
- **`dream_templates`** — LEGACY (not read by any code, will be dropped)

### Generation infrastructure

- **`ai_generation_log`** — audit trail (recipe_snapshot, rolled_axes, enhanced_prompt, model_used, cost_cents, status)
- **`ai_generation_budget`** — daily per-user cost
- **`dream_jobs`** — legacy in-flight tracking (status: processing/done/failed/nsfw)
- **`dream_queue`** — async queue (queued → in_progress → completed/failed → dead_letter; SELECT FOR UPDATE SKIP LOCKED on pending index)

### Social

- `likes`, `favorites`, `follows`, `follow_requests`, `friendships`, `comments`, `comment_likes`, `post_shares`, `post_impressions`, `blocked_users`, `reports`

### Notifications + economy

- **`notifications`** — recipient_id, actor_id, type (`dream:*`, `wish:*`, `welcome:*`, etc.), upload_id, comment_id, body, is_read
- **`sparkle_transactions`** — spend/grant audit log

### Notable RPCs

`get_feed`, `get_friends_feed`, `get_following_feed`, `get_inbox`, `get_comments`, `get_public_profile`, `spend_sparkles`, `grant_sparkles`, `refund_sparkles` (idempotent), `record_impression`, `get_dream_mediums`, `get_dream_vibes`, `get_bot_thumbnails`, `get_vibe_stats`, `approve_follow_request`, `block_user`, `finalize_nightly_upload`, `delete_own_account`, `admin_delete_upload`, `claim_dream_queue_job`.

---

## Design System

- **Background:** `#0F0F1A` | **Surface:** `#1A1A2E` | **Border:** `#2D2D44`
- **Text primary:** `#FFFFFF` | **Text secondary:** `#9CA3AF`
- **Accent (purple):** `colors.accent` | **Like (red):** `colors.like`

**Rules:**

1. NativeWind `className` preferred for new components; existing `StyleSheet.create` (53+ files) is fine — match the file's existing style. Don't bulk-migrate.
2. Never `any`.
3. Always handle loading and error states in UI.
4. Supabase queries go in TanStack Query hooks under `hooks/`.
5. Keep screens thin — logic in hooks, UI in components.
6. Dark-mode only — no light theme.
7. `expo-image`, never RN `Image`.

---

## GitHub & CI/CD

**Repo:** `konakevin/dreambot`. `main` is the trunk.

**Workflow:** all agents (Claude included) commit directly to `main`. No feature branches. Kevin keeps concurrent agents on different areas of the code so collisions are rare; when they happen, resolve conflicts in real time. The one rule that still holds: **don't edit files outside your task's scope** — if another agent has WIP staged or unstaged in the working tree, leave their files alone (edit in place if you must touch the same file, never stash or revert their work).

**CI** (`.github/workflows/ci.yml`): tsc, lint, prettier, jest on every push.
**Nightly cron** (`.github/workflows/nightly-dreams.yml`): `0 8 * * *` (08:00 UTC daily, no jitter). Fails loud (exit 1) on a zero-output or >50%-failure run. Secrets: `SUPABASE_SERVICE_ROLE_KEY`, `REPLICATE_API_TOKEN`, `ANTHROPIC_API_KEY`.
**Bot dispatcher** (`.github/workflows/bots-dispatcher.yml`): every 15 min. Reads `bot_schedules`, runs each due bot via `scripts/run-bot.js`. Change cadence via `UPDATE bot_schedules SET posts_per_day = N WHERE bot_name = 'x';`. Same secrets as nightly. Audit: `SELECT bot_name, posts_per_day, active, next_due_at FROM bot_schedules ORDER BY next_due_at;`.

---

## Pre-Commit Checklist

A husky pre-commit hook auto-runs `npm run check` (prettier → lint → tsc → jest) and blocks the commit on any failure.

```bash
npm run check          # full pre-commit gate
npm run fix            # auto-fix prettier + lint
npm run format:check   # prettier --check
npm run lint           # expo lint
npm run typecheck      # tsc --noEmit
npm run test           # jest
```

Bypass: `git commit --no-verify`. Don't abuse — every bypass has historically broken CI.

---

## After-Change Checklist (READ — bug classes that have bitten us)

April 2026 audit found 14 silently-broken issues. Pattern: a step needed elsewhere when X was added got forgotten, CI didn't catch it. Full root-cause writeup in `memory/feedback_audit_lessons.md`.

### After adding/changing a Supabase table, column, or RPC

1. **Regenerate types** — `supabase gen types typescript --linked 2>/dev/null > types/database.ts`. Skipping this leads to `(supabase.from as Function)('table_name')` workarounds that bypass the type system.
2. **For UPDATE policies on user-writable tables:** verify `WITH CHECK` clause OR an UPDATE trigger freezes sensitive columns (`is_approved`, `user_id`). Postgres does NOT require `WITH CHECK` on UPDATE — you have to remember. Reference: `migrations/108_uploads_rls_lockdown.sql` `freeze_upload_columns_on_update`.
3. **Smoke-test new RPCs** — especially fire-and-forget. `record_impression` was broken for the app's lifetime (boolean = integer crash) because clients didn't `.catch`.

### After adding a migration file

1. `ls supabase/migrations/ | grep ^NNN` to check for prefix collisions.
2. `npx jest __tests__/lib/migrations.test.ts` enforces unique numeric prefixes.
3. Need a follow-up to existing number? Use `NNNa_`, `NNNb_` suffixes — alphabetical order resolves them deterministically.
4. Run via Supabase dashboard SQL editor (DDL can't go through JS client).

### After adding a medium to `dream_mediums`

1. Update `__tests__/lib/photoPrompts.test.ts` `ACTIVE_MEDIUMS`.
2. Add `MEDIUM_CONFIGS` entry in `_shared/photoPrompts.ts`. Test fails if forgotten.
3. Full medium-add checklist above in "Adding New Mediums/Styles".

### After ripping out a feature

1. Audit DB columns it owned — write cleanup migration for vestigial columns. (SightEngine removal left `is_moderated`/`is_approved` as confusing dead state for months.)
2. Search hanging RLS references, triggers, RPCs that read those columns.
3. Search type definitions that mention the feature.

### Seed tables — `bot_seeds` and `nightly_seeds` (SEPARATE; never cross-contaminate)

- **`bot_seeds`** — bot-specific, `used_at` lifecycle. Used by `scripts/run-bot.js` (via the picker in `botEngine.js`). Auto-regenerates when exhausted.
- **`nightly_seeds`** — 8 pools of slotted templates for user dreams. Used by Edge Function nightly path. Permanent, random pick.
- **`dream_templates`** — LEGACY, no readers, will be dropped.

**The April 2026 incident:** unscoped delete on the old shared `dream_templates` wiped ALL bot seeds + ALL nightly templates in one command. Bot seeds partially recovered from backup; nightly templates redesigned from scratch. This is why the tables were split.

**Hard rules:**

- NEVER unscoped deletes on either seed table.
- Bot seed cleanup: `.delete().like('category', 'botname_%')` — scoped to one bot.
- Nightly seed refresh: `node scripts/generate-nightly-seeds.js` — regenerates all 8 pools.
- ALWAYS `SELECT category, count(*) GROUP BY category` BEFORE any delete.

### Hard rules (no exceptions)

- **NEVER unscoped deletes on `bot_seeds` or `nightly_seeds`.** Scope by category prefix. Query GROUP BY first.
- **NEVER comment out a rate limit, security check, or RLS policy "for now".** Delete it AND create a follow-up task. Comments rot.
- **NEVER use `as Function`, `as any`, `as unknown as <type>` to bypass types.** Regenerate types instead.
- **NEVER fire-and-forget critical RPCs without `.catch` that logs in dev.** Silent failures lived for months.
- **NEVER write a SQL migration without checking `ls supabase/migrations/` for the next free number.**
- **NEVER edit another agent's WIP files** when worktrees exist. Edit only files in your task's scope.
- **NEVER propose a bot path migration without re-reading `BOT_SCENE_QUALITY_PLAYBOOK.md` first**, and update it with every new lesson — don't wait to be asked.

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

**Always `--no-verify-jwt`. Deploy immediately after editing — don't wait to be asked.**

Active functions: `generate-dream`, `generate-first-dream`, `nightly-dreams`, `dream-queue-worker`, `face-swap-dual`, `restyle-photo`, `describe-photo`, `classify-photo`, `extract-style`, `revenuecat-webhook`, `send-push`, `refund-self-moderation`, `refund-stuck-jobs`.

### Dev Build

Native modules — must use dev build via Xcode, not Expo Go. After adding native packages: `cd ios && pod install && cd ..` then rebuild.

### Database Migrations

Files in `supabase/migrations/`. Run manually in Supabase dashboard SQL editor. `get_feed` RPC must be DROPped before recreating.

### Running Nightly Dreams Locally

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && node scripts/nightly-dreams.js
```

Reads keys from `.env.local`. Clear budget first if testing specific users.

### Setting Sparkle Balance

Inline node one-liner using `SUPABASE_SERVICE_ROLE_KEY` from `.env.local` → `users.update({sparkle_balance:N}).eq('id', kevinUserId)`. Project URL: `https://jimftynwrinwenonjrlj.supabase.co`.

### Kevin's User ID

`eab700d8-f11a-4f47-a3a1-addda6fb67ec`

### Team

Kevin is the sole human developer. Claude is the other dev. No PR review — feature branches exist for cleanliness/atomicity. Land via merge once ready.

---

## Scaling Initiative (read before touching dream-generation hot path)

The dual face-swap pipeline previously hit HTTP **546 (`WORKER_LIMIT_EXCEEDED`)** during open-prompt dual-cast renders — Supabase Pro per-invocation budget is ~150 MB memory / ~2 s CPU / 150 s wall. Three things stacked: longer Sonnet briefs, variable Replicate latency (15–43s), rapid test cadence.

**Phase 1 (shipped) — memory hygiene in `_shared/faceSwap.ts`** — three load-bearing fixes:

1. `perturbSourceImage` uploads to temp storage instead of returning a 5–7 MB base64 URI; caller cleans up in `finally`.
2. Sequential post-swap downloads (was `Promise.all`) — costs ~500ms wall, halves the memory window.
3. Eagerly null buffers after last use (`imgData`, `leftPixels`/`rightPixels`, `leftSwapData`/`rightSwapData`).

Net: ~10–15 MB peak savings. Helped, not enough alone.

**Phase 2 (shipped, dormant) — function split via `DUAL_SWAP_FANOUT` env flag.** New `face-swap-dual` Edge Function owns the entire `dualFaceSwap` body in its own 150 MB isolate. Callers route through `_shared/dualSwapDispatch.ts:dispatchDualFaceSwap()`:

- `DUAL_SWAP_FANOUT=true` → `supabase.functions.invoke('face-swap-dual', ...)`
- unset → in-process `dualFaceSwap()` (current default)

Activate: `supabase secrets set DUAL_SWAP_FANOUT=true`. Roll back: unset. Zero code change.

Single-cast face swap is NOT split — light enough to stay in-process.

**Async queue + workers (shipped earlier in 2026):** `dream_queue` table + `dream-queue-worker` Edge Function (cron every 15s, atomic claim via SELECT FOR UPDATE SKIP LOCKED, exponential backoff, dead_letter after 5 attempts). Per-source dispatch (first_dream / nightly / create / dlt). `refund-stuck-jobs` sweeps orphans. Full plan: `QUEUE_WORKERS_REFACTOR.md` and `DREAM_QUEUE_PLAN.md`.

**Signals to escalate further** (Replicate enterprise tier, Anthropic higher tier, or full async UI):

- Replicate queue >30s consistently
- Anthropic 429s in `ai_generation_log.fallback_reasons`
- `generate-dream` invocation queue depth grows
- > 200 concurrent users / >10 dreams/sec sustained
- Compute errors return despite Phase 2
- Daily renders >5,000

**Hard rules:**

- Don't disable Phase 1 memory hygiene "as just optimization." Each fix is load-bearing.
- Don't add new pixel work to `dualFaceSwap` in-process. New steps go in a separate Edge Function in the fanout path.
- Don't introduce another base64 data URI in the swap pipeline. Always upload to temp storage and pass URLs.
- Don't run heavy decode/encode/stitch in `generate-dream` directly. Delegate to Edge Functions.
- Don't pre-build new scaling architecture until at least one signal above fires.

---

## Reference Docs (in repo root)

`BOTS.md` (bot system + seed tables), `BOT_SCENE_QUALITY_PLAYBOOK.md` (path migration + 10/10 bar), `BOT_AXIS_REFACTOR_PLAN.md`, `NIGHTLY_DREAM_ENGINE.md`, `NIGHTLY_QA_HANDOFF.md`, `QUEUE_WORKERS_REFACTOR.md` + `DREAM_QUEUE_PLAN.md`, `FIRST_DREAM_BANGER_SPEC.md`, `DLT_PUT_ME_IN_SCENE_PLAN.md`, `SPARKLE_PAYMENTS_SETUP.md`, `SPARKLE_PRICING_STRATEGY.md`, `PRO_SUBSCRIPTION_SETUP.md`, `AUTH_PROVIDERS.md`, `MEDIUMS_FAQ.md`, `BUNDLE_ID_MIGRATION.md`, `DREAMBOT.md` + `DREAMBOT_CHARACTER.md` (personality).
