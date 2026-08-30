/**
 * useUserContextFeed — paginated context feed for the photo detail view
 * when the user navigated in WITHOUT an album set (i.e., from a profile post
 * tap, a notification, or a deep link, rather than from their own gallery).
 *
 * Replaces the non-album branch of useAlbumPosts which was a non-paginated
 * useQuery with a hard CONTEXT_LIMIT = 40 — that branch produced the "black
 * screen below post 41" bug because the FlatList ran out of data with no way
 * to fetch more.
 *
 * Page 0 fetches the target post + the first PAGE_SIZE of the poster's
 * other public posts. Subsequent pages just paginate that user's posts.
 *
 * The album branch (useAlbumPosts when albumIds.length > 0) is unchanged —
 * albums are bounded by definition and don't need pagination.
 */

import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { POST_SELECT, mapToDreamPost, mapRpcToDreamPost, castRow, castRows } from '@/lib/mapPost';
import type { DreamPostItem } from '@/components/DreamCard';

const PAGE_SIZE = 20;

interface PageResult {
  rows: DreamPostItem[];
  userId: string;
  nextOffset: number;
  // hasMore is captured at fetch time. Stored on the page so optimistic
  // deletes (which shrink rows below PAGE_SIZE) don't break pagination.
  hasMore: boolean;
}

type PageParam = 0 | { offset: number; userId: string };

export function useUserContextFeed(currentId: string, enabled = true) {
  return useInfiniteQuery({
    queryKey: ['userContextFeed', currentId],
    queryFn: async ({ pageParam }): Promise<PageResult> => {
      // Page 0: fetch target by id, derive its user_id, fetch first page of context.
      if (pageParam === 0) {
        const { data: single, error: singleErr } = await supabase
          .from('uploads')
          .select(POST_SELECT)
          .eq('id', currentId)
          // Quarantined bad renders are unreachable even by direct id (migration
          // 449) — falls through to get_shared_post, which also excludes them.
          .is('quarantined_at', null)
          .single();

        // RLS-blocked target = a PRIVATE dream shared by direct link, opened
        // IN THE APP by a recipient who isn't the owner (the universal link
        // routed them into app/photo/[id] instead of the website). Fall back to
        // get_shared_post (SECURITY DEFINER, unlisted-by-UUID — migration 311)
        // so they can view the single shared dream. No context feed: they were
        // given ONE link, and we can't read the owner's other posts as this
        // user anyway. The owner viewing their OWN private link hits the normal
        // path above (RLS lets them read it) and still gets their context feed.
        if (singleErr || !single) {
          const { data: sharedRows } = await supabase.rpc('get_shared_post', {
            p_id: currentId,
          });
          const sharedRow = Array.isArray(sharedRows) ? sharedRows[0] : null;
          if (!sharedRow) throw singleErr ?? new Error('post not found');
          const shared = mapRpcToDreamPost(castRow(sharedRow));
          return { rows: [shared], userId: shared.user_id, nextOffset: PAGE_SIZE, hasMore: false };
        }

        const targetRow = castRow(single);
        const target: DreamPostItem = {
          ...mapToDreamPost(targetRow),
          is_public: (targetRow.is_public as boolean) ?? false,
          posted_at: (targetRow.posted_at as string | null) ?? null,
          description: (targetRow.description as string | null) ?? null,
        };
        const userId = target.user_id;

        const { data: contextData } = await supabase
          .from('uploads')
          .select(POST_SELECT)
          .eq('user_id', userId)
          .eq('is_public', true)
          .neq('id', currentId)
          .order('created_at', { ascending: false })
          .range(0, PAGE_SIZE - 1);

        const context = castRows(contextData).map((row) => ({
          ...mapToDreamPost(row),
          is_public: (row.is_public as boolean) ?? false,
          posted_at: (row.posted_at as string | null) ?? null,
          description: (row.description as string | null) ?? null,
        }));

        // hasMore captures whether the SERVER returned a full page of context
        // (excluding the prepended target). When server returns < PAGE_SIZE,
        // we know that's the last page.
        return {
          rows: [target, ...context],
          userId,
          nextOffset: PAGE_SIZE,
          hasMore: context.length === PAGE_SIZE,
        };
      }

      // Subsequent pages: pageParam carries userId for continuity (since the
      // hook doesn't know it at call time — it's derived from the target).
      const { offset, userId } = pageParam;
      const { data, error } = await supabase
        .from('uploads')
        .select(POST_SELECT)
        .eq('user_id', userId)
        .eq('is_public', true)
        .neq('id', currentId)
        .order('created_at', { ascending: false })
        .range(offset, offset + PAGE_SIZE - 1);
      if (error) throw error;

      const rows = castRows(data).map((row) => ({
        ...mapToDreamPost(row),
        is_public: (row.is_public as boolean) ?? false,
        posted_at: (row.posted_at as string | null) ?? null,
        description: (row.description as string | null) ?? null,
      }));

      return { rows, userId, nextOffset: offset + PAGE_SIZE, hasMore: rows.length === PAGE_SIZE };
    },
    initialPageParam: 0 as PageParam,
    // Use hasMore (captured at fetch time) instead of current cached row count.
    // Otherwise optimistic deletes shrink lastPage.rows below PAGE_SIZE and
    // pagination silently dies.
    getNextPageParam: (lastPage): PageParam | undefined =>
      lastPage.hasMore ? { offset: lastPage.nextOffset, userId: lastPage.userId } : undefined,
    enabled: !!currentId && enabled,
    staleTime: 60_000,
  });
}
