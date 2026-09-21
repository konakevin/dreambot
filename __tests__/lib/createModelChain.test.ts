/**
 * The Create retry model chain.
 *
 * FLUX_COUPLE_LAB lesson 6, measured: "a repeated model is not a fallback" — Kevin's
 * failing couple re-rendered three times on flux-1.1-pro and degraded to a solo.
 *
 * What these lock is not the happy path but the four CREATE contracts nightly never has
 * to honour, each of which fails SILENTLY: a pricier retry spends cents the charge did not
 * cover, a retry outside the DreamSmart set breaks the promise the checkbox makes, a move
 * on a DLT replay destroys the exact look it exists to reproduce, and an unreported move
 * leaves the DreamCard badge naming a model that never ran.
 */

import { nextCreateModel } from '@engine/createModelChain';

const COST: Record<string, number> = {
  cheap: 1,
  'flux-1.1-pro': 1,
  'flux-2-flex': 1,
  pricey: 2,
  'nano-banana-pro': 5,
};
const costOf = (m: string) => COST[m] ?? 1;
/** Deterministic tie-break: always the last affordable candidate. */
const rng = () => 0.999;

describe('nextCreateModel', () => {
  it('moves off the model that just failed', () => {
    const r = nextCreateModel({
      tried: ['flux-1.1-pro'],
      candidates: ['flux-1.1-pro', 'flux-2-flex'],
      costOf,
      rng,
    });
    expect(r.model).toBe('flux-2-flex');
    expect(r.stamp).toBe('create_model_move:1:flux-2-flex');
  });

  it('never returns a model already tried, however many attempts deep', () => {
    const r = nextCreateModel({
      tried: ['flux-1.1-pro', 'flux-2-flex'],
      candidates: ['flux-1.1-pro', 'flux-2-flex', 'cheap'],
      costOf,
      rng,
    });
    expect(r.model).toBe('cheap');
  });

  // ── contract 1: price shown == price charged ────────────────────────

  it('never moves to a PRICIER model than the one charged', () => {
    const r = nextCreateModel({
      tried: ['flux-1.1-pro'],
      candidates: ['flux-1.1-pro', 'nano-banana-pro'],
      costOf,
      rng,
    });
    expect(r.model).toBeNull();
    expect(r.stamp).toBe('create_model_move:skip:over_cap:1');
  });

  it('caps against the FIRST model tried, so a chain cannot ratchet upward', () => {
    // Charged at 1. Having stepped to another 1, a 2 is still out of reach — deriving the
    // cap from the latest attempt would let two cheap hops fund an expensive one.
    const r = nextCreateModel({
      tried: ['flux-1.1-pro', 'flux-2-flex'],
      candidates: ['flux-1.1-pro', 'flux-2-flex', 'pricey'],
      costOf,
      rng,
    });
    expect(r.model).toBeNull();
    expect(r.stamp).toContain('over_cap');
  });

  it('a pricier CHARGE unlocks a pricier retry, because the user paid for it', () => {
    const r = nextCreateModel({
      tried: ['nano-banana-pro'],
      candidates: ['nano-banana-pro', 'pricey'],
      costOf,
      rng,
    });
    expect(r.model).toBe('pricey');
  });

  it('prefers the CHEAPEST affordable candidate, so a retry reduces spend', () => {
    const r = nextCreateModel({
      tried: ['nano-banana-pro'],
      candidates: ['nano-banana-pro', 'pricey', 'cheap'],
      costOf,
      rng,
    });
    expect(r.model).toBe('cheap');
  });

  // ── contract 2: the DreamSmart promise ──────────────────────────────

  it('only ever picks from the candidates it was given', () => {
    // The caller passes the style's smart_dream_models. A model outside that set renders
    // a style it was never approved for, which is the promise the checkbox makes.
    const r = nextCreateModel({
      tried: ['flux-1.1-pro'],
      candidates: ['flux-2-flex'],
      costOf,
      rng,
    });
    expect(r.model).toBe('flux-2-flex');
    expect(['flux-2-flex']).toContain(r.model);
  });

  it('an empty candidate set stays put rather than inventing a model', () => {
    const r = nextCreateModel({ tried: ['flux-1.1-pro'], candidates: [], costOf, rng });
    expect(r.model).toBeNull();
    expect(r.stamp).toBe('create_model_move:skip:exhausted');
  });

  // ── contract 3: DLT replay is frozen ────────────────────────────────

  it('never moves on a DLT replay', () => {
    const r = nextCreateModel({
      tried: ['flux-1.1-pro'],
      candidates: ['flux-2-flex', 'cheap'],
      costOf,
      frozen: true,
      rng,
    });
    expect(r.model).toBeNull();
    expect(r.stamp).toBe('create_model_move:skip:frozen');
  });

  // ── contract 4: every outcome is visible ────────────────────────────

  it('stamps every outcome, so a no-move is as traceable as a move', () => {
    const cases = [
      nextCreateModel({ tried: ['flux-1.1-pro'], candidates: ['flux-2-flex'], costOf, rng }),
      nextCreateModel({ tried: ['flux-1.1-pro'], candidates: [], costOf, rng }),
      nextCreateModel({ tried: [], candidates: ['flux-2-flex'], costOf, rng }),
      nextCreateModel({
        tried: ['flux-1.1-pro'],
        candidates: ['nano-banana-pro'],
        costOf,
        rng,
      }),
    ];
    for (const c of cases) expect(c.stamp).toMatch(/^create_model_move:/);
  });

  it('distinguishes "nothing affordable" from "nothing left" — they need different fixes', () => {
    const overCap = nextCreateModel({
      tried: ['flux-1.1-pro'],
      candidates: ['nano-banana-pro'],
      costOf,
      rng,
    });
    const exhausted = nextCreateModel({
      tried: ['flux-1.1-pro'],
      candidates: ['flux-1.1-pro'],
      costOf,
      rng,
    });
    expect(overCap.stamp).toContain('over_cap');
    expect(exhausted.stamp).toContain('exhausted');
  });

  it('stays put when there is no current model at all', () => {
    const r = nextCreateModel({ tried: [], candidates: ['flux-2-flex'], costOf, rng });
    expect(r.model).toBeNull();
    expect(r.stamp).toBe('create_model_move:skip:no_current');
  });

  it('is pure — repeated calls with the same input agree', () => {
    const args = {
      tried: ['flux-1.1-pro'],
      candidates: ['flux-2-flex', 'cheap'],
      costOf,
      rng,
    };
    expect(nextCreateModel(args)).toEqual(nextCreateModel(args));
  });
});
