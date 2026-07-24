import { dreamProgressTarget } from '@/lib/dreamStageProgress';

const T0 = 1_700_000_000_000; // fixed base ms
const iso = (ms: number) => new Date(ms).toISOString();

describe('dreamProgressTarget', () => {
  it('completed always fills to 1', () => {
    expect(dreamProgressTarget('completed', 'flux_render', iso(T0), T0 + 999999)).toBe(1);
  });

  it('fills across the stage band over the estimate', () => {
    // face_swap band is [0.55, 0.80]. At stage start → band start.
    const atStart = dreamProgressTarget('in_progress', 'face_swap', iso(T0), T0);
    expect(atStart).toBeCloseTo(0.55, 5);
    // Partway through → between start and end, strictly increasing.
    const mid = dreamProgressTarget('in_progress', 'face_swap', iso(T0), T0 + 15000);
    expect(mid).toBeGreaterThan(0.55);
    expect(mid).toBeLessThan(0.8);
    const later = dreamProgressTarget('in_progress', 'face_swap', iso(T0), T0 + 22000);
    expect(later).toBeGreaterThan(mid);
  });

  it('HOLDS at the band end (well below full) when the stage overruns — never looks "done"', () => {
    // Way past the estimate — must clamp to the band end, never exceed it, and
    // that ceiling stays clearly below 1.0 so an active ring never reads as full.
    const overrun = dreamProgressTarget('in_progress', 'face_swap', iso(T0), T0 + 10 * 60_000);
    expect(overrun).toBeCloseTo(0.8, 5);
    expect(overrun).toBeLessThan(0.9);
  });

  it('advances monotonically across stages (render -> swap -> upload)', () => {
    const render = dreamProgressTarget('in_progress', 'flux_render', iso(T0), T0);
    const swap = dreamProgressTarget('in_progress', 'face_swap', iso(T0), T0);
    const upload = dreamProgressTarget('in_progress', 'upload', iso(T0), T0);
    expect(render).toBeLessThan(swap);
    expect(swap).toBeLessThan(upload);
    expect(upload).toBeLessThan(1);
  });

  it('queued (no stage) sits just below the first real stage; missing timing holds at band start', () => {
    expect(dreamProgressTarget('queued', null, null, T0)).toBeGreaterThan(0);
    expect(dreamProgressTarget('queued', null, null, T0)).toBeLessThan(0.15);
    // Known stage but no timestamp → hold at the band start (no motion, no crash).
    expect(dreamProgressTarget('in_progress', 'flux_render', null, T0)).toBeCloseTo(0.28, 5);
  });
});
