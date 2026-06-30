/**
 * AI photo-processing consent (App Store 5.1.1(i)/5.1.2(i)) — account-bound,
 * one-and-done. Backed by user_first_run.ai_consent_at (migration 316): a
 * timestamp set when the user agrees to send their photo to our third-party AI
 * providers. NULL = not consented → the gate shows the disclosure sheet.
 *
 * Read/write go directly to user_first_run (own-row RLS + table-level grants,
 * migration 284), mirroring lib/firstRunFlags.ts. Cached per signed-in user so a
 * second photo this session doesn't re-query.
 */
import { supabase } from '@/lib/supabase';

let cacheUserId: string | null = null;
let cached: boolean | null = null;

async function currentUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.user?.id ?? null;
}

/**
 * Has the signed-in user already consented to AI photo processing? Returns false
 * when signed out or on read error (safe default — show the gate).
 */
export async function hasAiConsent(): Promise<boolean> {
  const userId = await currentUserId();
  if (!userId) return false;
  if (cached !== null && cacheUserId === userId) return cached;
  cacheUserId = userId;
  const { data, error } = await supabase
    .from('user_first_run')
    .select('ai_consent_at')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) {
    if (__DEV__) console.warn('[aiConsent] read failed', error.message);
    cacheUserId = null; // force a retry next call rather than caching a wrong value
    return false;
  }
  cached = !!data?.ai_consent_at;
  return cached;
}

/**
 * Admin/QA: clear consent so the disclosure gate re-fires on the next photo.
 * Nulls the timestamp and the module cache. No-op when signed out.
 */
export async function resetAiConsent(): Promise<void> {
  const userId = await currentUserId();
  cached = null;
  cacheUserId = null;
  if (!userId) return;
  const { error } = await supabase
    .from('user_first_run')
    .update({ ai_consent_at: null })
    .eq('user_id', userId);
  if (error && __DEV__) console.warn('[aiConsent] reset failed', error.message);
}

/** Record consent (account-bound, idempotent). Called when the user agrees. */
export async function recordAiConsent(): Promise<void> {
  const userId = await currentUserId();
  if (!userId) return;
  cached = true;
  cacheUserId = userId;
  const { error } = await supabase
    .from('user_first_run')
    .upsert(
      { user_id: userId, ai_consent_at: new Date().toISOString() },
      { onConflict: 'user_id' }
    );
  if (error && __DEV__) console.warn('[aiConsent] write failed', error.message);
}
