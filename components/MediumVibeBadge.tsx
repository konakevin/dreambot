/**
 * MediumVibeBadge — displays the medium and vibe labels on dream cards.
 * Shared across feed cards, reveal screen, and detail views.
 * Tappable — navigates to Explore with that medium+vibe filtered.
 */

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useDreamMediums, useDreamVibes } from '@/hooks/useDreamStyles';

interface Props {
  mediumKey?: string | null;
  vibeKey?: string | null;
  onPress?: () => void;
}

export function MediumVibeBadge({ mediumKey, vibeKey, onPress }: Props) {
  const { data: mediums = [] } = useDreamMediums();
  const { data: vibes = [] } = useDreamVibes();

  if (!mediumKey && !vibeKey) return null;

  const mediumLabel = mediumKey
    ? (mediums.find((m) => m.key === mediumKey)?.label ?? mediumKey)
    : null;
  const vibeLabel = vibeKey ? (vibes.find((v) => v.key === vibeKey)?.label ?? vibeKey) : null;

  const content = (
    <View style={s.container}>
      {mediumLabel && <Text style={s.medium}>{mediumLabel}</Text>}
      {vibeLabel && <Text style={s.vibe}>{vibeLabel}</Text>}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const s = StyleSheet.create({
  container: {
    gap: 1,
  },
  medium: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16,
  },
  vibe: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16,
  },
});
