/**
 * CuddleBot cuddly-aquatic path — impossibly cute aquatic baby creatures
 * in their underwater / surface-water habitats. Sea otter pups holding
 * paws, baby seals on ice, hermit-crab anemone-village, jellyfish
 * blanket octopuses, axolotl tea rooms.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const creature1 = picker.pickWithRecency(pools.AQUATIC_CREATURES, 'aquatic_creature');
  const creature2 = picker.pickWithRecency(pools.AQUATIC_CREATURES, 'aquatic_creature');
  const scene = picker.pickWithRecency(pools.AQUATIC_SCENES, 'aquatic_scene');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are writing CUDDLY AQUATIC scenes for CuddleBot — impossibly cute baby aquatic creatures in their underwater or surface-water habitats. Sea otter pups holding paws, baby seals on ice, hermit-crab anemone villages, jellyfish-blanket octopuses, axolotl tea rooms, dumbo octopuses with bonnets. Pixar / Sanrio / Studio Ghibli / Finding Nemo cuteness. Output wraps with style prefix + suffix.

${blocks.CUTE_CUDDLY_COZY_BLOCK}

${blocks.STYLIZED_NOT_PHOTOREAL_BLOCK}

${blocks.NO_DARK_NO_INTENSE_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE AQUATIC SCENE ━━━
${scene}

━━━ AQUATIC CREATURE 1 ━━━
${creature1}

━━━ AQUATIC CREATURE 2 ━━━
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

━━━ CUDDLY AQUATIC DNA ━━━
SUPER OVERLAY CUTE — never photoreal, NEVER documentary-style. Pixar / Sanrio / Studio Ghibli / Disney-baby-animal aesthetic. Every creature has OVERSIZED dewy eyes, round chubby bodies, blushing cheeks, tiny stubby paws/flippers, soft fluffy or jelly-soft textures. Aquatic-baby palette: pearl-pink coral, mint sea-glass, lemon-yellow fish-scale, lavender-bubble. Soft caustic light dapples, dreamy bubble-trails, sparkle particles in the water. The two creatures should INTERACT cutely — nuzzling, cuddling, holding paws/flippers, sharing a kelp-blanket, pressed-cheek-to-cheek, peeking at each other from a coral-cave. NO predator-prey, NO realistic ocean documentary, NO sharks-with-teeth-bared. Pure squee energy. Picture-book clarity.

━━━ COMPOSITION ━━━
Mid-close on the cuddling pair OR wide-cute showing both creatures in their habitat. Soft underwater haze + caustic sunbeams overhead OR dreamy water-surface light. Creatures fill 40-60% of the frame — large enough to read every cute detail. Scene-stuff (coral, kelp, anemone, lily-pad) is decorative + ADORABLE. Maximum cute saturation.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
