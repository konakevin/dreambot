/**
 * RetroBot street-till-dark — the sidewalk, driveway, and cul-de-sac that was
 * the kids' playground: chalk hopscotch, dropped bikes, the garage hoop, roller
 * skates, the lemonade stand, jump rope. "Out till the streetlights come on."
 * No people — the kids just scattered. Golden hour fading to dusk.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.STREET_TILL_DARK, 'street_till_dark');
  const texture = picker.pickWithRecency(pools.SENSORY_TEXTURES, 'texture');

  return `You are writing a STREET-PLAY scene for RetroBot — the sidewalk, driveway, and cul-de-sac that was every kid's playground, 1975-1995. Hopscotch, bikes, the garage hoop, the lemonade stand. "Out till the streetlights come on." Pure scene, no people visible. The viewer feels warm pavement and the last amber light. Output wraps with style prefix + suffix.

${blocks.NOSTALGIA_CORE_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.ERA_AUTHENTICITY_BLOCK}

${blocks.SENSORY_DETAIL_BLOCK}

━━━ THE STREET SCENE ━━━
${scene}

━━━ SENSORY TEXTURE ━━━
${texture}

━━━ ERA COLOR PALETTE ━━━
${sharedDNA.eraPalette}

${blocks.BLOW_IT_UP_BLOCK}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION ━━━
The street, sidewalk, or driveway at golden hour fading to dusk — long shadows, warm amber, a streetlight beginning to buzz on over an empty cul-de-sac. Objects imply the kids just scattered for dinner: a bike dropped on its side, a chalk hopscotch grid with the marker still on it, a ball resting under the garage hoop, skates on the porch step. The suburban frame — chain-link, mailbox, hedges. The feeling of "five more minutes."

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
