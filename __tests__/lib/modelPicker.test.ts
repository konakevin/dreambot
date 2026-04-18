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

  it('returns default model for anime medium (no longer SDXL-routed)', async () => {
    const result = await pickModel('text-to-image', 'a beautiful sunset', 'anime');
    // Anime uses Flux now (danbooru tags via compiler). DB allowed_models would
    // pick the model in production; in test Deno.env fails so it falls to default.
    expect(result.model).toBe('black-forest-labs/flux-2-dev');
  });

  it('returns default model for pixels medium (DB-routed, not SDXL_ALWAYS)', async () => {
    const result = await pickModel('text-to-image', 'retro game scene', 'pixels');
    // Pixels uses DB allowed_models now (flux-dev, flux-2-dev, flux-2-pro, sdxl).
    // In test Deno.env fails so it falls to default.
    expect(result.model).toBe('black-forest-labs/flux-2-dev');
  });

  it('returns default model for keyword prompts without medium (no keyword SDXL fallback)', async () => {
    const anime = await pickModel('text-to-image', 'anime warrior in rain');
    const pixel = await pickModel('text-to-image', 'pixel art castle at night');
    const eightBit = await pickModel('text-to-image', 'an 8-bit dungeon crawler');
    // No more keyword-based SDXL routing — all go to default when no medium selected
    expect(anime.model).toBe('black-forest-labs/flux-2-dev');
    expect(pixel.model).toBe('black-forest-labs/flux-2-dev');
    expect(eightBit.model).toBe('black-forest-labs/flux-2-dev');
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
