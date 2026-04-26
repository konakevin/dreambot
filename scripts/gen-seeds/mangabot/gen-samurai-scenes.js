#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/samurai_scenes.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} SAMURAI-ERA ANIME scene descriptions for MangaBot — feudal Japan anime moments. Rurouni Kenshin / Samurai Champloo / Sword of the Stranger / Dororo energy. Historical Japan through anime lens.

Each entry: 15-25 words. One specific feudal Japan anime scene with character archetype + setting + atmosphere.

━━━ CATEGORIES ━━━
- Ronin duel (bamboo forest, rain, drawn katana, leaves falling between opponents)
- Castle approach (massive Japanese castle silhouette, samurai on horseback, banners)
- Night patrol (lantern-lit Edo streets, wooden sandals, shadows, paper-screen glow)
- Battle aftermath (misty field, lone warrior standing, broken weapons, crows)
- Tea ceremony (tatami room, scroll calligraphy, master pouring, armor hung on wall)
- Bridge standoff (wooden bridge, river rushing below, two silhouettes, hand on hilt)
- Mountain temple training (waterfall meditation, wooden sword practice, monk instructor)
- Cherry blossom duel (petals swirling, katana drawn, hakama blowing in wind)
- Marketplace disguise (bustling Edo market, samurai blending in, hand on concealed blade)
- Horseback chase (rice paddy gallop, arrows flying, dust trail, pursuit through village)

━━━ RULES ━━━
- Characters by ROLE (ronin, samurai, shinobi, priestess, warlord) — NEVER named characters
- Historically grounded but ANIME aesthetic (cel-shaded, dramatic composition)
- Cultural accuracy in architecture, clothing, weapons

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
