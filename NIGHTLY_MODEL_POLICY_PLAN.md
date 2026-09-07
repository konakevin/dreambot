# Nightly Model Policy — one table, an explicit cascade, nothing hidden (plan, 2026-09-07)

**Ask (Kevin):** "simplify this so it's more straightforward about how nightly works in the way it chooses
its model for each scenario — dual face swap, single, scene — and how fallbacks at each stage work. For the
initial state, introduce the new architecture but keep the behavior the same as current; then run the A/B
to determine the final state. Touchy code: don't break anything along the way. Unit tests must back it up."

**Decisions (Kevin 2026-09-07):** scope = `nightly-dreams` only (first-dream + Create untouched) · "rip off
the bandaid": ONE global rule per surface, no per-medium overrides (the two mediums that differ today are
listed in §3 as accepted divergences) · one shadow night before the flip · the New Scene multi-person doc is
a separate effort outside this one.

---

## 1. How nightly picks a model today (as discovered, with pointers)

Eight layers, four of them in code, decide one thing. Pick sites in `nightly-dreams/index.ts`:
`pickFaceSwapModelFor` (~1126, called at 1176 and again at 1946 / 1998 when a scenario re-rolls the
medium), `sceneBaseModel` (2994), the scene gate (3015-3050), the ban-gate backstop + universal default
(3080-3097), the per-medium pin gate (3102), the first-dream gpt drop (3120), the couple retry
(`rerender_for_dual`, dual pipeline), the solo rebuild (3283, `engine_config.solo_rebuild_model`).

| # | layer | where | what it does |
|---|---|---|---|
| 1 | catalog | `image_models.is_active` | model exists at all |
| 2 | medium DreamSmart set | `dream_mediums.client_meta.smart_dream_models` (`dreamStyles.ts:150`) | the candidate list for the rolled medium; `allowed_models` is only the fallback if the smart set filters to empty |
| 3 | sparkle cap ≤ 2 | `_shared/nightlyModelPool.ts` | drops flux-2-max (3✦) although 15 mediums list it |
| 4 | ban list (6) | `NIGHTLY_BANNED_MODELS` (index.ts:153-178) | flux-2-dev (Jun 1), gpt-image-2 (Aug 25), flux-2-pro + gemini-2-image (Aug 26), flux-1.1-pro-ultra (Aug 28), grok-imagine-image (Aug 31) — 17 mediums still list grok, 17 gemini |
| 5 | clamps | index.ts:1135-1168 | Ultra → 1.1-pro (dead: Ultra is banned); couples: flex → 1.1-pro (Aug 26) unless the steer knob is on |
| 6 | steer knob | `engine_config.dual_avoid_flux11pro` (`_shared/dualModelSteer.ts`) | OFF (Kevin 2026-09-06) |
| 7 | scene gate | `scene_eligible_models` (global + per-medium) ∩ pool | scene-only renders narrow to 1.1-pro |
| 8 | knobs + backstops | `solo_rebuild_model` (F2), per-medium bans/pins (both empty), ban-gate re-pick from `allowed_models`, universal default 1.1-pro, first-dream gpt drop, `force_model` (QA) | |
| + | provider / NSFW failover | `_shared/generateImage.ts` (`failoverModelFor`, `nsfwFailoverModel`) | a Flux / xAI failure falls to **gemini-2-image — a banned model**; 0 failovers in the last 7 days |

