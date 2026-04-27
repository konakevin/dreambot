/**
 * FaeBot hedge-witch path — nymph cottage-core.
 * Same SirenBot-lifted forest nymph archetype, but in cottage-core settings.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const setting = picker.pickWithRecency(pools.HEDGE_WITCH_SETTINGS, 'hedge_witch_setting');
  const action = picker.pickWithRecency(pools.HEDGE_WITCH_ACTIONS, 'hedge_witch_action');
  const hair = picker.pickWithRecency(pools.NYMPH_HAIR, 'nymph_hair');
  const skin = picker.pickWithRecency(pools.NYMPH_SKIN, 'nymph_skin');

  return `You are a nature cinematographer who has found a FOREST NYMPH living in a cottage at the edge of the woods. She does NOT know she is being filmed. She is a spirit of the forest — part woman, part living nature — but she has taken up cottage life. Herb-drying, potion-brewing, garden-tending. Her cottage is as much a character as she is. Output will be wrapped with style prefix + suffix.

━━━ ARCHETYPE — FOREST NYMPH (COTTAGE-CORE) ━━━
She is NOT a human woman. She is a forest CREATURE — her body is literally made of living nature. Flowers blooming from her shoulders and spine, delicate moss along her collarbones, bioluminescent markings that glow, tiny ferns unfurling from her skin. She is as much plant as she is flesh. Beautiful, feminine, stunning — but unmistakably inhuman. The forest grows FROM her, not just around her. But she has made herself a HOME at the forest's edge — a hand-stitched linen apron over her living coverings.

━━━ HER SPECIFIC HAIR + EYES (use EXACTLY as written) ━━━
${hair}

━━━ HER SPECIFIC SKIN + GLOW + COVERINGS (use EXACTLY as written) ━━━
${skin}

She tends an herb garden, brews in a cauldron, fills jars with tinctures. Her cottage is overgrown with her own nature — roots through the floorboards, moss on the windowsills, her garden impossibly lush. Cats and small forest creatures surround her. She is the coziest creature in the forest.

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

Output ONLY the 60-90 word scene description. Comma-separated phrases. No preamble. Emphasize the contrast between wild nymph nature and cozy domestic life — bark hands holding a teacup, moss on cottage walls, flowers in her hair while she stirs a cauldron.`;
};
