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
import { supabase } from '@/lib/supabase';
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
import { generateDream, generateFromVibeProfile, generateFromRecipe } from '@/lib/dreamApi';
import { router } from 'expo-router';

type GenerateStatus = 'idle' | 'generating' | 'done' | 'error';

export function useDreamCreate() {
  const user = useAuthStore((s) => s.user);
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

    const { config } = useDreamStore.getState();

    try {
      const { recipe, vibeProfile } = await loadProfile();

      let result: {
        image_url: string;
        prompt_used: string;
        dream_mode?: string;
        archetype?: string;
        ai_concept?: Record<string, unknown> | null;
      };

      if (config.photoBase64) {
        // Photo dream — flux-kontext
        const refUrl = `data:image/jpeg;base64,${config.photoBase64}`;

        if (config.userPrompt.trim()) {
          const modResult = await moderateText(config.userPrompt.trim());
          if (!modResult.passed) throw new Error(modResult.reason ?? 'Prompt flagged');
        }

        result = await generateDream({
          mode: 'flux-kontext',
          vibe_profile: vibeProfile ?? undefined,
          recipe: !vibeProfile ? (recipe ?? DEFAULT_RECIPE) : undefined,
          medium_key: config.selectedMedium,
          vibe_key: config.selectedVibe,
          input_image: refUrl,
          hint: config.photoStyle === 'reimagine' ? (config.userPrompt.trim() || undefined) : undefined,
          photo_style: config.photoStyle,
        });
      } else {
        // Text dream (prompt or surprise)
        if (config.userPrompt.trim()) {
          const modResult = await moderateText(config.userPrompt.trim());
          if (!modResult.passed) throw new Error(modResult.reason ?? 'Prompt flagged');
        }

        if (vibeProfile) {
          result = await generateFromVibeProfile(vibeProfile, {
            mediumKey: config.selectedMedium,
            vibeKey: config.selectedVibe,
            hint: config.userPrompt.trim() || undefined,
          });
        } else {
          result = await generateFromRecipe(recipe ?? DEFAULT_RECIPE);
        }
      }

      setResult({
        imageUrl: result.image_url,
        prompt: result.prompt_used,
        aiConcept: result.ai_concept ?? null,
        dreamMode: result.dream_mode ?? null,
        archetype: result.archetype ?? null,
      });

      return 'done';
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      if (__DEV__) console.error('[useDreamCreate] ERROR:', msg);

      if (msg.includes('NSFW_CONTENT') && user) {
        try {
          await supabase.rpc('grant_sparkles', {
            p_user_id: user.id,
            p_amount: 1,
            p_reason: 'nsfw_refund',
          });
        } catch {
          if (__DEV__) console.warn('[useDreamCreate] Failed to refund sparkle');
        }
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