**Effective result today (computed from the live sets + the code's rules, 2026-09-07):**

| surface | models that can fire | real-user renders, last 7 days |
|---|---|---|
| couple, attempt 1 | flux-1.1-pro (all 10 swap mediums); photography adds flux-dev | 1.1-pro 81 · flux-dev 1 · flex 1 |
| couple, attempt 2 (`rerender_for_dual`) | the same model again | 8 retried |
| solo | flux-1.1-pro + flux-2-flex (8 swap mediums); film_noir = 1.1-pro only; photography adds flux-dev | 1.1-pro 20 · flex 5 · flux-dev 1 |
| solo rebuild after a couple degrade | flux-2-flex (`solo_rebuild_model`) | 14 |
| scene-only | flux-1.1-pro | 0 |
| couples degraded → solo | | 16 of 82 (all first-picked on 1.1-pro) |

The medium data lies about nightly: 17 mediums list models nightly can never use. The cascade (couple →
retry → solo rebuild → scene) exists only as control flow inside the render.

## 2. Target architecture

**One table, `nightly_model_policy`** (migration): `surface text PK` ∈ {`couple`, `solo`, `solo_rebuild`,
`scene`}, `primary_models text[]` (uniform random among them — today's semantics), `fallback_models text[]`
(ordered; stage 2 of the same surface tries them in order before the cascade drops a level), `notes text`,
`updated_at`. Plus `engine_config.model_policy_mode text` ∈ {`off`, `shadow`, `on`} (default `off`).

**One pure resolver, `_shared/nightlyModelPolicy.ts`** (no Deno / DB imports → `@engine/*` unit tests):
- `resolveModel({ surface, attempt, policy, forceModel, rng })` → `{ model, stamp }`. Attempt 1 = random
  primary; attempt n ≥ 2 = `fallback_models[n-2]` if present, else the attempt-1 model again (today's
  behaviour). `forceModel` always wins (QA).
- `cascade` is explicit and readable: `couple@1 → couple@2 → solo_rebuild@1 → scene@1` and
  `solo@1 → solo@2 → scene@1`. Every step stamps `policy:<surface>:<attempt>:<model>` into
  `fallback_reasons`, so forensics and the matrix page read the cascade straight from the log.
- The medium no longer influences the model. The 1.1-pro override fragments (`faceSwapModelOverrides.ts`)
  are untouched: they key off the chosen model, not the picker.

**What the policy replaces (deleted in Phase 3, not before):** `NIGHTLY_BANNED_MODELS` (a model nightly
must not use is simply not in the table), the sparkle cap for nightly (a CI test keeps the cost rule instead
of a runtime filter), both clamps, `dualModelSteer.ts` + `dual_avoid_flux11pro`, `NIGHTLY_BANNED_MODELS_BY_MEDIUM`,
`NIGHTLY_PINNED_MODELS_BY_MEDIUM`, the scene gate's model narrowing (the `scene` row is the list), the
ban-gate backstop + universal default, `solo_rebuild_model` (→ the `solo_rebuild` row), and nightly's use of
`nightlyModelPool.ts`. The DreamSmart sets stay exactly as they are for Create.

**Not in this pass (own line in the plan so it is not forgotten):** first-dream's gpt drop (index.ts:3120)
stays until the first-dream pass; provider / NSFW failover keeps its hardcoded gemini target in Phase 1-2 and
is routed through `fallback_models` in Phase 3 (a behaviour change, called out then).

## 3. Initial rows = today's behaviour, and the two accepted divergences

| surface | primary_models | fallback_models |
|---|---|---|
| couple | [flux-1.1-pro] | [] (attempt 2 = 1.1-pro again, as today) |
| solo | [flux-1.1-pro, flux-2-flex] | [] |
| solo_rebuild | [flux-1.1-pro] (Kevin 2026-09-07: "solo rebuild should stay 1.1pro"; the F2 real-fragment fix stays) | [] |
| scene | [flux-1.1-pro] | [] |

The solo_rebuild row is the one deliberate change from today (flex since the F2 fix on 2026-09-06). Flag of
record: the 520-render audit tied 3 of the 4 true headshots to the 1.1-pro rebuild, but that rebuild also
carried the override fragment, which F2 removed — a 1.1-pro rebuild with the REAL fragment is untested, so
the Phase-5 A/B measures exactly this row (tight-crop rate) and Kevin decides with data.

Accepted divergences from today (the "bandaid", ~2% of renders): **photography** loses flux-dev (1 couple
+ 1 solo last week) and **film_noir** solos gain flex (its smart set is Gemini-only, so today it falls
through to 1.1-pro alone). The equivalence test in §5 enumerates exactly these two so any OTHER divergence
fails CI.

## 3b. Economics — which models can be nightly PRIMARIES at all (2026-09-07)

**Kevin's question:** "at the worst case — all 30 nights of the month trigger the most expensive model — are
we still making money, after Apple's 15% take? That is a big factor on which models make it to the
eligibility pool."

**Revenue per nightly-eligible user, net of Apple 15% (Small Business Program):**

| plan | price | net / month | other perks (typical → maxed) | nightly budget / night (typical perks → maxed) |
|---|---|---|---|---|
| Dreamer monthly | $4.99 | $4.24 | none (nightly is the only perk) | **14.1¢** |
| Dreamer yearly | $39.99 | $2.83 | none | **9.4¢** ← the binding constraint |
| Dreamer+ monthly | $9.99 | $8.49 | 75✦ ($2.00 → $3.45) + 75 HD ($0.20 → $2.00) | 21.0¢ → 10.1¢ |
| Dreamer+ yearly | $99.99 | $7.08 | same | 16.3¢ → 5.4¢ |

(At Apple's 30% rate every budget drops ~18%: Dreamer monthly 11.6¢, yearly 7.8¢.)

**Cost per nightly = image renders + a fixed pipeline overhead.** Measured on the last 14 days of real
nightlies (`ai_generation_log`): couples run 1.26 image renders on average (8% retry + 18% degrade→rebuild),
solos 1.0; the gender pre-read (Haiku vision) fires on 100% of couples, face restore (CodeFormer) on 97%,
the quality gate (Sonnet vision) on 11-20%; the Sonnet brief averages ~1,500 tokens in / ~160 out.
Overhead ≈ **2.7¢ typical** (Sonnet brief 0.7 · gender read 0.2 · gate 0.1 · bot message 0.1 · restore 0.3 ·
dual-swap Fly machine amortized ~1.0 at today's volume · degrade single swap 0.2 · storage 0.1) and
**≈ 5¢ absolute worst** (2 dual attempts + rebuild + 2 gates + 2 reads + single swap). So per night:
`typical = 1.26 × model¢ + 2.7¢`, `absolute worst = 3 × model¢ + 5¢` (assumes Sonnet 4.6 at $3/$15 per M
tokens, the doc's validated 1.3¢ single swap, ~0.3¢ CodeFormer; the Fly amortization falls with volume).

| model | ¢ | typical / night | absolute worst / night | Dreamer monthly (14.1¢) | Dreamer yearly (9.4¢) | Dreamer+ monthly (21¢) | Dreamer+ yearly (16.3¢) |
|---|---|---|---|---|---|---|---|
| flux-schnell / krea | 0.3-0.4 | 3.1 | 6.2 | ✓ ✓ | ✓ ✓ | ✓ ✓ | ✓ ✓ |
| grok-imagine-image | 2.0 | 5.2 | 11.0 | ✓ ✓ | ✓ ✗ | ✓ ✓ | ✓ ✓ |
| flux-dev / flux-2-dev | 2.5 | 5.9 | 12.5 | ✓ ✓ | ✓ ✗ | ✓ ✓ | ✓ ✓ |
| seedream-4 | 3.0 | 6.5 | 14.0 | ✓ ✓ | ✓ ✗ | ✓ ✓ | ✓ ✓ |
| flux-2-pro | 3.1 | 6.6 | 14.3 | ✓ ✗ | ✓ ✗ | ✓ ✓ | ✓ ✓ |
| gemini-2-image | 3.9 | 7.6 | 16.7 | ✓ ✗ | ✓ ✗ | ✓ ✓ | ✓ ✗ |
| **flux-1.1-pro (primary)** | 4.0 | **7.7** | **17.0** | ✓ ✗ | ✓ ✗ | ✓ ✓ | ✓ ✗ |
| flux-1.1-pro-ultra / gpt-image-2 | 6.0 | 10.3 | 23.0 | ✓ ✗ | ✗ ✗ | ✓ ✗ | ✓ ✗ |
| flux-2-flex | 6.3 | 10.6 | 23.9 | ✓ ✗ | ✗ ✗ | ✓ ✗ | ✓ ✗ |
| gpt-image-1 / flux-2-max | 7.0-7.3 | 11.9 | 26.9 | ✓ ✗ | ✗ ✗ | ✓ ✗ | ✓ ✗ |
| gemini-3-image (Nano Banana Pro) | 13.4 | 19.6 | 45.2 | ✗ ✗ | ✗ ✗ | ✓ ✗ | ✗ ✗ |

(each cell: typical ✓/✗ · absolute-worst ✓/✗, against that plan's nightly budget with typical perk use)

**Read:**
- **Nano Banana Pro on every nightly loses money on every plan except a typical-use Dreamer+ monthly, and
  even there only by $0.44/month.** Unlocking ALL models for nightly is not financially feasible.
- The "absolute worst" column is harsh on purpose (three renders every night); by it even flux-1.1-pro
  loses on Dreamer (17¢ vs 14.1¢ monthly, 9.4¢ yearly). That is the real exposure today, not a new one.
- Under the MEASURED multipliers, everything up to 4¢ is profitable on every plan; the 6¢ tier is
  profitable everywhere except the Dreamer yearly floor.

**Rule for the eligibility pool (proposed, formalizes the answer):**
1. A nightly PRIMARY must cost ≤ 5¢/render (typical cost ≤ the Dreamer-yearly 9.4¢ floor). Today's pool:
   flux-1.1-pro, gemini-2-image, flux-2-pro, seedream-4, flux-dev, grok-imagine-image, schnell, krea —
   quality decides among these (bake-off: grok / gemini / seedream / flux-dev all 0/8 degraded).
2. A FALLBACK may be up to the 6.3¢ tier (flux-2-flex — Kevin's pick — ultra, gpt-image-2) because it
   fires on ≤ ~20% of couples: +1.3¢/night, still inside every budget.
3. ≥ 7¢ (flux-2-max, gpt-image-1, Nano Banana Pro) never render nightlies. They stay Create-only, where
   the user pays sparkles per render.
4. **Bound the worst case instead of fearing it:** a per-user monthly nightly-spend cap in the policy
   (`nightly_monthly_cost_cap_cents`, derived from the plan's net floor — Dreamer yearly ≈ 280¢), summed
   from `ai_generation_log.cost_cents`; past the cap the resolver drops to the cheapest primary for the rest
   of the month. This turns "all 30 nights on the most expensive model" from a fear into a number the
   dashboard shows. Phase 5 item; the `dbspec` in §5 already asserts every policy model is priced.

These rules are locked by the live-DB test in §5 (every primary ≤ 5¢, every fallback ≤ 6.3¢, nothing ≥ 7¢),
so a model can't enter the pool without the economics passing.

## 4. Rollout — no behaviour change until the shadow night is clean

0. **Plan approval** (this doc).
1. **Build (mode = off, zero runtime change):** migration (table + seed rows + `model_policy_mode`),
   `nightlyModelPolicy.ts`, the loader (`_shared/pools/nightlyModelPolicyLoader.ts`, isolate-cached like
   `engineConfig`), tests (§5), and the shadow wiring at every pick site: legacy runs as today; the policy
   resolver ALSO runs and stamps `policy_shadow:<site>:match` or `policy_shadow:<site>:diff:<legacy>-><policy>`.
   `npm run check` green, deploy, one QA batch (4 couples / 4 solos / 4 scene) to confirm stamps only.
2. **Shadow night:** flip `model_policy_mode = shadow` before the 08:00 UTC nightly. Next morning one SQL
   query lists every `diff` stamp; the only acceptable diffs are §3's two mediums. Anything else = a bug in
   the resolver or an undocumented layer → fix, another shadow night.
3. **Flip:** `model_policy_mode = on` (config, ≤ 60 s cache TTL, no deploy). QA batch of 12 + one real night;
   compare `model_used` distribution to §1's table.
4. **Delete the dead code in one commit** (§2 list), retire `nightlyModelPool.test.ts` (7) +
   `dualModelSteer.test.ts` (9), route failover through `fallback_models`, point the Nightly Model Matrix page
   at the table. `dualSoloFallback.test.ts` (10) stays.
5. **A/B for the final state** (separate, Kevin approves each): solo rebuild on 1.1-pro (the initial row, real
   medium fragment) vs flex, 10 + 10 renders judged by the framing rubric (the audit's tight-crop / headshot rate
   is the bar);
   couple `fallback_models = [flux-2-flex]` (the "clip in the barrel", Kevin's pick) measured over one week of
   real couples: degrade rate and partner identity vs the 16 / 82 baseline. Each outcome = a row edit.

**Rollback:** until Phase 4, `model_policy_mode = off` restores the legacy path instantly. After Phase 4,
`git revert` of the deletion commit + redeploy (the legacy tests live in history).

## 5. Tests that back it up

- `__tests__/lib/nightlyModelPolicy.test.ts` (new, seeded rng): every surface × attempt 1/2/3 × with and
  without fallbacks × `forceModel`; the cascade order as a literal list; stamps byte-exact; an empty primary
  list throws (a policy row can never be blank).
- `__tests__/lib/nightlyModelPolicy.equivalence.test.ts` (new): a checked-in fixture of today's per-medium
  sets (`smart_dream_models`, `allowed_models`, `scene_eligible_models`, catalog costs, the 6 bans) replayed
  through the LEGACY rules (`nightlyModelPool` + cap + bans + clamps + scene gate) and through the policy
  rows; asserts equality for every dream-eligible medium × surface except the two enumerated divergences.
- `__tests__/db/nightlyModelPolicy.dbspec.ts` (live DB, CI `db-tests`): every model in every row exists in
  `image_models`, is active, and passes §3b (primaries ≤ 5¢, fallbacks ≤ 6.3¢, nothing ≥ 7¢ — the economics
  survive as a test, not a runtime filter); every surface row is present.
- `__tests__/lib/nightlyNoHardcodedModels.test.ts` (after Phase 4): greps `nightly-dreams/index.ts` for
  `black-forest-labs/`, `google/`, `openai/`, `xai/` literals and fails on any — the matrix page is the only
  place a model id is allowed to appear, sourced from the table.
- The golden prompt fixture stays byte-identical (the picker does not touch prompt text).
- Existing: `dualSoloFallback.test.ts` (rebuild input) unchanged; `faceSwapGenderLock`, `castSkinTone`
  unchanged.

## 6. Risks and how each is covered

- **Six pick sites, easy to miss one** → the shadow stamps are emitted per SITE, and the shadow-night query
  groups diffs by site; an un-shadowed site shows up as a site with zero stamps.
- **Config cache staleness** → mode changes take ≤ 60 s (existing `engineConfig` TTL); the shadow flip is
  done well before 08:00 UTC.
- **`model_used` semantics** → unchanged (the F2 override for the rebuild stays).
- **The couple retry today re-uses the same model** → `fallback_models = []` reproduces that exactly; the
  flex fallback is a Phase-5 row edit, never a code change.
- **Shared working tree** → explicit-path commits per phase; another agent's untracked
  `holidayWindowParity.test.ts` currently fails `tsc` on commit and is not mine to fix.

**Effort:** Phase 1 ≈ half a day; Phase 2 = one night; Phase 3-4 ≈ half a day the next morning.

## 7. Status log

- **2026-09-07 Phase 1 BUILT + DEPLOYED, mode = `shadow` for tonight's 08:00 UTC run.** Migration 468 applied
  (table seeded legacy-equivalent, `engine_config.model_policy_mode`), `_shared/nightlyModelPolicy.ts` (pure
  resolver + cascade + `candidateModels` / `shadowStampSet`), loader (60 s TTL, fail-open), the render wired at
  six sites (face-swap pick incl. both medium re-rolls, scene base, scene gate / ban gate / pin gate guarded
  for `on`, couple retry, solo rebuild). Tests: 78 → 81 fast (resolver, equivalence over the 2026-09-07
  fixture, QA flag) + `nightlyModelPolicy.dbspec.ts` (CI db-tests). QA in shadow: 12 renders, every site
  stamped `match` (face-swap 7, couple retry 5, solo rebuild 2, scene 2), 0 diffs. Two lessons folded in:
  the shadow compares SETS (`candidateModels`) — two independent random draws from the same row are not a
  disagreement — and the scene surface is compared AFTER the scene gate (`scene_final`), because the legacy
  base pick is re-picked by the gate.
- **Morning check:** `node scripts/check-model-policy-shadow.js --hours 24` → must print `✓ shadow night
  clean` (only `faceswap_pick:diff:flux-dev->…` on photography is acceptable). Then Phase 3.
- **Kevin's FINAL rows (2026-09-07, land in Phase 4 as a row edit + one soak night):** every surface
  `primary_models = [flux-1.1-pro]`; `fallback_models = [gemini-2-image, flux-2-pro, seedream-4,
  grok-imagine-image, flux-dev]` (uniform random on any failure). Same-prompt sheet + bake-off + §3b
  economics behind the pick. Note the dbspec then tightens `PRIMARY_MAX` to 5¢ (all pass) and Phase 4 must
  wire `model_used` for a retry that shipped on a fallback (index.ts couple `rerender` closure, TODO there).
- **Also shipped today (QA tooling):** `force_final_prompt` nightly QA flag — render an exact prompt so a
  model comparison is byte-identical input (`__tests__/lib/nightlyQaFlags.test.ts`).
