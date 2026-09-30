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
import { showAlert } from '@/components/CustomAlert';
import { supabase } from '@/lib/supabase';
import { hasRequiredPlaces } from '@/lib/placeRequirement';
import {
  buildPickerSections,
  groupPickerSections,
  isWideTile,
  tileImageKey,
  type PickerSection,
} from '@/lib/pickerSections';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TILE_GAP = 10;
const TILE_PADDING = 20;
// Two tiles per row, edge-to-edge across the content area.
const TILE_WIDTH = Math.floor((SCREEN_WIDTH - TILE_PADDING * 2 - TILE_GAP) / 2);
const CAT_CARD_HEIGHT = verticalScale(118);

// Neutral dark gradient used as a tile placeholder when a location has no
// thumbnail URL.
const PLACEHOLDER_GRADIENT: [string, string] = [colors.surface, colors.background];

interface Props {
  onNext: () => void;
  onBack: () => void;
}

/** Imperative handle so a host header's back chevron routes through the picker. */
export interface LocationPickerHandle {
  /** Handle a host back-press. With ZERO places selected it stays put and asks for one
   *  (every dream is set in a place the user chose); otherwise runs onLeave immediately. */
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
    const [sections, setSections] = useState<PickerSection[]>([]);

    // A host header's back chevron routes through here. At least one place is REQUIRED (Kevin
    // 2026-09-30: every nightly is set in a place the user chose, so zero means no dreams to set):
    // with none picked they stay here, the same rule onboarding's disabled Continue enforces.
    useImperativeHandle(
      ref,
      () => ({
        handleBack: (onLeave) => {
          if (!hasRequiredPlaces(places)) {
            showAlert(
              'Pick at least one place',
              'Your dreams are set in the places you choose, so keep at least one.',
              [{ text: 'Keep choosing' }]
            );
            return;
          }
          onLeave();
        },
      }),
      [places]
    );

    const canProceed = hasRequiredPlaces(places);
    // Count SELECTED CATEGORIES, not individual places (2026-08-29 Kevin): a tap
    // selects a whole category, so "91 places" read as confusing — "4 categories"
    // matches what the user actually did. A category counts when every location in
    // it is picked.
    const selectedCategoryCount = sections.filter(
      (sec) => sec.items.length > 0 && sec.items.every((i) => places.includes(i.key))
    ).length;

    // Load the tiles (picker_tiles, mig 592) and the cards (location_cards.picker_tile), then group them
    // (lib/pickerSections.ts). Tiles come from the DB so a new one needs no release; if the tile table can't be
    // read, the picker falls back to the tiles this app used to hard-code, grouped by picker_category.
    useEffect(() => {
      let live = true;
      const load = async () => {
        let cardsQuery = supabase
          .from('location_cards')
          .select(
            'name, display_name, picker_category, picker_tile, picker_sort_order, thumbnail_url, admin_only'
          )
          // is_approved removed 2026-06-06 (Architect audit): vestigial column.
          // picker_category NOT NULL is the real visibility gate.
          .not('picker_category', 'is', null);
        // Dark launch (mig 444): non-admins never see admin_only cards; admins see all.
        if (!isAdmin) cardsQuery = cardsQuery.eq('admin_only', false);
        const [cardsRes, tilesRes] = await Promise.all([
          cardsQuery.order('picker_sort_order'),
          supabase
            .from('picker_tiles')
            .select('key, title, description, icon, tier, sort_order, admin_only, section')
            .eq('is_active', true),
        ]);
        if (!live || !cardsRes.data) {
          if (__DEV__ && cardsRes.error)
            console.warn('[LocationPicker] cards load failed', cardsRes.error.message);
          return;
        }
        if (__DEV__ && tilesRes.error)
          console.warn(
            '[LocationPicker] tiles load failed, using built-in tiles',
            tilesRes.error.message
          );
        const thumbMap = new Map<string, string>();
        for (const row of cardsRes.data)
          if (row.thumbnail_url) thumbMap.set(row.name, row.thumbnail_url);
        setSections(buildPickerSections(cardsRes.data, tilesRes.data ?? null, isAdmin));
        setThumbnails(thumbMap);
      };
      void load();
      return () => {
        live = false;
      };
    }, [isAdmin]);

    // MIGRATION to the tile = WHOLE-SECTION paradigm (2026-08-31, Kevin). Legacy users
    // saved a SUBSET of a category; the new picker is all-or-nothing, so a partial pick
    // can't be represented and its tile would read unselected. On first load, round any
    // PARTIALLY-selected section (some but not all of its cards selected) up to the full
    // section, so the tile reads selected and nightly draws the whole category. The
    // store auto-save persists it. This is the single source of truth for the migration:
    // it reuses the picker's own tiles + live card list, so it can NEVER disagree
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
    const renderSectionHeader = (label: string, later: boolean) => (
      <View key={`h-${label}`} style={[s.sectionHeader, later && s.sectionHeaderLater]}>
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

    // Level 1 — the whole picker on ONE page (no tabs): a global running total, then the
    // tiles under short mood headers (Around the World, Sun & Sea, Magic & Wonder...;
    // picker_tiles.section, mig 621; Kevin 2026-09-30 retired the Real World / Dream Worlds
    // binary). A group with an odd count gives its last tile the full width instead of a hole.
    const renderBrowse = () => {
      const groups = groupPickerSections(sections);
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
            {groups.map((g, gi) => (
              <View key={g.title}>
                {renderSectionHeader(g.title, gi > 0)}
                <View style={s.catGrid}>
                  {g.sections.map((sec, i) =>
                    renderCategoryCard(sec, isWideTile(i, g.sections.length))
                  )}
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      );
    };

    // A category tile IS the selection unit (2026-08-29 Kevin): tapping it selects
    // the WHOLE category (every location inside), tapping again clears it — no more
    // drill-in. Selected = every location in the category is picked; shown with a
    // teal-green highlighted border + a check badge. Title only — no subtitle
    // (the title is descriptive enough, Kevin 2026-08-29).
    const renderCategoryCard = (section: PickerSection, wide = false) => {
      const leadKey = tileImageKey(section.items, thumbnails);
      const repThumb = leadKey ? thumbnails.get(leadKey) : undefined;
      const sectionKeys = section.items.map((i) => i.key);
      const selected = sectionKeys.length > 0 && sectionKeys.every((k) => places.includes(k));
      return (
        <TouchableOpacity
          key={section.id}
          style={[s.catCard, wide && s.catCardWide, selected && s.catCardSelected]}
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
            <Text style={s.catTitle} numberOfLines={2}>
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

  // Level 1 — group eyebrow header (one per mood group). An uppercase letter-spaced
  // label + a brand-gradient rule; every group after the first gets extra top space.
  // No marginHorizontal — the header lives inside the ScrollView's already-padded
  // content (scrollContent), so it aligns with the grid; a second margin would
  // double-inset it and push the fixed-width mask off-center.
  sectionHeader: {
    marginTop: verticalScale(4),
    marginBottom: verticalScale(12),
  },
  sectionHeaderLater: { marginTop: verticalScale(24) },
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
  // The last tile of an odd-sized group spans the row (no empty cell).
  catCardWide: { width: TILE_WIDTH * 2 + TILE_GAP },
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
