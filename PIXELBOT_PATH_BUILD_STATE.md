# PixelBot scene-path build: live tracker

Plan of record: `PIXELBOT_SCENES_PLAN.md`. Started 2026-09-19 05:10 UTC. Every render in this build is a
SHADOW post (hidden from everyone but Kevin's admin account, reviewable in the app on PixelBot's
profile). NOTHING is deleted until Kevin has reviewed and given the green light.

Tools: `scripts/_pixelbot-scene-render.js` (shadow render, in-memory wiring, `--look i` to force a look),
`scripts/_pixelbot-round-fetch.js` (pull a round's rows + images for grading).

## Phase 0
- [x] painting register (`PAINTING_PREFIX/MEDIUM/SUFFIX`, scene blocks) in shared-blocks.js
- [x] looks register: `seeds/pixelbot_look_register.json` (10 candidates) + `pools.PIXELBOT_LOOK_REGISTER` + `rollSharedDNA.lookRegister`
- [x] `scenePaths.js` helper + index.js `SCENE_PATHS` derived wiring (medium / models / vibes / chaos+polish off / shadow lane)
- [ ] pixel-vista pools (9 × 25) + sweeps
- [ ] pixel-vista path file
- [ ] look check (one render per look on pixel-vista) → curated register
- [ ] pixel-vista R0 (5) → exit gate

## Paths
| path | status | rounds | last avg / min | verdict / residual |
|---|---|---|---|---|
| pixel-vista | PASS | 3 | 4.62 / 4.4 | pass; residual: thunderhead-cloud sky entries |
| pixel-harbor | IN PROGRESS (agent, batch 1) | | | |
| pixel-cabin-glow | IN PROGRESS (agent, batch 1) | | | |
| pixel-cozy-room | IN PROGRESS (agent, batch 1) | | | |
| pixel-cool-rides | not started | | | |
| pixel-fantasy-vista | not started | | | |
| pixel-rain-street | not started | | | |
| pixel-campfire-night | not started | | | |
| pixel-shoreline | not started | | | |
| pixel-skyward | not started | | | |
| pixel-ruins | not started | | | |
| pixel-cozy-farm | not started | | | |

## Round logs

### Phase 0 look check (pixel-vista, one render per candidate look, 2026-09-19 05:14 UTC, all shadow)
| look | model | pixel fidelity | look read? | verdict |
|---|---|---|---|---|
| Classic 16-bit | flux-1.1-pro | 5 (fjord sunset, gorgeous) | yes | KEEP |
| Hi-bit painterly | flux-2-pro | 4.5 | yes (soft dither) | KEEP |
| Ordered-dither | flux-dev | 5 (red canyon reflection) | yes | KEEP |
| Fine-dither | flux-2-max | 4.5 | yes | KEEP |
| Impressionist clusters | flux-dev | 4 (soft, a little empty) | yes | KEEP |
| Soft-cluster | flux-2-pro | 4 (pixel art held; sky entry was the defect, see below) | yes | KEEP |
| Chunky low-res | flux-1.1-pro | 3: rendered as SMOOTH clean illustration, no grid | no | CUT |
| Flat cel | flux-1.1-pro | 3: smooth vector-style illustration | partly (flat) | CUT |
| Inked-outline | flux-2-flex | 4 as pixel art, but no outlines at all | no | CUT (indistinct) |
| CRT phosphor | flux-1.1-pro | 4.5 as pixel art, but no scanlines/bloom | no | CUT (indistinct) |

Lesson (playbook-bound): looks that REDUCE technique ("flat, no dither", "four shades, big blocks")
push Flux toward smooth vector illustration; looks that ADD visible technique (dither type, cluster
texture, grid discipline) hold pixel fidelity. Register curated 10 → 6. Models: no prune warranted
(the two smooth renders correlate with the look, not the model; flux-dev produced two of the best).
Pool defects found in the look check (fixed before R0): see round log R0-prep below.

### pixel-vista
R0 2026-09-19 05:17 UTC | models: dev, 1.1-pro, 2-pro, 2-pro, 2-max | looks: soft-cluster ×2, classic16 ×2, ordered-dither | avg 4.24 | min 3.5
  #3 dune sea + storm-break shaft + horse specks (2-pro, classic16) 4.8 BANGER; #5 basalt gorge, sunset wash, cloud cap (2-max, ordered) 4.6; #4 lava coast sunstar, banded sky (2-pro, classic16) 4.4
  misses: #2 mountain sunstar (1.1-pro, SOFT-CLUSTER) smooth illustration, grid gone → 3.5; #1 rocky coast (dev, SOFT-CLUSTER) soft, place read generic → 3.9
  cause: the Soft-cluster look ("minimal dithering, smooth-reading forms") drops the grid, same family as the cut flat/chunky looks
  R0-prep fixes already in (from the look check): sky "storm wall/towering" → soft cloud language; life "dense flock/mass" → thin distant; light_moment "rays/beams" → soft hazy fans; template: light vs light-moment vs sky conflict → keep the light moment, one sun or one moon
  variable for R1: CUT Soft-cluster from the looks register (5 looks remain). Phase 0 gate (≥4.0, pixel art, no game camera, no text) PASSED.
R1 2026-09-19 05:20 UTC | models: ultra, 2-flex, ultra, 2-pro, 2-flex | looks: fine-dither, impressionist ×2, hi-bit ×2 | avg 4.06 | min 3.0
  #5 slot canyon looking up at moon + stars (2-flex, hi-bit) 4.8 BANGER; #1 volcano with lava crack + cumulus plume (ultra, fine-dither) 4.4; #4 dry-stone terraces above wet beach (2-pro, impressionist) 4.3
  misses: #2 terraces with two CYAN BLOB artifacts (2-flex, impressionist) 3.0; #3 moonlit canyon with a literal white PILLAR at the far end, camera said "converging canyon" on a dune-sea landform (ultra, hi-bit) 3.8
  causes (from ai_prompt): palette entry ends "one bright cyan accent" unattached → Flux paints cyan objects; light_moment #18 "unbroken column of white light" → a literal column; camera #16-18 name canyon/fjord → fight other landforms
  variable for R2: LITERALIZATION SWEEP at source: palette accents now attach to the light ("X only in the brightest highlights", all 25), light_moment "column" ×2 → shaft/streak, camera #16-18 → landform-agnostic "ALONG ITS LENGTH"
R2 2026-09-19 05:23 UTC | models: 2-pro, 2-max, dev, 1.1-pro, dev | looks: ordered, impressionist, fine-dither, classic16 ×2 | avg 3.86 | min 2.0
  #2 caldera lake, orange tuff walls, grid texture (2-max, impressionist) 4.6; #3 glacial outwash valley + god light (dev, fine-dither) 4.4 (medium a touch soft); #1 volcano + lightning + thunderhead (2-pro, ordered) 4.3; #5 snowy cirque lake (dev, classic16) 4.0 (a stray pink arc on the lake)
  miss: #4 tropical volcano, red summit, palms (1.1-pro, classic16): GORGEOUS but a smooth vector illustration, no grid → hard fail 2.0
  cause: MODEL. Tally of pixel fidelity ≥4 across look check + R0-R2: flux-2-pro 5/5, flux-2-max 3/3, flux-2-flex 3/3, flux-dev 4/5, ultra 1/2, flux-1.1-pro 2/6 (smooth on 4)
  variable for R3: drop flux-1.1-pro from SCENE_MODELS (applies to every scene path; the Phase 0 prune the plan anticipated). Pools untouched this round.
  residual to watch: sky "stacked cloud heaps / tall cumulus" tends to render as a giant anvil thunderhead (fine over a volcano, odd elsewhere); one pink arc (rainbow moment on water)
R3 2026-09-19 05:25 UTC | models: 2-pro, 2-max, 2-max, dev, ultra (+1 Replicate 90s timeout, re-rendered) | looks: classic16, impressionist, ordered, fine-dither, hi-bit | avg 4.62 | min 4.4 → PASS
  #3 braided outwash valley + soft crepuscular fans (2-max, ordered) 4.7; #5 alpenglow peak (ultra, hi-bit) 4.8; #1 olive terraces + rainbow over the volcano (2-pro, classic16) 4.6; #2 glacier tongue into a lake, rain curtain, flurries (2-max, impressionist) 4.6; #4 green terraced mountain (dev, fine-dither) 4.4
verdict: PASS in 3 rounds. Residuals (accepted, not chased): the "stacked cloud heaps" sky entries read as a big thunderhead; parallel render processes each keep their own recency so a landform can repeat across a round (run ONE process with --count 5 per round). Ready to scale after Kevin's review.

## Phase 0: COMPLETE 2026-09-19 05:30 UTC
- painting register proven; looks register curated 10 → 5 (Classic 16-bit, Hi-bit painterly, Ordered-dither, Fine-dither, Impressionist clusters); flux-1.1-pro dropped from SCENE_MODELS; pixel-vista PASS.
- Lessons for the playbook: (1) looks that REDUCE technique lose the pixel grid; (2) an unattached palette "accent" renders as an object, attach accents to the light; (3) light described as a column/pillar renders a column; (4) camera entries must be landform-agnostic; (5) flux-1.1-pro (non-ultra) is the smooth-illustration model on this register.

## KEVIN STEERS MID-BUILD (2026-09-19 ~05:45 UTC, from his in-app review of the shadow renders)
1. Medium: "pixels or a near pixel look, or voxel (think HD minecraft) ... some of these are borderline digital painting": borderline painting = HARD FAIL; looks that trend toward painting cut (hi-bit painterly, fine-dither, soft-cluster).
2. Whimsy: "whimsical, somewhat magical looking pixelart that evokes that old school feel and charm, and not these overly realistic landscape or geographic images. too serious. we already have earthbot."
3. Recalibration: "how video games have historically rendered pixel scenes: how Final Fantasy would have pretty pixel art for its splash or loading screens, or old school Ultima scenes."
Applied: prefix/medium/register block rewritten to "classic video-game splash-screen pixel art" with whimsy + magic; looks register rebuilt as ERA sub-styles: SNES RPG splash, VGA adventure background, Ultima-style tile scene, Amiga 32-colour ordered dither, HD voxel world (the voxel option Kevin asked for). pixel-vista's landform / sky / light_moment / charm / moment / palette pools regenerated with whimsy-first recipes (realistic geology pools backed up in /tmp/vista-pools-realistic-backup). The three batch-1 agents were re-briefed. pixel-vista's PASS predates the steer → it re-runs a look check + R4 under the new register when a render slot frees.
