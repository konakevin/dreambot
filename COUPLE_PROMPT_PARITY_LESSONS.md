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
11. **What subject_first actually removes (smoke pair, same slots, same input):** the legacy couple prompt
    carries 27 comma-clauses that subject_first drops (the "set at" line, the ENVIRONMENTAL TWO-SHOT
    anchor, the framing block with its camera / lens / distance language, the "scene fills the frame"
    family) and subject_first adds 2 (the compact people-with-place line, the head-gap line). Everything
    else — gender lock, medium fragment, both identity blocks, action, scene, mood, props, no-text — is
    byte-identical. So parity is a test of whether those 27 clauses were doing quality work or only
    landscape-steering work. The smoke pair itself: legacy L0.73/R0.70 first try, subject_first
    L0.79/R0.71 first try, both passed the quality gate.

## B. During the parity run

12. **PARITY FAILED for subject_first v2 on the first 10 pairs — the scene collapsed.** Same slots, same
    input, blind paired judge: framing +1.2 (the fix works: legacy 4/10 first-try + 4 degrades vs 9/10 and
    0), but scene richness 3.9 → 2.0, brief fidelity 3.5 → 1.7, mood 3.7 → 2.7; judge preference legacy
    9 of 10 ("nearly blank background", "loses setting entirely for bokeh window"). My contact-sheet
    inspection of rounds 1-6 missed this because those rounds were holiday subs whose place name rides in
    the people line, and because I was looking for faces, not for set dressing. → Lesson: **a fix judged
    on the axis it fixes will look perfect; always score the axes it could break, paired, blind.**
13. **Why: flux-1.1-pro renders what sits in the first ~60 words and treats the rest as detail.** Word
    position of the scene text: legacy ≈ word 50-70 of ~500 (scene dominates → landscape, tiny people);
    subject_first v2 ≈ word 200-235 of ~280 (people dominate → portrait, blank background). The two
    identity blocks (~45 words each) are what push the scene to the back. The order is a slider between
    "landscape with people" and "portrait with a backdrop"; neither end is the dream. → v3: people line
    first, the FULL scene_description second (before the identity blocks), identities third.
14. **Wardrobe fidelity is poor in BOTH orders (legacy 1.9 / 5, subject_first 2.2 / 5).** The wardrobes
    live inside the identity blocks ("wearing …") after ~40 words of physical description each, and Sonnet
    writes elaborate outfits ("layered blush and sage ruffled silk skirts, pearl-dripping floral crown,
    holographic Mary Janes") that the model renders as generic clothes. Not a prompt-order issue — an
    improvement opportunity for the follow-up plan (shorter, material-led wardrobe lines; or wardrobe as
    its own early clause).
15. **The legacy solo-degrade path ships a RICH scene.** 4 of the 10 legacy renders degraded to the solo
    rebuild and the judge scored those scenes 4-5: the solo prompt (scene-first, one person) is the one
    combination 1.1-pro renders as "person integrated in a dressed set". Worth studying as the target
    look for couples.
16. **Visual confirmation of 12 (sheet `parity/sheet-A1.jpg`).** Legacy's scene points come from two
    shapes: the SOLO degrade (P2 carnival, P4 Luxor beam, P8 corridor, P10 rooftop — one person, rich set)
    and the tight two-heads-with-scenery crop (P3 wisteria, P5 columns). subject_first v2 is the third
    shape: two clean frontal people on a thin backdrop (P6 blank wash, P8 blurred gold, P2 bokeh window),
    and in P1 it rendered a city street where the brief said sunny park — the scene text was not just
    weak, it was overridden by the place-in-the-people-line. None of the three shapes is the target
    ("professional cinematic scene, person INTEGRATED"). v3 is deployed after batch 2 completes so batch
    2 stays a clean v2 sample (20 v2 pairs for the record).
17. **v2 verdict over 19 paired renders (batches 1-2, blind judge, same slots):** framing +1.2 / +1.4,
    first-try 18/20 vs 7/19, degrades 0 vs 8 — and scene richness −1.9 / −1.3, brief fidelity −1.8 / −1.0,
    mood −1.0 / −0.7; preference legacy 9:1 then 4:5. The picture is stable: v2 fixes the couple and
    loses the set. Wardrobe fidelity actually IMPROVES under subject_first (+0.3, +1.0) — the identity
    blocks sit earlier — which supports the token-position model (13) and the wardrobe follow-up (14).
    v3 (scene before identities) deployed 2026-09-07 20:55 UTC; batches 3-4 test it on fresh jobs.
18. **v3 (people line → full scene → identities) reaches parity on its first 10 pairs.** Blind paired judge:
    scene −0.20, brief fidelity +0.20, wardrobe +0.20, medium −0.20, mood −0.20 (all inside the ±0.25
    band), framing +1.00; preference subject_first 7:3; first-try 8/10 vs 4/10; degrades 0 vs 3; quality
    gate pass 10 vs 8. Sheet `parity/sheet-A3.jpg`: the v3 couples are IN the set (train platform,
    pirate cove with the boat, torch-lit corn maze, cottage hearth, cabin kitchen) at the same scene depth
    as legacy, with both faces clean. Batch 4 doubles the sample before the verdict.
19. **Legacy ships FACELESS dreams — `pure_scene_fallback` — 2 of 10 in batch 3** (P25 cottage arch, P27
    canyon: no people at all, quality gate skipped, `gate=null`). Chain: 3 × `dual_reject:no_split:
    giant_face` (the legacy tight two-heads crop is TOO close for the detector) → solo rebuild on
    flux-2-flex renders TWO people (`degrade_solo_multi_face faces=2`) → `degrade_solo_gender_mismatch`
    → `degrade_solo_swap_unsafe` → `dual_degrade_single_refused_gender` → cascade → pure scene. The
    memory note "dual swap failure degrades to a rebuilt solo, never faceless" is FALSE in this branch.
    → Follow-up plan item #1: the solo rebuild must produce one person (strip the partner from the
    rebuilt slots / wardrobe / action; and rebuild on 1.1-pro per Kevin), and a faceless cast dream
    must never pass silently — stamp it loud + count it in the monitor.
