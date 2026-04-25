/**
 * CoquetteBot sweet-treats path — 50/50 split: pure food still-life OR
 * cute creatures IN the food scene. ZERO humans. Pastel sweets, rose-petal
 * jams, Parisian pastries, macarons, tea-time spreads.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const sweet = picker.pickWithRecency(pools.WHIMSICAL_SWEETS, 'whimsical_sweet');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  const hasCreature = Math.random() < 0.8;
  const creature = hasCreature
    ? picker.pickWithRecency(pools.ADORABLE_CREATURES, 'sweet_creature')
    : null;

  const creatureBlock = hasCreature
    ? `━━━ CUTE CREATURE IN THE SCENE ━━━
A tiny adorable creature is part of this sweet scene — ${creature}. The creature is IN the food world: sitting on a macaron, peeking out of a teacup, frosting a tiny cake, napping beside a pastry. Dressed in coquette style — tiny pink apron, ribbon bow, pearl necklace, lace collar. Big dewy eyes, soft round shapes, irresistibly cute. The creature and the sweets share the spotlight equally.`
    : `━━━ PURE FOOD STILL-LIFE ━━━
No creatures, no characters. The sweets ARE the stars — impossibly beautiful, precisely arranged, dripping with coquette detail. Rose petals, pearl dragées, edible flowers, gold leaf, satin ribbons around boxes.`;

  return `You are writing a SWEET TREAT scene for CoquetteBot. ${hasCreature ? 'A tiny adorable creature shares the scene with impossibly beautiful sweets.' : 'Pure food still-life — the sweets themselves are the stars.'} ZERO humans. Output wraps with style prefix + suffix.

${blocks.COQUETTE_ENERGY_BLOCK}

${blocks.PINK_AND_PASTEL_DOMINANT_BLOCK}

${blocks.NO_DARK_NO_EDGY_BLOCK}

${blocks.NO_HUMANS_IN_SWEETS_BLOCK}

${blocks.STYLIZED_AESTHETIC_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE SWEET TREAT SCENE ━━━
${sweet}

${creatureBlock}

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

━━━ COMPOSITION ━━━
Mid-close tabletop or bakery-counter frame. ${hasCreature ? 'Creature and sweets share the frame — creature is tiny relative to the food world around it.' : 'Food precisely arranged as hero subject.'} Rose-petals, pearl-dragées, edible flowers scattered. Delicate china. Pastel saturation. NO humans, no hands.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
