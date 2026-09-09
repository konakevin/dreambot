#!/usr/bin/env node
/**
 * FarmBot — papaya_guava_orchard_place bespoke pool ("Papaya & Guava
 * Orchard" path, Phase 4: Tropical Farm, 2026-09-09).
 *
 * Path-bespoke (not a shared cross-path pool) — this path's own signature
 * hero-setting axis, same pattern as PINEAPPLE_FIELD_PLACE, MANGO_ORCHARD_
 * PLACE, SUGARCANE_FIELD_PLACE, TROPICAL_FLOWER_GARDEN_PLACE. Required
 * directly from its JSON in the path file, NOT added to pools.js (shared
 * file — per FARMBOT_PATH_BUILD_STATE.md's Phase 4 coordination note, keep
 * tropical path work off shared pool files).
 *
 * CRITICAL CREATIVE CONSTRAINT (Kevin, verbatim, Phase 4 kickoff): "the
 * important thing is that it still feels like a charming FARM since this is
 * FarmBot, just a tropical farm." This must read as a small, CULTIVATED,
 * MIXED-ROW papaya-and-guava orchard a family or small crew tends by hand —
 * NOT a wild jungle, NOT rainforest-exploration, NOT untamed wilderness.
 * Same cozy "I want to live there" energy as every other FarmBot path, just
 * tropical crops instead of temperate ones. This meta-prompt bans wild/
 * jungle/dense-wilderness/overgrown framing explicitly and repeatedly, the
 * same weight the other bespoke pools give their own core constraint.
 *
 * TWO-TREE BOTANY (the differentiator from the other tropical orchard
 * paths): papaya trees are TALL with a SINGLE slender unbranched trunk and
 * fruit clustered high near the crown just under the leaves — genuinely
 * hard to reach by hand, which is WHY a fruit-picking pole with a basket
 * attachment belongs in this pool. Guava trees are shorter, bushier,
 * multi-branched, with smaller round fruit within easy reach or a short
 * step-stool's reach. The pool should alternate which tree leads a given
 * entry (papaya row, guava row, or a mixed view of both) so the "mixed
 * rows" premise reads as genuinely mixed, not papaya-with-guava-as-garnish.
 *
 * SKIPS the shared SEASON pool entirely (tropical climate doesn't fit
 * FarmBot's 4-season framework, per Kevin's Phase 4 direction) and the
 * shared WEATHER_ATMOSPHERE pool too (its entries are temperate-seasonal —
 * spring drizzle, autumn haze, winter snow — any of which would directly
 * contradict a tropical orchard). This pool must carry its own warm/humid
 * tropical atmosphere directly in every entry, the same way every sibling
 * tropical bespoke pool owns its own light/atmosphere instead of pulling a
 * separate pick.
 *
 * Guards baked in from prior lessons (FARMBOT_PATH_BUILD_STATE.md):
 *   - implied-crowd-language ban (banHumanLanguage catches explicit
 *     man/woman/person words but NOT "figures"/"hands"/"someone") —
 *     explicit ban added to the meta-prompt itself
 *   - metaphorical-light-language trap ("coins of light" rendered as literal
 *     gold coins on an orchard-afternoon render) — explicit literal-light-
 *     language-only rule
 *   - per-object-personification trap (round objects read as personified
 *     faces when framed with individual per-object action verbs) — explicit
 *     holistic-collection rule for any cluster of similar small objects
 *     (papayas clustered at a crown, guavas on a branch, fence posts)
 *   - signage/label-concept hallucination trap (a garden-vegetable pool's
 *     "wooden plant labels" produced literal hallucinated numerals on the
 *     stakes) — explicit ban on any label/marker/tag/sign CONCEPT, not just
 *     literal "sign" wording
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_papaya_guava_orchard_place.json'),
    total: 120,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct SMALL, CULTIVATED, MIXED-ROW TROPICAL PAPAYA-AND-
GUAVA ORCHARD descriptions for a cozy countryside anime farm bot — a hand-tended tropical orchard as
a rich, living little world of its own, entirely through its physical details. The orchard itself (or
one specific part of it — a papaya row, a guava row, the sorting table) is ALWAYS the grammatical
subject named FIRST in the sentence.

CRITICAL — this is a real WORKING FARM ORCHARD, the tropical cousin of every other cozy orchard this
bot has, NOT a wild jungle and NOT a rainforest-exploration scene. Every entry must read as neat,
tended, and personal/hand-crew scale.

BOTANY — this orchard grows TWO different fruit trees side by side in mixed rows, and entries should
vary which one leads:
  - PAPAYA TREES: tall, with a single slender unbranched trunk reaching well overhead, a crown of
    broad palmate leaves at the very top, and papayas clustered close together right beneath the
    crown, green to golden-yellow as they ripen. Because the fruit sits high, papaya rows pair
    naturally with a tall bamboo or wooden fruit-picking pole fitted with a small basket or net
    catcher at its end, propped against a trunk or held up into the crown.
  - GUAVA TREES: noticeably shorter and bushier, with several low spreading branches, smaller oval
    leaves, and round pale-green to yellow-green guavas growing in easy reach along the branches or
    just above head height — reachable by hand or with a low wooden step-stool set at the base of the
    tree.

FARM-APPROPRIATE TOUCHES to vary across entries: a tall picking pole with its basket attachment
resting against a papaya trunk, a low wooden step-stool at the foot of a guava tree, a woven harvest
basket sitting full or half-full in a row, a wheelbarrow parked at a row's end, a simple wooden
fruit-sorting table holding a few sorted papayas and guavas, a low wooden or woven fence marking the
orchard's edge, a coil of twine or a pruning knife resting on a post. The orchard is SMALL and
INTIMATE in scale — you can see its far edge, a nearby farmhouse roofline or a line of a few coconut
palms marking the boundary is fine as a distant backdrop, but the orchard itself is always the tidy,
orderly, CULTIVATED hero, never a dense or overgrown or wild space. Vary time of day within a warm
tropical window (bright high sun, hazy warm late-afternoon glow, soft golden late light), viewpoint
(looking straight down a papaya row toward its tall trunks, a wide view across mixed papaya-and-guava
rows, close on one guava tree's low branches, from the sorting table looking back down a row), and
which physical detail leads.

TROPICAL ATMOSPHERE — since this pool carries its own weather (no separate season/weather pick is
used with this path), bake warm, humid, tropical atmosphere directly into every entry: thick warm
sunlight, a faint shimmer of heat haze above the soil, humid air, the drone of unseen insects,
sun-bleached leaf tips, warm earthy-sweet ripe-fruit richness implied only through visual cues (never
state a smell directly — describe glistening fruit skin, dew beading on a leaf, instead).

CRITICAL — describe a cluster of similar small objects (papayas clustered at a crown, guavas along a
branch, a stack of crates) HOLISTICALLY as one arrangement or group — plain physical description only,
never an individual per-object action verb or personality given to any single piece (no "each papaya
seems to lean forward" or similar personifying phrasing for any one item in a cluster).

CRITICAL — describe light and atmosphere in plain, literal terms only (pools of light, patches of
light, a warm glow, sunlight glinting off waxy leaves, a shimmer of heat above the rows) — NEVER a
metaphorical object-noun standing in for light (no "coins of light," "ribbons of gold," "scattered
gems of sun," or similar), since figurative light language can render as the literal object instead.

CRITICAL — do NOT describe any plant label, marker, tag, stake-sign, or row-marker of any kind, even
a blank one — the CONCEPT of a label invites hallucinated readable text/numbers on a render even when
told "no text." Simple unmarked stakes, posts, fence rails, or the wooden sorting table itself are
fine (an object left in place) — do not describe anyone having just set it down.

CRITICAL — this is a PLACE description with NO people in it at all, not even implied ones. Do NOT
mention: figures, crowd, riders, children, kids, bystanders, onlookers, laughter, faces, hands,
someone/anyone doing something, footprints (implies a walker just left), or any other word implying
a person is present or was recently present. A resting hat, basket, pole, or tool is fine (an object
left in place) — do not describe anyone having just set it down.

Output ONLY a JSON array of ${n} strings, no preamble, no numbering. 25-40 words each.

Examples:
["Tall slender-trunked papaya trees stand in a neat row, their crowns of broad leaves holding tight
clusters of green-gold fruit high overhead, a bamboo picking pole with a small basket attachment
propped against the nearest trunk.", "A row of shorter, bushier guava trees spreads low branches heavy
with round pale-green fruit within easy reach, a wooden step-stool set at the base of one tree beside
a half-full woven harvest basket."]

🚫 STRICT BANS: NO named people/characters, NO implied people (figures/crowd/riders/children/kids/
bystanders/onlookers/laughter/faces/hands/footprints), NO readable text/signage/lettering/numbers/
plant labels/row markers of any kind, NO brand names, NO photographer/camera-brand names, NO wild
jungle/rainforest/dense-overgrown/untamed-wilderness/wild framing of any kind, NO thick undergrowth,
NO towering jungle canopy, NO exploration/expedition/trekking energy, NO bare/empty orchard lacking
row/fruit/tool detail, NO metaphorical light-as-object language, NO per-object personification within
a cluster of similar items, NO specific building as the hero (a distant rooftop or a few boundary
palm trees glimpsed at the edge is fine, a barn or house up close is not).

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
