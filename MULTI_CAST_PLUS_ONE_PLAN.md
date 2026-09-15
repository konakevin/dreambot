# Multi-cast +1 — design plan

**Goal (Kevin, 2026-09-14):** let a user ENABLE several cast members, each with its own relationship, so any
enabled person can be rolled as the +1 in a dream. Ceiling 5. Settings → Cast Members only; onboarding still
captures exactly one +1.

---

## 1. Most of this already exists

`types/vibeProfile.ts` already models the roster. The feature is a **selection-model change, not a new subsystem**.

| already there | state |
| --- | --- |
| `partner_library: DreamPartner[]` | up to `MAX_DREAM_PARTNERS = 5` |
| `DreamPartner.relationship` | `'partner' \| 'friend'` — **per member, required** |
| `DreamPartner.id` | stable id (roster is id-keyed) |
| `active_partner_id` | **the constraint** — exactly ONE is live |
| `dream_cast.plus_one` | a MIRROR of the active partner, so the engine needs no change to read it |

So a user can already store 5 people with individual relationships. Only one can be dreamed at a time.

**The delta is:** one active → many enabled, and the engine rolls among the enabled set per dream.

## 2. Data model

Add one field; keep the mirror.

```ts
export interface DreamPartner {
  // ...existing
  /** Eligible to be rolled as the +1. Default true for the onboarding +1, false for later additions
   *  until the user ticks them. */
  enabled?: boolean;
}
```

`active_partner_id` becomes **derived, not authoritative**: it records which partner is currently mirrored into
`dream_cast.plus_one` for the NEXT render. The roll picks an enabled member, writes it to the mirror, renders.

**Why keep the mirror.** Every downstream reader — nightly, Create, the swap pipeline, `castResolver`,
`dualBriefBuilder` — reads `dream_cast`'s `plus_one` slot. Rolling into that slot means **zero engine change** to
the render path. That is the same trick the roster already uses and it is the reason this is a small feature.

**Back-compat:** `enabled` absent → treat the member matching `active_partner_id` as enabled, everyone else not.
No migration needed; `lib/dreamCastRoster.ts` already migrates legacy recipes lazily on load.

## 3. Where the roll happens

The +1 is chosen **at render time**, not at save time, so each night can differ.

- Nightly: in `nightly-dreams`, when the pre-roll decides a dual cast role, pick an enabled member and mirror it
  before `resolveIdentity` runs.
- Create: same pick when the user starts a dual render.

**Selection rule — needs a decision (see §7):** uniform random among enabled, or recency-avoiding so the same
person does not land three nights running. Recency mirrors what looks and vibes already do.

## 4. UI — Settings → Cast Members only

`components/DreamCastRoster.tsx` is the only screen that changes.

- A checkbox per roster row ("Include in my dreams").
- A relationship control per row — the field exists but the UI currently only sets it for the onboarding +1.
- Counter: "3 of 5 included". Ceiling is the existing `MAX_DREAM_PARTNERS`.
- **Zero enabled is legal** → self-only dreams, which is what `active_partner_id: null` already means.
- **Onboarding is untouched.** It still captures one +1, which becomes roster entry #1 with `enabled: true`.

⚠️ `DreamCastRoster.tsx` has a known crash shape: defaulting `partner_library ?? []` INSIDE a Zustand selector
returns a new array each render and blew the getSnapshot cache. Default outside the selector or memoize.

## 5. The relationship audit — the actual risk

Kevin's ask: *"make sure it honors friend vs partner and doesn't pose friends in romantic positions."*
I audited the three layers. **One is solid, one is fine, one is the real gap.**

### ✅ Pose pools — already correct
`pickDualAction` gates on relationship:
```ts
const isPartner = relationship === 'partner' || relationship === 'significant_other';
if (isPartner && rng() < mix.partnerShare) return pick(pools.partner);
return pick(pools.companion);
```
A non-partner can never draw `DUAL_ACTIONS_PARTNER`. Relationship already flows from
`dream_cast.plus_one.relationship`, so a rolled friend gets the companion pool automatically.

### ✅ Playful / dynamic pools — relationship-blind but clean
Both are drawn BEFORE the partner check, so a friend can get them. Audited all 69 entries: the only "kiss"
entries are *blown toward the camera*, not at each other. `DUAL_ACTIONS_DYNAMIC` has zero romantic content.
**No change needed** — but they must stay relationship-safe, so this needs a locking test.

### ❌ Scenario scene text — THE GAP
Pose is gated. **Scene text is not.**

