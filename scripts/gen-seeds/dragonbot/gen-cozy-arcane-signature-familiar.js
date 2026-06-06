#!/usr/bin/env node
/**
 * COZY_ARCANE_SIGNATURE_FAMILIAR — scale-up 25 → 100.
 *
 * Each entry is ONE specific FAMILIAR creature present in the sanctum,
 * named with: SIZE-CLASS + species + position + a "quietly doing
 * nothing" beat. 18-28 words. The familiar is contented and motionless
 * or near-motionless — it lives here.
 *
 * Voice: matter-of-fact wildlife-illustrator prose. The familiar isn't
 * performing for the viewer; it's resting in its spot.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/cozy_arcane_signature_familiar.json',
  total: 100,
  batch: 50,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} SIGNATURE-FAMILIAR descriptions for DragonBot's cozy-arcane path. Each entry is ONE familiar creature in the wizard's sanctum, described in 18-28 words. Voice: literary-fantasy, matter-of-fact, the familiar is RESTING in its spot.

━━━ THE SHAPE OF EVERY ENTRY ━━━

"A [SIZE-CLASS] [species] [position/posture], [one specific quietly-contented detail]."

Four required ingredients in each entry:
1. SIZE-CLASS — front-loaded as the FIRST descriptor: "palm-sized" / "mouse-sized" / "bird-sized" / "cat-sized" (ALWAYS hyphenated, ALWAYS a size-comparison)
2. SPECIES — what it is (cat / owl / pseudo-dragon-cat / book-imp / hedgehog / spirit-fox / dragon-cat / hatchling-dragon / glow-beetle / wisp-pet / shadow-cat / tree-frog / spell-bound bee)
3. POSITION — where it is in the room (on the mantlepiece / on the hearthstone / nestled in an herb-basket / on the highest shelf / on the inhabitant's shoulder / inside a teacup / in the mirror's reflection)
4. CONTENTED-BEAT — one quietly-still detail (blinking slowly with half-lidded eyes / curled deeply with wings folded / hovering in slow contented suspension / ears folded in comfortable sleep)

━━━ VARIETY MANDATE — distribute the ${n} entries across these familiar families ━━━

- ~20% CATS / CAT-LIKES (book-cat / shadow-cat / spirit-cat / dragon-cat / scribe-cat / archive-cat / tortoiseshell book-cat / smoke-cat)
- ~15% SMALL DRAGONS / DRAKES (palm-sized hatchling dragon / pseudo-dragon / pseudo-dragon-cat / small drake on the hearth / mouse-sized fire-drake / palm-sized ice-drake / shoulder-drake)
- ~10% OWLS / RAVENS / CORVIDS (tawny owl on the highest shelf / silhouetted raven at the frost-window / spotted owlet in a teacup / messenger-raven on a brass perch / crow on a candle-spike)
- ~10% IMPS / SPRITES / WISPS (book-imp peering between grimoires / blue-flame sprite on a tallow candle / wisp-pet orbiting the desk / library-imp on a quill-cup / shelf-imp asleep in a teapot)
- ~10% AMPHIBIANS / REPTILES (tree-frog clinging to a vine / wise-toad in a moss-bowl / desert-gecko on the warm sill / iridescent tower-frog in a jar / rune-snake on the hearthstone / mossback-newt in a stoneware dish)
- ~10% RODENTS / SMALL MAMMALS (ribbon-collared mouse in a teacup / hedgehog in an herb-basket / squirrel-familiar on a rafter / dormouse asleep in an inkwell-cap / book-mouse on a folio corner)
- ~10% SPIRIT / SHADOW / ETHEREAL FAMILIARS (spirit-fox in the mirror / smoke-fox by the hearth / shadow-cat stretching along the wall / mirror-hare just behind the glass / ghost-moth circling the candle)
- ~7% INSECTS / TINY-WINGED (luminous moth circling a candle / glow-beetle on an open tome / spell-bound bee in a jar / iridescent dragonfly resting on a quill / fire-mantis on a hearthstone)
- ~5% UNUSUAL / RARER FAMILIARS (paper-crane familiar that moved on its own / clockwork-mouse asleep beside the inkpot / bone-songbird on a rune-perch / tiny phoenix-chick on a warm hearth-tile / scroll-serpent woven from old parchment)
- ~3% MISC SPECIES (small badger / desert-fennec / kit-fox / micro-elemental of stone / mossy familiar-snail on a shelf-edge)

━━━ POSE LANGUAGE — what good looks like ━━━

GOOD pose phrasings (mirror these — quiet, motionless or barely moving):
  • "blinking slowly with half-lidded amber eyes"
  • "curled deeply in the inhabitant's lap, its small scaled wings folded flat"
  • "tucked between dried lavender and rosemary sprigs"
  • "its translucent ember-colored tail curling and uncurling around its delicate paws"
  • "drowsy patience"
  • "asleep atop a precarious stack of tomes, one paw dangling loosely over the edge"
  • "utterly still, its shape crisp against the grey afternoon light"
  • "ears folded in comfortable sleep"
  • "its chin resting flat on the stone in satisfied stillness"
  • "hovering in slow contented suspension"
  • "stretching impossibly long across the plaster wall as the fire shifts"

━━━ BANS ━━━

- NO inhabitant in the familiar description (no "as the wizard pets it" / no "the alchemist's gloved hand stroking its fur"). At most: "on the inhabitant's shoulder" / "in her lap" / "on his collar" as a PERCH.
- NO playful / leaping / mid-action poses (no "leaping" / no "pouncing" / no "darting"). The familiar is RESTING / WATCHING / DOZING.
- NO oversized creatures (no full-size dragons / no wolves / no bears). PALM-SIZED to CAT-SIZED only, always front-loaded.
- NO viewer-facing language ("looking at the camera" / "staring at you"). The familiar is unaware of the viewer.
- NO horror / monster register (no "bloodied" / no "skeletal" / no "vermin-like"). These are BELOVED companions — even spirit-foxes and shadow-cats read as quiet not menacing.
- NO famous-IP species (no Pikachu / no Hedwig / no Crookshanks). Use generic species descriptors.
- NO multi-familiar descriptions ("a cat and an owl together"). ONE familiar per entry.
- NO size-vague descriptors ("small" / "tiny" / "little") as the SIZE-CLASS. Use the hyphenated comparison: "palm-sized" / "mouse-sized" / "bird-sized" / "cat-sized".

━━━ MOOD ━━━

The familiar belongs here. It has its spot. It's not entertaining the wizard or the viewer. Whether it's a tortoiseshell book-cat or a spirit-fox glimpsed in a mirror, the read is "this creature has been resting in this same position for an hour, and will rest for another."

━━━ OUTPUT ━━━

JSON array of ${n} strings, 18-28 words each. No preamble. No numbering. Each starts with the size-class: "A palm-sized..." / "A cat-sized..." / "A bird-sized..." / "A mouse-sized...".`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
