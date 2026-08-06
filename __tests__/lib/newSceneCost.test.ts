/**
 * PARITY LOCK for the New Scene charge. The price is computed in THREE runtimes
 * — enqueue-dream + generate-dream (server, authoritative: this is what charges)
 * and the Create screen (client preview). If the "best tier, but Standard for a
 * solo swap" rule drifts between them, a user gets charged one price and rendered
 * at another (charge != render), the exact defect this test exists to prevent.
 *
 * Both server sites import newSceneTierCost from the engine source; the client
 * mirrors it in lib/newSceneRoute.ts. This test imports BOTH and asserts they
 * agree across the full (tier × soloSwap) grid — so a change to one that isn't
 * mirrored in the other turns CI red before it ships (the proStateParity pattern).
 */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const engine = require('@engine/newSceneDirective');
import { newSceneTierCost as clientCost } from '@/lib/newSceneRoute';

const engineCost = engine.newSceneTierCost as (
  tier: 'standard' | 'best',
  soloSwap: boolean,
  priceStandard: number,
  priceBest: number
) => number;

const STANDARD = 3;
const BEST = 5;

describe('newSceneTierCost — the pricing rule itself', () => {
  it('best tier + genuine reference scene → Best price', () => {
    expect(engineCost('best', false, STANDARD, BEST)).toBe(BEST);
  });

  it('best tier BUT a solo swap → Standard (the tier does nothing on that branch)', () => {
    expect(engineCost('best', true, STANDARD, BEST)).toBe(STANDARD);
  });

  it('standard tier → Standard regardless of solo swap', () => {
    expect(engineCost('standard', false, STANDARD, BEST)).toBe(STANDARD);
    expect(engineCost('standard', true, STANDARD, BEST)).toBe(STANDARD);
  });

  it('never charges Best for a solo swap under any tier', () => {
    for (const tier of ['standard', 'best'] as const) {
      expect(engineCost(tier, true, STANDARD, BEST)).toBe(STANDARD);
    }
  });
});

describe('client mirror === engine source (charge == render)', () => {
  const tiers = ['standard', 'best'] as const;
  const swaps = [true, false];
  // A couple of distinct price pairs so the assertion isn't accidentally satisfied
  // by both sides returning the same constant.
  const priceGrids = [
    { std: 3, best: 5 },
    { std: 1, best: 9 },
    { std: 4, best: 4 },
  ];

  for (const tier of tiers) {
    for (const soloSwap of swaps) {
      for (const { std, best } of priceGrids) {
        it(`parity: tier=${tier} soloSwap=${soloSwap} std=${std} best=${best}`, () => {
          expect(clientCost(tier, soloSwap, std, best)).toBe(engineCost(tier, soloSwap, std, best));
        });
      }
    }
  }
});
