import { create } from 'zustand';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useFeedStore } from '@/store/feed';
import { queryClient } from '@/lib/queryClient';

interface AuthState {
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
  /** Pro-subscription entitlement — true when the user has Pro perks
   *  RIGHT NOW. Covers both paid subscribers (active+unexpired) AND new
   *  users within their 14-day trial. Gates long-press Save-to-Photos +
   *  pre-upscale + nightly cadence. The webhook is the authoritative
   *  writer of pro_subscription + pro_subscription_expires_at; we still
   *  re-validate the timestamp on every read so a missed EXPIRATION
   *  webhook can't leave a user with permanent Pro access. */
  isPro: boolean;
  /** True ONLY for actual paid subscribers — false for trial users. Use
   *  to differentiate trial vs paid in UI ("upgrade" vs "manage"). */
  isPaidPro: boolean;
  /** ISO timestamp when the 14-day trial ends, or null if no trial set
   *  or already on paid. Use to render trial countdown copy. */
  proTrialEndsAt: string | null;
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
  pro_trial_started_at?: string | null;
}

const TRIAL_DURATION_DAYS = 14;

/** Has an active PAID subscription right now? */
function isPaidProActive(row: EntitlementRow | null): boolean {
  if (!row?.pro_subscription) return false;
  const expiresAt = row.pro_subscription_expires_at;
  if (!expiresAt) return true;
  return new Date(expiresAt).getTime() > Date.now();
}

/** When the user's 14-day trial ends, or null if no trial. Doesn't care
 *  whether the trial is still active — just returns the absolute moment. */
function trialEndsAt(row: EntitlementRow | null): string | null {
  if (!row?.pro_trial_started_at) return null;
  const end =
    new Date(row.pro_trial_started_at).getTime() + TRIAL_DURATION_DAYS * 24 * 60 * 60 * 1000;
  return new Date(end).toISOString();
}

/** Resolve the effective Pro state from a DB row. Three paths:
 *   1. Active paid subscription (pro_subscription=true + not expired)
 *   2. Within 14-day Pro-features trial (pro_trial_started_at within window)
 *  Mirrors the server-side is_pro_active() Postgres function. */
function isProActive(row: EntitlementRow | null): boolean {
  if (isPaidProActive(row)) return true;
  const trialEndIso = trialEndsAt(row);
  if (trialEndIso && new Date(trialEndIso).getTime() > Date.now()) return true;
  return false;
}

const ENTITLEMENT_COLUMNS =
  'is_admin, pro_subscription, pro_subscription_expires_at, pro_trial_started_at';

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  isAdmin: false,
  isPro: false,
  isPaidPro: false,
  proTrialEndsAt: null,
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
          set({
            isAdmin: !!row?.is_admin,
            isPro: isProActive(row),
            isPaidPro: isPaidProActive(row),
            proTrialEndsAt: trialEndsAt(row),
          });
        });
    } else {
      set({ isAdmin: false, isPro: false, isPaidPro: false, proTrialEndsAt: null });
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
    set({
      isAdmin: !!row?.is_admin,
      isPro: isProActive(row),
      isPaidPro: isPaidProActive(row),
      proTrialEndsAt: trialEndsAt(row),
    });
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
          set({
            isAdmin: !!row?.is_admin,
            isPro: isProActive(row),
            isPaidPro: isPaidProActive(row),
            proTrialEndsAt: trialEndsAt(row),
          });
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
      else set({ isAdmin: false, isPro: false, isPaidPro: false, proTrialEndsAt: null });
    });

    return () => subscription.unsubscribe();
  },
}));
