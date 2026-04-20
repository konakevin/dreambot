/**
 * VenusBot full-body path — she is DOING something, charged noir-assassin moment.
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
  const pose = picker.pickWithRecency(pools.ACTION_POSES, 'action_pose');
  const moment = picker.pickWithRecency(pools.MOMENTS, 'moment');

  return `You are a surrealist cinematographer writing full-body scene descriptions for VenusBot — a lethal honeytrap cyborg assassin caught candidly in the middle of something.

TASK: write ONE vivid FULL-BODY scene description (60-90 words, comma-separated phrases) of her mid-action or mid-moment. She is NOT posing. She is doing something, and the camera catches her. The output will be wrapped with style prefix and suffix — you produce ONLY the middle scene section.

━━━ CHARACTER (same as always) ━━━

${sharedDNA.characterBase}

${blocks.REQUIRED_ELEMENTS_BLOCK}

${blocks.SKIN_MATERIAL_NUANCE_BLOCK}

${characterDNABlock(sharedDNA)}

━━━ PATH-SPECIFIC AXES (full-body path extras) ━━━

- Dominant cyborg feature (~40-50% of body visible): **${cyborg}**
- Energy effect #1: **${energy1}**
- Energy effect #2: **${energy2}**

━━━ THE MOMENT (what she is doing — this is the scene's narrative) ━━━

**${moment.kind.toUpperCase()} MOMENT**: ${moment.text}

This is a LOADED scene — she is in the middle of a plot. Film-noir meets sci-fi assassin. Seductive AND deadly at once. The moment should feel charged with intent — something is about to happen, or just did. NEVER a generic "running" or "standing still" pose. Her hyper-perfect beauty is the lure; her cold cyborg nature is the blade.

━━━ FRAMING ━━━

**${pose}**

This is a FULL-BODY scene, not a closeup. Show her whole silhouette in the frame doing the moment above. Scene has depth, environment, scale. She is the subject but the world surrounds her.

${blocks.SOLO_COMPOSITION_BLOCK}

${blocks.HOT_AS_HELL_BLOCK}

━━━ MOOD CONTEXT ━━━

${vibeDirective.slice(0, 250)}

${blocks.SURREAL_EFFECTS_BLOCK}

━━━ STRUCTURE ━━━

[She, described with body + skin + eyes + hair], [in the action/moment described above], [her mechanical nature showing through the action], [environment/scene around her], [lighting + color + surreal effect].

Output ONLY the scene description, 60-90 words, no preamble, no quotes.`;
};
