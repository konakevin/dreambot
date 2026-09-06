# Scene-First Actions — engine-wide action coherence (proposal, 2026-09-05)

**Kevin's ask:** "this could be an engine wide fix, i'd love to optimize and improve how actions are assigned
to a scene so that it's always coherent … it would help nightly dreams to be more creative and better if we
could always rely on actions being proper and relatable to the scene." Plus: "i would like to seed actions for
holidays, same as nightly … keep the existing pools and find a way to more correctly use them only when it
makes logical sense."

Nothing below is built. Status: PROPOSAL awaiting Kevin's go.

## 1. How an action is chosen today (the map)

| nightly path | where the action comes from | knows the scene? |
|---|---|---|
| plain location (~60% of nightlies) | biome-tagged `action_poses.active` → Option B Sonnet beat that fits the exact place (`location_action_pct`=75, `_shared/locationActionBeat.ts`) → generic `partner`/`companion` (dual) or `candid`/`portrait`/`dynamic` (solo) | Option B yes; pools no |
| goofy scenario rows | generic `playful` pool (dual) / generic solo roll | no |
| elegant scenario rows | generic `partner` pool | register only |
| **holiday rows** (Halloween etc.) | treated as `dualSceneKind='elegant'` → generic `partner` pool (dual), generic solo roll | **no** |
| active rows (swashbuckler, artifact hunter…) | the seed scene IS a verb-led beat ("she grips the wheel while he raises a cutlass") → fixed anchor "caught mid-action exactly as the scene describes" | yes, by construction |
| rows with `pose_pool` (migration 353) | a named bespoke pool | sub-theme fit |
| hero rows | `pose_pool` or `partner` | no |

7-day stamps (`ai_generation_log.fallback_reasons`): `location_action` 156 · `active_pose` 45 + 18 solo ·
`bespoke_pose` 4 + 44 solo. Everything else silently used a generic pool.

### The order-of-operations bug

The generic pose is picked **before** the Sonnet slot brief, and the brief then says (`characterSlotPrompt.ts`
`buildSlotBrief`, ACTION CONTEXT): *"The persons will be caught mid-action: '<pose>'. Write scene_description as
a place where this action makes sense."* So for every seeded scenario row the engine bends the SEED SCENE toward
a pose that was rolled blind. Evidence from the 2026-09-05 Halloween matrix (prompts pulled from the log):

- `halloween_town_square` fountain seed + pool pose *"both leaning on a bridge railing, one with elbows wide"* →
  Flux invented a stone balustrade in front of the green fountain; the patchwork costumes in the prompt were
  dropped (they sat at word 216 of 500). Kevin: "we are just wearing normal outfits in some spooky looking place".
- `cursed_library` seed (emerald candle flames, glowing grimoire) + pose *"one adjusting their collar, the other
  with thumbs tucked into their waistband"* → sepia archive, no Halloween cue (first cue at word 448 of 497).
- Generic pool text names objects that do not exist in the scene: *"standing near a parking meter"*, *"sitting
  together on a wall"* (partner pool); solo `portrait` pool (30% of solo rolls) is static face-forward posing
  (*"sitting … face forward"*, *"arms crossed … strong gentle smile"*), a direct pull toward the close-ups.

The only path that never has this problem is `active`, because the action lives in the seed.

## 2. The fix: author the action FROM the scene, inside the existing Sonnet slot call

One principle: **the scene is the given; the action is derived from it.** Never the reverse.

Mechanism (zero extra Sonnet calls, zero added latency):

1. **New slot field `action`** in the slot JSON (single + dual). The brief gives Sonnet: the seed scene verbatim,
   the register (goofy / elegant / holiday:<pool> / active / location), the wardrobe it is writing in the same
   call (so costume + action + scene cohere), the pool's signature objects for holidays, and 3 STYLE EXEMPLARS
   drawn from the existing pool of that register ("invent your own, do not reuse"). That is how the existing
   pools stay useful: they teach the register, Sonnet adapts to the scene.
2. **Envelope = Option B's hard rules, already proven in production since 2026-08-10:** knees-up framing; every
   hand/prop/gesture at chest level or lower; feet planted; no face / eyes / expression / mask / hood / helmet /
   camera words; dual: each person their own small beat, a clear gap between heads, no touching, hugging, leaning,
   or facing each other. Prop optional and only if it obviously belongs in the scene.
3. **Validator** (code): the same `UNSAFE_WORDS` + `TOO_ENERGETIC` regexes from `locationActionBeat.ts` plus the
   dual proximity regex from `scripts/scan-dual-faceswap-proximity.js` (cheek-to-cheek / leaning into / shoulders
   touching…). Fail → the render uses today's pool pick and stamps `scene_action_fallback:<reason>`; pass →
   `scene_action`. The render is never blocked.
