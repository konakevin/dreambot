#!/usr/bin/env node
/**
 * FarmBot — mango_orchard_place bespoke pool ("Mango Orchard Harvest" path,
 * Phase 4: Tropical Farm, 2026-09-09).
 *
 * Path-bespoke (not a shared cross-path pool) — this path's own signature
 * hero-setting axis, same pattern as ORCHARD_AFTERNOON_PLACE
 * (orchard-afternoon), FLOWER_FIELD_PLACE (flower-field-wandering), and
 * HARVEST_FESTIVAL_PLACE (harvest-festival). See:
 * scripts/bots/farmbot/paths/mango-orchard-harvest.js
 *
 * CRITICAL creative constraint (Kevin, verbatim): "the important thing is
 * that it still feels like a charming FARM since this is FarmBot, just a
 * tropical farm." This is a small, hand-tended, cultivated mango orchard —
 * neat rows, personal/family/small-crew scale — NEVER a wild jungle or
 * rainforest-exploration aesthetic. See the strict bans below.
 *
 * CRITICAL — must read as a genuine tropical COUSIN of orchard-afternoon
 * (apple/pear/peach), not a re-skinned duplicate. Differentiators baked
 * into every entry:
 *   - Mango tree silhouette: a large, broad, dome/umbrella-canopied
 *     EVERGREEN tree with long, glossy, leathery, dark-green elliptical
 *     leaves — NOT the smaller deciduous apple/pear/peach silhouette.
 *   - Mango fruit hangs differently than apples: loose clusters dangling
 *     from long drooping stalks (panicles) beneath the leaf canopy, oval/
 *     kidney-shaped, skin blushed gold-red-green — NOT sitting directly
 *     clustered on branches or nestled loose in the grass the way apples do.
 *   - Mango-specific harvest tool: a long bamboo or wooden fruit-picking
 *     pole with a net catcher bag (and small blade) at the tip, used to
 *     reach high fruit and lower it gently without bruising — this tool has
 *     NO equivalent in the temperate apple-orchard pool and is the
 *     single most important differentiator. Still pair it with a wooden
 *     ladder and harvest baskets (per Kevin's brief) so the two paths share
 *     the same loving-orchard-harvest energy.
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_mango_orchard_place.json'),
    total: 120,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct TROPICAL MANGO ORCHARD descriptions for a cozy
countryside bot — a small, lovingly TENDED tropical mango orchard mid-harvest, as a rich, living
little world of its own, entirely through its physical details. The mango orchard itself is ALWAYS
the grammatical subject named FIRST in the sentence.

CRITICAL — THIS IS A CULTIVATED, HAND-TENDED FARM ORCHARD, NOT A WILD JUNGLE. Every entry must
read as neat, orderly, and cared-for by a family or small crew: evenly spaced rows of mango trees,
a swept or grass-worn earthen path running between the rows, trees pruned to a manageable
farm-orchard height. STRICTLY FORBIDDEN concepts and words: jungle, rainforest, wild, untamed,
wilderness, overgrown, dense undergrowth, tangled vines, thicket, forest floor, canopy of the
rainforest, exploration, trek. This must feel exactly as charming and cultivated as a real family
mango farm — never an exploration/adventure scene.

CRITICAL — MANGO TREES LOOK AND FRUIT DIFFERENTLY THAN APPLE/PEAR/PEACH TREES. Get the botany
right and lean into it as the visual signature: mango trees are LARGE, broad, dome- or
umbrella-shaped EVERGREEN trees with long, glossy, leathery, dark-green elliptical leaves (never
bare branches, never small blossom-covered branches like a temperate fruit tree). The ripe mangoes
themselves hang in loose clusters from long, drooping stalks beneath the leaf canopy — oval or
kidney-shaped fruit, skin blushed in warm gold, red, and green — dangling and swaying rather than
clustered directly along the branches or piled loose in the grass the way apples do.

CRITICAL — INCLUDE MANGO-SPECIFIC HARVEST TOOLS, not just generic orchard gear. Across the set,
feature: a long bamboo or wooden fruit-picking pole with a net catcher bag at its tip (used to
reach high fruit and lower it gently so it never falls and bruises) leaned against a trunk or held
mid-reach into the canopy; a sturdy wooden ladder propped against a broad trunk; woven or wooden
harvest baskets and low wooden crates brimming with just-picked mangoes; a wheelbarrow loaded with
fruit. Warm, dappled tropical light should filter down through the broad leaf canopy in patches
and pools across the orchard floor — humid, warm, golden-green tropical air. A few entries may
include a distant coconut palm or two at the orchard's edge to place it in a tropical climate, but
the mango trees and their neat rows must always remain the clear stars of the shot — this is a
mango orchard, not a palm grove.

Vary time of day (soft tropical morning, high humid midday, warm late-afternoon glow), angle
(looking down a row of trees, close beneath one heavy-laden tree, a wider view across several
rows), which harvest tools/props lead each shot, and how the fruit hangs and clusters.

CRITICAL — this is a PLACE description with NO people in it at all, not even implied ones. Do NOT
mention: figures, crowd, riders, children, kids, bystanders, onlookers, laughter, faces, hands,
someone/anyone doing something, footprints (implies a walker just left), or any other word
implying a person is present or was recently present. Describe only the trees, fruit, tools, path,
light, and air — a beautiful tended place with nobody in the frame yet.

CRITICAL — no metaphorical light language that could render as a literal object (no "coins of
light," no "jewels of light," no light "sparkling like gems/gold"). Use plain physical words
instead: "patches," "pools," "dapples," or "pockets" of light.

CRITICAL — do not give any individual round object (a single mango, a single fruit) its own
implied face, personality, or individual agency ("watching," "peeking," "smiling"). Describe fruit
and clusters collectively/holistically, never as an individually animated character.

CRITICAL — do not imply any readable label, tag, marker, or sign of any kind (no "labeled
crates," no "numbered baskets," no name placards on trees). If crates or baskets appear, they are
plain and unlabeled.

Output ONLY a JSON array of ${n} strings, no preamble, no numbering. 25-40 words each.

Examples:
["Broad-canopied mango trees stand in neat, evenly spaced rows, their long glossy dark-green
leaves catching warm humid midday light, clusters of gold-and-red-blushed mangoes dangling from
drooping stalks just above a bamboo picking pole leaned against the nearest trunk.", "A sturdy
wooden ladder rests against a heavy-laden mango tree, its broad dome of leathery leaves dappling
the swept earthen path below in warm pools of tropical afternoon light, a woven basket brimming
with ripe mangoes set at its foot."]

🚫 STRICT BANS: NO named people/characters, NO implied people (figures/crowd/riders/children/
kids/bystanders/onlookers/laughter/faces/hands/footprints), NO readable text/signage/labels, NO
brand names, NO photographer/camera-brand names, NO wild-jungle/rainforest/untamed/overgrown/vine-
tangled language of any kind, NO apple/pear/peach trees (this is specifically mango), NO bare or
empty orchard lacking fruit/tool/light detail, NO metaphorical light-as-object language, NO
per-fruit personification.

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
