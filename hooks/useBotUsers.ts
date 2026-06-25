import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface BotUser {
  id: string;
  username: string;
  avatar_url: string | null;
}

/**
 * Bots intentionally hidden from every UI bot list (Meet-the-Bots
 * onboarding, the bots tab on home, settings/bots, etc.). The bot users
 * still exist in the DB and their old posts stay visible — they just
 * stop appearing in any "browse bots" surface.
 *
 * Deactivated 2026-05-22: HumanBot + GlowBot retired — their text-overlay
 * content didn't hit the quality bar and reads off-brand for an AI image
 * app. To re-enable: remove from this set, restore the entry in
 * lib/botProfiles.ts, and uncomment the cron in
 * .github/workflows/bot-dreams.yml. The bot code under scripts/ is
 * intentionally untouched so revival is one-PR away.
 *
 * Decommissioned 2026-06-24: MechBot retired — its 8 best paths (+ their post
 * history) were moved to StarBot; its dead paths are kept on disk for
 * reference. Also hidden server-side via users.is_public=false (migration 308),
 * but listed here too so it stays out of the bot lists AND search (see
 * useSearchUsers) regardless. Revive = remove here + flip is_public back.
 */
export const HIDDEN_BOT_USERNAMES = new Set(['humanbot', 'glowbot', 'mechbot']);

export function useBotUsers() {
  return useQuery({
    queryKey: ['botUsers'],
    queryFn: async (): Promise<BotUser[]> => {
      const { data, error } = await supabase.rpc('get_bot_users');
      if (error) throw error;
      const all = (data ?? []) as BotUser[];
      return all.filter((b) => !HIDDEN_BOT_USERNAMES.has(b.username.toLowerCase()));
    },
    staleTime: 5 * 60_000,
  });
}
