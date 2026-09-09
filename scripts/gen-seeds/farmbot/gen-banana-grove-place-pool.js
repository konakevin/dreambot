#!/usr/bin/env node
/**
 * FarmBot — banana_grove_place bespoke pool ("Banana Grove Path", Phase 4:
 * Tropical Farm, 2026-09-09).
 *
 * Path-bespoke (not a shared cross-path pool) — this path's own signature
 * hero-setting axis, same pattern as POND_PLACE (summer-evening-by-the-pond),
 * ORCHARD_AFTERNOON_PLACE (orchard-afternoon), and WOODLAND_WALK_PLACE
 * (woodland-walk). A small, tended grove of banana trees with their huge
 * distinctive leaves, dappled tropical light filtering through, hanging
 * bunches of bananas ready for harvest, a wheelbarrow or harvest basket, and
 * a worn dirt path winding through.
 *
 * CRITICAL CREATIVE CONSTRAINT (Kevin, verbatim, FARMBOT_PATH_BUILD_STATE.md
 * Phase 4 section): "the important thing is that it still feels like a
 * charming FARM since this is FarmBot, just a tropical farm." This grove is
 * a real, small, cultivated, hand-tended plot a family or small crew works
 * by hand — neat rows, a worn dirt footpath, evidence of care and harvest
 * (a wheelbarrow, a basket) — NEVER wild/untamed/overgrown jungle or
 * rainforest-exploration territory. The words "jungle," "rainforest,"
 * "wild," "untamed," "wilderness," and "overgrown" are banned from the
 * generator's OWN output below — not as a Flux negative-prompt (negation
 * doesn't work on Flux, see CLAUDE.md), but as a vocabulary constraint on
 * this Sonnet seed-generation call itself, so those words can never even
 * reach the pool file in the first place.
 *
 * Reuses the established anti-pattern bans from gen-flower-field-place-pool.js
 * (the template for this file, per FARMBOT_PATH_BUILD_STATE.md instructions):
 *   - implied-crowd-language ban (figures/crowd/hands/footprints/etc.) —
 *     extended here with tropical-farm-labor words (workers, pickers,
 *     laborers, farmhands, harvesters) since a working grove more readily
 *     invites implied-labor language than an empty flower field does.
 *   - metaphorical-light-language ban (no "coins"/"jewels"/"beads" of
 *     light — see the orchard-afternoon "literal gold coins on the ground"
 *     bug in FARMBOT_PATH_BUILD_STATE.md; use "pools"/"patches"/"shafts" of
 *     light instead).
 *   - per-object-personification ban (describe clusters of leaves/bananas
 *     holistically, never with individual per-fruit/per-leaf agency verbs —
 *     see the lakeside-riverside-moment personified-rock-faces bug).
 *   - signage/label-concept ban (no crate labels, row markers, tally marks,
 *     stakes, signs of any kind — see the garden-vegetable-patch-tending
 *     hallucinated-numerals bug).
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_banana_grove_place.json'),
    total: 120,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct SMALL, TENDED BANANA GROVE descriptions for a
cozy tropical-farm bot — a small, cultivated grove of banana trees as a rich, living little world
of its own, entirely through its physical details. The banana grove itself is ALWAYS the
grammatical subject named FIRST in the sentence.

CRITICAL — CHARMING FARM, NOT WILD JUNGLE. This is a real, small, hand-tended banana plot that a
family or a small crew works by hand — neat, hand-planted rows of trees, a worn dirt footpath
winding between them, clear evidence of ongoing care and harvest (a wooden wheelbarrow, a woven
harvest basket, a pair of pruning shears leaning against a trunk, a coil of twine, a watering can).
This must read as personal, cultivated, working-farm scale, the same cozy "I want to live there"
feeling as any other tended field or orchard — NEVER as an untamed, overgrown, dense, or
unexplored wild space. Do not use the words "jungle," "rainforest," "wild," "untamed,"
"wilderness," "overgrown," or "unexplored" anywhere in your output.

Lean into the grove's specific hero imagery: the huge, broad, distinctively paddle-shaped banana
leaves (some split and tattered by wind into long ribbons, in the natural way banana leaves do),
thick bunches of green or ripening yellow bananas hanging in curved clusters from arched flower
stalks, dappled tropical light filtering down in soft moving pools and patches through the leaf
canopy overhead, the worn dirt path threading between the neat rows, a wheelbarrow or wicker
harvest basket resting near the path (empty or holding a few just-cut bunches), warm humid air,
maybe a low wooden fence rail or a scattering of fallen leaves under a trunk. Vary time of day
(soft early-morning mist, bright midday dapple, warm late-afternoon light), angle (looking down the
winding path, a wide view across the rows, close along a curtain of broad leaves), how ripe the
visible bananas are, and which grove detail leads the sentence.

CRITICAL — this is a PLACE description with NO people in it at all, not even implied ones. Do
NOT mention: figures, crowd, workers, pickers, laborers, farmhands, harvesters, riders, children,
kids, bystanders, onlookers, laughter, faces, hands, someone/anyone doing something, footprints
(implies a walker just left). Describe only the grove, trees, leaves, bananas, path, tools, light,
and air — a beautiful cultivated place with nobody in the frame yet (a character may be added
separately later by the render pipeline; your job is the empty grove itself).

CRITICAL — light must stay physically grounded. Describe dappled light as "pools," "patches," "
shafts," or "mottled light" — NEVER as "coins," "jewels," "beads," "sequins," or any other small
literal object, which risks Flux rendering that literal object scattered on the ground instead of
light.

CRITICAL — describe clusters of leaves or bananas holistically (as a group), never with individual
per-leaf or per-banana agency/action verbs (no "each leaf reaching," no "a banana peeking out") —
that phrasing risks Flux rendering individual fruit or leaves as if they have faces.

CRITICAL — no signs, labels, tags, markers, placards, or numbered/lettered stakes of any kind (a
plain unmarked wooden stake or fence post is fine; anything implying a WRITTEN label or marker on
it is not) — labeled objects risk Flux hallucinating garbled text or numerals onto them.

Output ONLY a JSON array of ${n} strings, no preamble, no numbering. 25-40 words each.

Examples:
["A small tended grove of banana trees stands in neat hand-planted rows, their huge paddle-shaped
leaves arching overhead in a rustling green canopy, warm midday light falling through in shifting
dappled patches onto a worn dirt path winding between the trunks.", "Thick bunches of ripening
bananas curve downward from arched flower stalks throughout a hand-tended grove, broad leaves
swaying gently in the humid air, a wooden wheelbarrow resting beside the dirt path with a few
freshly cut bunches loaded inside."]

🚫 STRICT BANS: NO named people/characters, NO implied people or labor (figures/crowd/workers/
pickers/laborers/farmhands/harvesters/riders/children/kids/bystanders/onlookers/laughter/faces/
hands/footprints), NO readable text/signage/labels/markers, NO brand names, NO photographer/
camera-brand names, NO bare/empty grove lacking leaf/light/fruit detail, NO metaphorical light
objects (coins/jewels/beads/sequins), NO per-leaf or per-banana personification, NO "jungle,"
"rainforest," "wild," "untamed," "wilderness," "overgrown," or "unexplored" wording of any kind —
this is always a small, cultivated, hand-tended farm plot.

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
