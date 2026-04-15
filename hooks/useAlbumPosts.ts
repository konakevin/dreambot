/**
 * useAlbumPosts — fetches posts for the full-screen album viewer.
 *
 * Three modes:
 * - Album (albumIds populated): fetch all posts, sorted by album order
 * - Single post (albumIds empty): fetch the post, then load the poster's
 *   other public posts as scrollable context around it
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { POST_SELECT, mapToDreamPost, castRows, castRow } from '@/lib/mapPost';
import type { DreamPostItem } from '@/components/DreamCard';

const CONTEXT_LIMIT = 40;

export function useAlbumPosts(albumIds: string[], currentId: string) {
  return useQuery({
    queryKey: ['albumPosts', albumIds.join(','), currentId],
    queryFn: async (): Promise<DreamPostItem[]> => {
      if (albumIds.length > 0) {
        // Album mode — fetch all posts by ID, sorted by album order
        const { data, error } = await supabase
          .from('uploads')
          .select(POST_SELECT)
          .in('id', albumIds);
        if (error) throw error;

        const orderMap = new Map(albumIds.map((id, i) => [id, i]));
        return castRows(data)
          .map((row) => ({
            ...mapToDreamPost(row),
            is_public: (row.is_public as boolean) ?? false,
            posted_at: (row.posted_at as string | null) ?? null,
            description: (row.description as string | null) ?? null,
          }))
          .sort((a, b) => (orderMap.get(a.id) ?? 0) - (orderMap.get(b.id) ?? 0));
      }

      // No album — fetch the target post first
      const { data: single, error: singleErr } = await supabase
        .from('uploads')
        .select(POST_SELECT)
        .eq('id', currentId)
        .single();
      if (singleErr) throw singleErr;

      const targetRow = castRow(single);
      const target: DreamPostItem = {
        ...mapToDreamPost(targetRow),
        is_public: (targetRow.is_public as boolean) ?? false,
        posted_at: (targetRow.posted_at as string | null) ?? null,
        description: (targetRow.description as string | null) ?? null,
      };

      // Fetch the poster's other public posts as scrollable context
      const { data: contextData } = await supabase
        .from('uploads')
        .select(POST_SELECT)
        .eq('user_id', target.user_id)
        .eq('is_public', true)
        .neq('id', currentId)
        .order('created_at', { ascending: false })
        .limit(CONTEXT_LIMIT);

      const contextPosts = castRows(contextData).map((row) => ({
        ...mapToDreamPost(row),
        is_active: (row.is_active as boolean) ?? false,
        is_posted: (row.is_posted as boolean) ?? false,
      }));

      // Target post first, then their other posts chronologically
      return [target, ...contextPosts];
    },
    enabled: true,
    staleTime: 60_000,
  });
}
