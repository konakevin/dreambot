/**
 * AncientBot ancient-night — the ancient world after dark.
 * Starlit monuments, torch-lit processions, moonlit ruins, oil-lamp streets.
 * Small warm light against vast darkness.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const setting = picker.pickWithRecency(pools.NIGHT_SCENES, 'night_scene');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are painting ONE nocturnal ancient civilization scene for AncientBot — the ancient world at NIGHT, DUSK, or DAWN. No electric light existed. Night was TRULY DARK, and the light sources — oil lamps, torches, hearth fire, moonlight, starlight — created intimate, dramatic, beautiful scenes unlike anything modern eyes have seen. Output wraps with style prefix + suffix.

${blocks.ANCIENT_WORLD_BLOCK}

${blocks.PERIOD_ACCURACY_BLOCK}

━━━ THE NIGHT SCENE ━━━
${setting}

━━━ ATMOSPHERE ━━━
${atmosphere}

━━━ PALETTE ━━━
${sharedDNA.scenePalette}
${sharedDNA.colorPalette}

${blocks.BLOW_IT_UP_BLOCK}

━━━ MOOD ━━━
${vibeDirective.slice(0, 250)}

━━━ DARKNESS AND LIGHT ━━━
DARKNESS is dominant. Light sources are SMALL and WARM against vast dark — a single oil lamp illuminating a carved wall, torches casting dancing orange on painted columns, moonlight silvering one side of a monument while the other vanishes into black. The contrast between warm firelight and cool moonlight/starlight creates the drama. Stars: these skies had ZERO light pollution — the Milky Way was a blazing river overhead, overwhelming and vivid. Render star-dense skies when visible.

━━━ COMPOSITION ━━━
Dramatic chiaroscuro — pools of warm light surrounded by deep shadow. The light SOURCE matters: where is it, what does it illuminate, what does it leave in darkness? Architecture partially revealed, partially hidden by night. If sky is visible, it should be DENSE with stars or dramatic with moon/clouds. Foreground: lit detail (lamp, torch, fire). Midground: architecture half-lit. Background: vast dark sky or moonlit horizon. Dusk/dawn scenes: dramatic color gradient across the sky, silhouetted architecture.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO markers, NO bold. Just the phrases, starting immediately with the scene content.`;
};
