/**
 * Location picker step — swipeable cards with packs, category filters, and sticky chips.
 * Users select 3-10 locations from the pre-curated location_cards library.
 */

import { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useOnboardingStore } from '@/store/onboarding';
import { ChipsRow } from '@/components/onboarding/ChipsRow';
import { PackRow, Pack } from '@/components/onboarding/PackRow';
import { colors } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MIN_REQUIRED = 3;
const MAX_ONBOARDING = 10;

interface Props {
  onNext: () => void;
  onBack: () => void;
}

// Category definitions for locations
const CATEGORIES = [
  { key: 'popular', label: 'Popular' },
  { key: 'tropical', label: 'Tropical' },
  { key: 'cities', label: 'Cities' },
  { key: 'nature', label: 'Nature' },
  { key: 'fantasy', label: 'Fantasy' },
  { key: 'cozy', label: 'Cozy' },
  { key: 'more', label: 'More' },
];

// All curated locations with category + tags
const CURATED_LOCATIONS: { key: string; label: string; category: string; tags: string[] }[] = [
  // Tropical
  { key: 'hawaii', label: 'Hawaii', category: 'tropical', tags: ['tropical', 'coastal', 'nature'] },
  { key: 'bali', label: 'Bali', category: 'tropical', tags: ['tropical', 'nature'] },
  { key: 'maldives', label: 'Maldives', category: 'tropical', tags: ['tropical', 'coastal'] },
  {
    key: 'caribbean island',
    label: 'Caribbean Island',
    category: 'tropical',
    tags: ['tropical', 'coastal'],
  },
  { key: 'tahiti', label: 'Tahiti', category: 'tropical', tags: ['tropical', 'coastal'] },
  { key: 'costa rica', label: 'Costa Rica', category: 'tropical', tags: ['tropical', 'nature'] },
  // Cities
  { key: 'tokyo', label: 'Tokyo', category: 'cities', tags: ['urban', 'cyberpunk'] },
  { key: 'new york city', label: 'New York City', category: 'cities', tags: ['urban'] },
  { key: 'paris', label: 'Paris', category: 'cities', tags: ['urban', 'cozy'] },
  { key: 'london', label: 'London', category: 'cities', tags: ['urban', 'gothic'] },
  { key: 'venice', label: 'Venice', category: 'cities', tags: ['urban', 'coastal'] },
  { key: 'dubai', label: 'Dubai', category: 'cities', tags: ['urban', 'epic'] },
  { key: 'hong kong', label: 'Hong Kong', category: 'cities', tags: ['urban', 'cyberpunk'] },
  { key: 'san francisco', label: 'San Francisco', category: 'cities', tags: ['urban', 'coastal'] },
  { key: 'los angeles', label: 'Los Angeles', category: 'cities', tags: ['urban', 'coastal'] },
  { key: 'miami', label: 'Miami', category: 'cities', tags: ['urban', 'tropical'] },
  {
    key: 'salt lake city',
    label: 'Salt Lake City',
    category: 'cities',
    tags: ['urban', 'mountain'],
  },
  { key: 'moab utah', label: 'Moab Utah', category: 'cities', tags: ['desert', 'nature'] },
  // Nature
  { key: 'swiss alps', label: 'Swiss Alps', category: 'nature', tags: ['mountain', 'snow'] },
  { key: 'patagonia', label: 'Patagonia', category: 'nature', tags: ['mountain', 'nature'] },
  { key: 'yosemite', label: 'Yosemite', category: 'nature', tags: ['nature', 'mountain'] },
  { key: 'iceland', label: 'Iceland', category: 'nature', tags: ['snow', 'nature'] },
  { key: 'new zealand', label: 'New Zealand', category: 'nature', tags: ['nature', 'mountain'] },
  {
    key: 'norwegian fjords',
    label: 'Norwegian Fjords',
    category: 'nature',
    tags: ['coastal', 'mountain'],
  },
  { key: 'grand canyon', label: 'Grand Canyon', category: 'nature', tags: ['desert', 'epic'] },
  {
    key: 'zions national park',
    label: 'Zions National Park',
    category: 'nature',
    tags: ['nature', 'mountain'],
  },
  {
    key: 'arches national park',
    label: 'Arches National Park',
    category: 'nature',
    tags: ['desert', 'nature'],
  },
  {
    key: 'amazon rainforest',
    label: 'Amazon Rainforest',
    category: 'nature',
    tags: ['jungle', 'nature'],
  },
  { key: 'african safari', label: 'African Safari', category: 'nature', tags: ['nature', 'epic'] },
  // Fantasy
  {
    key: 'enchanted forest',
    label: 'Enchanted Forest',
    category: 'fantasy',
    tags: ['fantasy', 'nature'],
  },
  {
    key: 'floating sky islands',
    label: 'Floating Sky Islands',
    category: 'fantasy',
    tags: ['fantasy', 'sky'],
  },
  {
    key: 'crystal caverns',
    label: 'Crystal Caverns',
    category: 'fantasy',
    tags: ['fantasy', 'underground'],
  },
  { key: 'dragons keep', label: "Dragon's Keep", category: 'fantasy', tags: ['fantasy', 'epic'] },
  {
    key: 'fairy tale kingdom',
    label: 'Fairy Tale Kingdom',
    category: 'fantasy',
    tags: ['fantasy'],
  },
  {
    key: 'ancient elven city',
    label: 'Ancient Elven City',
    category: 'fantasy',
    tags: ['fantasy'],
  },
  { key: 'hogwarts', label: 'Hogwarts', category: 'fantasy', tags: ['fantasy', 'gothic'] },
  { key: 'cloud kingdom', label: 'Cloud Kingdom', category: 'fantasy', tags: ['fantasy', 'sky'] },
  {
    key: 'mermaid lagoon',
    label: 'Mermaid Lagoon',
    category: 'fantasy',
    tags: ['fantasy', 'underwater'],
  },
  // Cozy
  { key: 'japanese garden', label: 'Japanese Garden', category: 'cozy', tags: ['cozy', 'nature'] },
  { key: 'tuscan villa', label: 'Tuscan Villa', category: 'cozy', tags: ['cozy'] },
  {
    key: 'cozy mountain cabin',
    label: 'Cozy Mountain Cabin',
    category: 'cozy',
    tags: ['cozy', 'mountain'],
  },
  { key: 'parisian cafe', label: 'Parisian Café', category: 'cozy', tags: ['cozy', 'urban'] },
  {
    key: 'cherry blossom temple',
    label: 'Cherry Blossom Temple',
    category: 'cozy',
    tags: ['cozy', 'nature'],
  },
  {
    key: 'rose garden palace',
    label: 'Rose Garden Palace',
    category: 'cozy',
    tags: ['cozy', 'fantasy'],
  },
  { key: 'fairy cottage', label: 'Fairy Cottage', category: 'cozy', tags: ['cozy', 'fantasy'] },
  // Gothic / Dark
  { key: 'haunted castle', label: 'Haunted Castle', category: 'gothic', tags: ['gothic'] },
  {
    key: 'victorian london',
    label: 'Victorian London',
    category: 'gothic',
    tags: ['gothic', 'urban'],
  },
  { key: 'transylvania', label: 'Transylvania', category: 'gothic', tags: ['gothic', 'mountain'] },
  {
    key: 'gothic cathedral',
    label: 'Gothic Cathedral',
    category: 'gothic',
    tags: ['gothic', 'interior'],
  },
  // Sci-Fi
  {
    key: 'cyberpunk megacity',
    label: 'Cyberpunk Megacity',
    category: 'scifi',
    tags: ['space', 'cyberpunk'],
  },
  { key: 'mars colony', label: 'Mars Colony', category: 'scifi', tags: ['space', 'desert'] },
  {
    key: 'underwater city',
    label: 'Underwater City',
    category: 'scifi',
    tags: ['underwater', 'space'],
  },
  { key: 'alien planet', label: 'Alien Planet', category: 'scifi', tags: ['space'] },
  // Theme Parks
  { key: 'disneyland', label: 'Disneyland', category: 'theme_park', tags: ['fantasy'] },
  { key: 'space station', label: 'Space Station', category: 'scifi', tags: ['space', 'interior'] },
  { key: 'pirate ship', label: 'Pirate Ship', category: 'theme_park', tags: ['coastal'] },
  { key: 'sea world', label: 'Sea World', category: 'theme_park', tags: ['coastal', 'nature'] },
  { key: 'aquarium', label: 'Aquarium', category: 'theme_park', tags: ['underwater', 'interior'] },
  // Historical
  {
    key: 'ancient egypt',
    label: 'Ancient Egypt',
    category: 'historical',
    tags: ['desert', 'ancient'],
  },
  { key: 'roman colosseum', label: 'Roman Colosseum', category: 'historical', tags: ['ancient'] },
  {
    key: 'machu picchu',
    label: 'Machu Picchu',
    category: 'historical',
    tags: ['mountain', 'ancient'],
  },
  { key: 'angkor wat', label: 'Angkor Wat', category: 'historical', tags: ['jungle', 'ancient'] },
  {
    key: 'greek isles',
    label: 'Greek Isles',
    category: 'historical',
    tags: ['coastal', 'ancient'],
  },
];

