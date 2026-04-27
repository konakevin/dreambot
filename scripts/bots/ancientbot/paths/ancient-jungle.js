/**
 * AncientBot ancient-jungle — stone civilizations in dense tropical jungle.
 * Olmec basalt heads, vine-wrapped pyramids, ceremonial plazas in clearings.
 * The jungle is as monumental as the architecture.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const setting = picker.pickWithRecency(pools.JUNGLE_SCENES, 'jungle_scene');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are painting ONE jungle ancient civilization scene for AncientBot — stone architecture in DENSE TROPICAL JUNGLE. These civilizations built in and against the living forest. Stepped pyramids rise above canopy, vine-wrapped temples crumble under root pressure, ceremonial plazas open like wounds in endless green. The jungle is not background — it is an equal force to the architecture. Output wraps with style prefix + suffix.

${blocks.ANCIENT_WORLD_BLOCK}

${blocks.PERIOD_ACCURACY_BLOCK}

━━━ PERIOD CONSTRAINTS — JUNGLE ━━━
PRE-600 BC ONLY. Olmec (1500-400 BC), Norte Chico/Caral, early pre-Classic Mesoamerican. NO Classic Maya (Tikal, Palenque, Chichen Itza are 250-900 AD — BANNED). NO Aztec, NO Angkor Wat, NO Inca. Materials: basalt, limestone, packed earth, timber, thatch, jade, obsidian. NO iron, NO horses in the Americas.

━━━ BACKGROUND ACTIVITY ━━━
Tiny figures in clearings, on causeways, carrying loads through jungle paths — background texture only, NEVER subjects.

━━━ THE JUNGLE SCENE ━━━
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

━━━ JUNGLE IS ALIVE ━━━
The jungle must be FELT: dense canopy filtering light into green-gold shafts, massive ceiba and strangler fig trunks dwarfing architecture, vines and roots actively gripping stone surfaces, bromeliads and orchids colonizing every ledge, mist rising from forest floor, humidity visible as haze between layers of vegetation. The air is THICK — warm, wet, fragrant. Birds and insects implied by the lush density. Stone surfaces are always DAMP, moss-covered, stained green by centuries of growth.

━━━ COMPOSITION ━━━
Layered depth through vegetation — foreground ferns and undergrowth, midground architecture emerging from or being consumed by jungle, background canopy or pyramid tips breaking the treeline. Light enters from ABOVE through canopy breaks, creating dramatic shafts and dappled patterns on stone. Vertical composition: roots at base, carved stone in middle, canopy and sky slivers at top. The tension between BUILT and GROWN drives every frame.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO markers, NO bold. Just the phrases, starting immediately with the scene content.`;
};
