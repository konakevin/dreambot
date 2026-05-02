const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const useLandscape = Math.random() < 0.4;
  const scene = useLandscape
    ? picker.pickWithRecency(pools.MODEL_TRAIN_LANDSCAPES, 'model_train_landscape')
    : picker.pickWithRecency(pools.MODEL_TRAIN_SCENES, 'model_train_scene');
  const camera = picker.pickWithRecency(pools.CAMERA_ANGLES, 'camera_angle');

  // Slot-pool DNA: roll 1 specific train consist (era + engine + cars) to
  // defeat Sonnet's "steam-locomotive" training-bias. Forces era + type variety.
  const train = picker.pickWithRecency(pools.TRAIN_CONSISTS, 'train_consist');

  // Weather/season/time-of-day axis — trains live or die by atmosphere.
  const weather = picker.pickWithRecency(pools.TRAIN_WEATHER, 'train_weather');

  return `You are an HO-scale model-train hobbyist photographer writing MODEL-TRAIN-DIORAMA scenes for ToyBot. Pure miniature-railroad world — no characters in frame, just obsessive scratch-built terrain populated by tiny model trains. Snowy mountain passes, autumn villages, factory yards, harbor towns, alpine tunnels, prairie crossings. Cozy + dioramic. Output wraps with style prefix + suffix.

${blocks.TOY_PHOTOGRAPHY_BLOCK}

${blocks.CINEMATIC_STORY_BLOCK}

${blocks.DRAMATIC_LIGHTING_MAKES_CHEAP_LOOK_EPIC_BLOCK}

${blocks.PATH_MEDIUM_LOCK_BLOCK}

━━━ MODEL-TRAIN MEDIUM LOCK ━━━
HO-scale (1:87) or N-scale model-railroad diorama — tiny die-cast steam locomotive or diesel engine pulling boxcars / passenger cars / coal-tenders / cabooses on twin nickel-silver rails. Hand-built terrain features: ground foam, lichen trees, plaster-cast rock-faces, static-grass meadows, scratch-built brick depots, signal-towers, water-tower, level-crossing, lift-bridge. NO HUMAN FIGURES in frame. Train is the focal point or the ambient detail in a richly-detailed terrain. Visible model-railroad construction tells (raised baseboard edge OK, scratch-built signage). NEVER real train, NEVER CGI, NEVER illustration, NEVER scale-people-figures filling frame.

━━━ CAMERA ━━━
${camera}

━━━ WEATHER + SEASON + TIME-OF-DAY ━━━
${weather}

━━━ THE TRAIN — RENDER THIS EXACT CONSIST (NON-NEGOTIABLE) ━━━
The train in this scene MUST be exactly this specific era + engine + consist — do NOT default to "generic steam-locomotive" repeats:
${train}

━━━ THE MODEL-TRAIN SCENE ━━━
${scene}


━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

${blocks.BLOW_IT_UP_BLOCK}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION ━━━
Wide diorama frame — tiny model-train as focal point or moving detail in a sweeping handcrafted terrain. Track-side or aerial-quarter angle. Practical hobby-shop / display-table lighting per pool palette. Lit windows in tiny depot, smoke from engine stack, atmospheric haze in valleys. Cozy obsessive-detail energy. NO PEOPLE.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
