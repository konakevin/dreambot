/**
 * First-dream dispatcher — FIRE-AND-FORGET dispatch of one queued onboarding
 * first dream to the first-dream-render orchestrator.
 *
 * Same render-owns-lifecycle contract as create/dlt: first-dream-render acks 202
 * immediately and finishes in EdgeRuntime.waitUntil, then owns the dream_queue
 * terminal state itself (complete on success, re-queue the next tier on a
 * cascadeable failure, dead_letter when all tiers are exhausted). The worker
 * does NOT await the render — it only confirms the dispatch was accepted (a
 * non-2xx here means the orchestrator never started → throw so the worker
 * re-queues with backoff). Auth is the worker token (first-dream-render checks
 * DREAM_QUEUE_WORKER_TOKEN), not service-role.
 */

export interface FirstDreamDispatcherArgs {
  supabaseUrl: string;
  workerToken: string;
  jobId: string;
}

export async function dispatchFirstDreamJob(args: FirstDreamDispatcherArgs): Promise<void> {
  const { supabaseUrl, workerToken, jobId } = args;

  const res = await fetch(`${supabaseUrl}/functions/v1/first-dream-render`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${workerToken}`,
    },
    body: JSON.stringify({ job_id: jobId }),
  });

  if (!res.ok) {
    let msg = `dispatch_http_${res.status}`;
    try {
      const d = await res.json();
      if (d && typeof d.error === 'string') msg = d.error;
    } catch {
      /* keep the http_<status> message */
    }
    throw new Error(msg);
  }
}
