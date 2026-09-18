/** FLUX COUPLE LAB — the experimental couple composer is a pure function of slots + input; each variant is one shape. */
import {
  composeExperimentalCouple,
  COUPLE_VARIANTS,
  isCoupleVariant,
} from '@engine/coupleComposerX';

const input = {
  cast: [
    {
      role: 'plus_one',
      promptDesc: 'a White woman with a full head of dark brown hair',
      age: 38,
      physicalSummary:
        'average build, warm golden-tan skin, dark brown hair with caramel highlights',
      gender: 'female' as const,
      ethnicity: 'White',
    },
    {
      role: 'self',
      promptDesc: 'a White man with a full head of light brown hair',
      age: 43,
      physicalSummary:
        'average build, warm medium skin, light brown hair with natural gray blending, short trimmed beard',
      gender: 'male' as const,
      ethnicity: 'White',
    },
  ],
  iconicAnchor: 'a narrow Victorian alley with iron railings',
  userPlace: 'london',
  timeAxis: 'night',
  weatherAxis: 'fog',
  phenomenaAxis: '',
  mediumFluxFragment: 'polished digital painting, professional concept art',
  vibeDirective: '',
  avoidList: '',
  action: null,
  vibeFragment: 'hanging lanterns casting warm amber pools through shifting mist',
};
const slots = {
  scene_description: 'fog curls thick at cobblestone level, black cats perched on worn stone steps',
  left_wardrobe: 'a fitted black wool cape coat, cream ruffled blouse, velvet gloves',
  right_wardrobe: 'a dark charcoal greatcoat, burgundy waistcoat, fingerless leather gloves',
  mood: 'tender wistful warmth',
  props: 'a black cat settled on the step below',
  action: 'both seated side by side on the worn stone steps, a clear gap between them',
};

describe('composeExperimentalCouple', () => {
  it('narrative reads left to right: environment, left person, right person, beat, faces line', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const p = composeExperimentalCouple({ slots, input: input as any, variant: 'narrative' });
    const i = (s: string) => p.indexOf(s);
    expect(i('polished digital painting')).toBe(0);
    expect(i('On the left, a White woman')).toBeGreaterThan(i('Victorian alley'));
    expect(i('To her right')).toBeGreaterThan(i('On the left'));
    expect(i('Both seated side by side')).toBeGreaterThan(i('To her right'));
    expect(i('faces turned toward the camera')).toBeGreaterThan(i('Both seated'));
    expect(p).not.toMatch(/-EYED/);
    expect(p).toContain('warm medium skin');
  });

  it('narrative_asym adds a contrasting palette cue per side; narrative_faces leads with the faces line', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const a = composeExperimentalCouple({ slots, input: input as any, variant: 'narrative_asym' });
    expect(a).toContain('warm reds, golds and cream: a fitted black wool cape coat');
    expect(a).toContain('cool blues, charcoal and silver: a dark charcoal greatcoat');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const f = composeExperimentalCouple({ slots, input: input as any, variant: 'narrative_faces' });
    expect(f.indexOf('Both are shown from the knees up')).toBe(0);
  });

  it('json is a parseable FLUX.2 structured prompt with two positioned subjects', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const j = JSON.parse(
      composeExperimentalCouple({ slots, input: input as any, variant: 'json' })
    );
    expect(j.subjects).toHaveLength(2);
    expect(j.subjects[0].position).toBe('left side of the frame');
    expect(j.subjects[1].position).toMatch(/^right side of the frame/);
    expect(j.subjects[1].description).toContain('short trimmed beard');
    expect(j.scene).toContain('Victorian alley');
    expect(j.action).toContain('seated side by side');
  });

  it('narrative_fg names the couple in the foreground before the scene, without face words up front', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const p = composeExperimentalCouple({ slots, input: input as any, variant: 'narrative_fg' });
    expect(p.indexOf('In the foreground, on the left')).toBeLessThan(
      p.indexOf('Behind and around them')
    );
    expect(p.indexOf('Behind and around them')).toBeLessThan(
      p.indexOf('faces turned toward the camera')
    );
    expect(p.slice(0, 200)).not.toMatch(/faces?/);
  });

  it("narrative_fg_beat turns a scenario-shaped place into the couple's own sentence before the scene", () => {
    const scenarioInput = {
      ...input,
      iconicAnchor: 'Couple rides twin red foxes through an autumn forest',
      setAtOverride: null,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const p = composeExperimentalCouple({
      slots,
      input: scenarioInput as any,
      variant: 'narrative_fg_beat',
    });
    expect(p).toContain('They ride twin red foxes through an autumn forest.');
    expect(p.indexOf('They ride twin red foxes')).toBeLessThan(p.indexOf('Behind and around them'));
    expect(p).not.toMatch(/Behind and around them, Couple rides/);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const q = composeExperimentalCouple({
      slots,
      input: input as any,
      variant: 'narrative_fg_beat',
    });
    expect(q).toContain('Behind and around them, a narrow Victorian alley with iron railings');
  });

  it('variant names are locked', () => {
    expect(COUPLE_VARIANTS).toEqual([
      'narrative',
      'narrative_asym',
      'narrative_faces',
      'narrative_fg',
      'narrative_fg_beat',
      'json',
    ]);
    expect(isCoupleVariant('json')).toBe(true);
    expect(isCoupleVariant('album')).toBe(false);
  });
});
