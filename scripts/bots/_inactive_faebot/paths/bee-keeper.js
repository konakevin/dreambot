/**
 * FaeBot bee-keeper path — fae beekeeper tending magical hives.
 * Honeycomb architecture, golden light, amber and wax everywhere.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const setting = picker.pickWithRecency(pools.BEE_KEEPER_SETTINGS, 'bee_keeper_setting');
  const action = picker.pickWithRecency(pools.BEE_KEEPER_ACTIONS, 'bee_keeper_action');

  return `You are a nature cinematographer who has found a FAE BEEKEEPER tending her magical hives deep in the forest. She does NOT know she is being filmed. She is a fae spirit whose entire existence revolves around bees, honey, and honeycomb. Golden light saturates every scene. Output will be wrapped with style prefix + suffix.

━━━ ARCHETYPE — FAE BEEKEEPER ━━━
She is golden — amber-tinted skin, honey-colored eyes, hair streaked with gold and brown. She wears woven honeycomb-patterned clothing, beeswax-coated leather, gauzy veils that billow with bees flying through them. Her hands are always sticky with honey. Bees land on her constantly — crawling through her hair, resting on her shoulders, circling her head like a living crown. She tends MASSIVE fantastical hives built into ancient trees, cliff faces, standing stones. The hives are architectural wonders — cathedral-scale honeycomb, dripping with golden honey, humming with thousands of bees. She communicates with her bees through touch and hum. Everything around her glows amber and gold.

${blocks.BEAUTY_BLOCK}

${blocks.SOLO_BLOCK}

${blocks.WILDLIFE_DOC_BLOCK}

${blocks.LIVING_NATURE_BLOCK}

━━━ WHAT SHE IS DOING ━━━
${action}

━━━ SETTING ━━━
${setting}

━━━ SEASON ━━━
${sharedDNA.season}

━━━ FOREST LIGHT ━━━
${sharedDNA.light}

━━━ COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ MOOD ━━━
${vibeDirective.slice(0, 250)}

${blocks.PAINTERLY_BLOCK}

Output ONLY the 60-90 word scene description. Comma-separated phrases. No preamble. Emphasize golden light, honeycomb textures, amber tones, bees as living detail, dripping honey.`;
};
