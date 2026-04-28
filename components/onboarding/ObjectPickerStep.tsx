/**
 * Object picker step — sectioned magazine layout with compact 2-column tiles.
 * Objects add surprise focal props to dreams.
 */

import { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  LayoutAnimation,
  UIManager,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useOnboardingStore } from '@/store/onboarding';
import { colors } from '@/constants/theme';
import { onboardingStyles as shared } from './sharedStyles';
import { OnboardingFooter } from './OnboardingFooter';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TILE_GAP = 10;
const TILE_PADDING = 20;
const RAIL_WIDTH = 13;
const TILE_WIDTH = Math.floor((SCREEN_WIDTH - TILE_PADDING * 2 - RAIL_WIDTH - TILE_GAP * 2) / 3);
const TILE_HEIGHT = 55;
const TILES_COLLAPSED = 6;
const MIN_REQUIRED = 0;
const MAX_ONBOARDING = 10;

interface ObjectItem {
  key: string;
  label: string;
}

interface ObjectSection {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  description: string;
  items: ObjectItem[];
}

const OBJECT_SECTIONS: ObjectSection[] = [
  {
    id: 'weapons',
    title: 'Weapons & Props',
    icon: 'shield-outline',
    description: 'Iconic weapons and adventure artifacts',
    items: [
      { key: 'sword', label: 'Sword' },
      { key: 'katana', label: 'Katana' },
      { key: 'bow and arrow', label: 'Bow & Arrow' },
      { key: 'dagger', label: 'Dagger' },
      { key: 'war hammer', label: 'War Hammer' },
      { key: 'spear', label: 'Spear' },
      { key: 'lightsaber', label: 'Lightsaber' },
      { key: 'treasure chest', label: 'Treasure Chest' },
      { key: 'compass', label: 'Compass' },
      { key: 'potion bottle', label: 'Potion Bottle' },
      { key: 'crossbow', label: 'Crossbow' },
      { key: 'ancient relic', label: 'Ancient Relic' },
    ],
  },
  {
    id: 'food',
    title: 'Food & Drink',
    icon: 'fast-food-outline',
    description: 'Tasty treats and beverages',
    items: [
      { key: 'burger', label: 'Burger' },
      { key: 'pizza', label: 'Pizza' },
      { key: 'ramen bowl', label: 'Ramen Bowl' },
      { key: 'ice cream', label: 'Ice Cream' },
      { key: 'coffee cup', label: 'Coffee Cup' },
      { key: 'cocktail glass', label: 'Cocktail Glass' },
      { key: 'donut', label: 'Donut' },
      { key: 'sushi', label: 'Sushi' },
      { key: 'fruit bowl', label: 'Fruit Bowl' },
      { key: 'cake', label: 'Cake' },
      { key: 'taco', label: 'Taco' },
      { key: 'croissant', label: 'Croissant' },
    ],
  },
  {
    id: 'creatures',
    title: 'Creatures & Animals',
    icon: 'paw-outline',
    description: 'Mythical beasts and animal companions',
    items: [
      { key: 'dragon', label: 'Dragon' },
      { key: 'phoenix', label: 'Phoenix' },
      { key: 'wolf', label: 'Wolf' },
      { key: 'horse', label: 'Horse' },
      { key: 'cat', label: 'Cat' },
      { key: 'dog', label: 'Dog' },
      { key: 'bunny', label: 'Bunny' },
      { key: 'fox', label: 'Fox' },
      { key: 'owl', label: 'Owl' },
      { key: 'eagle', label: 'Eagle' },
      { key: 'bear', label: 'Bear' },
      { key: 'deer', label: 'Deer' },
    ],
  },
  {
    id: 'nature',
    title: 'Nature & Outdoors',
    icon: 'leaf-outline',
    description: 'Natural wonders and wild landscapes',
    items: [
      { key: 'campfire', label: 'Campfire' },
      { key: 'mountain', label: 'Mountain' },
      { key: 'waterfall', label: 'Waterfall' },
      { key: 'palm tree', label: 'Palm Tree' },
      { key: 'forest', label: 'Forest' },
      { key: 'desert dunes', label: 'Desert Dunes' },
      { key: 'iceberg', label: 'Iceberg' },
      { key: 'volcano', label: 'Volcano' },
      { key: 'river', label: 'River' },
      { key: 'cave entrance', label: 'Cave Entrance' },
      { key: 'beach', label: 'Beach' },
      { key: 'canyon', label: 'Canyon' },
    ],
  },
  {
    id: 'tech',
    title: 'Tech & Sci-Fi',
    icon: 'hardware-chip-outline',
    description: 'Gadgets, devices, and futuristic gear',
    items: [
      { key: 'robot', label: 'Robot' },
      { key: 'drone', label: 'Drone' },
      { key: 'hologram device', label: 'Hologram Device' },
      { key: 'laser gun', label: 'Laser Gun' },
      { key: 'jetpack', label: 'Jetpack' },
      { key: 'data tablet', label: 'Data Tablet' },
      { key: 'satellite', label: 'Satellite' },
      { key: 'game console', label: 'Game Console' },
      { key: 'laptop', label: 'Laptop' },
      { key: 'arcade machine', label: 'Arcade Machine' },
      { key: 'smartphone', label: 'Smartphone' },
      { key: 'control panel', label: 'Control Panel' },
    ],
  },
  {
    id: 'vehicles',
    title: 'Vehicles',
    icon: 'car-outline',
    description: 'Rides, vessels, and ways to move',
    items: [
      { key: 'motorcycle', label: 'Motorcycle' },
      { key: 'muscle car', label: 'Muscle Car' },
      { key: 'bicycle', label: 'Bicycle' },
      { key: 'sailboat', label: 'Sailboat' },
      { key: 'speedboat', label: 'Speedboat' },
      { key: 'helicopter', label: 'Helicopter' },
      { key: 'spaceship', label: 'Spaceship' },
      { key: 'hot air balloon', label: 'Hot Air Balloon' },
      { key: 'train', label: 'Train' },
      { key: 'jet fighter', label: 'Jet Fighter' },
      { key: 'truck', label: 'Truck' },
      { key: 'submarine', label: 'Submarine' },
    ],
  },
  {
    id: 'magic',
    title: 'Magic & Fantasy',
    icon: 'sparkles-outline',
    description: 'Enchanted artifacts and arcane relics',
    items: [
      { key: 'magic wand', label: 'Magic Wand' },
      { key: 'crystal ball', label: 'Crystal Ball' },
      { key: 'spell book', label: 'Spell Book' },
      { key: 'magic mirror', label: 'Magic Mirror' },
      { key: 'portal', label: 'Portal' },
      { key: 'rune stone', label: 'Rune Stone' },
      { key: 'enchanted key', label: 'Enchanted Key' },
      { key: 'floating orb', label: 'Floating Orb' },
      { key: 'staff', label: 'Staff' },
      { key: 'hourglass', label: 'Hourglass' },
      { key: 'cauldron', label: 'Cauldron' },
      { key: 'magic crystal', label: 'Magic Crystal' },
    ],
  },
  {
    id: 'sports',
    title: 'Sports & Fitness',
    icon: 'fitness-outline',
    description: 'Athletic gear and equipment',
    items: [
      { key: 'basketball', label: 'Basketball' },
      { key: 'soccer ball', label: 'Soccer Ball' },
      { key: 'tennis racket', label: 'Tennis Racket' },
      { key: 'baseball bat', label: 'Baseball Bat' },
      { key: 'boxing gloves', label: 'Boxing Gloves' },
      { key: 'dumbbells', label: 'Dumbbells' },
      { key: 'skateboard', label: 'Skateboard' },
      { key: 'snowboard', label: 'Snowboard' },
      { key: 'surfboard', label: 'Surfboard' },
      { key: 'gym bench', label: 'Gym Bench' },
      { key: 'tennis ball', label: 'Tennis Ball' },
      { key: 'weight rack', label: 'Weight Rack' },
    ],
  },
  {
    id: 'lifestyle',
    title: 'Lifestyle & Objects',
    icon: 'heart-outline',
    description: 'Everyday items and personal touches',
    items: [
      { key: 'teddy bear', label: 'Teddy Bear' },
      { key: 'tea set', label: 'Tea Set' },
      { key: 'candle', label: 'Candle' },
      { key: 'rose', label: 'Rose' },
      { key: 'mirror', label: 'Mirror' },
      { key: 'clock', label: 'Clock' },
      { key: 'camera', label: 'Camera' },
      { key: 'window frame', label: 'Window Frame' },
      { key: 'backpack', label: 'Backpack' },
      { key: 'book', label: 'Book' },
      { key: 'sofa', label: 'Sofa' },
      { key: 'painting frame', label: 'Painting Frame' },
    ],
  },
];

