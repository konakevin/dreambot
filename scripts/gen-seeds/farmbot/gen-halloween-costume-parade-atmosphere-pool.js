#!/usr/bin/env node
/**
 * FarmBot — halloween_costume_parade_atmosphere bespoke pool
 * ("Halloween Costume Parade" seasonal path, farmbot.seasonalPaths.halloween).
 *
 * Path-bespoke sky/light-mood pool — short atmosphere phrases layered on
 * TOP of the setting pool (which already carries its own decor/light
 * touches), giving late-afternoon-through-dusk time-of-day variety so every
 * render isn't locked to one identical moment. Deliberately does NOT
 * re-describe path objects/decor (that's the setting pool's job) — sky,
 * air, and overall light quality only, matching farmbot_weather_atmosphere's
 * short-phrase register.
 *
 * HARD BAN baked in (see FARMBOT_PATH_BUILD_STATE.md's fishing-dock lesson,
 * a documented cross-cutting trap): never pair "dark"/"darkness"/"shadow"
 * with a light-implying word ("glint"/"sparkle"/"shimmer"/"luminous"/"glow")
 * describing the same thing — Sonnet's rewrite of that exact pairing once
 * produced a literal glowing-beam/day-night-split artifact.
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_halloween_costume_parade_atmosphere.json'),
    total: 120,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct short SKY / LIGHT-MOOD phrases for a cute cozy
countryside anime bot's outdoor Halloween costume parade scene, set sometime in the late-afternoon-
through-dusk window. Each entry describes ONLY the sky, air, and overall light quality — never the
path, decorations, pumpkins, or any object (a separate pool already covers those; this pool layers
light mood on top).

Vary across the window: warm golden late-afternoon sun, a soft amber sunset just beginning, a
gentle blue "just after sunset" dusk, a hazy early-dusk sky streaked orange and violet, a crisp
early-evening sky with the first faint stars appearing, a misty golden late afternoon with low soft
light. Keep every entry warm, cozy, and inviting — never gloomy, ominous, or eerie.

CRITICAL BAN: never pair "dark"/"darkness"/"shadow" together with a light-implying word ("glint,"
"sparkle," "shimmer," "luminous," "glow") describing the very same thing in one entry — this exact
contradictory pairing has previously caused a broken, split-looking render. Each entry should commit
to ONE clear, coherent light quality, not a mix of literal darkness and brightness.

Output ONLY a JSON array of ${n} strings, no preamble, no numbering. 12-25 words each.

Examples:
["Warm golden late-afternoon sun slanting low, the whole sky glowing a soft honeyed amber.", "A gentle blue dusk settling in just after sunset, the air cool and hushed, the first faint stars beginning to show."]

🚫 STRICT BANS: NO objects, decor, pumpkins, paths, or figures of any kind (sky/air/light only), NO
gloomy/ominous/eerie words, NO pairing of dark/darkness/shadow with a light-implying word describing
the same thing, NO readable text.

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
