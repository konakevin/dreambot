# Race Fidelity Plan — stop the location from overriding cast race (2026-09-01)

## The bug
When the cast is placed in an ethnicity-loaded location (China, Japan, Jamaica, Egypt…),
the BASE character render draws the people as **locals** (Asian, Black, etc.), and the
face swap then inherits the wrong-race body/features. These are *vacation* photos of the
real person in that place — they must render as **themselves**, never as a local.

Confirmed on sunnysteph's 2026-09-01 nightly: a China scene ("Tianzifang shikumen
alleyway"), her white +1 rendered clearly **East Asian**. Prompt evidence:
`set in china, … RIGHT side of frame: a tan-skinned man, …, warm medium skin tone,
chestnut brown hair, dark brown eyes`.

## Root cause (two inputs, neither in the seed pools)
1. **Front-loaded country noun.** `nightly-dreams/index.ts:~2651` prepends `set in
   ${place},` as CLIP's deliberate first-noun. On a cast render that makes the COUNTRY
   the highest-weighted token → Flux builds the base people's *facial features* as local.
2. **No ethnicity anchor on the cast.** `describe-photo` captures skin *tone* + hair only,
   never race. For a tanned white guy it recorded "warm medium skin tone" → my
   `skinToneAdjective` locked "a **tan-skinned** man" — which, under a China prior,
   *reinforces* the wrong race. A skin-tone word can't beat a country noun
   (`feedback_ethnicity_noun_beats_visual_descriptors`: the noun wins).

**Scope: this is fixable entirely upstream — `describe-photo` + `characterSlotPrompt.ts`
+ the front-load line. ZERO seed-pool edits.** Seed pools carry poses/scenes/wardrobe,
not race.

---

## Fix #2 — stop feeding the prior (SHIPPED 2026-09-01, low risk)
Skip the `set in <country>` front-load for ALL character renders (cast face-swap, dual +
single) — extends the pattern already used for embodied Dream Art. The slot prompt still
carries the **specific spot** ("Tianzifang shikumen alleyway art district") for scene
fidelity — a place name is a far weaker race prior than the bare country noun.
`nightly-dreams/index.ts` front-load guard: added `resolvedComposition !== 'character'`.
No new data, mirrors a proven skip. Removes the dominant lever.

Follow-up parity: check the Create/new_scene path for the same country front-load.

---

## Fix #1 — give the cast a race anchor (TO BUILD, the robust counter)
Capture a **broad** race/appearance bucket for each cast member and lead the subject with
it ("a White man …") so it out-weights the location prior everywhere.

### Vagueness rule (Kevin, 2026-09-01) — CRITICAL
Use **broad, general** buckets only. NEVER fine-grained ("Hawaiian native", "Sicilian",
"Han Chinese"). Rationale: we only need to *counter* the local prior, not classify a
person; broad buckets are what a vision model can call reliably, they avoid stereotyping,
and a wrong fine read makes it worse. It's an **internal render anchor only** — never
shown to users, never stored as a "label" surfaced anywhere.

Closed set (model picks ONE, or returns null → fall back to skin-tone-only, never guess):
**White · Black · East Asian · South Asian · Southeast Asian · Hispanic/Latino ·
Middle Eastern · Pacific Islander.**

### Build steps
1. **`describe-photo`**: add an ethnicity read constrained to the closed set above.
   - Justification-FREE prompt (Haiku refuses "justified" probes —
     `project_haiku_refuses_justified_vision_probes`). Ask factually, closed-choice,
     allow "uncertain".
   - Store on the cast member (e.g. `ethnicity` field alongside `physical_summary`).
2. **`characterSlotPrompt.ts`**: when present, lead the subject noun with the bucket
   ("a White man" / "an East Asian woman") — front position, ahead of/attached to the
   gender noun, so it beats the location prior. Keep the skin-tone clause as secondary.
   When null → current skin-tone-only behavior (no regression).
3. **Backfill**: re-run the ethnicity read on existing cast photos to populate the field
   (one-time; new casts get it at upload). Throttled / headroom-gated.
4. **QA**: render dual + single on the worst offenders (China, Japan, Jamaica, Egypt,
   India) on a white cast AND a non-white cast; confirm each renders as their real race,
   not the local. Only then rely on it.

### Risk
The ethnicity read is the sensitive part — must be accurate (wrong read worsens it) and
refusal-safe. That's why it's staged AFTER #2 (which already removes the dominant prior)
and gated behind a null-safe fallback + QA before the backfill runs for everyone.

---

## Order
1. ✅ #2 front-load skip (shipped) — removes the dominant prior immediately.
2. QA #2 alone on foreign-location duals — it may be enough for many cases.
3. Build #1 (ethnicity capture + anchor + backfill) as the robust counter for the rest.
