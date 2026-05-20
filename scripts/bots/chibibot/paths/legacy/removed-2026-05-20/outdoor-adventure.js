/**
 * CuddleBot outdoor-adventure path — cute creatures out doing fun activities.
 * Carnivals, camping, beach days, lake trips, stargazing, picnics, hiking,
 * festivals. The creature is actively having the best day ever.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const creature1 = picker.pickWithRecency(pools.CUTE_CREATURES, 'creature');
  const creature2 = picker.pickWithRecency(pools.CUTE_CREATURES, 'creature');
  const adventure = picker.pickWithRecency(pools.OUTDOOR_ADVENTURES, 'outdoor_adventure');
  const weather = picker.pickWithRecency(pools.SCENE_WEATHER, 'scene_weather');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  const isGroup = Math.random() < 0.7;
  const creatureBlock = isGroup
    ? `A SMALL GROUP (3-5) of adorable creatures together — led by: ${creature1}, joined by: ${creature2} and a few others. They are friends on an adventure together. Different species, different sizes, all equally cute.`
    : `${creature1} — solo adventurer having the best day ever.`;

  return `You are writing OUTDOOR ADVENTURE scenes for CuddleBot — adorable creatures out having the best day ever at a fun outdoor activity. ${isGroup ? 'This is a GROUP SHOT — a little squad of friends adventuring together.' : 'Solo creature on an adventure.'} The creatures are actively DOING something fun, not just standing in a pretty place. Output wraps with style prefix + suffix.

${blocks.CUTE_CUDDLY_COZY_BLOCK}

${blocks.STYLIZED_NOT_PHOTOREAL_BLOCK}

${blocks.NO_DARK_NO_INTENSE_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE CUTE CREATURE(S) ━━━
${creatureBlock}

━━━ THE OUTDOOR ADVENTURE ━━━
${adventure}

━━━ SCENE WEATHER ━━━
${weather}

━━━ LIGHTING (golden outdoor light) ━━━
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
${isGroup ? 'Mid-wide frame showing the GROUP together at the activity. 3-5 creatures visible, each doing something slightly different — one leading, one lagging behind, one distracted by something cute. Different heights and species for visual variety. Friend-group energy.' : 'Mid or mid-wide frame showing creature AND the fun location together.'} The creatures are actively engaged — riding, paddling, roasting, splashing, spinning, floating, climbing, exploring. Environment is lush and inviting. Adventure-page energy — the viewer wants to join in.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
