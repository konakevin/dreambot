/**
 * RetroBot retro-tech — dial-up modems, AOL, CRT monitors, first consoles,
 * cordless phones, GeoCities, CD-ROM games, Walkman, boomboxes.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.RETRO_TECH, 'retro_tech');
  const texture = picker.pickWithRecency(pools.SENSORY_TEXTURES, 'texture');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');

  return `You are writing a RETRO TECH scene for RetroBot — the technology that defined growing up, 1980-1995. The first time you heard dial-up, the glow of a green-screen monitor, the click of a game cartridge. Pure scene, no people visible. The viewer hears the modem handshake. Output wraps with style prefix + suffix.

${blocks.NOSTALGIA_CORE_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.ERA_AUTHENTICITY_BLOCK}

${blocks.SENSORY_DETAIL_BLOCK}

━━━ THE RETRO TECH SCENE ━━━
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
Desk, entertainment center, or floor setup. CRT glow as primary light — green, amber, or TV-blue. The technology is the hero — cables, cartridges, floppy disks, joysticks, a phone with a coiled cord. Close enough to see the scanlines. The magic of technology when it was still new and exciting.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
