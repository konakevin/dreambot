/**
 * CuddleBot dollhouse-life path — ported from ToyBot's dollhouse-life
 * but with cute plushie-creature inhabitants instead of 3-tradition figures.
 * Slot-pool DNA (CUTE_CREATURES as figurines) + spatial anchor +
 * cute-cozy interior lighting + camera-angle variety.
 * 30% solo / 70% ensemble. Cozy daily-life interiors with plushies.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.COZY_INTERIOR_SCENES, 'cuddle_dollhouse_scene');
  const lighting = picker.pickWithRecency(pools.CUDDLE_DOLLHOUSE_LIGHTING, 'cuddle_dollhouse_lighting');
  const camera = picker.pickWithRecency(pools.CAMERA_ANGLES, 'camera_angle');

  // Slot-pool DNA: 30% solo / 70% ensemble. Plushies as dollhouse-figurines.
  const isSolo = Math.random() < 0.3;
  const castSize = isSolo ? 1 : 3 + Math.floor(Math.random() * 3);
  const cast = [];
  for (let i = 0; i < castSize; i++) {
    cast.push(picker.pickWithRecency(pools.CUTE_CREATURES, `cute_creature_${i}`));
  }

  return `You are writing DOLLHOUSE-LIFE scenes for CuddleBot — cozy daily-life dioramas in fully-appointed miniature household sets, populated by plushie-creature figurines. Stylized cute, never photoreal. Output wraps with style prefix + suffix.

${blocks.TOY_PHOTOGRAPHY_BLOCK}

${blocks.CINEMATIC_STORY_BLOCK}

${blocks.DRAMATIC_LIGHTING_MAKES_CHEAP_LOOK_EPIC_BLOCK}

${blocks.PATH_MEDIUM_LOCK_BLOCK}

━━━ DOLLHOUSE MEDIUM LOCK ━━━
Plushie creatures as dollhouse-scale figurines in fully-appointed miniature household interiors — wooden furniture, tiny dishware, mini books, hand-sewn drapes, miniature appliances, scale-accurate household details (tiny lamps, miniature framed art, scale rugs). Cozy daily-life energy — baking, reading, tea, gardening, bedtime, dinner-party. Fabric texture visible, button-eyes, stitched details. Practical-set toy photography. NEVER real human, NEVER real animal, NEVER CGI.

${blocks.NO_PEOPLE_BLOCK}

━━━ CAMERA ━━━
${camera}

${isSolo
  ? `━━━ COMPOSITION — SOLO TENDER MOMENT ━━━
A SINGLE plushie figurine in the frame, mid-cozy-activity within the miniature interior. Intimate storybook composition. Dense scale-accurate household detail surrounds the plushie. Maximum cute domestic warmth.`
  : `━━━ COMPOSITION LOCK — NON-NEGOTIABLE SPATIAL ANCHOR ━━━
WIDE DIORAMA FRAME — exactly ${castSize} distinct plushie figurines visible simultaneously, spatially separated as ${castSize === 3 ? 'left, center, right (or foreground / midground / background)' : castSize === 4 ? 'left, center-left, center-right, right' : 'left, center-left, center, center-right, right'}. Each occupies its OWN silhouette zone within the miniature room. NO single hero subject dominating. ALL ${castSize} plushies visible in clear frame at the same time. (Camera direction above sets the lens.)`}

━━━ ${isSolo ? 'THE PLUSHIE' : 'THE CAST'} — RENDER ${isSolo ? 'THIS EXACT PLUSHIE' : 'THESE EXACT PLUSHIES'} (NON-NEGOTIABLE) ━━━
${isSolo ? 'The plushie figurine in this scene MUST be this specific creature — render the EXACT archetype, color, and signature detail:' : 'The plushie figurines in this scene MUST be exactly these specific creatures — render the EXACT archetype, color, and signature detail of each:'}
${cast.map((c, i) => `${isSolo ? '' : `${i + 1}. `}${c}`).join('\n')}

━━━ THE DOLLHOUSE SCENE ━━━
${scene}

━━━ LIGHTING + ATMOSPHERE ━━━
${lighting}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

${blocks.BLOW_IT_UP_BLOCK}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
