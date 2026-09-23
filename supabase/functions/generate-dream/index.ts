/**
 * Edge Function: generate-dream — V4 pipeline only.
 *
 * Handles user-initiated dream generation via medium + vibe directives:
 *   - Self-insert (cast + scene expansion + chaos + V4 compiler)
 *   - Text directive / surprise (scene expansion + chaos + V4 compiler)
 *   - Style transfer / DLT (source style + user prompt + compiler)
 *   - Photo reimagine (vision describe + Sonnet rewrite + Flux Dev)
 *   - Photo restyle (Kontext transform — moves to restyle-photo in Phase 3.4)
 *
 * Nightly pipeline moved to nightly-dreams Edge Function (Phase 3.3).
 * Legacy recipe/vibe-profile/haiku-brief paths deleted (Phase 3.2).
 *
 * POST /functions/v1/generate-dream
 * Authorization: Bearer <user JWT>
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.100.0';
import type { VibeProfile, DreamCastMember } from '../_shared/vibeProfile.ts';
import { buildReimaginePrompt } from '../_shared/photoPrompts.ts';
import {
  describeWithVision,
  VISION_PROMPTS,
  classifyDualGenders,
  classifyWardrobeSides,
} from '../_shared/vision.ts';
import { asGender, sidesToGenders, sideCheckModeOf } from '../_shared/wardrobeSides.ts';
import { shouldSendCompletionNotification } from '../_shared/notify.ts';
import { genderFromLock } from '../_shared/genderLock.ts';
import { restoreFace } from '../_shared/faceRestore.ts';
import { imageOpsEnabled, persistViaFly } from '../_shared/imageOps.ts';
import { genderSafeDualSwap } from '../_shared/dualSwapPipeline.ts';
import { resolveMediumFromDb, resolveVibeFromDb } from '../_shared/dreamStyles.ts';
import { pickSurpriseScene } from '../_shared/surpriseScene.ts';
import { isMonumentalFaceSpot } from '../_shared/monumentalFaceSpot.ts';
import { applyCleanMedium, fetchCleanMedium } from '../_shared/cleanMedium.ts';
import {
  routeNewSceneSubject,
  buildNewScenePrompt,
  newSceneModel,
  newSceneFallbackModel,
  newSceneTierCost,
  type NewSceneTier,
} from '../_shared/newSceneDirective.ts';
import { detectSelfInsert } from '../_shared/selfInsertDetector.ts';
import { mirrorPartnerIntoCast, type RosterPartner } from '../_shared/partnerRoll.ts';
import { composeExperimentalCouple } from '../_shared/coupleComposerX.ts';
import { splitPromptScene, type PromptSceneSplit } from '../_shared/promptSceneSplit.ts';
import { planOutfits, type OutfitPlan } from '../_shared/outfitPlan.ts';
import {
  extractOutfitSpec,
  outfitSpecStamps,
  enforceSoloOutfit,
  type OutfitPerson,
  type OutfitSpecOutcome,
} from '../_shared/outfitSpec.ts';
import { nextCreateModel } from '../_shared/createModelChain.ts';
import { rollCreateSceneAxes } from '../_shared/createSceneAxes.ts';
import { resolveCastForPrompt } from '../_shared/castResolver.ts';
import { expandScene } from '../_shared/sceneExpander.ts';
import { rollChaos, applyChaos } from '../_shared/chaosLayer.ts';
import {
  compilePrompt,
  postProcessPrompt,
  sanitizeUserPrompt,
  deriveFocalAnchor,
  applyVibeGenderModifier,
} from '../_shared/promptCompiler.ts';
import {
  runCharacterSlotPipeline,
  assembleSoloFallbackFromDual,
  type CharacterSlotPipelineInput,
  type DualSlots,
} from '../_shared/characterSlotPrompt.ts';
import { pickDualAction } from '../_shared/pools/dual_actions.ts';
import { loadClassicPools } from '../_shared/pools/actionPoseLoader.ts';
import { HAIKU } from '../_shared/models.ts';
// Shared post-processing (extracted Phase 3.1)
import { sanitizePrompt } from '../_shared/sanitize.ts';
import { generateImage } from '../_shared/generateImage.ts';
import { isXaiModel } from '../_shared/providers/xai.ts';
import { timingSafeEqual } from '../_shared/timingSafe.ts';
import { faceSwap } from '../_shared/faceSwap.ts';
import {
  ensureSoloSwapTarget,
  verifySoloIdentity,
  soloIdentityThreshold,
} from '../_shared/singleSwapGuard.ts';
import { dispatchDualFaceSwap } from '../_shared/dualSwapDispatch.ts';
import { hydrateCastSources } from '../_shared/castPhotoUrl.ts';
import { orderDualSides, shouldFlipDualSide } from '../_shared/dualSideOrder.ts';
import {
  completeQueueJob,
  failQueueJob,
  dreamFailedNotification,
  markStage,
} from '../_shared/dreamQueueLifecycle.ts';
import { captureRenderError } from '../_shared/sentry.ts';
import { persistToStorage, buildDisplayVariant } from '../_shared/persistence.ts';
import { callSonnet } from '../_shared/llm.ts';
import { distillStyle } from '../_shared/styleDistiller.ts';
import {
  getCostCents,
  getSparkleCost,
  loadModelCosts,
  isKnownModel,
  isAdminOnlyModel,
} from '../_shared/modelPricing.ts';
import { fetchEngineConfig } from '../_shared/engineConfig.ts';
import { pickModel } from '../_shared/modelPicker.ts';
import { smartDreamApplies, coerceSmartDream, type SmartDreamSet } from '../_shared/smartDream.ts';
import { insertGenerationLog, asJsonbObject } from '../_shared/logging.ts';
import { isQaRequest } from '../_shared/qaRequest.ts';
import { classifyFailure } from '../_shared/classifyFailure.ts';
import { buildRecipe } from '../_shared/recipeBuilder.ts';
import { validateRecipe, resolveRecipeAnchors } from '../_shared/recipeReplay.ts';
import { pickCreateFaceSwapOverride } from '../_shared/createFaceSwapOverrides.ts';
import { sanitizeUserText } from '../_shared/sanitizeUserText.ts';

interface RequestBody {
  /** Which Flux model to use */
  mode: 'flux-dev' | 'flux-kontext';
  /** Pre-built prompt (raw, no LLM enhancement) */
  prompt?: string;
  /** Optional user hint to weave into the dream */
  hint?: string;
  /** Base64 data URL for flux-kontext (photo-to-image) */
  input_image?: string;
  /** Photo style:
   *   - 'reimagine' — re-render the photo in the medium, preserving pose/composition. Face-swap applied.
   *   - 'new_scene' — invent a fresh scene, put the person in it with real face preserved via swap.
   *   - 'restyle' (default) — legacy value that falls through to an error (client should use restyle-photo endpoint for Kontext restyle).
   */
  photo_style?: 'reimagine' | 'new_scene' | 'restyle';
  /** Vibe Profile v2 — provides dream_cast for self-insert detection */
  vibe_profile?: VibeProfile;
  /** V4 engine — curated medium key (e.g., 'watercolor', 'pixels') */
  medium_key?: string;
  /** V4 engine — curated vibe key (e.g., 'cinematic', 'epic') */
  vibe_key?: string;
  /** Test mode: override the picked Replicate model */
  force_model?: string;
  /** Which roster member fills the +1 slot, picked explicitly on the Create screen.
   *  Outranks a NAME matched in the prompt and the starred default: a tap is a
   *  stronger signal than a regex hit. */
  cast_partner_id?: string;
  /** Test mode: override which cast member to use for self-insert ('self', 'plus_one', 'pet') */
  force_cast_role?: string;
  /** Client-generated job ID for queue tracking */
  job_id?: string;
  /** Style transfer: original post's ai_prompt used as style template for DLT */
  style_prompt?: string;
  /** Pre-classified photo subject description (from classify-photo endpoint).
   * When provided alongside subject_type, skips the internal vision call. */
  subject_description?: string;
  /** Pre-classified photo subject type. Determines routing:
   *   - 'person'  → face-swap path (ephemeral cast from description, face from photo)
   *   - 'group'   → description path: Flux renders the described people in scene, no face-swap
   *   - 'animal'  → description path: creature literally in the scene, no face-swap
   *   - 'object'  → description path: object literally in the scene, no face-swap
   *   - 'scenery' → description path: scene built inspired by the place, no face-swap
   */
  subject_type?: 'person' | 'group' | 'animal' | 'object' | 'scenery';
  /** New Scene reference path (classify-photo structured signals). When present,
   *  the upload routes on these (solo-swap vs reference-by-kind) instead of the
   *  legacy subject_type. Absent (old client) → legacy routing, unchanged. */
  num_people?: number;
  num_animals?: number;
  face?: 'clean' | 'multi' | 'none' | 'unclear';
  /** New Scene pricing tier ('standard' | 'best'). Present ⇒ the client is on the
   *  new tier-priced flow; the server charges the flat tier price (never
   *  force_model) for a new_scene photo. */
  new_scene_tier?: 'standard' | 'best';
  /** Optional user-supplied caption stored on the upload. No auto-generation. */
  description?: string;
  /** DLT recipe-replay: when present + valid, locks medium/vibe/model from
   *  the source post's frozen recipe instead of using user-picker values.
   *  See docs/DLT_RECIPE_PLAN.md. NULL/missing → existing style_summary
   *  fallback path runs (zero regression). */
  dlt_recipe?: unknown;
  /** Direct pass-through mode: when true + a user prompt is present, send
   *  the prompt verbatim to flux-1.1-pro with NO Sonnet expansion / chaos /
   *  medium / vibe directive merging. Power-user mode. */
  use_exact_prompt?: boolean;
  /** DreamSmart toggle. false → the user opted out of style-based model curation
   *  (the picker showed the full model list); skip the Smart Dream coercion and
   *  render exactly the model they picked. Absent/true → DreamSmart on (default).
   *  See SMART_DREAM_PLAN.md §7b. */
  dream_smart?: boolean;
  /** When false, render + return WITHOUT inserting an uploads row — the caller
   *  persists its own (onboarding RevealStep). Defaults to true. Fixes the
   *  duplicate-first-dream (gen + "Post my Dream" both inserting a row). */
  persist?: boolean;
}

// Render-budget split — shared with nightly-dreams via _shared/renderBudgets.ts
// so the two pipelines can never drift (audit 2026-09-03 M3).
import {
  RENDER_DEADLINE_MS,
  SOLO_FALLBACK_RESERVE_MS,
  DUAL_RECOVER_MS,
  SOLO_RECOVER_MS,
} from '../_shared/renderBudgets.ts';

