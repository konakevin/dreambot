// Smart Dream model↔style compatibility guard (SMART_DREAM_PLAN.md).
// Deno source resolved by the jest moduleNameMapper (@engine/* → _shared/*).
import { smartDreamSet, smartDreamApplies, coerceSmartDream } from '@engine/smartDream';

const SET = {
  smart_dream_models: [
    'google/gemini-2-image',
    'openai/gpt-image-2',
    'black-forest-labs/flux-2-max',
  ],
  smart_dream_default: 'openai/gpt-image-2',
};

describe('smartDreamSet', () => {
  it('parses a valid client_meta set + honors declared default', () => {
    const s = smartDreamSet(SET);
    expect(s).not.toBeNull();
    expect(s!.models).toHaveLength(3);
    expect(s!.default).toBe('openai/gpt-image-2');
  });

  it('falls back to the first model when default is missing/invalid', () => {
    expect(smartDreamSet({ smart_dream_models: ['a', 'b'] })!.default).toBe('a');
    expect(
      smartDreamSet({ smart_dream_models: ['a', 'b'], smart_dream_default: 'zzz' })!.default
    ).toBe('a');
  });

  it('returns null (inert) for absent/empty/malformed config', () => {
    expect(smartDreamSet(null)).toBeNull();
    expect(smartDreamSet(undefined)).toBeNull();
    expect(smartDreamSet({})).toBeNull();
    expect(smartDreamSet({ smart_dream_models: [] })).toBeNull();
    expect(smartDreamSet({ smart_dream_models: 'nope' })).toBeNull();
    expect(smartDreamSet({ smart_dream_models: [1, 2] })).toBeNull();
  });
});

describe('smartDreamApplies — DreamBot mode only', () => {
  it('applies to a plain DreamBot text/self-insert dream', () => {
    expect(smartDreamApplies({})).toBe(true);
  });
  it('applies when dream_smart is true or absent (default on)', () => {
    expect(smartDreamApplies({ dream_smart: true })).toBe(true);
    expect(smartDreamApplies({ dream_smart: undefined })).toBe(true);
  });
  it('is exempt when the user turned DreamSmart off (dream_smart=false)', () => {
    expect(smartDreamApplies({ dream_smart: false })).toBe(false);
  });
  it('is exempt in Direct mode (use_exact_prompt)', () => {
    expect(smartDreamApplies({ use_exact_prompt: true })).toBe(false);
  });
  it('is exempt for DLT replay (frozen model)', () => {
    expect(smartDreamApplies({ dlt_recipe: { model: 'x' } })).toBe(false);
  });
  it('is exempt for restyle + New Scene photo paths', () => {
    expect(smartDreamApplies({ photo_style: 'restyle' })).toBe(false);
    expect(smartDreamApplies({ input_image: 'http://x', photo_style: 'new_scene' })).toBe(false);
  });
});

describe('coerceSmartDream', () => {
  const set = smartDreamSet(SET)!;
  it('passes an in-set model through unchanged', () => {
    expect(coerceSmartDream('black-forest-labs/flux-2-max', set)).toEqual({
      model: 'black-forest-labs/flux-2-max',
      coerced: false,
    });
  });
  it('coerces a photoreal-drift model (e.g. pinned pro_mode) to the style default', () => {
    // flux-1.1-pro-ultra pinned on a stylized style → swapped to the default.
    expect(coerceSmartDream('black-forest-labs/flux-1.1-pro-ultra', set)).toEqual({
      model: 'openai/gpt-image-2',
      coerced: true,
    });
    expect(coerceSmartDream('black-forest-labs/flux-1.1-pro', set).coerced).toBe(true);
  });
  it('leaves null models alone (auto-pick path handled separately)', () => {
    expect(coerceSmartDream(null, set)).toEqual({ model: null, coerced: false });
    expect(coerceSmartDream(undefined, set)).toEqual({ model: null, coerced: false });
  });
});
