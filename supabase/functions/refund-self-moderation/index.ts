/**
 * Edge Function: refund-self-moderation — refund a sparkle when the
 * client's pre-flight text moderation rejects a prompt.
 *
 * The client charges the sparkle BEFORE invoking generate-dream
 * (useDreamCreate.ts:156). When the user types a prompt that
 * `lib/moderation.ts` rejects, the request never reaches the server —
 * but the sparkle is already gone. This endpoint exists so the client
 * can issue a server-side refund for that case.
 *
 * Authenticated: caller must be the user receiving the refund. Server
 * verifies the jobId has no successful upload (prevents the user from
 * refunding completed dreams).
 *
 * POST /functions/v1/refund-self-moderation
 * Auth: Bearer <user JWT>
 * Body: { job_id: string, reason?: string }
 * Response 200: { refunded: boolean, reason: string }
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  job_id: string;
  /** Optional refund reason. Validated against allow-list. */
  reason?: string;
}

const ALLOWED_REASONS = new Set([
  'refund:hard_fail:client_moderation',
  'refund:hard_fail:client_aborted',
]);

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS_HEADERS });
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? serviceRoleKey;

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
    return new Response(JSON.stringify({ error: 'Not authenticated' }), {
      status: 401,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  let body: RequestBody;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  if (!body.job_id) {
    return new Response(JSON.stringify({ error: 'Missing job_id' }), {
      status: 400,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  const reason =
    body.reason && ALLOWED_REASONS.has(body.reason)
      ? body.reason
      : 'refund:hard_fail:client_moderation';

  // Service-role client for the verification + refund
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  // Anti-abuse check: a user shouldn't be able to refund a job that
  // produced an actual upload row. dream_jobs.id is the same UUID the
  // client passed as `job_id` in their original generate-dream call.
  const { data: jobRow } = await supabase
    .from('dream_jobs')
    .select('user_id, status')
    .eq('id', body.job_id)
    .maybeSingle();

  // Two valid states for refund: (1) no dream_jobs row exists yet (server
  // never started), (2) row exists for this user and status != 'done'.
  if (jobRow) {
    if (jobRow.user_id !== user.id) {
      return new Response(JSON.stringify({ error: 'Job belongs to another user' }), {
        status: 403,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }
    if (jobRow.status === 'done') {
      return new Response(JSON.stringify({ error: 'Job already completed; no refund' }), {
        status: 409,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }
  }

  // Idempotent refund (returns false if a prior refund exists for this jobId)
  const { data: refunded, error: refundErr } = await supabase.rpc('refund_sparkles', {
    p_user_id: user.id,
    p_amount: 1,
    p_reason: reason,
    p_reference_id: body.job_id,
  });

  if (refundErr) {
    console.error('[refund-self-moderation] Refund RPC failed:', refundErr.message);
    return new Response(JSON.stringify({ error: refundErr.message }), {
      status: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  console.log(
    `[refund-self-moderation] user=${user.id.slice(0, 8)} job=${body.job_id.slice(0, 8)} refunded=${refunded}`
  );

  return new Response(
    JSON.stringify({
      refunded: refunded === true,
      reason,
    }),
    { status: 200, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
  );
});
