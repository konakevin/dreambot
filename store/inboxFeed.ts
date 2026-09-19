import { create } from 'zustand';

/** The fullscreen inbox (app/inboxFeed.tsx) reports the row it is on so the inbox list can re-anchor on back. */
interface InboxFeedStore {
  currentGroupKey: string | null;
  setCurrentGroupKey: (key: string | null) => void;
}

export const useInboxFeedStore = create<InboxFeedStore>((set) => ({
  currentGroupKey: null,
  setCurrentGroupKey: (key) => set({ currentGroupKey: key }),
}));
