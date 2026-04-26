#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/lighting.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} LIGHTING descriptions for MangaBot — anime-specific named lighting treatments.

Each entry: 10-20 words. One specific anime lighting treatment.

━━━ CATEGORIES ━━━
- Shinkai-sunset amber (5cm-per-second late-afternoon honey)
- Ghibli-dappled canopy (sun-through-leaves, pastoral)
- Akira-neon ribbon-light (cyberpunk saturated)
- Moonlit silver (anime-moon cool-silver)
- Lantern-warm glow (paper lantern radius)
- Shrine-candle intimate warm
- Storm-bruised dark-drama (Demon-Slayer peak-battle)
- Spirit-mist opalescent (Ghibli-spirit-world)
- Noir-manga shadow-heavy (stark contrast, mostly black)
- Rainy-neon puddle-reflected (cyberpunk rain)
- Golden-hour paddy-field raked
- Pre-dawn blue-hour railway
- Fluorescent-convenience-store flat
- Sparkle-effect magical-girl
- Blossom-canopy filtered pink
- Winter-window soft (snow outside, warm inside)
- Taisho-period gaslight amber
- Neon-sign-reflection on rain-pavement
- Saturday-morning-anime high-key cheerful
- Shoujo-sparkle pastel-backlit
- Dust-ray shaft through shoji
- Fire-lit hearth (Ghibli cottage)
- Moon-through-trees dappled-silver
- Cherry-blossom golden-hour (tsubaki-shadow)
- Summer-heat-haze shimmer
- Twilight-mono anime-blue
- Blade-Runner-Japan hyper-saturated magenta-cyan
- Lantern-procession warm-orange-stream
- Ominous-ink clouds with red-glow horizon
- Spirit-world pearl-glow

━━━ RULES ━━━
- Anime-specific named treatments
- Reference specific studios where apt
- Must support anime-illustration aesthetic

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
