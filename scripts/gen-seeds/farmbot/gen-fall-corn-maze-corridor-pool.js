#!/usr/bin/env node
/**
 * FarmBot — fall_corn_maze_corridor bespoke pool ("Fall Corn Maze" SEASONAL
 * path — farmbot-fall-corn-maze).
 *
 * SEASONAL path (see scripts/lib/botSeasonal.js) — architecturally separate
 * from FarmBot's normal 30-path rotation, drawn only during the Fall holiday
 * window via bot.seasonalPaths.fall, never mixed into bot.paths[]. This is
 * the HERO pool — the maze corridor itself, always named first in the
 * template per the ⭐ CROSS-CUTTING maxTokens lesson in
 * FARMBOT_PATH_BUILD_STATE.md (content late in a dense brief gets thinned/
 * dropped by Sonnet's fixed maxTokens:400 budget).
 *
 * CRITICAL DIFFERENTIATOR from harvest-festival.js's existing
 * HARVEST_FESTIVAL_PLACE pool: that pool treats a corn maze as ONE OF MANY
 * decorative festival-ground elements (hay bales, wheelbarrows of pumpkins,
 * scarecrows, a hay wagon) viewed as a wide establishing tableau. THIS pool
 * is entirely dedicated to being INSIDE the maze — the winding-path,
 * getting-lost, discovery narrative — tall corn walls flanking a narrow
 * path, forks, bends, dead ends, small clearings. Never a wide outside view
 * of the whole maze layout or a festival-grounds establishing shot.
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_fall_corn_maze_corridor.json'),
    total: 120,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct CORN MAZE CORRIDOR descriptions for a cozy
countryside anime bot — the inside of a hand-cut autumn corn maze, one specific stretch of its
winding paths. The maze CORRIDOR/PATH ITSELF is ALWAYS the grammatical subject named FIRST in
the sentence.

CRITICAL — this is a CLOSE, INSIDE-THE-MAZE view, never a wide outside view of the whole maze
layout and never a festival-grounds establishing shot with hay bales, wheelbarrows, or a wagon
in frame (that belongs to a different scene already built for this bot). Tall, rustling corn
stalk walls press close on either side of a narrow path — the walls are always described as
TALL and CLOSE, never distant or small in frame. Vary which specific maze-architecture beat
leads: a fork where the path splits two directions, a sharp bend hiding what's around the
corner, a dead-end wall of stalks, a small round clearing at a crossing point where several
paths meet, a long straight stretch narrowing away into the distance, a low leafy archway cut
into the stalks marking a turn, a gentle rise in the packed dirt path revealing more corridor
beyond. Ground detail: a packed-dirt or straw-strewn path, scattered fallen leaves in copper and
gold, a light scattering of loose dried corn husks, the occasional small puddle from a recent
light rain reflecting the sky. Vary light quality across the day: bright midday sun slanting
between the stalks in warm stripes, soft golden late-afternoon light pooling low along the path,
a misty morning haze catching pale between the rows, warm dusk light deepening the gold at the
edges of the corridor.

CRITICAL — never pair "dark"/"darkness"/"shadow" with a light-implying word like "glint,"
"sparkle," "shimmer," "luminous," or "glow" describing the SAME thing (e.g. "a dark corridor
glinting with light," "shadows given a luminous sparkle"). That contradictory pairing renders as
a literal glowing light-source or starry-night artifact cut into an otherwise daytime scene.
Describe any shaded or shadowed stretch of corridor plainly, with no light-word attached in the
same clause.

CRITICAL — describe light and atmosphere in plain, literal terms only (warm stripes of light,
a soft golden glow, dappled sunlight, pooling light) — NEVER a metaphorical object-noun standing
in for light (no "coins of light," "ribbons of gold," "scattered gems of sun," or similar),
since figurative light language can render as the literal object instead.

CRITICAL — this is a PLACE description with NO people in it at all, not even implied ones. Do
NOT mention: figures, crowd, riders, children, kids, bystanders, onlookers, laughter, faces,
hands, footprints (implies a walker just left), voices, or any other word implying a person is
present or was recently present. Describe only the corridor, its walls, the ground, and the
light.

Output ONLY a JSON array of ${n} strings, no preamble, no numbering. 25-40 words each.

Examples:
["Tall corn stalk walls press close on either side of a narrow packed-dirt path, curving gently out of sight around a bend ahead, warm midday light slanting between the stalks in bright stripes across scattered gold leaves.", "The maze path opens into a small round clearing where three narrow corridors meet, tall rustling walls of corn ringing the little space, dried corn husks scattered loosely across the straw-strewn ground in the soft late-afternoon light."]

🚫 STRICT BANS: NO named people/characters, NO implied people (figures/crowd/riders/children/
kids/bystanders/onlookers/laughter/faces/hands/footprints/voices), NO readable text/signage/
lettering/numbers of any kind, NO brand names, NO photographer/camera-brand names, NO wide
outside view of the maze layout, NO festival-grounds establishing shot (hay bales/wheelbarrows/
wagon/scarecrow — that belongs to a different scene), NO metaphorical light-as-object language,
NO dark+light contradictory pairing, NO jack-o-lanterns or carved pumpkin faces, NO costumes or
spooky/Halloween content (this is general Fall/harvest-season charm, not Halloween).

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
