/**
 * The scenario split (scripts/lib/scenarioSplit.js). A scenario row holds the place AND what the people are doing;
 * the engine assigns the whole string to the place slot, so the action is lost and the couple ends up posed only by
 * the face-swap framing block. These lock the split that recovers it — and, just as importantly, lock the cases
 * where it must REFUSE, because a wrong split silently rewrites Kevin's seed text into nonsense.
 */
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { splitScenario } = require('../../scripts/lib/scenarioSplit.js');

describe('splitScenario', () => {
  it('splits at a comma before a subject pronoun, keeping both halves verbatim', () => {
    const scene =
      'Rain-slick megacity back alley, holographic neon signs towering above, she stands arms crossed smirking at camera';
    const out = splitScenario(scene)!;
    expect(out.place).toBe('Rain-slick megacity back alley, holographic neon signs towering above');
    expect(out.action).toBe('she stands arms crossed smirking at camera');
    expect(scene).toContain(out.place); // verbatim, never rewritten
    expect(scene).toContain(out.action);
  });

  it('recovers the render that started this: the Atlantis couple', () => {
    const out = splitScenario(
      'Soaring above a lost city of submerged pillars blanketed in soft coral, she holds a glowing sea lantern at hip level face radiant with wonder, he floats beside her arms loosely spread grinning in awe at the camera.'
    )!;
    expect(out.place).toBe(
      'Soaring above a lost city of submerged pillars blanketed in soft coral'
    );
    expect(out.action.startsWith('she holds a glowing sea lantern')).toBe(true);
    expect(out.action.endsWith('.')).toBe(false); // trailing stop trimmed
  });

  it('splits a comma-less couple row only when allowBare is set (the dual pools)', () => {
    const scene =
      'Waterpark massive enclosed tube slide both mid-rush on separate inner tubes arms raised bodies tilting into the curve';
    expect(splitScenario(scene)).toBeNull(); // singles: refuse
    const out = splitScenario(scene, { allowBare: true })!;
    expect(out.place).toBe('Waterpark massive enclosed tube slide');
    expect(out.action.startsWith('both mid-rush on separate inner tubes')).toBe(true);
  });

  it('REFUSES the determiner trap — "both hands" is not a subject', () => {
    // The single pools are full of these. Splitting here produced actions like "both hands, acacia trees behind
    // him", which would have replaced a real pose with a fragment.
    const scene =
      'A Zulu warrior stands proud on an open savanna at sunrise, assegai spear resting across both hands, acacia trees behind him';
    const bare = splitScenario(scene, { allowBare: true });
    expect(bare === null || bare.action.startsWith('both hands') === false).toBe(true);
  });

  it('refuses a scene-only row rather than inventing an action', () => {
    expect(
      splitScenario(
        'Courtyard with stone columns wrapped in amber lights, jack-o-lanterns flickering on every step'
      )
    ).toBeNull();
    expect(
      splitScenario('Victorian glass conservatory, rain drumming overhead, terracotta pots of mums')
    ).toBeNull();
  });

  it('refuses when either half would be a fragment', () => {
    expect(splitScenario('A rooftop, she sits')).toBeNull(); // action too short
    expect(splitScenario('Dusk, they walk the long pier together at golden hour')).toBeNull(); // place too short
  });

  it('handles empty and malformed input without throwing', () => {
    expect(splitScenario('')).toBeNull();
    expect(splitScenario('   ')).toBeNull();
    expect(splitScenario(undefined as unknown as string)).toBeNull();
    expect(splitScenario(null as unknown as string)).toBeNull();
  });
});
