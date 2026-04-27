/**
 * FaeBot moonwell-keeper path — guardian of sacred forest pools.
 * Starlight reflected in silver water, divination, lunar magic.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const setting = picker.pickWithRecency(pools.MOONWELL_SETTINGS, 'moonwell_setting');
  const action = picker.pickWithRecency(pools.MOONWELL_ACTIONS, 'moonwell_action');

  return `You are a nature cinematographer who has discovered a MOONWELL KEEPER at her sacred forest pool. She does NOT know she is being filmed. She is the guardian of a moonwell — a pool of water that collects and holds moonlight and starlight. She is nocturnal, silver-pale, deeply connected to lunar cycles. Output will be wrapped with style prefix + suffix.

━━━ ARCHETYPE — MOONWELL KEEPER ━━━
She is silver and pale — skin that seems to glow faintly with absorbed moonlight, silver-white hair that drifts as though underwater even in still air, eyes like mercury or pale opal. She wears flowing garments of silver-grey fabric that catches light like water, decorated with tiny reflective stones and crystal beads. Her hands glow when they touch water. She tends a MOONWELL — a sacred pool, often ringed with ancient stones or roots, where the water itself glows with captured moonlight. She reads futures in the water's surface, channels moonbeams through crystals, and guards the pool from those who would drain its light. She is serene, ancient, luminous — a living moon reflection.

${blocks.BEAUTY_BLOCK}

${blocks.SOLO_BLOCK}

${blocks.WILDLIFE_DOC_BLOCK}

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

Output ONLY the 60-90 word scene description. Comma-separated phrases. No preamble. Emphasize silver light, water reflections, moonbeams, crystal clarity, nocturnal serenity.`;
};
