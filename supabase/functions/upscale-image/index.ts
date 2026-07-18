/**
 * Edge Function: upscale-image — ASYNC on-demand HD upscale of a posted dream
 * via Clarity Upscaler (philz1337x/clarity-upscaler). Pro-gated. Nothing is
 * auto-upscaled; this runs the first time someone downloads a post, caches onto
 * uploads.image_url_hq, and notifies the requester(s) when ready. Every later
 * download is an instant cache hit. See UPSCALE_QUEUE_PLAN.md.
 *
 * POST /functions/v1/upscale-image
 * Auth: Bearer <user JWT>
 * Body: { upload_id: string }
 * Response:
 *   200 { status: 'done', image_url_hq }   — already cached, save now
 *   202 { status: 'processing' }           — kicked (or joined) an upscale;
 *                                            client shows a dismissable modal,
 *                                            gets a `download_ready` notification
 *   403 Pro required | 429 monthly cap | 404 not found | 401 unauth
 *
 * Dedup (three layers): (1) claim_upscale_job() guarantees ONE Replicate run
 * per upload even with concurrent requesters; (2) secondary requesters return
 * 202 and the client modal polls uploads.image_url_hq, so everyone resolves to
 * the SAME cached image; (3) the HQ object is written to a deterministic key
 * (`${userId}/hq/${uploadId}.png`, upsert) so the rare re-run (stale-reclaim /
 * failed-retry) OVERWRITES rather than orphaning a second copy. All requesters
 * are notified when it lands. Reliability: the kick runs via
 * EdgeRuntime.waitUntil; a stuck-job sweep re-runs any upload whose isolate died.
 *
 * Why Clarity (not Real-ESRGAN): Real-ESRGAN is trained on photos and mangles
 * tiny illustrated features (TinyBot/ChibiBot eyes); Clarity is an SDXL
 * diffusion upscaler faithful to both photoreal and illustrated content.
 *
 * Output: 2× → 1536×2688 (~4 MP HD), ~17s, ~$0.02/run. (Was 4×/16 MP/~64s — too
 * slow + ~4× the cost for a phone download.)
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.100.0';
import { upscaleAndCache } from '../_shared/upscaleClarity.ts';
import { captureRenderError } from '../_shared/sentry.ts';
import { captureServer } from '../_shared/posthogCapture.ts';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  upload_id: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS_HEADERS });
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? serviceRoleKey;
  const replicateToken = Deno.env.get('REPLICATE_API_TOKEN');
  if (!replicateToken) return json({ error: 'REPLICATE_API_TOKEN missing' }, 500);

  // Authenticate the caller
  const authHeader = req.headers.get('authorization') ?? '';
  const supabaseUser = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
  });
  const {
    data: { user },
    error: authError,
  } = await supabaseUser.auth.getUser();
  if (authError || !user) {
    return json({ error: 'Not authenticated' }, 401);
  }

  let body: RequestBody;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }
  if (!body.upload_id) {
    return json({ error: 'Missing upload_id' }, 400);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  // Per-minute rate limit (2026-07-01 audit S4). The monthly HD cap alone left
  // upscale burst-abusable: fire N parallel requests before the count-then-cap
  // check commits → N Replicate upscaler calls + monthly cap blown in seconds.
  // Reuse the proven edge_function_invocations trigger (10 expensive calls/min
  // per user) exactly like generate-dream/restyle-photo. Fail-open on a logging
  // error (never block a legit HD download on infra); the monthly cap below is
  // the hard economic gate.
  {
    const { error: rlErr } = await supabase
      .from('edge_function_invocations')
      .insert({ user_id: user.id, function_name: 'upscale-image' });
    if (rlErr) {
      const isRl =
        rlErr.message?.includes('rate_limited') ||
        (rlErr as { hint?: string }).hint === 'rate_limited';
      if (isRl) return json({ error: 'rate_limited' }, 429);
      console.error('[upscale-image] rate-limit log INSERT failed:', rlErr.message);
    }
  }

  // Load the upload FIRST — we need the owner (a user can ALWAYS HD-download
  // their OWN dream, free + uncapped), the source image_url, and whether
  // image_url_hq is already populated (cache hit).
  const { data: uploadRow, error: uploadErr } = await supabase
    .from('uploads')
    .select('id, user_id, image_url, image_url_hq, face_swap_mode')
    .eq('id', body.upload_id)
    .maybeSingle();
  if (uploadErr || !uploadRow) {
    return json({ error: 'Upload not found' }, 404);
  }

  // HD is never available for Dream-Cast dreams (single or dual face swap):
  // upscaling an already-rendered AI face forces it into the uncanny valley.
  // The client already hides "Save in HD" for these, but enforce server-side so
  // a stale/forged client can't trigger it. The native-resolution "Save to
  // Photos" path doesn't hit this fn, so it's unaffected. (migration 310)
  if (uploadRow.face_swap_mode) {
    return json({ error: 'hd_unavailable_face_swap' }, 422);
  }

  const isOwn = uploadRow.user_id === user.id;

  // Subscription gate: Pro (paid OR trial) and DreamBot Basic (paid) can HD-
  // download ANY dream (at per-tier monthly caps). Everyone — including free /
  // expired-sub users — can always HD-download their OWN dreams, so owners skip
  // the gate (and the cap below). is_pro_active() folds in the trial window;
  // is_basic_active() is paid-only.
  const { data: isPro } = await supabase.rpc('is_pro_active', { p_user_id: user.id });
  const { data: isBasic } = await supabase.rpc('is_basic_active', { p_user_id: user.id });
  if (!isPro && !isBasic && !isOwn) {
    return json({ error: 'Subscription required' }, 403);
  }

  // Cache hit — already upscaled (a prior downloader did the work). Instant.
  if (uploadRow.image_url_hq) {
    return json({ status: 'done', image_url_hq: uploadRow.image_url_hq }, 200);
  }

  // Dedup double-taps: if this user already has a pending (un-notified) request
  // for this upload, don't re-charge or re-enqueue — just say it's coming.
  const { data: existingReq } = await supabase
    .from('upscale_requests')
    .select('id')
    .eq('upload_id', body.upload_id)
    .eq('user_id', user.id)
    .is('notified_at', null)
    .maybeSingle();
  if (existingReq) {
    return json({ status: 'processing' }, 202);
  }

  // Monthly HD download cap (per Pro user). Counts the unique posts a user has
  // triggered an upscale for this month; re-downloads of an already-cached post
  // hit the cache branch above and are free.
  const monthStart = new Date();
  monthStart.setUTCDate(1);
  monthStart.setUTCHours(0, 0, 0, 0);
  const { count: downloadsThisMonth } = await supabase
    .from('pro_hq_downloads_log')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gte('created_at', monthStart.toISOString());

  // Per-tier monthly cap: Pro = 100; Basic-only = engine_config
  // basic_hd_downloads_per_month (default 20). A user who is both (shouldn't
  // happen — mutually exclusive group) gets the Pro cap (Pro wins).
  const PRO_HQ_CAP_PER_MONTH = 100;
  let HQ_CAP_PER_MONTH = PRO_HQ_CAP_PER_MONTH;
  if (!isPro && isBasic) {
    const { data: ec } = await supabase
      .from('engine_config')
      .select('basic_hd_downloads_per_month')
      .eq('id', 1)
      .single();
    HQ_CAP_PER_MONTH = Number(ec?.basic_hd_downloads_per_month ?? 20);
  }
  // Own dreams are always free + uncapped — only meter downloads of OTHERS'.
  if (!isOwn && (downloadsThisMonth ?? 0) >= HQ_CAP_PER_MONTH) {
    console.warn(
      `[upscale-image] user=${user.id.slice(0, 8)} hit ${HQ_CAP_PER_MONTH}/mo HD cap (count=${downloadsThisMonth})`
    );
    // Structured fields (cap / tier / resets_on) so the client can render an
    // accurate premium gate — the message alone was previously unreachable
    // (supabase-js delivers non-2xx as `error`, which the old client swallowed).
    const reset = new Date(monthStart);
    reset.setUTCMonth(reset.getUTCMonth() + 1);
    const resetsOn = reset.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC',
    });
    return json(
      {
        error: 'monthly_cap_reached',
        message: `You've hit the ${HQ_CAP_PER_MONTH}/month HD download limit. Resets ${resetsOn}.`,
        cap: HQ_CAP_PER_MONTH,
        tier: isPro ? 'pro' : 'basic',
        resets_on: resetsOn,
      },
      429
    );
  }

  // Record this requester + charge a cap slot. notified_at defaults to NULL =
  // WILL be notified on completion (the notify loop pings every notified_at IS
  // NULL row). We notify ALL requesters — including one watching the modal —
  // because the only client signal that a user "left" is them backgrounding,
  // and a KILLED app sends no dismiss/timeout, so the old suppress-then-re-enable
  // design (migration 191) silently dropped the ping for anyone who closed the
  // app mid-upscale. The watcher isn't spammed: foreground push banners are
  // suppressed client-side, the modal still auto-saves in front of them, and the
  // inbox row is accurate. (allow_upscale_notify is now unused — vestigial.)
  //
  // Race-safety: the dedup SELECT above is TOCTOU — two concurrent requests
  // for the same (upload, user) can both miss the existing row and try to
  // INSERT. The partial unique index from migration 225 catches the loser
  // with 23505 (unique_violation); we treat that as "joined the existing
  // request" and return processing. Postgres ON CONFLICT inference can't
  // target a partial index from supabase-js (the WHERE clause doesn't pass
  // through), so we rely on the error code instead.
  const insertRes = await supabase
    .from('upscale_requests')
    .insert({ upload_id: body.upload_id, user_id: user.id });
  if (insertRes.error) {
    if (insertRes.error.code === '23505') {
      return json({ status: 'processing' }, 202);
    }
    console.warn(`[upscale-image] upscale_requests insert failed: ${insertRes.error.message}`);
    return json({ error: 'Failed to record request' }, 500);
  }
  // Only count downloads of OTHERS' dreams toward the monthly cap — own dreams
  // are uncapped, so they must not consume a paid user's cap slots.
  if (!isOwn) {
    await supabase
      .from('pro_hq_downloads_log')
      .insert({ user_id: user.id, upload_id: body.upload_id })
      .then(
        () => {},
        (err: { message?: string }) =>
          console.warn(`[upscale-image] cap log failed: ${err?.message ?? 'unknown'}`)
      );
  }

  // Atomically claim the work. Only the caller that gets the upload_id back
  // KICKS the upscale (one Replicate run per upload, even with concurrent
  // requesters + stale-job recovery). Everyone else just waits to be notified.
  const { data: claim } = await supabase.rpc('claim_upscale_job', {
    p_upload_id: body.upload_id,
  });
  const shouldKick = Array.isArray(claim) ? claim.length > 0 : !!claim;

  if (shouldKick) {
    const sourceUrl = uploadRow.image_url as string;
    const uploadId = body.upload_id as string;
    console.log(`[upscale-image] kicking on-demand upscale upload=${uploadId.slice(0, 8)}`);
    const task = (async () => {
      const hqUrl = await upscaleAndCache(supabase, replicateToken, uploadId, sourceUrl, user.id);
      if (hqUrl) {
        await supabase
          .from('upscale_jobs')
          .update({ status: 'completed', updated_at: new Date().toISOString() })
          .eq('upload_id', uploadId);
        // Notify every requester not yet told (inserting a notification fires
        // the push via the notifications webhook). Multiple users → each pinged.
        // Dedup by user_id: the partial unique index (migration 225) prevents
        // duplicates going forward, but ANY existing duplicate rows + any
        // future bug in the upsert path shouldn't double-push.
        const { data: pending } = await supabase
          .from('upscale_requests')
          .select('user_id')
          .eq('upload_id', uploadId)
          .is('notified_at', null);
        const uniqueRecipients = [...new Set((pending ?? []).map((r) => r.user_id))];
        for (const userId of uniqueRecipients) {
          await supabase.from('notifications').insert({
            recipient_id: userId,
            actor_id: userId,
            type: 'download_ready',
            subtype: 'download',
            upload_id: uploadId,
            body: 'Your HD download is ready',
          });
          // AUTHORITATIVE hd_download_completed — the on-demand upscale renders
          // async (server-side) after the tap; this fires per requester when their
          // HD is actually ready, independent of the app being open.
          await captureServer(
            userId,
            'hd_download_completed',
            { upload_id: uploadId },
            {
              dedupKey: `hd_completed:${uploadId}:${userId}`,
            }
          );
        }
        await supabase
          .from('upscale_requests')
          .update({ notified_at: new Date().toISOString() })
          .eq('upload_id', uploadId)
          .is('notified_at', null);
      } else {
        await supabase
          .from('upscale_jobs')
          .update({
            status: 'failed',
            last_error: 'upscaleAndCache returned null',
            updated_at: new Date().toISOString(),
          })
          .eq('upload_id', uploadId);
        // The stuck-sweep retries; if it ultimately gives up it notifies failure.
      }
    })().catch((e) => {
      console.error('[upscale-image] upscale task threw:', (e as Error).message);
      // Surface to Sentry too — console-only meant a persistent upscale failure
      // was invisible until the stuck-job sweep (every 10m) re-ran it. The sweep
      // still recovers the work; this just makes a repeating failure diagnosable.
      void captureRenderError(e, {
        fn: 'upscale-image',
        stage: 'upscale',
        jobId: uploadId,
        userId: user.id,
      });
    });

    const er = (globalThis as { EdgeRuntime?: { waitUntil?: (p: Promise<unknown>) => void } })
      .EdgeRuntime;
    if (er?.waitUntil) er.waitUntil(task);
  }

  return json({ status: 'processing' }, 202);
});

function json(payload: unknown, status: number): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}
