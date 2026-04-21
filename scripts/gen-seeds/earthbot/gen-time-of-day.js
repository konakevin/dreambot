#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/earthbot/seeds/time_of_day.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} TIME-OF-DAY descriptions for EarthBot — specific moments in Earth's light cycle with atmospheric detail. The viewer should feel the precise minute and quality of light.

Each entry: 10-20 words. One specific time-of-day with specific atmospheric detail.

━━━ CATEGORIES ━━━
- Pre-dawn blue hour (earliest light, stars still faintly visible, alpenglow building)
- Dawn (first sun hitting peaks, rose-gold spreading across sky, mist on valley floors)
- Golden hour morning (low-angle honey light, long dramatic shadows, warm glow)
- Mid-morning clear (bright crisp light, sharp definition, sky deep-blue)
- High-noon dramatic (overhead sun, hard shadows, dust in beams)
- Afternoon warm (amber sidelight, long shadows building)
- Golden hour evening (sun at treetops, everything glowing copper, backlit rim-light)
- Dusk / sunset (sky in fire-colors, horizon gold fading to violet)
- Blue hour / civil twilight (first stars, sky indigo, ground silhouetted)
- Nautical twilight (deeper blue, Venus visible, last glow fading)
- Astronomical twilight (true dark beginning, full star field rising)
- Moonlit night (silvered surfaces, deep shadows, moon prominent)
- Midnight dark (just starlight, stark silhouettes)
- Storm afternoon (dark overhead, dramatic-contrast distant light)
- Overcast soft (no direct sun, even luminous grey)
- Fog-lifting morning (sun breaking through fog, god-rays forming)

━━━ RULES ━━━
- Include specific atmospheric detail — don't just name the time
- Earth-plausible light physics only
- Include named phenomena where possible (alpenglow, rim-light, god-rays, silhouette)

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
