// Nightly DreamSmart model pool (≤2 sparkles). Deno source resolved by the jest
// moduleNameMapper (@engine/* → _shared/*).
import { nightlyModelPool, pickFromPool } from '@engine/nightlyModelPool';

const COST: Record<string, number> = {
  'black-forest-labs/flux-1.1-pro': 1,
  'black-forest-labs/flux-2-pro': 1,
  'black-forest-labs/flux-2-dev': 1,
  'google/gemini-2-image': 1,
  'xai/grok-imagine-image': 1,
  'openai/gpt-image-2': 2,
  'black-forest-labs/flux-1.1-pro-ultra': 2,
  'black-forest-labs/flux-2-max': 3, // >2 — must be filtered
  'openai/gpt-image-1': 3,
  'google/gemini-3-image-preview': 5,
};
const costOf = (id: string) => COST[id] ?? 1;

describe('nightlyModelPool', () => {
  it('keeps only ≤2 sparkle models from the smart set', () => {
    const pool = nightlyModelPool({
      smartDreamModels: [
        'black-forest-labs/flux-2-max', // 3 — drop
        'google/gemini-2-image', // 1
        'google/gemini-3-image-preview', // 5 — drop
        'openai/gpt-image-2', // 2
        'xai/grok-imagine-image', // 1
      ],
      allowedModels: [],
      costOf,
    });
    expect(pool.sort()).toEqual(
      ['google/gemini-2-image', 'openai/gpt-image-2', 'xai/grok-imagine-image'].sort()
    );
  });

  it('excludes banned models (NIGHTLY_BANNED_MODELS)', () => {
    const pool = nightlyModelPool({
      smartDreamModels: ['black-forest-labs/flux-2-dev', 'google/gemini-2-image'],
      allowedModels: [],
      costOf,
      bans: new Set(['black-forest-labs/flux-2-dev']),
    });
    expect(pool).toEqual(['google/gemini-2-image']);
  });

  it('scene gate: narrows to scene-eligible ∩ smart ∩ ≤2', () => {
    const pool = nightlyModelPool({
      smartDreamModels: [
        'google/gemini-2-image',
        'black-forest-labs/flux-2-pro',
        'openai/gpt-image-2',
      ],
      allowedModels: [],
      costOf,
      intersectWith: ['black-forest-labs/flux-2-pro', 'black-forest-labs/flux-2-max'],
    });
    expect(pool).toEqual(['black-forest-labs/flux-2-pro']);
  });

  it('scene gate: empty intersection falls back to the ≤2 smart set (never scene-inappropriate-empty)', () => {
    const pool = nightlyModelPool({
      smartDreamModels: ['google/gemini-2-image', 'xai/grok-imagine-image'],
      allowedModels: [],
      costOf,
      intersectWith: ['black-forest-labs/flux-2-max'], // no overlap
    });
    expect(pool.sort()).toEqual(['google/gemini-2-image', 'xai/grok-imagine-image'].sort());
  });

  it('falls back to allowed_models ∩ ≤2 when the smart set is empty', () => {
    const pool = nightlyModelPool({
      smartDreamModels: [],
      allowedModels: ['black-forest-labs/flux-2-max', 'black-forest-labs/flux-1.1-pro'],
      costOf,
    });
    expect(pool).toEqual(['black-forest-labs/flux-1.1-pro']);
  });

  it('falls back to a universal safe default when nothing qualifies', () => {
    const pool = nightlyModelPool({
      smartDreamModels: ['google/gemini-3-image-preview'], // 5 — dropped
      allowedModels: ['openai/gpt-image-1'], // 3 — dropped
      costOf,
    });
    expect(pool).toEqual(['black-forest-labs/flux-1.1-pro']);
  });

  it('pickFromPool is deterministic under an injected rng', () => {
    const pool = ['a', 'b', 'c', 'd'];
    expect(pickFromPool(pool, () => 0)).toBe('a');
    expect(pickFromPool(pool, () => 0.99)).toBe('d');
    expect(pickFromPool(pool, () => 0.5)).toBe('c');
  });
});
