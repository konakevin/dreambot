#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/female_hairstyles.json',
  total: 25,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} FEMALE HAIRSTYLE descriptions for GothBot's female character paths. Each entry is a SHORT phrase (4-10 words) describing ONLY a specific hairstyle/texture/length. Gothic-horror women — Castlevania / Crimson-Peak / gothic-fairy-tale aesthetic.

━━━ STYLE SPREAD (enforce variety across ${n}) ━━━
- LONG FLOWING (4-5) — waist-length loose waves, hip-length straight silk, cascading heavy curls
- ELABORATE / ORNATE (3-4) — baroque updo with silver pins, Victorian braided crown, twisted horns of hair
- WILD / UNTAMED (3-4) — windswept tangled waves, storm-tossed, witchy nest of curls
- SHORT / SEVERE (2-3) — sharp angled bob, shaved sides with long top, cropped pixie
- BRAIDED (3-4) — side-braid with chains, warrior rope-braids, crown-braids, thick box-braids
- WET / ATMOSPHERIC (2-3) — rain-plastered to face, damp tendrils clinging to neck
- TEXTURED (3-4) — tight coils, voluminous natural curls, long locs, thick twists

━━━ RULES ━━━
- ONLY the hairstyle — no color (color comes from a separate pool)
- Include texture/movement ("wind-catching", "clinging to neck", "gravity-defying volume")
- Vary across cultures and textures — not all straight European hair
- No modern salon language — these are gothic fantasy women

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
