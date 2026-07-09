/**
 * ACTIVE solo poses — biome-tagged action poses for single-cast face-swap
 * dreams (Phase B, ACTION_POSE_EXPANSION_PLAN.md, 2026-07-09).
 *
 * Solo twin of dual_actions_active.ts. Solo swaps are the EASIER case (one
 * big face, no split, the solo guard probes it), so entries push motion while
 * keeping the one face clearly toward the camera. Every entry passes the
 * active-pool lint (scripts/lib/posePoolLint.js — the scanner's *_active.ts
 * mode enforces it); reach-back and particle-at-face language stay banned.
 *
 * STRICTLY ADDITIVE: CANDID_ACTIONS / PORTRAIT_ACTIONS untouched; a miss here
 * falls back to them. Gated by engine_config.single_action_pose_pct (0).
 */

export interface ActiveSingleAction {
  text: string;
  /** biomeAxes.ts keys this pose fits. Omit = universal. */
  biomes?: string[];
  /** Roll weight (default 1). */
  weight?: number;
}

const COASTAL = ['tropical_coastal', 'temperate_coastal', 'mediterranean_coastal'];
const SNOW = ['alpine_mountain', 'arctic_polar'];

export const SINGLE_ACTIONS_ACTIVE: ActiveSingleAction[] = [
  // ── water / coastal ──────────────────────────────────────────────────────
  {
    text: 'carving down the face of a peeling wave on a surfboard, knees bent and arms out, face clearly toward the camera',
    biomes: COASTAL,
  },
  {
    text: 'standing tall on a paddleboard mid-stroke across glassy water, face turned toward the camera',
    biomes: COASTAL,
  },
  {
    text: 'sprinting through ankle-deep surf with spray kicking up behind, grinning at the camera',
    biomes: COASTAL,
  },
  {
    text: 'leaping off a small dune into soft sand, arms flung wide mid-air, face toward the camera',
    biomes: COASTAL,
  },
  {
    text: 'kicking a spray of seawater toward the lens with one foot, laughing toward the camera',
    biomes: COASTAL,
  },
  // ── snow ─────────────────────────────────────────────────────────────────
  {
    text: 'carving through fresh powder on skis with snow arcing off the turn, face toward the camera',
    biomes: SNOW,
  },
  {
    text: 'mid-jump on a snowboard grabbing the board edge, face clearly toward the camera',
    biomes: SNOW,
  },
  {
    text: 'flying downhill on a sled with arms up, mid-laugh looking at the camera',
    biomes: SNOW,
  },
  {
    text: 'gliding across an outdoor ice rink on one skate with arms out wide, face toward the camera',
    biomes: [...SNOW, 'urban_city'],
  },
  {
    text: 'mid-throw of a snowball toward off-camera, wind-up arm high, grinning at the camera',
    biomes: SNOW,
  },
  // ── river / lake / trail ─────────────────────────────────────────────────
  {
    text: 'paddling a kayak through gentle whitewater, paddle mid-stroke and splash frozen, face toward the camera',
    biomes: ['fjord_coastal', 'wetland_jungle', 'temperate_forest', 'alpine_mountain'],
  },
  {
    text: 'skipping a stone across a still lake at dusk, caught mid-release, face turned toward the camera',
    biomes: ['temperate_forest', 'alpine_mountain', 'fjord_coastal'],
  },
  {
    text: 'trail-running along a ridgeline path at full stride, arms pumping, face toward the camera',
    biomes: ['alpine_mountain', 'temperate_forest', 'red_rock_canyon', 'grassland_savanna'],
  },
  {
    text: 'hopping between stepping stones across a shallow creek, mid-step with arms out, grinning toward the camera',
    biomes: ['temperate_forest', 'alpine_mountain', 'wetland_jungle'],
  },
  {
    text: 'riding a zipline through the canopy with legs kicked up, mid-whoop with face toward the camera',
    biomes: ['wetland_jungle', 'temperate_forest'],
  },
  {
    text: 'riding a horse at an easy canter across open country, one hand on the reins, face toward the camera',
    biomes: ['grassland_savanna', 'temperate_forest', 'desert_arid'],
  },
  // ── urban ────────────────────────────────────────────────────────────────
  {
    text: 'riding a beach cruiser bicycle no-handed down a wide lane, arms out, face toward the camera',
    biomes: ['urban_city', ...COASTAL],
  },
  {
    text: 'mid-ollie on a skateboard over a painted curb, arms out for balance, face clearly toward the camera',
    biomes: ['urban_city'],
  },
  {
    text: 'rollerblading through a sunny plaza mid-stride with arms swinging, laughing toward the camera',
    biomes: ['urban_city'],
  },
  {
    text: 'mid jump shot on an outdoor basketball court, ball at the top of the release, face toward the camera',
    biomes: ['urban_city'],
  },
  {
    text: 'in the front row of a rollercoaster mid-drop, hands thrown high and hair flying, face toward the camera',
    biomes: ['urban_city'],
  },
  {
    text: 'spinning mid-dance under string lights with one arm raised, jacket flaring, face toward the camera',
    biomes: ['urban_city', 'interior_intimate', 'mediterranean_coastal'],
  },
  // ── interior ─────────────────────────────────────────────────────────────
  {
    text: 'tossing pizza dough high in a warm kitchen, caught mid-spin above flour-dusted hands, laughing toward the camera',
    biomes: ['interior_intimate'],
  },
  {
    text: 'belting a chorus into a microphone on a small karaoke stage, free arm flung wide, face toward the camera',
    biomes: ['interior_intimate', 'urban_city'],
  },
  // ── universal ────────────────────────────────────────────────────────────
  {
    text: 'caught at the top of a mid-air jump with arms thrown up in celebration, face toward the camera',
  },
  {
    text: 'mid-spin with arms flung wide and head tilted back in a laugh, face still toward the camera',
  },
  {
    text: 'sprinting toward the lens at full stride, arms pumping, face clearly toward the camera',
  },

  // ── production scale-up 2026-07-09 (generate-active-pools.js, lint-green) ──
  {
    text: 'Surfer crouching low on board, arms spread wide for balance, catching a wave, grinning at the camera',
    biomes: ['tropical_coastal', 'temperate_coastal', 'mediterranean_coastal'],
  },
  {
    text: 'Paddleboarder mid-stroke, paddle lifted high, torso twisted forward, core engaged, face toward the camera',
    biomes: ['tropical_coastal', 'temperate_coastal', 'mediterranean_coastal'],
  },
  {
    text: 'Person leaping over a shallow breaking wave, knees tucked up, arms flung outward joyfully, laughing toward the camera',
    biomes: ['tropical_coastal', 'temperate_coastal', 'mediterranean_coastal'],
  },
  {
    text: 'Beach sprinter in full stride, arms pumping, one foot off the sand, leaning forward with intensity, grinning at the camera',
    biomes: ['tropical_coastal', 'temperate_coastal', 'mediterranean_coastal'],
  },
  {
    text: 'Boogie boarder riding a wave on their belly, chest lifted, chin up, arms gripping board edges, laughing toward the camera',
    biomes: ['tropical_coastal', 'temperate_coastal', 'mediterranean_coastal'],
  },
  {
    text: 'Surfer popping up from a crouch to standing, knees bent, arms outstretched for stability, face toward the camera',
    biomes: ['tropical_coastal', 'temperate_coastal', 'mediterranean_coastal'],
  },
  {
    text: 'Beach volleyball player mid-serve, one arm extended overhead at peak swing, body arched back slightly, grinning at the camera',
    biomes: ['tropical_coastal', 'temperate_coastal', 'mediterranean_coastal'],
  },
  {
    text: 'Paddleboarder in a low warrior squat stance, paddle planted in water for balance, arms flexed, laughing toward the camera',
    biomes: ['tropical_coastal', 'temperate_coastal', 'mediterranean_coastal'],
  },
  {
    text: 'Gripping jet ski handlebars mid-turn, body leaning sharply sideways, hair whipping in the wind, grinning at the camera',
    biomes: ['tropical_coastal', 'temperate_coastal', 'mediterranean_coastal', 'fjord_coastal'],
  },
  {
    text: 'Standing at the bow of a motorboat cutting through water, arms spread wide like wings, laughing toward the camera',
    biomes: ['tropical_coastal', 'temperate_coastal', 'mediterranean_coastal', 'fjord_coastal'],
  },
  {
    text: 'Sitting astride a banana boat mid-bounce, both hands raised triumphantly overhead, mouth open in delight, laughing toward the camera',
    biomes: ['tropical_coastal', 'temperate_coastal', 'mediterranean_coastal', 'fjord_coastal'],
  },
  {
    text: 'Kneeling on a jet ski deck, one fist pumping the air mid-acceleration, body braced against the speed, grinning at the camera',
    biomes: ['tropical_coastal', 'temperate_coastal', 'mediterranean_coastal', 'fjord_coastal'],
  },
  {
    text: 'Perched on the nose of a small sailboat heeling hard, legs dangling over churning water, torso twisted, face toward the camera',
    biomes: ['tropical_coastal', 'temperate_coastal', 'mediterranean_coastal', 'fjord_coastal'],
  },
  {
    text: 'Riding a banana boat leaning dramatically to one side, arms outstretched for balance, wind-blown hair, grinning at the camera',
    biomes: ['tropical_coastal', 'temperate_coastal', 'mediterranean_coastal', 'fjord_coastal'],
  },
  {
    text: 'Skier carving a sharp downhill turn, arms outstretched wide for balance, upper body twisting toward viewer, grinning at the camera',
    biomes: ['alpine_mountain', 'arctic_polar'],
  },
  {
    text: 'Snowboarder mid-jump off a small kicker, knees tucked up, both arms raised in triumph, laughing toward the camera',
    biomes: ['alpine_mountain', 'arctic_polar'],
  },
  {
    text: 'Person sledding downhill feet-first, leaning back on the sled, gripping sides tightly, mouth open in excitement, face toward the camera',
    biomes: ['alpine_mountain', 'arctic_polar'],
  },
  {
    text: 'Ice skater gliding on one leg in an arabesque, free leg extended behind, arms spread gracefully, grinning at the camera',
    biomes: ['alpine_mountain', 'arctic_polar'],
  },
  {
    text: 'Snowshoer mid-stride up a gentle slope, trekking poles planted forward, torso leaning into the climb, laughing toward the camera',
    biomes: ['alpine_mountain', 'arctic_polar'],
  },
  {
    text: 'Skier landing a small jump, knees bent to absorb impact, poles swinging outward, chest open and facing forward, grinning at the camera',
    biomes: ['alpine_mountain', 'arctic_polar'],
  },
  {
    text: 'Person winding up to hurl a snowball, non-throwing arm extended for aim, body twisted at the waist, face toward the camera',
    biomes: ['alpine_mountain', 'arctic_polar'],
  },
  {
    text: 'Snowboarder crouching low into a speeding carve, trailing hand skimming the snow beside them, head turned upward, laughing toward the camera',
    biomes: ['alpine_mountain', 'arctic_polar'],
  },
  {
    text: 'Paddling hard through a kayak turn, torso twisted forward, paddle blade deep in water, grinning at the camera',
    biomes: ['fjord_coastal', 'wetland_jungle', 'temperate_forest', 'alpine_mountain'],
  },
  {
    text: 'Mid-air leap off a wooden dock, arms thrown wide, feet kicking up behind, laughing toward the camera',
    biomes: ['fjord_coastal', 'wetland_jungle', 'temperate_forest', 'alpine_mountain'],
  },
  {
    text: 'Swinging out on a rope over water, body arched back, legs tucked high, face toward the camera',
    biomes: ['fjord_coastal', 'wetland_jungle', 'temperate_forest', 'alpine_mountain'],
  },
  {
    text: 'Balancing mid-stride across stepping stones, arms out for balance, one foot lifted, grinning at the camera',
    biomes: ['fjord_coastal', 'wetland_jungle', 'temperate_forest', 'alpine_mountain'],
  },
  {
    text: 'Releasing a rope swing at peak height above the water, arms spread open, laughing toward the camera',
    biomes: ['fjord_coastal', 'wetland_jungle', 'temperate_forest', 'alpine_mountain'],
  },
  {
    text: 'Digging a canoe paddle into still water on a powerful forward stroke, shoulders driving, face toward the camera',
    biomes: ['fjord_coastal', 'wetland_jungle', 'temperate_forest', 'alpine_mountain'],
  },
  {
    text: 'Leaning forward on a bicycle mid-sprint, arms pumping the handlebars, torso low, legs driving hard, grinning at the camera',
    biomes: ['urban_city', 'tropical_coastal', 'temperate_coastal', 'mediterranean_coastal'],
  },
  {
    text: 'Launching off a skateboard ramp with arms spread wide for balance, body airborne and slightly twisted, face toward the camera',
    biomes: ['urban_city', 'tropical_coastal', 'temperate_coastal', 'mediterranean_coastal'],
  },
  {
    text: 'Rollerblading at full speed with one leg extended back, arms swinging forward dynamically, hair blown back, laughing toward the camera',
    biomes: ['urban_city', 'tropical_coastal', 'temperate_coastal', 'mediterranean_coastal'],
  },
  {
    text: 'Dribbling a basketball low between the knees in a quick crossover, body crouched and explosive, grinning at the camera',
    biomes: ['urban_city', 'tropical_coastal', 'temperate_coastal', 'mediterranean_coastal'],
  },
  {
    text: 'Sprinting up a wide concrete staircase two steps at a time, arms driving hard, mid-stride with one foot raised, face toward the camera',
    biomes: ['urban_city', 'tropical_coastal', 'temperate_coastal', 'mediterranean_coastal'],
  },
  {
    text: 'Doing a pull-up on a street workout bar at peak contraction, chin above the bar, core tight, shoulders wide, grinning at the camera',
    biomes: ['urban_city', 'tropical_coastal', 'temperate_coastal', 'mediterranean_coastal'],
  },
  {
    text: 'Riding a kick scooter with one leg fully extended mid-push, body leaning forward with momentum, laughing toward the camera',
    biomes: ['urban_city', 'tropical_coastal', 'temperate_coastal', 'mediterranean_coastal'],
  },
  {
    text: 'Performing a street workout push-up clap mid-air, hands lifted off the ground, chest low, explosive upward burst, face toward the camera',
    biomes: ['urban_city', 'tropical_coastal', 'temperate_coastal', 'mediterranean_coastal'],
  },
  {
    text: 'Spinning outward under a raised arm, skirt flaring wide, one hand extended overhead, laughing toward the camera',
    biomes: ['urban_city', 'interior_intimate', 'mediterranean_coastal'],
  },
  {
    text: 'Mid-salsa turn, hips rotating sharply, arms sweeping gracefully at shoulder height, grinning at the camera',
    biomes: ['urban_city', 'interior_intimate', 'mediterranean_coastal'],
  },
  {
    text: 'Executing a crisp disco point with one arm high, knees bent in a funky dip, face toward the camera',
    biomes: ['urban_city', 'interior_intimate', 'mediterranean_coastal'],
  },
  {
    text: 'Twirling with both arms lifted in a wide arc, hair fanning outward from momentum, laughing toward the camera',
    biomes: ['urban_city', 'interior_intimate', 'mediterranean_coastal'],
  },
  {
    text: 'Stepping into a swing spin exit, chest open, one leg kicking back freely, grinning at the camera',
    biomes: ['urban_city', 'interior_intimate', 'mediterranean_coastal'],
  },
  {
    text: 'Sliding into a classic Saturday Night Fever pose, hips shifted, index finger jabbing upward, face toward the camera',
    biomes: ['urban_city', 'interior_intimate', 'mediterranean_coastal'],
  },
  {
    text: 'Stirring a steaming pot with one arm raised triumphantly holding a wooden spoon overhead, grinning at the camera',
    biomes: ['interior_intimate'],
  },
  {
    text: 'Belting into a karaoke microphone with one fist pumping the air and knees slightly bent mid-song, laughing toward the camera',
    biomes: ['interior_intimate'],
  },
  {
    text: 'Crawling out of a blanket pillow fort entrance with arms spread wide in a welcoming gesture, grinning at the camera',
    biomes: ['interior_intimate'],
  },
  {
    text: 'Flipping a pancake mid-air above a skillet with eyes wide and one hand outstretched in excitement, face toward the camera',
    biomes: ['interior_intimate'],
  },
  {
    text: 'Slamming a winning board game piece onto the table with both arms raised in a victory cheer, laughing toward the camera',
    biomes: ['interior_intimate'],
  },
  {
    text: "Holding a paintbrush dramatically like a conductor's baton while leaning back mid-stroke on a canvas, grinning at the camera",
    biomes: ['interior_intimate'],
  },
  {
    text: 'Leaning forward in the saddle at a canter, reins loose, one hand raised triumphantly, grinning at the camera',
    biomes: ['grassland_savanna', 'temperate_forest', 'desert_arid'],
  },
  {
    text: 'Mid-stride trail running uphill, arms pumping, chest open, slight lean forward, laughing toward the camera',
    biomes: ['grassland_savanna', 'temperate_forest', 'desert_arid'],
  },
  {
    text: 'Airborne leaping over a mossy creek rock, arms outstretched for balance, face toward the camera',
    biomes: ['grassland_savanna', 'temperate_forest', 'desert_arid'],
  },
  {
    text: 'Galloping bareback across open meadow, hair streaming back, both hands gripping mane, grinning at the camera',
    biomes: ['grassland_savanna', 'temperate_forest', 'desert_arid'],
  },
  {
    text: 'Sprinting full speed through tall meadow grass, knees high, arms driving, laughing toward the camera',
    biomes: ['grassland_savanna', 'temperate_forest', 'desert_arid'],
  },
  {
    text: 'Bounding stone to stone across a shallow creek, one foot mid-air, arms wide, face toward the camera',
    biomes: ['grassland_savanna', 'temperate_forest', 'desert_arid'],
  },
  {
    text: 'Leaping straight up with both arms punching overhead, knees bent mid-air, torso twisting slightly, grinning at the camera',
  },
  {
    text: 'Spinning on one foot with arms flung wide, hair fanning out, chest open and lifted, face toward the camera',
  },
  {
    text: 'Mid-cartwheel with legs split perfectly overhead, one hand pressing the ground, body arched powerfully, laughing toward the camera',
  },
  {
    text: 'Jumping sideways with one knee tucked high and fist raised in triumph, shoulders back, grinning at the camera',
  },
  {
    text: 'Both feet off the ground in a celebratory heel-click, arms clapping overhead, back straight, face toward the camera',
  },
  {
    text: 'Leaping forward with one leg extended ahead and arms spread wide like wings, chin lifted, laughing toward the camera',
  },
];

/** Weighted roll for the given resolved biome; untagged = universal. */
/** Biome-eligible entries — exported for shuffle-bag filtering upstream. */
export function eligibleSingleActionsActive(biomeKey: string | null): ActiveSingleAction[] {
  return SINGLE_ACTIONS_ACTIVE.filter(
    (e) => !e.biomes || (biomeKey !== null && e.biomes.includes(biomeKey))
  );
}

export function pickActiveSingleAction(
  biomeKey: string | null,
  candidates?: ActiveSingleAction[]
): string | null {
  const eligible = candidates ?? eligibleSingleActionsActive(biomeKey);
  if (eligible.length === 0) return null;
  const total = eligible.reduce((s, e) => s + (e.weight ?? 1), 0);
  let roll = Math.random() * total;
  for (const e of eligible) {
    roll -= e.weight ?? 1;
    if (roll <= 0) return e.text;
  }
  return eligible[eligible.length - 1].text;
}
