/**
 * The album store hands the photo detail screen the grid's source AND its sort + month
 * album, so the viewer pages the same list the grid shows (the Oldest / month-album
 * swipe bug, 2026-09-26).
 */
import { useAlbumStore } from '@/store/album';

describe('album store: source + sort/month', () => {
  beforeEach(() => {
    useAlbumStore.getState().clearAlbum();
  });

  it('a tile tap stores the grid sort and month with the source', () => {
    useAlbumStore
      .getState()
      .setAlbumSource({ type: 'saved' }, { sort: 'oldest', month: '2026-03-01' });
    const s = useAlbumStore.getState();
    expect(s.albumSource).toEqual({ type: 'saved' });
    expect(s.albumOpts).toEqual({ sort: 'oldest', month: '2026-03-01' });
  });

  it('a source set without options (a notification open) resets them', () => {
    const store = useAlbumStore.getState();
    store.setAlbumSource({ type: 'own' }, { sort: 'oldest', month: '2026-03-01' });
    store.setAlbumSource(null);
    expect(useAlbumStore.getState().albumOpts).toEqual({});
  });

  it('clearAlbum resets them', () => {
    const store = useAlbumStore.getState();
    store.setAlbumSource({ type: 'liked' }, { sort: 'oldest', month: null });
    store.clearAlbum();
    expect(useAlbumStore.getState().albumSource).toBeNull();
    expect(useAlbumStore.getState().albumOpts).toEqual({});
  });
});
