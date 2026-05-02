/**
 * CuddleBot plushie-life path — plushies alive Toy-Story-style.
 * 50/50 split: single-plushie hero portrait OR group-plushie shot
 * (3-5 plushies tea-party / picnic / pillow-fort / movie-night).
 * Plushie texture visible (fabric, button-eyes, stitching).
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.PLUSHIE_SCENES, 'plushie_scene');
  const main = picker.pickWithRecency(pools.CUTE_CREATURES, 'creature');
  const supporting1 = picker.pickWithRecency(pools.CUTE_CREATURES, 'creature');
  const supporting2 = picker.pickWithRecency(pools.CUTE_CREATURES, 'creature');
  const supporting3 = picker.pickWithRecency(pools.CUTE_CREATURES, 'creature');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');
  const isGroup = Math.random() < 0.5;

  const compositionBlock = isGroup
    ? `━━━ COMPOSITION — GROUP PLUSHIE SHOT (50% mode) ━━━
Mid-wide frame with 3-5 plushies gathered together for the activity. The MAIN PLUSHIE leads the composition (front-and-center or focal). The 3 SUPPORTING PLUSHIES join in — gathered around a tea-set, sharing a picnic blanket, in a pillow-fort, on a couch for a movie-night. All plushies clearly rendered with fabric texture + button-eyes + stitching. Warm cozy lighting. Cozy props (tiny fabric blankets, mini-felt accessories, stitched cupcakes, tiny tea-cups). Toy-Story-alive but handmade-softness.`
    : `━━━ COMPOSITION — SINGLE PLUSHIE HERO (50% mode) ━━━
Tight or mid-close on the MAIN PLUSHIE alone — hero portrait of one impossibly cute plushie. The plushie fills 50-70% of the frame. Fabric texture obsessively rendered: visible weave, button-eyes catching light, stitched-smile, felt-paw-pads, stuffed-fluff peeking from a seam. The plushie sits on a soft surface (cushion, knit blanket, bed) doing something cozy (clutching a tiny stitched cupcake, sipping from a felt-cup, peeking from under a quilt-corner). Single supporting prop OK but no other plushies in frame. Maximum solo-cute saturation.`;

  const creaturesBlock = isGroup
    ? `━━━ MAIN PLUSHIE (focal — render as a handmade plushie) ━━━
${main}

━━━ SUPPORTING PLUSHIE 1 ━━━
${supporting1}

━━━ SUPPORTING PLUSHIE 2 ━━━
${supporting2}

━━━ SUPPORTING PLUSHIE 3 ━━━
${supporting3}`
    : `━━━ THE PLUSHIE (solo hero — render as a handmade plushie) ━━━
${main}`;

  return `You are writing PLUSHIE-ALIVE scenes for CuddleBot — plushies come alive Toy-Story-style. Fabric-textured, button-eyes, visible stitching, felt details. Warm wholesome cozy. Output wraps with style prefix + suffix.

${blocks.CUTE_CUDDLY_COZY_BLOCK}

${blocks.STYLIZED_NOT_PHOTOREAL_BLOCK}

━━━ PLUSHIE AESTHETIC (required) ━━━
Fabric texture visible. Button-eyes or stitched-eyes. Soft rounded shapes, slight plumpness. Stitched seams. Felt accessories. Charming handmade-toy energy.

${blocks.NO_DARK_NO_INTENSE_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE PLUSHIE SCENE ━━━
${scene}

${creaturesBlock}

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

${compositionBlock}

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
