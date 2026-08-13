/**
 * Locks the NSFW cross-provider failover picker (NIGHTLY_DREAM_GUARANTEE_PLAN.md
 * L2): on an NSFW flag we retry the SAME image on a DIFFERENT provider (whose
 * safety filter rarely false-flags it), keyed off which model actually failed.
 */

import { nsfwFailoverModel } from '@engine/generateImage';

describe('nsfwFailoverModel', () => {
  it('Flux flagged → fail over to Gemini', () => {
    expect(nsfwFailoverModel('black-forest-labs/flux-1.1-pro', 'text', undefined)).toBe(
      'google/gemini-2-image'
    );
  });
  it('Gemini flagged → fail over to Flux', () => {
    expect(nsfwFailoverModel('google/gemini-2-image', 'text', undefined)).toBe(
      'black-forest-labs/flux-1.1-pro'
    );
  });
  it('OpenAI / xAI flagged → fail over to Gemini', () => {
    expect(nsfwFailoverModel('openai/gpt-image-2', 'text', undefined)).toBe(
      'google/gemini-2-image'
    );
  });
  it('unknown/undefined failed model → Gemini (safe default)', () => {
    expect(nsfwFailoverModel(undefined, 'text', undefined)).toBe('google/gemini-2-image');
  });
  it('edit mode (flux-kontext + source image) swaps between editors', () => {
    expect(nsfwFailoverModel('google/gemini-2-image', 'flux-kontext', 'https://img')).toBe(
      'black-forest-labs/flux-kontext-pro'
    );
    expect(
      nsfwFailoverModel('black-forest-labs/flux-kontext-pro', 'flux-kontext', 'https://img')
    ).toBe('google/gemini-2-image');
  });
});
