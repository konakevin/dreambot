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

  return { canDreamAgain, mediumLabel, vibeLabel, onDreamAgain };
}
