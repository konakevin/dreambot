/**
 * useHashtagPosts — infinite query of public posts carrying a hashtag
 * (post_hashtags join table, migration 331), plus the tag-page header count
 * and the search-tab prefix search.
 *
 * The join table only ever contains PUBLIC posts (the sync trigger prunes on
 * private flip), so no is_public filter is needed here — but we keep one on
 * the embedded uploads anyway as defense in depth (a stale row can otherwise
 * surface a just-privated post for the trigger-to-read gap).
 */

import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { POST_SELECT, mapToDreamPost, castRows, castRow } from '@/lib/mapPost';

const PAGE_SIZE = 18;

export function useHashtagPosts(tag: string, enabled = true) {
  return useInfiniteQuery({
    queryKey: ['hashtagPosts', tag],
    queryFn: async ({ pageParam }) => {
      const offset = pageParam as number;
      const { data, error } = await supabase
        .from('post_hashtags')
        .select(`created_at, uploads!inner(${POST_SELECT})`)
        .eq('tag', tag)
        .eq('uploads.is_public', true)
        // created_at is a copy of the post time (trigger) — reverse-chron tag
        // page without joining for the order column.
        .order('created_at', { ascending: false })
        .range(offset, offset + PAGE_SIZE - 1);
      if (error) throw error;
      const rows = castRows(data).map((r) => mapToDreamPost(castRow(r.uploads)));
      // hasMore captured at fetch time — see usePublicProfilePosts.
      return { rows, offset, hasMore: rows.length === PAGE_SIZE };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.offset + PAGE_SIZE : undefined),
    enabled: !!tag && enabled,
    staleTime: 60_000,
  });
}

/** Post count for the tag-page header ("N dreams"). */
export function useHashtagCount(tag: string) {
  return useQuery({
    queryKey: ['hashtagCount', tag],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('post_hashtags')
        .select('*', { count: 'exact', head: true })
        .eq('tag', tag);
      if (error) throw error;
      return count ?? 0;
    },
    enabled: !!tag,
    staleTime: 60_000,
  });
}

export interface HashtagSearchResult {
  tag: string;
  post_count: number;
}

/**
 * Prefix search with counts for the Top-tab search "Tags" section. The RPC
 * strips '#'/junk server-side, so the raw query can be passed as typed.
 */
export function useSearchHashtags(query: string) {
  const prefix = query.trim().replace(/^#/, '').toLowerCase();
  return useQuery({
    queryKey: ['hashtagSearch', prefix],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('search_hashtags', {
        p_prefix: prefix,
        p_limit: 5,
      });
      if (error) throw error;
      return (data ?? []) as HashtagSearchResult[];
    },
    enabled: prefix.length >= 2,
    staleTime: 30_000,
  });
}
