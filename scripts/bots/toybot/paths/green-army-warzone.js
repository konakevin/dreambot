const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const useLandscape = Math.random() < 0.3;
  const scene = useLandscape
    ? picker.pickWithRecency(pools.GREEN_ARMY_WARZONE_LANDSCAPES, 'green_army_warzone_landscape')
    : picker.pickWithRecency(pools.GREEN_ARMY_WARZONE_SCENES, 'green_army_warzone_scene');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const scenario =
    sharedDNA.renderMode === 'world'
      ? picker.pickWithRecency(pools.ARMY_SCENARIOS, 'army_scenario')
      : null;
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');
  const camera = picker.pickWithRecency(pools.CAMERA_ANGLES, 'camera_angle');

  // Framing gate — 25% wide-LENS macro vs 75% the rolled camera (close lean).
  const isWide = Math.random() < 0.25;
  const framingBlock = isWide
    ? `━━━ FRAMING — WIDE-LENS MACRO ━━━
WIDE-ANGLE LENS macro framing — 14-24mm wide-angle lens close to subject, exaggerated foreground perspective, foreground figures looming larger, deep field of view showing more terrain + multiple platoons + vehicles + atmosphere across the frame. Still macro-close (toy-eye-level), but wide field of view captures more of the diorama at once. NOT a pulled-back establishing shot — camera stays close, lens just goes wider.`
    : `━━━ FRAMING — STANDARD ━━━
Camera angle direction below sets the framing. Default is mid-close action diorama at toy-eye-level.`;

  return `You are a toy-soldier diorama photographer writing GREEN-ARMY-MEN scenes for ToyBot. Classic monochromatic molded-plastic single-pose toy soldiers on attached oval-bases, arrayed in cinematic handcrafted WWII-diorama or backyard-epic environments. Toy-Story "2nd battalion" / Bucket-O-Soldiers / Saving-Private-Ryan-with-toys DNA. Output wraps with style prefix + suffix.

${blocks.TOY_PHOTOGRAPHY_BLOCK}

${blocks.CINEMATIC_STORY_BLOCK}

${blocks.DRAMATIC_LIGHTING_MAKES_CHEAP_LOOK_EPIC_BLOCK}

${blocks.PATH_MEDIUM_LOCK_BLOCK}

━━━ ARMY-MEN MEDIUM LOCK ━━━
EVERY figure is a classic monochromatic single-pose molded-plastic toy soldier — solid army-green (or olive-drab / tan / grey / sand variant), ~2-inch scale, fixed cast-in-plastic pose, visible vertical mold-seam, plastic-shine where light catches, oval connector-base attached underfoot, helmet / rifle / gear molded as one piece with body. Multiple soldiers in frame — this is a PLATOON world. NEVER articulated, NEVER action-figure, NEVER CGI, NEVER real soldier.

━━━ CAMERA ━━━
${camera}

${framingBlock}

━━━ THE ARMY-MEN SCENE ━━━
${scene}

${blocks.worldStagingSection({ renderMode: sharedDNA.renderMode, scenario, staging: sharedDNA.staging })}
━━━ CAMERA FRAMING — VARY THE ZOOM ━━━
${sharedDNA.camera}

${blocks.storyCastSection(sharedDNA.renderMode)}



━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

${blocks.BLOW_IT_UP_BLOCK}

━━━ COMPOSITION ━━━
Multiple single-pose molded-plastic soldiers mid-action on a handcrafted battlefield diorama or oversized real-world backyard-epic set. Practical cotton-ball smoke / flash-bulb explosion-burst / dramatic spotlight lighting. Visible mold-seam + oval-base on every figure. (Camera + framing direction above sets the lens.)

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
