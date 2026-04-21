/**
 * DragonBot cozy-arcane path — cozy fantasy places.
 * Inhabited cozy cottages + natural fantasy pockets with magical wildlife
 * at rest. Warm, tame, peaceful magic. Never dramatic.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const setting = picker.pickWithRecency(pools.COZY_ARCANE_SETTINGS, 'cozy_arcane_setting');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a cozy-fantasy painter writing COZY ARCANE scenes for DragonBot — warm peaceful magic in inhabited cottages OR natural fantasy pockets with magical wildlife at rest. Hobbiton / Ghibli-fantasy / witch-cottage / fae-glen energy. Output wraps with style prefix + suffix.

${blocks.EPIC_FANTASY_BLOCK}

${blocks.PAINTERLY_ILLUSTRATION_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

${blocks.WARM_QUIET_MAGIC_BLOCK}

━━━ THE COZY ARCANE SETTING ━━━
${setting}

━━━ LIGHTING (warm / firelit / soft preferred) ━━━
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
Mid or mid-close intimate frame. Cozy warm tones. Magical details present but peaceful. Inhabited detail (cup of tea, hearth, open book) OR magical wildlife at rest (sleeping dragon-whelp, resting fae, glowing moss).

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
