import { useState, useCallback, useEffect } from 'react';
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
import { LinearGradient } from 'expo-linear-gradient';
import { Image as ExpoImage } from 'expo-image';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { useOnboardingStore } from '@/store/onboarding';
import { colors } from '@/constants/theme';
import { supabase } from '@/lib/supabase';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

const MIN_REQUIRED = 1;
const MAX_ONBOARDING = 10;
const TILES_COLLAPSED = 4;
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TILE_GAP = 10;
const TILE_PADDING = 20;
const RAIL_WIDTH = 13;
const TILE_WIDTH = Math.floor((SCREEN_WIDTH - TILE_PADDING * 2 - RAIL_WIDTH - TILE_GAP) / 2);
const TILE_HEIGHT = 110;

interface LocationItem {
  key: string;
  label: string;
}

interface LocationSection {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  description: string;
  items: LocationItem[];
}

const LOCATION_SECTIONS: LocationSection[] = [
  {
    id: 'iconic_cities',
    title: 'Iconic Cities & Travel',
    icon: 'globe-outline',
    description: 'Famous destinations around the world',
    items: [
      { key: 'new york city', label: 'New York City' },
      { key: 'tokyo', label: 'Tokyo' },
      { key: 'paris', label: 'Paris' },
      { key: 'venice', label: 'Venice' },
      { key: 'london', label: 'London' },
      { key: 'dubai', label: 'Dubai' },
      { key: 'santorini', label: 'Santorini' },
      { key: 'hong kong', label: 'Hong Kong' },
      { key: 'rome', label: 'Rome' },
      { key: 'los angeles', label: 'Los Angeles' },
      { key: 'miami', label: 'Miami' },
      { key: 'san francisco', label: 'San Francisco' },
      { key: 'barcelona', label: 'Barcelona' },
      { key: 'rio de janeiro', label: 'Rio de Janeiro' },
      { key: 'seoul', label: 'Seoul' },
      { key: 'las vegas', label: 'Las Vegas' },
    ],
  },
  {
    id: 'tropical',
    title: 'Tropical Escapes',
    icon: 'sunny-outline',
    description: 'Crystal waters and island paradise',
    items: [
      { key: 'hawaii', label: 'Hawaii' },
      { key: 'maldives', label: 'Maldives' },
      { key: 'bali', label: 'Bali' },
      { key: 'caribbean island', label: 'Caribbean Island' },
      { key: 'costa rica', label: 'Costa Rica' },
      { key: 'bora bora tahiti', label: 'Bora Bora / Tahiti' },
    ],
  },
  {
    id: 'ancient',
    title: 'Ancient Wonders',
    icon: 'trophy-outline',
    description: 'Monuments and ruins of lost civilizations',
    items: [
      { key: 'ancient egypt', label: 'Ancient Egypt' },
      { key: 'machu picchu', label: 'Machu Picchu' },
      { key: 'angkor wat', label: 'Angkor Wat' },
      { key: 'ancient rome', label: 'Ancient Rome' },
      { key: 'petra', label: 'Petra' },
      { key: 'taj mahal', label: 'Taj Mahal' },
      { key: 'great wall of china', label: 'Great Wall of China' },
      { key: 'stonehenge', label: 'Stonehenge' },
    ],
  },
  {
    id: 'epic_nature',
    title: 'Epic Nature',
    icon: 'leaf-outline',
    description: 'Mountains, canyons, and wild landscapes',
    items: [
      { key: 'yosemite', label: 'Yosemite' },
      { key: 'moab arches', label: 'Moab / Arches' },
      { key: 'swiss alps', label: 'Swiss Alps' },
      { key: 'iceland', label: 'Iceland' },
      { key: 'canadian rockies', label: 'Canadian Rockies' },
      { key: 'grand canyon', label: 'Grand Canyon' },
      { key: 'zion national park', label: 'Zion National Park' },
      { key: 'redwood forest', label: 'Redwood Forest' },
      { key: 'amazon rainforest', label: 'Amazon Rainforest' },
      { key: 'arctic wilderness', label: 'Arctic Wilderness' },
      { key: 'sahara desert', label: 'Sahara Desert' },
      { key: 'big sur cliffs', label: 'Big Sur Cliffs' },
    ],
  },
  {
    id: 'scifi',
    title: 'Sci-Fi / Futuristic',
    icon: 'rocket-outline',
    description: 'Space stations, megacities, and alien worlds',
    items: [
      { key: 'alien planet', label: 'Alien Planet' },
      { key: 'cyberpunk megacity', label: 'Cyberpunk Megacity' },
      { key: 'space station', label: 'Space Station' },
      { key: 'mars colony', label: 'Mars Colony' },
    ],
  },
  {
    id: 'cozy',
    title: 'Cozy / Aesthetic Worlds',
    icon: 'heart-outline',
    description: 'Romantic, soft, and beautiful spaces',
    items: [
      { key: 'paris cafe', label: 'Paris Caf\u00e9' },
      { key: 'cherry blossoms', label: 'Cherry Blossoms' },
      { key: 'japanese garden', label: 'Japanese Garden' },
      { key: 'fairy cottage', label: 'Fairy Cottage' },
      { key: 'princess garden castle', label: 'Princess Garden Castle' },
      { key: 'rose palace', label: 'Rose Palace' },
    ],
  },
  {
    id: 'fantasy',
    title: 'Fantasy & Magical Realms',
    icon: 'sparkles-outline',
    description: 'Enchanted worlds and mythical places',
    items: [
      { key: 'enchanted forest', label: 'Enchanted Forest' },
      { key: 'floating sky islands', label: 'Floating Sky Islands' },
      { key: 'wizard academy', label: 'Wizard Academy' },
      { key: 'underwater city atlantis', label: 'Underwater City (Atlantis)' },
      { key: 'ancient elven city', label: 'Ancient Elven City' },
      { key: 'dwarven fortress', label: 'Dwarven Fortress' },
      { key: 'dragons keep', label: "Dragon's Keep" },
      { key: 'crystal caverns', label: 'Crystal Caverns' },
      { key: 'cloud kingdom', label: 'Cloud Kingdom' },
      { key: 'fairy tale kingdom', label: 'Fairy Tale Kingdom' },
    ],
  },
  {
    id: 'gothic',
    title: 'Gothic / Cinematic Mood',
    icon: 'moon-outline',
    description: 'Dark atmosphere and dramatic settings',
    items: [
      { key: 'victorian london', label: 'Victorian London' },
      { key: 'transylvania', label: 'Transylvania' },
      { key: 'haunted cathedral', label: 'Haunted Cathedral' },
      { key: 'noir cityscape', label: 'Noir Cityscape' },
    ],
  },
];

