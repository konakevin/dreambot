#!/usr/bin/env node
/**
 * FarmBot — fall_hayride_field bespoke pool ("Fall Hayride" SEASONAL path,
 * bot.seasonalPaths.fall, 2026-09-09).
 *
 * Path-bespoke — the SURROUNDING autumn field/farmland the hay wagon rides
 * through (the wagon itself lives in farmbot_fall_hayride_wagon.json — a
 * separate pool so the hero prop and its environment can each be described
 * with full attention rather than crammed into one entry). Required directly
 * from its JSON in the path file, NOT added to pools.js.
 *
 * MUST be genuinely distinct from harvest-festival.js's HARVEST_FESTIVAL_PLACE
 * (decorated festival grounds — hay-bale maze, scarecrows, festival stalls)
 * and autumn-village-market.js (market-stall goods) and picnic-in-the-meadow.js
 * (a fixed picnic-blanket-in-open-meadow anchor) — this pool is specifically
 * open FARMLAND being ridden THROUGH: cut/golden fields, a dirt farm lane,
 * scattered autumn trees, a distant farmhouse roofline, split-rail fencing.
 * No picnic blanket, no festival decor, no market stalls, no maze.
 *
 * CRITICAL SCALE RISK (flagged by the build brief): an open-field concept is
 * this bot's single highest-risk setting for the documented "character tiny/
 * dwarfed within a sweeping landscape" bug (still present in 16/109 of the
 * shared CAMERA_COMPOSITION entries even after the 2026-09-09 source fix, per
 * a live scan — the path file applies its own manual filter on top of this).
 * This pool's own meta-prompt independently bans "vast/endless/sweeping/
 * towering/dwarfing" framing so the FIELD SETTING pool itself never
 * originates that language either — belt and suspenders.
 *
 * Guards baked in from prior FarmBot lessons (same list as the wagon pool):
 * implied-crowd-language ban, "horse keeper"-family occupational-noun trap
 * (irrelevant here — no horse in this pool, but keeping the discipline),
 * metaphorical-light trap, per-object-personification trap (a scattered
 * cluster of pumpkins/gourds resting in a field is a live risk for this —
 * explicit holistic rule below), dark+light contradictory-pairing trap,
 * signage/label trap. TIME-OF-DAY/WEATHER is intentionally handled by a
 * SEPARATE bespoke pool (farmbot_fall_hayride_atmosphere.json) — this pool
 * stays purely physical/spatial (what's actually standing in the field), not
 * light/weather, so the two pools don't fight each other or double up.
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_fall_hayride_field.json'),
    total: 120,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct descriptions of an open AUTUMN FARM FIELD for a cozy
countryside anime farm bot's hayride path — the setting a hay wagon rides THROUGH. The field (or one
specific part of it — a stretch of cut stubble, the dirt lane, a fence line, a stand of trees at the
edge) is ALWAYS the grammatical subject named FIRST in the sentence. NO wagon, NO horse, NO people
anywhere — this pool is only ever the surrounding land itself; the wagon and any rider are added
separately, later, by the calling code.

CONTENT (mix and vary which detail leads across entries): golden/amber cut fields with pale stubble
rows, a well-worn dirt farm lane running between fields with soft wheel-rut lines already pressed into
it, scattered autumn trees at the field's edge (maple/oak, leaves turned red-orange-gold, a few fallen
leaves scattered on the ground), a simple low split-rail or weathered wooden fence marking a field's
boundary, a distant farmhouse or barn roofline glimpsed at the edge of the field (small in the frame,
never the hero), a scattering of plain uncarved pumpkins or gourds resting in the grass at a field's
edge (harvest produce only — never carved, never jack-o-lanterns, never any face or expression), a
lone weathered wooden fence post, tall dried cornstalk bundles standing upright at a field's edge.

CRITICAL — SCALE: this is a SMALL, INTIMATE, human-scale farm field — you can see its far edge, a
nearby fence line or farmhouse roofline is fine as a backdrop, but keep everything grounded and
approachable. NEVER use "vast," "endless," "sweeping," "towering," "sprawling," or any language framing
the field as an overwhelming or dwarfing expanse — this is a cozy, walkable, personal farm field, not a
colossal landscape.

CRITICAL — describe any cluster of similar small objects (a scatter of pumpkins/gourds, a bundle of
cornstalks, a row of fence posts) HOLISTICALLY as one arrangement or group — plain physical description
only, never an individual per-object action verb or personality given to any single piece.

CRITICAL — describe light and atmosphere in plain, literal terms only if mentioned at all (this pool
should stay mostly light-neutral since a separate pool owns time-of-day/weather) — if you do mention
light, use plain literal phrasing (sunlight, a warm glow) NEVER a metaphorical object-noun standing in
for it (no "coins of light," "ribbons of gold").

CRITICAL — never pair "dark," "darkness," or "shadow" with a light-implying word ("glint," "sparkle,"
"shimmer," "luminous," "glow") describing the SAME thing.

CRITICAL — do NOT describe any sign, plaque, marker, or any kind of lettered/numbered surface anywhere
in the field, even a blank one.

CRITICAL — this is a PLACE description with NO people in it at all, not even implied ones. Do NOT
mention: figures, crowd, riders, children, kids, bystanders, onlookers, laughter, faces, hands, someone/
anyone doing something, or footprints (implies a walker just left).

Output ONLY a JSON array of ${n} strings, no preamble, no numbering. 25-40 words each.

Examples:
["A stretch of cut golden field opens out in pale amber stubble rows, a weathered split-rail fence
tracing its far edge, a stand of maple trees just beyond turned deep red and gold.", "A well-worn dirt
farm lane runs straight between two fields, soft wheel-rut lines already pressed into the packed earth,
a scattering of plain round pumpkins resting in the grass at one edge."]

🚫 STRICT BANS: NO named people/characters, NO implied people (figures/crowd/riders/children/kids/
bystanders/onlookers/laughter/faces/hands/footprints), NO wagon, NO horse, NO readable text/signage/
lettering/numbers of any kind, NO brand names, NO photographer/camera-brand names, NO "vast"/"endless"/
"sweeping"/"towering"/"sprawling"/dwarfing-scale language, NO metaphorical light-as-object language, NO
per-object personification within a cluster of similar items, NO carved pumpkins/jack-o-lanterns/
Halloween/costume content of any kind (this is a general-fall path, not Halloween), NO specific building
close-up as the hero (a distant rooftop glimpsed at the edge is fine, a barn or farmhouse up close is
not).

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
