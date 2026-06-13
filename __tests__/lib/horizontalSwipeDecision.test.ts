/**
 * Tests for horizontalSwipeDecision — the ratio-based directional gate that
 * decides vertical-scroll vs horizontal-action for the feed card swipes.
 *
 *   - vertical-dominant drag → 'fail' (scroll wins)
 *   - horizontal-dominant drag past minDistance → 'activate' (correct sign)
 *   - wrong-direction horizontal → 'fail'
 *   - small/ambiguous drag → 'undetermined'
 */

import {
  horizontalSwipeDecision,
  type SwipeDirection,
} from '@/hooks/gestures/horizontalSwipeDecision';

const MIN = 12;
const RATIO = 1.2;

function decide(dx: number, dy: number, direction: SwipeDirection = 'left') {
  return horizontalSwipeDecision({ dx, dy, minDistance: MIN, ratio: RATIO, direction });
}

describe('horizontalSwipeDecision', () => {
  describe('undetermined zone (below minDistance)', () => {
    it('returns undetermined for tiny movements on both axes', () => {
      expect(decide(0, 0)).toBe('undetermined');
      expect(decide(-5, 2)).toBe('undetermined');
      expect(decide(8, -8)).toBe('undetermined');
      expect(decide(-11, 0)).toBe('undetermined'); // just under minDistance
    });
  });

  describe('vertical-dominant → fail (let the feed scroll)', () => {
    it('fails when vertical clears minDistance and exceeds horizontal', () => {
      expect(decide(0, 20)).toBe('fail');
      expect(decide(0, -20)).toBe('fail');
      expect(decide(-10, 20)).toBe('fail'); // some left drift but vertical wins
      expect(decide(14, -30)).toBe('fail');
    });

    it('fails only when vertical clears the ratio, not on a mere tie', () => {
      // |dy| > |dx| but within the ratio band → still waiting (not stolen by scroll)
      expect(decide(-15, 16)).toBe('undetermined');
      // |dy| >= ratio*|dx| → vertical clearly wins → fail
      expect(decide(-12, 16)).toBe('fail'); // 16 >= 1.2*12=14.4
    });

    it('an exact 45° drag stays undetermined (neither axis clears the ratio)', () => {
      expect(decide(-20, 20)).toBe('undetermined');
    });
  });

  describe('horizontal-dominant → activate (correct direction)', () => {
    it('activates a clear leftward swipe', () => {
      expect(decide(-20, 0, 'left')).toBe('activate');
      expect(decide(-30, 10, 'left')).toBe('activate'); // 30 >= 1.2*10=12
      expect(decide(-50, 20, 'left')).toBe('activate'); // 50 >= 1.2*20=24
    });

    it('activates a clear rightward swipe', () => {
      expect(decide(20, 0, 'right')).toBe('activate');
      expect(decide(30, -10, 'right')).toBe('activate');
    });

    it("activates either way when direction is 'horizontal'", () => {
      expect(decide(-20, 0, 'horizontal')).toBe('activate');
      expect(decide(20, 0, 'horizontal')).toBe('activate');
    });
  });

  describe('wrong-direction horizontal → fail', () => {
    it('fails a rightward drag on a left-only gesture', () => {
      expect(decide(25, 0, 'left')).toBe('fail');
    });
    it('fails a leftward drag on a right-only gesture', () => {
      expect(decide(-25, 0, 'right')).toBe('fail');
    });
  });

  describe('ratio boundary', () => {
    it('does not activate when horizontal only marginally beats vertical', () => {
      // dx=-15, dy=13: |dx|=15 >= min(12) but 15 < 1.2*13=15.6 → not yet horizontal,
      // and vertical (13) < horizontal (15) so not a vertical fail → undetermined.
      expect(decide(-15, 13, 'left')).toBe('undetermined');
    });
    it('activates exactly at the ratio threshold', () => {
      // dx=-18, dy=15: 18 >= 1.2*15=18 → activate
      expect(decide(-18, 15, 'left')).toBe('activate');
    });
  });
});
