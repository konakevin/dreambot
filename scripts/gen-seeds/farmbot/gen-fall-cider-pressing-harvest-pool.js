#!/usr/bin/env node
/**
 * FarmBot — fall_cider_pressing_harvest bespoke pool ("Fall Cider Pressing"
 * SEASONAL path). See gen-fall-cider-pressing-press-pool.js header for the
 * full path concept + sibling-path distinction notes.
 *
 * Secondary hero-support axis — the apples and cider VESSELS clustered
 * around the press: bushels/baskets of apples, crates, jugs and jars of
 * fresh-pressed cider. Deliberately NOT market-stall goods-for-sale framing
 * (that belongs to autumn-village-market) — this is a small family farm's
 * own harvest, being pressed at home, never displayed/priced/for sale.
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_fall_cider_pressing_harvest.json'),
    total: 120,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct FRESH-PRESSED CIDER HARVEST descriptions for a cozy
countryside anime bot — apples and cider vessels clustered around a small family farm's own
hand-cranked cider press, rendered as a rich, living little world entirely through physical objects.
The apples, basket, crate, jug, or jar is ALWAYS the grammatical subject named FIRST in the sentence.

CRITICAL — lean into HARVEST-VESSEL-hero imagery, vary which of these lead each entry: a woven
bushel basket brimming with red and green apples, a wooden crate stacked with just-picked apples, a
burlap sack slouched open with apples spilling gently from its mouth, a wheelbarrow loaded with
freshly picked apples, a large ceramic crock or wooden tub brimming with whole apples waiting to be
pressed, a glass jug of fresh amber-gold cider (plain, unlabeled, corked or capped), a stoneware jug
of cider, a row of mason jars filled with cider, a small stack of empty glass jars waiting to be
filled, a simple tin funnel resting on a barrel top, a wooden ladle, a scattering of loose apples in
the grass nearby, apple peels curling in a bowl, a pair of apples split open showing pale flesh. Vary
which fruit color leads (red/green/gold-blushed), which vessel leads, and time-of-day light.

CRITICAL — no labels, tags, markers, stickers, or any kind of writing/lettering/numerals on any jar,
jug, crate, or basket — describe them as plain, unmarked vessels only (a concept of a label or
marker, even non-literal, risks hallucinated readable text).

CRITICAL — this is a small family farm's OWN harvest at home, never a market/shop/stall display.
Do NOT describe anything arranged for sale, with prices, on a market stall or counter, or being
offered/sold to anyone.

CRITICAL — describe a cluster of similar small objects (a pile of apples, a row of jars, a stack of
crates) HOLISTICALLY as one arrangement — plain physical description only, never an individual
per-object action verb or personality given to any single piece.

CRITICAL — describe light and atmosphere in plain, literal terms only (pools of light, a warm glow,
sunlight catching the glass) — NEVER a metaphorical object-noun standing in for light (no "coins of
light," "ribbons of gold," "scattered gems of sun").

CRITICAL — never pair "dark"/"darkness"/"shadow" with a light-implying word ("glint," "sparkle,"
"shimmer," "luminous," "glow") describing the SAME thing. Describe any shadow or dark patch plainly,
with no light-word attached.

CRITICAL — this is a PLACE/OBJECT description with NO people in it at all, not even implied ones. Do
NOT mention: figures, crowd, pickers, hands, someone/anyone doing something, footsteps, or any other
word implying a person is present or was recently present. A basket resting in the grass is fine (an
object left in place) — do not describe anyone having just set it down.

CRITICAL — do NOT mention hay bales, corn stalks, a corn maze, scarecrows, pumpkins, jack-o-lanterns,
costumes, or any Halloween/spooky content.

Output ONLY a JSON array of ${n} strings, no preamble, no numbering. 25-40 words each.

Examples:
["A woven bushel basket brims with red and green apples piled high, a few loose ones scattered in the
grass beside it, morning light catching the dew still beaded on their skins.", "A row of plain glass
mason jars stands filled with fresh amber-gold cider along a weathered wooden shelf, sunlight passing
through the glass and pooling in warm gold light on the boards below."]

🚫 STRICT BANS: NO named people/characters, NO implied people (figures/crowd/pickers/hands/someone/
anyone/footsteps), NO readable text/labels/tags/stickers/lettering/numerals of any kind, NO brand
names, NO photographer/camera-brand names, NO market-stall/for-sale/priced framing, NO hay bales/corn
stalks/corn maze/scarecrows/pumpkins/jack-o-lanterns/costumes/spooky content, NO metaphorical
light-as-object language, NO per-object personification within a cluster of similar items, NO
dark+light contradictory pairing.

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
