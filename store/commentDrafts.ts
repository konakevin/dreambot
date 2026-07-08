/**
 * commentDrafts — in-memory WIP comment text, keyed by post id.
 *
 * The comment overlay unmounts when closed, so its local text state would be
 * lost. This store lets a half-written comment survive closing + reopening the
 * overlay on the SAME card. It's cleared when the user swipes AWAY from the card
 * (FullScreenFeed calls clearExcept with the new active id) and when the comment
 * posts. In-memory on purpose — a draft shouldn't outlive the session.
 */
import { create } from 'zustand';

interface CommentDraftsState {
  drafts: Record<string, string>;
  /** Set (or, for empty text, drop) the draft for a post. */
  setDraft: (postId: string, text: string) => void;
  /** Drop the draft for a single post (e.g. after it posts). */
  clearDraft: (postId: string) => void;
  /** Keep only the given post's draft; drop every other (swipe-away cleanup). */
  clearExcept: (postId: string | null) => void;
}

export const useCommentDrafts = create<CommentDraftsState>((set) => ({
  drafts: {},
  setDraft: (postId, text) =>
    set((s) => {
      if (text) return { drafts: { ...s.drafts, [postId]: text } };
      if (!(postId in s.drafts)) return s;
      const next = { ...s.drafts };
      delete next[postId];
      return { drafts: next };
    }),
  clearDraft: (postId) =>
    set((s) => {
      if (!(postId in s.drafts)) return s;
      const next = { ...s.drafts };
      delete next[postId];
      return { drafts: next };
    }),
  clearExcept: (postId) =>
    set((s) => {
      const keys = Object.keys(s.drafts);
      if (keys.length === 0) return s;
      if (postId && keys.length === 1 && keys[0] === postId) return s;
      const kept = postId && s.drafts[postId] ? { [postId]: s.drafts[postId] } : {};
      return { drafts: kept };
    }),
}));
