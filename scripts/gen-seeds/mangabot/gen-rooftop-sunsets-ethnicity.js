#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/rooftop_sunsets_ethnicity.json',
  total: 25, batch: 25, append: true,
  metaPrompt: (n) => `Write ${n} ETHNICITY-NOUN entries for rooftop-sunsets MangaBot. Tokyo-rooftop register. Each 6-12 words.

Format: "[ethnicity] character, [rooftop-mood feature anchor]"

VARIETY: 28% Japanese (Tokyo-rooftop home) / 14% other E.Asian / 14% SE.Asian / 10% S.Asian / 10% Mixed / 10% Latin / 6% Black / 4% Middle Eastern / 4% European.

DO write:
- Japanese woman, dark messy bob with sunset-amber catching cheek
- Japanese man, loose-tied hair with weathered jaw and sunset-glow eyes
- Filipina woman, sun-kissed brown skin and gentle smile catching evening light
- Korean man, salt-and-pepper hair tied back, contemplative-warm look
- mixed Japanese-Brazilian hāfu character, hazel eyes catching golden-hour

DO NOT: just "anime character" / dated terms / multiple per entry.

Return ONLY JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
