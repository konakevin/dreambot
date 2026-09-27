import { create } from 'zustand';
import type { DreamPostItem } from '@/components/DreamCard';
import type { PostGridSource } from '@/components/PostGrid';
import type { AlbumQueryOpts } from '@/lib/albumPaging';

interface AlbumStore {
  ids: string[];
  /**
   * Full posts array stashed by PostTile on tap — read from TanStack cache
   * of the source grid query (useUserPosts / usePublicProfilePosts /
   * useFavoritePosts / useMyDreams). The grid already has all loaded pages
   * in memory; reusing them eliminates the redundant useAlbumPosts query
   * that was causing the ~1s lag + swap-in flicker. PhotoDetailScreen reads
   * this on mount, then re-subscribes to the source query (via albumSource)
   * to paginate further as the user scrolls.
   */
  posts: DreamPostItem[];
  /**
   * Which grid source produced `posts` — lets the photo detail screen
   * reuse the same TanStack query (with its fetchNextPage) so the user
   * can scroll past the grid's currently-loaded pages without hitting
   * the end of the array.
   */
  albumSource: PostGridSource | null;
  /**
   * The grid's Newest/Oldest + month album at tap time, so the photo detail screen
   * re-subscribes to the query in the SAME order (a different sort or month is a
   * different cache entry, and paging the wrong one reshuffles what you swipe through).
   */
  albumOpts: AlbumQueryOpts;
  /**
   * The post the user is currently focused on inside an album/detail view.
   * Updated when a tile is tapped (initial post) and as the user scrolls
   * through the FullScreenFeed (onIndexChange). Read by PostGrid on focus
   * return so the grid can auto-scroll to the row containing this post.
   * Eliminates the "lose your place" feeling when swiping back from a
   * deep scroll in detail view.
   */
  currentPostId: string | null;
  setAlbum: (ids: string[]) => void;
  setAlbumPosts: (posts: DreamPostItem[]) => void;
  setAlbumSource: (source: PostGridSource | null, opts?: AlbumQueryOpts) => void;
  setCurrentPostId: (id: string | null) => void;
  clearAlbum: () => void;
}

export const useAlbumStore = create<AlbumStore>((set) => ({
  ids: [],
  posts: [],
  albumSource: null,
  albumOpts: {},
  currentPostId: null,
  setAlbum: (ids) => set({ ids }),
  setAlbumPosts: (posts) => set({ posts }),
  setAlbumSource: (source, opts = {}) => set({ albumSource: source, albumOpts: opts }),
  setCurrentPostId: (id) => set({ currentPostId: id }),
  clearAlbum: () =>
    set({ ids: [], posts: [], albumSource: null, albumOpts: {}, currentPostId: null }),
}));
