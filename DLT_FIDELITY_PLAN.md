# DLT Render-Style Fidelity — Diagnosis & Plan

**Status:** Phase 0 + Phase 1 **SHIPPED** 2026-05-24 (deployed: generate-dream,
nightly-dreams, generate-first-dream, restyle-photo). Phase 2 (image-conditioning)
and Phase 3 (bot-medium format encoding) still pending. Authored after Kevin's repro
(DLT'd a ToyBot D&D tabletop-miniature render with "a cat hiding on a roof from
dogs barking below" → got a painterly fantasy cityscape, not a photographed
miniature).

### What shipped (Phase 0 + 1)

- **Phase 0** — `generate-dream` now skips `expandScene()` (and the chaos baked
  into it) on any DLT render (`isDLT = dltReplayActive || !!style_prompt`). The
  source's composition is the authority; no fresh multi-tier scene is imposed.
- **Phase 1 (application)** — `promptCompiler.ts` gained a top-priority
  **RENDER FORMAT** section (only when `styleReference` is present = DLT). It
  reproduces the source's format/medium/scale/framing and instructs Sonnet to
  *recast the subject INTO that format*. It also stops the wide-scene defaults
  from fighting it: the camera block defers to the format, the RULES depth line
  is swapped, and `postProcessPrompt` skips the forced "foreground midground
  background" append (`skipDepthTags`). The old "apply ONLY texture descriptors"
  styleReference line is gone.
- **Phase 1 (capture)** — `styleDistiller` (both Deno + Node twins) now LEADS the
  fingerprint with a FORMAT/image-type + scale + framing clause. Forward-looking;
  existing posts already carry format words, which the new application reproduces.
- Tests: `promptCompiler.test.ts` updated (RENDER FORMAT, no wide-framing on DLT,
  `skipDepthTags`); full suite 475/475 green.
- **Validation:** ✅ confirmed by Kevin 2026-05-24 — re-DLT of the ToyBot miniature
  with "cat on a roof" now renders in the source's format. Phase 0+1 working.

> Goal in one line: when a user taps "Dream Like This," the new dream should look
> like it came out of the **same render** as the source — not just "the same
> medium." Today DLT transfers a medium and a bag of texture adjectives; it loses
> the source's **format / scale / framing gestalt**, which is the thing that
> actually makes a look recognizable.

---

## 1. What actually happened (evidence)

Kevin's three recent dreams (same "cat on a roof" prompt, three DLT sources):

| # | dream_medium | vibe | result | verdict |
|---|---|---|---|---|
| [0] | `tabletop_minis` | arcane | **painterly purple fantasy cityscape** | ❌ lost the look |
| [1] | `photography` | cinematic | photoreal cat on a roof | ✓ (source was photoreal) |
| [2] | `bloom_hyperreal_cgi` | cinematic | painterly-photoreal cat | ✓ (source was that) |

[0] is the one Kevin means — it's the DLT from the ToyBot D&D miniature (the
`arcane` vibe + `tabletop_minis` medium match the source post `4eb6ec2f`).

- **Source render** (`4eb6ec2f`): a single 28mm painted pewter figure on a
  flocked scenic base, macro shot, shallow DOF, blurred tabletop background,
  cabinet rim-light. Unmistakably "a photographed tabletop miniature."
- **DLT output** (`93cf1bf5`): a wide painterly fantasy town at twilight. No
  figurine, no base, no macro/DOF, no tabletop. The miniature-ness evaporated.

The medium *was* inherited correctly (`tabletop_minis`). The look still died.

---

## 2. Why it died (pipeline trace)

The capture side is **fine**. The source's `style_summary` was rich and correct:

> "hand-painted tabletop miniature aesthetic, **28-32mm scale** painted figures,
> visible brushstrokes and drybrushed highlights, metallic armor paint, freehand
> detail, **flocked scenic bases**, dramatic **cabinet LED rim-light**, shallow
> DOF…"

That fingerprint contains scale, base, framing, lighting — everything needed. The
failure is entirely on the **application** side:

1. **`promptCompiler.ts:139` demotes the fingerprint to surface texture.** The
   instruction to Sonnet literally says: *"apply ONLY these style descriptors —
   palette, lighting, technique, mood, atmosphere, texture."* **Composition,
   scale, format, and framing are excluded by design.** So "28-32mm scale, on a
   base, macro, shallow DOF" is silently dropped as not-a-texture.

2. **`expandScene()` (index.ts:403) actively fights it.** For a text DLT it
   expands the user's subject into a multi-tier scene. The output prompt shows it:
   *"twilight rooftop scene stacked bottom to top, foreground barking dogs…
   midground rooftiles… background spires."* That is a **wide environmental
   composition** — the opposite of "one tiny figurine on a base." Flux resolves
   the dominant signal (a full scene) and renders "hand-painted" as *painterly*,
   not *miniature*.

3. **The frozen recipe's rich anchors are dead code.** `dltReplayAnchors` (the
   `medium_style_override`, `lighting`, `scene_palette`, `camera`, chaos/sensory
   blocks captured at post time) are only used to (a) pick medium/vibe/model and
   (b) synthesize a medium *if the DB lacks the row*. Since bot mediums now exist
   in the DB (migration 180), **the rich anchors are never spliced into the
   prompt.** We capture them and throw them away.

