// Smart Dream model↔style compatibility guard (SMART_DREAM_PLAN.md).
// Deno source resolved by the jest moduleNameMapper (@engine/* → _shared/*).
import {
  smartDreamSet,
  smartDreamApplies,
  coerceSmartDream,
  lowestPricedModel,
  MODEL_DISPLAY_ORDER as edgeDisplayOrder,
} from '@engine/smartDream';
// Client mirror — must agree with the edge rule (price-shown == price-charged).
import {
  lowestPricedModel as clientLowestPricedModel,
  MODEL_DISPLAY_ORDER as clientDisplayOrder,
} from '@/constants/imageModels';

// Cost map used by the lowest-priced tests (mirrors modelPricing sparkle costs).
const COST: Record<string, number> = {
  'google/gemini-2-image': 1,
  'openai/gpt-image-2': 2,
  'black-forest-labs/flux-2-max': 3,
  'xai/grok-imagine-image': 1,
  'black-forest-labs/flux-1.1-pro': 1,
};
const costOf = (id: string) => COST[id] ?? 1;

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
  it('coerces to the LOWEST-PRICED model (not the default) when costOf is supplied', () => {
    // default is gpt-image-2 (2✦), but gemini-2-image (1✦) is cheaper → picked.
    expect(coerceSmartDream('black-forest-labs/flux-1.1-pro-ultra', set, costOf)).toEqual({
      model: 'google/gemini-2-image',
      coerced: true,
    });
  });
});

describe('lowestPricedModel', () => {
  it('picks the cheapest model in the set', () => {
    expect(lowestPricedModel(smartDreamSet(SET)!.models, costOf)).toBe('google/gemini-2-image');
  });
  it('tie → picks the model shown FIRST in the picker (display order)', () => {
    // both 1✦; flux-1.1-pro leads the picker, grok is last in Standard — the
    // auto-select must land on what the user sees first, NOT the array order.
    const models = ['xai/grok-imagine-image', 'black-forest-labs/flux-1.1-pro'];
    expect(lowestPricedModel(models, costOf)).toBe('black-forest-labs/flux-1.1-pro');
  });
  it('cost beats display order (a cheaper, later-in-picker model still wins)', () => {
    // gpt-image-2 (2✦) sits earlier in Premium, but gemini (1✦) is cheaper.
    const models = ['openai/gpt-image-2', 'google/gemini-2-image'];
    expect(lowestPricedModel(models, costOf)).toBe('google/gemini-2-image');
  });
  it('handles a single-model set', () => {
    expect(lowestPricedModel(['openai/gpt-image-2'], costOf)).toBe('openai/gpt-image-2');
  });
});

describe('lowestPricedModel — client/edge parity (must stay in sync)', () => {
  const CATALOG = Object.entries(COST).map(([id, sparkleCost]) => ({ id, sparkleCost }));
  const cases: Array<[string[]]> = [
    [Object.keys(COST)],
    [['google/gemini-2-image', 'openai/gpt-image-2', 'black-forest-labs/flux-2-max']],
    [['xai/grok-imagine-image', 'black-forest-labs/flux-1.1-pro']],
    [['openai/gpt-image-2']],
  ];
  it.each(cases)('client === edge for %j', (models) => {
    expect(clientLowestPricedModel(models, CATALOG)).toBe(lowestPricedModel(models, costOf));
  });

  it('MODEL_DISPLAY_ORDER is identical client ↔ edge (the tie-break source)', () => {
    expect(edgeDisplayOrder).toEqual(clientDisplayOrder);
  });
});
