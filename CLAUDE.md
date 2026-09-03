# DreamBot — Claude Code Guidelines

**Read this whole file before starting.** You are a senior principal engineer here — jump straight into
what Kevin needs. Deep/niche procedures (after-change checklists, admin-config catalog, bot module
internals, onboarding flow) live in `ENGINEERING_NOTES.md` — read the relevant section only when doing
that kind of work; don't preload it. Per-topic docs are indexed at the bottom.

Do NOT auto-start the dev environment. Tell Kevin he can run `/dream` to spin up the dev tools.

## What this app is

DreamBot is an AI dream-image generator for iOS (RN + Expo). Users build a "Vibe Profile" in onboarding
(locations, dream-cast photos, mood sliders); the app generates personalized AI dreams (Sonnet writes a
brief → Flux/Gemini/GPT renders), with creation modes (Dream Me / Chaos / Cinematic / restyle / reimagine
/ Dream Like This / custom), Dream-Cast face-swap (self + plus_one), nightly auto-dreams, a social feed,
Sparkle currency (RevenueCat IAP) + a Pro subscription, and 18 image-gen bots posting to a public feed.

## Stack

- **RN 0.81 + Expo SDK 54**, Expo Router v6 (file-based). **TypeScript strict** — no `any`, `as any`,
  `as Function`, `as unknown as`, `// @ts-ignore` (regenerate types instead).
- **Styling** NativeWind v4 for new code (existing `StyleSheet.create` is fine — match the file).
  **Responsive:** new UI imports `@/lib/responsive` scale helpers (`verticalScale`, `fontScale`,
  `horizontalScale`, `verticalScaleClamped`, `useDeviceClass`); design at the iPhone-14 base (844×390pt),
  no hardcoded numbers in new styles (legacy grandfathered).
- **State** Zustand + TanStack Query v5. **Images** `expo-image` only.
- **Backend** Supabase (Postgres, auth, storage, realtime, Deno Edge Functions, pg_cron).
- **AI** Replicate (Flux) + Gemini (Nano Banana) + OpenAI (GPT Image 2) for images; Anthropic Sonnet
  (briefs) + Haiku (vision/polish/bot messages) for text.

Layout: `app/` (routes), `components/` (~116), `hooks/` (~60), `store/` (6 Zustand), `lib/` (~45 glue),
`constants/`, `types/database.ts` (auto-gen) + `vibeProfile.ts`; `supabase/migrations/` (277 files,
highest prefix 275) + `supabase/functions/` (15 edge fns + ~49 `_shared/`); `scripts/bots/<botname>/`
(18 bots) + `scripts/lib/` (bot infra) + `scripts/*.js`; `__tests__/lib/,store/` (fast jest) +
`__tests__/db/` (`*.dbspec.ts`).

---

## The two dream pipelines

Both render through the shared async **`dream_queue`** and the **`dream-queue-worker`**. One UUID flows
through everything: `dream_queue.id` == `dream_jobs.id` == `job_id` == sparkle-ledger `reference_id`.

### 1. Create — user-initiated, interactive, paid (behind `EXPO_PUBLIC_DREAM_QUEUE_ENABLED`)

Client → **`enqueue-dream`**: auth → per-user in-flight cap (≤5 queued/in_progress) → charge sparkles
(idempotent on `job_id`) → INSERT `dream_queue` (with `weight` light/heavy) + seed `dream_jobs` → kick the
worker → returns `{dream_id}` in <500ms. The loading screen subscribes to the `dream_queue` row via
realtime (`dream_jobs` poll = fallback). The worker claims it under the per-weight cap and dispatches to
**`generate-dream`** (or **`restyle-photo`** for Kontext restyle) on the `x-dream-queue` service path; the
render persists the upload and flips the `dream_queue` row → the client shows the dream. Modes (Dream Me /
Chaos / Cinematic / reimagine / DLT / custom) all flow through `generate-dream`. **DLT** = "Dream Like
This" (re-render from an existing dream's style + the user's prompt).

### 2. Nightly — automated, batch, Pro/trial-only

