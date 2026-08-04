# Dream Off — Entry Render Path: risk deep-dive + plan (2026-07-27)

Kevin asked: can we safely reconcile a user's cast "spin" with the base dream seed in a
face-swap? The deep-dive (2 code-trace agents + verification) found the merge question sits
on top of a **more fundamental problem: the Dream Off render path is not actually wired to
render.** Two hard blockers fire before the spin question even applies.

## Blocker A — every Dream Off render 400s (scene AND cast)

`generate-dream` hard-requires `medium_key` OR `vibe_key`:

```
generate-dream/index.ts:406   if (!medium_key && !vibe_key) return 400 "Must provide medium_key or vibe_key"
```

The entry sends neither. `app/game/[id]/entry.tsx:90-94` sends `{ mode:'flux-dev', spin, vibe_profile? }`;
`dream-off-submit/index.ts:142` sets `body.prompt = base + ", " + spin`; the worker
(`dispatchers/create.ts`) forwards it untouched. **No medium_key/vibe_key anywhere → 400 before any
prompt building.** The render path has almost certainly never run end-to-end (consistent with the
born-dark flag + entry.tsx's own "wants a render pass before launch" note).

## Blocker B — cast entries never actually cast the player

The face swap only fires via (a) self-insert detection or (b) an explicit `force_cast_role`.
- `detectSelfInsert("You as a battle-worn knight, …")` returns **`isSelfInsert:false`** — the patterns
  look for `I/me/my/+1`, and "You as X" has none (`selfInsertDetector.ts:108`; verbatim passthrough at `:184`).
- The Dream Off payload sets **no `force_cast_role`**.
→ `castMembers` stays `[]` (`generate-dream/index.ts:1155-1177`), `hasCastInjection` false → **no swap at
all**; it would render a generic character with the player's face nowhere in it. (Even the couple
"You and your +1 as…" doesn't reliably self-detect.)

## The spin-merge risks (real, but only once A + B are fixed)

IF we wire the swap, the merged `"You as {char}, {spin}"` is dangerous because of WHERE the user text lands:

- **Single path:** the spin is injected into a block literally labeled `"USER PROMPT — SACRED, OVERRIDES
  EVERYTHING BELOW … Their LOCATION wins. Their ACTION wins"` (`singleBriefBuilder.ts:127-131`). A spin
  with scale/wide/distance words ("sweeping battlefield, tiny distant figures") overrides the "character
  fills the frame" mandate → face too small → single-swap "no face found" → refund.
- **Couple path:** the spin is fed as BOTH `userPlace` (→ `scene_description` "MUST depict this") AND
  `wardrobeAnchor` (`generate-dream/index.ts:1361,1367`). Closeness words ("cheek to cheek") pull the two
  heads together, beating the code-locked "clear gap between heads" anchor → `no_dual_split` →
  degrade-to-single → partner's face silently dropped.
- **First-named-noun dominance:** "You as a **giant snail**, …" front-loads a big-object noun ahead of the
  person → Flux renders the object big, the person small → shrinks the face (project Hard Rule).
- **No semantic guard** against scene-dominance/face-shrink exists anywhere on this path — only
  injection/control-char sanitization (`sanitizeUserText` + `sanitizeUserPrompt`) runs.

**Already well-defended (no change needed):**
- Couple **pose + head-gap** — the `action` is always a curated pool pick, never user text
  (`generate-dream:1379-1398`), and the gap is code-locked in three places (`characterSlotPrompt.ts:595,
  605-611` + pool wording). A user cannot inject the pose.
- **Faceless/non-human self** — identity/gender/framing blocks are code-locked; `validateSlots` strips
  from-behind/occlusion/face words from Sonnet output (`characterSlotPrompt.ts:412-456`).
- Scene stays **after** the framing block in the couple slot template (`:613-627`) — position 9, the
  documented anti-`no_dual_split` ordering.

## Plan (finish the render path; make the spin safe by construction)

1. **Give Dream Off renders a medium/vibe** (clears Blocker A, scene + cast). Decide the look: a fixed
   default `medium_key` for `source='dream_off'`, or per-pack, injected in `dream-off-submit` (server-side,
   authoritative). Simplest first: one good cinematic medium for all Dream Off.
2. **Force the cast role explicitly** (clears Blocker B). `dream-off-submit` sets `force_cast_role='self'`
   (single) / `'dual'` (couple) from `cast_mode`, and ensures swap sources (self + plus_one) are supplied.
   Stop relying on "You as" phrasing to self-detect.
3. **Don't concatenate the spin onto the subject.** Base character = the subject/wardrobe anchor; the spin
   = a SEPARATE, subordinate embellishment routed to the safe slots (wardrobe/props/scene-after-framing),
   never the "SACRED overrides everything" block, never front-loaded. Tightly capped; UI-framed as "a twist
   to your scene/look," not "who you are."
4. **Add the one missing guard:** a scene-dominance/scale regex (fills-frame / vast / towering / aerial /
   wide / tiny-distant / crowd) + figure-count check in `validateSlots`, so an amplifying spin is
   neutralized → retry → safe fallback. This makes user text safe on this path.
5. **Keep couple pose/gap curated + code-locked** (already safe).

## Sequencing recommendation
Wire **scene** renders first (medium + spin-as-scene, no swap) — small, provable, launch-safe. Then tackle
**cast** (force role + swap-safe spin + guard + render-QA). Until all of the above lands, **neither scene
nor cast Dream Off entries can actually render.**
