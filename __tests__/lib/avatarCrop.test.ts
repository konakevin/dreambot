import {
  AVATAR_MAX_ZOOM,
  baseScale,
  clampCrop,
  cropRect,
  initialCrop,
  maxZoom,
  offsetLimits,
  panStep,
  pinchStep,
} from '@/lib/avatarCrop';

// A real dream is 768×1664; the frame is ~340pt on an iPhone.
const DREAM = { width: 768, height: 1664 };
const PHOTO = { width: 3024, height: 4032 };
const FRAME = 340;

describe('zoom limits', () => {
  it('stops a dream at 3x so the crop keeps 256 source pixels', () => {
    expect(maxZoom(DREAM)).toBe(3);
  });
  it('caps big camera photos at the hard maximum', () => {
    expect(maxZoom(PHOTO)).toBe(AVATAR_MAX_ZOOM);
  });
  it('never goes below 1 for a tiny picture', () => {
    expect(maxZoom({ width: 100, height: 100 })).toBe(1);
  });
});

describe('at zoom 1 a tall dream only moves up and down', () => {
  it('has no sideways room and plenty of vertical room', () => {
    const lim = offsetLimits(DREAM, FRAME, 1);
    expect(lim.x).toBe(0);
    expect(lim.y).toBeGreaterThan(0);
  });
  it('ignores a sideways drag', () => {
    const next = panStep(DREAM, FRAME, { zoom: 1, x: 0, y: 0 }, 80, 30);
    expect(next.x).toBe(0);
    expect(next.y).toBe(30);
  });
  it('zooming in opens up sideways room', () => {
    expect(offsetLimits(DREAM, FRAME, 2).x).toBeGreaterThan(0);
  });
});

describe('clamping', () => {
  it('never lets the frame show past the picture edge', () => {
    const c = clampCrop(DREAM, FRAME, { zoom: 1, x: 0, y: 99999 });
    expect(c.y).toBe(offsetLimits(DREAM, FRAME, 1).y);
  });
  it('pulls zoom back inside 1..max', () => {
    expect(clampCrop(DREAM, FRAME, { zoom: 0.2, x: 0, y: 0 }).zoom).toBe(1);
    expect(clampCrop(DREAM, FRAME, { zoom: 10, x: 0, y: 0 }).zoom).toBe(3);
  });
});

describe('initialCrop', () => {
  it('centres a photo', () => {
    expect(initialCrop(PHOTO, FRAME, 0.5)).toEqual({ zoom: 1, x: 0, y: 0 });
  });
  it('starts a dream above the middle (picture moved down)', () => {
    const c = initialCrop(DREAM, FRAME, 0.4);
    expect(c.y).toBeGreaterThan(0);
    // the frame's centre lands on 40% of the height
    const r = cropRect(DREAM, FRAME, c);
    expect((r.originY + r.height / 2) / DREAM.height).toBeCloseTo(0.4, 2);
  });
});

describe('pinchStep', () => {
  it('keeps the point under the fingers still', () => {
    const start = { zoom: 1, x: 0, y: 0 };
    const focal = { x: 0, y: -100 }; // fingers above the frame centre
    const s0 = baseScale(DREAM, FRAME);
    // source point under the fingers before
    const before = DREAM.height / 2 + (focal.y - start.y) / (s0 * start.zoom);
    const next = pinchStep(DREAM, FRAME, start, 2, focal);
    const after = DREAM.height / 2 + (focal.y - next.y) / (s0 * next.zoom);
    expect(next.zoom).toBe(2);
    expect(after).toBeCloseTo(before, 6);
  });
  it('stops at the maximum zoom', () => {
    const next = pinchStep(DREAM, FRAME, { zoom: 2.5, x: 0, y: 0 }, 4, { x: 0, y: 0 });
    expect(next.zoom).toBe(3);
  });
});

describe('cropRect', () => {
  it('at zoom 1, centred, takes the full width of a dream', () => {
    const r = cropRect(DREAM, FRAME, { zoom: 1, x: 0, y: 0 });
    expect(r.width).toBe(768);
    expect(r.height).toBe(768);
    expect(r.originX).toBe(0);
    expect(r.originY).toBe((1664 - 768) / 2);
  });
  it('at zoom 2 takes half the width', () => {
    const r = cropRect(DREAM, FRAME, { zoom: 2, x: 0, y: 0 });
    expect(r.width).toBe(384);
  });
  it('dragging the picture down shows higher up in it', () => {
    const lim = offsetLimits(DREAM, FRAME, 1);
    const r = cropRect(DREAM, FRAME, { zoom: 1, x: 0, y: lim.y });
    expect(r.originY).toBe(0);
  });
  it('always stays inside the picture, even for out-of-range input', () => {
    for (const state of [
      { zoom: 3, x: 9999, y: -9999 },
      { zoom: 0.1, x: -9999, y: 9999 },
      { zoom: 2.7, x: 123.4, y: -56.7 },
    ]) {
      for (const pic of [DREAM, PHOTO, { width: 1000, height: 600 }]) {
        const r = cropRect(pic, FRAME, state);
        expect(r.width).toBe(r.height);
        expect(r.originX).toBeGreaterThanOrEqual(0);
        expect(r.originY).toBeGreaterThanOrEqual(0);
        expect(r.originX + r.width).toBeLessThanOrEqual(pic.width);
        expect(r.originY + r.height).toBeLessThanOrEqual(pic.height);
      }
    }
  });
});
