/**
 * fontScale() takes the height ratio to the iPhone 14 base, capped by the width ratio on screens that
 * are narrow for their height (20:9 Android phones, a foldable's cover screen). The cap must never move a
 * single iPhone or iPad font size: this locks every size from 6 to 96pt on every current iPhone family
 * to the old height-only formula, and checks that narrow screens actually get smaller text.
 */

type Dimensions = { width: number; height: number };

function loadModuleAt(d: Dimensions): typeof import('@/lib/responsive') {
  let mod!: typeof import('@/lib/responsive');
  jest.isolateModules(() => {
    jest.doMock('react-native', () => ({
      Dimensions: { get: () => d },
      useWindowDimensions: () => d,
    }));
    mod = require('@/lib/responsive');
  });
  return mod;
}

/** The pre-2026-09-27 formula: height ratio only, clamped to 0.85-1.10. */
const heightOnly = (d: Dimensions, size: number) =>
  Math.round(size * Math.max(0.85, Math.min(1.1, d.height / 844)));

const APPLE: [string, Dimensions][] = [
  ['iPhone SE (3rd gen)', { width: 375, height: 667 }],
  ['iPhone 13 mini / X / 11 Pro', { width: 375, height: 812 }],
  ['iPhone 12 / 13 / 14', { width: 390, height: 844 }],
  ['iPhone 14 Pro / 15 / 16', { width: 393, height: 852 }],
  ['iPhone 16 Pro', { width: 402, height: 874 }],
  ['iPhone Plus / Pro Max', { width: 430, height: 932 }],
  ['iPhone 16 Pro Max', { width: 440, height: 956 }],
  ['iPad mini', { width: 744, height: 1133 }],
  ['iPad (10th gen)', { width: 820, height: 1180 }],
];

describe('fontScale width cap', () => {
  it.each(APPLE)('%s: every size from 6 to 96pt is unchanged', (_name, d) => {
    const { fontScale } = loadModuleAt(d);
    for (let size = 6; size <= 96; size++) {
      expect({ size, got: fontScale(size) }).toEqual({ size, got: heightOnly(d, size) });
    }
  });

  it('iPhone 14 is exactly the design base', () => {
    const { fontScaleRatio } = loadModuleAt({ width: 390, height: 844 });
    expect(fontScaleRatio(390, 844)).toBe(1);
  });

  it('a foldable cover screen (344x882) gets smaller text than the height alone gives', () => {
    const d = { width: 344, height: 882 };
    const { fontScale } = loadModuleAt(d);
    expect(heightOnly(d, 16)).toBe(17);
    expect(fontScale(16)).toBe(14);
  });

  it('a narrow 20:9 Android phone (360x800) is limited by its width', () => {
    const { fontScaleRatio } = loadModuleAt({ width: 360, height: 800 });
    const r = fontScaleRatio(360, 800);
    expect(r).toBeLessThan(800 / 844);
    expect(r).toBeCloseTo((360 / 390) * 1.01, 6);
  });

  it('still clamps to 0.85-1.10', () => {
    const { fontScaleRatio } = loadModuleAt({ width: 390, height: 844 });
    expect(fontScaleRatio(300, 500)).toBe(0.85);
    expect(fontScaleRatio(900, 1400)).toBe(1.1);
  });
});
