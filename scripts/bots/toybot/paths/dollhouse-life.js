const pools = require('../pools');
const blocks = require('../shared-blocks');

/**
 * dollhouse-life — broader rebrand of the original calico-scene path.
 * Now rotates across THREE dollhouse-figurine traditions per render:
 *  - Calico-Critter / Sylvanian-Families flocked-animal figurines
 *  - Generic vintage wooden / soft-plastic dollhouse-people figurines
 *  - Modern Lori / Lottie-style dollhouse human figurines
 * Always cozy daily-life, dollhouse-scale interiors, miniature household life.
 */
module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const useLandscape = Math.random() < 0.3;
  const scene = useLandscape
    ? picker.pickWithRecency(pools.DOLLHOUSE_LIFE_LANDSCAPES, 'dollhouse_life_landscape')
    : picker.pickWithRecency(pools.DOLLHOUSE_LIFE_SCENES, 'dollhouse_life_scene');
  const lighting = picker.pickWithRecency(pools.DOLLHOUSE_LIGHTING, 'dollhouse_lighting');
  const scenario =
    sharedDNA.renderMode === 'world'
      ? picker.pickWithRecency(pools.TOY_SCENARIOS, 'toy_scenario')
      : null;
  const camera = picker.pickWithRecency(pools.CAMERA_ANGLES, 'camera_angle');

  // Roll one of three figurine traditions for variety. Each render commits
  // fully to ONE tradition — never mix flocked-animals with human-dolls in
  // the same scene (that would defeat the medium signature).
  const figureTraditionRoll = Math.random();
  let figureTradition;
  if (figureTraditionRoll < 0.5) {
    figureTradition =
      'CALICO-CRITTER / SYLVANIAN-FAMILIES tradition — flocked-velvet-texture small-animal figurines (bunny / bear / fox / cat / mouse / raccoon / hedgehog / squirrel) at ~3-inch scale, painted plastic eyes, tiny cloth outfits (gingham / knit / overalls / bonnet / pinafore)';
  } else if (figureTraditionRoll < 0.8) {
    figureTradition =
      'VINTAGE-DOLLHOUSE-PEOPLE tradition — small wooden / soft-plastic dollhouse-people figurines (mom / dad / kid / baby / grandparent) at ~3-to-5-inch scale, simple painted faces, fabric or molded clothes, posable wooden joints or stiff plastic';
  } else {
    figureTradition =
      'MODERN-LORI / LOTTIE-DOLL tradition — small posable fashion-doll-style human figurines (~6-inch scale), articulated plastic, rooted hair, contemporary outfits (overalls / sweaters / dresses / pajamas), realistic painted faces';
  }

  return `You are a dollhouse-miniature photographer writing COZY DOLLHOUSE-LIFE scenes for ToyBot. Detail-rich daily-life dioramas in fully-appointed miniature household sets. Wholesome, meticulously handcrafted, no edge. Output wraps with style prefix + suffix.

${blocks.TOY_PHOTOGRAPHY_BLOCK}

${blocks.CINEMATIC_STORY_BLOCK}

${blocks.DRAMATIC_LIGHTING_MAKES_CHEAP_LOOK_EPIC_BLOCK}

${blocks.PATH_MEDIUM_LOCK_BLOCK}

━━━ DOLLHOUSE-LIFE FIGURE TRADITION (this render) ━━━
${figureTradition}

━━━ DOLLHOUSE-LIFE MEDIUM LOCK ━━━
Environment is a fully-dressed dollhouse-scale miniature interior — wooden furniture, tiny dishware, mini books, hand-sewn drapes, miniature appliances, scale-accurate household details (tiny lamps, miniature framed art, scale rugs). Cozy daily-life energy — baking, reading, tea, gardening, bedtime, dinner-party. NEVER mix figurine traditions within one scene — commit fully to the rolled tradition above. NEVER real human, NEVER real animal, NEVER CGI.

━━━ CAMERA ━━━
${camera}

━━━ THE DOLLHOUSE SCENE ━━━
${scene}

${blocks.worldStagingSection({ renderMode: sharedDNA.renderMode, scenario, staging: sharedDNA.staging })}
━━━ CAMERA FRAMING — VARY THE ZOOM ━━━
${sharedDNA.camera}

${blocks.storyCastSection(sharedDNA.renderMode)}



━━━ LIGHTING + ATMOSPHERE ━━━
${lighting}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

${blocks.BLOW_IT_UP_BLOCK}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION ━━━
Mid-close dollhouse-diorama frame. Figurine(s) mid-cozy-activity in a fully-appointed miniature room. Warm window-glow, lamp-glow, fireplace-glow per pool palette. Shallow-depth-of-field miniature-photography. Dense scale-accurate household detail. Wholesome storybook warmth.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
