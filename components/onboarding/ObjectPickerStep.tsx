/**
 * Object picker step — simple 2-column grid of tappable object cards.
 * Objects are optional — they add fun surprises to dreams.
 */

import { useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useOnboardingStore } from '@/store/onboarding';
import { colors } from '@/constants/theme';

const MAX_ONBOARDING = 10;

interface Props {
  onNext: () => void;
  onBack: () => void;
}

const CURATED_OBJECTS: { key: string; label: string; emoji: string }[] = [
  // Adventure
  { key: 'sword', label: 'Sword', emoji: '\u2694\uFE0F' },
  { key: 'bow and arrow', label: 'Bow & Arrow', emoji: '\uD83C\uDFF9' },
  { key: 'lightsaber', label: 'Lightsaber', emoji: '\u26A1' },
  { key: 'trident', label: 'Trident', emoji: '\uD83D\uDD31' },
  { key: 'dagger', label: 'Dagger', emoji: '\uD83D\uDDE1\uFE0F' },
  { key: 'katana', label: 'Katana', emoji: '\u2694\uFE0F' },
  { key: 'treasure chest', label: 'Treasure Chest', emoji: '\uD83D\uDDDD\uFE0F' },
  // Vehicles
  { key: 'motorcycle', label: 'Motorcycle', emoji: '\uD83C\uDFCD\uFE0F' },
  { key: 'classic muscle car', label: 'Muscle Car', emoji: '\uD83D\uDE97' },
  { key: 'sailboat', label: 'Sailboat', emoji: '\u26F5' },
  { key: 'helicopter', label: 'Helicopter', emoji: '\uD83D\uDE81' },
  { key: 'spaceship', label: 'Spaceship', emoji: '\uD83D\uDE80' },
  { key: 'hot air balloon', label: 'Hot Air Balloon', emoji: '\uD83C\uDF88' },
  // Music
  { key: 'guitar', label: 'Guitar', emoji: '\uD83C\uDFB8' },
  { key: 'piano', label: 'Piano', emoji: '\uD83C\uDFB9' },
  { key: 'violin', label: 'Violin', emoji: '\uD83C\uDFBB' },
  { key: 'drums', label: 'Drums', emoji: '\uD83E\uDD41' },
  // Companions
  { key: 'dragon', label: 'Dragon', emoji: '\uD83D\uDC09' },
  { key: 'phoenix', label: 'Phoenix', emoji: '\uD83D\uDD25' },
  { key: 'wolf', label: 'Wolf', emoji: '\uD83D\uDC3A' },
  { key: 'horse', label: 'Horse', emoji: '\uD83D\uDC34' },
  { key: 'owl', label: 'Owl', emoji: '\uD83E\uDD89' },
  { key: 'cat', label: 'Cat', emoji: '\uD83D\uDC31' },
  // Magic
  { key: 'wand', label: 'Wand', emoji: '\uD83E\uDE84' },
  { key: 'crystal orb', label: 'Crystal Orb', emoji: '\uD83D\uDD2E' },
  { key: 'ancient book', label: 'Ancient Book', emoji: '\uD83D\uDCD6' },
  { key: 'hourglass', label: 'Hourglass', emoji: '\u23F3' },
  { key: 'magic mirror', label: 'Magic Mirror', emoji: '\uD83E\uDE9E' },
  // Tech & Tools
  { key: 'robot', label: 'Robot', emoji: '\uD83E\uDD16' },
  { key: 'telescope', label: 'Telescope', emoji: '\uD83D\uDD2D' },
  { key: 'compass', label: 'Compass', emoji: '\uD83E\uDDED' },
  { key: 'lantern', label: 'Lantern', emoji: '\uD83C\uDFEE' },
  // Sports & Outdoor
  { key: 'surfboard', label: 'Surfboard', emoji: '\uD83C\uDFC4' },
  { key: 'skateboard', label: 'Skateboard', emoji: '\uD83D\uDEF9' },
  { key: 'bicycle', label: 'Bicycle', emoji: '\uD83D\uDEB2' },
  { key: 'snowboard', label: 'Snowboard', emoji: '\uD83C\uDFC2' },
  { key: 'campfire', label: 'Campfire', emoji: '\uD83D\uDD25' },
  // Cute & Nature
  { key: 'teddy bear', label: 'Teddy Bear', emoji: '\uD83E\uDDF8' },
  { key: 'kite', label: 'Kite', emoji: '\uD83E\uDE81' },
  { key: 'balloons', label: 'Balloons', emoji: '\uD83C\uDF88' },
  { key: 'giant flower', label: 'Giant Flower', emoji: '\uD83C\uDF3A' },
  { key: 'butterfly swarm', label: 'Butterfly Swarm', emoji: '\uD83E\uDD8B' },
  { key: 'bonsai tree', label: 'Bonsai Tree', emoji: '\uD83C\uDF33' },
  { key: 'crystals', label: 'Crystals', emoji: '\uD83D\uDC8E' },
  { key: 'seashell', label: 'Seashell', emoji: '\uD83D\uDC1A' },
  // Luxury
  { key: 'jewelry box', label: 'Jewelry Box', emoji: '\uD83D\uDC8D' },
  { key: 'rose bouquet', label: 'Rose Bouquet', emoji: '\uD83C\uDF39' },
  { key: 'crystal chandelier', label: 'Chandelier', emoji: '\u2728' },
  { key: 'snow globe', label: 'Snow Globe', emoji: '\uD83D\uDD2E' },
];