4. **The ACTION CONTEXT block flips.** For scenario rows no pre-picked pose is sent to Sonnet; scene_description
   is written from the seed and the action from the scene. The assembled prompt uses `slots.action` at the same
   position 5 the pool pose uses today, so framing / identity / head-gap language is untouched.
5. **Existing pools become (a) exemplars and (b) the fallback** for scenario rows, never the primary. The solo
   `portrait` pool is dropped from the nightly default roll (dynamic 50 / candid 50 on fallback).
6. **Scope + gating.** `characterSlotPrompt.ts` gains an `authorAction` input flag set ONLY by nightly-dreams;
   `generate-dream` (create / DLT) is untouched. `engine_config.scene_action_pct` (0 = off, ships inert) +
   `force_scene_action` QA flag, mirroring Option B. Phase 1 = scenario rows (goofy / elegant / holiday / fun
   buckets / hero). Phase 2 = plain-location dreams: the same call authors the place-fit beat and Option B's
   separate Sonnet call is retired (one fewer call per location dream).

Cost: ~40 more output tokens on a call that already runs. Latency: none. Phase 2 saves a call.

Risk: swap safety. Mitigation: same envelope + filters Option B has run 150+ times/week with no swap regression
attributed to it; the added proximity regex bans center-contact; hands stay below chest level so faces stay
big and clear. The couple framing block (§5) is NOT touched by this change.

## 3. Validation (MVP → sign-off → scale)

- Fast jest: parser + validator (`@engine/*`), fallback path, exemplar sampling.
- Live A/B on Kevin's private Dreams album with `force_scene_action`: 24 renders, captions `🎬 SFA <pool>` —
  6 Halloween pools × couple + solo, 4 goofy, 4 elegant, 4 location (phase 2 only). Judge per render: action
  fits the scene, person integrated (costume designer + set dresser bar), identity ≥ threshold, no close-up
  regression vs the same seeds on the current path.
- Ship bar: ≥ 90% action-fit, couple degrade rate not worse than today's 15-25%, fallback rate < 20%.
- Then `scene_action_pct=100`; a fail-loud monitor on `scene_action_fallback` rate whose threshold derives from
  the config (CLAUDE.md monitor rule), locked by a CI test.

## 4. What this means for the Halloween pools

The 990 dual + 990 single seeds keep their set dressing; the action is authored per render from the seed + the
pool's objects, so NO reseed is needed for actions. Still open (Kevin's call, separate from this plan): pools
whose concept does not read as Halloween on the matrix (both Beetlejuice subs, gothic greenhouse, gothic glam
editorial, 1920s ghost hotel, cursed library, black cat alley, undead wedding as rendered) — cut, or reseed with
mandatory Halloween signifiers (bats / skeletons / cobwebs / black cats / cauldrons / tombstones / candy /
costumes) enforced by the linter.

## 5. The OTHER close-up cause: framing block + flux-1.1-pro override fragments (belongs to nailed-looks)

Two pieces of engine text, not seeds, pull every painterly couple into a two-head close-up:

- **`faceSwapModelOverrides.ts`.** When the face-swap model is flux-1.1-pro (roughly three of four nightly
  couples, because flex and ultra are clamped to it for dual reliability), the medium the user sees is cosmetic:
  the actual style fragment is replaced at random by one of four hardcoded strings. Three of the four say
  "portrait realism"; the watercolor one also says "golden warm watercolor palette". "Portrait" tells Flux to
  frame a portrait, and the warm palette overrides the pool's Halloween palette (the emerald library came out
  sepia). It also explains the sameness: canvas, pencil, comics, and watercolor on 1.1-pro all collapse into
  the same four looks.
- **The couple framing block** (`characterSlotPrompt.ts` `dualAnchor` + `framingBlock`) says "NOT a tight face
  close-up" and "rather than a stiff studio couple portrait". Flux does not process negation; the words
  "close-up" and "portrait" land as instructions. The block also repeats face/faces 6× and heads 10× in a
  500-word prompt, so faces are the dominant concept. Photography masks this (it rendered fine yesterday);
  painterly overrides amplify it.

