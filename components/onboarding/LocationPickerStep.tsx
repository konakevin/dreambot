import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
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
import MaskedView from '@react-native-masked-view/masked-view';
import { GradientTitle, TITLE_SIZE, BRAND_GRADIENT } from '@/components/GradientTitle';
import { displayFontFamily } from '@/constants/fonts';
import { TitleText } from '@/components/TitleText';
import { OnboardingFooter } from './OnboardingFooter';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { supabase } from '@/lib/supabase';

const MIN_REQUIRED = 1;
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TILE_GAP = 10;
const TILE_PADDING = 20;
// Two tiles per row, edge-to-edge across the content area.
const TILE_WIDTH = Math.floor((SCREEN_WIDTH - TILE_PADDING * 2 - TILE_GAP) / 2);
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
// 12 sections rendered on ONE page under two labeled worlds (no tabs) — 6 Real,
// 6 Dream. Most map 1:1 to a picker_category; "Around the World" fuses cities +
// countries + the single World Wonders card. See LOCATION_REORG_PLAN.md.
const SECTION_META: SectionMeta[] = [
  // ── Real World (6) ───────────────────────────────────────────
  {
    id: 'around_the_world',
    title: 'World Traveler',
    icon: 'earth-outline',
    description: 'Cities, countries, coasts, and the world’s great wonders',
    tier: 'real',
    categories: ['iconic_cities', 'countries_cultures', 'landmarks_wonders', 'coastal_escapes'],
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
  {
    id: 'high_life',
    title: 'Jet Set',
    icon: 'diamond-outline',
    description: 'Superyachts, penthouses, red carpets, and champagne',
    tier: 'real',
    categories: ['high_life'],
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
    title: 'Heroes',
    icon: 'flash-outline',
    description: 'Rooftops, spy lairs, and daring feats',
    tier: 'imagined',
    categories: ['heroes_adventure'],
  },
];

interface Props {
  onNext: () => void;
  onBack: () => void;
}

/** Imperative handle so a host header's back chevron routes through the picker. */
export interface LocationPickerHandle {
  /** Handle a host back-press. If leaving with ZERO places selected, shows a gentle
   *  confirm and only runs onLeave if confirmed; otherwise runs onLeave immediately. */
  handleBack: (onLeave: () => void) => void;
}

export const LocationPickerStep = forwardRef<LocationPickerHandle, Props>(
  function LocationPickerStep({ onNext, onBack }: Props, ref) {
    const places = useOnboardingStore((st) => st.profile.dream_seeds.places);
    const toggleAllLocations = useOnboardingStore((st) => st.toggleAllLocations);
    const isEditing = useOnboardingStore((st) => st.isEditing);
    // Dark-launch gate (mig 444): admins see admin_only cards for QA; regular users don't.
    const isAdmin = useAuthStore((st) => st.isAdmin);
    const [thumbnails, setThumbnails] = useState<Map<string, string>>(new Map());
    const [sections, setSections] = useState<LocationSection[]>([]);
    // Gentle "leaving with nothing picked?" confirm — stashes the host's leave
    // action until they confirm.
    const [leaveVisible, setLeaveVisible] = useState(false);
    const leaveActionRef = useRef<(() => void) | null>(null);

    // A host header's back chevron routes through here: if they're leaving with
    // ZERO places, nudge before letting them go; else leave straight away. (No more
    // drill-in to pop — the picker is a single tile grid now.)
    useImperativeHandle(
      ref,
      () => ({
        handleBack: (onLeave) => {
          if (places.length === 0) {
            leaveActionRef.current = onLeave;
            setLeaveVisible(true);
            return;
          }
          onLeave();
        },
      }),
      [places.length]
    );

    const canProceed = places.length >= MIN_REQUIRED;
    // Count SELECTED CATEGORIES, not individual places (2026-08-29 Kevin): a tap
    // selects a whole category, so "91 places" read as confusing — "4 categories"
    // matches what the user actually did. A category counts when every location in
    // it is picked.
    const selectedCategoryCount = sections.filter(
      (sec) => sec.items.length > 0 && sec.items.every((i) => places.includes(i.key))
    ).length;

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

    // MIGRATION to the tile = WHOLE-SECTION paradigm (2026-08-31, Kevin). Legacy users
    // saved a SUBSET of a category; the new picker is all-or-nothing, so a partial pick
    // can't be represented and its tile would read unselected. On first load, round any
    // PARTIALLY-selected section (some but not all of its cards selected) up to the full
    // section, so the tile reads selected and nightly draws the whole category. The
    // store auto-save persists it. This is the single source of truth for the migration:
    // it reuses the picker's own SECTION_META + live card list, so it can NEVER disagree
    // with what lights up a tile. Self-idempotent — a full section has nothing to round
    // up and the UI can't create new partials, so it no-ops on every later view. Only
    // touches LIVE sections (non-admins only load admin_only=false cards), so it respects
    // go-live automatically: a still-dark section isn't in `sections` and is left alone.
    const normalizedRef = useRef(false);
    useEffect(() => {
      if (normalizedRef.current || sections.length === 0) return;
      normalizedRef.current = true;
      for (const sec of sections) {
        const keys = sec.items.map((i) => i.key);
        if (keys.length === 0) continue;
        const current = useOnboardingStore.getState().profile.dream_seeds.places;
        const hasAny = keys.some((k) => current.includes(k));
        const hasAll = keys.every((k) => current.includes(k));
        if (hasAny && !hasAll) toggleAllLocations(keys); // complete the partial → full
      }
    }, [sections, toggleAllLocations]);

    // Section eyebrow — a CENTERED "———— REAL WORLD ————" divider where ONE brand
    // gradient sweeps continuously across the left rule, the text, and the right rule
    // as a single unit (Kevin 2026-08-29). Done with a MaskedView: the gradient fills
    // the full row and shows through the mask (two flex lines + the label glyphs).
    const renderSectionHeader = (label: string, dream: boolean) => (
      <View style={[s.sectionHeader, dream && s.sectionHeaderDream]}>
        <MaskedView
          style={s.sectionMask}
          maskElement={
            <View style={s.sectionMaskRow}>
              <View style={s.sectionMaskLine} />
              <Text style={s.sectionMaskLabel} numberOfLines={1}>
                {label}
              </Text>
              <View style={s.sectionMaskLine} />
            </View>
          }
        >
          <LinearGradient
            colors={BRAND_GRADIENT}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </MaskedView>
      </View>
    );

    // Level 1 — the whole picker on ONE page (no tabs): a global running total, then
    // two labeled sections (Real World / Dream Worlds) stacked in a single scroll, so
    // the second world can't be missed and the total is obviously global.
    const renderBrowse = () => {
      const realSections = sections.filter((sec) => sec.tier === 'real');
      const dreamSections = sections.filter((sec) => sec.tier === 'imagined');
      // One toggle covers both bulk cases (Kevin 2026-08-29): when everything is
      // picked it says "Select none" and clears; otherwise "Select all" and fills.
      // toggleAllLocations(allKeys) already does both directions in one call.
      const allKeys = sections.flatMap((sec) => sec.items.map((i) => i.key));
      const allSelected = allKeys.length > 0 && allKeys.every((k) => places.includes(k));
      return (
        <View style={s.browse}>
          {/* Running total + Select all/none toggle. In onboarding the footer already
              shows "N selected", so hide the count here (Kevin 2026-08-29) — an empty
              spacer keeps the toggle right-aligned. Settings has no footer, so it keeps
              the count. */}
          <View style={s.summaryBar}>
            {isEditing ? (
              <Text style={s.summaryText}>
                <Text style={s.summaryCount}>{selectedCategoryCount}</Text>{' '}
                {selectedCategoryCount === 1 ? 'category' : 'categories'} selected
              </Text>
            ) : (
              <View />
            )}
            {allKeys.length > 0 && (
              <TouchableOpacity
                style={s.resetBtn}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  toggleAllLocations(allKeys);
                }}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                activeOpacity={0.8}
              >
                <Text style={s.resetBtnText}>{allSelected ? 'Select none' : 'Select all'}</Text>
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

    // A category tile IS the selection unit (2026-08-29 Kevin): tapping it selects
    // the WHOLE category (every location inside), tapping again clears it — no more
    // drill-in. Selected = every location in the category is picked; shown with a
    // teal-green highlighted border + a check badge. Title only — no subtitle
    // (the title is descriptive enough, Kevin 2026-08-29).
    const renderCategoryCard = (section: LocationSection) => {
      const repThumb = section.items.map((i) => thumbnails.get(i.key)).find(Boolean);
      const sectionKeys = section.items.map((i) => i.key);
      const selected = sectionKeys.length > 0 && sectionKeys.every((k) => places.includes(k));
      return (
        <TouchableOpacity
          key={section.id}
          style={[s.catCard, selected && s.catCardSelected]}
          activeOpacity={0.85}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            toggleAllLocations(sectionKeys);
          }}
        >
          {repThumb ? (
            <ExpoImage
              source={{ uri: repThumb }}
              // Selected tiles read brighter, unselected recede — the CONTRAST (not a
              // loud border) draws the eye, so a screen full of picks stays calm.
              style={[StyleSheet.absoluteFillObject, { opacity: selected ? 0.92 : 0.5 }]}
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

          {selected && (
            <View style={s.catSelectedBadge}>
              <Ionicons name="checkmark-sharp" size={15} color="#08210E" />
            </View>
          )}

          <View style={s.catBody}>
            <Text style={s.catTitle} numberOfLines={1}>
              {section.title}
            </Text>
          </View>
        </TouchableOpacity>
      );
    };

    return (
      <View style={shared.root}>
        {/* Sticky header — sits outside the ScrollView so the grid scrolls under it. */}
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
          {/* Onboarding-only gentle intro under the title (Kevin 2026-08-29). */}
          {!isEditing && (
            <Text style={s.headerSubtitle}>Pick the places you’d love your dreams to take you</Text>
          )}
        </View>

        {renderBrowse()}

        {!isEditing && (
          <OnboardingFooter
            onNext={onNext}
            onBack={onBack}
            disabled={!canProceed}
            counter={
              selectedCategoryCount > 0 ? `${selectedCategoryCount} selected` : 'Pick at least 1'
            }
            counterMet={canProceed}
          />
        )}

        <ConfirmDialog
          visible={leaveVisible}
          title="Leave without any favorites?"
          message="Your dreams are more fun with some of your favorite locations as the setting!"
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
  headerSubtitle: {
    fontSize: fontScale(14),
    lineHeight: fontScale(20),
    color: colors.subtleOnDark,
    textAlign: 'center',
    marginTop: verticalScale(2),
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
  // No marginHorizontal — the header lives inside the ScrollView's already-padded
  // content (scrollContent), so it aligns with the grid; a second margin would
  // double-inset it and push the fixed-width mask off-center.
  sectionHeader: {
    marginTop: verticalScale(4),
    marginBottom: verticalScale(12),
  },
  sectionHeaderDream: { marginTop: verticalScale(24) },
  // Centered "——— LABEL ———" divider — one gradient (behind) shows through this
  // mask (two flex rules + the label glyphs), so it reads as a single unit. Fills
  // the padded content width so the two lines stay symmetric and the label centers.
  sectionMask: { width: '100%', height: fontScale(24) },
  sectionMaskRow: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  sectionMaskLine: { flex: 1, height: 2, borderRadius: 999, backgroundColor: '#FFFFFF' },
  sectionMaskLabel: {
    color: '#FFFFFF',
    fontFamily: displayFontFamily(800),
    fontSize: fontScale(13.5),
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    marginHorizontal: horizontalScale(12),
  },

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
  // Whole-category selected: a THIN refined teal border (the brightened tile does
  // the heavy lifting, so the border can be light — calmer than a thick outline).
  catCardSelected: {
    borderColor: '#5EEAD4',
    borderWidth: 1.5,
  },
  // Check badge — teal green, matching the selected border.
  catSelectedBadge: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 24,
    height: 24,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5EEAD4',
  },
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
});
