#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/sirenbot/seeds/magical_atmospheres.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} MAGICAL ATMOSPHERE descriptions — the texture layer present in every high-fantasy warrior render. Each names an in-frame ambient magical element that adds mystical quality.

Each entry: 8-20 words. One specific atmospheric element.

━━━ CATEGORIES TO MIX ━━━
- Glowing particles (runes / embers / motes / sparks / wisps floating in air)
- Mist / fog / vapor (magical fog coiling, spirit-mist rising, enchanted vapor)
- Suspended elements (leaves / petals / snow / ash / blood frozen mid-fall)
- Light effects (god-rays piercing cloud, aurora haloing body, divine shaft)
- Elemental phenomena (crackling lightning threads / flame curling in air / frost-bloom / storm-wind tearing)
- Spirit activity (wisps / ghost-forms / soul-fragments / past-echoes visible in air)
- Energy distortion (heat-shimmer / reality-ripple / arcane-wave / glamour-haze)
- Drifting flora (glowing moths / fireflies / will-o-wisps / luminescent seeds)
- Atmospheric color (twilight-haze / dawn-mist / dusk-gold / midnight-star-drift)
- Elemental manifestation (coiling flame-tendril / frost-spiral / water-ribbon / wind-spiral)
- Magical weather (enchanted snow / blood-rain / golden-dust / void-particles)
- Sacred geometry (glowing rune-circles / mandala-light / glyph-aura)

━━━ RULES ━━━
- Integrates naturally — not a visual-effect sticker
- One element per entry
- Works in any scene (battlefield, throne, ritual, wilderness)

━━━ BANNED ━━━
- Character-specific (no "her glowing eyes" — character is separate)
- Weapon-specific (separate axis)
- Setting-specific (separate)

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
