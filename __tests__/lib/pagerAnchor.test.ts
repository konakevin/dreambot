import { resolveAnchor } from '@/lib/pagerAnchor';

const keys = (s: string) => s.split('');

describe('resolveAnchor', () => {
  it('is stable when the anchored card is still at the same index (append, count patch)', () => {
    expect(resolveAnchor(keys('abcde'), keys('abcdefgh'), 'c', 2)).toEqual({ kind: 'stable' });
  });

  it('is stable when nothing is anchored yet or the list is empty', () => {
    expect(resolveAnchor(keys('abc'), keys('xyz'), null, 1)).toEqual({ kind: 'stable' });
    expect(resolveAnchor(keys('abc'), [], 'b', 1)).toEqual({ kind: 'stable' });
  });

  it('follows the card when an item above it is added or removed', () => {
    // pinned post prepended
    expect(resolveAnchor(keys('abcde'), keys('Pabcde'), 'c', 2)).toEqual({
      kind: 'follow',
      index: 3,
    });
    // an item above removed
    expect(resolveAnchor(keys('abcde'), keys('acde'), 'c', 2)).toEqual({
      kind: 'follow',
      index: 1,
    });
  });

  it('slides the next card into place when the viewed card is removed', () => {
    expect(resolveAnchor(keys('abcde'), keys('abde'), 'c', 2)).toEqual({
      kind: 'slide',
      index: 2,
      key: 'd',
    });
  });

  it('lands on the NEXT card when several are removed at once (block removes a whole user)', () => {
    // b, c, e removed; the card after c was d, now at index 1. Staying at index 2
    // would have skipped d.
    expect(resolveAnchor(keys('abcdef'), keys('adf'), 'c', 2)).toEqual({
      kind: 'slide',
      index: 1,
      key: 'd',
    });
  });

  it('lands on the new last card when the removed card was the last one', () => {
    expect(resolveAnchor(keys('abcd'), keys('abc'), 'd', 3)).toEqual({
      kind: 'slide',
      index: 2,
      key: 'c',
    });
  });

  it('lands on the first appended card when a page arrives in the same update as the removal', () => {
    expect(resolveAnchor(keys('abcd'), keys('abcxy'), 'd', 3)).toEqual({
      kind: 'slide',
      index: 3,
      key: 'x',
    });
  });

  it('lands on the next card when cards above sank out but the order is intact', () => {
    expect(resolveAnchor(keys('abcdefgh'), keys('defghijk'), 'c', 2)).toEqual({
      kind: 'slide',
      index: 0,
      key: 'd',
    });
  });

  it('goes to the TOP when the list is replaced (new seed), even with the index in range', () => {
    // The pop bug: the same pool of posts in a new order, viewed card gone. The old
    // logic stayed at index 2 and showed 'h', a post from further down.
    expect(resolveAnchor(keys('abcdefgh'), keys('dghefab'), 'c', 2)).toEqual({ kind: 'top' });
  });

  it('goes to the TOP when a re-sorted refetch drops the viewed card', () => {
    expect(resolveAnchor(keys('abcdefgh'), keys('fdgehijk'), 'c', 2)).toEqual({ kind: 'top' });
  });

  it('goes to the TOP when the list is replaced by an unrelated one', () => {
    expect(resolveAnchor(keys('abcdefghij'), keys('xyz'), 'h', 7)).toEqual({ kind: 'top' });
  });
});
