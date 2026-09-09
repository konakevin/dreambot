#!/usr/bin/env node
/**
 * FarmBot — pineapple_field_place bespoke pool ("Pineapple Field Afternoon"
 * path, Phase 4: Tropical Farm, 2026-09-09).
 *
 * Path-bespoke (not a shared cross-path pool) — this path's own signature
 * hero-setting axis, same pattern as ORCHARD_AFTERNOON_PLACE, FLOWER_FIELD_PLACE,
 * LAKESIDE_RIVERSIDE_PLACE, VEGETABLE_GARDEN_PLACE. Required directly from its
 * JSON in the path file, NOT added to pools.js (shared file — a concurrent
 * agent is scaling other shared pools right now, see
 * FARMBOT_PATH_BUILD_STATE.md's Phase 4 coordination note).
 *
 * CRITICAL CREATIVE CONSTRAINT (Kevin, verbatim, Phase 4 kickoff): "the
 * important thing is that it still feels like a charming FARM since this is
 * FarmBot, just a tropical farm." This must read as a small, CULTIVATED,
 * ROW-PLANTED pineapple field a family or small crew tends by hand — NOT a
 * wild jungle, NOT rainforest-exploration, NOT untamed wilderness. Same cozy
 * "I want to live there" energy as every other FarmBot path, just tropical
 * crops instead of temperate ones. This meta-prompt bans wild/jungle/dense-
 * wilderness framing explicitly and repeatedly, the same weight the other
 * bespoke pools give their own core constraint.
 *
 * SKIPS the shared SEASON pool entirely (tropical climate doesn't fit
 * FarmBot's 4-season framework, per Kevin's Phase 4 direction) and the
 * shared WEATHER_ATMOSPHERE pool too (its entries are temperate-seasonal —
 * spring drizzle, autumn haze, winter snow — any of which would directly
 * contradict a tropical field; same "don't duplicate an axis another pool
 * already owns" principle orchard-afternoon.js documents). This pool must
 * carry its own warm/humid tropical-afternoon atmosphere directly in every
 * entry, the same way ORCHARD_AFTERNOON_PLACE carries its own golden-
 * afternoon light instead of pulling a SEASON pick.
 *
 * Guards baked in from today's lessons (FARMBOT_PATH_BUILD_STATE.md):
 *   - implied-crowd-language ban (banHumanLanguage catches explicit
 *     man/woman/person words but NOT "figures"/"hands"/"someone" — explicit
 *     ban added to the meta-prompt itself)
 *   - metaphorical-light-language trap ("coins of light" rendered as literal
 *     gold coins on an orchard-afternoon render) — explicit literal-light-
 *     language-only rule
 *   - per-object-personification trap (round river stones read as
 *     personified faces on lakeside-riverside-moment when framed with
 *     individual per-object action verbs) — explicit holistic-collection
 *     rule for any cluster of similar small objects (pineapples in a row,
 *     leaves on a crown, fence posts)
 *   - signage/label-concept hallucination trap (a garden-vegetable pool's
 *     "wooden plant labels" produced literal hallucinated numerals on the
 *     stakes) — explicit ban on any label/marker/tag/sign CONCEPT, not just
 *     literal "sign" wording
 *
 * TIME-OF-DAY/WEATHER REBALANCE (2026-09-09): a full-pool scan found this
 * pool the MOST skewed of any tropical path — 79/120 warm, ONLY 1 cool/
 * varied — matching Kevin's "always sunny" flag on FarmBot renders overall.
 * `total` bumped 120→158 with `append: true` to add a batch weighted
 * heavily toward dawn/misty-morning/overcast-midday/dusk/evening/night/
 * rain (see the TIME-OF-DAY/WEATHER block below). That block also carries a
 * permanent "going forward" requirement so any FUTURE scale-up of this pool
 * keeps genuine variety instead of regressing back to all-afternoon — if
 * this script is re-run again once the pool is already balanced, dial the
 * "≥85% cool" weighting back down to something more even before generating
 * another batch. Also bakes in the dark+light contradictory-pairing fix
 * (found and fixed on `farmbot_fishing_dock_place.json` the same night:
 * "dark glint of water" → Sonnet-escalated into a literal glowing light
 * source with visible stars in an otherwise-daytime scene) so new night/
 * moonlit entries here don't reintroduce it.
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_pineapple_field_place.json'),
    total: 158,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct SMALL, CULTIVATED, ROW-PLANTED TROPICAL PINEAPPLE
FIELD descriptions for a cozy countryside anime farm bot — a hand-tended pineapple field as a rich,
living little world of its own, entirely through its physical details. The field itself (or one
specific part of it — a row, a section of crowns) is ALWAYS the grammatical subject named FIRST in
the sentence.

CRITICAL — this is a real WORKING FARM FIELD, the tropical cousin of every other cozy field this
bot has, NOT a wild jungle and NOT a rainforest-exploration scene. Every entry must read as neat,
tended, and personal/hand-crew scale: NEAT ROWS of low, spiky-leaved pineapple plants running in
straight or gently curving lines, each plant's crown holding one ripening pineapple (green-gold to
deep golden-amber, ready or nearly ready for harvest), clear worked-soil or grass paths between the
rows wide enough to walk down, a woven harvest basket sitting full or half-full in a row, a straw
sun hat resting on a wooden fence post or a row stake, a low wooden or woven fence marking the
field's edge, maybe a wheelbarrow or a stack of empty crates at the row's end. When a small resting
object at a post feels right, rotate through genuine variety: a hand hoe or pruning knife (these are
the DEFAULT tool choices — favor them), a coiled length of rope, canvas work gloves, a whetstone, a
ball of twine, or a small piece of ambient wildlife (a gecko or lizard sunning itself, a dragonfly
or butterfly resting still, a small bird perched briefly, a small crab tucked at soil level). A
machete resting against a post is a fine occasional detail too, but a real over-repetition bug (fixed
2026-09-09) means it must stay a genuine minority — no more than about 1 in 10 entries, never the
default reach. The field is SMALL and INTIMATE in scale
— you can see its far edge, a nearby farmhouse roofline or a line of a few coconut palms marking
the boundary is fine as a distant backdrop, but the field itself is always the tidy, orderly,
CULTIVATED hero, never a dense or overgrown or wild space. Also vary viewpoint (looking straight down
one row, a wide view across several rows toward the field's edge, close on one crown's ripening
fruit, from the row's end looking toward a fence post) and which physical detail leads.

CRITICAL — TIME-OF-DAY / WEATHER (this batch is a REBALANCE — read carefully): the pool's existing
entries are almost entirely bright-sun and golden-afternoon, so THIS BATCH must draw AT LEAST 85% of
its entries from the COOL/VARIED categories below, and this requirement holds for any future scale-up
of this pool too — never let it drift back to all-afternoon. Every entry must fall into ONE of these
concrete categories:
  - DAWN: pale early light breaking low over the rows, long soft shadows stretching between the
    plants, the sky still holding cool color near the horizon
  - MISTY MORNING: thin ground mist drifting low between the rows, dew beaded on the spiky leaves and
    fruit skin, muted soft grey-green light
  - OVERCAST MIDDAY: a flat, even grey-white sky, soft shadowless light across the field, no strong
    sun or glare
  - DUSK: fading light, the sky deepening into blue-violet above the rows, only a last thin warm edge
    low on the horizon
  - EVENING: dim blue-grey light settling over the field, a farmhouse window's glow far off at the
    field's edge
  - NIGHT / MOONLIT: silvery moonlight washing over the rows, the pale glow of a full moon catching
    the ripening crowns, starlight described as its own clean phrase (see the critical wording rule
    below)
  - GENTLE RAIN: soft steady rain, rain-darkened leaves and soil, water beading and dripping off the
    spiky crown leaves — a fine warm-weather drizzle, never a storm or downpour
  - (a small remaining minority, if any, may use the bright-high-sun / hazy warm-afternoon / soft
    golden-late-light window this pool already has plenty of)

CRITICAL — NIGHT/MOONLIT WORDING (a real bug, just found and fixed on another FarmBot pool): never
pair "dark," "darkness," or "shadow" with a light-implying word ("glint," "sparkle," "shimmer,"
"luminous," "glow") describing the SAME thing — that contradictory pairing gets escalated by
Sonnet's brief-to-prompt rewrite into a literal glowing light source or a starry night patch cut
into an otherwise-daytime scene (confirmed real: "a dark glint of water" became "the darkness given
a gentle luminous sparkle," which rendered as a glowing vertical beam with visible stars slicing
through a foggy daytime scene — a literal split day/night artifact). Describe moonlight and darkness
compatibly instead — "silvery moonlight," "the pale glow of a full moon," "starlight" as its own
clean phrase — never "dark"/"darkness"/"shadow" plus a sparkle/glint/luminous/glow word describing
the same object.

TROPICAL ATMOSPHERE — since this pool carries its own weather (no separate season/weather pick is
used with this path), bake warm, humid, tropical-afternoon atmosphere directly into every entry:
thick warm sunlight, a faint shimmer of heat haze above the soil, humid air, the drone of unseen
insects, sun-bleached leaf tips, warm earthy-sweet ripe-fruit scent implied only through visual cues
(never state a smell directly — describe glistening fruit skin, a few fallen leaves, instead).

CRITICAL — describe a cluster of similar small objects (a row of pineapples, a run of spiky leaves,
a stack of crates) HOLISTICALLY as one arrangement or group — plain physical description only, never
an individual per-object action verb or personality given to any single piece (no "each pineapple
seems to lean forward" or similar personifying phrasing for any one item in a cluster).

CRITICAL — describe light and atmosphere in plain, literal terms only (pools of light, patches of
light, a warm glow, sunlight glinting off waxy leaves, a shimmer of heat above the rows) — NEVER a
metaphorical object-noun standing in for light (no "coins of light," "ribbons of gold," "scattered
gems of sun," or similar), since figurative light language can render as the literal object instead.

CRITICAL — do NOT describe any plant label, marker, tag, stake-sign, or row-marker of any kind, even
a blank one — the CONCEPT of a label invites hallucinated readable text/numbers on a render even when
told "no text." Simple unmarked stakes, posts, or fence rails are fine; anything framed as a LABEL or
MARKER for identifying a row or plant is not.

CRITICAL — this is a PLACE description with NO people in it at all, not even implied ones. Do NOT
mention: figures, crowd, riders, children, kids, bystanders, onlookers, laughter, faces, hands,
someone/anyone doing something, footprints (implies a walker just left), or any other word implying
a person is present or was recently present. A resting hat, basket, or tool is fine (an object left
in place) — do not describe anyone having just set it down.

Output ONLY a JSON array of ${n} strings, no preamble, no numbering. 25-40 words each.

Examples:
["Neat rows of spiky-leaved pineapple plants stretch in tidy lines under bright tropical afternoon
sun, each crown cradling one ripening golden-amber fruit, a woven harvest basket sitting half-full
at the near end of the row.", "A worked-soil path runs straight between two rows of low pineapple
plants, their crowns heavy with ripe fruit catching the warm late-afternoon glow, a straw sun hat
resting on a weathered wooden fence post at the field's edge."]

🚫 STRICT BANS: NO named people/characters, NO implied people (figures/crowd/riders/children/kids/
bystanders/onlookers/laughter/faces/hands/footprints), NO readable text/signage/lettering/numbers/
plant labels/row markers of any kind, NO brand names, NO photographer/camera-brand names, NO wild
jungle/rainforest/dense-overgrown/untamed-wilderness framing of any kind, NO thick undergrowth, NO
towering jungle canopy, NO exploration/expedition/trekking energy, NO bare/empty field lacking row/
fruit/tool detail, NO metaphorical light-as-object language, NO per-object personification within a
cluster of similar items, NO specific building as the hero (a distant rooftop or a few boundary palm
trees glimpsed at the edge is fine, a barn or house up close is not).

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
