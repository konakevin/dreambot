# DreamBot — Claude Code Guidelines

## Session Startup

**Read this entire file before doing anything else.** You are a senior principal engineer on this project. Jump straight into whatever Kevin needs.

Do NOT auto-start the dev environment. Tell Kevin he can run `/dream` to spin up the dev tools.

---

## What This App Is

DreamBot is an AI-powered dream image generator for iOS. Users build a "Vibe Profile" during onboarding (locations, dream cast photos, mood sliders), and the app generates personalized AI dreams. Dark, high-energy aesthetic.

**Key features:** personalized AI image generation (Sonnet brief → Flux render), multiple creation modes (Dream Me / Chaos / Cinematic / restyle / reimagine / Dream Like This / custom), Dream Cast face-swap (self + plus_one), nightly automatic dreams with bot messages, social feed (likes / comments / shares / follows / friends), Sparkle currency (RevenueCat IAP) + Pro subscription for HQ downloads, 18 image-generation bots posting to a public feed (4× daily).

---

## Stack

- **Framework:** React Native 0.81 + Expo SDK 54, Expo Router v6 (file-based)
- **Styling:** NativeWind v4 preferred for new code; existing `StyleSheet.create` is fine — match each file's existing style
- **Responsive sizing:** all new UI components import scale helpers from `@/lib/responsive` — `verticalScale(n)` for paddings/margins/dimensions, `fontScale(n)` for `fontSize`/`lineHeight`, `horizontalScale(n)` for sparse horizontal needs, `verticalScaleClamped(n, min, max)` for hero elements with floors/ceilings, `useDeviceClass()` → `{isSmall, isLarge, isTablet, height, width}` for conditional layouts. Don't introduce hardcoded numeric values in `StyleSheet.create` or `style={{}}` — design at the iPhone 14 base (844×390pt) and scale. Legacy code is grandfathered; new code that adds hardcoded values is a regression.
- **State:** Zustand (client) + TanStack Query v5 (server/async)
- **Backend:** Supabase (Postgres, auth, storage, realtime, Deno Edge Functions)
- **AI Image Gen:** Replicate (Flux family) + Gemini (Nano Banana) + OpenAI (GPT Image 2)
- **AI Text:** Anthropic Claude Sonnet (briefs) + Haiku (vision, polishing, bot messages)
- **Payments:** RevenueCat (sparkle IAP + Pro)
- **Auth:** Supabase Auth (email + Google + Apple + Facebook OAuth)
- **Animations:** Reanimated 4 + Gesture Handler
- **Images:** `expo-image` only (never RN `Image`)
- **Language:** TypeScript strict — no `any`, no `as any`, no `as Function`, no `// @ts-ignore`

---

## File Structure

```
app/                  Expo Router routes
  (auth)/             index, login, signup
  (onboarding)/       single pager that orchestrates 5 data steps + 5 info screens
  (tabs)/             5 tabs: index, create, top, bots, profile
  settings/           11 sub-screens (edit-profile, dream-cast, locations, mood,
                      notifications, advanced-mode, bots, blocked-users, about, …)
  dream/, photo/[id], post/[id], user/[userId]
  comments, inbox, dreamLikeThis, sharePost, sparkleStore, proStore, welcome-gift
components/           58 files; onboarding/ + ui/ subdirs; biggest: DreamCard, DreamWishSheet,
                      CommentOverlay, FullScreenFeed, PostGrid
hooks/                58 TanStack Query + plain hooks; gestures/ subdir
store/                6 Zustand stores: album, auth, dream, explore, feed, onboarding
lib/                  36 glue files; supabase client, dreamApi, revenuecat, proStatus,
                      moderation, navigation, sentry, posthog, analytics
types/                database.ts (auto-gen), vibeProfile.ts (v2 + isVibeProfile guard)
constants/            12 files; theme, proPlan, sparklePacks (fallback), imageModels, …
supabase/
  migrations/         255 SQL migrations (highest prefix: 255)
  functions/          14 Edge Functions + 58 _shared/ modules
scripts/
  bots/<botname>/     18 self-contained bots (index.js, paths/, pools.js, seeds/)
  lib/                Shared bot infra (botEngine, brief-composer, chaosLayer, …)
  dispatch-bots.js, run-bot.js, iter-bot.js, nightly-dreams.js, qa-bot-model-matrix.js, …
__tests__/
  lib/, store/        fast suite (*.test.ts) — runs in husky + CI `check`
  db/                 live-DB lane (*.dbspec.ts) — real Postgres, CI `db-tests` only
```

