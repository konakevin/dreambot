#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/anime_hairstyles_female.json',
  total: 200,
  batch: 50,
  append: true,
  maxTokens: 4000,
  metaPrompt: (
    n
  ) => `Write ${n} ANIME FEMALE HAIRSTYLE descriptions for MangaBot. Each entry is 12-22 words.

CONTEXT: Iconic anime hairstyles spanning the full vocabulary. Each entry describes a SPECIFIC anime hairstyle.

Categories — rotate widely:
- Long flowing (long straight hair flowing past the shoulders / long wavy hair caught in breeze / long hair tied back loosely)
- Twin tails (high twin tails / low twin tails with ribbons / asymmetric twin tails)
- Side ponytail (low side ponytail / high side ponytail with charm)
- Ponytail (high ponytail with bangs / low ponytail tied with ribbon / side-swept ponytail)
- Pixie / short cut (sharp pixie cut / asymmetric pixie / messy short cut)
- Bob (chin-length bob / collar-length bob with bangs / blunt-cut bob)
- Bun (messy bun with loose strands / neat bun with chopsticks / half-up half-down bun)
- Braid (single long braid down the back / side braid / fishtail braid / double braids)
- Wavy / curly (loose anime waves / soft beach curls / shoulder-length spirals)
- Bangs variations (thick blunt bangs / wispy side bangs / curtain bangs / asymmetric long bangs)
- Half-up half-down (half pulled back with bow / half braided crown)
- Hime cut (long straight hair with framing temple-locks)
- Twin braids forward (over each shoulder)

EVERY entry: length + style + ONE detail (ribbon / clip / pin / loose strand / motion in breeze / streak of color / etc.)

Examples (write fresh):
- "Long straight hair flowing past her shoulders, parted in the middle, soft wavy ends catching late-afternoon light"
- "High twin tails tied with red ribbons, bangs swept across the brow, anime-bouncy with motion"
- "Chin-length blunt bob with thick straight-across bangs, glossy and crisp, framing the face sharply"
- "Messy low bun secured with crossed wooden pins, loose strands escaping at the temples"
- "Single long braid trailing down her back tied with a small charm, side bangs curtaining one eye"

Output ONLY a valid JSON array of ${n} strings (12-22 words each). No preamble, no commentary.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