20. **Legacy also ships a couple with the partner's identity at 0.27 (< 0.35 floor):** P24
    `identity_below_threshold` twice → `recover_budget_exhausted` → `identity_shipped_best:0.27` →
    quality gate PASS. So the gate does not read the identity stamps. → Follow-up plan item #2: the
    quality gate must fail (or re-route) a shipped identity below the floor.
21. **Both legacy failure shapes are the SAME defect seen from two sides:** tiny/turned faces
    (`no_dual_split(faces=0)`, one-side identity ≈ 0.0x) and giant faces (`giant_face`) — the legacy
    order has no stable face size. v3's compact people line fixes the size in both directions
    (0 no-split events in 20 subject_first renders so far).
22. **Root of 19 — CORRECTED.** First guess (the dual scene text names the couple) was wrong: 0 of 30
    Sonnet scene_descriptions mention two people, and 0 wardrobes do. `assembleSoloFallbackFromDual`
    keeps scene / self wardrobe / mood / props and drops the action, so the second face comes from
    somewhere else. Candidates: the 1.1-pro override medium fragment itself says "lifelike adult FACES,
    realistic human facial proportions" (plural); the vibe directive ("their"); flux-2-flex's own prior.
    It cannot be settled because **the rebuilt solo prompt is never logged** (only the dual
    `enhanced_prompt` is). → Follow-up plan item #1a: log `observability.soloRebuildPrompt`, then
    root-cause on real degrades; meanwhile move the rebuild to 1.1-pro with the subject_first-style
    single anchor (Kevin's standing call) and de-pluralise the override fragments ("lifelike adult face").
23. **Narrowing 22:** the single assembly reads none of the dual-only input fields (no stance, no
    composition, no couple action) and its anchor says "ONE person alone in the scene, the only person in
    the image"; the rebuild also swaps in the medium's REAL fragment (`soloRebuildInput`), so the plural
    "faces" in the 1.1-pro override is not in play either. The two faces are flux-2-flex's own reading of
    a scene written for two ("a hay wagon behind", a table for two…) plus the vibe text. Only the logged
    rebuild prompt + a 1.1-pro rebuild trial can settle it (follow-up #1a).
24. **v3 verdict, 20 pairs: parity on all five quality axes (Δ +0.10 / +0.20 / +0.20 / −0.10 / 0.00),
    framing +0.85, judge 13:7, first-try 16 vs 9, degrades 1 vs 6, faceless 0 vs 2.** The one v3 degrade
    (P36 campus_quad_ivy, L0.044 on attempt 1) is the legacy signature — it still happens, ~1 in 20
    instead of ~1 in 3. Sheet A4 read: every v3 couple is in its set (teacup ride, acropolis cliff,
    balloon basket, desert highway) at the same depth legacy reaches only when it degrades to a solo.
25. **Legacy's "quality" was partly the quality of its FAILURES.** Across 39 legacy renders: 14 degraded
    to a solo, 2 shipped faceless, 1 shipped under the identity floor. The judge scored the solo
    fallbacks 4-5 on scene, which is why v2 looked so far behind on scene richness: it was being
    compared against one-person dreams. Any future couple A/B must report the shipped SHAPE (couple /
    solo / faceless) alongside the axis scores — a mean over mixed shapes hides the story.
26. **The backup models are not order-sensitive.** Phase B replays (same slots, both orders):
    gemini-2-image and flux-2-pro rendered near-identical dreams under legacy and v3 — same platform,
    hearth, pirate cove, cabin kitchen, both couples full-figure with clean faces — judge deltas within
    ±0.5 on gemini (1:1) and all positive on flux-2-pro (2:0). The "first ~60 words" rule (13) is a
    flux-1.1-pro trait (its CLIP-style attention), not a general one. Practical consequence: the order
    knob is safe to flip globally; the backups neither need nor mind it. Sheet `parity/sheet-B1.jpg`.
27. **seedream-4 and grok-imagine-image confirm 26.** Sheet `parity/sheet-B2.jpg`: the corn maze, the
    cathedral-with-map, the pig farm and the hero barn pairs are near-duplicates under both orders (same
    composition, same set dressing, same wardrobe). The judge's seedream lean to legacy (5 vs 4 on
    scene / brief / mood, N=2) is noise on near-identical images — a reminder that a 1-point judge delta
    on two pairs means nothing; only the 20-pair 1.1-pro sample carries weight.
28. **Phase B closes:** flux-dev 1:1, all five backups first-try 9/10 vs 7/10, zero degrades either way.
    Net over the run: 1.1-pro is the only model whose couples live or die by prompt order; the order
    knob is a 1.1-pro fix that the rest of the fleet tolerates unchanged. The run cost ≈ $8 and 3 hours,
    and found four defects that predate it (faceless ships, gate ignoring the identity floor, wardrobe
    fidelity, hero medium override) — the parity method paid for itself before the flip.
29. **Model membership per look is real, and 1.1-pro is not universal (Halloween hero round 1 + re-run).**
    Same authored midnight-ballroom couple scene, six painterly fragments, five models: flex / gemini /
    seedream 18/18 first-try with the celebration composed (mid-thigh, toast, chandeliers, moon, pumpkins
    low); grok 6/6 but small figures; flux-1.1-pro 4 tight two-heads + 1 landscape-with-tiny-couple + 1
    degrade, and on a re-run with a short inline place 2 FACELESS + 1 degrade + 1 low identity. The v3
    order fixed 1.1-pro on ordinary daylight / mid-lit scenes (parity, 20 pairs) but a dark ornate
    candlelit interior still pulls it to its two failure shapes. → The looks catalog must carry per-look
    model membership from grids like this one, not from assumptions; and "1.1-pro default" is a chain
    preference, not a guarantee for every look.
30. **Faceless ships are not rare on a hard scene: 2 of 6.** `pure_scene_fallback` fired twice in one
    six-render column. Follow-up plan item #2 (never faceless: retry the rebuild on the surface's model
    before falling to a pure scene, stamp loud, count it) moves from "S, when convenient" to "before Oct 31".