export function ObjectPickerStep({ onNext, onBack }: Props) {
  const things = useOnboardingStore((s) => s.profile.dream_seeds.things);
  const toggleObject = useOnboardingStore((s) => s.toggleObject);
  const isEditing = useOnboardingStore((s) => s.isEditing);

  const atMax = things.length >= (isEditing ? 25 : MAX_ONBOARDING);

  const handleToggle = useCallback(
    (key: string) => {
      if (!things.includes(key) && atMax) return;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      toggleObject(key);
    },
    [things, atMax, toggleObject]
  );

  return (
    <View style={styles.root}>
      <FlatList
        data={CURATED_OBJECTS}
        numColumns={2}
        keyExtractor={(o) => o.key}
        contentContainerStyle={styles.grid}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Pick some of your favorite things</Text>
            <Text style={styles.subtitle}>
              These show up as fun surprises in your dreams. Optional.
            </Text>
            <Text style={[styles.counter, things.length > 0 && styles.counterMet]}>
              {things.length} selected
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const isSelected = things.includes(item.key);
          return (
            <TouchableOpacity
              style={[styles.tile, isSelected && styles.tileSelected]}
              onPress={() => handleToggle(item.key)}
              activeOpacity={0.7}
            >
              {isSelected && (
                <View style={styles.checkBadge}>
                  <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                </View>
              )}
              <Text style={styles.tileEmoji}>{item.emoji}</Text>
              <Text style={[styles.tileLabel, isSelected && styles.tileLabelSelected]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      <View style={styles.footer}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={18} color="#FFFFFF" />
          <Text style={styles.backBtnText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.continueBtn}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onNext();
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.continueBtnText}>{things.length > 0 ? 'Continue' : 'Skip'}</Text>
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: 4, paddingTop: 12, paddingBottom: 8 },
  title: { fontSize: 22, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 },
  subtitle: { fontSize: 14, color: colors.textSecondary, marginBottom: 4 },
  counter: { fontSize: 13, color: colors.textSecondary, fontWeight: '600' },
  counterMet: { color: '#4ADE80' },
  grid: { paddingHorizontal: 12, paddingBottom: 100 },
  tile: {
    flex: 1,
    margin: 4,
    padding: 14,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    minHeight: 80,
    justifyContent: 'center',
  },
  tileSelected: { borderColor: colors.accent, backgroundColor: `${colors.accent}18` },
  checkBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tileEmoji: { fontSize: 28, marginBottom: 4 },
  tileLabel: { fontSize: 13, fontWeight: '600', color: '#FFFFFF', textAlign: 'center' },
  tileLabelSelected: { color: colors.accent },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 34,
    backgroundColor: colors.background,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    gap: 12,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 4,
  },
  backBtnText: { fontSize: 15, color: '#FFFFFF', fontWeight: '500' },
  continueBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.accent,
    gap: 6,
  },
  continueBtnText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
});