---

## Generation Architecture

Two main render paths:

1. **User-initiated dreams** → `generate-dream` Edge Function. Flow: resolve medium + vibe from DB tables → load cast + `dream_seeds.places[]` → roll a composition (`_shared/dreamAlgorithm.ts:rollDream`) → build Sonnet brief (`_shared/recipeBuilder.ts` + `sceneEngine.ts`) → Sonnet writes Flux prompt (sanitized + post-processed) → Flux renders (model picked per-medium) → optional face swap → persist (Storage upload, dedup, `uploads` row, `ai_generation_log`).

2. **Nightly dreams** (and the **first dream** in onboarding) → async queue pipeline. The GitHub Actions cron `0 8 * * *` runs `scripts/nightly-dreams.js`, which ENQUEUES one `dream_queue` job per eligible Pro-or-in-trial user (bots excluded; per-user-per-day idempotent via `dedup_key`). The `dream-queue-worker` (pg_cron every minute) batch-claims jobs (`claim_dream_queue_jobs` — SELECT FOR UPDATE SKIP LOCKED) and dispatches to the `nightly-dreams` render Edge Function via `EdgeRuntime.waitUntil`. Same scene engine, personalizes from `user_recipes.recipe` JSONB. Full architecture: `NIGHTLY_DREAM_ENGINE.md` + `QUEUE_WORKERS_REFACTOR.md` + `NIGHTLY_SEED_POOL_QA.md`.

**Onboarding Reveal (first dream)** routes through the `nightly-dreams` engine with `force_cast_role` + `force_face_swap_eligible` so the user is reliably cast into one of their places. The engine returns the private `upload_id`; Post flips it public (no double-insert). No separate `generate-first-dream` function — it was ripped out 2026-06-02.

**Photo restyle** → separate `restyle-photo` Edge Function. Kontext-based transform with per-medium configs in `_shared/photoPrompts.ts`.

**Dual face swap** runs in its own `face-swap-dual` Edge Function isolate (memory separation). Routing via `_shared/dualSwapDispatch.ts`. Don't add new pixel work to the dual swap path in-process; new steps go in a separate Edge Function.

**User dreams via the async queue (2026-06-13, feature-flagged `EXPO_PUBLIC_DREAM_QUEUE_ENABLED`).** Routes Create/DLT/restyle through `dream_queue` like nightly, to escape Supabase Edge 546 `WORKER_RESOURCE_LIMIT` at scale. Flow: client → `enqueue-dream` (charge + INSERT `dream_queue` + seed `dream_jobs` + kick worker → `{dream_id}` in <500ms) → loading screen subscribes to `dream_queue` realtime (`dream_jobs` poll = fallback) → `dream-queue-worker` (pg_cron 1min + per-enqueue kick) **claims under the cap and dispatches FIRE-AND-FORGET** → `generate-dream`/`restyle-photo` (`x-dream-queue:1` service path) ack 202, render in `waitUntil`, and **own their own `dream_queue` terminal state** via `completeQueueJob`/`failQueueJob` (`_shared/dreamQueueLifecycle.ts`). One UUID = `dream_queue.id` == `dream_jobs.id` == `job_id` == sparkle ledger `reference_id`.

- **LOAD-BEARING GOTCHA — the RENDER owns the queue lifecycle, NOT the worker.** Never make the worker synchronously await a long render: under load the gateway 504s the worker's HTTP call and it would re-queue a render that ACTUALLY SUCCEEDED (re-rendering + orphaning uploads). The 202-ack + render-self-completes design is what fixes this. Worker stale-recovery (in_progress >5min → re-queue) catches a dead isolate.
- **PER-WEIGHT concurrency caps are the anti-546 lever** (migration 265). `dream_queue.weight` ('light'|'heavy', set at enqueue: photo new_scene / `force_cast_role` / self-referential-with-cast = heavy; plain text + restyle = light). LIGHT runs at `engine_config.dream_queue_max_concurrent` (default 40), HEAVY at `engine_config.dream_queue_max_concurrent_heavy` (default **10**). Worker claims each pool separately (`claim_dream_queue_jobs_by_weight`). **Both knobs are live-tunable from the dashboard, no deploy.** Beyond a cap, jobs queue + drain (never fail) — it bounds CONCURRENCY, not total users.
- **The HEAVY ceiling is the Fly.io dual-swap service.** Load-tested: light holds at 40 + drains fast; heavy at 10 = 24/24 dual succeeded, but at 15 the Fly.io swap exhausted under combined load. To raise the heavy cap, **scale the Fly.io `face-swap-dual` service first**, then bump `dream_queue_max_concurrent_heavy`. Nightly is also 'heavy' (default weight) but non-interactive, so it drains overnight regardless.
- **Tuning + validation:** load-test scripts `scripts/loadtest-create-queue.js` (light), `loadtest-dual-swap.js` (heavy), `loadtest-mixed.js` (both) — each `--count`/`--light`/`--heavy` + `--cleanup` (deletes rows AND storage blobs; a bare uploads-row delete orphans the file). Status of record: `QUEUE_WORKERS_REFACTOR.md`.

