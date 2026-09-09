#!/usr/bin/env node
/**
 * FarmBot — fall_cider_pressing_atmosphere bespoke pool ("Fall Cider
 * Pressing" SEASONAL path). See gen-fall-cider-pressing-press-pool.js
 * header for the full path concept + sibling-path distinction notes.
 *
 * The FARMYARD NOOK the press stands in, PLUS the warm harvest-season Fall
 * light/air/leaves atmosphere around it — combined into one axis since both
 * describe the same immediate surroundings. Deliberately a small, intimate
 * corner (a shaded spot by a wall, under one tree) — never a wide vista or
 * rows of orchard trees (that's orchard-afternoon's hero), never hay
 * bales/corn maze/pumpkins (that's harvest-festival's hero), never a market
 * street (that's autumn-village-market's hero).
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_fall_cider_pressing_atmosphere.json'),
    total: 120,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct FALL CIDER-PRESSING FARMYARD NOOK descriptions for a
cozy countryside anime bot — the small, intimate corner of a family farm where the cider press
stands, plus the warm harvest-season Fall light and air around it, rendered as a rich, living little
world entirely through physical detail. The setting or atmosphere detail is ALWAYS the grammatical
subject named FIRST in the sentence.

CRITICAL — this is a SMALL, intimate farmyard corner, not a wide vista. Lean into these: a shaded
nook against a weathered wood or fieldstone wall, a small open-sided lean-to or covered shed roof
overhead, a stone or packed-earth patio underfoot, a single old apple tree overhead with leaves
turning red and gold (never rows of trees — one tree only, as shade, not the subject), a low wooden
bench or a sawn tree-stump seat nearby, a rustic wood-plank fence at the edge, a wheelbarrow parked
off to one side, a folded woven picnic-style blanket resting on a bench, a knit scarf draped loosely
over a fence post, a pair of mittens tucked on a windowsill ledge, scattered fallen leaves (red, gold,
copper) drifting through the air or gathered in a loose drift on the ground, crisp cool morning air
with a faint drifting mist, golden late-afternoon light slanting low and warm, a cool blue-toned dusk
settling in, a warm patch of late-day sun pooling on the stones, a light breeze stirring the leaves
overhead. Vary time of day (misty morning, warm midday, golden late afternoon, soft early dusk) and
which physical/atmospheric detail leads.

CRITICAL — describe light and atmosphere in plain, literal terms only (pools of light, patches of
light, a warm glow, slanting sunbeams) — NEVER a metaphorical object-noun standing in for light (no
"coins of light," "ribbons of gold," "scattered gems of sun").

CRITICAL — never pair "dark"/"darkness"/"shadow" with a light-implying word ("glint," "sparkle,"
"shimmer," "luminous," "glow") describing the SAME thing. Describe any shadow or dark patch plainly,
with no light-word attached.

CRITICAL — describe a cluster of similar small objects (a drift of leaves, a row of fence posts)
HOLISTICALLY as one arrangement — plain physical description only, never an individual per-object
action verb or personality given to any single leaf/post/etc.

CRITICAL — this is a PLACE/ATMOSPHERE description with NO people in it at all, not even implied ones.
Do NOT mention: figures, crowd, hands, someone/anyone doing something, footsteps, or any other word
implying a person is present or was recently present. A folded blanket or a draped scarf is fine (an
object left in place) — do not describe anyone having just set it down or worn it.

CRITICAL — do NOT mention hay bales, corn stalks, a corn maze, scarecrows, pumpkins, jack-o-lanterns,
costumes, or any Halloween/spooky content (this is a warm harvest-season Fall scene, not Halloween).
Do NOT describe rows of fruit trees, an orchard, a market street/stall, cottages, or a village (those
belong to other paths) — this is one small farmyard corner only.

CRITICAL — no readable text, signs, labels, or lettering of any kind anywhere in the scene.

Output ONLY a JSON array of ${n} strings, no preamble, no numbering. 25-40 words each.

Examples:
["A shaded nook against a weathered fieldstone wall catches the golden late-afternoon light, a single
old apple tree overhead scattering red and gold leaves that drift slowly down onto the stone patio
below.", "Crisp cool morning air carries a faint mist across the small farmyard corner, a rustic
wood-plank fence at the edge dusted with a scattering of fallen copper leaves along its base."]

🚫 STRICT BANS: NO named people/characters, NO implied people (figures/crowd/hands/someone/anyone/
footsteps), NO readable text/signs/labels/lettering, NO brand names, NO photographer/camera-brand
names, NO hay bales/corn stalks/corn maze/scarecrows/pumpkins/jack-o-lanterns/costumes/spooky content,
NO rows of fruit trees/orchard-as-subject, NO market street/stall/cottages/village framing, NO
metaphorical light-as-object language, NO per-object personification within a cluster of similar
items, NO dark+light contradictory pairing.

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
