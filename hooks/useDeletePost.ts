import { useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import { Toast } from '@/components/Toast';
import type { DreamPostItem } from '@/components/DreamCard';

interface RowPage {
  rows: DreamPostItem[];
  offset: number;
}
type FlatPage = DreamPostItem[];
type AnyPage = RowPage | FlatPage;

function isRowPage(page: AnyPage): page is RowPage {
  return !Array.isArray(page) && Array.isArray((page as RowPage).rows);
}

function removeFromAnyPages(pages: AnyPage[], uploadId: string): AnyPage[] {
  return pages.map((page) => {
    if (isRowPage(page)) {
      return { ...page, rows: page.rows.filter((p) => p.id !== uploadId) };
    }
    return page.filter((p) => p.id !== uploadId);
  });
}

const INFINITE_QUERY_KEYS = [
  'dreamFeed',
  'userPosts',
  'my-dreams',
  'explore',
  'publicProfilePosts',
  'favoritePosts',
];

export function useDeletePost() {
  const qc = useQueryClient();
  const isAdmin = useAuthStore((s) => s.isAdmin);

  return useMutation({
    mutationFn: async (uploadId: string) => {
      // Grab image URL before deleting (needed for storage cleanup)
      const { data: row } = await supabase
        .from('uploads')
        .select('image_url')
        .eq('id', uploadId)
        .single();

      if (isAdmin) {
        const { error } = await supabase.rpc(
          'admin_delete_upload' as never,
          { p_upload_id: uploadId } as never
        );
        if (error) throw error;
      } else {
        const { error } = await supabase.from('uploads').delete().eq('id', uploadId);
        if (error) throw error;
      }

      // Clean up storage (fire-and-forget)
      if (row?.image_url) {
        const match = row.image_url.match(/\/uploads\/(.+)$/);
        if (match?.[1]) {
          supabase.storage.from('uploads').remove([decodeURIComponent(match[1])]);
        }
      }
    },
    onMutate: async (uploadId: string) => {
      const snapshots = new Map<string, unknown>();

      for (const prefix of INFINITE_QUERY_KEYS) {
        const queries = qc.getQueryCache().findAll({ queryKey: [prefix] });
        for (const query of queries) {
          await qc.cancelQueries({ queryKey: query.queryKey });
          const prev = qc.getQueryData<InfiniteData<AnyPage>>(query.queryKey);
          if (prev) {
            snapshots.set(JSON.stringify(query.queryKey), prev);
            qc.setQueryData<InfiniteData<AnyPage>>(query.queryKey, {
              ...prev,
              pages: removeFromAnyPages(prev.pages, uploadId),
            });
          }
        }
      }

      // Album posts use flat arrays (useQuery, not useInfiniteQuery)
      const albumQueries = qc.getQueryCache().findAll({ queryKey: ['albumPosts'] });
      for (const query of albumQueries) {
        await qc.cancelQueries({ queryKey: query.queryKey });
        const prev = qc.getQueryData<DreamPostItem[]>(query.queryKey);
        if (prev) {
          snapshots.set(JSON.stringify(query.queryKey), prev);
          qc.setQueryData<DreamPostItem[]>(
            query.queryKey,
            prev.filter((p) => p.id !== uploadId)
          );
        }
      }

      return { snapshots };
    },
    onSuccess: () => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Toast.show('Dream deleted', 'checkmark-circle');
    },
    onError: (_err, _vars, ctx) => {
      if (__DEV__) console.error('[useDeletePost] Error:', _err);
      Toast.show('Failed to delete dream', 'close-circle');
      if (ctx?.snapshots) {
        for (const [keyStr, data] of ctx.snapshots) {
          qc.setQueryData(JSON.parse(keyStr), data);
        }
      }
    },
  });
}
