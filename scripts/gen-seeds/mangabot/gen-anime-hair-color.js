#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/anime_hair_color.json',
  total: 25,
  batch: 25,
  append: false,
  maxTokens: 4000,
  metaPrompt: (n) => `Write ${n} ANIME HAIR-COLOR descriptions for MangaBot's character paths (gender-neutral). Each entry is 8-16 words.

CONTEXT: Anime hair colors span the full vibrant palette — natural, vibrant, and supernatural. Iconic anime palette is a STATEMENT.

Categories — rotate widely (vary heavily across these):
- Natural blacks / browns (jet-black / blue-black / chestnut / espresso / warm cocoa)
- Natural blondes (golden / honey / platinum / strawberry / ash-blonde)
- Natural reds (auburn / copper / rust)
- Anime-vibrant (rose-pink / lavender / sky-blue / mint-green / lilac / mauve / dusty-rose / silver-white / soft-pastel-blue / teal / orchid)
- Bold-anime (electric-violet / vibrant-cyan / cherry-red / sun-yellow / emerald-green)
- Two-tone gradient (black-fading-to-pink-tips / silver-with-violet-streaks / blonde-with-blue-undertone / black-with-rainbow-undertone)
- Supernatural (moonlight-silver / starlight-shimmer / cosmic-violet / glowing-pastel / iridescent)

EVERY entry: color name + ONE descriptor (catching sunset light / glossy and reflective / soft and pastel / mid-flight in breeze / iridescent in moonlight).

Examples (write fresh):
- "jet-black with subtle blue-black undertones, glossy and reflective in soft afternoon light"
- "rose-pink with cooler lavender undertones, anime-pastel, mid-flight in a gentle breeze"
- "honey-blonde with sun-bleached strawberry tips, catching golden-hour rim-light"
- "moonlight-silver with faint violet undertones, iridescent shimmer in shaded scenes"
- "vibrant emerald-green with dark-green roots, anime-saturated and bold"

Output ONLY a valid JSON array of ${n} strings (8-16 words each). No preamble, no commentary.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
