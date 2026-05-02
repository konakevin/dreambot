/**
 * CuddleBot plushie-life path — ported from ToyBot's plush-world architecture.
 * Slot-pool DNA (CUTE_CREATURES rolled per render) + spatial anchor +
 * path-specific cute-cozy lighting + camera-angle variety.
 * 30% solo (intimate tender hero portrait) / 70% ensemble (3-5 plushies together).
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const useLandscape = Math.random() < 0.3;
  const scene = useLandscape
    ? picker.pickWithRecency(pools.CUDDLE_PLUSH_LANDSCAPES, 'cuddle_plush_landscape')
    : picker.pickWithRecency(pools.PLUSHIE_SCENES, 'plushie_scene');
  const lighting = picker.pickWithRecency(pools.CUDDLE_PLUSH_LIGHTING, 'cuddle_plush_lighting');
  const camera = picker.pickWithRecency(pools.CAMERA_ANGLES, 'camera_angle');

  // Slot-pool DNA: 30% solo (1 plushie) / 70% ensemble (3-5 plushies).
  // Solo branch = intimate tender hero. Ensemble = group cozy adventure.
  const isSolo = Math.random() < 0.3;
  const castSize = isSolo ? 1 : 3 + Math.floor(Math.random() * 3);
  const cast = [];
  for (let i = 0; i < castSize; i++) {
    cast.push(picker.pickWithRecency(pools.CUTE_CREATURES, `cute_creature_${i}`));
  }

  return `You are writing PLUSHIE-ALIVE scenes for CuddleBot — handmade plushies come alive with maximum cuteness. Fabric texture visible, button-eyes or stitched-eyes, soft rounded shapes, slight plumpness, charming handmade-toy energy. Output wraps with style prefix + suffix.

${blocks.TOY_PHOTOGRAPHY_BLOCK}

${blocks.CINEMATIC_STORY_BLOCK}

${blocks.DRAMATIC_LIGHTING_MAKES_CHEAP_LOOK_EPIC_BLOCK}

${blocks.PATH_MEDIUM_LOCK_BLOCK}

━━━ PLUSH MEDIUM LOCK ━━━
EVERY character is a soft-fabric stuffed animal — visible plush-fiber FUR or KNIT TEXTURE on body, embroidered or button eyes, stitched mouth, sewn-on muzzle, soft floppy limbs, fiberfill pudgy bodies, optional tiny knit sweaters or cloth bandanas. NEVER LBP burlap-with-zipper. NEVER real animal. NEVER CGI. Photographed in a fully-dressed handcrafted miniature set. Practical lighting, storybook warmth.

${blocks.NO_PEOPLE_BLOCK}

━━━ CAMERA ━━━
${camera}

${isSolo
  ? `━━━ COMPOSITION — SOLO TENDER HERO PORTRAIT ━━━
A SINGLE plushie in the frame, mid-cozy-activity. Intimate storybook composition — the one plushie is the focal point of the moment, fills 50-70% of the frame. Fabric texture obsessively rendered: visible weave, button-eyes catching light, stitched-smile, felt-paw-pads. Single supporting prop OK. Maximum solo-cute saturation.`
  : `━━━ COMPOSITION LOCK — NON-NEGOTIABLE SPATIAL ANCHOR ━━━
WIDE DIORAMA FRAME — exactly ${castSize} distinct plushies visible simultaneously, spatially separated as ${castSize === 3 ? 'left, center, right (or foreground / midground / background)' : castSize === 4 ? 'left, center-left, center-right, right' : 'left, center-left, center, center-right, right'}. Each occupies its OWN silhouette zone — no overlap, no merging. NO single hero subject dominating. ALL ${castSize} plushies visible in clear frame at the same time. (Camera direction above sets the lens.)`}

━━━ ${isSolo ? 'THE PLUSHIE' : 'THE CAST'} — RENDER ${isSolo ? 'THIS EXACT PLUSHIE' : 'THESE EXACT PLUSHIES'} (NON-NEGOTIABLE) ━━━
${isSolo ? 'The plushie in this scene MUST be this specific creature — render the EXACT archetype, color, and signature detail:' : 'The plushies in this scene MUST be exactly these specific creatures — render the EXACT archetype, color, and signature detail of each:'}
${cast.map((c, i) => `${isSolo ? '' : `${i + 1}. `}${c}`).join('\n')}

━━━ THE PLUSHIE SCENE ━━━
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
