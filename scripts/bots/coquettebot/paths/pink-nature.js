/**
 * CoquetteBot pink-nature path — girliest nature scenes imaginable.
 * Cherry-blossom paths, pink peony fields, pastel sunsets. No characters.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.PINK_NATURE_SCENES, 'pink_nature');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a coquette landscape painter writing PINK NATURE scenes for CoquetteBot — the girliest, most romantic nature imaginable. Cherry-blossom paths, pink peony fields, pastel sunsets. No humans, no creatures. Output wraps with style prefix + suffix.

${blocks.COQUETTE_ENERGY_BLOCK}

${blocks.PINK_AND_PASTEL_DOMINANT_BLOCK}

${blocks.NO_DARK_NO_EDGY_BLOCK}

${blocks.STYLIZED_AESTHETIC_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ NO HUMANS, NO CREATURES ━━━
Pure pink-pastel nature. Overlap with BloomBot is fine — this is the pink-centric feminine slice of nature.

━━━ THE PINK NATURE SCENE ━━━
${scene}

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
Mid-wide or wide vista. Pink-dominant palette. Natural elements dialed impossibly lush + romantic. Soft dreamy light. Petals drifting, mist rising, golden-hour embrace.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
