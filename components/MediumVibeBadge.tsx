/**
 * MediumVibeBadge — displays the medium and vibe labels on dream cards.
 * Shared across feed cards, reveal screen, and detail views.
 */

import { View, Text, StyleSheet } from 'react-native';
import { DREAM_MEDIUMS, DREAM_VIBES } from '@/constants/dreamEngine';

interface Props {
  mediumKey?: string | null;
  vibeKey?: string | null;
}

export function MediumVibeBadge({ mediumKey, vibeKey }: Props) {
  if (!mediumKey && !vibeKey) return null;

  const mediumLabel = mediumKey
    ? (DREAM_MEDIUMS.find((m) => m.key === mediumKey)?.label ?? mediumKey)
    : null;
  const vibeLabel = vibeKey ? (DREAM_VIBES.find((v) => v.key === vibeKey)?.label ?? vibeKey) : null;

  return (
    <View style={s.container}>
      {mediumLabel && <Text style={s.medium}>{mediumLabel}</Text>}
      {vibeLabel && <Text style={s.vibe}>{vibeLabel}</Text>}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    gap: 2,
  },
  medium: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  vibe: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
});
