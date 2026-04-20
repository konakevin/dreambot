#!/usr/bin/env node
/**
 * Generate 50 WILDCARDS — surreal "look twice" elements added to every
 * render via shared DNA. One per render. Intentionally surreal touches
 * that take the image beyond realism.
 *
 * Output: scripts/bots/venusbot/seeds/wildcards.json
 */

const { generatePool } = require('../../lib/seedGenHelper');

generatePool({
  outPath: 'scripts/bots/venusbot/seeds/wildcards.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} WILDCARD surreal elements for a cyborg woman's render. Each is a SINGLE surreal touch that adds a "look twice" quality to an otherwise-realistic shot of her.

━━━ VIBE ━━━

Salvador Dalí meets cyberpunk. Single surreal element that breaks the laws of physics in a specific, visual way. Integrates with her body or nearby space. Not the subject of the image — just a bonus strangeness.

━━━ CATEGORIES TO MIX ━━━

- Floating objects (orbs, planets, crystalline shapes) orbiting her
- Impossible weather (mercury rain, glowing snow, glass petals falling)
- Physics breaks (gravity reversed around her, objects suspended mid-fall, time dilating visually)
- Body-emanations (aura, particles, fractal geometry, glowing breath forming shapes)
- Surreal insertions (third eye, extra limbs half-visible, reflections that don't match)
- Nature-meets-tech (bioluminescent flowers blooming from circuitry, vines of fiber-optic cable)
- Cosmic intrusions (nebula reflected in iris, black-hole swirl behind her)
- Surreal transformations (liquid-metal tears, glitch-art dissolution at edges)
- Mirror/reflection weirdness (her reflection showing different posture, doubled body in window)
- Butterfly / bird / insect effect (ending of hair strands, floating around her)

━━━ CONTENT ━━━

Each entry is 8-18 words. One surreal touch per entry — not a laundry list. Visual and specific.

━━━ BANNED ━━━

- Don't repeat the same wildcard-type across entries
- No generic "magical atmosphere" — be concrete about the specific element
- No props she's holding

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
