# NEW_SCENE_QUALITY_PLAN.md — freeform uploaded-photo New Scene, done right

**Status:** plan (2026-07-08). No code yet. Grounded in the 4-agent render-flow audit of the
same date. Core direction DECIDED with Kevin 2026-07-08 (see Decisions).

## The goal

A user uploads *any* photo, picks a medium + vibe, and gets it **reimagined into a new scene**
in that style, with the subject (person, couple, group, pet, object, or the place itself)
kept recognizable. The medium and vibe apply. It has to gracefully handle whatever people
throw at it, including bad photos.

## The core decision: these are two distinct jobs, not one

The current New Scene conflates two things. We are splitting them cleanly:

- **Job A — "exact you in a dream."** Powered by the **Dream Cast** in the **text** path: you
  say "me" / "us", we face-swap your real face(s) in. **Exact** identity. Unchanged, this
  already works.
- **Job B — "reimagine this photo."** The **upload** path (New Scene / Restyle): hand the
  photo to a **reference-capable model** that rebuilds it into a new scene (New Scene) or a
  new style in place (Restyle). Identity is preserved by **likeness/consistency, not a face
  swap.**

**The upload path does NO face swap, ever.** Face extraction on freeform uploads (splitting
two faces out of whatever people give us, handling every bad photo) is a can of worms with no
good general algorithm. Reference models sidestep it entirely: they just reimagine whatever is
in the frame and degrade gracefully. So exact-identity lives in the Dream Cast text path;
the upload path is the "reimagine any image" tool.

Consequence to own: a single-person selfie uploaded to New Scene now gets **reference-level
likeness (recognizable, softer), not the exact face-swap it gets today.** That is intentional
— exact you = describe a dream and say "me". We communicate this in the UI (see below).

## How the upload path works (one simple rule)

Every uploaded New Scene render goes to a **reference-capable model, chosen by the medium's
bucket** — no subject classification-based routing, no swap, no hybrid. The model sees the
photo and reimagines it:

1. **Prompt weave** — compose the reference-model prompt from: the user's typed scene (their
   `hint`, passed straight through), plus `medium.fluxFragment` + `vibe.directive`. Because we
   go straight to the reference model, the typed scene is honored by construction (the old
   `subject_description ?? hint` drop bug never applies here).
2. **Model by medium bucket** — reuse the Restyle preserve/reimagine split (migrations 294/301):

| Medium bucket | Example mediums | New Scene model | Promise |
|---|---|---|---|
| **Photoreal** | photography, cinematic, real-world | **Seedream 4** | "your subject, real, in a new scene" |
| **Real-face stylized** | watercolor, illustration, storybook | **Nano Banana / Nano Banana Pro** | "your subject, in this style" |
| **Reimagine** | LEGO, pixel, vinyl, claymation | **Nano Banana** (reference stylization) | a stylized *version*; no exact-likeness promise |

Note the one difference from Restyle: the reimagine mediums (LEGO/pixel) render via a Flux-dev
*template* in Restyle because that keeps the original composition. New Scene needs a *new*
scene, so those route to **Nano Banana** (reference-capable stylization) instead. MVP-test
each bucket on real photos before scaling (seed-25 ethos), posted to AlphaBot for judgment.

## Classification is now optional

Routing no longer depends on `subject_type` (everything goes to the reference model), so
`classify-photo` is no longer needed for the render decision. Keep it only if we want it to
power the composition-feedback copy ("we'll reimagine your dog…"); otherwise we can **drop it
from this path** for speed/cost/simplicity. Lean: drop it, or keep a single lightweight
"is there a person in this photo?" check to drive the point-of-action nudge (below).

## Communicating the split (UI copy)

The whole two-jobs split only works if the user *feels* it, and the thing they actually care
about is the **identity promise**: describing gets your *exact* face; uploading gets a
*reimagined likeness*. If someone uploads a selfie expecting a swap, copy is what prevents
"this doesn't look like me." The load-bearing word on the upload path is **"reimagine,"
never "face swap"** — we never imply an exact-identity promise we are not making.

