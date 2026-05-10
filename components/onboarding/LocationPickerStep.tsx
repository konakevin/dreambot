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
import * as Haptics from 'expo-haptics';
import { useOnboardingStore } from '@/store/onboarding';
import { colors } from '@/constants/theme';
import { onboardingStyles as shared } from './sharedStyles';
import { OnboardingFooter } from './OnboardingFooter';
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

// Section metadata (icons / titles / descriptions / order) lives in code
// since it's pure UI presentation. The LIST OF LOCATIONS in each section
// comes from location_cards.picker_category in the DB. Adding a new
// location = INSERT a row with picker_category set; appears here on next
// app load. No code change.
interface SectionMeta {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  description: string;
}
const SECTION_META: SectionMeta[] = [
  {
    id: 'iconic_cities',
    title: 'Iconic Cities & Travel',
    icon: 'globe-outline',
    description: 'Famous destinations around the world',
  },
  {
    id: 'tropical',
    title: 'Tropical Escapes',
    icon: 'sunny-outline',
    description: 'Crystal waters and island paradise',
  },
  {
    id: 'ancient_wonders',
    title: 'Ancient Wonders',
    icon: 'trophy-outline',
    description: 'Iconic monuments and ruins from across the ancient world',
  },
  {
    id: 'epic_nature',
    title: 'Epic Nature',
    icon: 'leaf-outline',
    description: 'Mountains, canyons, and wild landscapes',
  },
  {
    id: 'scifi',
    title: 'Sci-Fi / Futuristic',
    icon: 'rocket-outline',
    description: 'Space stations, megacities, and alien worlds',
  },
  {
    id: 'fantasy',
    title: 'Fantasy & Magical Realms',
    icon: 'sparkles-outline',
    description: 'Enchanted worlds and mythical places',
  },
  {
    id: 'cozy',
    title: 'Cozy / Aesthetic Worlds',
    icon: 'heart-outline',
    description: 'Romantic, soft, and beautiful spaces',
  },
  {
    id: 'gothic',
    title: 'Gothic / Cinematic Mood',
    icon: 'moon-outline',
    description: 'Dark atmosphere and dramatic settings',
  },
];

const SECTION_COLORS: Record<string, { gradient: [string, string]; tint: string }> = {
  iconic_cities: { gradient: ['#DC2626', '#7F1D1D'], tint: 'rgba(220,38,38,0.45)' },
  tropical: { gradient: ['#EA580C', '#7C2D12'], tint: 'rgba(234,88,12,0.45)' },
  ancient_wonders: { gradient: ['#CA8A04', '#713F12'], tint: 'rgba(202,138,4,0.45)' },
  epic_nature: { gradient: ['#16A34A', '#14532D'], tint: 'rgba(22,163,74,0.45)' },
  scifi: { gradient: ['#0891B2', '#083344'], tint: 'rgba(8,145,178,0.45)' },
  cozy: { gradient: ['#4F46E5', '#1E1B4B'], tint: 'rgba(79,70,229,0.45)' },
  fantasy: { gradient: ['#2563EB', '#1E3A5F'], tint: 'rgba(37,99,235,0.45)' },
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
  const [sections, setSections] = useState<LocationSection[]>([]);

  const canProceed = places.length >= MIN_REQUIRED;
  const atMax = places.length >= (isEditing ? 25 : MAX_ONBOARDING);

  // Load locations from DB (location_cards). Group by picker_category,
  // sort by picker_sort_order. Section icons + titles + descriptions
  // come from SECTION_META; the location list itself is fully DB-driven.
  useEffect(() => {
    supabase
      .from('location_cards')
      .select('name, display_name, picker_category, picker_sort_order, thumbnail_url')
      .eq('is_approved', true)
      .not('picker_category', 'is', null)
      .order('picker_sort_order')
      .then(({ data }) => {
        if (!data) return;
        const thumbMap = new Map<string, string>();
        const byCategory = new Map<string, LocationItem[]>();
        for (const row of data) {
          if (row.thumbnail_url) thumbMap.set(row.name, row.thumbnail_url);
          if (!row.picker_category) continue;
          const items = byCategory.get(row.picker_category) ?? [];
          items.push({ key: row.name, label: row.display_name ?? row.name });
          byCategory.set(row.picker_category, items);
        }
        // Build section list in the order defined by SECTION_META
        const built: LocationSection[] = SECTION_META.filter((m) => byCategory.has(m.id)).map(
          (m) => ({
            id: m.id,
            title: m.title,
            icon: m.icon,
            description: m.description,
            items: byCategory.get(m.id) ?? [],
          })
        );
        setSections(built);
        setThumbnails(thumbMap);
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
    <View style={shared.root}>
      <ScrollView
        contentContainerStyle={[s.scrollContent, isEditing && { paddingBottom: 20 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.hero}>
          <Text style={shared.heroTitle}>Where should it drop you?</Text>
          <Text style={shared.heroSubtitle}>
            Real places. Fantasy worlds. Sci-fi cities. Pick a few — the mix is where the magic
            happens.
          </Text>
        </View>

        {sections.map((section) => {
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
        <OnboardingFooter
          onNext={onNext}
          onBack={onBack}
          disabled={!canProceed}
          counter={places.length > 0 ? `${places.length} selected` : 'None selected'}
          counterMet={canProceed}
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  scrollContent: {
    paddingTop: 8,
    paddingBottom: 110,
    paddingHorizontal: TILE_PADDING,
  },

  hero: { paddingBottom: 20 },

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
});
