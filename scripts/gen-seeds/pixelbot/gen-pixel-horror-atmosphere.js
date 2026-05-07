#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/pixelbot/seeds/pixel_horror_atmosphere.json',
  total: 200,
  batch: 50,
  append: false,
  maxTokens: 6000,
  metaPrompt: (n) => `Write ${n} ATMOSPHERE descriptions for PixelBot's pixel-horror path (now Castlevania / Ghosts 'n Goblins / Black Tiger / Demon's Crest gothic-fantasy action aesthetic, NOT modern psychological horror).

Each entry is 15-30 words. EVERY entry must include 2-3 of these gothic-action elements:
- Drifting bats / drifting black-feathers / falling autumn-leaves
- Dripping wax / dripping blood / drip-water from stalactites
- Drifting fog / cold-mist over graveyard / hellfire-smoke / volcanic-ash
- Flickering candle-flames dancing
- Falling cobwebs / floating dust motes
- Embers rising from braziers / lava-cracks
- Sparks from clashing weapons / mid-action hit-effects
- Drifting cherry-petals near cursed-rose-bushes
- Lightning flash strobing
- Drifting ash from incinerated village / burning torches
- Ghost-trail wisps / spectral-vapor
- Cracked-stone debris falling / column-dust
- Falling rain-streaks / falling snow

NEVER modern psychological-horror trappings (analog static, CRT-shimmer, suburban-mall, fluorescent-flicker, wrong-pattern-wallpaper).

Examples (write fresh):
- "Drifting bats across the moonlit ramparts, dripping wax from a wall-candelabra, drifting fog rolling over stone parapet, ember-sparks from torches."
- "Falling autumn-leaves across the graveyard, drifting cold-mist between tombstones, dripping water from cracked angel-statues, distant owl-silhouette in flight."
- "Drifting hellfire-smoke from the lava-pit, embers rising from cracks in stone bridge, sparks clashing from knight-and-demon collision, dripping wax from chandelier overhead."
- "Lightning-flash strobing across the storm-sky, falling rain-streaks dithered, drifting cobwebs swaying in cathedral nave, dripping water from cracked sarcophagi."
- "Drifting black-feathers from gargoyle-wings, falling cobwebs from chandelier, dripping wax pools on marble floor, candle-flicker shadows dancing."
- "Drifting cherry-petals from cursed-rose-bushes, drifting cold-mist over toxic swamp, dripping fluid from witch's cauldron, distant howl-silhouette wolf in middle-distance."
- "Drifting ash from incinerated village, falling embers from burning torches, smoke-haze receding into ruined background, cracked-stone debris on foreground tiles."

Output ONLY a valid JSON array of ${n} strings. No preamble, no commentary, no markdown code fences.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
