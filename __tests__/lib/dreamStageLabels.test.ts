import { getDreamStageInfo } from '@/lib/dreamStageLabels';

describe('getDreamStageInfo', () => {
  it('maps each real render stage to a label + monotonic target', () => {
    const claimed = getDreamStageInfo('in_progress', 'claimed');
    const resolve = getDreamStageInfo('in_progress', 'resolve');
    const render = getDreamStageInfo('in_progress', 'flux_render');
    const swap = getDreamStageInfo('in_progress', 'face_swap');
    const upload = getDreamStageInfo('in_progress', 'upload');

    expect(resolve.label).toBe('Dreaming up your scene');
    expect(render.label).toBe('Painting your dream');
    expect(swap.label).toBe('Adding you in');
    expect(upload.label).toBe('Finishing up');

    // Targets strictly increase along the pipeline.
    expect(claimed.target).toBeLessThan(resolve.target);
    expect(resolve.target).toBeLessThan(render.target);
    expect(render.target).toBeLessThan(swap.target);
    expect(swap.target).toBeLessThan(upload.target);
    expect(upload.target).toBeLessThan(1);
  });

  it('completed always wins and fills to 1', () => {
    expect(getDreamStageInfo('completed', null).target).toBe(1);
    // Even if a stale stage rides along, completed status takes precedence.
    expect(getDreamStageInfo('completed', 'flux_render').target).toBe(1);
  });

  it('a bare queued job (no stage yet) shows the in-line state', () => {
    const q = getDreamStageInfo('queued', null);
    expect(q.label).toBe('In line…');
    expect(q.target).toBeGreaterThan(0);
    expect(q.target).toBeLessThan(0.18);
  });

  it('falls back gently for an unknown/absent stage', () => {
    const fallback = getDreamStageInfo('in_progress', null);
    expect(fallback.label).toBe('Dreaming…');
    expect(fallback.target).toBeGreaterThan(0);
    expect(getDreamStageInfo(undefined, 'some_future_stage').label).toBe('Dreaming…');
  });
});
