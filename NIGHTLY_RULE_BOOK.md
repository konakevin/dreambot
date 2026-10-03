# DreamBot Nightly Rule Book (official)

The one doc for anyone working on nightly dreams: the engine, its seed pools (holiday, year-round, location spots),
wardrobe, looks, QA and shipping. **Read it in full before any nightly work.**

- **Truth order:** the code and live config beat this book; this book beats every other doc and memory note. When
  this book is wrong, fix it in the same commit as the work that found it.
- **HARD RULE (CLAUDE.md):** every nightly bug fix, enhancement, experiment, pool change or QA finding updates this
  book in the SAME commit: the current-state section it changed, plus each new lesson as ONE bullet in the right
  section, editing the older bullet it refines. A nightly commit without a rule-book hunk is incomplete.
- **Only the true, current state goes in.** Part A was checked against the code and the live database on
  2026-10-02. Lessons in Parts B-D carry the date and source of the measurement that proved them.
- **Labels:** *(code)* = read in the code; *(live)* = read from the production DB; *(measured, date)* = proved by
  renders at that date; *(Kevin, date)* = his decision. Open items and unverified points are in section E3.
- The bots have their own brain (`BOT_SCENE_QUALITY_PLAYBOOK.md`); this book is nightly only.

---

# Part A. How nightly works today (verified 2026-10-02)

## A1. Trigger and queue
- **Two hourly enqueuers** *(code, live)*: GitHub Actions `nightly-dreams.yml` (`0 * * * *`) runs
  `scripts/nightly-dreams.js`, and pg_cron `nightly-enqueue-backstop` (`17 * * * *`) runs
  `enqueue_nightly_dreams(false)`. GitHub crons fire only a few times a day in practice (about 4 runs of each
  "hourly" workflow on 2026-10-02), so **the pg_cron backstop is what enqueues most nights.**
- **Each user fires at local 04:00** in their IANA timezone (`scripts/lib/nightlyTimezone.js`); a missing or invalid
  timezone means 08:00 UTC. `dedup_key = nightly:<uid>:<local date>`, payload `{}`. Bursts are spread 30 s apart,
  60 min max (`nightly_enqueue_spacing_s`, `nightly_enqueue_max_spread_min`).
- **Who gets one** *(code)*: `is_admin` OR Pro (paid and unexpired, or inside `pro_trial_days` = 14) OR Basic paid.
  Same rule in `scripts/lib/nightlyEligibility.js`, the `is_dream_eligible()` SQL function and `lib/proStatus.ts`.
  Also requires `onboarding_completed` and `ai_enabled`; bots excluded. Reads paginate (PostgREST caps at 1,000).
- **Kill switch:** `engine_config.nightly_enabled` (true). `nightly_max_jobs` (5,000) only logs an alert.
- **Worker** *(code, live)*: pg_cron `dream-queue-worker` every minute (plus the per-enqueue kick and the
  `dream-queue-sync.yml` backstop). Every nightly job is `weight=heavy`; heavy cap 3. The worker re-checks
  eligibility and POSTs to `nightly-dreams` (`dispatchers/nightly.ts`). **For nightly the WORKER owns the terminal
  state** (not the render): max 5 attempts, backoff 1m/5m/30m/2h, an `nsfw:` error dead-letters at once, a dead
  letter refunds 1 sparkle and sends a `nightly_failed` notice. Stale `in_progress` resets after 5 min.
- On success the dispatcher writes a Haiku inbox title, `finalize_nightly_upload` (bot message), PostHog
  `dream_created` and the `dream_generated/nightly` notification. `payload.qa_silent` skips analytics + notice.
- Trial / paid-cancel reminder pushes run from `nightly-dreams.js` only in the 08 UTC hour.

## A2. The rolls, in order (`supabase/functions/nightly-dreams/index.ts`)
0. **Recency read** *(code)*: the user's last 7 `ai_generation_log` rows of ANY source (Create, QA and failed rows
   included) feed look, vibe, place, anchor, partner and outfit recency. QA renders on Kevin's account shift his
   real nightly.
1. **+1 roster roll** (recency, or the capacity-retry pin), before the cast type.
2. **Cast hydrate:** `hasSelf` / `hasPlusOne` need a stored description and an http photo.
3. **Holidays** for the user's local date (+1 day after `day_of_evening_cutoff_hour` = 20). One season: its
   `peak_pct`; several: each uses its `stacked_pct`, capped at `holiday_stack_cap_pct` (100). **Live now:** Fall 50%
   alone (Sep 15-30, Nov 1-26); Oct 1-30 = Halloween 50 + Fall 20 = 70%; Oct 31 = Halloween day-of 100%. Christmas is
   inactive with zero holiday rows. First dreams and `force_no_holiday` get no holiday.
4. **Dream type** (`_shared/chaosTier.ts`): live `face_swap_share = 1`, so every user with a described self photo
   gets a face-swap dream; split dual 0.5 / self 0.25 / +1 0.25. No self: embodied at the chaos-tier rate, else
   pure scene. `dream_art_share = 0`. Overrides: day-of (dual if +1, else self), capacity pin, `force_pure_scene`,
   and the L4 floor (`attempt_count >= 3` makes it a pure scene).
5. **Style contract: look + model + vibe** (`_shared/nightlyStyle.ts`, `nightlyLooks.ts`, `nightlyVibes.ts`).
   Surface = scene / couple / solo. Details in A3.
6. **Cast description** for members missing one (Llama-3.2-90B vision).
7. **`rollDream`**; left/right order randomised 50%.
8. **Place** (`dream_seeds.places`, valid picker cards only; none picked = whole catalogue; recent places dropped;
   uniform). A couple on a `couples_ok=false` card gets another place; a scenario card draws its tagged scenarios
   (needs 10+). **Spot** from `location_iconic_spots`: `is_active` + `character_eligible` (cast) or
   `pure_scene_eligible` (scene), monumental-face spots dropped for cast, a not-recent anchor preferred, then uniform.
   The spot is picked before the scene-type roll and goes unused if a scenario wins.
9. **Scene-only holiday** (pure-scene dreams): a `holiday_scenes` row at the holiday pct (100 on day-of).
10. **Scene-type roll** for face-swap casts (`_shared/sceneTypeRoll.ts`): holiday cut first, then goofy 6 /
    elegant 6 / active 8 (couples and solos), the rest renormalised; the remainder is the plain location.
    `adaptiveScenePcts` raises the scenario share below 4 picked places (0 places = 100% scenario). **Scenario
    scope is on** (`nightly_scenarios_location_scoped`): a year-round row reaches a dreamer only through a
    `location_keys` / `location_categories` match on a card they picked; a kind with fewer than 10 matches gets 0%.
    Holiday rows are exempt. A friend +1 loses romantic rows. Shuffle-bag `filterUnseen` / `recordPick`.
    Day-of draws 100% from `<key>_day_of`.
11. **Medium pins and bans:** day-of look pin; a scenario `medium_key` pin; `medium_ban` and the imagined-biome
    photo ban re-roll the look but keep the rolled model.
12. **Cast action** (`_shared/castActionResolver.ts`): biome active pose at 25% on a plain place; scene-first
    (Sonnet authors the action) at 100% on scenario and location solos (not location couples); Option B
    `location_beat` at 75% only where neither applies, so in practice it reaches location couples. An active
    scenario without an `action` gets a generated beat. Action registers at 100%.
13. **Wardrobe** (A5).

## A3. Looks, vibes, models (live)
- **`LOOKS_MINIMAL = true`** (`_shared/nightlyLooksPath.ts:309`) so `looksPath` is always false: production runs the
  "1.2.0 engine with looks". Every nightly stamps `looks_minimal:on`. Code behind `looksPath`, `activeStyle` or
  `looksSlotInputFields` is DEAD (see A9). Only `vibeFragment`, `vibeFragmentPosition`, `lookNeutralFraming` and
  `framingInAnchor` (solos) are carried onto the minimal path.
