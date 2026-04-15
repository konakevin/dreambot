/**
 * Object picker step — 2-column tile grid with packs, category filters, and sticky chips.
 * Users select 3-10 objects from the pre-curated object_cards library.
 */

import { useState, useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useOnboardingStore } from '@/store/onboarding';
import { ChipsRow } from '@/components/onboarding/ChipsRow';
import { PackRow, Pack } from '@/components/onboarding/PackRow';
import { colors } from '@/constants/theme';

const MIN_REQUIRED = 3;
const MAX_ONBOARDING = 10;

interface Props {
  onNext: () => void;
  onBack: () => void;
}

const CATEGORIES = [
  { key: 'popular', label: 'Popular' },
  { key: 'adventure', label: 'Adventure' },
  { key: 'vehicles', label: 'Vehicles' },
  { key: 'music', label: 'Music' },
  { key: 'companions', label: 'Companions' },
  { key: 'magic', label: 'Magic' },
  { key: 'more', label: 'More' },
];

const CURATED_OBJECTS: { key: string; label: string; category: string; emoji: string }[] = [
  // Adventure
  { key: 'sword', label: 'Sword', category: 'adventure', emoji: '⚔️' },
  { key: 'bow and arrow', label: 'Bow & Arrow', category: 'adventure', emoji: '🏹' },
  { key: 'lightsaber', label: 'Lightsaber', category: 'adventure', emoji: '⚡' },
  { key: 'trident', label: 'Trident', category: 'adventure', emoji: '🔱' },
  { key: 'wand', label: 'Wand', category: 'magic', emoji: '🪄' },
  { key: 'dagger', label: 'Dagger', category: 'adventure', emoji: '🗡️' },
  { key: 'katana', label: 'Katana', category: 'adventure', emoji: '⚔️' },
  // Vehicles
  { key: 'motorcycle', label: 'Motorcycle', category: 'vehicles', emoji: '🏍️' },
  { key: 'classic muscle car', label: 'Muscle Car', category: 'vehicles', emoji: '🚗' },
  { key: 'sailboat', label: 'Sailboat', category: 'vehicles', emoji: '⛵' },
  { key: 'helicopter', label: 'Helicopter', category: 'vehicles', emoji: '🚁' },
  { key: 'spaceship', label: 'Spaceship', category: 'vehicles', emoji: '🚀' },
  { key: 'hot air balloon', label: 'Hot Air Balloon', category: 'vehicles', emoji: '🎈' },
  // Music
  { key: 'guitar', label: 'Guitar', category: 'music', emoji: '🎸' },
  { key: 'piano', label: 'Piano', category: 'music', emoji: '🎹' },
  { key: 'violin', label: 'Violin', category: 'music', emoji: '🎻' },
  { key: 'drums', label: 'Drums', category: 'music', emoji: '🥁' },
  // Companions
  { key: 'dragon', label: 'Dragon', category: 'companions', emoji: '🐉' },
  { key: 'phoenix', label: 'Phoenix', category: 'companions', emoji: '🔥' },
  { key: 'wolf', label: 'Wolf', category: 'companions', emoji: '🐺' },
  { key: 'horse', label: 'Horse', category: 'companions', emoji: '🐴' },
  { key: 'owl', label: 'Owl', category: 'companions', emoji: '🦉' },
  { key: 'cat', label: 'Cat', category: 'companions', emoji: '🐱' },
  // Tech
  { key: 'robot', label: 'Robot', category: 'tech', emoji: '🤖' },
  { key: 'drone', label: 'Drone', category: 'tech', emoji: '📡' },
  { key: 'telescope', label: 'Telescope', category: 'tech', emoji: '🔭' },
  { key: 'compass', label: 'Compass', category: 'tech', emoji: '🧭' },
  { key: 'lantern', label: 'Lantern', category: 'tech', emoji: '🏮' },
  // Sports
  { key: 'surfboard', label: 'Surfboard', category: 'sports', emoji: '🏄' },
  { key: 'skateboard', label: 'Skateboard', category: 'sports', emoji: '🛹' },
  { key: 'campfire', label: 'Campfire', category: 'sports', emoji: '🔥' },
  { key: 'bicycle', label: 'Bicycle', category: 'sports', emoji: '🚲' },
  { key: 'snowboard', label: 'Snowboard', category: 'sports', emoji: '🏂' },
  // Toys
  { key: 'teddy bear', label: 'Teddy Bear', category: 'toys', emoji: '🧸' },
  { key: 'kite', label: 'Kite', category: 'toys', emoji: '🪁' },
  { key: 'music box', label: 'Music Box', category: 'music', emoji: '🎵' },
  { key: 'snow globe', label: 'Snow Globe', category: 'toys', emoji: '🔮' },
  { key: 'balloons', label: 'Balloons', category: 'toys', emoji: '🎈' },
  // Magic / Artifacts
  { key: 'crystal orb', label: 'Crystal Orb', category: 'magic', emoji: '🔮' },
  { key: 'ancient book', label: 'Ancient Book', category: 'magic', emoji: '📖' },
  { key: 'treasure chest', label: 'Treasure Chest', category: 'adventure', emoji: '🗝️' },
  { key: 'hourglass', label: 'Hourglass', category: 'magic', emoji: '⏳' },
  { key: 'magic mirror', label: 'Magic Mirror', category: 'magic', emoji: '🪞' },
  // Nature
  { key: 'giant flower', label: 'Giant Flower', category: 'nature', emoji: '🌺' },
  { key: 'butterfly swarm', label: 'Butterfly Swarm', category: 'nature', emoji: '🦋' },
  { key: 'bonsai tree', label: 'Bonsai Tree', category: 'nature', emoji: '🌳' },
  { key: 'crystals', label: 'Crystals', category: 'nature', emoji: '💎' },
  { key: 'seashell', label: 'Seashell', category: 'nature', emoji: '🐚' },
  // Luxury / Glam
  { key: 'jewelry box', label: 'Jewelry Box', category: 'luxury', emoji: '💍' },
  { key: 'crystal chandelier', label: 'Chandelier', category: 'luxury', emoji: '✨' },
  { key: 'ornate hand mirror', label: 'Hand Mirror', category: 'luxury', emoji: '🪞' },
  { key: 'rose bouquet', label: 'Rose Bouquet', category: 'luxury', emoji: '🌹' },
  { key: 'perfume bottle', label: 'Perfume Bottle', category: 'luxury', emoji: '🧴' },
  { key: 'jeweled hand fan', label: 'Hand Fan', category: 'luxury', emoji: '🪭' },
  { key: 'parasol', label: 'Parasol', category: 'luxury', emoji: '☂️' },
  { key: 'vanity table', label: 'Vanity Table', category: 'luxury', emoji: '💄' },
  { key: 'music locket', label: 'Music Locket', category: 'luxury', emoji: '🎵' },
  { key: 'glass terrarium', label: 'Terrarium', category: 'luxury', emoji: '🌿' },
];

