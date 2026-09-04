# Halloween Signature Look — day-of HERO medium × vibe × model (proposal, 2026-09-04)

**Ask (Kevin):** for the day-of Halloween HERO render, hone in on ONE master medium/vibe/model
combo that is guaranteed to perform (face swap reliability) with a consistent, standardized
look — very artsy, fun/cool. Subject matter varies per user; the style does not. Then freeze the
winning look as a Halloween-specific medium (prompt + model hardcoded) so it never drifts. Only
combos already enabled in nightly are candidates. This doc is the plan; nothing below is built.

## 1. The candidate pool (what nightly already enables)

- **Mediums** (active, `face_swaps=true`, `is_dream_eligible=true`, 10): canvas, comics,
  film_noir, glamour, illustration, pencil, photography, pop_art, vintage_film, watercolor.
  (`double_exposure`, `heirloom` are face-swap capable but not dream-eligible → excluded.)
- **Vibes** (`is_dream_eligible=true`, 5): cozy, nostalgic, cinematic, epic, peaceful.
  Halloween-flavored vibes exist but are NOT dream-eligible today: dark, macabre, nightshade,
  arcane, whimsical, psychedelic, voltage, ethereal, shimmer, surreal. Adding one to the
  candidate set is a single flag flip (`dream_vibes.is_dream_eligible`) — Kevin's call (§6).
