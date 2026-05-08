#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/anime_eyes.json',
  total: 25,
  batch: 25,
  append: false,
  maxTokens: 4000,
  metaPrompt: (n) => `Write ${n} ANIME EYE descriptions for MangaBot's character paths (gender-neutral). Each entry is 10-18 words.

CONTEXT: Anime-style large expressive eyes. The full anime color palette — vibrant, varied, sometimes supernatural. NOT realistic eye descriptors; stylized anime aesthetic.

Categories — rotate widely:
- Realistic (warm brown / hazel-amber / deep brown with golden flecks)
- Vibrant naturals (emerald green / sapphire blue / steel grey / honey-amber / chestnut)
- Anime-coded vibrants (sky blue / violet / teal / amber-gold / rose-pink / mint green / lilac)
- Supernatural (heterochromia — one blue one gold / glowing magical-pink / cosmic-violet / spirit-silver / liquid-gold / crimson)

EVERY entry must include:
- Color (specific — chestnut / sapphire / amber-gold / etc.)
- Anime-style descriptor (large and expressive / sharp and almond-shaped / soft and rounded / hooded and intent / wide-shoujo / narrowed-shonen)
- ONE shimmer/highlight detail (catching golden-hour light / soft white catchlights / starry highlights / iridescent pupil shimmer)

ABSOLUTELY BANNED:
- NO mean / cold / predatory descriptors (this is anime slice-of-life, not gothic-assassin)
- NO bloodshot or tired eyes
- NO heavy eyeliner / smokey-eye descriptors

Examples (write fresh):
- "warm chestnut-brown almond-shaped eyes with soft white catchlights, large and expressive, gentle and curious"
- "vibrant sapphire-blue eyes with starry highlights, sharp upturned shape, anime-bright"
- "anime-violet eyes with iridescent pupil shimmer, large and rounded, wide and dreamy"
- "heterochromatic eyes — one warm gold, one cool sapphire — sharp almond shape, captivating"
- "honey-amber eyes catching golden-hour light, soft and rounded, gentle and warm"

Output ONLY a valid JSON array of ${n} strings (10-18 words each). No preamble, no commentary.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
