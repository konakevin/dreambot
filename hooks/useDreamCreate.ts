/**
 * useDreamCreate — simplified dream generation for the new flow.
 *
 * Called by the Loading screen on mount. Reads config from useDreamStore,
 * generates the dream, and writes the result back to the store.
 *
 * Three paths:
 *   1. Photo dream (flux-kontext) — photoBase64 present
 *   2. Text dream with prompt — userPrompt present
 *   3. Surprise dream — no photo, no prompt
 *
 * All paths go through the V2 engine (medium + vibe).
 */

import { useCallback, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { invokeEdge } from '@/lib/edgeFunction';
import { cropToPortrait } from '@/lib/cropPhoto';
import { useAuthStore } from '@/store/auth';
import { useDreamStore } from '@/store/dream';
import { useSparkleBalance } from '@/hooks/useSparkles';
import { useImageModels } from '@/hooks/useImageModels';
import { sparkleCostFrom } from '@/constants/imageModels';
import { showPremiumGate } from '@/lib/premiumGate';
import { Toast } from '@/components/Toast';
import { moderateText } from '@/lib/moderation';
import { isVibeProfile } from '@/types/vibeProfile';
import type { VibeProfile } from '@/types/vibeProfile';
import { trackDreamCreateStarted, trackDreamCreated, trackDreamFailed } from '@/lib/analytics';
import {
  generateDream,
  generateFromVibeProfile,
  restylePhoto,
  classifyPhoto,
  enqueueDream,
  type PhotoClassification,
  type GenerateDreamOpts,
} from '@/lib/dreamApi';
import { DREAM_QUEUE_ENABLED } from '@/constants/features';
import { markDreamInFlight } from '@/lib/dreamInFlightMarker';
import type { DreamMedium } from '@/hooks/useDreamStyles';

type GenerateStatus =
  | 'idle'
  | 'generating'
  | 'done'
  | 'queued'
  | 'error'
  | 'cancelled'
  | 'insufficient';

/**
 * Called BEFORE sparkle is spent when a photo classifies as 'group' or 'unclear'.
 * Return `true` to proceed with generation, `false` to cancel (no charge).
 * The caller (typically the Loading screen) will show a confirmation modal here.
 */
export type ConfirmClassificationFn = (classification: PhotoClassification) => Promise<boolean>;

export function useDreamCreate() {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const { data: sparkleBalance = 0 } = useSparkleBalance();
  const models = useImageModels();
  const setResult = useDreamStore((s) => s.setResult);
  const busy = useRef(false);

  const loadProfile = useCallback(async (): Promise<VibeProfile | null> => {
    if (!user) return null;
    const { data } = await supabase
      .from('user_recipes')
      .select('recipe')
      .eq('user_id', user.id)
      .single();
    const raw = data?.recipe as unknown;
    return isVibeProfile(raw) ? raw : null;
  }, [user]);

  // Pre-flight balance check only — the actual charge is server-side and
  // idempotent on jobId (generate-dream / restyle-photo via charge_sparkles).
  // The client no longer debits; it just gates the UX so the user sees a
  // paywall before firing a dream they can't afford. Cost comes from the
  // DB-driven catalog (useImageModels), so it always matches the server price.
  const canAffordDream = useCallback(
    (modelId: string | null): boolean => {
      const cost = sparkleCostFrom(models, modelId);
      if (sparkleBalance < cost) {
        showPremiumGate({ kind: 'sparkles', needed: cost, balance: sparkleBalance });
        return false;
      }
      return true;
    },
    [sparkleBalance, models]
  );

  /**
   * Generate a dream. Returns status so the Loading screen can navigate.
   * Reads config from useDreamStore at call time (not from closure).
   *
   * @param onConfirmClassification - optional callback invoked BEFORE sparkle
   *   is spent if a photo classifies as 'group' or 'unclear'. Return `true`
   *   from the callback to proceed, `false` to cancel (no charge).
   */
  const generate = useCallback(
    async (onConfirmClassification?: ConfirmClassificationFn): Promise<GenerateStatus> => {
      if (!user || busy.current) return 'error';

      const { config } = useDreamStore.getState();

      // Resolve surprise_me_face / surprise_me_art to a concrete medium key
      let resolvedMediumKey = config.selectedMedium;
      if (resolvedMediumKey === 'surprise_me_face' || resolvedMediumKey === 'surprise_me_art') {
        const wantFace = resolvedMediumKey === 'surprise_me_face';
        const cachedMediums = queryClient.getQueryData<DreamMedium[]>(['dreamMediums']) ?? [];
        const pool = cachedMediums.filter((m) =>
          wantFace ? m.face_swaps === true : m.face_swaps === false
        );
        if (pool.length > 0) {
          resolvedMediumKey = pool[Math.floor(Math.random() * pool.length)].key;
        } else {
          resolvedMediumKey = 'surprise_me';
        }
        if (__DEV__)
          console.log(`[useDreamCreate] Resolved ${config.selectedMedium} → ${resolvedMediumKey}`);
      }

      // ── Photo path: classify FIRST, before sparkle is spent ──────────────
      // Classification only runs for new_scene (Flux + face-swap) since the
      // Kontext restyle path doesn't branch on subject type.
      let classification: PhotoClassification | null = null;
      let preparedRefUrl: string | null = null;
      if (config.photoBase64 && config.photoUri && config.photoStyle === 'new_scene') {
        try {
          const croppedBase64 = await cropToPortrait(config.photoUri);
          preparedRefUrl = `data:image/jpeg;base64,${croppedBase64}`;
          classification = await classifyPhoto(preparedRefUrl);
          if (__DEV__) console.log('[useDreamCreate] classification:', classification.type);

          // Ask user to confirm on ambiguous subjects BEFORE charging
          if (
            (classification.type === 'group' || classification.type === 'unclear') &&
            onConfirmClassification
          ) {
            const proceed = await onConfirmClassification(classification);
            if (!proceed) {
              if (__DEV__) console.log('[useDreamCreate] Cancelled at classification modal');
              return 'cancelled';
            }
          }
        } catch (err) {
          // Classify failed — proceed without classification. Server will run its own vision.
          if (__DEV__) console.warn('[useDreamCreate] classify-photo failed, proceeding:', err);
          classification = null;
        }
      }

      // Generate the job ID FIRST so the sparkle spend can carry it as
      // reference_id. Refunds are idempotent per (user_id, jobId) so the
      // server-side catch and the refund-stuck-jobs sweeper can both safely
      // attempt a refund without double-crediting.
      const jobId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
      });
      useDreamStore.getState().setActiveJobId(jobId);

      // Backstop pre-check (the create/DLT buttons gate before navigating here).
      // Returns 'insufficient' so the Loading screen routes back instead of
      // sitting on a spinner; canAffordDream already surfaced the premium gate.
      if (!canAffordDream(config.forceModel)) return 'insufficient';
      busy.current = true;
      // Persist a tiny in-flight marker so an app KILL mid-render can be
      // recovered on the next cold start (resumeInFlightDream). Fire-and-forget;
      // cleared on reveal / queue / failure-dismiss / sign-out.
      void markDreamInFlight(jobId);
      trackDreamCreateStarted({ mode: config.mode });

      try {
        const vibeProfile = await loadProfile();

        let result: {
          image_url: string;
          prompt_used: string;
          dream_mode?: string;
          archetype?: string;
          ai_concept?: Record<string, unknown> | null;
          resolved_medium?: string;
          resolved_vibe?: string;
          upload_id?: string;
        };

        if (config.photoBase64 && config.photoUri) {
          // Photo dream — crop to 9:16 portrait for the API (reuse from classify step if available)
          const refUrl =
            preparedRefUrl ?? `data:image/jpeg;base64,${await cropToPortrait(config.photoUri)}`;

          if (config.userPrompt.trim()) {
            const modResult = await moderateText(config.userPrompt.trim());
            if (!modResult.passed) throw new Error(modResult.reason ?? 'Prompt flagged');
          }

          if (config.photoStyle === 'new_scene') {
            // New Scene: Flux + face-swap (for persons) OR description route (group/animal/object/scenery)
            // Pass pre-classification to skip redundant server-side vision.
            const newSceneOpts: GenerateDreamOpts = {
              mode: 'flux-kontext',
              vibe_profile: vibeProfile ?? undefined,
              medium_key: resolvedMediumKey,
              vibe_key: config.selectedVibe,
              input_image: refUrl,
              hint: config.userPrompt.trim() || undefined,
              photo_style: 'new_scene',
              subject_description: classification?.subject_description,
              subject_type:
                classification && classification.type !== 'unclear'
                  ? classification.type
                  : undefined,
              job_id: jobId,
              style_prompt: config.stylePrompt || undefined,
              dlt_recipe: config.dltRecipe ?? undefined,
              force_model: config.forceModel ?? undefined,
            };
            // Queue path: enqueue + let the loading screen wait on the
            // dream_queue realtime channel (jobId == activeJobId == queue row).
            if (DREAM_QUEUE_ENABLED) {
              await enqueueDream(newSceneOpts);
              return 'queued';
            }
            result = await generateDream(newSceneOpts);
          } else {
            // Restyle: Kontext transform via dedicated restyle-photo endpoint (keeps pose/composition).
            // Restyle is intentionally medium+vibe only — no `hint` so the user
            // can't accidentally prompt-engineer a transform; the UI hides the
            // prompt box in this state to make the contract obvious.
            if (DREAM_QUEUE_ENABLED) {
              // photo_style:'restyle' routes the queue dispatcher to restyle-photo.
              await enqueueDream({
                mode: 'flux-kontext',
                photo_style: 'restyle',
                input_image: refUrl,
                medium_key: resolvedMediumKey ?? 'photography',
                vibe_key: config.selectedVibe ?? 'cinematic',
                vibe_profile: vibeProfile ?? undefined,
                job_id: jobId,
              });
              return 'queued';
            }
            result = await restylePhoto({
              inputImageBase64: refUrl,
              mediumKey: resolvedMediumKey ?? 'photography',
              vibeKey: config.selectedVibe ?? 'cinematic',
              vibeProfile: vibeProfile ?? undefined,
              jobId,
            });
          }
        } else {
          // Text dream (prompt or surprise)
          if (config.userPrompt.trim()) {
            const modResult = await moderateText(config.userPrompt.trim());
            if (!modResult.passed) throw new Error(modResult.reason ?? 'Prompt flagged');
          }

          const textOpts: GenerateDreamOpts = {
            mode: 'flux-dev',
            vibe_profile: vibeProfile ?? ({} as VibeProfile),
            medium_key: resolvedMediumKey,
            vibe_key: config.selectedVibe,
            hint: config.userPrompt.trim() || undefined,
            job_id: jobId,
            style_prompt: config.stylePrompt || undefined,
            dlt_recipe: config.dltRecipe ?? undefined,
            use_exact_prompt: config.useExactPrompt,
            force_model: config.forceModel ?? undefined,
          };
          if (DREAM_QUEUE_ENABLED) {
            await enqueueDream(textOpts);
            return 'queued';
          }
          result = await generateFromVibeProfile(vibeProfile ?? ({} as VibeProfile), {
            mediumKey: resolvedMediumKey,
            vibeKey: config.selectedVibe,
            hint: config.userPrompt.trim() || undefined,
            jobId,
            stylePrompt: config.stylePrompt || undefined,
            dltRecipe: config.dltRecipe,
            useExactPrompt: config.useExactPrompt,
            forceModel: config.forceModel ?? undefined,
          });
        }

        // Guard: if the user queued this dream and started a new one, don't clobber
        const currentJobId = useDreamStore.getState().activeJobId;
        if (currentJobId !== jobId) {
          if (__DEV__) console.log('[useDreamCreate] Stale job result, discarding');
          return 'done';
        }

        setResult({
          imageUrl: result.image_url,
          prompt: result.prompt_used,
          aiConcept: result.ai_concept ?? null,
          dreamMode: result.dream_mode ?? null,
          archetype: result.archetype ?? null,
          resolvedMedium: result.resolved_medium ?? null,
          resolvedVibe: result.resolved_vibe ?? null,
          uploadId: result.upload_id ?? null,
        });

        // The charge now happens server-side during generation, so refetch the
        // balance to reflect it (the client no longer debits optimistically).
        if (user) {
          queryClient.invalidateQueries({ queryKey: ['sparkleBalance', user.id] });
        }

        trackDreamCreated({
          mode: config.mode,
          medium: resolvedMediumKey,
          vibe: config.selectedVibe,
          has_photo: !!config.photoBase64,
          has_cast: (vibeProfile?.dream_cast?.length ?? 0) > 0,
        });
        return 'done';
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        if (__DEV__) console.error('[useDreamCreate] ERROR:', msg);
        trackDreamFailed({ mode: config.mode, reason: msg });

        // Server-side charge said insufficient (402) — a balance race after the
        // client pre-check. Nothing was charged. Surface the paywall, refresh
        // balance, and fail cleanly (no refund needed — no debit happened).
        if (msg.includes('insufficient_sparkles')) {
          // Balance race: the client pre-check passed on a stale balance but the
          // server (authoritative) rejected it. Nothing was charged. Surface the
          // premium gate and return 'insufficient' so the Loading screen routes
          // back to Create — NOT a failure card (this isn't a render failure, and
          // claiming a "refund" would be wrong since nothing was debited).
          if (user) queryClient.invalidateQueries({ queryKey: ['sparkleBalance', user.id] });
          showPremiumGate({
            kind: 'sparkles',
            needed: sparkleCostFrom(models, config.forceModel),
            balance: sparkleBalance,
          });
          return 'insufficient';
        }

        // The server signals refund status via either a structured response
        // (FunctionsHttpError exposes the body) or a thrown message including
        // "sparkle_refunded". We default to "refund pending" for transport-level
        // failures because the refund-stuck-jobs sweeper will catch those
        // within 5 minutes.
        const errAny = err as { context?: { body?: string }; sparkle_refunded?: boolean };
        let serverRefunded = errAny?.sparkle_refunded === true;
        let refundReason: string | null = null;
        try {
          if (errAny?.context?.body) {
            const parsed = JSON.parse(errAny.context.body);
            if (parsed?.sparkle_refunded === true) serverRefunded = true;
            refundReason = parsed?.refund_reason ?? null;
          }
        } catch {
          // body wasn't JSON — treat as transport-level failure
        }

        // Pre-flight client failures (text moderation, classify, etc.) — sparkle
        // was already spent on line 156. Hit refund-self-moderation to refund.
        const preFlightFail =
          msg.toLowerCase().includes('flagged') ||
          msg.toLowerCase().includes('moderation') ||
          msg.toLowerCase().includes('inappropriate');
        if (preFlightFail && user) {
          try {
            await invokeEdge('refund-self-moderation', {
              body: { job_id: jobId, reason: 'refund:hard_fail:client_moderation' },
            });
            serverRefunded = true;
          } catch (refundErr) {
            if (__DEV__) console.warn('[useDreamCreate] self-moderation refund failed', refundErr);
          }
        }

        if (user) {
          queryClient.invalidateQueries({ queryKey: ['sparkleBalance', user.id] });
        }

        // Surface the failure to the loading screen via the dream store. The
        // loading screen reads activeJobFailure and renders the failure card.
        useDreamStore.getState().setActiveJobFailure({
          jobId,
          message: msg,
          refunded: serverRefunded,
          refundReason,
          isNsfw: msg.includes('NSFW_CONTENT') || msg.includes('NSFW'),
          isPreFlightModeration: preFlightFail,
        });

        return 'error';
      } finally {
        busy.current = false;
      }
    },
    [user, canAffordDream, loadProfile, setResult, queryClient]
  );

  return { generate, sparkleBalance };
}
