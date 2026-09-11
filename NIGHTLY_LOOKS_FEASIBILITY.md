# Nightly LOOKS — feasibility drill-down: convert ALL of nightly to a curated looks catalog (2026-09-07)

**Kevin's direction (verbatim, 2026-09-07):** "we curate a collection of approved, high quality, looks for
nightly renders instead of choosing from the mediums in the app. We can still apply the vibes from the app
if we want (could possibly curate a list of well performing vibes as well). We already have the approved
model chain: flux 1.1pro is default, and it degrades into the next model as we've done, and each one has
its 'looks' system it does well — if certain models don't do a look well, then we don't enable it for that
model — so as we degrade, each model naturally picks from its subset of approved looks." And: "this also
would help us isolate nightly dreams to be more stable because we have absolute control of the 'mediums'
(looks) that run nightly, and could tinker with main app mediums without impacting nightly."

Predecessors: `NIGHTLY_NAILED_LOOKS_RESEARCH.md` (the charter, 2026-09-04), `NIGHTLY_MODEL_POLICY_PLAN.md`
(the model chain — Phase 1 in shadow tonight), `COUPLE_PROMPT_PARITY_PLAN.md` (v3 order live 21:38 UTC),
`HALLOWEEN_HERO_LOOK_PLAN.md` §2b (instance #1, the look matrix rendering now), the bots' "Medium Looks"
pattern (`BOT_SCENE_QUALITY_PLAYBOOK.md`, 5 proven bots).

## 0. Verdict up front

**Feasible, and cheaper than it sounds, because three of the four pieces already exist.** The model chain
is `nightly_model_policy` (built). The "does model X do look Y well" membership is
`dream_mediums.client_meta.smart_dream_models` (built, per medium). The "swap-safe fragment per look" is
`dream_mediums.face_swap_flux_fragment` (built). The only new piece is a **catalog namespace that nightly
rolls from and the app never sees**, plus one resolver that joins (model from the chain) × (looks approved
for that model) × (per-user recency). Everything downstream — the medium label on the card, Dream Like
This, Dream Again, feed diversity, analytics — keeps working untouched IF the looks live as rows in
`dream_mediums` (a separate namespace), which is the recommendation in §3.

Estimated build: engine ~1 day (one roll site + resolver + shadow stamps + tests, same shape as the model
policy refactor), catalog authoring + QA ~2 sessions (≈ 250 renders, ≈ $20), rollout = shadow night →
percentage → 100 % → delete the legacy roll. The Halloween hero is the pilot: it proves the exact
mechanism (a `{look}` axis → a nightly-only medium row → pinned model) three weeks before Oct 31.

## 1. What nightly touches today that a looks catalog must replace or keep (inventory of record)

Read from `nightly-dreams/index.ts`, `_shared/dreamStyles.ts`, `_shared/faceSwapFluxOverrides.ts`,
`_shared/faceSwapModelOverrides.ts`, the client hooks.

| # | Today | Where | Under looks |
|---|---|---|---|
| 1 | **The roll.** `resolveMediumFromDb('dream_eligible_face_swap' | 'dream_eligible_scene' | '…_natural', recentMediums)` — weighted pool of `dream_mediums` rows flagged `is_dream_eligible` + `face_swaps` + `character_render_mode='natural'` (cast) or `is_scene_eligible` (scene), minus the user's last-7 mediums | index.ts 769 / 931 / 962 | **Replaced** by `resolveLook(surface, model, userRecent)` over the looks namespace. Same recency rule (last 7 looks per user from `ai_generation_log`). |
| 2 | **Face-swap fragment swap.** `applyFaceSwapOverride` swaps `flux_fragment` → `face_swap_flux_fragment` when the medium has one | index.ts 1114 / 1977 | **Kept as-is** — a look row carries both fragments (scene fragment + swap-safe fragment). Authoring rule: every cast look ships a swap fragment. |
| 3 | **1.1-pro override library.** `pickFaceSwapModelOverride(model, vibe)` replaces the fragment with 1 of 5 curated art fragments on EVERY flux-1.1-pro cast render (keyed by model only; `bannedVibes` per entry) | `faceSwapModelOverrides.ts`, index.ts 1222 / 1989 | **Retired for nightly.** Its 5 fragments become 5 catalog looks with membership = [flux-1.1-pro]. This is already a proto-looks system with the wrong shape (random per render, invisible in the label, ignores the pinned medium — the hero photography bug, lesson L2). |
| 4 | **Model membership per medium.** `client_meta.smart_dream_models` (DreamSmart) — which models render this medium well; nightly reads it as the candidate list for the face-swap model pick | `dreamStyles.ts` 83, index.ts `pickFaceSwapModelFor` | **Reused as the look's approved-model list**, but the direction flips: the chain picks the MODEL (policy row), then the look must be in `looks.where(models ∋ model)`. |
| 5 | **Model chain.** `nightly_model_policy` couple / solo / solo_rebuild / scene → primary + fallbacks per attempt | `_shared/nightlyModelPolicy.ts` (shadow tonight) | **Unchanged.** Looks sit on top: `attempt n → model_n → look ∈ subset(model_n)`; keep the same look across attempts when the fallback model also supports it, else re-roll from the fallback's subset. |
| 6 | **Pins and bans.** `dual_scenarios.mediumKey / mediumBan` (scenario rows), `holiday_scenes.mediumKey`, `holiday_hero_prompts.medium_key`, `IMAGINED_BIOME_MEDIUM_BAN`, `dualSceneMediumBan` re-roll | index.ts 1680 / 1963 / 2017 | **Pins point at look keys** (the hero's `{look}` axis is the first). Bans stay as key lists over the looks namespace. Migration: every pin/ban that names an app medium key is remapped or dropped (§5). |
| 7 | **Medium re-rolls** — scenario ban → re-roll from the swap pool; embodied → natural; `pure_scene` → scene pool | index.ts 931-969, 2017 | Same logic against `looks.where(surface)`. |
| 8 | **Gates that read the medium's model lists.** Scene gate (`scene_eligible_models`), ban gate, DreamSmart ≤2✦ cap, Ultra clamp, dual flex clamp | index.ts 1950-2050, `nightlyModelPool.ts` | **Already slated for deletion** by the model-policy Phase 3 (policy `on`). Looks must land AFTER that deletion or the two systems fight over the model. Sequence in §6. |
| 9 | **Solo rebuild fragment.** `realMediumFragment` = the medium's real fragment (not the 1.1-pro override) for the flex rebuild | index.ts 1227 / `soloRebuildInput` | The look's fragment for the REBUILD model (`solo_rebuild` policy row) — a look row that lacks the rebuild model in its membership falls back to the rebuild model's default look. |
| 10 | **Persisted label.** `uploads.dream_medium` = the medium key; `ai_generation_log.rolled_axes.medium` | index.ts persist ~4100 | `uploads.dream_medium = look key`. Every reader below keeps working because the key resolves in `dream_mediums`. |
| 11 | **Client readers of the key.** DreamCard label via `useDreamStyles` (`get_dream_mediums` RPC — public list); `useDreamAgain` (re-dream with the same medium/vibe/model — hides the button if the key is unknown); `dreamLikeThis.tsx` (loads the post's medium row + `dlt_clean_mediums`); `feedDiversity.ts` (no 4-in-a-row same medium); `mapPost.ts`; search filters | client | **Decision points** (§4): label (show the look's label), Dream Again from a nightly post (allow the look in Create, or map to the nearest public medium), DLT (needs a `dlt_clean_mediums` row per look — `scripts/distill-clean-mediums.js --missing` makes them). |
| 12 | **Vibe roll.** `resolveVibeFromDb('dream_eligible', recentVibes)` from `dream_vibes` (5 eligible today); vibe directive → brief; `VIBE` also gates the override library's `bannedVibes` | index.ts 778 | **Kept, one variable at a time.** Phase 2 adds `allowed_vibes` per look (the override library already has the concept) and a curated nightly vibe list once looks are stable. |
| 13 | **First-dream** (onboarding) — its own function + List A medium curation | `first-dream-render` | **Out of scope** (separate function, separate curation; can adopt the catalog later). |
| 14 | **Create / DLT / restyle** | `generate-dream` | **Untouched** — they keep the app mediums. This is the isolation Kevin wants: two disjoint sets in one table. |
| 15 | **Hair-variation register, action registers, scene registers, holiday pools, Option B actions, quality gate** | various | Unaffected — they shape the SCENE, not the treatment. |
| 16 | **Analytics / monitors** keyed by medium (`ai-failure-monitor`, PostHog `dream_medium` props, `check-forensics`) | scripts | New keys appear; no schema change. `check-couple-prompt-night.js`-style audit adds a per-look tally. |

**Renders per medium today (why the catalog can be small):** nightly draws from only 10 cast mediums
(canvas, comics, film_noir, glamour, illustration, pencil, photography, pop_art, vintage_film, watercolor)
+ the scene pool, and on flux-1.1-pro the ACTUAL look is one of the 5 override fragments regardless. So
the visible variety today is ≈ 5 art styles on 1.1-pro + 10 mediums on the other models. A catalog of
12-20 curated looks is MORE variety, not less.

## 2. The mechanism (what the bots do, translated to a per-user nightly)

| Bots | Nightly looks |
|---|---|
| `look_register.json` — hand-authored pure-style entries | `dream_mediums` rows in the `nightly_*` namespace (or a `nightly_looks` table — see §3) |
| neutral medium locks the identity | the v3 couple line + the single line already carry composition; the look is the ONLY style text (position 2) |
| `pickWithRecency` per bot | recency per USER over their last 7 nightly looks (the existing `recentMediums` mechanism) |
| `modelByPath` pins | `smart_dream_models` membership per look + the policy chain picks the model |
| `lookOverride()` prepends with style-authority wording | not needed: the nightly prompt is assembled, not Sonnet-written — the fragment IS the style text and nothing downstream carries style words (the parity runs proved the assembly is style-neutral apart from the medium slot) |
| clean medium for gpt/gemini | a look whose membership includes gemini/gpt uses a clean-register fragment (authoring rule) |
| HTML matrix → hearts → bans | the same look × model × surface grid we are rendering for the hero right now |

**Resolver (pure, unit-tested, `_shared/nightlyLooks.ts`):**
```
resolveLook({ surface: 'couple'|'solo'|'scene', model, recentLookKeys, forcedLook?, seedForDeterminism? })
  → candidates = looks.filter(active && surfaces ∋ surface && models ∋ model)
  → drop recent (last 7) unless that empties the pool (filterRecent's ≥2 floor, same as today)
  → weighted pick (look.weight) — or the user hash for holiday heroes
  → returns { key, fragment (scene or swap), label, stamp 'look:<key>' }
keepAcross(attempt): if current look ∈ subset(model_attempt_n) keep it, else resolveLook again
```

## 3. Where the catalog lives — the one real design choice

**Option A (recommended): rows in `dream_mediums` under a `nightly_*` key prefix, flagged
`nightly_look = true`, with `is_public = false` and `is_dream_eligible = false`.**
- Every consumer that resolves a medium by key (card label, DLT, Dream Again, feed diversity, search,
  analytics, forensics) works with zero client change — the look is a medium row the app never lists.
- Isolation is a FILTER, not a table: Create reads `is_public`/`is_dream_eligible`; nightly reads
  `nightly_look`. A CI test asserts the two sets are disjoint, and a DB check constraint forbids
  `nightly_look AND is_public` (so a dashboard edit cannot leak a nightly look into the app, or an app
  medium into nightly). Kevin can tune app mediums freely; nightly rows only change by explicit intent.
- Reuses `face_swap_flux_fragment`, `flux_fragment`, `face_swaps`, `is_scene_eligible`,
  `character_render_mode`, `client_meta.smart_dream_models`, `label` — no new columns beyond the flag,
  `weight`, and `allowed_vibes` (nullable).
- The 1.1-pro override fragments and the hero looks (`halloween_*`) are simply rows here.

**Option B: a new `nightly_looks` table.** Cleaner on paper, but `uploads.dream_medium` would then hold a
key no `dream_mediums` row resolves → DreamCard shows "Nightly Gouache" only after a client change, DLT
needs a second lookup path, Dream Again hides its button, feed diversity still works. That is 4 client
touch points + a store build for no isolation gain over the flag + constraint. Not recommended.

**The `medium` word in the app.** Users see "Watercolor" etc. on cards today. A look's `label` is what
they will see ("Storybook Gouache", "Ink & Wash", "Moonlit Oil") — choose labels that read as styles, not
as internal names.

## 4. Decisions Kevin owns (each changes what gets built)

1. **Dream Again from a nightly post** — (a) allow: the look renders in Create at the normal price (fun,
   and free marketing for the look), or (b) map to the nearest public medium. (a) is one line
   (`get_dream_mediums` stays public-only; the create path resolves any active key). Recommend (a).
2. **Vibes** — keep the current 5-vibe roll untouched for v1 (one variable), add `allowed_vibes` per look
   in v2 with the curated-vibe list. Recommend exactly that order.
3. **Photography** — today it is 10 % of the cast pool and the override library repaints it on 1.1-pro.
   Is a "clean cinematic photograph" look in the catalog at all? (Kevin's standing rule: no photography
   in nightly.) Recommend: not in v1.
4. **Catalog size and weights** — 12-20 looks; equal weights v1; Kevin's hearts drive weights v2.
5. **Scene-only looks** — the pure-scene path (no cast) needs its own looks (no swap constraint, richer
   painterly allowed). Same namespace, `is_scene_eligible = true`, `face_swaps = false`.
6. **Per-user recency window** — 7 (today's medium rule) or the whole catalog before a repeat.

## 5. Migration — what moves, what breaks, what is deleted

- **Pins:** `holiday_hero_prompts.medium_key` (6 rows) → look keys (the hero plan does this);
  `holiday_scenes.mediumKey` (Halloween/Fall subs with a pin) → look keys or null; `dual_scenarios`
  rows with `mediumKey`/`mediumBan` → remap by a lookup table (app medium → nearest look) in one
  migration; `IMAGINED_BIOME_MEDIUM_BAN` (a key list) → look keys.
- **Deleted from nightly (with the model-policy Phase 3):** `pickFaceSwapModelOverride` + the library,
  `nightlyModelPool`'s ≤2✦ cap, the DreamSmart set as the model candidate list, both clamps, the scene
  gate narrowing. The looks resolver + policy resolver replace all of them.
- **Kept:** `applyFaceSwapOverride` (fragment selection by surface), `filterRecent`, the vibe roll,
  every scene/action/register system, the quality gate, the swap pipeline.
- **Breaks if forgotten:** DLT on a look post without a `dlt_clean_mediums` row (falls back to the raw
  fragment — works but may drag the look's style words onto the user's subject); the `get_dream_mediums`
  RPC must keep filtering `is_public` (it does); analytics that assume the medium key set is fixed.
- **Rollback:** `engine_config.nightly_looks_mode = 'off'` restores the legacy roll while the legacy code
  exists (Phase 3 of the model policy deletes legacy model layers, not the medium roll — the medium roll
  is deleted only in the looks Phase 5).

## 6. Rollout (mirrors the model-policy playbook; every phase has a test and a rollback)

0. **Tonight/tomorrow:** model-policy shadow night → Phase 3 (`on`, delete the 8 legacy layers) → Phase 4
   (Kevin's rows). Looks build on the policy resolver; do not interleave.
1. **Inventory + baseline (read-only, 1 session):** hearts / quarantines / DLT-reuse / identity pass per
   medium × model × vibe, last 60 nights (charter phase 1). Output `NIGHTLY_LOOK_TALLY.md` — the ranked
   "what already nails" table that seeds v1.
2. **Catalog v1 (authoring):** 12-20 rows — the 5 override fragments (1.1-pro), the best 6-8 existing
   swap fragments by the tally, 3-5 new pure-style registers (gouache poster, ink-and-wash, painted cel,
   editorial illustration, linocut — the bots' proven trick), + the Halloween hero looks. Each row:
   label, both fragments, surfaces, `smart_dream_models` from the cross-model evidence we already hold
   (today's 13-model check, Phase B, the hero matrix), weight 1.
3. **The gate (renders, ≈ 100):** each look × 4 fixed couple seeds on its primary model → first-try
   swap ≥ 3/4 and min identity ≥ 0.50 median, else cut or demote to solo/scene only. Then each surviving
   look × each model in its membership × 1 couple → drop the model from membership if it degrades.
4. **Kevin's grid (renders, ≈ 100):** survivors × 3 surfaces × 3 seed kinds (location / goofy or elegant
   / holiday) → the same embedded-image grid page as the hero matrix, captions `✨ LOOK <key>` in the
   Dreams album. Heart = ban. Labels chosen here.
5. **Build (≈ 1 day):** `nightly_look` flag + check constraint (migration), `_shared/nightlyLooks.ts`
   resolver + loader (60 s TTL, fail-open to legacy), `engine_config.nightly_looks_mode` off | shadow |
   on, shadow stamps `look_shadow:<surface>:<key>` beside the legacy medium, `force_look` QA flag,
   tests: resolver (membership, recency floor, keep-across-attempts), disjointness (looks ∩ app = ∅),
   dbspec (every active look has both fragments + ≥1 model in the policy chain), no-hardcoded-look grep.
6. **Shadow night → 30 % → 100 %:** `check-nightly-looks-night.js` (per-look first-try / degrade /
   faceless / gate / identity vs the legacy baseline, exit 1 if worse). Two weeks at 100 % with hearts
   per 100 by look → weights v2, retire losers.
7. **Delete the legacy medium roll for nightly** (one commit, grep test that nightly never reads
   `is_dream_eligible`).

## 7. Risks and how each is covered

| risk | cover |
|---|---|
| A look that is gorgeous but swap-hostile | the gate (§6.3) before taste; couple identity is the whole product |
| Catalog too small → users notice repeats | 12-20 looks × recency-7 × the scene/action variety; today is effectively 5 on 1.1-pro |
| A fallback model has no approved look | resolver falls back to that model's default look (a `clean` row per model, authored once) — never a faceless/unstyled render |
| App medium edits leak into nightly | check constraint + CI disjointness test |
| DLT drags style words onto a user subject | `dlt_clean_mediums` row per look, generated by the existing distill script, checked by the dbspec |
| Shadow stamps disagree with legacy | expected — the shadow measures COVERAGE (does every legacy medium map to a look on that model), not equality; the acceptance is "no render would have had no look" |
| Two refactors in flight (policy + looks) | strict sequencing (§6.0); looks never touch model choice, policy never touches style |

## 8. What the Halloween hero pilot proves before any of this ships

The hero plan (§2b) implements the exact shape at 1/20 scale: nightly-only medium rows (`halloween_*`),
a `{look}` axis picked per user by the seed hash, the model pinned by the chain, the override library
bypassed, a grid page for Kevin's pick, and the two approved fixes (attire split, never faceless). If the
hero ships clean on Oct 31, the general catalog is the same code with a wider table.


## 9. Pilot status (2026-09-08) — the Halloween day-of runs on looks

Built and live on the day-of path (HOLIDAY_DAY_OF_PLAN.md §5d, migration 478): six `halloween_*` rows in
`dream_mediums` (the §3 "rows in a namespace" design: `is_public=false`, `is_dream_eligible=false`,
`is_scene_eligible=false`, `nightly_skip=true`, per-look `client_meta.smart_dream_models`), the holiday
catalog names its look set (`holidays.day_of_look_keys`) and its ban (`day_of_medium_ban`), and the render
pins the look through the EXISTING scenario medium-pin route — look first, then the model from the look's
approved list, the 1.1-pro override library exempted, the solo rebuild inheriting the look's real fragment.
Nothing in the app, Dream Again, DLT or analytics changed (`uploads.dream_medium` = the look key; the card
label prettifies the key). What the pilot proves for the full catalog: the pin route + the per-look model
list ARE the resolver from §2 — the remaining work for all-of-nightly is the roll site (replace the
`dream_eligible_face_swap` roll with a catalog roll + per-user recency) and the catalog authoring/QA in §6.

## 10. Plan of record (2026-09-11)

Kevin greenlit the conversion ("start using this system for nightly dreams", flux-1.1-pro as THE nightly
model). The build plan, the v1 catalog (12 cast + 12 scene looks mapped from today's pool), the new-look
brainstorm and the open decisions live in **`NIGHTLY_LOOKS_CATALOG_PLAN.md`**.
