/**
 * Dream Off client state — the small bits of cross-screen state that don't belong
 * to a server query. Kept SEPARATE from the create flow's store (pendingCreatePreset)
 * so a Dream Off entry can never collide with a solo dream in flight.
 *
 *  - pendingInviteCode: a `join/<code>` deep link captured before auth; the
 *    PendingInviteReplayer redeems it (join_game_by_code) once signed in.
 *  - pendingEntryDraft: the entry params carried from the compose screen into the
 *    shared loading screen (which game + chosen model), so the render + realtime
 *    subscription know what they belong to.
 */

import { create } from 'zustand';

export interface EntryDraft {
  gameId: string;
  /** The tier model the player picked to render with (null = let the server pick). */
  modelId: string | null;
}

interface DreamOffStore {
  pendingInviteCode: string | null;
  pendingEntryDraft: EntryDraft | null;
  setPendingInviteCode: (code: string | null) => void;
  clearPendingInviteCode: () => void;
  setPendingEntryDraft: (draft: EntryDraft | null) => void;
  clearPendingEntryDraft: () => void;
}

export const useDreamOffStore = create<DreamOffStore>((set) => ({
  pendingInviteCode: null,
  pendingEntryDraft: null,
  setPendingInviteCode: (code) => set({ pendingInviteCode: code }),
  clearPendingInviteCode: () => set({ pendingInviteCode: null }),
  setPendingEntryDraft: (draft) => set({ pendingEntryDraft: draft }),
  clearPendingEntryDraft: () => set({ pendingEntryDraft: null }),
}));