**Pro-state is one rule across three runtimes** that MUST stay in sync: `lib/proStatus.ts` (client), `scripts/lib/nightlyEligibility.js` (nightly cron gate), `is_pro_active()` Postgres fn (Edge Functions). Pro = paid+unexpired OR within the trial window — **trial LENGTH is `engine_config.pro_trial_days`** (default 14, read by all three runtimes; migration 248), so change the trial length in ONE DB row, not in code. Re-validated on every read. Tests: `__tests__/lib/proStatus.test.ts`, `__tests__/lib/nightlyEligibility.test.ts`, `__tests__/db/isProActive.dbspec.ts`. Change the trial *logic* in all three together.

---

## Admin Config — patch generation without a client deploy

A lot of generation config is **DB-driven** so it can be changed from the Supabase dashboard with **no App Store build** (the dangerous, days-slow path). Full audit + design: `ADMIN_CONFIG_PLAN.md` (status: SHIPPED). The backbone:

- **`engine_config`** (singleton row, id=1) — the remote-config spine, read by all three runtimes (client `useEngineConfig` → `get_engine_config()` RPC; Edge `_shared/engineConfig.ts`; scripts `scripts/lib/engineConfig.js`). Holds: `base_sparkle_cost`, `welcome_sparkle_bonus`, `pro_trial_days` (the 3-runtime trial value), `prompt_max_length`, `photo_preprocess_*`, `nightly_max_jobs`, `nightly_enabled` (master kill-switch), `nightly_require_*`, `pro_monthly_sparkle_bundle`, the cast-detection regexes, plus the nightly distribution knobs (chaos tiers, embodied/face-swap rates). Every field has a code FALLBACK — a missing row never breaks anything.
- **`dream_mediums` / `dream_vibes`** — directives/flux fragments/flags (already DB); `client_meta jsonb` (migration 251) lets NEW client-driving attributes be added with no RPC/rebuild.
- **`bot_config`** (migration 249) — per-bot DIALS overlaid on code at run time (`scripts/lib/botConfig.js`): `allowed_models`, medium/vibe locks, `chaos_enabled`, `two_pass_polish_enabled`. NULL/missing = pure code. (Paths/pools/archetypes/prose stay code — creative source, not dials.)
- **`mood_axes`** (250) — onboarding sliders (`useMoodAxes`); axis KEYS are a typed engine contract.
- **`sparkle_packs`** (255) — pack sizes; **bot cadence/seeds** (`bot_schedules`/`bot_seeds`), **nightly seeds** (`nightly_seeds`), **locations** (`location_cards`) are all DB too.

