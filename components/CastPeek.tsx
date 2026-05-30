/**
 * CastPeek
 *
 * Small avatar row showing the user's Dream Cast — self / +1 / pet
 * thumbnails captured during onboarding (or later via Edit Profile →
 * Dream Cast). DreamBot-signature identity element; rendered on the
 * OWN profile only because dream_cast holds real face photos of real
 * people (privacy).
 *
 * Tap → routes to the Dream Cast settings screen.
 *
 * Renders null when the cast is empty so the caller can compose
 * unconditionally without a wrapping conditional.
 */

import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/theme';
import type { DreamCastMember } from '@/types/vibeProfile';

const AVATAR_SIZE = 28;
const STACK_OFFSET = 8; // px each subsequent avatar overlaps the previous

interface Props {
  cast: DreamCastMember[];
  onPress?: () => void;
}

const ROLE_LABEL: Record<DreamCastMember['role'], string> = {
  self: 'Me',
  plus_one: 'Partner',
  pet: 'Pet',
};

function summarise(cast: DreamCastMember[]): string {
  if (cast.length === 0) return '';
  // Build a concise summary like "Me + Partner + Pet" using each role's
  // friendly label. For plus_one, prefer the explicit relationship value
  // when present (some users picked "Friend" or "Family").
  const labels = cast.map((m) => {
    if (m.role === 'plus_one' && m.relationship) {
      // Capitalise first letter only — relationship is already lowercase
      return m.relationship[0]!.toUpperCase() + m.relationship.slice(1);
    }
    return ROLE_LABEL[m.role];
  });
  return labels.join(' + ');
}

export function CastPeek({ cast, onPress }: Props) {
  if (cast.length === 0) return null;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.root, pressed && { opacity: 0.7 }]}
      hitSlop={6}
    >
      <View style={styles.stack}>
        {cast.slice(0, 3).map((m, i) => (
          <Image
            key={m.role}
            source={{ uri: m.thumb_url }}
            style={[
              styles.avatar,
              {
                marginLeft: i === 0 ? 0 : -STACK_OFFSET,
                zIndex: cast.length - i,
              },
            ]}
            contentFit="cover"
          />
        ))}
      </View>
      <Ionicons name="people-outline" size={14} color={colors.textSecondary} />
      <Text style={styles.label} numberOfLines={1}>
        {summarise(cast)}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  stack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.background,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    flexShrink: 1,
  },
});
