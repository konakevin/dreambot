import { useEffect } from 'react';
import * as Localization from 'expo-localization';
import { useAuthStore } from '@/store/auth';
import { supabase } from '@/lib/supabase';

/**
 * Keeps `users.timezone` in sync with the device's IANA timezone (e.g.
 * "America/Los_Angeles"), so the nightly cron can fire each user's dream during
 * THEIR night (see scripts/lib/nightlyTimezone.js). Self-corrects when someone
 * travels or moves. Reads the stored value first and only writes on an actual
 * change — one cheap select per app-open, a write only when the zone differs.
 *
 * Store the IANA NAME, never a raw offset: the name resolves DST correctly; an
 * offset would be wrong half the year.
 */
export function useSyncTimezone(): void {
  const userId = useAuthStore((s) => s.user?.id);
  useEffect(() => {
    if (!userId) return;
    const tz = Localization.getCalendars()[0]?.timeZone;
    if (!tz) return;
    let cancelled = false;
    void (async () => {
      const { data } = await supabase.from('users').select('timezone').eq('id', userId).single();
      if (cancelled || data?.timezone === tz) return;
      const { error } = await supabase.from('users').update({ timezone: tz }).eq('id', userId);
      if (error && __DEV__) console.warn('[useSyncTimezone] update failed:', error.message);
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);
}
