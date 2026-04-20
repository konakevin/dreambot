/**
 * VenusBot closeup path — waist-up bust portrait, face fills upper third.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

function characterDNABlock(dna) {
  return `━━━ HER BODY (shared character DNA) ━━━

- Body type / silhouette (MUST land — don't default to runway-thin): **${dna.bodyType}**
- Skin tone tint on organic skin (pores visible): **${dna.skin}**
- Hair: **${dna.hair}**
- Eyes: **${dna.eyes}**
- Internal workings visible through translucent panel: **${dna.internal}**
- Surreal wildcard: **${dna.wildcard}**
- SCENE-WIDE COLOR PALETTE (overrides the default cinematic teal/orange — the WHOLE image should be graded in this palette): **${dna.scenePalette}**
- Secondary lighting palette (supports scene palette above): ${dna.colorPalette}
- DOMINANT GLOW COLOR (every glowing cyborg element — eyes, internal core, circuits — renders in this color): **${dna.glowColor}**`;
}

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const cyborg = picker.pickWithRecency(pools.CYBORG_FEATURES, 'cyborg_feature');
  const energy1 = picker.pickWithRecency(pools.ENERGY_EFFECTS, 'energy');
  let energy2 = picker.pick(pools.ENERGY_EFFECTS);
  while (energy2 === energy1) energy2 = picker.pick(pools.ENERGY_EFFECTS);
  const pose = picker.pickWithRecency(pools.POSES, 'pose');
  const expression = picker.pickWithRecency(pools.EXPRESSIONS, 'expression');
  const accent = picker.pickWithRecency(pools.ACCENT_DETAILS, 'accent');
  const environment = picker.pickWithRecency(pools.ENVIRONMENTS, 'environment');

  return `You are a surrealist cinematographer writing tight-frame scene descriptions for VenusBot. The camera catches her close-up — she is NOT posing for this, she is simply in the world and the camera happens to be near.

TASK: write ONE vivid scene description (60-80 words, comma-separated phrases) of a HALF-HUMAN HALF-MACHINE CYBORG WOMAN in a candid close-up moment. The output will be automatically wrapped with style prefix and suffix — you produce ONLY the middle scene section.

━━━ CHARACTER RULES (who SHE is) ━━━

${sharedDNA.characterBase}

${blocks.REQUIRED_ELEMENTS_BLOCK}

${blocks.SKIN_MATERIAL_NUANCE_BLOCK}

${characterDNABlock(sharedDNA)}

━━━ PATH-SPECIFIC AXES (closeup path extras) ━━━

- EXPRESSION: **${expression}**
- POSE (within waist-up framing): **${pose}**
- CYBORG HALF (must be dominant, ~40-50% of frame): **${cyborg}**
- Energy effect #1: **${energy1}**
- Energy effect #2: **${energy2}**
- ACCENT DETAIL (subtle extra): **${accent}**
- Environment: **${environment}**

━━━ FRAMING ━━━

Tight frame — face + throat + shoulder. Either head-and-shoulders, waist-up three-quarter, or side-profile. Face fills most of the frame. NEVER show legs or hips. She is NOT posing — she is in the middle of something (thinking, looking, listening, noticing) and the camera is close enough to catch it.

Avoid: reclining, seated, full-body, distant figure. This is a close shot of her doing something small but loaded.

${blocks.SOLO_COMPOSITION_BLOCK}

${blocks.HOT_AS_HELL_BLOCK}

━━━ MOOD CONTEXT (subtle, don't override subject) ━━━

${vibeDirective.slice(0, 250)}

${blocks.SURREAL_EFFECTS_BLOCK}

━━━ STRUCTURE (write in this order) ━━━

[stunning cyborg woman with {skin}], [{eyes}], [{hair}], [{cyborg feature} integrated with her body], [what she is doing — tight frame], [environment], [color palette + surreal effect layer]

Output ONLY the 60-80 word scene description. No preamble, no quotes, no meta-commentary. Do NOT use "pose", "posing", "editorial", "fashion shoot", "portrait" — she is NOT modeling.`;
};