| in 7,388 enabled dual scenario rows | count |
| --- | --- |
| say "couple" | **931 (13%)** |
| explicitly romantic (kiss / lovers / honeymoon / anniversary / bride / proposal) | **138 (1.9%)** |
| whole categories that are inherently romantic | `romantic_gardens`, `sky_romance` |

A friend rolled into one of these is framed as a romantic partner by the *scene*, whatever the pose does. The
scene text also reaches the prompt ahead of the pose, so it wins.

**Proposed fix — a relationship tag on the scenario row:**
```sql
ALTER TABLE dual_scenarios ADD COLUMN relationship_scope text
  CHECK (relationship_scope IN ('partner_only','any'));  -- NULL = any
```
- Backfill `partner_only` for the 138 explicitly romantic rows + all of `romantic_gardens` / `sky_romance`.
- The 931 "couple" rows are **wording**, not content — cheaper to reword "Couple" → "The two of them" than to
  gate 13% of the pool away from friends. Worth a pass either way since "couple" also biases the render.
- Filter at scenario load: a non-partner +1 never draws `partner_only`.

### Also to check before shipping
- `dual_closer` pools and the holiday scene pools (`holiday_scenes`, the day-of pools) — same audit, not yet run.
- The dual anchor text in `characterSlotPrompt.ts` says "couple" in several places; a friend render should use
  neutral wording.
- Create's `castResolver` / `promptCompiler` — confirm they read the same relationship.

## 5b. Making the relationship prefix actually work — the seed rewrite

Kevin's proposal: prefix the prompt with the relationship (`TWO FRIENDS` / `PARTNERS`) from the cast row, and
reword the seeds so the prefix is the only thing asserting the relationship. Audited the whole pool to size it.

### The rewording surface is small and mechanical

| relational surface form in 7,388 enabled dual rows | count |
| --- | --- |
| `couple` (bare) | 870 |
| `the couple` / `a couple` / `couples` | 70 |
| already neutral (`the pair`, `the two of them`, `both of them`) | 26 |
| `lovers` / `boyfriend` / `partner` | 3 |

**806 rows START with `Couple <word>`**, and the grammar works out: 525 of those next-words are third-person
singular verbs (`stands` 206, `rides` 37, `celebrates` 18, `sits`, `floats`, `presides`…), ~130 are prepositions
(`at`, `on`, `in`, `astride`), and only 5 are copulas. So `Couple` → `The pair` is a **drop-in that preserves verb
agreement** in essentially every row. 129 rows carry dual-swap safety wording (`clear gap`, `heads apart`) that
any rewrite must leave intact — `scan-dual-faceswap-proximity.js` must still pass.

### But rewording the noun is NOT the right fix

A real prompt from last night:

> `…two people standing side by side from mid-thigh up at **Couple occupies a Roman imperial throne dais**, both facing the camera…`

The scene text is interpolated into a **PLACE** slot (`set at <scene>`). A subject-led scene therefore produces
`at Couple occupies…`, which is broken English. Rewording to `The pair` yields `at The pair occupies…` — equally
broken. Measured on 30 days of real nightlies: **6 of 165 (4%)** hand a subject-led scene to the place slot.

This is the same root cause migration 516 already addressed for poses: **scenario rows fuse a PLACE and an
ACTION**, and the engine spends the whole string as the place.

### The right fix: make scene rows PLACE-ONLY

```
before  scene: "Couple occupies a Roman imperial throne dais"
after   scene:  "a Roman imperial throne dais"
        action: "occupying the throne"      ← the mig-516 column, already there
```

This fixes three things at once:
1. **Grammar** — `set at a Roman imperial throne dais` reads correctly.
2. **Relationship neutrality** — the scene names no subject at all, so the position-1 prefix is the *only* thing
   asserting the relationship. That is precisely what makes Kevin's prefix idea work.
3. **Pose quality** — the action lands in the slot the model actually reads for people (the mig-516 win).

It also means we do NOT need `relationship_scope` gating for the 931 "couple" rows — remove the subject and
they are relationship-neutral by construction. Gating is then only needed for the **138 rows whose CONTENT is
romantic** (honeymoon, anniversary, proposal) and the two inherently romantic categories.

### ❌ PROBE RESULT — the prefix does not work. Sweep cancelled.

Ran it 2026-09-14: one real nightly prompt, flux-1.1-pro, 3 matched seeds, 4 arms.

| arm | scene | prefix | result |
| --- | --- | --- | --- |
| a0 | `at Couple occupies a Roman imperial throne dais` | none | reads as lovers |
| a1 | original | `TWO FRIENDS` | reads as lovers |
| a2 | subject stripped, place-only | `TWO FRIENDS` | reads as lovers |
| a3 | subject stripped, place-only | `PARTNERS` | reads as lovers |

