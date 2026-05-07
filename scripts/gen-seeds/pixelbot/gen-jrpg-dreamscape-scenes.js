#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/pixelbot/seeds/jrpg_dreamscape_scenes.json',
  total: 200,
  batch: 50,
  append: false,
  maxTokens: 6000,
  metaPrompt: (n) => `Write ${n} JRPG DREAMSCAPE scene descriptions for PixelBot's jrpg-dreamscape path. Genre lineage: Final Fantasy mode-7 overworld + Octopath Traveler HD-2D pivotal cutscenes + Sea of Stars dream sequences + Chrono Trigger time-vortex + Earthbound surreal interludes + Live A Live + Trials of Mana mystical hubs.

Each entry: 30-50 words, ONE paragraph, focused on a SURREAL JRPG CUTSCENE MOMENT — astral-plane platforms floating in cosmic void, crystalline cathedrals refracting starlight, time-vortex shimmer, infinite-staircase architecture.

━━━ THE NORTH STAR ━━━

Every scene should feel like "a screenshot of a pivotal cutscene from a JRPG I desperately wish existed." The kind of pixel-RPG moment that makes the player gasp — surreal, cosmic, otherworldly, the player has just walked into a sequence they'll remember.

━━━ SCENE TYPES — ROTATE BROADLY ━━━

- Astral-plane floating platforms in cosmic void with star-fields swirling, refracted starlight
- Crystalline cathedral with prismatic walls refracting rainbow light, vaulted ceiling, drifting motes
- Time-vortex with clock-faces rotating around an infinite stairwell, drifting hourglass-sand
- Memory-room hub with floating still-frames of past events suspended in milky-white space
- World-tree axial sanctuary with the trunk extending into infinity, glowing leaves
- Summon-spirit reveal cosmic chamber with elemental titan emerging from runic circle
- Dream-cloud platform with refracted-rainbow halo, drifting feather-motes
- Mirror-realm chamber with infinite reflections of the same moment, refracted light
- Inner-spirit forest with translucent-crystalline trees, soft-glow leaves drifting
- Cosmic-temple steps ascending into starlight, runes pulsing on each step
- Ocean-dreamscape with translucent waves and glowing fish swimming through air
- Painted-sky-realm with brush-stroke clouds, surreal moonlit-floating-isles
- Astral-hourglass chamber with massive cosmic hourglass at center, falling sand-stars
- Crystal-staircase to nowhere, suspended in iridescent cosmic mist
- Inner-temple chamber with glowing sigil floor, surrounded by floating books
- Dream-river floating in space with translucent water, koi swimming through stars
- Wing-cathedral with massive feathered statues lining a starlit nave
- Reflection-pool dreamscape where the surface shows another world below
- Heaven-arch sanctuary with golden gates, descending light-pillars, drifting petals
- Limbo-clearing with monochrome trees, single colorful flower in foreground

━━━ HARD RULES ━━━

- SURREAL / OTHERWORLDLY mood — gravity may be optional, geometry may be impossible
- COSMIC / SOFT-GLOW LIGHTING — refracted prism-light, starlight, soft-pulse magical glow
- DRIFTING PARTICLES — feathers, petals, motes, shimmer-sparks, falling stars, hourglass-sand, drifting leaves
- LAYERED COSMIC DEPTH — foreground subject + middle architecture/floating-element + far cosmic backdrop
- The frame should feel WEIGHTLESS, MAGICAL, LIKE A DREAM
- NEVER mention specific game IPs (Final Fantasy, Octopath, Chrono Trigger by name)
- NEVER include UI / HUD / menus / dialogue boxes

━━━ EXAMPLES (write fresh — do not copy) ━━━

- "An astral-plane platform floating in a swirling cosmic void, three drifting orbs of pale-cyan light hovering above the disc, refracted starlight from a distant nebula casting prismatic shadows, drifting feather-motes, layered cosmic-cloud parallax."
- "A crystalline cathedral interior with prismatic walls refracting rainbow light onto a runic-inscribed floor, vaulted ceiling extending into infinity, two glowing seraph-statues flanking the central altar, drifting magical motes, layered prism parallax."
- "A time-vortex chamber with massive clock-faces rotating slowly around an infinite stairwell, drifting hourglass-sand suspended mid-fall, golden glow at the center, soft pink-and-violet cosmic backdrop, layered swirling vortex parallax."
- "A world-tree axial sanctuary with the colossal trunk extending up into infinity, glowing pale-gold leaves drifting down, runic spirals carved into the bark, soft-glow cosmic backdrop, drifting magical motes."
- "A summon-spirit reveal chamber with a runic circle on a stone floor, a TOWERING translucent elemental titan rising from the center radiating pulse-glow, drifting prism-motes, layered cosmic backdrop fading to deep starfield."

━━━ AVOID ━━━

- Specific named IPs
- Mundane / realistic settings — these are SURREAL DREAMSCAPES
- Static frames — always drifting elements (motes, feathers, sand, petals, stars)
- UI / HUD / menus

━━━ OUTPUT ━━━
Output ONLY a valid JSON array of ${n} strings. Each string is one complete scene description (30-50 words). No preamble, no commentary, no markdown code fences.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
