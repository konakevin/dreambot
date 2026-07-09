/**
 * ACTIVE couple poses — biome-tagged action poses (Phase A,
 * ACTION_POSE_EXPANSION_PLAN.md, 2026-07-09).
 *
 * Every family here passed the 5-rep production-leg depth QA (2026-07-08,
 * ~/Desktop/action-depth-qa) and every ENTRY passes the active-pool lint
 * (scripts/lib/posePoolLint.js): both faces explicitly toward the camera,
 * no reach-back/pull-up poses, no particle clouds at face height, no
 * unmitigated couple-too-close phrasing. The proximity scanner applies the
 * strict lint to this file automatically (filename matches *_active.ts).
 *
 * biomes: which resolved location biomes (biomeAxes.ts keys) an entry fits —
 * jetski belongs in hawaii, never paris. OMITTED biomes = universal (any
 * location). Selection: pickActiveDualAction(biomeKey) — filter, weighted
 * roll; gated upstream by engine_config.dual_action_pose_pct (default 0).
 *
 * STRICTLY ADDITIVE: the classic pools (dual_actions.ts) are untouched; a
 * miss here falls back to them.
 */

export interface ActiveDualAction {
  text: string;
  /** biomeAxes.ts keys this pose fits. Omit = universal. */
  biomes?: string[];
  /** Roll weight (default 1). */
  weight?: number;
}

const COASTAL = ['tropical_coastal', 'temperate_coastal', 'mediterranean_coastal'];
const COASTAL_ALL = [...COASTAL, 'fjord_coastal'];
const SNOW = ['alpine_mountain', 'arctic_polar'];
const RIVER = ['fjord_coastal', 'wetland_jungle', 'temperate_forest', 'alpine_mountain'];

