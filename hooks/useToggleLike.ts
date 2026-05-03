import { useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import type { DreamPostItem } from '@/components/DreamCard';

interface ToggleArgs {
  uploadId: string;
  currentlyLiked: boolean;
}

// Page shape is now { rows, nextCursor } per the 2026-05-02 scroll-bug fix.
// useDreamFeed pages are RowPage objects; some legacy hooks may still hand
// flat arrays. Handle both.
type RowPage<T> = { rows: T[]; [k: string]: unknown };
type AnyPage<T> = RowPage<T> | T[];

function bumpItem(p: DreamPostItem, uploadId: string, delta: number): DreamPostItem {
  return p.id === uploadId ? { ...p, like_count: Math.max(0, (p.like_count ?? 0) + delta) } : p;
}

function bumpLikeCount(
  pages: AnyPage<DreamPostItem>[],
  uploadId: string,
  delta: number
): AnyPage<DreamPostItem>[] {
  return pages.map((page) => {
    if (Array.isArray(page)) {
      return page.map((p) => bumpItem(p, uploadId, delta));
    }
    return { ...page, rows: page.rows.map((p) => bumpItem(p, uploadId, delta)) };
  });
}

export function useToggleLike() {
  const user = useAuthStore((s) => s.user);
  const qc = useQueryClient();
  const key = ['likeIds', user?.id];

  return useMutation({
    mutationFn: async ({ uploadId, currentlyLiked }: ToggleArgs) => {
      if (currentlyLiked) {
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('user_id', user!.id)
          .eq('upload_id', uploadId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('likes')
          .insert({ user_id: user!.id, upload_id: uploadId });
        if (error) throw error;
      }
    },
    onMutate: async ({ uploadId, currentlyLiked }) => {
      // Toggle likeIds set
      await qc.cancelQueries({ queryKey: key });
      const previous = qc.getQueryData<Set<string>>(key);
      qc.setQueryData<Set<string>>(key, (old = new Set()) => {
        const next = new Set(old);
        if (currentlyLiked) next.delete(uploadId);
        else next.add(uploadId);
        return next;
      });

      // Bump like_count on the post across all feed caches
      const delta = currentlyLiked ? -1 : 1;
      const feedKeys = qc.getQueryCache().findAll({ queryKey: ['dreamFeed'] });
      for (const query of feedKeys) {
        qc.setQueryData<InfiniteData<AnyPage<DreamPostItem>>>(query.queryKey, (prev) => {
          if (!prev) return prev;
          return { ...prev, pages: bumpLikeCount(prev.pages, uploadId, delta) };
        });
      }
      // Also bump in album posts
      const albumKeys = qc.getQueryCache().findAll({ queryKey: ['albumPosts'] });
      for (const query of albumKeys) {
        qc.setQueryData<DreamPostItem[]>(query.queryKey, (prev) => {
          if (!prev) return prev;
          return prev.map((p) =>
            p.id === uploadId ? { ...p, like_count: Math.max(0, (p.like_count ?? 0) + delta) } : p
          );
        });
      }

      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      qc.setQueryData(key, ctx?.previous);
    },
  });
}
