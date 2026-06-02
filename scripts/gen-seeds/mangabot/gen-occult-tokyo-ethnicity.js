#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/occult_tokyo_ethnicity.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} ETHNICITY-NOUN entries for occult-tokyo MangaBot. Modern Tokyo + supernatural register. Each 6-12 words.

Format: "[ethnicity] character, [occult-tinged feature anchor]"

VARIETY: 32% Japanese (occult-Tokyo is THE home setting) / 14% other E.Asian (Korean/Chinese) / 12% SE.Asian (Vietnamese/Thai/Filipino/Indonesian) / 10% S.Asian (Indian/Pakistani/Bangladeshi) / 12% Mixed-race hāfu (Japanese-Brazilian / Japanese-American / Japanese-French) / 8% Black (African / African-American / Afro-Japanese) / 6% Latin (Mexican / Brazilian / Peruvian) / 4% Middle Eastern (Iranian/Lebanese) / 2% European.

DO write:
- Japanese woman, dark messy bob with one cursed-amber eye glowing faintly
- Japanese man, undercut hair with sigil-scar at temple
- Korean man, sharp jawline with tired-purple cursed-energy aura
- Filipina woman, sun-kissed brown skin with paper-charm bandage on cheek
- Vietnamese man, lean angular face with shadowed eyes and faint kanji on neck
- mixed Japanese-Brazilian hāfu character, hazel eyes with cursed-rune visible at collarbone
- Afro-Japanese man, dreads tied back with ofuda tucked behind ear
- Thai woman, expressive eyes with shimenawa-rope wrap at wrist visible

DO NOT: just "anime character" / generic "Asian" / multiple per entry / dated colonial terms.

Return ONLY JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
