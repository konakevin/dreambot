/**
 * CuddleBot jungle-canopy path — impossibly cute baby jungle creatures
 * in lush rainforest habitat. Sloth in vine hammock, tree-frog cuddle
 * pile, baby tapir, capybara hot spring, toucan tea party, baby
 * orangutan, lemur with banana.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const creature1 = picker.pickWithRecency(pools.JUNGLE_CREATURES, 'jungle_creature');
  const creature2 = picker.pickWithRecency(pools.JUNGLE_CREATURES, 'jungle_creature');
  const scene = picker.pickWithRecency(pools.JUNGLE_SCENES, 'jungle_scene');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are writing JUNGLE-CANOPY scenes for CuddleBot — impossibly cute baby jungle creatures in lush rainforest habitat. Sloth in a vine hammock, tree-frog cuddle pile on a giant leaf, baby tapir, capybara hot-spring spa, toucan tea party, baby orangutan, lemurs with bananas. Pixar / Sanrio / Studio Ghibli / Jungle-Book-baby-animal aesthetic. Output wraps with style prefix + suffix.

${blocks.CUTE_CUDDLY_COZY_BLOCK}

${blocks.STYLIZED_NOT_PHOTOREAL_BLOCK}

${blocks.NO_DARK_NO_INTENSE_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE JUNGLE SCENE ━━━
${scene}

━━━ JUNGLE CREATURE 1 ━━━
${creature1}

━━━ JUNGLE CREATURE 2 ━━━
${creature2}

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

━━━ JUNGLE-CANOPY DNA ━━━
SUPER OVERLAY CUTE — never photoreal, NEVER documentary nature. Pixar / Sanrio / Studio Ghibli / Jungle-Book / Encanto / Madagascar-baby aesthetic. Every creature has OVERSIZED dewy eyes, round chubby bodies, blushing cheeks, tiny stubby paws, soft fluffy or velvet textures. Jungle-baby palette: warm leaf-green, sun-dappled gold, coral-flower pink, banana-yellow, sky-mint. Sun-dapples through leaves, mist drifting between vines, lily-of-the-valley raindrops, fluttering blue morpho butterflies. The two creatures should INTERACT cutely — sharing a banana, napping back-to-back on a vine, peeking from giant leaves, cuddled in a vine hammock, sharing a giant flower as an umbrella. NO predator-prey-violence, NO realistic dirt/grime/insects, NO snake-with-fangs-bared. Pure squee energy. Picture-book clarity.

━━━ COMPOSITION ━━━
Mid-close on the cuddling pair OR canopy-wide showing both creatures in their leafy habitat. Soft warm jungle-light filtered through leaves. Creatures fill 40-60% of the frame. Scene-stuff (giant leaves, vines, flowers, bananas, hot-spring) is decorative + adorable. Maximum cute saturation.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
