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
   *  subscription. Gates long-press Save-to-Photos and future paid features.
   *  Set by revenuecat-webhook when the user purchases. */
  isPro: boolean;
  initialized: boolean;
  setSession: (session: Session | null) => void;
  signOut: () => Promise<void>;
  /** Re-read is_admin + pro_subscription from the DB. Call after a Pro
   *  purchase or any flow that may have changed entitlement state, so
   *  client-side gating (long-press save, Pro perks, etc.) reflects it. */
  refreshEntitlements: () => Promise<void>;
  initialize: () => () => void;
}

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
        .select('is_admin, pro_subscription')
        .eq('id', session.user.id)
        .single()
        .then(({ data }) => {
          const row = data as unknown as {
            is_admin?: boolean;
            pro_subscription?: boolean;
          } | null;
          set({ isAdmin: !!row?.is_admin, isPro: !!row?.pro_subscription });
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
      .select('is_admin, pro_subscription')
      .eq('id', userId)
      .single();
    const row = data as unknown as {
      is_admin?: boolean;
      pro_subscription?: boolean;
    } | null;
    set({ isAdmin: !!row?.is_admin, isPro: !!row?.pro_subscription });
  },

  initialize: () => {
    const checkEntitlements = (userId: string) => {
      supabase
        .from('users')
        .select('is_admin, pro_subscription')
        .eq('id', userId)
        .single()
        .then(({ data }) => {
          const row = data as unknown as {
            is_admin?: boolean;
            pro_subscription?: boolean;
          } | null;
          set({ isAdmin: !!row?.is_admin, isPro: !!row?.pro_subscription });
        });
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
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
