/**
 * RetroBot holiday-seasons — Christmas tinsel, Halloween fog, summer
 * fireworks, Sears catalog, porch lights, wrapping paper chaos.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.HOLIDAY_SEASONS, 'holiday');
  const texture = picker.pickWithRecency(pools.SENSORY_TEXTURES, 'texture');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');

  return `You are writing a HOLIDAY SEASON scene for RetroBot — the magic of holidays as a kid, 1975-1995. Christmas morning, Halloween night, 4th of July. Pure scene, no people visible. The viewer feels the excitement they had at age 10. Output wraps with style prefix + suffix.

${blocks.NOSTALGIA_CORE_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.ERA_AUTHENTICITY_BLOCK}

${blocks.SENSORY_DETAIL_BLOCK}

━━━ THE HOLIDAY SCENE ━━━
${scene}

━━━ SENSORY TEXTURE ━━━
${texture}

━━━ LIGHTING ━━━
${lighting}

━━━ ERA COLOR PALETTE ━━━
${sharedDNA.eraPalette}

${blocks.BLOW_IT_UP_BLOCK}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION ━━━
Holiday-specific lighting dominates — Christmas tree multicolor glow, Halloween porch light orange, sparkler trails. The scene is rich with era-appropriate decorations and objects. Wrapping paper scattered, candy bags spilling, sparklers in mason jars. The moment right after the magic happened.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
