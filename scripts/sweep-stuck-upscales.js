/**
 * sweep-stuck-upscales.js — reliability backstop for on-demand HD upscales.
 *
 * The happy path: request-upscale (upscale-image Edge Function) kicks the
 * upscale via EdgeRuntime.waitUntil and notifies requesters on completion. If
 * that isolate dies mid-run, the upscale_jobs row is left 'processing' forever
 * and the user never hears back. This sweep (cron) re-runs any job that is
 * stuck 'processing' (stale) or 'failed', then notifies its requesters — so a
 * user who asked for an HD download ALWAYS gets it.
 *
 * Bounded per run; gives up auto-retrying after 5 attempts (a fresh user
 * request can still re-trigger it). See UPSCALE_QUEUE_PLAN.md.
 */

const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const { upscaleAndCache } = require('./lib/upscaleClarity');

function loadEnv() {
  try {
    for (const line of fs.readFileSync('.env.local', 'utf8').split('\n')) {
      const eq = line.indexOf('=');
      if (eq > 0 && !process.env[line.slice(0, eq).trim()]) {
        process.env[line.slice(0, eq).trim()] = line
          .slice(eq + 1)
          .trim()
          .replace(/^["']|["']$/g, '');
      }
    }
  } catch {
    /* CI: env from secrets */
  }
}
loadEnv();

const SUPABASE_URL =
  process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://jimftynwrinwenonjrlj.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const REPLICATE_TOKEN = process.env.REPLICATE_API_TOKEN;
const STALE_MIN = 10;
const MAX_ATTEMPTS = 5;
const BATCH = 8;

async function notifyRequesters(sb, uploadId) {
  const { data: pending } = await sb
    .from('upscale_requests')
    .select('user_id')
    .eq('upload_id', uploadId)
    .is('notified_at', null);
  for (const r of pending || []) {
    await sb.from('notifications').insert({
      recipient_id: r.user_id,
      actor_id: r.user_id,
      type: 'download_ready',
      upload_id: uploadId,
      body: 'download:Your HD download is ready ✨',
    });
  }
  await sb
    .from('upscale_requests')
    .update({ notified_at: new Date().toISOString() })
    .eq('upload_id', uploadId)
    .is('notified_at', null);
}

(async () => {
  if (!SERVICE_KEY || !REPLICATE_TOKEN) {
    console.error('missing SUPABASE_SERVICE_ROLE_KEY or REPLICATE_API_TOKEN');
    process.exit(1);
  }
  const sb = createClient(SUPABASE_URL, SERVICE_KEY);
  const staleCutoff = new Date(Date.now() - STALE_MIN * 60 * 1000).toISOString();

  // Stuck = 'failed', or 'processing' that hasn't moved in STALE_MIN.
  const { data: jobs, error } = await sb
    .from('upscale_jobs')
    .select('upload_id, status, attempts, updated_at')
    .lt('attempts', MAX_ATTEMPTS)
    .or(`status.eq.failed,and(status.eq.processing,updated_at.lt.${staleCutoff})`)
    .order('updated_at', { ascending: true })
    .limit(BATCH);
  if (error) {
    console.error('sweep query failed:', error.message);
    process.exit(1);
  }
  if (!jobs || jobs.length === 0) {
    console.log('no stuck upscale jobs');
    return;
  }
  console.log(`sweeping ${jobs.length} stuck upscale job(s)`);

  for (const job of jobs) {
    const uploadId = job.upload_id;
    const { data: up } = await sb
      .from('uploads')
      .select('image_url, image_url_hq, user_id')
      .eq('id', uploadId)
      .maybeSingle();
    if (!up) {
      await sb.from('upscale_jobs').update({ status: 'completed' }).eq('upload_id', uploadId);
      continue;
    }
    // Already done (someone completed it) — just finish notifying.
    if (up.image_url_hq) {
      await sb
        .from('upscale_jobs')
        .update({ status: 'completed', updated_at: new Date().toISOString() })
        .eq('upload_id', uploadId);
      await notifyRequesters(sb, uploadId);
      continue;
    }

    await sb
      .from('upscale_jobs')
      .update({ status: 'processing', updated_at: new Date().toISOString() })
      .eq('upload_id', uploadId);

    const hqUrl = await upscaleAndCache(sb, REPLICATE_TOKEN, uploadId, up.image_url, up.user_id);
    if (hqUrl) {
      await sb
        .from('upscale_jobs')
        .update({ status: 'completed', updated_at: new Date().toISOString() })
        .eq('upload_id', uploadId);
      await notifyRequesters(sb, uploadId);
      console.log(`  ✓ recovered ${uploadId.slice(0, 8)}`);
    } else {
      await sb
        .from('upscale_jobs')
        .update({
          status: 'failed',
          attempts: (job.attempts || 0) + 1,
          last_error: 'sweep upscale returned null',
          updated_at: new Date().toISOString(),
        })
        .eq('upload_id', uploadId);
      console.warn(
        `  ✗ still failing ${uploadId.slice(0, 8)} (attempt ${(job.attempts || 0) + 1})`
      );
    }
  }
  console.log('sweep done');
})().catch((e) => {
  console.error('sweep threw:', e.message);
  process.exit(1);
});