- **Models** — nightly's face-swap picker (`pickFaceSwapModelFor`) draws from the medium's
  DreamSmart set (`dream_mediums.client_meta.smart_dream_models`) ∩ `allowed_models` minus
  `NIGHTLY_BANNED_MODELS` (flux-2-dev banned globally; flux-2-pro nightly-banned for cheesy cast
  output, 2026-08-26), then clamps: `flux-1.1-pro-ultra → flux-1.1-pro` (single + dual) and, for
  DUAL only, `flux-2-flex → flux-1.1-pro` (split failures ~25%, 2026-08-26). Net enabled pool for
  a couple render in production: **flux-1.1-pro, google/gemini-2-image, openai/gpt-image-2,
  flux-2-max** (where a medium's smart set includes them); xai/grok-imagine-image appears in the
  logs through Aug 30 (check its current allowed/smart membership before counting on it).
  `force_model` (QA flag) bypasses the picker AND the clamps, so the experiment can test any
  model; a FROZEN look on flux-2-flex would need a one-line hero exemption from the dual clamp.

## 2. Evidence: couple-swap reliability by medium × model (last 30 days, nightly, n ≥ 8)

"degraded" = the render shipped without the partner (dual_degrade / cascade / pure-scene).
"clean" = no identity retry at all.

| medium | model | n | clean | degraded | note |
|---|---|---|---|---|---|
| film_noir | flux-1.1-pro | 33 | 82% | 3% | best large-sample 1.1-pro medium |
| watercolor | flux-1.1-pro | 43 | 74% | 9% | |
| pencil | flux-1.1-pro | 39 | 79% | 10% | |
| illustration | flux-1.1-pro | 48 | 69% | 10% | |
| glamour | flux-1.1-pro | 46 | 80% | 11% | |
| canvas | flux-1.1-pro | 46 | 78% | 15% | |
| photography | flux-1.1-pro | 25 | 64% | 20% | |
| comics | flux-1.1-pro | 34 | 76% | 21% | |
| vintage_film | flux-1.1-pro | 39 | 56% | 23% | |
| pop_art | flux-1.1-pro | 8 | 38% | 50% | avoid |
| canvas / illustration / pencil / watercolor | flux-2-flex | 8-16 each | 100% | 0% | mostly forced QA batches (Aug 11-Sep 4) |
| canvas | flux-2-pro / gemini-2-image / gpt-image-2 | 8-9 each | 100% | 0% | mostly forced QA batches |
| comics / illustration / pencil / vintage_film | grok-imagine | 8-14 each | 100% | 0% | mostly forced QA batches |

Read: **the model, not the medium, is the first-order reliability lever.** flux-1.1-pro (the
natural workhorse) degrades 10-23% of couples on painterly mediums; the same mediums on flex /
gemini / gpt-image-2 show zero degrades — but those samples are small and largely QA-forced, and
the Aug-26 flex clamp was added on a ~25% split-failure observation. So the experiment's first
job is to settle the model question with fresh, same-seed, same-prompt couple renders.

## 3. Experiment (two rounds, ~80 renders, ≤3 concurrent, headroom-gated)

**Round 1 — reliability (couples only, the gate).** 6 medium×model combos × 4 seeds = 24 couple
renders with `force_model` + `force_medium` + `force_holiday_scene` on 4 fixed approved seeds
(2 cozy pools, 2 eerie pools) so every combo sees the same prompts.
Candidates: `illustration×flex`, `canvas×flex`, `watercolor×gpt-image-2`, `canvas×gemini-2-image`,
`film_noir×flux-1.1-pro` (the reliable 1.1-pro control), `comics×grok` (if still enabled).
Pass bar: 0 degrades in 4, both identity sims ≥ 0.50 median, no `identity_shipped_best`.
Survivors → Round 2. (If flex wins, note the clamp exemption in §5.)

**Round 2 — the look.** Survivors (expect 3) × 3 vibes × 3 surfaces (self, plus_one, couple) ×
2 seeds ≈ 54 renders. Vibes: cinematic, cozy, epic by default; swap in macabre / whimsical /
nightshade if Kevin enables them (§6). Same 2 seeds for everything → the only variable is the look.
Output: HTML matrix (rows = combo, columns = vibe × surface) + album captions
`🎃 SIG <combo> <vibe> <surface>`. Kevin grades.

**Rubric (score each render 1-5, keep the combo whose WORST render is highest):**
1. Face: identity ≥ 0.5 both sides, likeness by eye (face only, hair variance is fine).
2. Halloween is the HERO (abundance; the person is IN it).
3. Artsy / fun / cool (Kevin's taste — the point of the exercise).
4. Consistency: the 2 seeds and 3 surfaces read as ONE look (the freeze must standardize).

## 4. What "frozen" means (Halloween-specific mediums)

A frozen look = a new `dream_mediums` row, never edited after creation (version instead):

- `key`: `halloween_hero_v1` (then `_v2`, …). `label`: "Halloween Hero".
- `flux_fragment` + `face_swap_flux_fragment`: the winning medium's fragment with the winning
  vibe's directive text merged in VERBATIM — copied from the winning render's `enhanced_prompt`,
  not re-authored. (The hero rows carry no vibe field, so freezing the vibe into the fragment is
  zero-code; a `vibe_key` on `holiday_hero_prompts` is the small-code alternative.)
- `preferred_model` = the winning model; `allowed_models` = `[that model]`;
  `scene_eligible_models` = `[that model]`; `client_meta.smart_dream_models` = `[that model]`.
  That is the "hardcode the model" ask — the picker can only choose it.
- Flags: `face_swaps=true`, `is_public=false` (never user-selectable), `is_dream_eligible=false`
  (normal nightly never rolls it), `nightly_skip=true`, `is_bot_only=false`.
- Wiring: `holiday_hero_prompts.medium_key = 'halloween_hero_v1'` on the 6 hero rows. The hero
  path already honors `medium_key` (this pin is deliberate and is the exception to the 2026-09-04
  "holiday pools roll like every pool" rule — the day-of hero is a curated moment, the pools are not).
- Ledger: a `HALLOWEEN_SIGNATURE_LOOK_LEDGER.md` section listing the upload ids that defined v1,
  the exact fragment, model, and Kevin's grades, so v2 can be compared to v1 later.
- Reality check: "frozen" freezes prompt + model, not pixels. Flux seeds are not pinned, so two
  renders of the same look still differ in composition; the STYLE locks, the picture does not.

## 5. Validation + rollout

1. Create `halloween_hero_v1` + point the hero rows at it (dark: `holidays_enabled=false`).
2. Soak: 6 hero rows × 3 surfaces = 18 renders (+ 6 extra couples) via `force_day_of`.
   Ship bar: couples degraded ≤ 5% (≤1 of 24), identity median ≥ 0.5, Kevin grades ≥ 4/5 on 90%.
3. If the winner is flux-2-flex: add the hero exemption to the dual flex clamp (hero renders use
   the frozen medium's pinned model), deploy, re-soak 12 couples.
4. Stays dark until the Halloween window; the day-of flip is the existing `holidays_enabled`.

## 6. Decisions for Kevin

- Enable any Halloween-flavored vibes as candidates (macabre / whimsical / nightshade / voltage)?
  Default: no — run Round 2 on cinematic / cozy / epic first.
- Include grok-imagine in Round 1 if it is still in a medium's enabled set? Default: yes if enabled.
- One look for all three surfaces (self / plus_one / couple), or allow a couple-specific model
  if the couple bar forces it? Default: one look; split only if Round 1 shows no combo clears
  couples.
- Budget: ~80 renders ≈ 45 min at 2-3 concurrent. Go / no-go.

## 7. Same mechanism, later

Christmas signature look (same 5 steps), and the NIGHTLY_IMPRESS_PLAN #2 "legendary dreams"
treatment = a frozen premium look (best model + masterpiece fragment) rolled at ~3%.
