/**
 * CuddleBot jungle-village path — cozy jungle/rainforest VILLAGES + COTTAGES
 * are the hero. Treehouse villages in giant ceiba trees, mushroom-house
 * cluster in a clearing, leaf-roof huts on a vine bridge, jungle-floor
 * market square, canopy-platform tea-house. Creature is a peripheral
 * resident OR absent — architecture and atmosphere carry the scene.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.JUNGLE_VILLAGE_SCENES, 'jungle_village_scene');
  const creature = picker.pickWithRecency(pools.JUNGLE_CREATURES, 'jungle_creature');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are writing JUNGLE-VILLAGE scenes for CuddleBot — cozy rainforest VILLAGES + COTTAGES + TREEHOUSE-CLUSTERS that the viewer wants to live in. Treehouse village in a giant ceiba, mushroom-house clearing, leaf-roof huts on a vine bridge, jungle-floor market square, canopy-platform tea-house, hanging-bottle-house cluster, vine-stair village. The ARCHITECTURE and ATMOSPHERE are the hero — not the creature. Pixar / Sanrio / Studio Ghibli / Encanto / Princess-Mononoke aesthetic. Output wraps with style prefix + suffix.

${blocks.CUTE_CUDDLY_COZY_BLOCK}

${blocks.STYLIZED_NOT_PHOTOREAL_BLOCK}

${blocks.NO_DARK_NO_INTENSE_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE JUNGLE-VILLAGE SCENE ━━━
${scene}

━━━ OPTIONAL VILLAGE RESIDENT (only feature if scene calls for it — peripheral, NOT centered) ━━━
${creature}

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

━━━ JUNGLE-VILLAGE DNA ━━━
The VILLAGE is the subject — not a backdrop. Render the rainforest architecture with obsessive cozy detail: bark-and-thatch huts with carved wooden doors, mossy roofs draped in flowering vines, lantern-flowers at every door, hanging-fruit-bowl windows, banana-leaf awnings, rope-bridge connectors between treehouses, woven-vine railings, glow-mushroom streetlamps. The village feels LIVED IN — woven-baskets at doors, drying herbs hanging from rafters, banana-leaf laundry, fruit-stall crates, fern-broom against a wall. If the scene description includes a peripheral resident creature (sloth, capybara, frog, monkey, toucan), feature them naturally as a tiny local going about village life — sweeping a doorstep, swinging on a vine to a neighbor's, peeking from a window — small but charming. About 60% of scenes feature a small resident peripheral creature; 40% are pure village atmosphere with no creature visible. The viewer wants to MOVE INTO this village. Artbook-quality rendering.

━━━ COMPOSITION ━━━
Wide or mid-wide elevated view of the village cluster — canopy-village seen from a neighboring branch, jungle-floor market seen from a vine, treehouse cluster seen from across a clearing. Architecture fills 60-80% of the frame. Tilt-shift or shallow DOF on a single charming detail OK. Sun-dappled warm jungle-light filtering through giant leaves + lantern-flower glow + warm window-light. Creature (if present) is small, peripheral, NOT center-frame. Maximum cozy-village saturation.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
