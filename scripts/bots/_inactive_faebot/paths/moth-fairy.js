/**
 * FaeBot moth-fairy path — nocturnal fae with moth wings, moonlight, lantern glow.
 * The forest at night. Dusty wing scales, soft lamplight, twilight mystery.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const setting = picker.pickWithRecency(pools.MOTH_FAIRY_SETTINGS, 'moth_fairy_setting');
  const action = picker.pickWithRecency(pools.MOTH_FAIRY_ACTIONS, 'moth_fairy_action');

  return `You are a night-vision wildlife cinematographer who has captured a MOTH FAIRY in the forest after dark. She does NOT know she is being filmed. She is a NOCTURNAL FAE — drawn to light sources, dusted with wing-scale powder, eyes that reflect moonlight. The forest at night is her domain. Output will be wrapped with style prefix + suffix.

━━━ ARCHETYPE — MOTH FAIRY (NOCTURNAL) ━━━
She has MOTH WINGS — not butterfly. Moth wings are broader, fuzzier, patterned with eye-spots and geometric designs in muted earth tones (cream, brown, rust, charcoal, dusty pink, sage). Her wings are dusted with visible SCALES that shed as glittering powder when she moves. Her body is covered in soft fur-like fuzz across her shoulders, collar, and forearms. Her eyes are ENORMOUS — adapted to darkness, reflective like a cat's in lamplight. She is drawn irresistibly to LIGHT SOURCES — lanterns, candles, moonbeams, fireflies. Her antennae are feathered and expressive. She is softer, more vulnerable, more mysterious than her daytime fairy cousin.

${blocks.BEAUTY_BLOCK}

${blocks.SOLO_BLOCK}

${blocks.WILDLIFE_DOC_BLOCK}

━━━ WHAT SHE IS DOING ━━━
${action}

━━━ SETTING ━━━
${setting}

━━━ FOREST LIGHT ━━━
Nocturnal — moonlight, lantern glow, bioluminescence, starlight, firefly light. NEVER bright daylight.

━━━ COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ MOOD ━━━
${vibeDirective.slice(0, 250)}

${blocks.PAINTERLY_BLOCK}

Output ONLY the 60-90 word scene description. Comma-separated phrases. No preamble. Emphasize moth-wing textures, scale-dust particles, nocturnal lighting, drawn-to-light behavior.`;
};
