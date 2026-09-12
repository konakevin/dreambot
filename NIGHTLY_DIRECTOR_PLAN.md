# NIGHTLY_DIRECTOR_PLAN.md

> **PARKED 2026-09-12 (Kevin): "this attempt to make them more interesting is becoming too much work and too risky."**
> Kept as the design of record for when it is picked up again, with two decisions already made: (1) Sonnet never
> invents or paraphrases a beat (given freedom it pigeonholes and rhymes; we have seen it), so the shot list must be
> a LARGE AUTHORED DB POOL shipped verbatim, seeded 25 per world × cast × family bucket, linted + proximity-scanned,
> reviewed in the app, then scaled; (2) every world register (real place, fantasy, sci-fi, wild west, underwater,
> goofy / active scenario) gets its own beats, occasions and wardrobe rules, and a seed that already is a premise is
> staged, never re-storied. The module drafts from the aborted build live in the session scratchpad only.
> Production tonight: the engine as it was, with only the looks + vibes contract applied on the looks path.


**Status of record for Director Mode on the nightly looks path.** Written 2026-09-12 from five read-only maps
(author-action, pools, swap-safety, memorable-scene, looks-path), three competing designs and six judge verdicts.
Winner: the single-call premise-first design ("sonnet-director", 112 weighted points vs 111 shot-list vs 104
two-stage), with the shot-list design's per-row swap metadata, three-rung fallback and HEAD_MERGE rule grafted in,
and the two-stage design's occasion axis, per-model allowlists, negation and torso-rotation rejects, and
anti-compounding metrics grafted in. Every judge "would_break" is resolved in section 11.

Companion docs: `NIGHTLY_LOOKS_REFACTOR_PLAN.md` (blocks `nightly_looks_mode=on` until this lands),
`SCENE_FIRST_ACTION_PLAN.md` (the authored-action machinery this extends), `BOT_SCENE_QUALITY_PLAYBOOK.md`
(the 8 components of a memorable scene), `NIGHTLY_VIBES_AUDIT.md` (the vibe owns the light).

---

## 0. Ledger

| Date | Step | Result |
|---|---|---|
| 2026-09-12 | Plan written; 12 acceptance beats + 36 shot-list strings verified against the LIVE `actionSafety.ts` regexes (all pass; Kevin's raw bar beats fail on `camera` / `smiling` exactly as mapped; `heads together ... a clear gap between their heads` PASSES today's validator, which is why rule V2 HEAD_MERGE below is mandatory) | pending build |

---

## 1. Thesis, in Kevin's terms

Tonight's renders are not Sonnet being lazy. They are the system doing exactly what the action brief tells it to do.
For 60% of nightlies the brief literally says the register is "candid travel moment at this real place (visitors,
not locals)", hands it six gear lines ("lifting a dive tank by its valve", "zipping a jacket at the summit
marker"), three scene-blind pool poses as style examples, one of seven generic body stances, and asks for a
"photo caption" with busy hands. So it writes "climber plants both mittened hands on the summit wand". The
SET DRESSER and COSTUME DESIGNER upgrade on the looks path never touched that field, and the four fields
(scene, wardrobe, props, action) are written as four unrelated lists with no shared reason to exist.

