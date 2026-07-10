/**
 * Reopen a FAILED dream in the Create screen, prefilled with its original inputs
 * (prompt + medium + vibe + model) so the user can tweak and re-run — the
 * "Dream Again" pattern applied to a failure. Used by the failure toast and the
 * inbox dream_failed row.
 *
 * WHY NOT a silent server retry: the old flow re-enqueued via
 * enqueue-dream(retry_job_id), which loads dream_queue.payload. But that queue
 * row is GONE for effectively every real failure — store builds bypass the queue
 * (EXPO_PUBLIC_DREAM_QUEUE_ENABLED) and terminal queue rows prune at 30 days — so
 * the retry always failed with "couldn't retry that dream" (Kevin 2026-07-10).
 * The original request survives on dream_jobs.payload (owner-readable via RLS),
 * so we read it and hand it to Create instead. The failure already refunded the
 * sparkle; the re-run charges fresh like any Create dream, and the user sees the
 * inputs and can adjust before spending.
 */
import { supabase } from '@/lib/supabase';
import { useDreamStore } from '@/store/dream';
import { useAuthStore } from '@/store/auth';
import { Toast } from '@/components/Toast';
import * as nav from '@/lib/navigate';

const str = (v: unknown): string => (typeof v === 'string' ? v : '');

/** Prefill Create from a failed job's stored payload, then navigate there. */
export async function reopenFailedDreamInCreate(jobId: string): Promise<void> {
  const { data, error } = await supabase
    .from('dream_jobs')
    .select('payload')
    .eq('id', jobId)
    .maybeSingle();
  const p = (data?.payload ?? null) as Record<string, unknown> | null;
  if (error || !p) {
    // No stored inputs to reload — still drop them into Create to start fresh.
    if (__DEV__) console.warn('[reopenFailedDream] no payload for', jobId, error?.message);
    Toast.show("Couldn't find that dream's settings — starting fresh", 'information-circle');
    nav.push('/(tabs)/create');
    return;
  }
  useDreamStore.getState().setPendingCreatePreset({
    prompt: str(p.hint),
    medium: str(p.medium_key),
    vibe: str(p.vibe_key),
    model: typeof p.force_model === 'string' ? p.force_model : null,
  });
  nav.push('/(tabs)/create');
}

/**
 * Inbox catch-up: resolve the user's most-recent failed dream (notification rows
 * that predate reference_id carry no job id) and reopen it in Create.
 */
export async function reopenLatestFailedDream(): Promise<void> {
  const userId = useAuthStore.getState().user?.id;
  if (!userId) return;
  const { data } = await supabase
    .from('notifications')
    .select('reference_id')
    .eq('recipient_id', userId)
    .eq('type', 'dream_failed')
    .not('reference_id', 'is', null)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (data?.reference_id) {
    await reopenFailedDreamInCreate(data.reference_id);
  } else {
    // Nothing with stored inputs — just open Create fresh rather than dead-end.
    nav.push('/(tabs)/create');
  }
}
