import { create } from 'zustand';

export interface LocalStreak {
  count: number;
  streakType: 'rad' | 'bad' | null;
  username: string;
  avatarUrl: string | null;
  userRank: string | null;
}

// Mirrors FeedItem shape — defined here to avoid circular imports
export interface PendingPost {
  id: string;
  user_id: string;
  categories: string[];
  image_url: string;
  media_type: 'image' | 'video';
  thumbnail_url: string | null;
  width: number | null;
  height: number | null;
  caption: string | null;
  created_at: string;
  total_votes: number;
  rad_votes: number;
  bad_votes: number;
  username: string;
  avatar_url: string | null;
}

interface FeedStore {
  resetToken: number;
  bumpReset: () => void;
  refreshToken: number;
  bumpRefresh: () => void;
  pendingPost: PendingPost | null;
  setPendingPost: (post: PendingPost | null) => void;
  // Votes cast outside the feed screen (e.g. photo detail view)
  externalVotes: Map<string, 'rad' | 'bad'>;
  addExternalVote: (uploadId: string, vote: 'rad' | 'bad') => void;
  // Optimistic streak data — overrides server values during active session
  localStreaks: Map<string, LocalStreak>;
  updateStreak: (friend: { username: string; avatar_url: string | null; user_rank: string | null }, matched: boolean, serverStreak: number, voteType: 'rad' | 'bad') => void;
  clearLocalStreaks: () => void;
}

// resetToken — wipes deck + refetches (used after a new upload)
// refreshToken — refetches feed without wiping session votes (used on tab press)
export const useFeedStore = create<FeedStore>((set) => ({
  resetToken: 0,
  bumpReset: () => set((s) => ({ resetToken: s.resetToken + 1 })),
  refreshToken: 0,
  bumpRefresh: () => set((s) => ({ refreshToken: s.refreshToken + 1 })),
  pendingPost: null,
  setPendingPost: (post) => set({ pendingPost: post }),
  externalVotes: new Map(),
  addExternalVote: (uploadId, vote) =>
    set((s) => ({ externalVotes: new Map(s.externalVotes).set(uploadId, vote) })),
  localStreaks: new Map(),
  updateStreak: (friend, matched, serverStreak, voteType) =>
    set((s) => {
      const existing = s.localStreaks.get(friend.username);
      const currentCount = existing?.count ?? serverStreak;
      const next = matched ? currentCount + 1 : 0;
      return {
        localStreaks: new Map(s.localStreaks).set(friend.username, {
          count: next,
          streakType: matched ? voteType : null,
          username: friend.username,
          avatarUrl: friend.avatar_url,
          userRank: friend.user_rank,
        }),
      };
    }),
  clearLocalStreaks: () => set({ localStreaks: new Map() }),
}));