**Approach: name each path by intent with a promise line, plus an identity chip, plus a
point-of-action nudge.** Copy strings (no em dashes, per house style):

**Path names + promise line**
- Text (no photo): **"Describe a dream"**
  - "Say *me* or *us* to star your Dream Cast, your real face, in it."
- Upload (photo) → **"Transform a photo"**, then the New Scene / Restyle toggle:
  - New Scene: "We'll reimagine your photo into a new scene. Keeps its look. For your exact
    face, describe a dream instead."
  - Restyle: "We'll restyle your photo in this medium, keeping the pose."

**Identity chip** (reuses the face-lamp slot; two words do the expectation-setting silently)
- Text with a cast reference detected: **`✦ Your exact face`** (teal)
- Upload: **`Your likeness, reimagined`** (muted)

**Point-of-action nudge** (fires exactly when the wrong expectation would form: an uploaded
New Scene photo that contains a person)
- "Uploads are reimagined, not face-swapped. Want your exact face? Add it to your Dream Cast
  and just say *me*."

Recommendation: ship the promise lines + identity chip first (mostly copy, low risk); add the
nudge as a belt-and-suspenders catch for the selfie case. Hold a full structural "Describe vs
Transform" segmented control unless the copy tests as not enough.

**If we do adopt the segmented control (tabs), the state rule is: the photo is authoritative,
and a photo present ⟺ the Transform tab.** Specifically:
- A photo entering the composer from *anywhere* (header camera, share-into-app, Dream Like
  This, re-dream) **auto-selects Transform** — you can never be on "Describe" with a photo
  loaded.
- Tapping **Transform** with no photo shows the upload CTA.
- Tapping **Describe** while a photo is loaded clears the photo (quick confirm) and returns to
  text mode, since "Describe" means no photo by definition.
This must be wired in the same change as the tabs, or the two states can contradict.

## Per-mode UI contract

Anchoring principle:

> **Expose the model when it's an aesthetic choice; hide it (offer a tier) when it's a
> routing/fidelity decision.**

Text-to-image = the user is directing, the model is a creative choice → raw picker, per-model
cost. New Scene + Restyle = we're preserving something → the engine picks the model, the user
picks a quality **tier**, price is flat per tier. This intentionally diverges the modes' UIs,
and that divergence is the design, not an inconsistency.

