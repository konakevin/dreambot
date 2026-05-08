#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/anime_skin.json',
  total: 200,
  batch: 50,
  append: true,
  maxTokens: 4000,
  metaPrompt: (n) => `Write ${n} ANIME CHARACTER SKIN descriptions for MangaBot's character paths (gender-neutral — used for both male and female). Each entry is 12-22 words.

CONTEXT: Anime art skin tone descriptors — varied across the anime palette range. NOT photoreal pore-detail; this is stylized anime cell-shading.

EVERY entry must include:
- Tone (porcelain pale / soft pale / sun-tanned / golden-tan / olive-pale / honey-toned / warm-beige / freckled-pale)
- ONE descriptor of how it interacts with anime lighting (catches sunset glow / soft cell-shaded with crisp shadow / golden-hour rim catching cheekbones / cool blue tone in shaded scene / etc.)
- Optional: ONE small detail (light freckles across the nose / a small mole below the eye / a tiny scar at the temple / faint blush at the cheekbones)

Vary widely — anime characters span pale-shoujo / sun-tanned-sporty / golden-genki / cool-pale-mysterious / warm-honey-cute. Cover the spectrum.

ABSOLUTELY BANNED:
- NO weathered / aged / haggard / pockmarked
- NO photoreal pore detail
- NO heavy makeup descriptors (anime-stylized only)

Examples (write fresh):
- "porcelain pale skin with light freckles across the nose, soft cell-shaded under afternoon light, faint blush at the cheekbones"
- "sun-tanned golden honey skin catching warm sunset rim-light along the jawline, healthy and bright"
- "soft pale skin with a small mole below the right eye, cool blue cell-shaded shadow on one side"
- "warm beige tone with a faint scar at the temple, golden-hour glow along the brow line"

Output ONLY a valid JSON array of ${n} strings (12-22 words each). No preamble, no commentary.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
