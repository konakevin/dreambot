import { create } from 'zustand';

interface AlbumStore {
  ids: string[];
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
  clearAlbum: () => void;
  setCurrentPostId: (id: string | null) => void;
}

export const useAlbumStore = create<AlbumStore>((set) => ({
  ids: [],
  currentPostId: null,
  setAlbum: (ids) => set({ ids }),
  clearAlbum: () => set({ ids: [] }),
  setCurrentPostId: (id) => set({ currentPostId: id }),
}));
