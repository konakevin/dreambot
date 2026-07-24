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

  it('keeps CREEPING past the band end on overrun (never frozen) but stays below full', () => {
    // Past the estimate the fill no longer freezes at the band end — it creeps
    // asymptotically toward the band ceiling (face_swap ceil 0.92) so a slow swap
    // never looks stuck, while staying clearly below 1.0 (only real completion
    // fills to 1). Monotonic and bounded.
    const justPast = dreamProgressTarget('in_progress', 'face_swap', iso(T0), T0 + 60_000);
    const wayPast = dreamProgressTarget('in_progress', 'face_swap', iso(T0), T0 + 10 * 60_000);
    expect(justPast).toBeGreaterThan(0.8); // moved past the band end, not frozen
    expect(wayPast).toBeGreaterThan(justPast); // still advancing
    expect(wayPast).toBeLessThanOrEqual(0.92); // toward the ceiling, never beyond
    expect(wayPast).toBeLessThan(1); // an active ring never reads as done
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
