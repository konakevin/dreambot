# Handoff: moving Create onto the nightly looks & vibes

**Written 2026-09-14, end of session. Nothing in this project has been implemented.** This doc is the entry point.
The design lives in `CREATE_LOOKS_MIGRATION_PLAN.md`; this tells you the state of the world, what is decided, what
is blocked, and what to do first.

---

## 0. READ THIS FIRST — what is live, and what not to break

**The nightly engine changed tonight and is live for every user.** `engine_config.nightly_looks_mode = 'on'` as of
2026-09-14 ~02:30 UTC. It had not yet rendered a real nightly run when this was written; the cron fires at 08:00
UTC. **Before starting any Create work, read `NIGHTLY_LIVE_WATCH.md` and run `node
scripts/nightly-morning-check.js`.** If that run reads badly, fixing it comes first and this project waits.

What is live is the **"1.2.0 with looks"** engine: the 1.2.0 renderer does all the work (location-fit action at
75%, the 1.2.0 scene mix, its pose pools, its prompt order, its identity floors) and the new catalogue decides only
the LOOK (pinned as the medium) and the VIBE. Rollback is that one row back to `'off'`, effective next render, no
deploy. Snapshots of three engine states are in `nightly-states/`.

**Do not** change `nightly_family` values, the approvals table, `engine_config.nightly_legacy_look_pct`, or the
model policy without understanding that nightly rolls on them tonight. Several steps in this plan touch exactly
those, which is why they are staged.

---

## 1. The goal, in Kevin's words

> "translate our nightly looks and vibes into a format where we can replace create's mediums and vibes with those
> we support in the nightly engine… split the new mediums by family… when a user picks that medium, the dream
> would roll from that family's sub looks. we need the pools shared with nightly so that updating (removing a look)
> removes it from both nightly and create."

> "on posts, if users long press on their own post, it will show the medium and vibe… we show the family name for
> both and store just that, future re-rolls of that dream pick the family and never the embedded look."

> "let's log the look key so that for future, we can accurately reproduce their dream exactly… make sure to account
> for that in the design."

> "aggregate vibes by family the same as looks… a roll for the family then rolls random for a vibe within that
> family." Later refined: fold the new vibes into the EXISTING labels where they fit, and only add a new label when
> a group genuinely falls out.

---

## 2. Decisions already made (do not relitigate)

| decision                         | value                                                                                                                           |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Family is a **token**, not a row | picker sends `medium_key: "family:<name>"`, resolved inside `resolveMediumFromDb` like `surprise_me` already is                 |
| What the post stores             | the **exact look key** (unchanged — nightly already writes it); the family is a display projection computed from it             |
| Exact reproduction               | already possible: the exact key is in `uploads.dream_medium`; the reproduce path pins it                                        |
| Look family names                | **Comic · Drawn · Painted · Film · Poster · Watercolor** (singular, all describing the OUTPUT not the material)                 |
| Vibe architecture                | user-facing vibe is a **group**; pick resolves group → family → intensity version                                               |
| Vibe labels                      | the existing 22, plus **Golden Hour** and **Noir** = 24, over 56 families and 231 versions (full table in the plan §10)         |
| Duplicate Create mediums         | **alias** them to the family: the medium keeps its key and history but resolves to the family token. Never retire them — see §3 |
| Dream Art                        | untouched. It is a different engine, not a different aesthetic — see §3                                                         |
| comics / pop_art                 | stay retired                                                                                                                    |

**Open, and each one blocks something:**

1. **The look sort.** The 54 looks must be assigned to the six families **by eye**, not from fragment text. Sheet:
   `node scripts/build-look-sort-sheet.js` → `~/Desktop/look-sort.html`. Kevin has seen it but not sorted.
2. **The 35% legacy bias.** `engine_config.nightly_legacy_look_pct = 35` makes nightly roll the legacy family a
   third of the time. Distributing the legacy looks into other families ENDS that bias silently. Kevin must say yes
   knowing it changes tonight's dreams.
3. **Restyle vibes.** None of the 231 nightly vibe rows has a `client_meta.restyle_fragment`, and the directive is
   scene text that reads as a no-op to Kontext. Recommended: freeze today's 22 vibes for restyle only. Not yet agreed.
