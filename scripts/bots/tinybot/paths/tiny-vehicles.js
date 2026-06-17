const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const vehicle = picker.pickWithRecency(pools.TINY_VEHICLES, 'tiny_vehicle');
  const beat = picker.pickWithRecency(pools.TINY_JOURNEY_BEATS, 'tiny_journey_beat');
  const world = picker.pickWithRecency(pools.TINY_WORLDS, 'tiny_world');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  // Crew gives the journey characters to follow. Usually present (~75%), and
  // sometimes a second distinct hand (~35%) so the scene reads as a little
  // story with a cast, not a parked vehicle. Verb-led pool, plural-friendly.
  const crew = [];
  if (Math.random() < 0.75) {
    crew.push(picker.pickWithRecency(pools.TINY_CREW, 'tiny_crew'));
    if (Math.random() < 0.35) {
      const second = picker.pickWithRecency(pools.TINY_CREW, 'tiny_crew');
      if (second !== crew[0]) crew.push(second);
    }
  }
  const crewBlock = crew.length
    ? `\n━━━ THE CREW (caught mid-action — supporting characters, NOT the hero) ━━━\n${crew.join('\n')}`
    : '';

  return `You are a master model-maker AND storyteller writing CUTE, tongue-in-cheek TINY-VEHICLE scenes for TinyBot. A tiny natural-material vehicle — walnut-shell sailboat, snail-drawn acorn carriage, leaf hot-air balloon, mushroom-cap submarine, twig-and-thread biplane — caught in the middle of a little JOURNEY with something happening. The vehicle is the hero, but it is DOING something in a living tiny world, not posing for a catalog. Storybook-adorable, makes you smile. NEVER creepy: no insect-drawn or insect-bodied vehicles (no beetle, cricket, spider, or ant pulling or forming a vehicle). Output wraps with style prefix + suffix.

${blocks.TILT_SHIFT_MINIATURE_BLOCK}

${blocks.OBSESSIVE_MICRO_DETAIL_BLOCK}

${blocks.CLEVER_CUTE_WHOA_BLOCK}

${blocks.NO_HUMANS_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE HERO VEHICLE ━━━
${vehicle}

━━━ THE STORY MOMENT (what's happening RIGHT NOW — adapt it to the vehicle's element: water / air / land) ━━━
${beat}

━━━ THE LITTLE WORLD (stage the journey here, keeping its foreground / midground / far-distance layers) ━━━
${world}
${crewBlock}

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
The vehicle is the HERO, built from REAL natural materials — walnut shells, acorn caps, leaves, twigs, dandelion seeds, mushroom caps, flower petals, bird-feathers, snail-shells, silk thread — with master-modelmaker craft and every fastening visible (thread-stitching on a leaf-sail, twig-pegs in walnut planks, acorn-cap rivets). But it is MID-JOURNEY in a lived-in tiny world — a story is playing out around it. Tilt-shift shallow DOF makes the natural world feel storybook.

━━━ COMPOSITION — A CANDID STORYBOOK MOMENT, NOT A CATALOG SHOT ━━━
Compose a STILL FROM A TINY ADVENTURE: the eye reads the story in 2 seconds — where the craft is going, who's aboard, what's happening. Something is in MOTION or mid-event; the crew are mid-action. Build MULTIPLE DEPTH LAYERS: the hero vehicle in the near-to-mid ground (NOT centered, NOT filling the whole frame), the little world around and behind it (docks, cottages, market, other tiny craft), and a far distance that fades into atmosphere. Leave room around the vehicle for the world to breathe. ABSOLUTELY NOT a product/turntable shot, NOT the vehicle parked alone on a bare surface, NOT a centered hero portrait. Tilt-shift shallow DOF, obsessive natural-materials detail on the hero. Palette dictated by LIGHTING + WEATHER + VIBE above.

Output ONLY the raw 70-100 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
