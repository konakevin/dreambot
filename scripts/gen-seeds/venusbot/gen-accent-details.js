#!/usr/bin/env node
/**
 * Generate 50 ACCENT DETAILS — small jaw-dropping extras. Rolled per
 * render as a "look twice" touch. Used in closeup path.
 *
 * Small, specific, unexpected details. Not required to be central, but
 * adds a distinctive flourish.
 *
 * Output: scripts/bots/venusbot/seeds/accent_details.json
 */

const { generatePool } = require('../../lib/seedGenHelper');

generatePool({
  outPath: 'scripts/bots/venusbot/seeds/accent_details.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} ACCENT DETAIL descriptions for a cyborg-assassin woman. Each describes a small but distinctive visual flourish that adds a "look twice" quality.

━━━ WHAT MAKES A GOOD ENTRY ━━━

- Small, specific, visually arresting
- Integrated with her existing form (not a prop held in hand)
- Can be technological, decorative, surreal, organic-alien, or ornamental

━━━ CATEGORIES TO MIX ━━━

- Eyelash variants (iridescent, fiber-optic, crystalline, feathered, multiple rows)
- Face markings (light-scars, constellation freckles, data-tattoos, glowing runes, traced circuitry)
- Small implants (brow piercings with LEDs, neural ports, temple scanners, cheek sensors)
- Accessories fused to body (filigree ear pieces, crown pieces, lip rings, forehead gems)
- Cosmetic surreal touches (nebula in iris, galaxy reflection in eye, tears of mercury/light, third-eye symbols)
- Hair ornamentation (chrome orbs braided in, glowing pins, fiber-optic ribbons)
- Neck/collar details (lace circuit collar, fiber-optic necklace, pulsing throat implant)
- Subtle organic-alien touches (small horns at temple, micro-scales along jaw, iridescent patches)

━━━ CONTENT ━━━

Each entry is 8-18 words. Specific enough to paint a clear picture, small enough not to dominate the frame.

━━━ BANNED ━━━

- No large features (those are CYBORG_FEATURES axis)
- No props she's holding (cigarettes, drinks, weapons, phones — other axes)
- No posing-language

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
