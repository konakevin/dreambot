#!/usr/bin/env node
/**
 * Generate 50 ENERGY EFFECTS — the glowing/pulsing/crackling effects
 * present on her body. Used in closeup / full-body / seduction paths.
 *
 * Each describes a specific lighting/energy phenomenon visible on or
 * through her body. Electric, plasma, chromatic, holographic, bioluminescent.
 *
 * Output: scripts/bots/venusbot/seeds/energy_effects.json
 */

const { generatePool } = require('../../lib/seedGenHelper');

generatePool({
  outPath: 'scripts/bots/venusbot/seeds/energy_effects.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} ENERGY EFFECT descriptions for a cyborg woman. Each describes a specific glowing/pulsing/radiating visual element ON or THROUGH her body.

━━━ WHAT MAKES A GOOD ENTRY ━━━

- Describes one SPECIFIC visual phenomenon (not a generic "she glows")
- Names the location (eyes, circuit traces, core, skin, hair, joints, seams)
- Names the quality (pulsing, crackling, blazing, bleeding, washing, arcing, streaming, suspended)
- Feels integrated into her body, not a filter on top

━━━ CATEGORIES TO MIX ━━━

- Eye / visual apparatus glows (plasma irises, triple-iris rings, mechanical iris shutters)
- Circuit patterns under skin (bioluminescent tree-veins, hexagonal cells, data streams)
- Core radiance (pulsing internal reactor visible through translucent torso)
- Joint electricity (arcing bolts at shoulder/neck/elbow)
- Hair energy (crackling filaments, sparking tips, plasma drift)
- Atmospheric effects caused by her (chromatic aberration from her presence, refraction halos)
- Breath/exhale phenomena (glowing mist, visible plasma vapor)
- Seam / edge glows (light bleeding from between chrome plates)

━━━ CONTENT ━━━

Each entry is 12-20 words. Vary widely. Don't repeat category phrasing.

━━━ BANNED ━━━

- No fireworks on her surface. No decorative glowing hearts / emblems / logos. No sparks bursting off her chest.
- Everything glowing either lives INSIDE her body (visible through translucent panels) or UNDER her skin (bioluminescent) or AT her eyes. Never surface effects.

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
