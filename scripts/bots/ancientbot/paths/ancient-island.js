/**
 * AncientBot ancient-island — megalithic civilizations on islands surrounded by ocean.
 * Moai on volcanic coasts, Malta's cliff-edge temples, Sardinian nuraghe towers.
 * Massive stone on windswept islands — the mystery of HOW is part of every scene.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const setting = picker.pickWithRecency(pools.ISLAND_SCENES, 'island_scene');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are painting ONE island ancient civilization scene for AncientBot — MEGALITHIC STONE on ISLANDS surrounded by OCEAN. These isolated civilizations built monuments that seem impossible for their scale and remoteness. Moai on volcanic coastlines, Malta's cliff-edge temples (the oldest freestanding structures on Earth), Sardinia's nuraghe fortresses, Nan Madol's basalt-log city on artificial islands. The ocean is always present — the isolation, the vastness, the wind. Output wraps with style prefix + suffix.

${blocks.ANCIENT_WORLD_BLOCK}

━━━ PERIOD CONSTRAINTS — ISLANDS ━━━
MOSTLY pre-600 BC with selective exceptions for iconic island megalithic cultures that FEEL authentically ancient. Malta 3600-2500 BC, Sardinia nuraghe 1900-730 BC, Cycladic 3200-2000 BC, Minoan Crete 2700-1450 BC, Balearic Islands 1500 BC. ALLOWED EXCEPTIONS: Easter Island moai, Nan Madol, Tongan trilithon, Polynesian voyaging — these cultures feel timeless and ancient. NO medieval island castles, NO Greek classical temples (Doric/Ionic columns), NO Roman villas, NO sailing ships with multiple masts. Materials: limestone, basalt, volcanic rock, coral blocks, timber, thatch, obsidian, shell, bone, copper. Construction is PRIMITIVE-MONUMENTAL — massive stone moved by human labor.

━━━ NO PEOPLE ━━━
Pure environment. The stone and ocean carry all the drama — who built these, and HOW?

━━━ THE ISLAND SCENE ━━━
${setting}

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERE ━━━
${atmosphere}

━━━ PALETTE ━━━
${sharedDNA.scenePalette}
${sharedDNA.colorPalette}

${blocks.BLOW_IT_UP_BLOCK}

━━━ MOOD ━━━
${vibeDirective.slice(0, 250)}

━━━ OCEAN AND ISOLATION ━━━
The OCEAN must be present or strongly implied in every scene. These are ISLANDS — surrounded by water, exposed to wind, isolated from the mainland. The sea is visible as horizon, as crashing waves below cliffs, as calm lagoon channels, as vast blue backdrop to stone monuments. Wind is constant: salt spray on stone, bent grass, dramatic cloud formations moving fast across big skies. The stone looks WEATHERED by centuries of salt and wind — pitted, rounded, stained by lichen. The scale contrast between MASSIVE STONE and TINY ISLAND creates the awe.

━━━ COMPOSITION ━━━
Big sky, big ocean, monumental stone. Low angles looking UP at megaliths with ocean horizon behind. Wide shots showing the relationship between stone monuments and their island landscape — how impossibly large they are for such small, remote places. Foreground: windswept grass, volcanic rock, tide pools. Midground: megalithic architecture. Background: ocean to horizon, dramatic sky. The emptiness around the monuments amplifies their mystery.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO markers, NO bold. Just the phrases, starting immediately with the scene content.`;
};
