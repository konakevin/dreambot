# Couple prompt parity — LESSONS LEARNED log (running, 2026-09-07 →)

Kevin: "keep a detailed lessons learned log on anything you uncover … we may as well use it as an
opportunity to study the engine along the way." Every entry: what was observed → why → what to do about it.
Plan: `COUPLE_PROMPT_PARITY_PLAN.md`. Results: `NIGHTLY_MODEL_POLICY_PLAN.md` §9 (when done).

## A. Already uncovered while building the fix (before the parity run)

1. **The medium at the END of a 1.1-pro prompt is ignored.** subject_first v1 put the medium last: 10/10
   swaps, 0/10 medium-faithful (every couple a catalog photograph). Position 2 restored it. → Rule: on
   1.1-pro the first ~40 tokens decide the medium AND the subject; everything after is "detail".
2. **The 1.1-pro face-swap override library replaces the medium fragment silently.**
   `_shared/faceSwapModelOverrides.ts` (keyed by MODEL only, 5 curated art fragments) swaps in one of its
   fragments for EVERY 1.1-pro face-swap render, regardless of the rolled or pinned medium; the user-visible
   medium label and the `scene_medium:` stamp keep the original key. Consequence: the Halloween hero row's
   `photography` pin never renders as photography on 1.1-pro (the hero sheet shows watercolor-and-ink and
   ink-illustration couples labelled photography). By design (header comment: "1.1-pro ignores stylized
   fragments and defaults to photoreal"), but a design tension with the hero look. → Decision for Kevin.
3. **A first-attempt identity of ~0.0x on ONE side is the fingerprint of a base-render miss, not a swap
   bug.** Every legacy failure (`L0.594/R0.076`, `L0.042/R0.675` …) and both hero misses had it. The face
   the swap "missed" was drawn small / turned / dark. → Diagnose couples by this stamp before touching
   the swap pipeline.
4. **The hero couple's solo fallback renders TWO people.** The hero `attire` axis names both ("she in …,
   he in …"), and the solo rebuild reuses it → `degrade_solo_multi_face(faces=2)` → solo probes. → Give the
   hero rebuild a self-only attire (follow-up).
5. **Sonnet vision judge cannot see intent.** It flagged the day-of postcard overlay as "NONSENSE BAD"
   (text over a portrait). → Any judge rubric for holiday renders must be told about the overlay.
6. **Tooling: `grep -v | tee` block-buffers** → a live batch log looks empty until the process exits;
   read progress from `ai_generation_log` instead. **Background shells get killed on this 8 GB machine
   when memory is tight** (three Claude sessions + simulators): the hero round's driver died mid-run while
   the edge renders finished server-side (the render is synchronous in the isolate and does not stop when
   the client disconnects). → Rebuild round artefacts from the DB (`finish-round.mjs`), never chain
   long waiters, batches of ≤ 10 pairs.
7. **Judge grades skew harsh and drift** (my own bias noted 2026-09-06). → The parity verdict uses only
   WITHIN-PAIR differences plus Kevin's blind preference, never absolute judge means.

## B. During the parity run
(appended as found)
8. **Hidden per-render variance inside the identity block: female hair variation is LIVE at 75 %**
   (`engine_config.female_hair_variation_pct = 75`, rolled in `characterSlotPrompt.ts` when the identity
   block is built). Two renders of the "same" couple differ in the woman's hairstyle three times out of
   four before the prompt order is even considered. → Parity pairs pin `force_female_hair_pct: 0` on BOTH
   sides; and any future A/B on couples must do the same or it measures hair, not the variable.
9. **The prompt is a pure function of (slot input, Sonnet slots, promptStyle) — but the slot INPUT was
   never logged.** Stance, composition, pool pose, medium fragment (incl. the 1.1-pro override draw), time
   axis, wardrobe anchor all live in it. Added `rolled_axes.observability.slotInput` on every cast render:
   any nightly can now be replayed byte-for-byte with `force_slot_input` + `force_dual_slots`. This is a
   forensics win beyond the parity test (replay a bad render on another model / order / medium).
10. **The 1.1-pro override draw is random per render** (`pickFaceSwapModelOverride` picks 1 of 5
    fragments). Without the slot-input replay, "same medium" pairs on 1.1-pro would have compared two
    different art styles 80 % of the time.
