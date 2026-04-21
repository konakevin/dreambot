/**
 * MangaBot neo-tokyo path — cyberpunk Japan future. Blade-Runner-meets-Akira
 * neon-rain-and-density energy.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const setting = picker.pickWithRecency(pools.NEO_TOKYO_SETTINGS, 'neo_tokyo_setting');
  const detail = picker.pickWithRecency(pools.CHARACTER_DETAILS, 'character_detail');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a cyberpunk anime illustrator writing NEO-TOKYO scenes for MangaBot. Blade-Runner-meets-Akira-meets-Ghost-in-the-Shell futuristic Japan. Neon, rain, density. Character OPTIONAL (peripheral silhouette OK). Output wraps with style prefix + suffix.

${blocks.ANIME_AESTHETIC_BLOCK}

${blocks.NO_NAMED_CHARACTERS_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE NEO-TOKYO SETTING ━━━
${setting}

━━━ CHARACTER/TECHNICAL DETAIL ━━━
${detail}

━━━ LIGHTING (Akira-neon / cyberpunk-rain preferred) ━━━
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
Wide or mid-wide cyberpunk frame. Neon dominant. Rain atmosphere common. Japanese signage. Optional human silhouette for scale. Hand-drawn anime + cyberpunk.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