4. **The vibe group column.** The group tier has no schema home. `dream_vibes.version_of` means "intensity version
   of"; overloading it would conflate two axes. Needs its own column.

---

## 3. Verified facts — do not re-derive, and do not repeat my errors

Every line here was checked against the live database or the running code during the design session. Several
contradict what a reasonable person would assume.

- **There is NO foreign key on `uploads.dream_medium`.** I claimed there was. 3,064 of 39,709 rows already hold
  values that are not `dream_mediums` keys. The only FKs into that table are `dlt_clean_mediums` and
  `nightly_look_approvals`.
- **`uploads.dream_vibe` already holds VERSION keys** (`cozy__bold` shape) — 704 of the last 3,168 uploads, written
  by the nightly engine. It is not a clean family column. Keep the version key there, add it to `recipe.vibe_key`,
  and derive the family in code with `versionTag` (already exported from `_shared/nightlyVibes.ts`).
- **Create ignores vibe render fragments completely.** `vibe.fluxFragment` / `fragmentPosition` are loaded by
  `fetchVibes()` and read by nightly only. Create uses `directive` (or `faceSwapDirective`) as a prose MOOD block.
  **This is the single biggest quality upgrade available, and without it the whole vibe fold changes nothing.**
- **Create's vibe versions are inert.** All 69 versions of the 22 Create-visible vibes have a directive and a
  restyle fragment byte-identical to their base row. Only `flux_fragment` differs.
- **Nightly is LOOK-FIRST as of 2026-09-13.** `LOOKS_ALL_MODELS = true` and `modelFromLook: true` mean approvals
  gate the SURFACE and the model pool is the policy's three models minus `rejectedModelsFor`. Any design written
  against the older model-first behaviour produces an empty model set.
- **`preferred_model` is dead** — zero runtime readers, though migrations still write it. It is what makes the
  looks _look_ pinned to flux. They are not.
- **Retiring the duplicate Create mediums would delete real-face restyle.** Restyle eligibility is
  `client_meta.restyle_enabled` on those public rows; making them non-public removes every Kontext restyle style.
  It would also remove Glamour and Noir from the app, because their look twins are explicitly `approved=false`
  (a judgment, not an absence) and cannot roll at all.
- **Dream Art is not a face swap.** It renders a character from a written description of the cast photo, which is
  why it can be arbitrarily stylised. Real Face composites the actual face and therefore needs big, clearly
  separated, frontal faces. This is why all the playful styles live on the non-swap side — see plan §8.
- **`ai_generation_log` prunes at 30 days** (mig 274). It cannot be the durable home of anything.
- **`uploads` grants**: SELECT/INSERT/DELETE are table-level; only UPDATE is column-level (mig 278). A new column
  is readable and insertable by the client without a grant; it needs one only for client-side PATCH.
- **The `surprise_me_face` / `surprise_me_art` "landmine" does not exist** — `hooks/useDreamCreate.ts` resolves all
  three tokens above the path fork, and the cold-cache fallback is a real key.

---

## 4. Touchpoint inventory

Everything below was mapped file by file. Treat it as the checklist for "did we update all touchpoints".

### 4a. Medium — client

- `hooks/useDreamStyles.ts` — `useDreamMediums()`, RPC `get_dream_mediums`, TanStack key `['dreamMediums']`,
  staleTime 5 min. The `DreamMedium` interface **drops `sort_order`** at this boundary, which is why the picker
  cannot order by it.
- `app/_layout.tsx` — cold-start prefetch of the same RPC (duplicate inline queryFn).
- `lib/queryClient.ts` — `['dreamMediums']` is PERSISTED to AsyncStorage, busted only by app version.
- `app/(tabs)/create.tsx` — the centre of gravity. Sticky pick (`create.selectedMedium.v1`), `persistMedium`,
  preset hand-off, restyle curation (`client_meta.restyle_enabled`), `mediumFaceSwaps`, vibe gating by segment,
  the DreamSmart auto-select effect, the Style row UI and badge, `<StylePickerSheet>`, `<ModelPicker>`.
