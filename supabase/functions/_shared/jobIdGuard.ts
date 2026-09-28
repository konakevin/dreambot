/**
 * A client-supplied job_id on a DIRECT (non-queue) render path must be NEW.
 *
 * charge_sparkles is idempotent on the job_id: a job_id that already carries a debit
 * answers 'already_charged'. The direct paths used to treat that as paid, so re-sending
 * an old paid dream's job_id rendered again for free, as often as the rate limit allowed
 * (audit 2026-09-27, S1/S2 critical). The queue path is different: enqueue-dream charged
 * it, so 'already_charged' is expected there and those callers never use this check.
 *
 * Run it BEFORE the render touches dream_jobs: generate-dream flips an existing row back
 * to 'processing', which refund-stuck-jobs would later refund. A job_id owned by another
 * user is refused too.
 */
import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.100.0';

export type JobIdCheck = 'ok' | 'job_id_reused' | 'job_check_failed';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(v: string): boolean {
  return UUID_RE.test(v);
}

export async function checkDirectJobId(
  supabase: SupabaseClient,
  userId: string,
  jobId: string
): Promise<JobIdCheck> {
  if (!isUuid(jobId)) return 'job_id_reused';
  const [debit, job] = await Promise.all([
    supabase
      .from('sparkle_transactions')
      .select('id')
      .eq('user_id', userId)
      .eq('reference_id', jobId)
      .lt('amount', 0)
      .limit(1),
    supabase.from('dream_jobs').select('user_id').eq('id', jobId).maybeSingle(),
  ]);
  // supabase-js resolves {error} instead of throwing: fail CLOSED on a failed read.
  if (debit.error || job.error) return 'job_check_failed';
  if ((debit.data ?? []).length > 0) return 'job_id_reused';
  const owner = (job.data as { user_id?: string } | null)?.user_id;
  if (owner && owner !== userId) return 'job_id_reused';
  return 'ok';
}
