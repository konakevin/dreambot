# NEW_SCENE_QUALITY_PLAN.md — freeform uploaded-photo New Scene, done right

**Status:** APPROVED + Phase 0 QA COMPLETE + PHASE 1 BUILT/DEPLOYED 2026-07-08. Grounded in the
4-agent render-flow audit + two ruthless reviews + three production measurements + a real-photo
likeness/recomposition bench (the capability contract below). Reverses one v1 overreach (do NOT
drop the solo swap); the supported-input set and the `new_scene_max_people = 3` cap are now
evidence-backed.

## The goal

A user uploads *any* photo, picks a medium + vibe, and gets the **best-quality, identity-correct
render** for whatever they uploaded, with the medium and vibe applied, gracefully handling
whatever people throw at it (including bad photos).

## The core split (two distinct jobs)

- **Job A — "exact you."** Your real face, pasted in via **face-swap**. Exact identity, but
  humans only, and it needs a *clean* face to swap.
- **Job B — "reimagine this photo."** Hand the photo to a **reference-capable model**
  (Seedream / Nano Banana) that rebuilds it into a new scene. Preserves the subject by
  **likeness/consistency, not pixels.** Works on anything (pet, object, group, scene).

The key correction from v1: **"no face *extraction*" ≠ "no face *swap*."** The can of worms is
extracting N faces out of a freeform photo, and that is only needed for **dual/group**. A
**single** face needs no extraction — the battle-tested solo-swap guard finds the one face in
the render and pastes the one uploaded source. So:

> **Drop face *extraction* (dual/group from uploads). KEEP the single-person solo swap.**
> The upload router forks on *"can we cleanly solo-swap this?"*, not on subject-type for its
> own sake.

## Measured 2026-07-08 (why the reframe, with numbers)

- **What people upload:** 29 New Scene uploads to date, **100% single-person.** (Small,
  launch-week, tester-heavy — directional, not robust.) Zero pets/objects/groups yet. Dropping
  the working solo swap would have degraded **100%** of current uploads. → keep it.
- **Gemini refusal on real user photos:** the honest proxy is real-face **Restyle** (already
  routes user photos to Gemini in prod): 39 jobs, **~5% failed/dead**. Not 20%, not net-new.
  Still: validate **children's** photos specifically in Phase 0 (N too small to trust the tail).
- **Queue weight:** heavy 589 / light 117 (heavy lane 83% loaded on a 10-slot cap; light lane
  40-slot, 3× underused). New Scene = 29 of heavy and, under the reframe, those stay heavy
  (they swap) → **near-zero movement.** Real finding: **65 Restyle jobs are mis-marked heavy**
  despite no Fly swap — that's the weight bug worth fixing now.

## Phase 0 QA — capability contract (SIGNED-READY 2026-07-08)

Bench: real photos × buckets × models (Seedream 4 / Nano Banana / Nano Banana Pro), recomposed
to a *new* scene at 9:16 (the hard case, not in-place repaint). Verdicts are the "safe to
promise a paying customer" bar. Grid: `~/Desktop/newscene-bench/index.html`.

| Upload | Verdict | Evidence |
|---|---|---|
| Solo person (1) | ✅ **Support** | face recognizable, headshot → full body, even matched the shirt |
| Couple (2) | ✅ **Support** | both faces + both outfits, rotation auto-corrected |
| 3 people | ✅ **Support** | all three recognizable |
| **4 people** | ❌ **NOT supported** | identities reinvented into different, wrong people |
| 7 people | ❌ **NOT supported** | collapses to a single invented person |
| Person + pet | ✅ **Support** | keeps the person's face **and** the pet, together |
| Person + child (≤3 total) | ✅ **Support** | both preserved |
| Pet / animal alone | ✅ **Support** | strong (the original dog case) |
| Object | 🟡 **Best-effort** | keeps the category (a red SUV) but not the exact model |
| Place / scenery | ✅ **Support** *(needs the per-type directive)* | a generic "the subject…" prompt hallucinated a person; the place directive fixes it |

- **Cap: `new_scene_max_people = 3`** (bench-set default; still tunable). Total counts children
  (a person+child pair is 2).
