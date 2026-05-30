import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';

/**
 * Paginated actor list for one notification group — fetched when the user
 * taps a group card in the inbox to "see who liked / followed / …".
 *
 * Backed by `get_group_actors` (migration 202), scoped to the calling
 * recipient. Returns one row per distinct actor in the group, ordered by
 * the actor's most recent contribution to that group.
 */
export interface GroupActor {
  actorId: string;
  username: string;
  avatarUrl: string | null;
  latestAt: string;
}

const PAGE_SIZE = 50;

function mapRow(row: Record<string, unknown>): GroupActor {
  return {
    actorId: row.actor_id as string,
    username: row.username as string,
    avatarUrl: (row.avatar_url as string | null) ?? null,
    latestAt: row.latest_at as string,
  };
}

interface GroupActorsPage {
  actors: GroupActor[];
  hasMore: boolean;
  nextOffset: number;
}

export function useGroupActors(groupKey: string | null) {
  const user = useAuthStore((s) => s.user);

  return useInfiniteQuery({
    queryKey: ['groupActors', user?.id, groupKey],
    queryFn: async ({ pageParam = 0 }): Promise<GroupActorsPage> => {
      if (!groupKey) return { actors: [], hasMore: false, nextOffset: 0 };
      const { data, error } = await supabase.rpc('get_group_actors', {
        p_user_id: user!.id,
        p_group_key: groupKey,
        p_limit: PAGE_SIZE,
        p_offset: pageParam as number,
      });
      if (error) throw error;
      const actors = ((data as Record<string, unknown>[] | null) ?? []).map(mapRow);
      return {
        actors,
        hasMore: actors.length === PAGE_SIZE,
        nextOffset: (pageParam as number) + actors.length,
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.nextOffset : undefined),
    enabled: !!user && !!groupKey,
    staleTime: 30_000,
  });
}
