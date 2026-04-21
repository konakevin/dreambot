#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/glowbot/seeds/scene_palettes.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} SCENE PALETTE descriptions for GlowBot — overall color mood for peaceful/luminous renders. Critical anti-cluster axis. All palettes are peaceful-awe-inducing; no harsh or dark-menacing palettes.

Each entry: 14-28 words. Dominant colors + shadows + highlights + atmosphere.

━━━ CATEGORIES (peaceful-only) ━━━
- Warm golden-hour (amber / honey / peach / rose-gold / warm-cream)
- Cool dawn (pale blue / silver / pearl / lavender-pre-dawn)
- Ethereal pastel (mint / blush / lavender / pale gold / cream)
- Peaceful emerald (forest green / gold-dappled / soft umber)
- Celestial (nebula-soft / dreamy amethyst / magenta-peaceful)
- Aurora moods (soft green / pink / violet over dark peaceful water)
- Bioluminescent (cyan-softened / white-glow / gentle pulse-green)
- Misty monochrome (soft-gray with single luminous accent)
- Ocean-peaceful (pale turquoise / pearl-teal / gentle-cobalt + white)
- Antique warm (sepia-amber / rose-ochre / aged-parchment)
- Dusty sunrise (dusty pink + gold + peach)
- Snowy moonlit (silver + lavender + pale-blue frost)
- Candle-warm (soft amber + deep brown + cream)
- Alpine morning (cool pale blue + silver + emerald-green-pine)
- Coral dusk (coral-pink + rose-gold + deep-violet)
- Pearl whites (ivory + pale-pink + soft gold)
- Meadow gold (dappled gold + green + soft haze)
- Frosted rose (cold pale-pink + silver + violet-hint)
- Emerald pool (deep emerald + gold-shaft + mist)
- Soft volcanic (warm ember + peach + gentle dark)

━━━ RULES ━━━
- Peaceful / awe-inspiring color moods ONLY
- Never harsh/dramatic-contrast/menacing
- Never pure black (always lifted-shadows with peaceful accent)

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
