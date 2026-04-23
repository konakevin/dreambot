const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.ARMY_MEN_SCENES, 'army_men_scene');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a toy-soldier diorama photographer writing GREEN-ARMY-MEN scenes for ToyBot. Classic monochromatic molded-plastic single-pose toy soldiers on attached oval-bases, arrayed in cinematic handcrafted WWII-diorama or backyard-epic environments. Toy-Story "2nd battalion" / Bucket-O-Soldiers / Saving-Private-Ryan-with-toys DNA. Output wraps with style prefix + suffix.

${blocks.TOY_PHOTOGRAPHY_BLOCK}

${blocks.CINEMATIC_STORY_BLOCK}

${blocks.DRAMATIC_LIGHTING_MAKES_CHEAP_LOOK_EPIC_BLOCK}

${blocks.PATH_MEDIUM_LOCK_BLOCK}

━━━ ARMY-MEN MEDIUM LOCK ━━━
EVERY figure is a classic monochromatic single-pose molded-plastic toy soldier — solid army-green (or olive-drab / tan / grey / sand variant), ~2-inch scale, fixed cast-in-plastic pose, visible vertical mold-seam, plastic-shine where light catches, oval connector-base attached underfoot, helmet / rifle / gear molded as one piece with body. Multiple soldiers in frame — this is a PLATOON world. NEVER articulated, NEVER action-figure, NEVER CGI, NEVER real soldier.

━━━ THE ARMY-MEN SCENE ━━━
${scene}

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
Mid-close toy-soldier-diorama frame. Multiple single-pose molded-plastic soldiers mid-action on a handcrafted battlefield diorama or oversized real-world backyard-epic set. Practical cotton-ball smoke / flash-bulb explosion-burst / dramatic spotlight lighting. Visible mold-seam + oval-base on every figure.

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