- **Looks** = `dream_mediums` rows with `nightly_look = true`: **57, 36 enabled** *(live)*. A look can roll on a
  surface when it is active, `nightly_enabled`, and has an approved `nightly_look_approvals` row for that surface on
  any model (scene uses solo approvals). `nightly_surfaces` is NOT read. Roll: family first (equal shares;
  `nightly_legacy_look_pct = 0` so "legacy" is just a family), then by weight, minus the user's last 7 looks
  (never emptying a family). Couple pool 20 looks in 5 families; solo pool 28.
- **Retired** (`nightly_enabled = false`, reason in `client_meta.retired`): every photographic / portrait look
  (technicolor, kodachrome, vintage_film, hand_tinted_photo, film_noir, cinematic_still, baroque_oil,
  gouache_portrait, pastel_*, watercolor_portrait) on 2026-09-18 (Kevin: "kill all headshot type of looks,
  photography or whatever"); painted_animation, soft_pop_art, digital_watercolor; comics, pop_art; salon_realism,
  glamour; classical_oil ("mildly corny") and colored_pencil (renders a paper margin). `nightly_alla_prima` is
  enabled with zero approvals (never rolls). The 6 `halloween_*` looks have no approvals and roll only through the
  Halloween day-of pin (`holidays.halloween.day_of_look_keys`).
- **Vibes:** family-first over `dream_vibes.nightly_pool` with recency 7; excluded: the `subtle` version
  everywhere, `kawaii` on couples, moonlit / starlit / nightshade / stormlight / dark on FLUX couples, and a look's
  `banned_vibes`. 169 pool rows, 115 rollable. The vibe's own `flux_fragment` is carried in at its
  `fragment_position` for solos; **on couples (`narrative_fg`) the vibe fragment always sits at the prompt tail**.
- **Model** *(live `nightly_model_policy`)*: couple and solo primaries `[flux-1.1-pro 100, gemini-2-image 0]`
  (gemini sits at 0 only so its ban is lifted), fallbacks `[flux-2-flex 50, gemini-2-image 50]`; scene
  `[flux-1.1-pro, gemini-2-image, flux-1.1-pro-ultra]` rolled evenly. `model_policy_mode = shadow`, but the table
  drives attempt 1 and the re-render anyway. A model is excluded only by an explicit `approved = false` for that look
  and surface, or a ban (`NIGHTLY_BANNED_MODELS` minus every policy primary). **Untested = eligible.** **There is no
  sparkle cost cap on the live path** (the 2✦ cap lives only in the dead legacy picker).
- **Per-look model pins** (`nightly_look_model_pins`): an active row would replace the policy pool for that look and
  surface. **Both existing rows are `active = false`** (their looks are retired). Route with a pin, never with a 0
  weight (all-zero falls back to uniform) and never with `approved = false` (that is a face-swap quality grade).

## A4. Prompt assembly
- **Sonnet writes JSON slots** (`nightly_slots`: scene description, wardrobe or left/right wardrobe, mood, props,
  action; 2 attempts with violation feedback), and **code assembles the prompt.** Every Anthropic job runs Sonnet 5.5
  (`engine_config.llm_models`; cast_ethnicity on Sonnet 5); 5.5-only prompt tweaks are `llm_prompt_overlays` rows.
- **Solo order** (`_shared/characterSlotPrompt.ts`): shouted gender lock (with a senior lead for 55+, eye colour at
  position 1) → look's `face_swap_flux_fragment` → "looking into the camera" → `wearing <outfit>` (outfit early) →
  **`set at <location> — <hook>`** → action (action early) → vibe fragment (early) → knees-up anchor → identity →
  scene description → vibe fragment (after scene) → framing / integration → mood → props → depth → no-text tail.
  The location is `settingClauseOf(scenario)` (first comma-clause of the first sentence, at most 12 words,
  `_shared/sceneHook.ts`), or the spot, or the place.
- **Couples:** `nightly_couple_engine = experimental` replaces the assembled prompt with `composeExperimentalCouple`,
  variant **`narrative_fg`** (`_shared/coupleComposerX.ts`), one paragraph: look fragment → "A three-quarter length
  two-shot. In the foreground, on the left, <person>, wearing <wardrobe>, looking into the camera; to her/his right,
  with a clear gap between their heads, <person> ..." → beat → "Behind and around them, <place>: <scene>." → faces
  line → props → mood → vibe fragment → no-text tail. No shouted gender lock, no eye colour. `couple_prompt_style`
  (legacy) only shapes the discarded prompt. Scenario couples use `setAtOverride = settingClauseOf(scene)`.
- **Scenario `action` column** (mig 516): a VERBATIM slice of `scene`. The engine cuts it out of the scene by exact
  match and hands it to the action slot; for active solos with no action the whole sentence goes to the action slot.
- Pure scenes and holiday scenes: Sonnet writes the whole flux prompt (`nightly_brief`, 50-75 words).

## A5. Wardrobe and cast appearance (all switches live = true)
- **Outfit plan** (`nightly_outfit_plan`) runs on nightly except holiday rows, costume / location wardrobes and
  scenes with authored attire. Setting from: the scenario row, the spot's words, the card's `outfit_mix`, the
  biome. Garment roll, scene fit (`nightly_outfit_scene_fit`), cold-season block on 13 warm-only looks,
  `outfit_favoured_look_pct = 30`. PLAIN_CLOTHES validator (hoodie, henley, t-shirt, fleece, cargo, joggers, sweater,
  pullover, chinos, jeans, casual, comfortable, practical, everyday, basics) rejects plain wear.
- **Card wardrobes:** imagined or costume cards (`biome_config.costume`, 35 cards) dress from the card's WARDROBE;
  real places use the traveller rule. `nightly_gendered_wardrobe` on: each person draws WARDROBE_MEN / WARDROBE_WOMEN
  on location-wardrobe cards (never on scenario rows). `biome_config.period` adds ", authentic <period> dress".
- **Holiday attire** in the window is colour inspiration only, never the garments; day-of locks a costume at 100%.
- **Eye contact** (`nightly_eye_contact`): couples ", looking into the camera" after each wardrobe; solos after the
  medium. **Age fidelity** (`nightly_age_fidelity`, 55+ only): shouted senior opener for solos, `seniorPersonLead`
  for couples. **Couple hair anchor** ("a full head of <colour> hair", under 55). **Female hair variation 75%** reaches
  SOLOS only (the couple composer bypasses `buildIdentityBlock`). **Eye colour:** solos at position 1; couples none
  (`nightly_couple_eye_lock = false`). Stored hair is a HAIRCUT; styling phrases are stripped at prompt time.

## A6. Render, face swap, fallbacks, gates, persist
- **Model:** `force_model` > pre-picked > the contract's model. NSFW retries x2 then a cross-provider failover
  (not stamped).
- **Couple (dual) swap** (`_shared/dualSwapPipeline.ts`): face-size gate **0.35** of frame height
  (`nightly_max_face_hfrac`; the big-face tier is off); Haiku gender pre-read (counts only with exactly 2 faces, one
  each); wardrobe side check in shadow; swap capacity gate = 1 concurrent nightly swap (slots 2 - reserve 1), wait
  up to 45 s; **Fly `face-swap-dual` only** (no in-isolate engine). A miss = no split, face over 0.35, or identity
  under `IDENTITY_MIN_SIM` (0.35, a secret; seen in stamps).
- **Couple ladder:** 1) the rolled model; 2) ONE re-render on the fallback roll (flex 50 / gemini 50, minus the
  look's rejections), same prompt; 3) ship the best sub-threshold couple if identity >= 0.25
  (`identity_degrade_floor`); 4) degrade: rebuild a genuine SOLO of the self (`assembleSoloFallbackFromDual`, flux,
  knees-up, outfit early) and swap it; 5) last: pure-scene fallback (stamps `SHIPPED_FACELESS`). Capacity errors
  re-queue the job with the couple and +1 pinned (`capacity_retry`, up to 2).
- **Solo swap:** re-render 1 on the same model ("exactly one person" prefix), re-render 2 on the fallback roll;
  Replicate swap chain; identity via Fly `/verify` (re-swap below threshold, unusable below 0.15); floor rungs
  same model then fallback, each needing 55 s left and identity >= 0.35.
