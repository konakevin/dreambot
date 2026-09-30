import { useState, useEffect, useMemo, useRef, forwardRef, useImperativeHandle } from 'react';
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
import { GradientTitle, TITLE_SIZE } from '@/components/GradientTitle';
import { displayFontFamily } from '@/constants/fonts';
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
  /** Settings puts Select all in its nav bar: the picker reports whether it applies and which way it points. */
  onSelectAllChange?: (state: { available: boolean; allSelected: boolean }) => void;
}

/** Imperative handle so a host header's back chevron routes through the picker. */
export interface LocationPickerHandle {
  /** Handle a host back-press. With ZERO places selected it stays put and asks for one
   *  (every dream is set in a place the user chose); otherwise runs onLeave immediately. */
  handleBack: (onLeave: () => void) => void;
  /** Select every place, or none when all are already selected (the host's Select all button). */
  toggleAll: () => void;
}

export const LocationPickerStep = forwardRef<LocationPickerHandle, Props>(
  function LocationPickerStep({ onNext, onBack, onSelectAllChange }: Props, ref) {
    const places = useOnboardingStore((st) => st.profile.dream_seeds.places);
    const toggleAllLocations = useOnboardingStore((st) => st.toggleAllLocations);
    const isEditing = useOnboardingStore((st) => st.isEditing);
    // Dark-launch gate (mig 444): admins see admin_only cards for QA; regular users don't.
    const isAdmin = useAuthStore((st) => st.isAdmin);
    const [thumbnails, setThumbnails] = useState<Map<string, string>>(new Map());
    const [sections, setSections] = useState<PickerSection[]>([]);
    // Every place on the page, and whether all of them are picked (the Select all / none toggle).
    const allKeys = useMemo(
      () => sections.flatMap((sec) => sec.items.map((i) => i.key)),
      [sections]
    );
    const allSelected = allKeys.length > 0 && allKeys.every((k) => places.includes(k));

    // A host header's back chevron routes through here. At least one place is REQUIRED (Kevin
    // 2026-09-30: every nightly is set in a place the user chose, so zero means no dreams to set):
    // with none picked they stay here, the same rule onboarding's disabled Continue enforces.
    useImperativeHandle(
      ref,
      () => ({
        handleBack: (onLeave) => {
          if (!hasRequiredPlaces(places)) {
            showAlert(
              'Choose a place first',
              'Every dream is set in the places you pick, so choose at least one tile before you go.',
              [{ text: 'Got it' }]
            );
            return;
          }
          onLeave();
        },
        toggleAll: () => {
          if (!allKeys.length) return;
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          toggleAllLocations(allKeys);
        },
      }),
      [places, allKeys, toggleAllLocations]
    );
    useEffect(() => {
      onSelectAllChange?.({ available: allKeys.length > 0, allSelected });
    }, [onSelectAllChange, allKeys.length, allSelected]);

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

    // Group label (Kevin 2026-09-30: the gradient banners were "so loud that they almost drown out" the tiles): small
    // grey caps, left-aligned like a list label, no gradient and no rules. Spacing between groups does the separating;
    // the tiles and their images carry the colour.
    const renderSectionHeader = (label: string, later: boolean) => (
      <Text
        key={`h-${label}`}
        style={[s.groupLabel, later && s.groupLabelLater]}
        numberOfLines={1}
        accessibilityRole="header"
      >
        {label}
      </Text>
    );

    // Level 1 — the whole picker on ONE page (no tabs): a global running total, then the
    // tiles under short mood headers (Around the World, Sun & Sea, Magic & Wonder...;
    // picker_tiles.section, mig 621; Kevin 2026-09-30 retired the Real World / Dream Worlds
    // binary). A group with an odd count gives its last tile the full width instead of a hole.
    const renderBrowse = () => {
      const groups = groupPickerSections(sections);
      return (
        <View style={s.browse}>
          {/* Onboarding: the hint and Select all share one row (Kevin 2026-09-30: a first-time user can't tell a tile
              picks every place inside it). Settings shows neither: its nav bar carries Select all (onSelectAllChange +
              toggleAll), so the tiles start right under the header. */}
          {!isEditing && (
            <View style={s.summaryBar}>
              <Text style={s.hint} numberOfLines={2}>
                Tap a tile to add every place in it
              </Text>
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
          )}

          <ScrollView
            contentContainerStyle={[
              s.scrollContent,
              isEditing && { paddingBottom: verticalScale(20) },
            ]}
            showsVerticalScrollIndicator={false}
          >
            {groups.map((g, gi) => (
              <View key={g.title} style={gi > 0 ? s.groupBlockLater : undefined}>
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
              style={[StyleSheet.absoluteFillObject, { opacity: selected ? 0.92 : 0.72 }]}
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
        {/* Sticky header (onboarding only) — sits outside the ScrollView so the grid scrolls under it. Left-aligned to
            the grid's edge (Kevin 2026-09-30). Settings has its own "Locations" nav title, so it shows none. */}
        {!isEditing && (
          <View style={s.stickyHeader}>
            <GradientTitle
              size={TITLE_SIZE.page}
              numberOfLines={2}
              align="left"
              maxWidth={SCREEN_WIDTH - TILE_PADDING * 2}
              style={{ marginBottom: verticalScale(6) }}
            >
              Where do you want to dream?
            </GradientTitle>
            {/* Gentle intro under the title (Kevin 2026-08-29). */}
            <Text style={s.headerSubtitle}>Pick the places you’d love your dreams to take you</Text>
          </View>
        )}

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
    textAlign: 'left',
    marginTop: verticalScale(2),
  },
  hint: {
    flex: 1,
    marginRight: horizontalScale(12),
    fontSize: fontScale(13),
    lineHeight: fontScale(18),
    color: colors.textSecondary,
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

  // Level 1 — group label (one per mood group): quiet, so the tiles lead.
  groupLabel: {
    color: colors.subtleOnDark,
    fontFamily: displayFontFamily(700),
    fontSize: fontScale(11.5),
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    marginTop: verticalScale(2),
    marginBottom: verticalScale(8),
  },
  groupLabelLater: { marginTop: 0 },
  // Groups need clearly more air than the rows inside them (10pt), plus a faint rule, to read as groups without
  // a loud header (Kevin 2026-09-30: after the quiet labels "the sections don't really feel separate enough").
  groupBlockLater: {
    marginTop: verticalScale(26),
    paddingTop: verticalScale(18),
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
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
