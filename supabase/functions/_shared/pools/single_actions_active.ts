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
];

/** Weighted roll for the given resolved biome; untagged = universal. */
export function pickActiveSingleAction(biomeKey: string | null): string | null {
  const eligible = SINGLE_ACTIONS_ACTIVE.filter(
    (e) => !e.biomes || (biomeKey !== null && e.biomes.includes(biomeKey))
  );
  if (eligible.length === 0) return null;
  const total = eligible.reduce((s, e) => s + (e.weight ?? 1), 0);
  let roll = Math.random() * total;
  for (const e of eligible) {
    roll -= e.weight ?? 1;
    if (roll <= 0) return e.text;
  }
  return eligible[eligible.length - 1].text;
}
