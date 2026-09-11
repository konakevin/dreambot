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

| # | Site (line) | What it decides | Notes |
|---|---|---|---|
| 1 | 667-739 chaos-tier pre-roll | dream type → medium TOKEN (`dream_eligible_face_swap` / `_scene` / `_scene_natural` / embodied list) | tier-gated embodied 0/10/15 % |
| 2 | 770-791 `resolveMediumFromDb(token, recent, _, firstDreamAllow)` | the roll from the APP pool (`is_dream_eligible` + flags), minus the user's last 7 | `force_medium` re-resolves |
| 3 | 939-956 realistic ban | character + hyperreal/render/photography → re-roll from the swap pool | re-roll #1 |
| 4 | 965-986 scene gate | pure_scene / epic_tiny + not `is_scene_eligible` → re-roll from the scene pool | re-roll #2 |
| 5 | 992-1010 day-of medium ban (scene) | re-roll up to 6× until not banned | re-roll #3 |
| 6 | 1015-1021 capture | `resolvedMediumAllowedModels / SceneModels / SmartModels`, `isEmbodiedMedium` | three copies of medium state, re-synced by hand at every later re-roll |
| 7 | 1140-1147 `applyFaceSwapOverride` | swaps `flux_fragment` → `face_swap_flux_fragment` | fragment swap #1 |
| 8 | 1148-1260 model pre-pick | `nightlyModelPool` (smart ∩ allowed − bans, ≤2✦) → ultra clamp → dual steer → flex clamp → policy shadow/on | the 8 legacy layers the policy replaces |
| 9 | 1262-1275 **`pickFaceSwapModelOverride`** | on 1.1-pro replaces the fragment with 1 of 4 library fragments | **the dishonest step**: label stays, style changes; `realMediumFragment` kept for the rebuild |
| 10 | 1665-1685 scenario row | `dualSceneMediumKey` / `dualSceneMediumBan` from `dual_scenarios` | pin source #1 |
| 11 | 1739-1745 holiday scene pin | `holiday_scenes.medium_key` → `resolveMediumFromDb` | pin source #2 |
| 12 | 2054-2066 day-of look pin | `pickDayOfLook` → rides `dualSceneMediumKey`; merges the day-of ban | pin source #3 (the pilot) |
| 13 | 2069-2180 pin apply + bans | `IMAGINED_BIOME_MEDIUM_BAN` (hardcoded), scenario pin → re-resolve + override swap + model re-pick + library again; banned → re-roll + the same three again | re-rolls #4/#5; sites 7-9 repeated twice |
| 14 | 3198-3310 scene model | `nightlyModelPool` again → policy shadow/on → scene gate re-pick (`scene_eligible_models`) → per-medium bans/pins (empty maps) → ban-gate backstop | model decided a second time for scenes |
| 15 | 4301-4430 persist | `model_used`, `rolled_axes.medium`, `uploads.dream_medium = resolvedMediumKey` | writes the PRE-override key |

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

**Precedence (one table, one place):** `force_look` (QA) → day-of look set → holiday-scene pin → scenario pin →
catalog roll(surface, model, recency, bans, allow-list). A pin that names an unknown/inactive look falls to the
roll and stamps `look_pin_unknown:<key>` (fail open, never faceless).

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