GitHub Actions cron `0 8 * * *` UTC runs **`scripts/nightly-dreams.js`**, which ENQUEUES one `dream_queue`
job per eligible Pro-or-in-trial user (bots excluded; **paginated** — PostgREST silently caps reads at
1000 rows; per-user-per-day idempotent via `dedup_key`). The worker drains the backlog overnight at the
heavy cap → **`nightly-dreams`** render edge fn → personalizes from `user_recipes.recipe` JSONB via the
shared scene engine → Haiku bot message → dreamer notification. It also sends trial / paid-pro-cancel
reminder pushes. Master kill-switch: `engine_config.nightly_enabled`. Each face-swap nightly rolls a
scene TYPE (live `engine_config` pcts): goofy / elegant / **active** (fun/fantasy adventure buckets +
legacy recreational, `dual/single_scenarios pool='active'`) / plain-location — and a plain-location dream
gets a swap-safe **Option B** action fitting the exact place (`_shared/locationActionBeat.ts`, gated by
`location_action_pct`). To add/scale/tune fun buckets or Option B → **`NIGHTLY_FUN_SCENARIOS_PLAN.md`**
(playbook + gotchas: seed per-bucket sequentially, run the proximity scan, verify via
`ai_generation_log.fallback_reasons`).

**Onboarding first-dream** is its own queue source: `enqueue-dream` (first_dream branch) → `dream_queue` →
**`first-dream-render`**, which runs a cascade (dual → single → scene face-swap) so the user is reliably
cast into one of their places. Free (no charge).

### Shared engine + worker reliability (status of record: `QUEUE_WORKERS_REFACTOR.md`)

- **Scene engine** (shared by all paths): `dreamAlgorithm.ts:rollDream` → `recipeBuilder.ts`/
  `sceneEngine.ts` build a Sonnet brief → Sonnet writes the Flux prompt (sanitized) → model picked
  per-medium → optional face swap → persist (Storage, `uploads` row, `ai_generation_log`).
- **Renders run SYNCHRONOUSLY** — the worker holds the render's HTTP connection (an actively-awaited
  request keeps the isolate alive). It does NOT rely on `EdgeRuntime.waitUntil` for the render: the
  platform dropped `waitUntil` background tasks on 2026-06-17 and silently stalled the queue. The render
  **owns its own `dream_queue` terminal state** (`completeQueueJob`/`failQueueJob`,
  `_shared/dreamQueueLifecycle.ts`) — retry/backoff/dead-letter + refund + notify.
- **Worker invocation = pg_cron every minute + per-enqueue kick (fast path, uses `waitUntil`) + a GitHub
  Actions `x-worker-sync` backstop** (`dream-queue-sync.yml`, every 5 min, held-connection loop) that
  drains even when `waitUntil` is down. `RENDER_TIMEOUT_MS` = 140s for create/DLT
  (`dispatchers/create.ts`) + 120s for first-dream (`dispatchers/first_dream.ts`, shorter because it
  runs a multi-tier cascade) — both under the 150s gateway idle ceiling.
- **PER-WEIGHT concurrency caps are the anti-546 lever**, enforced ATOMICALLY inside
  `claim_dream_queue_jobs_by_weight` (migration 275, per-weight advisory lock — no overshoot under
  concurrent invokers). `weight` set at enqueue (face-swap-likely = heavy, plain text + restyle = light);
  light cap `engine_config.dream_queue_max_concurrent` (40), heavy `…_heavy` (10), both live-tunable.
  Beyond the cap, jobs queue + drain (never fail). **The heavy ceiling is the Fly.io `face-swap-dual`
  service** — scale Fly FIRST (`fly scale count N`, runbook in `QUEUE_WORKERS_REFACTOR.md`), then raise
  the heavy cap.
- **Dual face swap** runs in its own `face-swap-dual` isolate (Fly.io, 2GB; memory separation), routed via
  `_shared/dualSwapDispatch.ts`. Never add pixel work to it in-process (Hard Rules).
- **Pro-state is ONE rule across three runtimes** (keep in sync): `lib/proStatus.ts` (client),
  `scripts/lib/nightlyEligibility.js` (cron gate), `is_pro_active()` Postgres fn (Edge). Pro =
  paid+unexpired OR within trial; **trial length = `engine_config.pro_trial_days`** (default 14) — one DB
  row, read by all three. Change the trial _logic_ in all three together.
