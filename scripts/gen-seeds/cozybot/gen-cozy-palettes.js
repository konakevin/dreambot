#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');

generatePool({
  outPath: 'scripts/bots/cozybot/seeds/cozy_palettes.json',
  total: 60,
  batch: 20,
  metaPrompt: (n) => `You are writing ${n} COZY COLOR PALETTE descriptions for CozyBot — scene-wide color stories that anchor the warm cozy register. 20-35 words each.

━━━ THE FORMULA ━━━
Each entry describes a complete scene-wide palette: dominant warm note + supporting warm midtone + accent color + shadow tone. ALWAYS warm-dominant. Cool tones (rain, snow, twilight) are accents only.

━━━ CATEGORIES (different warm registers) ━━━
- Tungsten amber: lamp-amber dominant + chestnut wood midtone + cream-linen highlight + deep brown shadow + occasional cool-blue accent
- Hearth gold: roaring-fire orange + warm-rust brick + sheepskin cream + soot-black + slate-grey accent
- Honey afternoon: golden-hour honey + oak warm + parchment-cream + sepia-shadow + cobalt-sky accent
- Vintage sepia-warm: faded amber + pale-tea-stain cream + soft-rust + dusty-rose + soft-grey accent
- Library-dim: candle-gold + leather-brown / oxblood / deep-walnut + brass-gleam + ink-shadow + emerald-velvet accent
- Cabin warm: pine-yellow + log-amber + wool-oatmeal + soot-brown + white-snow accent
- Autumn town: rust + gold + burnt-orange + amber + violet-dusk-sky accent
- Winter cozy: deep-blue snow + warm-tungsten window-glow gold + chimney-smoke grey + black silhouette accent
- Storybook warm: butter-yellow + soft peach + cream + rich-cocoa-brown + sage-green accent
- Bath-light pearly: pearl cream + warm pink-amber + soap-blue accent + soft-sand + warm-bronze fixtures

━━━ MANDATORY ELEMENTS PER ENTRY ━━━
1. Dominant warm color (specific named color, not "warm")
2. Supporting warm midtone (oak / leather / chestnut / sepia / etc.)
3. Highlight color (cream / linen / pearl / etc.)
4. Shadow tone (deep brown / slate / soot / sepia)
5. Accent color (cooler note used SPARINGLY for contrast — blue, green, violet)

━━━ HARD BANS ━━━
- NO cool-dominant palettes
- NO neon, NO pastel-only (must have rich warm anchor)
- NO black-and-white minimalism

━━━ FEW-SHOT EXAMPLES ━━━
EX-1: "Tungsten amber dominant, warm chestnut oak midtone, cream-linen highlights, deep mahogany shadow falling away into rich brown, single cool-blue accent in the rain-streaked window"
EX-2: "Roaring hearth gold dominant, warm-rust fired brick of the fireplace surround, sheepskin cream of the rug, soot-black inside the chimney mouth, slate-grey of the stone wall as cool counterpoint"
EX-3: "Library-dim candle-gold dominant, deep-oxblood leather chair and book-spines, brass-gleam of the lamp, ink-shadow black in the bookshelf depths, single emerald-velvet cushion as cool accent"
EX-4: "Winter twilight palette: deep-cobalt snow dominant outside, warm-tungsten window-glow gold inside, chimney-smoke grey curling against violet sky, black silhouette of pine boughs framing"

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
