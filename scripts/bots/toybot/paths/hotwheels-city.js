const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const useLandscape = Math.random() < 0.3;
  const scene = useLandscape
    ? picker.pickWithRecency(pools.HOTWHEELS_LANDSCAPES, 'hotwheels_landscape')
    : picker.pickWithRecency(pools.HOTWHEELS_SCENES, 'hotwheels_scene');
  const lighting = picker.pickWithRecency(pools.HOTWHEELS_LIGHTING, 'hotwheels_lighting');
  const scenario =
    sharedDNA.renderMode === 'world'
      ? picker.pickWithRecency(pools.HOTWHEELS_SCENARIOS, 'hotwheels_scenario')
      : null;
  // story_beat — different HOTWHEELS_SCENARIOS pick than scenario, fires
  // every render regardless of mode. The EVENT the cars are reacting to.
  const storyBeat = picker.pickWithRecency(pools.HOTWHEELS_SCENARIOS, 'hotwheels_story_beat');
  const camera = picker.pickWithRecency(pools.CAMERA_ANGLES, 'camera_angle');

  // Slot-pool DNA: roll 3-6 distinct cars per render to defeat Sonnet's
  // muscle-car / hot-rod training-bias. Forces SPECIFIC car archetypes.
  const castSize = 3 + Math.floor(Math.random() * 4);
  const cast = [];
  for (let i = 0; i < castSize; i++) {
    cast.push(picker.pickWithRecency(pools.HOTWHEELS_CARS, `hotwheels_car_${i}`));
  }

  return `You are a die-cast-car commercial cinematographer writing HOT-WHEELS / MICRO-MACHINES city-and-stunt-track scenes for ToyBot. Tiny 1:64-scale die-cast cars defying physics on insane orange-track loops, kitchen-sink oceans, bookshelf canyons, garage megaramps. Real-world-surface practical sets blown up to epic scale by camera angle. Output wraps with style prefix + suffix.

${blocks.TOY_PHOTOGRAPHY_BLOCK}

${blocks.CINEMATIC_STORY_BLOCK}

${blocks.DRAMATIC_LIGHTING_MAKES_CHEAP_LOOK_EPIC_BLOCK}

${blocks.PATH_MEDIUM_LOCK_BLOCK}

━━━ HOT-WHEELS MEDIUM LOCK ━━━
EVERY vehicle is a 1:64-scale (~3-inch) die-cast metal-and-plastic toy car — chrome accents, glossy paint, oversized hot-rod-style wheels, visible mold-seam underneath, "Hot Wheels"-style flame-decals or racing-stripes (NOT IP-named). Most renders happen on real-world household surfaces — kitchen counter, driveway, bedroom rug, garage floor, picnic blanket, coffee table, patio, bathtub edge, sandbox. Photographed from low macro angle to make 3-inch cars feel like full-size. Speed-blur streaks on tires, dust-puff under wheels, headlight cones cutting through shadow. Orange-plastic Hot-Wheels-style track segments (loops / jump-ramps / corkscrews) are an OPTION when the scene description calls for stunt-track action — most scenes are TRACKLESS, on real surfaces. Use track only when it's the natural read of the scene; otherwise omit it entirely. NEVER real car, NEVER CGI, NEVER illustration, NEVER 1:18-scale collector-die-cast (always TOY scale).

━━━ CAMERA ━━━
${camera}

━━━ COMPOSITION LOCK — NON-NEGOTIABLE SPATIAL ANCHOR ━━━
WIDE DIORAMA FRAME — exactly ${castSize} distinct die-cast toy cars visible simultaneously, spatially separated across the frame. Each occupies its OWN silhouette zone — no overlap, no merging. NO single hero car dominating. ALL ${castSize} cars visible at the same time. (Camera/framing direction above is the spatial-perspective lens for this composition.)

━━━ THE CARS — RENDER THESE EXACT VEHICLES (NON-NEGOTIABLE) ━━━
The cars in this scene MUST be exactly these specific die-cast archetypes — do NOT default to "chrome muscle car" / "hot rod" repeats, render the EXACT body-type, paint, and signature detail of each:
${cast.map((c, i) => `${i + 1}. ${c}`).join('\n')}

━━━ THE HOT-WHEELS SCENE ━━━
${scene}

━━━ STORY BEAT — the ACTION MOMENT this render is showing ━━━
${storyBeat}

The scene above sets the SETTING; this story beat is the SPECIFIC race/chase/stunt event playing out — multiple cars reacting to a shared track/prop/obstacle. Render every car in the cast roll above performing its role in this event.

${blocks.STORY_BEAT_MANDATE_BLOCK}

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
Low macro track-side frame with toy car mid-stunt — loop-de-loop midair, jump arc, tunnel-burst, sharp-curve drift. Speed-blur on wheels, light-streak on chrome. Practical real-world surface (kitchen counter, bookshelf, garage floor) blown up to "epic" scale by extreme low-angle camera. Bright die-cast-car-commercial energy.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