4. **Competing signals stack.** Medium directive + vibe directive + chaos + scene
   expansion all push their own composition. The single soft "REFERENCE STYLE"
   line can't dominate them.

**Root cause, one sentence:** DLT treats a look as *medium + texture words layered
onto a freshly-expanded scene*, but a look is really a **format/scale/framing
gestalt** ("what kind of image is this — a macro photo of a small painted object")
that must be the *dominant frame*, with the new subject recast **into** it.

This generalizes. The same failure hits every source whose identity is a
format/material rather than a palette: LEGO photos (BrickBot), claymation,
Funko-vinyl product shots, pixel art, oil-painted book covers, dioramas. DLT will
keep rendering "a painterly/photoreal scene with some style adjectives" instead of
"a photograph of a physical LEGO build of your subject."

---

## 3. The plan

Three phases. Phase 1 alone should fix Kevin's miniature case; Phase 2 is the
"truly solve it" image-conditioned tier; Phase 0 is cleanup that de-risks both.

### Phase 0 — Stop fighting ourselves (cleanup, ~half day)

- **Suppress `expandScene()` on DLT renders.** When a style reference / recipe is
  present, do NOT blow the subject into a multi-tier scene. The source's
  composition is the authority, not a fresh expansion. (Gate on `dltReplayActive
  || style_prompt`.)
- **Decide the recipe anchors' fate.** Either wire them (Phase 1) or delete the
  dead replay code. Right now it's misleading — it looks like it transfers look,
  but doesn't.
- **Dial chaos to 0 (or near) on DLT.** Chaos adds composition noise that
  competes with faithful reproduction.

### Phase 1 — Capture + apply the FORMAT, not just the texture (prompt-side, the high-ROI fix)

The fingerprint already has the right content; we need a **format-first** capture
and a **format-dominant** application.

**1a. Upgrade the distiller to a structured fingerprint.** Have `styleDistiller`
emit (or additionally emit) a leading **IMAGE-TYPE / FORMAT clause** as a
first-class field, e.g.:

```
FORMAT: macro photograph of a single small hand-painted tabletop miniature
        figurine on a flocked display base, extreme shallow depth of field,
        blurred tabletop background
STYLE:  28-32mm scale, drybrushed metallic paint, cabinet LED rim-light,
        arcane violet palette
```

The FORMAT clause answers "what kind of image / object is this, and at what
scale," which is exactly what's being dropped today.

**1b. Apply FORMAT as the dominant frame in `promptCompiler`.** New ordering when
a DLT format is present:

```
[FORMAT mandate — leads the prompt, non-negotiable]
Render the following subject AS [format]: <user subject>
[STYLE descriptors]
[minimal vibe color]
```

Explicitly instruct Sonnet: *"The FORMAT is the identity of this image and must
be obeyed exactly. Recast the subject INTO this format and scale — do not render
it as a free-standing scene."* This flips composition/scale/format from "excluded"
(today's line 139) to "mandatory."

**1c. Trim competing directives on DLT.** When a format is present, suppress or
shrink the generic medium directive and the vibe's compositional language so they
don't reintroduce scene-scale. (The clean-medium layer already partly does this;
this extends it.)

**1d. Wire the frozen recipe's look anchors** (lighting / palette / camera) in as
secondary support, now that they won't be fighting a scene expansion.

*Validation:* re-DLT the ToyBot miniature with "cat on a roof" and confirm it
renders as a photographed tiny figurine on a base. Run the standard 5-render DLT
QA across a spread of format-heavy sources (miniature, LEGO, claymation, vinyl,
pixel, oil-painting) and eyeball fidelity.

### Phase 2 — Condition on the source image itself (the "truly solve it" tier)

Prompt-only style transfer has a ceiling. The most faithful "dream in the style of
*this render*" is to feed Flux the **actual source image** as a visual style
anchor:

- **IP-Adapter / Flux Redux style-reference path:** new subject from text, style
  from the source image. This is the gold standard for "same render style, new
  subject" and removes the lossy text round-trip entirely.
- Gated behind a flag, validated for **subject-bleed** (Redux tends to copy
  content, not just style — needs tuning / low style-strength), NSFW, latency, and
  cost before it becomes the default.
- Likely best as the default for the **photo-DLT** path first (image→image is
  natural there), then extended to text-DLT.

This is an architecture addition (new Replicate model, new render branch), so it's
deliberately Phase 2 — we ship Phase 1 first and measure.

### Phase 3 — Make bot mediums encode their true format (feeds the fingerprint)

The BrickBot audit (separate thread) found bots that render a distinctive material
through a *generic* medium (BrickBot = LEGO via `photography`). Correcting those
mediums to encode their true compound format ("photograph of a real LEGO build")
makes the Phase-1 fingerprint fall out correct automatically. This is the bot-side
complement to Phase 1 and can land in parallel.

---

## 4. Recommendation

Do **Phase 0 + Phase 1** now — they're contained, low-risk, and target the exact
failure Kevin hit. Treat **Phase 2** (image-conditioning) as the real long-term
answer and spike it once Phase 1 is measured. Phase 3 proceeds independently (the
BrickBot fix already drafted).

The single conceptual shift that fixes the most: **a look is a FORMAT, not a
texture. Recast the subject into the format; don't paint the format onto a scene.**
