# Admin Configurability Plan — patch generation config without a client deploy

Status: **AUDIT + PLAN (approved scope, not yet implemented)** — 2026-06-07
Goal (Kevin): be able to configure/patch/fix most-to-all of **mediums, vibes, bot
dreams, nightly dreams, and user dreams (Create screen)** from the backend — ideally
without ever shipping a new React Native client build. Scope = **everything**
(incl. bot/nightly creative config). Admin surface = **DB / Supabase dashboard**
for now (an in-app admin UI can come later on top of the same tables).

---

## 0. The framing — three tiers of "how slow is a change"

Every piece of generation config falls into one of three tiers. The whole point
of this plan is to move config UP this list (toward 🟢):

| Tier | Where it lives | Time to change | Risk |
|---|---|---|---|
| 🔴 **Client-gated** | baked into the RN app (`constants/`, `components/`, `app/`) | **App Store review — days** | High: slow, can't hotfix a bad launch |
| 🟡 **Code-only** | bots (`scripts/`) + Edge Functions (`supabase/functions/`) | git commit + Edge redeploy / next cron — **minutes** | Medium: needs a dev + deploy, no admin edit |
| 🟢 **DB-driven** | a table row (`dream_mediums`, `engine_config`, …) | **instant SQL / dashboard edit** | Low: anyone with dashboard access, reversible |

**The bite points are 🔴 (and the bot/nightly 🟡 that should be 🟢).** Edge redeploys
are fast and reviewless, so 🟡→🟢 is lower priority than 🔴→🟢 — but the approved
scope includes both.

---

## 1. Current state — what's ALREADY 🟢 (the good news)

A lot is already DB-driven; this plan builds on it, doesn't replace it.

- **Mediums** — the full `dream_mediums` row is live: `directive`, `flux_fragment`,
  `kontext_directive`, `flux_dev_prompt_template`, `face_swap_directive` /
  `face_swap_flux_fragment`, `allowed_models`, `scene_eligible_models`, and every
  gating flag (`is_active`, `is_public`/`is_bot_only`, `is_scene_only`,
  `is_character_only`, `nightly_skip`, `is_dream_eligible`, `is_scene_eligible`,
  `face_swaps`, `character_render_mode`). Client reads via `get_dream_mediums` RPC
  (`hooks/useDreamStyles.ts`, 5-min cache); Edge reads via
  `_shared/dreamStyles.ts:fetchMediums`. `dlt_clean_mediums` similarly live.
- **Vibes** — full `dream_vibes` row live (`label`, `directive`, `description`,
  `sort_order`, `is_active`, `is_dream_eligible`). `get_dream_vibes` RPC +
  `_shared/dreamStyles.ts:fetchVibes` / `resolveVibeFromDb`.
- **Model costs** — `image_models` table authoritative; client `useImageModels()`
  fetches it live (constants are fallback), Edge `_shared/modelPricing.ts` loads it
  per-request (60s cache).
- **Bot cadence + on/off + seeds** — `bot_schedules` (`posts_per_day`, `active`),
  `bot_seeds` (scoped per bot).
- **Nightly** — `nightly_seeds` (8 pools), per-user enrollment
  (`user_recipes.ai_enabled`), Pro/trial status (`users` columns), medium/vibe
  availability (the same `dream_*` tables).
- **`engine_config`** already exists (holds global `scene_eligible_models`). **This
  is the backbone we extend.**

---

## 2. Bite-point inventory (what's NOT yet admin-configurable)

### 🔴 Client-gated (App Store) — top priority

