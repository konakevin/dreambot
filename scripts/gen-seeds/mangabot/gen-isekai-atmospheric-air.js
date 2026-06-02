#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/isekai_atmospheric_air.json',
  total: 200,
  batch: 12,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} ATMOSPHERIC-AIR entries for a MangaBot ANIME ISEKAI keyframe. Anime-coded atmospheric treatments — Frieren / Konosuba / Re:Zero painterly air-effects.

Each entry: 10-20 words. ONE anime-isekai atmospheric drift.

ANIME ISEKAI ATMOSPHERIC VARIETY:
- FLOATING MANA-PARTICLES (anime magical sparkle-motes drifting through air)
- DAPPLED FOREST-LIGHT (anime forest-canopy with painterly green-gold dapple)
- FALLEN PETAL-DRIFT (anime cherry-blossom or rose-petal drift)
- DUSTY-ANCIENT-RUIN AIR (anime ruined-temple dust-motes in sun-shaft)
- FROST-MAGIC SHIMMER (anime cold-magic ice-particle drift)
- WARM-FIREPLACE GLOW (anime tavern hearth-light drift)
- WIND-MOTION LEAVES (anime swirling leaves with motion-lines)
- MIST-VEIL FANTASY (anime ethereal fog in fantasy landscape)
- SPIRIT-LIGHT MOTES (anime ghostly-blue spirit-orbs drifting)
- RAIN-IN-FANTASY (anime stylized fantasy-rain with motion-lines)
- DRAGON-BREATH SMOKE (anime dragon-mid-breath with painterly smoke)
- MANA-EXPLOSION SHOCKWAVE (anime spell-detonation ripple effect)
- FAIRY-DUST GOLD (anime fairy-sparkle gold-dust trail)
- SNOW-DRIFT FANTASY (anime fantasy-snow with painterly flakes)
- AUTUMN-MAPLE WHIRL (anime red maple leaf swirl)
- SUNLIGHT-RAYS PIERCING (anime god-rays through fantasy clouds)
- POTION-VAPOR (anime alchemist's bubbling potion mist)
- CHERRY-BLOSSOM RAIN (anime fantasy sakura-petals drifting)
- SOUL-SOUL ETHEREAL (anime soft afterlife-glow particles)
- STARDUST SPARKLE (anime cosmic sparkle for magic moment)

DO write:
- Floating anime mana-particles drifting through the air, magical-sparkle motes catching the light
- Dappled anime forest-light with painterly green-gold dapple patches dancing
- Anime cherry-blossom petal-drift in slow spirals, settling on shoulders and ground
- Anime ruined-temple dust-motes suspended in a sun-shaft from broken ceiling
- Frost-magic anime ice-particle drift around the mage in slow rotation
- Warm anime tavern hearth-light drift with floating wood-smoke particles
- Anime swirling autumn leaves with motion-lines trailing the wind direction
- Anime ethereal fog in fantasy landscape, low-mist hugging the ground
- Anime ghostly-blue spirit-orbs drifting through the scene, ethereal register
- Anime stylized fantasy-rain with vertical motion-lines and puddle-splashes

DO NOT write:
- Western photoreal atmospheric effects
- Multiple effects per entry — ONE
- Modern industrial smoke / pollution
- Cyberpunk-coded atmosphere

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