- **After a swap:** CodeFormer face restore 0.9; duplicate check against 24 h uploads (Hamming <= 6).
- **Quality gate:** Sonnet BROKEN / PROFILE read on cast renders, `enforce`, up to 2 retries before 100 s; a dual
  re-swap must pass identity; unresolved ships stamped `shipped_unresolved`.
- **Persist:** Fly `image-ops` (original, display, thumbhash), `ai_generation_log`, `uploads` (`is_public=false`,
  `dream_medium` = look key). ALL pixel work runs on Fly (CLAUDE.md hard rule).
- Last 7 days *(live)*: 114 real nightlies, all `looks_minimal:on`; 40 couples all delivered as couples (5 used the
  re-render: 3 gemini, 2 flex); 0 degrades, 0 faceless.

## A7. Switches and rollback levers (one row, no deploy; edge config caches 60 s)
| Switch | Live | Rollback |
|---|---|---|
| `nightly_couple_engine` | experimental (`narrative_fg`) | `production` |
| `nightly_flux_couple_honest_looks` | true | false (album fragments) |
| `nightly_model_policy` weights | above | fallback 100/0 = gemini only |
| `nightly_look_model_pins.active` | both false | |
| `nightly_max_face_hfrac` | 0.35 | |
| `nightly_outfit_plan`, `_outfit_scene_fit`, `_garment_roll`, `_solo_outfit_early`, `_gendered_wardrobe` | true | false |
| `nightly_eye_contact`, `nightly_age_fidelity`, `nightly_couple_hair_anchor` | true | false |
| `nightly_solo_action_early` | true (mig 659) | false |
| `nightly_scenarios_location_scoped` | true | false |
| `llm_models` | 5.5@high | `'{}'` |
| `nightly_enabled` | true | false (kill switch) |
- Each behaviour switch also has a three-state QA flag (`force_<name>`, null = use config) in
  `_shared/nightlyQaFlags.ts`. The restore snapshot `nightly-states/v1.5-narrative.json` (09-18) no longer
  describes the live engine: the outfit, eye, age, hair, gendered, scope, action and LLM switches changed after it,
  and `scripts/snapshot-nightly-state.js` does not capture most of them.

## A8. Observability
- `ai_generation_log`: `fallback_reasons` (stamps), `is_qa`, `rolled_axes` (medium = look, vibe, seedSource,
  castRoles, faceSwapResult, `observability.slotInput` (replayable), `.couplePrompt` (the original couple prompt;
  `enhanced_prompt` holds the solo rebuild after a degrade), `.replicateRawUrl` (the base render before the swap)).
  Auto-pruned after 30 days. `dream_queue.current_stage`: claimed → resolve → flux_render → face_swap → upload.
- **Stamps to read first:** `looks_minimal:on`; `look:` / `look_pool:`; `policy:<surface>:<attempt>:<model>`;
  `model_roll:`; `couple_engine:experimental:narrative_fg`; `vibe_fragment:minimal:<pos>`; `holiday_roll:`;
  `scenario_scope:`; `solo_action_early`; `identity_sim:L/R`; `identity_below_threshold:`; `rerender_for_dual`;
  `dual_degrade_single`; `solo_fallback:rebuilt_solo:`; `pure_scene_fallback`; `SHIPPED_FACELESS`;
  `quality_gate:enforce:`; `qa:force_slot_input`. **Misleading:** `style_shadow:` (a second random contract, not what
  shipped), `policy_shadow:`, `couple_prompt_style:legacy` (that prompt is replaced).
- **The delivered model is in the stamps,** not `uploads.model` / `model_used` (those record the pick; the
  pure-scene fallback and provider failovers are not reflected).
- Tools: `scripts/check-forensics.js [user] [hours]`, the `dream_forensics` RPCs, `scripts/sql-readonly.mjs`
  (jsonb-heavy reads; PostgREST times out), `scripts/nightly-morning-check.js` (its QA filter misses
  `qa:force_slot_input` replays and `qa-nightly-exact` renders).

## A9. Dead code and traps you will trip on
- **The `looksPath` graveyard:** fixes behind `looksPath` / `activeStyle` / `looksSlotInputFields` reach zero renders
  (`LOOKS_HAIR_ECHO`, the `vibe_retry:after_scene` rung, blanked atmosphere axes, `RETRY_SAME_MODEL_FIRST`,
  `LOOKS_SCENE_PCTS`, the 2✦ cap, ultra clamps, `scene_eligible_models`). Before chasing any look / vibe / framing /
  couple symptom, check where the fix lives. Guarded by `looksMinimalInertFixGuard` and `dormantPathTripwire` tests.
- **Inert QA flags:** `force_framing`, `force_photo_priors`, `force_plain_brief`, `force_swap_geometry`,
  `force_looks_path` (all `looksPath`-only).
- **Flags that switch engines:** `force_look` IS `force_medium` and skips the style contract (use `qa_pin_look`);
  `force_face_swap_eligible` makes the render a FIRST DREAM (7 curated styles); any non-null `force_cast_role` routes
  through the first-dream showcase cascade, so forced batches overstate failures (30% vs 9% on true rolls).
- **Stale code comments** (do not trust them): `nightlyStyle.ts:296-301` and `index.ts:1276-1277` on model weights;
  `dreamQueueLifecycle.ts:20-26` (nightly cap 8; the worker uses 5); `index.ts:5198-5201` (solo rebuild twice; it is
  once); `index.ts:6425` (`persist:false` still writes the log and stores the image); `qualityGate.ts` header (it is
  Sonnet, not Haiku); `chaosTier.ts` header splits; `holidayWindow.ts:274` (08:00 UTC run).
- `pure_scene_on_swap_fail` has no column (mig 434 never applied); the code defaults it to on.
- **Look / vibe fidelity:** five hypotheses for "a nightly ignores its look or vibe" were tested 2026-09-16 and three
  rejected with renders; read the table in `docs/archive/nightly/NIGHTLY_LOOK_FIDELITY_INVESTIGATION.md` before
  re-running any of them.

---

# Part B. Rules

## B1. Decision rights
- **No production nightly engine change without Kevin's word.** New work ships opt-in behind a QA flag or an
  `engine_config` switch; promotion is his call (restore point 2026-09-18: "the best it's ever been").
- **A taste remark is not a change request.** Answer, name the levers, stop (09-23 revert).
- **Answer what was asked;** don't build adjacent tooling (09-29 revert). Check `gh workflow list --all` before
  claiming anything runs on a schedule.
- **Never change a pool's essence while fixing it** ("Don't change the fabric/essence of a pool"); unclear intent
  is Kevin's call. **Never scale a pool without his sign-off** ("these look good" is not a scale instruction).
- Seeds where the route IS the dream, retiring a look, holiday odds, a new model, and anything that makes renders
  "safer but plainer" are his calls.
- After Kevin votes: report every vote and the result first ("you picked X in N of M"), then propose, then commit.
- Infra-shaped work: write the plan, get "go"; no detached overnight jobs or local servers without asking.
- No in-app consent / permission prompts for cast, +1s or likeness, ever (Terms cover it).

## B2. Test renders
- **Run as Kevin, into his private Dreams album.** That is correct; never "fix" it. Never delete QA renders (he
  keeps the good ones; cleanup is his).
- **Never write to another real user's account.** Reproduce a user's problem offline (model called directly, local
  files). If their cast is truly needed: `persist:false`, then delete their QA log rows and Storage files (it still
  writes both). Show their likeness only in a local file, never a hosted page.
- **Throttle:** at most 3 renders at once, every one waits for pool headroom (`waitForHeadroom({min:25})`); avoid
  :00. Some old harnesses have no headroom gate (D2): don't use them for batches.
- Images you open with Read are invisible to Kevin: post to his album, open a local sheet, or use `/render-picker`.
- Don't show renders a known upstream defect spoils; fix the path first or label the batch a plumbing proof.
- Render every candidate he asked for; keep every version he likes as its own row.

## B3. Measurement discipline
- **Measure delivered renders, never picked text** (stamps over `uploads.model`). Never say "fixed" before the
  batch; name the test that fails on revert.
