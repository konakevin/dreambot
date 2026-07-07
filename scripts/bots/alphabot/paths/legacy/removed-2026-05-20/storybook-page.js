/**
 * CuddleBot storybook-page path — the old "everything looks like a storybook"
 * aesthetic, now intentionally channeled into its own path. Picture-book pages,
 * Pixar/Sanrio/Totoro energy, warm painted textures, storybook-clean edges.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

const SCENE_POOLS = [
  { pool: 'HEARTWARMING_ACTIVITIES', label: 'heartwarming activity' },
  { pool: 'COZY_MINIATURE_WORLDS', label: 'cozy miniature world' },
  { pool: 'PLUSHIE_SCENES', label: 'plushie scene' },
  { pool: 'SLEEPY_NAP_SPOTS', label: 'sleepy nap spot' },
  { pool: 'RAINY_DAY_SCENES', label: 'rainy day scene' },
  { pool: 'MINIATURE_FEAST_SCENES', label: 'miniature feast' },
  { pool: 'BATH_TIME_SCENES', label: 'bath time scene' },
  { pool: 'OUTDOOR_ADVENTURES', label: 'outdoor adventure' },
  { pool: 'TINY_FRIENDSHIPS', label: 'tiny friendship moment' },
];

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const creature1 = picker.pickWithRecency(pools.CUTE_CREATURES, 'creature');
  const creature2 = picker.pickWithRecency(pools.CUTE_CREATURES, 'creature');
  const scenePick = SCENE_POOLS[Math.floor(Math.random() * SCENE_POOLS.length)];
  const scene = picker.pickWithRecency(pools[scenePick.pool], 'storybook_scene');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  const isGroup = Math.random() < 0.7;
  const creatureBlock = isGroup
    ? `A SMALL GROUP (3-5) of adorable creatures together — led by: ${creature1}, joined by: ${creature2} and a few others. Different species, different sizes, all equally cute.`
    : `${creature1}`;

  return `You are a storybook illustrator writing a PICTURE-BOOK PAGE for CuddleBot — this scene should look like it belongs in a classic children's storybook. Pixar / Sanrio / Totoro warmth. Warm painted textures, storybook-clean edges, dreamy color grading. Output wraps with style prefix + suffix.

${blocks.CUTE_CUDDLY_COZY_BLOCK}

━━━ STORYBOOK AESTHETIC (THIS PATH ONLY) ━━━

This is a STORYBOOK PAGE. Render as if painted by a picture-book illustrator: soft watercolor-gouache textures, gentle pencil linework underneath, warm paper-stock feel, slightly muted pastel palette, hand-painted charm. Pixar-level polish meets classic children's book warmth. Every element feels lovingly crafted by hand.

${blocks.NO_DARK_NO_INTENSE_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE CUTE CREATURE(S) ━━━
${creatureBlock}

━━━ THE SCENE (${scenePick.label}) ━━━
${scene}

━━━ LIGHTING (warm storybook glow) ━━━
Warm amber-golden lighting. Soft shadows. Safe, bright, inviting atmosphere — the kind of light that says "once upon a time." ${lighting}

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
${isGroup ? 'Mid-wide frame with the group together. 3-5 creatures visible, arranged like a storybook spread — balanced, charming, every creature with personality.' : 'Mid-close frame with creature as hero.'} Storybook-illustration composition — balanced, warm, inviting. Picture-book page quality. The kind of image you'd frame in a nursery. Warm safe bright atmosphere throughout.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