The glasshouse render you loved is different in STRUCTURE, not in polish. It has ONE premise (a tea dance in the
conservatory after the party), and everything is dressed for it: the spot leads the scene ("on the mosaic path
beside the koi pond"), every set element is placed relative to the people by a preposition, the two costumes pair
for the same evening, the one prop (the tea service) explains why they are there, the beat has a verb and a
relationship, and the face/camera language is left to the framing block. Randomization was still doing its job:
the place, the look and the vibe were rolled.

Director Mode makes that structure the default on the looks path without giving up the randomizer:

1. Code rolls the story ingredients that must vary: a BEAT ARCHETYPE from a curated, CI-locked shot list (18
   families in v1, weighted so that fewer than a third of couple rolls hold an object), an ALTERNATE that shares
   the same body geometry, an OCCASION seed ("the last night of the trip", "a dare"), and a PRACTICAL LIGHT noun,
   all with per-user recency so two nights never rhyme. Pools, scene-type roll, looks and vibes are untouched.
2. Sonnet, in the SAME slot call it already makes, writes the shot premise-first: premise, beat_key, action,
   solo_action (couples), scene_description, wardrobe(s), props, mood. Every later field is dressed for the
   earlier ones, and the SET DRESSER begins at the exact spot the action names.
3. A normalizer STRIPS the phrases the framing block already owns (smiling, toward the camera) instead of
   rejecting the whole beat, depronouns, and only then runs the UNCHANGED swap-safe validator plus new
   never-mitigable rules (head merge, contact when contact is off, negation, transfer toward the partner,
   occluders, motion, plane breaks, face-bearing objects). The gap clause is appended only to a beat that has
   already passed.
4. The story survives a miss: authored beat, else the archetype's own validator-clean fallback text, else
   today's pool pose. A dual-to-solo degrade keeps the story via a solo twin authored in the same call.
5. Contact families (the slow-dance hold) and motion families (dance steps) roll ONLY on models named in
   engine_config allowlists (default empty), because on flux-1.1-pro the dance rendered as standing 25/26 and
   every early-framing change so far has cost identity. The early anchor stays posture-only (standing/seated).
6. Every decision is a pure `_shared` module with fast-jest tests, ~30 lines of seams in `index.ts`, one
   engine_config row to turn it off, and one stamp per fact so `/mine-posts` can rate archetypes by RATE.

The bar: every night, a composed frame from a stylish film in which the cast are the leads, integrated in the
world, with a reason to be there, in clothes chosen for that reason, and variety coming from the pools and axes.

---

## 2. What won, what was grafted, what was rejected

**Weighted judge totals** (quality_ceiling and swap_safety counted twice): sonnet-director 112, shot-list 111,
two-stage-director 104. The margin is small and the judges' criticisms overlap almost entirely, so the plan is the
sonnet-director architecture with the following grafts:

- From shot-list: per-archetype swap metadata (`seated`, `contact`, `motion`, `heldObject`, register filters),
  the three-rung fallback with archetype fallback text, `HEAD_MERGE` as a never-mitigable class, the seed lint
  pattern, `wardrobeHint` per archetype, gender-neutral fallback texts for same-gender couples.
- From two-stage: the OCCASION axis rolled in code, per-model allowlists (contact / motion) as engine_config
  arrays, the negation reject, the torso-rotation (transfer) reject, prop-noun anti-compounding in QA, the
  relationship label plumbed from `plusOneRelationship`, the canonical "bodies open to the viewer" echo.

**Rejected on evidence**: a DB `story_beats` table in v1 (code table + CI lock first; DB later if Kevin wants
dashboard weights), a second "re-pitch" Sonnet call (deadline math, 140 s clock), a Haiku critic (latency,
refusal surface), a taste-refresh weekly job (38 hearts/30 d cannot move weights), `{spot}` placeholders
(a placeholder miss invented railings on sandbars), early "mid-step in a slow dance" anchor text (the Round B
class of change), the archetypes `the_craft`, `the_game`, `the_ride`, `kneeling_together`, `the_music`,
`show_and_tell`, `the_pour`, `lantern_lighting-as-task` (each implies a downward gaze, a chest-height object,
a parked geometry, or an instrument between lens and torso).

---

## 3. Architecture

### 3.1 New modules (all pure, all under `supabase/functions/_shared/`)

#### `directorBeats.ts` (leaf: imports nothing at runtime except types)

```ts
export type DirectorKind = 'elegant' | 'goofy' | 'location';
export type DirectorCast = 'solo' | 'couple' | 'both';

export interface DirectorBeat {
  key: string;                    // stamp-safe, unique
  family: 'body' | 'object' | 'goofy' | 'daytime';
  cast: DirectorCast;
  kinds: DirectorKind[];          // which scene kinds may roll it
  seated: boolean;                // drives the early anchor's posture word via dualStance.seated
  contact: boolean;               // hand/arm contact below the shoulders (gated by director_contact_models)
  motion: boolean;                // a dance step (gated by director_motion_models)
  heldObject: boolean;            // CI-locked: sum(weight) of heldObject rows <= 35% per (kind, cast)
  partnerOnly: boolean;           // rolls only when relationshipLabel === 'partners'
  onlyRegisters?: string[];       // biome / category keys (actionRegisters aliases) it may roll on
  excludeRegisters?: string[];    // keys it never rolls on
  weight: number;                 // 0.5 .. 2.0
  hint: { couple: string; solo: string };       // one positive line each, shown to Sonnet
  example: { couple: string; solo: string };    // validator-clean PASS example at a DIFFERENT place
  fallback: { couple: string; solo: string };   // generic, placeholder-free, gender-neutral, validator-clean
  wardrobeHint: string;           // one line for the COSTUME DESIGNER, register of the archetype
}

export interface DirectorOccasion {
  key: string;
  text: string;                   // <= 10 words, e.g. 'the last night of the trip'
  kinds: DirectorKind[];
}

export const DIRECTOR_BEATS: readonly DirectorBeat[];        // section 4.1
export const DIRECTOR_OCCASIONS: readonly DirectorOccasion[]; // section 4.2
export const DIRECTOR_PRACTICAL_LIGHTS: readonly string[];    // section 4.3

export interface RollBeatInput {
  castCount: 1 | 2;
  kind: DirectorKind;
  registerKey: string | null;     // holiday pool | biomeKey | scenario category | kind (as today)
  relationshipLabel: RelationshipLabel;
  contactAllowed: boolean;        // contract model in director_contact_models (or QA force)
  motionAllowed: boolean;         // contract model in director_motion_models (or QA force)
  recentBeatKeys: string[];       // from rolled_axes.director.beat of the user's last N rows
  forceKey?: string | null;       // QA: force_director_beat (bypasses contact/motion gates, stamps beat_source:force)
  rng?: () => number;
}
export function rollDirectorBeat(i: RollBeatInput): { primary: DirectorBeat; alternate: DirectorBeat; stamps: string[] } | null;
//  filter by cast/kind/register/contact/motion/partnerOnly; drop recentBeatKeys unless < 3 remain;
//  weighted primary; alternate = weighted pick from the remainder with the SAME seated flag and
//  contact === false (so the early anchor and the contact line are true whichever one Sonnet shoots).
//  null when nothing fits (stamp director:no_beat, resolver falls back to scene-first as today).

export function rollDirectorOccasion(i: { kind: DirectorKind; recentOccasionKeys: string[]; forceKey?: string | null; rng?: () => number }): DirectorOccasion;
export function rollPracticalLight(rng?: () => number): string;
export function beatByKey(key: string): DirectorBeat | null;
export function eligibleBeats(i: Omit<RollBeatInput, 'recentBeatKeys' | 'forceKey' | 'rng'>): DirectorBeat[]; // for tests + the shadow stamp
```

#### `directorMode.ts` (decision, spec, normalizer, validator, slots post-processing, honesty)

```ts
import type { DirectorBeat, DirectorOccasion, DirectorKind } from './directorBeats.ts';

export type RelationshipLabel = 'partners' | 'close friends' | 'family' | 'two people who came here together';
export function relationshipLabel(raw: string | null | undefined): RelationshipLabel; // sanitizeUserText + allowlist map

export interface DirectorSpec {
  kind: DirectorKind;
  register: string;               // directorRegister(...)
  beat: DirectorBeat;
  alternate: DirectorBeat;
  occasion: DirectorOccasion;
  practicalLight: string;
  relationshipLabel: RelationshipLabel;
  contactAllowed: boolean;
  realWorld: boolean;
  selfIndex: 0 | 1;
  sameGender: boolean;
  retryDeadlineMs: number;        // t0 + DIRECTOR_RETRY_BUDGET_MS (see 3.9)
  stamps: string[];
}

export type DirectorReason =
  | 'rolled' | 'forced' | 'mode_off' | 'looks_off' | 'active_scene' | 'holiday' | 'bespoke_pool'
  | 'force_action' | 'active_pose' | 'costume_lock' | 'forced_slots' | 'location_couple_held' | 'no_beat';

export function decideDirector(i: {
  mode: 'off' | 'shadow' | 'on'; looksPath: boolean; forceDirector: boolean;
  castCount: 1 | 2; kind: 'scenario' | 'location' | 'active'; holiday: boolean; bespokePool: boolean;
  forceAction: boolean; activePoseFired: boolean; costumeLock: boolean; forcedSlots: boolean;
  allowLocationCouples: boolean;
}): { apply: boolean; shadow: boolean; reason: DirectorReason };
//  Never-rules first (active_scene, force_action, active_pose, bespoke_pool, costume_lock, holiday, forced_slots),
//  then location_couple_held unless allowLocationCouples, then: forceDirector -> apply; mode 'on' && looksPath ->
//  apply; mode 'shadow' (any looks mode) -> shadow (roll + stamp, nothing applied); else mode_off / looks_off.

export function buildDirectorSpec(i: {
  castCount: 1 | 2; kind: 'scenario' | 'location'; sceneKind: 'goofy' | 'elegant' | null; registerKey: string | null;
  relationship: string | null | undefined; contractModel: string; contactModels: string[]; motionModels: string[];
  realWorld: boolean; selfIndex: 0 | 1; genders: (string | null)[]; recentBeatKeys: string[]; recentOccasionKeys: string[];
  forceBeatKey?: string | null; forceOccasionKey?: string | null; forceContact?: boolean; t0: number; rng?: () => number;
}): DirectorSpec | null;

export function directorRegister(i: { kind: DirectorKind; realWorld: boolean }): string;
//  location + realWorld -> 'an evening or a day out at this real place, dressed for the occasion (guests from elsewhere)'
//  location + imagined  -> 'a day or night out in this world, dressed for the occasion'
//  elegant              -> 'elegant / refined'          goofy -> 'goofy / playful fun'

export const DIRECTOR_MAX_TOKENS = 1200;
export const DIRECTOR_RETRY_BUDGET_MS = 30_000; // = RENDER_DEADLINE_MS - SOLO_FALLBACK_RESERVE_MS - DUAL_RECOVER_MS - 20_000 (render floor)

export interface NormalizeResult { beat: string; stamps: string[] }
export function normalizeDirectorBeat(raw: string, castCount: 1 | 2, gender: 'man' | 'woman' | 'person'): NormalizeResult;
//  normalizeActionBeat -> stripTemplateOwnedClauses -> depronounActionBeat -> (solo) depluralizeAction -> collapse punctuation

export type DirectorVerdict = { ok: true } | { ok: false; reason: string };
export function validateDirectorBeat(beat: string, castCount: 1 | 2, ctx: { contactAllowed: boolean; motionAllowed: boolean; gender: 'man' | 'woman' | 'person' }): DirectorVerdict;
//  section 6 rules V1..V11, then the UNCHANGED validateActionBeat

export function ensureGapClause(beat: string): { beat: string; stamp: string }; // couples, AFTER a pass; 'director_gap:appended' | 'director_gap:present' | 'director_gap:composer_only'

export function resolveDirectorAction(i: { slots: CharacterSlots; spec: DirectorSpec; castCount: 1 | 2; gender: ...; poolAction: string | null }):
  { slots: CharacterSlots; stamps: string[] };
//  the fallback ladder (section 6.4): authored -> archetype fallback -> null (pool pose via input.action)

export function normalizeDirectorSlots(slots: CharacterSlots, castCount: 1 | 2, gender: ..., spec: DirectorSpec): { slots: CharacterSlots; stamps: string[] };
//  beat_key echo -> director_beat_used; face-object guard on props (blank) and scene_description (drop clause);
//  solo locative de-pluralization in scene_description ('behind them' -> 'behind the man'); dominance stamp

export function scrubForbiddenClauses(slots: CharacterSlots, patterns: { name: string; regex: RegExp }[]): { slots: CharacterSlots; stamps: string[]; stillViolating: string[] };
//  deadline path only: drop the comma-clauses that match instead of paying a second Sonnet call

export function assertDirectorHonesty(prompt: string, slots: CharacterSlots, o: { rebuilt: boolean }): string[];
//  rebuilt=false: slots.action (if non-null) must be in prompt verbatim -> 'director_violation:beat_missing'
//  rebuilt=true : slots.solo_action (if non-null) must be in prompt -> 'director_violation:solo_beat_missing'
//  never blocks, mirrors assertStyleHonesty

export function directorShadowStamp(spec: DirectorSpec): string; // 'director_shadow:<beat>:<occasion>'
```

#### `directorBrief.ts` (the brief text; takes identities + the forbidden block as arguments so it never imports characterSlotPrompt at runtime)

```ts
export function buildDirectorBrief(
  input: CharacterSlotPipelineInput,       // reads iconicAnchor/userPlace, mediumFluxFragment, vibeDirective, timeAxis, wardrobeAnchor, realWorldLocation, avoidList
  spec: DirectorSpec,
  ids: ResolvedIdentity[],                 // resolveIdentity(cast[i])
  forbiddenBlock: string                   // DIRECTOR_FORBIDDEN_BLOCK (section 5), exported from here
): string;
export const DIRECTOR_JSON_KEYS_COUPLE = ['premise','beat_key','action','solo_action','scene_description','left_wardrobe','right_wardrobe','props','mood'] as const;
export const DIRECTOR_JSON_KEYS_SOLO   = ['premise','beat_key','action','scene_description','wardrobe','props','mood'] as const;
```

### 3.2 `characterSlotPrompt.ts` surgical edits (every one inert when the new optional fields are absent; golden fixture stays byte-identical)

| Site (today's lines) | Edit |
|---|---|
| `SingleSlots` / `DualSlots` (55-73) | add optional `premise?: string | null; beat_key?: string | null;` and on `DualSlots` `solo_action?: string | null` |
| `AuthorActionSpec` (178-186) | add `director?: DirectorSpec | null` (type-only import) |
| `buildSlotBrief` (553) | first statement: `if (input.authorAction && input.authorAction.director) return buildDirectorBrief(input, input.authorAction.director, input.cast.map(resolveIdentity), DIRECTOR_FORBIDDEN_BLOCK);` |
| `parseSlotsJson` (807-830) | read `premise`, `beat_key` as optional strings; `solo_action` through `depronounActionBeat(normalizeActionBeat(...))` like `action` |
| `runCharacterSlotPipeline` (1314-1412) | `callSonnet(brief, key, director ? DIRECTOR_MAX_TOKENS : 900)`; stamp `slot_call_ms:<n>` around the loop; before attempt 2 when `director && Date.now() > director.retryDeadlineMs`: skip the retry, run `scrubForbiddenClauses`, stamp `director_retry_skipped:deadline` (+ `director_scrub:<fields>`), fall to `fallbackSlots` only if still violating; after `applyCostumeLock`: `if (director) { slots = normalizeDirectorSlots(...); slots = resolveDirectorAction(...) }` and SKIP the existing scene-first validation block for director renders (the ladder already stamped `scene_action` / `scene_action_fallback:<reason>`) |
| `assembleSoloFallbackFromDual` (1282-1310) | `singleSlots.action = dualSlots.solo_action ?? null` (input.action stays null; three_quarter pin unchanged). Signature unchanged, so `index.ts` L3699 needs no edit |
| composers (960-1244) | UNCHANGED in v1. The archetype's `seated` flag reaches the anchor through `dualStance.seated` exactly as today's stances do. No story text enters the early window (see 11, J2-2) |

### 3.3 `castActionResolver.ts` (the sfaRoll block, 98-136)

```ts
// CastActionInputs gains: director: DirectorSpec | null;
if (i.sfaRoll) {
  if (i.director) {
    authorAction = { register: i.director.register, exemplars: [], stance: null, registerActions: null, director: i.director };
    if (i.castCount === 2) dualStance = { key: `director:${i.director.beat.key}`, text: '', seated: i.director.beat.seated };
    stamps.push(...i.director.stamps, 'scene_action_roll');
  } else {
    /* existing block byte-for-byte */
  }
}
```
The pool fallback `action` above the block is untouched (it is rung 3 of the ladder). `dual_stance:*` and
`action_register:*` stamps are NOT pushed on director renders (the archetype owns the body frame; the gear
registers are the vocabulary being replaced).

### 3.4 `nightlyLooksPath.ts`

No change to `looksSlotInputFields`. Director rides `authorAction.director`, so the looks-path fields
(`richBrief`, `lookNeutralFraming`, vibe fragment early, `dualComposition: null`) are inherited unchanged.
`afterScenePrompt` and `retryPromptFor` re-assemble from `castSlotsCtx.slots`, which now carry `solo_action`
and the shipped `action`, so retries reproduce the beat with no new plumbing.

### 3.5 `nightly-dreams/index.ts` seams, by region (about 30 lines total)

| Region | Seam |
|---|---|
| L417-430 mode setup | `const directorMode = force_director ? 'on' : engineCfg0.nightlyDirectorMode;` |
| L562-585 recency | `const recentDirectorBeats = (recentLogs ?? []).map(l => l.rolled_axes?.director?.beat).filter(isString); const recentDirectorOccasions = ...director?.occasion...` (same 7-row query, no new I/O) |
| L2394-2411 (inside the `decideSceneFirst` block, BEFORE Option B) | `const dirDecision = decideDirector({ mode: directorMode, looksPath, forceDirector: force_director, castCount, kind: sfaKind, holiday: !!holidayCategory, bespokePool: !!dualScenePosePool, forceAction: !!force_action, activePoseFired: force_active_pose || !!activePose || !!activeSinglePose, costumeLock: !!costumePicks, forcedSlots: !!(force_dual_slots || force_single_slots), allowLocationCouples: sfaCfg.directorLocationCouples });` then `const directorSpec = (dirDecision.apply || dirDecision.shadow) ? buildDirectorSpec({ castCount, kind: sfaKind, sceneKind: sceneKindNow(), registerKey, relationship: plusOne?.relationship, contractModel: styleContract?.model ?? pickedModel, contactModels: sfaCfg.directorContactModels, motionModels: sfaCfg.directorMotionModels, realWorld: dualSpecialScene ? false : !imaginedLocation, selfIndex, genders, recentBeatKeys: recentDirectorBeats, recentOccasionKeys: recentDirectorOccasions, forceBeatKey: force_director_beat, forceContact: force_director_contact, t0 }) : null;` `fallbackReasons.push(\`director:${dirDecision.reason}\`)`; shadow: push `directorShadowStamp(spec)` and set `directorSpec = null`. Note `costumePicks` must be computed before this block (move the costume-lock roll up ~80 lines; it has no dependency on the action). |
| L2413 Option B guard | `if (plainLocation && !sfaRoll && !directorSpec && ...)` (one beat per render; Option B is never paid for on a director render) |
| L2437-2485 resolver call | `sfaRoll: sfaRoll || !!directorSpec, director: directorSpec` |
| L2519-2625 slotInput | no new fields (spec rides `authorAction.director`) |
| L2690-2703 seedSource | `director: castSlotsCtx ? { beat: slots.beat_key ?? null, rolled: directorSpec?.beat.key ?? null, occasion: directorSpec?.occasion.key ?? null, premise: slots.premise ?? null, action: slots.action ?? null, soloAction: slots.solo_action ?? null } : null` (persisted under `rolled_axes.director` for recency + forensics; premise never reaches Flux) |
| L4460 persist honesty | `...(directorSpec && castSlotsCtx ? assertDirectorHonesty(finalPrompt, castSlotsCtx.slots, { rebuilt: fallbackReasons.includes('dual_degrade_single') }) : [])` |

### 3.6 `engine_config` (migration `511_director_mode.sql`, applied with `node scripts/apply-migration.mjs 511`, `--dry-run` first)

| Column | Type / default | Parsed as | Meaning |
|---|---|---|---|
| `nightly_director_mode` | text NOT NULL DEFAULT 'off' CHECK IN ('off','shadow','on') | `nightlyDirectorMode` | off = nothing; shadow = roll + `director_shadow:` stamp on every eligible cast render regardless of looks mode, nothing applied; on = applies on the looks path |
| `director_contact_models` | text[] NOT NULL DEFAULT '{}' | `directorContactModels` | contract models on which `contact: true` archetypes may roll and the brief allows below-shoulder touch |
| `director_motion_models` | text[] NOT NULL DEFAULT '{}' | `directorMotionModels` | contract models on which `motion: true` archetypes (dance families) may roll |
| `director_location_couples` | boolean NOT NULL DEFAULT false | `directorLocationCouples` | lets location COUPLES enter the director (its own gate, independent of `scene_action_location_couples`) |
| `nightly_director_recency` | integer NOT NULL DEFAULT 5 | `nightlyDirectorRecency` (clamped 0..7 in v1 because `recentLogs` reads 7 rows) | per-user recency window over `rolled_axes.director.beat` and `.occasion` |

Parse pattern: the existing 3-line add (type ~L133, default ~L201, parse ~L329). Garbage arrays parse to `[]`.
Tonight's slice needs NO migration: every field parses to its default when the column is absent, and QA runs on
`force_director`.

v2 knobs (parsed only when built): `director_frame_hint_couples` (a 4-word furniture cue in the compactAnchor,
A/B per model), `director_object_pct` (override of the CI-locked object share).

### 3.7 QA flags (`_shared/nightlyQaFlags.ts`, parsed like `force_scene_action`)

| Flag | Type | Effect |
|---|---|---|
| `force_director` | boolean (`=== true`) | applies the director for this render (requires the looks path: the QA script sends `force_looks_path` too; otherwise stamp `director:looks_off`) |
| `force_director_beat` | string or null | pins the primary archetype; bypasses contact/motion/partnerOnly/recency gates; stamps `director_beat_source:force` |
| `force_director_occasion` | string or null | pins the occasion key |
| `force_director_contact` | boolean or undefined | overrides the contact allowlist for one render |

`nightly-dreams.js` (the cron enqueuer) never sets `force_*` flags, so no real user can receive a forced beat.

### 3.8 Stamps (one fact per stamp; `ai_generation_log.fallback_reasons`)

- Decision: `director:<reason>` (rolled | forced | mode_off | looks_off | active_scene | holiday | bespoke_pool | force_action | active_pose | costume_lock | forced_slots | location_couple_held | no_beat)
- Roll: `director_beat:<key>`, `director_alt:<key>`, `director_occasion:<key>`, `director_beat_source:roll|force`, `director_shadow:<beat>:<occasion>` (shadow only)
- Sonnet outcome: `director_beat_used:<key>|unknown` (from the echoed `beat_key`), `director_strip:<n>` (clauses stripped), `director_gap:appended|present|composer_only`, `scene_action` or `scene_action_fallback:<reason>` (reasons: today's set + `head_merge`, `contact`, `negation`, `transfer`, `occluder`, `motion`, `plane_break`, `dominance`, `face_object`, `solo_company`, `missing`), `director_fallback:archetype|pool`, `director_solo_action` or `director_solo_action_fallback:<reason>`
- Guards: `director_props_face_object`, `director_scene_face_object`, `director_scene_dominance`, `director_solo_depluralized:action|scene`
- Budget: `slot_call_ms:<n>`, `director_retry_skipped:deadline`, `director_scrub:<field,...>`
- Honesty: `director_violation:beat_missing`, `director_violation:solo_beat_missing`
- Unchanged and still emitted: `scene_action_roll`, `couple_prompt_style:*`, `looks_path:on`, `dual_degrade_single`, `no_dual_split:*`, identity stamps, quality-gate stamps

### 3.9 Deadline budget (the slot call runs inside the 140 s clock)

`t0` is handler entry (`index.ts` L391). `renderDeadlineMs = t0 + 140 s`, `dualDeadlineMs = t0 + 90 s`.
Director raises output tokens 900 -> 1200 and adds up to three fields. Protection: `slot_call_ms` is stamped on
every director render; the second Sonnet attempt (FORBIDDEN retry or parse retry) is skipped once
`Date.now() > t0 + DIRECTOR_RETRY_BUDGET_MS` (30 s) and replaced by `scrubForbiddenClauses` (drop the offending
comma-clauses; `premise` is never validated because it never reaches Flux). Follow-up (v2): an `AbortSignal` in
`llm.ts` so a 529 retry ladder cannot outlive the budget.

---

## 4. The randomizer: shot list, occasions, practical lights

### 4.1 Shot list v1 (18 archetypes; every `example` and `fallback` string below was run through the live `actionSafety.ts` regexes and passes for its cast size)

Weights shown are `weight`; body families total 9.6, object families 3.4 (26% of a non-goofy roll before
register filters; the CI lock caps `heldObject` rows at 35% per kind and cast), daytime 3.2 (register-filtered),
goofy families roll only on goofy rows.

**Body / relationship (hands free or a gesture; no held object)**

1. `slow_dance` | body | couple | kinds elegant, location | seated no | contact YES | motion YES | partnerOnly | weight 1.5 | exclude aquatic_underwater
   - hint (couple): "A slow dance held mid-step at the spot: a hand at the small of the back, a hand on a shoulder, both bodies open to the viewer, heads apart."
   - example (couple): "mid-step in a slow dance on the terrace beside the fountain, the man's hand at the small of the woman's back, the woman's hand resting on the man's shoulder, both bodies open to the viewer, a clear gap between their heads"
   - wardrobeHint: "evening dress for this exact place: velvet, satin, silk, sharp tailoring"
2. `dance_step` | body | both | kinds elegant, goofy, location | contact no | motion YES | weight 1.2
   - hint (couple): "A dance step caught a step apart: a hem or coat swept at knee height, one hand lifted to hip height, the other palm open low."
   - hint (solo): "A dance step caught alone: a hem or coat swept at knee height, one hand lifted to hip height."
   - example (couple): "mid-step of a dance under the string lights a step apart, the woman's skirt swept out at knee height and one hand lifted to hip height, the man's palm open low at the side, a clear gap between their heads"
   - example (solo): "mid-step of a dance under the string lights, a coat hem swept at knee height, one hand lifted to hip height"
   - wardrobeHint: "clothes that move: a full skirt, a long coat, a loose jacket"
3. `the_arrival` | body | both | kinds elegant, location | weight 1.4
   - hint (couple): "Just arrived at the spot, out in the open on a terrace, a step or a deck: a coat over one arm, a bag set at the feet, one boot up on a step or one hand on a rail."
   - hint (solo): "Just arrived at the spot, out in the open: a coat over one arm, a bag at the feet, one hand on a rail or one boot on a step."
   - example (couple): "just arrived on the harbour terrace, the man with a wool overcoat over one arm and one boot up on the step, the woman with a weekend bag at the feet and one hand on the rail, a clear gap between their heads"
   - example (solo): "arrived at the top of the harbour steps, coat over one arm, a bag at the feet, one hand on the balustrade"
   - wardrobeHint: "arrival clothes with polish: a good coat, a structured bag, boots or loafers"
4. `the_view_rail` | body | both | kinds elegant, location | weight 1.4
   - hint (couple): "A composed still at a railing, balustrade or low wall at the spot: each with a hand on the rail, weight on one hip; a glass or a hat may rest on the rail if it belongs."
   - hint (solo): "A composed still at a railing, balustrade or low wall: one hand resting on it, weight on one hip; the set, the costume and the prop carry the story."
   - example (couple): "standing at the railing beside the koi pond, the man with one hand on the rail and the other in a jacket pocket, the woman with a hand on the rail and a coupe resting on the ledge, a clear gap between their heads"
   - example (solo): "standing on the mosaic path beside the koi pond, one hand on the wrought-iron railing, a coupe held low in the other"
   - wardrobeHint: "dressed for the evening or the day at this place, elevated"
5. `the_spectacle` | body | both | kinds elegant, goofy, location | weight 1.5
   - hint (couple): "The place performs behind or around them (fireworks opening, birds lifting, bells ringing, lanterns rising, a parade passing, the tide arriving, an aurora breaking): they react with hands at hip height, one hand lifted low toward it."
   - hint (solo): "The place performs behind or around the person (fireworks, birds lifting, bells, lanterns rising, a parade, the tide, an aurora): one hand lifted to hip height toward it, the other on a surface."
   - example (couple): "standing on the quay as the fireworks open over the water behind them, the woman with one hand lifted to hip height toward the light, the man with hands in coat pockets, a clear gap between their heads"
   - example (solo): "on the quay, fireworks opening over the water behind, one hand lifted low toward the light, the other on the post"
   - wardrobeHint: "dressed for the occasion the place is celebrating"
6. `the_bench` | body | both | kinds elegant, goofy, location | seated YES | weight 1.3
   - hint (couple): "Seated side by side on a bench, step or low wall at the spot with nothing in front of them: a coat or skirt spread, an arm along the backrest, boots crossed at the ankle."
   - hint (solo): "Seated on a bench, step or low wall at the spot with nothing in front: a coat or skirt spread, an arm along the backrest, boots crossed at the ankle."
   - example (couple): "seated side by side on the stone bench beneath the arcade, the woman's satin skirt spread across the stone, the man with one arm along the backrest and boots crossed at the ankle, a clear gap between their heads"
   - example (solo): "seated on the timber bench along the sunlit terrace wall, one arm along the backrest, an enamel mug on the bench beside"
   - wardrobeHint: "dressed up, now at ease: jacket open, a wrap, heels set beside"
7. `the_laugh` | body | both | kinds elegant, goofy, location | weight 1.3
   - hint (couple): "Mid-laugh at something that just happened at the spot (name it: a toppled tray, a gust, a dog, a wrong note): shoulders loose, hands at hip height or on a surface."
   - hint (solo): "Mid-laugh at something that just happened at the spot (name it): shoulders loose, one hand on a surface."
   - example (couple): "both mid-laugh at the tray of cups the wind just toppled on the cafe table, the man with both hands on the table edge, the woman with one hand on a hip, a clear gap between their heads"
   - example (solo): "mid-laugh at the tray of cups the wind just toppled, one hand on the cafe table edge, the other on a hip"
   - wardrobeHint: "dressed for the place and the hour, relaxed and photogenic"

**Object (a held object; capped)**

8. `toast_low` | object | both | kinds elegant, location | heldObject | weight 0.8 | exclude aquatic_underwater
   - hint (couple): "A quiet toast at the spot with glasses held LOW at waist height, meeting across the gap or resting on a rail or table edge; the bottle set on a surface beside them."
   - hint (solo): "A glass held low at waist height at the spot, the other hand on a rail or surface, the bottle set beside."
   - example (couple): "leaning back against the balustrade of the terrace, two coupes meeting low at waist height across the gap, the champagne bucket on the ledge beside them, a clear gap between their heads"
   - example (solo): "leaning back against the balustrade of the terrace, a coupe held low at waist height, the champagne bucket on the ledge beside"
   - wardrobeHint: "dressed for a celebration in this place's own register"
9. `the_reveal` | object | both | kinds elegant, goofy, location | heldObject | weight 0.7 | exclude aquatic_underwater
   - hint (couple): "A reveal already made at the spot: a cloche lid, box lid or cloth held low to one side, the thing revealed sitting on the table or ledge beside them."
   - hint (solo): "A reveal already made: a cloche lid, box lid or cloth held low to one side, the thing revealed on the table or ledge beside."
   - example (couple): "seated at the end of the linen-draped aft-deck table, the woman holding a silver cloche lid low to one side, the cake just revealed on the table, the man with one arm along the chair back, a clear gap between their heads"
   - example (solo): "at the end of the marble counter, a cloche lid held low to one side, a tiered stand of pastries just revealed"
   - wardrobeHint: "dressed for the meal or the party the reveal belongs to"
10. `the_gift` | object | both | kinds elegant, goofy, location | heldObject | weight 0.7
    - hint (couple): "A small gift just opened at the spot: the box open on a surface between them, one holding the gift low in both hands, the other with a hand on a rail or post; each hand busy with its own thing."
    - hint (solo): "A small gift just opened: the box open on a surface beside, the gift held low in both hands."
    - example (couple): "seated on the tea house veranda step, a lacquer box open on the step between them, the woman holding a folded paper fan low in both hands, the man with one hand resting on the cedar post, a clear gap between their heads"
    - example (solo): "seated on the veranda step, a lacquer box open on the step beside, a folded paper fan held low in both hands"
    - wardrobeHint: "dressed up for the occasion the gift marks"
11. `the_lantern` | object | both | kinds elegant, location | heldObject | weight 0.5
    - hint (couple): "A lantern already lit, carried at the spot: held low at hip height by one, the other with a hand on a rail or post."
    - hint (solo): "A lantern already lit, held low at hip height, the other hand on a rail or post."
    - example (couple): "on the wet stone alley outside the tea house, the woman holding a lit paper lantern low at hip height, the man with one hand on the cedar post, a clear gap between their heads"
    - example (solo): "stepping off the veranda onto the wet stone alley, a paper lantern held low at hip height, one hand on the post"
    - wardrobeHint: "evening layers with texture: wool, leather, velvet, a scarf"
12. `the_feast` | object | both | kinds elegant, goofy, location | heldObject | weight 0.7 | exclude aquatic_underwater
    - hint (couple): "Standing or seated at the END of a laden table or beside a market stall, the table to one side: a plate, basket or loaf held low at waist height, the other hand on the table edge."
    - hint (solo): "At the END of a laden table or beside a stall, the table to one side: a plate, basket or loaf held low at waist height, the other hand on the table edge."
    - example (couple): "standing at the end of the long trestle table under the vines, the man holding a bread board low at waist height, the woman with one hand on the table edge beside a bowl of figs, a clear gap between their heads"
    - example (solo): "at the end of the trestle table, a basket of figs held low at the hip, one hand on the table"
    - wardrobeHint: "dressed for the meal: the elegant version of what people wear to eat here"

**Goofy (kinds goofy only; the SEED's gag is the premise, the archetype is the reaction)**

13. `the_standoff` | goofy | both | weight 1.5
    - hint (couple): "A mock face-off over the scene's gag at the spot, a step apart: hands on hips, arms folded, a palm out low in mock protest; the gag object at waist height or on a surface."
    - hint (solo): "Hands on hips in mock outrage at the scene's gag, weight on one hip, the gag object at waist height or on a surface."
    - example (couple): "standing at the ice cream shack's counter a step apart, each holding a cone at waist height, the man with one hand on a hip in mock outrage, the woman with a palm out low in mock protest, a clear gap between their heads"
    - example (solo): "standing at the ice cream shack's counter with hands on hips in mock outrage, a melting cone dripping onto the counter"
    - wardrobeHint: "everyday clothes styled well, one loud piece"
14. `the_reaction` | goofy | both | weight 1.5
    - hint (couple): "The scene's gag has just happened: one mid-laugh with hands on a surface, the other with arms folded or palms out low in mock defeat; the gag stays where the scene put it."
    - hint (solo): "The scene's gag has just happened: mid-laugh with one hand on a surface, the other palm out low."
    - example (couple): "seated side by side on the shack's driftwood bench, the seagull on the counter beside them with a stolen cone, the woman mid-laugh with both hands on the bench edge, the man with arms folded in mock defeat, a clear gap between their heads"
    - example (solo): "seated on the driftwood bench mid-laugh, the seagull on the counter beside with a stolen cone, one hand on the bench edge"
    - wardrobeHint: "everyday clothes styled well, real and current"
15. `the_giant_prop` | goofy | both | weight 1.0
    - hint (couple): "The scene's oversized object as furniture: both leaning on it, seated on it, or a hand resting on it at hip height, a step apart."
    - hint (solo): "The scene's oversized object as furniture: leaning on it or a hand resting on it at hip height."
    - example (couple): "both leaning back against the giant open hardcover book on the library floor, the man with arms folded, the woman with one hand flat on the vast paper beside, a clear gap between their heads"
    - example (solo): "leaning back against the giant open hardcover book on the library floor, arms folded, one boot up on its spine"
    - wardrobeHint: "everyday clothes styled well"

**Daytime / outdoor (register-filtered)**

16. `the_picnic` | daytime | both | kinds elegant, location | seated YES | weight 1.0 | exclude aquatic_underwater, interior_intimate, urban_city
    - hint (couple): "A picnic laid at the spot: both seated on a rug, low wall or step beside the basket, hands on the rug or a cup resting low, the spread set to one side."
    - hint (solo): "A picnic laid at the spot: seated on a rug, low wall or step beside the basket, one hand on the rug, a cup resting low, the spread to one side."
    - example (couple): "seated side by side on a rug at the meadow's edge, the wicker basket to one side, the man with one hand flat on the rug, the woman with a cup on one knee, a clear gap between their heads"
    - example (solo): "seated on a rug at the meadow's edge, the basket to one side, one hand flat on the rug, a cup beside"
    - wardrobeHint: "daytime elegance: linen, cotton, a straw hat set beside, espadrilles"
17. `the_shoreline` | daytime | both | kinds location | weight 1.2 | onlyRegisters tropical_coastal, temperate_coastal, lake (biomeAxes keys)
    - hint (couple): "At the water's edge at the spot, feet in the shallows or on the wet sand, trousers rolled, sandals dangling from one hand at hip height, a step apart."
    - hint (solo): "At the water's edge, feet in the shallows or on the wet sand, trousers rolled, sandals dangling from one hand at hip height."
    - example (couple): "standing in the ankle-deep shallows of the lagoon a step apart, the woman with sandals dangling from one hand at hip height, the man with trousers rolled and hands in pockets, a clear gap between their heads"
    - example (solo): "in the ankle-deep shallows, sandals dangling from one hand at hip height, trousers rolled, the other hand on a hip"
    - wardrobeHint: "resort daywear made cinematic: a linen shirt open at the collar, a silk cover-up, a wide hat carried low"
18. `the_market` | daytime | both | kinds elegant, location | heldObject | weight 1.0 | exclude aquatic_underwater, arctic_polar
    - hint (couple): "At a market stall or flower stand at the spot, the stall unattended: an armful of blooms or a paper bag held low against the hip, the other hand on the stall edge."
    - hint (solo): "At a market stall or flower stand, the stall unattended: an armful of blooms or a paper bag held low against the hip, the other hand on the stall edge."
    - example (couple): "at the flower stall under the arcade, the woman with an armful of peonies held low against the hip, the man with a paper bag of oranges in one hand and the other on the stall edge, a clear gap between their heads"
    - example (solo): "at the flower stall under the arcade, an armful of peonies held low at the hip, one hand on the stall edge"
    - wardrobeHint: "daytime city elegance: a trench, a knit, tailored trousers, loafers"

**Fallback texts** (rung 2 of the ladder; gender-neutral, placeholder-free, no place nouns, validator-clean):
- standing (couple): "both standing easy side by side with hands in pockets or resting on something solid in the scene, a clear gap between their heads"
- seated (couple): "both seated side by side on something solid in the scene, hands resting easy, a clear gap between their heads"
- standing (solo): "standing easy with one hand resting on something solid in the scene, weight on one hip"
- seated (solo): "seated on something solid in the scene, one arm stretched along it, at ease"

Each archetype's `fallback` points at the standing or seated text for its cast size.

**Deliberately absent from v1** (with the reason, so nobody re-adds them by accident): `the_craft` / `the_game`
(fine hand work and board games bow the head), `the_pour` and "lighting the lantern" as a task (eyes go to the
spout or the wick), `show_and_tell` / anything at chest height (object between lens and face: `giant_face`),
`the_ride` (saddle or handlebars between lens and torso; depth stagger), `kneeling_together` / `crouched`
(parked geometry, 4/4 degrades), `the_music` with instruments (violin, guitar and accordion sit between lens and
torso), `the_pour_for_two` (transfer toward the partner rotates the torso), threshold framing inside a doorway
(backlit full-body-at-distance, the enviro_wide failure).

### 4.2 Occasion seeds (rolled in code, per-user recency, stamped `director_occasion:<key>`)

| key | text | kinds |
|---|---|---|
| anniversary | "an anniversary, the same date every year" | elegant, location |
| birthday | "a birthday, the candles already blown out" | elegant, goofy, location |
| first_night | "the first night of the trip, still in travel clothes made good" | elegant, location |
| last_night | "the last night of the trip" | elegant, location |
| reunion | "a reunion after years apart" | elegant, location |
| a_dare | "a dare, accepted" | goofy, location |
| a_bet_won | "a bet, won an hour ago" | goofy, elegant, location |
| secret_escape | "a secret escape nobody at home knows about" | elegant, location |
| celebrating_nothing | "celebrating nothing at all, on purpose" | elegant, goofy, location |
| morning_after | "the morning after the party, first ones up" | elegant, goofy, location |
| unexpected_invitation | "an invitation that arrived that afternoon" | elegant, location |
| first_warm_evening | "the first warm evening of the year" | elegant, location |
| day_off | "a stolen day off" | goofy, location |
| rehearsal | "the rehearsal for tomorrow's big event" | elegant |
| homecoming | "a homecoming to the place they always talked about" | elegant, location |
| the_yes | "the answer was yes an hour ago" | elegant, location |
| sunrise_first | "sunrise, before the crowds" | location |
| closing_time | "the last table before the place closes" | elegant, location |

The brief tells Sonnet the occasion must fit the VIBE's hour (a noon vibe means a daytime occasion). A seed
that cannot fit the place is allowed to be adapted, never ignored.

### 4.3 Practical light nouns (rolled in code so the SET DRESSER does not default to a lantern every night)

"a hanging lantern", "candles in glass", "a brass wall sconce", "string lights overhead", "lamplight through a
window", "a paper lantern on a post", "a low table lamp", "sunlight on a brass surface", "light off the water",
"light through leaves", "the glow from a stove door", "a lit shop window". The brief says: use it only if it fits
the VIBE's hour and this place; otherwise the nearest that does. The vibe still OWNS the light.

---

## 5. The director brief, verbatim

Returned by `buildDirectorBrief(input, spec, ids, forbiddenBlock)` when `input.authorAction.director` is set.
Substitutions: `${place}` = `input.iconicAnchor || input.userPlace`; `${look}` = `input.mediumFluxFragment`;
`${vibe}` = `input.vibeDirective`; `${left}` / `${right}` = `resolveIdentity(cast[0])` / `(cast[1])`; `${self}` =
`ids[spec.selfIndex]`; `${A}` / `${B}` = `spec.beat` / `spec.alternate`; `${occasion}` = `spec.occasion.text`;
`${light}` = `spec.practicalLight`; `${relationship}` = `spec.relationshipLabel`; `${names}` = `"the man" and
"the woman"` when genders differ, else `"one" and "the other"`. Couple form first; solo deltas follow.

```
You are the DIRECTOR of a two-person dream shoot for AI image generation. You write NINE fields as ONE coherent shot: the occasion, the moment, the set dressed for that moment, two costumes chosen for it, one prop that explains it, and the mood. Framing, camera, faces, expressions, where anyone looks, and both identities are LOCKED by code: they face the viewer with large clear faces, side by side on one plane at one height, a clear gap between their heads. Spend no words on any of that.

Output ONLY this JSON object, no markdown, no commentary, keys in exactly this order:
{
  "premise": "...",
  "beat_key": "...",
  "action": "...",
  "solo_action": "...",
  "scene_description": "...",
  "left_wardrobe": "...",
  "right_wardrobe": "...",
  "props": "...",
  "mood": "..."
}

PLACE (the world of this frame; scene_description MUST depict it, and for a seeded scene keep every object it names): ${place}

LOOK (the medium this scene will be rendered in): ${look}
Write the set, the costumes and the prop as THIS medium would depict them: a print names printed textures and inks, a painting names brushwork and pigment, a comic names its line and colour, a film still names its stock. Use no camera, lens, photo, photograph, snapshot, flash or editorial words unless the LOOK itself is photographic.

VIBE: it OWNS the light, palette and weather of the set. Write the place under THIS light, never generic daylight, and let the mood echo it: ${vibe}
${input.timeAxis ? `AUTHORED LIGHTING for this scene (keep it): ${input.timeAxis}` : ''}
PRACTICAL LIGHT to place near the people if it fits this hour and place (otherwise the nearest thing that does): ${light}

THE TWO: a ${left.gender} on the LEFT and a ${right.gender} on the RIGHT, ${relationship}. Call them ${names}, never a pronoun.
REGISTER: ${spec.register}
OCCASION SEED: ${occasion}. Adapt it to this place and to the VIBE's hour (a noon vibe means a daytime occasion, a moonlit vibe an evening one).

THE SHOT: ${A.key}. ${A.hint.couple}
If that moment truly cannot happen at this exact place, shoot ${B.key} instead: ${B.hint.couple}
Set beat_key to the one you shot.

FIELDS YOU OWN. Write them in this order; every later field is dressed for the earlier ones.

premise (12-24 words)
  The occasion in one line: who these two are tonight, why they are at this exact spot, what is happening. Specific and cinematic, never a tourist's visit. Example: "a private tea dance in the conservatory after the garden party, the band still playing behind the palms".

beat_key
  "${A.key}" or "${B.key}".

action (25-45 words, one line, present tense)
  The moment itself, a single still from that story. Open with WHERE they are (the exact spot: "on the mosaic path beside the koi pond", "at the end of the aft-deck table"), then give EACH person their own beat. Hands and any object at waist height or lower; feet on the ground or seated on something solid; both side by side on one plane at the same height, bodies open to the viewer. Name one of the spot's own objects.
  ${spec.contactAllowed ? 'Hands may touch below the shoulders (a hand at the small of the back, a hand on a shoulder or forearm, arms linked); heads stay apart.' : 'Each person keeps their own hands to their own beat; they stand or sit a step apart.'} End with "a clear gap between their heads".
  Leave out: the head, chin, face, a smile, where anyone looks, the camera; jumping, running, walking, climbing, arms above the shoulders; reading, studying, examining, consulting; anything held up near a face; masks, hoods, helmets, sunglasses, umbrellas; anything handed across to the other person; any sentence with "not" or "never" in it.
  Example of this SHOT at a different place (do NOT reuse it): "${A.example.couple}"

solo_action (10-22 words)
  The same moment for the ${self.gender} alone at the same spot, used only if the shoot must fall back to one person. One person only, "the ${self.gender}", the same rules, no other person implied.

scene_description (55-85 words)
  You are the SET DRESSER. Begin with the exact SPOT named in action, then place every element relative to it with a preposition (beside, behind them, overhead, along the far wall, at their feet): at least SIX concrete named things that belong to THIS place and THIS occasion (architecture, furnishings, plants, table settings, surface textures) with named materials and colours (mosaic tile, ribbed iron, brass, wet basalt, silk, condensation on glass); one light source with a physical path that agrees with the VIBE (light through the panes, lamplight on wet cobbles) and the practical light near the people; something overhead or on the far wall so no blank wall or empty sky remains. A believable, elegant version of the place: fantastical only if the place itself is. Environment only: no people, camera, framing, faces, pose or distance, and no words about the scene's size.

left_wardrobe (18-28 words)
  You are the COSTUME DESIGNER for the LEFT character, a ${left.gender}${left.build ? `, ${left.build} build` : ''} (${left.identity}): ONE complete outfit dressed FOR THE PREMISE. ${A.wardrobeHint}. Garment, fabric, colour, cut and ONE accessory. Elevated and photogenic: the most cinematic version of what a stylish guest wears to this occasion at this place.${input.wardrobeAnchor ? ` One on-location inspiration to adapt: "${input.wardrobeAnchor}".` : ''}${spec.realWorld ? ' On a real-world place the cast are GUESTS from elsewhere in their OWN clothes, never the traditional, national or ethnic dress of that culture (no kimono, hanfu, mandarin or Mao jacket, sari, kurta, dirndl, lederhosen, keffiyeh, cheongsam, qipao).' : ''}
  Clothing words only. Do NOT describe body, face, hair (locked) or pose.

right_wardrobe (18-28 words)
  The RIGHT character, a ${right.gender}${right.build ? `, ${right.build} build` : ''} (${right.identity}): the same standard, a DIFFERENT complete outfit that pairs with LEFT's as one palette. They dressed for the same occasion, not in the same clothes. Same rules.

props (3-12 words)
  ONE prop that explains why they are here (the silver tea service on the table behind them, the champagne bucket beside the rail), placed at waist height or lower or behind them; never held up near a face; never any object with a face on it (statue, bust, mannequin, doll, mask, portrait); never whimsical, oversized, comic or out of place. Empty string only if nothing fits.

mood (3-4 words)
  Chosen deliberately; it agrees with the premise, the light and the costumes. Example: "lush, warm, romantic, richly layered".

${forbiddenBlock}

${input.avoidList}

Word caps: premise 12-24, action 25-45, solo_action 10-22, scene_description 55-85, each wardrobe 18-28, props 3-12. Output ONLY the JSON object. Start with { and end with }. No commentary.
```

**`DIRECTOR_FORBIDDEN_BLOCK`** (replaces the legacy forbidden block on director renders; same rules, no authority wording):

```
FORBIDDEN IN ANY FIELD (the shot is re-dressed by code if these appear):
- Camera / lens / framing words: close-up, wide shot, medium shot, low angle, 85mm, depth of field, fisheye
- Face words: face, eyes, smile, lips, expression, gaze, jaw, cheeks, eyebrows
- Eye direction and interaction: looking at, gazing, watching, facing each other, turned toward, eye contact
- Pronouns: he, she, him, her, his, hers
- Face occlusion: helmet, mask, sunglasses, hood covering the face, scarf over the face
- Bad framing: from behind, back view, rear view, side profile
- Objects with faces: statue, bust, mannequin, doll, mask, portrait, gargoyle, scarecrow
```

**Goofy-kind deltas** (scenario rows whose seed says normal clothes): the wardrobe sentence "ONE complete outfit
dressed FOR THE PREMISE" becomes "ONE complete everyday outfit styled well: real, current, photogenic, with one
distinctive piece; formalwear only if the scene's gag demands it", and the REGISTER line reads
`goofy / playful fun; the scene's gag is the premise, the shot is the reaction`.

**Solo deltas** (`cast.length === 1`):
- Header: "You are the DIRECTOR of a one-person dream shoot for AI image generation. You write SEVEN fields as ONE coherent shot ..." and the lock sentence reads "the ${gender} faces the viewer with a large clear face, shown from the knees up, the only person in the image."
- JSON skeleton: premise, beat_key, action, scene_description, wardrobe, props, mood (no solo_action, no left_/right_).
- THE PERSON: "a ${gender}${buildHint} (${identity}), alone in the frame. Call the person \"the ${gender}\", never a pronoun, never they, them or their."
- THE SHOT uses `${A.hint.solo}` / `${B.hint.solo}` and `${A.example.solo}`.
- premise: "who this ${gender} is tonight, why the ${gender} is at this exact spot, what is happening; showable with this one person alone in the frame".
- action (10-22 words): "The moment itself, present tense, one person. Open with WHERE (the exact spot) and what the ${gender}'s hands are doing at waist height or lower, standing at ease or seated on something solid, body open to the viewer. A composed, engaged still is welcome (one hand on the railing, a coat over the arm); the set, the costume and the prop carry the story. Only this one person exists in the shot: no waiter, partner, guide, crowd or stranger, named or implied." Same leave-out line.
- scene_description: identical text with "(beside, behind the ${gender}, overhead, along the far wall, at the ${gender}'s feet)".
- wardrobe: the LEFT block addressed to "the character, a ${gender}${buildHint} (${identity})".
- props / mood: identical, "behind the ${gender}".
- Word caps line: premise 12-24, action 10-22, scene_description 55-85, wardrobe 18-28, props 3-12.

**What changed versus today's looks-path brief, field by field**

| Field | Today (richBrief) | Director |
|---|---|---|
| action | "photo caption", register label "candid travel moment ...", six gear register lines, three classic-pool exemplars, a generic stance, "hands may be busy with a scene object", "they do NOT touch" | one rolled archetype + alternate + ONE PASS example; opens with the spot; each person's own beat; contact line toggled by config; gap clause; told that faces/camera are code-owned; 25-45 words |
| premise, beat_key, solo_action | absent | new; premise and beat_key never reach Flux; solo_action feeds the dual-to-solo rebuild |
| scene_description | six things, fg/mg/bg, materials, one or two light sources | "begin with the SPOT named in action, place every element by a preposition relative to the people", one light with a physical path that agrees with the VIBE, the rolled practical light, something overhead or on the far wall, no size words |
| wardrobe | "never plain travel clothes" immediately followed by "clothes they would actually travel in" | "dressed FOR THE PREMISE" + the archetype's wardrobeHint; the ethnic-dress guard kept verbatim in intent on real places without the "travel in" register; goofy rows get "everyday clothes styled well" |
| props | "gives the shot a story" | "explains why they are here", placement, no face-bearing objects |
| mood | 1-3 phrases | 3-4 words that agree with premise, light and costume |
| key ORDER | scene first, action last | premise, beat, action, solo_action, scene, wardrobe, props, mood: Sonnet writes the occasion and the moment first and dresses the set for them |
| forbidden block | "your output will be rejected" | same rules, softer wording, plus objects-with-faces |

---

## 6. Validator rules (verbatim) and the fallback ladder

All rules live in `directorMode.ts` and run in this order on the action (and on solo_action with castCount 1).
`actionSafety.ts` is NOT modified: every regex and cap there stays byte-identical and the posePoolLint parity
test stays green.

### 6.1 Normalize (before any verdict)

- N1 `normalizeActionBeat` (existing: first line, quotes off, whitespace collapsed, 400 chars).
- N2 STRIP template-owned CLAUSES (comma-split; drop the whole clause when it matches):
  `/\b(camera|lens|smil\w*|grin\w*|beam\w*|eye contact|eyes on)\b/i` or
  `/\b(turned|turning|looking|gazing|angled)\s+(toward|towards|to|at|into)\s+the\s+viewer\b/i`.
  If at least one clause was dropped and no remaining clause contains `open to the viewer`, append the canonical
  echo `both bodies open to the viewer` (couple) / `body open to the viewer` (solo). Stamp `director_strip:<n>`.
  (This is why Kevin's two bar beats pass: "both turned toward the camera smiling" and "smiling toward the
  camera" are whole clauses; the framing block already says faces toward the camera.)
- N3 `depronounActionBeat` (existing: he/she/his/her -> the man / the woman / the man's / the woman's).
- N4 Solo de-pluralization on the ACTION only (never on scene_description in bulk): `\bthey\b` -> `the <gender>`,
  `\bthem\b` -> `the <gender>`, `\btheir\b` -> `the <gender>'s`. Stamp `director_solo_depluralized:action`.
  In scene_description for solos, only the locative phrases `/\b(behind|beside|around|above|before|near|in front of)\s+them\b/gi`
  become `... the <gender>` (the "behind them drew a second person" incident), stamped
  `director_solo_depluralized:scene`. "the palms, their fronds" is left alone.
- N5 Collapse `, ,`, double spaces and a trailing comma.

### 6.2 Verdict (first failure wins; the reason becomes `scene_action_fallback:<reason>`)

- V1 `placeholder`: `/[{}]/` (defensive; the brief has no placeholders).
- V2 `head_merge` (couples; NEVER mitigated by a gap clause, because today's MITIGATED set exempts every VIOLATION):
  `/cheek[-\s]to[-\s]cheek|cheeks?\s+touching|foreheads?\s+touching|temple[-\s]to[-\s]temple|heads?\s+(?:together|touching|nearly\s+touching)|faces?\s+(?:touching|together|inches\s+apart)|\bnuzzl|\bnestl|\bhuddl|\bpressed\s+against\s+each\s+other\b|\bwrapped\s+around\s+each\s+other\b/i`
- V3 `contact` (couples, only when `contactAllowed === false`):
  `/\b(the man's|the woman's|the other's|each other's|one another's)\s+(back|waist|shoulders?|arms?|forearms?|hands?|elbows?|hips?|knees?|lap)\b|\barms?\s+(linked|around)\b|\bholding\s+hands\b|\bhand\s+in\s+hand\b|\barm\s+in\s+arm\b/i`
  When `contactAllowed === true` this rule is skipped, but V2 still applies and the gap clause is guaranteed (6.3).
- V4 `negation` (a negated noun lands verbatim in Flux and leaks): `/\b(not|never|no|without|instead of|rather than|nor)\b/i`
- V5 `transfer` (torso rotation toward the partner; the object families are authored so nothing needs to change hands):
  `/\b(hand(?:s|ing|ed)?\s+(?:over|across)|holding\s+out|offer\w*|pass(?:es|ing|ed)?|pour\w*\s+(?:into|for)|slid(?:es|ing)\s+(?:a|the)\b[^,]{0,30}\s+(?:to|toward|across\s+to))\b[^,]{0,40}\b(?:to|toward|towards|for|into)\s+the\s+(?:man|woman|other)\b/i`
- V6 `occluder` (objects that land at face height in a render):
  `/\b(umbrella|parasol|binoculars|telescope|spyglass|phone|smartphone|megaphone|violin|viola|trumpet|saxophone|harmonica|accordion|cigar|cigarette|fan\s+held\s+(?:up|high)|bouquet\s+(?:held|lifted|raised)\s+(?:up|high)|to\s+(?:the|one)\s+ear)\b/i`
- V7 `motion` (both casts): `/\b(spin\w*|twirl\w*|whirl\w*|pirouett\w*|blur\w*|dash(?:es|ing)?|rac(?:e|es|ing)|tumbl(?:e|es|ed|ing)|cartwheel\w*|mid-?stride|striding|running|walking\s+(?:toward|away|along|forward|past|off))\b/i`
  (`tumbler` and `dip a ladle` are deliberately not matched.)
- V8 `plane_break` (couples): `/\b(one|a)\s+step\s+(ahead|behind|closer|back|forward)\b|\bone\s+(seated|sitting|kneel\w*|crouch\w*)\b[^,]{0,60}\b(the\s+other|other)\s+(standing|stands|upright)\b|\bpiggyback|\b(carr(?:y|ies|ying)|lift(?:s|ing)?)\s+the\s+(man|woman|other)\b|\bdip(?:s|ped|ping)?\s+the\s+(man|woman|other)\b|\bback[-\s]to[-\s]back\b|\bkneel\w*|\bcrouch\w*|\bon\s+one\s+knee\b/i`
- V9 `dominance` (the beat lands early on solos): `sceneHook.ts`'s `DOMINANCE_CUE_RE`
  (`/\b(background|fills?|filling|dominant|dominates?|rich|layered|sprawling)\b/i`) plus
  `/\b(in the distance|far below|far away|tiny figures?|full[- ]body|wide[- ]shot|seen from|silhouetted)\b/i`
- V10 `face_object` (both casts, action only; props/scene are guarded separately):
  `/\b(statues?|busts?|mannequins?|dolls?|masks?|portraits?|gargoyles?|totems?|scarecrows?|figurines?|puppets?|sculpted\s+heads?|carved\s+faces?|jack-o-lanterns?)\b/i`
- V11 `solo_company` (castCount 1): the OTHER gender's noun plus company words:
  `/\b(the (?:man|woman) [other gender only]|the other (?:man|woman|person)|partner|waiter|waitress|bartender|barista|sommelier|guide|guests?|crowd|friends?|stranger|dancers?|musicians?|someone|another person|a second (?:man|woman|person|cup|glass|flute|chair)|two (?:glasses|cups|flutes|chairs)|the couple|they|them|their)\b/i`
  (`the other hand` / `the other arm` pass on purpose.)
- V12 the UNCHANGED `validateActionBeat(beat, castCount)` from `actionSafety.ts` (length, unsafe_word,
  too_energetic, direction, pronoun, gaze, passive, too_long, proximity trio).

### 6.3 Gap clause (couples, AFTER a pass, never before)

`ensureGapClause`: if `DUAL_PROXIMITY_MITIGATED` already matches -> `director_gap:present`; else if the passed
beat is 50 words or fewer -> append `, a clear gap between their heads` -> `director_gap:appended`; else leave
it (the composer's gapLine already states the gap) -> `director_gap:composer_only`. Because V2 ran first on the
un-appended text, an appended clause can never launder a head-merge phrase (the hole judge 2 proved: today
`heads together ... a clear gap between their heads` passes).

### 6.4 The fallback ladder (`resolveDirectorAction`)

1. Authored: `slots.action` normalized -> verdict ok -> gap clause -> ships verbatim at the composer's action
   slot. Stamps `scene_action`, `director_beat_used:<key>`.
2. Archetype fallback: verdict failed (or action missing) -> `slots.action = spec.beat.fallback[cast]` (already
   validator-clean by CI, gender-neutral, no place nouns). Stamps `scene_action_fallback:<reason>`,
   `director_fallback:archetype`. The seated flag still matches the anchor because the fallback is chosen by
   posture.
3. Pool pose: only if the archetype fallback itself fails `validateActionBeat` (defensive; CI makes this
   unreachable) -> `slots.action = null` so the composer uses `input.action` (today's pre-rolled pool pose).
   Stamp `director_fallback:pool`.

Never a second Sonnet call for a bad beat. `solo_action` (couples) goes through N1-N5 and V1-V12 with castCount 1;
on failure only that field is dropped (`director_solo_action_fallback:<reason>`) and the rebuild behaves exactly
as today (no beat); on success `director_solo_action`.

### 6.5 Slot-level guards (`normalizeDirectorSlots`)

- `beat_key` echo: equals `spec.beat.key` or `spec.alternate.key` -> `director_beat_used:<key>`; anything else
  -> `director_beat_used:unknown` (the beat is still judged on its own merits).
- props: V10's face-object regex -> props blanked, `director_props_face_object`.
- scene_description: the comma-clause containing a V10 match is removed, `director_scene_face_object`
  (planDualSplit takes the two LARGEST detected faces; a marble bust behind the tea table competes with the cast).
- scene_description: `DOMINANCE_CUE_RE` hit -> `director_scene_dominance` (stamp only; placement after the people
  line is the protection and `buildSceneHook` never promotes such a clause).
- premise: never validated, never assembled.
- `validateSlots` / FORBIDDEN retry still gate scene/wardrobe/mood/props exactly as today (two attempts, subject
  to the deadline rule in 3.9).

---

## 7. Acceptance bar: 12 example beats across 6 places (4 solo, 8 couple)

Every `action` below passes the LIVE validator (verified 2026-09-12). Word counts are inside the brief's caps
(couple 25-45 before the gap clause counts, solo 10-22). Three are shown with full slots so the recipe is visible.

**Place 1: the great glasshouse of a Victorian botanical garden** (real place; Kevin's bar reproduced by the pipeline)

1. COUPLE, `slow_dance` (contact ON, partners), occasion `closing_time`
   - premise: "the last slow dance of the garden party, the band still playing behind the palms, the tea things not yet cleared"
   - action (couple): "mid-step in a slow dance on the mosaic path beside the koi pond, the man's hand at the small of the woman's back, the woman's hand resting on the man's shoulder, both bodies open to the viewer, a clear gap between their heads"
   - solo_action: "on the mosaic path beside the koi pond, one hand on the wrought-iron railing, a coupe held low in the other"
   - scene_description: "on the mosaic-tiled path beside the koi pond with lily pads, inside the vast ribbed iron-and-glass dome, towering palms and tree ferns beside them, hanging baskets of orchids and trailing fuchsias overhead, brass lanterns lit on wrought-iron posts along the path, condensation beading on the panes, banana leaves and monstera pressing against the glass along the far wall, soft light filtering through the panes, and behind them a marble-topped tea table with a tiered stand of pastries and a silver tea service"
   - left_wardrobe: "a deep forest-green velvet jacket over a cream linen shirt, charcoal tailored trousers, a patterned silk pocket square"
   - right_wardrobe: "an emerald satin evening dress with a sweetheart neckline, a jeweled hair comb, pearl drop earrings"
   - props: "the silver tea service on the marble table behind them"
   - mood: "lush, warm, romantic, richly layered"
2. SOLO, `the_view_rail`, occasion `closing_time`
   - premise: "the last guest of the evening, the band packing up behind the palms"
   - action (solo): "standing on the mosaic path beside the koi pond, one hand on the wrought-iron railing, a coupe held low in the other"
   - props: "the silver tea service on the marble table behind the man"

**Place 2: a timber summit hut above the Ngozumpa Glacier at first light** (alpine_mountain; the place that produced "mittened hands on the summit wand")

3. COUPLE, `the_arrival` (no contact), occasion `sunrise_first`
   - premise: "the first two off the dawn cable car, the hut still cold, the glacier turning gold below"
   - action (couple): "just arrived on the summit hut's timber terrace, the man with a wool overcoat over one arm and one boot up on the step, the woman with a weekend bag at the feet and one hand on the rail, a clear gap between their heads"
   - left_wardrobe: "a camel shearling-collared overcoat over a cream cable knit, charcoal wool trousers, a brass-buckled belt"
   - right_wardrobe: "a forest-green wool cape over a black turtleneck dress, knee-high leather boots, gold hoop earrings"
   - props: "two enamel mugs steaming on the rail beside them"
4. SOLO, `the_bench`, occasion `morning_after`
   - premise: "first one up after the summit party, coffee on the sunlit terrace before anyone else stirs"
   - action (solo): "seated on the timber bench along the sunlit terrace wall, one arm along the backrest, an enamel mug on the bench beside"
   - props: "a wool blanket folded on the bench beside the man"

**Place 3: the aft deck of a superyacht at anchor off Capri at blue hour** (elegant / rich_famous row; the "perched on the bow" render)

5. COUPLE, `the_reveal` (no contact), occasion `birthday`
   - premise: "a birthday supper at anchor, the crew gone below, the cake just brought up as the harbour lights come on"
   - action (couple): "seated at the end of the linen-draped aft-deck table, the woman holding a silver cloche lid low to one side, the cake just revealed on the table, the man with one arm along the chair back, a clear gap between their heads"
   - solo_action: "seated at the end of the linen-draped aft-deck table, a cloche lid held low to one side, the cake just revealed"
   - props: "the champagne bucket sweating on its stand beside the rail"
   - mood: "warm, celebratory, glossy, intimate"
6. COUPLE, `dance_step` (motion ON, no contact), occasion `anniversary`
   - premise: "the anniversary song coming over the deck speakers, the first dance step before anyone is ready"
   - action (couple): "mid-step of a dance on the teak aft deck a step apart, the woman's satin hem swept out at knee height and one hand lifted to hip height, the man's palm open low at the side, a clear gap between their heads"
   - props: "two coupes left on the linen-draped table behind them"

**Place 4: a lantern-lit machiya tea house alley in Kyoto at dusk** (real place, urban_city)

7. COUPLE, `the_gift` (no contact), occasion `last_night`
   - premise: "the last evening before the night train, a paper fan bought that afternoon and opened on the tea house step"
   - action (couple): "seated on the tea house veranda step, a lacquer box open on the step between them, the woman holding a folded paper fan low in both hands, the man with one hand resting on the cedar post, a clear gap between their heads"
   - left_wardrobe: "a charcoal wool overcoat over a black roll-neck, tailored trousers, a slim silver watch"
   - right_wardrobe: "a plum silk slip dress under a cream cashmere wrap, jade drop earrings, black heeled sandals"
   - props: "the lacquer box open on the step between them"
8. SOLO, `the_lantern`, occasion `closing_time`
   - premise: "the last guest carrying the house lantern out into the rain-washed alley"
   - action (solo): "stepping off the veranda onto the wet stone alley, a paper lantern held low at hip height, one hand on the post"
   - scene_description: "on the tea house veranda step meeting the wet stone alley, cedar lattice and a noren curtain along the far wall, paper lanterns glowing on the eaves overhead, rain beading on the tiled roofline, a stone basin with a bamboo ladle beside the step, the lantern's glow pooling on the wet stones at the man's feet, a lit shop window across the alley"

**Place 5: Piazza San Marco, Venice at blue hour** (real place, plain-location)

9. COUPLE, `the_spectacle` (no contact), occasion `first_night`
   - premise: "the first night in Venice, the campanile bells catching them mid-piazza as the pigeons lift"
   - action (couple): "standing beside a column of the arcade, pigeons lifting from the wet paving behind them as the campanile bells ring, the woman with one hand lifted to hip height toward the birds, the man with hands in coat pockets, a clear gap between their heads"
   - props: "a brass cafe tray with two spritz glasses on the ledge beside them"
10. SOLO, `the_arrival`, occasion `unexpected_invitation`
    - premise: "just off the water taxi with an invitation for tonight in one pocket"
    - action (solo): "arrived at the top of the arcade steps, coat over one arm, a bag at the feet, one hand on the balustrade"
    - props: "a leather weekend bag on the marble step at the woman's feet"

**Place 6: goofy scenario row "a beachside ice cream shack on a blazing afternoon, a chalkboard reading SORRY NO CHOCOLATE, a seagull eyeing something just off to one side"** (goofy / out_and_about, everyday clothes, daytime)

11. COUPLE, `the_standoff`, occasion `a_bet_won`
    - premise: "the bet was who could finish a cone before it melted; the seagull has other plans"
    - action (couple): "standing at the ice cream shack's counter a step apart, each holding a cone at waist height, the man with one hand on a hip in mock outrage, the woman with a palm out low in mock protest, a clear gap between their heads"
    - left_wardrobe: "a faded coral linen shirt open over a white tee, rolled chinos, canvas sneakers"
    - right_wardrobe: "a striped cotton sundress, a straw tote, white leather sandals"
12. COUPLE, `the_reaction`, occasion `day_off`
    - premise: "a stolen afternoon off; the seagull has just won"
    - action (couple): "seated side by side on the shack's driftwood bench, the seagull on the counter beside them with a stolen cone, the woman mid-laugh with both hands on the bench edge, the man with arms folded in mock defeat, a clear gap between their heads"
    - props: "the chalkboard reading SORRY NO CHOCOLATE behind the counter"

What makes these the bar (checked against the playbook's 8 components): a premise with a reason to be there; the
spot leads the scene and every element is placed by a preposition; costumes chosen for the occasion and paired as a
palette; one prop that explains the occasion at or below waist height; a beat with a verb or a composed engaged
still; both people on one plane; nothing above the shoulders; no face or camera words in the beat; no negations;
the goofy rows keep the seed's gag as the premise instead of adding a second gag.

---

## 8. Tests

### 8.1 Fast jest (all via `@engine/*`; add each new file to `tsconfig.json` `exclude`)

`__tests__/lib/directorBeats.test.ts`
- TABLE LOCK: every `example.solo` and `fallback.solo` passes `validateActionBeat(text, 1)`; every `example.couple`,
  `fallback.couple` passes `validateActionBeat(text, 2)`; every `hint` has no UNSAFE / TOO_ENERGETIC / DIRECTION /
  GAZE / PASSIVE hit and no `\b(not|never|no)\b`; every couple example and fallback carries a MITIGATED phrase; no
  example contains a V10 face-object noun or a V6 occluder; keys unique; `contact` implies cast couple or both;
  `partnerOnly` implies `contact`; solo examples are 22 words or fewer, couple examples 45 or fewer (density lock).
- OBJECT CAP: for each (kind, castCount) the summed weight of `heldObject` rows is at most 35% of the summed weight
  of eligible rows (the "thermos in a velvet jacket" guard).
- posePoolLint parity: every couple string (hint, example, fallback) passes `lintClassicPoseEntry` from
  `scripts/lib/posePoolLint.js` (VIOLATION minus ALLOW, MITIGATED exempt) so the CI lock is the same rule set as
  the POST-SEED HOOK scan.
- `rollDirectorBeat` with a seeded rng: never a `contact` row when `contactAllowed=false`; never a `motion` row
  when `motionAllowed=false`; never a `partnerOnly` row for 'close friends' / 'family'; never a couple-only row for
  castCount 1; `alternate !== primary`, same `seated`, `contact=false`; `onlyRegisters` / `excludeRegisters`
  honored (`the_shoreline` never rolls on `alpine_mountain`; `toast_low` never on `aquatic_underwater`);
  `forceKey` wins over every gate and stamps `director_beat_source:force`; recency drops recent keys unless fewer
  than 3 remain; a 900-roll histogram covers every eligible key and no key exceeds 2.5x its weight-adjusted share;
  goofy kind rolls only goofy + `the_laugh` + `the_bench` + `the_spectacle` + `dance_step` + the goofy-tagged object rows.
- `rollDirectorOccasion`: kinds respected; recency respected; `forceKey` wins.

`__tests__/lib/directorMode.test.ts`
- `decideDirector` branch table, one case per reason, including: mode 'shadow' + looks off -> shadow; mode 'on' +
  looks off -> looks_off; `forceDirector` still respects every never-rule; location couple held unless
  `allowLocationCouples`.
- `relationshipLabel`: partner/spouse/wife/fiance -> partners; friend -> close friends; sister/mom -> family; garbage
  and injection text -> 'two people who came here together' (sanitized first).
- `normalizeDirectorBeat`: Kevin's exact ACTION_COUPLE string from `scripts/qa-nightly-looks-matrix.js` ->
  stripped + depronouned -> passes V1-V12 at castCount 2 and equals the expected text; Kevin's ACTION_SOLO ->
  passes at castCount 1; "both smiling at each other over the tray" -> the whole clause is dropped (no "at each
  other" remnant); "both facing the camera" dropped; the canonical "bodies open to the viewer" echo is added
  exactly once; idempotent on a clean beat; solo they/them/their -> role nouns; scene locative "behind them" ->
  "behind the man" while "their fronds" is untouched.
- `validateDirectorBeat`: one PASS and one FAIL case per rule V1-V11 (head_merge with a gap clause present still
  fails; `arms around each other, a clear gap between their heads` fails head_merge; `the man's hand at the small
  of the woman's back` fails `contact` when contact is off and passes when on; `not an embrace` fails negation;
  `holding out a shell to the woman` fails transfer; `a whisky tumbler held low` passes motion; `dipping a ladle`
  passes plane_break; `tumbling` fails motion; `on one knee` fails plane_break for couples; `a marble bust` fails
  face_object; solo `the woman` on a man's render fails solo_company while `the other hand` passes).
- `ensureGapClause`: appended only after a pass and only at 50 words or fewer; `present` when a MITIGATED phrase
  exists; `composer_only` at 51+ words.
- `resolveDirectorAction` ladder: authored pass -> action verbatim + `scene_action`; fail -> archetype fallback +
  `scene_action_fallback:<reason>` + `director_fallback:archetype`; missing -> same with `missing`; the fallback
  text is chosen by the archetype's `seated` flag.
- `normalizeDirectorSlots`: beat_key primary / alternate / unknown; props face-object blanked; scene face-object
  clause removed and the rest intact; dominance stamp.
- `scrubForbiddenClauses`: drops only matching comma-clauses; reports `stillViolating`.
- `assertDirectorHonesty`: `[]` when the couple prompt carries `slots.action`; `beat_missing` otherwise;
  `rebuilt=true` checks `solo_action` and ignores `action`; null beats never alarm.

`__tests__/lib/directorBrief.test.ts`
- Couple brief: JSON keys in `DIRECTOR_JSON_KEYS_COUPLE` order; contains THE SHOT hint, the alternate hint, the
  archetype's couple example, the occasion text, the practical light, the relationship label, the register; contact
  line toggles with `contactAllowed`; ethnic-dress guard present iff `realWorld`; `wardrobeAnchor` quoted when
  present; contains none of "candid travel moment", "Things people do HERE", "Style examples", "travel in",
  "NON-NEGOTIABLE", "AUTHORITY", "OVERRIDES", "will be rejected"; the word-caps line is the last instruction
  before "Output ONLY".
- Solo brief: no solo_action / left_ / right_ keys; uses the solo hint and solo example; carries the no-other-person
  line; says "the man" / "the woman" by gender.
- Goofy deltas: "everyday outfit styled well" present and "dressed FOR THE PREMISE" absent; register line names the
  gag as the premise.
- Same-gender couple: names line says "one" and "the other".

`__tests__/lib/sceneFirstAction.test.ts` (extend)
- GOLDEN LOCK holds with `authorAction` unset AND with `authorAction.director` undefined/null (`buildSlotBrief` +
  `assembleCharacterPrompt` byte-identical to `__tests__/fixtures/slot-golden.json`).
- Pipeline (callSonnet mocked): a director JSON response -> `scene_action`, `director_beat_used:<key>`,
  `director_solo_action`; a failing action -> archetype fallback text in the assembled prompt, exactly one
  Sonnet call; `maxTokens` 1200 with director and 900 otherwise; `premise` never appears in `assembledPrompt`;
  `slot_call_ms:` stamped; with `retryDeadlineMs` in the past a FORBIDDEN violation on attempt 1 -> scrub, no second
  call, `director_retry_skipped:deadline`.
- `assembleSoloFallbackFromDual` uses `dualSlots.solo_action` when present and pins three_quarter; without it the
  output is byte-identical to today.

`__tests__/lib/castActionResolver.test.ts` (extend): director branch returns `authorAction` with empty
exemplars, null stance, null registerActions and the spec; `dualStance.seated` from the beat; stamps include the
spec stamps + `scene_action_roll` and NOT `dual_stance:*` / `action_register:*`; the pool `action` equals the
non-director result for the same inputs.

`__tests__/lib/nightlyQaFlags.test.ts` (extend): the four flags' coercions.

`__tests__/lib/engineConfig.test.ts` (extend or add): the five fields' defaults and garbage handling (arrays ->
`[]`, mode -> 'off', recency clamped 0..7).

`__tests__/lib/directorMonitor.test.ts` (Slice 4): the check never alarms when `nightly_director_mode` is
'off' or 'shadow' or when n < minSample; thresholds derive from config (a hardcoded number fails the test);
alarms on a synthetic 40% `director_fallback:archetype` share with mode 'on'.

`scripts/scan-dual-faceswap-proximity.js`: add `directorBeats.ts` to `SCAN_ALL_LINES` (with the COMMENT /
BAN_LIST / MITIGATED exemptions the brief builder already gets), because the pool-file mode only lints lines that
START with a quote and object-literal fields would be skipped. Must exit 0 (recorded in the ledger).

### 8.2 QA render protocol (Kevin's account, private Dreams album, in-app review)

Script: `scripts/qa-nightly-looks-path.js` gains `--director` (sends `force_looks_path` + `force_director`),
`--beat=<key>`, `--occasion=<key>`, `--contact` (`force_director_contact`), `--scenario=elegant|goofy`
(`force_elegant` / `force_playful`), `--location` (`force_plain_location`). Renders stay serial and
`waitForHeadroom(min 25)`-gated, never on the :00 or ~08:00 UTC windows. Caption:
`✨ DIRECTOR <surface> #n [<beat> · <occasion> · <model> · <look> · <vibe>]`.

Per-render checks added to the report and HTML: `director:rolled|forced`, `director_beat` vs
`director_beat_used`, `director_occasion`, premise, shipped action (`rolled_axes.director.action`), `solo_action`,
`scene_action` vs `scene_action_fallback:<reason>`, `director_fallback:*`, `director_strip`, `director_gap`,
`slot_call_ms`, `dual_degrade_single` / `no_dual_split:*` / identity stamps / quality-gate stamps, honesty
violations. Batch footer: beat-key histogram, occasion histogram, leading-verb histogram (2 or fewer per verb per
20 renders), prop-noun histogram (lantern, coupe, flute, hem, sash, bucket, cloche: 3 or fewer each per 20),
object-held rate (share of shipped beats matching `/\b(holding|held|lifting|lifted)\b/`, target 35% or lower),
alternate-usage rate, fallback rate, median `slot_call_ms`.

Rounds and what "done" means:

| Round | Renders | Pass criteria |
|---|---|---|
| R0 tonight | 3 solo + 3 couple, natural places, `--director`; one couple `--beat=slow_dance --contact` on a non-1.1-pro model | every render carries `director:forced` + `director_beat_used`; at least 5/6 ship an authored beat; no `director_violation`; Kevin sees six frames with a premise he can read in two seconds |
| R1 solos | 8 solos `--director` (mix of `--location` and `--scenario=elegant`), plus 4 `--scenario=goofy` | authored-beat rate 85% or higher; zero `solo_multi_face` / `pure_scene_fallback` above the previous looks-path batch; identity 0.50 or higher; at least 5 distinct archetypes; no leading verb more than twice; five DP lenses pass in the app (set, costume, light, integration, composition) |
| R2 couples, no contact, no motion | 10 director couples on scenario rows vs 10 same-evening looks-path control couples | `dual_degrade_single` and `no_dual_split` shares at or below control; min identity_sim median not lower; authored-beat rate 80% or higher; degrade tallied PER `director_beat_used` so a single archetype can be parked |
| R3 motion + contact | 10 couples `--contact` with `director_motion_models` set to grok / gemini / flex vs R2 | same criteria on those models only; if it passes, set `director_contact_models` and `director_motion_models` to those models |
| R4 location couples | 10 `--location` couples vs 10 Option B controls | same criteria; if it passes, `director_location_couples=true` (the held `scene_action_location_couples` stays false) |
| R5 per-archetype sweep | `--beat=<key>` x 3 couples per archetype on the dominant couple model | park (set weight 0, never delete) any archetype whose degrade rate exceeds control |

Cap three fix rounds per problem; a fix goes to the table or the brief, never to the `actionSafety.ts` regexes.
Grade forensics first, then view; hearts are pointers not ratings; Claude's grades skew harsh (floor 3/5 for a
beautiful frame).

---

## 9. Rollout with flags and rollback

| Phase | Config | Exposure | Rollback |
|---|---|---|---|
| 0 Land dark | code deployed, no migration needed (defaults) | zero (QA via `force_director` only) | n/a |
| 1 Migration 511 | all five columns at defaults (off / {} / {} / false / 5) | zero | n/a |
| 2 Shadow | `nightly_director_mode='shadow'` for 2 nights (works under any looks mode) | zero; `director_shadow:<beat>:<occasion>` on every eligible cast render; verify `director:no_beat` is 0 and the family histogram is flat | set 'off' |
| 3 Go live as a bundle | `nightly_director_mode='on'` AND `nightly_looks_mode='on'` the same evening (the looks path without director is exactly the night Kevin does not want); contact / motion allowlists empty; location couples false | solos + scenario couples get director beats; location couples keep Option B; 1.1-pro couples get tableau families | `nightly_director_mode='off'` (looks stays on, beats revert to scene-first) or `nightly_looks_mode='off'` (everything back to legacy). One row, no deploy |
| 4 Motion + contact | `director_motion_models` / `director_contact_models` = the models that passed R3 | slow_dance and dance_step reach couples on those models | set the arrays to '{}' |
| 5 Location couples | `director_location_couples=true` after R4 | the highest-value surface enters the director | set false |
| 6 Soak | a week of natural nights; `/mine-posts` by `director_beat_used`; reweight or park archetypes | | |

Day-after checks on every phase: `node scripts/check-forensics.js`, the director block of the ai-failure monitor,
`director_*` / `scene_action_fallback` / `dual_degrade_single` shares over natural rows (exclude `qa:*` rows).

Deploy hygiene: `supabase functions deploy nightly-dreams --no-verify-jwt` immediately after editing; verify a QA
render carries `director:` stamps; delete + redeploy if a stale isolate serves the old brief. Commit by explicit
paths; every new import's target (`directorBeats.ts`, `directorMode.ts`, `directorBrief.ts`) staged in the same
commit as `characterSlotPrompt.ts` (the split-dependency trap).

---

## 10. Build order with hours

| Slice | Content | Hours |
|---|---|---|
| **0 TONIGHT: six renders for Kevin** | `directorBeats.ts` (18 rows, occasions, lights, rolls) 1.5h; `directorMode.ts` (decide, spec, normalize N1-N5, validate V1-V12, gap, ladder, slot guards, honesty) 2h; `directorBrief.ts` 1h; `characterSlotPrompt.ts` hooks (brief branch, parse, pipeline hook, max tokens, rebuild solo_action; deadline scrub can wait) 1h; resolver branch + QA flags + engineConfig parse with defaults 0.5h; `index.ts` seams 1h; minimum tests so pre-commit passes (table lock + normalizer + golden lock) 1h; `qa-nightly-looks-path.js --director` + deploy + R0 six renders 1h | **9h** |
| 1 Hardening | remaining tests (8.1), deadline scrub + `slot_call_ms`, `scan-dual-faceswap-proximity.js` coverage, `npm run check` green, engineConfig test | 6h |
| 2 Solo QA | R1 (12 renders, headroom-gated, serial), up to 3 fix rounds on the table/brief | 6h |
| 3 Couples | migration 511 + R2 (20 renders), per-archetype tally, R3 (10), R4 (10), R5 sweep as needed | 10h |
| 4 Ops | `scripts/lib/directorMonitor.js` + test + workflow block; `NIGHTLY_DIRECTOR_PLAN.md` ledger; playbook lesson; CLAUDE.md line; memory note (the crop memory is stale: the live Fly engine is a two-largest-faces split + per-face masked composite, and hand/waist contact with heads apart is swap-safe while head merge is the breaker) | 4h |
| 5 Go-live + soak | shadow 2 nights, bundle flip, day-after forensics, first-week tuning | 5h |
| | **Total** | **40h** |

Tonight's slice is the whole story loop end to end (roll, brief, normalize, validate, ladder, stamps, rebuild
twin), with the config surfaces defaulting off and QA driving it through `force_director`. What waits: the
deadline scrub, the monitor, the migration, and the A/Bs.

---

## 11. Judge "would_break" resolution ledger

| Judge break | Resolved by |
|---|---|
| SD-J1 week 2 collapses to "nice couple at a set table" | body families 9.6 vs object 3.4 weight; `heldObject` CI cap 35%; object-held rate + prop-noun histogram in QA; `the_view_rail`, `the_spectacle`, `the_arrival`, `the_laugh` are hands-free by construction |
| SD-J1 too_long spike (examples 43-51 words vs brief 20-40) | brief 25-45, examples locked at 45 or fewer (couple) and 22 or fewer (solo) by CI; gap clause appended only at 50 words or fewer; solo hard cap 24 in the brief |
| SD-J1 goofy rows get the_table | goofy rows roll only goofy families + the hands-free body families; the seed's gag is the premise ("the shot is the reaction") |
| SD-J1 the_craft head-down | not in the table (section 4.1 "deliberately absent") |
| SD-J1 the_ride on 1.1-pro | not in the table; R2 tallies degrade per `director_beat_used` |
| SD-J1 everything is evening | occasion seeds include sunrise, morning after, day off; daytime families; the brief ties the occasion to the VIBE's hour |
| SD-J2 blanket gap-append launders head merges | V2 HEAD_MERGE never mitigable; gap appended only AFTER a pass (6.3); verified today's validator has the hole |
| SD-J2 early "mid-step in a slow dance" anchor | no story text in the early window in v1; anchor is posture-only via `dualStance.seated`; frame hint is a v2 knob behind a per-model A/B |
| SD-J2 the_game / the_craft / the_reveal solos head bowed | first two absent; the_reveal reworded to "already made, lid held low to one side" |
| SD-J2 SET DRESSER writes a marble bust | face-object clause removal on scene_description + props blanking + the forbidden block names objects with faces |
| SD-J2 9-field response + FORBIDDEN retry + 529 blows the budget | `DIRECTOR_RETRY_BUDGET_MS` 30 s derived from the render budgets; scrub instead of retry; `slot_call_ms` stamped; premise never validated |
| SD-J2 honesty false-positives on every degrade | `assertDirectorHonesty(..., { rebuilt })` checks solo_action on rebuilds; no frame check |
| SD-J2 proximity scan skips object-literal fields | `directorBeats.ts` in `SCAN_ALL_LINES` + the jest posePoolLint parity lock |
| SD-J2 solo plural guard corrupts "their fronds" | N4 de-pluralizes the ACTION only; scene gets locative-only rewrites |
| SD-J2 "both facing the camera" not stripped | N2 strips whole clauses containing camera / lens / smil / grin / beam / eye contact / eyes on and the "toward the viewer" family |
| SL-J1 night-3 repeat for a single-place solo user | 18 archetypes x 18 occasions with independent per-user recency (window 5) and the Sonnet instantiation on top |
| SL-J1 placeholder miss invents a railing on a sandbar | no placeholders; fallbacks say "something solid in the scene" |
| SL-J1 waist-height object in both hands on 1.1-pro | object families capped and weighted low; tableau families dominate on 1.1-pro |
| SL-J1 two gags in one goofy frame | goofy families are reactions to the seed's gag |
| SL-J1 solo 30+ words | brief 10-22, hard 24, examples 22 or fewer |
| SL-J1 looks + director flip together while location couples stay on Option B | accepted deliberately (Kevin's fail-forward posture); R2-R4 run on Kevin's account in one session each (10 couples take one evening, not weeks) |
| SL-J2 dressed_table crops at the tabletop | "at the END of the table, the table to one side" in `the_reveal`, `the_feast`, `the_picnic`; `the_bench` says "nothing in front of them" |
| SL-J2 pour / lantern-lighting downward gaze | absent; `the_lantern` is "already lit, held low" |
| SL-J2 same-gender fallback says "the man" | fallback texts use "both" / "one ... the other"; brief names line switches to "one" and "the other" |
| SL-J2 lint rejects "the other hand" | V11 matches only `the other (man|woman|person)` |
| SL-J2 tumbler / dipping false positives | V7 and V8 regexes use explicit verb forms (`tumbl(e|es|ed|ing)`, `dip... the (man|woman|other)`) |
| SL-J2 shadow never runs under looks shadow | `decideDirector` returns shadow for mode 'shadow' regardless of looks mode |
| SL-J2 force_beat on a real user | `force_*` flags are body fields only QA scripts send; `nightly-dreams.js` never sets them |
| TS-J1 lantern / sash / polka-dot compounding | practical light rolled in code; `the_lantern` weight 0.5; prop-noun histogram in QA; one example per archetype, at a different place |
| TS-J1 summit still gets "tea after the climb" | occasion axis rolled in code |
| TS-J1 transfer verbs rotate the torso | V5 transfer reject; object families authored so nothing changes hands |
| TS-J1 couples lose the lower-body cue under a tight cap | cap raised to 45; hints name the lower-body cue (a boot on a step, a skirt spread, boots crossed) |
| TS-J1 static costume example anchors velvet dinner jackets on glaciers | no static costume list in the brief; `wardrobeHint` per archetype; the only outfit example is inside the slow_dance example |
| TS-J1 truncation to fallbackSlots | 1200 tokens; caps last; premise short |
| TS-J1 all three beats banned + re-pitch at the deadline | one beat, no re-pitch; archetype fallback keeps the story |
| TS-J2 contact by default | contact families roll only on `director_contact_models` (default empty); V3 rejects contact phrasing when contact is off |
| TS-J2 "not an embrace" negation leak | V4 negation reject |
| TS-J2 "smiling at each other" remnant | N2 drops the whole clause |
| TS-J2 derived solo beat names the partner | solo_action is Sonnet-authored only, validated with V11 (other-gender noun); never derived |
| TS-J2 Sonnet-authored spot with a bust | no separate spot field; the spot lives inside action (V10) and scene (clause removal) |
| TS-J2 deadline / 529 ladder | 3.9; AbortSignal in `llm.ts` as a v2 follow-up |
| TS-J2 kneeling / the_arrival in a doorway | kneel/crouch rejected for couples (V8); the_arrival hint says "out in the open on a terrace, a step or a deck" |
| TS-J2 recordPick before the render completes | recency reads `rolled_axes.director.beat` from persisted rows only |
| TS-J2 comma-packed stamps | one fact per stamp (3.8) |
| TS-J2 Option B paid before the director decides | the director decision sits in the `decideSceneFirst` block, before the Option B call |

---

## 12. Open decisions for Kevin

1. **Contact on couples.** Ship v1 with contact OFF everywhere (default), then turn it on per model only after R3
   passes on stamps (recommended). Or accept the single glasshouse sample as proof and set
   `director_contact_models` to grok / gemini / flex on night one so the slow dance reaches your first natural
   night on those models.
2. **1.1-pro couples.** With motion and contact off, 1.1-pro couples get tableau families (rail, arrival, bench,
   spectacle, laugh, reveal, gift, toast). If you would rather every couple be eligible for the dance, the lever is
   model policy (weight couples toward grok / gemini on the looks path), not the brief.
3. **Location couples.** Keep them on Option B until R4 passes (recommended), or flip `director_location_couples`
   on night one because the "face-swap portrait PHOTO from the WAIST UP" caption is the register you dislike most.
4. **Shot list ownership.** Code table with a CI lock (v1) versus a `story_beats` DB table with dashboard weights
   (the actionPoseLoader pattern). Recommended: code for the first month, then migrate the table to DB if you find
   yourself wanting to reweight from the dashboard.
5. **Real-place wardrobe register.** "Dressed for the premise" will put velvet and satin at a glacier hut when the
   occasion is an evening. Is that the dream (recommended: yes, the premise decides), or should real-world places
   keep a "stylish visitor" ceiling?
6. **The gear registers.** Leave `actionRegisters.ts` as the non-looks fallback vocabulary (v1) or rewrite the 57
   registers to beat families later so the legacy path improves too.
7. **Object share.** The CI cap is 35% of weight for held-object families. Lower (25%) reads as more cinema and
   less "holding a drink at my place"; higher reads as more props-with-story. Default 35%.
8. **Recency window.** 5 nights (default) over both beat and occasion; raising it past 7 needs the `recentLogs`
   query widened.
9. **Go-live bundle.** Flip `nightly_director_mode='on'` and `nightly_looks_mode='on'` the same evening (recommended
   per the looks plan), on a night you can review the next morning.
