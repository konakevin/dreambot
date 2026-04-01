/**
 * DreamWishBadge — compact button showing wish status.
 * Tap to open the DreamWishSheet.
 */

import { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/theme';
import { MASCOT_URLS } from '@/constants/mascots';
import { useDreamWish } from '@/hooks/useDreamWish';
import { DreamWishSheet } from '@/components/DreamWishSheet';

interface Props {
  /** Visual style */
  variant?: 'pill' | 'card';
}

export function DreamWishBadge({ variant = 'pill' }: Props) {
  const { wish, modifiers, recipientIds } = useDreamWish();
  const [showSheet, setShowSheet] = useState(false);

  return (
    <>
      <TouchableOpacity
        style={variant === 'card' ? s.card : s.pill}
        onPress={() => setShowSheet(true)}
        activeOpacity={0.7}
      >
        <Image
          source={{ uri: MASCOT_URLS[1] }}
          style={variant === 'card' ? s.cardIcon : s.pillIcon}
          cachePolicy="memory-disk"
        />
        <Text
          style={variant === 'card' ? s.cardText : s.pillText}
          numberOfLines={1}
        >
          {wish ?? 'Make a wish'}
        </Text>
        {wish && (
          <Ionicons name="checkmark-circle" size={14} color="#FFFFFF" />
        )}
      </TouchableOpacity>

      <DreamWishSheet
        visible={showSheet}
        onClose={() => setShowSheet(false)}
        currentWish={wish}
        currentModifiers={modifiers}
        currentRecipientIds={recipientIds}
      />
    </>
  );
}

const s = StyleSheet.create({
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: colors.overlayWhite, borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 6,
  },
  pillIcon: { width: 16, height: 16, borderRadius: 8 },
  pillText: {
    color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '600',
    maxWidth: 140,
  },
  card: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: colors.card, borderRadius: 14,
    borderWidth: 1, borderColor: colors.border,
    paddingHorizontal: 16, paddingVertical: 12,
  },
  cardIcon: { width: 20, height: 20, borderRadius: 10 },
  cardText: {
    color: colors.textSecondary, fontSize: 14, fontWeight: '600',
  },
});
