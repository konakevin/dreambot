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
 * Genre + location batches: SHOW-AND-TELL (objects held up at chest height) put the object between the
 * lens and a face → giant_face / faces=0 split rejects 3 times → parked.
 * They render fine on flux-2-flex (full-body, 0 degrades) — re-enable if the couple model steer is on.
 */
export const DUAL_STANCES_GEOMETRY: readonly DualStance[] = [
  {
    key: 'show_and_tell',
    text: 'both holding something from the scene up at chest height, elbows bent, a clear gap between them',
  },
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

/** Uniform pick — from `list` when a register carries its own stances (actionRegisters.ts), else the generic set. */
export function pickDualStance(
  rng: () => number = Math.random,
  list: readonly DualStance[] = DUAL_STANCES
): DualStance {
  const from = list.length > 0 ? list : DUAL_STANCES;
  return from[Math.floor(rng() * from.length)];
}

/**
 * WIDE stances (2026-09-12, looks path only): the generic set above describes torsos (leaning back, perched,
 * hands in pockets, arms folded), and flux-1.1-pro frames whatever body part the text names, so 9 of 10 natural
 * looks-path renders came out waist-up. These keep every swap rule (one plane, one height, a clear gap, nothing
 * held up, no walking) and name the LOWER body (a boot on a step, ankles crossed, feet on the ground, full figures
 * from the knees up) so the frame opens and the set shows. Rolled instead of DUAL_STANCES when the resolver is
 * asked for wide stances; a register that owns its stances still wins.
 */
export const DUAL_STANCES_WIDE: readonly DualStance[] = [
  // Texts ≤ 26 words (2026-09-12): Sonnet builds the beat AROUND the stance, so a 40-word stance pushed the couple
  // beat over the validator's 56-word cap and the beat was silently dropped to the pool pose (3 of 10 flux
  // renders in the geometry A/B). Locked by the word-cap test.
  {
    key: 'step_up',
    text: 'one with a boot up on a step and a hand on that knee, the other standing tall beside with a hand on the rail',
  },
  {
    key: 'column_lean',
    text: 'one leaning a shoulder on a post with ankles crossed, the other a step apart, weight on the back foot, one hand at the hip',
  },
  {
    key: 'seated_steps',
    text: 'both seated a step apart on wide stone steps, feet flat on the ground and knees showing, hands resting on the stone beside them',
    seated: true,
  },
  {
    key: 'rail_pair',
    text: 'both at a railing or fence with one hand each on the rail, boots on the ground, full figures from the knees up',
  },
  {
    key: 'stand_open',
    text: 'both standing tall a step apart with nothing held, arms relaxed at the sides, full figures from the knees up',
  },
  {
    key: 'bench_ends',
    text: 'both seated at either end of a bench with feet on the ground, one arm along the backrest, the far hand on a knee',
    seated: true,
  },
  {
    key: 'mid_laugh_open',
    text: 'both mid-laugh with boots planted a step apart, one hand on a hip, the other hand on something solid at hip height',
  },
  {
    key: 'paused_path',
    text: 'both paused side by side on the path, full figures from the knees up, one hand each on a scene object at hip height',
  },
];

/**
 * FLUX-SAFE WIDE subset (2026-09-13, flux couple parity rounds): the wide stances that keep BOTH bodies symmetric and
 * on one plane — both seated on steps, both standing tall, both at a rail, both paused on a path, both mid-laugh.
 * The asymmetric ones (step_up: a boot up on a step; column_lean: one leaning with ankles crossed; bench_ends: one arm
 * along a backrest) broke the flux split in arm E exactly like the parked geometry set. Rolled for flux couples with
 * the generic set when `fluxWideStances` is on; the full wide set stays for gemini / grok.
 */
export const DUAL_STANCES_WIDE_FLUX_SAFE: readonly DualStance[] = DUAL_STANCES_WIDE.filter((s) =>
  ['stand_open', 'rail_pair', 'seated_steps', 'paused_path', 'mid_laugh_open'].includes(s.key)
);

/**
 * ANCHOR stances for flux couples (2026-09-13, flux parity arm H): symmetric, feet-on-the-ground body stances that
 * ride the couple ANCHOR (word ~55, the slot flux obeys — the late pose slot at word ~190 is ignored there). Both
 * bodies on one plane at one height, a clear gap, nothing raised near a face — the geometry the split tolerates.
 */
export const DUAL_STANCES_FLUX_ANCHOR: readonly DualStance[] = [
  // Arm I: the mid-shot five. The "full figures from the knees up" stances (stand_open, seated_steps, paused_path)
  // gave the engine faces too small to split (3/3 failed in arm H) — the swap's healthy band is knees-up / mid-thigh.
  ...DUAL_STANCES.filter((s) =>
    ['seated_together', 'leaning_back', 'perched_edge', 'hands_free'].includes(s.key)
  ),
  ...DUAL_STANCES_WIDE.filter((s) => ['rail_pair'].includes(s.key)),
];

/**
 * NATURAL stances (2026-09-12, looks path `swapGeometry: 'natural'`): the couple may TOUCH and MOVE the way a
 * real couple does — an arm around the shoulders, arms linked mid-stride, leaning in mid-laugh, a dance hold, one
 * seated one standing, a shared carry. Kevin: the strict same-plane / clear-gap / no-contact language was written
 * BEFORE the engine had its fault tolerance (dual re-render ×2 → identity gate → gender-safe solo rebuild, never
 * faceless); with that in place the prompt only has to maximise first-try odds, not guarantee a swappable base.
 * The re-render path swaps back to the STRICT geometry (nightlyLooksPath.ts strictRetryPrompt), so a natural
 * first render that breaks the split costs one retry, never the partner.
 * Every text still avoids the words the validator bans in BOTH modes (face / eyes / kiss / cheek to cheek /
 * direction / gaze / pronoun / above-the-head energy) — only the PROXIMITY rule is lifted for these (locked by
 * __tests__/lib/dualStances.test.ts).
 */
export const DUAL_STANCES_NATURAL: readonly DualStance[] = [
  {
    key: 'arm_around',
    text: "one with an arm around the other's shoulders, both standing easy with weight on the back foot, full figures from the knees up",
  },
  {
    key: 'linked_arms_stroll',
    text: 'arms linked at the elbow, strolling forward side by side mid-stride along the path, full figures from the knees up',
  },
  {
    key: 'lean_in_laugh',
    text: "leaning in toward each other mid-laugh, shoulders touching, heads still a hand's width apart",
  },
  {
    key: 'dance_step',
    text: 'caught mid-step in a slow dance, one hand clasped between them at chest height and the other hand at a waist, feet mid-turn',
  },
  {
    key: 'hand_on_back',
    text: "standing close, one with a hand resting on the other's lower back, the other with a hand on a scene object, full figures from the knees up",
  },
  {
    key: 'seated_lean',
    text: 'seated shoulder to shoulder on steps or a low wall, one leaning back on both hands, the other with elbows on knees, feet on the ground',
    seated: true,
  },
  {
    key: 'slow_twirl',
    text: 'one spinning the other out by one hand in a slow twirl, arms extended at shoulder height, coats and skirts swinging',
  },
  {
    key: 'shared_carry',
    text: 'carrying one long object from the scene between them at hip height, one at each end, walking forward side by side',
  },
  {
    key: 'one_seated_one_standing',
    text: 'one seated on something in the scene, the other standing beside with a hand on the seated one’s shoulder',
    seated: true,
    heightContrast: true,
  },
  {
    key: 'walking',
    text: 'both mid-stride walking forward side by side, a step apart, arms swinging naturally',
  },
  {
    key: 'depth_stagger',
    text: 'one a step closer in the foreground, the other a step behind and to the side, both fully visible',
  },
  {
    key: 'crouched_low',
    text: 'both crouched or kneeling low at something in the scene (a pumpkin, a cat, a basket, a chest), shoulders almost touching',
    seated: true,
  },
  {
    key: 'toast',
    text: 'both raising a drink or a lantern in a toast at chest height, glasses clinking between them',
  },
];
