import { useState, useCallback, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { View, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
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
import { GradientTitle, TITLE_SIZE, BRAND_GRADIENT } from '@/components/GradientTitle';
import { TitleText } from '@/components/TitleText';
import { OnboardingFooter } from './OnboardingFooter';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { supabase } from '@/lib/supabase';

const MIN_REQUIRED = 1;
// Effectively uncapped (2026-06-18, Kevin) — high practical bound only, since the
// picker is a plain ScrollView (not virtualized). Nothing downstream limits
// location count. See store/onboarding.ts MAX_LOCATIONS.
const MAX_ONBOARDING = 100;
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TILE_GAP = 10;
const TILE_PADDING = 20;
// Two tiles per row, edge-to-edge across the content area.
const TILE_WIDTH = Math.floor((SCREEN_WIDTH - TILE_PADDING * 2 - TILE_GAP) / 2);
const TILE_HEIGHT = verticalScale(110);
const CAT_CARD_HEIGHT = verticalScale(118);

// Neutral dark gradient used as a tile placeholder when a location has no
// thumbnail URL.
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
  /** picker_category values this fat section aggregates (2026-08-25 Kevin: 12
   *  fine-grained categories folded into 8 broad ones — 4 per tab — so browsing
   *  is a quick scan, not a wall of menus. The DB picker_category stays granular;
   *  this UI just groups them). */
  categories: string[];
}
// Section presentation + grouping lives in code; the LIST of locations is DB-driven
// (location_cards.picker_category). A section with no cards simply doesn't render.
// 11 sections rendered on ONE page under two labeled worlds (no tabs) — 5 Real,
// 6 Dream. Most map 1:1 to a picker_category; "Around the World" fuses cities +
// countries + the single World Wonders card. See LOCATION_REORG_PLAN.md.
const SECTION_META: SectionMeta[] = [
  // ── Real World (5) ───────────────────────────────────────────
  {
    id: 'around_the_world',
    title: 'Around the World',
    icon: 'earth-outline',
    description: 'Cities, countries, and the world’s great wonders',
    tier: 'real',
    categories: ['iconic_cities', 'countries_cultures', 'landmarks_wonders'],
  },
  {
    id: 'tropical_escapes',
    title: 'Tropical Escapes',
    icon: 'sunny-outline',
    description: 'Turquoise lagoons and island paradise',
    tier: 'real',
    categories: ['tropical'],
  },
  {
    id: 'beach_towns',
    title: 'Beach Towns',
    icon: 'umbrella-outline',
    description: 'Boardwalks, beach houses, and sunset shores',
    tier: 'real',
    categories: ['beach_towns'],
  },
  {
    id: 'nature',
    title: 'Nature & Wild',
    icon: 'leaf-outline',
    description: 'Mountains, canyons, and wild landscapes',
    tier: 'real',
    categories: ['epic_nature'],
  },
  {
    id: 'through_time',
    title: 'Through Time',
    icon: 'hourglass-outline',
    description: 'Ancient empires and bygone eras',
    tier: 'real',
    categories: ['through_time'],
  },
  // ── Dream Worlds (6) ─────────────────────────────────────────
  {
    id: 'fantasy',
    title: 'Fantasy',
    icon: 'sparkles-outline',
    description: 'Elven cities, dragon keeps, and candlelit castles',
    tier: 'imagined',
    categories: ['high_fantasy'],
  },
  {
    id: 'gothic',
    title: 'Gothic & Haunted',
    icon: 'moon-outline',
    description: 'Vampire castles, foggy graveyards, haunted halls',
    tier: 'imagined',
    categories: ['gothic_haunted'],
  },
  {
    id: 'whimsical',
    title: 'Whimsical',
    icon: 'flower-outline',
    description: 'Fairy-tale castles, candy lands, and sweet escapes',
    tier: 'imagined',
    categories: ['whimsical_fun'],
  },
  {
    id: 'scifi',
    title: 'Sci-Fi & Space',
    icon: 'planet-outline',
    description: 'Neon megacities, alien worlds, and the stars',
    tier: 'imagined',
    categories: ['scifi_space'],
  },
  {
    id: 'wild_west',
    title: 'Wild West',
    icon: 'flame-outline',
    description: 'Frontier towns, saloons, and desert standoffs',
    tier: 'imagined',
    categories: ['wild_west'],
  },
  {
    id: 'heroes',
    title: 'Heroes & Adventure',
    icon: 'flash-outline',
    description: 'Rooftops, spy lairs, and daring feats',
    tier: 'imagined',
    categories: ['heroes_adventure'],
  },
];

interface Props {
  onNext: () => void;
  onBack: () => void;
  /** When true (settings route), the drill-in detail view does NOT render its own
   *  inner back button — the host's top header chevron is the single back, made
   *  context-aware via the imperative `goBack()` handle below. Onboarding leaves
   *  this off and keeps the inner back. */
  hideDetailBack?: boolean;
}

/** Imperative handle so a host header's back chevron routes through the picker. */
export interface LocationPickerHandle {
  /** Handle a host back-press. Pops the drill-in detail first (→ category grid);
   *  else if leaving with ZERO places selected, shows a gentle confirm and only
   *  runs onLeave if confirmed; otherwise runs onLeave immediately. */
  handleBack: (onLeave: () => void) => void;
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
          name) wraps it upward and the top lines clip against the tile edge. */}
      <Text style={s.tileLabel} numberOfLines={1} ellipsizeMode="tail">
        {item.label}
      </Text>

      {/* Dark-launch marker — only admins ever receive admin_only cards (mig 444). */}
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

