/**
 * Welcome sparkle bonus — granted at onboarding completion, with a reconcile
 * safety net so a network blip at that moment never costs the user their bonus.
 *
 * The grant_sparkles RPC is IDEMPOTENT for welcome_bonus (per-user FOR UPDATE
 * lock + reason dedup + a unique-index backstop — migration 258), so it credits
 * the bonus exactly once per user EVER, no matter how many times it's called.
 * That makes a "just call it again to be sure" reconcile completely safe.
 */

import { supabase } from '@/lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Stores the user id we've already reconciled on this device, so the safety net
// fires at most once per device per user.
const RECONCILED_KEY = 'welcome_bonus_reconciled_user';

/**
 * Grant the welcome bonus. Safe to call repeatedly (idempotent server-side).
 * `amount` MUST equal engine_config.welcome_sparkle_bonus — the RPC validates it
 * for client callers and throws otherwise.
 */
export async function grantWelcomeBonus(userId: string, amount: number): Promise<void> {
  await supabase.rpc('grant_sparkles', {
    p_user_id: userId,
    p_amount: amount,
    p_reason: 'welcome_bonus',
  });
}

/**
 * Safety net for a welcome bonus the at-onboarding grant may have missed (e.g. a
 * dead network during finalizeOnboarding). Runs at most once per device per user;
 * because the grant is idempotent it only ever credits a genuinely missed bonus,
 * and is a cheap no-op for everyone else before flagging itself done.
 */
export async function reconcileWelcomeBonus(userId: string, amount: number): Promise<void> {
  try {
    const done = await AsyncStorage.getItem(RECONCILED_KEY);
    if (done === userId) return;
    await grantWelcomeBonus(userId, amount);
    await AsyncStorage.setItem(RECONCILED_KEY, userId);
  } catch (err) {
    // Leave the flag unset so it retries on the next launch.
    if (__DEV__) console.warn('[welcomeBonus] reconcile failed:', err);
  }
}
