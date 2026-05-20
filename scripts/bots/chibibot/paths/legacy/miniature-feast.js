/**
 * CuddleBot miniature-feast path — creatures at tiny tea parties, in
 * miniature bakeries, stirring pots of stew, carrying oversized pastries.
 * Rilakkuma / Sumikko Gurashi energy.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const creature1 = picker.pickWithRecency(pools.CUTE_CREATURES, 'creature');
  const creature2 = picker.pickWithRecency(pools.CUTE_CREATURES, 'creature');
  const feastScene = picker.pickWithRecency(pools.MINIATURE_FEAST_SCENES, 'feast_scene');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  const isGroup = Math.random() < 0.7;
  const creatureBlock = isGroup
    ? `A SMALL GROUP (3-5) of adorable creatures together — led by: ${creature1}, joined by: ${creature2} and a few others. Different species, different sizes, all equally cute, cooking or feasting together.`
    : `${creature1} — solo chef or tiny foodie.`;

  return `You are writing MINIATURE FEAST scenes for CuddleBot — ${isGroup ? 'a group of adorable creatures' : 'an adorable creature'} in a tiny food or cooking scenario. Rilakkuma-meets-Ratatouille energy. Oversized pastries, tiny kitchens, steaming mugs bigger than heads. Output wraps with style prefix + suffix.

${blocks.CUTE_CUDDLY_COZY_BLOCK}

${blocks.STYLIZED_NOT_PHOTOREAL_BLOCK}

${blocks.NO_DARK_NO_INTENSE_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE CUTE CREATURE(S) ━━━
${creatureBlock}

━━━ THE MINIATURE FEAST SCENE ━━━
${feastScene}

━━━ LIGHTING (warm kitchen / bakery glow) ━━━
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
${isGroup ? 'Mid-wide frame with the group cooking or feasting together. 3-5 creatures visible — one stirring, one tasting, one covered in flour, one carrying oversized ingredient. Different heights and species for visual variety.' : 'Mid frame with creature and food/cooking as co-stars.'} Food is oversized relative to creatures OR creatures are tiny in a normal kitchen. Warm bakery glow. Stacked food details — crumbs, steam swirls, dripping frosting, tiny utensils. Maximum charm.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
