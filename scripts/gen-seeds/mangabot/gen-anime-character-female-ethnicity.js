#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/anime_character_female_ethnicity.json',
  total: 50,
  batch: 15,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} ETHNICITY-NOUN entries for a MangaBot anime-character-female keyframe. Per the painted-medium-artist-names lesson (feedback_ethnicity_noun_beats_visual_descriptors), the ethnicity-NOUN at the opening of the prompt is what gets Flux to render diverse anime characters — pure visual skin descriptors get steamrolled by the Ghibli/Shinkai "pale anime girl" centroid.

Each entry: 6-12 words. Format: "[ethnicity/heritage noun] anime woman, [one-line feature anchor]"

VARIETY MANDATE — distribute across:
- 25% East Asian (Japanese / Korean / Chinese / Taiwanese / Hong Kong / Okinawan / Hokkaido Ainu)
- 18% Southeast Asian (Filipina / Vietnamese / Thai / Indonesian / Malaysian / Burmese / Cambodian / Singaporean Peranakan / Hmong)
- 14% South Asian (Indian / Pakistani / Bangladeshi / Sri Lankan / Nepali / Tibetan)
- 10% Mixed-heritage (mixed Japanese-Brazilian / mixed Korean-American / mixed Chinese-French / mixed Thai-British / mixed Filipina-Spanish — half-Japanese hāfu anime archetype)
- 10% Latin American (Mexican / Brazilian / Peruvian / Colombian / Argentinian)
- 8% Black / African (Nigerian / Kenyan / Ethiopian / Ghanaian / African American / Afro-Caribbean / Afro-Latina)
- 8% Middle Eastern / North African (Persian / Turkish / Lebanese / Egyptian / Moroccan / Tunisian)
- 7% European / Slavic / Mediterranean (Russian / Polish / Italian / Greek / Irish / Scottish — for shojo-blonde + cool-toned variety)

DO write:
- Japanese anime woman, soft black hair tucked behind one ear
- Filipina anime woman, sun-kissed brown skin and dark-lashed almond eyes
- mixed Korean-American anime woman, expressive hazel eyes with epicanthic fold
- Nigerian anime woman, deep umber skin with kinky-curl twists in a high pony
- Persian anime woman, large rounded eyes lined in dark kohl, olive skin glowing
- mixed Japanese-Brazilian hāfu anime woman, warm-tan skin and chestnut highlights
- Vietnamese anime woman, jet-black hair in shoulder-cut and warm copper undertone
- Russian anime woman, ice-blonde shojo-style hair and pale sea-glass eyes

DO NOT write:
- Just "anime woman" without ethnicity-noun
- Race in slur/dated terms (oriental / exotic / etc.)
- Fictional fantasy races (elf / dragonborn — this is a real-world-grounded anime woman path)
- Multiple ethnicities per entry (one heritage per entry)
- Skin tones alone without ethnicity ("dark-skinned anime woman" is too weak — say "Ethiopian anime woman with deep umber skin")
- Made-up country names

Each ethnicity should be specific + describe one visual anchor (hair / skin / eye / feature) so the noun has a concrete visual hook.

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
