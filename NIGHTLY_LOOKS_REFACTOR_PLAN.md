# Nightly STYLE refactor — one decision, one place, honest labels (2026-09-11)

**Kevin's direction:** "refactor all of this into our looks system that will cleanly implement and enforce the
curated looks we come up with, which we'd still need to finalize. The end goal is to clean up all that code,
simplify it, stabilize it, and make it honest — it's really broken that we supposedly pass one medium only
to have it overridden later on in the pipeline."

Companions: `NIGHTLY_LOOKS_CATALOG_PLAN.md` (WHAT the looks are — v1 catalog, brainstorm, open decisions),
`NIGHTLY_LOOKS_FEASIBILITY.md` (touch-point inventory), `NIGHTLY_MODEL_POLICY_PLAN.md` (the model half,
Phase 1 in shadow since 2026-09-07). This doc is HOW the code gets there. The refactor does not depend on the
catalog being final: phases 0-2 are behavior-neutral or flag-gated, so curation (Kevin's grid) runs in
parallel and the cutover waits for it.

---

## 0. Principles (the bar every phase is checked against)

1. **One decision, one place.** A render's style (look key, both fragments, directive) and model are decided
   ONCE, up front, by one pure function, into one immutable object — the **style contract**. Nothing
   downstream re-reads the mediums table, re-rolls, or swaps a fragment.
2. **Honest by construction and by assertion.** The persisted `dream_medium` IS the look whose fragment is in
   the prompt. A runtime assertion at persist time proves it per render; a stamp + Sentry event fires if not.
3. **Enforced, not documented.** DB constraints keep app mediums and nightly looks disjoint; CI forbids the
   render from importing any other style/model source; a dbspec proves every pin points at a real look; a
   nightly monitor derives its thresholds from config (hard rule) and alarms on contract violations.
4. **Curation is data, not code.** A look is a row; retiring one is a flag; adding one is a row + the QA gate.
   No fragment text lives in TypeScript after cutover (the override library is deleted).
5. **Behavior-neutral first.** The extraction (Phase 1) reproduces today's decisions exactly and is locked by
   equivalence fixtures from real log rows — the same method that made the model-policy shadow trustworthy.
6. **First-dream is a consumer, not an exception.** It keeps calling `nightly-dreams` with force flags; those
   flags become look-keyed. Create is untouched: its per-(model × medium) override table
   (`face_swap_model_overrides`, mig 266) already IS the honest shape — one curated fragment per medium per
   stubborn model, label true — and is the precedent the nightly catalog follows.

---

## 1. Today — where style and model are decided (the code map, `nightly-dreams/index.ts`, 4,671 lines)

| #   | Site (line)                                                      | What it decides                                                                                                                                             | Notes                                                                                         |
| --- | ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| 1   | 667-739 chaos-tier pre-roll                                      | dream type → medium TOKEN (`dream_eligible_face_swap` / `_scene` / `_scene_natural` / embodied list)                                                        | tier-gated embodied 0/10/15 %                                                                 |
| 2   | 770-791 `resolveMediumFromDb(token, recent, _, firstDreamAllow)` | the roll from the APP pool (`is_dream_eligible` + flags), minus the user's last 7                                                                           | `force_medium` re-resolves                                                                    |
| 3   | 939-956 realistic ban                                            | character + hyperreal/render/photography → re-roll from the swap pool                                                                                       | re-roll #1                                                                                    |
| 4   | 965-986 scene gate                                               | pure_scene / epic_tiny + not `is_scene_eligible` → re-roll from the scene pool                                                                              | re-roll #2                                                                                    |
| 5   | 992-1010 day-of medium ban (scene)                               | re-roll up to 6× until not banned                                                                                                                           | re-roll #3                                                                                    |
| 6   | 1015-1021 capture                                                | `resolvedMediumAllowedModels / SceneModels / SmartModels`, `isEmbodiedMedium`                                                                               | three copies of medium state, re-synced by hand at every later re-roll                        |
| 7   | 1140-1147 `applyFaceSwapOverride`                                | swaps `flux_fragment` → `face_swap_flux_fragment`                                                                                                           | fragment swap #1                                                                              |
| 8   | 1148-1260 model pre-pick                                         | `nightlyModelPool` (smart ∩ allowed − bans, ≤2✦) → ultra clamp → dual steer → flex clamp → policy shadow/on                                                 | the 8 legacy layers the policy replaces                                                       |
| 9   | 1262-1275 **`pickFaceSwapModelOverride`**                        | on 1.1-pro replaces the fragment with 1 of 4 library fragments                                                                                              | **the dishonest step**: label stays, style changes; `realMediumFragment` kept for the rebuild |
| 10  | 1665-1685 scenario row                                           | `dualSceneMediumKey` / `dualSceneMediumBan` from `dual_scenarios`                                                                                           | pin source #1                                                                                 |
| 11  | 1739-1745 holiday scene pin                                      | `holiday_scenes.medium_key` → `resolveMediumFromDb`                                                                                                         | pin source #2                                                                                 |
| 12  | 2054-2066 day-of look pin                                        | `pickDayOfLook` → rides `dualSceneMediumKey`; merges the day-of ban                                                                                         | pin source #3 (the pilot)                                                                     |
| 13  | 2069-2180 pin apply + bans                                       | `IMAGINED_BIOME_MEDIUM_BAN` (hardcoded), scenario pin → re-resolve + override swap + model re-pick + library again; banned → re-roll + the same three again | re-rolls #4/#5; sites 7-9 repeated twice                                                      |
| 14  | 3198-3310 scene model                                            | `nightlyModelPool` again → policy shadow/on → scene gate re-pick (`scene_eligible_models`) → per-medium bans/pins (empty maps) → ban-gate backstop          | model decided a second time for scenes                                                        |
| 15  | 4301-4430 persist                                                | `model_used`, `rolled_axes.medium`, `uploads.dream_medium = resolvedMediumKey`                                                                              | writes the PRE-override key                                                                   |

Fifteen sites, five re-rolls, three fragment swaps, two model pickers, three hand-synced state copies. Plus
`first-dream-render` → HTTP → `nightly-dreams` with `force_face_swap_eligible` / `strict_face_swap` /
List A threaded through every re-roll as `firstDreamAllow`.

---

## 2. Target — the style contract

```ts
// _shared/nightlyStyle.ts (pure; the loader is separate)
interface StyleContract {
  look: { key; label; fragment; swapFragment; directive; models: string[]; weight };
  surface: NightlySurface;              // 'couple' | 'solo' | 'scene' today; 'embodied' is a declared-but-empty surface (§2b)
  model: string;                       // from nightly_model_policy for this surface ∩ look.models
  source: 'roll' | 'pin:day_of' | 'pin:holiday_scene' | 'pin:scenario' | 'force';
  rebuild: { look; model } | null;     // solo rebuild = same look on the solo_rebuild model, or that model's default look
  attempt(n): { look; model };         // couple retry: same look if the fallback model supports it, else that model's default look
  stamps: string[];                    // look:<key>, style_source:<source>, policy:<surface>:<n>:<model>, look_ban:<…>
}
resolveNightlyStyle({ surface, catalog, policy, pins, bans, allowLooks, forces, recentLookKeys, rng }): StyleContract
```

**2b. Surfaces are data too (Kevin 2026-09-11: embodied Dream Art is OUT of nightly for now, but must
"plug in" later without a refactor).** The set of surfaces and their share of a night are config, not code:
`engine_config.nightly_surface_mix` (jsonb, e.g. `{"scene": 12, "embodied": 0}`; couple/solo take the
remainder by cast availability, as today's cast roll does). The pre-roll draws the surface from that mix;
the resolver receives `surface` and rolls only looks whose `nightly_surfaces` contains it. **Plugging in
embodied later = two data changes and zero code:** (1) insert look rows with `nightly_surfaces = {embodied}`
(lego / pixels / handcrafted fragments already exist on their app rows and are copied, not shared), (2) set
`nightly_surface_mix.embodied` to the desired percent. The chaos-tier embodied sub-roll (site 1) and
`embodied_mediums_mid / _high` are deleted in Phase 4; the embodied brief branch in `index.ts` (the
character-dominant Dream Art brief) is kept and keyed on `contract.surface === 'embodied'`, so it is dormant,
not gone. A dbspec asserts every surface with a non-zero mix has ≥ 1 active look per policy model, which is
what makes a future flip safe: `embodied: 15` with no rows fails CI before it can reach a user.

**The same rule makes any NEW look a data change:** a look is a row (key, label, fragments, directive,
surfaces, models, weight); the resolver never enumerates keys; the only code that knows a key exists is the
QA `force_look` flag. New surfaces beyond the four (say, `pet` portraits) are one enum value + a brief branch.

**Family-first roll (Kevin 2026-09-12: keep every approved look for nightly, consolidate only when Create adopts
them).** Near-duplicates stay, so the roll must not skew toward the biggest cluster: `dream_mediums.nightly_family`
(photographic · painted_realism · covers_posters · comic_print · watercolor) and the resolver picks a FAMILY with
equal shares (or `engine_config.nightly_family_mix`) among families that have ≥ 1 approved look for (model,
surface), then a look inside it by `weight`, then applies per-user recency over look keys. Registry §5b holds the
Create-day consolidation shortlist.

> **Built 2026-09-12:** `_shared/nightlyLooks.ts` — `resolveLook({surface, model, looks, approvals, recentLookKeys,
recencyWindow, familyMix, forcedLook, rng})` — pure, locked by `__tests__/lib/nightlyLooks.test.ts` (equal family
> shares regardless of cluster size, familyMix + look weights, recency with the never-empty floor, approvals filter
> per model × surface, force_look short-circuit, null when nothing is approved). `dream_mediums.nightly_family` tagged
> on all 43 rows (mig 499). NOT yet called by the render — Phase 2 wires it behind `nightly_looks_mode`.

**Precedence (one table, one place):** `force_look` (QA) → day-of look set → holiday-scene pin → scenario pin →
catalog roll(surface, model, recency, bans, allow-list). A pin that names an unknown/inactive look falls to the
roll and stamps `look_pin_unknown:<key>` (fail open, never faceless).

**Model, then look, per surface (Kevin 2026-09-12: "each nightly chooses from the pool of models and looks based on
if it's a dual or single character dream").** The policy row for the surface picks the model (already built); the
look is then rolled from `nightly_look_approvals WHERE model = <picked> AND surface = <couple|solo> AND approved`
(mig 498: one row per look × model × surface, graded in the fixed-scene matrix, `source = 'override'` for Kevin's
calls). A dual dream and a single dream therefore draw from DIFFERENT (model × look) pools, and a look approved on
grok for couples but only for solos on flux behaves exactly that way. The approvals table replaces
`client_meta.smart_dream_models` as the look's model membership; `nightly_surfaces` stays as the model-agnostic
union for the pin route and the QA runner. The old sentence follows for the fallback rule:

**Model:** the policy row for the surface picks the model (already built); the look must list it. If the
picked model is not in `look.models`, the resolver takes the look's first supported model from the policy row's
candidates; if none, it takes the surface's **default look for that model** (`dream_mediums.nightly_default_for
text[]`, one per model, authored once). No loops, no re-rolls.

**The render consumes the contract and nothing else:**

- `characterSlotPrompt` receives `contract.look.swapFragment` (cast) — position 2 is unchanged.
- The scene brief receives `contract.look.fragment` as `MEDIUM:` and `contract.look.directive` as the style guide.
- Couple retry uses `contract.attempt(2)`; the solo rebuild uses `contract.rebuild`; the F2 `model_used`
  override becomes `contract.rebuild.model` (no special case).
- Persist writes `dream_medium = contract.look.key`, `model_used = contract.model` (or rebuild/attempt model),
  `rolled_axes.look = key`, `rolled_axes.style_source = source`.
- **Honesty assertion** (persist): `finalPrompt.includes(fragmentUsed) && dream_medium === contract.look.key`
  → else stamp `style_contract_violation:<reason>` + Sentry. Never blocks the render; the monitor alarms on
  count > 0.

**Deleted after cutover (nightly only):** `pickFaceSwapModelOverride` + `faceSwapModelOverrides.ts` import,
`applyFaceSwapOverride` (folded into the contract's `swapFragment`), `nightlyModelPool` + `pickFromPool`,
`steerDualModel`, both clamps, `NIGHTLY_BANNED_MODELS(_BY_MEDIUM)`, `NIGHTLY_PINNED_MODELS_BY_MEDIUM`,
`fetchSceneEligibleModels` + the scene gate re-pick, the ban-gate backstop, `REALISTIC_BANNED_FOR_CHARACTER`,
the scene-eligibility re-roll, the day-of medium-ban re-roll loop, `IMAGINED_BIOME_MEDIUM_BAN` (→ config),
`resolvedMediumAllowedModels / SceneModels / SmartModels / realMediumFragment / isEmbodiedMedium` state,
every `resolveMediumFromDb` call, `force_medium` (→ `force_look`, alias kept one release for QA scripts).
Estimate: ≈ 800 lines of `index.ts` → ≈ 120 lines of contract consumption; `nightlyModelPool.ts` (65),
`dualModelSteer.ts`, `faceSwapFluxOverrides.ts` (52) leave nightly; `firstDreamMediums.ts` (95) in Phase 5.

---

## 3. Data model (the catalog is rows; the constraints are the fence)

> **Implemented 2026-09-12 (mig 498):** `nightly_look_approvals (look_key, model, surface, approved, source, note,
graded_at)` seeded from rounds 1-3 (213 rows, 171 approved; flux couples 12 / solos 33, grok 27 / 37, gemini 26 /
> 36 of the looks each rendered). `nightly_surfaces` refreshed as the union. Open decision: the couple PRIMARY model
> in `nightly_model_policy` (grok or gemini → 26-27 couple looks; flux → 12).
>
> **Implemented 2026-09-11 (mig 495):** `dream_mediums.nightly_look boolean`, `nightly_surfaces text[]` (⊆ {couple,
> solo}; empty = parked), `weight numeric`, CHECK `nightly_look → NOT is_public AND NOT is_dream_eligible AND NOT
is_scene_eligible`, CHECK surfaces ⊆ {couple, solo}. Round-1 verdicts applied: 8 looks both surfaces, 12 solo-only,
> 1 couple-only (kodachrome), 5 parked; the 6 halloween\_\* cast looks flagged both. Scene-only renders draw from any
> active look (no swap constraint). `nightly_default_for` and the `nightly_surface_mix` config land with the resolver.

`dream_mediums` gains (one migration): `nightly_look boolean default false`, `nightly_surfaces text[]`
(`{couple,solo,scene,embodied}`), `weight numeric default 1`, `nightly_default_for text[]` (models this look
is the fallback for), plus a CHECK: `nightly_look → NOT is_public AND NOT is_dream_eligible AND NOT
is_scene_eligible`. Membership stays `client_meta.smart_dream_models`. The 11 `halloween_*` rows are
back-filled with the new flags (they already satisfy the constraint). Why rows in `dream_mediums` and not a
new table: every client reader (card label, Dream Again, DLT, feed diversity, search, analytics) resolves the
key against this table today, so looks work with zero client change (feasibility §3, decision stands).

**Pins become look keys** in one migration with an explicit remap table (`app medium → look`), e.g.
`painted_gothic_fantasy → nightly_painted_fantasy`, `canvas → nightly_classical_oil`, `photography → NULL`
(drop the pin): `dual_scenarios.medium_key`, `dual_scenarios.medium_ban`, `holiday_scenes.medium_key`;
`holidays.day_of_look_keys` already are. `IMAGINED_BIOME_MEDIUM_BAN` → `engine_config.nightly_look_bans_imagined
text[]`. A dbspec asserts every pin key resolves to an active look.

**Config:** `engine_config.nightly_looks_mode` (`off` | `shadow` | `on`), `nightly_look_recency` (7),
`nightly_surface_mix jsonb` (v1: `{"scene": <today's share>, "embodied": 0}`), `first_dream_look_keys text[]` (Phase 5).

---

## 4. Enforcement (what makes it stay clean)

| Layer            | Mechanism                                                                                                                                                                                                                                                                                                                                                                                                             | Fails when                                                                    |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| DB               | CHECK constraint on `dream_mediums`                                                                                                                                                                                                                                                                                                                                                                                   | a dashboard edit makes a look public / an app medium a look                   |
| DB (CI db-tests) | `nightlyLooks.dbspec.ts`: every active look has fragment + directive (+ swapFragment if couple/solo) + ≥1 model that appears in the policy chain; every pin resolves; each surface with a non-zero `nightly_surface_mix` share × policy model has a default look                                                                                                                                                      | a row is half-authored; a pin dangles; a surface is switched on with no looks |
| CI               | `nightlyStyleSingleSource.test.ts`: greps `nightly-dreams/index.ts` — the only style/model imports allowed are `nightlyStyle.ts` + `nightlyModelPolicy.ts`; forbidden: `resolveMediumFromDb`, `applyFaceSwapOverride`, `pickFaceSwapModelOverride`, `nightlyModelPool`, `pickFromPool`, `steerDualModel`, `fetchSceneEligibleModels`, `smartDreamModels`, any `black-forest-labs/`/`google/`/`openai/`/`xai/` literal | someone re-adds a second decision site                                        |
| CI               | `nightlyLooksDisjoint.test.ts`: catalog keys ∩ app-eligible keys = ∅ (from the migrations' seed rows)                                                                                                                                                                                                                                                                                                                 | a look leaks into Create's pool or vice versa                                 |
| CI               | `nightlyStyle.equivalence.test.ts` (Phase 1): fixtures from real `ai_generation_log` rows → the resolver reproduces the legacy medium / fragment / model                                                                                                                                                                                                                                                              | the extraction changes behavior                                               |
| CI               | `nightlyStyle.test.ts`: precedence table, recency floor, unknown-pin fallback, default-look fallback, `attempt(n)` / `rebuild` keep-or-default                                                                                                                                                                                                                                                                        | resolver logic drifts                                                         |
| Runtime          | honesty assertion at persist → `style_contract_violation` stamp + Sentry                                                                                                                                                                                                                                                                                                                                              | the prompt and the label disagree                                             |
| Monitor          | `check-nightly-looks-night.js` (cron, fail-loud): per look renders / first-try swap / degrade / quality-gate pass / violations; thresholds derived from `engine_config` per the hard rule                                                                                                                                                                                                                             | a look regresses; any violation                                               |

---

## 5. Phases (each shippable alone, each with a flag or a revert)

**Kevin 2026-09-11, two things to build the sequence around:** (1) _test carefully as we move forward_ —
every phase below has an explicit EXIT CRITERION and nothing advances on a green build alone; renders and
stamps decide. (2) _Nail the final list of looks first so we know the destination_ — hence **Phase A**
(curation) runs BEFORE the cutover and its output, the frozen v1 tally, is the fixed point nightly converges
to. Phases 0-1 (behavior-neutral) can proceed in parallel with A; Phase 2+ waits for the tally.

### Phase A — nail the list (the destination; ≈ 80 renders, ≈ $7, Kevin's Dreams album)

| Step | What                                                                                                                                                                                                                                                                                                                                                                                                                         | Exit criterion                                                                                                                                                               |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A1   | **Candidate rows** (migration): the catalog-plan §3a/§3b looks as `nightly_*` rows in `dream_mediums` (`is_public=false`, `is_dream_eligible=false`, `is_scene_eligible=false`, `nightly_skip=true`, `client_meta.smart_dream_models=['flux-1.1-pro']`, both fragments + directive). Inert: the app never lists them and nightly never rolls them — exactly how the `halloween_*` rows were staged.                          | dbspec: every candidate row fully authored; catalog ∩ app = ∅                                                                                                                |
| A2   | **`force_look` QA flag** in `nightly-dreams` (≈ 15 lines): pins the key through the existing scenario-pin route AND exempts the 1.1-pro override library (today `force_medium` alone is repainted at site 9 — line 1268 fires unconditionally; only the day-of pin is exempt). Also stamps `look:<key>` + `look_source:force`. This is the first brick of the contract, not throwaway.                                       | unit test on the pin helper; one forced couple render whose `ai_prompt` opens with the look's fragment and whose `fallback_reasons` has NO `applied curated medium override` |
| A3   | **The matrix**: `scripts/qa-nightly-looks-matrix.js` (clone of `qa-medium-face-swap-matrix.js`): cast looks × {couple, self} × 2 fixed seeds + scene looks × pure_scene × 2, all `force_model=flux-1.1-pro`, `persist:true` to Kevin's PRIVATE album, captions `✨ LOOK <key> <surface> #<n>`, sequential, `waitForHeadroom` gated, off the :00 / 08:00 UTC windows; writes the grid page (rows = looks, columns = surfaces) | every cell filled; `_report.json` with per-render stamps                                                                                                                     |
| A4   | **The gate** (read from stamps, never by eye): per cast look — first-try dual swap ≥ 3/4, `identity_sim` ≥ 0.50 median, 0 faceless; failing looks → solo/scene only or cut                                                                                                                                                                                                                                                   | `NIGHTLY_LOOK_TALLY.md` gate table                                                                                                                                           |
| A5   | **Kevin's grid**: heart = ban; labels chosen; weights (equal v1)                                                                                                                                                                                                                                                                                                                                                             | Kevin's sign-off → **v1 FROZEN** in the tally (keys, labels, surfaces, fragments by row id)                                                                                  |

**Status 2026-09-11:** A1-A4 DONE (mig 494 rows, `force_look` + `force_single_slots` deployed, 104-render matrix,
stamp gate + Claude's visual grade) → `NIGHTLY_LOOK_TALLY.md`: 8 pass / 7 review / 11 fail; the stamp gate alone
would have passed 17, so A4 is now stamps AND a visual grade. A5 (Kevin's hearts) pending.

The frozen v1 tally is what Phase 2 seeds and what Phase 4 converges to; a look outside it never reaches a
user. Adding a look later re-runs A1 (row) → A3-A5 for that row only.

### Simplification (Kevin 2026-09-12: "we should be able to greatly simplify the engine with these rules")

With the model roll (weighted policy rows, mig 501) and the look roll (per-model approvals + families, migs 498/499,
`nightlyLooks.ts`) both built and tested as pure functions, the style contract no longer needs a "legacy source"
mode. **Phase 1 (behavior-neutral extraction of the 15-site chain) is folded into Phase 2:** `resolveNightlyStyle()`
is built ONLY from the new rules —

    surface (couple | solo | scene)
      → model  = resolveModel(policy row for the surface, weighted 50/25/25, bans, force_model)
      → look   = resolveLook(approvals for model × surface, family-first, recency, force_look)
      → pins   = day-of look set › holiday-scene pin › scenario pin (look keys) override the roll
      → contract { look, fragments, directive, model, attempt(n), rebuild }

— and the render runs it when `nightly_looks_mode = on`, leaving the legacy chain byte-for-byte untouched when
`off`. Nothing in the legacy chain is refactored; it is deleted in Phase 4 once the new path has soaked. That removes
the equivalence-fixture work (1-1.5 days) and the temporary "extracted legacy" code that would have been thrown
away. What careful testing looks like instead: (a) unit tests on the three pure pieces (done for policy + looks),
(b) `force_look` / `force_model` matrix renders through the NEW path on Kevin's account, (c) a shadow night that
stamps the contract the new path WOULD have chosen (`style_shadow:<surface>:<model>:<look>`) so coverage is proven
before any user sees it, (d) 30 % → 100 % with the per-look monitor, (e) delete legacy. Retry / rebuild: `attempt(2)`
= policy fallback roll → look re-rolled for the fallback model if the current look is not approved there; `rebuild`
= the solo_rebuild row (flex) + the current look if approved for (flex, solo), else a flex-approved look. First-dream
keeps calling the render with its force flags (List A → look keys, Phase 5).

### Exit criteria per engineering phase (nothing advances without them)

- **P0:** `check-model-policy-shadow.js --hours 96` clean → mode `on` → one soak night with the same script
  clean → delete the legacy layers → `nightlyNoHardcodedModels` green → a second clean night.
- **P1:** equivalence fixtures (≥ 50 real rows: couple / solo / scene / scenario-pin / holiday-pin / day-of /
  first-dream / `force_medium` / `force_look`) reproduce medium, fragment, model, stamps exactly; golden
  prompt fixture byte-identical; one shadow night with the contract note counts equal to the legacy override
  rate; `check-forensics` reads unchanged.
- **P2:** shadow night: 100 % of renders have a `look_shadow` stamp for their surface × model; dbspecs green;
  `force_look` renders match the frozen tally rows.
- **P4:** 30 % for 3 nights then 100 % for 14: `check-nightly-looks-night.js` per look ≥ the legacy baseline
  on first-try swap / degrade / quality-gate pass, 0 contract violations; Kevin's hearts per 100 by look
  reviewed before the legacy delete.
- **P5:** the first-dream QA cascade script passes on every tier with look keys.

| Phase                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Work                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | Proof                                                                                                                                                                                                            | Rollback                                          |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| **0. Model policy ON + delete its legacy layers** (this week; `NIGHTLY_MODEL_POLICY_PLAN.md` Phase 3-4). **Rows decided 2026-09-12 (mig 501):** couples / solos / scenes roll flux-1.1-pro 50 % · gemini 25 % · grok 25 % (weighted primaries; retry = gemini 45 / grok 45 / flux-2-pro 10); `resolveModel` is weight-aware (`primary_weights`, `fallback_weights`). The shadow check now expects DIFFS by design (legacy always picks 1.1-pro; the policy set is three models): the Phase 0 exit criterion becomes one QA night on Kevin's account with mode `on`, not a clean shadow. | `model_policy_mode = on`; delete pool/clamps/steer/bans/scene-gate/ban-gate/`solo_rebuild_model`; Kevin's final rows; `nightlyNoHardcodedModels.test.ts`                                                                                                                                                                                                                                                                                                                   | `check-model-policy-shadow.js --hours 96` clean (it has matched since 09-07); one soak night                                                                                                                     | `mode = legacy` (code kept until the soak passes) |
| **1. Extract the style contract — behavior-neutral**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | `_shared/nightlyStyle.ts` in `source = legacy` mode: it performs today's roll + re-rolls + pins + bans + override library + first-dream allow-list + forces and returns the contract; `index.ts` sites 1-15 collapse to one call + consumption; `realMediumFragment` etc. removed; persist writes from the contract; honesty assertion added (in legacy mode it reports the override-library dishonesty as `style_contract_note:override_library` rather than a violation) | equivalence fixtures (50 real rows across couple / solo / scene / pinned / day-of / first-dream); golden prompt fixture byte-identical; a shadow night with `style_contract_note` counts = today's override rate | git revert (one commit)                           |
| **2. Catalog source behind a flag**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | migration (§3 columns + constraint + `halloween_*` back-fill + v1 rows from the catalog plan + pin remap + config); `nightly_looks_mode = shadow` makes the resolver compute the catalog contract alongside legacy and stamp `look_shadow:<surface>:<key>`; `force_look` QA flag                                                                                                                                                                                           | shadow night: every render has a look for its surface × model (coverage, not equality); dbspecs green                                                                                                            | `mode = off`                                      |
| **3. Curation** (Kevin; parallel with 1-2)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | reliability gate (cast looks × 4 fixed couples, stamps decide) → Kevin's grid in the Dreams album → weights / bans / labels                                                                                                                                                                                                                                                                                                                                                | `NIGHTLY_LOOK_TALLY.md`                                                                                                                                                                                          | rows are data                                     |
| **4. Cutover + delete legacy**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | `mode = on` → 30 % (per-user hash) → 100 % → two weeks; then delete the legacy source branch, the override-library import, `faceSwapFluxOverrides` use, `force_medium`; the honesty assertion becomes a hard violation; the chaos-tier embodied sub-roll + `embodied_mediums_mid/_high` deleted (`nightly_surface_mix.embodied = 0`, brief branch kept dormant)                                                                                                            | `check-nightly-looks-night.js` per look vs the legacy baseline; `nightlyStyleSingleSource.test.ts` green                                                                                                         | percentage down; `mode = shadow`                  |
| **5. First-dream on looks**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | `first_dream_look_keys` (List A → look keys); `firstDreamMediums.ts` medium logic deleted; the cascade unchanged                                                                                                                                                                                                                                                                                                                                                           | first-dream QA cascade (existing script)                                                                                                                                                                         | config                                            |
| ~~6. Create's override library~~                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | **Retracted 2026-09-11 (I was wrong):** Create's override (`createFaceSwapOverrides.ts`, DB table `face_swap_model_overrides`, mig 266) is keyed by (model × medium) and must render THAT medium's look — a per-medium fragment a stubborn model obeys, label honest. It is the precedent for the looks catalog, not a defect. Nothing to do in Create.                                                                                                                    | —                                                                                                                                                                                                                | —                                                 |

**Effort:** P0 ½ day · P1 1-1.5 days · P2 1 day · P3 Kevin + ≈ 200 renders (≈ $16) · P4 ½ day + 2 weeks of
nights · P5 ½ day. P1 is the one that pays for itself immediately: it deletes the hand-synced state and the
repeated re-roll/override blocks even before a single catalog row exists.

---

## 6. What stays exactly as it is

Scene seeds, holiday pools, action registers, stances, costume lock, the couple prompt order (look at
position 2), the swap pipeline and its degrade cascade, the quality gate, hair variation, the vibe roll
(v1), notifications, analytics keys (`dream_medium` now carries an honest key), Create / DLT / restyle.

## 7. Risks

- **Equivalence fixtures miss a branch** → fixtures are sampled per `style_source` × surface × force flag, and
  the shadow night in P1 counts `style_contract_note` stamps against the known override rate.
- **A pin remap is wrong** → the dbspec fails before apply; unknown pins fail open with a stamp.
- **A model with no look** → the default-look column is required by the dbspec for every policy model.
- **Two agents in `index.ts`** → P1 is one commit on a quiet day; explicit paths; the file is announced in
  `FOLLOWUP.md` before starting.

## 8. Decisions Kevin owns for THIS plan (the catalog decisions are in the catalog plan §7)

1. ~~Embodied~~ — DECIDED 2026-09-11: out of nightly at cutover (`nightly_surface_mix.embodied = 0`, no rows), architected as a declared surface so it plugs back in as rows + a percent (§2b).
2. ~~`force_medium` alias~~ — DECIDED 2026-09-11: KEEP (the QA scripts depend on it). `force_look` is added alongside; `force_medium` keeps resolving any key for at least one release and is only retired once every `scripts/qa-*` caller is moved.
3. ~~Create's override library~~ — retracted; Create is honest today (§5 row 6).

## Vibe axis (2026-09-11)

The vibe is the contract's third axis. Audit, the ten proposed vibes, the matrix protocol and the design for
rolling/applying it on the looks path live in `NIGHTLY_VIBES_AUDIT.md` (§6). Nothing ships to the roll until
Kevin finalises the list from the vibe matrix page.

## Phase 2 wiring: shipped 2026-09-11 (evening), and what the first natural renders taught us

**Built and deployed (commits 286df195, 9071f261):** the looks path lives in `_shared/nightlyLooksPath.ts` as pure steps
(mode, provisional medium, surface, vibe rows, the contract applied, slot-input fields, retry / after-scene prompts,
honesty assertion, shadow stamp; 14 tests) with thin seams in `nightly-dreams/index.ts`: provisional medium at the roll,
legacy override / pre-pick / pin blocks skipped, ONE hook after the pins applies the contract (model → look → vibe), the
slot input carries the vibe fragment at its version's position + blank axes + look-neutral framing + the rich brief, the
scene model comes from the contract with the legacy gates skipped, couple retry = `contract.forAttempt()` with the
after-scene rung at attempt ≥ 2, solo guard re-render = after-scene rung, solo rebuild = `contract.forRebuild()`, honesty
stamps at persist (`style_contract_violation:*`). QA: `scripts/qa-nightly-looks-path.js --round=<r> --count=<n>
--surfaces=couple,solo` (natural renders on Kevin's account, honesty checks, page on the Desktop). Mode stays `off` in
`engine_config` (production untouched); QA uses `force_looks_path`.

**What the natural renders taught us (verify + qa1 + qa2, ~30 renders):**

1. The path is honest: every render carried `looks_path:on`, the look fragment, the vibe fragment (cast renders), the
   contract's model, no violations. The couple degrade rate on flux-1.1-pro is high (3 of 5, then 2 of 4) and goes to
   the solo rebuild on flux-2-flex rather than to the policy fallback model, because the legacy dual pipeline's cascade
   decides before the retry rung can move the model. Worth a look in Phase 3.
2. "They all feel exactly the same" (Kevin). Cause 1: THREE photography priors survived in the composer on cast renders
   ("a relaxed warm editorial photograph … photographic realism, filmic colour" in the solo integration line, "the clear
   subject of a candid cinematic photograph" in the solo person line, "an editorial cinematic photograph feel … filmic
   colour grade" in the couple framing line) and Sonnet was never told the LOOK, so it wrote photographic scenes ("a
   cascade of camera flashes"). All three are now neutral on the path and the brief names the LOOK.
3. "Nothing interesting about the outfits or scenery." Cause 2: the legacy Sonnet brief was the ceiling: 25-40 word
   "believable, plain" scene, 8-15 word outfit under the travel-clothes rule, props "strongly prefer empty", couples
   cropped at mid-thigh with a waist-up closer roll. Each rule killed a specific bug; together they made every dream
   plain. On the path Sonnet is now the SET DRESSER + COSTUME DESIGNER (55-85 word scene with six concrete named things
   layered foreground → background, 18-28 word complete outfit for the place / light / look, one prop, knees-up couples,
   no closer roll). qa2 confirmed richer scenes (rain-slicked teak and brass cleats on a Bora Bora yacht, prayer flags
   and a lantern at Bhagsu falls) but framing still tight when the scenario says "seated" or the action is functional.
4. "Generic poses, bleh subject matter" (Kevin). Cause 3, the one that remains: the SUBJECT comes from the pools and the
   pool action briefs, written in a stock travel / adventure register ("climber plants both mittened hands on the summit
   wand", "diver crouches at the reef shelf", "warming both hands around a thermos", "seated side by side on the bow of a
   superyacht", a conference room in an F1 polo). The matrix render Kevin loved was written as a DIRECTOR: a story beat
   with a relationship and a verb, a dressed set, a costume, a prop with narrative. That is the next phase:
   `NIGHTLY_DIRECTOR_PLAN.md` (director mode: Sonnet authors the beat on the looks path; pools stay the randomizer and
   the fallback).

**Do not ship `nightly_looks_mode = on` before director mode lands**: today's path is honest and varied in look and light
but the subject matter is still the legacy pools', and Kevin does not want a night of those.

## 1.2.0 vs the looks path: the comparison Kevin asked for (2026-09-12)

Reference = his 30 most recent PUBLIC posts (`uploads.is_public`, the app's posts album; `is_posted` is the wrong
flag and `posted_at` sorts nulls first): 30 character renders, a real spread of full-body / three-quarter / waist-up,
overwhelmingly the scenario-driven, costume-rich renders (starship bridge, pirate, Roman couple, sea turtles, red
carpet), rendered by flux-1.1-pro through the legacy override library plus a few on flex / ultra.

**Kept, byte-identical:** the composition roll (character / epic_tiny / pure_scene), the cast roll, the location
pools + biome axes (wardrobe anchor, TIME / WEATHER / PHENOMENA), the scenario pools (goofy / elegant / active / genre
/ holiday, ~50% of nightlies), the action pools, registers, Option B and authored actions, costume locks, hair
variation, the identity gates, the dual pipeline and the solo rebuild.

**Changed on the path:** medium → look (the catalog + the legacy family, see below); model = the weighted policy
(50/25/25) instead of the DreamSmart pool; vibe = 175 versions (family-first) with the fragment placed per version;
the composer's three photography priors removed and Sonnet told the LOOK; the SET DRESSER + COSTUME DESIGNER brief
(on by default; `force_plain_brief` for an A/B); framing = a rolled axis (couple full_figure 15 / knees_up 40 /
mid_thigh 15 / waist_up 30; solo enviro_wide 25 / three_quarter 45 / waist_up 30; a waist-up frame tells the set
dresser to dress the near field; stamp `frame:<surface>:<key>`); whole-body couple stances (`DUAL_STANCES_WIDE`)
and torso stills dropped from the register sample; the legacy per-model override library and per-medium overrides
skipped (the approvals table is the quality gate instead).

**Missed and fixed today:** (1) the render handed the contract the legacy ban list, which bans gemini and grok, so
the roll was 47/47 flux-1.1-pro (`looksPathBans`, unit-tested; the QA runner now warns on a single-model batch);
(2) a vibe version with no fragment blanked the atmosphere axes and left no light instruction (axes now pass
through for fragment-less vibes); (3) couples never had a full-body frame (added); (4) the mediums his posts
rendered with were absent: in 1.2.0 every flux face-swap render replaced the medium fragment with one of FOUR
override fragments (three already looks; adult cartoon added) and the other models rendered the medium's own
fragment. Mig 511 added eight looks; Kevin graded them on the flux matrix (colored pencil scrapped, glamour solo
only); mig 513 files them under a `legacy` family rolled at `engine_config.nightly_legacy_look_pct` (35) before the
family-first roll: on flux 35% legacy then 13% per new family; on gemini / grok 0% until their matrix approvals
land (`look_set:new:only`). Per-look banned vibe families (`client_meta.banned_vibes`) exist; the only entry is
`epic` on adult cartoon, inherited from the override library.

**Still open:** scene-only renders on the looks path have had one verify render (Kevin: character only for tests);
the legacy looks on gemini / grok (matrix running); the subject-matter register of the pools (director mode,
parked); the QA runner's honesty flag on one gemini couple (`vibe_fragment_missing` after a retry) to trace.

## Swap geometry A/B: natural vs strict couple language (2026-09-12)

Kevin's framing (memory `feedback_swap_safety_is_engine_not_prompt`): the strict couple language (one plane, one
height, clear gap between heads, no contact, hands at chest level or lower, repeated in the anchor tail, the gap
line, the brief and the proximity validator) was written before the engine had fault tolerance. Today a failed
split re-renders the couple (≤2), the identity gate blocks a wrong face, and the last resort is a gender-safe SOLO
rebuild of the same scene. So the prompt only sets first-try odds; the cost of relaxing it is a couple dream that
ships as a solo, plus retry time, never a wrong face.

**Build** (branch, default strict, QA `force_swap_geometry`, runner `--geometry=natural|strict`):
`swapGeometry` on the composer input; NATURAL = "two people together" anchor + a single visibility clause
("neither face hidden behind or pressed against the other"), the brief allows real-couple contact and motion
(never a kiss / cheek to cheek / hidden), hands up to shoulder height; `DUAL_STANCES_NATURAL` (13 authored
contact + motion + geometry stances); `validateActionBeat(…, 'natural')` lifts ONLY the proximity rule. The dual
`rerender()` swaps to `strictRetryPrompt()` (strict anchor + pool pose, same scene / wardrobe / props) before any
degrade. Strict / unset is byte-identical (`__tests__/lib/swapGeometry.test.ts`).

**Result** (6 couples per arm, Kevin's account, page `~/Desktop/nightly-geometry-ab.html`):

| model              | mode    | first-try dual | strict retries | degraded → solo | shipped dual (min-side identity, mean / min) |
| ------------------ | ------- | -------------- | -------------- | --------------- | -------------------------------------------- |
| flux-1.1-pro       | natural | 1/6            | 5              | **4**           | 2/6 (0.57 / 0.54)                            |
| flux-1.1-pro       | strict  | 3/6            | 0              | 1               | 5/6 (0.60 / 0.29)                            |
| gemini-2-image     | natural | 6/6            | 0              | 0               | 6/6 (0.73 / 0.70)                            |
| gemini-2-image     | strict  | 6/6            | 0              | 0               | 6/6 (0.68 / 0.62)                            |
| grok-imagine-image | natural | 6/6            | 0              | 0               | 6/6 (0.70 / 0.64)                            |
| grok-imagine-image | strict  | 6/6            | 0              | 0               | 6/6 (0.73 / 0.70)                            |

- **gemini + grok: natural is free.** 12/12 first-try duals, identity equal or better than strict. The renders that
  rolled a natural stance (walking, dance_step, linked_arms_stroll) are exactly the lively couples the strict
  arm never produces (strict gemini/grok = "standing side by side" catalog stills in 8 of 12).
- **flux-1.1-pro cannot split natural couples**: lean_in_laugh → faces=0, depth_stagger → faces=1,
  linked_arms_stroll → attempt-1 identity 0.33/0.03 (rescued by the strict retry). Two more flux failures were NOT
  geometry: `nightly_pulp_cover` → `giant_face` on both attempts (the fragment names faces), and the
  `full_figure` frame → faces=0. And flux STRICT is itself fragile on the looks path: 3/6 first-try, one weak
  identity shipped (0.29), one degrade (watercolor_portrait knees_up: faces=0 three times).
- **The strict-retry net is thin on flux.** `RENDER_DEADLINE_MS` 140 s − solo reserve 50 s − recover reserve 40 s
  leaves room for ONE re-render (`recover_budget_exhausted` after attempt 2 in 3 of 5), and one retry died on a
  Fly `face-swap-dual` timeout. On gemini/grok the net was never needed.
- **Stance coverage gap:** plain-location couples take the Option B beat (`location_action`,
  `sceneActionLocationCouples` false → `location_couple_held`), active rows the fixed anchor — so 15 of 24
  gemini/grok renders rolled NO stance and only the anchor differed. Option B's own Sonnet prompt still carries the
  strict no-contact rule (`locationActionBeat.ts`), so natural does not yet reach the majority of couples.
- **Bug found + fixed:** WIDE stance texts ran 25-42 words; Sonnet builds the beat around the stance, the couple
  beat blew the 56-word cap and was silently dropped to the pool pose (`scene_action_fallback:too_long`, 3 of 10
  flux renders). Texts shortened to ≤ 26 words; word-cap guard in `dualStances.test.ts`.

**Recommendation (Kevin's call):** make the default MODEL-DEPENDENT — natural on gemini and grok, strict on
flux-1.1-pro — and extend natural to Option B (the location beat prompt + validator) so it reaches location
couples. Separately reconsider the couple policy weight on flux-1.1-pro (50% today): on the looks path it is the
least reliable couple model in this sample, even strict. Frame roll: drop `full_figure` for flux couples.
`nightly_pulp_cover`: the "lifelike adult faces / true-to-life eyes" fragment fights knees-up framing on flux.

### Kevin's verdict on the A/B + the cross it surfaced (2026-09-12, evening)

- "These don't necessarily seem better. I disagree about natural on grok and gemini." → natural stays behind the
  QA flag; no default change. Open, per Kevin: **framing is very static for both couples and singles in this
  batch; 1.2.0 still beats the looks path here.** Not a geometry effect (both arms show it). Suspects: the
  subject-first anchor's "from the knees up in a three-quarter length composition … faces toward the viewer"
  dominates whatever the stance says; Option B location beats (no stance) on most couples; the solo anchor +
  candid pool. Next: pull 30 of 1.2.0's recent couple/solo renders and stamp their frame / pose distribution
  against the looks path's, then decide what the frame axis should actually vary (distance, angle, level,
  subject placement) instead of only the crop.
- **A gender CROSS shipped** in the gemini natural arm (#2 aquarelle_graphite · dreamy\_\_bold): Kevin's face on
  the woman, his wife's on the man. Root cause + fix: memory `project_dual_faceswap_gender_guarantee` (2026-09-12
  update) — the Haiku gender pre-read alone routed the swap; a confident misread is invisible to the identity
  gate (each pasted face matches its own source) and to the broken-only quality gate. Fix deployed in SHADOW:
  a second independent read (which side wears the LEFT-locked outfit, `_shared/wardrobeSides.ts`) must agree;
  `engine_config.dual_side_check_mode` off | shadow | enforce (mig 514). Replay on the 30-day audit set: the
  cross → conflict (caught); two harmless side-swaps → false conflict (cost a re-render); two → unresolved.
  Flip to enforce once shadow shows the unresolved rate on real renders.

**Cross, root cause (2026-09-12 late):** a third painted figure (the brief's mural) made Haiku's left/right describe the
mural; the engine's own genderage on the two faces it swaps was right and got overridden. Fixes: face-count guard
(edge, deployed) + engine-side `genderRouteConflict` (Haiku may confirm, never override, a confident engine read;
needs `fly deploy`). Resemblance routing calibrated on 45 base renders and scrapped (noise). Details: memory
`project_dual_faceswap_gender_guarantee`.

## Framing axis (2026-09-12, evening) — "1.2.0 still beats us on framing"

**Diagnosis from the 30 public posts (the taste reference):** about a third are FULL figures; about a third are
FRAMED BY something in the scene (an archway, doorway, trellis, window, tunnel of branches); about a third put the
subject OFF-CENTRE with the environment opening on the other side; several are seated (steps, bench, porch,
tavern table); a few use a slightly low camera (heroic) or a step-above camera (intimate); nearly every solo has a
strong prop or action in hand. The looks path rolled only the crop distance, so every render was the same centred,
eye-level, frontal shot at a different zoom. (Note: many of those posts are Create renders with user-typed scenes,
which is where the prop/action richness comes from; the framing lesson still stands.)

**Build:** `_shared/pools/nightly_framings.ts` — 13 couple + 12 solo AUTHORED recipes (≤ 26 words each: distance +
device + camera + placement, weighted, ~⅓ full figure), each mapped to an existing frame distance so the brief's
near-field rule and the anchors behave as before for that crop. `frameFields` rolls a recipe (stamps
`frame:<surface>:<distance>` as before + `framing:<key>`); the composer's `framingClause` REPLACES the fixed
distance line in the couple anchor / solo framing block; `framingSeated` drops "standing". Face clauses stay
code-owned; no recipe names scene content or dominance. QA `force_framing=<key>`, runner `--framing`. Legacy
path byte-identical (no clause). Tests: `__tests__/lib/nightlyFramings.test.ts`.

**Next:** proof batch (2 couples + 2 solos × 3 models, round `framing1`) → Kevin grades against the posts →
prune / reweight recipes → matrix per recipe → then `engine_config` weights. Still open after this: body
orientation (frontal vs turned, parked with natural geometry), the energy ban (`too_energetic`) vs the posts'
raised-arm moments, and Option B beats carrying no stance.

## Prompt ORDER on flux-1.1-pro (2026-09-13, parity loop rounds 15-16) — position beats length

Direct fixed-seed Replicate renders (same seed, one change at a time; scratchpad `grey-probe/`, `len-probe/`,
`solo-probe/`; full narrative in `NIGHTLY_PARITY_QA_LOOP.md`) established three facts the composer now encodes:

1. **Couples:** the subject-first v3 order (120-160-word scene paragraph right behind the people line, pose after
   the identity blocks) lost the couple entirely, floated two heads, or rendered the man in greyscale, seed by seed.
   The album's LEGACY order (gender lock → look → "set at place — hook" → ENVIRONMENTAL TWO-SHOT anchor → pose →
   identities → framing restatement → scene LAST) rendered the same content cleanly 3/3, and the late scene's length
   made no difference. `LOOKS_COUPLE_PROMPT_STYLE = 'legacy'`; the framing recipe rides the anchor's distance slot.
2. **Solos:** nothing past word ~160 moves the composition — truncating at 370/450 words, capping the scene, moving
   the framing block ahead of the scene, or placing the distance line right after the face clause all rendered the
   identical portrait. The distance line counts only when it sits INSIDE the anchor BEFORE "face clearly visible and
   turned naturally toward the viewer…" (`LOOKS_SOLO_FRAMING_IN_ANCHOR`, `framingInAnchor`).
3. **Method:** any "does this clause matter?" question gets 3 fixed seeds × the variants on Replicate directly
   (~$0.04 a render, no DB pool) before the engine is touched; an identical picture means the model never read it.

---

## FOLLOW-UP (queued 2026-09-16): re-test GPT Image 2.5 at a real sample size

**Why this is open.** The 2026-09-16 verdict — "gpt-image-2.5-sunburst renders one look regardless of what
you ask for" — rests on **n = 1 per (look × arm)**. Two of those single renders were compared and called
indistinguishable. That is exactly the sample size that misled us on flux the same day: flux looked like a
coin flip at n=2 and measured **2/9** at n=9. Kevin: renders circulating publicly show 2.5 producing a wide
range of styles, which is reasonable grounds to doubt the verdict.

**What WAS fairly established, and does not need re-running:**
- 2.5's arm-A photographs are explained by OUR text — those prompts carried "lifelike adult faces,
  realistic human facial proportions, true-to-life eyes". 2.5 obeyed it precisely.
- Arms B and C were verified CLEAN: zero realism/photography words anywhere in the prompt
  (chromolithograph, classical_oil, pulp_cover, watercolor_portrait). The only exceptions are legitimate —
  `cinematic_still` arm A, and `technicolor`, whose own look text is "three-strip Technicolor film
  photograph".
- 2.5 renders TRUE 9:16 (1152x2048) and costs ~$0.042 at `high`, measured from `usage` — the same as
  gpt-image-2 at its production setting.
- The 2.5 tests ran through the looks-matrix harness, which uses forced slots and therefore BYPASSES the
  framing integration line. So 2.5 was judged on a CLEANER prompt than production actually sends. In
  production it would inherit the photography prior and likely do worse, not better.

**The test to run.** The same protocol that settled flux, so the numbers are comparable:
`node scripts/qa-look-reliability.js nightly_classical_oil 9` with `force_model=openai/gpt-image-2.5-sunburst`,
solo, `qa_pin_look`, and the framing fix in place. Count how many render as an oil painting.

- lands ~8/9 → the verdict was wrong, 2.5 belongs in the rotation and needs `image_models` + DreamSmart wiring
- lands ~2/9 → confirmed at a sample size that supports the claim

**Blocked on:** nothing. Deliberately queued behind the couples run of the `lookNeutralFraming` fix.
