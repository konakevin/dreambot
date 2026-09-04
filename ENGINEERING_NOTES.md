# DreamBot — Engineering Notes (read-when-relevant)

Niche procedures split out of `CLAUDE.md` so they don't bloat every session. Read the
relevant section only when doing that kind of work.

---

## After-change checklists

### After adding / changing a Supabase table, column, or RPC

1. **Regenerate types** — `supabase gen types typescript --linked 2>/dev/null > types/database.ts`.
2. **UPDATE policies on user-writable tables:** verify `WITH CHECK` OR an UPDATE trigger freezes
   sensitive columns. Postgres does NOT require `WITH CHECK` on UPDATE — you must remember.
   Reference: `migrations/108_uploads_rls_lockdown.sql` `freeze_upload_columns_on_update`.
3. **Smoke-test new RPCs** — especially fire-and-forget ones.
4. **Signature change on an existing function:** prepend `DROP FUNCTION IF EXISTS public.<name>(<args>);`
   before `CREATE OR REPLACE` — Postgres can't change return type in-place (42P13).

### After adding a migration file

1. `ls supabase/migrations/ | grep ^NNN` for prefix collisions (highest prefix is currently 455).
2. `npx jest __tests__/lib/migrations.test.ts` enforces unique numeric prefixes.
3. **Apply it: `node scripts/apply-migration.mjs NNN`** (prefix or path; `--dry-run` first for anything
   destructive). Posts the file to the Management API SQL endpoint — identical to pasting it into the
   dashboard SQL editor: runs as `postgres`, whole file = ONE implicit transaction (all-or-nothing;
   `CREATE INDEX CONCURRENTLY` can't run there — split it out and run with `--no-record`). On success
   the prefix is recorded in `supabase_migrations.schema_migrations` as a double-apply guard (`--force`
   overrides). Auth = the Supabase CLI keychain token (or `SUPABASE_ACCESS_TOKEN`). **NEVER
   `supabase db push`** — the CLI history was empty until 2026-09-04 (427 files pasted by hand), so
   push would try to replay everything from 001. The repo directory stays the source of truth.
4. Follow-ups to an existing number use `NNNa_`, `NNNb_`.

### After adding a medium to `dream_mediums`

1. **Insert the DB row.** `key` MUST equal `label.toLowerCase().replace(/ /g, '_')`. Directive ≤ ~150
   words, front-load identity rules, avoid female-coded language for any-gender mediums, no
   camera/composition language.
2. **Add a `MEDIUM_CONFIGS` entry in `_shared/photoPrompts.ts`** — without it the photo-restyle path
   falls through to a generic 1-liner and ignores the directive. Grep the key after to confirm no dupes.
3. **Update `__tests__/lib/photoPrompts.test.ts` `ACTIVE_MEDIUMS`.** The test fails if step 2 was skipped.
4. **Optional bot config** — add the key to the bot's `mediums` in `scripts/bots/<botname>/index.js`.
5. **Deploy** `generate-dream` + `restyle-photo`. Smoke-test all 5 user paths (no-hint scene, text
   prompt, self-reference, photo restyle, photo+prompt). Full reference: `MEDIUMS_FAQ.md`.

### After ripping out a feature

1. Audit DB columns it owned — write a cleanup migration for vestigial columns (SightEngine + objects +
   VibeProfile favorites all left dead state for months before cleanup).
2. Search for hanging RLS references, triggers, RPCs that read those columns.
3. Search type definitions that mention the feature.

### Auto-QA loop (when Kevin says "run an automated QA loop on path X")

Self-driven, no human review per round. Tag every render `auto-qa: <path> R<N>`. Batches of 5 with
`--post`. Read the JPEG, grade 0–5, identify the failing layer (composition prepend / Sonnet brief /
action pool / medium / swap pipeline), make ONE change per round, document in
`memory/project_auto_qa_<path>.md`. Stop at 3 consecutive 4.5+/5 rounds OR 20 rounds OR Kevin stops.
Cross-reference Kevin's hearts every ~5 rounds.

### Seed tables — `bot_seeds` vs `nightly_seeds` (separate; never cross-contaminate)

- **`bot_seeds`** — per-bot, `used_at` lifecycle, auto-regenerates when exhausted. Cleanup is SCOPED:
  `.delete().like('category', 'botname_%')`.
- **`nightly_seeds`** — 8 pools × 100 slotted templates for user nightly dreams; permanent, random pick.
  Refresh: `node scripts/generate-nightly-seeds.js`.
- HARD RULE: NEVER unscoped deletes on either (the April 2026 incident wiped both with one). Always
  `SELECT category, count(*) GROUP BY category` first.

---

## Admin / DB-driven config catalog

The remote-config spine is **`engine_config`** (singleton row id=1), read by all three runtimes (client
`useEngineConfig` → `get_engine_config()` RPC; Edge `_shared/engineConfig.ts`; scripts
`scripts/lib/engineConfig.js`). Every field has a code FALLBACK — a missing row never breaks anything.
Holds: `base_sparkle_cost`, `welcome_sparkle_bonus`, `pro_trial_days` (the 3-runtime trial value),
`prompt_max_length`, `photo_preprocess_*`, `nightly_max_jobs`, `nightly_enabled` (master kill-switch),
`nightly_require_*`, `pro_monthly_sparkle_bundle`, `dream_queue_max_concurrent` (light cap 40),
`dream_queue_max_concurrent_heavy` (heavy cap 10), cast-detection regexes, and the nightly distribution
knobs (chaos tiers, embodied/face-swap rates).

Other DB-driven config tables: `dream_mediums` / `dream_vibes` (directives/flux fragments/flags +
`client_meta` jsonb for new client-driving attrs, migration 251); `bot_config` (per-bot dials overlaid
on code — `allowed_models`, medium/vibe locks, `chaos_enabled`, `two_pass_polish_enabled`; NULL = pure
code); `mood_axes` (onboarding sliders; axis keys are a typed contract); `sparkle_packs` (pack sizes);
`bot_schedules`/`bot_seeds`, `nightly_seeds`, `location_cards`. Full audit + design: `ADMIN_CONFIG_PLAN.md`.

**Deliberately still code:** the scene-engine algorithm (`sceneEngine.ts`/`dreamAlgorithm.ts`/
`recipeBuilder.ts`), bot paths/pools/prose, sanitization/chaos/face-swap dispatch, the nightly cron time.

---

## Bot system architecture

The 18 bots: bloombot, brickbot, chibibot, dinobot, dragonbot, earthbot, faebot, gothbot, mangabot,
mechbot, oceanbot, pixelbot, retrobot, starbot, steambot, tinybot, toybot, yumbot. Active in
`bot_schedules` at 3 posts/day (fleet-wide, set 2026-08-06). Multi-provider (Flux + Gemini + GPT Image 2); per-bot model lineups in
`BOT_MODEL_TALLY.md`; the `uploads.model` column records which model rendered each post.

Each bot is a self-contained module under `scripts/bots/<botname>/`: `index.js` (config +
`rollSharedDNA()` + `buildBrief()`), `paths/*.js` (one per creative path; inline brief OR archetype
consumed by `scripts/lib/brief-composer.js`), `pools.js` (axis pools), `seeds/*.json` (loaded into
`bot_seeds`). Shared infra in `scripts/lib/`: `botEngine.js`, `brief-composer.js`, `chaosLayer.js`,
`sensoryAnchors.js`, `twoPassPolish.js`, `modelPicker.js`, `seed-generator.js`.

Cadence is DB-driven: `.github/workflows/bots-dispatcher.yml` (every 15 min) reads `bot_schedules` for
due bots → `scripts/run-bot.js`. Change cadence: `UPDATE bot_schedules SET posts_per_day = N WHERE
bot_name = '<name>';` — no commit, no deploy. Path rotation is flat round-robin (`cycleAllPaths: true`,
no `pathWeights`); cycle state persists via `bot_run_log` count % cycle-size.

Entry points: `scripts/run-bot.js` (production), `scripts/iter-bot.js` (dev: `--bot`, `--count` default
5, `--mode`, `--post` required for live), `scripts/qa-bot-model-matrix.js` (HTML matrix).

GOTCHA: every bot-render runtime needs `GEMINI_API_KEY` + `OPENAI_API_KEY` or ~40% of runs fail → the
5-fail auto-deactivation kills bots. The GH Actions dispatcher env must carry both.

---

## Onboarding flow

5 data steps (welcome, locations, dream cast, mood sliders, reveal) wrapped by 5 info/selector screens
(4 InfoStep cards + bot_selector) — 10 UI screens in the STEPS array, orchestrated by one pager at
`app/(onboarding)/index.tsx`. Profile saves on first dream generation.

- **Locations:** curated 63 `location_cards` (DB). Min 3 / max 10. Stored as `dream_seeds.places[]`.
  NEVER free-text — locations come from cards with rich essence data.
- **Dream Cast:** photo upload for self + plus_one. Llama Vision (`describe-photo`) generates
  descriptions. Relationship picker for +1.
- **Mood Sliders:** 4 bipolar (peaceful↔chaotic, cute↔terrifying, minimal↔maximal, realistic↔surreal).
- **Reveal:** first dream via the first_dream cascade (dual → single → scene) on the `dream_queue` →
  `first-dream-render`; forced cast face swap; post/skip; 25-sparkle welcome.

VibeProfile v2 is the only supported format (legacy v1 + `aesthetics`/`art_styles` favorites +
`objects/things` were ripped out — migrations 216 + 218).

---

## Architecture decisions — deliberate non-fixes (don't re-flag)

A whole-codebase audit (2026-07-06) surfaced these as "issues." Each was triaged and
INTENTIONALLY left as-is. The reasoning is recorded so the next audit (or agent) doesn't
re-open them. Fixing any of these is a net-negative churn on working, load-bearing code.

- **Pro-state logic lives in three runtimes** (`lib/proStatus.ts` client, `scripts/lib/
  nightlyEligibility.js` cron, `is_pro_active()` SQL). This is NOT a single-source-of-truth
  violation: the SQL fn is the ONE enforcement point (re-validates on every real Pro action).
  The client/cron copies are caches of a *display* value — a wrong client verdict only mis-shows
  a paywall, never grants access. The one thing that could drift (trial length) is already
  single-sourced from `engine_config.pro_trial_days`, and `proStatus.test.ts` +
  `isProActive.dbspec.ts` lock the three into agreement. Codegen/RPC-per-render "fixes" add
  latency + build complexity to chase a test-guarded, low-impact drift.

- **`generate-dream` / `nightly-dreams` are large (~2000+ lines).** They're *orchestrators* of a
  long linear pipeline (auth → scene roll → model pick → LLM → image → face swap → persist). The
  reusable logic is ALREADY extracted into `_shared/*` (dreamAlgorithm, sceneEngine, recipeBuilder,
  the brief builders, faceSwap, dualSwapDispatch). What remains is sequential glue you read
  top-to-bottom anyway. Splitting it scatters one readable sequence behind indirection and risks a
  bug in money/render code for zero behavioral gain. Extract only opportunistically, when a piece
  genuinely wants to be reused.

- **~12 components call `supabase.from(...)` directly.** Most are one-shot reads where a hook
  wrapper adds ceremony and nothing else. The audit's specific "duplicate users fetch"
  (ModelPicker vs UsernameNudge) is FALSE — they run different queries (own-row `pro_mode_flux_model`
  vs another-row username-availability lookup). There is no genuine own-user-read duplication worth
  consolidating; leave the one-shots alone.

**Actually fixed from that audit** (so they're not mistaken for open items): the solo-swap guard +
surprise-resolver tests (migration-era regression locks), the per-IP first-dream cap
(migration 332 + `claim_first_dream_ip`), the JWT-in-logs redaction, and restyle price labels now
DB-preferred (`resolveRestyleCost`, so a dashboard price change can't leave a stale label).
