/**
 * VibeProfilePeek
 *
 * Horizontal pill row showing the user's curated aesthetics + mediums —
 * the DreamBot-signature identity signal that distinguishes a DreamBot
 * profile from a generic IG one. Aesthetics first, then mediums; capped
 * at MAX_PILLS visible to keep the profile screen tight (overflow scrolls
 * horizontally).
 *
 * Tap → routes to /settings/edit-profile (the DREAM IDENTITY section).
 * No-op when both lists are empty (renders null, caller checks with the
 * isEmpty helper if it wants to know).
 *
 * Labels are humanised from the raw keys (e.g. 'cottagecore' → 'Cottagecore',
 * 'painted_fantasy_novel' → 'Painted Fantasy Novel'). Full DB-label
 * lookup would require the dream_mediums + dream_vibes hooks; deferred
 * — readable enough as-is for a peek.
 */

import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/theme';

const MAX_PILLS = 8;

interface Props {
  aesthetics: string[];
  art_styles: string[];
  onPress?: () => void;
}

function humanise(key: string): string {
  return key
    .split('_')
    .map((w) => (w.length ? w[0]!.toUpperCase() + w.slice(1) : w))
    .join(' ');
}

export function isVibePeekEmpty({
  aesthetics,
  art_styles,
}: {
  aesthetics: string[];
  art_styles: string[];
}) {
  return aesthetics.length === 0 && art_styles.length === 0;
}

export function VibeProfilePeek({ aesthetics, art_styles, onPress }: Props) {
  if (isVibePeekEmpty({ aesthetics, art_styles })) return null;

  // Aesthetics first (taste vibes), mediums second (style tools). Both
  // already-curated lists, so order within each is the user's selection
  // order; we don't sort.
  const items = [...aesthetics, ...art_styles].slice(0, MAX_PILLS);
  const overflow = aesthetics.length + art_styles.length - items.length;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.root, pressed && { opacity: 0.7 }]}
      hitSlop={4}
    >
      <Ionicons
        name="sparkles-outline"
        size={14}
        color={colors.textSecondary}
        style={styles.icon}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        // Let the parent Pressable own tap; ScrollView only handles drags.
      >
        {items.map((key, i) => (
          <View key={`${key}-${i}`} style={styles.pill}>
            <Text style={styles.pillText}>{humanise(key)}</Text>
          </View>
        ))}
        {overflow > 0 && (
          <View style={[styles.pill, styles.pillOverflow]}>
            <Text style={styles.pillText}>+{overflow}</Text>
          </View>
        )}
      </ScrollView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
  icon: {
    marginTop: 1,
  },
  scrollContent: {
    gap: 6,
    paddingRight: 16, // matches ProfileHeader's outer paddingHorizontal so the last pill doesn't kiss the edge
  },
  pill: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  pillOverflow: {
    backgroundColor: 'transparent',
  },
  pillText: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
});
