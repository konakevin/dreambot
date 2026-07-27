/** Locks the Dream Off voting rule: toggle on/off, never exceed the star cap. */

import { toggleStar } from '@/lib/dreamOffVote';

describe('toggleStar', () => {
  it('adds a star when under the cap', () => {
    expect(toggleStar([], 'a', 2)).toEqual(['a']);
    expect(toggleStar(['a'], 'b', 2)).toEqual(['a', 'b']);
  });
  it('removes a star that is already placed (even at cap)', () => {
    expect(toggleStar(['a', 'b'], 'a', 2)).toEqual(['b']);
  });
  it('no-ops (null) when adding past the cap', () => {
    expect(toggleStar(['a', 'b'], 'c', 2)).toBeNull();
  });
  it('respects a custom cap', () => {
    expect(toggleStar(['a'], 'b', 1)).toBeNull();
    expect(toggleStar(['a'], 'a', 1)).toEqual([]);
  });
});
