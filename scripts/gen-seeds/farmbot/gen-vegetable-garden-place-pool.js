#!/usr/bin/env node
/**
 * FarmBot — vegetable_garden_place bespoke pool ("Garden Vegetable Patch
 * Tending" path).
 *
 * Path-bespoke (not a shared cross-path pool) — this path's own signature
 * hero-setting axis, same pattern as POND_PLACE, VILLAGE_STREET_PLACE,
 * LAKESIDE_RIVERSIDE_PLACE, FISHING_DOCK_PLACE, ORCHARD_AFTERNOON_PLACE.
 *
 * WHY a bespoke pool was needed (checked before writing, per the build
 * brief — this path was flagged as a likely reuse-only candidate, same as
 * spring-planting-day, but a direct content review found a real gap):
 * WORLD_DETAIL_PROPS's 19 "garden"-tagged entries are almost entirely a
 * DECORATIVE FLOWER/COTTAGE-GARDEN register (lavender, foxglove, rose
 * arches, wind chimes, birdhouses, bunting) — only 1/19 even mentions a
 * vegetable, and none describe raised beds, garden rows, a trellis, or a
 * scarecrow, all core to a working VEGETABLE patch. ACTIVITY's 12
 * chore+farm entries have no dedicated weeding/watering/vegetable-harvest
 * action either (closest is 2 strawberry-picking entries — a fruit, and
 * already thin). So this pool covers the vegetable-patch STRUCTURE itself
 * (raised beds/rows, trellises, ripe vegetables, tools, maybe a scarecrow)
 * as the hero, the same way FISHING_DOCK_PLACE covers the dock structure
 * distinct from the open water it sits beside.
 *
 * Distinct from WORLD_DETAIL_PROPS(garden) (flower/ornamental cottage
 * garden — kept for other paths) and from spring-planting-day (that path is
 * SEASON-LOCKED to spring and about the ACT of first planting bare soil
 * with seedlings; this pool is season-open and about an ESTABLISHED,
 * ONGOING vegetable patch — full leafy rows, ripe produce ready to pick,
 * weeds to pull — not freshly-turned bare soil).
 *
 * Guards baked in from today's lessons (FARMBOT_PATH_BUILD_STATE.md):
 *   - implied-crowd-language ban (banHumanLanguage catches explicit
 *     man/woman/person words but NOT "figures"/"hands"/"someone" — explicit
 *     ban added to the meta-prompt itself, same as village-street-wandering)
 *   - metaphorical-light-language trap ("coins of light" → literal coins on
 *     an orchard-afternoon render) — explicit literal-light-language rule
 *   - per-object-agency-framing trap (round river stones read as personified
 *     faces on lakeside-riverside-moment when framed with individual
 *     per-object action verbs) — explicit holistic-collection rule for any
 *     cluster of similar small objects (vegetables in a row, stakes, posts)
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_vegetable_garden_place.json'),
    total: 120,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct WORKING VEGETABLE GARDEN descriptions for a cozy
countryside anime bot — an established, well-tended vegetable patch as a rich, living little world
of its own, entirely through its physical details. The garden itself (or one specific part of it —
a raised bed, a row, a trellis) is ALWAYS the grammatical subject named FIRST in the sentence.

CRITICAL — this is a WORKING VEGETABLE patch, not a flower or ornamental garden. Lean into
VEGETABLE-GARDEN-hero imagery: raised wooden garden beds with weathered plank sides, neat rows of
leafy vegetables (bushy tomato plants heavy with red fruit, ruffled lettuce heads, feathery carrot
tops, curling pea tendrils, broad rhubarb leaves, plump orange pumpkins or squash sprawling along
the ground, tall stalks of corn, purple-topped beets, twisting bean vines), a rustic wooden trellis
or tepee of stakes strung with climbing peas or beans, a leaning scarecrow in patched clothes
watching over a row, a woven or wire garden fence keeping rabbits out, a well-used wooden wheelbarrow
holding a fresh vegetable harvest, a rustic garden tool (hoe, rake, trowel, watering can) leaning
against a bed or resting on the soil, a coil of hose looped near a spigot, a row of wooden plant
labels stuck in the dirt, dark rich soil between the rows, a scatter of fallen leaves or straw mulch,
a low picket fence bordering the plot, a rain barrel collecting runoff at one corner. Vary time of
day (misty dawn, bright midday, golden late-afternoon, soft dusk), season signal through the produce
itself (young leafy rows for early summer, heavy ripe fruit and full-grown vegetables for late summer
into autumn abundance), viewpoint (looking down the length of a row, close on one raised bed, a wide
view across several beds toward a trellis or scarecrow), and which physical detail leads.

CRITICAL — describe a cluster of similar small objects (a row of vegetables, a run of garden stakes,
a cluster of pumpkins) HOLISTICALLY as one arrangement or group — plain physical description only,
never an individual per-object action verb or personality given to any single piece (no "each tomato
seems to lean forward" or similar personifying phrasing for any one item in a cluster).

CRITICAL — describe light and atmosphere in plain, literal terms only (pools of light, patches of
light, a warm glow, soft light spilling across the leaves, sunlight glinting off wet soil) — NEVER a
metaphorical object-noun standing in for light (no "coins of light," "ribbons of gold," "scattered
gems of sun," or similar), since figurative light language can render as the literal object instead.

CRITICAL — this is a PLACE description with NO people in it at all, not even implied ones. Do NOT
mention: figures, crowd, riders, children, kids, bystanders, onlookers, laughter, faces, hands,
someone/anyone doing something, footprints (implies a walker just left), or any other word implying
a person is present or was recently present. A resting hoe or a filled wheelbarrow is fine (an object
left in place) — do not describe anyone having just set it down. A scarecrow is fine (it is not a
person, it is garden decor).

Output ONLY a JSON array of ${n} strings, no preamble, no numbering. 25-40 words each.

Examples:
["A raised wooden garden bed holds a tidy row of tomato plants heavy with ripening red fruit, their leaves glossy in the soft morning light, a battered tin watering can resting on the dark soil beside them.", "A rustic tepee of wooden stakes rises at the center of a garden row, climbing pea vines twisting up its length in full leaf, a wooden wheelbarrow half-filled with freshly pulled carrots parked in the soft grass nearby."]

🚫 STRICT BANS: NO named people/characters, NO implied people (figures/crowd/riders/children/kids/
bystanders/onlookers/laughter/faces/hands/footprints), NO readable text/signage/lettering/numbers of
any kind, NO brand names, NO photographer/camera-brand names, NO bare/empty garden lacking bed/row/
vegetable/tool detail, NO metaphorical light-as-object language, NO per-object personification within
a cluster of similar items, NO flower-only ornamental garden framing (lavender/roses/foxglove/wind
chimes/birdhouses — that belongs to the existing WORLD_DETAIL_PROPS garden entries), NO freshly-dug
bare soil with just-set seedlings as the sole subject (that belongs to spring-planting-day — this
pool is an established, leafy, ongoing patch, ripe and full, not a freshly planted one).

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
