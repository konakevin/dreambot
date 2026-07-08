# Face-Swap Engine — Deep Audit, Critique, and the Path to Expressive Poses

> 2026-07-08. Two-agent code audit (swap mechanics + scene composition) + production-log
> forensics + external research (papers + hosted-model landscape). Everything below is
> verified against code (file:line at audit time) or production data unless marked as a
> research claim. Companion knowledge: CREATE_PIPELINE_ARCHITECTURE.md.

## 0. Headline findings (ranked)

1. **~~The smart dual engine is dormant~~ — CORRECTED 2026-07-08 (Stage 0): the dynamic
   split IS LIVE.** Fly machine logs show `dynamicSplit=true` + per-request detection
   ("dynamic split @380 overlap=31 faces=2 L=female R=male") on every dual; the flag was
   set as a Fly secret and release v6 (June 17) carries the code. The original inference
   (zero `no_dual_split` reasons across 143 duals ⇒ blind crop) was wrong because the
   engine logs NOTHING to ai_generation_log on success — silence meant a 100% clean
   2-face detection rate (the pose pools work), not dormancy. The REAL finding is the
   telemetry gap: success-path engine/split stats are invisible outside Fly's log buffer,
   which is exactly how a misreading like this happens — fixed by the Stage-0 accounting.
   Residual auth finding: FLY_AUTH_TOKEN is set (auth enforced), but the compare is
   non-constant-time and auth silently disables if the secret is ever unset.

2. **No face restoration after the swap — the single biggest quality lever, unused.** All
   three swap models are InsightFace `inswapper_128`: identity is reconstructed at
   **128×128** and blended back, at any render resolution. The industry-standard fix
   (FaceFusion et al.) is a post-swap face enhancer (GFPGAN ~80-90 blend / CodeFormer);
   we run **none**. This is also *why* HD upscale must stay blocked on swapped dreams —
   restoring the face is the prerequisite that could lift that ban.
3. **The pose prison is real and quantified.** Swappable dreams forfeit the entire
   cinematography axis: camera distance (locked waist-up), angle (locked 3/4-frontal
   eye-level), subject placement (side-by-side, same height, gap ≥ 4% of width), subject
   count, and ALL physical interaction (hugs/contact verbs are detected and rewritten to
   side-by-side). What varies is wardrobe/mood/props/location/lighting/pose-flavor —
   surface dressing on a fixed portrait geometry. §4 is the escape plan.
4. **kontextPass is dead code.** The style-unify pass (repaint the photoreal swapped face
   into watercolor/painterly style) has zero callers — swapped faces on stylized mediums
   ship un-unified. `dualGenderRouting.ts` was NEARLY dead (CORRECTED during Stage 0:
   `genderFromLock` was live in generate-dream — relocated to genderLock.ts 2026-07-08;
   the routing/verify functions + module deleted).
