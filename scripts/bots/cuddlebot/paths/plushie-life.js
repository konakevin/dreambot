/**
 * CuddleBot plushie-life path — plushies alive Toy-Story-style.
 * Tea parties, picnics, movie nights, pillow-fort camping. Plushie texture
 * visible (fabric, button-eyes, stitching).
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.PLUSHIE_SCENES, 'plushie_scene');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are writing PLUSHIE-ALIVE scenes for CuddleBot — plushies come alive Toy-Story-style doing cozy activities together. Fabric-textured, button-eyes, visible stitching, felt details. Warm wholesome cozy. Output wraps with style prefix + suffix.

${blocks.CUTE_CUDDLY_COZY_BLOCK}

${blocks.STYLIZED_NOT_PHOTOREAL_BLOCK}

━━━ PLUSHIE AESTHETIC (required) ━━━
Fabric texture visible. Button-eyes or stitched-eyes. Soft rounded shapes, slight plumpness. Stitched seams. Felt accessories. Charming handmade-toy energy.

${blocks.NO_DARK_NO_INTENSE_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE PLUSHIE SCENE ━━━
${scene}

━━━ LIGHTING (warm cozy only) ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

${blocks.BLOW_IT_UP_BLOCK}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION ━━━
Mid frame with 2-4 plushies as subjects. Fabric texture prominent. Warm cozy lighting. Cozy props (tiny fabric blanket, mini-felt accessories, stitched cupcakes). Toy-Story-alive but handmade-softness.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
