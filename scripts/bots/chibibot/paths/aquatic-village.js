/**
 * CuddleBot aquatic-village path — cozy underwater / surface-water village
 * is the hero. Anemone-cottage harbors, seashell-row streets, hermit-crab
 * shell-house clusters, coral-cottage town, lily-pad-lantern village,
 * pearl-glow harbor at twilight. Creature is a peripheral resident OR
 * absent — the architecture and atmosphere carry the scene.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.AQUATIC_VILLAGE_SCENES, 'aquatic_village_scene');
  const creature = picker.pickWithRecency(pools.AQUATIC_CREATURES, 'aquatic_creature');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are writing AQUATIC-VILLAGE scenes for CuddleBot — cozy underwater or surface-water VILLAGES + COTTAGES + HARBOR-TOWNS that the viewer wants to live in. Anemone-cottage harbor, seashell-row streets, hermit-crab shell-house clusters, coral-cottage town, lily-pad-lantern village, pearl-glow harbor at twilight, kelp-forest treehouse-cluster. The ARCHITECTURE and ATMOSPHERE are the hero — not the creature. Pixar / Sanrio / Studio Ghibli / Finding-Nemo aesthetic. Output wraps with style prefix + suffix.

${blocks.CUTE_CUDDLY_COZY_BLOCK}

${blocks.STYLIZED_NOT_PHOTOREAL_BLOCK}

${blocks.NO_DARK_NO_INTENSE_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE AQUATIC-VILLAGE SCENE ━━━
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

${blocks.COZY_VILLAGE_CLUTTER_BLOCK}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ AQUATIC-VILLAGE DNA ━━━
The VILLAGE is the subject — not a backdrop. Render the underwater/surface-water architecture with obsessive cozy detail: anemone-cottages with shell-doorways, sea-glass-pebble paths, kelp-string-lights between coral-towers, lantern-jellyfish lighting harbor lanes, pearl-bead-window-glow, conch-shell chimneys (with bubble-smoke for underwater), dock-pilings of mangrove-root. The village feels LIVED IN — kelp-laundry on lines, tiny shell-baskets at doors, dock-net-floats stacked, coral-mailboxes. If the scene description includes a peripheral resident creature (sea otter, crab, jellyfish, fish), feature them naturally as a tiny local going about village life — splashing, peeking from a doorway, drifting past a window — small but charming. About 60% of scenes feature a small resident peripheral creature; 40% are pure village atmosphere with no creature visible. The viewer wants to MOVE INTO this village. Artbook-quality rendering.

━━━ COMPOSITION ━━━
Wide or mid-wide elevated view of the village street / harbor / cluster — like a model railway layout but underwater or at the water-surface. Architecture fills 60-80% of the frame. Tilt-shift or shallow DOF on a single charming detail OK. Soft caustic-light dapples + warm window-glow + jewel-clear water. Creature (if present) is small in the corner, peripheral, NOT center-frame. Maximum cozy-village saturation.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
