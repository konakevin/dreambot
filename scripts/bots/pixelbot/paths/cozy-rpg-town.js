const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.COZY_RPG_TOWN_SCENES, 'cozy_rpg_town_scene');
  const lighting = picker.pickWithRecency(pools.COZY_RPG_TOWN_LIGHTING, 'cozy_rpg_town_lighting');
  const atmosphere = picker.pickWithRecency(pools.COZY_RPG_TOWN_ATMOSPHERE, 'cozy_rpg_town_atmosphere');

  return `You are a pixel-art game-art director writing a COZY RPG TOWN scene for PixelBot. Genre lineage: Stardew Valley + Octopath Traveler HD-2D + Sea of Stars + Eastward + Children of Morta town hubs. The kind of cozy pixel-RPG town the player returns to between adventures — half-timbered houses, warm tavern light, market-stalls, NPCs going about their day, cobblestone paths winding between shops.

${blocks.PIXEL_ART_ONLY_BLOCK}

${blocks.NO_IP_REFERENCES_BLOCK}

${blocks.NORTH_STAR_BLOCK}

${blocks.NO_UI_BLOCK}

${blocks.ANIMATED_FEEL_BLOCK}

━━━ THE TOWN SCENE ━━━
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
Frame through the camera perspective above. Cozy-RPG-town key art quality — Octopath HD-2D depth, warm tavern lights glowing in middle distance, animated NPCs and signs of life everywhere. The town is INHABITED.

Output ONLY the raw 65-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**.`;
};