export const DUAL_ACTIONS_ACTIVE: ActiveDualAction[] = [
  // ── water / coastal ──────────────────────────────────────────────────────
  {
    text: 'each riding their own surfboard side by side down the same peeling wave, knees bent mid-carve, both faces clearly visible and turned toward the camera',
    biomes: COASTAL,
  },
  {
    text: 'racing across open water on a jetski, one driving and the other seated behind with hands at the driver’s waist, both grinning at the camera through the spray',
    biomes: COASTAL_ALL,
  },
  {
    text: 'standing tall on separate paddleboards a stroke apart on glassy water, paddles mid-pull, both faces toward the camera',
    biomes: COASTAL,
  },
  {
    text: 'waist-deep in the breaking surf splashing water toward each other from a step apart, both laughing toward the camera',
    biomes: COASTAL,
  },
  {
    text: 'sprinting side by side through ankle-deep surf with spray kicking up behind them, both faces toward the camera',
    biomes: COASTAL,
  },
  // ── snow ─────────────────────────────────────────────────────────────────
  {
    text: 'skiing side by side through fresh powder with a ski-length between them, snow arcing off their turns, both faces toward the camera',
    biomes: SNOW,
  },
  {
    text: 'racing separate sleds down a bright slope a sled-width apart, both mid-laugh looking toward the camera',
    biomes: SNOW,
  },
  {
    text: 'gliding across an outdoor ice rink holding hands at full arm’s length, outside skates lifted mid-stride, both faces toward the camera',
    biomes: [...SNOW, 'urban_city'],
  },
  {
    text: 'mid snowball fight from several paces apart, one arm cocked to throw and the other ducking sideways, both grinning at the camera',
    biomes: SNOW,
  },
  // ── river / lake ─────────────────────────────────────────────────────────
  {
    text: 'paddling a tandem kayak through gentle rapids, paddles mid-stroke on opposite sides, both faces toward the camera',
    biomes: RIVER,
  },
  {
    text: 'paddling a canoe across a mirror-still lake at dawn, seated bow and stern, both faces turned toward the camera',
    biomes: ['temperate_forest', 'alpine_mountain', 'fjord_coastal'],
  },
  // ── urban / promenade ────────────────────────────────────────────────────
  {
    text: 'riding beach cruiser bicycles side by side with a bike-width between them, mid-pedal with hair in the wind, both faces toward the camera',
    biomes: ['urban_city', ...COASTAL],
  },
  {
    text: 'riding kick scooters down a wide promenade a lane apart, one foot mid-push, both smiling at the camera',
    biomes: ['urban_city', 'mediterranean_coastal'],
  },
  {
    text: 'in the front row of a rollercoaster mid-drop, hands thrown high and hair flying, both faces toward the camera',
    biomes: ['urban_city'],
  },
  {
    text: 'rollerblading side by side through a sunny park with a stride between them, arms out for balance, both laughing toward the camera',
    biomes: ['urban_city'],
  },
  {
    text: 'mid jump shot on an outdoor basketball court, one releasing the ball and the other leaping a step away, both faces toward the camera',
    biomes: ['urban_city'],
  },
  // ── dance ────────────────────────────────────────────────────────────────
  {
    text: 'mid swing-dance spin under string lights, connected only at one outstretched hand at full arm’s length, both faces turned toward the camera',
    biomes: ['urban_city', 'interior_intimate', 'mediterranean_coastal'],
  },
  {
    text: 'salsa dancing a step apart on a rooftop at dusk, hands linked at arm’s length mid-turn, both faces toward the camera',
    biomes: ['urban_city', 'mediterranean_coastal'],
  },
  // ── interior ─────────────────────────────────────────────────────────────
  {
    text: 'tossing pizza dough high in a warm kitchen, one mid-throw and the other reaching up from a counter-width apart, both laughing toward the camera',
    biomes: ['interior_intimate'],
  },
  {
    text: 'dancing in a warm kitchen mid-song, one twirling under the other’s raised hand at full arm’s length, both faces toward the camera',
    biomes: ['interior_intimate'],
  },
  {
    text: 'singing into separate microphones on a small karaoke stage, mid-chorus with arms flung wide, both faces toward the camera',
    biomes: ['interior_intimate', 'urban_city'],
  },
  // ── trail / grassland / jungle ───────────────────────────────────────────
  {
    text: 'riding horses side by side at an easy walk across open country, a horse-width apart, both faces toward the camera',
    biomes: ['grassland_savanna', 'temperate_forest', 'desert_arid'],
  },
  {
    text: 'riding parallel ziplines through the canopy a line apart, legs kicked up mid-flight, both mid-whoop with faces toward the camera',
    biomes: ['wetland_jungle', 'temperate_forest'],
  },
  {
    text: 'hopping between stepping stones across a shallow creek, one stone apart mid-step with arms out, both grinning toward the camera',
    biomes: ['temperate_forest', 'alpine_mountain', 'wetland_jungle'],
  },
  // ── universal (any location) ─────────────────────────────────────────────
  {
    text: 'one twirling the other under a raised arm at full arm’s length, jackets and hair flaring with the spin, both faces toward the camera',
  },
  {
    text: 'both caught at the top of a mid-air jump a body-width apart, arms thrown up in celebration, both faces toward the camera',
  },
  {
    text: 'leaping into a mid-air double high five with arms fully extended between them, both faces toward the camera',
  },

  // ── production scale-up 2026-07-09 (generate-active-pools.js, lint-green) ──
  {
    text: 'Each paddling their own paddleboard side by side with a gap between boards, torsos twisted forward, both laughing toward the camera',
    biomes: ['tropical_coastal', 'temperate_coastal', 'mediterranean_coastal'],
  },
  {
    text: 'Both jumping over an incoming wave side by side with a gap between them, knees tucked high, both faces turned laughing at the camera',
    biomes: ['tropical_coastal', 'temperate_coastal', 'mediterranean_coastal'],
  },
  {
    text: 'Both emerging from a shallow wave run a lane apart, arms raised in triumph, water streaming off them, both faces fully toward the camera',
    biomes: ['tropical_coastal', 'temperate_coastal', 'mediterranean_coastal'],
  },
  {
    text: 'Each paddleboarding with one knee raised in a balance challenge side by side with a clear gap, arms wide, both faces turned laughing at the camera',
    biomes: ['tropical_coastal', 'temperate_coastal', 'mediterranean_coastal'],
  },
  {
    text: 'Both riders leaning forward on separate jet skis a lane apart, throttling hard, both faces turned laughing toward the camera mid-acceleration',
    biomes: ['tropical_coastal', 'temperate_coastal', 'mediterranean_coastal', 'fjord_coastal'],
  },
  {
    text: 'Each person gripping their own jet ski handlebars a lane apart, bodies low and crouched in a sharp carving turn, both faces toward the camera',
    biomes: ['tropical_coastal', 'temperate_coastal', 'mediterranean_coastal', 'fjord_coastal'],
  },
  {
    text: 'Two riders on individual jet skis a lane apart mid-jump over a wake, bodies lifted off seats, both faces open-mouthed laughing at the camera',
    biomes: ['tropical_coastal', 'temperate_coastal', 'mediterranean_coastal', 'fjord_coastal'],
  },
  {
    text: 'Both people kneeling side by side with a gap on a banana boat, torsos twisting in opposite directions mid-wobble, both faces toward the camera with huge grins',
    biomes: ['tropical_coastal', 'temperate_coastal', 'mediterranean_coastal', 'fjord_coastal'],
  },
  {
    text: 'Both on snowboards carving parallel arcs with a clear gap between them, knees bent deep, both laughing toward the camera',
    biomes: ['alpine_mountain', 'arctic_polar'],
  },
  {
    text: 'Both mid-sledding run on separate sleds side by side with a gap, leaning forward for speed, both faces turned toward the camera',
    biomes: ['alpine_mountain', 'arctic_polar'],
  },
  {
    text: 'Both ice skating forward a lane apart, one leg lifted mid-glide, arms out for balance, both grinning at the camera',
    biomes: ['alpine_mountain', 'arctic_polar'],
  },
  {
    text: 'Both snowshoeing uphill side by side with a gap, lifting exaggerated high steps, both laughing toward the camera',
    biomes: ['alpine_mountain', 'arctic_polar'],
  },
  {
    text: 'Both on separate sleds flying over a bump, bodies slightly lifted off the seats, both cheering with faces toward the camera',
    biomes: ['alpine_mountain', 'arctic_polar'],
  },
  {
    text: 'Both mid-leap off a wooden dock a step apart, arms spread, legs tucked, both laughing toward the camera',
    biomes: ['fjord_coastal', 'wetland_jungle', 'temperate_forest', 'alpine_mountain'],
  },
  {
    text: 'Both gripping a rope swing a beat apart in their arcs, bodies swinging outward over the water, both laughing toward the camera',
    biomes: ['fjord_coastal', 'wetland_jungle', 'temperate_forest', 'alpine_mountain'],
  },
  {
    text: 'Both jumping from separate dock sections a lane apart, bodies airborne mid-tuck, both faces turned laughing at the camera',
    biomes: ['fjord_coastal', 'wetland_jungle', 'temperate_forest', 'alpine_mountain'],
  },
  {
    text: 'Both mid-hop across wet stepping stones a stride apart, one foot lifted high, arms flailing playfully, both faces toward the camera',
    biomes: ['fjord_coastal', 'wetland_jungle', 'temperate_forest', 'alpine_mountain'],
  },
  {
    text: 'Both releasing a rope swing at the same moment a body-length apart, soaring outward above the water, both grinning at the camera',
    biomes: ['fjord_coastal', 'wetland_jungle', 'temperate_forest', 'alpine_mountain'],
  },
  {
    text: 'Both cycling hard side by side with a full bike-width gap between them, legs pumping, torsos leaning forward, both grinning at the camera',
    biomes: ['urban_city', 'tropical_coastal', 'temperate_coastal', 'mediterranean_coastal'],
  },
  {
    text: 'Both rollerblading in parallel a lane apart, arms swinging wide for balance, knees bent deep mid-stride, both faces turned laughing toward the camera',
    biomes: ['urban_city', 'tropical_coastal', 'temperate_coastal', 'mediterranean_coastal'],
  },
  {
    text: 'Both mid-jump on a street basketball court a step apart, arms raised toward the basket at different angles, both shouting and laughing at the camera',
    biomes: ['urban_city', 'tropical_coastal', 'temperate_coastal', 'mediterranean_coastal'],
  },
  {
    text: 'Both performing street push-ups on parallel low ledges with a clear gap between them, caught mid-descent, chests hovering above the surface, both smiling at the camera',
    biomes: ['urban_city', 'tropical_coastal', 'temperate_coastal', 'mediterranean_coastal'],
  },
  {
    text: 'Both spinning outward from a salsa turn, arms extended wide, a full step apart, both laughing toward the camera mid-twirl.',
    biomes: ['urban_city', 'interior_intimate', 'mediterranean_coastal'],
  },
  {
    text: 'He raises one arm high forming an arch, she twirls underneath it, a lane apart, both faces bright and grinning at the camera.',
    biomes: ['urban_city', 'interior_intimate', 'mediterranean_coastal'],
  },
  {
    text: 'Swing-out move with arms stretched long between them, both leaning back slightly, side by side with a gap, both faces toward the camera.',
    biomes: ['urban_city', 'interior_intimate', 'mediterranean_coastal'],
  },
  {
    text: "He extends his arm releasing her into a sweeping salsa turn, she spins freely a full arm's length away, both faces toward the camera.",
    biomes: ['urban_city', 'interior_intimate', 'mediterranean_coastal'],
  },
  {
    text: 'Both laughing toward the camera while stirring separate pots side by side with a gap, wooden spoons raised mid-stir',
    biomes: ['interior_intimate'],
  },
  {
    text: 'Both grinning at the camera holding microphones a step apart, mid-belt with mouths open and free hands dramatically gesturing outward',
    biomes: ['interior_intimate'],
  },
  {
    text: 'Both faces toward the camera, each holding a pillow fort wall panel a lane apart, caught mid-construction with arms stretched upward',
    biomes: ['interior_intimate'],
  },
  {
    text: 'Both laughing toward the camera across a board game table with a gap between them, winner pumping fist and loser throwing hands up',
    biomes: ['interior_intimate'],
  },
  {
    text: 'Both grinning at the camera while rolling out separate sheets of dough side by side with a gap, arms pressing down mid-roll',
    biomes: ['interior_intimate'],
  },
  {
    text: 'Both faces toward the camera, each holding a paintbrush a step apart, mid-stroke on separate canvases with palettes raised in the other hand',
    biomes: ['interior_intimate'],
  },
  {
    text: 'Both galloping on separate horses a stride apart, leaning forward in saddles, both faces turned laughing toward the camera',
    biomes: ['grassland_savanna', 'temperate_forest', 'desert_arid'],
  },
  {
    text: 'Both sprinting through tall grass shoulder-width apart, hair flying, both glancing back over their shoulders laughing toward the camera',
    biomes: ['grassland_savanna', 'temperate_forest', 'desert_arid'],
  },
  {
    text: 'Both trotting horses in parallel with a clear gap between mounts, reins held high, both faces turned smiling at the camera',
    biomes: ['grassland_savanna', 'temperate_forest', 'desert_arid'],
  },
  {
    text: 'Both bounding from rock to rock across a shallow creek a step apart, knees lifted high, both grinning toward the camera',
    biomes: ['grassland_savanna', 'temperate_forest', 'desert_arid'],
  },
  {
    text: 'Both running downhill on a trail side by side with a gap, leaning into the slope, both faces open and laughing at the camera',
    biomes: ['grassland_savanna', 'temperate_forest', 'desert_arid'],
  },
  {
    text: 'Both leaping off the ground a step apart, arms thrown wide overhead, both faces toward the camera mid-shout of joy',
  },
  {
    text: 'Both spinning outward away from each other a lane apart, arms extended like wings, both laughing faces turned toward the camera',
  },
  {
    text: 'Both leaping sideways away from each other with arms stretched out like starfish, a stride apart, both faces laughing toward the camera',
  },
  {
    text: 'Both mid-air doing simultaneous scissor jumps a step apart, leading legs extended forward, both faces wide-eyed and grinning at the camera',
  },
  {
    text: 'Both twisting mid-jump in opposite directions a lane apart, arms spiraling outward, both turning faces toward the camera with open-mouthed laughter',
  },
];

/**
 * Weighted roll from the ACTIVE pool for the given resolved biome. Entries
 * with no biomes are universal. Returns null when nothing fits (caller falls
 * back to the classic pools) — with universal entries present that only
 * happens if the pool is emptied.
 */
/** Biome-eligible entries — exported for shuffle-bag filtering upstream. */
export function eligibleDualActionsActive(biomeKey: string | null): ActiveDualAction[] {
  return DUAL_ACTIONS_ACTIVE.filter(
    (e) => !e.biomes || (biomeKey !== null && e.biomes.includes(biomeKey))
  );
}

export function pickActiveDualAction(
  biomeKey: string | null,
  candidates?: ActiveDualAction[]
): string | null {
  const eligible = candidates ?? eligibleDualActionsActive(biomeKey);
  if (eligible.length === 0) return null;
  const total = eligible.reduce((s, e) => s + (e.weight ?? 1), 0);
  let roll = Math.random() * total;
  for (const e of eligible) {
    roll -= e.weight ?? 1;
    if (roll <= 0) return e.text;
  }
  return eligible[eligible.length - 1].text;
}
