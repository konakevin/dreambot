/**
 * Tests for lib/responsive.ts — the helpers that gate every UI dimension in
 * the app. These look small but they're load-bearing: if the clamp math or
 * the device-class breakpoints silently break in a refactor, every screen
 * regresses on iPhone SE 3rd gen with no obvious symptom in dev (which uses
 * Pro Max by default).
 *
 * Pattern: the helpers read `Dimensions.get('window')` at MODULE LOAD time,
 * so testing at different screen sizes requires `jest.isolateModules` +
 * `jest.doMock` to re-load the module against a fresh mocked dimension.
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

// Real iPhone dimensions in points. SE 3rd gen is the smallest supported.
const SE = { width: 375, height: 667 };
const IPHONE_14 = { width: 390, height: 844 }; // base
const IPHONE_PRO_MAX = { width: 440, height: 932 };
const IPAD_MINI_PORTRAIT = { width: 744, height: 1133 };

describe('lib/responsive', () => {
  describe('verticalScale', () => {
    it('returns the input value at the iPhone 14 base (844pt)', () => {
      const { verticalScale } = loadModuleAt(IPHONE_14);
      expect(verticalScale(16)).toBe(16);
      expect(verticalScale(100)).toBe(100);
    });

    it('shrinks to ~79% on iPhone SE 3rd gen (667pt)', () => {
      const { verticalScale } = loadModuleAt(SE);
      // 16 * 667/844 = 12.64 → 13
      expect(verticalScale(16)).toBe(13);
      // 100 * 667/844 = 79.03 → 79
      expect(verticalScale(100)).toBe(79);
    });

    it('grows to ~110% on iPhone Pro Max (932pt)', () => {
      const { verticalScale } = loadModuleAt(IPHONE_PRO_MAX);
      // 16 * 932/844 = 17.67 → 18
      expect(verticalScale(16)).toBe(18);
      // 100 * 932/844 = 110.43 → 110
      expect(verticalScale(100)).toBe(110);
    });
  });

  describe('horizontalScale', () => {
    it('returns the input value at the iPhone 14 base (390pt)', () => {
      const { horizontalScale } = loadModuleAt(IPHONE_14);
      expect(horizontalScale(40)).toBe(40);
    });

    it('shrinks slightly on iPhone SE (375pt)', () => {
      const { horizontalScale } = loadModuleAt(SE);
      // 40 * 375/390 = 38.46 → 38
      expect(horizontalScale(40)).toBe(38);
    });
  });

  describe('fontScale', () => {
    it('returns the input value at the iPhone 14 base', () => {
      const { fontScale } = loadModuleAt(IPHONE_14);
      expect(fontScale(16)).toBe(16);
    });

    it('CLAMPS to a 0.85 floor on SE (so 14pt body text never drops below ~12)', () => {
      const { fontScale } = loadModuleAt(SE);
      // raw ratio = 667/844 = 0.79, which is BELOW the 0.85 floor.
      // 16 * 0.85 = 13.6 → 14 (not 13 like verticalScale would give).
      expect(fontScale(16)).toBe(14);
      // 44pt hero title: 44 * 0.85 = 37.4 → 37 — still legible-large on SE.
      expect(fontScale(44)).toBe(37);
    });

    it('CLAMPS to a 1.10 ceiling on Pro Max (so titles do not balloon)', () => {
      // Hypothetical very-tall phone where raw ratio > 1.10.
      const veryTall = { width: 440, height: 1100 };
      const { fontScale } = loadModuleAt(veryTall);
      // raw ratio = 1100/844 = 1.303, above the 1.10 ceiling.
      // 16 * 1.10 = 17.6 → 18 (not 21 like verticalScale would give).
      expect(fontScale(16)).toBe(18);
    });

    it('scales linearly inside the clamp range', () => {
      // Inside [0.85, 1.10], fontScale should match verticalScale's ratio.
      const mid = { width: 400, height: 880 }; // ratio 880/844 = 1.043 (in range)
      const { fontScale } = loadModuleAt(mid);
      // 16 * 1.043 = 16.68 → 17
      expect(fontScale(16)).toBe(17);
    });
  });

  describe('verticalScaleClamped', () => {
    it('clamps below the floor on small devices', () => {
      const { verticalScaleClamped } = loadModuleAt(SE);
      // verticalScale(160) = 126 on SE — clamp floor 120 → 126 (no clamp).
      expect(verticalScaleClamped(160, 120, 180)).toBe(126);
    });

    it('clamps to the floor when verticalScale dips below it', () => {
      // Force a smaller-than-SE viewport so verticalScale(160) < 120.
      const tiny = { width: 320, height: 568 }; // iPhone 5/SE 1st gen
      const { verticalScaleClamped } = loadModuleAt(tiny);
      // verticalScale(160) = 160 * 568/844 = 107.7 → 108. Floor 120 → 120.
      expect(verticalScaleClamped(160, 120, 180)).toBe(120);
    });

    it('clamps to the ceiling on very tall devices', () => {
      const veryTall = { width: 440, height: 1200 };
      const { verticalScaleClamped } = loadModuleAt(veryTall);
      // verticalScale(160) = 160 * 1200/844 = 227.5 → 228. Ceiling 180 → 180.
      expect(verticalScaleClamped(160, 120, 180)).toBe(180);
    });
  });

  describe('clamp', () => {
    it('pure math, no device coupling', () => {
      const { clamp } = loadModuleAt(IPHONE_14);
      expect(clamp(5, 0, 10)).toBe(5);
      expect(clamp(-5, 0, 10)).toBe(0);
      expect(clamp(15, 0, 10)).toBe(10);
      expect(clamp(0, 0, 10)).toBe(0);
      expect(clamp(10, 0, 10)).toBe(10);
    });
  });

  describe('heightPercent / widthPercent', () => {
    it('returns a percentage of the captured screen dimensions', () => {
      const { heightPercent, widthPercent } = loadModuleAt(SE);
      expect(heightPercent(50)).toBe(334); // 667 * 0.5
      expect(widthPercent(50)).toBe(188); // 375 * 0.5
    });
  });

  describe('space tokens', () => {
    it('exposes a 4-step scale aligned to verticalScale(8/12/16/24/32)', () => {
      const { space, verticalScale } = loadModuleAt(IPHONE_14);
      expect(space.xs).toBe(verticalScale(8));
      expect(space.sm).toBe(verticalScale(12));
      expect(space.md).toBe(verticalScale(16));
      expect(space.lg).toBe(verticalScale(24));
      expect(space.xl).toBe(verticalScale(32));
    });

    it('scales with the device — SE tokens are smaller than Pro Max tokens', () => {
      const smallSpace = loadModuleAt(SE).space;
      const largeSpace = loadModuleAt(IPHONE_PRO_MAX).space;
      expect(smallSpace.md).toBeLessThan(largeSpace.md);
    });
  });

  describe('useDeviceClass breakpoints', () => {
    // The hook uses useWindowDimensions(), which our mock returns synchronously.
    // We don't need to render a component — just call the hook in a wrapper.
    function classAt(d: Dimensions) {
      const { useDeviceClass } = loadModuleAt(d);
      return useDeviceClass();
    }

    it('flags isSmall=true for iPhone SE 3rd gen (height 667 < 700)', () => {
      const c = classAt(SE);
      expect(c.isSmall).toBe(true);
      expect(c.isLarge).toBe(false);
      expect(c.isTablet).toBe(false);
    });

    it('flags isSmall=false / isLarge=false for iPhone 14 (height 844)', () => {
      const c = classAt(IPHONE_14);
      expect(c.isSmall).toBe(false);
      expect(c.isLarge).toBe(false);
      expect(c.isTablet).toBe(false);
    });

    it('flags isLarge=true for iPhone Pro Max (height 932 >= 900)', () => {
      const c = classAt(IPHONE_PRO_MAX);
      expect(c.isSmall).toBe(false);
      expect(c.isLarge).toBe(true);
      expect(c.isTablet).toBe(false);
    });

    it('flags isTablet=true for iPad mini portrait (width 744 >= 600)', () => {
      const c = classAt(IPAD_MINI_PORTRAIT);
      expect(c.isTablet).toBe(true);
      // iPad mini portrait also has tall height — isLarge true is correct.
      expect(c.isLarge).toBe(true);
    });

    it('exposes the raw width/height values from useWindowDimensions', () => {
      const c = classAt(SE);
      expect(c.height).toBe(667);
      expect(c.width).toBe(375);
    });

    it('does NOT flag iPhone Pro Max as iPad (width 440 < 600)', () => {
      const c = classAt(IPHONE_PRO_MAX);
      expect(c.isTablet).toBe(false);
    });
  });
});