const POPULAR_KEYS = [
  'hawaii',
  'tokyo',
  'paris',
  'enchanted forest',
  'swiss alps',
  'disneyland',
  'cozy mountain cabin',
  'cyberpunk megacity',
];

const LOCATION_PACKS: Pack[] = [
  {
    name: 'Epic Nature',
    items: ['swiss alps', 'iceland', 'patagonia', 'yosemite', 'grand canyon', 'norwegian fjords'],
  },
  {
    name: 'City Nights',
    items: ['tokyo', 'new york city', 'paris', 'hong kong', 'dubai', 'san francisco'],
  },
  {
    name: 'Fantasy Realms',
    items: [
      'enchanted forest',
      'floating sky islands',
      'crystal caverns',
      'dragons keep',
      'fairy tale kingdom',
      'ancient elven city',
    ],
  },
  {
    name: 'Tropical Paradise',
    items: ['hawaii', 'bali', 'maldives', 'caribbean island', 'tahiti', 'costa rica'],
  },
  {
    name: 'Cozy Escapes',
    items: [
      'japanese garden',
      'tuscan villa',
      'cozy mountain cabin',
      'parisian cafe',
      'cherry blossom temple',
      'rose garden palace',
    ],
  },
];

function formatLabel(key: string): string {
  const loc = CURATED_LOCATIONS.find((l) => l.key === key);
  return loc ? loc.label : key;
}