- **One variable per batch,** 2+ rounds, repeat a 10-render winner (10-render rounds swing +/- 25 points).
- **Render a same-length null edit before blaming a wording** (a meaningless hyphen "cost scenery" on 09-30).
- Settle order or clause questions with fixed-seed direct renders (3 seeds per arm); an identical picture means the
  model never read the change. Judge look fidelity at n >= 9. Judge couple framing on stamps over 10+ couples vs an
  unchanged control.
- **Before trusting a QA batch, confirm `looks_minimal:on` and `couple_engine:`;** use `qa-nightly-exact.js` for
  true-roll benchmarks.
- Take couple prompts from `observability.couplePrompt`, never `enhanced_prompt`. A forced-entry harness must assert
  the entry was `carried`.
- **identity_sim is not likeness:** ArcFace ignores hair, and a gender cross scores like a correct swap. 100-pair
  calibration (09-14): genuine minimum 0.525, stranger maximum 0.221.
- **Automatic similarity measures are wrong both ways** (C5). Vision graders failed their controls: grade taste by
  eye. Agent grades run harsh on defects and generous on dullness (floor 3/5 for a beautiful image).
- Isolate caches live 60 s after a config change. In zsh, assert the argument count on any batch loop.

## B4. Prompt-craft facts (flux-1.1-pro unless noted)
- **Position, not length:** flux reads the first ~40-100 words.
- **Camera-distance words do nothing** (7-8% faces at any position). **The look fragment sets the framing:**
  photographic fragments give two-face close-ups (52-67%); painted fragments let the scene win.
- **"Photograph" said after the look wins** (classical_oil 2/9 vs 7/9 with `lookNeutralFraming`, now on for all
  surfaces).
- **Face words early pull the camera in** (22% held) - faces line last.
- **The "set at" noun is the stage:** a route there = person centred on a receding route (C2).
- **Late outfits and late actions are dropped** (0/12 each); named right after the medium / after "set at" they land
  (12/12). Both switches are live.
- **Position-1 tokens set attributes** (hair, eyes, age), **not relationships** ("TWO FRIENDS" posed like partners);
  relationship safety lives in the pose pools.
- **Name the people before the scene,** or a grand landscape renders empty.
- Detail cues, never size cues ("fills the background") or permission phrases; never front-load or amplify the scene
  on a face-swap prompt (CLAUDE.md hard rule).
- **Negations leak** (the model attends to the banned noun); the LLM echoes brief text verbatim and over-uses
  examples; "fire" as a noun renders flames; an ethnicity noun beats skin descriptors; skin tone goes on the subject
  noun ("a fair-skinned man") or priors swap race.
- Older men render bearded on flux (12/12) and women's age ignores wording: accepted, don't re-litigate.

## B5. Looks, vibes, models
- **A look is surface and finish only:** no composition words ("cover", "diorama", "storybook plate" shrink the
  couple); a look naming a physical surface (paper, sheet) can render that surface as an object.
- Judge a look on its own fragment with the live composer; old matrix grades measured old composers.
- **Retire a look with the purple quarantine button:** every nightly quarantined since 2026-09-18 04:25 UTC is a vote;
  `node scripts/apply-look-quarantine.js --since=2026-09-18` (dry run, show Kevin), then `--apply` (sets
  `nightly_enabled = false`, keeps approvals). **`--since` has no default:** without it every quarantine ever
  counts. Bookmarks never retire looks or poses.
- No consolidating looks for variety's sake ("variety is fine"); family-first rolling handles skew.
- **Vibes:** the authored fragment carries the vibe (Sonnet's directive words do nothing); early placement reads
  (17/19), tail placement mostly does not (3/20). Fragment rules: <= 140 chars, light on surfaces and subject, no
  sky / cloud / star / moon nouns, no "from above", no medium or composition words. **Night vibes break flux couples**
  (1/10 first-try vs 16/28), hence the exclusion. Keep every vibe version (Kevin liked them all).
- **Models:** flux-1.1-pro stays primary (Kevin: "it does good renders when it works"). **A retry must change
  models** (a same-model couple retry shipped 2 faceless in 20). Ultra is never a couple model (31% vs 56%
  swappable). Economics: primaries <= 5¢, fallbacks <= 6.3¢, nothing >= 7¢ on nightly.

## B6. Couples and face swap
- **The couple prompt is one left-to-right paragraph,** couple named in the foreground before the scene, a clear gap
  between heads, faces last (`narrative_fg`): flux first-try hold 45% -> 92% (37/40), faces median 11-14%.
- **The prompt cannot enforce head geometry on flux;** a plan whose mechanism is "add a geometry clause" is known to
  fail. Wider-framing words doubled degrades (23% -> 40%). Contrasting palettes per side, faces-first and catalogue
  looks under the old prompt all failed.
- **No face taller than 0.35 of the frame ships** (Kevin: "beyond sick of these closeup framings").
- **Couple pose safety lives in the pools** (proximity rules, C3); "face each other" compositions are fine.
- **Never ship a stranger's face:** if no swap holds, the last resort is a people-free scene (people check plus one
  people-free re-render), never an unswapped person.
- **A failed couple degrades to a real solo, never faceless.** Remaining failures are mostly one-sided identity,
  the woman's side 9 of 11 (uninvestigated).
- Grade a swap on the face only ("hair can change, faces don't").

## B7. Cast appearance and wardrobe
- **No plain clothes** ("everyone should be tailored for locations and built to stand out"); **daring over cute,
  variety over dress codes** ("i like the variety in outfits, so leave it"); no outfit lock or freeze. Fix only a
  place misfit (rocker / leather are city-only; an unclassified place takes the city looks, so every city look must
  work anywhere; warm-only looks never roll in cold rows).
- **Every card wardrobe needs a men's list** and every line read (the writer reaches for sheer and heeled on men).
- **Costume dress never goes on a real culture** (Feudal Japan, Ancient Egypt, Silk Road stay unflagged). Gritty real
  worlds get authenticity and fit, not boutique costume; fantasy worlds get full glam.
- **Wild West = the 1860s-1890s frontier only** (Tombstone / Red Dead era); strip modern labels ("National Park",
  "Route 66", "historic district") - they pull in signage.
- Eye colour works only at position 1, both people or neither. Stored hair is a haircut, never a day-of style.
- Age: ~10 years either way is fine (Kevin); seniors use the shouted opener; test on a user's cast only with
  `persist:false` + cleanup.

## B8. Content and scene quality
- **The motto** (09-22): "playful, adventurous, vivid, beautiful, clever." A clean but sober render is a MISS.
- **Work as set dresser, costume designer, cinematographer, lighting lead and editor** (`/dream-shoot`): the person
  genuinely integrated (not a cutout), a believable specific setting, dream-wear, cinematic light, a big frontal
  face. Stellar = 4.5/5 on every lens.