- **DB-driven config** (`engine_config` singleton + config tables) tunes generation/economy/UX from the
  dashboard with NO App Store build. New constant that shapes generation/economy/UX copy → ask "should
  this be an `engine_config` field?" (default yes). Catalog: `ENGINEERING_NOTES.md` / `ADMIN_CONFIG_PLAN.md`.

---

## Bots

18 image-gen bots (bloombot, brickbot, chibibot, dinobot, dragonbot, earthbot, faebot, gothbot, mangabot,
mechbot, oceanbot, pixelbot, retrobot, starbot, steambot, tinybot, toybot, yumbot) post to the public feed
**2×/day** (per-bot, DB-tunable via `bot_schedules.posts_per_day`; fleet-wide set to 3 on
2026-08-06, then down to 2 on 2026-08-20). Cadence is DB-driven: `.github/workflows/bots-dispatcher.yml` (every 15 min) reads
`bot_schedules` for due bots → `scripts/run-bot.js`. Each bot is a self-contained module under
`scripts/bots/<botname>/` (config + paths + pools + seeds); multi-provider (Flux/Gemini/GPT). Full
architecture, cadence mechanics, entry points (`run-bot.js`, `iter-bot.js`, `qa-bot-model-matrix.js`):
`ENGINEERING_NOTES.md` + `BOTS.md`. **ALL new-path development happens on AlphaBot, the PRIVATE
proving-ground bot visible ONLY to Kevin (never flip its `is_public`, never add followers, never give it
a `bot_schedules` row) — workflow + promotion checklist in `ALPHABOT.md`.**

> **STOP — before ANY bot work** (config, paths, pools, seeds, archetypes, briefs, or even answering how a
> bot works): re-read **`BOT_SCENE_QUALITY_PLAYBOOK.md` IN FULL** first — the canonical brain (the 10/10
> bar, the 8 components of a memorable scene, per-bot iteration logs, the failure-mode catalog). Prior
> session context is NOT a substitute. **Update the playbook with every new lesson the moment you learn
> it.** When Kevin says "run an HTML matrix on `<bot>`", just run `node scripts/qa-bot-model-matrix.js
--bot <name>` (defaults: 1×/(path×model), `--post` on).

---

## Infrastructure & services (how it ties together)

All four services hang off **one Supabase project** (`jimftynwrinwenonjrlj`), shared by the app AND the
website.

- **Supabase** — Postgres (data + RLS), Auth (email + Google + Apple + Facebook OAuth — `AUTH_PROVIDERS.md`),
  Storage (`uploads` bucket), Realtime (the loading screen + feed), **Edge Functions** (all generation +
  webhooks), **pg_cron** (the queue worker + log retention). Migrations run by hand in the dashboard SQL
  editor; edge fns deploy via CLI (see ops).
- **App Store Connect** — the iOS app + all IAP products. Sparkle packs (`com.konakevin.radorbad.sparkles.*_v2`)
  and the Pro auto-renewing subscription (`com.konakevin.dreambot.pro.monthly` / `.pro.yearly`) are defined
  here, then mirrored in RevenueCat as offerings/packages. Pro entitlement = `'pro'`, offering = `'pro'`
  (`constants/proPlan.ts` is the client source of truth). Bundle/associated-domain:
  `BUNDLE_ID_MIGRATION.md`; listing: `APP_STORE_LISTING.md`; launch: `LAUNCH.md`.
- **RevenueCat** — payment abstraction. Purchase flow: app → RevenueCat SDK → Apple → **RevenueCat webhook
  → the Supabase Edge Function `revenuecat-webhook`** (NOT a web route) → `grant_sparkles` RPC (packs) or
  flips the Pro flag (sub). Secret `REVENUECAT_WEBHOOK_SECRET` (Supabase Edge secrets). Setup:
  `SPARKLE_PAYMENTS_SETUP.md`, `PRO_SUBSCRIPTION_SETUP.md`, `SPARKLE_PRICING_STRATEGY.md`.
