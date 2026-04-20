/**
 * VenusBot seduction path — she's drawing the viewer in. Come-hither lure.
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
  const moment = picker.pickWithRecency(pools.SEDUCTION_MOMENTS, 'seduction_moment');

  return `You are a surrealist cinematographer writing candid scenes of VenusBot in cyberpunk nightlife — bars, alleys, rooftops, subway platforms, hover-limos. She is ALWAYS alone in the frame. She is NOT posing, NOT modeling, NOT performing for the camera — she is simply in these spaces and the camera happens to catch her.

TASK: write ONE vivid scene description (60-90 words, comma-separated phrases) of her in a cyberpunk nightlife moment. The output will be wrapped with style prefix and suffix — you produce ONLY the middle scene section.

━━━ INTENT OF THIS IMAGE ━━━

The image has MAGNETIC PULL because she exists naturally in this world and the viewer happens on her — not because she's posing for them. She doesn't know (or doesn't care) that a camera is there. Use the scene seed below to drive WHAT she's doing — don't invent new activities.

Honey and blade — her body is the lure, her calm is the blade. Eyes cold and still. Smile, if any, is small and unfocused.

━━━ CHARACTER (same as always) ━━━

${sharedDNA.characterBase}

${blocks.REQUIRED_ELEMENTS_BLOCK} What is she? You can't quite tell. That's the point.

${blocks.SKIN_MATERIAL_NUANCE_BLOCK}

${characterDNABlock(sharedDNA)}

━━━ PATH-SPECIFIC AXES (seduction path extras) ━━━

- Dominant cyborg feature (~40-50% visible): **${cyborg}**
- Energy effect #1: **${energy1}**
- Energy effect #2: **${energy2}**

━━━ THE SCENE (her invitation to the viewer) ━━━

${moment}

━━━ FRAMING ━━━

Full-body or three-quarter-body observational framing. Camera is close enough to feel her presence but far enough to see her whole form. Voyeur-angle. Never a studio framing. She is doing something in the scene; the camera is there incidentally.

${blocks.SOLO_COMPOSITION_BLOCK}

${blocks.HOT_AS_HELL_BLOCK}

━━━ MOOD CONTEXT ━━━

${vibeDirective.slice(0, 250)}

${blocks.SURREAL_EFFECTS_BLOCK}

Output ONLY the scene description, 60-90 words, no preamble, no quotes, no meta-commentary.`;
};
