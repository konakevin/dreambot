const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const vehicle = picker.pickWithRecency(pools.TINY_VEHICLES, 'tiny_vehicle');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');
  const includeCreature = Math.random() < 0.5;
  const creature = includeCreature
    ? picker.pickWithRecency(pools.TINY_CREATURES, 'tiny_creature')
    : null;

  return `You are a master model-maker writing CUTE, tongue-in-cheek TINY-VEHICLE scenes for TinyBot. Delightfully charming, storybook-adorable miniature vehicles built from natural materials — walnut-shell sailboats with leaf sails, snail-drawn acorn-cap carriages, dandelion-seed parachutes, leaf hot-air balloons with twig baskets, mushroom-cap submarines, flower-petal balloons, paper-bird kites, twig-and-thread biplanes. The hero is the VEHICLE — beautifully crafted from real natural materials at hand-palm scale, and it should make you smile. NEVER creepy: no insect-drawn or insect-bodied vehicles (no beetle, cricket, spider, or ant pulling or forming a vehicle). Output wraps with style prefix + suffix.

${blocks.TILT_SHIFT_MINIATURE_BLOCK}

${blocks.OBSESSIVE_MICRO_DETAIL_BLOCK}

${blocks.CLEVER_CUTE_WHOA_BLOCK}

${blocks.NO_HUMANS_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE TINY VEHICLE ━━━
${vehicle}
${creature ? `\n━━━ OPTIONAL TINY PILOT/PASSENGER ━━━\n${creature}` : ''}

${blocks.varietyAxesSection(sharedDNA)}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

${blocks.BLOW_IT_UP_BLOCK}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ TINY-VEHICLES DNA ━━━
The vehicle is the HERO. Built from REAL natural materials — walnut shells, acorn caps, leaves, twigs, dandelion seeds, mushroom caps, flower petals, bird-feathers, snail-shells, silk thread — assembled with master-modelmaker craft into a working tiny conveyance. Every fastening visible: thread-stitching on a leaf-sail, twig-pegs in walnut planks, acorn-cap rivets. The vehicle SITS in a real environment at correct scale: a walnut boat on a teacup-sized puddle, a leaf balloon over real grass-blades, an acorn carriage on a moss-path. Tilt-shift shallow DOF makes the natural world feel storybook. Warm sunlight or magical-hour glow on craft surfaces.

━━━ COMPOSITION ━━━
Mid-close or macro-close on the vehicle filling the frame. The vehicle is rendered with obsessive natural-materials detail. Environment behind it shows scale (giant grass blades, towering mushroom, vast leaf, looming pebble). Tilt-shift shallow DOF. Optional tiny creature pilot/passenger. Palette dictated by LIGHTING + WEATHER + VIBE blocks above. Hero-shot the vehicle — vehicle catalog energy, but make it magical.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
