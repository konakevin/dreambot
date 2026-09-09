#!/usr/bin/env node
/**
 * FarmBot — herd-group-scene path (Creature, MVP-25).
 *
 * A small group of the SAME/similar species that would naturally flock
 * together (a herd, flock, gaggle) — distinct from hero-animal-spotlight
 * (one hero animal) and farmyard-together (deliberately MIXED species).
 * Two pools: species-group (who) + setting (where). Action stays generic/
 * implicit in the species-group description itself (grazing, walking,
 * resting together) to keep this a simple 2-axis path.
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_herd_group_species.json'),
    total: 120,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct SMALL-HERD/FLOCK descriptions for a cozy
farm-life bot — 3-6 animals of the SAME species naturally grouped together
(a flock of sheep, a gaggle of geese, a cluster of hens, a small herd of
goats, a huddle of ducks, a group of piglets). For EACH entry: name the
species and group word, vary their individual coloring/markings slightly
so the group feels alive, and describe what they're doing TOGETHER (grazing
in a loose cluster, walking single-file, huddled dozing in the sun,
wading together). This description is the WHOLE scene subject — do not
mention setting/location (a separate axis handles that). 20-35 words each.
Examples:
["A small flock of six woolly sheep graze in a loose cluster, their fleece varying from cream to dove-grey, one lifting its head mid-chew to watch curiously.", "A gaggle of five white geese waddle single-file in a neat line, wings tucked, orange bills bobbing in unison as they follow their leader."]

🚫 STRICT BANS: NO named people/characters, NO setting/location details
(a separate axis handles WHERE), NO readable text or signage, NO brand
names, NO photographer/camera-brand names.

Output ONLY a JSON array of ${n} strings, no preamble, no numbering.`,
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
