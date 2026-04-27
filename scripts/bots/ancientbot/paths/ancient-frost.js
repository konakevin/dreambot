/**
 * AncientBot ancient-frost — frozen and highland ancient settings.
 * Mountain fortresses, snow-dusted stone circles, winter storms, cold dawn.
 * The cold is a character in every scene.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const setting = picker.pickWithRecency(pools.FROST_SCENES, 'frost_scene');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are painting ONE frozen/highland ancient civilization scene for AncientBot — the ancient world in COLD. Mountain fortresses against grey winter sky, frost on carved stone, snow dusting megalithic circles, breath-fog in torchlit corridors. These civilizations endured harsh climates and built to survive them. The cold should be FELT in every element. Output wraps with style prefix + suffix.

${blocks.ANCIENT_WORLD_BLOCK}

${blocks.PERIOD_ACCURACY_BLOCK}

━━━ NO PEOPLE ━━━
Pure environment. The cold emptiness is part of the atmosphere — harsh, beautiful, enduring.

━━━ THE FROZEN SCENE ━━━
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

━━━ COLD IS VISIBLE ━━━
The cold must be SEEN: frost crystals on stone surfaces, snow collecting in carved reliefs, ice forming on water, grey overcast light, pale winter sun low on the horizon, breath-fog from any warm opening, smoke rising straight in still frozen air. Stone looks HARDER in cold — sharper edges, bluer shadows, crystalline clarity. Warm elements (hearth glow through doorways, torch light, smoke) contrast dramatically against the cold.

━━━ COMPOSITION ━━━
Low angles emphasizing massive stone against dramatic cold sky. Mountain peaks and highland ridges in background. Snow and frost providing high-contrast detail on ancient surfaces. Depth through atmospheric perspective — cold haze, snow-veil, mountain layers fading to grey. Warm light sources (if any) are SMALL against vast cold — a doorway glowing amber, smoke rising from a distant roof-hole.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO markers, NO bold. Just the phrases, starting immediately with the scene content.`;
};
