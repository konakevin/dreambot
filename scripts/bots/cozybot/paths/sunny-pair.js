/**
 * CuddleBot sunny-pair path — impossibly cute creature pair in a bright,
 * golden-hour, midday-sunlit, daytime-meadow / sunflower-field /
 * butterfly-garden / hilltop-picnic / bright-summer setting. The SUNSHINE
 * is the differentiator — warm gold light is the hero alongside the pair.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const creature1 = picker.pickWithRecency(pools.CUTE_CREATURES, 'creature');
  const creature2 = picker.pickWithRecency(pools.CUTE_CREATURES, 'creature');
  const scene = picker.pickWithRecency(pools.SUNNY_PAIR_SCENES, 'sunny_pair_scene');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are writing SUNNY-PAIR scenes for CuddleBot — impossibly cute creature pairs in BRIGHT, GOLDEN-HOUR, SUN-DRENCHED outdoor settings. Sunflower fields, summer meadows, butterfly gardens, hilltop picnics, sunny seaside cliffs, golden-wheat fields, daisy meadows, bright clover-hill at noon. The SUNSHINE is the hero alongside the pair — warm gold light, lens-flare sparkle, butterfly-flutter, breeze through grass. Pixar / Sanrio / Studio Ghibli / My-Neighbor-Totoro-summer-meadow aesthetic. Output wraps with style prefix + suffix.

${blocks.CUTE_CUDDLY_COZY_BLOCK}

${blocks.STYLIZED_NOT_PHOTOREAL_BLOCK}

${blocks.NO_DARK_NO_INTENSE_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE SUNNY-PAIR SCENE ━━━
${scene}

━━━ SUNNY CRITTER 1 ━━━
${creature1}

━━━ SUNNY CRITTER 2 ━━━
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

━━━ SUNNY-PAIR DNA ━━━
SUPER OVERLAY CUTE — never photoreal. Pixar / Sanrio / Studio Ghibli / Totoro-summer / Heidi / Anne-of-Green-Gables aesthetic. Every creature has OVERSIZED dewy eyes (sun-glittering), round chubby bodies, blushing sun-warmed cheeks, tiny stubby paws, fluffy backlit fur. Sunny-day palette: golden honey-warm sunlight + sky-blue + soft mint-green grass + buttercup-yellow + cream-cloud + petal-pink. Lens-flare sparkles, drifting butterflies, dandelion-fluff seeds floating, wildflower meadow stretching, breeze-tousled grass. The pair INTERACTS cutely — picnic-blanket nap, holding paws across a daisy-chain, sharing a watermelon slice, peeking at butterflies, chasing seeds in the breeze, cheek-to-cheek under a parasol. Pure summer-afternoon joy. Picture-book clarity.

━━━ COMPOSITION ━━━
Mid-close on the cuddling pair OR meadow-wide showing both creatures in their sunny outdoor setting. Strong WARM-GOLD sunlight is non-negotiable — back-light or side-light bathing the scene, lens-flare optional, soft sky-blue background. Creatures fill 30-50% of the frame. Scene-stuff (sunflowers, daisy-chains, picnic-blanket, butterflies, parasol, lemonade-jug) is decorative + adorable. Maximum cute saturation. The sunshine should READ as the dominant atmospheric element.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
