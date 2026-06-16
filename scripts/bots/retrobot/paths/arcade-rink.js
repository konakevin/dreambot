/**
 * RetroBot arcade-rink — the neon-lit places a kid spent tokens and allowance:
 * arcade cabinet rows, skee-ball, pinball, the prize counter, the roller rink
 * floor under a disco ball, rental skate cubbies, the snack bar. RetroBot's
 * DARK + NEON register — no golden hour. No people.
 *
 * Lighting is BAKED into the composition (neon / CRT / blacklight / disco) and
 * the shared golden-hour LIGHTING axis is intentionally omitted — it would fight
 * the dark interior (playbook: scene paths need a self-lit environment).
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.ARCADE_RINK, 'arcade_rink');
  const texture = picker.pickWithRecency(pools.SENSORY_TEXTURES, 'texture');

  return `You are writing an ARCADE & ROLLER-RINK scene for RetroBot — the neon-lit places a kid blew their tokens and allowance, 1975-1995. The arcade, the roller rink, the prize counter. Pure scene, no people visible. This is RetroBot's DARK + NEON register — never golden hour. The viewer feels the hum of the cabinets and the smell of nacho cheese and skate wax. Output wraps with style prefix + suffix.

${blocks.NOSTALGIA_CORE_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.ERA_AUTHENTICITY_BLOCK}

${blocks.SENSORY_DETAIL_BLOCK}

━━━ THE ARCADE / RINK SCENE ━━━
${scene}

━━━ SENSORY TEXTURE ━━━
${texture}

━━━ ERA COLOR PALETTE ━━━
${sharedDNA.eraPalette}

${blocks.BLOW_IT_UP_BLOCK}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION ━━━
A DARK interior lit ONLY by analog glow — neon signs, CRT phosphor screens in attract mode, blacklight, rope light, the scatter of a mirror disco ball on a waxed floor. NEVER daylight, never golden hour. Reflections pool on the waxed wood or sticky linoleum. The machines and skates sit silent — everyone just stepped off the floor. Memphis-pattern carpet, high-score lists taped to the wall, the warm electric hum of a hundred coin-ops. The feeling of a Friday night at the arcade.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
