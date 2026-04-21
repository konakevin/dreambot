/**
 * GothBot horror-creature path — dark-fantasy creature as hero.
 * Werewolf / vampire / demon / wraith / wendigo / lich / phantom / ghoul.
 * Powerful + terrifying + beautifully rendered.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const creature = picker.pickWithRecency(pools.DARK_CREATURES, 'dark_creature');
  const landscape = picker.pickWithRecency(pools.GOTHIC_LANDSCAPES, 'gothic_landscape');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a dark-fantasy concept-art painter writing HORROR CREATURE scenes for GothBot — creature as hero. Powerful, terrifying, BEAUTIFULLY rendered. Never cheap-horror. Castlevania/Bloodborne/Berserk creature-design. Output wraps with style prefix + suffix.

${blocks.ELEGANT_DARKNESS_BLOCK}

${blocks.NO_BLOOD_NO_GORE_NO_CLOWNS_BLOCK}

${blocks.PAINTERLY_ILLUSTRATION_BLOCK}

${blocks.CINEMATIC_COMPOSITION_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE HORROR CREATURE (hero) ━━━
${creature}

━━━ GOTHIC SETTING CONTEXT ━━━
${landscape}

━━━ LIGHTING (chiaroscuro / moon / fire / ritual-glow) ━━━
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
Creature dominates frame. Scale + menace + beauty integrated. Dramatic low-angle or mid-shot. Setting supports but doesn't compete. Painterly gothic detail on fur/wings/skin/eyes.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
