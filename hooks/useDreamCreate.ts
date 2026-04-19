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
import { cropToPortrait } from '@/lib/cropPhoto';
import { useAuthStore } from '@/store/auth';
import { useDreamStore } from '@/store/dream';
import { useSparkleBalance, useSpendSparkles } from '@/hooks/useSparkles';
import { showAlert } from '@/components/CustomAlert';
import { Toast } from '@/components/Toast';
import { moderateText } from '@/lib/moderation';
import { isVibeProfile } from '@/lib/migrateRecipe';
import { DEFAULT_RECIPE } from '@/types/recipe';
import type { Recipe } from '@/types/recipe';
import type { VibeProfile } from '@/types/vibeProfile';
import { generateDream, generateFromVibeProfile, restylePhoto } from '@/lib/dreamApi';
import { router } from 'expo-router';

type GenerateStatus = 'idle' | 'generating' | 'done' | 'error';

export function useDreamCreate() {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const { data: sparkleBalance = 0 } = useSparkleBalance();
  const { mutateAsync: spendSparkles } = useSpendSparkles();
  const setResult = useDreamStore((s) => s.setResult);
  const busy = useRef(false);

  const loadProfile = useCallback(async (): Promise<{
    recipe: Recipe | null;
    vibeProfile: VibeProfile | null;
  }> => {
    if (!user) return { recipe: DEFAULT_RECIPE, vibeProfile: null };
    const { data } = await supabase
      .from('user_recipes')
      .select('recipe')
      .eq('user_id', user.id)
      .single();
    const raw = data?.recipe as unknown;
    if (isVibeProfile(raw)) return { recipe: null, vibeProfile: raw };
    return { recipe: (raw as Recipe) ?? DEFAULT_RECIPE, vibeProfile: null };
  }, [user]);

  const trySpendSparkle = useCallback(async (): Promise<boolean> => {
    if (sparkleBalance < 1) {
      showAlert(
        'Not enough sparkles',
        'You need 1 sparkle to dream. Get more sparkles to keep dreaming!',
        [
          { text: 'Get Sparkles', onPress: () => router.push('/sparkleStore') },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
      return false;
    }
    try {
      await spendSparkles({ amount: 1, reason: 'dream' });
      return true;
    } catch {
      showAlert('Not enough sparkles', 'You need 1 sparkle to dream.', [
        { text: 'Get Sparkles', onPress: () => router.push('/sparkleStore') },
        { text: 'Cancel', style: 'cancel' },
      ]);
      return false;
    }
  }, [sparkleBalance, spendSparkles]);

  /**
   * Generate a dream. Returns status so the Loading screen can navigate.
   * Reads config from useDreamStore at call time (not from closure).
   */
  const generate = useCallback(async (): Promise<GenerateStatus> => {
    if (!user || busy.current) return 'error';
    if (!(await trySpendSparkle())) return 'error';
    busy.current = true;

    // Generate a job ID for queue tracking (Hermes doesn't have crypto.randomUUID)
    const jobId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
    useDreamStore.getState().setActiveJobId(jobId);

    const { config } = useDreamStore.getState();

    try {
      const { recipe, vibeProfile } = await loadProfile();

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
        // Photo dream — crop to 9:16 portrait for the API
        const croppedBase64 = await cropToPortrait(config.photoUri);
        const refUrl = `data:image/jpeg;base64,${croppedBase64}`;

        if (config.userPrompt.trim()) {
          const modResult = await moderateText(config.userPrompt.trim());
          if (!modResult.passed) throw new Error(modResult.reason ?? 'Prompt flagged');
        }

        const isReimagine = !!(config.stylePrompt || config.userPrompt.trim());

        if (isReimagine) {
          // Photo reimagine — vision describe + Sonnet rewrite via generate-dream
          result = await generateDream({
            mode: 'flux-kontext',
            vibe_profile: vibeProfile ?? undefined,
            medium_key: config.selectedMedium,
            vibe_key: config.selectedVibe,
            input_image: refUrl,
            hint: config.userPrompt.trim() || undefined,
            photo_style: 'reimagine',
            job_id: jobId,
            style_prompt: config.stylePrompt || undefined,
          });
        } else {
          // Photo restyle — Kontext transform via dedicated restyle-photo endpoint
          result = await restylePhoto({
            inputImageBase64: refUrl,
            mediumKey: config.selectedMedium ?? 'photography',
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

        result = await generateFromVibeProfile(vibeProfile ?? ({} as VibeProfile), {
          mediumKey: config.selectedMedium,
          vibeKey: config.selectedVibe,
          hint: config.userPrompt.trim() || undefined,
          jobId,
          stylePrompt: config.stylePrompt || undefined,
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

      return 'done';
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      if (__DEV__) console.error('[useDreamCreate] ERROR:', msg);

      if (msg.includes('NSFW_CONTENT') && user) {
        // Server-side handles the refund (generate-dream + restyle-photo both
        // call grant_sparkles on NSFW). Client's job: refresh balance so the
        // UI shows the refund, and show a user-friendly toast.
        queryClient.invalidateQueries({ queryKey: ['sparkleBalance', user.id] });
        Toast.show(
          'This dream was flagged by our safety filters. Your sparkle has been refunded.',
          'shield-checkmark'
        );
      } else {
        Toast.show(`Dream error: ${msg}`, 'close-circle');
      }

      return 'error';
    } finally {
      busy.current = false;
    }
  }, [user, trySpendSparkle, loadProfile, setResult]);

  return { generate, sparkleBalance };
}