All four are near-identical at the same seed — heads touching, shoulders overlapping, intimate framing.
`TWO FRIENDS` and `PARTNERS` produce the SAME posing. Kevin: *"they all look like lovers to me."*

**Why.** Same failure mode as the clean-shaven probe earlier that day: `friends` is an abstract relational claim
with no visual signature, fighting a strong prior — a man and a woman in a tight two-shot reads as a couple in
the training data, and an adjective at position 1 does not move it. Compare the eye-colour probe, which DID work,
because iris colour is a concrete visual attribute with no competing prior. **Position-1 tokens set visual
attributes; they do not set relationships.**

Telling detail: the probe prompt already contained *"a clear gap between their heads"* and the renders still came
back cheek-to-cheek. If an explicit geometric instruction is being overridden, no relational noun will survive
either. The intimacy is coming from the composition block, not from the word "couple".

**Therefore: the ~800-row subject-stripping sweep is CANCELLED as a relationship fix.** Rewriting 800 rows on a
disproven mechanism is work that feels thorough and changes nothing.

### What to do instead

1. **Pose gating is the real lever and it already works.** `pickDualAction` gates the romantic pool on
   relationship; a friend draws `DUAL_ACTIONS_COMPANION`, which poses people apart. This is the protection that
   actually functions — keep it, and lock it with a test (§6).
2. **Gate the 138 explicitly romantic SCENES.** No prompt trick fixes "honeymoon suite" / "anniversary dinner" /
   "proposal". `relationship_scope = 'partner_only'` on those rows plus `romantic_gardens` / `sky_romance`.
   Small, targeted, and it is the only part of the scene layer that genuinely needs gating.
3. **If friend renders still read too intimate**, the lever is the composition/framing block, not vocabulary —
   and that is framing work, which Kevin has repeatedly (and rightly) flagged as high-risk. Do not touch it
   without its own probe.

### Separately worth fixing: the place-slot grammar break

Not a relationship issue, but real. `at Couple occupies a Roman imperial throne dais` is broken English and hits
**4% of real nightlies**. The mig-516 place/action split is the fix, and it stands on its own merits (grammar +
pose quality). Scope it as its own item, NOT as relationship work.

### Original proof-of-concept design (kept for the record)

Kevin: *"try it on a small subset first to prove out the concept… I'd rather fix it the right way."*

Take ~12 representative `Couple`-led rows, convert to place + action, then a fixed-seed probe with 3 arms:

| arm | scene | prefix | question |
| --- | --- | --- | --- |
| 1 | original (`Couple stands…`) | `TWO FRIENDS` | does the scene's "Couple" beat the prefix? |
| 2 | rewritten (place-only) | `TWO FRIENDS` | does the prefix now control the reading? |
| 3 | rewritten (place-only) | `PARTNERS` | does it work in the other direction (control)? |

Same seeds across arms, one variable. If arm 2 reads platonic and arm 3 reads romantic, the concept is proven
and the full sweep is justified. If arm 1 already reads platonic, the prefix alone is enough and the sweep is
unnecessary — worth knowing before rewriting 800 rows.

**Sweep mechanics when proven:** back up every row first; scope by category and count before/after; never an
unscoped update; re-run the proximity scan; spot-check that no row lost its safety wording.

## 6. Tests to add
- `enabled` roll: only enabled members are eligible; zero enabled → self-only; ceiling 5 enforced.
- Back-compat: legacy recipe with `active_partner_id` and no `enabled` → exactly that member eligible.
- **Relationship safety (the important one):** a `friend` +1 never draws `DUAL_ACTIONS_PARTNER`, never draws a
  `partner_only` scenario, and the playful/dynamic pools stay free of romantic content (lock the audit so a
  future seed batch cannot regress it).
- Mirror integrity: whoever is rolled is what `dream_cast.plus_one` holds at render time.

## 7. Open questions for Kevin
1. **Selection rule** — uniform random among enabled, or recency-avoiding so the same person does not repeat
   several nights running? (Recency matches how looks/vibes already behave.)
2. **Subject-stripping sweep** (§5b) — confirmed as the approach, pending the proof-of-concept probe. Open
   sub-question: convert ALL 806 subject-led rows, or only the ones that actually reach the place slot?
3. **Multiple photos of the same person** (Kevin: "several different pics of their partner to have different
   looks") — these are separate roster entries today, so a partner with 3 photos occupies 3 of the 5 slots and
   is 3× as likely to be rolled. Is that intended, or should entries group under one person?
4. **Pets** — `dream_cast` has a `pet` role outside `partner_library`. Unchanged by this, or should pets get the
   same enable treatment?
