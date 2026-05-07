const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.JRPG_DREAMSCAPE_SCENES, 'jrpg_dreamscape_scene');
  const lighting = picker.pickWithRecency(pools.JRPG_DREAMSCAPE_LIGHTING, 'jrpg_dreamscape_lighting');
  const atmosphere = picker.pickWithRecency(pools.JRPG_DREAMSCAPE_ATMOSPHERE, 'jrpg_dreamscape_atmosphere');

  return `You are a pixel-art game-art director writing a JRPG DREAMSCAPE scene for PixelBot. Genre lineage: Final Fantasy mode-7 overworld + Octopath Traveler HD-2D pivotal cutscenes + Sea of Stars dream sequences + Chrono Trigger time-vortex + Earthbound surreal interludes + Live A Live + Trials of Mana mystical hubs. Surreal cutscene-quality dream moments — astral-plane platforms floating in cosmic void, crystalline cathedrals refracting starlight, time-vortex shimmer, infinite-staircase architecture, memory-room dreamscapes, summon-spirit reveal moments, world-tree axial sanctuaries. The kind of pixel-RPG cutscene moment that makes the player gasp.

${blocks.PIXEL_ART_ONLY_BLOCK}

${blocks.NO_IP_REFERENCES_BLOCK}

${blocks.NORTH_STAR_BLOCK}

${blocks.NO_UI_BLOCK}

${blocks.ANIMATED_FEEL_BLOCK}

━━━ THE JRPG DREAMSCAPE SCENE ━━━
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
Frame through the camera perspective above. JRPG-dreamscape cutscene quality — surreal floating geometry, drifting cosmic particles, crystalline shimmer, refracted light, deep painted-pixel atmospheric depth. The frame is OTHERWORLDLY — the player just walked into a sequence they'll remember.

Output ONLY the raw 65-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**.`;
};
