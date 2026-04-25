#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/coquettebot/seeds/lighting.json',
  total: 200,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} LIGHTING descriptions for CoquetteBot — soft warm dreamy lighting treatments. Always precious / delicate / romantic. No harsh / moody / stark.

Each entry: 10-20 words. One specific soft-dreamy lighting treatment.

━━━ CATEGORIES ━━━
- Golden-hour pastel (warm amber-rose, long soft shadows)
- Candle-warm intimate (soft flicker, cozy glow)
- Fairy-light twinkle (string-lights, magical pinpoint warmth)
- Morning-through-gauzy-curtains (soft filtered white, dreamy bedroom)
- Chandelier-crystal refraction (ballroom sparkle, warm glow)
- Magic-hour rose-gold (just before sunset, rose-gold saturation)
- Blush-sunrise dawn (pale pink sky, soft awakening)
- Lavender-dusk twilight (soft purple blending to rose)
- Paper-lantern warm (romantic string lanterns, warm glow)
- Backlit-tulle softglow (warm sun through gauzy fabric)
- Garden-sunlight-through-roses (dappled warm, flower-filtered)
- Pearlescent-dawn opalescent (pearl-sheen, soft gradient sky)
- Soft window-light portrait (key light from one window, pastel)
- Warm-tea-room ambient (pink-amber cozy interior)
- Sunset-through-lace (curtain pattern-lit golden-rose)
- Strawberry-moon rise (pink-tinted moon, soft)
- Parisian-bistro warm (amber street, soft romance)
- Blossom-grove dappled (flower-filtered pink light)
- Firefly-pastel glow (soft warm magic)
- Spa-bathroom soft (pastel walls, soft even light)
- Crystal-chandelier daylight (day-lit mirror-walls, sparkle)
- Blush-sunbeam shaft (single warm rose beam through gauze)
- Candle-surrounding cluster (multiple tiny flames)
- Lace-curtain-filtered soft (pattern-light, dreamy)
- Cottage-kitchen warm (golden afternoon)

━━━ RULES ━━━
- ALWAYS soft / warm / dreamy / romantic
- Pastel / rose-gold / pink-amber palette
- Never moody / dark / harsh

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
