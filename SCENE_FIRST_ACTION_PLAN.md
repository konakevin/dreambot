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
