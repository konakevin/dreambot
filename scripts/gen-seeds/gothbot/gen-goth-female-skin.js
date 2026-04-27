#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/goth_female_skin.json',
  total: 25,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} GOTHIC SKIN TONE descriptions for GothBot's female character paths. Each entry is a SHORT phrase (8-15 words) describing her skin with gothic-specific detail. These compose with separate archetype/makeup/hair pools.

These are hauntingly beautiful skin descriptions — NOT clinical color swatches. Every skin tone should feel GOTHIC — touched by moonlight, kissed by shadow, lit by candlefire. Include the color AND the quality/texture.

━━━ VARIETY SPREAD ━━━
- PALE / PORCELAIN (6-7) — moonstone-white with blue veins visible at her temples, alabaster pale with a faint lavender undertone like bruised marble, ivory-pale with translucent quality showing delicate veins at her throat, snow-white porcelain with rose-flush only at her lips
- WARM / GOLDEN (5-6) — warm bronze skin catching candlelight like hammered copper, deep golden-brown with amber undertones glowing in firelight, rich olive skin with warm shadows pooling in her collarbones, tawny sun-kissed brown luminous against black fabric
- DEEP / DARK (5-6) — deep umber-brown skin with blue-black shadow in the hollows, rich dark-brown with violet highlight where moonlight catches her cheekbones, dark espresso-brown with warm bronze sheen like oiled wood, midnight-dark skin with cool undertones and silver-light reflection
- COOL / UNUSUAL (4-5) — ash-grey pallor with faint silver sheen like something not quite alive, cool blue-pale with visible veins like stained glass, warm terracotta with grey undertone suggesting centuries of firelight, dusky rose-brown with cold lavender shadows

━━━ RULES ━━━
- Each entry describes SKIN COLOR + QUALITY + one gothic atmospheric detail
- DIVERSE — not all pale. Gothic beauty comes in every shade
- Include how LIGHT interacts with her skin (candlelight, moonlight, shadow)
- Beautiful and specific — a painter describing their subject's skin
- No wounds, no decay, no rot — beautiful skin, gothically lit

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
