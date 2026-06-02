#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/festival_nights_ethnicity.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} ETHNICITY-NOUN entries for festival-nights MangaBot. Japanese summer matsuri / hanabi / yatai-festival context. Each 6-12 words.

Format: "[ethnicity] character, [matsuri-coded feature anchor]"

VARIETY: 60% Japanese (matsuri is a Japanese tradition) / 12% Korean / 8% Chinese / 8% Vietnamese / 6% Mixed-heritage hāfu / 4% Filipino / 2% Thai.

DO write:
- Japanese woman, soft black hair pinned with kanzashi-flower and lantern-warm cheeks
- Japanese man, dark hair tousled with jinbei-collar visible and shy half-smile
- Korean woman, sleek black hair with floral-comb and lantern-glow on skin
- Chinese man, short dark hair with festival-flush, looking warm at viewer
- Mixed Japanese-American hāfu woman, chestnut waves with paper-flower clip
- Vietnamese woman, long dark hair with chopstick-pin and warm matsuri cheeks
- Japanese boy, tousled dark hair under hachimaki band with bright grin

DO NOT: cheesecake / yukata-half-off descriptors / multiple per entry / dated terms.

Return ONLY JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