| Layer | Mechanism | Fails when |
|---|---|---|
| DB | CHECK constraint on `dream_mediums` | a dashboard edit makes a look public / an app medium a look |
| DB (CI db-tests) | `nightlyLooks.dbspec.ts`: every active look has fragment + directive (+ swapFragment if couple/solo) + ≥1 model that appears in the policy chain; every pin resolves; each surface with a non-zero `nightly_surface_mix` share × policy model has a default look | a row is half-authored; a pin dangles; a surface is switched on with no looks |
| CI | `nightlyStyleSingleSource.test.ts`: greps `nightly-dreams/index.ts` — the only style/model imports allowed are `nightlyStyle.ts` + `nightlyModelPolicy.ts`; forbidden: `resolveMediumFromDb`, `applyFaceSwapOverride`, `pickFaceSwapModelOverride`, `nightlyModelPool`, `pickFromPool`, `steerDualModel`, `fetchSceneEligibleModels`, `smartDreamModels`, any `black-forest-labs/`/`google/`/`openai/`/`xai/` literal | someone re-adds a second decision site |
| CI | `nightlyLooksDisjoint.test.ts`: catalog keys ∩ app-eligible keys = ∅ (from the migrations' seed rows) | a look leaks into Create's pool or vice versa |
| CI | `nightlyStyle.equivalence.test.ts` (Phase 1): fixtures from real `ai_generation_log` rows → the resolver reproduces the legacy medium / fragment / model | the extraction changes behavior |
| CI | `nightlyStyle.test.ts`: precedence table, recency floor, unknown-pin fallback, default-look fallback, `attempt(n)` / `rebuild` keep-or-default | resolver logic drifts |
| Runtime | honesty assertion at persist → `style_contract_violation` stamp + Sentry | the prompt and the label disagree |
| Monitor | `check-nightly-looks-night.js` (cron, fail-loud): per look renders / first-try swap / degrade / quality-gate pass / violations; thresholds derived from `engine_config` per the hard rule | a look regresses; any violation |

---

## 5. Phases (each shippable alone, each with a flag or a revert)

| Phase | Work | Proof | Rollback |
|---|---|---|---|
| **0. Model policy ON + delete its legacy layers** (this week; `NIGHTLY_MODEL_POLICY_PLAN.md` Phase 3-4) | `model_policy_mode = on`; delete pool/clamps/steer/bans/scene-gate/ban-gate/`solo_rebuild_model`; Kevin's final rows; `nightlyNoHardcodedModels.test.ts` | `check-model-policy-shadow.js --hours 96` clean (it has matched since 09-07); one soak night | `mode = legacy` (code kept until the soak passes) |
| **1. Extract the style contract — behavior-neutral** | `_shared/nightlyStyle.ts` in `source = legacy` mode: it performs today's roll + re-rolls + pins + bans + override library + first-dream allow-list + forces and returns the contract; `index.ts` sites 1-15 collapse to one call + consumption; `realMediumFragment` etc. removed; persist writes from the contract; honesty assertion added (in legacy mode it reports the override-library dishonesty as `style_contract_note:override_library` rather than a violation) | equivalence fixtures (50 real rows across couple / solo / scene / pinned / day-of / first-dream); golden prompt fixture byte-identical; a shadow night with `style_contract_note` counts = today's override rate | git revert (one commit) |
| **2. Catalog source behind a flag** | migration (§3 columns + constraint + `halloween_*` back-fill + v1 rows from the catalog plan + pin remap + config); `nightly_looks_mode = shadow` makes the resolver compute the catalog contract alongside legacy and stamp `look_shadow:<surface>:<key>`; `force_look` QA flag | shadow night: every render has a look for its surface × model (coverage, not equality); dbspecs green | `mode = off` |
| **3. Curation** (Kevin; parallel with 1-2) | reliability gate (cast looks × 4 fixed couples, stamps decide) → Kevin's grid in the Dreams album → weights / bans / labels | `NIGHTLY_LOOK_TALLY.md` | rows are data |
| **4. Cutover + delete legacy** | `mode = on` → 30 % (per-user hash) → 100 % → two weeks; then delete the legacy source branch, the override-library import, `faceSwapFluxOverrides` use, `force_medium`; the honesty assertion becomes a hard violation; the chaos-tier embodied sub-roll + `embodied_mediums_mid/_high` deleted (`nightly_surface_mix.embodied = 0`, brief branch kept dormant) | `check-nightly-looks-night.js` per look vs the legacy baseline; `nightlyStyleSingleSource.test.ts` green | percentage down; `mode = shadow` |
| **5. First-dream on looks** | `first_dream_look_keys` (List A → look keys); `firstDreamMediums.ts` medium logic deleted; the cascade unchanged | first-dream QA cascade (existing script) | config |
| ~~6. Create's override library~~ | **Retracted 2026-09-11 (I was wrong):** Create's override (`createFaceSwapOverrides.ts`, DB table `face_swap_model_overrides`, mig 266) is keyed by (model × medium) and must render THAT medium's look — a per-medium fragment a stubborn model obeys, label honest. It is the precedent for the looks catalog, not a defect. Nothing to do in Create. | — | — |

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
2. `force_medium` alias: keep one release for QA scripts, or rename everywhere at once?
3. ~~Create's override library~~ — retracted; Create is honest today (§5 row 6).
