/**
 * RetroBot video-store-friday — Blockbuster aisles, VHS tapes, horror
 * section curtain, movie posters, Friday night ritual.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.VIDEO_STORE, 'video_store');
  const texture = picker.pickWithRecency(pools.SENSORY_TEXTURES, 'texture');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');

  return `You are writing a VIDEO STORE FRIDAY NIGHT scene for RetroBot — the ritual of browsing a video rental store, 1985-1995. Blockbuster, Hollywood Video, mom-and-pop shops. Pure scene, no people visible. The viewer smells the plastic VHS cases. Output wraps with style prefix + suffix.

${blocks.NOSTALGIA_CORE_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.ERA_AUTHENTICITY_BLOCK}

${blocks.SENSORY_DETAIL_BLOCK}

━━━ THE VIDEO STORE SCENE ━━━
${scene}

━━━ SENSORY TEXTURE ━━━
${texture}

━━━ LIGHTING ━━━
${lighting}

━━━ ERA COLOR PALETTE ━━━
${sharedDNA.eraPalette}

${blocks.BLOW_IT_UP_BLOCK}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION ━━━
Interior video store — fluorescent overhead mixed with backlit movie poster glow. Shelves of VHS cases, "New Releases" wall, "Be Kind Rewind" stickers, drop-box slot. A membership card left on the counter, a stack of tapes ready to check out. Friday night anticipation energy.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
