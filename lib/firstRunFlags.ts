/**
 * First-run intro flags — account-bound (DB) state.
 *
 * Replaces the old device-local AsyncStorage flags for the four post-onboarding
 * teaching moments (feed gate, Create intro, Mediums intro, Sparkle intro). The
 * seen-state now lives in `public.user_first_run` (migration 284), keyed by
 * user, so it survives reinstalls + follows the user across devices, and a
 * brand-new account always re-sees the intros regardless of what was installed
 * on the device before. (AsyncStorage couldn't tell a fresh account on a
 * previously-used device from a returning user, and it survived app updates —
 * see the migration header + the 2026-06-18 demo-account work.)
 *
 * The per-component helpers (hasSeenFeedIntro / resetFeedIntro / …) delegate
 * here, so call sites are unchanged. One row is fetched + cached per signed-in
 * user; writes are optimistic so a re-read within the session never re-shows an
 * intro the user just dismissed.
 */
import { supabase } from '@/lib/supabase';
import type { TablesInsert } from '@/types/database';

export type FirstRunFlag = 'feed' | 'create' | 'mediums' | 'sparkle';

type FlagState = Record<FirstRunFlag, boolean>;

// In-memory cache of the signed-in user's row. Invalidated when the user id
// changes (logout → login as someone else).
let cacheUserId: string | null = null;
let cache: FlagState | null = null;
let hydratePromise: Promise<void> | null = null;

async function currentUserId(): Promise<string | null> {
  // getSession reads the locally-persisted session (no network) — enough to key
  // the row; token refresh for the actual request is handled by supabase-js.
  const { data } = await supabase.auth.getSession();
  return data.session?.user?.id ?? null;
}

/** Fetch + cache the user's row once. On error, leave the cache empty so the
 *  next call retries rather than caching a wrong "nothing seen". */
async function hydrate(userId: string): Promise<void> {
  if (cache && cacheUserId === userId) return;
  if (hydratePromise && cacheUserId === userId) return hydratePromise;
  cacheUserId = userId;
  cache = null;
  hydratePromise = (async () => {
    const { data, error } = await supabase
      .from('user_first_run')
      .select('seen_feed_intro, seen_create_intro, seen_mediums_intro, seen_sparkle_intro')
      .eq('user_id', userId)
      .maybeSingle();
    if (error) {
      if (__DEV__) console.warn('[firstRun] hydrate failed', error.message);
      cacheUserId = null; // force a retry next call
      return;
    }
    cache = {
      feed: data?.seen_feed_intro ?? false,
      create: data?.seen_create_intro ?? false,
      mediums: data?.seen_mediums_intro ?? false,
      sparkle: data?.seen_sparkle_intro ?? false,
    };
  })();
  try {
    await hydratePromise;
  } finally {
    hydratePromise = null;
  }
}

/** Typed single-flag upsert payload — explicit per-flag so there are no
 *  computed-key / index-signature casts (CLAUDE.md hard rule). */
function flagPayload(
  userId: string,
  flag: FirstRunFlag,
  value: boolean
): TablesInsert<'user_first_run'> {
  const updated_at = new Date().toISOString();
  switch (flag) {
    case 'feed':
      return { user_id: userId, seen_feed_intro: value, updated_at };
    case 'create':
      return { user_id: userId, seen_create_intro: value, updated_at };
    case 'mediums':
      return { user_id: userId, seen_mediums_intro: value, updated_at };
    case 'sparkle':
      return { user_id: userId, seen_sparkle_intro: value, updated_at };
  }
}

async function write(flag: FirstRunFlag, value: boolean): Promise<void> {
  const userId = await currentUserId();
  if (!userId) return;
  // Optimistic local update so a re-read this session reflects the change
  // immediately (focus effects re-read these on every Create-tab focus).
  if (cache && cacheUserId === userId) cache[flag] = value;
  const { error } = await supabase
    .from('user_first_run')
    .upsert(flagPayload(userId, flag, value), { onConflict: 'user_id' });
  if (error && __DEV__) console.warn(`[firstRun] write ${flag}=${value} failed`, error.message);
}

/** Has the signed-in user already seen this intro? Not-signed-in → false
 *  (shows) — the screens are auth-gated, so this only matters once logged in,
 *  and "show" is the safe default (matches the old AsyncStorage catch). */
export async function hasSeenFlag(flag: FirstRunFlag): Promise<boolean> {
  const userId = await currentUserId();
  if (!userId) return false;
  await hydrate(userId);
  return cache ? cache[flag] : false;
}

/** Mark an intro seen (account-bound, idempotent). */
export function markFlagSeen(flag: FirstRunFlag): Promise<void> {
  return write(flag, true);
}

/** Clear a flag so the intro shows again — used by the admin Reset-Tutorials
 *  tool to re-test the first-run experience. */
export function resetFlag(flag: FirstRunFlag): Promise<void> {
  return write(flag, false);
}