// The full request handler. Wrapped (below) so the render survives the client
// disconnecting — a user who taps "Queue This" and then backgrounds/kills the
// app must still get their dream rendered, persisted, and notified.
async function handleRequest(req: Request): Promise<Response> {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  const REPLICATE_TOKEN = Deno.env.get('REPLICATE_API_TOKEN');
  const ANTHROPIC_KEY = Deno.env.get('ANTHROPIC_API_KEY');
  // Optional — only required when the picked model is an openai/* or google/* one.
  // Replicate-only paths still work without these.
  const OPENAI_KEY = Deno.env.get('OPENAI_API_KEY');
  const GEMINI_KEY = Deno.env.get('GEMINI_API_KEY');
  const XAI_KEY = Deno.env.get('XAI_API_KEY');

  if (!REPLICATE_TOKEN) {
    return new Response(
      JSON.stringify({ error: 'Server misconfigured: missing REPLICATE_API_TOKEN' }),
      { status: 500 }
    );
  }
  // Required on every render path (Sonnet briefs). Fail LOUD up front instead of a
  // mid-render `ANTHROPIC_KEY` crash (audit 2026-09-03 M6).
  if (!ANTHROPIC_KEY) {
    return new Response(
      JSON.stringify({ error: 'Server misconfigured: missing ANTHROPIC_API_KEY' }),
      { status: 500 }
    );
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

  // Service role client for database operations (bypasses RLS)
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  // Parse request body BEFORE auth — the retry path below reads job_id from it.
  let body: RequestBody;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400 });
  }

  // Is this one of OURS? Read from the RAW body before sanitizing/destructuring, so the
  // stamp reflects which force_*/qa_* keys were actually sent. See _shared/qaRequest.ts.
  const isQa = isQaRequest(body);

  // Sanitize EVERY user-supplied text field up front — before any of it reaches
  // the Sonnet brief, Flux, or storage. enqueue-dream forwards the body
  // unsanitized + retries replay the stored payload, so the render path is the
  // single gate. Strips prompt-injection / control / zero-width / bidi, NFKC-
  // normalizes, and caps length. Idempotent, so re-running on a retry is safe.
  if (typeof body.prompt === 'string') body.prompt = sanitizeUserText(body.prompt, 'prompt');
  if (typeof body.hint === 'string') body.hint = sanitizeUserText(body.hint, 'hint');
  if (typeof body.subject_description === 'string')
    body.subject_description = sanitizeUserText(body.subject_description, 'subject_description');
  if (typeof body.style_prompt === 'string')
    body.style_prompt = sanitizeUserText(body.style_prompt, 'style_prompt');
  if (typeof body.description === 'string')
    body.description = sanitizeUserText(body.description, 'description');

  // Auth. Normal path: the user's JWT (the gateway already validated it). Retry
  // path: refund-stuck-jobs re-invokes this function to REPLAY a dead render — it
  // has no user JWT, so it sends `x-dream-retry: 1` + the service-role key and we
  // resolve the user from the existing job. Retries reuse the same job_id, so the
  // charge + job upsert are idempotent no-ops (never a double charge).
  const authHeader = req.headers.get('authorization') ?? '';
  const isRetry = req.headers.get('x-dream-retry') === '1';
  // Queue path: dream-queue-worker dispatches the render server-side and AWAITS
  // the result (it has a long background budget). Same service-role auth +
  // resolve-user-from-job as retry, but it does NOT 202-detach (the worker needs
  // the upload_id back) and does NOT refund in-function (the worker owns retry /
  // dead-letter / refund). The charge already happened at enqueue.
  const isQueue = req.headers.get('x-dream-queue') === '1';
  const isServerInvoked = isRetry || isQueue;
  let userId: string;
  if (isServerInvoked) {
    if (!timingSafeEqual(authHeader, `Bearer ${serviceRoleKey}`)) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });
    }
    const srvJobId = typeof body.job_id === 'string' ? body.job_id : null;
    if (!srvJobId) {
      return new Response(JSON.stringify({ error: 'server invoke requires job_id' }), {
        status: 400,
      });
    }
    const { data: jobRow } = await supabase
      .from('dream_jobs')
      .select('user_id')
      .eq('id', srvJobId)
      .single();
    if (!jobRow) {
      return new Response(JSON.stringify({ error: 'job not found' }), { status: 404 });
    }
    userId = jobRow.user_id as string;
    console.log(
      `[generate-dream] ${isRetry ? 'RETRY' : 'QUEUE'} render for job ${srvJobId} (user ${userId})`
    );
    // Earliest possible breadcrumb — proves the detached (waitUntil) render task
    // actually resumed past the 202 ack. If 'claimed' never appears the platform
    // dropped the background task; if it appears but 'resolve' doesn't, the task
    // is alive but hung before prompt-building.
    markStage(supabase, srvJobId, 'claimed');
  } else {
    // The Supabase gateway already validated the JWT before invoking us, so we
    // can trust the token to identify the user.
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
      // Log ONLY whether a bearer header was present — never any bytes of the
      // token itself (the first 30 chars leaked ~22 chars of the JWT into
      // centralized logs; flagged by the 2026-07-06 audit S1).
      console.error(
        '[generate-dream] Auth failed:',
        authError?.message,
        'bearer_present:',
        authHeader.startsWith('Bearer ')
      );
      return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });
    }
    userId = user.id;
  }

  // Pull body fields. medium_key / vibe_key / force_model are mutable so we
  // can override them from a DLT recipe before resolution.
  let { medium_key, vibe_key, force_model } = body;
  const {
    mode,
    vibe_profile,
    prompt: rawPrompt,
    hint,
    input_image,
    photo_style = 'restyle',
    force_cast_role,
    cast_partner_id,
    style_prompt,
    subject_description,
    subject_type,
    num_people,
    num_animals,
    face,
    dlt_recipe,
  } = body;
  // When false, render + return WITHOUT inserting an uploads row — the caller
  // persists its own (onboarding RevealStep). Default true so the create flow,
  // nightly, DLT, etc. keep auto-saving as before. Fixes the duplicate first
  // dream (gen inserted a row AND "Post my Dream" inserted another).
  const persist = body.persist !== false;

  // Every user-initiated render MUST carry a job_id so the sparkle charge below
  // has an idempotency key. Without one the charge block was skipped entirely —
  // a tampered client could omit job_id for a FREE render. Synthesize one for
  // direct callers; server-invoked queue/retry paths already require it (above).
  let jobId: string | undefined =
    typeof body.job_id === 'string' && body.job_id.length > 0 ? body.job_id : undefined;
  if (!jobId && !isServerInvoked) {
    jobId = crypto.randomUUID();
  }

  // Per-user rate limit on the DIRECT user path. The queue/worker server path is
  // already bounded by enqueue-dream's in-flight cap + the worker's per-weight
  // concurrency caps, so skip it there. Reuses migration 228's
  // edge_function_invocations trigger (10 expensive edge calls/min/user). Closes
  // the "call generate-dream directly to bypass the enqueue in-flight cap" hole.
  // A TRANSIENT insert failure is RETRIED (a DB blip must not silently drop the
  // cap — the audit's fail-open finding); only after retries do we fail open, so
  // a genuine outage never hard-blocks a paid dream (the charge is the hard gate).
  if (!isServerInvoked) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      const { error: rlErr } = await supabase
        .from('edge_function_invocations')
        .insert({ user_id: userId, function_name: 'generate-dream' });
      if (!rlErr) break;
      const isRl =
        rlErr.message?.includes('rate_limited') ||
        (rlErr as { hint?: string }).hint === 'rate_limited';
      if (isRl) {
        return new Response(JSON.stringify({ error: 'rate_limited' }), {
          status: 429,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      if (attempt === 3) {
        console.error(
          '[generate-dream] rate-limit log INSERT failed after 3 attempts (failing open):',
          rlErr.message
        );
      }
    }
  }

  // ── DLT recipe replay (consume-side) ────────────────────────────────────
  // When the client passes a valid frozen recipe, lock the LOOK identity
  // from the source post: substitute medium_key + vibe_key + force_model so
  // every downstream resolver/picker uses the source's exact values. The
  // user's subject text + cast/photo flow through the existing pipeline
  // unchanged — DLT only affects look, never content.
  // If the recipe is null/missing/malformed, fall through to the existing
  // style_summary path (zero regression).
  let dltReplayActive = false;
  let dltReplayAnchors: ReturnType<typeof resolveRecipeAnchors> | null = null;
  if (dlt_recipe !== undefined && dlt_recipe !== null) {
    const validRecipe = validateRecipe(dlt_recipe);
    if (validRecipe) {
      dltReplayAnchors = resolveRecipeAnchors(validRecipe);
      medium_key = dltReplayAnchors.mediumKey;
      vibe_key = dltReplayAnchors.vibeKey;
      force_model = force_model || dltReplayAnchors.model; // body force_model still wins for tests
      dltReplayActive = true;
      console.log(
        `[generate-dream] DLT recipe-replay active: medium=${dltReplayAnchors.mediumKey} vibe=${dltReplayAnchors.vibeKey} model=${dltReplayAnchors.model}`
      );
    } else {
      console.warn(
        '[generate-dream] dlt_recipe present but failed validation — falling back to style_summary path'
      );
    }
  }

  // DLT (Dream Like This) render? True when replaying a frozen recipe OR a
  // distilled style reference is present. In DLT the SOURCE render's format +
  // composition is the authority, so we suppress the fresh multi-tier scene
  // expansion (and the chaos baked into it) below — it was overpowering the
  // source's look (e.g. a tabletop-miniature DLT rendered as a wide painterly
  // cityscape). See DLT_FIDELITY_PLAN.md.
  const isDLT = dltReplayActive || !!style_prompt;

  // Optional user-supplied caption for this dream (no auto-generation).
  const userDescription =
    typeof body.description === 'string' ? body.description.trim() || null : null;

  if (!mode || !['flux-dev', 'flux-kontext'].includes(mode)) {
    return new Response(
      JSON.stringify({ error: 'Invalid mode. Must be "flux-dev" or "flux-kontext"' }),
      { status: 400 }
    );
  }

  if (mode === 'flux-kontext' && !input_image) {
    return new Response(JSON.stringify({ error: 'flux-kontext mode requires input_image' }), {
      status: 400,
    });
  }

  if (!medium_key && !vibe_key) {
    return new Response(JSON.stringify({ error: 'Must provide medium_key or vibe_key' }), {
      status: 400,
    });
  }

  // ── Timing ─────────────────────────────────────────────────────────────────
  const t0 = Date.now();
  const timings: Record<string, number> = {};
  let lastLap = t0;
  const lap = (label: string) => {
    const now = Date.now();
    const stepMs = now - lastLap;
    const totalMs = now - t0;
    timings[label] = stepMs;
    console.log(`[generate-dream] ⏱ ${label}: ${stepMs}ms (total: ${totalMs}ms)`);
    lastLap = now;
  };

  // Daily generation cap removed 2026-04-16 — sparkles are the sole limiter.
  // Bit us many times (test batches, QA flows, debugging loops). We still
  // read the budget row to keep `images_generated` counting correctly for
  // analytics, but nothing gates on it anymore.
  const today = new Date().toISOString().slice(0, 10);
  const { data: budgetRow } = await supabase
    .from('ai_generation_budget')
    .select('images_generated')
    .eq('user_id', userId)
    .eq('date', today)
    .single();
  lap('rate-limit-check');
  const todayCount = budgetRow?.images_generated ?? 0;

  // ── Create dream job (queue tracking) ──────────────────────────────────
  // Upsert (ignoreDuplicates), NOT insert: "Queue This" can pre-create this row
  // via request_dream_notification (migration 195) with notify_on_complete=true
  // before we get here. A plain insert would PK-conflict and a clobbering write
  // could reset that flag. ignoreDuplicates makes this a no-op if the row
  // already exists, so a queued dream's notify flag survives the race.
  if (jobId) {
    try {
      await supabase
        .from('dream_jobs')
        .upsert(
          { id: jobId, user_id: userId, status: 'processing' },
          { onConflict: 'id', ignoreDuplicates: true }
        );
    } catch (err) {
      console.warn('[generate-dream] Job upsert failed (non-critical):', (err as Error).message);
    }
  }

  // Persist the request so a dead render can be REPLAYED by refund-stuck-jobs
  // (migration 263). UPDATE (not the ignoreDuplicates upsert above) so we don't
  // clobber a "Queue This" notify_on_complete flag. Skip when server-invoked —
  // the payload is already stored (retry sweeper / enqueue) and the owner has
  // the attempt_count.
  if (jobId && !isServerInvoked) {
    try {
      await supabase
        .from('dream_jobs')
        .update({ payload: body, status: 'processing' })
        .eq('id', jobId);
    } catch (err) {
      console.warn(
        '[generate-dream] payload persist failed (non-critical):',
        (err as Error).message
      );
    }
  }

  // ── Server-side sparkle charge (idempotent on jobId) ──────────────────────
  // The charge lives here, not just client-side, so prices are server-driven:
  // changing image_models.sparkle_cost takes effect with NO client build. The
  // RPC is idempotent on jobId — an old client that already charged makes this
  // a no-op (never a double charge), worker retries are safe, and a tampered
  // client can't dodge it. Cost mirrors the client: getSparkleCost(force_model)
  // (DreamBot has no force_model → 1; Direct/DLT → the picked model's cost).
  // jobId is now always present on the user path (synthesized above), so the
  // charge can't be skipped by omitting it. generate-dream is always a paid path
  // (nightly + first-dream are separate, free functions).
  if (jobId) {
    await loadModelCosts(supabase);
    // Reject an unknown force_model: a client could otherwise force an arbitrary
    // / unpriced Replicate model and be charged the DEFAULT 1-sparkle floor.
    // Ignore it (fall back to the priced auto-picker) so cost + render stay
    // catalog-bound — and a retired model in an old DLT recipe still renders.
    if (force_model && !isKnownModel(force_model)) {
      console.warn(`[generate-dream] ignoring unknown force_model: ${force_model}`);
      force_model = undefined;
    }
    // Admin-only model defense. The direct user-JWT path (not isQueue) could
    // otherwise force an admin-only model (e.g. Grok mid-validation) bypassing
    // the enqueue-dream gate. Worker path (isQueue) is trusted — its payload was
    // already gated at enqueue. Drop it for a non-admin direct caller.
    if (force_model && isAdminOnlyModel(force_model) && !isQueue) {
      const { data: adminRow } = await supabase
        .from('users')
        .select('is_admin')
        .eq('id', userId)
        .single();
      if (!adminRow?.is_admin) {
        console.warn(
          `[generate-dream] dropping admin-only force_model ${force_model} for non-admin ${userId}`
        );
        force_model = undefined;
      }
    }
    // DreamBot (no force_model) → engine_config.base_sparkle_cost (admin-tunable,
    // default 1); Direct/DLT → the picked model's cost. Mirrors the client.
    const cfg = await fetchEngineConfig(supabase);
    // New Scene tier pricing: a new_scene photo from a tier-aware client charges
    // the flat Standard/Best price by a server-validated enum (NEVER force_model,
    // so a tampered force_model can't buy the premium model at the flat price).
    // Old clients (no new_scene_tier) keep the legacy cost, unchanged.
    const isNewScenePhoto = !!input_image && photo_style === 'new_scene';
    const newSceneTierReq: NewSceneTier | null =
      body.new_scene_tier === 'best'
        ? 'best'
        : body.new_scene_tier === 'standard'
          ? 'standard'
          : null;
    // Edge backstop for the group-size cap (the client blocks this pre-charge; a
    // hostile client could skip it). Reject BEFORE charging.
    if (
      isNewScenePhoto &&
      newSceneTierReq &&
      typeof num_people === 'number' &&
      num_people > cfg.newSceneMaxPeople
    ) {
      return new Response(
        JSON.stringify({ error: 'new_scene_too_many_people', max: cfg.newSceneMaxPeople }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    // Price backstop (mirrors enqueue-dream): a solo-swap photo renders the
    // exact-face swap identically on BOTH tiers — never charge Ultra for it.
    const newSceneSoloSwap =
      isNewScenePhoto && newSceneTierReq
        ? routeNewSceneSubject({
            type: typeof body.subject_type === 'string' ? body.subject_type : '',
            num_people: typeof num_people === 'number' ? num_people : 0,
            num_animals: typeof num_animals === 'number' ? num_animals : 0,
            face: typeof face === 'string' ? face : '',
          }).mode === 'solo_swap'
        : false;
    const dreamCost =
      isNewScenePhoto && newSceneTierReq
        ? newSceneTierCost(
            newSceneTierReq,
            newSceneSoloSwap,
            cfg.newScenePriceStandard,
            cfg.newScenePriceBest
          )
        : force_model
          ? getSparkleCost(force_model)
          : cfg.baseSparkleCost;
    try {
      const { data: chargeStatus, error: chargeErr } = await supabase.rpc('charge_sparkles', {
        p_user_id: userId,
        p_amount: dreamCost,
        p_reason: 'dream',
        p_reference_id: jobId,
      });
      // supabase-js resolves { data: null, error } on a Postgres/PostgREST-level
      // failure (lock timeout, deadlock, connection blip) — it does NOT throw.
      // Route it into the same catch below so a DB-level charge failure fails
      // CLOSED instead of silently falling through with chargeStatus=null/undefined
      // (which isn't 'insufficient', so the render would otherwise proceed for free).
      if (chargeErr) {
        throw new Error(`charge_sparkles RPC error: ${chargeErr.message}`);
      }
      if (chargeStatus === 'insufficient') {
        // Return (not throw) so this bypasses the refund catch — nothing was
        // charged, so there is nothing to refund.
        return new Response(JSON.stringify({ error: 'insufficient_sparkles', needed: dreamCost }), {
          status: 402,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      console.log(
        `[generate-dream] Charge: ${chargeStatus} (${dreamCost}✦, model=${force_model || 'default'})`
      );
    } catch (err) {
      console.warn('[generate-dream] charge_sparkles failed:', (err as Error).message);
      // Fail CLOSED on the direct user path — THIS is the only charge, so a
      // charge error must not yield a free render. Server-invoked (queue/retry)
      // paths were already charged at enqueue, so they fail OPEN: don't fail an
      // already-paid render on a transient re-charge error (idempotent no-op).
      if (!isServerInvoked) {
        return new Response(JSON.stringify({ error: 'charge_failed' }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }
  }

  // Stage breadcrumb — pre-render (cast/scene resolve + Sonnet brief). Survives
  // a hard isolate kill so the worker's stale-recovery can report where we died.
  markStage(supabase, jobId, 'resolve');

  // ── Build prompt ──────────────────────────────────────────────────────────
  // Initialized to '' (not just declared) so the failure-logging path in the
  // outer catch can safely read it even if the throw happened before assignment.
  let finalPrompt = '';
  // True when the couple composer produced finalPrompt. The retry rungs below prepend
  // framing text onto finalPrompt; the composer already opens with its own two-shot and
  // faces line, so a prepend would fight it for the position the lab showed actually
  // matters (FLUX_COUPLE_LAB lesson 3: face words at the front pull the camera in).
  let composedCouplePrompt = false;
  // Set when a re-render moves to a different model, so uploads.model / model_used /
  // cost_cents report what RENDERED rather than what was picked. Nightly has had this for
  // ages; Create did not, which is exactly how "uploads.model lies on retries" happens.
  let modelUsedOverride: string | null = null;
  /** The model that actually rendered: a retry's move if one happened, else the pick. */
  const renderedModel = (): string => modelUsedOverride ?? pickedModel;
  // Hoisted DUAL solo-fallback context (paid Create path). When a dual face-swap
  // fails every retry, the recovery re-renders self ALONE via
  // assembleSoloFallbackFromDual (a genuine single-character prompt) instead of
  // the couple-prompt-with-prefix that kept rendering two people → faceless.
  // Captured after the dual slot pipeline; null on the freeform-brief path.
  // See _shared/characterSlotPrompt.ts (root-caused 2026-08-27).
  let soloFallbackCtx: {
    dualSlots: DualSlots;
    input: CharacterSlotPipelineInput;
    selfIndex: 0 | 1;
  } | null = null;

  let logAxes: Record<string, unknown> = {};
  let conceptJson: Record<string, unknown> | null = null;
  let photoOverrideMode: string | null = null;
  let resolvedMediumKey: string | undefined;
  let resolvedVibeKey: string | undefined;
  let faceSwapSource: string | undefined; // original photo for face swap after generation
  // Cast gender for the SOLO swap guard (singleSwapGuard.ts) — set wherever
  // faceSwapSource is set. null = unknown → the guard checks face count only.
  let faceSwapGender: 'male' | 'female' | null = null;
  let faceSwapSources:
    | Array<{ role: string; sourceUrl: string; genderLock: string | null }>
    | undefined;
  // New Scene reference render (NEW_SCENE_QUALITY_PLAN.md). When set, the render
  // section below forces mode='flux-kontext' + keeps input_image + uses this
  // model (Seedream / Nano Banana), with NO face swap. Null = not a reference render.
  let newSceneRefModel: string | null = null;
  // Smart Dream approved set for the resolved style (captured once the medium is
  // resolved) — used by the render-model backstop below.
  let smartDreamCfg: SmartDreamSet | null = null;

  // ── Observability (Phase 1 of V4 hardening) ─────────────────────────────────
  // Capture the full LLM exchange + fallback audit trail so every generation
  // can be replayed from ai_generation_log without guesswork. Every call site
  // that invokes Sonnet, Haiku vision, or triggers a fallback pushes here.
  let sonnetBrief: string | null = null;
  let sonnetRawResponse: string | null = null;
  let visionDescription: string | null = null;
  let replicatePredictionId: string | null = null;
  const fallbackReasons: string[] = [];

  console.log(
    '[generate-dream] RAW BODY:',
    JSON.stringify({
      medium_key,
      vibe_key,
      photo_style,
      has_input_image: !!input_image,
      hint: hint?.slice(0, 50),
      mode,
    })
  );

  // ── V4 ENGINE: Medium + Vibe directive-based generation ──
  // Nightly path moved to nightly-dreams Edge Function (Phase 3.3).
  // Legacy recipe/vibe-profile paths deleted (Phase 3.2).
  if (medium_key || vibe_key) {
    // ── V2 ENGINE: Medium + Vibe directive-based generation ──────────
    const vibeProfile = vibe_profile as VibeProfile | undefined;

    // vibe_profile arrives via a raw, unchecked cast (no schema validation) and
    // was NOT covered by the sanitization pass above — vibeProfile.avoid[] lands
    // verbatim under a "NEVER INCLUDE" header in the Sonnet brief
    // (promptCompiler.ts, characterSlotPrompt.ts), read with full engine
    // authority. nightly-dreams sanitizes the equivalent field
    // (nightly-dreams/index.ts, avoidList); this path never did (Architect audit
    // S5, 2026-09-10). Sanitize once here so every downstream consumer of
    // vibeProfile.avoid inherits the fix.
    if (vibeProfile?.avoid?.length) {
      vibeProfile.avoid = vibeProfile.avoid
        .map((a) => sanitizeUserText(String(a), 'subject_description'))
        .filter(Boolean);
    }

    // Resolve medium and vibe to real curated entries — never store placeholders.
    // 2026-06-02 — art_styles / aesthetics favorites removed from VibeProfile
    // + the resolver branches that consumed them. Client always passes a
    // concrete key here.
    // DreamSmart on Surprise Me: if the client didn't pre-roll (cold cache /
    // raw surprise_me token reaches the server) and the user picked a model
    // with DreamSmart on, constrain the server-side roll to mediums that model
    // renders well — so the model is honored (not coerced) and charge==render
    // holds. Concrete keys ignore this (already chosen). smartDreamApplies gates
    // out use_exact_prompt / restyle / new_scene photo / opt-out.
    const smartRollModel = smartDreamApplies(body) && force_model ? force_model : null;
    let medium = await resolveMediumFromDb(medium_key, undefined, smartRollModel);
    // Keep the key the REQUEST actually resolved to, before the surprise-scene
    // override below can move it — the unknown-key forensic stamp further down
    // exists to catch legacy/typo keys, and must not fire on our own override.
    const requestedMediumKey = medium.key;
    const vibe = await resolveVibeFromDb(vibe_key);

    // ── SURPRISE DREAM: the STYLE has to be people-free too ──────────────
    // No prompt, no photo, no style reference → the compiler anchors the dream
    // to an authored people-free spot (see the surprise seed below). The seed
    // alone is not enough: a portrait-shaped medium re-introduces the person the
    // route is supposed to exclude. `glamour` opens its own flux fragment with
    // "dreamy glamour-shot portrait ... lifelike recognizable face", so a spot
    // like "Moonpetal Bridge, fairy tea party" rendered a fairy WOMAN on the
    // bridge (QA 2026-09-15) — a people-free seed, a person in the frame. And it
    // is not a corner case: the sticky default medium is `surprise_me_face`,
    // which rolls only face-swap mediums, so the no-input Create lands on a
    // person-shaped style by default.
    //
    // So re-roll from the SAME pool nightly's scene-only dreams use
    // (`dream_eligible_scene` = dream_mediums.is_scene_eligible). A medium the
    // user picked that is already scene-eligible is kept as-is — the override is
    // only ever the difference between a style that needs a person and one that
    // doesn't. Widen/narrow the pool with SQL, no deploy:
    //   UPDATE dream_mediums SET is_scene_eligible = true WHERE key = 'comics';
    const isSurpriseSceneRoute =
      !input_image && !style_prompt && !dlt_recipe && !(rawPrompt ?? hint ?? '').trim();
    if (isSurpriseSceneRoute && !medium.isSceneEligible) {
      const sceneMedium = await resolveMediumFromDb('dream_eligible_scene');
      if (sceneMedium && sceneMedium.key !== medium.key) {
        fallbackReasons.push(`surprise_medium:${medium.key}→${sceneMedium.key}`);
        console.log(
          `[generate-dream] surprise scene: medium ${medium.key} needs a person → ${sceneMedium.key}`
        );
        medium = sceneMedium;
      }
    }

    // DLT: bot mediums carry scene/cast directives that would replace the
    // user's subject. Swap in the STYLE-ONLY cleaned medium (dlt_clean_mediums)
    // so the user's subject survives. No-op (raw bot medium) when no clean row
    // exists. Only bot-only mediums reach here with a clean row — user-facing
    // mediums have none, so this is inert for the normal Create flow.
    const cleanRow = await fetchCleanMedium(supabase, medium.key);
    medium = applyCleanMedium(medium, cleanRow);

    // DLT recipe-replay: if the source post used a bot-internal medium that
    // isn't registered in dream_mediums (e.g. plush_fabric, dollhouse_figures,
    // model_train_diorama), resolveMediumFromDb falls back to canvas. The
    // recipe's medium_style_override has the actual look anchor — synthesize
    // a medium object so the look reproduces faithfully without requiring
    // every bot-internal medium to be registered in DB.
    if (dltReplayActive && dltReplayAnchors && medium.key !== dltReplayAnchors.mediumKey) {
      const override = dltReplayAnchors.mediumStyleOverride;
      if (override) {
        medium = {
          ...medium, // inherit safe defaults (face_swaps, render_mode, etc.) from canvas
          key: dltReplayAnchors.mediumKey,
          label: dltReplayAnchors.mediumKey,
          directive: override,
          fluxFragment: override,
        };
        console.log(
          `[generate-dream] DLT recipe-replay synthesized medium "${dltReplayAnchors.mediumKey}" from recipe override (DB had no entry)`
        );
        // Strip the fallback reason — we recovered correctly via recipe override
        const idx = fallbackReasons.findIndex((r) => r.startsWith('unknown_medium_key:'));
        if (idx >= 0) fallbackReasons.splice(idx, 1);
      }
    }

    // Per-model flux_fragment override (client_meta.flux_fragment_by_model).
    // SURGICAL: only the model forced for THIS render gets a swapped fragment;
    // every other model keeps the base medium.fluxFragment, so this can never
    // regress them. Fixes models that literalize a medium's surface nouns — Nano
    // Banana Pro renders canvas's "on stretched canvas" as a physical easel
    // object instead of making the whole image a painting. Keyed on force_model
    // (the create-path render model; nightly can't reach 5✦ models like NB Pro).
    if (force_model && medium.fluxFragmentByModel && medium.fluxFragmentByModel[force_model]) {
      medium = { ...medium, fluxFragment: medium.fluxFragmentByModel[force_model] };
      console.log(
        `[generate-dream] per-model flux_fragment override applied for ${force_model} on medium "${medium.key}"`
      );
    }

    resolvedMediumKey = medium.key;
    smartDreamCfg = medium.smartDreamModels.length
      ? {
          models: medium.smartDreamModels,
          default: medium.smartDreamDefault ?? medium.smartDreamModels[0],
        }
      : null;
    resolvedVibeKey = vibe.key;

    // Log unknown-key fallbacks to ai_generation_log.fallback_reasons so we
    // can SQL-grep production for missing mediums/vibes (legacy keys, typos,
    // retired entries) and add them to the DB or remap them. Only counts when
    // the user passed an explicit key (not surprise_me/my_mediums/my_vibes)
    // and the resolver had to fall back to a default.
    const surpriseKeys = new Set(['surprise_me', 'my_mediums', 'my_vibes']);
    if (medium_key && !surpriseKeys.has(medium_key) && requestedMediumKey !== medium_key) {
      fallbackReasons.push(`unknown_medium_key:${medium_key}→${requestedMediumKey}`);
    }
    if (vibe_key && !surpriseKeys.has(vibe_key) && vibe.key !== vibe_key) {
      fallbackReasons.push(`unknown_vibe_key:${vibe_key}→${vibe.key}`);
    }

    const isPhoto = !!input_image;
    console.log(
      '[generate-dream] V2 ENGINE | medium:',
      medium.key,
      '| vibe:',
      vibe.key,
      '| isPhoto:',
      isPhoto,
      '| photo_style:',
      photo_style,
      '| has_input_image:',
      !!input_image
    );

    // ── SURPRISE DREAM (photo): anchor the invented scene ────────────────
    // Photo + New Scene + no prompt. Every branch below reads the scene from
    // `hint`, so an empty one left the engine inventing a setting from nothing —
    // the same blank canvas the no-photo route just stopped handing Sonnet, and
    // the same consequence: it pigeonholes and rhymes, so "surprise me with my
    // photo" converged on a few stock settings.
    //
    // Anchored to the CHARACTER half of the pool (backdrops authored to take a
    // figure), not the people-free half, because this dream has a subject.
    //
    // ⚠️ `isMonumentalFaceSpot` is not optional here. ~1% of character_eligible
    // rows depict a COLOSSAL human face (a giant Buddha, the Sphinx, Mount
    // Rushmore). Flux renders the huge face, YuNet picks the largest face in the
    // frame — the STATUE'S — and the swap pastes the user onto the monument. This
    // is the same gate nightly runs on its own cast anchors, and this path does
    // the same swap. It only ever re-rolls to another spot.
    let photoSurprise: Awaited<ReturnType<typeof pickSurpriseScene>> = null;
    if (isPhoto && photo_style === 'new_scene' && !(hint ?? '').trim()) {
      photoSurprise = await pickSurpriseScene(supabase, 'character', {
        reject: isMonumentalFaceSpot,
      });
      if (photoSurprise) {
        fallbackReasons.push(`surprise_seed:${photoSurprise.kind}:${photoSurprise.place}`);
        console.log(`[generate-dream] surprise seed (character): ${photoSurprise.prompt}`);
      } else {
        // Keep the old unanchored behaviour rather than failing a paid render.
        fallbackReasons.push('surprise_seed:none');
      }
    }
    // The scene every photo branch below composes against. Authored pool text, not
    // user input: sanitizeUserPrompt defends against what a user typed, and running
    // it over our own copy would only risk mangling it. `hint` is already sanitized
    // upstream.
    const photoScene = (hint ?? '').trim() || photoSurprise?.prompt || '';

    // ── New Scene REFERENCE route ────────────────────────────────────────────
    // Uploaded photo → reimagined into a NEW scene via a reference model (no
    // face swap). Gated on the client sending classify-photo's structured
    // signals; old clients (no signals) fall through to the legacy branches
    // below, unchanged. See NEW_SCENE_QUALITY_PLAN.md.
    const hasNewSceneSignals =
      isPhoto && photo_style === 'new_scene' && typeof num_people === 'number' && !!face;
    const newSceneRoute = hasNewSceneSignals
      ? routeNewSceneSubject({
          type: subject_type ?? 'unclear',
          num_people: num_people as number,
          num_animals: num_animals ?? 0,
          face: face as string,
        })
      : null;

    if (newSceneRoute && newSceneRoute.mode === 'reference') {
      const kind = newSceneRoute.kind;
      // Stylized/real-face mediums carry a restyleModel in the DB (Restyle
      // curation); photoreal mediums don't. Best tier → Nano Banana Pro.
      const stylized =
        !!medium.restyleModel || (medium.restyleModels != null && medium.restyleModels.length > 0);
      const tier: NewSceneTier = body.new_scene_tier === 'best' ? 'best' : 'standard';
      newSceneRefModel = newSceneModel({ stylized, tier, kind });
      visionDescription = subject_description ?? null;
      finalPrompt = buildNewScenePrompt({
        kind,
        subjectDescription: subject_description ?? '',
        scene: photoScene,
        mediumProse: medium.directive ?? '',
        vibeProse: vibe.directive ?? '',
      });
      logAxes = {
        medium: medium.key,
        vibe: vibe.key,
        engine: 'v3-new-scene-reference',
        newSceneKind: kind,
        newSceneTier: tier,
        newSceneModel: newSceneRefModel,
        faceSwap: false,
      };
      console.log(
        `[generate-dream] NEW SCENE reference | kind=${kind} tier=${tier} model=${newSceneRefModel} | prompt=${finalPrompt.slice(0, 90)}...`
      );
      // Do NOT set photoOverrideMode (keeps input_image) and do NOT set
      // faceSwapSource (no swap). The render section uses newSceneRefModel.
    } else if (
      isPhoto &&
      photo_style === 'new_scene' &&
      subject_type &&
      subject_type !== 'person'
    ) {
      // ── DESCRIPTION ROUTE: animal / object / scenery photo subjects.
      // The uploaded subject is literally included in the invented scene.
      // No face-swap, no character block — subject is the scene's focal element.
      console.log(`[generate-dream] ⏱ NEW SCENE (${subject_type}): description route`);
      try {
        const subjectDesc = subject_description ?? hint ?? '';
        visionDescription = subjectDesc;
        // Compose subject into the user prompt so Sonnet treats it as a directive.
        // Example: "A fluffy golden retriever with floppy ears sitting on grass"
        const userSubject = subjectDesc;

        const expanded = expandScene({
          userPrompt: userSubject,
          userId,
          mediumKey: medium.key,
          vibeKey: vibe.key,
          hasCharacter: false,
        });
        const chaosProfile = rollChaos(
          Array.from(userId + userSubject).reduce(
            (h, c) => ((h << 5) - h + c.charCodeAt(0)) | 0,
            0
          ),
          {
            userPrompt: userSubject,
            mediumRenderMode: medium.characterRenderMode,
            faceSwapEligible: false,
          }
        );
        const finalExpansion = applyChaos(expanded.expansion, chaosProfile);

        const compiled = compilePrompt({
          inputType: 'text_directive',
          medium: {
            key: medium.key,
            directive: medium.directive ?? '',
            fluxFragment: medium.fluxFragment ?? medium.key,
            characterRenderMode: medium.characterRenderMode,
            faceSwaps: medium.faceSwaps,
            // Without these two, applyFaceSwapOverride in singleBriefBuilder
            // + dualBriefBuilder silently no-ops and we render the standard
            // (often big-Disney-eye) version of stylized mediums for face
            // swaps. The DB columns exist (migration 154); plumb them through.
            faceSwapDirective: medium.faceSwapDirective ?? null,
            faceSwapFluxFragment: medium.faceSwapFluxFragment ?? null,
          },
          vibe: {
            key: vibe.key,
            directive: vibe.directive ?? '',
            faceSwapDirective: vibe.faceSwapDirective ?? null,
          },
          scene: {
            userPrompt: userSubject || undefined,
            sceneExpansion: isDLT ? undefined : finalExpansion || undefined,
            styleReference: style_prompt || undefined,
          },
          cast: [],
          composition: {
            type: 'pure_scene',
            faceSwapEligible: false,
            shotDirection: expanded.suggestedCamera,
            focalAnchor: userSubject.slice(0, 80),
          },
          profile: { avoid: vibeProfile?.avoid },
        });

        try {
          const sonnet = await callSonnet(compiled.sonnetBrief, ANTHROPIC_KEY, compiled.maxTokens);
          sonnetBrief = sonnet.brief;
          sonnetRawResponse = sonnet.rawResponse;
          if (sonnet.text.length < 10) throw new Error('too short');
          finalPrompt = postProcessPrompt(sonnet.text, compiled.postProcess);
        } catch (err) {
          console.error(
            '[generate-dream] DESCRIPTION ROUTE Sonnet failed:',
            (err as Error).message
          );
          fallbackReasons.push(`description_route_sonnet_failed:${(err as Error).message}`);
          finalPrompt = compiled.fallbackPrompt;
        }

        photoOverrideMode = 'flux-dev';
        logAxes = {
          medium: medium.key,
          vibe: vibe.key,
          engine: 'v2-new-scene-description',
          subjectType: subject_type,
          faceSwap: false,
        };
        console.log('[generate-dream] Description route prompt:', finalPrompt.slice(0, 150));
      } catch (err) {
        console.error('[generate-dream] DESCRIPTION ROUTE FAILED:', (err as Error).message);
        fallbackReasons.push(`description_route_failed:${(err as Error).message}`);
        finalPrompt = `${medium.fluxFragment}, ${subject_description ?? 'a creative scene'}, ${vibe.directive?.split('.')[0] ?? 'dramatic atmosphere'}, portrait 9:16, hyper detailed`;
        photoOverrideMode = 'flux-dev';
        logAxes = {
          medium: medium.key,
          vibe: vibe.key,
          engine: 'v2-new-scene-description-fallback',
          error: (err as Error).message,
        };
      }
      lap('description-route-done');
    } else if (isPhoto && photo_style === 'new_scene') {
      // ── NEW SCENE (person): vision describes person → ephemeral cast →
      // compilePrompt self-insert path → Flux invents scene → face-swap pastes
      // the real face on. Same high-quality pipeline as the self-insert branch
      // for stored cast. Skips vision when classify-photo already provided the
      // description.
      console.log('[generate-dream] ⏱ NEW SCENE: starting...');
      try {
        const photoDescription =
          subject_description ??
          // Fallback when the client didn't pre-classify: describe with the SAME
          // high-quality clothing-free dreamcast prompt as stored cast members, so
          // uploaded-photo dreams get cast-grade resemblance and no outfit bleed.
          stripCastMeta(
            await describeWithVision(input_image!, VISION_PROMPTS.castPerson, REPLICATE_TOKEN, 300)
          );
        visionDescription = photoDescription;
        lap('new-scene-vision');
        console.log(
          `[generate-dream] ⏱ Vision ${subject_description ? 'provided' : 'done'}: ${photoDescription.slice(0, 120)}`
        );

        // Synthesize an ephemeral cast from the photo. thumb_url is the user's
        // uploaded photo (face-swap block handles base64 → temp URL upload).
        const ephemeralCast: DreamCastMember = {
          role: 'self',
          thumb_url: input_image!,
          description: photoDescription,
        };
        const resolvedCast = resolveCastForPrompt([ephemeralCast], {
          characterRenderMode: medium.characterRenderMode,
          key: medium.key,
        });
        const isFaceSwapEligible = medium.characterRenderMode === 'natural';

        // Scene expansion + chaos (same as self-insert). `photoScene` is the user's
        // prompt, or the authored anchor when they left it blank — the chaos seed
        // included, so a surprise photo dream varies with its anchor instead of
        // hashing the same empty string every time.
        const expanded = expandScene({
          userPrompt: photoScene,
          userId,
          mediumKey: medium.key,
          vibeKey: vibe.key,
          hasCharacter: true,
        });
        const chaosProfile = rollChaos(
          Array.from(userId + photoScene).reduce((h, c) => ((h << 5) - h + c.charCodeAt(0)) | 0, 0),
          {
            userPrompt: photoScene,
            mediumRenderMode: medium.characterRenderMode,
            faceSwapEligible: isFaceSwapEligible,
          }
        );
        const finalExpansion = applyChaos(expanded.expansion, chaosProfile);
        const focalAnchor = deriveFocalAnchor(resolvedCast, { userPrompt: photoScene });

        const compiled = compilePrompt({
          inputType: 'self_insert',
          medium: {
            key: medium.key,
            directive: medium.directive ?? '',
            fluxFragment: medium.fluxFragment ?? medium.key,
            characterRenderMode: medium.characterRenderMode,
            faceSwaps: medium.faceSwaps,
            // Without these two, applyFaceSwapOverride in singleBriefBuilder
            // + dualBriefBuilder silently no-ops and we render the standard
            // (often big-Disney-eye) version of stylized mediums for face
            // swaps. The DB columns exist (migration 154); plumb them through.
            faceSwapDirective: medium.faceSwapDirective ?? null,
            faceSwapFluxFragment: medium.faceSwapFluxFragment ?? null,
          },
          vibe: {
            key: vibe.key,
            directive: vibe.directive ?? '',
            faceSwapDirective: vibe.faceSwapDirective ?? null,
          },
          scene: {
            userPrompt: photoScene || undefined,
            sceneExpansion: isDLT ? undefined : finalExpansion || undefined,
            styleReference: style_prompt || undefined,
          },
          cast: resolvedCast,
          composition: {
            type: 'character',
            faceSwapEligible: isFaceSwapEligible,
            shotDirection: expanded.suggestedCamera,
            focalAnchor,
          },
          profile: { avoid: vibeProfile?.avoid },
        });

        try {
          const sonnet = await callSonnet(compiled.sonnetBrief, ANTHROPIC_KEY, compiled.maxTokens);
          sonnetBrief = sonnet.brief;
          sonnetRawResponse = sonnet.rawResponse;
          if (sonnet.text.length < 10) throw new Error('too short');
          finalPrompt = postProcessPrompt(sonnet.text, compiled.postProcess);
        } catch (err) {
          console.error('[generate-dream] NEW SCENE Sonnet failed:', (err as Error).message);
          fallbackReasons.push(`new_scene_sonnet_failed:${(err as Error).message}`);
          finalPrompt = compiled.fallbackPrompt;
        }

        // Photo is the face-swap source (face-swap block handles upload).
        if (isFaceSwapEligible) {
          faceSwapSource = input_image!;
          faceSwapGender = genderFromLock(resolvedCast[0]?.genderLock);
        }

        photoOverrideMode = 'flux-dev';
        logAxes = {
          medium: medium.key,
          vibe: vibe.key,
          engine: 'v2-new-scene-photo',
          faceSwap: isFaceSwapEligible,
          chaosIntensity: chaosProfile.intensity,
        };
        console.log('[generate-dream] New scene prompt:', finalPrompt.slice(0, 150));
      } catch (err) {
        console.error('[generate-dream] NEW SCENE FAILED:', (err as Error).message);
        fallbackReasons.push(`new_scene_failed:${(err as Error).message}`);
        finalPrompt = `${medium.fluxFragment}, ${photoScene || 'a creative scene'}, ${vibe.directive?.split('.')[0] ?? 'dramatic atmosphere'}, portrait 9:16, hyper detailed`;
        photoOverrideMode = 'flux-dev';
        logAxes = {
          medium: medium.key,
          vibe: vibe.key,
          engine: 'v2-new-scene-photo-fallback',
          error: (err as Error).message,
        };
      }
      lap('new-scene-done');
    } else if (isPhoto && photo_style === 'reimagine') {
      // ── REIMAGINE (solo): vision describe → medium template or generic brief → flux-dev ──
      console.log('[generate-dream] ⏱ REIMAGINE: starting vision...');
      try {
        const photoDescription = stripCastMeta(
          // Same high-quality clothing-free dreamcast prompt — reimagine re-renders
          // the person in a new medium, so the uploaded outfit shouldn't carry over.
          await describeWithVision(input_image!, VISION_PROMPTS.castPerson, REPLICATE_TOKEN, 300)
        );
        visionDescription = photoDescription;
        lap('reimagine-vision');
        console.log('[generate-dream] ⏱ Vision done:', photoDescription.slice(0, 120));

        const userHint = hint ?? '';
        const reimagineTemplate = buildReimaginePrompt(
          medium.key,
          photoDescription,
          userHint,
          vibe.directive!
        );

        if (reimagineTemplate) {
          finalPrompt = await enhanceViaHaiku(
            reimagineTemplate,
            reimagineTemplate,
            ANTHROPIC_KEY,
            150
          );
        } else {
          const styleRef = style_prompt
            ? `\n- Reference style (match this aesthetic): ${style_prompt.slice(0, 300)}`
            : '';
          const genericBrief = `Write a Flux AI prompt (50-70 words, comma-separated phrases) for an image:
- Start with: "${medium.fluxFragment}"
- Subject from photo: ${photoDescription}
- The user wants: ${userHint || 'a creative reimagining'}
- Render in ${medium.key} style
- Mood: ${vibe.directive}${styleRef}
- Framing: waist-up to three-quarter body. The person's face must be clearly visible and well-lit. Show the person IN the scene, interacting with elements around them. The environment should be visible — don't crop it out.
- DO NOT invent your own scenario — use the user's request EXACTLY
Output ONLY the prompt.`;
          finalPrompt = await enhanceViaHaiku(genericBrief, genericBrief, ANTHROPIC_KEY, 150);
        }

        photoOverrideMode = 'flux-dev';
        logAxes = {
          medium: medium.key,
          vibe: vibe.key,
          engine: 'v2-reimagine',
        };
        console.log('[generate-dream] Reimagine prompt:', finalPrompt.slice(0, 150));
      } catch (err) {
        console.error('[generate-dream] REIMAGINE FAILED:', (err as Error).message);
        fallbackReasons.push(`reimagine_failed:${(err as Error).message}`);
        // Fallback: use the hint as a raw prompt with medium styling
        finalPrompt = `${medium.fluxFragment}, ${hint ?? 'a creative scene'}, ${vibe.directive?.split('.')[0] ?? 'dramatic atmosphere'}, portrait 9:16, hyper detailed`;
        photoOverrideMode = 'flux-dev';
        logAxes = {
          medium: medium.key,
          vibe: vibe.key,
          engine: 'v2-reimagine-fallback',
          error: (err as Error).message,
        };
      }

      // Ship 2: face-swap the original photo onto the generated scene when the
      // medium supports it. Reimagine used to be caricature-only; now if the
      // medium is face-swap eligible, we get real face preservation + new scene.
      if (medium.characterRenderMode === 'natural') {
        faceSwapSource = input_image!;
        // The castPerson vision description opens with a "Female, average" /
        // "Male, athletic" header line — read the gender for the solo guard.
        faceSwapGender = /^\s*female\b/i.test(visionDescription ?? '')
          ? 'female'
          : /^\s*male\b/i.test(visionDescription ?? '')
            ? 'male'
            : null;
        logAxes.faceSwap = true;
        console.log('[generate-dream] Reimagine + face-swap enabled for this medium');
      }

      lap('reimagine-done');
    } else if (isPhoto) {
      // Photo restyle moved to restyle-photo Edge Function (Phase 3.4).
      // Client should call restyle-photo directly for photo + medium transforms.
      return new Response(
        JSON.stringify({
          error:
            'Photo restyle moved to restyle-photo endpoint. Use restyle-photo for photo transforms.',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    } else {
      // ── TEXT PATH ──
      const userSubject = rawPrompt ?? hint ?? '';

      // ── V2 SELF-INSERT / CAST DETECTION ──
      // Word lists come from engine_config so cast detection is tunable from the
      // dashboard with no deploy (migration 256). fetchEngineConfig is cached
      // per-invocation, so this is a free lookup; it falls back to the canonical
      // constants when the DB value is missing.
      const castCfg = await fetchEngineConfig(supabase);
      // NAMED cast members ("me and Steph"). The roster names are COMPARED against
      // and never concatenated into a prompt, which is what keeps user-typed text out
      // of the engine's own instructions; the matched name is then scrubbed from the
      // prompt by cleanSelfReferences before anything reaches a model.
      const rosterNames = (vibeProfile?.partner_library ?? [])
        .filter(
          (p): p is RosterPartner =>
            !!p && typeof p.id === 'string' && typeof p.name === 'string' && !!p.name.trim()
        )
        .map((p) => ({ id: p.id, name: p.name as string }));
      const selfInsertResult = userSubject
        ? detectSelfInsert(userSubject, {
            relationshipWords: castCfg.relationshipWords,
            petWords: castCfg.petWords,
            selfRefRegex: castCfg.selfRefRegex,
            castNames: rosterNames,
            nameStopWords: castCfg.nameStopWords,
          })
        : {
            isSelfInsert: false,
            cleanedPrompt: '',
            referencedRoles: new Set<string>(),
            // Spelled out so the union with SelfInsertResult keeps these readable on
            // the no-subject branch (a surprise dream has no prompt to match against).
            matchedPartnerId: undefined as string | undefined,
            unmatchedName: undefined as string | undefined,
          };

      // A NAMED person outranks the starred default: saying "Steph" is a more specific
      // request than "my partner", so re-point the plus_one mirror at them for this
      // render only. Nothing downstream changes — castResolver, the dual brief and the
      // swap pipeline all keep reading the single plus_one slot.
      //
      // ORDER MATTERS, the same rule the nightly partner roll follows: this rewrites
      // dream_cast, so it MUST run BEFORE hydrateCastSources, or the named member's
      // private storage_path never becomes a signed URL and the face swap silently
      // drops them.
      // An explicit pick from the Create chip beats a name the prompt happened to
      // match, which in turn beats the starred default. Each step is a more specific
      // statement of intent than the one under it.
      const requestedPartnerId =
        typeof cast_partner_id === 'string' && cast_partner_id
          ? cast_partner_id
          : selfInsertResult.matchedPartnerId;
      const namedPartner = requestedPartnerId
        ? (vibeProfile?.partner_library ?? []).find((p) => p?.id === requestedPartnerId)
        : undefined;
      const castForRender = namedPartner
        ? (mirrorPartnerIntoCast(vibeProfile?.dream_cast ?? [], namedPartner) as DreamCastMember[])
        : (vibeProfile?.dream_cast ?? []);
      if (namedPartner) {
        console.log(
          `[generate-dream] plus_one re-pointed to partner ${namedPartner.id} (${
            cast_partner_id ? 'explicit pick' : 'name match'
          })`
        );
      }

      // Cast photos live in the PRIVATE `cast-photos` bucket (migration 292);
      // resolve each storage_path to a fresh signed URL up front so all the
      // downstream thumb_url.startsWith('http') gates work unchanged. No-op for
      // legacy members already carrying a public thumb_url.
      const dreamCast: DreamCastMember[] = await hydrateCastSources(castForRender, supabase);
      const describedCast = dreamCast.filter((m: DreamCastMember) => m.thumb_url && m.description);

      let castMembers: DreamCastMember[] = [];

      if (force_cast_role) {
        // 'dual' is a special token (not an actual cast.role value) meaning
        // "use both self + plus_one for a two-character dual face-swap render".
        // Same semantics as nightly-dreams + the Reveal step. Without this
        // branch, .find() returned undefined and castMembers stayed empty,
        // which silently produced no-face-swap renders of generic people.
        if (force_cast_role === 'dual') {
          const self = describedCast.find((m: DreamCastMember) => m.role === 'self');
          const plusOne = describedCast.find((m: DreamCastMember) => m.role === 'plus_one');
          if (self && plusOne) castMembers = [self, plusOne];
          else if (self) castMembers = [self];
          else if (plusOne) castMembers = [plusOne];
        } else {
          const forced = describedCast.find((m: DreamCastMember) => m.role === force_cast_role);
          if (forced) castMembers = [forced];
        }
      } else if (selfInsertResult.isSelfInsert && !isPhoto) {
        castMembers = describedCast.filter((m: DreamCastMember) =>
          selfInsertResult.referencedRoles.has(m.role as 'self' | 'plus_one' | 'pet')
        );
      }

      const isFaceSwapEligible = medium.characterRenderMode === 'natural';

      if (isFaceSwapEligible && castMembers.length > 2) {
        const self = castMembers.find((m: DreamCastMember) => m.role === 'self');
        const plusOne = castMembers.find((m: DreamCastMember) => m.role === 'plus_one');
        castMembers = self && plusOne ? [self, plusOne] : [self ?? castMembers[0]];
      }

      // Forensic breadcrumb (2026-07-10): a "me and my wife" dream rendered as a
      // SOLO of the wife — the self-insert parser found plus_one but not self, so
      // castMembers dropped to 1 and it ran the single-cast swap. The raw queue
      // payload prunes fast, so record what the parser DETECTED vs the cast we
      // RESOLVED (queryable via ai_generation_log / check-forensics), and echo
      // the raw subject to the edge log — so the next repro is diagnosable
      // instead of inferred.
      if (isFaceSwapEligible) {
        const detected = Array.from(selfInsertResult.referencedRoles).sort().join('+') || 'none';
        const resolved = castMembers.map((m: DreamCastMember) => m.role).join('+') || 'none';
        fallbackReasons.push(`cast_parse:detected=${detected}:resolved=${resolved}`);
        console.log(
          `[generate-dream] cast parse: subject="${userSubject.slice(0, 120)}" → detected=${detected} resolved=${resolved}`
        );
      }

      // Randomize which dual-cast member lands on the LEFT vs RIGHT (~50%) so the
      // same person isn't always on the same side. castMembers order drives BOTH
      // the brief (CHARACTER 1 = LEFT, via resolveCastForPrompt) and the swap
      // sources, so flipping it once here is consistent end-to-end. Safe: the
      // gender-safe router pastes by DETECTED gender, so it follows whichever side
      // Sonnet actually placed each person.
      if (isFaceSwapEligible && castMembers.length === 2 && shouldFlipDualSide()) {
        castMembers = orderDualSides(castMembers[0], castMembers[1], true);
      }

      // Direct mode (use_exact_prompt) must win over cast/self-insert detection.
      // Otherwise a Direct prompt with self-referential language ("me and my
      // wife...") trips self-insert detection here and runs the full DreamBot
      // cast pipeline — including face swap — even though the user chose Direct
      // and the client already warned "your face won't appear". use_exact_prompt
      // routes to the direct pass-thru branch below (no cast, no face swap).
      const hasCastInjection =
        !body.use_exact_prompt &&
        (castMembers.length > 0 || (force_cast_role && describedCast.length > 0));

      if (hasCastInjection) {
        // ── CAST INJECTION: one or more cast members + scene expansion + chaos + compiler ──
        const cleanedPrompt = sanitizeUserPrompt(selfInsertResult.cleanedPrompt);
        const resolvedCast = resolveCastForPrompt(castMembers, {
          characterRenderMode: medium.characterRenderMode,
          key: medium.key,
        });

        const castRoles = castMembers.map((m: DreamCastMember) => m.role).join('+');
        console.log(
          `[generate-dream] 🎭 CAST-INJECT: roles=${castRoles} / ${medium.characterRenderMode} / faceSwap=${isFaceSwapEligible}`
        );

        // Scene expansion + chaos
        const expanded = expandScene({
          userPrompt: cleanedPrompt,
          userId,
          mediumKey: medium.key,
          vibeKey: vibe.key,
          hasCharacter: true,
        });
        const chaosProfile = rollChaos(
          Array.from(userId + cleanedPrompt).reduce(
            (h, c) => ((h << 5) - h + c.charCodeAt(0)) | 0,
            0
          ),
          {
            userPrompt: cleanedPrompt,
            mediumRenderMode: medium.characterRenderMode,
            faceSwapEligible: isFaceSwapEligible,
          }
        );
        // Dual face-swap renders skip the chaos layer entirely. Chaos perturbs
        // framing/geometry/scale, which (a) makes Flux likelier to flip the two
        // subjects' left/right placement and (b) can push a subject out of their
        // clean half — both of which break the half-crop dual swap. Clean,
        // predictable composition matters more than chaos for couple portraits.
        const isDualSwapRender = isFaceSwapEligible && castMembers.length === 2;
        const finalExpansion = isDualSwapRender
          ? expanded.expansion
          : applyChaos(expanded.expansion, chaosProfile);
        const focalAnchor = deriveFocalAnchor(resolvedCast, { userPrompt: cleanedPrompt });

        // Per-(model × medium) curated face-swap fragment override (migration
        // 266). Some models render photoreal when a stylized medium is asked
        // for (flux-1.1-pro on anime); a curated fragment they actually obey
        // for THIS medium fixes that. Obedient models + an empty table → no-op.
        // Keyed by (model, medium) because create renders the user's chosen
        // medium (unlike nightly, which rolls + can swap style freely). Sets
        // faceSwapFluxFragment (consumed by the face-swap brief builders) +
        // fluxFragment to keep them in parity.
        if (isFaceSwapEligible && force_model) {
          const createOverride = await pickCreateFaceSwapOverride(
            supabase,
            force_model,
            medium.key,
            vibe.key
          );
          if (createOverride) {
            medium = {
              ...medium,
              faceSwapFluxFragment: createOverride,
              fluxFragment: createOverride,
            };
            fallbackReasons.push(`create_face_swap_override:${force_model}/${medium.key}`);
            console.log(
              `[generate-dream] create face-swap override applied: ${force_model} / ${medium.key}`
            );
          }
        }

        // ── CREATE OUTFITS (mig 547, CREATE_OUTFIT_PLAN.md) ───────────────────────────
        // Per-person colour / silhouette / pattern (outfitPlan.ts) and whatever the user asked
        // each person to wear (outfitSpec.ts). Face-swap cast renders only: solo through
        // buildSingleBrief, couples through the slot pipeline. With both switches off and the
        // account not on the preview list, nothing here runs and every prompt is unchanged.
        const outfitPreview = castCfg.createOutfitPreviewUserIds.includes(userId);
        const outfitRollsOn = castCfg.createOutfitRolls || outfitPreview;
        const outfitLockOn = outfitRollsOn && (castCfg.createOutfitUserLock || outfitPreview);
        const outfitRoles = resolvedCast.map((rc) => rc.role);
        const outfitEligible =
          outfitRollsOn &&
          isFaceSwapEligible &&
          (outfitRoles.length === 1 || isDualSwapRender) &&
          outfitRoles.length <= 2 &&
          outfitRoles.every((r) => r === 'self' || r === 'plus_one');
        const partnerName =
          typeof namedPartner?.name === 'string' && namedPartner.name.trim()
            ? namedPartner.name.trim()
            : null;
        const outfitLegend: OutfitPerson[] = resolvedCast.map((rc) => ({
          role: rc.role,
          label:
            rc.role === 'self'
              ? 'the user'
              : (partnerName ?? `the user's ${rc.relationship || 'companion'}`),
          gender: rc.gender,
        }));
        // Started now, so a couple's read runs alongside the setting/action split below.
        // extractOutfitSpec never throws (fail-open → no spec → the rolls alone).
        const outfitSpecPromise: Promise<OutfitSpecOutcome> | null = outfitEligible
          ? outfitLockOn
            ? extractOutfitSpec(userSubject, outfitLegend, ANTHROPIC_KEY)
            : Promise.resolve<OutfitSpecOutcome>({ source: 'skipped', result: null })
          : null;
        const rollOutfitPlan = (spec: OutfitSpecOutcome): OutfitPlan => {
          fallbackReasons.push(...outfitSpecStamps(spec, outfitRoles.length));
          if (outfitPreview && !castCfg.createOutfitRolls) fallbackReasons.push('outfit_preview');
          return planOutfits(
            outfitRoles,
            {
              independentPct: castCfg.createOutfitIndependentPct,
              separateCutPct: castCfg.createOutfitSeparateCutPct,
              patternPct: castCfg.createOutfitPatternPct,
            },
            spec.source === 'read' ? spec.result.byRole : {}
          );
        };
        const soloOutfitPlan: OutfitPlan | null =
          outfitSpecPromise && outfitRoles.length === 1
            ? rollOutfitPlan(await outfitSpecPromise)
            : null;

        const compiled = compilePrompt({
          inputType: 'self_insert',
          medium: {
            key: medium.key,
            directive: medium.directive ?? '',
            fluxFragment: medium.fluxFragment ?? medium.key,
            characterRenderMode: medium.characterRenderMode,
            faceSwaps: medium.faceSwaps,
            // Without these two, applyFaceSwapOverride in singleBriefBuilder
            // + dualBriefBuilder silently no-ops and we render the standard
            // (often big-Disney-eye) version of stylized mediums for face
            // swaps. The DB columns exist (migration 154); plumb them through.
            faceSwapDirective: medium.faceSwapDirective ?? null,
            faceSwapFluxFragment: medium.faceSwapFluxFragment ?? null,
          },
          vibe: {
            key: vibe.key,
            directive: vibe.directive ?? '',
            faceSwapDirective: vibe.faceSwapDirective ?? null,
          },
          scene: {
            userPrompt: cleanedPrompt || undefined,
            sceneExpansion: isDLT ? undefined : finalExpansion || undefined,
            styleReference: style_prompt || undefined,
          },
          cast: resolvedCast,
          composition: {
            type: 'character',
            faceSwapEligible: isFaceSwapEligible,
            shotDirection: expanded.suggestedCamera,
            focalAnchor,
          },
          profile: { avoid: vibeProfile?.avoid },
          ...(soloOutfitPlan ? { outfitPlan: soloOutfitPlan } : {}),
        });

        try {
          // Face-swap sources come from the compiler regardless of prompt path.
          if (compiled.faceSwapSource) {
            faceSwapSource = compiled.faceSwapSource;
            faceSwapGender = genderFromLock(resolvedCast[0]?.genderLock);
          }
          if (compiled.faceSwapSources) {
            faceSwapSources = compiled.faceSwapSources;
          }

          if (isDualSwapRender) {
            // ── Route Create dual face-swap through the PROVEN nightly slot pipeline ──
            // buildDualBrief lets Sonnet write the whole prompt → on romance-prone
            // mediums it drifts to full-body / facing-each-other → tiny touching
            // faces → broken swap. The slot pipeline LOCKS framing (waist-up,
            // side-by-side, big separated faces to camera) and only lets Sonnet fill
            // scene/wardrobe/mood/props → two clean large faces → reliable swap.
            // Falls back to the legacy buildDualBrief output on any error.
            try {
              // SETTING vs ACTION (migration 541). Fails open to null on any error, no key or
              // a switched-off flag, in which case every field below behaves exactly as it did
              // before — the whole prompt as the place, a pool pose as the beat.
              let sceneSplit: PromptSceneSplit | null = null;
              if (castCfg.createPromptSceneSplit && cleanedPrompt) {
                sceneSplit = await splitPromptScene(
                  cleanedPrompt,
                  resolvedCast.length >= 2 ? 2 : 1,
                  ANTHROPIC_KEY
                );
                fallbackReasons.push(`create_scene_split:${sceneSplit.source}`);
              }
              const coupleOutfitPlan: OutfitPlan | null =
                outfitSpecPromise && outfitRoles.length === 2
                  ? rollOutfitPlan(await outfitSpecPromise)
                  : null;
              // Named var (not inline) so a later dual-swap failure can rebuild a
              // SOLO prompt for self from the same input.
              const slotInput: CharacterSlotPipelineInput = {
                cast: resolvedCast.map((rc) => {
                  const src = castMembers.find((m: DreamCastMember) => m.role === rc.role);
                  return {
                    role: rc.role,
                    promptDesc: rc.promptDesc,
                    age: src?.age ?? null,
                    physicalSummary: src?.physical_summary ?? null,
                    gender: src?.gender ?? null,
                    // narrative_fg interpolates ethnicity straight into "a <ethnicity> <gender>"
                    // and, unlike the legacy assembler, never restates race anywhere else — so
                    // omitting it (as Create did) drops the couple's strongest race anchor.
                    ethnicity: src?.ethnicity ?? null,
                  };
                }),
                iconicAnchor: null,
                // THE PLACE. Passing the whole prompt here is what produced
                // "set at a companion snowboarding": characterSlotPrompt spends this string
                // as the location, in the prompt's highest-attention window AND three times
                // in the Sonnet brief. With the split on, the setting rides setAtOverride
                // (the dieted slot nightly uses for scenario seeds) and the verb becomes the
                // ACTION instead of scenery. Off, this is exactly what it always was.
                userPlace: cleanedPrompt || null,
                ...(sceneSplit && sceneSplit.source === 'split'
                  ? { setAtOverride: sceneSplit.setting }
                  : {}),
                // TIME + WEATHER. Create sent three empty strings here, so every dream of a
                // given prompt was lit identically and the brief printed "- TIME:" with nothing
                // after it. Nightly rolls these from the location's BIOME pools; Create has no
                // biome (the place is whatever the user typed), so it rolls from climate-agnostic
                // pools that read correctly anywhere. Phenomena stays empty on purpose — the vibe
                // fragment already owns that register. Off = the original empty strings.
                ...(castCfg.createSceneAxes
                  ? rollCreateSceneAxes()
                  : { timeAxis: '', weatherAxis: '', phenomenaAxis: '' }),
                // Pass the user's scene as a wardrobe hint too so a themed request
                // ("as superheroes") reaches the wardrobe slot, not just the scene. With the
                // split on this is dropped: the same string was reaching the costume brief as
                // "one on-location inspiration to draw from: 'a companion snowboarding'" — an
                // ACTION offered as clothing. The generic wardrobe roll does a better job.
                wardrobeAnchor:
                  sceneSplit && sceneSplit.source === 'split' ? null : cleanedPrompt || null,
                mediumFluxFragment: medium.fluxFragment ?? medium.key,
                // On the face-swap slot path, prefer the vibe's FACE-SWAP
                // directive (kawaii etc. carry a "render the human face
                // realistically despite the stylized scene" rule) — matches
                // dualBriefBuilder. Falls back to the normal directive.
                vibeDirective: applyVibeGenderModifier(
                  vibe.key,
                  vibe.faceSwapDirective ?? vibe.directive ?? '',
                  null
                ),
                avoidList: vibeProfile?.avoid?.join(', ') ?? '',
                // The vibe's authored light/palette accent. Create never passed it, so the
                // composer's tail silently lost it; ResolvedVibe has carried it since mig 504.
                vibeFragment: vibe.fluxFragment,
                vibeFragmentPosition: vibe.fragmentPosition,
                // Dress them for the ACTIVITY, not a rolled aesthetic. Create never set
                // sceneRegister, so the brief asked for "retro resort glamour" on every
                // cast dream and a snowboarding prompt came back in a velvet jacket with
                // gold piping. Off = the register sentence, exactly as before.
                ...(castCfg.createActivityWardrobe ? { activityWardrobe: true } : {}),
                // Per-person outfit plan (mig 547). Unset = the palette brief above, unchanged.
                ...(coupleOutfitPlan ? { outfitPlan: coupleOutfitPlan } : {}),
                // Create: NEUTRAL pose only — force the relationship-appropriate
                // partner/companion pool (NOT the 18% playful roll). Create is the
                // user's OWN prompt, so we tread lightly: no goofy thumbs-up poses
                // injected onto someone's serious request. (Goofy/elegant scenes are
                // nightly-only and never touch the user's Create prompt either.)
                action: await (async () => {
                  // The USER'S OWN verb wins when we could extract one. Before the split this
                  // was structurally impossible: the prompt went in as the place and the beat
                  // was always a neutral pool pose, so "snowboarding" could never become what
                  // anybody was doing. The pool stays the fallback for a prompt with no action
                  // in it, which is most scenery prompts.
                  if (sceneSplit?.action) return sceneSplit.action;
                  const rel = String(
                    castMembers.find((m: DreamCastMember) => m.role === 'plus_one')?.relationship ??
                      ''
                  );
                  const pool =
                    rel === 'partner' || rel === 'significant_other' ? 'partner' : 'companion';
                  // PAID path: belt on top of the loader's own fallback —
                  // even a thrown loader must not touch a Create dream (I4).
                  try {
                    return pickDualAction(rel, pool, (await loadClassicPools(supabase)).dual);
                  } catch (_e) {
                    return pickDualAction(rel, pool);
                  }
                })(),
              };
              const slotResult = await runCharacterSlotPipeline(slotInput, ANTHROPIC_KEY);
              sonnetBrief = slotResult.briefUsed;
              sonnetRawResponse = slotResult.rawResponse;
              finalPrompt = slotResult.assembledPrompt;
              fallbackReasons.push(...slotResult.fallbackReasons);
              // ── THE COUPLE COMPOSER (migration 541) ──────────────────────────────
              // Create has been assembling couples in the legacy fragment-list shape that
              // FLUX_COUPLE_LAB.md measured at 45% first-try dual-swap hold; narrative_fg —
              // one left-to-right paragraph, the couple named in the FOREGROUND before the
              // scene, face words last — measured 92%. Nightly has run it since 2026-09-18;
              // this is the same composer, same variant, called directly.
              //
              // Deliberately NOT routed through _shared/nightlyLooksPath.ts: LOOKS_MINIMAL is
              // true there, which is a documented fix graveyard (four shipped fixes reached
              // zero renders behind it, __tests__/lib/looksMinimalInertFixGuard.test.ts).
              if ('left_wardrobe' in slotResult.slots) {
                if (castCfg.createCoupleEngine === 'experimental') {
                  finalPrompt = composeExperimentalCouple({
                    slots: slotResult.slots,
                    input: slotInput,
                    variant: 'narrative_fg',
                  });
                  composedCouplePrompt = true;
                  fallbackReasons.push('create_couple_engine:experimental:narrative_fg');
                } else {
                  fallbackReasons.push('create_couple_engine:production');
                }
              }
              // Capture self's side + the dual slots so a dual-swap failure can
              // re-render self ALONE (never a faceless couple). Only when the
              // slots are genuinely dual ('left_wardrobe' present).
              if ('left_wardrobe' in slotResult.slots) {
                const selfIdx = resolvedCast.findIndex((rc) => rc.role === 'self');
                soloFallbackCtx = {
                  dualSlots: slotResult.slots as DualSlots,
                  input: slotInput,
                  selfIndex: selfIdx === 1 ? 1 : 0,
                };
              }
              console.log(
                `[generate-dream] dual slot pipeline: retries=${slotResult.retries} fallbacks=${slotResult.fallbackReasons.length}`
              );
            } catch (slotErr) {
              // Slot pipeline failed → legacy dual brief (never worse than before).
              fallbackReasons.push(`create_dual_slot_failed:${(slotErr as Error).message}`);
              const sonnet = await callSonnet(
                compiled.sonnetBrief,
                ANTHROPIC_KEY,
                compiled.maxTokens
              );
              sonnetBrief = sonnet.brief;
              sonnetRawResponse = sonnet.rawResponse;
              finalPrompt = postProcessPrompt(sonnet.text, compiled.postProcess);
            }
          } else {
            const sonnet = await callSonnet(
              compiled.sonnetBrief,
              ANTHROPIC_KEY,
              compiled.maxTokens
            );
            sonnetBrief = sonnet.brief;
            sonnetRawResponse = sonnet.rawResponse;
            if (sonnet.text.length < 10) throw new Error('too short');
            let soloText = sonnet.text;
            // Solo outfit guarantees (mig 547): strip face occluders, and write the user's own
            // clothing words in if Sonnet dropped them. Unset plan = the text as Sonnet wrote it.
            const soloPerson = soloOutfitPlan ? (soloOutfitPlan.people[0] ?? null) : null;
            if (soloPerson) {
              const enforced = enforceSoloOutfit(soloText, soloPerson);
              soloText = enforced.prompt;
              fallbackReasons.push(
                'outfit_colour:solo',
                'outfit_cut:solo',
                `outfit_pattern:${
                  !soloPerson.pattern
                    ? 'solid'
                    : soloPerson.patternSource === 'user'
                      ? 'user'
                      : soloPerson.patternAsTrim
                        ? 'trim'
                        : 'roll'
                }`,
                ...enforced.stamps
              );
            }
            finalPrompt = postProcessPrompt(soloText, compiled.postProcess);
          }
          logAxes = {
            medium: medium.key,
            vibe: vibe.key,
            engine: 'v2-compiler-self-insert',
            faceSwap: isFaceSwapEligible,
            dualFaceSwap: !!faceSwapSources,
            chaosIntensity: isDualSwapRender ? 0 : chaosProfile.intensity,
          };
          console.log('[generate-dream] V2 compiler (self-insert):', finalPrompt.slice(0, 150));
          lap('self-insert-done');
        } catch (err) {
          console.error('[generate-dream] SELF-INSERT FAILED:', (err as Error).message);
          fallbackReasons.push(`self_insert_sonnet_failed:${(err as Error).message}`);
          finalPrompt = compiled.fallbackPrompt;
          logAxes = {
            medium: medium.key,
            vibe: vibe.key,
            engine: 'v2-compiler-self-insert-fallback',
            error: (err as Error).message,
          };
          lap('self-insert-done');
        }
      } else if (body.use_exact_prompt && userSubject && userSubject.trim()) {
        // ── DIRECT PASS-THROUGH: power-user mode ──
        // User opted into "use my exact prompt" — skip all Sonnet expansion,
        // chaos, medium directive, vibe directive, focal anchor, two-pass
        // polish. Send the prompt verbatim to the user's chosen Flux model
        // (Settings → Pro Mode). Sparkle spend + moderation + storage + DB
        // insert all unchanged.
        finalPrompt = sanitizeUserPrompt(userSubject.trim());

        // Honor the request's force_model (the pick from <ModelPicker>, already
        // validated + charged above) — it IS what the user was billed for, so
        // overriding it with the users.pro_mode_flux_model column could let the
        // rendered model diverge from the charge if the column write raced or
        // failed. The column (still written by the picker, cross-device sticky)
        // is only the fallback for old clients that predate force_model.
        if (!force_model) {
          const { data: userRow } = await supabase
            .from('users')
            .select('pro_mode_flux_model')
            .eq('id', userId)
            .single();
          force_model =
            (userRow as { pro_mode_flux_model?: string } | null)?.pro_mode_flux_model ||
            'black-forest-labs/flux-1.1-pro';
        }
        console.log(`[generate-dream] DIRECT PASS-THROUGH model preference: ${force_model}`);
        logAxes = {
          medium: medium.key,
          vibe: vibe.key,
          engine: 'direct-pass-thru',
          chaosIntensity: 0,
          chaosInjections: 0,
        };
        fallbackReasons.push('direct_pass_thru:no_sonnet');
        console.log(
          `[generate-dream] DIRECT PASS-THROUGH (${force_model}): ${finalPrompt.slice(0, 150)}`
        );
        lap('direct-pass-thru-done');
      } else {
        // ── V2 COMPILER PATHS: style transfer, text directive, surprise ──
        // SURPRISE DREAM (no prompt, no photo, no style reference): anchor it to an
        // AUTHORED people-free spot instead of handing Sonnet a blank canvas, which
        // is the one input the engine has repeatedly proved it should never get --
        // with nothing to vary against it pigeonholes and rhymes, so every surprise
        // lands on the same handful of ideas. Same pool nightly's scene-only dreams
        // use (_shared/surpriseScene.ts).
        //
        // Injected HERE rather than at userSubject on purpose: further up, the text
        // path runs detectSelfInsert over the prompt, and a spot that happened to
        // contain a relationship word would cast someone into a dream that is
        // supposed to be strictly people-free.
        let surprise: Awaited<ReturnType<typeof pickSurpriseScene>> = null;
        if (!userSubject.trim() && !style_prompt) {
          // This branch is the no-photo path, so the people-free pool.
          surprise = await pickSurpriseScene(supabase, 'pure_scene');
          if (surprise) {
            fallbackReasons.push(`surprise_seed:${surprise.kind}:${surprise.place}`);
            console.log(`[generate-dream] surprise seed (${surprise.kind}): ${surprise.prompt}`);
          } else {
            // No authored spot available at all — keep the old behaviour rather than
            // failing a render the user already paid for.
            fallbackReasons.push('surprise_seed:none');
          }
        }
        // Authored text, not user input: sanitizeUserPrompt is for defending against
        // what a user typed, and running it over our own pool text would only risk
        // mangling it.
        const sanitizedPrompt = userSubject
          ? sanitizeUserPrompt(userSubject)
          : (surprise?.prompt ?? '');
        const inputType = style_prompt
          ? 'style_transfer'
          : sanitizedPrompt
            ? 'text_directive'
            : 'text_directive'; // surprise = text_directive with no prompt

        // Scene expansion (fills gaps in thin user prompts with cinematic detail)
        const expanded = sanitizedPrompt
          ? expandScene({
              userPrompt: sanitizedPrompt,
              userId,
              mediumKey: medium.key,
              vibeKey: vibe.key,
              hasCharacter: false, // no cast in these paths
            })
          : {
              expansion: '',
              suggestedCamera: 'environmental portrait, eye-level, 50mm lens, deep perspective',
              usedPhrases: [],
            };

        // Chaos layer (perception distortion)
        const chaosProfile = rollChaos(
          Array.from(userId + (sanitizedPrompt || medium.key)).reduce(
            (h, c) => ((h << 5) - h + c.charCodeAt(0)) | 0,
            0
          ),
          {
            userPrompt: sanitizedPrompt,
            mediumRenderMode: medium.characterRenderMode,
            faceSwapEligible: false,
          }
        );
        const finalExpansion = applyChaos(expanded.expansion, chaosProfile);

        // Focal anchor
        const focalAnchor = deriveFocalAnchor([], {
          userPrompt: sanitizedPrompt,
          styleReference: style_prompt,
          objectDirective: undefined,
        });

        // Compile prompt
        const compiled = compilePrompt({
          inputType: inputType as 'text_directive' | 'style_transfer',
          medium: {
            key: medium.key,
            directive: medium.directive ?? '',
            fluxFragment: medium.fluxFragment ?? medium.key,
            characterRenderMode: medium.characterRenderMode,
            faceSwaps: medium.faceSwaps,
            // Without these two, applyFaceSwapOverride in singleBriefBuilder
            // + dualBriefBuilder silently no-ops and we render the standard
            // (often big-Disney-eye) version of stylized mediums for face
            // swaps. The DB columns exist (migration 154); plumb them through.
            faceSwapDirective: medium.faceSwapDirective ?? null,
            faceSwapFluxFragment: medium.faceSwapFluxFragment ?? null,
          },
          vibe: {
            key: vibe.key,
            directive: vibe.directive ?? '',
            faceSwapDirective: vibe.faceSwapDirective ?? null,
          },
          scene: {
            userPrompt: sanitizedPrompt || undefined,
            sceneExpansion: isDLT ? undefined : finalExpansion || undefined,
            styleReference: style_prompt || undefined,
          },
          cast: [],
          composition: {
            type: 'pure_scene',
            faceSwapEligible: false,
            shotDirection: expanded.suggestedCamera,
            focalAnchor,
          },
          profile: { avoid: vibeProfile?.avoid },
        });

        try {
          const sonnet = await callSonnet(compiled.sonnetBrief, ANTHROPIC_KEY, compiled.maxTokens);
          sonnetBrief = sonnet.brief;
          sonnetRawResponse = sonnet.rawResponse;
          if (sonnet.text.length < 10) throw new Error('too short');
          finalPrompt = postProcessPrompt(sonnet.text, compiled.postProcess);
        } catch (err) {
          fallbackReasons.push(`${inputType}_sonnet_failed:${(err as Error).message}`);
          finalPrompt = compiled.fallbackPrompt;
        }

        logAxes = {
          medium: medium.key,
          vibe: vibe.key,
          engine: `v2-compiler-${inputType}`,
          chaosIntensity: chaosProfile.intensity,
          chaosInjections: chaosProfile.injections.length,
        };
        console.log(`[generate-dream] V2 compiler (${inputType}):`, finalPrompt.slice(0, 150));
        lap('v2-compiler-done');
      }
    }
    lap('v2-engine-done');
  } else {
    return new Response(JSON.stringify({ error: 'Must provide medium_key or vibe_key' }), {
      status: 400,
    });
  }

  // Legacy branches (rawPrompt, haiku_brief, vibe_profile, recipe) deleted Phase 3.2.
  // Nightly path moved to nightly-dreams Edge Function Phase 3.3.

  // New Scene reference render forces the kontext (image-input) path and keeps
  // the uploaded photo as the reference (overriding the flux-dev photo-discard).
  const effectiveMode = newSceneRefModel ? 'flux-kontext' : (photoOverrideMode ?? mode);
  const effectiveInputImage = newSceneRefModel
    ? input_image
    : photoOverrideMode
      ? undefined
      : input_image;

  finalPrompt = sanitizePrompt(finalPrompt);

  const autoPicked = await pickModel(
    effectiveMode,
    finalPrompt,
    resolvedMediumKey,
    resolvedVibeKey
  );
  let pickedModel = newSceneRefModel || force_model || autoPicked.model;

  // ── Face-swap safety clamp: Flux 1.1 Pro Ultra → Flux 1.1 Pro ──
  // Ultra renders at 4MP, which breaks face swaps two ways:
  //   (1) DUAL — the pipeline decodes the output, crops it in half, encodes
  //       each half, swaps each, then stitches; at 4MP that blows the Supabase
  //       Edge 150MB per-isolate ceiling → 546 WORKER_RESOURCE_LIMIT (confirmed
  //       2026-05-30, 3/3 dual renders on Ultra failed).
  //   (2) SINGLE — the 4MP render is handed to the swap providers
  //       (cdingram/yan-ops/pikachupichu25), which downscale it until the face
  //       is undetectable, or time out → "no face found" → hard-fail + refund.
  //       This disproves the old "single face-swap is fine, no halving step"
  //       assumption: 2026-07-10 A/B — the SAME beach scene COMPLETED on
  //       flux-1.1-pro (08:04) and hard-failed on -ultra (08:10), minutes apart.
  // So clamp Ultra → Pro whenever a face swap (single OR dual) will run. Ultra
  // is still picked for non-face-swap mediums (landscapes etc). faceSwapSource
  // (single) + faceSwapSources (dual) are both populated by the cast/photo
  // branches above, before this point.
  const willFaceSwapRender = (faceSwapSources && faceSwapSources.length === 2) || !!faceSwapSource;
  if (willFaceSwapRender && pickedModel === 'black-forest-labs/flux-1.1-pro-ultra') {
    const arity = faceSwapSources && faceSwapSources.length === 2 ? 'dual' : 'single';
    console.warn(
      `[generate-dream] CLAMP: flux-1.1-pro-ultra → flux-1.1-pro for ${arity} face swap (Ultra's 4MP output breaks the swap)`
    );
    fallbackReasons.push(`${arity}_ultra_clamped_to_pro`);
    pickedModel = 'black-forest-labs/flux-1.1-pro';
  }

  // ── Smart Dream backstop — guarantee the RENDERED model is in the chosen
  // style's approved set (SMART_DREAM_PLAN.md). On the normal queue path
  // enqueue-dream already coerced force_model before charging, so this is a
  // no-op; it closes the edge/hostile vectors — a direct (non-enqueue)
  // generate call, or a null force_model that fell through to the auto-picker
  // (which reads the shared allowed_models pool, not the Smart Dream set).
  // DreamBot mode only; New Scene uses its own model universe (skipped). Stylized
  // Smart Dream sets never include flux-1.1-pro-ultra, so no Ultra re-clamp is
  // needed here.
  if (smartDreamCfg && !newSceneRefModel && smartDreamApplies(body)) {
    const { model, coerced } = coerceSmartDream(pickedModel, smartDreamCfg, getSparkleCost);
    if (coerced && model) {
      fallbackReasons.push(`smart_dream_coerce:${pickedModel}→${model}`);
      pickedModel = model;
    }
  }

  logAxes.model = pickedModel;
  console.log(
    `[generate-dream] User ${userId}, mode=${effectiveMode}, model=${pickedModel}${force_model ? ' (force_model override)' : ''}, prompt=${finalPrompt.slice(0, 80)}...`
  );

  // Stage breadcrumb — Flux/Replicate render. Records the chosen model too, so a
  // hard kill here (which skips ai_generation_log) still tells us which model ran.
  markStage(supabase, jobId, 'flux_render', pickedModel);

  // ── Generate image via Replicate ──────────────────────────────────────────
  try {
    // Grok (xAI) is TEXT-TO-IMAGE only — it can't take an input image. If a
    // forced Grok model lands on an input-image mode (restyle/Kontext), fall
    // back to Replicate's Kontext so the render doesn't fail on dispatch.
    if (isXaiModel(pickedModel) && effectiveInputImage) {
      fallbackReasons.push(`xai_img2img_block:${pickedModel}->flux-kontext-pro`);
      console.warn(
        `[generate-dream] Grok can't do img2img; using flux-kontext-pro instead of ${pickedModel}`
      );
      pickedModel = 'black-forest-labs/flux-kontext-pro';
    }
    console.log(`[generate-dream] ⏱ Starting image generation (model: ${pickedModel})...`);
    // Force JPEG when this dream will go through dual-face-swap (preserves
    // the 2026-05-09 HTTP 546 fix). Otherwise PNG for lossless quality.
    const willDualFaceSwap = !!(faceSwapSources && faceSwapSources.length === 2);
    const genCreds = {
      replicateToken: REPLICATE_TOKEN,
      openaiKey: OPENAI_KEY,
      geminiKey: GEMINI_KEY,
      xaiKey: XAI_KEY,
    };
    // New Scene reference render: on a refusal/failure, retry the bucket's other
    // model ONCE (visible fallback) before the outer catch refunds. Never
    // silently substitutes a reinvented subject — a second failure → refund.
    let genResult;
    if (newSceneRefModel) {
      try {
        genResult = await generateImage(
          effectiveMode,
          finalPrompt,
          effectiveInputImage,
          genCreds,
          pickedModel,
          'png'
        );
      } catch (refErr) {
        const alt = newSceneFallbackModel(pickedModel);
        fallbackReasons.push(
          `new_scene_ref_retry:${pickedModel}->${alt}:${(refErr as Error).message.slice(0, 60)}`
        );
        console.warn(
          `[generate-dream] NEW SCENE ${pickedModel} failed (${(refErr as Error).message}); retrying ${alt}`
        );
        pickedModel = alt;
        logAxes.newSceneModel = alt;
        genResult = await generateImage(
          effectiveMode,
          finalPrompt,
          effectiveInputImage,
          genCreds,
          alt,
          'png'
        );
      }
    } else {
      genResult = await generateImage(
        effectiveMode,
        finalPrompt,
        effectiveInputImage,
        genCreds,
        pickedModel,
        willDualFaceSwap ? 'jpg' : 'png'
      );
    }
    let tempUrl = genResult.url;
    replicatePredictionId = genResult.predictionId;
    if (genResult.nsfwRetries && genResult.nsfwRetries > 0) {
      logAxes.nsfwRetries = genResult.nsfwRetries;
      console.log(
        `[generate-dream] Generation passed after ${genResult.nsfwRetries} NSFW retry/retries`
      );
    }
    // Provider failover happened inside generateImage (retry or cross-provider
    // model swap) — surface it in the audit log + track the model that actually
    // rendered so downstream cost/model bookkeeping stays honest.
    if (genResult.failover) {
      fallbackReasons.push(genResult.failover);
      if (genResult.model && genResult.model !== pickedModel) {
        pickedModel = genResult.model;
        logAxes.providerFailoverModel = genResult.model;
      }
    }
    lap('image-gen');
    console.log(
      `[generate-dream] ⏱ Image generation complete (prediction: ${genResult.predictionId})`
    );

    // Stage breadcrumb — face swap (the memory-heaviest step; the 546 culprit).
    const willSwap =
      !!tempUrl && ((faceSwapSources && faceSwapSources.length === 2) || !!faceSwapSource);
    if (willSwap) markStage(supabase, jobId, 'face_swap', pickedModel);

    // Face swap: dual (two people) or single — retry up to 3x on transient
    // failures (Replicate cold start, 5xx, 429). Backoff between attempts
    // gives a cold model time to boot before we hammer it again.
    if (faceSwapSources && faceSwapSources.length === 2 && tempUrl) {
      // ── Gender-SAFE dual swap (see _shared/dualSwapPipeline.ts) ──
      // The Fly engine detects faces + gender and splits at the gap between them
      // (correct by construction — both-on-one / wrong-gender impossible). The
      // orchestrator retries the COUPLE render until the engine reports a clean
      // 2-face split. If it's truly unrecoverable, REFUND: Create users paid for
      // "me + my partner", so we don't ship a solo / stranger — strict:true →
      // outcome 'cascade' → throw → the outer catch refunds the sparkle.
      const s0 = faceSwapSources[0];
      const s1 = faceSwapSources[1];
      // ONE resolution of the self member — the solo fallback's SOURCE and its GENDER must
      // name the same person. They were two separate .find() calls and only the SOURCE
      // carried a positional fallback, so on a 2-member face-swap cast with no `self` role
      // the solo rebuild pasted s0's face while grading the render against castGender null.
      // A null cast gender can never soft-accept a 2+-face solo render (singleSwapGuard
      // judge(): `allMatch` requires a non-null gender, so 2+ faces is always 'hard'), so
      // the guard refused, the cascade threw, and the user was REFUNDED a dream that was
      // perfectly renderable. Single-face renders were unaffected — judge() skips the
      // mismatch check when castGender is null — which is why this stayed quiet.
      // Reachable in Create: castMembers comes from the self-insert parser's
      // referencedRoles, which can resolve {plus_one, pet} with no `self` — the same class
      // of miss the 2026-07-10 forensic breadcrumb above records.
      const selfRef = faceSwapSources.find((s) => s.role === 'self') ?? s0;
      const selfGender = genderFromLock(selfRef.genderLock);
      // Reserve a solo-fallback window (see module consts): the DUAL phase must
      // finish by dualDeadlineMs so the degrade solo render+swap has a guaranteed
      // window — self-only never loses to a budget-starved scene/refund.
      const renderDeadlineMs = t0 + RENDER_DEADLINE_MS;
      const dualDeadlineMs = renderDeadlineMs - SOLO_FALLBACK_RESERVE_MS;
      // SECOND SIGNAL for the dual swap (2026-09-12, _shared/wardrobeSides.ts): which side wears the LEFT-locked
      // outfit, mapped through the cast genders — offered only when the slots and both genders are known (the
      // pipeline stamps side_check:none otherwise and keeps the single read). Mode: engine_config (mig 514).
      const sideWardrobes = soloFallbackCtx
        ? {
            a: soloFallbackCtx.dualSlots.left_wardrobe,
            b: soloFallbackCtx.dualSlots.right_wardrobe,
          }
        : null;
      const sideG0 = asGender(genderFromLock(s0.genderLock));
      const sideG1 = asGender(genderFromLock(s1.genderLock));
      const sideGenders =
        sideG0 && sideG1 && sideG0 !== sideG1 ? { left: sideG0, right: sideG1 } : null;
      const confirmSides =
        sideWardrobes && sideGenders
          ? async (target: string) => {
              const r = await classifyWardrobeSides(
                target,
                sideWardrobes.a,
                sideWardrobes.b,
                REPLICATE_TOKEN
              );
              return r.aSide ? sidesToGenders(r.aSide, sideGenders.left, sideGenders.right) : null;
            }
          : undefined;
      // THE RETRY MODEL (migration 541). Create captured pickedModel once and handed it to
      // every rung, so a failing couple burned three renders on the model that had just
      // failed — FLUX_COUPLE_LAB lesson 6, "a repeated model is not a fallback". The pool
      // is the style's DreamSmart set (so the DreamSmart promise holds), capped at the
      // charged model's cost (so price-shown stays price-charged), and frozen on a DLT
      // replay (which exists to reproduce an exact look). Falls back to the current model
      // on every degenerate case, which is today's behaviour.
      // Re-read rather than reach for the cast block's `castCfg`, which is scoped inside
      // the prompt-building branch. fetchEngineConfig is 60s-cached per isolate, so this
      // is the same object the branch above already resolved.
      const swapCfg = await fetchEngineConfig(supabase);
      const triedModels: string[] = [pickedModel];
      const retryModel = (): string => {
        if (!swapCfg.createRetryChangesModel) return pickedModel;
        const moved = nextCreateModel({
          tried: triedModels,
          candidates: smartDreamCfg?.models ?? [],
          costOf: getSparkleCost,
          frozen: isDLT,
        });
        fallbackReasons.push(moved.stamp);
        if (!moved.model) return triedModels[triedModels.length - 1];
        triedModels.push(moved.model);
        modelUsedOverride = moved.model;
        return moved.model;
      };

      const result = await genderSafeDualSwap(
        tempUrl,
        {
          dispatchDual: async (target, genderOverride) =>
            dispatchDualFaceSwap(
              s0.sourceUrl,
              s1.sourceUrl,
              target,
              REPLICATE_TOKEN,
              supabase,
              userId,
              dualDeadlineMs,
              false,
              { left: genderFromLock(s0.genderLock), right: genderFromLock(s1.genderLock) },
              jobId,
              genderOverride ?? null,
              (await fetchEngineConfig(supabase)).dualBigFaceMaxHFrac,
              // Swap capacity gate (mig 549): a user is watching, so Create may use the reserved slots.
              'interactive'
            ),
          confirmGenders: async (target) => {
            const r = await classifyDualGenders(target, REPLICATE_TOKEN);
            return { left: r.left, right: r.right, faceCount: r.faceCount };
          },
          ...(confirmSides ? { confirmSides } : {}),
          singleSwap: async (source, target) => {
            // GENDER-SAFE degrade + SOLO re-render (#1 + #3 — sunnysteph 2026-08-05
            // "face on the man"): the single-swap model is FACE-BLIND and pastes
            // self onto the most-prominent face, which on a couple render is the
            // partner (wrong gender). Guard it: probe the render (Haiku for stylized
            // mediums, where genderage misreads painted faces) and paste self ONLY
            // when it lands on a same-gender face.
            // #3: on the couple `target` the guard REFUSES (the partner is a
            // wrong-gender face) — so instead of cascading straight to a refund, we
            // give the guard a real SOLO re-render (one gender-matching person alone)
            // and let it place self on THAT clean body. Self lands on a matching-
            // gender figure rather than "whichever couple-face scored higher." If
            // budget's gone (guard's recover floor) or it still isn't safe, null →
            // cascade → refund.
            const soloNoun =
              selfGender === 'female' ? 'woman' : selfGender === 'male' ? 'man' : 'person';
            const guard = await ensureSoloSwapTarget(
              target,
              {
                castGender: selfGender,
                replicateToken: REPLICATE_TOKEN,
                rerender: async () => {
                  // Rebuild a GENUINE solo prompt for self (partner dropped) from
                  // the dual's own slots — replaces the couple-prompt + prefix
                  // that kept rendering two people → guard refused → faceless.
                  // Legacy prefix only on the freeform-brief path (ctx null).
                  const soloPrompt = soloFallbackCtx
                    ? assembleSoloFallbackFromDual(
                        soloFallbackCtx.dualSlots,
                        soloFallbackCtx.input,
                        soloFallbackCtx.selfIndex
                      )
                    : `exactly one person, a solo portrait of a single ${soloNoun} alone, ${finalPrompt}`;
                  fallbackReasons.push(
                    soloFallbackCtx ? 'solo_fallback:rebuilt_solo' : 'solo_fallback:legacy_prefix'
                  );
                  const rr = await generateImage(
                    effectiveMode,
                    soloPrompt,
                    effectiveInputImage,
                    {
                      replicateToken: REPLICATE_TOKEN,
                      openaiKey: OPENAI_KEY,
                      geminiKey: GEMINI_KEY,
                    },
                    retryModel(),
                    'png'
                  );
                  return { url: rr.url, predictionId: rr.predictionId };
                },
                log: (m) => console.log(`[generate-dream] degrade-guard: ${m}`),
              },
              {
                maxRerenders: 1,
                mediumKey: resolvedMediumKey,
                // FULL deadline + short reserve: the guaranteed solo fallback.
                deadlineMs: renderDeadlineMs,
                recoverBudgetMs: SOLO_RECOVER_MS,
              }
            );
            fallbackReasons.push(...guard.reasons.map((r) => `degrade_${r}`));
            if (!guard.safe) return null;
            const swapped = await faceSwap(source, guard.url, REPLICATE_TOKEN, supabase, userId);
            // predictionId of the SOLO re-render (#3) rides back so the pipeline
            // returns it as result.predictionId → the caller stamps the persisted
            // render, not the abandoned couple render.
            return { url: swapped, predictionId: guard.predictionId };
          },
          rerender: async (attempt: number) => {
            const cg = await generateImage(
              effectiveMode,
              // Stage 5a: final retry MUTATES the prompt — prepend face-separation
              // framing (subject-led, Hard-Rule safe) instead of re-rolling the
              // same prompt for a third identical layout. NOT when the couple composer
              // wrote the prompt: it already opens with its own two-shot and carries the
              // faces line deliberately LATE, and the lab measured that face words at the
              // front pull the camera in (lesson 3, 22% held vs 70%). Prepending here
              // would rebuild the exact failure the composer exists to avoid.
              attempt >= 2 && !composedCouplePrompt
                ? `two people side by side, both faces clearly visible and unobstructed, heads apart, ${finalPrompt}`
                : finalPrompt,
              effectiveInputImage,
              { replicateToken: REPLICATE_TOKEN, openaiKey: OPENAI_KEY, geminiKey: GEMINI_KEY },
              retryModel(),
              'jpg'
            );
            return { url: cg.url, predictionId: cg.predictionId };
          },
          selfSource: selfRef.sourceUrl,
          log: (m) => console.log(`[generate-dream] ${m}`),
        },
        {
          strict: true,
          deadlineMs: dualDeadlineMs,
          recoverBudgetMs: DUAL_RECOVER_MS,
          degradeToSingle: true,
          // Live-tunable wrong-person floor (engine_config, audit L3; cached fetch).
          identityDegradeFloor: (await fetchEngineConfig(supabase)).identityDegradeFloor,
          sideCheckMode: sideCheckModeOf((await fetchEngineConfig(supabase)).dualSideCheckMode),
        }
      );
      tempUrl = result.url;
      if (result.predictionId) replicatePredictionId = result.predictionId;
      logAxes.dualFaceCount = result.faceCount;
      fallbackReasons.push(...result.reasons);
      if (result.outcome === 'dual') {
        lap('dual-face-swap');
        logAxes.faceSwapResult = 'dual-success';
      } else if (result.outcome === 'single') {
        // The dual couldn't match the +1's identity after retries (or couldn't
        // split two clean faces), so rather than ship a wrong/stranger face — the
        // "wife's face on the man" failure — or refund, the pipeline degraded to a
        // gender-safe self-only swap: the user's own face is placed and the +1 is
        // dropped to a generic figure. Complete the dream at the single tier
        // (Kevin 2026-07-24 chose self-only over a refund). 'success' →
        // face_swap_mode 'single' below, so HD-upscale stays off like any cast render.
        lap('dual-face-swap-degraded-single');
        logAxes.faceSwapResult = 'success';
      } else {
        // 'cascade' — couldn't safely deliver anything at all. Refund: Create
        // users paid for their faces in the scene, so throw and let the outer
        // catch refund the sparkle.
        logAxes.faceSwapResult = 'dual-refund';
        throw new Error(`face_swap: couldn't render both faces (faces=${result.faceCount})`);
      }
    } else if (faceSwapSource && tempUrl) {
      // ── Solo-swap safety guard (see _shared/singleSwapGuard.ts) ──
      // The single-swap models are face-blind: if the render invented a second
      // person (couple-coded scenes beat the solo framing mandate), the cast
      // face can land on the WRONG person — the 2026-07-05 "wife's face on the
      // man" failure. Probe face count + gender; re-render while unsafe; never
      // paste unconfirmed. Unrecoverable → refund: Create users paid for THEIR
      // face in the scene, so throw (same contract as swap exhaustion below).
      const soloGuard = await ensureSoloSwapTarget(
        tempUrl,
        {
          castGender: faceSwapGender,
          replicateToken: REPLICATE_TOKEN,
          rerender: async () => {
            // Re-rolling the identical prompt mostly re-renders the same couple
            // (couple-coded scenes beat the mid-prompt solo mandate ~4/6 in QA).
            // Front-load the person count — earliest tokens win CLIP attention,
            // and this front-loads the SUBJECT, not the scene (Hard Rule safe).
            const soloNoun =
              faceSwapGender === 'female' ? 'woman' : faceSwapGender === 'male' ? 'man' : 'person';
            const rr = await generateImage(
              effectiveMode,
              `exactly one person, a solo portrait of a single ${soloNoun} alone, ${finalPrompt}`,
              effectiveInputImage,
              { replicateToken: REPLICATE_TOKEN, openaiKey: OPENAI_KEY, geminiKey: GEMINI_KEY },
              pickedModel,
              'png'
            );
            return { url: rr.url, predictionId: rr.predictionId };
          },
          log: (m) => console.log(`[generate-dream] ${m}`),
        },
        { deadlineMs: t0 + 140_000, mediumKey: resolvedMediumKey }
      );
      fallbackReasons.push(...soloGuard.reasons);
      logAxes.soloFaceCount = soloGuard.faceCount;
      if (!soloGuard.safe) {
        logAxes.faceSwapResult = 'solo-unsafe-refund';
        throw new Error(
          `face_swap: render kept an extra or mismatched person (faces=${soloGuard.faceCount ?? '?'})`
        );
      }
      tempUrl = soloGuard.url;
      if (soloGuard.predictionId) replicatePredictionId = soloGuard.predictionId;
      try {
        let sourceUrl: string;
        let swapFileName: string | null = null;
        if (faceSwapSource.startsWith('http')) {
          sourceUrl = faceSwapSource;
          lap('face-swap-upload');
        } else {
          console.log('[generate-dream] ⏱ Starting face swap upload...');
          // NO_PIXELS_IN_ISOLATE_PLAN.md (phase 3b): the cast photo arrives as a data: URL and the base64 →
          // bytes loop below is CPU the isolate does not have to spare. image-ops writes the temp object and
          // returns its key, so the cleanup below is unchanged. Fail-open: service off / error → the loop.
          let flyTemp: { url: string; key: string } | null = null;
          if (imageOpsEnabled()) {
            const r = await persistViaFly({
              sourceUrl: faceSwapSource,
              userId,
              mode: 'temp',
              timeoutMs: 10_000,
              traceId: jobId ?? undefined,
            });
            if (r.ok && r.result.url && r.result.key) {
              flyTemp = { url: r.result.url, key: r.result.key };
              console.log(`[generate-dream] swap source ${r.stamp}`);
            } else {
              console.warn(
                `[generate-dream] swap source ${r.ok ? 'image_ops:fallback:bad_response' : r.stamp} — decoding in the isolate`
              );
            }
          }
          if (flyTemp) {
            swapFileName = flyTemp.key;
            sourceUrl = flyTemp.url;
          } else {
            const base64Data = faceSwapSource.replace(/^data:image\/\w+;base64,/, '');
            const swapBytes = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
            swapFileName = `temp/${userId}/faceswap-${Date.now()}.jpg`;
            await supabase.storage.from('uploads').upload(swapFileName, swapBytes, {
              contentType: 'image/jpeg',
              upsert: true,
              cacheControl: '2592000',
            });
            const { data: swapUrlData } = supabase.storage
              .from('uploads')
              .getPublicUrl(swapFileName);
            sourceUrl = swapUrlData.publicUrl;
          }
          lap('face-swap-upload');
        }
        console.log('[generate-dream] ⏱ Face swap upload done, starting swap...');

        const preSwapTarget = tempUrl;
        tempUrl = await faceSwap(sourceUrl, tempUrl, REPLICATE_TOKEN, supabase, userId);

        // Stage 8d: post-swap identity gate for SOLOS — same 0.35 secret as
        // the dual gate. Below threshold → ONE re-swap via the fallback model
        // chain (a different paster genuinely re-takes the face), ship the
        // better of the two. Measurement absent → fail-open.
        const soloThr = soloIdentityThreshold();
        if (soloThr !== null) {
          const v1 = await verifySoloIdentity(tempUrl, sourceUrl);
          if (v1) {
            fallbackReasons.push(`identity_sim_solo:${v1.sim}`);
            if (v1.sim < soloThr) {
              fallbackReasons.push(`identity_below_threshold_solo:${v1.sim}<${soloThr}`);
              try {
                const reswap = await faceSwap(
                  sourceUrl,
                  preSwapTarget,
                  REPLICATE_TOKEN,
                  supabase,
                  userId,
                  {
                    skipPrimary: true,
                  }
                );
                const v2 = await verifySoloIdentity(reswap, sourceUrl);
                if (v2 && v2.sim > v1.sim) {
                  tempUrl = reswap;
                  fallbackReasons.push(`identity_solo_reswap:${v2.sim}`);
                }
              } catch (e) {
                fallbackReasons.push('identity_solo_reswap_failed');
                console.warn('[generate-dream] identity re-swap failed:', (e as Error).message);
              }
            }
          }
        }

        if (swapFileName) {
          supabase.storage
            .from('uploads')
            .remove([swapFileName])
            .catch((e) => console.warn('[generate-dream] swap-temp cleanup failed:', e));
        }
        lap('face-swap-model');
        console.log('[generate-dream] ⏱ Face swap complete');
        logAxes.faceSwapResult = 'success';
      } catch (err) {
        console.warn('[generate-dream] Single face swap failed:', (err as Error).message);
        fallbackReasons.push(`face_swap_failed:${(err as Error).message}`);
        logAxes.faceSwapResult = 'failed';
        logAxes.faceSwapError = (err as Error).message;
        // Phase 3 / Option A: hard-fail when single-cast face swap exhausts
        // (cdingram → yan-ops → pikachupichu25 fallback chain). The user
        // requested a self-insert dream; without the swap, the output has a
        // generic Sonnet face. Throw to refund.
        throw new Error(`face_swap: single cast face swap exhausted (${(err as Error).message})`);
      }
    }

    // ── Stage 2: post-swap face restoration (CodeFormer f=0.9, bench-picked
    // 2026-07-08). Runs on ANY successful swap (dual or single); fail-open —
    // a restore failure ships the unrestored swap. Dark until
    // engine_config.face_restore_enabled flips (staged rollout contract).
    const didSwap =
      logAxes.faceSwapResult === 'dual-success' || logAxes.faceSwapResult === 'success';
    if (didSwap && tempUrl) {
      const cfg = await fetchEngineConfig(supabase);
      // Create requires BOTH flags — nightly (enabled only) soaks 48h first
      // per the staged rollout contract.
      if (cfg.faceRestoreEnabled && cfg.faceRestoreCreateEnabled) {
        const restored = await restoreFace(tempUrl, {
          replicateToken: REPLICATE_TOKEN,
          fidelity: cfg.faceRestoreFidelity,
          deadlineMs: t0 + 140_000,
        });
        if (restored.restored) {
          tempUrl = restored.url;
          fallbackReasons.push(`face_restore:ok:${restored.ms}ms`);
          lap('face-restore');
        } else if (restored.reason) {
          fallbackReasons.push(restored.reason);
        }
      }
    }

    let imageUrl = tempUrl;

    // Stage breadcrumb — storage upload + persist.
    markStage(supabase, jobId, 'upload', pickedModel);

    // Persist to Storage + log in parallel (log doesn't need the permanent URL)
    // NO PIXELS IN THE ISOLATE (NO_PIXELS_IN_ISOLATE_PLAN.md, phase 2): original + display JPEG + thumbhash
    // in ONE Fly call, awaited BEFORE the generation log so its stamp lands in fallback_reasons. FAIL-OPEN:
    // any failure runs the in-isolate persistToStorage below and the background display build after it.
    let flyPersisted: { url: string; displayUrl: string | null; thumbhash: string | null } | null =
      null;
    if (imageOpsEnabled()) {
      const p = await persistViaFly({
        sourceUrl: tempUrl,
        userId,
        mode: 'final',
        traceId: jobId ?? undefined,
      });
      fallbackReasons.push(p.stamp);
      if (p.ok && p.result.url)
        flyPersisted = {
          url: p.result.url,
          displayUrl: p.result.displayUrl,
          thumbhash: p.result.thumbhash,
        };
    }
    timings.total = Date.now() - t0;
    const [persistedUrl] = await Promise.all([
      flyPersisted
        ? Promise.resolve(flyPersisted.url)
        : persistToStorage(tempUrl, userId, supabase),
      insertGenerationLog(supabase, {
        is_qa: isQa,
        user_id: userId,
        job_id: jobId ?? null,
        recipe_snapshot: asJsonbObject(vibe_profile),
        rolled_axes: { ...logAxes, timings },
        enhanced_prompt: finalPrompt,
        // What actually RENDERED, not what was picked. A retry that moved model and kept
        // reporting the original is precisely how "uploads.model lies on retries" happens.
        model_used: renderedModel(),
        cost_cents: getCostCents(renderedModel()),
        status: 'completed',
        sonnet_brief: sonnetBrief,
        sonnet_raw_response: sonnetRawResponse,
        vision_description: visionDescription,
        fallback_reasons: fallbackReasons,
        replicate_prediction_id: replicatePredictionId,
      }),
    ]);
    imageUrl = persistedUrl;
    lap('persist-done');

    // Scene description: only a user-supplied caption is stored, if present.
    // The auto "Place, Region" location geotag was ripped out 2026-06-15 — it
    // was buggy on no-location / direct renders ("No location identifiable",
    // "Enchanted Forest, Unknown") and is no longer shown on cards.
    const description: string | null = userDescription;

    // Build the DLT recipe — frozen LOOK anchors captured at insert time.
    // Phase 2.2a (capture-only): user-side V4 pipeline doesn't surface
    // intermediate rolls (camera, lighting, palette) outside the compiler,
    // so this recipe is sparse vs. bot-side recipes. Sufficient for DLT
    // replay because medium_key + vibe_key + ai_prompt is the load-bearing
    // identity. Fuller enrichment is a follow-up that would have the V4
    // compiler expose internal rolls. See docs/DLT_RECIPE_PLAN.md.
    let recipeForInsert = null as ReturnType<typeof buildRecipe> | null;
    if (resolvedMediumKey && resolvedVibeKey) {
      try {
        recipeForInsert = buildRecipe({
          model: renderedModel(),
          mediumKey: resolvedMediumKey,
          vibeKey: resolvedVibeKey,
          aiPrompt: finalPrompt,
          fluxSeed: null,
          // Persist the dreamer's original prompt so they can reload their exact
          // inputs into Create later. Sanitized at request entry. Empty for
          // prompt-less surprise dreams.
          hint: typeof hint === 'string' ? hint : '',
          // User-side V4 doesn't use bot-style overrides — leave style anchors
          // empty, the medium directive resolves fresh from DB at DLT time.
        });
      } catch (err) {
        // Recipe build is best-effort; if construction fails (e.g. unexpected
        // null fields under a future code path) we keep recipeForInsert null
        // and DLT falls back to style_summary. Same zero-regression contract.
        console.warn(`[generate-dream] recipe build failed: ${(err as Error).message}`);
      }
    }

    // Draft upload + budget upsert. The uploads row is the dream's persisted
    // record. Skip it when the caller sends `persist: false` (onboarding's
    // RevealStep generates the first dream, then inserts its OWN row when the
    // user taps "Post my Dream" — if we also inserted here, the first dream got
    // saved TWICE). Budget always counts: the image was rendered regardless.
    let uploadId: string | undefined;
    const caption = finalPrompt.length > 200 ? finalPrompt.slice(0, 197) + '...' : finalPrompt;
    const budgetUpsert = supabase
      .from('ai_generation_budget')
      .upsert(
        {
          user_id: userId,
          date: today,
          images_generated: todayCount + 1,
          total_cost_cents: (todayCount + 1) * 3,
        },
        { onConflict: 'user_id,date' }
      )
      .then(
        () => {},
        // Non-critical (analytics/abuse-visibility only, never blocks the render)
        // but log it so a persistent budget-tracking outage is diagnosable (A5).
        (err: unknown) =>
          console.warn(
            '[generate-dream] ai_generation_budget upsert failed (non-critical):',
            err instanceof Error ? err.message : String(err)
          )
      );

    if (persist) {
      // Insert the row immediately with the full image and a NULL display
      // variant. The display variant (decode + JPEG re-encode + thumbhash) is
      // the heaviest in-isolate pixel work and was busting the 2s/150MB
      // per-invocation budget mid-render → 546. We defer it to a background
      // task and patch the row a moment later: the dream EXISTS the instant
      // this row lands, and a CPU bust in the deferred task can't fail the
      // dream (best-effort; the feed/DreamCard fall back to image_url when the
      // display variant is null).
      // Did a Dream-Cast face land in the final image? Drives the HD-upscale
      // block (migration 310): upscaling an already-rendered AI face is uncanny,
      // so cast dreams are never offered "Save in HD". Create only reaches the
      // insert on a successful swap (failures throw + refund above), so this is
      // just dual vs single. NULL = plain render, HD allowed.
      const faceSwapMode =
        logAxes.faceSwapResult === 'dual-success'
          ? 'dual'
          : logAxes.faceSwapResult === 'success'
            ? 'single'
            : null;
      const [uploadResult] = await Promise.all([
        supabase
          .from('uploads')
          .insert({
            user_id: userId,
            image_url: imageUrl,
            // Phase 2: filled inline when Fly persisted; null (patched by the background build) otherwise.
            image_url_display: flyPersisted ? flyPersisted.displayUrl : null,
            thumbhash: flyPersisted ? flyPersisted.thumbhash : null,
            caption,
            ai_prompt: finalPrompt,
            ai_concept: conceptJson,
            dream_medium: resolvedMediumKey ?? null,
            dream_vibe: resolvedVibeKey ?? null,
            // Which AI model rendered this — drives the model badge on
            // DreamCard (migration 211, 2026-05-30). pickedModel resolves
            // to force_model when provided, else the picker's choice.
            model: renderedModel() || null,
            face_swap_mode: faceSwapMode,
            is_public: false,
            width: 768,
            height: 1664,
            recipe: recipeForInsert,
            flux_seed: null,
            ...(description ? { description } : {}),
          })
          .select('id')
          .single(),
        budgetUpsert,
      ]);
      uploadId = uploadResult.data?.id;
      if (uploadResult.error || !uploadId) {
        // Throw so the outer catch refunds the sparkle. Previously we logged
        // and continued, leaving the user with no visible dream AND no refund.
        throw new Error(
          `db_insert: uploads insert failed (${uploadResult.error?.message ?? 'no row returned'})`
        );
      }

      // Link the ai_generation_log row (written above at status:'completed',
      // keyed by job_id only) to THIS upload, so swap telemetry — identity_sim,
      // no_dual_split, dual_attempts, fallback_reasons — is lookup-able from the
      // post itself, not just by job_id. ai_generation_log.upload_id was never
      // populated (the log insert runs before this uploads insert, so the id
      // isn't known yet), which is why a broken face-swap post looked like it had
      // "no log". Awaited (not waitUntil, which the platform drops) but fully
      // guarded so a link failure can NEVER fail the dream. (Kevin 2026-07-24.)
      if (jobId) {
        try {
          const { error: linkErr } = await supabase
            .from('ai_generation_log')
            .update({ upload_id: uploadId })
            .eq('job_id', jobId);
          if (linkErr) console.warn('[logging] link upload_id failed:', linkErr.message);
        } catch (e) {
          console.warn('[logging] link upload_id threw:', (e as Error)?.message);
        }
      }

      // Background: build the display variant + thumbhash off the render's
      // critical budget, then patch the row. (The 546 fix.)
      const displayUploadId = uploadId;
      // Phase 2: when Fly persisted, the row already carries the display variant + thumbhash and no
      // background pixel work is scheduled (this scheduleBackground is the waitUntil the platform has
      // dropped before — 2026-06-17 — which is why display variants went missing until the cron caught up).
      if (!flyPersisted)
        scheduleBackground(
          buildDisplayVariant(imageUrl, userId, supabase).then(({ url, thumbhash }) => {
            if (!url && !thumbhash) return undefined;
            return supabase
              .from('uploads')
              .update({ image_url_display: url, thumbhash })
              .eq('id', displayUploadId);
          })
        );
    } else {
      // persist:false — no uploads row (caller persists it themselves). uploadId
      // stays undefined; the downstream style/notify/job steps all no-op on it.
      await budgetUpsert;
    }

    // Plan C — fire-and-forget: distill the unified style fingerprint
    // (medium + vibe + ai_prompt) via Haiku and write to uploads.style_summary.
    // Async so the user's response isn't blocked. Failure → NULL → DLT
    // falls back to ai_prompt with the existing weaker filtering.
    distillStyle(
      {
        rawPrompt: finalPrompt,
        mediumKey: resolvedMediumKey ?? null,
        vibeKey: resolvedVibeKey ?? null,
      },
      ANTHROPIC_KEY,
      supabase
    )
      .then((summary) => {
        if (!summary || !uploadId) return;
        return supabase.from('uploads').update({ style_summary: summary }).eq('id', uploadId);
      })
      .catch((e: unknown) => {
        // Graceful degradation (style_summary stays NULL → DLT falls back to the
        // raw prompt), but NOT silent: a spike here means Haiku/Anthropic is
        // degraded and DLT fidelity is quietly dropping fleet-wide. Log it.
        console.error(
          '[generate-dream] style_summary distillation failed:',
          e instanceof Error ? e.message : String(e)
        );
      });

    // NO auto-upscale (2026-05-25). The HD upscale is on-demand only — it runs
    // the first time someone actually downloads this post (request-upscale Edge
    // Function), then caches on uploads.image_url_hq so every later download is
    // instant. Auto-upscaling every render wasted ~$500-780/mo on posts nobody
    // downloads. See UPSCALE_QUEUE_PLAN.md.

    // Job update + notification in parallel (both need uploadId but not each other)
    // Inbox subtext only (the push copy is generated in send-push from
    // subtype='manual'). Clean descriptor — no legacy 'dream:' prefix.
    // Store the FULL hint (already ≤240 via the sanitizer) — the inbox row
    // truncates the PREVIEW itself, but "Copy dream message" copies this stored
    // body, so slicing here truncated the copied prompt (Kevin 2026-07-06).
    const notifBody = hint
      ? hint
      : `${resolvedMediumKey ?? 'surprise'} · ${resolvedVibeKey ?? 'surprise'}`;

    // Notify ONLY if the user left/queued (the loading screen's "Queue This"
    // sets dream_jobs.notify_on_complete). A user who waited on the loading
    // screen and got the result back should NOT be pinged. Defensive: a read
    // error (e.g. pre-migration) leaves it false → no notification.
    let notifyOnComplete = false;
    if (jobId) {
      const { data: jobRow } = await supabase
        .from('dream_jobs')
        .select('notify_on_complete')
        .eq('id', jobId)
        .maybeSingle();
      notifyOnComplete = !!(jobRow && jobRow.notify_on_complete);
    }

    await Promise.all([
      jobId
        ? supabase
            .from('dream_jobs')
            .update({
              status: 'done',
              result_image_url: imageUrl,
              result_prompt: finalPrompt,
              result_medium: resolvedMediumKey ?? null,
              result_vibe: resolvedVibeKey ?? null,
              upload_id: uploadId ?? null,
              completed_at: new Date().toISOString(),
            })
            .eq('id', jobId)
            .then(
              () => {},
              (e: unknown) => {
                // CRITICAL: if this flip to 'done' fails silently, the client's
                // dream_jobs poll fallback sees 'processing' forever — the paying
                // user is stuck on the loading screen with no result and no alarm.
                // The realtime dream_queue row is the primary signal, but a lost
                // dream_jobs flip must be visible so the pattern is diagnosable.
                console.error(
                  `[generate-dream] dream_jobs 'done' flip failed for job ${jobId}:`,
                  e instanceof Error ? e.message : String(e)
                );
              }
            )
        : Promise.resolve(),
      // Only notify if the user queued/left — a foreground wait gets no ping.
      // Route through ensure_dream_generated_notification (migration 343) so this
      // insert and request_dream_notification's catch-up insert share the same
      // idempotent path (partial unique index + ON CONFLICT DO NOTHING) and can
      // never double-ping on a race.
      shouldSendCompletionNotification({ uploadId, jobId, notifyOnComplete })
        ? supabase
            .rpc('ensure_dream_generated_notification', {
              p_upload_id: uploadId,
              p_user_id: userId,
              p_body: notifBody,
            })
            .then(
              () => {},
              // Not swallowed: the inbox row is the guaranteed delivery backstop
              // (push rides on it), so a failed insert is a real silent-
              // notification failure worth surfacing.
              (e: unknown) =>
                console.error(
                  '[generate-dream] completion notification insert FAILED:',
                  (e as Error).message
                )
            )
        : Promise.resolve(),
    ]);

    lap('total');
    console.log(`[generate-dream] ✅ Done in ${Date.now() - t0}ms for user ${userId}`);

    // QUEUE path: the worker dispatched fire-and-forget, so WE own marking the
    // dream_queue row completed (the client's realtime wait keys off it). The
    // 200 below is discarded (the worker already got its 202 ack).
    if (isQueue && jobId && uploadId) {
      await completeQueueJob(supabase, jobId, uploadId);
    }

    return new Response(
      JSON.stringify({
        image_url: imageUrl,
        prompt_used: finalPrompt,
        ai_concept: conceptJson,
        dream_mode: logAxes.dreamMode ?? mode,
        archetype: logAxes.archetype ?? null,
        model: logAxes.model ?? null,
        resolved_medium: resolvedMediumKey ?? null,
        resolved_vibe: resolvedVibeKey ?? null,
        job_id: jobId ?? null,
        upload_id: uploadId ?? null,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err) {
    const errMsg = (err as Error).message;
    console.error(`[generate-dream] Error for user ${userId}:`, errMsg);

    // ── Classify the failure for refund + UI messaging ──
    // Every hard-fail category routes to refund_sparkles (idempotent on jobId).
    // Soft-fails are NOT thrown — they fall through with degraded output and
    // return 200, so they never reach this catch.
    const refundClass = classifyFailure(errMsg);
    const isNsfw = refundClass === 'nsfw';

    // Report to Sentry (no-op without SENTRY_EDGE_DSN). NSFW rejections are an
    // expected outcome, not an infra error — skip those to keep the signal clean.
    if (!isNsfw) {
      await captureRenderError(err, {
        fn: 'generate-dream',
        jobId,
        userId,
        stage: logAxes.faceSwapResult ? 'face_swap' : 'flux_render',
        model: typeof logAxes.model === 'string' ? logAxes.model : force_model,
        source: isQueue ? 'create' : 'sync',
        weight: undefined,
      });
    }

    // QUEUE path: WE own the dream_queue terminal state (retry/backoff or
    // dead-letter + refund + notify). The worker is fire-and-forget. Do this
    // FIRST and return — the synchronous-path refund/notify below is skipped.
    if (isQueue && jobId) {
      // A missing cast source is permanent → dead-letter immediately (terminal),
      // not after 5 retries over ~2h. isNsfw still drives the notification copy.
      await failQueueJob(
        supabase,
        jobId,
        userId,
        errMsg,
        isNsfw,
        isNsfw || refundClass === 'source_missing'
      );
      // Best-effort audit log (mirrors the synchronous path's failure log).
      try {
        await insertGenerationLog(supabase, {
          is_qa: isQa,
          user_id: userId,
          job_id: jobId ?? null,
          recipe_snapshot: asJsonbObject(vibe_profile),
          rolled_axes: { ...logAxes, error: errMsg, refundClass, queued: true },
          enhanced_prompt: finalPrompt,
          model_used: force_model || 'unknown',
          cost_cents: 0,
          status: 'failed',
          sonnet_brief: sonnetBrief,
          sonnet_raw_response: sonnetRawResponse,
          vision_description: visionDescription,
          fallback_reasons: [...fallbackReasons, `hard_fail:${refundClass}`],
          replicate_prediction_id: replicatePredictionId,
          error_message: errMsg.slice(0, 500),
        });
      } catch {
        /* best-effort */
      }
      return new Response(JSON.stringify({ error: errMsg, queued: true }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Server-side refund — only fires when we have a jobId (reference for
    // idempotency). Refunds without a jobId fall back to the legacy
    // grant_sparkles path for NSFW so existing behavior is preserved.
    // QUEUE path: do NOT refund here — the worker owns retry/dead-letter and
    // only refunds once retries are exhausted. Refunding on a transient fail
    // here while the worker still intends to retry would hand the user a free
    // dream (charge stays, refund lands, retry succeeds).
    let sparkleRefunded = false;
    if (jobId && !isQueue) {
      try {
        // p_amount is only a FALLBACK — refund_sparkles refunds the actual
        // amount debited under this jobId (migration 183), so an advanced-model
        // dream charged 2/3/5 sparkles gets the full amount back, not a flat 1.
        const { data: refunded } = await supabase.rpc('refund_sparkles', {
          p_user_id: userId,
          p_amount: 1,
          p_reason: `refund:hard_fail:${refundClass}`,
          p_reference_id: jobId,
        });
        // refund_sparkles returns false if a prior refund already exists for
        // this jobId. Both outcomes mean "user is whole" from their POV.
        sparkleRefunded = true;
        console.log(
          `[generate-dream] Refund applied (class=${refundClass}, prior=${refunded === false})`
        );
      } catch (refundErr) {
        console.error('[generate-dream] Refund FAILED:', (refundErr as Error).message);
      }
    } else if (isNsfw && !isQueue) {
      // Legacy fallback for callers that didn't send a jobId
      try {
        await supabase.rpc('grant_sparkles', {
          p_user_id: userId,
          p_amount: 1,
          p_reason: 'nsfw_refund',
        });
        sparkleRefunded = true;
      } catch (refundErr) {
        console.error('[generate-dream] Legacy NSFW refund FAILED:', (refundErr as Error).message);
      }
    }

    // Log the failure to ai_generation_log so failed dreams are auditable —
    // previously the throw bypassed all logging, so failures were invisible in
    // the audit trail (status='failed', best-effort). pickedModel is block-
    // scoped to the try, so use force_model when available.
    try {
      await insertGenerationLog(supabase, {
        is_qa: isQa,
        user_id: userId,
        job_id: jobId ?? null,
        recipe_snapshot: asJsonbObject(vibe_profile),
        rolled_axes: { ...logAxes, error: errMsg, refundClass, sparkleRefunded },
        enhanced_prompt: finalPrompt,
        model_used: force_model || 'unknown',
        cost_cents: 0,
        status: 'failed',
        sonnet_brief: sonnetBrief,
        sonnet_raw_response: sonnetRawResponse,
        vision_description: visionDescription,
        fallback_reasons: [...fallbackReasons, `hard_fail:${refundClass}`],
        replicate_prediction_id: replicatePredictionId,
        error_message: errMsg.slice(0, 500),
      });
    } catch {
      /* logging is best-effort */
    }

    // Update dream_jobs status (best-effort). Skip for the QUEUE path: this fail
    // may be a transient attempt the worker will retry, so marking the job
    // failed (and notifying) here would prematurely fail the client + spam the
    // inbox on every attempt. The worker owns the final dead-letter state +
    // notification once retries are exhausted.
    if (jobId && !isQueue) {
      try {
        await supabase
          .from('dream_jobs')
          .update({
            status: isNsfw ? 'nsfw' : 'failed',
            error: errMsg,
            completed_at: new Date().toISOString(),
          })
          .eq('id', jobId);
      } catch {
        /* non-critical */
      }

      // Phase 4: write a `dream_failed` notification so the user sees the
      // failure in their inbox even if the loading screen got abandoned.
      // actor_id = userId (self-actor pattern, mirrors dream_generated).
      try {
        await supabase.from('notifications').insert(dreamFailedNotification(jobId, userId, isNsfw));
      } catch (notifyErr) {
        // No longer silent: this is the user's only signal their dream failed
        // (and was refunded) if they abandoned the loading screen.
        console.error(
          '[generate-dream] dream_failed notification insert FAILED:',
          (notifyErr as Error).message
        );
      }
    }

    return new Response(
      JSON.stringify({
        error: errMsg,
        hard_fail: true,
        nsfw: isNsfw, // legacy field — clients still branch on this for NSFW copy
        sparkle_refunded: sparkleRefunded,
        refund_reason: refundClass,
        job_id: jobId ?? null,
      }),
      { status: 500 }
    );
  }
}

// Durability wrapper: register the in-flight request with EdgeRuntime.waitUntil
// so the Supabase isolate keeps running the render→persist→notify work even if
// the client disconnects (app backgrounded/killed after "Queue This"). A
// still-connected client gets the response normally via `return task`; a
// disconnected one just has its response discarded while the work completes in
// the background and fires the completion notification. waitUntil/await share
// the SAME promise — no double-run. ~24s renders fit well under the 150s/400s
// background wall-clock. handleRequest never rejects (its outer try/catch
// always returns a Response), so the .catch is belt-and-suspenders.
Deno.serve((req) => {
  const task = handleRequest(req);
  const edgeRuntime = (
    globalThis as { EdgeRuntime?: { waitUntil?: (p: Promise<unknown>) => void } }
  ).EdgeRuntime;
  // Durability for the NORMAL (client-connected) path: keep the isolate alive to
  // finish the render even if the app backgrounds/disconnects.
  if (edgeRuntime && edgeRuntime.waitUntil) {
    edgeRuntime.waitUntil(task.catch(() => {}));
  }
  // x-dream-retry (refund-stuck-jobs best-effort re-dispatch) still acks 202.
  //
  // x-dream-queue (dream-queue-worker) NO LONGER detaches. On 2026-06-17 the
  // platform stopped honoring EdgeRuntime.waitUntil for background work: a
  // detached render was silently dropped after the 202 (verified — the render
  // never resumed past its first await), so every create/dlt dream sat
  // in_progress → stale-recovery re-queued → dead_letter + false refund + a
  // "failed" push hours later. We now render SYNCHRONOUSLY for the queue path:
  // the worker holds the connection open (exactly like the proven nightly
  // dispatch), which keeps the isolate alive for the full render, and we return
  // the real result. The render still owns dream_queue terminal state
  // (completeQueueJob / failQueueJob), and the worker re-queues only if the
  // dispatch is unreachable AND the job is still non-terminal (see create.ts +
  // the worker catch), so a dropped connection on a success can't re-render it.
  if (req.headers.get('x-dream-retry') === '1') {
    return new Response(JSON.stringify({ ok: true, accepted: true }), {
      status: 202,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  return task;
});

// ── Failure classification ────────────────────────────────────────────
//
// Maps an error message string to a refund class. Reasons land in
// sparkle_transactions.reason as `refund:hard_fail:<class>` so we can audit
// which failure mode is most common and where to invest reliability work.

// classifyFailure moved to _shared/classifyFailure.ts (2026-07-09) — it was
// duplicated here + restyle-photo and the copies had already drifted.

// ── Helpers ──────────────────────────────────────────────────────────────────

// Run a best-effort task in the background without blocking the response.
// Uses EdgeRuntime.waitUntil so the isolate stays alive to finish it (the
// top-level durability wrapper only keeps the isolate alive for handleRequest
// itself, not for detached promises spawned inside it). Used to move the
// CPU-heavy display-variant build OFF the render's critical 2s/150MB budget —
// the work that intermittently busted the isolate → 546 WORKER_RESOURCE_LIMIT.
function scheduleBackground(p: Promise<unknown>): void {
  const er = (globalThis as { EdgeRuntime?: { waitUntil?: (q: Promise<unknown>) => void } })
    .EdgeRuntime;
  // Log deferred-task failures instead of swallowing them silently (Architect
  // audit A5, 2026-07-10). Still fire-and-forget — never throws into the
  // response path — but a failed display-variant build is now visible in logs
  // instead of a silent perf regression (feed then serves the full-res image).
  if (er && er.waitUntil)
    er.waitUntil(
      p.catch((e) =>
        console.error('[scheduleBackground] deferred task failed:', (e as Error)?.message)
      )
    );
}

// The dreamcast `castPerson` prompt returns "<prose>\nAGE: N\nTRAITS: ...", with
// an optional leading "Male:/Female:" gender token. For an uploaded-photo dream
// we only want the prose identity description (the AGE/TRAITS lines are for
// stored-cast age-lock). Keep just the prose, drop the gender parse-token.
// NOTE: _shared/sanitizeUserText (run on the vision output) strips newlines, so
// the AGE/TRAITS labels arrive inline — split on the labels themselves (word
// boundary), NOT on a leading \n, or the meta leaks into the Flux brief.
function stripCastMeta(raw: string): string {
  const beforeMeta = raw.split(/\b(?:AGE|TRAITS)\s*:/i)[0].trim();
  return beforeMeta.replace(/^\s*(male|female)\s*:\s*/i, '').trim();
}

// haikuJson deleted Phase 3.2 — was only used by legacy recipe path.

// Retries Haiku on transient errors before falling back to the template prompt.
// Mirrors the retry logic in _shared/llm.ts (without model fallback — Haiku
// IS the fallback in this path).
const HAIKU_RETRY_DELAYS_MS = [1000, 3000, 10000, 30000];
const HAIKU_RETRYABLE = new Set([429, 500, 502, 503, 504, 529]);

async function enhanceViaHaiku(
  brief: string,
  fallback: string,
  anthropicKey: string | undefined,
  maxTokens: number = 150
): Promise<string> {
  if (!anthropicKey) return fallback;
  let lastErr = '';
  for (let attempt = 0; attempt <= HAIKU_RETRY_DELAYS_MS.length; attempt++) {
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': anthropicKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: HAIKU,
          max_tokens: maxTokens,
          messages: [{ role: 'user', content: brief }],
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const text = data.content?.[0]?.text?.trim() ?? '';
        return text.length >= 10 ? text : fallback;
      }
      lastErr = `Haiku ${res.status}`;
      if (!HAIKU_RETRYABLE.has(res.status)) {
        console.warn(`[generate-dream] ${lastErr} non-retryable — using template fallback`);
        return fallback;
      }
      if (attempt < HAIKU_RETRY_DELAYS_MS.length) {
        console.warn(
          `[generate-dream] ${lastErr} on ${attempt + 1}/${HAIKU_RETRY_DELAYS_MS.length + 1}, retrying in ${
            HAIKU_RETRY_DELAYS_MS[attempt] / 1000
          }s`
        );
        await new Promise((r) => setTimeout(r, HAIKU_RETRY_DELAYS_MS[attempt]));
      }
    } catch (err) {
      lastErr = (err as Error).message;
      if (attempt < HAIKU_RETRY_DELAYS_MS.length) {
        await new Promise((r) => setTimeout(r, HAIKU_RETRY_DELAYS_MS[attempt]));
      }
    }
  }
  console.warn(`[generate-dream] Haiku exhausted retries (${lastErr}) — using template fallback`);
  return fallback;
}

// Sonnet, pickModel, generateImage, persistToStorage, sanitizePrompt,
// faceSwap — all moved to _shared/ in Phase 3.1. Imports at the top of
// this file.

// CompanionMatch + detectCompanionRequest deleted Phase 3.2 — unused in V4 paths.
