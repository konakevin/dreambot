/**
 * CuddleBot cozy-landscape path — miniature cozy worlds.
 * Mushroom villages, acorn cottages, pillow-fort forests. Setting is hero,
 * no creatures needed.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const world = picker.pickWithRecency(pools.COZY_MINIATURE_WORLDS, 'cozy_world');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a storybook illustrator writing COZY MINIATURE WORLD scenes for CuddleBot — tiny magical cozy worlds. The setting IS the hero; no creatures are needed. Output wraps with style prefix + suffix.

${blocks.CUTE_CUDDLY_COZY_BLOCK}

${blocks.STYLIZED_NOT_PHOTOREAL_BLOCK}

${blocks.NO_DARK_NO_INTENSE_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE COZY MINIATURE WORLD ━━━
${world}

━━━ LIGHTING (warm cozy storybook only) ━━━
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
Wide or mid-wide tiny-world view. Stacked cozy details — tiny windows glowing warm, chimneys smoking, lanterns glowing, tiny bridges, moss carpet, wildflowers. Storybook-picture-book page quality. Viewer wants to miniaturize and live there.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
