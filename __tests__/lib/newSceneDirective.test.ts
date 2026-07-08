import {
  routeNewSceneSubject,
  newSceneModel,
  newSceneFallbackModel,
  buildNewScenePrompt,
  NEW_SCENE_MODEL_SEEDREAM,
  NEW_SCENE_MODEL_NANO_BANANA,
  NEW_SCENE_MODEL_NANO_BANANA_PRO,
} from '@engine/newSceneDirective';

const sig = (o: Partial<Parameters<typeof routeNewSceneSubject>[0]>) => ({
  type: 'person',
  num_people: 0,
  num_animals: 0,
  face: 'none',
  ...o,
});

describe('routeNewSceneSubject — the reference-vs-solo-swap fork', () => {
  it('solo-swaps a clean single human with no pet', () => {
    expect(routeNewSceneSubject(sig({ type: 'person', num_people: 1, face: 'clean' }))).toEqual({
      mode: 'solo_swap',
    });
  });

  it('routes a single person with a pet to the person_pet reference (not swap)', () => {
    expect(
      routeNewSceneSubject(sig({ type: 'person', num_people: 1, num_animals: 1, face: 'clean' }))
    ).toEqual({ mode: 'reference', kind: 'person_pet' });
  });

  it('routes a couple/group to the people reference (never a wrong-face swap)', () => {
    expect(routeNewSceneSubject(sig({ type: 'group', num_people: 2, face: 'multi' }))).toEqual({
      mode: 'reference',
      kind: 'people',
    });
    expect(routeNewSceneSubject(sig({ type: 'group', num_people: 3, face: 'multi' }))).toEqual({
      mode: 'reference',
      kind: 'people',
    });
  });

  it('routes a single person with a non-clean face to reference (safe default, not swap)', () => {
    expect(routeNewSceneSubject(sig({ type: 'person', num_people: 1, face: 'unclear' }))).toEqual({
      mode: 'reference',
      kind: 'people',
    });
  });

  it('routes pet / object / scenery to their reference kinds', () => {
    expect(routeNewSceneSubject(sig({ type: 'animal', num_animals: 1 }))).toEqual({
      mode: 'reference',
      kind: 'pet',
    });
    expect(routeNewSceneSubject(sig({ type: 'object' }))).toEqual({
      mode: 'reference',
      kind: 'object',
    });
    expect(routeNewSceneSubject(sig({ type: 'scenery' }))).toEqual({
      mode: 'reference',
      kind: 'scene',
    });
    expect(routeNewSceneSubject(sig({ type: 'unclear' }))).toEqual({
      mode: 'reference',
      kind: 'scene',
    });
  });
});

describe('newSceneModel — tier + medium bucket', () => {
  it('Standard: Seedream for photoreal, Nano Banana for stylized', () => {
    expect(newSceneModel({ stylized: false, tier: 'standard' })).toBe(NEW_SCENE_MODEL_SEEDREAM);
    expect(newSceneModel({ stylized: true, tier: 'standard' })).toBe(NEW_SCENE_MODEL_NANO_BANANA);
  });
  it('Best: Nano Banana Pro regardless of bucket', () => {
    expect(newSceneModel({ stylized: false, tier: 'best' })).toBe(NEW_SCENE_MODEL_NANO_BANANA_PRO);
    expect(newSceneModel({ stylized: true, tier: 'best' })).toBe(NEW_SCENE_MODEL_NANO_BANANA_PRO);
  });
  it('fallback flips Seedream ↔ Nano Banana Pro', () => {
    expect(newSceneFallbackModel(NEW_SCENE_MODEL_SEEDREAM)).toBe(NEW_SCENE_MODEL_NANO_BANANA_PRO);
    expect(newSceneFallbackModel(NEW_SCENE_MODEL_NANO_BANANA)).toBe(NEW_SCENE_MODEL_SEEDREAM);
  });
});

describe('buildNewScenePrompt', () => {
  it('weaves the per-kind preservation clause, scene, and medium/vibe prose', () => {
    const p = buildNewScenePrompt({
      kind: 'pet',
      subjectDescription: 'a white curly dog',
      scene: 'on a sunny beach',
      mediumProse: 'soft watercolor painting',
      vibeProse: 'whimsical and playful',
    });
    expect(p).toContain('Keep its exact breed'); // pet preservation clause
    expect(p).toContain('on a sunny beach'); // the user scene
    expect(p).toContain('soft watercolor painting'); // medium prose
    expect(p).toContain('whimsical and playful'); // vibe prose
    expect(p).toContain('9:16'); // geometry
  });

  it('never invents a person on a place', () => {
    const p = buildNewScenePrompt({
      kind: 'scene',
      subjectDescription: 'a lakeside cabin',
      scene: 'in autumn',
      mediumProse: '',
      vibeProse: '',
    });
    expect(p).toContain('do NOT invent a person');
  });
});