## C. Day-of overhaul (2026-09-07 evening)
31. **A lint rule authored BEFORE the seeds is worth more than a QA round after.** The three day-of rules
    (must name a light source; no gargoyle / statue / mask-over-eyes / face paint; pumpkins never at
    head height) rejected 26 candidates during generation; the 30-word scene cap rejected 39 more. The
    surviving 384 rows needed no re-author. The pattern: encode the render lesson (dark ornate scene →
    crop, face-bearing decor → wrong-face swap) as a seed-time gate the moment it is learned.
32. **Retiring a "second prompting method" is mostly deletion.** The hero's 6 recipe rows, axis filler,
    loader, two QA scripts and two flags came out in one commit, and the day-of became ~60 lines that
    call the same `applySceneRow` the window already uses. The proof that it is one pipeline is a smoke
    render carrying the same stamps a window holiday row carries plus `holiday_day_of:` and `postcard:`.
33. **The date a nightly is FOR is not the date it runs.** The 08:00 UTC run is 22:00 the evening before
    in Hawaii; without the evening cutoff a Hawaii user would get the Halloween dream at 22:00 on
    Halloween night. Any per-user calendar logic in nightly (holidays, birthdays, anniversaries) must go
    through `dayOfCalendarDate`, never `localDateInTz` alone.
34. **Where the ACTION BEAT lives on the body decides the crop.** Day-of round 1: 7 of 12 couples came
    out bust-framed although the people line asks for mid-thigh, the closer roll was 0 % and the scenes
    were rich. Every beat in the register happened at chest height (a glass raised, a pumpkin held, a mask
    held) — on a night scene flux-1.1-pro obliges by cropping to the hands. A register for a "celebration"
    surface must use the legs, the ground and the furniture (walking, stepping up, crouching to a step,
    sitting on a hay bale) so the frame has a reason to include them. Same law as the playbook's
    "action verb leads composition" — restated as: the beat's ANATOMY sets the crop.
35. **Seed hints and lint rules must agree, or the top-up starves.** The hayride sub's setting hint said
    "scarecrows on their posts"; the widened face-decor rule (scarecrows are face-bearing) then rejected
    16 of 17 regenerated candidates for that sub. Whenever a lint rule is added, grep the taxonomy hints
    for the banned nouns first — the generator cannot out-write its own brief.
36. **Three rounds, one variable each, with a number to move.** Bust crops 7 → 4 → 2 of 12 across
    rounds 1-3 with exactly one change (the action register's anatomy). The rounds that convince are
    the ones where the metric, the variable and the sheet all point the same way.
