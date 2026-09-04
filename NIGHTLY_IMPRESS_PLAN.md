# Nightly "Always Impress" — Improvement Backlog

**Goal (Kevin, 2026-09-03):** guarantee nightly dreams always impress — raise the quality
FLOOR (nothing broken/boring ever ships) and the CEILING (more fun, pretty, cool moments).
Each item below is scoped so a fresh agent can pick it up cold: context, design, files,
QA gate, done criteria. Statuses: ⬜ todo · 🟡 in progress · ✅ live.

Born from the 2026-09 quality campaign (background-drowning fix, zoom regression, senior
identity anchors, camel-render seed scrub — see `NIGHTLY_FUN_SCENARIOS_PLAN.md` playbook
sections + git log `77c51204..f88bce24` for the full failure-mode education).

**Priority order (Kevin-endorsed): #1 → #2 → the rest as appetite allows.**

---

## 1. ✅ Render-time quality gate ⭐ — LIVE (enforce) since 2026-09-03 · PROFILE check added 2026-09-04

**State (2026-09-04).** Two closed questions now: BROKEN (re-SWAP retries) + PROFILE (Kevin: "no side
profiles, I hate that view" — strict side view / turned away; three-quarter views exempt) → a
PROFILE fail triggers a FRESH RENDER + swap (a re-swap can't fix a side-on base image). Calibrated
with the production judge (Sonnet): 8/8 good pass (0 false positives), 4/4 broken caught incl. the
new `broken-profile-faces` fixture (the old_hollywood QA render). `scripts/eval-quality-gate.ts`
now defaults to the prod judge. Telemetry stamps: `quality_gate:enforce:fail:profile`,
`quality_gate:rerender:N`, `cleared_after:N`, `shipped_unresolved`, `profile_dual_noretry`.
**HOTFIX 2026-09-04 (3722d04b):** the PROFILE re-render re-ran the couple swap with a bare
dispatch (no split check / identity gate / gender-safe degrade) and once shipped an UNSWAPPED
re-render (Kevin's hearted canyon couple). Now: dual + profile → no retry (verified swap ships,
stamped); solo re-render → identity-gated; null swappedUrl = failed attempt. **FOLLOW-UP:** make
the retry run `genderSafeDualSwap` (the main path's verified pipeline) so couples can re-render
on profile too. Worth a look at fleet
telemetry after a week of enforce (fail rate by flag, retries, judge cost) — no date, just a note.

**Problem.** Every nightly ships sight-unseen. The Tiffany camel render (sunglasses fused
across her and the camel, extreme zoom) and the Michele render (74yo +1 rendered as a
40yo) reached real users because nothing LOOKS at the image before it ships. Prompt-side
fixes kill known slop classes; the gate catches the unknown ones.

**Design (agreed with Kevin).**

- After render+swap, before notify/upload-finalize: one Haiku vision call grading the
  image on hard checks: expected face count present + faces a sane size (not filling
  frame, not tiny), background/setting visible, no fused/malformed props or limbs, no
  blank/empty composition, creature present if `seed_source.scene` promised one.
- **Fail → RE-ROLL** (fresh scenario/medium/seed — NOT a same-prompt re-render; a gate
  failure usually means the combination is cursed). Max `engine_config.quality_gate_max_retries`
  (**default 2**, new column, live-tunable, 0 disables gating cost instantly).
- **Exhaustion → ship the BEST-scoring attempt** (keep a score per attempt). A mediocre
  dream beats a missing dream — same philosophy as never-faceless + identity ship-best.
- **Fail-open**: vision API error/timeout → ship ungated. The gate must never become a
  new way for dreams not to arrive.
- **Telemetry**: stamp `quality_gate:pass|fail:<reason>|retry:N|shipped_best` into
  `fallback_reasons`. New monitor: fleet gate-fail-rate alarm whose threshold DERIVES
  from the config (hard rule: config-coupled alarms derive, never hardcode + CI test).

**Files.** `supabase/functions/nightly-dreams/index.ts` (post-swap, pre-uploads-insert —
near the dup-detect block ~line 3515 which is the architectural twin: fetch output,
analyze, conditionally re-render). Vision call via `_shared/` Haiku helper (see
`describe-photo` for the pattern; keep probes justification-free — Haiku refuses
"justified" vision probes, see memory). Config: `engine_config` migration + catalog entry.
**Gotchas.** Renders hold DB connections — retries stay inside the existing render's
lifecycle (no new enqueue). Budget: cap total attempts across the fleet via the existing
per-user daily budget. Deploy needs delete+redeploy (isolate staleness).
**QA gate.** Offline `persist:false` batch of 10 with the gate in shadow mode (log,
don't act) → verify verdict quality vs my eyeball; then enable retries; then 20-render
natural batch, confirm 0 shipped-slop + retry rate <15%.

## 2. ⬜ Legendary dreams (raises the CEILING — build second)

**Concept.** ~1-in-30 nightly rolls upgrade to a "legendary" treatment: premium model
(flux-2-max / best per DreamSmart), extra-cinematic brief language, and a special in-app
presentation (badge/frame/animated reveal — client work). Collectible rarity = daily
open-the-app excitement + shareable "look what I got" moments.
**Design.** `engine_config.legendary_pct` (default ~3, INERT at 0 until client ships).
Roll early in nightly; when it hits: force best model, add a "masterpiece" brief
directive (SET DRESSER mantra language, golden-hour/epic-light bias), stamp
`legendary:true` in `rolled_axes` + a new `uploads.is_legendary` boolean (migration —
remember column-level grants: `GRANT SELECT (is_legendary) ON public.uploads TO anon,
authenticated;`). Client: badge on DreamCard + reveal moment (separate task).
**Files.** nightly-dreams roll block (~line 600 chaos pre-roll area), `uploads` migration,
DreamCard client component. **QA:** 6 offline legendary-forced renders vs 6 normals —
the difference must be VISIBLE or the rarity is fake; Kevin grades.

## 3. ⬜ Holiday build-out (Christmas first)

**State.** Only Halloween is seeded (325 dual + 330 single, `pool='holiday'`,
category='halloween') behind `holidays_enabled=false` (Kevin: keep seasonal ones dark
until their window). The holiday ENGINE is done (migs 437-439, `holidays` table, per-
season pcts, `holidayScenarioLoader`) — this is a pure CONTENT task.
**Do.** Author Christmas/winter-holidays buckets in the generator scripts (same
ACTIVE_BUCKETS pattern, `--pool holiday`, category='christmas'), seed 25 → QA renders →
Kevin sign-off → scale to ~300 like Halloween. Then Valentine's, Easter, July 4th,
Thanksgiving, New Year (the `holidays` table rows already define seasons/windows —
check `select * from holidays`). **Rules:** dark by default; action scrub + proximity
scan post-seed; culture-specific festival wording banned (Diwali/Obon lesson — generic
"floating-lantern night" style only); no rendered TEXT on clothing.
**QA.** Per-bucket 8-10 renders via `force_holiday_scene` QA flag, Kevin grades in
Preview or his album. **Kevin 2026-09-04: Halloween must be the HERO of every seed/render (no
"me in a scarf + pumpkins in the bokeh"); cozy = decorated neighborhoods, pumpkin patches, yards
with TONS of jack-o-lanterns; NO medium pinning (rolls like every pool). Full direction + the
sub_theme matrix protocol: `HOLIDAY_DREAMS_PLAN.md` (bottom).**

## 4. ⬜ Season/weather awareness

**Concept.** Location dreams that know the user's real season/weather: "it snowed in
your dream too." Huge magic-per-effort.
**Design.** Users already have places; at nightly enqueue (scripts/nightly-dreams.js) or
render time, resolve the DREAM location's current season + a coarse weather (free
wx API or pure season-from-latitude-and-date math — start with SEASON ONLY, zero deps).
Bias the biome TIME/WEATHER axes toward it (never force — weight it, keep variety).
`engine_config.seasonal_weather_pct` (how often the bias applies, default ~40).
**Files.** nightly-dreams axis roll (where `timeAxis/weatherAxis` come from
biome_config), maybe `_shared/seasonBias.ts` (pure fn + jest). **Gotcha:** southern
hemisphere; imagined/fantasy locations skip the bias entirely.
**QA.** Force a winter-biased batch offline, verify snow shows up in-season and variety
survives (not 10/10 snow).

## 5. ⬜ Pet cameos

**Concept.** Users with pets in their dream cast almost never see them in nightlies.
A pet-companion roll on plain-location dreams = pure joy content (Delight = PURE JOY).
**State.** Pet cast members exist (role='pet' in dream_cast, species in description —
the species-preserving cleaner from the dream-art work lives in generate-dream). Nightly
CAST selection currently picks self/plus_one humans; pets render only via create modes.
**Design.** `engine_config.pet_cameo_pct` (default ~15): on a plain-location SOLO dream
where the user has a pet, append a companion beat: "accompanied by their <species>, <
brief look>, at their side" into the action/scene slot (NEVER near the face — prop/
creature positioning rules apply; the pet is small/medium, at their feet/side).
**Files.** nightly-dreams solo location branch + `locationActionBeat.ts` (companion-
aware variant). Pet species from the cast member's description via the existing
extract helpers. **Gotchas:** companion animals compound with scene animals (bird-
saturation lesson) — suppress cameo when the scene already has creatures; no pet on
scenario/active paths (choreography conflicts). **QA:** 8 offline renders across
dog/cat users (qa on Kevin's account — he has pet cast? verify; else test fixture user).

## 6. ⬜ Taste learning (per-user roll bias)

**Concept.** Bias each user's nightly rolls toward what they demonstrably love — hearts
(`uploads.liked`/reaction rows), downloads, DLT-reuse — so perceived quality climbs
without new content. "Dreams that learn you."
**Design.** Nightly already reads last-7 logs for anti-repeat (L6); extend: compute a
light preference weight per medium/vibe/scene-kind from the user's positive signals
(heart = strong, download/share = medium, DLT = strong) over trailing ~60 days, cap the
bias (e.g. favorites get 2x weight, never exclusivity — variety is sacred, mood sliders
still rule). Pure function + jest lock, then wire into the medium/vibe/scene rolls.
`engine_config.taste_bias_strength` (0 disables).
**Files.** nightly-dreams roll sections + new `_shared/tastePrefs.ts`; signals from
`uploads` (which columns record hearts? verify — engagement counters are grant-withheld
on client but service-role readable; likes may live in a reactions table — check
`likes`/`post_likes` schema first). **QA:** simulate on Kevin (his hearts are known:
watercolor/train/library/surf) — verify bias shows in 20-roll distribution vs control,
and that non-favorites still appear.

## 7. 🟡 Content depth quick wins — A ✅ · B ✅ (41/41, QA'd 2026-09-04) · C ⬜

**State (2026-09-04).** A (pose pools) DONE: glamour 139 (99 dual + 40 solo), dynamic 100,
dynamic_solo 100, playful 100. B (goofy/elegant top-off) DONE: every dual bucket at 100, every
single elegant bucket at 100, single goofy 90-180 (Kevin: no trimming — "more the merrier";
100 is just a round number). ~1,640 new scenes since 2026-09-03. QA done on the new rows:
proximity scan 0 violations; near-dupe pass (60-char key, oldest kept, newer DISABLED never
deleted) 53 rows; pose-language scrub (authoring rule "no pose/gaze language — framing is
layered downstream"): 52 dual + 273 single-goofy rewrites, single-elegant clean; 17 forced-
bucket renders VIEWED (Kevin's private Dreams album): 15 graded 3.5-5, the beanbag seed
(giant_scale, June row) reworded after costing 2 swap attempts, ONE render-side failure
(old_hollywood dual rendered both in profile despite a correct frontal prompt — identity
0.37/0.48 cleared the floor, and the BROKEN-only gate has no profile check → candidate
extra gate check). **Engine bug found + FIXED by this QA:** solo special scenes rendered in
MODERN clothes (victorian_f "bustle gown" seed → "dusty rose blazer" in the prompt) because
`characterSlotPrompt.ts` appends the real-world TRAVELER wardrobe rule ("contemporary travel
clothes", seed attire only as "inspiration") whenever `realWorldLocation` is true, and nightly
passed `!imaginedLocation` even for authored scenes; dual path keeps attire verbatim so only
solos drifted. Fix: `realWorldLocation: dualSpecialScene ? false : !imaginedLocation`
(nightly-dreams, deployed 2026-09-04) — re-renders: burgundy velvet bustle gown + greatcoat/
cravat, both 5/5. **Also done (Kevin's calls, 2026-09-04 pm):** pre-existing goofy/elegant rows scrubbed too
(583 rewrites applied; 64 over-condensed rewrites skipped, originals kept; proximity scan 0).
Forensics gap ROOT-CAUSED + FIXED: the `ai_generation_log.upload_id` backfill was a
fire-and-forget UPDATE issued right before the Response — the isolate dropped it most of
the time (~85% of dual nightly log rows over 3 days had upload_id null, not just 4/17); now
awaited. Historical null rows NOT repaired (30-day retention makes it moot soon). The 11
`scripts/_tmp-*` leftovers deleted. C (thin location topics) NOT started.

**Original scope:**

- Pose pools below par: `action_poses` glamour=32, dynamic=30, dynamic_solo=30,
  playful=56 → expand each to ~100 via the pose generators (check
  `scripts/generate-*pose*` / POSE_POOLS_DB_MIGRATION_PLAN.md); swap-safe envelope +
  proximity scan; verb-variety rule (no leading verb >2x — first-example anchoring law).
- Goofy/elegant categories at 69-85 (dual goofy: out_and_about 85, decade_eras 85,
  glamour_shot_retro 85, surreal_absurd 85, time_travel 70, animal_mayhem 70,
  fantastical_silly 70, fun_activities 70, party_carnival 70, giant_scale 70,
  absurd_everyday 69; dual elegant: most at 70) → top to 100 (`--per` = N NEW rows in BOTH
  generators, every pool; verify by COUNT after each bucket; per-bucket
  sequential, action scrub + near-dupe pass + proximity scan after — see the
  MANDATORY BACKSTOP section in NIGHTLY_FUN_SCENARIOS_PLAN.md).
- Thin location topics: coastal_escapes (5 locs), high_life (8), scifi_space (7) →
  ~10+ each via the location build pipeline (dream-shoot skill + LOCATION_SEED_PLAYBOOK).
  Also: `landmarks_wonders` display/name nit — "Ancient Wonders"→"World Wonders" +
  SECTION_META placement (client cosmetic, Kevin's call).

## 8. ⬜ Multi-night story arcs (most ambitious — spec before building)

**Concept.** 2-3 connected dreams over consecutive nights (same world, escalating:
arriving at the castle → throne room coronation). Serial > slot machine.
**Design sketch.** New `dream_arcs` table (user_id, arc_key, step, started_at) + arc
definitions (authored like scenario buckets but ORDERED: step scenes share a world/
wardrobe thread). Nightly roll: small pct starts an arc (`engine_config.arc_pct`,
default 0/dark); if an arc is mid-flight, the next nightly CONTINUES it (respecting the
per-user per-day dedup). Notifications could tease ("your dream continues tonight…" —
Delight rules: joy only). Requires: arc-aware anti-repeat (don't L6-filter the arc's
own location), abandonment rule (arc expires if a step fails 2 nights), and content
(start with 3-5 authored arcs in one bucket-like table).
**Spec fully before building** — touches roll, dedup, notifications, and content
authoring. Write `DREAM_ARCS_PLAN.md` first; Kevin reviews before any code.

---

## Standing rules for whoever picks these up

- Re-read `NIGHTLY_FUN_SCENARIOS_PLAN.md` (playbook + scrub rules) and CLAUDE.md hard
  rules first. Seed 25 → QA → sign-off → scale. Proximity scan after any dual seeding.
- Every render-affecting change: verify by VIEWING offline renders (`persist:false` on
  Kevin's account = zero in-app traces) and show Kevin proof via `open <file>` (Preview)
  or his private Dreams album — images viewed with the Read tool are invisible to him.
- New tunables = `engine_config` columns (live, no build); config-coupled alarms DERIVE
  from the config + CI lock.
- Narrate: found → changing → proof → next. No silent tool-chains.
