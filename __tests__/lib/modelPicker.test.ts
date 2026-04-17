/**
 * Tests for modelPicker — Replicate model routing logic.
 *
 * The DB cache path (getPreferredModel) requires Deno.env which doesn't exist
 * in Jest, so the try/catch swallows the error and falls through to code-based
 * routing. These tests cover the code-owned routing: Kontext mode, SDXL-always
 * mediums, keyword fallback, and the default model.
 */

import { pickModel } from '@engine/modelPicker';

describe('pickModel', () => {
  it('returns flux-kontext-pro for flux-kontext mode regardless of medium', async () => {
    const result = await pickModel('flux-kontext', 'any prompt', 'watercolor');
    expect(result.model).toBe('black-forest-labs/flux-kontext-pro');
    expect(result.inputOverrides).toEqual({});
  });

  it('returns sdxl with overrides for anime medium', async () => {
    const result = await pickModel('text-to-image', 'a beautiful sunset', 'anime');
    expect(result.model).toBe('sdxl');
    expect(result.inputOverrides).toEqual({
      width: 768,
      height: 1344,
      num_inference_steps: 30,
      guidance_scale: 7.5,
    });
  });

  it('returns sdxl with overrides for pixels medium', async () => {
    const result = await pickModel('text-to-image', 'retro game scene', 'pixels');
    expect(result.model).toBe('sdxl');
    expect(result.inputOverrides).toEqual({
      width: 768,
      height: 1344,
      num_inference_steps: 30,
      guidance_scale: 7.5,
    });
  });

  it('returns sdxl when no medium and prompt contains "anime"', async () => {
    const result = await pickModel('text-to-image', 'anime warrior in rain');
    expect(result.model).toBe('sdxl');
    expect(result.inputOverrides).toMatchObject({ width: 768, height: 1344 });
  });

  it('returns sdxl when no medium and prompt contains "pixel art"', async () => {
    const result = await pickModel('text-to-image', 'pixel art castle at night');
    expect(result.model).toBe('sdxl');
  });

  it('returns sdxl when no medium and prompt contains "8-bit"', async () => {
    const result = await pickModel('text-to-image', 'an 8-bit dungeon crawler');
    expect(result.model).toBe('sdxl');
  });

  it('returns flux-2-dev default when no medium and normal prompt', async () => {
    const result = await pickModel('text-to-image', 'a serene mountain landscape');
    expect(result.model).toBe('black-forest-labs/flux-2-dev');
    expect(result.inputOverrides).toEqual({});
  });

  it('returns flux-2-dev default when medium provided but not in SDXL_ALWAYS and DB cache empty', async () => {
    const result = await pickModel('text-to-image', 'golden hour portrait', 'watercolor');
    expect(result.model).toBe('black-forest-labs/flux-2-dev');
    expect(result.inputOverrides).toEqual({});
  });
});
