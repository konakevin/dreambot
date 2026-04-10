import { create } from 'zustand';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useFeedStore } from '@/store/feed';
import { queryClient } from '@/lib/queryClient';

interface AuthState {
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
  initialized: boolean;
  setSession: (session: Session | null) => void;
  signOut: () => Promise<void>;
  initialize: () => () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  isAdmin: false,
  initialized: false,

  setSession: (session) => {
    set({ session, user: session?.user ?? null });
    // Check admin status
    if (session?.user) {
      supabase
        .from('users')
        .select('is_admin')
        .eq('id', session.user.id)
        .single()
        .then(({ data }) => {
          const row = data as unknown as { is_admin?: boolean } | null;
          set({ isAdmin: !!row?.is_admin });
        });
    } else {
      set({ isAdmin: false });
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

  initialize: () => {
    const checkAdmin = (userId: string) => {
      supabase
        .from('users')
        .select('is_admin')
        .eq('id', userId)
        .single()
        .then(({ data }) => {
          const row = data as unknown as { is_admin?: boolean } | null;
          set({ isAdmin: !!row?.is_admin });
        });
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      set({ session, user: session?.user ?? null, initialized: true });
      if (session?.user) checkAdmin(session.user.id);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, user: session?.user ?? null, initialized: true });
      if (session?.user) checkAdmin(session.user.id);
      else set({ isAdmin: false });
    });

    return () => subscription.unsubscribe();
  },
}));
