#!/usr/bin/env node
/**
 * FarmBot — artisan_workshop_place bespoke pool ("Artisan Workshop" path).
 *
 * Path-bespoke (not a shared cross-path pool) — this path's own signature
 * hero-setting axis, same pattern as POND_PLACE, FLOWER_FIELD_PLACE,
 * HARVEST_FESTIVAL_PLACE, VILLAGE_STREET_PLACE, ORCHARD_AFTERNOON_PLACE,
 * WOODLAND_WALK_PLACE, LAKESIDE_RIVERSIDE_PLACE. A cozy INDOOR artisan's
 * workshop as the hero — a potter's wheel, a loom, wood-carving tools,
 * shelves of finished handmade goods (pottery, woven baskets, carved
 * figures). WORLD_DETAIL_PROPS has no dedicated workshop-interior coverage
 * (checked: zero entries mention wheel/loom/carving/kiln/clay), so a small
 * bespoke place pool is genuinely needed here, same reasoning as
 * village-street-wandering's own bespoke pool.
 *
 * Guards baked in from today's lessons (FARMBOT_PATH_BUILD_STATE.md):
 *   - implied-crowd-language ban (banHumanLanguage catches explicit
 *     man/woman/person words but NOT "figures"/"hands"/"someone" — explicit
 *     ban added to the meta-prompt itself, same as village-street-wandering)
 *   - metaphorical-light-language trap ("coins of light" → literal coins on
 *     an orchard-afternoon render) — explicit literal-light-language rule
 *   - per-object-agency-framing trap (round river stones read as personified
 *     faces on lakeside-riverside-moment when framed with individual
 *     per-object action verbs) — explicit holistic-collection rule for the
 *     shelves of finished pottery/baskets/carved figures
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_artisan_workshop_place.json'),
    total: 120,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct COZY ARTISAN WORKSHOP interior descriptions for a
cozy countryside anime bot — a warm indoor craft workshop as a rich, living little world of its
own, entirely through its physical details. The workshop (or one specific craft station/corner
within it) is ALWAYS the grammatical subject named FIRST in the sentence.

CRITICAL — this is about the WORKSHOP AND ITS CRAFT ATMOSPHERE as the hero, an indoor space full
of handmade-goods charm. Lean into workshop-hero imagery: a potter's wheel with a lump of wet clay
mid-shape and a bowl of water beside it, a wooden loom strung with warp threads and a half-finished
woven cloth still on it, a low carving workbench scattered with curled wood shavings and hand tools
(a mallet, chisels, a spokeshave), open shelves lined with finished handmade goods (glazed pottery
bowls and vases in earthy glazes, tightly woven baskets, small carved wooden figures and animals),
skeins of dyed yarn coiled in baskets or hung from pegs, a small clay kiln or warm hearth glowing
gently in a corner, burlap sacks of raw clay, bundles of dried willow or reed for basket-weaving,
sawdust and wood curls scattered across worn floorboards, a wall of hanging tools, jars of glaze and
natural dye, a low wooden stool beside each station, warm lantern light or soft window light
falling across a workbench. Vary which craft station leads (sometimes the potter's wheel, sometimes
the loom, sometimes the carving bench, sometimes a wide shot centered on the shelves of finished
goods), time of day/light source, and which lush details lead.

CRITICAL — describe any collection of similar finished goods (a row of pottery, a stack of baskets,
a cluster of carved figures) HOLISTICALLY as one arrangement or group — plain physical description
only, never an individual per-object action verb or personality given to any single piece (no "each
bowl seems to lean" or similar personifying phrasing for any one item in a cluster).

CRITICAL — describe light and atmosphere in plain, literal terms only (pools of light, patches of
light, a warm glow, soft light spilling across a surface) — NEVER a metaphorical object-noun
standing in for light (no "coins of light," "ribbons of gold," "scattered gems of sun," or similar),
since figurative light language can render as the literal object instead.

CRITICAL — this is a PLACE description with NO people in it at all, not even implied ones. Do NOT
mention: figures, crowd, riders, children, kids, bystanders, onlookers, laughter, faces, hands,
someone/anyone doing something, footprints, or any other word implying a person is present or was
recently present at the station.

Output ONLY a JSON array of ${n} strings, no preamble, no numbering. 25-40 words each.

Examples:
["A potter's wheel sits centered in a pool of warm window light, a half-shaped clay bowl still spinning slick and wet upon it, a shallow bowl of water and a wooden rib tool resting close at hand on the splattered worktable.", "Open pine shelves climb one whole wall of the workshop, crowded with finished glazed pottery in warm earthy tones, tightly coiled woven baskets, and small carved wooden animals arranged in a cheerful, unhurried jumble, morning light spilling softly across every shelf."]

🚫 STRICT BANS: NO named people/characters, NO implied people (figures/crowd/riders/children/kids/
bystanders/onlookers/laughter/faces/hands/footprints), NO readable text/signage/price tags/
lettering/numbers of any kind, NO brand names, NO photographer/camera-brand names, NO bare/empty
workshop lacking wheel/loom/carving-bench/shelf-of-goods detail, NO metaphorical light-as-object
language, NO per-object personification within a cluster of similar items, NO market-stall or
goods-for-sale-display framing (price boards, customer counters — this is a working craft space,
not a shop front).

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
