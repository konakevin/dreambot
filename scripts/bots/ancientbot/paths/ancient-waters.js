/**
 * AncientBot ancient-waters — coastal and aquatic civilizations.
 * Island cities, marsh dwellings, flooded temples, reed-boat fleets.
 * Water is not background — it is part of the architecture and life.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const setting = picker.pickWithRecency(pools.WATER_SCENES, 'water_scene');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are painting ONE aquatic ancient civilization scene for AncientBot — a place where WATER and CIVILIZATION are inseparable. Island fortresses, marsh settlements, flooded temple precincts, coastal cities built into the sea itself. These civilizations didn't just live NEAR water — they lived WITH it, ON it, BECAUSE of it. Output wraps with style prefix + suffix.

${blocks.ANCIENT_WORLD_BLOCK}

${blocks.PERIOD_ACCURACY_BLOCK}

━━━ BACKGROUND ACTIVITY ━━━
Tiny figures in boats, on docks, wading, fishing — water-life activity at scale. NEVER subjects, always background texture.

━━━ THE WATER SCENE ━━━
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
Water is a MAJOR compositional element — reflections, surface texture, horizon line. Architecture rises FROM or sits BESIDE water. Wide shots that show the relationship between built structures and water — how one shapes the other. Reflections of painted buildings on still water. Boats at various distances for scale and depth. Light interacting with water surface — glinting, rippling, mirror-still. Foreground: waterline detail (reeds, boats, quay stones). Midground: architecture meeting water. Background: open water or coastline receding to horizon.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO markers, NO bold. Just the phrases, starting immediately with the scene content.`;
};
