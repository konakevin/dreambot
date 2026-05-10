import { create } from 'zustand';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useFeedStore } from '@/store/feed';
import { queryClient } from '@/lib/queryClient';

interface AuthState {
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
  /** Pro-subscription entitlement — true when the user has an active Pro
   *  subscription AND its expiry timestamp is in the future. Gates
   *  long-press Save-to-Photos and future paid features. The webhook is
   *  the authoritative writer of pro_subscription + pro_subscription_expires_at;
   *  we still re-validate the timestamp on every read so a missed
   *  EXPIRATION webhook can't leave a user with permanent Pro access. */
  isPro: boolean;
  initialized: boolean;
  setSession: (session: Session | null) => void;
  signOut: () => Promise<void>;
  /** Re-read entitlement columns from the DB. Call after a Pro purchase
   *  or any flow that may have changed entitlement state. */
  refreshEntitlements: () => Promise<void>;
  initialize: () => () => void;
}

interface EntitlementRow {
  is_admin?: boolean;
  pro_subscription?: boolean;
  pro_subscription_expires_at?: string | null;
}

/** Resolve the effective Pro state from a DB row. The boolean alone is
 *  not enough — if a RevenueCat EXPIRATION event ever misses, the column
 *  could stay `true` past the expiry date. Treat an expired timestamp as
 *  not-Pro on the client. */
function isProActive(row: EntitlementRow | null): boolean {
  if (!row?.pro_subscription) return false;
  const expiresAt = row.pro_subscription_expires_at;
  if (!expiresAt) return true;
  return new Date(expiresAt).getTime() > Date.now();
}

const ENTITLEMENT_COLUMNS = 'is_admin, pro_subscription, pro_subscription_expires_at';

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  isAdmin: false,
  isPro: false,
  initialized: false,

  setSession: (session) => {
    set({ session, user: session?.user ?? null });
    // Check admin + pro status
    if (session?.user) {
      supabase
        .from('users')
        .select(ENTITLEMENT_COLUMNS)
        .eq('id', session.user.id)
        .single()
        .then(({ data }) => {
          const row = data as unknown as EntitlementRow | null;
          set({ isAdmin: !!row?.is_admin, isPro: isProActive(row) });
        });
    } else {
      set({ isAdmin: false, isPro: false });
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null, user: null });
    // Clear all cached data from previous session
    useFeedStore.getState().bumpReset();
    // Clear TanStack Query cache
    queryClient.clear();
  },

  refreshEntitlements: async () => {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) return;
    const { data } = await supabase
      .from('users')
      .select(ENTITLEMENT_COLUMNS)
      .eq('id', userId)
      .single();
    const row = data as unknown as EntitlementRow | null;
    set({ isAdmin: !!row?.is_admin, isPro: isProActive(row) });
  },

  initialize: () => {
    const checkEntitlements = (userId: string) => {
      supabase
        .from('users')
        .select(ENTITLEMENT_COLUMNS)
        .eq('id', userId)
        .single()
        .then(({ data }) => {
          const row = data as unknown as EntitlementRow | null;
          set({ isAdmin: !!row?.is_admin, isPro: isProActive(row) });
        });
    };

    supabase.auth.getSession().then(async ({ data: { session }, error }) => {
      if (error?.message?.toLowerCase().includes('refresh token')) {
        await supabase.auth.signOut({ scope: 'local' }).catch(() => {});
        set({ session: null, user: null, initialized: true });
        return;
      }
      set({ session, user: session?.user ?? null, initialized: true });
      if (session?.user) checkEntitlements(session.user.id);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, user: session?.user ?? null, initialized: true });
      if (session?.user) checkEntitlements(session.user.id);
      else set({ isAdmin: false, isPro: false });
    });

    return () => subscription.unsubscribe();
  },
}));
