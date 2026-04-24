/**
 * BloomBot reclaim path — flowers conquering hostile, ugly, desolate environments.
 * Swamps, deserts, caves, ruins, junkyards, volcanic wastelands.
 * The contrast IS the beauty — flowers are WINNING.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const arrangement = picker.pickWithRecency(pools.FLOWER_ARRANGEMENTS, 'flower_arrangement');
  const space = picker.pickWithRecency(pools.RECLAIM_SPACES, 'reclaim_space');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pick(pools.ATMOSPHERES);

  return `You are a post-apocalyptic botanical photographer writing RECLAIM scenes for BloomBot. Harsh, ugly, desolate environments where flowers are WINNING — nature reclaiming hostile places. The CONTRAST between ugly setting and beautiful flowers IS the entire point. Output wraps with style prefix + suffix.

${blocks.FLORAL_DOMINANCE_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE HOSTILE SETTING ━━━
${space}

━━━ THE FLOWERS CONQUERING THIS PLACE ━━━
${arrangement}

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

${blocks.DRAMATIC_LIGHTING_BLOCK}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ RECLAIM SIGNATURE — NON-NEGOTIABLE ━━━
- The setting must look HOSTILE, UGLY, or DESOLATE — rust, decay, ash, ice, rubble, murk
- The flowers are WINNING — not just surviving, CONQUERING. They dominate the scene
- CONTRAST is everything — soft petals against hard rust, vivid color against grey decay
- The flowers should look IMPOSSIBLE in this setting — that's what makes it beautiful
- Show the battle being WON — flowers cracking concrete, overtaking metal, softening ruins

━━━ BLOW IT UP — FLOWERS ARE WINNING ━━━
The flowers have already WON this war against the hostile environment:
- Blooms erupting through every crack, gap, hole, and broken surface
- Flowers cascading over rusted metal, crumbling walls, broken machinery
- Petals carpeting ash, rubble, ice — softening every hard edge
- Vines consuming entire structures, pulling them back into nature
- The hostile setting is LOSING — flowers cover 60-70% of the frame
- Beauty has overwhelmed ugliness — the reclamation is nearly complete

Output ONLY the 60-90 word scene description. Comma-separated phrases. No preamble, no quotes.`;
};