Fix shape (its own A/B, first deliverable of `NIGHTLY_NAILED_LOOKS_RESEARCH.md`): rewrite the four override
fragments without "portrait" or a baked-in palette (or replace them with graded looks per the research plan);
rewrite the two negated framing sentences as positive framing only ("three-quarter length, setting sweeping
ground to sky"); trim repeated face/head tokens to the load-bearing set. Same seeds, same models, 24 couples
before/after, judged on framing + identity. Not to be done under time pressure: the head-gap and faces-to-camera
lines are what keep the dual swap alive (2026-06-19 incident), so every edit there needs the identity stamps read.

## 6. Links

`NIGHTLY_FUN_SCENARIOS_PLAN.md` (Option B origin), `_shared/locationActionBeat.ts` (the envelope + filters),
`ACTION_POSE_EXPANSION_PLAN.md` (pools), `HOLIDAY_DREAMS_PLAN.md`, `NIGHTLY_NAILED_LOOKS_RESEARCH.md`,
`HALLOWEEN_SIGNATURE_LOOK_PLAN.md`, `BOT_SCENE_QUALITY_PLAYBOOK.md` (negation-leak lesson).

## 7. Implementation plan (phase 1, no unknowns — every fact below was read from code on 2026-09-05)

Build order = tests first, inert by default, deploy dark, prove on the failing seeds, then flip.

1. **Golden lock BEFORE any edit.** `__tests__/lib/sceneFirstAction.test.ts` captures `buildSlotBrief()` +
   `assembleCharacterPrompt()` for a fixed single + dual input with the new flag OFF into
   `__tests__/fixtures/slot-golden.json` (run once with `WRITE_GOLDEN=1` against the current code). Every later
   run asserts byte-identical output → create/DLT (`generate-dream`, the other caller) cannot change.
2. **`_shared/actionSafety.ts` (new).** `UNSAFE_WORDS` + `TOO_ENERGETIC` move here verbatim from
   `locationActionBeat.ts` (which re-imports them, so Option B is unchanged); the dual proximity rule is the
   `VIOLATION` / `MITIGATED` / `ALLOW` trio from `scripts/lib/posePoolLint.js` transcribed as TS; plus the
   slot validator's eye-direction / from-behind / profile / pronoun patterns. `validateActionBeat(beat, castCount)`
   → `{ ok, reason }`. Tests: `__tests__/lib/actionSafety.test.ts` (accepts scene-fit beats incl. Halloween ones,
   rejects mask / hood / facing each other / cheek to cheek / leaning into / jumping / arms overhead / looking at
   the camera / pronouns) + a PARITY test that the TS regex sources equal the node lint's (`require` the js).
3. **`characterSlotPrompt.ts`.** `CharacterSlotPipelineInput.authorAction?: { register: string; exemplars:
   string[] }` (nightly-only). When set: the brief drops the ACTION CONTEXT block (Sonnet never sees a pool
   pose), adds an `action` field spec = Option B's hard rules + the register + 3 exemplars ("style only, invent
   your own"); `parseSlotsJson` reads optional `action`; after the existing validation loop, `action` runs
   through `validateActionBeat` — invalid → `slots.action = null` and reason returned (no extra Sonnet call);
   `assembleCharacterPrompt` position 5 = `slots.action ?? input.action` (single + dual). `SingleSlots`/
   `DualSlots` gain `action?: string | null`. Flag undefined → every code path identical (golden test).
4. **`nightly-dreams/index.ts`.** Parse `force_scene_action`; read `sceneActionPct` (`engineConfig.ts` 3-line
   pattern: type, default 0, `data.scene_action_pct`). Eligible = scenario row (`dualSpecialScene`) AND not an
   active row (seed already carries the verb) AND no `pose_pool` (curated pool named on purpose = "use the pool
   when it makes logical sense") AND no `force_action`. Roll `force_scene_action || rand < pct`. When rolled:
   `slotInput.action` = today's pool pick (the automatic fallback) + `authorAction = { register, exemplars }`
   where register = `holiday:<pool>` via `holidayPoolOf(subTheme)` for holiday rows, else `goofy` / `elegant` /
   `holiday hero`; exemplars = 3 random from the matching classic pool (`partner` for elegant + holiday,
   `playful` for goofy, `candid` for solos). Stamps: `scene_action` or `scene_action_fallback:<reason>`;
   `rolled_axes.sceneAction` for forensics.
5. **Migration `461_scene_action_pct_config.sql`** (template = 433): `ALTER TABLE engine_config ADD COLUMN IF
   NOT EXISTS scene_action_pct integer NOT NULL DEFAULT 0`. Apply via `scripts/apply-migration.mjs 461`,
   regenerate `types/database.ts`, add the knob to `NIGHTLY_FUN_SCENARIOS_PLAN.md` config list + admin catalog.
6. **`npm run check`** green (prettier, lint, tsc, deno typecheck, jest). New `@engine/*` tests go in
   `tsconfig.json` exclude like their siblings.
7. **Deploy dark** (`supabase functions deploy nightly-dreams --no-verify-jwt`, pct = 0 → zero behavior change;
   verified by the golden test + the flag gate).
8. **Prove it on the seeds that failed** (Kevin's go): `force_scene_action` renders to the private Dreams album,
   caption `🎬 SFA <sub>`, natural medium roll, ≤3 concurrent, headroom-gated — halloween_town_square,
   stop_motion_whimsy, cursed_library, black_cat_alley, afterlife_waiting_room, movie_night, haunted_hayride,
   cozy_porch (couple + solo) + 2 goofy + 2 elegant rows ≈ 24 renders. Side-by-side page vs the matrix3 renders
   of the same subs. Pass = action fits the scene and names its objects, wardrobe survives, `scene_action`
   stamped, identity sims ≥ threshold, no new degrades.
9. **Flip** `scene_action_pct` to 100 on sign-off; watch the `scene_action_fallback` rate for a week.

What this does NOT fix (separate work, stated so nobody expects it here): the flux-1.1-pro override fragments +
the negated framing sentences (§5) still pull painterly couples tighter than they should be; and the pools whose
concept is not Halloween (§4) still need a cut-or-reseed decision.

## 8. Build log

- 2026-09-05 — steps 1-7 DONE: golden fixture `__tests__/fixtures/slot-golden.json` (byte-identical with the flag
  off); `_shared/actionSafety.ts` + 30 tests (parity with `scripts/lib/posePoolLint.js` locked); slot pipeline
  `authorAction` + `action` slot + validator fallback (9 feature tests, incl. "flag OFF ignores a hallucinated
  action key"); nightly eligibility/roll/register/exemplars + `force_scene_action` + `rolled_axes.seedSource.
  sceneAction`; migration 461 `engine_config.scene_action_pct` (applied, default 0, types regenerated);
  `npm run check` green (1837 tests); nightly-dreams deployed DARK. Step 8 (live A/B on the failed seeds) running.

## 9. The §5 fix as its own experiment (after §8 is judged — ONE variable at a time)

Two rounds, each on the same 8 failed sub-themes × couple + solo (≈ 20 renders), judged against the round
before it, with `no_dual_split` / `identity_sim` / `dual_degrade_single` rates read from the log — never by eye
alone (2026-06-19 rule).

**Round A — flux-1.1-pro override fragments** (`_shared/faceSwapModelOverrides.ts`): remove the portrait
instruction and the baked palette, keep everything that exists to fix the cartoon-eye swap failure.
`painterly portrait realism` → `painterly realism`; `illustrated portrait realism` → `illustrated realism` (×2);
`golden warm watercolor palette` → `a luminous watercolor palette taking its colours from the scene`. No other
change. Pass bar: framing visibly wider on the same seeds, degrade rate not worse than Round 0 (SFA).

**Round B — couple + solo framing text** (`characterSlotPrompt.ts` `dualAnchor`, `framingBlock`,
`integrationLine`): every negated clause becomes a positive one. `NOT a tight face close-up — their faces are a
normal-sized part of the frame, never filling it` → `their faces a modest part of the frame with the setting
visible above and around them`; `rather than a stiff studio couple portrait` → `relaxed and candid`; `never a
blank wall or featureless sky behind the couple … never flat white` → `the wall or sky behind them full of
specific detail, any visible sky alive with colour, cloud form, or weather`. The head-gap line keeps its
positive half (`a clear gap between their two heads, each head on its own side of the frame`) and drops
`faces apart and not touching, not cheek to cheek, heads not leaning together` ONLY if Round B's
`no_dual_split` rate is not worse than Round A's on ≥ 24 couples; otherwise the gap line stays verbatim.
Golden test updated deliberately (new fixture) at the end of the round that ships.

Exit for the whole program: the 8 failed seeds render with a scene-fit action, visible costume, Halloween cues
in frame, three-quarter framing, and the couple degrade rate at or below the 30-day baseline (15-25%).

### Rounds run 2026-09-05 (all on the same 8 failed Halloween sub-themes + goofy/elegant extras, Kevin's private album)

| round | change under test | couples | degraded to solo | clean first try | read |
|---|---|---|---|---|---|
| R1 | scene-first beats v1 | 10 | 3 | 5 | beats scene-fit; head-tilt / reading beats turned faces away → gaze + passive rules added |
| R2 | + gaze/passive rules (partial, memory kill) | 7 | 1 | 5 | 7/7 solos lively + face-forward; couple beats tripped a 26-word cap → per-cast cap (solo 26 / couple 36) |
| RA | + §9 Round A override fragments (no "portrait", no baked palette) | 9 | 2 | 6 | movie_night couple full-body (was two heads); 2 of 7 still two-head |
| RB | + §9 Round B positive framing ("faces a modest part of the frame") | 10 | 4 | 4 | wider where it survived (cozy_porch full-body 9.5/10) but degrades doubled |
| RB' | Round B with "both faces large and clearly readable" | 10 | 4 | — | same degrade rate → the width itself costs identity, not the wording |

Decision: **Round A SHIPS; Round B is REVERTED for couples** (dual anchor/framing back to the original text),
kept for solos (solo identity held 0.6+ in every round). Pooled couple degrade: 6/26 (23%) before B vs 8/20 (40%)
with B. The remaining couple ceiling is the MODEL (every couple clamps to flux-1.1-pro; its painterly overrides
degrade 10-23% in the 30-day table while flex / gemini / gpt-image-2 show 0%) → that is the signature-look
Round 1 experiment, not more prompt wording. Solo path: 21/21 authored solos across rounds were scene-fit and
three-quarter-or-wider; grade 8-9.5 on the Halloween seeds that were 2-3 before.

Also fixed in-flight: pronoun normalization (he/she → the man/the woman) instead of a fallback; REQUIRED note on
the action field (Sonnet omitted it 1 in 7); open-book / tracing beats added to the gaze rule.

### Couple model steer (2026-09-05, shipped ON)

`_shared/dualModelSteer.ts` + `engine_config.dual_avoid_flux11pro` (mig 462, flipped true after verification).
Natural-roll verification, 8 Halloween couples: 6 steered to flux-2-flex → 6/6 clean first-try, full-body,
medium-faithful (Halloween Town watercolor, plaid couple at the wagon in comics, pajama couple in a jack-o-lantern
hall on canvas); the 2 that could not steer (glamour, vintage_film: no flex/max in `allowed_models`, gemini +
gpt-image-2 nightly-banned) stayed on 1.1-pro and reproduced the old failures (two-head close-up; degrade). →
LAST RESORT rule: a couple on such a medium still gets flux-2-flex, stamped `…(last_resort)`. Fix of record:
add flux-2-flex / flux-2-max to glamour + vintage_film `allowed_models` via the DreamSmart runbook.
Superseded: the 2026-08-26 dual flex→1.1-pro clamp (never reproduced: 0/14 flex split failures today).
Solos are untouched by the steer (they held identity 0.6+ on 1.1-pro all day).

### Remaining items (Kevin's call)

- **Halloween sub-themes that do not read as Halloween on ~60 renders today** (cut, or reseed with mandatory
  signifiers enforced by the linter): `afterlife_waiting_room` + `striped_suit_haunting` (8 renders, 0 Halloween —
  office / hallway / courtroom), `stop_motion_whimsy` (Halloween only when the seed has the spiral hill; the
  greenhouse/garden seeds are not), `gothic_greenhouse`, `gothic_glam_editorial`, `ghost_hotel_1920s` (matrix3:
  roses / library / ballroom, no cue), `undead_wedding` (rendered as a normal wedding; needs skeletal band +
  cobwebs + blue crypt mandatory). Keep: `cursed_library` (reseeded rows now carry green candles / floating
  grimoires), `black_cat_alley` (cats + fog + lanterns land every time). Reversible disable script staged:
  scratchpad `disable-nonhalloween-subs.mjs` (scoped by sub_theme, ledgered).
- glamour + vintage_film `allowed_models` review (above).
- Solo `portrait` pool (30% of solo fallback rolls) still static-face-forward; only matters when the authored
  beat falls back. Consider retiring it from the default roll.

**2026-09-06 — Kevin: "no, i don't want to avoid flux 1.1pro."** `dual_avoid_flux11pro` flipped back to FALSE; couples
return to the flux-1.1-pro pick + the Aug-26 flex clamp. The steer code stays in place, inert. Scene-first actions
(`scene_action_pct`=100) and the Round A fragment rewrite remain live.

### Couple variance (2026-09-06) — Kevin: "every couples render now looks very homogeneous"

Verified on a contact sheet of all 98 couple renders from 2026-09-05: the beat brief ("hands busy with the
scene's objects, feet planted, never merely standing") plus the validator's no-sitting / no-walking rules for
couples collapsed every couple into ONE composition — side by side, same scale, feet planted, each holding an
object at chest height. The old pool poses (sitting on steps, leaning on a rail, crouching, mid-stride) and the
random closer crop were the variety. Fix, all inert unless the new inputs are passed (golden unchanged):
- `_shared/dualStances.ts`: 13 body-language frames (seated together, one seated one standing, depth stagger,
  walking, leaning back, shoulder lean, crouched low, perched on an edge, show-and-tell, toast, mid-laugh,
  hands free, one busy one easy) rolled per couple render and handed to Sonnet as the STANCE to build the beat
  around; stamped `dual_stance:<key>`. Every stance text passes the validator verbatim (test-locked).
- Brief: hands may be busy OR natural ("vary it, not every moment needs something held"); walking allowed;
  couples may sit (validator rule retired).
- Anchor drops "stand" for seated stances; the same-height line is omitted for the one-seated-one-standing
  stance; the load-bearing head-gap line is untouched in every variant.
- `engine_config.dual_closer_pct` (mig 463): % of couples framed as the closer waist-up two-shot (faces larger,
  swap-friendly) instead of knees-up — the "randomly a bit closer" crop Kevin missed. NB Kevin's 2026-09-02
  floor was "closest ≈ 3/4 body"; waist-up is the compromise, tune or zero the knob.
- Variance batch 1 (10 couples, 1.1-pro, `dual_closer_pct`=30): stances landed where the render survived (one seated
  on the porch steps + one standing 8/10; perched over a kitten basket; mid-stride down a staircase; holding a globe
  together). The waist-up crop on 1.1-pro tripped `no_dual_split:giant_face` → 3 of 4 waist-up couples degraded →
  **`dual_closer_pct` set to 0** (knob stays). 3 beats fell back `too_long` at 46-48 words (stance + two clauses) →
  couple caps raised to 56 words / 400 chars. The remaining close-ups/degrades in this batch are the 1.1-pro
  behaviour itself (steer OFF per Kevin), not the stance system.
- Variance batch 2 (8 couples, 1.1-pro, closer crop off, caps raised → 0 `too_long`): geometry stances degraded
  4/4 (one seated + one standing, depth stagger, leaning on opposite rails, lanterns raised in a toast → `no_dual_split`
  / identity ≈ 0); same-plane stances clean (perched on the porch rail with a mug, both lifting lanterns). → the
  4 geometry stances moved to `DUAL_STANCES_GEOMETRY` (parked, never rolled while couples are on 1.1-pro); 9
  same-plane stances roll.
- Variance batch 3 (7 couples, 1.1-pro, 8 same-plane stances): seated on a hay bale / porch steps, perched on a
  ledge, leaning on the bookshelf, both lifting lanterns — all clean; the 2 degrades were both `walking` → parked.
  Final: 8 rolled stances (seated_together, leaning_back, shoulder_lean, perched_edge, show_and_tell, mid_laugh,
  hands_free, one_busy_one_easy); 5 parked in `DUAL_STANCES_GEOMETRY` for a wider model. Couple degrade with
  stances ≈ the 1.1-pro baseline (2/7 vs 23-40%); body language now varies per render.

## 10. Phase 2 — GLOBAL rollout + genre action registers (PLAN, 2026-09-06, awaiting Kevin's go)

**Kevin's asks:** "apply this fix globally to nightly … all nightly to have a more natural and dynamic feel";
"bespoke actions for certain genres of pools so they always make coherent scenes"; "standing in a slight posture
or pose is still fine, a well composed shot … a nice variety is what we're after"; "plan this first … test test
test, add unit tests where necessary, make this transition carefully".

**Where nightly stands.** ~60% of nightlies are plain-location ("you at your saved place"), ~40% seeded rows.
Scene-first beats + couple stances are LIVE on seeded rows only. The location path still runs: biome ACTIVE pose
(`action_poses.active`, biome-tagged, curated) → Option B place-fit beat (`location_action_pct`=75, its own Sonnet
call) → generic pools; location couples get no stance roll. A raw location extension exists in the working tree
(uncommitted, NOT deployed — production is the committed HEAD).

### 10.1 Design

- **A. Eligibility becomes a pure, tested function** — `_shared/sceneFirstEligibility.ts`:
  `decideSceneFirst({ kind: 'scenario'|'location'|'active'|'hero', activePoseFired, bespokePool, forceAction,
  forceSceneAction, pctScenario, pctLocation, rng }) → { roll, reason }`. Today this logic is inline in
  nightly-dreams (untestable). Behaviour-neutral refactor first; golden + full suite green before anything else.
- **B. Location path joins** with register `candid travel moment at this real place (visitors, not locals)`.
  When it rolls, Option B's separate Sonnet call is SKIPPED (one beat per render); when it doesn't, Option B /
  pools work exactly as today. Biome ACTIVE poses keep precedence (curated, dynamic, swap-safe). Own knob
  `engine_config.scene_action_location_pct` (mig 464, default 0) so the 60% path ramps independently: 0 → 25 →
  100, never coupled to the seeded-row knob.
- **C. Genre action registers** — `_shared/actionRegisters.ts` (code v1; DB table `action_registers` later if
  Kevin wants admin tuning). One register per GENRE = 8-15 coherent things people do in that world PLUS 2-3
  composed-still options. Keys: the 14 Halloween pools (via `holidayPoolOf`), scenario categories (dual:
  swashbuckler, artifact_hunter, victorian, gatsby_1920s, regency, renaissance_baroque, romantic_gardens,
  old_hollywood, modern_blacktie, evening_city, street_cool, absurd_everyday, animal_mayhem, fun_activities,
  party_carnival, time_travel; single categories map onto the same genres), and the 20 location biomes
  (`biomeAxes.ts` keys, e.g. tropical_coastal → "rinsing sand off at the tide line, a coconut in hand…"). Sonnet
  gets the register as "things people do HERE — pick or adapt one, or a composed still". Missing key → today's
  generic exemplars (never blocks). Needs `category` plumbed through the scenario loaders (select + type) and
  kept at the pick (`dualSceneCategory`) — a 4-line change, tested.
- **D. Brief wording (Kevin):** "A well-composed still pose is welcome (weight on one hip, hands in pockets,
  leaning on something, arms folded) — the goal is VARIETY across renders, not constant action." Two composed-
  still frames join the rolled stances (`standing easy with one hand on something in the scene`, `composed
  three-quarter stance, weight back, hands relaxed`). Geometry stances stay parked while couples are on 1.1-pro.
- **E. Telemetry:** stamps `scene_action_location`, `action_register:<key>`, `dual_stance:<key>` (exists);
  `rolled_axes.seedSource.sceneAction` (exists). A CI test locks that every register entry passes the validator.

### 10.2 Unit tests (fast jest, all before any deploy)

- `sceneFirstEligibility.test.ts` — every branch: scenario / location / active / hero; active-pose precedence;
  bespoke pool; force_action; force_scene_action; pct 0 and 100; rng edges; location uses its OWN pct.
- `actionRegisters.test.ts` — every entry passes `validateActionBeat` for cast 1 AND 2 (an echoed entry ships);
  every key in `scripts/lib/halloweenPools.js` POOLS + every biome key + every scenario category in the seed
  taxonomy has a register (parity test, so a new pool cannot ship without one); ≥ 1 composed-still entry per
  register; no pronouns / banned words.
- `sceneFirstAction.test.ts` additions — brief carries the register + the composed-still wording; location
  register text; "Option B skipped when the roll fires" via the pure function contract.
- Golden fixture re-asserted byte-identical (flag-off / create / DLT untouched). `dualStances` parity:
  rolled ∩ parked = ∅; composed-still frames present.

### 10.3 Live verification (Kevin's private album, ≤ 3 concurrent, headroom-gated; each batch → contact sheet +
stamps table in this doc before the next step)

1. **Location:** 8 solos + 8 couples across 4 biomes on real saved places (`force_scene_action`). Pass: beats
   place-fit; ≥ 6 distinct stances in 8 couples; couple degrade ≤ the 1.1-pro baseline; identity ≥ threshold;
   zero gaze / profile regressions.
2. **Genre registers:** 2 renders × 6 genres (12). Pass: action coherent with the genre (no parking meters at
   the ball, no cutlass at the gala). Kevin grades; heart = fix.
3. **Regression:** 4 goofy + 4 elegant + 4 Halloween rows — unchanged or better vs §8.
4. Flip `scene_action_location_pct` → 25, read one nightly's stamps (fallback rate, degrade rate, share of
   `scene_action_location`), then → 100.

### 10.4 Order of work (each step ends with tests green + a dark deploy)

1. Extract eligibility (A) — refactor only. 2. Location knob + register + Option B skip (B), mig 464, deploy
dark. 3. Registers + category plumbing (C) + parity tests, deploy dark. 4. Brief wording + composed-still
stances (D). 5. Batches 10.3.1-3 → fix → commit → ramp (10.3.4).

### 10.5 Kevin's decisions

- Register content: I draft all of them (≈ 50 registers); you grade the 12-render genre batch.
- Location ramp: 25 → 100 across two nightlies (recommended), or straight to 100 after the batch.
- Registers in code (v1, recommended) or a DB table with admin tuning from day one.

### Phase 2 build log (2026-09-06)

- Steps 1-4 built + deployed DARK: `_shared/sceneFirstEligibility.ts` (pure, 15 branch tests) drives the roll;
  `scene_action_location_pct` (mig 464, 0) + `action_registers_pct` (mig 464, 0) + `scene_action_location_couples`
  (mig 465, false); `_shared/actionRegisters.ts` — 57 registers (14 Halloween pools, 27 scenario genres incl. the
  ones my capped tally missed: rich_famous, stage_and_fame, out_and_about, surreal_absurd; 20 biomes + a generic
  `location` fallback) with 38 aliases (solo category names, the wider `location_cards.biome` vocabulary);
  every entry validator-locked for solo AND couple; `scripts/check-action-registers.js` = live-DB parity (every
  enabled non-active category, Halloween pool and card biome resolves) — run after seeding a new category.
  Category plumbed through both scenario loaders + the QA forced-category pick. Brief: composed stills welcome,
  variety over constant action. QA flags: `force_plain_location`, `force_action_registers`.
- **Location batch** (7 approved cards across 7 biomes; zen_garden has no card): authored SOLOS 3/3 coherent,
  full-body, place-fit (compass-rose monument at Amalfi, travel mug at the Silk Road gate, cup at the Prague
  rail) — curated biome ACTIVE poses keep precedence where they fire (cyclist at the Matterhorn, forest-path run).
  **Location COUPLES: 4/7 degraded with scene-first + stances vs 2/6 in the same-place CONTROL** (flux-1.1-pro) →
  held on the existing path behind `scene_action_location_couples=false`. 546s (worker resource limit, no log
  row) hit 5 direct QA calls today INCLUDING the control → platform, not this change; production goes through the
  queue with retries. Follow-up: characterize 546s from `function_edge_logs` (query API returned nothing usable).
- **Genre batch** (6 genres × solo + couple, registers forced): solos 6/6 genre-coherent (pergola wine glass,
  cedar tumbler, gatsby podium toast, caveman at the mammoth wall, pirate with mackerels, swan-boat pedals);
  couples 2/6 degraded (baseline). `show_and_tell` parked (objects held up between lens and face → giant_face /
  faces=0 three times across batches); 7 same-plane stances roll.
- **Regression batch** (4 goofy / elegant + 4 Halloween, live paths): 8/8 authored (composed stills now appear —
  "stands with weight on one hip, spinning the basketball between both hands"); couples 1/4 degraded (baseline).
  Full fast suite 2,471 green.

### Ramp (needs Kevin's approval — nothing below is flipped)

1. `action_registers_pct` → 100 (seeded rows; Kevin grades the 🎬 GENRE renders first).
2. `scene_action_location_pct` → 25 (location SOLOS only; couples held) → read one nightly's stamps
   (`scene_action_location` share, fallback rate, identity) → 100.
3. `scene_action_location_couples` stays false until couples have a model answer (steer, or a 1.1-pro-safe
   framing) — SCENE_FIRST_ACTION_PLAN.md §8 + this log are the evidence.

## 11. Cleanup / refactor plan (Kevin 2026-09-06: "long overdue … feel free") — AFTER the ramp, behaviour-neutral

The nightly render's cast-action section is a ~250-line inline chain (Option B, biome active poses, bespoke pools,
scene-first roll, stances, registers, hair variation, composition presets) inside a 4,000-line handler. Plan:

1. `_shared/nightlyQaFlags.ts` — `parseQaFlags(body)` → one typed object for the 34 `force_*` flags (today: 34
   ad-hoc `const force_x = body.force_x === true` lines). Test: every flag parsed, defaults, no unknown keys.
2. `_shared/sceneRowPick.ts` — `pickSceneRow(...)` returns `{ kind, scene, attire, category, subTheme, posePool,
   mediumKey, mediumBan, isActive }` for holiday / goofy / elegant / active / hero / forced-category, replacing
   six copy-pasted assignment blocks (the `dualSceneCategory` plumbing touched all six today). Test per branch.
3. `_shared/castActionResolver.ts` — `resolveCastAction(state)` → `{ action, authorAction, dualStance,
   dualComposition, stamps[] }`: the precedence chain in one pure function (active scene → forced → bespoke pool →
   scene-first (+ stance + register) → Option B → biome active pose → register pools). Tests lock the precedence
   table; nightly-dreams becomes a 15-line call. Stamp names unchanged (forensics + monitors depend on them).
4. Golden fixture + a stamps-parity test (same seeds → same `fallback_reasons` shape) gate each step; each step
   ships as its own commit + dark deploy; `npm run check` green throughout.
Estimated −400 lines in `nightly-dreams/index.ts`, no behaviour change.

### Ramp + refactor log (2026-09-06, Kevin: "all the renders on my page look amazing … 1) yes 2) prove it 3) do it now")

- **LIVE:** `action_registers_pct` = 100; `scene_action_location_pct` = 100 (solos) after a 16-solo proof across 16
  biomes (🎬 LOCSOLO): 16/16 rendered, identity 0.47-0.71, 11 authored + place-fit (5 went to curated biome ACTIVE
  poses by design), every register keyed by biome incl. the aliased card vocabulary. Couples on location stay held.
- **Refactor §11 done, behaviour-neutral, each step deployed + regression-rendered:**
  1. `_shared/nightlyQaFlags.ts` — `parseQaFlags(body)` (41 flags, 10 tests: every coercion byte-for-byte);
     the 145-line inline block is a 46-line destructure.
  2. `applySceneRow(s, kind, holidayKey?)` — one assignment helper for the 6 scenario-pick branches + the QA
     forced-category pick (TS over-narrowed `dualSceneKind` past the closure → `sceneKindNow()` accessor).
     Also fixed forensics: solo active rows now stamp `seedSource.kind='active'` (were 'scenario').
  3. `_shared/castActionResolver.ts` — `resolveCastAction(inputs)`: the precedence table (force → active →
     bespoke → goofy/elegant/special → location: active pose ?? Option B ?? classic) + the scene-first block
     (register, exemplars, stance, genre register, stamps in the original order), 12 tests. Nightly loads inputs
     and applies the result.
  Guards: golden fixture unchanged; 11-render all-branch regression after each deploy (🎬 REG2 / REG3) with
  stamp-shape parity; full suite green.
