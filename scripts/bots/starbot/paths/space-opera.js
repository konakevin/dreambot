/**
 * StarBot space-opera path — epic ships in cosmic settings.
 * Visually stunning, varied ship designs from across sci-fi traditions.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.SPACE_OPERA_SCENES, 'space_opera_scene');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a space-opera concept artist writing EPIC SHIP scenes for StarBot. Visually stunning spacecraft in cosmic settings. The SHIP DESIGN is the star — sleek, alien, organic, crystalline, ancient, massive. Output wraps with style prefix + suffix.

${blocks.SCI_FI_AWE_BLOCK}

${blocks.NO_COZY_EXCEPT_COZY_PATH_BLOCK}

${blocks.NO_NAMED_CHARACTERS_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE SCENE ━━━
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
Wide cinematic frame. Ship as hero subject against cosmic backdrop. Awe-inspiring scale.

━━━ BANNED (absolute) ━━━
- NO naval aircraft carriers transposed into space — no flat flight decks, no grey military carrier silhouettes
- NO battleships / destroyers / frigates / cruisers that look like ocean warships with engines
- NO gun-grey military naval aesthetic — ships should look ALIEN, SLEEK, ORGANIC, CRYSTALLINE, or EXOTIC
- NO named IP ships
- Ships must look like they belong in SPACE, not transplanted from an ocean navy

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
