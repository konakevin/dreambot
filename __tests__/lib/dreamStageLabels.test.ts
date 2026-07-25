import {
  getDreamStageInfo,
  EARLY_LABELS,
  RENDER_LABELS,
  FACE_SWAP_LABELS,
} from '@/lib/dreamStageLabels';

describe('getDreamStageInfo', () => {
  it('maps each real render stage to a label + monotonic target', () => {
    const claimed = getDreamStageInfo('in_progress', 'claimed');
    const resolve = getDreamStageInfo('in_progress', 'resolve');
    const render = getDreamStageInfo('in_progress', 'flux_render');
    const swap = getDreamStageInfo('in_progress', 'face_swap');
    const upload = getDreamStageInfo('in_progress', 'upload');

    // The three expressive phases are pooled — the returned label is a static
    // placeholder from the pool (useDreamProgress swaps in the per-dream pick).
    expect(resolve.pool).toBe('early');
    expect(EARLY_LABELS).toContain(resolve.label);
    expect(render.pool).toBe('render');
    expect(RENDER_LABELS).toContain(render.label);
    expect(swap.pool).toBe('face_swap');
    expect(FACE_SWAP_LABELS).toContain(swap.label);
    // Upload is a single fixed label (no pool).
    expect(upload.label).toBe('Finishing up');
    expect(upload.pool).toBeUndefined();

    // Targets strictly increase along the pipeline.
    expect(claimed.target).toBeLessThan(resolve.target);
    expect(resolve.target).toBeLessThan(render.target);
    expect(render.target).toBeLessThan(swap.target);
    expect(swap.target).toBeLessThan(upload.target);
    expect(upload.target).toBeLessThan(1);
  });

  it('completed always wins, reads "Done", and fills to 1', () => {
    const done = getDreamStageInfo('completed', null);
    expect(done.label).toBe('Done');
    expect(done.target).toBe(1);
    // Even if a stale stage rides along, completed status takes precedence —
    // never a stray pooled phrase.
    const doneWithStaleStage = getDreamStageInfo('completed', 'face_swap');
    expect(doneWithStaleStage.label).toBe('Done');
    expect(doneWithStaleStage.pool).toBeUndefined();
    expect(doneWithStaleStage.target).toBe(1);
  });

  it('the opening phase (queued / claimed / resolve) all share the early pool', () => {
    for (const stage of [null, 'claimed', 'resolve'] as const) {
      const info = getDreamStageInfo(stage === null ? 'queued' : 'in_progress', stage);
      expect(info.pool).toBe('early');
      expect(EARLY_LABELS).toContain(info.label);
    }
    // A bare queued job (no stage yet) still creeps up from near-zero.
    const q = getDreamStageInfo('queued', null);
    expect(q.target).toBeGreaterThan(0);
    expect(q.target).toBeLessThan(0.18);
  });

  it('falls back to the early pool for an unknown/absent stage', () => {
    const fallback = getDreamStageInfo('in_progress', null);
    expect(fallback.pool).toBe('early');
    expect(EARLY_LABELS).toContain(fallback.label);
    expect(fallback.target).toBeGreaterThan(0);
    expect(getDreamStageInfo(undefined, 'some_future_stage').pool).toBe('early');
  });
});
