/**
 * Create / DLT dispatcher — processes one queued user-initiated dream.
 *
 * Routes the job to the generate-dream renderer via its `x-dream-queue: 1`
 * service path, which renders in its OWN isolate (escaping THIS worker isolate's
 * budget) and returns the upload_id synchronously. The worker awaits this in its
 * long background budget, so a ~24s render is fine. The payload IS the full
 * generate-dream RequestBody the client built (incl. `job_id` = the dream_queue
 * row id), so the renderer resolves the user + reuses the same idempotency key.
 *
 * Unlike nightly there's no bot-message / finalize / dreamer-notification step:
 * the row is a PRIVATE draft the user reveals + posts themselves (reveal flow).
 *
 * Returns the upload_id; the worker sets dream_queue.status based on whether
 * this throws. Throws 'nsfw:...' for a safety rejection so the worker
 * dead-letters immediately instead of retrying a doomed render 5×.
 */

export interface CreateDispatcherArgs {
  supabaseUrl: string;
  serviceRoleKey: string;
  payload: Record<string, unknown>;
}

export async function processCreateJob(args: CreateDispatcherArgs): Promise<string> {
  const { supabaseUrl, serviceRoleKey, payload } = args;

  const res = await fetch(`${supabaseUrl}/functions/v1/generate-dream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // x-dream-queue auth = service-role (same as the x-dream-retry path).
      Authorization: `Bearer ${serviceRoleKey}`,
      'x-dream-queue': '1',
    },
    body: JSON.stringify(payload),
  });

  let data: Record<string, unknown> = {};
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) {
    const errMsg =
      (data.error as string) ||
      (data.refund_reason as string) ||
      `create_render_http_${res.status}`;
    // generate-dream returns { nsfw:true, refund_reason:'nsfw' } on a safety
    // block — terminal, won't pass on retry. Dead-letter immediately.
    if (data.nsfw === true || /nsfw|safety/i.test(errMsg)) {
      throw new Error(`nsfw:${errMsg}`);
    }
    throw new Error(errMsg);
  }

  const uploadId = data.upload_id as string | undefined;
  if (!uploadId) throw new Error('create_render_no_upload_id');
  return uploadId;
}
