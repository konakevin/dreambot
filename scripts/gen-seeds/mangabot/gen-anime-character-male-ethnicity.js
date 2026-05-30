#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/anime_character_male_ethnicity.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} ETHNICITY-NOUN entries for a MangaBot anime-character-male keyframe. Per feedback_ethnicity_noun_beats_visual_descriptors: ethnicity-NOUN in opening tokens unlocks Flux's diverse anime-man rendering; pure visual descriptors get steamrolled by the "pale bishounen anime guy" centroid.

Each entry: 6-12 words. Format: "[ethnicity/heritage noun] anime man, [one-line feature anchor with REGISTER cue]"

⚠️ REGISTER MANDATE — mix rugged / weathered / dignified / lined / scarred alongside softer registers. Default Flux centroid is bishounen pretty-boy; we want MALE VARIETY including: weathered jawlines, beards (where culturally appropriate), age-lined faces, sharp dark stubble, broad-shouldered, scarred, lived-in features.

VARIETY MANDATE — distribute across:
- 25% East Asian (Japanese / Korean / Chinese / Taiwanese / Okinawan / Hokkaido Ainu)
- 18% Southeast Asian (Filipino / Vietnamese / Thai / Indonesian / Burmese / Cambodian / Singaporean / Hmong)
- 12% South Asian (Indian / Pakistani / Bangladeshi / Sri Lankan / Nepali / Tibetan)
- 10% Mixed-heritage (mixed Japanese-Brazilian hāfu / mixed Korean-American / mixed Chinese-British / mixed Thai-American)
- 10% Latin American (Mexican / Brazilian / Peruvian / Colombian / Argentinian)
- 9% Black / African (Nigerian / Kenyan / Ethiopian / Ghanaian / African American / Afro-Caribbean / Afro-Latino)
- 9% Middle Eastern / North African (Persian / Turkish / Lebanese / Egyptian / Moroccan / Tunisian)
- 7% European / Slavic / Mediterranean (Russian / Polish / Italian / Greek / Irish / Scottish)

DO write:
- Japanese anime man, weathered jaw with dark sharp stubble and serious eyes
- Filipino anime man, broad-shouldered with warm brown skin and thick black brows
- Nigerian anime man, deep umber skin with close-cropped fade and lived-in scar across brow
- Persian anime man, dark beard and intense kohl-lined eyes, regal bearing
- mixed Japanese-Brazilian hāfu anime man, warm-tan skin and amber eyes, athletic frame
- Russian anime man, sharp angular jaw with ash-blond hair and ice-pale grey eyes
- Vietnamese anime man, mid-thirties with weathered handsome features and shoulder-length hair
- Mexican anime man, dignified salt-and-pepper temples with deep-brown eyes and warm bronze skin

DO NOT write:
- Just "anime man" without ethnicity-noun
- Race in slur/dated terms (oriental / etc.)
- Fictional fantasy races
- Multiple ethnicities per entry
- "Bishounen pretty-boy" register on EVERY entry (mix in the rugged options)
- Made-up country names

Each ethnicity should be specific + one visual anchor + a REGISTER cue (rugged / weathered / dignified / regal / refined / sharp / athletic / etc.).

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
