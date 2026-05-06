/**
 * EarthBot dramatic-sky — sky is the subject.
 * Mammatus clouds, Milky Way arcs, sun dogs, noctilucent clouds.
 * Ground is peripheral silhouette only.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const sky = picker.pickWithRecency(pools.SKY_PHENOMENA, 'sky_phenomenon');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a sky photographer writing DRAMATIC SKY scenes for EarthBot. The SKY is the hero — ground is peripheral silhouette or context. Rare, exotic, dramatic atmospheric spectacles that make people look up and forget to breathe. Output wraps with style prefix + suffix.

${blocks.NATURE_IS_HERO_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

${blocks.LIGHTING_IS_EVERYTHING_BLOCK}

━━━ THE SKY PHENOMENON ━━━
${sky}

━━━ LIGHTING ━━━
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
Sky occupies 60-80% of frame. Ground is silhouette at bottom — anchors scale but does NOT compete with sky. Stack multiple atmospheric elements where possible. Saturation and scale maximized.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