**Deliberately still code:** the scene-engine *algorithm* (`sceneEngine.ts`/`dreamAlgorithm.ts`/`recipeBuilder.ts`), bot paths/pools/prose, sanitization/chaos/face-swap dispatch, and the nightly *cron time* (GitHub Actions can't read the DB — would need pg_cron).

When you add a hardcoded constant that shapes generation/economy/UX copy, ask: should this be an `engine_config` field (or a config table) instead? Default yes for anything an admin would reasonably want to tune post-launch.

---

## Bot System (18 bots)

> **STOP — read this before any bot work.** ANY task that touches bot config, paths, pools, seeds, archetypes, brief composition, or even just *answers a question* about how a specific bot works requires re-reading `BOT_SCENE_QUALITY_PLAYBOOK.md` in full first. The playbook is the canonical brain (the 10/10 bar, the 8 components of memorable scenes, per-bot Round-N iteration logs, cross-bot lessons, failure-mode catalog). Skipping it produces one-off fixes that contradict prior lessons. **And: update the playbook with every new lesson learned the moment you learn it — don't wait to be asked.**

**The 18:** bloombot, brickbot, chibibot, dinobot, dragonbot, earthbot, faebot, gothbot, mangabot, mechbot, oceanbot, pixelbot, retrobot, starbot, steambot, tinybot, toybot, yumbot. Active in `bot_schedules` at 4 posts/day.

**Per-bot model lineups** (which AI models each bot rolls from) live in `BOT_MODEL_TALLY.md`. The `model` column on `uploads` (migration 211) records which model rendered each post; DreamCard shows a model badge.

**Architecture.** Each bot is a self-contained module under `scripts/bots/<botname>/`: `index.js` (config + `rollSharedDNA()` + `buildBrief()`), `paths/*.js` (one per creative path; inline brief OR archetype consumed by `scripts/lib/brief-composer.js`), `pools.js` (axis pools), `seeds/*.json` (loaded into the `bot_seeds` table). Shared infra in `scripts/lib/`: `botEngine.js`, `brief-composer.js`, `chaosLayer.js`, `sensoryAnchors.js`, `twoPassPolish.js`, `modelPicker.js`, `seed-generator.js`.

**Cadence is DB-driven.** The dispatcher (`.github/workflows/bots-dispatcher.yml`, every 15 min) reads `bot_schedules` for due bots and shells out to `scripts/run-bot.js`. To change a bot's cadence: `UPDATE bot_schedules SET posts_per_day = N WHERE bot_name = '<name>';` — no code commit, no app deploy.

**Path rotation is flat round-robin.** Every bot sets `cycleAllPaths: true` with no `pathWeights`; each path posts exactly once per cycle before the bag reshuffles. Cycle state persists via `bot_run_log` count % cycle-size.

**Entry points:** `scripts/run-bot.js` (production, called per due bot), `scripts/iter-bot.js` (dev iteration; `--bot`, `--count` default 5, `--mode`, `--post` required for live), `scripts/qa-bot-model-matrix.js` (HTML matrix — when Kevin says "run an HTML matrix on `<bot>`", just run it with defaults: 1 render per (path × model), `--post` on; full protocol in the playbook).

---

## Sparkle + Pro

**Costs (DB-tunable, no deploy).** Base dream = `engine_config.base_sparkle_cost` (default 1). First dream is free (server-side). Nightly dreams are Pro/trial-only (free users post-trial get none). Welcome bonus = `engine_config.welcome_sparkle_bonus` (default 25), granted on onboarding completion. 5 sparkle packs (15/40/90/200/500) — **source of truth is the `sparkle_packs` table** (migration 255), read by the store UI (`useSparklePacks`) AND `revenuecat-webhook`; `constants/sparklePacks.ts` is the offline fallback. Pro monthly bundle = `engine_config.pro_monthly_sparkle_bundle` (default 75; yearly = 12×). (There is no "fusion" cost — the Twin/Fuse feature was removed; DLT renders cost the base.)

**Pro perk.** Long-press save-to-photos for HQ downloads + a nightly dream every night. Trial = `engine_config.pro_trial_days` days on signup (default 14). Purchase flow: app → RevenueCat SDK → Apple → RevenueCat webhook → `revenuecat-webhook` Edge Function → `grant_sparkles` RPC or pro flag flip. RevenueCat webhook secret: `REVENUECAT_WEBHOOK_SECRET` (Supabase Edge secrets). Setup: `SPARKLE_PAYMENTS_SETUP.md`, `PRO_SUBSCRIPTION_SETUP.md`, `SPARKLE_PRICING_STRATEGY.md`.

---

## Onboarding

5 data steps (welcome, locations, dream cast, mood sliders, reveal) wrapped by 5 info/selector screens (4 InfoStep cards + bot_selector) — 10 total UI screens in the STEPS array, orchestrated by a single pager at `app/(onboarding)/index.tsx`. Profile saves on first dream generation (not just on post).

- **Locations:** curated 63 location cards (`location_cards` DB table). Min 3 / max 10. Stored as `dream_seeds.places[]`. NEVER free-text — locations come from cards with rich essence data.
- **Dream Cast:** photo upload for self + plus_one. Llama Vision (`describe-photo`) generates descriptions. Relationship picker for +1.
- **Mood Sliders:** 4 bipolar (peaceful↔chaotic, cute↔terrifying, minimal↔maximal, realistic↔surreal).
- **Reveal:** first-dream generation via the `nightly-dreams` engine with a forced cast face swap; post / skip; 25-sparkle welcome; welcome notification.

VibeProfile v2 is the only supported format (legacy v1 + `aesthetics`/`art_styles` favorites + `objects/things` were ripped out — migrations 216 + 218).

---

## Working With Kevin

**Team.** Kevin is the sole human dev; Claude is the other dev. No PR review. All agents commit directly to `main` — no feature branches. Kevin keeps concurrent agents on different areas; when they collide, resolve in real time. **Don't edit files outside your task's scope** — if another agent has WIP in the working tree, leave their files alone.

**Screenshots.** When Kevin asks to view one: `ls -t ~/Desktop/*.png | head -1` then Read it.

**Node scripts.** `export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && node <script>`.

**Deploying Edge Functions.** `supabase functions deploy <name> --no-verify-jwt`. **Always `--no-verify-jwt`. Deploy immediately after editing — don't wait to be asked.** Active functions: `generate-dream`, `nightly-dreams`, `dream-queue-worker`, `face-swap-dual`, `restyle-photo`, `describe-photo`, `classify-photo`, `extract-style`, `revenuecat-webhook`, `send-push`, `refund-self-moderation`, `refund-stuck-jobs`, `upscale-image`.

**Migrations.** Files in `supabase/migrations/`. Run manually in Supabase dashboard SQL editor (DDL can't go through the JS client). Before adding one: `ls supabase/migrations/ | grep ^NNN` to check prefix collisions. For follow-ups to an existing number, use `NNNa_`, `NNNb_`.

**Running the app — `dreambot` zsh function** (in Kevin's `~/.zshrc`, NOT the repo). `dreambot` = Debug + Metro tab (daily-dev default). `dreambot --release` = Release build (no `__DEV__`, no Metro) — required to test Sentry + PostHog (both gated on `!__DEV__`). `--clean` forces `expo prebuild --clean`. Flags combine.

**Dev build for native modules.** Must use dev build via Xcode, not Expo Go. After adding native packages: `cd ios && pod install && cd ..` then rebuild.

**Running nightly dreams locally.** `node scripts/nightly-dreams.js` (reads `.env.local`).

**Setting a sparkle balance.** Inline node one-liner with `SUPABASE_SERVICE_ROLE_KEY` from `.env.local` → `users.update({sparkle_balance:N}).eq('id', kevinUserId)`. Project URL: `https://jimftynwrinwenonjrlj.supabase.co`.

**Kevin's user ID.** `eab700d8-f11a-4f47-a3a1-addda6fb67ec`.

**Observability.** Sentry (`@sentry/react-native`, gated on `EXPO_PUBLIC_SENTRY_DSN` + `!__DEV__`) and PostHog product analytics (`posthog-react-native`, same gating). Manual Sentry test: Settings → "Run Dream Generator" (admin) → 🐛 top-right. PostHog MCP available via `.mcp.json` (project DreamBot, id 442133). Full picture: `memory/project_observability_setup.md`, event taxonomy: `ANALYTICS_PLAN.md`.

**Notifications.** Two layers — in-app inbox (the `notifications` table → `useInboxGrouped`) and push banners (`send-push` Edge Function → Expo). Push is fired by a DB trigger on `notifications` INSERT (migration 196); to send any push, just insert a notification row. Architecture: `NOTIFICATIONS_ARCHITECTURE.md`.

---

## Hard Rules (no exceptions)

- **NEVER unscoped deletes on `bot_seeds` or `nightly_seeds`.** Scope by category prefix. `SELECT category, count(*) GROUP BY category` BEFORE any delete. The April 2026 incident wiped both tables with one unscoped delete.
- **NEVER `git add -A` or `git add .`.** Always explicit paths — Kevin runs multiple agents in the same working tree; everything you don't recognize as yours stays unstaged.
- **NEVER edit another agent's WIP files.** Edit only files in your task's scope.
- **NEVER use `as Function`, `as any`, `as unknown as <type>` to bypass types.** Regenerate types instead: `supabase gen types typescript --linked 2>/dev/null > types/database.ts`.
- **NEVER fire-and-forget critical RPCs without `.catch` that logs in dev.** Silent failures lived for months on `record_impression`.
- **NEVER comment out a rate limit, security check, or RLS policy "for now".** Delete it AND create a follow-up. Comments rot.
- **NEVER use `?.` in top-level module expressions** in `supabase/functions/_shared/*.ts`. Deno Edge runtime crashes (BOOT_ERROR). Use explicit null checks.
- **NEVER enumerate biomes / materials / sub-styles in a path's `promptPrefixByPath`** (or any prompt-prefix that prepends to EVERY render of that path). Flux's CLIP tokenizer attends most to the FIRST-named noun in a comma-separated list and renders ONLY that. The prefix names the REGION; the scene content carries the biome.
- **NEVER propose a bot path migration without re-reading `BOT_SCENE_QUALITY_PLAYBOOK.md` first**, and update it with every new lesson — don't wait to be asked.
- **NEVER add new pixel work to `dualFaceSwap` in-process.** New steps go in a separate Edge Function. Don't introduce another base64 data URI in the swap pipeline — always upload to temp storage and pass URLs.
- **AUDIT mediums + prefixes for accumulated cruft every ~3 months per bot, or whenever a bot's renders feel "off"** (negation cascades, camera-brand stuffing, tech-spec adjectives, travel-magazine register, mountain-photographer tropes, stacked intensifiers). Target: medium `flux_fragment` ≤ 250 chars, path prefix ≤ 120 chars. Method + cruft tables in `BOT_SCENE_QUALITY_PLAYBOOK.md` → "Medium + prefix CRUFT ACCUMULATION".

---

## After-Change Checklists

### After adding / changing a Supabase table, column, or RPC

1. **Regenerate types** — `supabase gen types typescript --linked 2>/dev/null > types/database.ts`.
2. **For UPDATE policies on user-writable tables:** verify `WITH CHECK` OR an UPDATE trigger freezes sensitive columns. Postgres does NOT require `WITH CHECK` on UPDATE — you have to remember. Reference: `migrations/108_uploads_rls_lockdown.sql` `freeze_upload_columns_on_update`.
3. **Smoke-test new RPCs** — especially fire-and-forget ones.
4. **Signature change on existing function:** prepend `DROP FUNCTION IF EXISTS public.<name>(<args>);` before `CREATE OR REPLACE` — Postgres can't change return type in-place (42P13).

### After adding a migration file

1. `ls supabase/migrations/ | grep ^NNN` for prefix collisions.
2. `npx jest __tests__/lib/migrations.test.ts` enforces unique numeric prefixes.
3. Run via Supabase dashboard SQL editor.

### After adding a medium to `dream_mediums`

1. **Insert the DB row.** `key` MUST equal `label.toLowerCase().replace(/ /g, '_')`. Directive ≤ ~150 words, front-load identity rules, avoid female-coded language for any-gender mediums, no camera/composition language.
2. **Add `MEDIUM_CONFIGS` entry in `_shared/photoPrompts.ts`** — without it the photo-restyle path falls through to a generic 1-liner and ignores the directive. After adding, grep for the key to confirm no duplicates.
3. **Update `__tests__/lib/photoPrompts.test.ts` `ACTIVE_MEDIUMS`.** Test fails if step 2 was skipped.
4. **Optional: bot config** — add the key to the bot's `mediums` in `scripts/bots/<botname>/index.js`.
5. **Deploy** `generate-dream` + `restyle-photo`. Smoke-test all 5 user paths (no-hint scene, text prompt, self-reference, photo restyle, photo+prompt). Full reference: `MEDIUMS_FAQ.md`.

### After ripping out a feature

1. Audit DB columns it owned — write cleanup migration for vestigial columns (SightEngine + objects + VibeProfile favorites all left dead state for months before being cleaned up).
2. Search hanging RLS references, triggers, RPCs that read those columns.
3. Search type definitions that mention the feature.

### Auto-QA loop (when Kevin says "run an automated QA loop on path X")

Self-driven, no human review per round. Tag every render `auto-qa: <path> R<N>` for filtering. Batches of 5 with `--post`. Read the JPEG, grade 0–5, identify the failing layer (composition prepend / Sonnet brief / action pool / medium / swap pipeline), make ONE change per round, document in `memory/project_auto_qa_<path>.md`. Stop at 3 consecutive 4.5+/5 rounds OR 20 rounds OR Kevin stops. Cross-reference Kevin's hearts every ~5 rounds.

### Seed tables — `bot_seeds` vs `nightly_seeds` (separate; never cross-contaminate)

- **`bot_seeds`** — per-bot, `used_at` lifecycle, auto-regenerates when exhausted.
- **`nightly_seeds`** — 8 pools × 100 slotted templates for user nightly dreams; permanent, random pick.

Bot seed cleanup: `.delete().like('category', 'botname_%')` — scoped. Nightly seed refresh: `node scripts/generate-nightly-seeds.js`.

---

## Pre-Commit + Test Lanes

A husky pre-commit hook runs `./scripts/check-secrets.sh` then `npm run check` (prettier → lint → tsc → typecheck:deno → jest). Don't bypass with `--no-verify` — every historical bypass broke CI.

```
npm run check          # full pre-commit gate
npm run fix            # auto-fix prettier + lint
npm run test           # jest fast suite
npm run test:dbspec    # live-DB lane (CI only — no local Postgres on Kevin's Mac)
```

**Two test lanes.**

1. **Fast jest** (`*.test.ts`, husky + CI `check`) — pure logic. `_shared/*` Deno modules importable via `@engine/*`; URL imports stubbed in `__tests__/__mocks__/`. Tests that import `@engine/*` are excluded from `tsc` — add new ones to `tsconfig.json` `exclude`.
2. **Live-DB** (`*.dbspec.ts`, CI `db-tests` job only — a `postgres:16` service container) — for SQL invariants (`ON CONFLICT`, `FOR UPDATE SKIP LOCKED`, triggers, security-definer fns). Fixture pattern: FK-stub tables + the real DDL extracted from the migration file via `__tests__/db/_support/pg.ts`. Currently covers: `claim_upscale_job`, `claim_dream_queue_jobs` SKIP LOCKED, `is_pro_active`, `freeze_upload_columns`, notification opt-in, rate-limit inserts. RLS not yet covered. Validate changes by pushing + `gh run watch` the `db-tests` job — no local Docker.

---

## GitHub & CI/CD

**Repo:** `konakevin/dreambot`. `main` is the trunk.

**Workflows (`.github/workflows/`):**

- `ci.yml` — tsc, lint, prettier, jest, db-tests on every push
- `nightly-dreams.yml` — `0 8 * * *` UTC: enqueue jobs for Pro/trial users
- `bots-dispatcher.yml` — every 15 min: read `bot_schedules`, run due bots
- `refund-stuck-jobs.yml` — every 5 min: sweep `dream_jobs` >5min processing
- `upscale-sweep.yml` + `upscale-smoke-test.yml` — drain + smoke-test upscale queue
- `dream-queue-monitor.yml` (hourly) / `ai-failure-monitor.yml` (6h) / `push-failure-monitor.yml` (6h) / `bot-health-monitor.yml` (4h) — fail-loud monitors → GitHub's built-in failure email

Secrets used by crons: `SUPABASE_SERVICE_ROLE_KEY`, `REPLICATE_API_TOKEN`, `ANTHROPIC_API_KEY`.

---

## Reference Docs (in repo root)

- **Bots:** `BOT_SCENE_QUALITY_PLAYBOOK.md` (canonical brain), `BOTS.md`, `BOT_MODEL_TALLY.md`, `BOT_AXIS_REFACTOR_PLAN.md`, `BOT_PREFIX_NEED_TO_REVIEW_AND_FIX.md`
- **Engine + scaling:** `NIGHTLY_DREAM_ENGINE.md`, `NIGHTLY_SEED_POOL_QA.md`, `NIGHTLY_QA_HANDOFF.md`, `QUEUE_WORKERS_REFACTOR.md`, `V4_HARDENING_PLAN.md`
- **Features:** `MEDIUMS_FAQ.md`, `DLT_FIDELITY_PLAN.md`, `DLT_PUT_ME_IN_SCENE_PLAN.md`, `COMMENTS_IMPLEMENTATION.md`, `UPSCALE_QUEUE_PLAN.md`, `UPSCALE_HARDENING_PLAN.md`, `NOTIFICATIONS_ARCHITECTURE.md`
- **Money:** `SPARKLE_PAYMENTS_SETUP.md`, `SPARKLE_PRICING_STRATEGY.md`, `PRO_SUBSCRIPTION_SETUP.md`
- **Other:** `AUTH_PROVIDERS.md`, `BUNDLE_ID_MIGRATION.md`, `ANALYTICS_PLAN.md`, `LAUNCH.md`, `DREAMBOT.md` + `DREAMBOT_CHARACTER.md` (personality)
