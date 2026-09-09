#!/usr/bin/env node
/**
 * FarmBot — fall_corn_maze_atmosphere bespoke pool ("Fall Corn Maze"
 * SEASONAL path — farmbot-fall-corn-maze).
 *
 * Path-bespoke light/atmosphere axis — this path skips the shared SEASON
 * pool (its own bespoke content carries the Fall feel directly, same
 * pattern as the tropical paths skipping SEASON for their own climate) and
 * instead of WEATHER_ATMOSPHERE (whose entries describe a different whole
 * landscape that would compete with the maze corridor) gets its own small
 * pool covering daytime AND dusk light, INCLUDING the string-lights/
 * lanterns-marking-the-path beat named in the brief.
 *
 * LIVE RISK BAKED IN AT SOURCE (per the build brief): describing warm
 * string lights/lanterns at dusk near tall corn walls is exactly the
 * documented dark+light contradictory-pairing trap (a "dark corridor" paired
 * with "glow"/"sparkle"/"shimmer"/"luminous" in the same clause rendered as
 * a literal glowing light-source/starry-night artifact on a different
 * FarmBot path tonight) — every entry describes lights PLAINLY, never
 * contrasted against "dark"/"darkness"/"shadow" describing the same thing.
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_fall_corn_maze_atmosphere.json'),
    total: 120,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct LIGHT/ATMOSPHERE descriptions for a corn maze
scene in a cozy countryside anime bot's Fall content — the light and air quality inside a corn
maze, described in plain physical terms. The light/atmosphere quality is the grammatical subject
named FIRST in the sentence.

Cover a MIX of two kinds, roughly HALF each:

(A) DAYTIME: crisp autumn air with a faint sweetness, bright midday sun slanting between the
corn stalks in warm stripes, soft golden late-afternoon light pooling low along the ground, a
gentle breeze rustling the tall stalks and setting them swaying, a light autumn mist catching
pale between the rows in early morning, a few loose leaves drifting down through slanted
sunbeams.

(B) DUSK, WITH WARM LIGHTING TOUCHES: describe warm string lights or small lanterns marking the
path PLAINLY and POSITIVELY — e.g. "warm string lights glowing softly along the path, strung
overhead between the stalks," or "a row of small lanterns set along the ground, their warm light
marking the way forward," or "strings of warm amber lights woven along the tops of the corn
stalks, glowing gently as the sky deepens toward dusk." The lights are always a clear, plain,
positive light source — never contrasted against darkness in the same sentence.

CRITICAL — NEVER pair "dark"/"darkness"/"shadow"/"night" with a light-implying word like
"glint," "sparkle," "shimmer," "luminous," or "glow" describing the SAME thing (e.g. "the dark
path lit by a luminous sparkle," "shadows glinting with light"). This exact contradictory
pairing renders as a literal glowing light-source or starry-night artifact cut into an otherwise
daytime scene. If describing dusk, describe the SKY as deepening/softening in color (dusky blue,
warm rose, deep amber) and describe the string lights/lanterns as a separate, plain, warmly-glowing
detail — never combine a "dark" word and a "glow" word to describe the very same patch of the
scene.

CRITICAL — describe light in plain, literal terms only (a warm glow, soft light, glowing
lanterns, warm amber light) — NEVER a metaphorical object-noun standing in for light (no "coins
of light," "ribbons of gold," "scattered gems," or similar).

CRITICAL — this is an ATMOSPHERE/LIGHT description with NO people in it at all, not even implied
ones. Do NOT mention figures, crowd, riders, children, kids, bystanders, faces, hands, voices, or
any word implying a person is present.

Output ONLY a JSON array of ${n} strings, no preamble, no numbering. 20-35 words each.

Examples:
["Crisp autumn air carries a faint sweetness through the maze, bright midday sun slanting between the tall stalks in warm golden stripes across the path.", "Warm string lights glow softly along the path, strung overhead between the corn stalks, the sky above deepening into a soft dusky blue as evening settles in."]

🚫 STRICT BANS: NO named people/characters, NO implied people (figures/crowd/riders/children/
kids/bystanders/faces/hands/voices), NO readable text/signage, NO brand names, NO photographer/
camera-brand names, NO metaphorical light-as-object language, NO dark+light contradictory
pairing describing the same patch of scene, NO jack-o-lanterns or carved pumpkin faces, NO
costumes or spooky/Halloween content (this is general Fall/harvest-season charm, not Halloween).

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
