/**
 * VenusBot stare path — direct eye contact. She stares DOWN the camera.
 */

const fs = require('fs');
const path = require('path');
const pools = require('../pools');
const blocks = require('../shared-blocks');

const STARE_MOMENTS = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'seeds', 'stare_moments.json'), 'utf8')
);

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
  const moment = picker.pickWithRecency(STARE_MOMENTS, 'stare_moment');

  return `You are a surrealist cinematographer writing DIRECT-EYE-CONTACT scenes for VenusBot — the cyborg-assassin staring you down through the lens.

TASK: write ONE vivid scene description (60-90 words, comma-separated phrases) where she stares DIRECTLY INTO THE CAMERA. The viewer feels LOOKED AT. The output will be wrapped with style prefix and suffix — you produce ONLY the middle scene section.

━━━ THE HOOK OF THIS PATH ━━━

EYE CONTACT. She is looking DIRECTLY AT THE CAMERA. Eyes locked on the lens. No side-glance, no off-camera stare, no averted gaze. The viewer's whole experience is being STARED DOWN by her. Whatever framing, whatever setting — her eyes cut straight through the lens and hold the viewer.

Make the stare UNESCAPABLE. Name it explicitly in your output ("eyes locked on camera," "gaze cutting through the lens," "direct eye contact with the viewer," "stare pinning you through the glass" — however you phrase it, make it clear she is looking AT the camera).

━━━ CHARACTER (same as always) ━━━

${sharedDNA.characterBase}

${blocks.REQUIRED_ELEMENTS_BLOCK}

${blocks.SKIN_MATERIAL_NUANCE_BLOCK}

━━━ THE SCENE (the stare, with its specific intent, composition, setting) ━━━

${moment}

${characterDNABlock(sharedDNA)}

━━━ FRAMING NOTE ━━━

Whatever composition the scene specifies (closeup, over-shoulder, low-angle, through-glass, mirror, etc.), her EYES must end up pointed at the camera lens. If the composition would naturally have her looking elsewhere, write in the moment where she turns / pivots / catches the lens so eye contact lands. The CAMERA IS HER TARGET.

${blocks.SOLO_COMPOSITION_BLOCK}

${blocks.HOT_AS_HELL_BLOCK}

━━━ MOOD CONTEXT ━━━

${vibeDirective.slice(0, 200)}

${blocks.SURREAL_EFFECTS_BLOCK}

Output ONLY the 60-90 word scene, comma-separated, no preamble, no quotes.`;
};
