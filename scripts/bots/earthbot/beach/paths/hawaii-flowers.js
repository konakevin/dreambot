/**
 * BeachBot hawaii-flowers path — jaw-dropping Hawaiian coastal scenes with
 * tropical flowers as co-star. Two-pool architecture: Hawaiian coastal spaces
 * × tropical flower arrangements. Beach/coast is the setting, flowers bloom
 * everywhere. Kauai, Maui, Oahu, Big Island.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const arrangement = picker.pickWithRecency(pools.TROPICAL_FLOWER_ARRANGEMENTS, 'tropical_flower_arrangement');
  const space = picker.pickWithRecency(pools.HAWAII_COASTAL_SPACES, 'hawaii_coastal_space');
  const weather = picker.pickWithRecency(pools.COASTAL_WEATHER_MOMENTS, 'coastal_weather');
  const atmosphere = picker.pick(pools.ATMOSPHERES);

  return `You are a world-class travel photographer writing HAWAIIAN COASTAL FLOWER scenes for BeachBot. Stunning beaches and coastlines across Hawaii's islands where tropical flowers bloom in jaw-dropping abundance. The BEACH or COAST is the hero setting, flowers are the spectacular co-star. Output wraps with style prefix + suffix.

${blocks.BEACH_PARADISE_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE HAWAIIAN COASTAL SETTING ━━━
${space}

━━━ THE FLOWERS IN THIS SCENE ━━━
${arrangement}

━━━ WEATHER + LIGHTING MOMENT ━━━
${weather}

━━━ HAWAIIAN IDENTITY — NON-NEGOTIABLE ━━━
- Must read as a SPECIFIC Hawaiian island at a glance — not a generic tropical beach
- Use ONLY the flowers described in THE FLOWERS IN THIS SCENE above — those are the EXACT species and colors for this render
- Hawaiian atmosphere: trade winds, salt spray, warm Pacific air, volcanic mist, rainbow light
- Beach/coast context DOMINANT: turquoise water, volcanic rock, white/black/green sand, palm groves, reef shimmer

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

${blocks.DRAMATIC_LIGHTING_BLOCK}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ FLOWER DENSITY — FANTASY LEVEL ━━━
This is NOT a realistic Hawaiian beach. This is FANTASY-LEVEL tropical flower density on a real Hawaiian coast. 50× more blooms than nature allows. Flowers cascading down cliffs to the shoreline. Petals scattered across sand. Bloom walls framing ocean views. Flower carpets leading to the water's edge. The flowers described above are ABUNDANT and STUNNING against the Hawaiian coastal backdrop.

${blocks.BLOW_IT_UP_BLOCK}

━━━ BEACH + FLOWERS BALANCE ━━━
The Hawaiian coast is the SETTING (60% of frame) — ocean, sand, volcanic rock, sky. Flowers are the SPECTACLE (40% of frame) — everywhere you look, blooming in impossible density. The combination should make the viewer gasp — the most beautiful beach they've ever seen, made impossibly more beautiful by an explosion of tropical flowers.

Output ONLY the 60-90 word scene description. Comma-separated phrases. No preamble, no quotes.`;
};
