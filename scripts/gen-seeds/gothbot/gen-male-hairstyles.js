#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/male_hairstyles.json',
  total: 25,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} MALE HAIRSTYLE descriptions for GothBot's male character paths. Each entry is a SHORT phrase (4-10 words) describing ONLY a specific hairstyle/texture/length. Gothic-horror men — Castlevania / Bloodborne / Devil-May-Cry / Berserk / Van-Helsing aesthetic.

━━━ STYLE SPREAD (enforce variety across ${n}) ━━━
- LONG / FLOWING (3-4) — shoulder-length loose, warrior mane past shoulders, hip-length straight
- WARRIOR / BATTLE (4-5) — warrior-braids with metal rings, topknot with shaved sides, tight cornrows, battle-matted
- SHORT / SEVERE (3-4) — buzz-cut, shaved to stubble, cropped military, clean shaved scalp with scars
- WILD / UNTAMED (3-4) — windswept tangle, storm-tossed spikes, unruly mane
- SLICKED (2-3) — slicked-back severe, wet-look combed behind ears
- TEXTURED (3-4) — thick locs, tight coils cropped close, box-braids pulled back, natural curls

━━━ RULES ━━━
- ONLY the hairstyle — no color (color comes from a separate pool)
- Include texture/movement ("wind-catching", "battle-matted", "rain-slicked to scalp")
- Vary across cultures and textures — not all straight European hair
- Include some bald/shaved options — battle-scarred scalps, ritual-branded heads

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