| # | Bite point | File(s) | What breaks without a build |
|---|---|---|---|
| C1 | **Creation / prompt modes** — mode list, labels, descriptions, scaffolding | `constants/promptModes.ts`, `app/(tabs)/create.tsx` (engine labels/descriptions) | Can't add/edit/disable a creation mode or its copy. ⚠️ `generate-dream` accepts `prompt_mode` but **never uses it** — modes may be client-only/partly vestigial; UNTANGLE before moving. |
| C2 | **Create-screen engine config** — self-ref + relationship **regexes**, prompt `maxLength` (2000), photo preprocessing (1024w/0.8 JPEG), placeholder/hint copy | `app/(tabs)/create.tsx` (SELF_REF_REGEX, RELATIONSHIP_REGEX, lines ~202–270, 565) | Can't tune cast-detection, input limits, upload quality, or any prompt-shaping copy. |
| C3 | **Base sparkle economics** — DreamBot=1, welcome=25, trial=14d, Pro perk copy/amounts | `app/(tabs)/create.tsx:783`, `constants/sparklePacks.ts`, `constants/proPlan.ts` | Can't change the base dream price or perk copy (the `1` is ALSO duplicated server-side). |
| C4 | **Mood model** — the 4 slider axes, labels, defaults | `components/onboarding/MoodSlidersStep.tsx`, `types/vibeProfile.ts` | Can't rename/add/remove a mood axis or change defaults. Feeds `user_recipes.recipe.moods` → chaosTier + sceneEngine. |
| C5 | **RPC schema rigidity** | `get_dream_mediums` / `get_dream_vibes` signatures + `types/database.ts` + client interfaces | Values are live, but sending the client a NEW attribute (Pro-only gate, "beta" badge, new picker rule) needs RPC change + types regen + rebuild. |
| C6 | **Picker UI niceties** — "surprise_me" handling, sort, Face/Art segmentation | `components/StylePickerSheet.tsx` | Mostly DB-driven already (Face/Art is the `face_swaps` flag). Minor — layout/behavior tweaks only. |

### 🟡 Code-only (no App Store, but should be admin-DB)

