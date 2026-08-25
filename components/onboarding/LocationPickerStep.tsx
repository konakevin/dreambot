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
import { useAuthStore } from '@/store/auth';
import { colors } from '@/constants/theme';
import { verticalScale, horizontalScale, fontScale } from '@/lib/responsive';
import { onboardingStyles as shared } from './sharedStyles';
import { GradientTitle, TITLE_SIZE } from '@/components/GradientTitle';
import { TitleText } from '@/components/TitleText';
import { OnboardingFooter } from './OnboardingFooter';
import { supabase } from '@/lib/supabase';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

const MIN_REQUIRED = 1;
// Effectively uncapped (2026-06-18, Kevin) — high practical bound only, since the
// picker is a plain ScrollView (not virtualized). Nothing downstream limits
// location count. See store/onboarding.ts MAX_LOCATIONS.
const MAX_ONBOARDING = 100;
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
  adminOnly?: boolean;
}

type LocationTier = 'real' | 'imagined';

interface LocationSection {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  description: string;
  tier: LocationTier;
  items: LocationItem[];
}

// Tier banners split the picker into real Earth places vs imagined worlds
// (Operation Dream Location Expansion, 2026-08-24). Order = real first.
const TIER_META: { id: LocationTier; title: string }[] = [
  { id: 'real', title: 'Real Places' },
  { id: 'imagined', title: 'Imagined Worlds' },
];

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
  tier: LocationTier;
}
// The LIST of locations in each section is DB-driven (location_cards.picker_category);
// this only defines section presentation + which tier a category belongs to. A section
// with no cards in the DB simply doesn't render, so a new imagined category can be added
// here ahead of its cards (Operation Dream Location Expansion).
const SECTION_META: SectionMeta[] = [
  // ── Real Places ──────────────────────────────────────────────
  {
    id: 'iconic_cities',
    title: 'Cities & Countries',
    icon: 'globe-outline',
    description: 'Famous cities and country-wide destinations',
    tier: 'real',
  },
  {
    id: 'tropical',
    title: 'Tropical Escapes',
    icon: 'sunny-outline',
    description: 'Crystal waters and island paradise',
    tier: 'real',
  },
  {
    id: 'epic_nature',
    title: 'Epic Nature',
    icon: 'leaf-outline',
    description: 'Mountains, canyons, and wild landscapes',
    tier: 'real',
  },
  {
    id: 'landmarks_wonders',
    title: 'Landmarks & Wonders',
    icon: 'star-outline',
    description: 'The world’s great monuments and natural wonders',
    tier: 'real',
  },
  // ── Imagined Worlds ──────────────────────────────────────────
  // (fantasy_worlds dissolved 2026-08-25 — it mixed real places (Paris Café,
  // Cherry Blossoms, Japanese Garden) with fantasy; cards redistributed to
  // coherent sections.)
  {
    id: 'high_fantasy',
    title: 'High Fantasy',
    icon: 'flame-outline',
    description: 'Elven cities, dragon keeps, and epic realms',
    tier: 'imagined',
  },
  {
    id: 'scifi_space',
    title: 'Sci-Fi & Space',
    icon: 'planet-outline',
    description: 'Neon megacities, alien worlds, and the stars',
    tier: 'imagined',
  },
  {
    id: 'gothic_haunted',
    title: 'Gothic & Haunted',
    icon: 'moon-outline',
    description: 'Candlelit castles, fog, and beautiful gloom',
    tier: 'imagined',
  },
  {
    id: 'whimsical_fun',
    title: 'Whimsical & Fun',
    icon: 'flower-outline',
    description: 'Fairy-tale castles, gardens, and sweet escapes',
    tier: 'imagined',
  },
  {
    id: 'wild_west',
    title: 'Wild West',
    icon: 'trail-sign-outline',
    description: 'Outlaws, saloons, and the rugged frontier',
    tier: 'imagined',
  },
  {
    id: 'through_time',
    title: 'Through Time',
    icon: 'hourglass-outline',
    description: 'Ancient empires and bygone eras',
    tier: 'imagined',
  },
  {
    id: 'heroes_adventure',
    title: 'Heroes & Adventure',
    icon: 'flash-outline',
    description: 'Epic quests, daring feats, and bold action',
    tier: 'imagined',
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

      {/* numberOfLines={1}: the label is bottom-anchored inside a fixed-height,
          overflow:hidden tile. Without a line cap, OS "Larger Text" (or a long
          name) wraps it upward and the top lines clip against the tile edge.
          One line + tail-ellipsis bounds the growth. */}
      <Text style={s.tileLabel} numberOfLines={1} ellipsizeMode="tail">
        {item.label}
      </Text>

      {/* Dark-launch marker — only admins ever receive admin_only cards, so this
          badge only appears for them (QA aid; mig 444). */}
      {item.adminOnly && (
        <View style={s.adminBadge}>
          <Text style={s.adminBadgeText}>ADMIN</Text>
        </View>
      )}

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
  // Dark-launch gate (mig 444): admins see admin_only cards for QA; regular users don't.
  const isAdmin = useAuthStore((st) => st.isAdmin);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [thumbnails, setThumbnails] = useState<Map<string, string>>(new Map());
  const [sections, setSections] = useState<LocationSection[]>([]);

  const canProceed = places.length >= MIN_REQUIRED;
  const atMax = places.length >= MAX_ONBOARDING;

  // Load locations from DB (location_cards). Group by picker_category,
  // sort by picker_sort_order. Section icons + titles + descriptions
  // come from SECTION_META; the location list itself is fully DB-driven.
  useEffect(() => {
    let query = supabase
      .from('location_cards')
      .select('name, display_name, picker_category, picker_sort_order, thumbnail_url, admin_only')
      // is_approved removed 2026-06-06 (Architect audit): vestigial column,
      // 54% of cards had is_approved=false and were silently invisible to
      // onboarding. picker_category NOT NULL is the real visibility gate.
      .not('picker_category', 'is', null);
    // Dark launch (mig 444): non-admins never see admin_only cards; admins see all.
    if (!isAdmin) query = query.eq('admin_only', false);
    query.order('picker_sort_order').then(({ data }) => {
      if (!data) return;
      const thumbMap = new Map<string, string>();
      const byCategory = new Map<string, LocationItem[]>();
      for (const row of data) {
        if (row.thumbnail_url) thumbMap.set(row.name, row.thumbnail_url);
        if (!row.picker_category) continue;
        const items = byCategory.get(row.picker_category) ?? [];
        items.push({
          key: row.name,
          label: row.display_name ?? row.name,
          adminOnly: !!row.admin_only,
        });
        byCategory.set(row.picker_category, items);
      }
      // Build section list in the order defined by SECTION_META
      const built: LocationSection[] = SECTION_META.filter((m) => byCategory.has(m.id)).map(
        (m) => ({
          id: m.id,
          title: m.title,
          icon: m.icon,
          description: m.description,
          tier: m.tier,
          items: byCategory.get(m.id) ?? [],
        })
      );
      setSections(built);
      setThumbnails(thumbMap);
    });
  }, [isAdmin]);

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

  const renderSection = (section: LocationSection) => {
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
  };

  return (
    <View style={shared.root}>
      {/* Sticky header — sits outside the ScrollView so the location grid
          scrolls underneath it (matches BotSelectorStep's pattern). */}
      <View style={s.stickyHeader}>
        {/* In Settings the gradient wordmark is the "Locations" nav-bar title
            (app/settings/locations.tsx), so demote this to plain text; onboarding
            (isEditing=false) keeps the gradient hero. Mirrors the Dream Cast screen. */}
        {isEditing ? (
          <TitleText
            size={18}
            color={colors.bodyOnDark}
            numberOfLines={2}
            align="center"
            style={{ marginBottom: verticalScale(6), maxWidth: SCREEN_WIDTH - TILE_PADDING * 2 }}
          >
            Where do you want to dream?
          </TitleText>
        ) : (
          <GradientTitle
            size={TITLE_SIZE.page}
            numberOfLines={2}
            align="center"
            maxWidth={SCREEN_WIDTH - TILE_PADDING * 2}
            style={{ marginBottom: verticalScale(6) }}
          >
            Where do you want to dream?
          </GradientTitle>
        )}
        <Text style={[shared.heroSubtitle, { textAlign: 'center' }]}>
          Real-world escapes, fairy-tale realms, faraway planets. Pick your favorites and we’ll
          weave you right into the dream. ✨
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={[s.scrollContent, isEditing && { paddingBottom: verticalScale(20) }]}
        showsVerticalScrollIndicator={false}
      >
        {TIER_META.map((tier) => {
          const tierSections = sections.filter((sec) => sec.tier === tier.id);
          if (tierSections.length === 0) return null;
          return (
            <View key={tier.id}>
              <View style={s.tierBanner}>
                <Text style={s.tierTitle}>{tier.title}</Text>
                <View style={s.tierRule} />
              </View>
              {tierSections.map(renderSection)}
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

  // Tier banner ("Real Places" / "Imagined Worlds") that groups the sections
  // under it (Operation Dream Location Expansion).
  tierBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: verticalScale(14),
    marginTop: verticalScale(4),
  },
  tierTitle: {
    fontSize: fontScale(13),
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: colors.subtleOnDark,
  },
  tierRule: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.subtleOnDark,
    opacity: 0.3,
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
  sectionDesc: { fontSize: fontScale(14), color: colors.subtleOnDark, lineHeight: fontScale(20) },
  sectionBadge: {
    fontSize: fontScale(12),
    fontWeight: '600',
    color: colors.accent,
    marginTop: verticalScale(4),
    // minHeight (not a hard height) reserves the row so layout doesn't jump when
    // 0 are selected, but still lets the line grow under OS "Larger Text" instead
    // of clipping the glyphs.
    minHeight: 18,
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
  adminBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: horizontalScale(6),
    paddingVertical: verticalScale(2),
    borderRadius: 6,
    backgroundColor: 'rgba(0,0,0,0.65)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.accent,
  },
  adminBadgeText: {
    fontSize: fontScale(9),
    fontWeight: '800',
    letterSpacing: 0.8,
    color: colors.accent,
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
