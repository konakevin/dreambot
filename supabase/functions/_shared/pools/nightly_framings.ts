/**
 * nightly_framings.ts — the FRAMING axis (2026-09-12, Kevin: "very static framing for both couples and singles;
 * 1.2.0 still beats us here").
 *
 * What the 30 public posts (the taste reference) do that the looks path did not: a third of them are FULL
 * figures; a third are FRAMED BY something in the scene (an archway, a doorway, a trellis, a window, a tunnel of
 * branches); a third put the subject OFF-CENTRE with the environment opening on the other side; several sit
 * (steps, a bench, a porch, a tavern table); a few use a slightly LOW camera (heroic) or a step-above camera
 * (intimate). The looks path rolled only the crop distance, so every render was the same centred, eye-level,
 * frontal two-shot at a different zoom.
 *
 * Each recipe is ONE authored composition clause (≤ 26 words) carrying distance + device + camera + placement.
 * It replaces the fixed distance clause in the composer's framing line. The face clauses ("faces clear and
 * unobstructed…") are appended by code, never by the recipe, and no recipe names scene content or dominance
 * (the 2026-06-19 hard rule): a device is a composition instruction, the set dresser still owns the scene.
 * `distance` maps each recipe onto the existing frame keys so the brief's near-field rule and the couple anchor
 * behave exactly as before for that crop. Weights are the roll; tune here, later engine_config.
 */
export interface FramingRecipe {
  key: string;
  /** The composition clause, written for the composer's framing line. */
  text: string;
  weight: number;
  /** Existing frame key this recipe maps to (drives frameInterest / wideFraming / compositions). */
  distance: 'full_figure' | 'knees_up' | 'mid_thigh' | 'waist_up' | 'enviro_wide' | 'three_quarter';
  /** Seated / perched — the couple anchor drops "standing". */
  seated?: boolean;
  /** false = a foreground device or a low camera that cost a face on flux-1.1-pro couples (framing1 batch,
   *  2026-09-12: 4 of 4 degraded). Flux couples roll only swapSafe recipes; other models roll the whole pool. */
  swapSafe?: boolean;
}

export const COUPLE_FRAMINGS: readonly FramingRecipe[] = [
  // ── full figures (posts: ~⅓) ──
  {
    key: 'full_arch',
    text: 'full figures from head to shoe, framed by a stone archway or doorway in the scene, the camera slightly low',
    weight: 10,
    distance: 'full_figure',
    swapSafe: false,
  },
  {
    key: 'full_offcentre',
    text: 'full figures a little left of centre, the scene opening wide to the right, the camera at waist height',
    weight: 8,
    distance: 'full_figure',
  },
  {
    key: 'full_path',
    text: 'full figures mid-path with the way ahead running past them, the camera low and a few steps back',
    weight: 7,
    distance: 'full_figure',
    swapSafe: false,
  },
  {
    key: 'full_steps',
    text: 'full figures on wide steps or a low wall, seated a step apart, the camera at eye level a step below',
    weight: 7,
    distance: 'full_figure',
    seated: true,
  },
  // ── knees up ──
  {
    key: 'knees_window',
    text: 'from the knees up, seen through a window frame, gate or trellis in the near foreground, the camera at eye level',
    weight: 9,
    distance: 'knees_up',
    swapSafe: false,
  },
  {
    key: 'knees_third',
    text: 'from the knees up, placed off to one third of the frame with the scene opening beside them, the camera at eye level',
    weight: 9,
    distance: 'knees_up',
  },
  {
    key: 'knees_low',
    text: 'from the knees up, the camera slightly low so they stand tall against the scene, a little open space above',
    weight: 8,
    distance: 'knees_up',
    swapSafe: false,
  },
  {
    key: 'knees_bench',
    text: 'from the knees up, seated on a bench, porch edge or low wall, the camera at eye level and square to them',
    weight: 8,
    distance: 'knees_up',
    seated: true,
  },
  // ── mid thigh ──
  {
    key: 'thigh_foliage',
    text: 'from mid-thigh up, hanging foliage, lanterns or a doorway edge blurring in the near foreground on one side',
    weight: 7,
    distance: 'mid_thigh',
    swapSafe: false,
  },
  {
    key: 'thigh_table',
    text: 'from mid-thigh up, seated at a table with its near edge and what is on it in the foreground',
    weight: 7,
    distance: 'mid_thigh',
    swapSafe: false,
    seated: true,
  },
  // ── waist up ──
  {
    key: 'waist_step_above',
    text: 'from the waist up, the camera a step above looking gently down, the scene falling away behind them',
    weight: 7,
    distance: 'waist_up',
  },
  {
    key: 'waist_rail',
    text: 'from the waist up at a rail or counter with the scene deep behind them, the camera at eye level',
    weight: 7,
    distance: 'waist_up',
  },
  {
    key: 'waist_offcentre',
    text: 'from the waist up, placed off to one side with the set dressing filling the other half of the frame',
    weight: 6,
    distance: 'waist_up',
  },
];

export const SOLO_FRAMINGS: readonly FramingRecipe[] = [
  {
    key: 'full_arch',
    text: 'full figure framed by an archway, doorway or window in the scene, the camera slightly low',
    weight: 10,
    distance: 'enviro_wide',
  },
  {
    key: 'full_offcentre',
    text: 'full figure a little off centre with the scene opening wide beside them, the camera at waist height',
    weight: 9,
    distance: 'enviro_wide',
  },
  {
    key: 'full_path',
    text: 'full figure mid-stride on the path with the way ahead running past, the camera low and a few steps back',
    weight: 7,
    distance: 'enviro_wide',
  },
  {
    key: 'full_seated',
    text: 'full figure seated on steps, a bench or a low wall, the camera at eye level a step below',
    weight: 7,
    distance: 'enviro_wide',
    seated: true,
  },
  {
    key: 'tq_window',
    text: 'from the knees up, seen through a window frame, gate or trellis in the near foreground',
    weight: 9,
    distance: 'three_quarter',
  },
  {
    key: 'tq_third',
    text: 'from the knees up, placed off to one third of the frame with the scene opening beside them',
    weight: 10,
    distance: 'three_quarter',
  },
  {
    key: 'tq_low',
    text: 'from the knees up, the camera slightly low so they stand tall against the scene, open space above',
    weight: 8,
    distance: 'three_quarter',
  },
  {
    key: 'tq_lean',
    text: 'from the knees up, leaning on a post, rail or doorframe at the edge of the frame, the scene beyond',
    weight: 8,
    distance: 'three_quarter',
  },
  {
    key: 'waist_step_above',
    text: 'from the waist up, the camera a step above looking gently down, the scene falling away behind',
    weight: 7,
    distance: 'waist_up',
  },
  {
    key: 'waist_table',
    text: 'from the waist up at a table or counter, its near edge and what is on it in the foreground',
    weight: 8,
    distance: 'waist_up',
    seated: true,
  },
  {
    key: 'waist_foliage',
    text: 'from the waist up, hanging foliage, lanterns or a doorway edge blurring in the near foreground on one side',
    weight: 7,
    distance: 'waist_up',
  },
  {
    key: 'waist_offcentre',
    text: 'from the waist up, placed off to one side with the set dressing filling the other half of the frame',
    weight: 6,
    distance: 'waist_up',
  },
];