const POPULAR_KEYS = [
  'sword',
  'guitar',
  'dragon',
  'motorcycle',
  'crystal orb',
  'surfboard',
  'rose bouquet',
  'teddy bear',
];

const OBJECT_PACKS: Pack[] = [
  {
    name: 'Adventure Kit',
    items: ['sword', 'compass', 'lantern', 'treasure chest', 'ancient book', 'bow and arrow'],
  },
  {
    name: 'Speed Pack',
    items: [
      'motorcycle',
      'classic muscle car',
      'helicopter',
      'skateboard',
      'surfboard',
      'snowboard',
    ],
  },
  {
    name: 'Mythical Relics',
    items: ['crystal orb', 'magic mirror', 'wand', 'hourglass', 'dragon', 'phoenix'],
  },
  {
    name: 'Music Studio',
    items: ['guitar', 'piano', 'violin', 'drums', 'music box', 'music locket'],
  },
  {
    name: 'Crystal & Gold',
    items: [
      'jewelry box',
      'ornate hand mirror',
      'rose bouquet',
      'perfume bottle',
      'crystal chandelier',
      'parasol',
    ],
  },
  {
    name: 'Cute & Pretty',
    items: ['teddy bear', 'butterfly swarm', 'rose bouquet', 'balloons', 'glass terrarium', 'kite'],
  },
];

function formatLabel(key: string): string {
  const obj = CURATED_OBJECTS.find((o) => o.key === key);
  return obj ? obj.label : key;
}

export function ObjectPickerStep({ onNext, onBack }: Props) {
  const things = useOnboardingStore((s) => s.profile.dream_seeds.things);
  const toggleObject = useOnboardingStore((s) => s.toggleObject);
  const addObjectPack = useOnboardingStore((s) => s.addObjectPack);
  const isEditing = useOnboardingStore((s) => s.isEditing);
  const [activeCategory, setActiveCategory] = useState('popular');

  const canProceed = things.length >= MIN_REQUIRED;
  const atMax = things.length >= (isEditing ? 25 : MAX_ONBOARDING);

  const filteredObjects = useMemo(() => {
    if (activeCategory === 'popular') {
      return CURATED_OBJECTS.filter((o) => POPULAR_KEYS.includes(o.key));
    }
    if (activeCategory === 'more') {
      return CURATED_OBJECTS.filter(
        (o) => !['adventure', 'vehicles', 'music', 'companions', 'magic'].includes(o.category)
      );
    }
    return CURATED_OBJECTS.filter((o) => o.category === activeCategory);
  }, [activeCategory]);

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
      <View style={styles.header}>
        <Text style={styles.title}>Pick objects you&apos;d love to see in your dreams</Text>
        <Text style={styles.subtitle}>
          {isEditing
            ? `Tap to remove. Add as many as you want.`
            : `Pick 3–7 favorites. They'll show up as fun surprises.`}
        </Text>
        <Text style={[styles.counter, canProceed && styles.counterMet]}>
          {things.length} / {MIN_REQUIRED} selected
        </Text>
      </View>

      <ChipsRow
        items={things}
        onRemove={toggleObject}
        formatLabel={formatLabel}
        placeholder="+ Add an object"
      />

      <PackRow
        packs={OBJECT_PACKS}
        selected={things}
        onAddPack={addObjectPack}
        title="Starter Packs"
      />

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

      {/* Object grid */}
      <FlatList
        data={filteredObjects}
        numColumns={2}
        keyExtractor={(o) => o.key}
        contentContainerStyle={styles.grid}
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
              <Text style={styles.tileCategory}>{item.category}</Text>
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
            {canProceed ? 'Continue' : `Continue (${things.length}/${MIN_REQUIRED})`}
          </Text>
          <Ionicons
            name="arrow-forward"
            size={18}
            color={canProceed ? '#FFFFFF' : colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.hint}>
        Objects won&apos;t dominate every dream — they appear as fun surprises.
      </Text>
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
  grid: { paddingHorizontal: 12, paddingBottom: 140 },
  tile: {
    flex: 1,
    margin: 4,
    padding: 14,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    minHeight: 90,
    justifyContent: 'center',
  },
  tileSelected: {
    borderColor: colors.accent,
    backgroundColor: `${colors.accent}18`,
  },
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
  tileCategory: { fontSize: 10, color: colors.textSecondary, marginTop: 2 },
  footer: {
    position: 'absolute',
    bottom: 24,
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
  hint: {
    position: 'absolute',
    bottom: 4,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
});