export const LocationPickerStep = forwardRef<LocationPickerHandle, Props>(
  function LocationPickerStep({ onNext, onBack, hideDetailBack }: Props, ref) {
    const places = useOnboardingStore((st) => st.profile.dream_seeds.places);
    const toggleLocation = useOnboardingStore((st) => st.toggleLocation);
    const toggleAllLocations = useOnboardingStore((st) => st.toggleAllLocations);
    const isEditing = useOnboardingStore((st) => st.isEditing);
    // Dark-launch gate (mig 444): admins see admin_only cards for QA; regular users don't.
    const isAdmin = useAuthStore((st) => st.isAdmin);
    const [thumbnails, setThumbnails] = useState<Map<string, string>>(new Map());
    const [sections, setSections] = useState<LocationSection[]>([]);
    // Level 3 — which category is drilled into (null = the two-section browse grid).
    const [openCategory, setOpenCategory] = useState<string | null>(null);
    const [resetVisible, setResetVisible] = useState(false);
    // Gentle "leaving with nothing picked?" confirm — stashes the host's leave
    // action until they confirm.
    const [leaveVisible, setLeaveVisible] = useState(false);
    const leaveActionRef = useRef<(() => void) | null>(null);

    // A host header's back chevron routes through here: pop the drill-in detail
    // first (→ category grid); else if they're leaving with ZERO places, nudge
    // before letting them go; else leave straight away.
    useImperativeHandle(
      ref,
      () => ({
        handleBack: (onLeave) => {
          if (openCategory) {
            setOpenCategory(null);
            return;
          }
          if (places.length === 0) {
            leaveActionRef.current = onLeave;
            setLeaveVisible(true);
            return;
          }
          onLeave();
        },
      }),
      [openCategory, places.length]
    );

    const canProceed = places.length >= MIN_REQUIRED;
    const atMax = places.length >= MAX_ONBOARDING;

    // Load locations from DB (location_cards). Group by picker_category,
    // sort by picker_sort_order. Section icons + titles + descriptions
    // come from SECTION_META; the location list itself is fully DB-driven.
    useEffect(() => {
      let query = supabase
        .from('location_cards')
        .select('name, display_name, picker_category, picker_sort_order, thumbnail_url, admin_only')
        // is_approved removed 2026-06-06 (Architect audit): vestigial column.
        // picker_category NOT NULL is the real visibility gate.
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
        // Each fat section aggregates the cards from all its picker_categories
        // (2026-08-25: 12 categories folded into 8 broad ones). Within a section,
        // cards keep their per-category order (concatenated in `categories` order).
        const built: LocationSection[] = SECTION_META.map((m) => ({
          id: m.id,
          title: m.title,
          icon: m.icon,
          description: m.description,
          tier: m.tier,
          items: m.categories.flatMap((c) => byCategory.get(c) ?? []),
        })).filter((sec) => sec.items.length > 0);
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

    const selectedInSection = useCallback(
      (section: LocationSection) => section.items.filter((i) => places.includes(i.key)).length,
      [places]
    );

    const confirmReset = useCallback(() => {
      if (places.length > 0) setResetVisible(true);
    }, [places.length]);
    const doReset = useCallback(() => {
      setResetVisible(false);
      if (places.length > 0) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        toggleAllLocations([...places]);
      }
    }, [places, toggleAllLocations]);

    // Section eyebrow — both worlds share ONE uniform, professional treatment:
    // an uppercase letter-spaced label + the brand-gradient rule. Real World and
    // Dream Worlds look equally designed (Kevin 2026-08-29). The only difference is
    // a touch more top space above Dream Worlds so the two groups still read apart.
    const renderSectionHeader = (label: string, dream: boolean) => (
      <View style={[s.sectionHeader, dream && s.sectionHeaderDream]}>
        <Text style={s.sectionLabel}>{label}</Text>
        <LinearGradient
          colors={BRAND_GRADIENT}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={s.sectionRule}
        />
      </View>
    );

    // Level 1 — the whole picker on ONE page (no tabs): a global running total, then
    // two labeled sections (Real World / Dream Worlds) stacked in a single scroll, so
    // the second world can't be missed and the total is obviously global.
    const renderBrowse = () => {
      const realSections = sections.filter((sec) => sec.tier === 'real');
      const dreamSections = sections.filter((sec) => sec.tier === 'imagined');
      return (
        <View style={s.browse}>
          {/* Global running total (across both worlds) + a start-over BUTTON. */}
          <View style={s.summaryBar}>
            <Text style={s.summaryText}>
              <Text style={s.summaryCount}>{places.length}</Text>{' '}
              {places.length === 1 ? 'place' : 'places'} selected
            </Text>
            {places.length > 0 && (
              <TouchableOpacity
                style={s.resetBtn}
                onPress={confirmReset}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                activeOpacity={0.8}
              >
                <Text style={s.resetBtnText}>Reset</Text>
              </TouchableOpacity>
            )}
          </View>

          <ScrollView
            contentContainerStyle={[
              s.scrollContent,
              isEditing && { paddingBottom: verticalScale(20) },
            ]}
            showsVerticalScrollIndicator={false}
          >
            {realSections.length > 0 && (
              <>
                {renderSectionHeader('REAL WORLD', false)}
                <View style={s.catGrid}>{realSections.map(renderCategoryCard)}</View>
              </>
            )}
            {dreamSections.length > 0 && (
              <>
                {renderSectionHeader('DREAM WORLDS', true)}
                <View style={s.catGrid}>{dreamSections.map(renderCategoryCard)}</View>
              </>
            )}
          </ScrollView>
        </View>
      );
    };

    const renderCategoryCard = (section: LocationSection) => {
      const repThumb = section.items.map((i) => thumbnails.get(i.key)).find(Boolean);
      const picks = selectedInSection(section);
      return (
        <TouchableOpacity
          key={section.id}
          style={s.catCard}
          activeOpacity={0.85}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setOpenCategory(section.id);
          }}
        >
          {repThumb ? (
            <ExpoImage
              source={{ uri: repThumb }}
              style={[StyleSheet.absoluteFillObject, s.catImg]}
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
          <LinearGradient
            colors={['rgba(0,0,0,0.15)', 'rgba(0,0,0,0.82)']}
            style={StyleSheet.absoluteFillObject}
          />

          {picks > 0 && (
            <View style={s.catPickBadge}>
              <Ionicons name="heart" size={12} color="#08210E" />
              <Text style={s.catPickText}>{picks}</Text>
            </View>
          )}

          <View style={s.catBody}>
            <Text style={s.catTitle} numberOfLines={1}>
              {section.title}
            </Text>
            <Text style={s.catMeta}>
              {section.items.length} {section.items.length === 1 ? 'place' : 'places'}
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={18}
            color="rgba(255,255,255,0.85)"
            style={s.catChev}
          />
        </TouchableOpacity>
      );
    };

    // Level 3 — one category, all its places, focused.
    const renderDetail = (section: LocationSection) => {
      const sectionKeys = section.items.map((i) => i.key);
      const allSelected = sectionKeys.every((k) => places.includes(k));
      return (
        <ScrollView
          contentContainerStyle={[
            s.scrollContent,
            isEditing && { paddingBottom: verticalScale(20) },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={s.detailHeader}>
            {!hideDetailBack && (
              <TouchableOpacity
                style={s.backBtn}
                activeOpacity={0.7}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setOpenCategory(null);
                }}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            )}
            <View style={s.detailTitleWrap}>
              <Text style={s.detailTitle} numberOfLines={1}>
                {section.title}
              </Text>
            </View>
            <TouchableOpacity
              style={s.pillBtn}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                toggleAllLocations(sectionKeys);
              }}
              activeOpacity={0.8}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={s.pillBtnText}>{allSelected ? 'Deselect all' : 'Select all'}</Text>
            </TouchableOpacity>
          </View>

          <View style={s.tileGrid}>
            {section.items.map((item) => (
              <LocationTile
                key={item.key}
                item={item}
                selected={places.includes(item.key)}
                thumbnailUrl={thumbnails.get(item.key)}
                onToggle={() => handleToggle(item.key)}
              />
            ))}
          </View>
        </ScrollView>
      );
    };

    const openSection = openCategory ? sections.find((sec) => sec.id === openCategory) : null;

    return (
      <View style={shared.root}>
        {/* Sticky header — sits outside the ScrollView so the grid scrolls under it.
          Hidden while drilled into a category so that view's own header owns the top
          (avoids a stacked second prompt above the category name). */}
        {!openSection && (
          <View style={s.stickyHeader}>
            {/* In Settings the gradient wordmark is the nav-bar title, so demote this to
            plain text; onboarding keeps the gradient hero. */}
            {isEditing ? (
              <TitleText
                size={18}
                color={colors.bodyOnDark}
                numberOfLines={2}
                align="center"
                style={{
                  marginBottom: verticalScale(6),
                  maxWidth: SCREEN_WIDTH - TILE_PADDING * 2,
                }}
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
          </View>
        )}

        {openSection ? renderDetail(openSection) : renderBrowse()}

        {!isEditing && (
          <OnboardingFooter
            onNext={onNext}
            onBack={onBack}
            disabled={!canProceed}
            counter={places.length > 0 ? `${places.length} selected` : 'None selected'}
            counterMet={canProceed}
          />
        )}

        <ConfirmDialog
          visible={resetVisible}
          title="Start over?"
          message={`This clears all ${places.length} selected place${places.length === 1 ? '' : 's'}`}
          confirmLabel="Reset"
          onConfirm={doReset}
          onCancel={() => setResetVisible(false)}
        />

        <ConfirmDialog
          visible={leaveVisible}
          title="Leave without any places?"
          message="Your dreams are way more fun with places to dream about. Pick at least one and your nightly dreams get a whole lot more interesting."
          confirmLabel="Leave anyway"
          cancelLabel="Keep choosing"
          onConfirm={() => {
            setLeaveVisible(false);
            const go = leaveActionRef.current;
            leaveActionRef.current = null;
            go?.();
          }}
          onCancel={() => setLeaveVisible(false)}
        />
      </View>
    );
  }
);

const s = StyleSheet.create({
  scrollContent: {
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(16),
    paddingHorizontal: TILE_PADDING,
  },

  stickyHeader: {
    paddingHorizontal: TILE_PADDING,
    paddingTop: verticalScale(8),
    paddingBottom: verticalScale(12),
    backgroundColor: colors.background,
  },

  browse: { flex: 1 },

  // Global running total (across BOTH worlds) + a start-over BUTTON, above the tabs
  // so it reads as the overall selection, not the active tab's count.
  summaryBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: TILE_PADDING,
    marginTop: verticalScale(6),
    marginBottom: verticalScale(12),
  },
  // Summary — bigger + brighter so the running total reads clearly (Kevin 2026-08-29:
  // the old dim grey "hid up there"). The count is a bold teal focal number.
  summaryText: { fontSize: fontScale(15.5), fontWeight: '600', color: colors.bodyOnDark },
  summaryCount: { fontSize: fontScale(17), color: '#5EEAD4', fontWeight: '900' },
  // Reset — a real (muted) button so it doesn't blend into the background.
  resetBtn: {
    paddingHorizontal: horizontalScale(14),
    paddingVertical: verticalScale(6),
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  resetBtnText: { fontSize: fontScale(12.5), fontWeight: '700', color: colors.bodyOnDark },

  // Level 1 — section eyebrow header. An uppercase letter-spaced label + a rule
  // that runs to the edge. Real World = neutral; Dream Worlds = brand-gradient rule
  // + brighter label, with extra top space, so the two worlds read as distinct.
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: horizontalScale(10),
    marginHorizontal: TILE_PADDING,
    marginTop: verticalScale(4),
    marginBottom: verticalScale(12),
  },
  sectionHeaderDream: { marginTop: verticalScale(24) },
  // One uniform label + gradient rule for both worlds (professional + on-brand).
  sectionLabel: {
    fontSize: fontScale(12.5),
    fontWeight: '800',
    letterSpacing: 1.6,
    color: 'rgba(255,255,255,0.72)',
  },
  sectionRule: { flex: 1, height: 2, borderRadius: 999, opacity: 0.85 },

  // Level 2 — category cards.
  catGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: TILE_GAP,
  },
  catCard: {
    width: TILE_WIDTH,
    height: CAT_CARD_HEIGHT,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: colors.accentBorder,
  },
  catImg: { opacity: 0.62 },
  catBody: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 12,
  },
  catTitle: {
    fontSize: fontScale(15),
    fontWeight: '800',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  catMeta: {
    fontSize: fontScale(12),
    color: 'rgba(255,255,255,0.85)',
    marginTop: verticalScale(1),
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  catPickBadge: {
    position: 'absolute',
    top: 9,
    right: 9,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: horizontalScale(8),
    paddingVertical: verticalScale(3),
    borderRadius: 999,
    backgroundColor: '#5EEAD4',
  },
  catPickText: { fontSize: fontScale(12), fontWeight: '800', color: '#08210E' },
  catChev: { position: 'absolute', bottom: 12, right: 12 },

  // Level 3 — category detail header.
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: verticalScale(14),
  },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.accentBorder,
  },
  detailTitleWrap: { flex: 1, minWidth: 0 },
  detailTitle: { fontSize: fontScale(18), fontWeight: '800', color: '#FFFFFF' },
  detailDesc: { fontSize: fontScale(13), color: colors.subtleOnDark, marginTop: verticalScale(1) },

  // Select all / Deselect all — a real (accent) button, not blend-in text.
  pillBtn: {
    paddingHorizontal: horizontalScale(14),
    paddingVertical: verticalScale(6),
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(167,139,250,0.55)',
    backgroundColor: 'rgba(167,139,250,0.16)',
  },
  pillBtnText: { fontSize: fontScale(12.5), fontWeight: '700', color: '#C4B5FD' },

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
});