5. **A live contradiction in the composition layer**: `sceneEngine.ts`'s legacy face-swap
   branch (`SUBJECT_SCALE_FACESWAP` "subject fills 25% of frame / lower third / face 8-15%
   of height") mandates exactly the small-face framing the 2026-06-19 incident proved
   kills swaps. VERIFIED during Stage 0 (2026-07-08): NOT unreachable — nightly's
   freeform-brief legs (pet singles + slot-pipeline-throw fallback) still consume it via
   dreamSubject. Warning comment added at the pools; alignment queued into Stage 5.
6. **Nobody can see what swaps cost.** Swap Replicate spend (2 inswapper calls per dual ×
   retries × rrenders × dup-retries) is explicitly excluded from `cost_cents`. A dual with
   2 rerenders burns ~3 renders + 6 swap calls, logged as one render's cost.

## 1. Verified system model (what actually happens)

**Base render** — two prompt engines compose swap-safe scenes:
- Nightly + Create-dual (primary): the **slot pipeline** (`characterSlotPrompt.ts`) —
  Sonnet writes ONLY scene/wardrobe/mood/props; ALL geometry is hardcoded parts in fixed
  order (gender-lock SHOUTED first; framing block BEFORE scene_description — the
  2026-06-19/20 hard lesson); forbidden-pattern regex + 2 retries + generic fallback.
- Create single + Create-dual fallback: **freeform briefs** (`singleBriefBuilder` /
  `dualBriefBuilder`) — Sonnet writes the whole prompt around a mandated faceLockPhrase;
  no regex validation; scene-first structure (the exact shape the slot banner warns
  about). Divergence noted in §3.
- Pose vocabulary: dual = 249 pooled actions (90 companion / 134 partner / 25 playful),
  all STATIONARY, heads-apart, side-by-side; single = 349 actions across 5 composition
  presets, all waist-up/one-person-alone. `scan-dual-faceswap-proximity.js` lints pool
  seeds for proximity phrasing (but not `dualBriefBuilder`'s own reframe bullets, which
  emit "shoulder-to-shoulder" — a coverage gap).

**Swap** — `inswapper_128` via three interchangeable Replicate wrappers (cdingram primary
→ yan-ops → pikachupichu25; yan-ops demoted for a canned-output bug; source images
byte-perturbed to defeat Replicate's content-hash cache). Single: solo guard probes the
render with Haiku vision (2 calls/probe, up to 3 probes), gender-verifies, rerenders with
a prompt mutation ("exactly one person...") or refunds. Dual: crop left 55% / right 55%
(10% center overlap), swap halves in parallel, stitch with a 40px crossfade — or, when
`DUAL_SWAP_DYNAMIC_SPLIT=true` on Fly: YuNet detect → gap-midpoint split (min gap 4% W,
never crossing a face) → genderage-matched source routing → OR a per-face masked
composite for stacked poses (IoU ≤ 0.35). Rerender loop: up to 2 fresh re-rolls of the
SAME prompt (dual; solo mutates), 85s recovery budget inside a 140s deadline. Create is
strict (fail → refund); nightly degrades (dual→single→unswapped); first-dream cascades
tiers. jpg is forced for duals and ultra clamps to pro (memory ceilings). Nightly has
perceptual-hash dup detection; Create doesn't (mitigated by cdingram-primary + perturb).

**Post-swap: nothing.** No restoration, no style unify (dead), no upscale (banned).

## 2. Critique — the "stupid / incorrect / unoptimized" list

Operational (fix this week):
- **O1. Flip on the dynamic split** (verify `fly secrets set DUAL_SWAP_DYNAMIC_SPLIT=true`
  + confirm `DUAL_SWAP_FANOUT`/`FLY_URL` routing) and add a **startup log line + healthz
  field** that reports which engine variant is active — a two-flag silent downgrade to the
  blind crop must never be invisible again. Then watch `no_dual_split` rates appear.
- **O2. Fly auth**: non-constant-time token compare, and auth is SKIPPED if
  `FLY_AUTH_TOKEN` unset — a fresh deploy is an open Replicate-credit faucet. Make the
  token mandatory + `timingSafeEqual`.
- **O3. Add swap-cost accounting** to `ai_generation_log` (swap calls × unit cost +
  rerender count) — the retry amplification is currently invisible.
- **O4. Housekeeping**: delete or wire `kontextPass.ts`; delete `dualGenderRouting.ts` +
  its test; fix the stale "primary is yan-ops" comment; bilinear (not nearest) resize on
  swap output; port the 1.2MB perturb guard + blend clamp so `_shared` and Fly copies
  stop drifting (better: make Fly the ONLY dual engine and delete the in-process copy —
  the 256MB-isolate constraint that motivated it no longer binds anything).
- **O5. Composition layer**: confirm `sceneEngine`'s face-swap branch is unreachable and
  delete it; extend the proximity scanner to `dualBriefBuilder.ts` string literals; align
  Create's dual fallback brief with the slot pipeline's part order (or accept the
  fallback risk explicitly).

Quality (the render-quality levers, in impact order):
- **Q1. Post-swap face restoration.** Add GFPGAN (~0.8 blend) or CodeFormer after every
  swap — hosted on Replicate for ~$0.001-0.01/image or run on the Fly box. This is the
  documented, industry-standard fix for inswapper_128's softness and the reason swapped
  faces look "almost right." Bench on AlphaBot: swap vs swap+GFPGAN at 0.7/0.8/0.9.
  Success also likely unblocks HD upscale on swapped dreams (restore → then Clarity).
- **Q2. Feed the swap more face pixels.** Dual halving + jpg + the ultra clamp all shrink
  the face region inswapper sees. With Fly (2GB) as the only engine: run the per-face
  composite path at full resolution with a face-crop "pixel boost" (upscale the face crop
  ~2× before swap, downscale after — FaceFusion's trick), and revisit the ultra clamp
  (4MP work fits in 2GB; it only busted the 150MB isolate).
- **Q3. Wire style-unify for stylized mediums** (the kontextPass idea was right): swap →
  Kontext/Nano-Banana repaint with identity-preserve instruction. Bench per medium.
- **Q4. Replace the solo guard's Haiku probes with a Fly `/detect` endpoint** — YuNet +
  genderage is faster, cheaper, deterministic, and returns exact boxes (2 Haiku vision
  calls × up to 3 probes per solo render today).

## 3. Nightly vs Create — unified? Mostly.

Same swap modules, same deadlines, same geometry. Real divergences: strict/degrade policy
(Create refunds; nightly ships unswapped or degrades dual→single), dup-detect (nightly
only), model pools, and Create-dual's freeform *fallback* brief lacking the slot
pipeline's structural enforcement. Verdict: acceptable divergences except the fallback
brief (O5) — document or converge.

## 4. Escaping the pose prison — architecture options

The constraint exists because the pipeline is **swap-blind until after the render**: we
constrain prompts so hard that a blind crop can't miss. Every escape route below works by
making identity robust to composition instead. Ordered by risk:

**A. Turn on + trust detection, then relax poses incrementally (cheapest, this month).**
The per-face composite path already handles stacked/overlapping poses (piggyback, dip,
dancing) — it was built for exactly the poses the pools ban, and it's dormant. Once O1
ships and `no_dual_split` telemetry exists: add a "contact" pose pool (hugs, arm-around,
dancing, cheek-close) gated to the composite path, and change the dual rerender loop to
MUTATE the prompt on retry 2 ("both faces clearly visible, heads apart") instead of
re-rolling the same prompt — free poses on attempt 1, safe poses as the fallback ladder.
Detection adjudicates instead of prompts pre-censoring. Expected: most contact poses
where both faces stay visible swap fine; the pool lint relaxes from "heads on separate
sides" to "both faces visible, neither occluded."

**B. Replace the crop/stitch with a native two-person swap model (high leverage, bench
first).** `easel/advanced-face-swap` (Replicate/fal, ~$0.04/image, commercial use) swaps
one or two people with automatic gender targeting in the target image, preserving skin
tone + build — it replaces our crop, split geometry, gender routing, AND stitch with one
call. If its likeness ≥ inswapper+restore on an AlphaBot bench, the entire "clear band of
background between their heads" contract can go, because there is no midline crop
anymore. Keep our Fly engine as fallback. This is the single change most likely to make
couple dreams feel natural (real proximity, real interaction).

**C. Identity-conditioned generation — render the person INTO the scene (the endgame for
solo, strong for duals).** Instead of render-then-paste: inject identity at generation
time, so pose/angle/lighting/expression are free and the face is lit by the scene.
Current hosted options: **PuLID-FLUX** (Replicate ~$0.014, fal ~$0.033/MP),
**InfiniteYou** (ByteDance, FLUX.1-dev, InfuseNet — beat PuLID in 80% of human evals,
ICCV 2025 highlight, hosted ports exist), and for MULTI-person with per-position
identity: **ID-Patch** (ByteDance/MSU — ID patches placed on a positional canvas, built
exactly for "two people shaking hands" without identity bleed) and **AnyPhoto** (2026,
location-canvas multi-ID). Two integration shapes:
  1. *Pure*: identity-conditioned render replaces swap entirely for eligible mediums.
     Likeness is good-not-exact (softer than a swap; PuLID shows copy-paste artifacts,
     InfU is better) — probably below the "that's really me" bar alone.
  2. *Hybrid (recommended bench)*: identity-conditioned base render + inswapper touch-up
     + restore. The base face already resembles the user (right geometry, lighting,
     angle), so detection is trivial, the swap is a small correction rather than a
     transplant, and off-angle/profile faces stay recognizable even where a raw swap
     would fail. This is the architecture that genuinely frees the camera axis for solo
     dreams (low angle, profile, full-body, subject-in-vista) — everything
     `SINGLE_COMPOSITION_PATHS` currently bans.
**D. Reference-model recomposition as an "expressive" tier.** Our own NEW_SCENE Phase 0
bench already proved Nano Banana Pro / Seedream preserve BOTH faces of a couple under
full recomposition at 9:16 with zero geometry constraints (and NB Pro claims identity for
up to 5 people at 4K). An instruction-driven "place these two people dancing in the rain"
tier — priced like Best-likeness — covers exactly the expressive scenes the swap can't,
with the visible-fallback pattern from NEW_SCENE_QUALITY_PLAN. Watch refusal rates
(children) and cost.

**Not recommended now**: the March-2026 academic SOTA (GSwap 3D Gaussian head swap, AnyID
video identity, MMFace-DiT) is video-oriented and not hosted anywhere usable.

## 5. Unit economics — does the quality stack stay profitable? (2026-07-08)

Baselines (SPARKLE_PRICING_STRATEGY.md, verified 2026-06-08): net revenue per sparkle
after Apple = **$0.077–$0.113 @15%** ($0.064–$0.093 @30%), floor = Whale pack. Current
all-in user-dream cost ≈ **$0.045** (render $0.040 + Sonnet ~$0.005 + amortized swap).
Swap call ≈ **$0.013** (inswapper via Replicate). A dual = 2 swap calls; a dual RERENDER
= +1 render +2 swaps ≈ **+$0.066**.

Per-dream marginal cost of each proposed change:

| Change | Marginal cost | Note |
|---|---|---|
| Dynamic-split flip (O1) | ~$0 compute (Fly is flat ~$30-40/mo, already paid) + the rerenders it TRIGGERS: ~+$0.007-0.013 amortized per dual (est. 10-20% now rerender instead of shipping a bad swap) | buys correctness, not pixels |
| GFPGAN/CodeFormer restore (Q1) | **+$0.001-0.002** per swapped dream (Replicate T4 ~2s); ~$0 if run on the Fly box | biggest quality-per-cent in the plan |
| Fly /detect replacing Haiku probes (Q4) | **−$0.002 to −0.006** per solo dream (removes 2-6 Haiku vision calls) | a SAVINGS |
| easel/advanced-face-swap dual (B) | $0.040 vs today's 2×$0.013=$0.026 → **+$0.014** per dual, minus avoided rerenders (each −$0.066) | plausibly net NEGATIVE cost if it halves rerenders |
| PuLID-FLUX hybrid solo (C) | base $0.014-0.033 REPLACES the $0.040 Flux render, + swap $0.013 + restore $0.002 ≈ **$0.03-0.05 total** | ≈ wash vs today's ~$0.053 solo-swap dream |
| kontext-unify stylized swaps (Q3) | **+$0.030-0.040** (one Seedream/Kontext edit) per stylized swapped dream | the one genuinely pricey add — gate to stylized mediums or a premium tier |
| NB Pro expressive tier (D) | $0.134/render, already priced at 5✦ = $0.39-0.57 net revenue | ~65-75% margin at existing tier pricing |

**Aggregate:** the always-on additions (restore + detection + probe replacement) net to
roughly **+$0.00-0.01 per swapped dream** — noise against the $0.077 revenue floor. The
pricey options (kontext-unify, NB Pro) map onto existing sparkle tiers instead of eroding
the 1✦ floor.

**The real margin note is pre-existing, not new:** swap dreams charge base model sparkles
only — the swap is free to the user. A worst-case dual TODAY (1✦ = $0.077-0.113 net)
burning 2 rerenders costs ~$0.20 → underwater on that render; profitability holds because
rerenders are rare and swaps amortize (~30% of dreams; blended ≈ $0.046/sparkle cost vs
$0.091+ gross). The upgrades barely move this, but two cheap levers close it structurally
if dual volume grows: price duals at 2✦ (cast-in-scene is visibly premium), and land O3
(swap-cost accounting) so the amortization is verified against invoices, not estimated.

## 6. Recommended sequence

1. **Week 1 (O-items):** flip dynamic split + engine-variant telemetry; Fly auth; swap
   cost accounting; dead-code purge; scanner + sceneEngine fixes.
2. **Week 1-2 (Q1):** GFPGAN/CodeFormer post-swap bench on AlphaBot (solo + dual, per
   medium); ship at winning blend. Re-evaluate the HD-upscale ban behind it.
3. **Week 2 (A):** contact-pose pool gated to composite path + prompt-mutating dual
   retry; measure no_dual_split + user-visible quality.
4. **Week 2-3 (B):** easel/advanced-face-swap bench vs Fly+restore on the same base
   renders; if ≥, promote to dual primary and begin retiring midline-gap constraints.
5. **Week 3-4 (C-hybrid):** PuLID-FLUX / InfiniteYou hybrid MVP on solo dreams with a new
   "expressive" composition preset (profiles, low-angle, full-body); AlphaBot bench
   against current solo pipeline; ID-Patch spike for dual if solo wins.
6. **Later (D):** expressive reference tier, riding NEW_SCENE_QUALITY_PLAN's Phase 1
   plumbing (bucket routing, visible fallback, tier pricing).

## Research sources

- InfiniteYou: https://arxiv.org/abs/2503.16418 · https://github.com/bytedance/InfiniteYou · https://bytedance.github.io/InfiniteYou/
- ID-Patch: https://arxiv.org/abs/2411.13632 · https://byteaigc.github.io/ID-Patch/
- AnyPhoto (multi-ID location canvas): https://arxiv.org/abs/2603.14770
- PuLID-FLUX hosted: https://replicate.com/jichengdu/flux-pulid · https://fal.ai/models/fal-ai/flux-pulid
- easel/advanced-face-swap: https://replicate.com/easel/advanced-face-swap · https://replicate.com/blog/easel
- inswapper_128 + restoration practice: https://github.com/haofanwang/inswapper · https://magichour.ai/blog/how-to-use-facefusion · https://glucauze.github.io/sd-webui-faceswaplab/faq/
- Nano Banana Pro identity (up to 5 people, 4K): https://blog.laozhang.ai/en/posts/nano-banana-pro-face-consistency-guide
- 2026 SOTA horizon: https://www.insightface.ai/blog/march-2026-face-swapping-papers
