#!/usr/bin/env node
/**
 * FarmBot — fall_hayride_atmosphere bespoke pool ("Fall Hayride" SEASONAL
 * path, bot.seasonalPaths.fall, 2026-09-09).
 *
 * Path-bespoke — the fall LIGHT/WEATHER/AIR for the hayride scene. Built as
 * its OWN pool rather than reusing the shared SEASON pool (per the build
 * brief: "no need for the shared SEASON pool — hard-code fall atmosphere in
 * your own bespoke pools instead") so this path's time-of-day language can
 * never structurally contradict FARMBOT_LOOK_REGISTER (which is deliberately
 * time-of-day-free — see pools.js's HARD RULE comment) or double up against
 * whatever the FIELD pool already established.
 *
 * CRITICAL — "ALWAYS SUNNY" LESSON (FARMBOT_PATH_BUILD_STATE.md, 2026-09-09
 * post-1.2.0 review): several tropical bespoke place pools were found badly
 * skewed toward warm/golden/bright-sun language (one as lopsided as 81/120
 * warm vs. ZERO cool) BECAUSE each pool was that path's ONLY source of
 * atmosphere (tropical paths skip the shared WEATHER_ATMOSPHERE pool the
 * same way this path skips SEASON). This pool is written from scratch to
 * avoid that mistake: genuine variety across dawn/misty-morning/overcast/
 * golden-afternoon/dusk/rain, not "every entry is golden hour."
 *
 * Guards baked in from prior FarmBot lessons: dark+light contradictory-
 * pairing trap (explicit ban + wording rule below, same fix already proven
 * on farmbot_sugarcane_field_place.json / farmbot_fishing_dock_place.json),
 * implied-crowd-language ban, no metaphorical light-as-object language.
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_fall_hayride_atmosphere.json'),
    total: 120,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct AUTUMN LIGHT / WEATHER / AIR descriptions for a cozy
countryside anime farm bot's fall hayride scene. Each entry describes ONLY the atmosphere — the quality
of light, the sky, the air, the season's own physical touches (fallen leaves drifting, a crisp chill,
mist) — NEVER the wagon, the horse, a field's physical contents, or any person. The light/sky/air itself
is the grammatical subject named first.

CRITICAL — GENUINE VARIETY, NOT "ALWAYS SUNNY": distribute entries across ALL of these categories,
roughly evenly, not clustered on one:
  - CRISP GOLDEN AFTERNOON: warm autumn sun, a slight golden cast, clear air
  - SOFT MISTY MORNING: thin mist low over the ground, cool pale early light, dew still on the grass
  - PALE OVERCAST: a flat, even grey-white sky, soft shadowless light, no strong sun or glare
  - DUSK: fading amber-to-blue-violet light low on the horizon, the day's last warmth
  - COOL BLUE-GREY LATE AFTERNOON: high thin clouds, a cooler muted light, a hint of the evening chill
    to come
  - LIGHT AUTUMN RAIN: a fine, gentle drizzle, rain-damp air, a few scattered drops on leaves — never a
    storm or downpour
Every entry must also work the SEASON's own physical touches in naturally where fitting: a crisp chill
in the air, the smell implied only through visual cues (a light breeze scattering a few fallen leaves),
a light frost's sparkle on the grass at dawn, drifting leaves caught mid-air.

CRITICAL — never pair "dark," "darkness," or "shadow" with a light-implying word ("glint," "sparkle,"
"shimmer," "luminous," "glow") describing the SAME thing — that contradictory pairing has been shown to
render as a literal glowing light source or a starry-night patch cut into an otherwise daytime scene.
Frost or dew catching a sparkle in DAYLIGHT is fine (that's a light thing paired with a light word); the
banned pattern is specifically calling something "dark" or "shadowed" and ALSO giving that exact same
thing a glint/sparkle/shimmer/luminous/glow.

CRITICAL — describe light in plain, literal terms only — NEVER a metaphorical object-noun standing in
for light (no "coins of light," "ribbons of gold," "threads of amber"), since figurative light language
can render as the literal object instead.

CRITICAL — this is an ATMOSPHERE-ONLY description with NO people, NO wagon, NO horse, NO specific field
contents (no pumpkins, fences, farmhouses) in it at all — just sky, light, air, and the season's own
ambient touches (leaves, mist, frost, chill, drizzle).

Output ONLY a JSON array of ${n} strings, no preamble, no numbering. 20-35 words each.

Examples:
["Thin mist drifts low over the ground in the cool early light, dew still beaded on the grass, the sky
overhead a soft pale grey easing slowly toward blue.", "Warm golden autumn sunlight slants low and clear
across the scene, a crisp chill riding just beneath its warmth, a few loose leaves drifting lazily
through the still air."]

🚫 STRICT BANS: NO named people/characters, NO implied people, NO wagon, NO horse, NO specific field
objects (pumpkins/fences/farmhouses/cornstalks), NO readable text/signage of any kind, NO photographer/
camera-brand names, NO pairing of dark/darkness/shadow with a light-implying word describing the same
thing, NO metaphorical light-as-object language, NO storm/downpour/severe-weather language, NO snow
(this is fall, not winter), NO Halloween/spooky/costume content of any kind.

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
