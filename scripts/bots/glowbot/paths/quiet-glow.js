/**
 * GlowBot quiet-glow path — SMALL-SCALE intimate light + immediate surroundings.
 * Single glowing mushroom in mossy corner, torch lighting a wall, bioluminescent
 * sapling in clearing. Peaceful + awe via subtle magic, not mythic scale.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const subject = picker.pickWithRecency(pools.INTIMATE_GLOW_SUBJECTS, 'intimate_glow_subject');
  const lightTreatment = picker.pickWithRecency(pools.LIGHT_TREATMENTS, 'light_treatment');
  const emotionalTone = picker.pickWithRecency(pools.EMOTIONAL_TONES, 'emotional_tone');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are an intimate-nature painter writing QUIET GLOW scenes for GlowBot — SMALL-SCALE intimate-light moments. A single luminous element illuminates its immediate nearby surroundings. Intimate frame, not grand scale. Peaceful + awe via subtle magic. Output wraps with style prefix + suffix.

${blocks.LIGHT_IS_HERO_BLOCK}

${blocks.AWE_AND_PEACE_BLOCK}

${blocks.NO_HARSH_DARK_FIERCE_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ INTIMATE SCALE (required) ━━━
SMALL-SCALE frame. The light-source illuminates only its IMMEDIATE surroundings — 2 to 5 feet around it. Not a grand vista. Not a mythic landscape. A single quiet corner of the world glowing gently.

━━━ THE INTIMATE GLOW SUBJECT ━━━
${subject}

━━━ LIGHT TREATMENT (soft + focal) ━━━
${lightTreatment}

━━━ EMOTIONAL TONE (hushed intimate quiet) ━━━
${emotionalTone}

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
Mid-close or close frame. Single light-source dominant in frame. Its glow reveals nearby leaves / stones / moss / bark / water / flowers. Dark-with-quiet-warmth composition. Intimate "I stumbled upon this" discovery feeling. Never wide vista, never grand scale.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
