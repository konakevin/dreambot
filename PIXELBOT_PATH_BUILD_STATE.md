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
| pixel-vista | IN PROGRESS (new register: R4 4.0, R5 4.10 with one hard fail) | 6 | 4.10 / 2.0 | old-register PASS void; next variable (not yet run) = camera-pool sweep |
| pixel-harbor | PASS R3, then KEVIN FLAG (flat marina) → fix round pending | 4 | 4.54 / 4.1 | wired + committed e1f3f8be; residuals for scale: lunar-ribbon reflection, flurry-sweeping air |
| pixel-cabin-glow | PASS | 2 | 4.74 / 4.6 | pass; residual: warm place + snowfall air combo |
| pixel-cozy-room | PASS | 4 | 4.70 / 4.2 | pass in R3 (final register, flux-2 set); wired + committed e1f3f8be; residuals: rain streaks inside 1/5, folded-paper pseudo-text, a doubled object |
| pixel-cool-rides | not started | | | |
| pixel-fantasy-vista | not started | | | |
| pixel-rain-street | not started | | | |
| pixel-campfire-night | not started | | | |
| pixel-shoreline | not started | | | |
| pixel-skyward | not started | | | |
| pixel-ruins | not started | | | |
| pixel-cozy-farm | SCRAPPED 2026-09-19 (Kevin: "scrap the farm pixels, we'll leave that domain to farmbot") | 1 | | files removed; 5 R0 shadow renders (06:14 UTC) left hidden, ungraded |

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
4. Clarification: "they should still be pretty and not dummed down, but the medium and vibe need to feel old school, while still pulling off a beautiful/cool render." Register wording moved from "chunky" to "richly detailed"; beauty bar unchanged.

### pixel-cabin-glow (agent, batch 1) → PASS in R2
R0 05:35 (old register) avg 4.58 min 4.5: numerically a pass but every dwelling read realistic; variable → whimsy hero pool regen + whimsy vibes (+ the global steer)
R1 05:40 (intermediate register, voxel looks in) avg 4.68 min 4.2: #2 sky over-stuffed (storm-lit light + aurora + shooting star); variable → storm-lit light entries replaced, template "the sky carries at most ONE special feature" (+ the global era-looks register)
R2 05:43 (shipping register, era looks: Amiga, SNES, VGA) avg 4.74 min 4.6 → PASS. Mushroom-cap hut across a lake under a dithered sunset (ultra, VGA) 5.0; blue-scale-roof cottage under aurora (dev, VGA) 4.8; stilt house with its door light on the water + ducks (2-pro, Amiga) 4.7
residuals: a tropical dwelling can roll a snowfall air entry (whimsical, one template line would fix); regex false positives ("face" of a window, cabin "wall") left. Lessons: "one warm note" palette rule held 15/15; stacked sky phenomena = three axes firing at once, cozy paths carry no dramatic light; name the massing per dwelling; empty path to the door held 15/15; register beats pool for VIBE; ultra holds fidelity under the era looks.