const SECTION_COLORS: Record<string, string> = {
  weapons: '#DC2626',
  food: '#EA580C',
  creatures: '#CA8A04',
  nature: '#16A34A',
  tech: '#0891B2',
  vehicles: '#2563EB',
  magic: '#4F46E5',
  sports: '#7C3AED',
  lifestyle: '#DB2777',
};

interface Props {
  onNext: () => void;
  onBack: () => void;
}

function ObjectTile({
  item,
  selected,
  sectionColor,
  onToggle,
}: {
  item: ObjectItem;
  selected: boolean;
  sectionColor: string;
  onToggle: () => void;
}) {
  return (
    <TouchableOpacity
      style={[s.tile, selected && { borderColor: sectionColor, borderWidth: 2 }]}
      onPress={onToggle}
      activeOpacity={0.7}
    >
      <Text style={[s.tileLabel, selected && { color: sectionColor }]} numberOfLines={1}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );
}

export function ObjectPickerStep({ onNext, onBack }: Props) {
  const things = useOnboardingStore((st) => st.profile.dream_seeds.things);
  const toggleObject = useOnboardingStore((st) => st.toggleObject);
  const toggleAllObjects = useOnboardingStore((st) => st.toggleAllObjects);
  const isEditing = useOnboardingStore((st) => st.isEditing);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const atMax = things.length >= (isEditing ? 25 : MAX_ONBOARDING);

  const handleToggle = useCallback(
    (key: string) => {
      if (!things.includes(key) && atMax) return;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      toggleObject(key);
    },
    [things, atMax, toggleObject]
  );

  const toggleExpand = useCallback((sectionId: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) next.delete(sectionId);
      else next.add(sectionId);
      return next;
    });
  }, []);

  return (
    <View style={shared.root}>
      <ScrollView contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={s.hero}>
          <Text style={shared.heroTitle}>Almost done! One more thing.</Text>
          <Text style={shared.heroSubtitle}>
            Pick a few of your favorite things and your DreamBot will sprinkle them into your
            dreams. Or skip. It can improvise.
          </Text>
        </View>

        {OBJECT_SECTIONS.map((section) => {
          const isExpanded = expandedSections.has(section.id);
          const visibleItems = isExpanded ? section.items : section.items.slice(0, TILES_COLLAPSED);
          const hasMore = section.items.length > TILES_COLLAPSED;
          const sectionKeys = section.items.map((i) => i.key);
          const selectedInSection = sectionKeys.filter((k) => things.includes(k)).length;
          const allInSectionSelected = selectedInSection === section.items.length;

          const headerColor = SECTION_COLORS[section.id] || SECTION_COLORS.weapons;

          return (
            <View key={section.id} style={s.section}>
              <View style={s.sectionRow}>
                <View style={[s.sectionRail, { backgroundColor: headerColor }]} />
                <View style={s.sectionContent}>
                  <View style={s.sectionHeaderText}>
                    <View style={s.sectionTitleRow}>
                      <Ionicons name={section.icon} size={18} color={headerColor} />
                      <Text style={s.sectionTitle}>{section.title}</Text>
                      <TouchableOpacity
                        onPress={() => {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                          toggleAllObjects(sectionKeys);
                        }}
                        activeOpacity={0.7}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        <Text style={[s.selectAllText, { color: headerColor }]}>
                          {allInSectionSelected ? 'Deselect All' : 'Select All'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <Text style={s.sectionDesc}>{section.description}</Text>
                    <Text
                      style={[
                        s.sectionBadge,
                        { color: headerColor },
                        selectedInSection === 0 && s.sectionBadgeHidden,
                      ]}
                    >
                      {selectedInSection} selected
                    </Text>
                  </View>

                  <View style={s.tileGrid}>
                    {visibleItems.map((item) => (
                      <ObjectTile
                        key={item.key}
                        item={item}
                        selected={things.includes(item.key)}
                        sectionColor={headerColor}
                        onToggle={() => handleToggle(item.key)}
                      />
                    ))}
                  </View>

                  {hasMore && (
                    <TouchableOpacity
                      onPress={() => toggleExpand(section.id)}
                      activeOpacity={0.7}
                      style={s.seeMoreBtn}
                    >
                      <Text style={[s.seeMoreText, { color: headerColor }]}>
                        {isExpanded ? '- Show less' : '+ Show more'}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          );
        })}

        <View style={{ height: 120 }} />
      </ScrollView>

      {!isEditing && (
        <OnboardingFooter
          onNext={onNext}
          onBack={onBack}
          nextLabel={things.length > 0 ? 'Next' : 'Skip'}
          counter={things.length === 0 ? 'None selected (optional)' : `${things.length} selected`}
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  scrollContent: { paddingHorizontal: TILE_PADDING, paddingTop: 8 },
  hero: { marginBottom: 28 },

  section: { marginBottom: 28 },
  sectionRow: { flexDirection: 'row' },
  sectionRail: { width: 3, borderRadius: 2, marginRight: 10 },
  sectionContent: { flex: 1 },
  sectionHeaderText: { marginBottom: 10 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 3 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#FFFFFF' },
  sectionDesc: { fontSize: 12, color: colors.textSecondary },
  sectionBadge: { fontSize: 12, fontWeight: '600', color: colors.accent, marginTop: 3, height: 18 },
  sectionBadgeHidden: { opacity: 0 },

  tileGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: TILE_GAP,
  },

  tile: {
    width: TILE_WIDTH,
    height: TILE_HEIGHT,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  tileLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 4,
  },

  selectAllText: { fontSize: 12, fontWeight: '600', marginLeft: 'auto' },
  seeMoreBtn: { paddingTop: 10, paddingBottom: 4 },
  seeMoreText: { fontSize: 13, fontWeight: '600' },
});
