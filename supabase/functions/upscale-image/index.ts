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

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { upscaleAndCache } from '../_shared/upscaleClarity.ts';

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

  // Pro gate: only Pro users (paid OR trial) can call this. The
  // is_pro_active() SQL function checks pro_subscription + expires_at +
  // pro_trial_started_at in one shot.
  const { data: proCheck } = await supabase.rpc('is_pro_active', {
    p_user_id: user.id,
  });
  if (!proCheck) {
    return json({ error: 'Pro subscription required' }, 403);
  }

  // Load the upload — we need the source image_url + need to check
  // whether image_url_hq is already populated (cache hit).
  const { data: uploadRow, error: uploadErr } = await supabase
    .from('uploads')
    .select('id, image_url, image_url_hq')
    .eq('id', body.upload_id)
    .maybeSingle();
  if (uploadErr || !uploadRow) {
    return json({ error: 'Upload not found' }, 404);
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

  const HQ_CAP_PER_MONTH = 100;
  if ((downloadsThisMonth ?? 0) >= HQ_CAP_PER_MONTH) {
    console.warn(
      `[upscale-image] user=${user.id.slice(0, 8)} hit ${HQ_CAP_PER_MONTH}/mo HD cap (count=${downloadsThisMonth})`
    );
    return json(
      {
        error: 'monthly_cap_reached',
        message: `You've hit the ${HQ_CAP_PER_MONTH}/month HD download limit. Resets the 1st of next month.`,
      },
      429
    );
  }

  // Record this requester + charge a cap slot. notified_at defaults to now()
  // = SUPPRESSED: a requester watching the modal gets the HD auto-saved in
  // front of them and should NOT also be pinged. The completion notify loop
  // only pings rows where notified_at IS NULL — set back to NULL by
  // allow_upscale_notify() when the user dismisses/times out (migration 191).
  await supabase
    .from('upscale_requests')
    .insert({ upload_id: body.upload_id, user_id: user.id, notified_at: new Date().toISOString() });
  await supabase
    .from('pro_hq_downloads_log')
    .insert({ user_id: user.id, upload_id: body.upload_id })
    .then(
      () => {},
      (err: { message?: string }) =>
        console.warn(`[upscale-image] cap log failed: ${err?.message ?? 'unknown'}`)
    );

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
        const { data: pending } = await supabase
          .from('upscale_requests')
          .select('user_id')
          .eq('upload_id', uploadId)
          .is('notified_at', null);
        for (const r of pending ?? []) {
          await supabase.from('notifications').insert({
            recipient_id: r.user_id,
            actor_id: r.user_id,
            type: 'download_ready',
            upload_id: uploadId,
            body: 'download:Your HD download is ready ✨',
          });
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
    })().catch((e) => console.error('[upscale-image] upscale task threw:', (e as Error).message));

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
