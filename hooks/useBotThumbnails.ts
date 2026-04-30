/**
 * useBotThumbnails — fetches up to N most-recent image URLs per bot in
 * one round trip via the get_bot_thumbnails RPC. Used by the
 * Meet-the-bots onboarding screen to show 3 thumbnails per bot.
 *
 * Returns a Map keyed by bot user_id for O(1) lookup as the screen
 * renders the bot list. Empty array when a bot has no posts yet.
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface BotThumbnailRow {
  bot_user_id: string;
  thumbnail_urls: string[];
}

export function useBotThumbnails(perBot: number = 3) {
  return useQuery({
    queryKey: ['botThumbnails', perBot],
    queryFn: async (): Promise<Map<string, string[]>> => {
      const { data, error } = await supabase.rpc('get_bot_thumbnails', {
        p_per_bot: perBot,
      });
      if (error) throw error;
      const rows = (data ?? []) as BotThumbnailRow[];
      const map = new Map<string, string[]>();
      for (const row of rows) {
        map.set(row.bot_user_id, row.thumbnail_urls ?? []);
      }
      return map;
    },
    staleTime: 5 * 60_000,
  });
}
