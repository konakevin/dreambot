/**
 * dualStances.ts — body-language variety for COUPLE renders (Kevin 2026-09-06: "every couples render
 * now looks very homogeneous, the same framing … look at the body language/pose").
 *
 * With scene-first actions every couple beat became "one holds X, the other arranges Y" — standing,
 * feet planted, hands at chest level — because the brief mandated busy hands and the validator banned
 * sitting / kneeling / walking for couples. The old pool poses (sitting on steps, leaning on a rail,
 * crouching, mid-stride) were what broke the template. This rolls ONE stance per render and hands it to
 * Sonnet as the frame to build the moment around. Every stance keeps the swap invariants (clear gap,
 * heads on separate sides, nothing above the head) and none of the texts contain a word the validator
 * rejects, so Sonnet echoing the stance verbatim still ships (locked by __tests__/lib/dualStances.test.ts).
 */
export interface DualStance {
  key: string;
  text: string;
  /** Seated / perched / crouched — the anchor drops "stand" so the prompt does not contradict itself. */
  seated?: boolean;
  /** One high, one low — the "same vertical height" line is omitted for this render. */
  heightContrast?: boolean;
}

export const DUAL_STANCES: readonly DualStance[] = [
  {
    key: 'seated_together',
    text: 'both seated side by side on something solid in the scene (a bench, steps, a hay bale, a low wall, a log), a clear gap between them',
    seated: true,
  },
  {
    key: 'leaning_back',
    text: 'both leaning back against something solid in the scene (a wall, a fence, a wagon, a railing), a clear gap between them',
  },
  {
    key: 'shoulder_lean',
    text: 'one leaning a shoulder against a post, door frame or tree, the other standing free with weight on one hip, a clear gap between them',
  },
  {
    key: 'perched_edge',
    text: 'both perched on the edge of something in the scene (a table, a wagon bed, a ledge, a porch rail), a clear gap between them',
    seated: true,
  },
  {
    key: 'show_and_tell',
    text: 'both holding something from the scene up at chest height, elbows bent, a clear gap between them',
  },
  {
    key: 'mid_laugh',
    text: 'both mid-laugh at something between them, shoulders loose, a clear gap between their heads',
  },
  {
    key: 'hands_free',
    text: 'both standing easy with nothing held, hands in pockets, arms folded or hands on hips, a clear gap between them',
  },
  {
    key: 'one_busy_one_easy',
    text: 'one busy with something in the scene, the other standing easy a step apart with hands in pockets or arms folded',
  },
];

/**
 * PARKED (2026-09-06, variance batch 2 on flux-1.1-pro): stances that change body GEOMETRY — one high
 * one low, one a step behind, both crouched, objects raised near the face — degraded 4/4 couples
 * (no_dual_split / identity near 0): the 1.1-pro split needs both faces on one plane at one height.
 * Batch 3: mid-stride WALKING degraded 2/2 the same way (bodies angle, one face lost) → parked too.
 * They render fine on flux-2-flex (full-body, 0 degrades) — re-enable if the couple model steer is on.
 */
export const DUAL_STANCES_GEOMETRY: readonly DualStance[] = [
  {
    key: 'walking',
    text: 'both mid-stride walking forward side by side, a step apart, arms swinging naturally',
  },
  {
    key: 'one_seated_one_standing',
    text: 'one seated on something in the scene, the other standing beside at a clear gap',
    seated: true,
    heightContrast: true,
  },
  {
    key: 'depth_stagger',
    text: 'one a step closer in the foreground, the other a step behind and to the side, both fully visible with a clear gap between them',
  },
  {
    key: 'crouched_low',
    text: 'both crouched or kneeling low at something in the scene (a pumpkin, a cat, a basket, a chest), a clear gap between them',
    seated: true,
  },
  {
    key: 'toast',
    text: 'both raising a drink or a lantern in a toast at chest height, a clear gap between them',
  },
];

export function pickDualStance(rng: () => number = Math.random): DualStance {
  return DUAL_STANCES[Math.floor(rng() * DUAL_STANCES.length)];
}