### pixel-vista, re-run under the splash-screen register (whimsy pools)
R4 05:48 UTC | 2-flex, 2-pro, 2-max, dev (+1 Replicate timeout) | VGA, SNES splash, VGA, HD voxel | avg 4.0 | min 2.0
  #3 giant tree on a misty island, shooting star, stone path (2-max, VGA) 4.9; #1 glowing jade waterfall in a rose gorge, sunbeams, cotton clouds (2-flex, VGA) 4.8; #2 candy hills, blossom tree with a swing, sun halo, moon path (2-pro, SNES) 4.3 (charming, a touch sparse)
  miss: #4 island tree (dev, HD VOXEL): smooth digital illustration, no cubes, no pixels → hard fail 2.0
  cause: MODEL × LOOK. Tally across vista + harbor + cozy-room + cabin: flux-2-pro / 2-max / 2-flex held the medium on every draw incl. HD voxel (harbor R2 #5, cozy R2 #5 both 4.9); ultra smooth/flat on 5 draws; flux-dev smooth on voxel, cartoon drift on SNES splash, soft on fine-dither
  variable for R5: SCENE_MODELS pruned to the flux-2 family (applies to every scene path)

### pixel-harbor (agent, batch 1) → 3 rounds, residual, granted R3 (two rounds ran under superseded registers)
R0 4.0 (gibberish shop signs from commerce nouns; splash plumes) → source sweep; R1 4.06 (ultra + voxel-diorama flat; documentary read) → whimsy place pool + vibes; R2 4.08 min 3.5 under the final register (snow on a tropical bay; Ultima tile on a waterline camera flat with a blank sky; a "dark patch" gust → black blob). Post-R2 unverified: template climate clause; gust entries → "a soft cat's-paw of fine ripples". Keepers: punt under a stone bridge with a doubled lantern + a cat on a rope coil (2-max) 4.9; striped lighthouse, dory, heron, stars over orange bands (2-flex) 4.9; voxel punt at a lantern-lit landing stage (2-flex, HD voxel) 4.9.
Lessons: commerce nouns summon signage (sheds / net lofts / cottages instead); spray is haze never sheets or plumes; "dark patch" on water renders a blob; climate-agnostic air/moment pools need a climate clause when the place pool spans tropical and northern.

### pixel-cozy-room (agent, batch 1) → 3 rounds, residual, granted R3 (two rounds ran under superseded registers)
R0 4.12 (a chalkboard with gibberish on ultra; a literal "bar of light") → whimsy room pool + light-moment rewording; R1 4.03 (ultra smooth again) → era line in the template; R2 3.66 min 2.0 under the final register (dev SNES-splash cartoon drift with snow INSIDE the room; jam jars with gibberish labels). Post-R2 unverified: every jam jar "sealed with a cloth top and string". Keepers: burrow reading room, round window, gramophone (2-pro, Ultima tile) 4.9; voxel tea room, smiling teapot, rain-lit lamps through the window (2-pro, HD voxel) 4.9; attic bedroom, round window in the rain, sleeping hound, guitar (2-max) 4.9.
Lessons: object nouns carry TEXT priors (jam jars → labels; a cabin → a chalkboard), crowd them out positively; a bar/beam/wedge of light renders a solid object; light-moment entries must be light-agnostic.

### pixel-harbor R3 (final register + flux-2 set; 3 posted 05:54 UTC before the disk filled, 2 make-up at 06:10) → PASS
R3 | models: 2-max, 2-flex, 2-flex, 2-pro, 2-pro | looks: SNES, Amiga, HD voxel, VGA, Ultima | avg 4.54 | min 4.1 → PASS
  #2 green canoe with a bow lantern at a pebble dock, four ducks, life rings, a galaxy arc (2-flex, Amiga) 4.9 BANGER; #4 moonlit harbour village, two plump trawlers, a clock post, a fish arcing (2-pro, VGA) 4.7; #3 yellow voxel skiff with a striped flag at a tilting dock under a peach dusk (2-flex, HD voxel) 4.7; #5 teal canal barge with flower boxes in rose-dawn rain (2-pro, Ultima) 4.3; #1 blue canoe in rain with a lantern and ducks (2-max, SNES) 4.1
  sub-4.5 causes (ai_prompt; none below 4): #1 air #22 "a sudden flurry sweeping across the basin in a pale swirling rush" → two white comet-swooshes over the trees (rain + snow both fired); #5 reflection #15 "LUNAR RIBBON: a long muted ribbon of white-silver resting on the water surface" → a literal moon disc ON the water with a white bar, under a dawn light entry
  verdict: PASS in R3 (four rounds; R0-R2 under superseded registers). Medium lens 5 on all five. Residual rewrites for SCALE time, NOT applied (xerox rule): air #22 → "a soft flurry drifting across the basin, snowflakes skating sideways on the harbour wind"; reflection #15 → "MOONLIGHT PATH: the moon's reflection as a long soft dithered path of white-silver across the surface, breaking into flecks where the water moves".
  KEVIN FLAG (2026-09-19 ~06:30 UTC, in-app): the R2 #4 flat Ultima-tile marina (blank sky, row of striped-sail boats, a hut with a porthole) = "too simplistic and quite frankly BORING". Diagnosis + fix round: see the harbor R4 entry below once run.

### pixel-cozy-room R3 (final register + flux-2 set; 3 posted 05:54 UTC, 2 make-up at 06:11) → PASS
R3 | models: 2-max, 2-pro, 2-flex, 2-flex, 2-flex | looks: Ultima, VGA, SNES, VGA, VGA | avg 4.70 | min 4.2 → PASS
  #4 cushion-cave window nook over a lamp-lit harbour at night, patchwork curtain, sparrow on the sill, copper kettle (2-flex, VGA) 4.9 BANGER; #5 wood-panelled sleeper cabin, string lights, mushroom lamps, rooftops at sunset, toy train, hedgehog in a basket (2-flex, VGA) 4.9 BANGER; #3 snow-window reading nook, mushroom lamp, quilted bench bed (2-flex, SNES) 4.8; #1 burrow sitting room, porthole sunset, stove, sleeping dog, toy train (2-max, Ultima) 4.7 (black letterbox bars, model artifact); #2 lighthouse bunk room with a porthole on the sea (2-pro, VGA) 4.2
  sub-4.5 causes: #2 "rain thickening down the porthole glass" → streaks across the interior wall above the window (the known 1-in-5 residual) and "a folded paper tucked inside the top book" → a note with squiggle pseudo-text (small, not readable; docked, not a hard fail); #3 the radio object rendered twice
  verdict: PASS in R3 (four rounds; R0-R2 under superseded registers). Medium lens 5 on all five. Residuals for scale time: objects "folded paper" → a wordless object (a pressed-leaf bookmark); window_view rain/snow entries → "rain running down the outside of the glass".

### pixel-vista R5 (new register, flux-2 set; 3 posted 05:54 UTC, 2 make-up at 06:09)
R5 | models: 2-flex, 2-flex, 2-pro, 2-max, 2-pro | looks: HD voxel, Ultima, SNES, SNES, SNES | avg 4.10 | min 2.0
  #3 island with one enormous round-canopied tree under fanning sunbeams and a banded sunset sky (2-pro, SNES) 4.9 BANGER; #2 wobbly conical mountain island with a glowing aqua waterfall, red flower ring, shooting star (2-flex, Ultima) 4.7; #5 the same wobbly mountain under aurora ribbons and stars (2-pro, SNES) 4.7; #1 voxel river valley with a moon path (2-flex, HD voxel) 4.2 (black void across the bottom quarter)
  hard fail: #4 mushroom-cap rock towers, sun halo, fireflies (2-max, SNES): a girl lying FACE-DOWN in the water in the foreground → 2.0; also "a merry swirl of golden leaves looping high" → a literal golden spiral line
  causes (ai_prompt): #4 camera #21 "LOW FROM THE BEACH: lying low on wet sand" → Sonnet wrote "viewed lying low on wet sand" → Flux painted a body lying on the sand (the viewer's POSTURE became a person); #1 camera #1 "the near ridge as a dark foreground base" → a black void. Landform repeat (#2/#5) = recency per process (the make-up pair was a second process), expected.
  variable for R6 (NOT YET RUN, paused by Kevin's interrupt): camera-pool sweep, one pool: rewrite the 8 entries so every entry names where the CAMERA sits ("camera set low at the wet sand's edge", "from the saddle"), never the viewer's posture, and the foreground is named for what it IS (a sunlit base of rounded rock and grass, never "dark").

### pixel-cozy-farm R0 (2026-09-19 06:14 UTC) → SCRAPPED before grading (Kevin: farm domain stays with FarmBot). Five hidden shadow renders remain; files removed.

## RESUME (2026-09-19 ~06:30 UTC): harbor + cozy-room PASSED R3, wired + committed (e1f3f8be). pixel-cozy-farm SCRAPPED. Kevin flagged the harbor R2 #4 flat marina in-app (fix round pending). Paused at Kevin's interrupt: vista R6 (camera-pool sweep, pool not yet edited), then batch 2 (cool-rides, fantasy-vista, rain-street) as three agents, then batch 3, then batch 4 (ruins). Nothing deleted beyond the farm files; nothing live.