| # | Bite point | File(s) | Notes |
|---|---|---|---|
| S1 | **Per-bot creative DNA** — `allowedModels`, medium/vibe locks, paths roster, pools, prompt prefixes/suffixes, archetypes, chaos/polish/sensory config | `scripts/bots/<bot>/index.js` + `paths/*` | THE big one. Cadence/seeds are DB; the *look* is code. Dials (models, medium/vibe locks, chaos/polish toggles) can move to DB; paths/pools/archetypes are code modules (see §4). |
| S2 | **Global model lineup** | `scripts/lib/imageModels.js` (`ALL_ENABLED_AI_MODELS`) | Adding a model = 4 manual steps (array, modelPricing, DB row, provider impl). |
| S3 | **Trial duration (14d)** — the 3-runtime hardcoded sync | `lib/proStatus.ts`, `scripts/lib/nightlyEligibility.js`, `is_pro_active()` (migration 176) | Hazard: three copies must stay in sync. Move to one DB value. |
| S4 | **Nightly knobs** — cron time, max-jobs (5000), eligibility predicates, the 8 seed-pool *categories*, scene-engine algorithm | `scripts/nightly-dreams.js`, `.github/workflows/nightly-dreams.yml`, `_shared/sceneEngine.ts` / `recipeBuilder.ts` / `dreamAlgorithm.ts` | Knobs (max-jobs, eligibility filters, trial) → DB. The scene-engine *algorithm* stays code (it's logic, not config). |

---

## 3. Target architecture — the `engine_config` backbone + new tables

### 3.1 `engine_config` — the remote-config spine (extend the existing table)

One typed key/value (JSONB value) table, read by **all three runtimes** (client at
launch, Edge per-request w/ short cache, scripts at run). Collapses C2, C3, S2, S3,
S4 and the trial-sync hazard into one admin surface.

```sql
-- engine_config already exists (scene_eligible_models). Standardize it as:
--   key text PK, value jsonb, description text, updated_at timestamptz
-- Seed the config keys we're migrating, e.g.:
--   'base_sparkle_cost'        => 1
--   'welcome_sparkle_bonus'    => 25
--   'pro_trial_days'           => 14        -- KILLS the 3-runtime sync
--   'prompt_max_length'        => 2000
--   'photo_preprocess'         => {"width":1024,"jpeg_quality":0.8}
--   'self_ref_regex'           => "\\b(I|I'm|...|selfie)\\b"
--   'relationship_regex'       => "\\bmy\\s+(partner|wife|...)\\b"
--   'nightly_max_jobs'         => 5000
--   'nightly_eligibility'      => {"require_onboarding":true,"require_ai_enabled":true}
--   'all_enabled_models'       => ["black-forest-labs/flux-dev", ...]   -- S2
--   'feature_flags'            => {"reposts":true, ...}
```

- **Client:** `useEngineConfig()` hook (TanStack, fetched at launch, short stale) →
  one cached object the create screen / onboarding read instead of constants.
  Constants stay as a **typed fallback** (offline / first paint), DB wins.
- **Edge:** `_shared/engineConfig.ts:getConfig(key)` with a 30–60s cache (mirror
  `modelPricing` pattern). `generate-dream` / `nightly-dreams` read `base_sparkle_cost`,
  regexes-if-server-side, `pro_trial_days`, etc.
- **Scripts:** `scripts/lib/engineConfig.js` reads it for `nightly_max_jobs`,
  eligibility, `pro_trial_days`, `all_enabled_models`.
- **Trial-sync fix:** all three runtimes read `pro_trial_days` from `engine_config`
  (or the `is_pro_active()` SQL fn reads a config row). One source of truth, no
  3-place edit. Keep the existing dbspec test; add one asserting the fn reads config.

### 3.2 `dream_modes` — creation modes as data (C1)

```sql
CREATE TABLE dream_modes (
  key text PRIMARY KEY,          -- 'dream_me' | 'chaos' | 'direct' | ...
  label text, description text, icon text,
  is_active boolean DEFAULT true, is_public boolean DEFAULT true,
  sort_order int,
  use_exact_prompt boolean,      -- DreamBot vs Direct behavior
  scaffolding jsonb,             -- any prompt-shaping params the mode carries
  client_meta jsonb              -- forward-compat passthrough (see 3.4)
);
-- + get_dream_modes() RPC, + a useDreamModes() client hook.
```
**Blocker to resolve first:** confirm whether the 7 `promptModes.ts` modes actually
reach generation (the `generate-dream` `prompt_mode` param is currently unused). If
they're client-only weighting, model that in `scaffolding`; if dead, prune.

### 3.3 `bot_config` — per-bot tunable dials (S1, partial)

Move the **dials** (not the code modules) to DB. A bot's `index.js` reads its row at
run and overlays it on code defaults.

```sql
CREATE TABLE bot_config (
  bot_name text PRIMARY KEY REFERENCES bot_schedules(bot_name),
  allowed_models text[],         -- overrides index.js allowedModels
  mediums text[], vibes text[],  -- medium/vibe locks
  chaos_enabled boolean, two_pass_polish_enabled boolean,
  path_weights jsonb,            -- if/when weighted rotation returns
  overrides jsonb                -- escape hatch for other dials
);
```
- `scripts/lib/botEngine.js` (or each `index.js`) reads `bot_config` and overlays:
  code provides the default, DB overrides. **Backwards compatible** — no row = pure
  code behavior (today's state).
- **Stays code (modules, not config):** paths, pools, archetype templates,
  `mediumStyles`/`promptPrefixByPath` prose, `lookRegister` pools. These are creative
  source, not dials — moving prose to DB is possible but low-value + high-risk vs.
  the seed/playbook workflow. (Revisit per-bot if a specific prose dial is needed.)
- **Already DB:** cadence, on/off, seeds.

### 3.4 RPC forward-compat — `client_meta jsonb` passthrough (C5)

Add a nullable `client_meta jsonb` column to `dream_mediums`, `dream_vibes`,
`dream_modes`, and surface it in the RPCs. New client-driving attributes (a
`pro_only` gate, `badge`, `min_app_version`) go in `client_meta` **without an RPC
signature change or a rebuild** — the client reads `medium.client_meta?.pro_only`.
This is the single change that makes future medium/vibe/mode attributes live-addable.

### 3.5 Mood model (C4)

```sql
CREATE TABLE mood_axes (
  key text PRIMARY KEY,          -- 'peaceful_chaotic' | ...
  label text, left_label text, right_label text,
  default_value real, sort_order int, is_active boolean
);
```
Onboarding reads `useMoodAxes()`; `vibeProfile` defaults come from the rows. Engine
consumers (`chaosTier`, `sceneEngine`) already read `user_recipes.recipe.moods` by
key — adding/removing an axis becomes a DB + recipe-shape concern, not a build.

---

## 4. What stays code — and why (set expectations)

Not everything *should* be DB. These stay in code (🟡), by design:
- **Scene-engine / dream-algorithm logic** (`sceneEngine.ts`, `dreamAlgorithm.ts`,
  `recipeBuilder.ts`, `brief-composer.js`) — this is *logic*, not config. DB-driving
  control flow = a worse, slower interpreter. Tune via the data it reads (seeds,
  mediums, vibes, config), not by moving the algorithm to rows.
- **Bot paths / pools / archetypes / prompt prose** — creative source modules with a
  mature seed + playbook workflow. The *dials* move (§3.3); the modules don't.
- **Prompt sanitization / chaos rules / face-swap dispatch** — Edge logic; redeploy
  is the right lever (fast, reviewless).
- **Sparkle pack product IDs** — bound to App Store Connect / RevenueCat, not ours.

The win condition: **every knob an admin would reasonably reach for is a row; the
algorithms that consume those knobs stay code.**

---

## 5. Phased plan (each phase shippable + independently valuable)

**Phase 0 — `engine_config` backbone.** Standardize the table; add
`useEngineConfig()` (client), `_shared/engineConfig.ts` (Edge),
`scripts/lib/engineConfig.js` (scripts). Migrate **C3 base costs, S3 trial duration
(kills the 3-runtime hazard), C2 limits/preprocessing/regexes, S4 nightly knobs,
S2 model lineup**. Constants become typed fallbacks. *Highest leverage — do first.*

**Phase 1 — Create-screen → config.** Point `create.tsx` + onboarding at
`useEngineConfig()` for the migrated keys; delete the now-dead constants (keep
fallbacks). Verify in `/run` the create flow still works on no-network (fallback).

**Phase 2 — `dream_modes` (C1).** First *untangle the `prompt_mode` dead-param*
(decide: live, client-weighting, or dead). Then table + RPC + `useDreamModes()`.

**Phase 3 — RPC forward-compat (C5).** `client_meta jsonb` on
`dream_mediums`/`dream_vibes`/`dream_modes` + surface in RPCs. One-time; unlocks all
future live attributes.

**Phase 4 — `mood_axes` (C4).** Table + `useMoodAxes()` + recipe-shape handling.

**Phase 5 — `bot_config` (S1 dials).** Table + botEngine overlay (code default ←
DB override). Migrate `allowedModels` + medium/vibe locks + chaos/polish toggles.
Paths/pools/archetypes stay code.

**Phase 6 — Nightly knobs (S4 remainder).** Move cron-time + eligibility + max-jobs
reads to `engine_config`; the cron file stays but reads config. Scene-engine stays
code.

Each phase: migration (dashboard) → regen types → wire the runtime(s) → a dbspec or
smoke test → keep constants as fallback (never a hard dependency on the network).

---

## 6. Cross-cutting requirements

- **Always keep a typed fallback.** A missing/empty config row must degrade to the
  current constant, never crash the create screen or a render. (Same contract as
  `image_models` constants today.)
- **Cache discipline.** Client: launch-fetch + short stale (config changes within a
  session are fine to lag). Edge/scripts: 30–60s cache like `modelPricing`.
- **One source of truth per knob.** When a value moves to DB, the constant becomes
  fallback-only — no two live copies (the trial-duration trap).
- **Validation.** A bad config row shouldn't brick generation — validate on read,
  fall back on parse failure, log in dev.
- **Audit/rollback.** `engine_config.updated_at` + (optional) a small `*_config_audit`
  trail so a bad edit is diagnosable/revertible.
- **Keep the 3-runtime Pro rule honored** — after Phase 0, the rule reads one config
  value across client/cron/SQL; update `__tests__/.../proStatus` + the dbspec.

---

## 7. Open questions to settle before building

1. **`prompt_mode` dead-param** (C1) — are the 7 `promptModes.ts` modes wired into
   generation, client-only weighting, or vestigial? Determines Phase 2 shape.
2. **How far on bot prose** — `bot_config` dials are clearly worth it; do we ever
   want medium-style/prompt-prefix *prose* per bot in DB, or is the seed+playbook
   workflow the right home? (Default: keep prose in code.)
3. **Nightly cron time** — GitHub Actions cron can't read DB; if admin-tunable
   start-time matters, the enqueue must move to pg_cron (DB-scheduled) or read a
   config gate. Worth it?
4. **In-app admin UI** — deferred (DB/dashboard for now), but the tables above are
   designed so a gated admin screen drops on top later with no schema change.