const SECTION_COLORS: Record<string, { gradient: [string, string]; tint: string }> = {
  iconic_cities: { gradient: ['#DC2626', '#7F1D1D'], tint: 'rgba(220,38,38,0.45)' },
  tropical: { gradient: ['#EA580C', '#7C2D12'], tint: 'rgba(234,88,12,0.45)' },
  ancient: { gradient: ['#CA8A04', '#713F12'], tint: 'rgba(202,138,4,0.45)' },
  epic_nature: { gradient: ['#16A34A', '#14532D'], tint: 'rgba(22,163,74,0.45)' },
  scifi: { gradient: ['#0891B2', '#083344'], tint: 'rgba(8,145,178,0.45)' },
  cozy: { gradient: ['#2563EB', '#1E3A5F'], tint: 'rgba(37,99,235,0.45)' },
  fantasy: { gradient: ['#4F46E5', '#1E1B4B'], tint: 'rgba(79,70,229,0.45)' },
  gothic: { gradient: ['#7C3AED', '#3B0764'], tint: 'rgba(124,58,237,0.45)' },
};

interface Props {
  onNext: () => void;
  onBack: () => void;
}

function LocationTile({
  item,
  selected,
  thumbnailUrl,
  sectionId,
  onToggle,
}: {
  item: LocationItem;
  selected: boolean;
  thumbnailUrl: string | undefined;
  sectionId: string;
  onToggle: () => void;
}) {
  const sectionColor = SECTION_COLORS[sectionId] || SECTION_COLORS.iconic_cities;

  const highlightColor = sectionColor.gradient[0];

  return (
    <TouchableOpacity
      style={[
        s.tile,
        selected && { borderColor: highlightColor, shadowColor: highlightColor },
        selected && s.tileSelectedShadow,
        { transform: [{ scale: selected ? 1.03 : 1 }] },
      ]}
      onPress={onToggle}
      activeOpacity={0.8}
    >
      {thumbnailUrl ? (
        <ExpoImage
          source={{ uri: thumbnailUrl }}
          style={StyleSheet.absoluteFillObject}
          contentFit="cover"
          transition={200}
        />
      ) : (
        <LinearGradient
          colors={sectionColor.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
      )}

      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.7)']} style={s.tileOverlay} />

      <Text style={s.tileLabel}>{item.label}</Text>

      {selected && (
        <View style={s.heartBadge}>
          <Ionicons name="heart" size={14} color={highlightColor} />
        </View>
      )}
    </TouchableOpacity>
  );
}

