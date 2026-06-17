/**
 * Create / DLT dispatcher — SYNCHRONOUS dispatch of one queued user dream.
 *
 * Routes the job to generate-dream (or restyle-photo for restyle payloads) via
 * the x-dream-queue service path and AWAITS the full render (like the nightly
 * dispatch). The render owns dream_queue terminal state (completeQueueJob /
 * failQueueJob in _shared/dreamQueueLifecycle.ts) — both on success and on its
 * own failures (retry-backoff / dead_letter + refund + notify).
 *
 * History: this used to be FIRE-AND-FORGET — generate-dream acked 202 and
 * finished in EdgeRuntime.waitUntil. On 2026-06-17 the platform stopped honoring
 * waitUntil for background work, so the detached render was silently dropped
 * after the 202 (job stuck in_progress → dead_letter + false refund hours
 * later). Holding the connection open keeps the render's isolate alive, exactly
 * like nightly, which never had this problem.
 *
 * Ownership contract with the worker:
 *   • Any HTTP RESPONSE (2xx success OR 5xx handled-failure) ⇒ the render ran and
 *     owns its own dream_queue terminal state ⇒ return; the worker does nothing.
 *   • A pre-render 4xx (e.g. job not found) ⇒ the render never owned lifecycle
 *     ⇒ throw so the worker dead-letters.
 *   • A network/timeout error (no response) ⇒ throw; the worker re-queues, but
 *     ONLY if the job is still non-terminal (the worker re-checks status first),
 *     so a dropped connection on a render that actually succeeded can't
 *     re-render it.
 */

export interface CreateDispatcherArgs {
  supabaseUrl: string;
  serviceRoleKey: string;
  payload: Record<string, unknown>;
}

// Generous ceiling: a heavy dual render is ~60-90s; 180s leaves headroom under
// the 400s edge wall-clock without letting a truly-hung render block the worker
// forever. A timeout aborts → throw → worker re-queues (status-guarded).
const RENDER_TIMEOUT_MS = 180_000;

export async function dispatchCreateJob(args: CreateDispatcherArgs): Promise<void> {
  const { supabaseUrl, serviceRoleKey, payload } = args;

  // Restyle dreams render via restyle-photo (Kontext transform); everything
  // else (create / DLT) via generate-dream. The client marks restyle payloads
  // with photo_style:'restyle'. Both share the x-dream-queue service contract.
  const fn = payload.photo_style === 'restyle' ? 'restyle-photo' : 'generate-dream';

  let res: Response;
  try {
    res = await fetch(`${supabaseUrl}/functions/v1/${fn}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // x-dream-queue auth = service-role (same as the x-dream-retry path).
        Authorization: `Bearer ${serviceRoleKey}`,
        'x-dream-queue': '1',
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(RENDER_TIMEOUT_MS),
    });
  } catch (e) {
    // No HTTP response (network error / abort-timeout). The render's outcome is
    // unknown — surface it so the worker re-queues (it re-checks status first,
    // so a render that actually completed is left alone).
    throw new Error(`dispatch_unreachable:${(e as Error).message}`);
  }

  // 2xx = success (render set completed). 5xx = the render ran and handled its
  // own failure (failQueueJob: retry-backoff or dead_letter + refund + notify).
  // Either way the render OWNS the terminal state — the worker must not touch it.
  if (res.ok || res.status >= 500) return;

  // Pre-render 4xx (job not found, bad request, insufficient): the render never
  // owned lifecycle → surface so the worker dead-letters.
  let msg = `dispatch_http_${res.status}`;
  try {
    const d = await res.json();
    if (d && typeof d.error === 'string') msg = d.error;
  } catch {
    /* keep the http_<status> message */
  }
  throw new Error(msg);
}
