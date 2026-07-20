import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import { Toast } from '@/components/Toast';
import { setDescriptionInCaches } from '@/lib/descriptionCache';

/** Matches the compose flow's cap (app/post/new.tsx). */
export const MAX_DESCRIPTION_LENGTH = 500;

interface Vars {
  postId: string;
  /** Raw input text — trimmed + capped here before the write. */
  description: string;
  /** Prior stored value, captured by the caller for optimistic rollback. */
  previous: string | null;
}

/**
 * Edit a post's user caption (uploads.description) in place — the owner-only
 * "Edit description" action.
 *
 * SILENT by design, matching how Instagram / YouTube / Facebook treat a caption
 * edit: it does NOT touch posted_at / created_at (no feed reposition, no bump to
 * the top of the Dreams album) and fires NO notification. It only rewrites one
 * text field. Comments, likes, pins, feed position — all untouched.
 *
 * Server-side, the migration-279 trigger (BEFORE INSERT OR UPDATE on uploads)
 * NFKC-normalizes, strips control/zero-width/bidi, and NULLs a slur-blocked
 * caption — so a raw PostgREST UPDATE is sanitized identically to the compose
 * flow (which relies on the same trigger). RLS + the explicit user_id filter
 * keep it owner-only.
 */
export function useUpdateDescription() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, description }: Vars) => {
      const uid = useAuthStore.getState().user?.id;
      if (!uid) throw new Error('not signed in');
      const trimmed = description.trim().slice(0, MAX_DESCRIPTION_LENGTH);
      const { error } = await supabase
        .from('uploads')
        .update({ description: trimmed || null })
        .eq('id', postId)
        .eq('user_id', uid);
      if (error) throw error;
      return { postId };
    },
    // Optimistic: patch the caption everywhere the card is cached so it updates
    // instantly (no feed refetch / reshuffle).
    onMutate: ({ postId, description }: Vars) => {
      const next = description.trim().slice(0, MAX_DESCRIPTION_LENGTH) || null;
      setDescriptionInCaches(qc, postId, next);
    },
    onError: (err, vars) => {
      if (__DEV__) console.error('[useUpdateDescription] Error:', err);
      // Roll the optimistic patch back to the prior caption.
      setDescriptionInCaches(qc, vars.postId, vars.previous);
      Toast.show('Could not update description', 'close-circle');
    },
    onSuccess: ({ postId }) => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Toast.show('Description updated', 'checkmark-circle');
      // Reconcile the single-post view with the server's sanitized value (a
      // blocked caption is NULLed; zero-width/bidi stripped). Scoped to ['post']
      // ONLY — never the feed — so nothing reshuffles.
      qc.invalidateQueries({ queryKey: ['post', postId] });
    },
  });
}
