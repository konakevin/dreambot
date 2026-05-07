/**
 * CuddleBot snowy-arctic path — impossibly cute baby arctic creatures
 * in snowy / icy / aurora habitats. Polar bear cub on its mother's
 * belly, baby penguin huddle, snowy fox kits, ermine in mittens, harp
 * seal pup, igloo nap, aurora-watching.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const creature1 = picker.pickWithRecency(pools.ARCTIC_CREATURES, 'arctic_creature');
  const creature2 = picker.pickWithRecency(pools.ARCTIC_CREATURES, 'arctic_creature');
  const scene = picker.pickWithRecency(pools.ARCTIC_SCENES, 'arctic_scene');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are writing SNOWY-ARCTIC scenes for CuddleBot — impossibly cute baby arctic creatures in snowy / icy / aurora habitats. Polar bear cubs napping on their mother's belly, baby penguin huddles, snowy fox kits, ermine in tiny mittens, harp seal pups, igloo naps, aurora-watching critters. Pixar / Sanrio / Studio Ghibli / Happy-Feet-baby aesthetic. Output wraps with style prefix + suffix.

${blocks.CUTE_CUDDLY_COZY_BLOCK}

${blocks.STYLIZED_NOT_PHOTOREAL_BLOCK}

${blocks.NO_DARK_NO_INTENSE_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE ARCTIC SCENE ━━━
${scene}

━━━ ARCTIC CREATURE 1 ━━━
${creature1}

━━━ ARCTIC CREATURE 2 ━━━
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

━━━ SNOWY-ARCTIC DNA ━━━
SUPER OVERLAY CUTE — never photoreal, NEVER documentary nature. Pixar / Sanrio / Studio Ghibli / Happy-Feet / Lost-in-the-Snow / baby-animal-Christmas-special aesthetic. Every creature has OVERSIZED dewy eyes, round chubby snow-puff bodies, pink-button noses, blushing cold-cheeks, tiny stubby paws/flippers, fluffy fluff-collars, optional tiny knitted accessories (mittens, scarves, earmuffs). Arctic-baby palette: pearl-white, soft-mint ice, sky-pink dawn, aurora-violet/teal, warm igloo-lantern-amber. Snowflake particles drifting, soft-falling snow, aurora ribbons in distant sky, ice-crystal sparkle, warm igloo-lantern glow. The two creatures should INTERACT cutely — cuddled together for warmth, peeking from a snow-burrow, pressed-cheek-to-cheek, sharing a tiny scarf, watching aurora together, napping in a fluff-pile. NO predator-prey, NO blood-on-snow, NO grim-survival. Pure squee energy. Picture-book clarity.

━━━ COMPOSITION ━━━
Mid-close on the cuddling pair OR snow-wide showing both creatures in their icy habitat. Soft cool light + warm-amber pop from igloo-lantern or aurora reflection. Creatures fill 40-60% of the frame — snowy fluff against pearl-snow + aurora-sky. Scene-stuff (snowdrifts, ice-cave, igloo, aurora) is decorative + adorable. Maximum cute saturation.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
