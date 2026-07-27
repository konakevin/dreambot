/**
 * Edge Function: dream-off-submit
 *
 * The enqueue endpoint for a Dream Off game ENTRY. Shape mirrors enqueue-dream,
 * but the sparkle charge is replaced by the atomic economy RPC
 * `dream_off_submit_entry` (funding decision: draw the owner-funded pot down, else
 * self-pay; tier gate 1; seeds the entry keyed by the render job_id). The render
 * itself then flows through the SAME dream_queue → dream-queue-worker →
 * generate-dream path as a normal create, fenced by `source='dream_off'` +
 * `payload.game_id` (generate-dream's completion hook attaches it to the entry).
 *
 * One UUID across dream_queue.id == dream_jobs.id == the entry's payment_reference
 * == the pot-ledger/sparkle reference_id, so charge/refund/attach all key off it.
 *
 * Born dark: dream_off_submit_entry returns 'disabled' while
 * engine_config.dream_off_enabled = false, so this endpoint is inert until launch.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.100.0';
import { fetchEngineConfig } from '../_shared/engineConfig.ts';
import { classifyDreamWeight } from '../_shared/dreamQueueWeight.ts';
import { sanitizeUserText } from '../_shared/sanitizeUserText.ts';

const SPIN_MIN = 3;

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function json(obj: unknown, status: number): Response {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  // Auth — the gateway validated the JWT; trust it to identify the user.
  const authHeader = req.headers.get('authorization') ?? '';
  const supabaseUser = createClient(
    supabaseUrl,
    Deno.env.get('SUPABASE_ANON_KEY') ?? serviceRoleKey,
    { global: { headers: { Authorization: authHeader } } }
  );
  const {
    data: { user },
    error: authError,
  } = await supabaseUser.auth.getUser();
  if (authError || !user) {
    return json({ error: 'Not authenticated' }, 401);
  }
  const userId = user.id;

  const gameId = typeof body.game_id === 'string' ? body.game_id : null;
  if (!gameId) return json({ error: 'missing_game_id' }, 400);
  // The player must pick a model from the game's tier (tier gate 1 rejects anything
  // outside it). We never silently coerce — a bad model is a client bug, not a
  // free downgrade.
  const modelId = typeof body.force_model === 'string' ? body.force_model : null;
  if (!modelId) return json({ error: 'missing_model' }, 400);

  // The player's embellishment on the shared base scene — the heart of the game,
  // and REQUIRED (no submitting the bare base). Sanitize up front (NFKC + control/
  // zero-width/bidi strip + injection-neutralize + cap) BEFORE we charge, so an
  // empty/garbage spin is rejected free. cap 'hint' (240) — the UI caps at 140.
  const spin = sanitizeUserText(typeof body.spin === 'string' ? body.spin : '', 'hint');
  if (spin.length < SPIN_MIN) return json({ error: 'missing_spin' }, 400);

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  // One UUID across dream_queue / dream_jobs / the entry's payment_reference /
  // the pot-ledger + sparkle reference. Prefer the client's job_id (already set as
  // the loading-screen subscription key); fall back to a server UUID.
  const jobId =
    typeof body.job_id === 'string' && body.job_id.length > 0 ? body.job_id : crypto.randomUUID();

  // The atomic funding + entry-seed RPC (charge is INSIDE it: pot draw-down or
  // self-pay; tier gate 1; creates the rendering entry keyed by jobId).
  const { data: submit, error: submitErr } = await supabase.rpc('dream_off_submit_entry', {
    p_game_id: gameId,
    p_user_id: userId,
    p_entry_job_id: jobId,
    p_model_id: modelId,
  });
  if (submitErr) {
    // The RPC RAISES for not-authenticated / not-a-member / game-not-found.
    const msg = submitErr.message ?? '';
    if (/not a member/.test(msg)) return json({ error: 'not_a_member' }, 403);
    if (/game not found/.test(msg)) return json({ error: 'game_not_found' }, 404);
    console.error(`[dream-off-submit] submit RPC failed (game ${gameId}, user ${userId}): ${msg}`);
    return json({ error: 'submit_failed' }, 500);
  }
  const status = (submit as { status?: string } | null)?.status;
  switch (status) {
    case 'ok':
      break;
    case 'disabled':
      return json({ error: 'dream_off_disabled' }, 403);
    case 'closed':
      return json({ error: 'submission_closed' }, 409);
    case 'model_not_allowed':
      return json({ error: 'model_not_allowed' }, 400);
    case 'already_submitted':
      return json({ error: 'already_submitted' }, 409);
    case 'insufficient':
      return json(
        { error: 'insufficient_sparkles', needed: (submit as { price?: number }).price },
        402
      );
    default:
      return json({ error: `submit_${status ?? 'unknown'}` }, 400);
  }

  // Build the render prompt SERVER-SIDE so the base scene is authoritative (read
  // from the game row, never trusted from the client) — everyone in the game
  // renders the SAME starting point, and only their spin differs. We hand
  // generate-dream `base + spin` as the subject; its Sonnet brief fuses them into
  // one coherent Flux prompt. Wording mirrors components/dreamOff/topicWording.ts.
  const { data: game } = await supabase
    .from('dream_offs')
    .select('topic, pack_category, cast_mode')
    .eq('id', gameId)
    .single();
  const topic = typeof game?.topic === 'string' ? game.topic.trim() : '';
  const base =
    game?.pack_category === 'cast'
      ? `${game?.cast_mode === 'couple' ? 'You and your +1 as' : 'You as'} ${topic}`.trim()
      : topic;
  const finalPrompt = base ? `${base}, ${spin}` : spin;

  // Overwrite any client-sent prompt with the server-built one; drop the raw spin
  // (not a generate-dream field). generate-dream re-sanitizes body.prompt at its
  // gate, so this is belt-and-suspenders clean before it reaches Flux/Sonnet.
  body.prompt = finalPrompt;
  delete body.spin;

  // Payload IS the render's RequestBody, stamped with game_id + author_id so the
  // dream_off completion hook in generate-dream attaches the finished upload to the
  // entry (and forfeits+refunds on an NSFW moderation).
  const payload = { ...body, job_id: jobId, game_id: gameId, author_id: userId };

  const cfg = await fetchEngineConfig(supabase);
  const weight = classifyDreamWeight(body, {
    relationshipWords: cfg.relationshipWords,
    petWords: cfg.petWords,
    selfRefRegex: cfg.selfRefRegex,
  });

  await supabase
    .from('dream_jobs')
    .upsert(
      { id: jobId, user_id: userId, status: 'processing', payload },
      { onConflict: 'id', ignoreDuplicates: true }
    );

  const { error: enqErr } = await supabase.from('dream_queue').insert({
    id: jobId,
    user_id: userId,
    source: 'dream_off',
    weight,
    payload,
    status: 'queued',
    dedup_key: `dream_off:${jobId}`,
  });
  if (enqErr) {
    // Idempotent retry: the same job is already queued/rendering (lost response,
    // client resent). The entry + charge are keyed off jobId, so return success
    // and DON'T refund (the entry is already rendering).
    if (enqErr.code === '23505') {
      return json({ dream_id: jobId, status: 'queued' }, 200);
    }
    // Genuine enqueue failure AFTER the submit charged — undo it (pot-aware refund,
    // keyed on the same jobId) so the entrant isn't out sparkles for a render that
    // will never run.
    await supabase.rpc('dream_off_refund_entry', { p_game_id: gameId, p_entry_job_id: jobId }).then(
      () => {},
      (err: unknown) =>
        console.error(
          `[dream-off-submit] refund FAILED after enqueue error — user ${userId} game ${gameId} job ${jobId}:`,
          err instanceof Error ? err.message : String(err)
        )
    );
    return json({ error: `enqueue_failed: ${enqErr.message}` }, 500);
  }

  // Kick the worker for fast pickup; the 1-min cron backstops a missed kick.
  const workerToken = Deno.env.get('DREAM_QUEUE_WORKER_TOKEN');
  if (workerToken) {
    await fetch(`${supabaseUrl}/functions/v1/dream-queue-worker`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${workerToken}` },
      body: '{}',
    }).then(
      () => {},
      (err: unknown) =>
        console.warn(
          `[dream-off-submit] worker kick failed for job ${jobId}:`,
          err instanceof Error ? err.message : String(err)
        )
    );
  }

  return json(
    { dream_id: jobId, status: 'queued', entry_id: (submit as { entry_id?: string }).entry_id },
    200
  );
});
