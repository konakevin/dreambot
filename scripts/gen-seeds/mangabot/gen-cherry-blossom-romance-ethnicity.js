#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/cherry_blossom_romance_ethnicity.json',
  total: 25, batch: 25, append: true,
  metaPrompt: (n) => `Write ${n} ETHNICITY-NOUN entries for cherry-blossom-romance MangaBot. Tender romantic register. Each 6-12 words.

Format: "[ethnicity] character, [romantic-coded feature anchor]"

VARIETY: 26% Japanese (sakura-tradition home) / 14% other E.Asian / 14% SE.Asian / 12% S.Asian / 10% Mixed-heritage / 10% Latin / 6% Black / 4% Middle Eastern / 4% European.

DO write:
- Japanese woman, soft black hair with pink-ribbon and gentle dimples
- Japanese man, dark hair tied loose with dreamy eyes and faint smile
- Filipina woman, sunkissed skin with cherry-blossom hair-clip
- Korean man, soft black hair and shy half-smile, schoolboy-tender
- Mixed Brazilian-Japanese hāfu woman, chestnut waves with rose-pink cheeks

DO NOT: cheesecake / dated terms / multiple per entry.

Return ONLY JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
