/**
 * First-dream dispatcher — SYNCHRONOUS dispatch of one queued onboarding first
 * dream to the first-dream-render orchestrator.
 *
 * Same render-owns-lifecycle contract as create/dlt: first-dream-render renders
 * with the connection held open (the worker awaits this) and owns the dream_queue
 * terminal state (complete / re-queue the next cascade tier / dead_letter). It
 * used to ack 202 + render in EdgeRuntime.waitUntil, but the platform stopped
 * honoring waitUntil for background work (2026-06-17), so the detached render was
 * dropped. Auth is the worker token (not service-role).
 *
 * Ownership contract with the worker (mirrors create.ts):
 *   • Any HTTP response (2xx / 5xx) ⇒ the orchestrator ran + owns terminal state ⇒ return.
 *   • A pre-render 4xx ⇒ throw so the worker dead-letters.
 *   • Network/timeout (no response) ⇒ throw; the worker re-queues, status-guarded.
 */

export interface FirstDreamDispatcherArgs {
  supabaseUrl: string;
  workerToken: string;
  jobId: string;
}

const RENDER_TIMEOUT_MS = 180_000;

export async function dispatchFirstDreamJob(args: FirstDreamDispatcherArgs): Promise<void> {
  const { supabaseUrl, workerToken, jobId } = args;

  let res: Response;
  try {
    res = await fetch(`${supabaseUrl}/functions/v1/first-dream-render`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${workerToken}`,
      },
      body: JSON.stringify({ job_id: jobId }),
      signal: AbortSignal.timeout(RENDER_TIMEOUT_MS),
    });
  } catch (e) {
    throw new Error(`dispatch_unreachable:${(e as Error).message}`);
  }

  // Any HTTP response ⇒ the orchestrator ran and owns its own terminal state.
  if (res.ok || res.status >= 500) return;

  // Pre-render 4xx ⇒ surface so the worker dead-letters.
  let msg = `dispatch_http_${res.status}`;
  try {
    const d = await res.json();
    if (d && typeof d.error === 'string') msg = d.error;
  } catch {
    /* keep the http_<status> message */
  }
  throw new Error(msg);
}
