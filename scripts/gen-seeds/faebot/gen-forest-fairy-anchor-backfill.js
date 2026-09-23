#!/usr/bin/env node
// BACKFILL for faebot_forest_fairy_scene_foreground_anchor — the three anchor families the pool
// has essentially NONE of.
//
// MEASURED 2026-09-22 (independent bucket counts over all 200 entries):
//   flowers 28%   moss/stone 26%   fern 23%   vine/ivy/willow 19%   mushroom 17%   log/root 16%
//   water 1%      fae-made 0%      creature 1%
// The botanical spread is genuinely good, so this pool is NOT the monoculture the saturation
// scanner implied — it is simply ALL PLANTS AND ROCKS. Every foreground anchor in 200 entries is
// something that grew there. Nothing built, nothing wet, nothing alive. This ADDS those three
// families (+60) rather than deleting any of the botanical entries that already work.
//
// NOT CHANGED THIS ROUND, deliberately: existing entries say "painted" an average of 2.3 times
// each. Same call as the weather pool — de-stuffing changes every live render, so it is its own
// variable and its own shadow round. New entries use it once where it reads naturally.
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/faebot/seeds/faebot_forest_fairy_scene_foreground_anchor.json',
  total: 260,
  batch: 20,
  append: true, // grow-to-N. WITHOUT this, generatePool OVERWRITES the pool.
  metaPrompt: (n) => `You are writing ${n} FOREGROUND ANCHOR entries for FaeBot's forest-fairy scenes — painted-fantasy illustration of a fairy in an enchanted wood. This axis supplies the thing in the NEAR FOREGROUND that frames the shot and gives the frame depth: it sits between the camera and her, at a named screen position, without blocking her.

Each entry: 18-30 words, comma-separated phrases. Match the house voice: the anchor object, its position in frame, its texture detail, then how it frames without blocking.

━━━ WHAT TO WRITE — THE POOL IS ALL PLANTS AND ROCKS, IT IS MISSING THESE THREE ━━━
Split your entries roughly evenly across these three families. The pool already has 200 entries of vines, moss, boulders, ferns, mushrooms, wildflowers and fallen logs, so do NOT write those.

1. FAE-MADE AND HAND-MADE THINGS (the biggest gap — zero entries exist)
   A hanging lantern on a hooked branch, a tiny door set into a trunk with a worn step, a rope-and-plank bridge rail, a mossy stone stair with a carved edge, a leaning signpost with its arm rotted off, a woven willow fence, a ladder of pegs up a trunk, a dangling string of bottle-glass charms, a forgotten stone well-head, a wooden bucket on a hook, a spiral of stacked flat stones, a bent iron gate gone green, a birdhouse nailed crooked, a hanging chime of hollow reeds, a boot left as a planter.

2. WATER AT THE FRAME EDGE (1% exist)
   The near bank of a brook cutting across the lower frame, a still black pool with the canopy reflected in it, a puddle skin holding the sky, a mossy rock breaking a current into white, a trickle down a stone face, a dripping fern over open water, a fallen branch half-submerged, spray drifting off a small fall, a waterlogged hollow ringed with reeds, the wet rim of a spring.

3. A LIVING CREATURE AS THE ANCHOR (1% exist)
   A snail traversing a leaf in the near corner, a woven nest with speckled eggs on a foreground branch, a frog on a wet stone watching her, a moth at rest with wings open, a robin on a twig in sharp near-focus, a beetle-track in soft bark, a dragonfly hovering at the frame edge, a deer's ear and shoulder just entering frame, a shed snake-skin caught on a twig, a cat-sized fox kit crouched low.

━━━ RULES ━━━
- ALWAYS name a screen position: foreground-left, foreground-right, lower-center, upper-left, across the bottom of the frame, the near corner.
- ALWAYS say how it FRAMES WITHOUT BLOCKING her — that is this axis's whole job.
- Give it one specific TEXTURE detail (flaking paint, water-worn grain, rust bloom, wax shine, speckled shell, rope fray).
- This is a PAINTED FANTASY ILLUSTRATION. Use the word "painted" ONCE where it reads naturally, not in every clause.
- The fae-made things are WEATHERED and grown-into — moss in the joints, ivy through the rail. Nothing looks new or manufactured.
- No people, no named characters, no fairy anatomy or wings described — this axis is the foreground object only.
- Keep it warm and enchanted. Nothing grim, nothing dead, nothing horror. A shed snake-skin is charming; a carcass is not.
- No text, no lettering, no readable signage (a signpost may be present but its writing is worn away).

━━━ EXAMPLES (DO NOT REUSE) ━━━
- "A hooked branch in foreground-right carrying a dented brass lantern, its glass fogged and one pane cracked, warm glow framing her without crossing her face."
- "The near bank of a brook cutting across the bottom of the frame, painted current breaking white around a mossed stone, wet gravel sharp in the immediate foreground."
- "A woven nest of grass and down on a foreground-left branch with three speckled eggs, fine twig-detail crisp against the soft depth where she stands."
- "A tiny door set into the trunk at lower-left, planks silvered with age and a worn stone step below, ivy threading the hinge, framing the lower corner."
- "A snail crossing a broad wet leaf in the near corner, shell-whorl catching the light, glistening trail behind it, leaving the middle of the frame open."

━━━ DEDUP ━━━
Vary the family, the object, the screen position and the texture. Do not write two entries about the same object.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
