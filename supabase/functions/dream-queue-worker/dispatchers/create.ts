/**
 * Create / DLT dispatcher — FIRE-AND-FORGET dispatch of one queued user dream.
 *
 * Routes the job to generate-dream (or restyle-photo for restyle payloads) via
 * the x-dream-queue service path. That path ACKS 202 immediately and finishes
 * the render in EdgeRuntime.waitUntil, then updates dream_queue ITSELF
 * (completeQueueJob / failQueueJob in _shared/dreamQueueLifecycle.ts).
 *
 * So the worker does NOT await the multi-second render — it only confirms the
 * dispatch was accepted. This eliminates the worker gateway-timing-out (HTTP
 * 504) on a long render and false-failing one that actually succeeded (the bug
 * the dual-face-swap load test surfaced). A non-2xx here means the render never
 * started → throw so the worker re-queues with backoff.
 */

export interface CreateDispatcherArgs {
  supabaseUrl: string;
  serviceRoleKey: string;
  payload: Record<string, unknown>;
}

export async function dispatchCreateJob(args: CreateDispatcherArgs): Promise<void> {
  const { supabaseUrl, serviceRoleKey, payload } = args;

  // Restyle dreams render via restyle-photo (Kontext transform); everything
  // else (create / DLT) via generate-dream. The client marks restyle payloads
  // with photo_style:'restyle'. Both share the x-dream-queue service contract.
  const fn = payload.photo_style === 'restyle' ? 'restyle-photo' : 'generate-dream';

  const res = await fetch(`${supabaseUrl}/functions/v1/${fn}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // x-dream-queue auth = service-role (same as the x-dream-retry path).
      Authorization: `Bearer ${serviceRoleKey}`,
      'x-dream-queue': '1',
    },
    body: JSON.stringify(payload),
  });

  // We expect a fast 202 ack. Any non-2xx means the render never started.
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
