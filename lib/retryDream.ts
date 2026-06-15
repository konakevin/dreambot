/**
 * Retry a FAILED dream by re-enqueuing its exact stored payload (server-side),
 * then watch the fresh job on the loading screen. The failure already refunded
 * the sparkle, so this is a clean fresh charge. Used by the failure toast and
 * the inbox dream_failed row.
 *
 * `enqueue-dream` (retry_job_id branch) loads the prior dream_queue.payload —
 * the verbatim RequestBody — so prompt/model/medium/vibe/photo reproduce
 * exactly. It rejects content/NSFW rejections server-side; the UI only offers
 * retry for render/infra failures anyway.
 */
import { supabase } from '@/lib/supabase';
import { useDreamStore } from '@/store/dream';
import { useAuthStore } from '@/store/auth';
import { Toast } from '@/components/Toast';
import * as nav from '@/lib/navigate';

export async function retryDream(jobId: string): Promise<void> {
  try {
    const { data, error } = await supabase.functions.invoke('enqueue-dream', {
      body: { retry_job_id: jobId },
    });
    const newId = (data as { dream_id?: string } | null)?.dream_id;
    if (error || !newId) {
      throw new Error((data as { error?: string } | null)?.error ?? 'retry_failed');
    }
    // Point the loading screen at the fresh job + clear any stale failure.
    useDreamStore.getState().setActiveJobId(newId);
    useDreamStore.getState().setActiveJobFailure(null);
    nav.replace(`/dream/loading?watch=${newId}`);
  } catch (e) {
    Toast.show("Couldn't retry that dream — try again from Create", 'close-circle');
    if (__DEV__) console.warn('[retryDream]', (e as Error).message);
  }
}

/**
 * Retry from the INBOX, where the row doesn't carry the job id: resolve the
 * user's most-recent failed dream that has a job reference, then retry it.
 * (The live failure toast is precise — it has reference_id at the moment of
 * failure; this is the catch-up path for a failure found later in the inbox.)
 */
export async function retryLatestFailedDream(): Promise<void> {
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
    await retryDream(data.reference_id);
  } else {
    Toast.show("Couldn't find that dream to retry", 'close-circle');
  }
}
