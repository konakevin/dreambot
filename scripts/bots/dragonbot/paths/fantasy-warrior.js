const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const isFemale = false; // TODO: revert to Math.random() < 0.5
  const character = isFemale
    ? picker.pickWithRecency(pools.FEMALE_WARRIORS, 'female_warrior')
    : picker.pickWithRecency(pools.MALE_WARRIORS, 'male_warrior');
  const action = picker.pickWithRecency(pools.WARRIOR_ACTIONS, 'warrior_action');
  const landscape = picker.pickWithRecency(pools.FANTASY_LANDSCAPES, 'fantasy_landscape');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a fantasy concept-art painter writing EPIC FANTASY WARRIOR scenes for DragonBot — a single heroic character standing in a jaw-dropping high-fantasy landscape. Same universe as our dragons and vast landscapes. The character is the HERO but the world behind them is equally breathtaking. Output wraps with style prefix + suffix.

${blocks.EPIC_FANTASY_BLOCK}

${blocks.PAINTERLY_ILLUSTRATION_BLOCK}

${blocks.CINEMATIC_COMPOSITION_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ SOLO CHARACTER ONLY ━━━
ONE character. No companions, no enemies, no crowds. This warrior ALONE against the world.

━━━ THE CHARACTER IS THE FOCAL POINT — OBSESSIVE DETAIL ━━━
The character must look like they ACTUALLY EXIST in this world. Render them with obsessive detail:
- FACE: every pore, scar, freckle, war paint stroke — you can see the years in their eyes
- SKIN: weathered, sun-darkened, rain-slicked, battle-grimy — NOT clean studio skin
- ARMOR/OUTFIT: individual rivets, scratched leather, dented metal, frayed stitching, bloodstains, mud
- WEAPONS: nicked blades, wrapped grips, worn sheaths — tools that have been USED
- HAIR: windswept, matted, braided with metal rings — never salon-perfect
- BODY LANGUAGE: natural, unposed, caught in a moment — the confidence of someone who has survived

━━━ THE WARRIOR ━━━
${isFemale ? 'This character is a BEAUTIFUL WOMAN. Render her as unambiguously feminine — gorgeous face, feminine body, ornate detailed armor/outfit.' : 'This character is MALE. Render him as unambiguously masculine — rugged face, powerful build, battle-worn gear.'}
${character}

━━━ THE ACTION (what they are doing RIGHT NOW) ━━━
${action}

━━━ THE LANDSCAPE (as epic as the character) ━━━
${landscape}

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
CANDID SHOTS — we just snapped a photo of them in the middle of their life. They are NOT posing for the camera, NOT looking at the viewer, NOT standing heroically with back turned. They are caught mid-action, mid-thought, mid-moment:
- Sharpening a blade by firelight, eyes focused on the edge
- Scanning the horizon from a cliff, hand shielding eyes from wind
- Crouching to examine tracks in mud, weapon resting across knees
- Striding through rain-soaked ruins, cloak whipping, focused on destination
- Pulling an arrow from a quiver mid-stride, eyes locked on something ahead
- Adjusting armor straps, jaw set, preparing for what's coming
CAMERA FACES THEM — we see their face, their expression, their body language from the FRONT or three-quarter angle. NEVER from behind. The landscape stretches vast behind them. Full-body or wide mid-shot. Depth on depth — foreground detail, midground character, background landscape.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