- `components/StylePickerSheet.tsx` — the sheet. Real Face / Dream Art segmented toggle for mediums (on
  `face_swaps`), **A-Z by label**, section-scoped Surprise Me tokens, per-tab sticky state.
- `components/MediumsIntroSheet.tsx`, `components/DreamSmartSwapSheet.tsx`, `components/ModelPicker.tsx`,
  `components/RestyleModelPicker.tsx` (NOT a DreamSmart surface), `components/MediumVibeSelector.tsx` (admin only).
- `hooks/useDreamCreate.ts` — **client-side Surprise Me pre-roll** off the cached catalogue; sends `medium_key`.
- `hooks/useDreamAgain.ts`, `app/dreamLikeThis.tsx`, `lib/retryDream.ts` — replay historical keys verbatim.
- `app/dream/reveal.tsx`, `app/dream/loading.tsx`, `components/PostActionSheet.tsx`, `components/DreamCard.tsx`,
  `components/PostTile.tsx`, `app/(tabs)/top.tsx` (Explore filter), `lib/mapPost.ts`, `lib/analytics.ts`.

### 4b. Medium — engine

- `_shared/dreamStyles.ts` — `fetchMediums()` (60s isolate cache), `toMedium()`, **`resolveMediumFromDb()`** — this
  is where the `family:` branch goes. Unknown key → logs and returns `canvas`.
- `enqueue-dream/index.ts` — reads `client_meta` for DreamSmart and coerces `force_model` **before**
  `charge_sparkles`. The charge==render invariant lives here.
- `generate-dream/index.ts` — DLT replay overrides, `fetchCleanMedium`, per-model fragment override, four
  `compilePrompt` call sites, `isFaceSwapEligible = characterRenderMode === 'natural'`, the DreamSmart backstop,
  persistence of `uploads.dream_medium` / `dream_jobs.result_medium` / `recipe`.
- `restyle-photo/index.ts` — requires medium AND vibe; `getPhotoRestyleConfig`; restyle model pools.
- `_shared/`: `smartDream.ts`, `modelPicker.ts`, `promptCompiler.ts`, `singleBriefBuilder.ts`,
  `dualBriefBuilder.ts`, `embodiedSingleBriefBuilder.ts`, `characterSlotPrompt.ts`, `photoPrompts.ts`,
  `firstDreamMediums.ts`, `cleanMedium.ts`, `createFaceSwapOverrides.ts`.

### 4c. Vibe

- Client: `get_dream_vibes` RPC (filters `is_active AND nightly_only = false` → 22 rows), `useDreamVibes()`,
  `['dreamVibes']` persisted, `StylePickerSheet` flat A-Z list, `lib/vibeGating.ts` (segment gate, one vibe uses
  it), sticky `create.selectedVibe.v1`, `app/(tabs)/top.tsx` filter.
- Engine: `fetchVibes()` (no `nightly_only` filter — force/replay can reach any active row),
  `resolveVibeFromDb()` (`surprise_me` → the 5 `is_dream_eligible` rows; unknown → **cinematic**, not random),
  the MOOD block in four brief builders, `restyle-photo` using `client_meta.restyle_fragment`,
  `_shared/styleDistiller.ts`.
- **Vibes are NOT pre-rolled on the client** — the literal token goes to the server. Mediums are. That asymmetry
  matters for the price quote and the reveal badge.

### 4d. Data

- `dream_mediums` — 184 rows. 20 in the picker (`is_active AND is_public`), 23 `is_dream_eligible`, 57
  `nightly_look` (54 rollable). `client_meta` carries `smart_dream_models`, `smart_dream_default`,
  `restyle_enabled`, `restyle_model(s)`, `flux_fragment_by_model`, `legacy_medium`, `reserved_for`, `retired`.
- `nightly_look_approvals` — 237 rows (181 approved / 56 rejected), `(look_key, model, surface)`, surfaces are
  `couple` / `solo` only. `approved=false` binds; a missing row is merely untested.
- `dream_vibes` — 231 active, 56 families, `version_of` self-FK, `nightly_only` gates the Create picker.
- `CHECK dream_mediums_nightly_look_isolated` (mig 495) forbids a look being public/dream-eligible/scene-eligible.
  The family token design does **not** require changing it, which is one of its main advantages.

