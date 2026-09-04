import {
  resizeBilinear,
  placeOverlay,
  applyScrim,
  blendOver,
  compositePostcard,
  DEFAULT_POSTCARD_LAYOUT,
  type RgbaImage,
} from '@engine/postcardComposite';

const solid = (w: number, h: number, rgba: [number, number, number, number]): RgbaImage => {
  const data = new Uint8Array(w * h * 4);
  for (let i = 0; i < w * h; i++) data.set(rgba, i * 4);
  return { data, width: w, height: h };
};
const px = (img: RgbaImage, x: number, y: number) =>
  Array.from(img.data.slice((y * img.width + x) * 4, (y * img.width + x) * 4 + 4));

describe('resizeBilinear', () => {
  it('keeps a solid colour solid and hits the requested size', () => {
    const out = resizeBilinear(solid(10, 6, [200, 100, 50, 255]), 25, 15);
    expect([out.width, out.height]).toEqual([25, 15]);
    expect(px(out, 0, 0)).toEqual([200, 100, 50, 255]);
    expect(px(out, 24, 14)).toEqual([200, 100, 50, 255]);
  });
  it('returns the same image when the size is unchanged', () => {
    const src = solid(4, 4, [1, 2, 3, 4]);
    expect(resizeBilinear(src, 4, 4)).toBe(src);
  });
});

describe('placeOverlay', () => {
  it('centres horizontally and anchors bottom with the margin', () => {
    const p = placeOverlay(
      { width: 1000, height: 1500 },
      { width: 800, height: 200 },
      DEFAULT_POSTCARD_LAYOUT
    );
    expect(p.x).toBe(100);
    expect(p.y).toBe(1500 - 200 - 75); // 5% margin of 1500 = 75
  });
  it('anchors top with the margin', () => {
    const p = placeOverlay(
      { width: 1000, height: 1500 },
      { width: 800, height: 200 },
      { ...DEFAULT_POSTCARD_LAYOUT, anchor: 'top' }
    );
    expect(p.y).toBe(75);
  });
  it('never places the overlay outside the base', () => {
    const p = placeOverlay(
      { width: 100, height: 100 },
      { width: 100, height: 100 },
      DEFAULT_POSTCARD_LAYOUT
    );
    expect(p).toEqual({ x: 0, y: 0 });
  });
});

describe('applyScrim', () => {
  it('darkens the band fully, feathers toward the interior, leaves the far side untouched', () => {
    const img = solid(4, 100, [200, 200, 200, 255]);
    applyScrim(img, { y: 80, height: 20 }, 'bottom', 0.5, 20);
    expect(px(img, 0, 90)[0]).toBe(100); // inside band: ×0.5
    expect(px(img, 0, 0)[0]).toBe(200); // top of image untouched
    const mid = px(img, 0, 70)[0]; // inside the feather
    expect(mid).toBeGreaterThan(100);
    expect(mid).toBeLessThan(200);
    expect(px(img, 0, 99)[3]).toBe(255); // alpha untouched
  });
});

describe('blendOver', () => {
  it('fully opaque overlay replaces, transparent leaves the base, half blends', () => {
    const base = solid(3, 1, [0, 0, 0, 255]);
    const ov: RgbaImage = {
      data: new Uint8Array([255, 255, 255, 255, 255, 255, 255, 0, 255, 255, 255, 128]),
      width: 3,
      height: 1,
    };
    blendOver(base, ov, 0, 0);
    expect(px(base, 0, 0)).toEqual([255, 255, 255, 255]);
    expect(px(base, 1, 0)).toEqual([0, 0, 0, 255]);
    expect(px(base, 2, 0)[0]).toBe(128);
  });
  it('clips an overlay that hangs off the edge', () => {
    const base = solid(2, 2, [0, 0, 0, 255]);
    blendOver(base, solid(2, 2, [255, 0, 0, 255]), 1, 1);
    expect(px(base, 0, 0)).toEqual([0, 0, 0, 255]);
    expect(px(base, 1, 1)).toEqual([255, 0, 0, 255]);
  });
});

describe('compositePostcard', () => {
  it('scales the overlay to widthPct, anchors it, does not mutate the base, and reports placement', () => {
    const base = solid(1000, 1500, [120, 120, 120, 255]);
    const overlay = solid(500, 100, [255, 0, 0, 255]);
    const { image, placed } = compositePostcard(base, overlay, {
      anchor: 'bottom',
      widthPct: 0.8,
      marginPct: 0.05,
      scrim: false,
    });
    expect(placed).toEqual({ x: 100, y: 1500 - 160 - 75, width: 800, height: 160 });
    expect(px(image, 500, placed.y + 80)).toEqual([255, 0, 0, 255]);
    expect(px(base, 500, placed.y + 80)).toEqual([120, 120, 120, 255]); // base untouched
    expect(px(image, 500, 10)).toEqual([120, 120, 120, 255]); // far from the band untouched
  });
  it('with scrim the band behind a transparent overlay is darker than the far side', () => {
    const base = solid(400, 600, [200, 200, 200, 255]);
    const overlay = solid(200, 40, [0, 0, 0, 0]); // fully transparent → only the scrim shows
    const { image, placed } = compositePostcard(base, overlay, DEFAULT_POSTCARD_LAYOUT);
    expect(px(image, 200, placed.y + 20)[0]).toBeLessThan(200);
    expect(px(image, 200, 5)[0]).toBe(200);
  });
});
