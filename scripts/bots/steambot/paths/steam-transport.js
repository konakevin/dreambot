/**
 * SteamBot steam-transport path — non-airship steampunk vehicles in dramatic terrain.
 * Trains, submarines, walking machines, stagecoaches, elevators, steam ships.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const transport = picker.pickWithRecency(pools.TRANSPORT_SCENES, 'transport_scene');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.STEAMPUNK_ATMOSPHERES, 'atmosphere');

  return `You are a steampunk vehicle-artist writing STEAM TRANSPORT scenes for SteamBot. Non-airship steampunk vehicles in dramatic terrain. The machine and the landscape create the drama together. Output wraps with style prefix + suffix.

${blocks.STEAMPUNK_OBSESSIVE_DETAIL_BLOCK}

${blocks.VICTORIAN_INDUSTRIAL_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE TRANSPORT SCENE ━━━
${transport}

━━━ VEHICLE + TERRAIN RULE ━━━
The vehicle is FOCAL but the terrain is what makes it dramatic. A train is boring on flat track — it's epic crossing a canyon bridge in a storm. Show the machine CONQUERING impossible geography.

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
Wide dramatic frame. Vehicle focal against terrain. Show SCALE — the machine vs the landscape. Steam trails, smoke plumes, headlamp beams cutting through weather.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
