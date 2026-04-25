#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/bloombot/seeds/space_bloom_spaces.json',
  total: 200,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} SPACE + FLOWERS setting descriptions for BloomBot's "space-bloom" path. Each entry describes a sci-fi/space environment where flowers are TAKING OVER — spaceship interiors, alien worlds, space stations, exotic planets. NO specific flower species or colors (a separate pool handles flowers).

Each entry: 15-25 words. One specific space/sci-fi setting with atmosphere and camera angle.

━━━ THE CONCEPT ━━━
Flowers in space. Flowers on spaceships. Flowers on alien worlds. Flowers bursting from space station corridors. Alien landscapes carpeted with impossible blooms. The juxtaposition of cold technological space environments with warm, living, overflowing flowers.

━━━ SETTING TYPES (distribute evenly — NO repeats) ━━━
- Spaceship bridge/cockpit — control panels, viewport showing stars, flowers growing over consoles
- Space station corridor — sterile white hallway, fluorescent lights, flowers bursting from walls
- Alien planet surface — exotic sky color, strange terrain, flowers carpeting the alien ground
- Abandoned space habitat — rotating ring station interior, artificial gravity, overgrown with blooms
- Spaceship cargo bay — metal crates, hydraulic doors, flowers erupting from every container
- Alien crystal cave — translucent formations on an alien world, flowers growing between crystals
- Space greenhouse module — glass dome on a moon's surface, stars above, flowers inside
- Derelict generation ship — centuries abandoned, massive interior, nature fully reclaimed
- Alien ocean shore — bioluminescent water, two moons in sky, flowers lining the alien coast
- Spaceship observation deck — panoramic window, nebula visible, flowers climbing the glass
- Terraform colony ruins — half-built structures on Mars-like world, flowers surviving the attempt
- Alien forest — towering alien trees with impossible geometry, flowers at their base
- Space elevator interior — vertical corridor stretching to orbit, flowers growing along the shaft
- Crashed starship wreck — hull torn open on alien world, flowers growing through the breach
- Zero-gravity garden — floating water spheres, flowers growing in all directions, no up or down
- Asteroid mining outpost — carved rock interior, industrial equipment, flowers in the cracks
- Alien temple — massive stone structure on distant world, ancient carvings, flowers everywhere
- Wormhole gateway — ring structure floating in space, flowers growing impossibly on its frame
- Ice planet hot spring — frozen alien landscape, steaming water, flowers thriving in the warmth
- Orbital platform — open lattice structure above a gas giant, flowers clinging to the framework

━━━ CAMERA ANGLES (vary across entries) ━━━
- Through spaceship viewport framing alien landscape beyond
- Wide interior showing scale of flower takeover
- Low-angle from metal floor through flower growth
- Bird's-eye looking down into flower-filled ship corridor
- Through airlock/doorway framing the overgrown interior
- Intimate cockpit detail with flowers on controls

━━━ FLOWER INSTRUCTIONS (critical) ━━━
Do NOT name specific flower species or colors. Use only generic terms: "blooms", "flowers", "alien flora", "floral explosion". A separate pool provides the specific arrangement. But DO emphasize flowers DOMINATING the space environment.

━━━ ATMOSPHERE (include one per entry) ━━━
Starlight through viewport, nebula glow, bioluminescent shimmer, emergency red lighting, artificial dawn cycle, distant sun through rings, aurora on alien world, reactor core blue glow, cryogenic mist, solar flare orange light

━━━ NO PEOPLE / NO ALIENS ━━━
Absolutely NO people, astronauts, aliens, or creatures. Empty scenes — only flowers and the space environment.

━━━ DEDUP ━━━
Each entry must be a completely DIFFERENT setting. No two spaceship interiors alike, no two alien worlds alike. 25 unique space+flower scenes.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
