/**
 * useMoodAxes — the onboarding mood sliders, DB-driven (ADMIN_CONFIG_PLAN.md
 * Phase 4). Copy / order / which-axes-show come from the mood_axes table via the
 * get_mood_axes() RPC; the built-in DEFAULT_MOOD_SLIDERS are the offline fallback.
 *
 * The axis KEY is a contract with the engine + the typed MoodAxes store, so the
 * hook keeps only rows whose key is one of the four known axes (a rogue DB key is
 * ignored). Relabel / reorder / deactivate works; adding a brand-new key does not
 * (the engine + store wouldn't know it).
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { MoodAxes } from '@/types/vibeProfile';

export interface MoodSlider {
  axis: keyof MoodAxes;
  title: string;
  description: string;
  left: string;
  right: string;
  leftHint: string;
  rightHint: string;
}

// Canonical fallback — verbatim copy that used to be hardcoded in MoodSlidersStep.
export const DEFAULT_MOOD_SLIDERS: MoodSlider[] = [
  {
    axis: 'peaceful_chaotic',
    title: 'Energy',
    description: 'Soft mornings… or chaos at midnight.',
    left: 'Calm',
    right: 'Wild',
    leftHint: 'Still water, soft light',
    rightHint: 'Thunder, motion, fire',
  },
  {
    axis: 'cute_terrifying',
    title: 'Tone',
    description: 'Warm light or creeping shadows.',
    left: 'Cozy',
    right: 'Eerie',
    leftHint: 'Warm, friendly, safe',
    rightHint: 'Moody, haunting, uneasy',
  },
  {
    axis: 'minimal_maximal',
    title: 'Detail',
    description: 'Minimal… or packed edge to edge.',
    left: 'Spare',
    right: 'Lush',
    leftHint: 'One subject, one mood',
    rightHint: 'Every inch packed',
  },
  {
    axis: 'realistic_surreal',
    title: 'Reality',
    description: 'Almost real… or dream-logic weird.',
    left: 'Grounded',
    right: 'Surreal',
    leftHint: 'Could be a photo',
    rightHint: 'Impossible physics',
  },
];

const KNOWN_AXES = new Set<keyof MoodAxes>([
  'peaceful_chaotic',
  'cute_terrifying',
  'minimal_maximal',
  'realistic_surreal',
]);

function isKnownAxis(key: unknown): key is keyof MoodAxes {
  return typeof key === 'string' && KNOWN_AXES.has(key as keyof MoodAxes);
}

export function useMoodAxes(): MoodSlider[] {
  const { data } = useQuery({
    queryKey: ['moodAxes'],
    queryFn: async (): Promise<MoodSlider[]> => {
      const { data, error } = await supabase.rpc('get_mood_axes');
      if (error || !Array.isArray(data) || data.length === 0) return DEFAULT_MOOD_SLIDERS;
      const mapped: MoodSlider[] = data
        .filter((r) => isKnownAxis(r.key))
        .map((r) => ({
          axis: r.key as keyof MoodAxes,
          title: r.title,
          description: r.description ?? '',
          left: r.left_label,
          right: r.right_label,
          leftHint: r.left_hint ?? '',
          rightHint: r.right_hint ?? '',
        }));
      return mapped.length > 0 ? mapped : DEFAULT_MOOD_SLIDERS;
    },
    staleTime: 5 * 60_000,
  });
  return data ?? DEFAULT_MOOD_SLIDERS;
}