- **Model routing:** photoreal → **Seedream 4** (every strong likeness result was Seedream);
  stylized buckets → **Nano Banana / Nano Banana Pro** (Pro is the more robust, and the
  "Best likeness" model).
- **Refusals are sporadic, not systematic:** exactly one cell (person+child → LEGO on Nano
  Banana) refused, while the same photo rendered fine photoreal and on Nano Banana Pro. So
  refusals are a **render-time** concern handled by the visible fallback (retry the bucket's
  other model → else refund + honest copy), **not** an attach-time block.

## Attach-time support gate (the pre-charge check)

When a photo is attached, the extended classifier runs (the decided attach-time
classification). If it's an **unsupported category**, notify the user **before they pay**, with
honest copy + a steer. From QA, the gate list is short:

| Detected at attach | Gate | Message + steer |
|---|---|---|
| **4+ people** (`num_people > new_scene_max_people`) | **Block New Scene** | "New Scene keeps up to 3 people looking like themselves. This photo has more — try **Restyle** to keep your whole group, or use a photo with 3 or fewer." |

That is the **only** hard attach-time block QA produced. Everything ≤3 people, person+pet, pet,
object, and place proceeds. Objects render best-effort (softer expectation copy, no likeness
promise on the exact item). Refusals are caught at render by the visible fallback, not blocked
up front (they're unpredictable and content-specific). The classifier's `num_people` /
`num_animals` signals (already in the extended schema) drive the gate.

## The upload router (v2)

The fork depends **entirely on classification**, which must be extended (see below) and is
itself a Phase 0 gate. Guiding rule: **when in doubt, route to reference.** A soft likeness is
always safe; a wrong-face solo swap is the exact silent identity bug this plan exists to kill.

| Uploaded | Path | Model / mechanism | Weight | Identity |
|---|---|---|---|---|
| **high-confidence single clean human**, no competing subject | **solo swap (unchanged)** | any scene model + solo-swap guard (+ existing kontext-unify on stylized mediums) | heavy | **exact** |
| pet / animal only | **reference** | medium-bucket model | light | likeness |
| object only | **reference** | medium-bucket model | light | likeness |
| group / couple (2 up to `new_scene_max_people`) | **reference** (no extraction) | medium-bucket model | light | likeness (softer) |
| group **over the cap** | **blocked pre-charge**, steer to Restyle | — | — | (MVP boundary) |
| person + pet | **reference** (no extraction) | medium-bucket model | light | likeness |
| **scenery / place** | **reference** | medium-bucket model | light | **likeness of the place** |
| ambiguous / low-confidence single face | **reference** (safe default) | medium-bucket model | light | likeness |

Scenery rides the **reference** path like the rest of Job B, keeping "grandma's lake house"
recognizable. Text-to-image is a *fallback*, not the route (sending scenery to text-to-image
would be the dog bug for places).

**MVP scope — group-size cap.** Reference models keep faces recognizable only up to a handful
of people. Bench-set to **`new_scene_max_people = 3`** (2 and 3 preserve everyone; 4 reinvents
them; 7 collapses to one). Still tunable. **Over the cap, the attach-time classifier blocks it
pre-charge** with honest copy that steers to **Restyle** (keeps the original composition, so a
big family photo stays intact as a stylization) or a photo with fewer people. Deliberate
boundary: we are not chasing faithful large-group recompositions in MVP.

This makes Phase 1 **purely additive**: the solo-person path (100% of current traffic) is
**untouched**; we only add the reference path for the cases broken today. No regression to the
common case.

### The classifier must be extended (and benched) — the real input gap

The current taxonomy (`person|group|animal|object|scenery|unclear`) **cannot feed this fork**:
there is no `person+pet`, no "single *clean* face" judgment, and a couple shot close together
comes back `person` — which would hand two faces to the solo swap and let it pick one by an
undefined heuristic (the exact bug we are killing). So:

- **Extend `classify-photo`** to return the structured signals the fork needs: `num_people`,
  `num_animals`, a notable-object / pure-scene flag, and a **"single cleanly-swappable face"
  confidence.** Route solo-swap **only** on high confidence; anything else → reference.
- **Classifier accuracy on the new categories is a Phase 0 bench item with its own signed
  acceptance bar.** Every downstream routing promise rests on it; benching the models but not
  the router would leave the plan's biggest failure surface untested.

## Model by medium bucket (reference path)

Reuse the Restyle preserve/reimagine curation (migrations 294/301), but **the tier→model map is
decided per bucket by the Phase 0 bench, not asserted**:

| Bucket | Example mediums | Standard model (candidate) | Best-likeness (candidate) |
|---|---|---|---|
| Photoreal | photography, cinematic, real-world | Seedream 4 | *bench decides — maybe Seedream, maybe NB Pro* |
| Real-face stylized | watercolor, illustration, storybook | Nano Banana | Nano Banana Pro |
| Reimagine | LEGO, pixel, vinyl, claymation | Nano Banana (reference stylization; New Scene needs a *new* scene, so NOT Restyle's Flux-dev template) | — (no exact-likeness promise) |

"Best likeness = Nano Banana Pro" is **not** assumed globally; if Seedream beats NB Pro on the
photoreal bucket, the premium tier maps to Seedream there.

## Prompt = instruction directive, NOT fluxFragment

Reference models (Seedream / Kontext / Gemini) are **instruction-following editors**, not
Flux-CLIP token models. Feeding them `medium.fluxFragment` keyword soup is the exact mistake
the kontext_directive pass fixed. **New Scene needs a `new_scene_directive`** authored in prose,
per eligible medium, per model family (e.g. "Recompose the subject from this photo into
<scene>. Keep their exact face, age, and build. Render in <medium> …"). **This is its own
authoring workstream, same magnitude as the kontext_directive pass — budget it, don't weave it
in a one-liner.** The user's typed scene (`hint`) drops into `<scene>`; the medium/vibe carry
via the directive.

## Fallback must be VISIBLE (never a silent stranger)

Under this plan the UI stamps "your likeness, reimagined" and charges for it, so a silent
fallback to the reinvent-everything description route would ship a paid violation of its own
promise. Rule: reference model refuses/fails → **retry the bucket's other model; if that also
fails, refund + honest copy.** Never silently substitute a reinvented subject. Measure refusal
per bucket in Phase 0; if a bucket's model refuses people at a high rate, the bucket→model map
is wrong.

**Retry economics (acknowledged):** prefer a **same-cost** model on retry. Only escalate to a
pricier model (e.g. NB Pro) if there's no same-cost option, and accept that subsidy explicitly
— it's refusal-path only and correlates with real faces (the premium's selling point), so at
volume, revisit whether to cap retries at same-cost or price it in.

## Communicating the split (UI copy)

The whole thing only works if the user *feels* the identity promise: **describe = exact you
(Dream Cast); upload = reimagined likeness.** Load-bearing word on the upload path is
**"reimagine," never "face swap."** With the solo swap kept, the promise softens only for
multi-person / pet / object uploads, but the copy still sets expectation up front.

**Copy strings (no em dashes):**
- Text (no photo) — **"Describe a dream"**: "Say *me* or *us* to star your Dream Cast, your
  real face, in it."
- Upload — **"Transform a photo"**, then New Scene / Restyle:
  - New Scene: "We'll reimagine your photo into a new scene."
  - Restyle: "We'll restyle your photo in this medium, keeping the pose."
- Identity chip (reuses the face-lamp slot), **route-aware**: text-with-cast **or a solo-swap
  upload** → **`✦ Your exact face`**; a reference-route upload (pet / group / object / scenery
  / ambiguous) → **`Your likeness, reimagined`**. The chip must not undersell the solo swap,
  which is 100% of current uploads.
- Nudge (fires only on the **reference-route-with-a-person** case, i.e. a group/with-pet, never
  on the clean solo-swap): "Uploads are reimagined, not face-swapped. Want your exact face? Add
  it to your Dream Cast and just say *me*."

**Design decision — classify at photo-attach, not at submit.** Run classification the moment a
photo is attached (one Haiku call, already pre-charge), so the **route is known before submit.**
This is what lets the chip, the nudge, the tier toggle, and the group/unclear confirm all
resolve *correctly per route* instead of guessing: a solo-swap upload shows `✦ Your exact face`
and **no tier toggle** (identity is already exact; a likeness tier is meaningless); a
reference-route upload shows the reimagined chip **and** the tier. It also surfaces the confirm
modal earlier, which is strictly better UX.

**If we adopt a Describe/Transform segmented control:** the photo is authoritative,
`photo present ⟺ Transform tab`. A photo entering from anywhere (header camera, share-in, DLT,
re-dream) **auto-selects Transform**; tapping Describe with a photo loaded clears it (quick
confirm). Wire in the same change as the tabs so states can't diverge.

## Per-mode UI contract

Principle: **expose the model when it's an aesthetic choice; hide it (offer a tier) when it's a
routing/fidelity decision.**

| Element | Text (DreamBot) | Text (Direct) | New Scene (photo) | Restyle (photo) |
|---|---|---|---|---|
| Prompt box | ✓ describe; "me"/"us" pulls in cast | ✓ verbatim | ✓ the scene you want | ✗ (medium+vibe only) |
| Medium picker | ✓ full | ✗ | ✓ full | ✓ restyle-eligible |
| Vibe picker | ✓ | ✗ | ✓ | ✓ |
| Model control | **raw model picker** (per-model ✦) | **raw model picker** | **tier toggle** (reference route only; **hidden on the solo-swap route**) | **tier toggle** (relabel Kontext/Nano) |
| Cost | varies by model | varies by model | flat (solo) / flat per tier (reference), known pre-upload | flat per tier |
| Identity chip | `✦ Your exact face` if cast referenced | off | `✦ Your exact face` (solo) / `Your likeness, reimagined` (reference) | `Your likeness, reimagined` |
| Composition feedback | — | — | ✓ (needs classification, which we keep) | optional |

Text mode is untouched (full picker, per-model cost, exact-face via Dream Cast). New Scene +
Restyle read as one family.

## Pricing (flat + optional "Best likeness" tier) — and it must be un-bypassable

- New Scene = a **flat price** (Standard tier), known before upload; optional **Best likeness**
  premium tier. Both are `engine_config` values shared client+server.
- **The upload path accepts only a server-validated tier ENUM and ignores `force_model`.**
  Today `generate-dream`/`restyle-photo` honor `force_model` first, so a tampered client could
  send `force_model: nano-banana-pro` and pay the Standard price. The tier→model resolution
  happens server-side from the enum; `force_model` is not trusted on this path.
- Charge server-side, idempotent on job_id. Only text mode keeps model-dependent pricing.

## Guardrails / correctness

- **Client-known route is NOT a new trust surface — the solo-swap guard already backstops it.**
  Classifying at attach-time means a tampered client could claim the solo route for a group
  photo, but there's no exploit: the tier price is a server-validated enum (no economic gain),
  and the quality attack self-defeats — the existing solo-swap guard (`singleSwapGuard.ts` /
  `ensureSoloSwapTarget`) re-probes face count + gender **server-side at render**, so a group
  smuggled onto the solo route hits `solo_multi_face` and rerenders or refunds. **Do NOT add a
  redundant server re-classification call**; the guard is the backstop. (Bonus: the submit-time
  9:16 crop can only remove content, never add people, so a route can only drift toward
  reference, the safe direction.)
- **Reference capability validated:** the upload path must resolve to a reference-capable model
  (fixes the latent silent-ignore where a text-only model drops the photo, `generateImage.ts:108-110`).
- **Queue weight:** reference-path uploads → **light**; solo-swap uploads stay heavy. Also fix
  the pre-existing bug: **Restyle is mis-marked heavy** (65 jobs) despite no Fly swap → light.
- **Output geometry:** New Scene must emit the feed's 9:16 from arbitrary input aspect. The
  three model families differ in aspect control with a reference (Gemini gives least); Phase 0
  decides crop/pad/outpaint per family. (Restyle's `match_input_image` is not sufficient here.)
- **Privacy/App Review:** Replicate (swaps) and Google/Gemini (Restyle real-face) already
  receive user photos today, so New Scene raises volume, not a new processor — but confirm the
  privacy policy + App Review posture cover it before scaling.
- **DLT:** `dreamLikeThis` can send photo + new_scene + `style_prompt`; **explicitly excluded
  from Phase 1** (handled later) so it doesn't silently ride the new path.

## Phasing (validation-first)

- **Phase 0 — GATE (before any user cutover).** (a) The three measurements above (done — see
  Measured). (b) A **likeness/recomposition/geometry bench**: real photos (solo adult, couple,
  kid-in-family, pet, object, place, low-light selfie) × medium buckets × candidate models,
  including refusal rate (esp. children) + 9:16-from-arbitrary-aspect, on AlphaBot, with a
  **signed acceptance bar per bucket**. (c) A **classifier-accuracy bench**: the extended
  classifier against a labeled set of those same photo types, with its **own signed acceptance
  bar** — the fork's safety (no wrong-face swaps, no dropped subjects) rests entirely on it. A
  bucket or category that fails does not ship until its fallback is designed.
- **Phase 1 — additive reference path.** ONLY for the currently-broken cases (pet, object,
  group, person+pet, scenery). **Extend `classify-photo`** to the structured fork signals and
  run it **at photo-attach**. Solo-person swap **untouched**. Includes the `new_scene_directive`
  authoring, medium-bucket routing, visible fallback, capability + weight fixes, tier-enum
  pricing. Fixes the dog bug (and the "grandma's lake house" bug) without risking the selfie.
- **Phase 2 — UI + copy contract.** Ships **with or before** any change to the solo path;
  tier toggle, relabel Restyle, identity chip, promise lines, nudge, price display. **Reframe
  the group/unclear pre-charge confirm modal:** with group now a valid, supported route, its
  copy shifts from a "heads-up, this may not work" *warning* to "here's what you'll get" — add
  it to the copy pass so the old warning tone isn't left in place.
- **Later / optional.** DLT-on-new-path; the reference→solo-swap→kontext-unify hybrid for solo
  (only if the bench shows a reference base beats today's solo path); dual-swap-from-upload
  (only if group/couple reference likeness proves unacceptable — high bar, revisits the can of
  worms).

## Decisions

**Resolved 2026-07-08:**
- Keep the single-person solo swap (data: 100% of current uploads). Drop dual/group **face
  extraction** only.
- Reference path for pet/object/group/person+pet; medium-bucket model; reuse Restyle's
  preserve/reimagine split; reimagine mediums → Nano Banana in New Scene.
- Flat + Best-likeness tier pricing, server-validated tier enum, `force_model` untrusted.
- No raw model picker on New Scene; tier toggle; Restyle relabeled to match.
- Fallback visible (retry other model, else refund + honest copy); never a silent stranger.
- Prompt = per-medium `new_scene_directive` (its own authoring workstream), not fluxFragment.
- Copy contract ships with/before any solo-path change.
- Router forks on **classifier confidence, not raw subject_type**; when in doubt → reference.
  Extend `classify-photo` (structured signals) and run it **at photo-attach**; classifier
  accuracy is its own Phase 0 gate. **Scenery rides the reference path** (not text-to-image).
- **Route-aware UI:** solo-swap uploads show `✦ Your exact face` and **no tier**; reference
  uploads show the reimagined chip + tier. Nudge fires only on reference-route-with-a-person.
- **Retry** prefers same-cost models; pricier escalation is refusal-path only, subsidy explicit.
- **Group-size cap (MVP):** `new_scene_max_people = 3` (bench: 2 and 3 pass, 4 and 7 fail);
  over-cap blocked pre-charge, steered to Restyle. Not chasing large-group recompositions.

**Resolved by the Phase 0 QA bench (2026-07-08) — see the capability contract:**
- **Supported categories:** solo, couple, 3-person, person+pet, person+child, pet, place
  (with per-type directive). **Object = best-effort** (softer copy). **4+ people = blocked**
  pre-charge (the attach-time gate).
- **Output geometry: resolved** — Seedream / Nano Banana / Nano Banana Pro all honor 9:16 with
  a reference image; no crop/pad/outpaint needed.
- **Model routing: resolved** — photoreal → Seedream 4; stylized → Nano Banana / NB Pro (Pro =
  Best likeness).
- **Children's refusal: sporadic, not systematic** — handled by the render-time visible
  fallback, not an attach-time block.

**Still open:**
1. Which exact mediums fall in each bucket (seed from Restyle; Kevin's taste call).
2. Confirm NB-Pro-vs-Seedream on the *photoreal* Best-likeness tier (minor; Seedream is the
   proven Standard).

## Build status (2026-07-08)

**Phase 1 — BUILT + DEPLOYED (server live, client committed):**
- `classify-photo` structured signals (deployed, verified 11/11).
- `generate-dream` + `enqueue-dream` reference render path: fork → `buildNewScenePrompt`
  (per-kind prose + real medium/vibe directives) → bucket model with `input_image`, visible
  fallback, flat tier charge (server-validated enum), 4+ cap backstop, reference uploads → light
  (deployed).
- Migration 341 (applied). Client: signals + tier sent, pre-charge cap Toast, flat price shown.
- Render-validated end-to-end with the REAL production path (not just the models): place
  hallucination fixed, couple/person+pet/pet preserved under the heavy real directives, medium
  + vibe both apply, Restyle stays composition-preserving.
- **To ship to users:** cut build 11 (`eas build -p ios --profile production`) — the server is
  live + dormant for old clients, so nothing breaks pre-build.

**Phase 2 — UI (in-place contract BUILT 2026-07-07; route-aware refinements deferred):**
- [x] **Best-likeness tier toggle** — Standard / Best-likeness segmented control on New Scene
  (`create.tsx`), wired through the store (`newSceneTier`), `useDreamCreate` (sends the chosen
  tier), and the cost calc (`newScenePriceBest` on Best). Shown for all New Scene uploads (not
  yet route-gated — see attach-time classification below).
- [x] **Hide the raw model picker on New Scene** — gate is now `!hasPhoto` (both photo modes hide
  it; New Scene routes to a fixed reference model, Restyle keeps its own edit picker).
- [x] **Identity chip** — `✦ Your likeness, reimagined` shown on New Scene. STATIC for now (not
  route-aware — can't distinguish the solo-swap route without attach-time classification).
- [x] **Promise line / reimagine framing** — New Scene descriptor now reads "We'll reimagine your
  photo into a new scene. Keeps its look; for your exact face, describe a dream and say 'me'
  instead." Never says "face swap."
- [ ] **Point-of-action nudge** — reference-route-with-a-person → "Uploads are reimagined, not
  face-swapped. For your exact face, use your Dream Cast." DEFERRED — needs the route, i.e.
  attach-time classification.
- [ ] **Attach-time classification** — move classify from submit to photo-attach so the chip /
  tier / nudge become *route-aware* (solo-swap shows "✦ Your exact face" + hides the tier; a
  4+-person photo warns before Dream). Currently classify runs at submit; the cap already
  blocks pre-charge, and the chip/tier degrade gracefully to the reference wording.
- [ ] **Group/unclear confirm-modal copy reframe** — group is now supported, so its warning tone
  → "here's what you'll get." DEFERRED (pairs with attach-time classification).
- [~] ~~(optional) **Describe / Transform segmented control** + `photo present ⟺ Transform`~~
  **DECIDED AGAINST 2026-07-07 (Kevin).** The in-place contract (promise line + chip + tier
  toggle + hidden picker) makes the split clear without a structural rebuild; the tabs added
  complexity for no gain. Do not build.

## Reference points in code

- Add the reference path alongside (not replacing) the person swap: description route
  `generate-dream/index.ts:619-722` is what the reference path supplants for non-person;
  person swap `:723-854` stays.
- Stop forcing `photoOverrideMode='flux-dev'` / clearing the input image *on the reference
  path only*: `generate-dream/index.ts:701,833,1396-1397`.
- Reference plumbing to reuse: `generateImage.ts` (`inputImage`: seedream `image_input`,
  kontext `input_image`, gemini `inlineData`).
- Restyle curation to reuse: migrations 294 / 301.
- Untouched (Job A): `selfInsertDetector.ts`, `promptCompiler.ts`, `singleSwapGuard.ts`,
  `dualSwapPipeline.ts`.
- Weight classifier to fix: `classifyDreamWeight` (restyle → light; reference uploads → light).
