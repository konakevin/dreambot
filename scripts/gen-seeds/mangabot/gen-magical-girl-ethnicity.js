#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/magical_girl_ethnicity.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} ETHNICITY-NOUN entries for a MangaBot magical-girl keyframe. Ethnicity-NOUN lead unlocks Flux's diverse magical-girl rendering vs the pale Sailor-Moon-default centroid.

Each entry: 6-12 words. Format: "[ethnicity] magical-girl woman, [one-line feature anchor]"

VARIETY MANDATE:
- 22% East Asian (Japanese / Korean / Chinese / Taiwanese)
- 16% Southeast Asian (Filipina / Vietnamese / Thai / Indonesian)
- 12% South Asian (Indian / Pakistani / Sri Lankan / Nepali)
- 12% Mixed-heritage (mixed Japanese-Brazilian hāfu / mixed Korean-American / mixed Chinese-French)
- 10% Latin American (Mexican / Brazilian / Peruvian / Colombian)
- 10% Black / African (Nigerian / Kenyan / African American / Afro-Caribbean)
- 10% Middle Eastern / North African (Persian / Turkish / Lebanese / Egyptian)
- 8% European / Mediterranean (Russian / Polish / Italian / Greek)

DO write:
- Japanese magical-girl woman, glossy black twin-tails with star-shaped barrettes
- Filipina magical-girl woman, sun-kissed brown skin and warm-amber sparkle-eyes
- Nigerian magical-girl woman, deep umber skin with afro puffs catching star-light
- Persian magical-girl woman, rounded kohl-lined eyes and ornate gold-tiara catching glow
- mixed Brazilian-Japanese hāfu magical-girl woman, chestnut waves and golden-honey skin

DO NOT write:
- Just "magical-girl woman" without ethnicity
- Slur/dated terms
- Multiple ethnicities per entry
- Skin tone alone

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
