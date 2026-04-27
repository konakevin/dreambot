#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/ancientbot/seeds/night_scenes.json',
  total: 25,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} NOCTURNAL ANCIENT CIVILIZATION scene descriptions for AncientBot. Each entry is 25-40 words describing a specific ancient scene at NIGHT, DUSK, or DAWN. Pre-600 BC ONLY.

The ancient world after dark — torch-lit, moon-washed, star-dense. These civilizations had no electric light. Night was DARK, and the light sources (fire, oil lamps, moon, stars) created intimate, dramatic scenes.

━━━ SCENE TYPES (mix across all) ━━━
- Starlit monuments (pyramids under star-dense sky, Milky Way arcing over stone circles, constellations ancient astronomers named)
- Torch-lit processions (night ceremonies winding through temple complexes, fire reflecting off painted walls, shadows dancing)
- Moonlit ruins (silver light on ancient stone, sharp moon-shadows, owls in empty doorways)
- Oil-lamp city streets (Mesopotamian night market, pools of warm amber light from doorways, vendors and late shoppers)
- Campfire gatherings (desert camps on trade routes, sparks rising, faces lit from below, stories being told)
- Astronomical observations (priests on ziggurat summits watching stars, stone observatories aligned to solstice, pre-dawn sky)
- Dusk settling over cities (last golden light on highest temple, purple sky, first lamps being lit, day workers heading home)
- Dawn breaking over monuments (first rose-gold light hitting pyramid capstone, mist burning off river, birds waking)
- Night harbor (anchored ships silhouetted against moonlit water, lighthouse fires, dock lanterns reflecting on gentle waves)
- Temple vigils (lone oil lamp in dark sanctuary, gold god-statue barely visible, incense smoke in moonbeam through roof-slit)

━━━ RULES ━━━
- Each entry is ONE specific nocturnal/twilight scene with civilization baked in
- DARKNESS is dominant — light sources are SMALL and WARM against vast dark
- Star detail: these skies had ZERO light pollution — the Milky Way was vivid and overwhelming
- Include specific ancient light sources (oil lamps, torches, hearth fire, ceremonial fire, moonlight, starlight)
- 25-40 words
- NO medieval, NO Greek/Roman, NO fantasy glowing magic
- Mix of full night, dusk, and pre-dawn

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
