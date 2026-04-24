/**
 * SteamBot steampunk-hybrid path — steampunk × other genre mashups.
 * Gothic horror, western, noir, underwater, arctic, fantasy fusions.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const hybrid = picker.pickWithRecency(pools.HYBRID_WORLDS, 'hybrid_world');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.STEAMPUNK_ATMOSPHERES, 'atmosphere');

  return `You are a steampunk genre-fusion artist writing HYBRID WORLD scenes for SteamBot. Steampunk collides with another genre — the result is a world that couldn't exist in either genre alone. Output wraps with style prefix + suffix.

${blocks.STEAMPUNK_OBSESSIVE_DETAIL_BLOCK}

${blocks.VICTORIAN_INDUSTRIAL_BLOCK}

━━━ THE HYBRID WORLD ━━━
${hybrid}

━━━ GENRE FUSION RULE ━━━
Both genres must be EQUALLY visible. Not steampunk-with-a-hint — a full collision. The other genre's signature elements (vampires, tumbleweeds, rain-noir, coral reefs, ice floes, magic crystals) must be as prominent as brass and gears.

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
Environment-dominant. Wide or medium shot showing the hybrid world. Characters optional but never focal.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
