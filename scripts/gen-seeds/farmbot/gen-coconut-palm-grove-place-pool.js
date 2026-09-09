#!/usr/bin/env node
/**
 * FarmBot — coconut_palm_grove_place bespoke pool ("Coconut Palm Grove"
 * path, Phase 4: Tropical Farm, 2026-09-09).
 *
 * Path-bespoke (not a shared cross-path pool) — this path's own signature
 * hero-setting axis, same pattern as PINEAPPLE_FIELD_PLACE, MANGO_ORCHARD_PLACE,
 * BANANA_GROVE_PLACE. Required directly from its JSON in the path file, NOT
 * added to pools.js (shared file — a concurrent agent may be scaling other
 * shared pools, see FARMBOT_PATH_BUILD_STATE.md's Phase 4 coordination note).
 *
 * CRITICAL CREATIVE CONSTRAINT (Kevin, verbatim, Phase 4 kickoff): "the
 * important thing is that it still feels like a charming FARM since this is
 * FarmBot, just a tropical farm." This must read as a small, CULTIVATED,
 * NEAT-ROWED coconut palm grove a family or small crew tends by hand — NOT a
 * wild jungle, NOT a rainforest, NOT a desert-island survival scene. Same
 * cozy "I want to live there" energy as every other FarmBot path, just a
 * coconut crop instead of a temperate one. This meta-prompt bans jungle/
 * rainforest/wild/untamed/overgrown/desert-island/survival framing
 * explicitly and repeatedly, the same weight the other bespoke pools give
 * their own core constraint. Farm-appropriate touches baked in throughout:
 * a woven hammock, a wheelbarrow, husked coconuts in baskets, a machete or
 * harvest tool resting on a fence, a rustic ladder.
 *
 * SKIPS the shared SEASON pool entirely (tropical climate doesn't fit
 * FarmBot's 4-season framework, per Kevin's Phase 4 direction) and the
 * shared WEATHER_ATMOSPHERE pool too (its entries are temperate-seasonal —
 * spring drizzle, autumn haze, winter snow — any of which would directly
 * contradict a tropical grove; same "don't duplicate an axis another pool
 * already owns" principle orchard-afternoon.js documents). This pool must
 * carry its own warm/humid tropical atmosphere directly in every entry, the
 * same way PINEAPPLE_FIELD_PLACE and MANGO_ORCHARD_PLACE carry their own.
 *
 * Guards baked in from this session's lessons (FARMBOT_PATH_BUILD_STATE.md):
 *   - implied-crowd-language ban (banHumanLanguage catches explicit
 *     man/woman/person words but NOT "figures"/"hands"/"someone") — explicit
 *     ban added to the meta-prompt itself
 *   - metaphorical-light-language trap ("coins of light" rendered as literal
 *     gold coins) — explicit literal-light-language-only rule
 *   - per-object-personification trap (a cluster of round objects framed
 *     with individual per-object action verbs rendered as personified faces)
 *     — explicit holistic-collection rule for any cluster of similar small
 *     objects (coconuts in a basket, palm fronds, fence posts)
 *   - signage/label-concept hallucination trap (a "wooden plant labels"
 *     concept produced literal hallucinated numerals) — explicit ban on any
 *     label/marker/tag/sign CONCEPT, not just literal "sign" wording
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_coconut_palm_grove_place.json'),
    total: 120,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct SMALL, CULTIVATED, NEAT-ROWED TROPICAL COCONUT PALM
GROVE descriptions for a cozy countryside anime farm bot — a hand-tended coconut grove as a rich,
living little world of its own, entirely through its physical details. The grove itself (or one
specific part of it — a row, a section of trunks, a resting spot beneath the canopy) is ALWAYS the
grammatical subject named FIRST in the sentence.

CRITICAL — this is a real WORKING FARM PLOT, the tropical cousin of every other cozy grove/field this
bot has, NOT a wild jungle, NOT a rainforest, and NOT a desert-island survival scene. Every entry must
read as neat, tended, and personal/hand-crew scale: NEAT ROWS of tall, slender coconut palms with
graceful arching fronds, evenly spaced and clearly planted by hand rather than growing wild, clusters
of coconuts gathered high in each crown, clear worked-soil or grass paths between the rows wide enough
to walk down, a low wooden or woven fence marking the grove's edge. Weave in these FARM-APPROPRIATE
TOUCHES across the set (vary which ones lead in each entry — not every entry needs every prop): a
woven rope hammock strung between two trunks, a wheelbarrow resting along a row, husked coconuts
stacked or piled in a woven basket or wooden crate, a machete or long-handled harvest knife resting
against a fence post or leaned by a trunk, a rustic wooden ladder propped against a trunk. The grove
is SMALL and INTIMATE in scale — you can see its far edge, a nearby farmhouse roofline glimpsed as a
distant backdrop is fine, but the grove itself is always the tidy, orderly, CULTIVATED hero, never a
dense or overgrown or wild space. Vary time of day within a warm tropical window (bright high sun,
hazy warm late-afternoon glow, soft golden late light, cool early-morning light), viewpoint (looking
straight down one row, a wide view across several rows toward the grove's edge, close on one trunk's
cluster of coconuts overhead, from the row's end looking toward a fence post and resting hammock), and
which physical detail leads.

TROPICAL ATMOSPHERE — since this pool carries its own weather (no separate season/weather pick is
used with this path), bake warm, humid, tropical atmosphere directly into every entry: thick warm
sunlight, a faint shimmer of heat haze above the soil, humid air, the drone of unseen insects, dappled
light filtering through the arching fronds, warm earthy-sweet scent implied only through visual cues
(never state a smell directly — describe glistening husks, a few fallen fronds, instead).

CRITICAL — describe a cluster of similar small objects (a stack of husked coconuts, a run of arching
fronds, a row of trunks) HOLISTICALLY as one arrangement or group — plain physical description only,
never an individual per-object action verb or personality given to any single piece (no "each coconut
seems to peer out" or similar personifying phrasing for any one item in a cluster).

CRITICAL — describe light and atmosphere in plain, literal terms only (pools of light, patches of
light, a warm glow, sunlight glinting off waxy fronds, a shimmer of heat above the rows) — NEVER a
metaphorical object-noun standing in for light (no "coins of light," "ribbons of gold," "scattered
gems of sun," or similar), since figurative light language can render as the literal object instead.

CRITICAL — do NOT describe any plant label, marker, tag, stake-sign, or row-marker of any kind, even
a blank one — the CONCEPT of a label invites hallucinated readable text/numbers on a render even when
told "no text." Simple unmarked fence posts or rails are fine; anything framed as a LABEL or MARKER
for identifying a row or tree is not.

CRITICAL — this is a PLACE description with NO people in it at all, not even implied ones. Do NOT
mention: figures, crowd, riders, children, kids, bystanders, onlookers, laughter, faces, hands,
someone/anyone doing something, footprints (implies a walker just left), or any other word implying a
person is present or was recently present. A resting hammock, wheelbarrow, basket, or tool is fine (an
object left in place) — do not describe anyone having just set it down or lain in it.

Output ONLY a JSON array of ${n} strings, no preamble, no numbering. 25-40 words each.

Examples:
["Neat rows of tall slender coconut palms arch gracefully overhead in tidy lines under bright
tropical sun, a woven rope hammock strung low between two trunks, a wheelbarrow resting along the
worked-soil path at the row's end.", "A rustic wooden ladder leans against one broad trunk at the
edge of a coconut grove, its crown heavy with clustered fruit catching the warm late-afternoon glow, a
woven basket of husked coconuts sitting half-full beside a low wooden fence."]

🚫 STRICT BANS: NO named people/characters, NO implied people (figures/crowd/riders/children/kids/
bystanders/onlookers/laughter/faces/hands/footprints), NO readable text/signage/lettering/numbers/
plant labels/row markers of any kind, NO brand names, NO photographer/camera-brand names, NO wild
jungle/rainforest/dense-overgrown/untamed-wilderness framing of any kind, NO desert-island/survival/
castaway energy, NO thick undergrowth, NO towering jungle canopy, NO exploration/expedition/trekking
energy, NO bare/empty grove lacking row/fruit/prop detail, NO metaphorical light-as-object language,
NO per-object personification within a cluster of similar items, NO specific building as the hero (a
distant rooftop glimpsed at the edge is fine, a barn or house up close is not).

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
