import { useState, useCallback, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  LayoutAnimation,
  UIManager,
  Platform,
} from 'react-native';
import { Text } from '@/components/AppText';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Image as ExpoImage } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { useOnboardingStore } from '@/store/onboarding';
import { colors } from '@/constants/theme';
import { verticalScale, fontScale } from '@/lib/responsive';
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
// Two tiles per row, edge-to-edge across the content area. (Used to leave
// room for a colored "section rail" on the left; removed 2026-06-03 in the
// brand-color cleanup.)
const TILE_WIDTH = Math.floor((SCREEN_WIDTH - TILE_PADDING * 2 - TILE_GAP) / 2);
const TILE_HEIGHT = verticalScale(110);

// Neutral dark gradient used as a tile placeholder when a location has no
// thumbnail URL — same surface→deeper drop used elsewhere in the app, so
// no per-section color coding.
const PLACEHOLDER_GRADIENT: [string, string] = [colors.surface, colors.background];

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
    title: 'Cities & Countries',
    icon: 'globe-outline',
    description: 'Famous cities and country-wide destinations',
  },
  {
    id: 'tropical',
    title: 'Tropical Escapes',
    icon: 'sunny-outline',
    description: 'Crystal waters and island paradise',
  },
  {
    id: 'epic_nature',
    title: 'Epic Nature',
    icon: 'leaf-outline',
    description: 'Mountains, canyons, and wild landscapes',
  },
];

interface Props {
  onNext: () => void;
  onBack: () => void;
}

function LocationTile({
  item,
  selected,
  thumbnailUrl,
  onToggle,
}: {
  item: LocationItem;
  selected: boolean;
  thumbnailUrl: string | undefined;
  onToggle: () => void;
}) {
  return (
    <TouchableOpacity
      style={[
        s.tile,
        selected && s.tileSelected,
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
          colors={PLACEHOLDER_GRADIENT}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
      )}

      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.7)']} style={s.tileOverlay} />

      <Text style={s.tileLabel}>{item.label}</Text>

      {selected && (
        <View style={s.heartBadge}>
          <Ionicons name="heart" size={14} color={colors.accent} />
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
      // is_approved removed 2026-06-06 (Architect audit): vestigial column,
      // 54% of cards had is_approved=false and were silently invisible to
      // onboarding. picker_category NOT NULL is the real visibility gate.
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
      {/* Sticky header — sits outside the ScrollView so the location grid
          scrolls underneath it (matches BotSelectorStep's pattern). */}
      <View style={s.stickyHeader}>
        <Text style={shared.heroTitle}>Where do you want to dream?</Text>
        <Text style={shared.heroSubtitle}>Places you love, or anywhere you’d love to go.</Text>
      </View>

      <ScrollView
        contentContainerStyle={[s.scrollContent, isEditing && { paddingBottom: verticalScale(20) }]}
        showsVerticalScrollIndicator={false}
      >
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

          return (
            <View key={section.id} style={s.section}>
              <View style={s.sectionHeaderText}>
                <View style={s.sectionTitleRow}>
                  <Ionicons name={section.icon} size={18} color={colors.accent} />
                  <Text style={s.sectionTitle}>{section.title}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      toggleAllLocations(sectionKeys);
                    }}
                    activeOpacity={0.7}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    style={s.selectAllBtn}
                  >
                    <Text style={s.selectAllText}>
                      {allInSectionSelected ? 'Deselect all' : 'Select all'}
                    </Text>
                  </TouchableOpacity>
                </View>
                <Text style={s.sectionDesc}>{section.description}</Text>
                <Text style={[s.sectionBadge, selectedInSection === 0 && s.sectionBadgeHidden]}>
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
                  <Text style={s.seeMoreText}>
                    {isExpanded ? 'Show less' : `Show all ${section.items.length}`}
                  </Text>
                </TouchableOpacity>
              )}
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
  // paddingBottom was 150 (reservation for the old absolute footer); the
  // footer is now in-flow so a small bottom buffer is all that's needed.
  scrollContent: {
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(16),
    paddingHorizontal: TILE_PADDING,
  },

  // Sticky header that sits above the ScrollView (matches BotSelectorStep).
  stickyHeader: {
    paddingHorizontal: TILE_PADDING,
    paddingTop: verticalScale(8),
    paddingBottom: verticalScale(14),
    backgroundColor: colors.background,
  },

  section: { marginBottom: verticalScale(28) },
  sectionHeaderText: { marginBottom: verticalScale(10) },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: verticalScale(3),
  },
  sectionTitle: { fontSize: fontScale(19), fontWeight: '700', color: '#FFFFFF' },
  sectionDesc: { fontSize: fontScale(13), color: colors.textSecondary },
  sectionBadge: {
    fontSize: fontScale(12),
    fontWeight: '600',
    color: colors.accent,
    marginTop: verticalScale(4),
    height: 18,
  },
  sectionBadgeHidden: { opacity: 0 },

  selectAllBtn: { marginLeft: 'auto', paddingVertical: verticalScale(2) },
  selectAllText: {
    fontSize: fontScale(13),
    fontWeight: '600',
    color: colors.accent,
  },

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
  tileSelected: {
    borderColor: colors.accent,
    shadowColor: colors.accent,
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
    fontSize: fontScale(13),
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

  seeMoreBtn: { paddingTop: verticalScale(10), paddingBottom: verticalScale(4) },
  seeMoreText: { fontSize: fontScale(14), fontWeight: '500', color: colors.accent },
});