export function LocationPickerStep({ onNext, onBack }: Props) {
  const places = useOnboardingStore((st) => st.profile.dream_seeds.places);
  const toggleLocation = useOnboardingStore((st) => st.toggleLocation);
  const toggleAllLocations = useOnboardingStore((st) => st.toggleAllLocations);
  const isEditing = useOnboardingStore((st) => st.isEditing);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [thumbnails, setThumbnails] = useState<Map<string, string>>(new Map());

  const canProceed = places.length >= MIN_REQUIRED;
  const atMax = places.length >= (isEditing ? 25 : MAX_ONBOARDING);

  useEffect(() => {
    supabase
      .from('location_cards')
      .select('name, thumbnail_url')
      .not('thumbnail_url', 'is', null)
      .then(({ data }) => {
        if (!data) return;
        const map = new Map<string, string>();
        for (const row of data) {
          if (row.thumbnail_url) map.set(row.name, row.thumbnail_url);
        }
        setThumbnails(map);
      });
  }, []);

  const handleToggle = useCallback(
    (key: string) => {
      if (!places.includes(key) && atMax) return;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      toggleLocation(key);
    },
    [places, atMax, toggleLocation]
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
    <View style={s.root}>
      <BlurView intensity={60} tint="dark" style={s.stickyTop}>
        <Text style={s.selectedCount}>
          {places.length > 0 ? `Selected: ${places.length}` : 'None selected'}
        </Text>
      </BlurView>

      <ScrollView
        contentContainerStyle={[s.scrollContent, isEditing && { paddingBottom: 20 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.hero}>
          <Text style={s.heroTitle}>First things first: where to?</Text>
          <Text style={s.heroSubtitle}>
            Pick the places that make your heart race. Your DreamBot will build entire worlds around
            them.
          </Text>
        </View>

        {LOCATION_SECTIONS.map((section) => {
          const isExpanded = expandedSections.has(section.id);
          const visibleItems =
            isExpanded || section.items.length <= TILES_COLLAPSED
              ? section.items
              : section.items.slice(0, TILES_COLLAPSED);
          const hasMore = section.items.length > TILES_COLLAPSED;
          const sectionKeys = section.items.map((i) => i.key);
          const selectedInSection = sectionKeys.filter((k) => places.includes(k)).length;
          const allInSectionSelected = selectedInSection === section.items.length;

          const headerColor = (SECTION_COLORS[section.id] || SECTION_COLORS.iconic_cities)
            .gradient[0];

          return (
            <View key={section.id} style={s.section}>
              <View style={s.sectionRow}>
                <View style={[s.sectionRail, { backgroundColor: headerColor }]} />
                <View style={s.sectionContent}>
                  <View style={s.sectionHeaderText}>
                    <View style={s.sectionTitleRow}>
                      <Ionicons name={section.icon} size={20} color={headerColor} />
                      <Text style={s.sectionTitle}>{section.title}</Text>
                      <TouchableOpacity
                        onPress={() => {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                          toggleAllLocations(sectionKeys);
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
                      <LocationTile
                        key={item.key}
                        item={item}
                        selected={places.includes(item.key)}
                        thumbnailUrl={thumbnails.get(item.key)}
                        sectionId={section.id}
                        onToggle={() => handleToggle(item.key)}
                      />
                    ))}
                  </View>

                  {hasMore && (
                    <TouchableOpacity
                      style={s.seeMoreBtn}
                      onPress={() => toggleExpand(section.id)}
                      activeOpacity={0.7}
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
      </ScrollView>

      {!isEditing && (
        <View style={s.footer}>
          <TouchableOpacity style={s.backBtn} onPress={onBack} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={18} color="#FFFFFF" />
            <Text style={s.backBtnText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.continueBtn, !canProceed && s.continueBtnDisabled]}
            onPress={() => {
              if (!canProceed) return;
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              onNext();
            }}
            disabled={!canProceed}
            activeOpacity={0.7}
          >
            <Text style={[s.continueBtnText, !canProceed && s.continueBtnTextDisabled]}>
              {canProceed
                ? `Continue (${places.length} selected)`
                : `Select at least ${MIN_REQUIRED}`}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },

  stickyTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingVertical: 10,
    paddingHorizontal: TILE_PADDING,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  selectedCount: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
  },

  scrollContent: {
    paddingTop: 44,
    paddingBottom: 110,
    paddingHorizontal: TILE_PADDING,
  },

  hero: { paddingTop: 8, paddingBottom: 20 },
  heroTitle: { fontSize: 28, fontWeight: '700', color: '#FFFFFF', marginBottom: 6 },
  heroSubtitle: { fontSize: 15, color: colors.textSecondary, lineHeight: 20 },

  section: { marginBottom: 32 },
  sectionRow: { flexDirection: 'row' },
  sectionRail: { width: 3, borderRadius: 2, marginRight: 10 },
  sectionContent: { flex: 1 },
  sectionHeaderText: { marginBottom: 10 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 3 },
  sectionTitle: { fontSize: 19, fontWeight: '700', color: '#FFFFFF' },
  sectionDesc: { fontSize: 13, color: colors.textSecondary },
  sectionBadge: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.accent,
    marginTop: 4,
    height: 18,
  },
  sectionBadgeHidden: { opacity: 0 },

  tileGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: TILE_GAP,
  },

  tile: {
    width: TILE_WIDTH,
    height: TILE_HEIGHT,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  tileSelectedShadow: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
  tileOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  tileLabel: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  heartBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  selectAllText: { fontSize: 12, fontWeight: '600', marginLeft: 'auto' },
  seeMoreBtn: { paddingTop: 10, paddingBottom: 4 },
  seeMoreText: { fontSize: 14, fontWeight: '500' },

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
    borderRadius: 16,
    backgroundColor: colors.accent,
    gap: 6,
  },
  continueBtnDisabled: { backgroundColor: colors.surface },
  continueBtnText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
  continueBtnTextDisabled: { color: colors.textSecondary },
});
