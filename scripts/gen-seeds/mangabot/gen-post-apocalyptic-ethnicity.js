#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/post_apocalyptic_ethnicity.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} ETHNICITY-NOUN entries for post-apocalyptic MangaBot. Lone-wanderer in overgrown ruined Japan / Trigun-desert / Made-in-Abyss / Girls-Last-Tour / Yokohama-Kaidashi register. Each 6-12 words.

Format: "[ethnicity] character, [wanderer feature anchor]"

VARIETY: 26% Japanese (drowned-Tokyo home) / 14% Korean / 12% Vietnamese / 10% Filipino / 10% Mixed-Asian / 10% Latin / 8% Thai/SE-Asian / 6% Black / 4% Middle-Eastern.

⚠ ANTI-back-to-camera: every anchor must imply a FORWARD-FACING, ENGAGED character (mid-action, looking at viewer/prop), NEVER "silhouette" / "back to camera" / "facing horizon" / "staring at vista".

DO write:
- Japanese woman, wind-tangled bob with goggles pushed up on brow, soot-smudged cheek
- Korean man, weathered jaw with scarred brow and forward-set determined eyes
- Vietnamese woman, sun-darkened skin with cracked-lip half-smile under wrap-mask
- Filipino character, dust-caked cheeks and dark eyes catching low-amber dust-light
- mixed Japanese-Brazilian hāfu character, hazel eyes alert above scavenger-bandana

DO NOT: just "anime character" / dated terms / "silhouette" / "lone shadow" / "looking off into distance" / multiple per entry.

Return ONLY JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
