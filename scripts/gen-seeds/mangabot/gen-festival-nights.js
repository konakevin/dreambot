#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/festival_night_scenes.json',
  total: 25,
  batch: 25,
  append: false,
  maxTokens: 4000,
  metaPrompt: (n) => `Write ${n} FESTIVAL NIGHTS scene descriptions for MangaBot's festival-nights path. Each entry is 30-50 words. Setting-only.

CONTEXT: Japanese summer matsuri / hanami / fireworks night. Lanterns, food stalls, yukata, fireworks, riverbanks. Romance-coded summer-night anime keyframe. The most iconic anime-festival vibe.

Categories — rotate widely:
- Lantern-lined festival lane (rows of red-and-white paper lanterns, food stalls on both sides, foot-traffic in distance)
- Fireworks over a riverbank (massive chrysanthemum bursts above black river, distant crowd silhouettes)
- Goldfish-scooping booth (paper-net stall with shallow pool of bright orange goldfish, lantern-lit)
- Yatai food stall (takoyaki / yakisoba / okonomiyaki griddle, steam rising, vendor visible)
- Hilltop fireworks viewpoint (distant fireworks across a bay, foreground silhouette of a torii gate)
- Shrine-courtyard festival (stone lanterns lit, omikuji booths, fortune-paper trees, taiko drums)
- Riverside walkway with floating lanterns (stream of glowing paper lanterns drifting downriver)
- Bridge crossing with fireworks above (arched stone bridge, lantern-lit, fireworks over the water beyond)
- Festival-lane night view from a window (warm-lit street below, viewer perspective from a balcony)
- After-the-fireworks quiet (empty festival lane post-finale, fallen-petal-and-paper-debris on cobbles, last lanterns)

EVERY entry must include:
- Specific festival setting (festival lane / riverbank / hilltop / shrine courtyard / etc.)
- 4-6 environmental details (paper lanterns / food stalls / wooden booths / festival banners / strung-lights / wooden geta sandals on stone / festival masks / fortune-paper / chouchin red lanterns / yatai steam / cobblestone wet from drink-spill / takoyaki griddles)
- 1-2 atmospheric effects (smoke from grills, fireworks sparks raining, drifting paper-lantern-glow, distant haze, summer humidity haze, drifting smoke from incense)
- Lighting tone (lantern-amber warm / firework burst-light / golden-orange-summer-evening / cool-blue-after-twilight)

ABSOLUTELY BANNED:
- NO photoreal photography descriptors
- NO crowded-with-faces (one or two distant silhouettes only — no detailed crowd)
- NO Western festivals
- NO sexualized framing

Examples (write fresh):
- "Lantern-lined matsuri food street at dusk, two rows of red-and-white paper lanterns strung overhead, yatai food stalls lining both sides with takoyaki and okonomiyaki griddles steaming, distant kimono-figures in motion, drifting smoke from grills, warm amber lantern-glow, cobblestones wet from a recent rain"
- "Riverside fireworks viewpoint with a massive golden chrysanthemum burst above the dark river, distant lantern-lit bridge crossing the water, floating paper-lanterns drifting downstream in the foreground, smoke-haze from the fireworks above, viewer-perspective from a low riverbank, summer humidity in the air"
- "Shrine courtyard festival at night with stone lanterns lit, taiko drum platform in the midground, fortune-paper trees with hundreds of folded paper omikuji tied to branches, distant kimono-clad figures lighting incense, drifting incense smoke, lantern-warm amber lighting, cherry petals falling though it's not spring"

Output ONLY a valid JSON array of ${n} strings (30-50 words each). No preamble, no commentary.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
