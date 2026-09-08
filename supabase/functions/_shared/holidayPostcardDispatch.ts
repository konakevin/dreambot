// holidayPostcardDispatch.ts — the render's one-call hook into the `holiday-postcard`
// Edge Function (migration 459). Synchronous (the render awaits it) but strictly
// best-effort: any failure or timeout leaves the clean image and is logged as a
// fallback reason. Scope (engine_config.holiday_postcard_scope) is decided by the caller.
export interface PostcardDispatchResult {
  /** The isolate refused an oversize source; the cron backfills it (uploads.postcard_pending). */
  deferred?: boolean;
  ok: boolean;
  ms: number;
  reason: string; // for fallbackReasons
}

export async function dispatchHolidayPostcard(
  imageUrl: string,
  holiday: string,
  timeoutMs = 25_000
): Promise<PostcardDispatchResult> {
  const t0 = Date.now();
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!supabaseUrl || !serviceRoleKey) {
    return { ok: false, ms: 0, reason: 'postcard:skip:no_env' };
  }
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(`${supabaseUrl}/functions/v1/holiday-postcard`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${serviceRoleKey}` },
      body: JSON.stringify({ image_url: imageUrl, holiday }),
      signal: ctrl.signal,
    });
    const data = (await res.json().catch(() => ({}))) as {
      ok?: boolean;
      error?: string;
      skipped?: boolean;
      deferred?: boolean;
      ms?: number;
    };
    const ms = Date.now() - t0;
    if (data.ok === true)
      return { ok: true, ms, reason: `postcard:${holiday}:ok:${data.ms ?? ms}ms` };
    if (data.skipped) return { ok: false, ms, reason: `postcard:${holiday}:skip:no_artwork` };
    // Source too large for the isolate: the render marks uploads.postcard_pending and the
    // display-variant cron composites it with sharp (mig 479).
    if (data.deferred)
      return {
        ok: false,
        ms,
        deferred: true,
        reason: `postcard:${holiday}:deferred:${(data.error ?? 'too_large').slice(0, 40)}`,
      };
    return {
      ok: false,
      ms,
      reason: `postcard:${holiday}:fail:${(data.error ?? `http_${res.status}`).slice(0, 60)}`,
    };
  } catch (e) {
    const msg = (e as Error).name === 'AbortError' ? 'timeout' : (e as Error).message.slice(0, 60);
    return { ok: false, ms: Date.now() - t0, reason: `postcard:${holiday}:fail:${msg}` };
  } finally {
    clearTimeout(timer);
  }
}
