/**
 * useDreamAgain — the owner-only "Dream this again" reload.
 *
 * Loads a past dream's saved inputs (original prompt + medium + vibe + model)
 * back into the Create screen, editable, WITHOUT auto-charging — the user tweaks
 * or just hits Dream. Also resolves the medium/vibe display labels for the
 * owner-only "Recipe" line in the action sheet.
 *
 * Shared by DreamCard + PostTile so the one handler + label logic isn't
 * duplicated. Gated to the owner at the call site (the recipe is a private
 * "formula" — never shown on other people's view of a post).
 */
import { useCallback } from 'react';
import * as nav from '@/lib/navigate';
import { supabase } from '@/lib/supabase';
import { Toast } from '@/components/Toast';
import { useDreamStore } from '@/store/dream';
import { useDreamMediums, useDreamVibes } from '@/hooks/useDreamStyles';
import type { DreamPostItem } from '@/components/DreamCard';

/** Fallback key → readable label when the DB label list hasn't loaded / lacks it. */
function prettify(key: string | null | undefined): string {
  if (!key) return '';
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

export interface DreamAgain {
  /** True when this dream has enough saved inputs to reload (medium + vibe). */
  canDreamAgain: boolean;
  /** Resolved medium display label (e.g. "Watercolor"). */
  mediumLabel: string;
  /** Resolved vibe display label (e.g. "Kawaii"). */
  vibeLabel: string;
  /** Load this dream's inputs into Create + navigate there. */
  onDreamAgain: () => void;
  /**
   * Like onDreamAgain, but for a DIFFERENT dream resolved by id — used for an
   * album slide, whose inputs aren't on the host `item`. Lazily fetches the
   * source dream's inputs on tap (no feed-payload cost), then loads Create.
   */
  dreamAgainFromUpload: (uploadId: string) => void;
}

export function useDreamAgain(item: DreamPostItem): DreamAgain {
  const { data: mediums } = useDreamMediums();
  const { data: vibes } = useDreamVibes();
  const setPreset = useDreamStore((s) => s.setPendingCreatePreset);

  const mediumKey = item.dream_medium ?? '';
  const vibeKey = item.dream_vibe ?? '';
  const mediumLabel = mediums?.find((m) => m.key === mediumKey)?.label ?? prettify(mediumKey);
  const vibeLabel = vibes?.find((v) => v.key === vibeKey)?.label ?? prettify(vibeKey);
  const canDreamAgain = !!(mediumKey && vibeKey);

  const onDreamAgain = useCallback(() => {
    if (!canDreamAgain) return;
    const hint =
      item.recipe && typeof item.recipe.hint === 'string' ? (item.recipe.hint as string) : '';
    setPreset({ prompt: hint, medium: mediumKey, vibe: vibeKey, model: item.model ?? null });
    nav.push('/(tabs)/create');
  }, [canDreamAgain, item.recipe, item.model, mediumKey, vibeKey, setPreset]);

  const dreamAgainFromUpload = useCallback(
    async (uploadId: string) => {
      const { data } = await supabase
        .from('uploads')
        .select('dream_medium, dream_vibe, model, recipe')
        .eq('id', uploadId)
        .maybeSingle();
      const medium = (data?.dream_medium as string | null) ?? '';
      const vibe = (data?.dream_vibe as string | null) ?? '';
      if (!medium || !vibe) {
        Toast.show("This dream can't be remade", 'information-circle');
        return;
      }
      const recipe = data?.recipe as { hint?: unknown } | null;
      const hint = recipe && typeof recipe.hint === 'string' ? recipe.hint : '';
      setPreset({ prompt: hint, medium, vibe, model: (data?.model as string | null) ?? null });
      nav.push('/(tabs)/create');
    },
    [setPreset]
  );

  return { canDreamAgain, mediumLabel, vibeLabel, onDreamAgain, dreamAgainFromUpload };
}
