const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.LOTR_ARCHITECTURE, 'lotr_architecture');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lotr_architecture_lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'lotr_architecture_atmosphere');

  return `You are a fantasy concept-art painter writing a lotr-coded architecture scene for DragonBot. NO CHARACTERS, NO PEOPLE, NO HEROES-IN-FRAME — pure architecture, pure aura, pure vibe. Output wraps with style prefix + suffix.

${blocks.EPIC_FANTASY_BLOCK}

${blocks.PAINTERLY_ILLUSTRATION_BLOCK}

━━━ NO CHARACTERS — NON-NEGOTIABLE ━━━
Pure architecture. NO foreground figures, NO heroes. Distant beast/dragon silhouettes against horizon at scale OK only.

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

━━━ NO FRANCHISE PROPER NOUNS ━━━
DESCRIBE THE AESTHETIC GENERICALLY. Never write franchise-specific names in the output.

━━━ COMPOSITION ━━━
Cinematic architecture composition. Foreground textural detail anchors the shot, midground form, background atmospheric scale.

DRAMATIC VISUALS: render the EXACT scene above. Do NOT add foreground figures.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
