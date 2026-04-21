#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/bloombot/seeds/scene_palettes.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} SCENE PALETTE descriptions — overall color mood for BloomBot floral renders. Critical anti-cluster axis.

Each entry: 14-28 words. Dominant colors + shadows + highlights + atmosphere descriptor.

━━━ MIX (flower-friendly palettes) ━━━
- Golden hour warm (amber / honey / peach / rose-gold)
- Dawn cool (pale blue / silver / rose / pearl)
- Moonlit silver (cool silver / cerulean / frost-white)
- Rich jewel tones (amethyst / emerald / sapphire / ruby)
- Pastel dreamy (mint / blush / lavender / cream)
- Sunset dramatic (blood-orange / magenta / indigo)
- Forest emerald (deep green / gold-dappled / umber)
- Desert sunscorched (ochre / terracotta / turquoise sky)
- Storm-moody (gunmetal / violet-clouds / silver-accent)
- Tropical saturated (fuchsia / emerald / coral / turquoise)
- Antique parchment (sepia / ivory / dusty rose / old-gold)
- Neon cottagecore (pastel-pink + acid-yellow + mint — dreamy pop)
- Bioluminescent underwater (teal-cyan / white-glow / deep-blue)
- Chiaroscuro (deep black shadows / single hot highlight / rich color accent)
- Autumn (russet / gold / crimson / wine / fallen-leaf-brown)
- Alpine fresh (cold white / pale blue / emerald-pine / silver)
- Coral reef (pink-orange / aqua / chartreuse / pearl)
- Vintage film (muted ochre / mauve / dusty teal / faded cream)
- Candle-warm (amber / deep-brown / cream / gold flicker)
- Cloud-soft (ivory / pale pink / robin-egg / cream)

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
