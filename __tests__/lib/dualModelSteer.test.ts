/** steerDualModel — couples avoid flux-1.1-pro when a proven sibling exists (dualModelSteer.ts). */
import {
  steerDualModel,
  DUAL_STEER_ORDER,
  LAST_RESORT,
  FLUX_11_PRO,
  FLUX_11_PRO_ULTRA,
} from '@engine/dualModelSteer';

const BANNED = new Set(['black-forest-labs/flux-2-dev', 'black-forest-labs/flux-2-pro']);
// The real nightly ban list on 2026-09-05 (gpt-image-2 wide-aspect + slow; gemini + flux-2-pro cheesy).
const NIGHTLY_BANS = new Set([
  'black-forest-labs/flux-2-dev',
  'openai/gpt-image-2',
  'black-forest-labs/flux-2-pro',
  'google/gemini-2-image',
]);
const CANVAS = [
  'black-forest-labs/flux-2-max',
  'google/gemini-2-image',
  'black-forest-labs/flux-2-flex',
  FLUX_11_PRO,
  'openai/gpt-image-2',
  FLUX_11_PRO_ULTRA,
];
const GLAMOUR = [
  FLUX_11_PRO,
  'black-forest-labs/flux-2-pro',
  'google/gemini-2-image',
  'openai/gpt-image-2',
];

describe('steerDualModel', () => {
  it('is a no-op when disabled (ships inert)', () => {
    expect(steerDualModel(FLUX_11_PRO, CANVAS, BANNED, false)).toEqual({
      model: FLUX_11_PRO,
      stamp: null,
    });
  });
  it('leaves a non-1.1-pro pick alone', () => {
    expect(steerDualModel('google/gemini-2-image', CANVAS, BANNED, true)).toEqual({
      model: 'google/gemini-2-image',
      stamp: null,
    });
  });
  it('steers 1.1-pro → flux-2-flex when the medium allows it, with a stamp', () => {
    expect(steerDualModel(FLUX_11_PRO, CANVAS, BANNED, true)).toEqual({
      model: 'black-forest-labs/flux-2-flex',
      stamp: 'dual_model_steer:flux-1.1-pro→flux-2-flex',
    });
  });
  it('steers Ultra the same way', () => {
    expect(steerDualModel(FLUX_11_PRO_ULTRA, CANVAS, BANNED, true).model).toBe(
      'black-forest-labs/flux-2-flex'
    );
  });
  it('falls down the order when flex is not allowed and gemini is not banned', () => {
    expect(steerDualModel(FLUX_11_PRO, GLAMOUR, BANNED, true).model).toBe('google/gemini-2-image');
  });
  it('never picks a banned model even if allowed (skips gemini under the real nightly bans → max)', () => {
    const noFlex = [FLUX_11_PRO, 'google/gemini-2-image', 'black-forest-labs/flux-2-max'];
    expect(steerDualModel(FLUX_11_PRO, noFlex, NIGHTLY_BANS, true).model).toBe(
      'black-forest-labs/flux-2-max'
    );
  });
  it('LAST RESORT: glamour / vintage_film under the real nightly bans → flex outside the allowed set, visible stamp', () => {
    expect(steerDualModel(FLUX_11_PRO, GLAMOUR, NIGHTLY_BANS, true)).toEqual({
      model: LAST_RESORT,
      stamp: 'dual_model_steer:flux-1.1-pro→flux-2-flex(last_resort)',
    });
  });
  it('if even the last resort is banned, the pick stays and none_allowed is stamped', () => {
    const bans = new Set([...NIGHTLY_BANS, LAST_RESORT, 'black-forest-labs/flux-2-max']);
    expect(steerDualModel(FLUX_11_PRO, GLAMOUR, bans, true)).toEqual({
      model: FLUX_11_PRO,
      stamp: 'dual_model_steer:none_allowed',
    });
  });
  it('order is reliability-then-cost: flex, gemini, max, gpt-image-2; last resort is flex', () => {
    expect(DUAL_STEER_ORDER).toEqual([
      'black-forest-labs/flux-2-flex',
      'google/gemini-2-image',
      'black-forest-labs/flux-2-max',
      'openai/gpt-image-2',
    ]);
    expect(LAST_RESORT).toBe('black-forest-labs/flux-2-flex');
  });
});
