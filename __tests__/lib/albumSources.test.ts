/**
 * Which albums get Newest/Oldest and the calendar (months view), and which query the
 * photo detail screen pages for each grid (lib/albumSources.ts, ALBUM_DISCOVERY_PLAN.md).
 */
import { albumBrowse, viewerQuery } from '@/lib/albumSources';

describe('albumBrowse: sort + calendar per album', () => {
  it.each([
    ['your Posts', { type: 'own' as const }, 'posts'],
    ['Dreams · All', { type: 'dreams' as const }, 'dreams_all'],
    [
      'Dreams · Public',
      { type: 'dreams' as const, dreamsFilter: 'posted' as const },
      'dreams_posted',
    ],
    [
      'Dreams · Private',
      { type: 'dreams' as const, dreamsFilter: 'private' as const },
      'dreams_private',
    ],
    ['Saved · Bookmarked', { type: 'saved' as const }, 'saved'],
    ['Saved · Hearted', { type: 'liked' as const }, 'hearted'],
    ['Reposts', { type: 'reposts' as const, userId: 'u1' }, 'reposts'],
    ['a profile / bot · All', { type: 'user' as const, userId: 'u1' }, 'posts'],
  ])('%s sorts and has the calendar', (_label, source, scope) => {
    expect(albumBrowse(source)).toEqual({ sortable: true, monthsScope: scope });
  });

  it("a bot's Haven't seen sorts but has no calendar", () => {
    expect(albumBrowse({ type: 'user', userId: 'b1', mode: 'unseen' })).toEqual({
      sortable: true,
      monthsScope: null,
    });
  });

  it('a 🎲 shuffle draw neither sorts nor has the calendar', () => {
    expect(albumBrowse({ type: 'user', userId: 'b1', mode: 'shuffle', draw: 2 })).toEqual({
      sortable: false,
      monthsScope: null,
    });
  });

  it('a hashtag grid has neither', () => {
    expect(albumBrowse({ type: 'hashtag', tag: 'dragons' })).toEqual({
      sortable: false,
      monthsScope: null,
    });
  });
});

describe('viewerQuery: the photo detail screen pages the grid it came from', () => {
  it.each([
    [{ type: 'own' as const }, 'own'],
    [{ type: 'saved' as const }, 'saved'],
    [{ type: 'liked' as const }, 'liked'],
    [{ type: 'reposts' as const, userId: 'u1' }, 'reposts'],
    [{ type: 'dreams' as const, dreamsFilter: 'private' as const }, 'dreams'],
    [{ type: 'user' as const, userId: 'u1' }, 'user'],
    [{ type: 'user' as const, userId: 'b1', mode: 'all' as const }, 'user'],
    [{ type: 'user' as const, userId: 'b1', mode: 'unseen' as const }, 'unseen'],
    [{ type: 'hashtag' as const, tag: 'dragons' }, 'hashtag'],
  ])('%o → %s', (source, query) => {
    expect(viewerQuery(source)).toBe(query);
  });

  it("a 🎲 draw pages nothing (never the bot's whole album)", () => {
    expect(viewerQuery({ type: 'user', userId: 'b1', mode: 'shuffle', draw: 1 })).toBeNull();
  });

  it('no source (a notification or deep link) pages nothing', () => {
    expect(viewerQuery(null)).toBeNull();
  });
});
