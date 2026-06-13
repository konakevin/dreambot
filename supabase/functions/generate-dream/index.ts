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

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import type { VibeProfile, DreamCastMember } from '../_shared/vibeProfile.ts';
import { buildReimaginePrompt } from '../_shared/photoPrompts.ts';
import { describeWithVision, VISION_PROMPTS } from '../_shared/vision.ts';
import { shouldSendCompletionNotification } from '../_shared/notify.ts';
import { routeDualSwapByGender, genderFromLock } from '../_shared/dualGenderRouting.ts';
import { resolveMediumFromDb, resolveVibeFromDb } from '../_shared/dreamStyles.ts';
import { applyCleanMedium, fetchCleanMedium } from '../_shared/cleanMedium.ts';
import { detectSelfInsert } from '../_shared/selfInsertDetector.ts';
import { generateSceneDescription } from '../_shared/sceneDescription.ts';
import { resolveCastForPrompt } from '../_shared/castResolver.ts';
import { expandScene } from '../_shared/sceneExpander.ts';
import { rollChaos, applyChaos } from '../_shared/chaosLayer.ts';
import {
  compilePrompt,
  postProcessPrompt,
  sanitizeUserPrompt,
  deriveFocalAnchor,
} from '../_shared/promptCompiler.ts';
import { HAIKU } from '../_shared/models.ts';
// Shared post-processing (extracted Phase 3.1)
import { sanitizePrompt } from '../_shared/sanitize.ts';
import { generateImage } from '../_shared/generateImage.ts';
import { faceSwap } from '../_shared/faceSwap.ts';
import { dispatchDualFaceSwap } from '../_shared/dualSwapDispatch.ts';
import { persistToStorage, buildDisplayVariant } from '../_shared/persistence.ts';
import { callSonnet } from '../_shared/llm.ts';
import { distillStyle } from '../_shared/styleDistiller.ts';
import { getCostCents, getSparkleCost, loadModelCosts } from '../_shared/modelPricing.ts';
import { fetchEngineConfig } from '../_shared/engineConfig.ts';
import { pickModel } from '../_shared/modelPicker.ts';
import { insertGenerationLog } from '../_shared/logging.ts';
import { buildRecipe } from '../_shared/recipeBuilder.ts';
import { validateRecipe, resolveRecipeAnchors } from '../_shared/recipeReplay.ts';

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
  /** Optional user-supplied scene description. If absent, Haiku auto-generates from the final prompt. */
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
  /** When false, render + return WITHOUT inserting an uploads row — the caller
   *  persists its own (onboarding RevealStep). Defaults to true. Fixes the
   *  duplicate-first-dream (gen + "Post my Dream" both inserting a row). */
  persist?: boolean;
}

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

  if (!REPLICATE_TOKEN) {
    return new Response(
      JSON.stringify({ error: 'Server misconfigured: missing REPLICATE_API_TOKEN' }),
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

  // Auth. Normal path: the user's JWT (the gateway already validated it). Retry
  // path: refund-stuck-jobs re-invokes this function to REPLAY a dead render — it
  // has no user JWT, so it sends `x-dream-retry: 1` + the service-role key and we
  // resolve the user from the existing job. Retries reuse the same job_id, so the
  // charge + job upsert are idempotent no-ops (never a double charge).
  const authHeader = req.headers.get('authorization') ?? '';
  const isRetry = req.headers.get('x-dream-retry') === '1';
  let userId: string;
  if (isRetry) {
    if (authHeader !== `Bearer ${serviceRoleKey}`) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });
    }
    const retryJobId = typeof body.job_id === 'string' ? body.job_id : null;
    if (!retryJobId) {
      return new Response(JSON.stringify({ error: 'retry requires job_id' }), { status: 400 });
    }
    const { data: jobRow } = await supabase
      .from('dream_jobs')
      .select('user_id')
      .eq('id', retryJobId)
      .single();
    if (!jobRow) {
      return new Response(JSON.stringify({ error: 'retry job not found' }), { status: 404 });
    }
    userId = jobRow.user_id as string;
    console.log(`[generate-dream] RETRY render for job ${retryJobId} (user ${userId})`);
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
      console.error(
        '[generate-dream] Auth failed:',
        authError?.message,
        'header:',
        authHeader.slice(0, 30)
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
    job_id: jobId,
    style_prompt,
    subject_description,
    subject_type,
    dlt_recipe,
  } = body;
  // When false, render + return WITHOUT inserting an uploads row — the caller
  // persists its own (onboarding RevealStep). Default true so the create flow,
  // nightly, DLT, etc. keep auto-saving as before. Fixes the duplicate first
  // dream (gen inserted a row AND "Post my Dream" inserted another).
  const persist = body.persist !== false;

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

  // Optional user-supplied description for this dream. If absent, a Haiku
  // call generates one from finalPrompt before insert.
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
  // clobber a "Queue This" notify_on_complete flag. Skip on a retry — the payload
  // is already stored and the sweeper owns attempt_count.
  if (jobId && !isRetry) {
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
  // Skipped without a jobId (no idempotency key — legacy/test calls).
  // generate-dream is always a paid path (nightly + first-dream are separate,
  // free functions), so there is no free-render case to guard here.
  if (jobId) {
    await loadModelCosts(supabase);
    // DreamBot (no force_model) → engine_config.base_sparkle_cost (admin-tunable,
    // default 1); Direct/DLT → the picked model's cost. Mirrors the client.
    const cfg = await fetchEngineConfig(supabase);
    const dreamCost = force_model ? getSparkleCost(force_model) : cfg.baseSparkleCost;
    try {
      const { data: chargeStatus } = await supabase.rpc('charge_sparkles', {
        p_user_id: userId,
        p_amount: dreamCost,
        p_reason: 'dream',
        p_reference_id: jobId,
      });
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
      // Fail-open: don't block a paid dream on a transient charge error. Old
      // clients already charged client-side; new clients are a rare miss.
      console.warn('[generate-dream] charge_sparkles failed (continuing):', (err as Error).message);
    }
  }

  // ── Build prompt ──────────────────────────────────────────────────────────
  // Initialized to '' (not just declared) so the failure-logging path in the
  // outer catch can safely read it even if the throw happened before assignment.
  let finalPrompt = '';

  let logAxes: Record<string, unknown> = {};
  let conceptJson: Record<string, unknown> | null = null;
  let photoOverrideMode: string | null = null;
  let resolvedMediumKey: string | undefined;
  let resolvedVibeKey: string | undefined;
  let faceSwapSource: string | undefined; // original photo for face swap after generation
  let faceSwapSources:
    | Array<{ role: string; sourceUrl: string; genderLock: string | null }>
    | undefined;

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

    // Resolve medium and vibe to real curated entries — never store placeholders.
    // 2026-06-02 — art_styles / aesthetics favorites removed from VibeProfile
    // + the resolver branches that consumed them. Client always passes a
    // concrete key here.
    let medium = await resolveMediumFromDb(medium_key);
    const vibe = await resolveVibeFromDb(vibe_key);

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

    resolvedMediumKey = medium.key;
    resolvedVibeKey = vibe.key;

    // Log unknown-key fallbacks to ai_generation_log.fallback_reasons so we
    // can SQL-grep production for missing mediums/vibes (legacy keys, typos,
    // retired entries) and add them to the DB or remap them. Only counts when
    // the user passed an explicit key (not surprise_me/my_mediums/my_vibes)
    // and the resolver had to fall back to a default.
    const surpriseKeys = new Set(['surprise_me', 'my_mediums', 'my_vibes']);
    if (medium_key && !surpriseKeys.has(medium_key) && medium.key !== medium_key) {
      fallbackReasons.push(`unknown_medium_key:${medium_key}→${medium.key}`);
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

    if (isPhoto && photo_style === 'new_scene' && subject_type && subject_type !== 'person') {
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
          vibe: { key: vibe.key, directive: vibe.directive ?? '' },
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
          (await describeWithVision(
            input_image!,
            VISION_PROMPTS.photoSubject,
            REPLICATE_TOKEN,
            200
          ));
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

        // Scene expansion + chaos (same as self-insert)
        const expanded = expandScene({
          userPrompt: hint ?? '',
          userId,
          mediumKey: medium.key,
          vibeKey: vibe.key,
          hasCharacter: true,
        });
        const chaosProfile = rollChaos(
          Array.from(userId + (hint ?? '')).reduce(
            (h, c) => ((h << 5) - h + c.charCodeAt(0)) | 0,
            0
          ),
          {
            userPrompt: hint ?? '',
            mediumRenderMode: medium.characterRenderMode,
            faceSwapEligible: isFaceSwapEligible,
          }
        );
        const finalExpansion = applyChaos(expanded.expansion, chaosProfile);
        const focalAnchor = deriveFocalAnchor(resolvedCast, { userPrompt: hint ?? '' });

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
          vibe: { key: vibe.key, directive: vibe.directive ?? '' },
          scene: {
            userPrompt: hint || undefined,
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
        finalPrompt = `${medium.fluxFragment}, ${hint ?? 'a creative scene'}, ${vibe.directive?.split('.')[0] ?? 'dramatic atmosphere'}, portrait 9:16, hyper detailed`;
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
        const photoDescription = await describeWithVision(
          input_image!,
          VISION_PROMPTS.photoSubject,
          REPLICATE_TOKEN,
          100
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
      const selfInsertResult = userSubject
        ? detectSelfInsert(userSubject, {
            relationshipWords: castCfg.relationshipWords,
            petWords: castCfg.petWords,
            selfRefRegex: castCfg.selfRefRegex,
          })
        : { isSelfInsert: false, cleanedPrompt: '', referencedRoles: new Set<string>() };

      const dreamCast: DreamCastMember[] = vibeProfile?.dream_cast ?? [];
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
          vibe: { key: vibe.key, directive: vibe.directive ?? '' },
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
        });

        try {
          const sonnet = await callSonnet(compiled.sonnetBrief, ANTHROPIC_KEY, compiled.maxTokens);
          sonnetBrief = sonnet.brief;
          sonnetRawResponse = sonnet.rawResponse;
          if (sonnet.text.length < 10) throw new Error('too short');
          finalPrompt = postProcessPrompt(sonnet.text, compiled.postProcess);

          if (compiled.faceSwapSource) {
            faceSwapSource = compiled.faceSwapSource;
          }
          if (compiled.faceSwapSources) {
            faceSwapSources = compiled.faceSwapSources;
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

        // Read the user's Pro Mode Flux model preference (default flux-1.1-pro
        // if column unset / row missing — preserves backward compatibility
        // before migration 149 lands).
        const { data: userRow } = await supabase
          .from('users')
          .select('pro_mode_flux_model')
          .eq('id', userId)
          .single();
        const proModeModel =
          (userRow as { pro_mode_flux_model?: string } | null)?.pro_mode_flux_model ||
          'black-forest-labs/flux-1.1-pro';
        force_model = proModeModel;
        console.log(`[generate-dream] DIRECT PASS-THROUGH model preference: ${proModeModel}`);
        logAxes = {
          medium: medium.key,
          vibe: vibe.key,
          engine: 'direct-pass-thru',
          chaosIntensity: 0,
          chaosInjections: 0,
        };
        fallbackReasons.push('direct_pass_thru:no_sonnet');
        console.log(
          `[generate-dream] DIRECT PASS-THROUGH (${proModeModel}): ${finalPrompt.slice(0, 150)}`
        );
        lap('direct-pass-thru-done');
      } else {
        // ── V2 COMPILER PATHS: style transfer, text directive, surprise ──
        const sanitizedPrompt = userSubject ? sanitizeUserPrompt(userSubject) : '';
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
          vibe: { key: vibe.key, directive: vibe.directive ?? '' },
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

  const effectiveMode = photoOverrideMode ?? mode;
  const effectiveInputImage = photoOverrideMode ? undefined : input_image;

  finalPrompt = sanitizePrompt(finalPrompt);

  const autoPicked = await pickModel(
    effectiveMode,
    finalPrompt,
    resolvedMediumKey,
    resolvedVibeKey
  );
  let pickedModel = force_model || autoPicked.model;

  // ── Dual-face-swap safety clamp: Flux 1.1 Pro Ultra → Flux 1.1 Pro ──
  // Flux 1.1 Pro Ultra renders at 4MP. The dual-swap pipeline has to decode
  // that output, crop it in half, encode each half, swap each half, then
  // stitch — at 4MP that blows the Supabase Edge Function's 150MB
  // per-isolate memory ceiling and returns 546 WORKER_RESOURCE_LIMIT
  // (confirmed 2026-05-30 — 3/3 dual renders on Ultra failed even with
  // DUAL_SWAP_FANOUT enabled). Single face-swap is fine because there's
  // no halving step. Drop Ultra → Pro for dual face-swap only; Ultra is
  // still picked for single + non-face-swap mediums (landscapes etc).
  // faceSwapSources is only populated when the cast-injection branch
  // resolved 2 face-swap-eligible cast members, so this implicitly gates
  // on dual+face-swap-eligible without needing the (out-of-scope) local
  // isFaceSwapEligible flag.
  if (
    faceSwapSources &&
    faceSwapSources.length === 2 &&
    pickedModel === 'black-forest-labs/flux-1.1-pro-ultra'
  ) {
    console.warn(
      `[generate-dream] CLAMP: flux-1.1-pro-ultra → flux-1.1-pro for dual face swap (Ultra's 4MP output exceeds dual-swap memory ceiling)`
    );
    fallbackReasons.push('dual_ultra_clamped_to_pro');
    pickedModel = 'black-forest-labs/flux-1.1-pro';
  }

  logAxes.model = pickedModel;
  console.log(
    `[generate-dream] User ${userId}, mode=${effectiveMode}, model=${pickedModel}${force_model ? ' (force_model override)' : ''}, prompt=${finalPrompt.slice(0, 80)}...`
  );

  // ── Generate image via Replicate ──────────────────────────────────────────
  try {
    console.log(`[generate-dream] ⏱ Starting image generation (model: ${pickedModel})...`);
    // Force JPEG when this dream will go through dual-face-swap (preserves
    // the 2026-05-09 HTTP 546 fix). Otherwise PNG for lossless quality.
    const willDualFaceSwap = !!(faceSwapSources && faceSwapSources.length === 2);
    const genResult = await generateImage(
      effectiveMode,
      finalPrompt,
      effectiveInputImage,
      { replicateToken: REPLICATE_TOKEN, openaiKey: OPENAI_KEY, geminiKey: GEMINI_KEY },
      pickedModel,
      willDualFaceSwap ? 'jpg' : 'png'
    );
    let tempUrl = genResult.url;
    replicatePredictionId = genResult.predictionId;
    if (genResult.nsfwRetries && genResult.nsfwRetries > 0) {
      logAxes.nsfwRetries = genResult.nsfwRetries;
      console.log(
        `[generate-dream] Generation passed after ${genResult.nsfwRetries} NSFW retry/retries`
      );
    }
    lap('image-gen');
    console.log(
      `[generate-dream] ⏱ Image generation complete (prediction: ${genResult.predictionId})`
    );

    // Face swap: dual (two people) or single — retry up to 3x on transient
    // failures (Replicate cold start, 5xx, 429). Backoff between attempts
    // gives a cold model time to boot before we hammer it again.
    if (faceSwapSources && faceSwapSources.length === 2 && tempUrl) {
      // ── Gender-aware source routing (see _shared/dualGenderRouting.ts) ──
      // Flux often flips the two subjects' L/R placement vs the prompt; the swap
      // pastes onto whatever body is in each crop, so on a mixed-gender couple a
      // flip becomes a gender swap. Route male→male body, female→female body.
      let { leftSource, rightSource, routing, collision } = await routeDualSwapByGender(
        {
          sourceUrl: faceSwapSources[0].sourceUrl,
          gender: genderFromLock(faceSwapSources[0].genderLock),
        },
        {
          sourceUrl: faceSwapSources[1].sourceUrl,
          gender: genderFromLock(faceSwapSources[1].genderLock),
        },
        tempUrl,
        REPLICATE_TOKEN
      );
      logAxes.dualGenderRouting = routing;
      console.log(`[generate-dream] Dual gender routing: ${routing}`);

      // ── Gender-collision guard (2026-06-09 incident) ──
      // Mixed-gender cast but the render produced two SAME-gender bodies → any
      // swap pastes a mismatched-gender face (wife's face on a bearded man).
      // The front-loaded gender directive makes this rare; when it still
      // happens, re-render ONCE (a fresh roll usually fixes it) + re-route.
      if (collision) {
        console.warn(
          '[generate-dream] ⚠ Dual gender COLLISION (two same-gender bodies) — re-rendering once'
        );
        fallbackReasons.push('dual_gender_collision_rerender');
        try {
          const cg = await generateImage(
            effectiveMode,
            finalPrompt,
            effectiveInputImage,
            { replicateToken: REPLICATE_TOKEN, openaiKey: OPENAI_KEY, geminiKey: GEMINI_KEY },
            pickedModel,
            'jpg'
          );
          tempUrl = cg.url;
          replicatePredictionId = cg.predictionId;
          ({ leftSource, rightSource, routing, collision } = await routeDualSwapByGender(
            {
              sourceUrl: faceSwapSources[0].sourceUrl,
              gender: genderFromLock(faceSwapSources[0].genderLock),
            },
            {
              sourceUrl: faceSwapSources[1].sourceUrl,
              gender: genderFromLock(faceSwapSources[1].genderLock),
            },
            tempUrl,
            REPLICATE_TOKEN
          ));
          logAxes.dualGenderRoutingRetry = routing;
          console.log(
            `[generate-dream] Post-collision re-route: ${routing} (collision=${collision})`
          );
        } catch (e) {
          console.warn(
            '[generate-dream] collision re-render failed, proceeding:',
            (e as Error).message
          );
        }
      }

      if (collision) {
        // ── Persisted collision → single-swap fallback ──
        // Do NOT paste a mismatched-gender face. Swap ONLY the user's own face;
        // the companion renders as a generic described person. Degraded (the
        // +1 likeness is lost) but never grotesque — far better than the wife's
        // face on a bearded man.
        console.error(
          '[generate-dream] ⚠ Dual gender collision PERSISTED after re-render — single-swap fallback (self only)'
        );
        logAxes.dualGenderRouting = 'collision-fallback-single';
        fallbackReasons.push('dual_gender_collision_single_fallback');
        const selfSource =
          faceSwapSources.find((s) => s.role === 'self')?.sourceUrl ?? faceSwapSources[0].sourceUrl;
        try {
          tempUrl = await faceSwap(selfSource, tempUrl, REPLICATE_TOKEN, supabase, userId);
          logAxes.faceSwapResult = 'single-fallback-success';
        } catch (err) {
          throw new Error(
            `face_swap: single-swap fallback after gender collision failed (${(err as Error).message.slice(0, 160)})`
          );
        }
      } else {
        const FACE_SWAP_MAX_RETRIES = 3;
        const FACE_SWAP_BACKOFF_MS = [2_000, 4_000]; // before attempt 2, attempt 3
        let swapSuccess = false;
        for (let attempt = 1; attempt <= FACE_SWAP_MAX_RETRIES; attempt++) {
          try {
            if (attempt > 1) {
              const delay = FACE_SWAP_BACKOFF_MS[attempt - 2] ?? 4_000;
              console.log(`[generate-dream] Backoff ${delay}ms before retry ${attempt}`);
              await new Promise((r) => setTimeout(r, delay));
            }
            console.log(
              `[generate-dream] Dual face swap attempt ${attempt}/${FACE_SWAP_MAX_RETRIES}...`
            );
            tempUrl = await dispatchDualFaceSwap(
              leftSource,
              rightSource,
              tempUrl,
              REPLICATE_TOKEN,
              supabase,
              userId,
              t0 + 140_000
            );
            lap('dual-face-swap');
            console.log('[generate-dream] Dual face swap complete');
            logAxes.faceSwapResult = 'dual-success';
            logAxes.faceSwapAttempts = attempt;
            swapSuccess = true;
            break;
          } catch (err) {
            console.warn(
              `[generate-dream] Dual face swap attempt ${attempt}/${FACE_SWAP_MAX_RETRIES} failed:`,
              (err as Error).message
            );
            if (attempt === FACE_SWAP_MAX_RETRIES) {
              fallbackReasons.push(`dual_face_swap_failed_${attempt}x:${(err as Error).message}`);
              logAxes.faceSwapResult = 'dual-failed';
              logAxes.faceSwapError = (err as Error).message;
              logAxes.faceSwapAttempts = attempt;
            }
          }
        }
        // Phase 3 / Option A: if all 3 attempts exhausted both primary and the
        // entire fallback chain, this is a hard fail. The user paid for
        // "me + my wife" but face-swap couldn't deliver it. Throw so the outer
        // catch refunds the sparkle. Previously this fell through with
        // unswapped output (random Sonnet faces) and no refund.
        if (!swapSuccess) {
          // ── One final escape: re-render Flux + re-attempt dual swap ──
          // The 3-attempt internal loop tries the SAME flux output every time;
          // 9 (3 × 3 models) "no face found" rejections means the rendered
          // scene has undetectable face geometry — usually faces too small,
          // off-canvas, or occluded. A fresh Flux render with different seed
          // generally fixes this. We cap at one re-render (2x total render
          // cost on the dual path) — beyond that it's structural and the
          // hard-fail + refund is correct. 2026-05-30, Kevin hardening pass.
          console.warn(
            '[generate-dream] Dual swap exhausted — re-rendering Flux once for fresh face geometry'
          );
          fallbackReasons.push('dual_render_retry');
          try {
            const retryGen = await generateImage(
              effectiveMode,
              finalPrompt,
              effectiveInputImage,
              {
                replicateToken: REPLICATE_TOKEN,
                openaiKey: OPENAI_KEY,
                geminiKey: GEMINI_KEY,
              },
              pickedModel,
              'jpg'
            );
            tempUrl = retryGen.url;
            replicatePredictionId = retryGen.predictionId;
            // Re-route by gender — the fresh render may have flipped L/R.
            const routed2 = await routeDualSwapByGender(
              {
                sourceUrl: faceSwapSources[0].sourceUrl,
                gender: genderFromLock(faceSwapSources[0].genderLock),
              },
              {
                sourceUrl: faceSwapSources[1].sourceUrl,
                gender: genderFromLock(faceSwapSources[1].genderLock),
              },
              tempUrl,
              REPLICATE_TOKEN
            );
            tempUrl = await dispatchDualFaceSwap(
              routed2.leftSource,
              routed2.rightSource,
              tempUrl,
              REPLICATE_TOKEN,
              supabase,
              userId,
              t0 + 140_000
            );
            console.log('[generate-dream] Dual face swap recovered after Flux re-render');
            logAxes.faceSwapResult = 'dual-success-rerender';
            swapSuccess = true;
          } catch (rerenderErr) {
            throw new Error(
              `face_swap: dual cast face swap exhausted after ${FACE_SWAP_MAX_RETRIES} attempts + 1 re-render (${(rerenderErr as Error).message.slice(0, 160)})`
            );
          }
        }
      }
    } else if (faceSwapSource && tempUrl) {
      try {
        let sourceUrl: string;
        let swapFileName: string | null = null;
        if (faceSwapSource.startsWith('http')) {
          sourceUrl = faceSwapSource;
          lap('face-swap-upload');
        } else {
          console.log('[generate-dream] ⏱ Starting face swap upload...');
          const base64Data = faceSwapSource.replace(/^data:image\/\w+;base64,/, '');
          const swapBytes = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
          swapFileName = `temp/${userId}/faceswap-${Date.now()}.jpg`;
          await supabase.storage.from('uploads').upload(swapFileName, swapBytes, {
            contentType: 'image/jpeg',
            upsert: true,
            cacheControl: '2592000',
          });
          const { data: swapUrlData } = supabase.storage.from('uploads').getPublicUrl(swapFileName);
          sourceUrl = swapUrlData.publicUrl;
          lap('face-swap-upload');
        }
        console.log('[generate-dream] ⏱ Face swap upload done, starting swap...');

        tempUrl = await faceSwap(sourceUrl, tempUrl, REPLICATE_TOKEN, supabase, userId);

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

    let imageUrl = tempUrl;

    // Persist to Storage + log in parallel (log doesn't need the permanent URL)
    timings.total = Date.now() - t0;
    const [persistedUrl] = await Promise.all([
      persistToStorage(tempUrl, userId, supabase),
      insertGenerationLog(supabase, {
        user_id: userId,
        recipe_snapshot: (vibe_profile as unknown as Record<string, unknown>) ?? {},
        rolled_axes: { ...logAxes, timings },
        enhanced_prompt: finalPrompt,
        model_used: pickedModel,
        cost_cents: getCostCents(pickedModel),
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

    // Scene description: user-supplied wins; otherwise generate via Haiku.
    let description: string | null = userDescription;
    if (!description && ANTHROPIC_KEY) {
      try {
        description = await generateSceneDescription(finalPrompt, ANTHROPIC_KEY);
      } catch (err) {
        console.warn(`[generate-dream] description gen failed: ${(err as Error).message}`);
      }
    }
    if (description) console.log(`[generate-dream] description: "${description}"`);

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
          model: pickedModel,
          mediumKey: resolvedMediumKey,
          vibeKey: resolvedVibeKey,
          aiPrompt: finalPrompt,
          fluxSeed: null,
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
        () => {}
      );

    if (persist) {
      const { url: displayUrl, thumbhash } = await buildDisplayVariant(imageUrl, userId, supabase);
      const [uploadResult] = await Promise.all([
        supabase
          .from('uploads')
          .insert({
            user_id: userId,
            image_url: imageUrl,
            image_url_display: displayUrl,
            thumbhash,
            caption,
            ai_prompt: finalPrompt,
            ai_concept: conceptJson,
            dream_medium: resolvedMediumKey ?? null,
            dream_vibe: resolvedVibeKey ?? null,
            // Which AI model rendered this — drives the model badge on
            // DreamCard (migration 211, 2026-05-30). pickedModel resolves
            // to force_model when provided, else the picker's choice.
            model: pickedModel || null,
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
      .catch(() => {
        /* swallow — style_summary stays NULL, DLT falls back gracefully */
      });

    // NO auto-upscale (2026-05-25). The HD upscale is on-demand only — it runs
    // the first time someone actually downloads this post (request-upscale Edge
    // Function), then caches on uploads.image_url_hq so every later download is
    // instant. Auto-upscaling every render wasted ~$500-780/mo on posts nobody
    // downloads. See UPSCALE_QUEUE_PLAN.md.

    // Job update + notification in parallel (both need uploadId but not each other)
    // Inbox subtext only (the push copy is generated in send-push from
    // subtype='manual'). Clean descriptor — no legacy 'dream:' prefix.
    const notifBody = hint
      ? hint.slice(0, 150)
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
              () => {}
            )
        : Promise.resolve(),
      // Only notify if the user queued/left — a foreground wait gets no ping.
      shouldSendCompletionNotification({ uploadId, jobId, notifyOnComplete })
        ? supabase
            .from('notifications')
            .insert({
              recipient_id: userId,
              actor_id: userId,
              type: 'dream_generated',
              subtype: 'manual',
              upload_id: uploadId,
              body: notifBody,
            })
            .then(
              () => {},
              // No longer swallowed: the inbox row is the guaranteed delivery
              // backstop (push rides on it via migration 196), so a failed
              // insert is a real silent-notification failure worth surfacing.
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

    // Server-side refund — only fires when we have a jobId (reference for
    // idempotency). Refunds without a jobId fall back to the legacy
    // grant_sparkles path for NSFW so existing behavior is preserved.
    let sparkleRefunded = false;
    if (jobId) {
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
    } else if (isNsfw) {
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
        user_id: userId,
        recipe_snapshot: (vibe_profile as unknown as Record<string, unknown>) ?? {},
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
      });
    } catch {
      /* logging is best-effort */
    }

    // Update dream_jobs status (best-effort)
    if (jobId) {
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
        await supabase.from('notifications').insert({
          recipient_id: userId,
          actor_id: userId,
          type: 'dream_failed',
          subtype: 'failed',
          body: sparkleRefunded
            ? `Your dream couldn't render — sparkle refunded (${refundClass})`
            : `Your dream couldn't render (${refundClass})`,
        });
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
  if (edgeRuntime && edgeRuntime.waitUntil) {
    edgeRuntime.waitUntil(task.catch(() => {}));
  }
  // Server-triggered RETRY (refund-stuck-jobs replaying a dead render): the
  // caller must NOT block on the multi-second render, so ack immediately. The
  // waitUntil above keeps the isolate alive to finish the render + fire the
  // completion notification in the background.
  if (req.headers.get('x-dream-retry') === '1') {
    return new Response(JSON.stringify({ ok: true, retrying: true }), {
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

function classifyFailure(errMsg: string): string {
  const m = errMsg.toLowerCase();
  if (m.startsWith('nsfw_content') || m.includes('nsfw') || m.includes('safety')) return 'nsfw';
  if (m.includes('flux') && (m.includes('failed') || m.includes('timed out'))) return 'flux_gen';
  if (m.includes('replicate') && (m.includes('failed') || m.includes('5'))) return 'flux_gen';
  if (m.includes('persiststorage') || m.includes('storage upload')) return 'storage_upload';
  if (m.includes('upload') && m.includes('failed')) return 'storage_upload';
  if (m.includes('uploads insert') || m.includes('db insert')) return 'db_insert';
  if (m.includes('face swap') || m.includes('face_swap')) return 'face_swap';
  if (m.includes('rate limit') || m.includes('rate-limit')) return 'rate_limit';
  if (m.includes('timed out') || m.includes('deadline')) return 'timeout';
  return 'unknown';
}

// ── Helpers ──────────────────────────────────────────────────────────────────

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
