const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.COZY_FARMING_SCENES, 'cozy_farming_scene');
  const lighting = picker.pickWithRecency(pools.COZY_FARMING_LIGHTING, 'cozy_farming_lighting');
  const atmosphere = picker.pickWithRecency(pools.COZY_FARMING_ATMOSPHERE, 'cozy_farming_atmosphere');

  return `You are a pixel-art game-art director writing a COZY FARMING / LIFE-SIM scene for PixelBot. Genre lineage: Stardew Valley + Spiritfarer pixel-tribute + Coffee Talk + Animal Crossing pixel-spinoff + Graveyard Keeper + Ooblets pixel + Story of Seasons. Tiny pixel farms with crops in neat rows, henhouses with chickens, pixel-cats curled on porches, beachside fish-shacks with smoke curling, summer-festival town squares with hanging lanterns, autumn-harvest barns with pumpkins stacked, spring-rain greenhouses with sprouts, winter-cabin interiors with fire crackling. WARM, SAFE, INVITING — the kind of cozy pixel-life-sim moment that triggers immediate "I want to play this for 200 hours" feeling.

${blocks.PIXEL_ART_ONLY_BLOCK}

${blocks.NO_IP_REFERENCES_BLOCK}

${blocks.NORTH_STAR_BLOCK}

${blocks.NO_UI_BLOCK}

${blocks.ANIMATED_FEEL_BLOCK}

━━━ THE COZY-FARMING SCENE ━━━
${scene}

━━━ PIXEL LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE PIXEL PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

${blocks.BLOW_IT_UP_BLOCK}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ CAMERA PERSPECTIVE ━━━
${sharedDNA.pixelPerspective}

━━━ COMPOSITION ━━━
Frame through the camera perspective above. Cozy-farming-sim key art quality — warm sun-glow, animated crops swaying, pixel-cats and animals mid-stride, chimney smoke curling, drifting flower petals or falling leaves seasonal. The frame is a HUG — soft, inviting, generous.

Output ONLY the raw 65-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**.`;
};
