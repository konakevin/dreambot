/**
 * The bot run log's `cost_cents` must reflect the model that actually rendered.
 *
 * Until 2026-09-24 `botEngine.js` added a flat `FLUX_COST_CENTS = 3` to every render, so
 * flux-1.1-pro-ultra (6¢, ~36% of fleet renders) and flux-2-max (7¢) were logged at 3¢ for
 * months and every "what do the bots cost" query built on the column was low. The engine now
 * asks the `image_models` table for the rendered model's price (with the code mirror in
 * `imageModels.js` as the fallback). This locks both halves: the mirror's prices and the
 * absence of a flat constant in the engine.
 */

import { readFileSync } from 'fs';
import { join } from 'path';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const imageModels = require('../../scripts/lib/imageModels');

const ENGINE_SRC = readFileSync(join(__dirname, '../../scripts/lib/botEngine.js'), 'utf8');

describe('bot run-log cost follows the rendered model', () => {
  it('prices the two Flux 1.1 models differently, as Replicate does', () => {
    expect(imageModels.modelCostCents('black-forest-labs/flux-1.1-pro')).toBe(4);
    expect(imageModels.modelCostCents('black-forest-labs/flux-1.1-pro-ultra')).toBe(6);
    expect(imageModels.modelCostCents('black-forest-labs/flux-2-max')).toBe(7);
    expect(imageModels.modelCostCents('black-forest-labs/flux-2-pro')).toBe(3);
  });

  it('falls back to the anchor price for an unknown model id', () => {
    expect(imageModels.modelCostCents('nobody/made-this-model')).toBe(
      imageModels.DEFAULT_MODEL_COST_CENTS
    );
  });

  it('prices every model a bot may pick', () => {
    for (const m of imageModels.ALL_ENABLED_AI_MODELS as string[]) {
      expect(imageModels.MODEL_COST_CENTS[m]).toEqual(expect.any(Number));
    }
  });

  it('no longer stamps a flat constant on every render', () => {
    expect(ENGINE_SRC).not.toMatch(/FLUX_COST_CENTS/);
    expect(ENGINE_SRC).toContain('await getImageModelCostCents(sb, renderModel)');
    expect(ENGINE_SRC).toMatch(/from\('image_models'\)\.select\('id,cost_cents'\)/);
  });
});
