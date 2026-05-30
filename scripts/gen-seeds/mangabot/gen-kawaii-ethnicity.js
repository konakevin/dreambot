#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/kawaii_ethnicity.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} ETHNICITY-NOUN entries for kawaii MangaBot — diverse cute anime girls.

Each entry: 6-12 words. "[ethnicity] woman, [cute feature anchor]"

VARIETY: 22% E.Asian (Japanese/Korean/Chinese) / 16% SE.Asian (Filipina/Vietnamese/Thai) / 14% S.Asian / 12% Mixed-heritage / 10% Latin / 10% Black / 9% Middle Eastern / 7% European.

DO write:
- Japanese woman, glossy black twin-tails with pink ribbon-bow charms
- Filipina woman, sunkissed brown skin with cherry-blossom hair-clip
- Korean woman, soft black bob with peach-pink lip-gloss and dimples
- mixed Brazilian-Japanese hāfu woman, chestnut waves with strawberry-charm earrings
- Nigerian woman, deep umber skin with afro puffs and heart-shaped sunglasses on head

DO NOT: just "anime girl" / dated terms / skin-tone alone / multiple ethnicities per entry.

Return ONLY JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
