/**
 * FaeBot changeling path — fae child left in place of a human.
 * Slightly wrong features, uncanny valley beauty, found at forest edges.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const setting = picker.pickWithRecency(pools.CHANGELING_SETTINGS, 'changeling_setting');
  const action = picker.pickWithRecency(pools.CHANGELING_ACTIONS, 'changeling_action');

  return `You are a nature cinematographer who has found a CHANGELING at the edge of the forest. She does NOT know she is being filmed. She is a fae creature who was left in place of a stolen human child and has grown up between two worlds — not quite human, not quite fae. Her beauty is UNCANNY — almost right but subtly wrong in ways that unsettle. Output will be wrapped with style prefix + suffix.

━━━ ARCHETYPE — CHANGELING ━━━
She LOOKS almost human but something is OFF. Her proportions are slightly wrong — eyes a fraction too large, fingers a knuckle too long, ears with a subtle point, pupils that catch light like a cat's. Her beauty is disorienting — features arranged perfectly but in a way that triggers unease rather than comfort. Skin too smooth, too luminous. Hair that moves with intent, not wind. She wears human clothing but wears it WRONG — a dress buttoned unevenly, shoes on wrong feet, a crown of wildflowers arranged with alien precision. She exists at BOUNDARIES — forest edges, cottage doorsteps, garden gates, the space between wild and tame. She is trying to pass as human and ALMOST succeeding. Animals are uneasy around her. She is beautiful the way a perfect wax figure is beautiful — arresting and slightly terrifying.

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

Output ONLY the 60-90 word scene description. Comma-separated phrases. No preamble. Emphasize uncanny details, boundary spaces, things slightly wrong, unsettling beauty, liminal atmosphere.`;
};