- **Every dream comes from the places the dreamer chose** ("i don't like people getting surprised by types of dreams
  they don't want"); holidays are exempt. **Variety is authored, never left to Sonnet** ("it starts to pigeon hole
  and rhyme"). **No hard pose rules** ("hard rules like that tend to pigeon hole renders"): add weighted entries.
- **Imagined worlds carry no real landmarks** (`--fictional`, `audit-themed-pool-realplaces.mjs`, scan spots for
  refusal text). No real-world ethnic labels inside fantasy worlds. Genre and era cards hold KINDS of places.
- **Never ban a place in code** (24 cards were silently banned for 3 months); hide the card with a DB flag.
- Fun comes from scene and props, never face-hiding costumes (no masks; sunglasses pushed up). Props add to the scene,
  never mandatory.
- Retire concepts the model cannot carry (Land of Giants, Gravity's Off: wording cannot carry scale or physics).
  Cap tweak rounds at ~3, then accept a model limitation.

## B9. Infra traps that bite nightly work
- All pixel work runs on Fly (`image-ops`, `face-swap-dual`); never in an edge isolate (2 s CPU, HTTP 546).
- One swap per Fly machine; scale Fly first, then `fly_dual_swap_slots`, then the heavy cap. A wedged Fly machine logs
  "Starting - budget" twice with no "Done in": `fly machine restart <id>` (nothing restarts it automatically).
- The DB pool is the shared ceiling (CLAUDE.md throttle rule). Never bulk-UPDATE a live user's `uploads` rows
  (realtime storm).
- PostgREST caps reads at 1,000 rows; a null from a stock query right after a migration is a production signal.
- `sanitizeUserText` strips braces and newlines; structured parsers use pipes.
- `_shared` modules ship only with the functions you deploy: redeploy every function that imports a changed module
  (`supabase functions deploy <name> --no-verify-jwt`). Main must match what is deployed.

---

# Part C. Seed pools

## C1. The pools (live 2026-10-02)
| Pool | Table / filter | Live rows |
|---|---|---|
| Holiday couple / solo | `dual_scenarios` / `single_scenarios` `pool='holiday'`, `category` (fall, halloween), `sub_theme` | couple 1,880 (Fall 760, Halloween 1,120); solo 1,843 (743 / 1,100) |
| Holiday scene-only | `holiday_scenes` | 3,033 (1,590 / 1,443; 516 Halloween rows pin a `medium_key`) |
| Year-round couple / solo | same tables, `pool IN ('goofy','elegant','active')`, `category`; `location_keys` / `location_categories` for scope | couple 4,583 (active 2,566 / elegant 965 / goofy 1,052); solo 7,550 (4,704 / 1,410 / 1,436); every row tagged |
| Location spots | `location_iconic_spots` (`spot_kind` wide / medium / intimate / vista, `quality_tier`, `character_eligible`, `pure_scene_eligible`, `is_active`) | 22,760 active; cast 14,365, postcards 13,861 (8,821 both) |
| Location cards | `location_cards` (`biome_config` with SUBJECT_RULE / WARDROBE / imagined / costume / period, `outfit_mix`, `couples_ok`, `admin_only`, `picker_category`) | 163 live place cards, 23 admin-only, 7 scenario cards (admin-only) |
- Columns that matter on scenario rows: `scene`, `attire`, `action` (A4), `pose_pool`, `medium_key` / `medium_ban`
  (holiday cast rows carry none), `gender` (solos: any / female / male), `relationship_scope`, `disabled`.
- `nightly_seeds` (6,665 rows) is read by nothing. `location_spots` still feeds the "scene cluster" block.
- **Surprise dreams** (Create with an empty prompt) draw from ALL active eligible spots regardless of card status,
  so ~1,900 spots per surface on dissolved, dark or held-out cards (hogwarts, robot city) can be drawn (E3).

## C2. How a seed becomes a picture
- **The "set at" line is what flux stages the person ON** (A4): a scenario's first comma-clause (<= 12 words), or the
  WHOLE location spot text. Whatever noun leads it becomes the stage.
- **A route there renders one picture every time:** the person centred on it, the route receding behind. Measured on
  2,346 delivered nightlies (10-02): route word in the first clause -> route-staged solo 41% vs 11% without, couple
  50% vs 13%, scene-only 14% vs 6%.
- Not only route nouns: a feature running away ("a still tannic creek WINDING through the grove", tunnels of
  branches or torii, canals receding) does the same; so can a route mid-seed ("jack-o-lanterns creating a luminous
  PATH").
- Couples barely react to location spot text (the couple composer frames the pair); couple SCENARIO seeds do.

## C3. Writing rules
**Staging**
- Open on a SPOT a person would be at, never on a route: bench, gate, doorway, railing, fountain rim, porch steps,
  lamp post, boulder, a footbridge's side rail, a cafe table. "Boutique doorway on Rodeo Drive", not "Rodeo Drive
  shopping street".
- No running-away words anywhere: winding, snaking, meandering, stretching away, receding, vanishing, leading to,
  curving away, tunnel of.
- A street named after the spot is fine ("doorway on Bozeman's Main Street"); a trailing "beside a lantern-lit Gion
  street" still staged on the street 2/2. A spot must not sit ON or ACROSS the route (a torii across the approach,
  a covered bridge's entrance, a dock's planks): side rail, not deck.
- "On a wall / on a fence rail" puts the person ON TOP, small in frame (a swap failed on it): write "at a wall".
- **A bare doorway, gate or porch-steps opening is safe on nightly:** 0/8 floating doors in a 2026-10-02 probe of the
  riskiest live seeds (doors set into walls, steps on a house, the gate as a fence rail; swaps held). The
  free-standing door seen on FarmBot needs a vista camera and no subject, which nightly never has.
- **When the route IS the dream, leave it:** wild rides, races, chases, a duel step into the street, a procession,
  gags whose joke is being in the road (chess on the highway, a grill in the intersection, a cart racing down an
  aisle). **When the place IS the corridor, rewording does not help:** Times Square's billboard canyon, a covered
  passage, the corn maze, couple docks and piers.

**Wording traps (each measured)**
- **Rain + open ground floods the scene:** "a rain-soaked neon courtyard" rendered the person waist-deep in water 2/2,
  one drifting into swimwear. Never pair soaked / slick / drenched / flooded with an open courtyard, plaza,
  forecourt or square.
- **Seats make people sit:** a rewrite opening on a bench, wall, rim, ledge or steps raised sitting 18-33 points per
  row (solo), ~25 (year-round couples). Mix standing spots (railing, doorway, gate, lamp post, stall front).
- **Invented props repeat:** the rewriter reaches for "fountain rim" everywhere, including places with none.
- Old replay templates carry their own look and action (A photographic look makes a generic photo; "mid-laugh at
  something between them" turns a couple toward each other): that is the template, not the pool.

**Couples**
- Spots where two people stand side by side at the same height (a long bench, a wide gate, a balustrade, a fence
  rail, a long table). Never narrow ones that squeeze them (doorway, window seat, single chair, ladder, staircase)
  or one above the other. Keep "side by side" / "a clear gap between their heads" when the original had it.
- **No proximity words** (cheek to cheek, leaning into each other, close together, shoulders touching...): Flux
  renders the heads adjacent, the detector cannot split them, the +1 is silently dropped.
- **The proximity scan does NOT read DB rows:** `scan-dual-faceswap-proximity.js` checks code pools only
  (`_shared/pools/dual_*.ts`, `*_active.ts`). Holiday couple rows are covered by `holidayPoolLint`; **year-round
  couple DB rows are covered by nothing automatic**, so lint every new or rewritten couple row yourself with
  `scripts/lib/posePoolLint.js` (`lintClassicPoseEntry`; active rows also `lintActivePoseEntry`).

**Voice and variety**
- Holiday cast rows: pure environment, **10-30 words** (the lint's real bound; older docs say 25-40), comma-separated
  phrases, the first clause a NOUN PHRASE (no pose, preposition or person); no camera, size or face words; no face
  occlusion; no gendered garment unless paired ("She in ..., he in ..."); no franchise names; no text-shaped
  objects; a season anchor in every row.
- Year-round rows keep their OWN opening form ("Person at ..." stays "Person at ...").
- Never add a pose, action, person or pronoun in a rewrite. Same place, theme, props and creatures; only the route's
  geometry goes.
- Per card / sub-theme, rewrites must not collapse onto one opening (race-track-garage all became "pit wall" and was
  excluded): count the first nouns before applying.

**Location spots** (authoring detail: `LOCATION_SEED_PLAYBOOK.md`)
- A spot is a BACKDROP, never a pose: 4-10 words, a specific named place, mood-neutral (no time, weather or light
  except on scene-only postcards), no people, no camera or authoring words, no modern labels on historic places.
- Eligibility at seeding: cast = non-wide, scene-only = non-intimate (the live pool still holds 1,223 wide cast spots
  on 54 cards: E3). The engine does not filter cast spots by kind.

**The rewriting LLM's habits (check every batch)**
- Copies example phrases verbatim, several times (grep for them); writes poses into seeds unless told the first
  clause is a noun phrase; echoes the batch label (`[category / pool]`) into the text; reads a camera word as a name
  ("Wide's long timber bar-end stool"); breaks JSON with a stray quote (the tools fall back to a line parser);
  passes things it should flag (Western "main street" spots, sottoportego tunnels). A pass is not proof.

## C4. Authoring and seeding
- **Seed 25 first,** read all 25, render ~5, scale only on Kevin's sign-off (Kevin 06-06: "stick to 25 seed pools
  till you know the new gen script/seeds are working"). Holidays: MVP ~3 rows per sub-theme per surface.
- **Locations** (`LOCATION_SEED_PLAYBOOK.md`, `/dream-shoot`): recipe → set `is_approved` + `picker_category` BEFORE
  global curation scripts (they select on those) → biome (`isValidBiomeConfig`: TIME, WEATHER, CAMERA, PHENOMENA,
  BANS + SUBJECT_RULE, or the wardrobe is ignored) → wardrobe (register-aware; men's and women's lists) → spots
  (`gen-iconic-spots-50.js`, `--fictional` for themed cards) → postcards, scale, grade, eligibility → `qa-location.js`
  (4 surfaces) → batch with `seed-category.mjs`. Scan spots for refusal / meta text before go-live. New cards stay
  `admin_only` until Kevin signs off. `sub_regions` / `must_include` come from the card's own rule, never its spots.
- **Scenario buckets:** `generate-{dual,single}-scenarios.js --pool <p> --buckets <k> --per N` (appends); one bucket
  per process; verify by COUNT. Their built-in dedup is exact text + the last 40 scenes as a ban list (weak: C5).
  Neither runs `posePoolLint` on couple rows: lint them yourself.
- **Holiday pools:** taxonomy in `scripts/lib/halloweenPools.js` (22 pools / 88 subs) and `fallPools.js` (13 / 58);
  share 70 rows per main pool (`ceil(70/subs)` per sub), 160 for day-of; generate with
  `gen-holiday-archetypes.js --holiday <k> --pool <p> --to-share` (lints before insert). Each sub-theme is a
  "promise" every row keeps; write the holiday's definition and its off-list; pass all existing rows of the sub-theme
  as do-not-repeat; never pull in another sub-theme or tradition. Depth is measured at the MAIN pool (picked at equal
  odds): keep 50+ rows each, counted with pagination. A new holiday needs a pool map in `holidayPoolOf`, a taxonomy
  in the lint, costumes if day-of, and a `holiday-day-of-monitor.yml` edit (it hardcodes Halloween).
- Redeploy `nightly-dreams` (or force the sub-theme) before QA on rows seeded the same day: loaders cache per isolate.

## C5. Dedupe and diversity: judged by reading, never by a pattern
- **Never decide "the same idea" with a regex, keyword list or similarity score.** `scripts/lib/ideaSimilarity.js`
  is wrong in both directions: nine "magnolia" near-duplicates that differ by one adjective never merge at any
  threshold, a pool's shared skeleton makes unrelated entries look identical, and a pool a reader found ~1/3
  recombinant scored 0% redundant. Settings moved one pool between 8 and 137 "distinct ideas". If you quote a
  similarity figure at all, give its threshold and basis. Word sweeps run 65-88% false positives ("Christmas fern" is a
  plant, "advent" matches "adventure"): a sweep is a reading list, never a delete queue.
- **What "the same idea" means** (the live judge definitions): scenarios are the same when renders of each would show
  the same situation (same kind of place with the same activity, moment or joke), and sharing the category's theme is
  never sameness on its own. Real-place spots: the same place or feature as the main subject from the same kind of
  view; different features or viewpoints of one landmark are different, and naming a different place does not make
  a different idea when the renders would look the same. Imagined-world spots: the same main subject arranged the
  same way.
- **The procedure:**
  1. Group where the draw happens (one card, one holiday MAIN pool / sub-theme, one scenario category).
  2. Read every row of the group in full and propose same-idea sets with a keeper (the most specific, best written).
     An LLM judge (`scripts/lib/poolJudge.js`) may do this first read, but only as a proposer.
  3. Confirm each proposed pair with a second, pair-by-pair read (the group read alone was wrong ~1 in 10: it paired
     the Arch of Constantine with the Arch of Janus; the scenario judge proposed 2,279 pairs the pair check rejected).
  4. **Read every pair that will be switched off yourself before applying.** Past cleanups (migs 633 / 639 / 654)
     checked a 40-pair random sample instead (40/40 true repeats); see E3.
  5. Prefer making entries distinct over removing them ("we should not just throw out what's there outright, but
     instead just make them actually distinct in idea"); switch rows off (`disabled` / `is_active = false`), never
     delete; never change the pool's essence; never let a pool drop below its floor to remove a near-repeat.
- Cycle length is not repetition: a shuffle-bag cycling a pool is even coverage.

## C6. Cleanup safety
- Location cleanup is four steps (Kevin agreed 2026-09-30, `scripts/clean-location-pools.js`): duplicates after the
  pair confirm; object spots (macro textures, single objects, text) to REVIEW only, every place kept however small;
  drift never automatic (first read, keep-by-default second read, hand review); backfill only pools under 60, with
  S/A spots that pass a duplicate read (a pool stays short rather than take a weak spot).
- One guarded migration per batch (`WHERE id = .. AND scene = <old>`), `--dry-run` first, a before-state JSON kept,
  counts before and after, every edited row read back (a guard skips silently when text changed). Paginate counts.
  No unscoped deletes on seed tables. `scripts/check-location-health.ts` shows no new ERRORs after a location batch.
- Gender tags on solo rows (`tag-scenario-gender.js`): `any` rows need unisex costumes.

## C7. Holidays
- Live levels and day-of rules: A2 step 3. Day-of (Kevin): a dedicated pool drawn 100%, rendered with the approved
  config, logo over it; costumes locked at 100%; reserved by SUB-THEME (`<key>_day_of`). Live day-of depth: 149
  couple / 145 solo / 178 scene.
- Demarcation: Halloween owns pumpkins, costumes and spook; Fall owns foliage (Fall rows mentioning pumpkins are
  dropped); jack-o-lanterns only in specific pools. A bad sub-pool is removed, never down-weighted.
- Rows with no sub-theme form their own `__unsorted` main pool at equal odds (Fall scene-only has 10 such rows).
- **Christmas (not built):** 0 holiday rows; 18 couple + 6 solo `category='christmas'` rows still roll all year in the
  year-round pools; no pool map, lint taxonomy or costumes yet. Plan and picks board: `CHRISTMAS_2026_PLAN.md`
  (deadline ~Nov 20).
- Readiness: `check-holiday-windows.mjs`, `check-holiday-day-of.js --preflight`, `simulate-day-of.mjs`,
  `scan-holiday-pools.js`.

## C8. The fix loop (follow in order)
1. **Measure delivered renders first:** `audit-nightly-composition.js pull --days 30 --out <dir>`, then `calibrate`
   (hand labels), `tag`, `report`. Cast type from `castRoles` / `isDual` (`rolled_axes.dreamType` is unreliable).
2. **Find the cause in the seed text,** per seed against the base rate, not per pool (a pool can look normal while a
   slice of its rows carries the defect; the year-round pools were skipped once for exactly this).
3. **Judge + rewrite** with the pool's tool (E1). Prefilter broad, let the judge decide, batch by sub-theme.
4. **Read EVERY rewrite;** hand-fix misses; exclude what C3 says to leave; `--recheck`; record each exclusion
   (`apply: false`, `why_excluded`).
5. **Render-test each KIND of fix before any row changes** (C9): one test per new rewrite mode or pool type, not per
   row (docks, Times Square and flooded courtyards each failed somewhere new).
6. **Apply as a guarded migration** (C10); verify counts; run the checks.
7. **Commit by explicit path** with this book updated.
8. **Re-measure on production** ~2 weeks later with the same rubric.
- **Estimating a pose share without rendering:** measure p(pose | the opening names X) on tagged delivered renders and
  on the tests' before / after arms, take each pool's pick share from the audit and its changed fraction from the
  migrations' old / new pairs, sum share x fraction x effect, state the inputs and the range, confirm later.

## C9. Render tests
- **Harness:** `node scripts/replay-nightly-seed.js <items.json> <outdir>` replays one of Kevin's nightlies through the
  real `nightly-dreams` with its exact slot input (`force_slot_input`), same model and cast role, seed swapped in.
- **Design:** 10-12 seeds x 2 reps x 2 arms (original vs rewrite), the SAME template for both arms; location tests
  pass `place`; match the cast to the seed (`_f` / female seeds on the +1 template, `_m` on Kevin's).
- **Templates:** after 2026-09-18 with a look still `nightly_enabled` (the harness warns). A template carries its own
  look text and action into every render.
- At most 3 streams; split a long stream by stopping it right after a `✅` line and restarting the rest in a NEW out
  dir (two processes never share one `rows.json`).
- **Read the result three ways:** tag both arms with the audit rubric; compare swap health and identity PER SEED
  (an infra failure such as Fly "Signal timed out" is set aside and named); LOOK at the new arm on a contact sheet
  (`magick montage` needs `-font /System/Library/Fonts/Supplemental/Arial.ttf`). The tag missed the flood and the
  swimwear; the eye did not.
- **Pass bar:** clearly fewer of the defect, swaps no worse, identity no worse once one-off seeds are explained. A seed
  that fails where its original held is excluded, not argued away.

## C10. Applying
- One migration per table per batch; every statement guarded on the text read
  (`UPDATE .. SET scene = <new> WHERE id = .. AND pool = .. AND scene = <old>`); the tools' `--rollback` writes the
  reverse; `--dry-run`, then `node scripts/apply-migration.mjs NNN`.
- **Rewording a scenario `scene` must re-derive its `action`** (mig 516 verbatim slice) with
  `scripts/lib/scenarioSplit.js`; otherwise the engine renders the whole new scene as the place AND the old action
  (mig 665 repaired 15 rows left stale by 660/663/664). `fix-holiday-corridor-seeds.js` now writes that statement.
  Run `node scripts/scan-scenario-actions.js` (must exit 0) after any scenario change.
- **Location spots shared with postcards are SPLIT:** the original row gets `character_eligible = false` (postcards
  keep their text) and a new cast-only row carries the rewrite (`NOT EXISTS` guarded); cast-only spots are rewritten
  in place. Nothing references spots by id.
- Before: every row still holds the old text, and no new text already exists on that card. After: counts by
  read-only query; `check-location-health.ts` for location batches; posePoolLint on couple rows; the action scan
  for scenario rows. Headers like 660-665: why, numbers, exclusions and why, rollback.

---

# Part D. Testing, QA, diagnosis, shipping

## D1. Test lanes
- **Pre-commit** (`npm run check`): prettier, `scan:dual-proximity`, `scan:bot-seed-dupes`, lint, tsc, deno check,
  jest. **CI** (`ci.yml`) runs tsc / deno / lint / prettier / jest and the `db-tests` dbspec lane, but NOT the two
  scans. Neither lane has PostgREST. Fly service tests (`services/face-swap-dual`, `services/image-ops`) run by hand.
- **The render path is an edge function, so its wiring is locked by source-grep guard tests:** `minimalEngineWiring`,
  `dormantPathTripwire`, `looksMinimalInertFixGuard`, `nightlyQaFlags`, `parityQaFlags`, `coupleComposerX`,
  `nightlyStyle`, `coupleFallbackLadder`, `dualSoloFallback`, `swapCapacityGate`, `nightlySwapHealth`,
  `noPixelsInIsolateTripwire`, `llmTuningGuards`, `scenarioShare`, `proStateParity`, plus the CLAUDE.md DB guards.
  Change behaviour, change the guard in the same commit.
- **Read-only guards with no schedule** (run them yourself): `check-nightly-catalog.js` (red today: 21 problems),
  `scan-scenario-actions.js`, `check-location-health.ts`, `scan-holiday-pools.js`, `check-action-registers.js`.

## D2. Harnesses: which to use
| Need | Use | Notes |
|---|---|---|
| True production replica | `qa-nightly-exact.js --round --count` | real queue + worker, no flags; logs `is_qa=false`; output dir hardcoded |
| Seed / spot rewrite test | `replay-nightly-seed.js` | C9 |
| Composition audit | `audit-nightly-composition.js` | read-only vision tags |
| Couple experiments | `lab-couple-round.js` | forced couples; repeat winners |
| One look's reliability | `qa-look-reliability.js <look> <n>` | `qa_pin_look`; n >= 9 |
| Holiday renders | `qa-holiday-renders.js --mode window\|day-of` | |
| New model | `eval-model.js` (`/model-eval`) | `--estimate` first; judge the base render |
| Exact text across models | `lab-flux-slot-bisect.mjs`, `lab-eye-contact-screen.mjs` | direct Replicate, fixed seed, no DB |
| Prompt text only | `force_*` + `dry_run` | still writes `pool_pick_history` |
- **Avoid for batches** (no headroom gate or old engine): `qa-location.js`, `qa-holiday-archetype.js`, `qa-nightly-scene.js`
  (posts to the feed), `qa-nightly-fun.js`, `dual-swap-qa.js`, `qa-nightly-looks-matrix.js` / `-vibes-matrix.js`
  (`force_look`), `qa-nightly-looks-path.js` (dead path), `test-nightly-*`.
- Load tests (`loadtest-*.js`) spend real money.

## D3. Grading signals
- **Hearts are pointers, never ratings;** never mine like or favourite history. **Bookmark = strike** for framing /
  taste analysis only. **Purple quarantine = look-retirement vote** (B5). `/mine-posts` reads quarantines by RATE
  (min 5 renders), separating swap defects from taste; note it reads every quarantine as a bad render.
- `/render-picker`: pick or vote (love / keep / cut) on a private page, read back via ArtifactData; never rank by likes;
  report the result first.
- Parity grading key: 5 = would sit in Kevin's album unnoticed, 4 = album-worthy with a nit, 3 = generic, 2 = flawed,
  1 = broken (album median 4).

## D4. Diagnosing a bad nightly
1. Find the row: `check-forensics.js [user] [hours]` or `dream_forensics_recent`; `dream_queue.current_stage`.
2. Read the stamps (A8): which engine, look, model, attempt; did the couple degrade; identity per side; quality gate.
3. Read `observability.couplePrompt` / `slotInput` and the base render (`replicateRawUrl`) before blaming the swap.
4. Check the seed text and the template mandates before the brief (pool DNA dominates).
5. Bucket random failures by an environmental axis (light, distance, framing) before blaming look or pose.
6. Reproduce with `force_slot_input` on Kevin's account; for another user's dream, offline only (B2).

## D5. Monitoring (real cadence)
- pg_cron (reliable): worker every minute, enqueue backstop :17 hourly, `db-health-snapshot` every minute, log prune
  04:17 daily.
- GitHub workflows (fire ~4x a day whatever their cron says): `dream-queue-monitor` (stuck / dead letters / worker
  liveness / couple degrades; warns when the heavy cap exceeds Fly), `nightly-coverage-sweep` (re-enqueues gaps after
  local 8 a.m.), `ai-failure-monitor`, `edge-546-monitor`, `holiday-day-of-monitor` (hardcodes Halloween),
  `db-health-monitor`, `refund-stuck-jobs`. **The queue smoke canary is disabled and tested Create, not nightly:
  there is no nightly canary.**
- Any alarm threshold that depends on config derives from that config and a test locks it (CLAUDE.md).

## D6. Shipping
- **Pattern:** a behaviour change = an `engine_config` column + a three-state `force_*` flag; ship OFF, measure with
  the flag on Kevin's account, promote on Kevin's word; rollback = one row.
- Deploy every function that imports a changed `_shared` module, immediately, `--no-verify-jwt`. Fly:
  `fly deploy --strategy rolling` with the rollback image noted.
- Migrations: `apply-migration.mjs` (never `supabase db push`); column GRANTs on `users` / `uploads`;
  `#variable_conflict use_column` in plpgsql `RETURNS TABLE`; hint every PostgREST embed; smoke a real select after
  a FK change.
- Commit with `git commit -- <paths>`, read the staged diff, only when asked; update this book in the same commit.

---

# Part E. Reference

## E1. Tools
| Tool | What it does |
|---|---|
| `scripts/audit-nightly-composition.js` | `pull` / `calibrate` / `tag` / `report`: vision-tag delivered nightlies, cluster vs base rate |
| `scripts/fix-holiday-corridor-seeds.js` | judge + rewrite route-staged scenario seeds: `--holidays`, `--table dual`, `--pools goofy,elegant,active`, `--light`, `--recheck`, `--from x --sql y [--rollback]` (writes the action re-split too) |
| `scripts/fix-location-route-spots.js` | same for location spots, with the postcard split; `--linear` for features running away |
| `scripts/replay-nightly-seed.js` | render-test harness (C9) |
| `scripts/sql-readonly.mjs` | read-only production query (`begin read only`) |
| `scripts/lib/poolJudge.js`, `scripts/clean-location-pools.js`, `scripts/clean-scenario-pools.js` | same-idea proposer + pair confirm (C5) |
| `scripts/lib/scenarioSplit.js`, `scripts/scan-scenario-actions.js` | scenario `action` splitter and its guard |
| `scripts/lib/posePoolLint.js`, `scripts/scan-dual-faceswap-proximity.js`, `scripts/lib/holidayPoolLint.js`, `scripts/scan-holiday-pools.js` | couple proximity and holiday row lint |
| `scripts/check-location-health.ts` | live location data vs engine rules |
| `scripts/apply-look-quarantine.js` | apply purple-quarantine look retirements (`--since` required in practice) |
| `scripts/check-forensics.js`, `scripts/nightly-morning-check.js` | diagnosis |
| `scripts/snapshot-nightly-state.js` | save / diff a config snapshot (covers only part of the live switches) |

## E2. Ledger (measured)
| Change | When | Result |
|---|---|---|
| `narrative_fg` couple composer | 09-18 | flux first-try hold 45% -> 92% (37/40), faces median 11-14% |
| Honest look fragments on flux couples | 09-18 | 93% first try / 98% delivered on the catalogue's own text |
| `lookNeutralFraming` | 09-16 | pinned classical_oil read as oil 2/9 -> 7/9 |
| Outfit plan / scene fit / solo outfit early | 09 | 16/16 distinct; misfits 7/51 -> 0/51; outfit kept 0/12 -> 12/12 |
| Eye contact | 09-30 | couples on camera 72% -> 91%, head turns 19% -> 2% |
| Solo action early (659) | 10-02 | scene-object actions 0/12 -> 12/12; corridor-like ~5/12 -> ~1/12 |
| Holiday solo seeds (657/658) | 10-02 | corridor e2e 16/24 -> 5/24 |
| Holiday couple seeds (660) | 10-02 | 11/40 -> 3/40, swaps equal |
| Cast location spots (661) | 10-02 | 12/20 -> 4/20, then 18/24 -> 0/24, swaps 44/44 |
| Running-away features (662) | 10-02 | 18/24 -> 4/24, swaps 24/24 |
| Year-round solo / couple (663/664) | 10-02 | 16/24 -> 3/24; 14/24 -> 3/24, identity equal |
| Expected seated share after 657-664 | 10-02 | 11.5% -> 13-14% of nightlies with a person (estimate) |

## E3. Open items and known gaps (for Kevin to review)
- **Dedupe standard:** past cleanups switched duplicates off after an LLM pair confirm and a 40-pair human sample, not a
  read of every pair. C5 now says read every pair before switch-off. Confirm that standard, and whether to re-review
  the earlier switch-offs (633 / 639 / 654).
- **No automatic proximity check on year-round couple DB rows**, and the generators don't lint them.
- **Surprise dreams draw ~1,900 spots per surface from dissolved / dark / held-out cards** (hogwarts, robot city).
- 1,223 wide cast-eligible spots and 409 intimate scene spots contradict the seeding eligibility rule.
- Couple vibe fragments sit at the prompt tail under `narrative_fg`; vibe visibility on couples was never measured.
- Female hair variation never reaches couples.
- The woman's side drives most remaining couple identity failures; uninvestigated.
- Weak-couple ship rule (identity 0.25-0.35 ships as a couple) has no recorded decision.
- `dual_side_check_mode` was never moved to enforce. No wardrobe / presentation gender check on the solo rebuild.
- No nightly canary; GitHub monitors fire ~4x a day; nothing restarts a wedged Fly machine.
- `check-nightly-catalog.js` is red (21 problems) and gates nothing; the morning check counts QA replays as production.
- QA on Kevin's account shifts his own nightly's recency window.
- The restore snapshot and its tool no longer cover the live switches.
- Halloween day-of looks have no approval rows; `halloween_classical_oil` stays in the day-of set though
  `nightly_classical_oil` was retired for taste.
- Christmas pools, map, lint taxonomy and costumes are not built; 24 year-round Christmas rows roll all year.
- ~10-15 Western "main street" spots the route judge passed; the 2026-10-16 re-measure of migs 657-664.
- 5 live cards have `sub_regions` but an empty `must_include`; Fall scene-only `__unsorted` rows share equal odds.
- `nightly_seeds` (6,665 unused rows) awaits cleanup. The `LOOKS_MINIMAL` dormant path still exists (deleting it
  needs Kevin's go).
- Unverifiable: `IDENTITY_MIN_SIM` is a secret (0.35 read from stamps).
- **Housekeeping questions (2026-10-02):** keep `NIGHTLY_IMPRESS_PLAN` / `NIGHTLY_PAIR_ROLL_PLAN` / `NIGHTLY_DIRECTOR_PLAN`
  as open specs or fold them into a backlog here? Take a fresh restore snapshot (the 09-18 one predates most live
  switches) and retire the four older `nightly-states/` files? Is `DREAM_CAST_GOLIVE_RUNBOOK.md` done (was the Dream Cast
  announcement ever turned on)? `BACKFILL_SEED_STATE.md` and `docs/MEDIUMS_VIBES_STATE.md` are written by scripts, so
  they were left in place though stale. `scripts/generate-nightly-seeds.js` / `generate-dream-templates.js` still write
  the unused `nightly_seeds`.

## E4. Related docs
Kept alongside this book (status of record or still-true reference):
- **Content:** `CHRISTMAS_2026_PLAN.md` (Christmas build, picks board), `LOCATION_SEED_PLAYBOOK.md` (authoring cards and
  spots), `SCENARIO_LOCATION_SCOPE.md` (scenario scope + the 1.11.0 picker go-live), `HOLIDAY_DREAMS_PLAN.md` and
  `HOLIDAY_DAY_OF_PLAN.md` (holiday design reference; numbers partly stale), `NIGHTLY_POOL_CLEANUP_PLAN.md`,
  `NIGHTLY_COMPOSITION_AUDIT_PLAN.md` (until the 10-16 re-measure), `SEED_DIVERSITY_CHARTER.md`.
- **Looks and couples:** `REAL_FACE_LOOKS_REGISTRY.md` (grades; the live tables win), `FLUX_COUPLE_LAB.md` (couple
  experiment ledger), `BIG_FACE_RECLAIM_PLAN.md`, `LLM_5_5_TUNING.md` (5.5 watch to ~10-14).
- **Reliability:** `NIGHTLY_ROBUSTNESS_PLAN.md` (swap capacity gate, spread, retries), `NIGHTLY_DREAM_GUARANTEE_PLAN.md`
  (delivery layers, coverage sweep), `QUEUE_WORKERS_REFACTOR.md` (queue + Fly scale runbook), `REDREAM.md`.
- **Backlog / specs awaiting Kevin:** `NIGHTLY_IMPRESS_PLAN.md`, `NIGHTLY_PAIR_ROLL_PLAN.md`, `NIGHTLY_DIRECTOR_PLAN.md`
  (parked).
- **History:** `docs/archive/nightly/` (61 retired plans, investigations, ledgers and runbooks, same file names; read for
  the measurements behind a rule, never as the current state). Snapshots: `nightly-states/`.
- **Skills:** `/dream-shoot` (the role and the eye), `/render-picker`, `/mine-posts`, `/model-eval`.