export function LocationPickerStep({ onNext, onBack }: Props) {
  const places = useOnboardingStore((s) => s.profile.dream_seeds.places);
  const toggleLocation = useOnboardingStore((s) => s.toggleLocation);
  const addLocationPack = useOnboardingStore((s) => s.addLocationPack);
  const isEditing = useOnboardingStore((s) => s.isEditing);
  const [activeCategory, setActiveCategory] = useState('popular');

  const canProceed = places.length >= MIN_REQUIRED;
  const atMax = places.length >= (isEditing ? 25 : MAX_ONBOARDING);

  const filteredLocations = useMemo(() => {
    if (activeCategory === 'popular') {
      return CURATED_LOCATIONS.filter((l) => POPULAR_KEYS.includes(l.key));
    }
    if (activeCategory === 'more') {
      return CURATED_LOCATIONS.filter(
        (l) => !['tropical', 'cities', 'nature', 'fantasy', 'cozy'].includes(l.category)
      );
    }
    return CURATED_LOCATIONS.filter((l) => l.category === activeCategory);
  }, [activeCategory]);

  const handleToggle = useCallback(
    (key: string) => {
      if (!places.includes(key) && atMax) return;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      toggleLocation(key);
    },
    [places, atMax, toggleLocation]
  );

  const handleAddPack = useCallback(
    (items: string[]) => {
      addLocationPack(items);
    },
    [addLocationPack]
  );

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.title}>Pick a few places you&apos;d love to dream in</Text>
        <Text style={styles.subtitle}>
          {isEditing
            ? `Tap to remove. Add as many as you want.`
            : `Pick 3–7 favorites. You can add more later.`}
        </Text>
        <Text style={[styles.counter, canProceed && styles.counterMet]}>
          {places.length} / {MIN_REQUIRED} selected
        </Text>
      </View>

      <ChipsRow
        items={places}
        onRemove={toggleLocation}
        formatLabel={formatLabel}
        placeholder="+ Add a location"
      />

      <PackRow packs={LOCATION_PACKS} selected={places} onAddPack={handleAddPack} />

      {/* Category filters */}
      <FlatList
        horizontal
        data={CATEGORIES}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryScroll}
        keyExtractor={(c) => c.key}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.categoryPill, activeCategory === item.key && styles.categoryActive]}
            onPress={() => setActiveCategory(item.key)}
          >
            <Text
              style={[
                styles.categoryText,
                activeCategory === item.key && styles.categoryTextActive,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Location grid */}
      <FlatList
        data={filteredLocations}
        numColumns={2}
        keyExtractor={(l) => l.key}
        contentContainerStyle={styles.grid}
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
              <Text style={styles.tileTags}>{item.tags.slice(0, 2).join(' • ')}</Text>
            </TouchableOpacity>
          );
        }}
      />

      {/* Bottom CTA */}
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
  header: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4 },
  title: { fontSize: 22, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 },
  subtitle: { fontSize: 14, color: colors.textSecondary, marginBottom: 4 },
  counter: { fontSize: 13, color: colors.textSecondary, fontWeight: '600' },
  counterMet: { color: '#4ADE80' },
  categoryScroll: { paddingHorizontal: 16, paddingVertical: 8, gap: 8 },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  categoryActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  categoryText: { fontSize: 13, color: colors.textSecondary, fontWeight: '500' },
  categoryTextActive: { color: '#FFFFFF' },
  grid: { paddingHorizontal: 12, paddingBottom: 100 },
  tile: {
    flex: 1,
    margin: 4,
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 80,
    justifyContent: 'center',
  },
  tileSelected: {
    borderColor: colors.accent,
    backgroundColor: `${colors.accent}18`,
  },
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
  tileLabel: { fontSize: 15, fontWeight: '600', color: '#FFFFFF', marginBottom: 2 },
  tileLabelSelected: { color: colors.accent },
  tileTags: { fontSize: 11, color: colors.textSecondary },
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
