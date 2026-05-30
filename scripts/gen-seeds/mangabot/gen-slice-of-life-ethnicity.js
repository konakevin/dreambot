#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/slice_of_life_ethnicity.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} ETHNICITY-NOUN entries for slice-of-life anime — everyday characters (any gender, lean toward Japanese setting). Each entry 6-12 words.

Format: "[ethnicity] [woman/man/character], [everyday-feature anchor]"

VARIETY: 30% Japanese (everyday-Tokyo register) / 14% other E.Asian / 14% SE.Asian / 10% S.Asian / 10% Mixed-heritage / 8% Latin / 6% Black / 4% Middle Eastern / 4% European.

DO write:
- Japanese woman, tired commuter eyes and casual messy bun
- Japanese man, dark hair tied back with chef's-bandana and faint smile
- Korean woman, glasses slipping down nose with peaceful focused look
- Filipino man, salt-and-pepper temples and friendly weathered jaw
- mixed Brazilian-Japanese hāfu character, hazel eyes and chestnut highlights

DO NOT: just "anime character" / dated terms / multiple per entry / cheesecake.

Return ONLY JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
