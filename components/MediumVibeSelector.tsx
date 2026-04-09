/**
 * MediumVibeSelector — horizontal pill rows for medium + vibe selection.
 * Alphabetized, fixed-width pills, auto-scrolls selected pill to left edge.
 * Matches the Explore screen pill behavior.
 */

import { useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useDreamMediums, useDreamVibes } from '@/hooks/useDreamStyles';
import { colors } from '@/constants/theme';

const PILL_WIDTH = 105;

// Special keys that always show regardless of user selection
const ALWAYS_SHOW = new Set(['surprise_me']);

interface Props {
  selectedMedium: string;
  selectedVibe: string;
  onMediumChange: (key: string) => void;
  onVibeChange: (key: string) => void;
  compact?: boolean;
  /** If provided, only show mediums the user selected + my_mediums/surprise_me */
  userArtStyles?: string[];
  /** If provided, only show vibes the user selected + my_vibes/surprise_me */
  userAesthetics?: string[];
}

export function MediumVibeSelector({
  selectedMedium,
  selectedVibe,
  onMediumChange,
  onVibeChange,
  compact,
  userArtStyles,
  userAesthetics,
}: Props) {
  const { data: dbMediums = [] } = useDreamMediums();
  const { data: dbVibes = [] } = useDreamVibes();
  const allMediums = [{ key: 'surprise_me', label: 'Surprise Me' }, ...dbMediums];
  const allVibes = [{ key: 'surprise_me', label: 'Surprise Me' }, ...dbVibes];

  // Filter to user's selections if provided, otherwise show all
  const filteredMediums = userArtStyles?.length
    ? allMediums.filter((m) => ALWAYS_SHOW.has(m.key) || userArtStyles.includes(m.key))
    : allMediums;
  const filteredVibes = userAesthetics?.length
    ? allVibes.filter((v) => ALWAYS_SHOW.has(v.key) || userAesthetics.includes(v.key))
    : allVibes;

  const SORTED_MEDIUMS = [...filteredMediums].sort((a, b) => {
    // Keep my_mediums and surprise_me at the front
    if (ALWAYS_SHOW.has(a.key) && !ALWAYS_SHOW.has(b.key)) return -1;
    if (!ALWAYS_SHOW.has(a.key) && ALWAYS_SHOW.has(b.key)) return 1;
    return a.label.localeCompare(b.label);
  });
  const SORTED_VIBES = [...filteredVibes].sort((a, b) => {
    if (ALWAYS_SHOW.has(a.key) && !ALWAYS_SHOW.has(b.key)) return -1;
    if (!ALWAYS_SHOW.has(a.key) && ALWAYS_SHOW.has(b.key)) return 1;
    return a.label.localeCompare(b.label);
  });
  const mediumScrollRef = useRef<ScrollView>(null);
  const vibeScrollRef = useRef<ScrollView>(null);
  const mediumLayouts = useRef<Record<string, number>>({});
  const vibeLayouts = useRef<Record<string, number>>({});

  function scrollTo(
    ref: React.RefObject<ScrollView | null>,
    layouts: Record<string, number>,
    key: string
  ) {
    const x = layouts[key];
    if (x == null || !ref.current) return;
    ref.current.scrollTo({ x: Math.max(0, x - 8), animated: true });
  }

  return (
    <>
      <View style={[s.selectorRow, compact && s.selectorRowCompact]}>
        {!compact && <Text style={s.selectorLabel}>Medium</Text>}
        <ScrollView
          ref={mediumScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
          contentContainerStyle={s.pillRow}
        >
          {SORTED_MEDIUMS.map((m) => (
            <TouchableOpacity
              key={m.key}
              style={[s.pill, selectedMedium === m.key && s.pillActive]}
              onLayout={(e) => {
                mediumLayouts.current[m.key] = e.nativeEvent.layout.x;
              }}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onMediumChange(m.key);
                scrollTo(mediumScrollRef, mediumLayouts.current, m.key);
              }}
              activeOpacity={0.7}
            >
              <Text
                style={[s.pillText, selectedMedium === m.key && s.pillTextActive]}
                numberOfLines={1}
              >
                {m.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View style={[s.selectorRow, compact && s.selectorRowCompact]}>
        {!compact && <Text style={s.selectorLabel}>Vibe</Text>}
        <ScrollView
          ref={vibeScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
          contentContainerStyle={s.pillRow}
        >
          {SORTED_VIBES.map((v) => (
            <TouchableOpacity
              key={v.key}
              style={[s.pill, selectedVibe === v.key && s.pillActive]}
              onLayout={(e) => {
                vibeLayouts.current[v.key] = e.nativeEvent.layout.x;
              }}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onVibeChange(v.key);
                scrollTo(vibeScrollRef, vibeLayouts.current, v.key);
              }}
              activeOpacity={0.7}
            >
              <Text
                style={[s.pillText, selectedVibe === v.key && s.pillTextActive]}
                numberOfLines={1}
              >
                {v.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </>
  );
}

const s = StyleSheet.create({
  selectorRow: { gap: 6 },
  selectorRowCompact: { gap: 0 },
  selectorLabel: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingLeft: 4,
  },
  pillRow: { gap: 6, paddingHorizontal: 4 },
  pill: {
    width: PILL_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pillActive: { backgroundColor: 'transparent', borderColor: colors.accent },
  pillText: { color: colors.textSecondary, fontSize: 13, fontWeight: '600' },
  pillTextActive: { color: colors.accent },
});
