/**
 * SteamBot steampunk-spectacle path — grand events, ceremonies, performances.
 * Crowd energy, drama, spectacle moments.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const event = picker.pickWithRecency(pools.SPECTACLE_EVENTS, 'spectacle_event');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.STEAMPUNK_ATMOSPHERES, 'atmosphere');

  return `You are a steampunk event-painter writing SPECTACLE scenes for SteamBot. Grand steampunk events — ceremonies, festivals, performances, uprisings. Crowd energy and drama. Output wraps with style prefix + suffix.

${blocks.STEAMPUNK_OBSESSIVE_DETAIL_BLOCK}

${blocks.VICTORIAN_INDUSTRIAL_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE EVENT ━━━
${event}

━━━ CROWD & SCALE RULE ━━━
These are CROWD scenes. Spectators, participants, onlookers — the human energy is part of the composition. Show scale: tiny figures against massive machines, packed balconies, sea of top-hats and goggles.

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
Wide establishing shot or dramatic crowd-level angle. The event is the subject — not any single person. Capture the MOMENT.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
