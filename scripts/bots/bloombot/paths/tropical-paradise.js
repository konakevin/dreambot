/**
 * BloomBot tropical-paradise path — Hawaiian-style conservatories, tropical
 * flower gardens, island botanical settings. Plumeria, bougainvillea, hibiscus,
 * bird-of-paradise, ohia lehua. Ocean views, volcanic stone, trade winds.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const arrangement = picker.pickWithRecency(pools.TROPICAL_FLOWER_ARRANGEMENTS, 'tropical_flower_arrangement');
  const space = picker.pickWithRecency(pools.TROPICAL_PARADISE_SPACES, 'tropical_paradise_space');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pick(pools.ATMOSPHERES);

  return `You are a tropical botanical photographer writing HAWAIIAN PARADISE scenes for BloomBot. Lush tropical conservatories, island flower gardens, volcanic botanical settings BURSTING with Hawaiian flowers. The scene must unmistakably feel TROPICAL — warm, humid, Pacific Island energy. Output wraps with style prefix + suffix.

${blocks.FLORAL_DOMINANCE_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE TROPICAL SPACE ━━━
${space}

━━━ THE FLOWERS IN THIS SCENE ━━━
${arrangement}

━━━ TROPICAL IDENTITY — NON-NEGOTIABLE ━━━
- Must read as HAWAIIAN / TROPICAL at a glance — not a generic greenhouse
- Use ONLY the flowers described in THE FLOWERS IN THIS SCENE above — those are the EXACT species and colors for this render
- Tropical atmosphere: trade winds, salt air, humidity, warm rain, volcanic mist, Pacific light
- Landscape context when visible: ocean, jungle canopy, volcanic mountains, palm trees

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

${blocks.DRAMATIC_LIGHTING_BLOCK}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ HYPER-REAL FLOWER DENSITY — CRANK IT TO 11 ━━━
This is NOT a realistic botanical garden. This is FANTASY-LEVEL tropical flower density. 100× more blooms than nature allows. Every surface DRIPPING with the flowers described above. Flower waterfalls cascading 30 feet. Petals carpeting entire stone pathways inches deep. Bloom walls so thick you can't see the structure behind them. The scene should make the viewer's jaw drop — a FEAST for the eyes. More is more. Then MORE.

━━━ COMPOSITION ━━━
Immersive — the viewer is standing IN the tropical paradise. Flowers OVERWHELM the frame, tropical context visible through the floral explosion. Impossibly lush, impossibly dense, impossibly beautiful.

Output ONLY the 60-90 word scene description. Comma-separated phrases. No preamble, no quotes.`;
};
