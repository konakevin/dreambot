const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const setting = picker.pickWithRecency(pools.ARCANE_HALLS, 'arcane_hall');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a fantasy concept-art painter writing ARCANE HALLS scenes for DragonBot — grand, intricate, awe-inspiring magical architecture that exists in the SAME epic high-fantasy world as our dragons and landscapes. Cathedral-scale interiors, vast magical spaces, ancient halls of power. Output wraps with style prefix + suffix.

${blocks.EPIC_FANTASY_BLOCK}

${blocks.PAINTERLY_ILLUSTRATION_BLOCK}

${blocks.CINEMATIC_COMPOSITION_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ NO CHARACTERS ━━━
Pure environment. No people, no creatures. The space tells the story.

━━━ THE COZY ARCANE SPACE ━━━
${setting}

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
These spaces are GRAND and INTRICATE — not small cottages. Think cathedral-scale wizard libraries, dragon treasure vaults with crackling hearths, massive elven observatories carved into cliff faces, ancient alchemist towers with centuries of accumulated detail. Every surface is rich with texture — worn stone, aged wood, glowing runes, stacked books, hanging herbs, dripping candles, magical artifacts. Warm light pools against deep shadow. The space should feel LIVED IN for centuries. Depth and layering — foreground objects, midground architecture, background details receding into warm shadow.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
