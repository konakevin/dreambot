#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/titanbot/seeds/lighting.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} LIGHTING descriptions for TitanBot — divine lighting treatments. God-rays, cosmic-dawn, golden-corona, temple-candlelight, underworld-glow, divine-aura.

Each entry: 10-20 words. One specific divine lighting treatment.

━━━ CATEGORIES ━━━
- God-rays through clouds (shafts of divine light)
- Cosmic-dawn (breaking of primordial light)
- Golden-corona (halo of divinity around figure)
- Temple-candlelight (multi-candle warm intimate)
- Underworld-glow (Stygian green-and-violet)
- Divine-aura (glowing-body rim-light)
- Olympus sunlit-marble (sunlit columns, bright)
- Valhalla hearth-firelight (warm hall interior)
- Egyptian temple-gold (amber torchlight on statue)
- Hindu divine-color (multi-color radiance from deity)
- Japanese shrine-mystical (diffuse sacred light)
- Chinese jade-green celestial (emerald-and-gold heaven)
- Aztec sun-gold blazing
- Norse storm-electric (lightning-lit battle)
- Celtic fairy-glow (bioluminescent magic)
- African-earth warm-amber
- Polynesian tropical-sunset
- Greek-oracle-cave smoke-lit
- Egyptian pyramid-interior amber-shaft
- Hindu temple-evening flame-ritual
- Japanese Noh-theater spotlight
- Chinese-dragon-storm cloud-lit
- Aztec-obsidian blood-moon-red
- Norse-ice auroral silver
- Celtic-moon forest-silver
- Nephilim-cosmic-column light-from-heaven
- Prometheus-fire stolen flame-glow
- Persephone-transition dusk-to-dark
- Fury-pyre red-burning
- Apollo-sun brilliant overhead
- Artemis-moon silver-dappled
- Hermes-messenger liminal-light
- Buddhist-halo gold-ring behind seated figure
- Christian-ascension vertical divine-beam
- Mesopotamian-ziggurat setting-sun silhouette
- Inuit-aurora over-iceberg
- African-storm cumulus-sky-break
- Aboriginal-dawn red-and-gold dreamtime

━━━ RULES ━━━
- Divine / mythic / pantheon-specific lighting
- Named specific treatments
- Painterly / concept-art flavored

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