| Element | Text (DreamBot) | Text (Direct) | New Scene (photo) | Restyle (photo) |
|---|---|---|---|---|
| Prompt box | ✓ describe dream; "me"/"us" pulls in cast | ✓ verbatim to model | ✓ the scene you want | ✗ (medium+vibe only) |
| Medium picker | ✓ full | ✗ | ✓ full | ✓ restyle-eligible only |
| Vibe picker | ✓ | ✗ | ✓ | ✓ |
| Model control | **raw model picker** (full list, per-model ✦) | **raw model picker** | **tier toggle** — Standard / Best likeness (flat ✦) | **tier toggle** — same labels (relabel today's Kontext/Nano picker) |
| Cost | varies by chosen model | varies by chosen model | flat per tier (known pre-upload) | flat per tier |
| Identity chip | `✦ Your exact face` if cast referenced | off | `Your likeness, reimagined` | `Your likeness, reimagined` |
| Composition feedback | — | — | ✓ "We'll reimagine your dog into the scene" | optional |

**What changes vs today:**
1. New Scene **drops face swap** and the **raw model picker**; gains the **tier toggle**
   (Standard / Best likeness), the identity chip, and the reimagine promise line.
2. Restyle's existing Kontext / Nano-Banana picker is **relabeled to the same tier language**,
   so both photo flows read as one family. "Best likeness" = Nano Banana Pro in both.
3. Text mode is **untouched** — full model picker, per-model cost, exact-face via Dream Cast.

User's mental model: **no photo = you're directing and it's the exact you (pick your model);
photo = we're reimagining an image (pick how good, we pick how).**

## Cost / pricing (flat price + optional "Best likeness" tier)

Price is **decoupled from the model** so the engine can route freely, both values are
`engine_config` fields shared by client + server (no routing-mirror to drift):

- **New Scene = a flat sparkle price** ("Standard" tier) regardless of which reference model
  the engine picks. Known **before the user even uploads** (no classification needed for
  pricing). Set it against the blended backend cost.
- **Optional "Best likeness" premium tier** → Nano Banana Pro, its own fixed higher price.
- Charge server-side, idempotent on job_id, as today. Only **text mode** keeps
  model-dependent pricing.

## Guardrails

- **Validate reference capability on the upload path.** Today a text-only model (GPT Image)
  assigned to a reference path is silently ignored, no error (`generateImage.ts:108-110`). The
  upload path must resolve to a reference-capable model; if not, fail loud or fall back, never
  silently drop the photo.
- **Graceful fallback:** reference model refuses/fails → fall back to the current description
  route so nothing hard-breaks (worst case = a reinvented subject, i.e. today's behavior).

## Phasing

- **Phase 1 — reference upload path for everything.** Replace the New Scene render with the
  reference-model path for *all* uploads (person, group, pet, object, scene), medium-bucket
  model selection, prompt + medium/vibe weave, fallback + capability guardrail. Drop the
  per-person face-swap on this path. MVP-test each medium bucket. (No separate Phase 0 prompt
  fix — the reference path honors the typed scene by construction.)
- **Phase 2 — UI + copy contract.** Tier toggle on New Scene, relabel Restyle's picker,
  identity chip, promise lines, the point-of-action nudge, flat/tier price display, and decide
  whether to drop classification.

## Decisions

**Resolved 2026-07-08 (with Kevin):**
- **No face swap on the upload path.** Upload = reference model only; exact-identity lives in
  the Dream Cast text path. Selfie-upload moves from swap → reference-level likeness, by design.
- **Model routing:** every upload → reference-capable model by medium bucket; reuse the Restyle
  preserve/reimagine split; reimagine mediums route to Nano Banana in New Scene.
- **Couples/groups/pets/objects:** all handled by the one reference path (no hybrid, no dual
  face extraction, that can-of-worms is out).
- **Pricing:** flat New Scene price + optional "Best likeness" (Nano Banana Pro) tier.
- **Model control (UI):** no raw model picker on New Scene; Standard / Best-likeness tier
  toggle; Restyle relabeled to match.
- **Communicating the split:** intent-named paths + promise line + identity chip + nudge;
  word it as "reimagine," never "face swap," on the upload path.

**Still open:**
1. **Which mediums fall in which bucket** (photoreal / real-face-stylized / reimagine)? Seed
   from Restyle curation; your per-medium taste call.
2. **Drop classification entirely on this path**, or keep a light "is there a person?" check to
   drive the nudge?

## Reference points in code

- New Scene render to replace with the reference path: the description route
  `generate-dream/index.ts:619-722` **and** the person face-swap branch `:723-854` (the swap
  goes away on this path).
- Stop forcing `photoOverrideMode='flux-dev'` / clearing the input image on the upload path:
  `generate-dream/index.ts:701,833,1396-1397`.
- Reference-image plumbing to reuse: `generateImage.ts` (`inputImage`: seedream `image_input`,
  kontext `input_image`, gemini `inlineData`).
- Medium→model curation to reuse: migrations 294 (real-face → Nano Banana) / 301 (LEGO/Vinyl).
- Untouched: the Dream Cast text/face-swap path (`selfInsertDetector.ts`, `promptCompiler.ts`,
  `singleSwapGuard.ts`, `dualSwapPipeline.ts`) stays exactly as-is — that is Job A.
