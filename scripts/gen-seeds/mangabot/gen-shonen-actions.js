#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/shonen_actions.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} SHONEN ACTION MOMENT descriptions for MangaBot — big kinetic anime fight/power-up/clash moments. Demon Slayer / Naruto / Dragon Ball / Jujutsu Kaisen / Bleach / One Piece energy. These are THE MOMENT — mid-clash, mid-power-up, mid-technique.

Each entry: 15-25 words. One specific action moment with character archetype + technique + energy.

━━━ CATEGORIES ━━━
- Sword clash (katana sparks, blade-lock, shockwave ring, debris flying)
- Power-up transformation (aura eruption, hair change, eyes glowing, ground cracking beneath)
- Energy beam/blast (charging pose, beam collision, sky-splitting attack)
- Speed-line charge (blur-dash, afterimage trail, impact frame)
- Martial arts strike (flying kick, palm-strike shockwave, spinning attack)
- Final technique (named-move energy, dramatic pose, background goes black with light burst)
- Rooftop/cliff duel (silhouette standoff, wind blowing cloaks, weapons drawn)
- Tournament arena (crowd in background, two fighters mid-exchange, dust cloud)
- Demon/monster slaying (blade through creature, blood-splatter arc, heroic pose)
- Spirit energy release (inner power manifesting as animal/element/aura shape)

━━━ RULES ━━━
- Characters by ROLE only (young swordsman, masked warrior, fire-wielder) — NEVER named characters
- KINETIC — frozen mid-action, speed lines, impact frames, debris
- Dramatic anime composition (low angle, extreme perspective, foreshortening)

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
