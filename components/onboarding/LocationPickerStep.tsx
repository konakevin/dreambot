/**
 * Location picker step — simple 2-column grid of tappable location cards.
 * Users select 3+ locations from the pre-curated library.
 */

import { useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useOnboardingStore } from '@/store/onboarding';
import { colors } from '@/constants/theme';

const MIN_REQUIRED = 3;
const MAX_ONBOARDING = 10;

interface Props {
  onNext: () => void;
  onBack: () => void;
}

const CURATED_LOCATIONS: { key: string; label: string }[] = [
  // Tropical
  { key: 'hawaii', label: 'Hawaii' },
  { key: 'bali', label: 'Bali' },
  { key: 'maldives', label: 'Maldives' },
  { key: 'caribbean island', label: 'Caribbean Island' },
  { key: 'tahiti', label: 'Tahiti' },
  { key: 'costa rica', label: 'Costa Rica' },
  // Cities
  { key: 'tokyo', label: 'Tokyo' },
  { key: 'new york city', label: 'New York City' },
  { key: 'paris', label: 'Paris' },
  { key: 'london', label: 'London' },
  { key: 'venice', label: 'Venice' },
  { key: 'dubai', label: 'Dubai' },
  { key: 'hong kong', label: 'Hong Kong' },
  { key: 'san francisco', label: 'San Francisco' },
  { key: 'los angeles', label: 'Los Angeles' },
  { key: 'miami', label: 'Miami' },
  { key: 'salt lake city', label: 'Salt Lake City' },
  { key: 'moab utah', label: 'Moab Utah' },
  // Nature
  { key: 'swiss alps', label: 'Swiss Alps' },
  { key: 'patagonia', label: 'Patagonia' },
  { key: 'yosemite', label: 'Yosemite' },
  { key: 'iceland', label: 'Iceland' },
  { key: 'new zealand', label: 'New Zealand' },
  { key: 'norwegian fjords', label: 'Norwegian Fjords' },
  { key: 'grand canyon', label: 'Grand Canyon' },
  { key: 'zions national park', label: 'Zions National Park' },
  { key: 'arches national park', label: 'Arches National Park' },
  { key: 'amazon rainforest', label: 'Amazon Rainforest' },
  { key: 'african safari', label: 'African Safari' },
  // Fantasy
  { key: 'enchanted forest', label: 'Enchanted Forest' },
  { key: 'floating sky islands', label: 'Floating Sky Islands' },
  { key: 'crystal caverns', label: 'Crystal Caverns' },
  { key: 'dragons keep', label: "Dragon's Keep" },
  { key: 'fairy tale kingdom', label: 'Fairy Tale Kingdom' },
  { key: 'ancient elven city', label: 'Ancient Elven City' },
  { key: 'hogwarts', label: 'Hogwarts' },
  { key: 'cloud kingdom', label: 'Cloud Kingdom' },
  { key: 'mermaid lagoon', label: 'Mermaid Lagoon' },
  // Cozy
  { key: 'japanese garden', label: 'Japanese Garden' },
  { key: 'tuscan villa', label: 'Tuscan Villa' },
  { key: 'cozy mountain cabin', label: 'Cozy Mountain Cabin' },
  { key: 'parisian cafe', label: 'Parisian Caf\u00e9' },
  { key: 'cherry blossom temple', label: 'Cherry Blossom Temple' },
  { key: 'rose garden palace', label: 'Rose Garden Palace' },
  { key: 'fairy cottage', label: 'Fairy Cottage' },
  // Gothic
  { key: 'haunted castle', label: 'Haunted Castle' },
  { key: 'victorian london', label: 'Victorian London' },
  { key: 'transylvania', label: 'Transylvania' },
  { key: 'gothic cathedral', label: 'Gothic Cathedral' },
  // Sci-Fi
  { key: 'cyberpunk megacity', label: 'Cyberpunk Megacity' },
  { key: 'mars colony', label: 'Mars Colony' },
  { key: 'underwater city', label: 'Underwater City' },
  { key: 'alien planet', label: 'Alien Planet' },
  { key: 'space station', label: 'Space Station' },
  // Theme Parks & Historical
  { key: 'disneyland', label: 'Disneyland' },
  { key: 'pirate ship', label: 'Pirate Ship' },
  { key: 'ancient egypt', label: 'Ancient Egypt' },
  { key: 'roman colosseum', label: 'Roman Colosseum' },
  { key: 'machu picchu', label: 'Machu Picchu' },
  { key: 'angkor wat', label: 'Angkor Wat' },
  { key: 'greek isles', label: 'Greek Isles' },
];

export function LocationPickerStep({ onNext, onBack }: Props) {
  const places = useOnboardingStore((s) => s.profile.dream_seeds.places);
  const toggleLocation = useOnboardingStore((s) => s.toggleLocation);
  const isEditing = useOnboardingStore((s) => s.isEditing);

  const canProceed = places.length >= MIN_REQUIRED;
  const atMax = places.length >= (isEditing ? 25 : MAX_ONBOARDING);

  const handleToggle = useCallback(
    (key: string) => {
      if (!places.includes(key) && atMax) return;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      toggleLocation(key);
    },
    [places, atMax, toggleLocation]
  );

  return (
    <View style={styles.root}>
      <FlatList
        data={CURATED_LOCATIONS}
        numColumns={2}
        keyExtractor={(l) => l.key}
        contentContainerStyle={styles.grid}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Pick your dream locations</Text>
            <Text style={styles.subtitle}>
              Choose 3 or more places you&apos;d love to dream in.
            </Text>
            <Text style={[styles.counter, canProceed && styles.counterMet]}>
              {places.length} selected{!canProceed ? ` (${MIN_REQUIRED} required)` : ''}
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const isSelected = places.includes(item.key);
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
          style={[styles.continueBtn, !canProceed && styles.continueBtnDisabled]}
          onPress={() => {
            if (!canProceed) return;
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onNext();
          }}
          disabled={!canProceed}
          activeOpacity={0.7}
        >
          <Text style={[styles.continueBtnText, !canProceed && styles.continueBtnTextDisabled]}>
            {canProceed ? 'Continue' : `Continue (${places.length}/${MIN_REQUIRED})`}
          </Text>
          <Ionicons
            name="arrow-forward"
            size={18}
            color={canProceed ? '#FFFFFF' : colors.textSecondary}
          />
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
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 60,
    justifyContent: 'center',
  },
  tileSelected: { borderColor: colors.accent, backgroundColor: `${colors.accent}18` },
  checkBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tileLabel: { fontSize: 15, fontWeight: '600', color: '#FFFFFF' },
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
  continueBtnDisabled: { backgroundColor: colors.surface },
  continueBtnText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
  continueBtnTextDisabled: { color: colors.textSecondary },
});