---

## 5. Execution order

**Phase 0 — gate.** Read `NIGHTLY_LIVE_WATCH.md`, run the morning check, confirm the live engine is healthy.

**Phase 1 — families as data.** Create `dream_look_families` (key, label, description, sort_order, enabled). No
engine change, no user-visible change. Reversible by dropping the table.

**Phase 2 — the token.** Teach `resolveMediumFromDb` a `family:<key>` branch: resolve to the family's member
looks, filter by `nightly_enabled` + approvals for the surface, roll one. Add an exclusion argument so a re-roll
can avoid the original look. Old clients never send the token. Test-lock the branch.

**Phase 3 — display projection.** One helper mapping a stored look key to its family label, used by the reveal
badge, the Recipe line, Dream Again and the Explore filter. Historical keys keep resolving to their own labels.

**Phase 4 — the picker.** Six families on Real Face; the eight embodied mediums unchanged on Dream Art. Gate with
an allowlist and deterministic bucketing, copying mig 515. **Blocked on the look sort and the matrix.**

**Phase 5 — vibe fragments on Create.** The prize. Set `vibeFragment` / `vibeFragmentPosition` on the Create dual
slot input with the subject-first order nightly proved, behind a flag, judged on `identity_sim` and
`fallback_reasons` before it widens.

**Phase 6 — vibe groups in the picker.** Only after Phase 5 shows fragments help.

**Invariants that must hold throughout:** freeze `get_dream_mediums` / `get_dream_vibes` forever so old app
versions keep working; never `is_active = false` and never DELETE a style that has history; gate the OFFER, never
the acceptance, so a queued dream always renders; resolve the MODEL at enqueue and the LOOK at render, because the
charge depends only on the model.

---

## 6. Tools that already exist

| tool                                | what it does                                                                                        |
| ----------------------------------- | --------------------------------------------------------------------------------------------------- |
| `scripts/build-look-sort-sheet.js`  | the visual sorting sheet for the 54 looks                                                           |
| `scripts/check-nightly-catalog.js`  | catalogue coherence: approvals that can never fire, looks with no fragment, code-banned live places |
| `scripts/scan-scenario-actions.js`  | every stored scenario action is still a verbatim slice of its scene                                 |
| `scripts/apply-look-quarantine.js`  | the purple quarantine button → look retirement                                                      |
| `scripts/snapshot-nightly-state.js` | freeze / diff a whole engine state (code switches + config + policy + approvals)                    |
| `scripts/nightly-morning-check.js`  | the morning-after read on a live nightly run                                                        |
| `scripts/model-matrix-swap.js`      | the grading harness; needs a look axis added for this project                                       |

---

## 7. How Kevin works (relevant to this project)

- Smallest diff for the literal request. Do not bundle extras into an approved plan — he called that out explicitly
  this session: _"stop doing stuff outside the bounds of what we talk about… that's how you introduce drift."_
- Describe what a change **touches in the render**, not the category you think it belongs to. A change described as
  a "prompt-position fix" that actually rewrote the framing block is how drift gets approved.
- Be certain before asserting. Verify against the live DB or a fixed-seed render; do not reason from the image or
  from migration files (the DB has drifted from them in at least three places).
- Never invent content for his authored pools. Restructuring his own words is fine; writing new ones is his call.
- Test-lock new behaviour, and prefer a test that asserts the thing REFUSES as well as the thing that works.
- Frame decisions with a recommendation, not a survey.

---

## 8. Related docs

- `CREATE_LOOKS_MIGRATION_PLAN.md` — the design, the attacks it survived, family names, the vibe group table, the
  backlog for fun face-swap looks.
- `NIGHTLY_LIVE_WATCH.md` — what is live tonight and the morning routine.
- `NIGHTLY_PARITY_QA_LOOP.md` — how the nightly engine got here, including the restore path to earlier states.
- `DREAMSMART_MODEL_VALIDATION.md` — the grading runbook this project must extend.
- `SMART_DREAM_PLAN.md` — why DreamSmart exists and why its data lives in `client_meta`.
