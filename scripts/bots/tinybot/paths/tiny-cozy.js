const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.TINY_COZY_SCENES, 'tiny_cozy_scene');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  // MANDATORY dweller, 2026-09-22. The composition asks for "Lived-in quality. Viewer wants to
  // shrink down and live there" and nobody lived there -- a beautifully dressed empty room, which
  // is the measured defect class. Same lever as tiny-vehicles/TINY_CREW.
  const dweller = picker.pickWithRecency(pools.TINY_COZY_DWELLERS, 'tiny_cozy_dweller');

  return `You are a cozy-miniature photographer writing TINY COZY scenes for TinyBot. Warm-inviting-homey dollhouse spaces. Output wraps with style prefix + suffix.

${blocks.TILT_SHIFT_MINIATURE_BLOCK}

${blocks.OBSESSIVE_MICRO_DETAIL_BLOCK}

${blocks.NO_HUMANS_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

${blocks.TINY_COZY_WARMTH_BLOCK}

━━━ THE TINY COZY SCENE ━━━
${scene}

━━━ WHO LIVES HERE -- MANDATORY ━━━
${dweller}

Somebody LIVES in this room and is in it right now. Write this dweller into the frame doing exactly what they're doing, settled into the actual furniture named. They stay small and readable -- the ROOM is still the hero -- but it is a home with someone home, never an empty set.

${blocks.varietyAxesSection(sharedDNA)}

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
Mid-close tilt-shift interior frame. Warm cozy detail. Lived-in quality. Viewer wants to shrink down and live there.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
