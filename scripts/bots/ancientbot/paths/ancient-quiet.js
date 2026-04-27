/**
 * AncientBot ancient-quiet — intimate corners of the ancient world.
 * Scribe chambers, potter's workshops, desert camps, rooftop dusks.
 * Cozy path adapted from DragonBot's cozy-arcane pattern.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const setting = picker.pickWithRecency(pools.QUIET_SCENES, 'quiet_scene');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are painting ONE quiet intimate scene from the ancient world for AncientBot — a warm, personal, lived-in corner tucked inside or alongside a great civilization. Same ancient world as our grand temples and colossal monuments, but zoomed into the SMALL HUMAN SPACES where scribes worked, where potters shaped clay, where shepherds watched stars. Output wraps with style prefix + suffix.

${blocks.ANCIENT_WORLD_BLOCK}

${blocks.PERIOD_ACCURACY_BLOCK}

━━━ NO PEOPLE ━━━
Pure environment. No figures, no characters. But the space should feel RECENTLY OCCUPIED — tools left mid-task, lamp still burning, warmth lingering. Someone was just here.

━━━ THE QUIET SPACE ━━━
${setting}

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERE ━━━
${atmosphere}

━━━ PALETTE ━━━
${sharedDNA.scenePalette}
${sharedDNA.colorPalette}

${blocks.BLOW_IT_UP_BLOCK}

━━━ MOOD ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION ━━━
Mid or mid-close framing. These are INTIMATE spaces — not temple halls. A scribe's corner, a rooftop at dusk, a tomb painter's alcove, a shepherd's camp under stars. WARMTH is everything: oil-lamp glow, hearth embers, kiln heat, sunset through a small window. Rich texture on every surface — worn clay, stacked tablets, dried herbs, bronze tools with patina, linen draped over reed furniture, ceramic vessels. The viewer should want to SIT DOWN in this space. Cozy but unmistakably ANCIENT — every object is 4000 years old. Some scenes are indoors (workshops, chambers), some outdoors (camps, rooftops, abandoned shrines) — let the setting guide it.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO markers, NO bold. Just the phrases, starting immediately with the scene content.`;
};
