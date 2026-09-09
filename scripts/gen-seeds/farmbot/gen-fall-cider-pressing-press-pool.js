#!/usr/bin/env node
/**
 * FarmBot — fall_cider_pressing_press bespoke pool ("Fall Cider Pressing"
 * SEASONAL path, not part of the normal 30-path roster — see
 * FARMBOT_PATH_BUILD_STATE.md's seasonal-path section).
 *
 * MONEY-SHOT / hero-of-the-shot axis — the hand-cranked wooden cider press
 * APPARATUS ITSELF, always the grammatical subject named FIRST in each
 * entry. Per the ⭐ CROSS-CUTTING maxTokens lesson (botEngine.js callClaude
 * fixed at maxTokens:400, content late in a dense brief gets dropped/thinned
 * first), this pool's picks go FIRST in the path template, ahead of even the
 * character block.
 *
 * Kept deliberately distinct from FarmBot's existing autumn-flavored paths
 * (do NOT duplicate their hero content):
 *   - harvest-festival — hay bales, corn stalks/maze, scarecrows, pumpkins,
 *     a festive celebration mood. This pool never mentions any of that.
 *   - autumn-village-market — market-stall goods arranged for SALE. This
 *     pool is a small family farm's own working press, never a stall/
 *     display/for-sale framing.
 *   - orchard-afternoon — rows of fruit trees as the hero. This pool is
 *     about the press APPARATUS, not the orchard itself (at most a single
 *     tree may appear as incidental shade, never rows of trees as subject).
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_fall_cider_pressing_press.json'),
    total: 120,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct HAND-CRANKED WOODEN CIDER PRESS descriptions for a
cozy countryside anime bot — the press APPARATUS ITSELF is the hero of the shot, a charming,
old-fashioned, personal-scale piece of small-family-farm equipment (never industrial, never a large
commercial machine). The press (or one specific part of it — the crank, the screw, the basket, the
spout) is ALWAYS the grammatical subject named FIRST in the sentence.

CRITICAL — lean into PRESS-APPARATUS-hero imagery, vary which of these lead each entry: a traditional
wooden ratchet-and-screw press mounted on a sturdy oak frame, a barrel-style basket press bound with
iron hoops around slatted wooden staves, a thick wooden screw descending slowly into the press basket,
a big wooden or iron crank handle worn smooth from years of turning, golden-brown fresh cider
streaming or trickling from a wooden spout into a waiting vessel below, pale gold apple pomace packed
visibly in the press basket, a simple wooden drip tray or trough channeling the juice, weathered
gray-brown wood grain with a patina of years of gentle use, sturdy oak support beams, small iron
fittings and bolts, a worn rope or leather strap looped over a peg, a low wooden platform or stone
slab base the press stands on, a wooden bucket or tub positioned beneath the spout to catch the
stream. Vary angle (close on the crank and screw, a fuller view of the whole press, close on the
spout and dripping cider), time of day (soft morning light, warm midday, golden late-afternoon glow),
and which physical detail leads.

CRITICAL — never pair "dark"/"darkness"/"shadow" with a light-implying word ("glint," "sparkle,"
"shimmer," "luminous," "glow") describing the SAME thing (e.g. never "a dark glint of cider" or
"shadow given a luminous sparkle") — that exact contradictory pairing has rendered elsewhere as a
literal glowing light-source or starry-night artifact cut into an otherwise daytime scene. Describe
any shadow or dark patch of wood plainly, with no light-word attached.

CRITICAL — describe light and atmosphere in plain, literal terms only (pools of light, patches of
light, a warm glow, sunlight catching the wet wood) — NEVER a metaphorical object-noun standing in
for light (no "coins of light," "ribbons of gold," "scattered gems of sun" — figurative light
language can render as the literal object instead).

CRITICAL — if more than one similar small part or object appears together (bolts, hoops, staves,
drips), describe the cluster HOLISTICALLY as one arrangement — plain physical description only,
never an individual per-object action verb or personality given to any single piece.

CRITICAL — this is an OBJECT/APPARATUS description with NO people in it at all, not even implied
ones. Do NOT mention: figures, crowd, hands, someone/anyone doing something, footsteps, a person
turning/cranking/loading it right now, or any other word implying a person is present or was recently
present. Describe the press mid-use only in terms of its OWN physical state (cider actively
streaming, the screw partway down, the basket full of pomace) — never a person operating it.

CRITICAL — no readable text, labels, signage, brand marks, or lettering of any kind anywhere on the
press or its fittings.

CRITICAL — do NOT mention hay bales, corn stalks, a corn maze, scarecrows, pumpkins, jack-o-lanterns,
costumes, or any Halloween/spooky content (this is a warm harvest-season Fall scene, not Halloween,
and hay-bale/pumpkin/scarecrow imagery belongs to a different path). Do NOT describe rows of fruit
trees or an orchard as the scene's subject — at most a single nearby tree may be mentioned in
passing, never the orchard itself as the hero.

Output ONLY a JSON array of ${n} strings, no preamble, no numbering. 25-40 words each.

Examples:
["A sturdy wooden ratchet-and-screw press stands on a low stone slab, its thick oak screw descending
into a slatted basket packed with pale gold apple pomace, cider trickling in a thin steady stream
from the spout into a tin bucket below.", "The press's big wooden crank handle, worn smooth and
honey-colored from years of turning, catches the warm afternoon light beside iron hoops bound tight
around the barrel-style basket, a last few drops of amber cider still beading at the spout."]

🚫 STRICT BANS: NO named people/characters, NO implied people (figures/crowd/hands/someone/anyone/
footsteps/a person actively operating it), NO readable text/labels/signage/lettering, NO brand names,
NO photographer/camera-brand names, NO industrial/commercial/large-scale machinery language, NO hay
bales/corn stalks/corn maze/scarecrows/pumpkins/jack-o-lanterns/costumes/spooky content, NO rows of
fruit trees or orchard-as-subject framing, NO metaphorical light-as-object language, NO per-object
personification within a cluster of similar items, NO dark+light contradictory pairing.

Output ONLY the JSON array, no preamble, no numbering.`,
  },
];

async function main() {
  for (const r of RECIPES) {
    console.log(`\n=== ${path.basename(r.outPath)} ===`);
    await generatePool(r);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