- **Website (`dreambot-web`)** — `dreambotapp.com`, a **separate sibling repo** (`../dreambot-web`,
  `github.com/konakevin/dreambot-web`) with its OWN `CLAUDE.md`. Next.js 15 (App Router) on **Vercel**
  (project `dreambot-web`, `prj_6nvTfWZsjgtH1az7NBJ0EnYmyw2E`). Marketing/legal + deep-link share targets
  (`/`, `/privacy`, `/terms`, `/support`, `/post/[id]`, `/user/[id]`); no API routes — reads the SAME
  Supabase project (public feed). **Deploy: `git push main` → Vercel auto-deploys prod.** ⚠️ The GitHub↔
  Vercel integration can silently disconnect (it did 2026-05-28 → 20-day frozen site) — if pushes stop
  deploying, `npx vercel git connect` then `npx vercel --prod`, verify with `npx vercel ls`. Don't
  `npm audit fix --force` (tries to downgrade Next catastrophically).
- **Domain / email** — registrar + DNS/nameservers at **Porkbun** (moved off Wix; nameservers
  `*.ns.porkbun.com`; add/edit records in Porkbun → dreambotapp.com → DNS Records). Apex `A 76.76.21.21`
  + `www CNAME cname.vercel-dns.com` point at Vercel. `support@dreambotapp.com` = **ImprovMX** free
  forwarding → Gmail (`MX mx1/mx2.improvmx.com` + `SPF include:spf.improvmx.com`). **DKIM + DMARC not yet
  set** (SPF only) — outbound-from-domain auth is partial. ImprovMX DKIM value is per-account (grab from
  the ImprovMX dashboard, not a static target). App signup/verification emails are sent by **Supabase
  Auth** (sender/SMTP configured in the Supabase dashboard, NOT this repo) — to send those *from*
  dreambotapp.com you configure custom SMTP in Supabase + that provider's DKIM; ImprovMX DKIM does not
  cover them. (⚠️ A stale Cloudflare "domain removed" email refers to an abandoned onboarding — nameservers
  point at Porkbun, so it's a no-op; ignore.)

Tie-together: **App (RN/Expo, distributed via App Store Connect) ↔ Supabase (all data/auth/storage/edge) ;
payments App → RevenueCat → Apple → RC webhook → Supabase edge ; Website (Vercel) reads the same Supabase
for the public feed + serves deep-link share targets.**

---

## Working with Kevin

- **Team.** Kevin = sole human dev; Claude = the other dev. No PR review; all agents commit directly to
  `main` (no feature branches). Concurrent agents share the working tree — **edit only your task's files;
  never touch another agent's WIP; never `git add -A`/`git add .` (explicit paths only).** Commit/push
  only when asked.
- **Before committing, READ the staged diff (`git diff --cached <paths>`) — explicit paths is NOT enough.**
  In the long-lived shared tree a single file accumulates hunks from MULTIPLE efforts; staging it by
  ownership ("it's my file") can sweep in an unrelated change you didn't mean to land. Specifically watch
  for a **split-dependency partial commit**: committing a file whose new `import` points at another file
  that's still untracked → `main` breaks on a fresh checkout even though everything passed locally. **The
  pre-commit hook validates the WORKING TREE, not the commit** (the imported file exists on your disk, so
  `tsc`/`jest` go green), so it will NOT catch this. Verify the actual hunks, and that any new import's
  target is staged in the same commit. (2026-06-18: committed `settings/index.tsx`'s `resetSparkleIntro`
  import while `SparkleIntroSheet.tsx` stayed untracked → broke `main` silently.)
- **Deploy edge functions.** `supabase functions deploy <name> --no-verify-jwt` — ALWAYS `--no-verify-jwt`,
  deploy immediately after editing. Active (16): `generate-dream`, `nightly-dreams`, `dream-queue-worker`,
  `enqueue-dream`, `first-dream-render`, `face-swap-dual`, `restyle-photo`, `describe-photo`,
  `classify-photo`, `extract-style`, `audit-cast-photos`, `revenuecat-webhook`, `send-push`,
  `refund-self-moderation`, `refund-stuck-jobs`, `upscale-image`.
- **Migrations** run by hand in the Supabase dashboard SQL editor (DDL can't go through the JS client).
  Checklist + prefix rules: `ENGINEERING_NOTES.md`.
- **Node scripts.** `export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && node <script>`. Nightly
  locally: `node scripts/nightly-dreams.js` (reads `.env.local`).
- **Run the app — `dreambot` zsh fn** (in `~/.zshrc`): `dreambot` = Debug+Metro; `dreambot --release` =
  no `__DEV__`/Metro (to test Sentry+PostHog, both gated on `!__DEV__`); `--clean` forces prebuild. Native
  modules need a dev build via Xcode (`cd ios && pod install` after adding).
- **Screenshots:** `ls -t ~/Desktop/*.png | head -1` then Read it.
- **Kevin's user ID** `eab700d8-f11a-4f47-a3a1-addda6fb67ec`; project URL
  `https://jimftynwrinwenonjrlj.supabase.co`. Set a sparkle balance via an inline node one-liner with
  `SUPABASE_SERVICE_ROLE_KEY` from `.env.local`.
- **Notifications.** In-app inbox (`notifications` table → `useInboxGrouped`) + push (`send-push` → Expo,
  fired by a DB trigger on `notifications` INSERT — to push, insert a row). `NOTIFICATIONS_ARCHITECTURE.md`.

## Hard rules (no exceptions)

- **THROTTLE heavy render/seed workloads — the DB connection pool is the shared ceiling.** Producing
  renders (each edge-fn render holds a Postgres connection 20-150s) or bulk-seeding while the pool is tight
  takes the WHOLE APP non-responsive — a recurring incident (root cause + plan: `DB_CONNECTION_SATURATION_PLAN.md`).
  On Small compute the pool idles at ~56/90, leaving only ~34 of burst headroom. So for ANY batch of renders
  or heavy DB work: **cap concurrency ≤3**, and **gate on connection headroom first** —
  `const { waitForHeadroom } = require('./lib/poolHeadroom'); await waitForHeadroom({ min: 25, label });`
  (or `node scripts/check-pool-headroom.js`, exit 1 = tight). Prefer routing bulk renders through the
  `dream_queue` (per-weight concurrency caps) over direct `nightly-dreams`/`generate-dream` calls, and avoid
  the top-of-hour (`:00`) + ~08:00 UTC windows where the crons + nightly already peak. QA render tooling
  (`qa-bot-model-matrix.js`) is already headroom-gated; new heavy scripts must do the same.
- **NEVER unscoped deletes on `bot_seeds` / `nightly_seeds`.** Scope by category prefix; `SELECT category,
count(*) GROUP BY category` first. (The April 2026 incident wiped both with one unscoped delete.)
- **NEVER `git add -A` / `git add .`** — explicit paths only (shared working tree).
- **NEVER edit another agent's WIP files** — only your task's scope.
- **NEVER use `as Function` / `as any` / `as unknown as <type>`** — regenerate types.
- **NEVER fire-and-forget a critical RPC without a `.catch` that logs in dev** (silent
  `record_impression` failures lived for months).
- **NEVER comment out a rate limit / security check / RLS policy "for now"** — delete it AND file a
  follow-up.
- **NEVER use `?.` in top-level module expressions** in `supabase/functions/_shared/*.ts` — the Deno Edge
  runtime crashes (BOOT_ERROR). Use explicit null checks.
- **NEVER enumerate biomes/materials/sub-styles in a path's prompt-prefix** — Flux's CLIP attends to the
  FIRST-named noun and renders only that. The prefix names the REGION; scene content carries the biome.
- **NEVER add new pixel work to `dualFaceSwap` in-process** — new steps go in a separate Edge Function;
  no new base64 data URIs in the swap pipeline (upload to temp storage, pass URLs).
- **NEVER front-load or amplify the scene on a FACE-SWAP prompt** (`_shared/characterSlotPrompt.ts`). The
  face swap needs Flux to render BIG, clearly-separated, frontal faces — `scene_description` stays AFTER
  the framing block, and you never tell Flux the scene "fills the background" / is "rich/layered/dominant".
  Making the scene dominant shrinks the couple → the face-swap-dual detector can't split two clean faces →
  `no_dual_split` → `dual_degrade_single` → both faces merged onto one figure. (2026-06-19: commit 7a1092ff
  did exactly this to "fix plain backdrops" and broke 100%-working dual swaps within minutes; reverted in
  d29c2ddb. Diagnose swap failures via `ai_generation_log.fallback_reasons`, NOT by eyeballing the image.)
- **NEVER propose a bot path migration without re-reading `BOT_SCENE_QUALITY_PLAYBOOK.md` first**, and
  update it with every new lesson.
- **AUDIT bot mediums + prefixes for cruft every ~3 months** (negation cascades, camera-brand stuffing,
  travel-magazine register, stacked intensifiers): medium `flux_fragment` ≤ 250 chars, path prefix ≤ 120.
- **A monitor/alarm threshold that depends on a tunable config MUST DERIVE from that config — never a
  hardcoded value — AND a CI test must lock that on-spec behavior never alarms.** (2026-08-05: the bot
  health monitor's fixed 18h stale threshold false-alarmed the instant fleet cadence went 3×→1×/day,
  because a bot posting fine every ~24h now exceeded 18h. Fixed: threshold derives from `posts_per_day`
  via `scripts/lib/botCadence.js`; the invariant "threshold > posting interval for every cadence" is
  locked by `__tests__/lib/botCadence.test.ts` — which fails in CI if anyone reintroduces a fixed
  threshold. So changing bot cadence "magically" rescales the monitor.) Apply this pattern to any new
  config-coupled alarm.
- **`users` + `uploads` use COLUMN-LEVEL grants (migration 278) — a NEW column is silently
  client-invisible/un-writable until you grant it.** Adding a column to `users` → also `GRANT SELECT
(col) ON public.users TO anon, authenticated;`; to `uploads` → also `GRANT UPDATE (col) ON
public.uploads TO authenticated;` in the same migration, or the client read/update of it fails. Withheld
  on purpose: `users.email` (PII) + the 6 `uploads` engagement counters (anti-feed-gaming) — don't re-grant.
- **EVERY new user-text input MUST pass through `_shared/sanitizeUserText.ts`** (NFKC + control/zero-width/
  bidi strip + prompt-injection neutralization + length cap) before it reaches an LLM/Flux prompt or
  storage — `callSonnet` sends one user-role message with no system/user split, so unsanitized text is read
  with engine authority. Stored fields written via direct PostgREST also get the migration-279 trigger
  (`sanitize_user_text` on users/comments/uploads). `sanitize.ts` is NSFW-softening only, NOT this.
- **POST-SEED HOOK — after seeding/generating ANY dual-character face-swap pose/scene pool, you MUST run
  `node scripts/scan-dual-faceswap-proximity.js` and reword every flagged entry before shipping.** The dual
  swap can only place the +1 (partner) face when the render shows TWO cleanly-separated faces; a seed that
  poses the couple too close (cheek-to-cheek / "standing close" / shoulders touching / leaning into each
  other) makes Flux render the heads adjacent/overlapping → detector can't split (`no_dual_split`) → the
  pipeline degrades to a SELF-ONLY swap and the partner's likeness is silently DROPPED (the "wrong
  partner / wrong female" bug — root-caused 2026-06-21 via the genderage+YuNet probe; it was NOT gender,
  NOT medium, it was face overlap). Reword to dual-swap-SAFE positioning: keep the couple natural and side
  by side, but with a CLEAR GAP between their FACES/HEADS (mirror the `dual_actions.ts` header rule "keep
  heads on separate sides" + the PLAYFUL pool's "a clear gap between their heads"). Dual pose/scene pools
  live in `supabase/functions/_shared/pools/dual_*.ts`; the scan auto-discovers them. Scan must exit 0
  (zero violations) before the seeding task is done.

## CI, tests & monitoring

- **Pre-commit (husky):** `./scripts/check-secrets.sh` then `npm run check` (prettier → lint → tsc →
  typecheck:deno → jest). **Don't bypass with `--no-verify`** (every historical bypass broke CI).
  `npm run fix` auto-fixes; `npm run test` = fast jest.
- **Two test lanes:** **fast jest** (`*.test.ts`, husky + CI `check`, pure logic; `_shared/*` via
  `@engine/*`, URL imports stubbed; `@engine/*` tests excluded from `tsc` → add to `tsconfig.json`
  `exclude`) and **live-DB** (`*.dbspec.ts`, CI `db-tests` job only — `postgres:16` container; FK-stubs +
  real DDL extracted from migration files via `__tests__/db/_support/pg.ts`). No local Postgres — validate
  dbspecs by pushing + `gh run watch` the `db-tests` job.
- **GitHub Actions** (`.github/workflows/`, repo `konakevin/dreambot`, trunk `main`): `ci.yml` (every
  push); `nightly-dreams.yml` (08:00 UTC enqueue); `bots-dispatcher.yml` (15 min); `dream-queue-sync.yml`
  (5 min reliability backstop — held-connection drain); `refund-stuck-jobs.yml` (5 min); upscale
  sweep/smoke. Cron secrets: `SUPABASE_SERVICE_ROLE_KEY`, `DREAM_QUEUE_WORKER_TOKEN`, `REPLICATE_API_TOKEN`,
  `ANTHROPIC_API_KEY`.
- **Monitoring** (fail-loud → GitHub failure email): `dream-queue-monitor` (hourly — stuck/dead-letter +
  worker-liveness + Fly-saturation), `ai-failure-monitor` (6h), `push-failure-monitor` (6h),
  `bot-health-monitor` (4h), and `queue-smoke-monitor` (hourly **synthetic canary** — enqueues a real
  cheap dream + asserts it completes end-to-end, self-cleans; would catch a queue/`waitUntil` outage
  within the hour). **Diagnose a failed dream:** every render stamps stage breadcrumbs
  (`dream_queue.current_stage`, migration 272) + an `ai_generation_log` row; `node scripts/check-forensics.js
[userId]` (or the `dream_forensics`/`dream_forensics_recent` RPCs) stitches a failure to its exact
  stage/model/error. Edge errors → Sentry (`_shared/sentry.ts`, gated on the `SENTRY_EDGE_DSN` secret).
  `ai_generation_log` + terminal queue rows auto-prune to 30 days (pg_cron, migration 274). Client
  observability: Sentry + PostHog (`!__DEV__`-gated; PostHog MCP in `.mcp.json`, project 442133).
  `memory/project_observability_setup.md`, `ANALYTICS_PLAN.md`.

---

## Reference docs

- **Procedures (read-when-relevant):** `ENGINEERING_NOTES.md` (after-change checklists, admin-config
  catalog, bot module internals, onboarding flow).
- **Bots:** `BOT_SCENE_QUALITY_PLAYBOOK.md` (canonical brain), `BOTS.md`, `BOT_MODEL_TALLY.md`,
  `BOT_AXIS_REFACTOR_PLAN.md`, `BOT_PREFIX_NEED_TO_REVIEW_AND_FIX.md`.
- **Engine + scaling:** `QUEUE_WORKERS_REFACTOR.md` (queue status of record + Fly scale runbook),
  `NIGHTLY_DREAM_ENGINE.md`, `NIGHTLY_IMPRESS_PLAN.md` (always-impress backlog: quality gate, legendary dreams, holidays, weather, pets, taste, arcs — each handoff-ready), `NIGHTLY_SEED_POOL_QA.md`, `NIGHTLY_FUN_SCENARIOS_PLAN.md` (fun/fantasy
  scenario buckets + Option B location-fit actions — LIVE, playbook for adding/scaling/tuning),
  `V4_HARDENING_PLAN.md`.
- **Services / money:** `SPARKLE_PAYMENTS_SETUP.md`, `PRO_SUBSCRIPTION_SETUP.md`,
  `SPARKLE_PRICING_STRATEGY.md`, `AUTH_PROVIDERS.md`, `BUNDLE_ID_MIGRATION.md`, `APP_STORE_LISTING.md`,
  `LAUNCH.md`. (Website specifics live in `../dreambot-web/CLAUDE.md`.)
- **Features:** `MEDIUMS_FAQ.md`, `DLT_FIDELITY_PLAN.md`, `DLT_PUT_ME_IN_SCENE_PLAN.md`,
  `COMMENTS_IMPLEMENTATION.md`, `UPSCALE_QUEUE_PLAN.md`, `NOTIFICATIONS_ARCHITECTURE.md`,
  `ADMIN_CONFIG_PLAN.md`, `ANALYTICS_PLAN.md`.
- **DreamSmart (model↔style):** `SMART_DREAM_PLAN.md` (strategy),
  `DREAMSMART_MODEL_VALIDATION.md` (the RUNBOOK — "go set up the DreamSmart config for `<model>`" =
  run `scripts/model-matrix-swap.js` self matrix across every style → grade in an HTML page → set that
  model's per-style `smart_dream_models` membership).
- **Personality / brand:** `DREAMBOT.md`, `DREAMBOT_CHARACTER.md`, `MASCOT_LORE.md` (canonical
  Bot & Taco lore + ad voice). Marketing ad-concept snapshots: `marketing/ad-concepts/`.
