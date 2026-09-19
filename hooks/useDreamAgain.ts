/**
 * useDreamAgain — the owner-only long-press actions that make ANOTHER dream from this one, plus the recipe labels
 * for the action sheet's "Style: … · Vibe: …" line.
 *
 * Two actions, decided by what the dream IS:
 *   • "Dream this again" (Create dreams): reload the saved inputs (prompt + medium + vibe + model) into Create,
 *     editable, WITHOUT auto-charging — the user tweaks or just hits Dream.
 *   • "Redream in a new setting" (NIGHTLY dreams, constants/redream.ts): a nightly look is not a Create medium (the old
 *     reload showed raw keys and the empty prompt shipped a photographic pure scene — 2026-09-18). Instead the
 *     nightly engine re-runs on demand with the same look, vibe and cast in a NEW setting, for the base dream
 *     price: balance check → confirm sheet → enqueue ('redream' queue source) → the Create loading screen watches it.
 *
 * Shared by DreamCard + PostTile so the handlers + label logic aren't duplicated. Gated to the owner at the call
 * site (the recipe is a private "formula" — never shown on other people's view of a post).
 */
import { useCallback, useMemo } from 'react';
import * as nav from '@/lib/navigate';
import { supabase } from '@/lib/supabase';
import { Toast } from '@/components/Toast';
import { showAlert } from '@/components/CustomAlert';
import { showPremiumGate } from '@/lib/premiumGate';
import { enqueueRedream } from '@/lib/dreamApi';
import { useDreamStore } from '@/store/dream';
import { useDreamStyleLabels } from '@/hooks/useDreamStyles';
import { useSparkleBalance } from '@/hooks/useSparkles';
import { useEngineConfig } from '@/hooks/useEngineConfig';
import {
  REDREAM_CANCEL,
  REDREAM_CONFIRM_BODY,
  REDREAM_CONFIRM_TITLE,
  displayStyleLabel,
  redreamConfirmButton,
  redreamSubtitle,
} from '@/constants/redream';
import type { DreamPostItem } from '@/components/DreamCard';

/** Fallback key → readable label when the label list hasn't loaded / lacks it. */
function prettify(key: string | null | undefined): string {
  if (!key) return '';
  return key
    .replace(/^nightly_/, '')
    .replace(/__.*$/, '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

export interface DreamAgain {
  /** True when this is a CREATE dream with enough saved inputs to reload (medium + vibe). */
  canDreamAgain: boolean;
  /** True when this is a NIGHTLY dream (its medium is a catalogue look) → "Redream in a new setting". */
  isNightlyLook: boolean;
  /** Resolved medium display label (e.g. "Watercolor", "Hand-Drawn Illustration"). */
  mediumLabel: string;
  /** Resolved vibe display label (e.g. "Kawaii", "Opulent"). */
  vibeLabel: string;
  /** The "Redream in a new setting" row's subtitle (price included). */
  redreamSubtitle: string;
  /** Load this Create dream's inputs into Create + navigate there. */
  onDreamAgain: () => void;
  /** "Redream in a new setting" for this nightly dream: balance check → confirm → enqueue → loading screen. */
  onRedream: () => void;
  /**
   * Like the two above, but for a DIFFERENT dream resolved by id — used for an album slide, whose inputs aren't
   * on the host `item`. Lazily fetches the source dream's inputs on tap (no feed-payload cost) and routes to the
   * right action for what it is.
   */
  dreamAgainFromUpload: (uploadId: string) => void;
}

export function useDreamAgain(item: DreamPostItem): DreamAgain {
  const { data: labels } = useDreamStyleLabels();
  const balanceQuery = useSparkleBalance();
  const engineConfig = useEngineConfig();
  const setPreset = useDreamStore((s) => s.setPendingCreatePreset);

  const cost = engineConfig.baseSparkleCost;
  const mediumKey = item.dream_medium ?? '';
  const vibeKey = item.dream_vibe ?? '';

  const labelFor = useCallback(
    (key: string): { label: string; kind: 'medium' | 'look' | 'vibe' | null } => {
      const row = labels?.find((l) => l.key === key);
      return row
        ? { label: displayStyleLabel(row.label), kind: row.kind }
        : { label: prettify(key), kind: null };
    },
    [labels]
  );

  const medium = useMemo(() => labelFor(mediumKey), [labelFor, mediumKey]);
  const isNightlyLook = medium.kind === 'look';
  const mediumLabel = medium.label;
  const vibeLabel = useMemo(() => labelFor(vibeKey).label, [labelFor, vibeKey]);
  const canDreamAgain = !!(mediumKey && vibeKey) && !isNightlyLook;

  // ── "Redream in a new setting" ──────────────────────────────────────────────────────────────────────────────────────
  const launchRedream = useCallback(
    async (uploadId: string) => {
      try {
        const { dream_id } = await enqueueRedream(uploadId);
        useDreamStore.getState().setActiveJobId(dream_id);
        void balanceQuery.refetch(); // the sparkle just left
        nav.push(`/dream/loading?watch=${dream_id}`);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        if (/insufficient_sparkles/.test(msg)) {
          showPremiumGate({
            kind: 'sparkles',
            needed: cost,
            balance: balanceQuery.data ?? 0,
            context: 'sequel',
          });
        } else if (/too_many_inflight/.test(msg)) {
          Toast.show('Let a few dreams finish first ✨', 'sparkles');
        } else if (/not_redreamable|not_found/.test(msg)) {
          Toast.show("This dream can't be redreamed", 'information-circle');
        } else {
          if (__DEV__) console.warn('[useDreamAgain] redream failed:', msg);
          Toast.show("Couldn't start that dream, try again in a moment", 'alert-circle');
        }
      }
    },
    [balanceQuery, cost]
  );

  const startRedream = useCallback(
    async (uploadId: string) => {
      // Balance FIRST (Kevin): a user who can't afford it sees the sparkle gate, never a confirm they can't act on.
      let balance = balanceQuery.data;
      if (typeof balance !== 'number') {
        const fresh = await balanceQuery.refetch();
        balance = fresh.data ?? 0;
      }
      if (balance < cost) {
        showPremiumGate({ kind: 'sparkles', needed: cost, balance, context: 'sequel' });
        return;
      }
      showAlert(REDREAM_CONFIRM_TITLE, REDREAM_CONFIRM_BODY, [
        { text: REDREAM_CANCEL, style: 'cancel' },
        { text: redreamConfirmButton(cost), onPress: () => void launchRedream(uploadId) },
      ]);
    },
    [balanceQuery, cost, launchRedream]
  );

  const onRedream = useCallback(() => {
    if (!isNightlyLook) return;
    void startRedream(item.id);
  }, [isNightlyLook, item.id, startRedream]);

  // ── "Dream this again" (Create dreams) ────────────────────────────────────────────────────────────────────
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
      const resolved = labelFor(medium);
      if (resolved.kind === 'look') {
        void startRedream(uploadId);
        return;
      }
      const recipe = data?.recipe as { hint?: unknown } | null;
      const hint = recipe && typeof recipe.hint === 'string' ? recipe.hint : '';
      setPreset({ prompt: hint, medium, vibe, model: (data?.model as string | null) ?? null });
      nav.push('/(tabs)/create');
    },
    [labelFor, setPreset, startRedream]
  );

  return {
    canDreamAgain,
    isNightlyLook,
    mediumLabel,
    vibeLabel,
    redreamSubtitle: redreamSubtitle(cost),
    onDreamAgain,
    onRedream,
    dreamAgainFromUpload,
  };
}
