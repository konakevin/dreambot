/**
 * CuddleBot rainy-day-cozy path — tiny creatures cozied up during rain.
 * Watching from windows, sharing oversized umbrellas, splashing in puddles
 * with tiny rain boots, huddled under mushroom caps.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const creature1 = picker.pickWithRecency(pools.CUTE_CREATURES, 'creature');
  const creature2 = picker.pickWithRecency(pools.CUTE_CREATURES, 'creature');
  const rainyScene = picker.pickWithRecency(pools.RAINY_DAY_SCENES, 'rainy_scene');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  const isGroup = Math.random() < 0.7;
  const creatureBlock = isGroup
    ? `A SMALL GROUP (3-5) of adorable creatures huddled together — led by: ${creature1}, joined by: ${creature2} and a few others. Different species, different sizes, all equally cute, all cozied up together in the rain.`
    : `${creature1} — solo, cozied up in the rain.`;

  return `You are writing RAINY DAY COZY scenes for CuddleBot — ${isGroup ? 'a little group of cute creatures' : 'a cute creature'} being adorable during gentle rain. The contrast of wet outside + warm cozy creatures = maximum comfort. Output wraps with style prefix + suffix.

${blocks.CUTE_CUDDLY_COZY_BLOCK}

${blocks.STYLIZED_NOT_PHOTOREAL_BLOCK}

${blocks.NO_DARK_NO_INTENSE_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE CUTE CREATURE(S) ━━━
${creatureBlock}

━━━ THE RAINY DAY SCENE ━━━
${rainyScene}

━━━ LIGHTING (warm against grey rain) ━━━
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
${isGroup ? 'Mid-wide frame showing the group huddled together. 3-5 creatures visible, sharing shelter, squished under one umbrella, or splashing together. Different heights and species for visual variety.' : 'Mid or mid-close frame.'} Rain is gentle and pretty, never stormy or threatening. Warm glow from shelter contrasts with soft grey rain. Puddle reflections, droplets on petals, dewy surfaces. Creatures are cozy and content — not distressed. Cozy rainy-day-at-home energy.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
