/**
 * ChibiBot cute-food path — bex.ai-inspired kawaii pop-mart food scenes.
 *
 * The food/drink ITSELF has a smiling face — boba cups with blushed cheeks,
 * sundaes with sleepy-face soft-serve, cereal bowls with arched-eye-smiles.
 * The food IS the cast. No human characters, no minifigs, no creatures
 * eating the food. Scattered tiny smiling decorations (mini fruit, stars,
 * sprinkles) around the hero. Pastel rainbow palette, glossy pearlescent
 * 3D-rendered finish, cherry-blossom or pastel-floral accents.
 *
 * Locked to chibibot_render medium via ChibiBot mediumByPath — every render
 * gets the Pop-Mart designer-vinyl glossy look. NO chibibot_pixar variation
 * (the bex.ai aesthetic is hard-locked).
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.CUTE_FOOD_SCENES, 'cute_food_scene');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are writing CUTE-FOOD scene descriptions for ChibiBot — bex.ai-inspired kawaii pop-mart food/drink renders where the food itself has a smiling face. Output wraps with style prefix + suffix.

${blocks.CUTE_CUDDLY_COZY_BLOCK}

${blocks.STYLIZED_NOT_PHOTOREAL_BLOCK}

${blocks.NO_DARK_NO_INTENSE_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE CUTE-FOOD AESTHETIC — NON-NEGOTIABLE ━━━

This path is hard-locked to the @bex.ai Instagram aesthetic:
  • HERO FOOD/DRINK HAS A SMILING FACE — the centerpiece (boba cup, sundae, cereal bowl, donut, cake, taiyaki, mochi, etc.) literally has a kawaii smiling face on it: dimpled-blush cheeks, closed-arc-eyes, tiny printed mouth
  • GLOSSY 3D-RENDERED PEARLESCENT FINISH — Pop-Mart designer-vinyl rendering, glazed-pearlescent surfaces, soft-pastel palette (blush pink, lavender, mint, peach, cream, baby-blue)
  • SCATTERED TINY DECORATIONS around the hero — mini smiling fruit, stars, hearts, sprinkles, beads, pearls, macarons, candy. Some decorations have tiny faces too
  • CHERRY-BLOSSOM OR PASTEL FLORAL accents in the frame
  • RAINBOW MOTIF welcomed (rainbow soft-serve, rainbow cereal pouring out, rainbow milkshake)
  • NO HUMAN CHARACTERS, NO MINIFIGS, NO CREATURES eating the food — the food IS the cast

━━━ THE CUTE-FOOD SCENE ━━━
${scene}

━━━ LIGHTING (warm soft pastel only) ━━━
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
The hero food/drink is the centerpiece — centered or rule-of-thirds. Soft-blur pastel background. Scattered tiny decorations carpet the surface around the hero. Cherry-blossom branch may arch from corner. Setting is either tabletop close-up (70%) or wider cute setting like picnic-meadow / cafe-window / garden-table (30%). Always glossy pearlescent 3D-rendered Pop-Mart finish. The viewer's reaction: "OMG THIS IS THE CUTEST."

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
