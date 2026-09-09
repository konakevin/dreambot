#!/usr/bin/env node
/**
 * FarmBot — fall_campfire_evening_sky bespoke pool ("Fall Campfire Evening"
 * SEASONAL path, bot.seasonalPaths.fall — see FARMBOT_PATH_BUILD_STATE.md).
 *
 * This path's natural home for genuine time-of-day variety (dusk / blue hour
 * / full night with stars) — it's inherently an evening scene, so this axis
 * leans hard into that instead of the shared SEASON/WEATHER_ATMOSPHERE pools
 * (both skipped for this path; see the path-builder file's header note).
 *
 * CRITICAL — same dark+light contradictory-pairing ban as the fire pool
 * (FARMBOT_PATH_BUILD_STATE.md's fishing-dock lesson): a dark night sky is
 * described PLAINLY, never paired with a sparkle/glint/luminous/shimmer word
 * describing that same patch of sky.
 *
 * CRITICAL — metaphorical star-as-object language trap: never compare stars
 * to jewels/diamonds/glitter/confetti/coins. Plain, literal sky language
 * only.
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_fall_campfire_evening_sky.json'),
    total: 120,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct AUTUMN EVENING SKY descriptions for a cozy
countryside anime bot's campfire scene. This is a dedicated TIME-OF-DAY/SKY axis — describe
ONLY the sky and the quality of the fading/night light, nothing else (no fire, no people, no
ground-level scene content).

Draw from genuine variety across three evening stages, roughly a THIRD each:

DUSK (just after sunset): the sky still holding warm color low near the horizon — soft peach,
rose, or amber fading upward into deepening blue or violet; the first faint stars just barely
visible high overhead; a thin crescent moon low in a still-lit sky.

BLUE HOUR (deep twilight): the whole sky settled into a rich, deep blue or blue-violet, the
last warm color nearly gone from the horizon, silhouetted treetops or a distant roofline against
the fading light, a scatter of stars beginning to multiply.

FULL NIGHT: a clear dark sky thick with stars, a hazy pale band of the Milky Way, a bright full
or near-full moon riding high and casting cool pale light, drifting wisps of thin cloud crossing
in front of the stars, a single bright planet or star standing out low near the treeline.

Every entry should be a clean, self-contained sky/atmosphere description — plain, literal
language only.

CRITICAL — describe stars/moonlight in PLAIN language only ("a dark sky scattered with stars,"
"pale moonlight," "a wide spray of faint stars") — NEVER compare stars to jewels, diamonds,
glitter, confetti, coins, or fireflies (figurative light-as-object language reliably renders as
the literal object instead of the light it was meant to evoke — a documented failure mode on
this bot).

CRITICAL — NEVER pair "dark," "darkness," or "shadow" with a light-implying word ("glint,"
"sparkle," "shimmer," "luminous," "glow") describing the SAME patch of sky in one phrase (e.g.
"the darkness glowing softly with stars," "a shadowy sparkle overhead"). Describe the dark sky
plainly, and describe any stars/moonlight plainly and SEPARATELY, in two clean clauses rather
than one contradictory fused phrase — this exact pairing has rendered as a literal glowing
light-beam artifact cut into an otherwise normal scene on this bot before.

CRITICAL — this describes only the sky, with NO people, no campfire, no ground-level scene
content, and no readable text of any kind.

Output ONLY a JSON array of ${n} strings, no preamble, no numbering. 20-35 words each.

Examples:
["A clear dusk sky fades from soft peach along the horizon into deepening blue-violet overhead, the first faint stars just beginning to appear high above the treeline.", "The night sky sits dark and clear, scattered thick with stars, a pale hazy band of the Milky Way stretching faintly from one horizon to the other."]

🚫 STRICT BANS: NO named people/implied people, NO fire/campfire content (that's a separate
axis), NO readable text/signage, NO brand names, NO photographer/camera-brand names, NO
metaphorical star-as-object language (jewels, diamonds, glitter, confetti, coins, fireflies), NO
pairing of dark/darkness/shadow with a light-implying word describing the same patch of sky.

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
