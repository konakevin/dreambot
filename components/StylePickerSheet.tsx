/**
 * StylePickerSheet — animated bottom sheet for selecting a medium (style) or vibe.
 * Reuses the QuickSettingsSheet pattern (Reanimated + Gesture Handler).
 * Dismisses on selection or drag-down.
 *
 * The MEDIUM picker is split into two sections via a segmented toggle:
 *   • Real Face (teal)  — face-swap mediums (face_swaps === true)
 *   • Dream Art (pink)  — art mediums (face_swaps === false)
 * Each section has its OWN "Surprise Me" on top that rolls ONLY within that
 * section: Real Face → `surprise_me_face` (face mediums only), Dream Art →
 * `surprise_me_art` (art mediums only). The roll itself lives in
 * useDreamCreate (the token → a concrete medium at submit). Each tab remembers
 * its last pick (sticky), and the toggle auto-syncs to the current selection
 * when the sheet opens. The VIBE picker has no split — one flat list.
 */

import { useCallback, useRef, useEffect, useMemo, useState } from 'react';
import { View, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Text } from '@/components/AppText';
import { TitleText } from '@/components/TitleText';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  interpolate,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, MEDIUM_BADGE } from '@/constants/theme';
import { verticalScale, horizontalScale, fontScale, isTabletDevice } from '@/lib/responsive';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
// iPad: constrain the whole drawer to a centered ~600 card (not a full-width
// edge-to-edge sheet); phones keep the full-width drawer.
const SHEET_SIDE_INSET = isTabletDevice ? Math.max(0, (SCREEN_WIDTH - 600) / 2) : 0;
// On smaller phones (iPhone SE class) bump the sheet to 60% so 6+ options
// don't get clipped behind the rounded bottom. Larger phones stay at 50%.
const SHEET_HEIGHT = SCREEN_HEIGHT < 700 ? SCREEN_HEIGHT * 0.6 : SCREEN_HEIGHT * 0.5;

// Subtle, mode-agnostic fill/outline for the selected row + active tab. The
// COLOR meaning (teal = Real Face, pink = Dream Art) lives only in the text +
// checkmark, never the fill/outline.
const HILITE_BG = 'rgba(255,255,255,0.05)';
const HILITE_BORDER = 'rgba(255,255,255,0.16)';

type Segment = 'face' | 'art';

interface StyleOption {
  key: string;
  label: string;
  face_swaps?: boolean;
  /** Short DB-authored blurb (dream_mediums/dream_vibes.description). */
  description?: string;
  /** Optional segment-lock badge (e.g. a Dream-Art-only vibe like Kawaii). The
   *  segment colors the pill (teal = Real Face, pink = Dream Art). */
  badge?: { label: string; segment: Segment };
}

interface Props {
  visible: boolean;
  type: 'medium' | 'vibe';
  selected: string;
  onSelect: (key: string) => void;
  onClose: () => void;
  /** Full list of available options (from DB) */
  options: StyleOption[];
}

/** Which segment a selection belongs to. Legacy unified `surprise_me` → face. */
function segmentForSelection(key: string, options: StyleOption[]): Segment {
  if (key === 'surprise_me_art') return 'art';
  if (key === 'surprise_me_face' || key === 'surprise_me') return 'face';
  return options.find((o) => o.key === key)?.face_swaps === false ? 'art' : 'face';
}

export function StylePickerSheet({
  visible,
  type,
  selected,
  onSelect,
  onClose,
  options: allAvailable,
}: Props) {
  const insets = useSafeAreaInsets();
  const progress = useSharedValue(0);
  const dragY = useSharedValue(0);
  const closing = useRef(false);
  const scrollRef = useRef<ScrollView>(null);

  // Active medium segment. Seeded from the current selection; re-synced on open.
  const [mediumSegment, setMediumSegment] = useState<Segment>(() =>
    segmentForSelection(selected, allAvailable)
  );
  // Sticky per-tab selections — each tab remembers the last medium picked on it.
  const [lastFace, setLastFace] = useState<string>('surprise_me_face');
  const [lastArt, setLastArt] = useState<string>('surprise_me_art');

  // The teal/pink accent for the CURRENT medium segment (vibe sheet stays neutral).
  const segAccent = mediumSegment === 'face' ? MEDIUM_BADGE.face.color : MEDIUM_BADGE.art.color;

  // Vibe list: Surprise Me first, then A–Z. (Vibes have no face/art split.)
  const vibeOptions = useMemo(
    () =>
      [...allAvailable].sort((a, b) => {
        if (a.key === 'surprise_me') return -1;
        if (b.key === 'surprise_me') return 1;
        return a.label.localeCompare(b.label);
      }),
    [allAvailable]
  );

  // Medium lists, split by face_swaps and A–Z sorted within each section.
  const faceSwapMediums = useMemo(
    () =>
      allAvailable
        .filter((o) => o.key !== 'surprise_me' && o.face_swaps === true)
        .sort((a, b) => a.label.localeCompare(b.label)),
    [allAvailable]
  );
  const artisticMediums = useMemo(
    () =>
      allAvailable
        .filter((o) => o.key !== 'surprise_me' && o.face_swaps === false)
        .sort((a, b) => a.label.localeCompare(b.label)),
    [allAvailable]
  );
  const filteredMediums = mediumSegment === 'face' ? faceSwapMediums : artisticMediums;

  // The displayed medium list = the section's own Surprise Me + that section's
  // mediums. The surprise key is what makes the roll section-scoped.
  const mediumDisplayList = useMemo<StyleOption[]>(
    () => [
      {
        key: mediumSegment === 'face' ? 'surprise_me_face' : 'surprise_me_art',
        label: 'Surprise Me',
      },
      ...filteredMediums,
    ],
    [mediumSegment, filteredMediums]
  );

  const displayList = type === 'medium' ? mediumDisplayList : vibeOptions;

  // Animate in on open / out on close — in an EFFECT, not the render body. The
  // old render-body `if (visible && progress.value === 0) progress = withTiming(1)`
  // re-fired on ANY re-render that landed the frame `progress` hit 0 during the
  // dismiss animation — and selecting a style re-renders the parent (persistMedium
  // + the return-to-Create rehydrate cycle). That REOPENED the sheet mid-close and
  // then stranded it: visible=false but progress>0, so the render gate never
  // unmounted and the full-screen backdrop stayed mounted with pointerEvents
  // 'auto', freezing the whole Create screen (Kevin 2026-07-19: "dream → queue →
  // back → pick style → frozen"). Keying on `visible` opens only on a real
  // closed→open transition, so a mid-dismiss re-render can't reopen it.
  useEffect(() => {
    if (visible) {
      closing.current = false;
      progress.value = withTiming(1, { duration: 300 });
    } else {
      // Parent closed us (onClose, or a hand-off like "dream again") — animate out
      // so the render gate unmounts and the backdrop stops capturing touches.
      progress.value = withTiming(0, { duration: 250 });
    }
  }, [visible, progress]);

  // Sync the segment + sticky state to `selected` ONLY on the closed→open
  // transition — NOT when `selected` changes during the dismiss animation
  // (handleSelect updates `selected` then closes while `visible` is briefly
  // still true), which would re-sync the segment mid-close.
  const didSyncOnOpen = useRef(false);
  useEffect(() => {
    if (!visible) {
      didSyncOnOpen.current = false;
      return;
    }
    if (didSyncOnOpen.current || type !== 'medium') return;
    didSyncOnOpen.current = true;
    const seg = segmentForSelection(selected, allAvailable);
    setMediumSegment(seg);
    if (seg === 'face') setLastFace(selected === 'surprise_me' ? 'surprise_me_face' : selected);
    else setLastArt(selected);
  }, [visible, type, selected, allAvailable]);

  // Latest `selected` for the scroll-to-selected effect. Kept in a ref so that
  // effect does NOT re-run and re-scroll when `selected` changes during the
  // dismiss animation — only visible / segment / list changes should scroll.
  const selectedRef = useRef(selected);
  selectedRef.current = selected;

  const dismiss = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    progress.value = withTiming(0, { duration: 250 }, () => {
      runOnJS(onClose)();
    });
  }, [onClose, progress]);

  const handleSelect = useCallback(
    (key: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      if (type === 'medium') {
        if (mediumSegment === 'face') setLastFace(key);
        else setLastArt(key);
      }
      onSelect(key);
      dismiss();
    },
    [onSelect, dismiss, type, mediumSegment]
  );

  // Pan gesture for drag-to-dismiss
  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (e.translationY > 0) {
        dragY.value = e.translationY;
      }
    })
    .onEnd((e) => {
      if (e.translationY > 120 || e.velocityY > 500) {
        runOnJS(dismiss)();
      } else {
        dragY.value = withTiming(0, { duration: 200 });
      }
    });

  // Animated styles
  const overlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0, 0.5]),
    pointerEvents: progress.value > 0 ? ('auto' as const) : ('none' as const),
  }));

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(progress.value, [0, 1], [SHEET_HEIGHT, 0]) + dragY.value,
      },
    ],
  }));

  function renderRow(opt: StyleOption) {
    const isSelected = opt.key === selected;
    // The selected color is teal/pink for a medium (per section), neutral for a
    // vibe. Surprise rows have no DB row → fun fallback blurb.
    const selColor = type === 'medium' ? segAccent : colors.accent;
    const isAnySurprise =
      opt.key === 'surprise_me' || opt.key === 'surprise_me_face' || opt.key === 'surprise_me_art';
    const blurb = opt.description ?? (isAnySurprise ? 'Roll the dice' : undefined);
    return (
      <TouchableOpacity
        key={opt.key}
        className="flex-row items-center justify-between py-3.5 px-4 mb-1.5 rounded-xl"
        style={{
          backgroundColor: isSelected ? HILITE_BG : 'transparent',
          borderWidth: 1,
          borderColor: isSelected ? HILITE_BORDER : 'transparent',
        }}
        onPress={() => handleSelect(opt.key)}
        activeOpacity={0.7}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexShrink: 1 }}>
          <Text
            className="text-base"
            numberOfLines={1}
            style={{
              color: isSelected ? selColor : colors.textPrimary,
              fontWeight: isSelected ? '700' : '500',
              flexShrink: 0,
            }}
          >
            {opt.label}
          </Text>
          {opt.badge ? (
            <View
              style={{
                paddingHorizontal: horizontalScale(7),
                paddingVertical: verticalScale(2),
                borderRadius: 6,
                backgroundColor: `${MEDIUM_BADGE[opt.badge.segment].color}22`,
              }}
            >
              <Text
                numberOfLines={1}
                style={{
                  color: MEDIUM_BADGE[opt.badge.segment].color,
                  fontSize: fontScale(10),
                  fontWeight: '700',
                }}
              >
                {opt.badge.label}
              </Text>
            </View>
          ) : null}
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flexShrink: 1 }}>
          {blurb ? (
            <Text
              numberOfLines={1}
              style={{ color: colors.textMuted, fontSize: fontScale(13), flexShrink: 1 }}
            >
              {blurb}
            </Text>
          ) : null}
          {isSelected && <Ionicons name="checkmark-circle" size={20} color={selColor} />}
        </View>
      </TouchableOpacity>
    );
  }

  function renderMediumToggle() {
    const segments: { key: Segment; label: string }[] = [
      { key: 'face', label: 'Real Face' },
      { key: 'art', label: 'Dream Art' },
    ];
    return (
      <View style={{ paddingHorizontal: 16, marginBottom: verticalScale(8) }}>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: colors.background,
            borderRadius: 10,
            padding: 3,
          }}
        >
          {segments.map((seg) => {
            const active = mediumSegment === seg.key;
            // Only the active tab's TEXT carries its brand color (Real Face =
            // teal, Dream Art = pink); the fill/outline stay subtle + common.
            const segColor = seg.key === 'face' ? MEDIUM_BADGE.face.color : MEDIUM_BADGE.art.color;
            return (
              <TouchableOpacity
                key={seg.key}
                style={{
                  flex: 1,
                  paddingVertical: verticalScale(8),
                  borderRadius: 8,
                  alignItems: 'center',
                  backgroundColor: active ? HILITE_BG : 'transparent',
                  borderWidth: 1,
                  borderColor: active ? HILITE_BORDER : 'transparent',
                }}
                onPress={() => {
                  if (seg.key === mediumSegment) return;
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  // Save the current pick as sticky for the tab we're leaving,
                  // then switch and apply the tab we're entering's sticky pick
                  // (so the selection always matches the visible section).
                  if (mediumSegment === 'face') setLastFace(selected);
                  else setLastArt(selected);
                  setMediumSegment(seg.key);
                  onSelect(seg.key === 'face' ? lastFace : lastArt);
                }}
                activeOpacity={0.7}
              >
                <Text
                  style={{
                    fontSize: fontScale(13),
                    fontWeight: active ? '700' : '500',
                    color: active ? segColor : colors.textSecondary,
                  }}
                >
                  {seg.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }

  // Scroll to the selected item when the sheet opens or the segment switches.
  // `selected` is read from a ref (see above) so picking an item — which updates
  // `selected` while the sheet animates closed — does not re-scroll.
  useEffect(() => {
    if (!visible) return;
    const sel = selectedRef.current;
    const isSurprise =
      sel === 'surprise_me' || sel === 'surprise_me_face' || sel === 'surprise_me_art';
    const idx = isSurprise ? 0 : displayList.findIndex((o) => o.key === sel);
    const ROW_HEIGHT = 52;
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        y: idx > 0 ? Math.max(0, (idx - 1) * ROW_HEIGHT) : 0,
        animated: false,
      });
    }, 50);
  }, [visible, type, mediumSegment, displayList]);

  if (!visible && progress.value === 0) return null;

  return (
    // box-none: the container itself never captures touches — only the interactive
    // backdrop (when open) + the sheet do. Defense-in-depth so that if this ever
    // lingers mounted at progress=0 (backdrop pointerEvents 'none'), taps still
    // pass through to Create instead of freezing it.
    <View className="absolute inset-0" style={{ zIndex: 100 }} pointerEvents="box-none">
      {/* Overlay */}
      <Animated.View className="absolute inset-0 bg-black" style={overlayStyle}>
        <TouchableOpacity className="flex-1" onPress={dismiss} activeOpacity={1} />
      </Animated.View>

      {/* Sheet */}
      <GestureDetector gesture={panGesture}>
        <Animated.View
          className="absolute left-0 right-0 bottom-0 rounded-t-3xl"
          style={[
            {
              height: SHEET_HEIGHT,
              backgroundColor: colors.surface,
              borderTopWidth: 1,
              borderTopColor: colors.border,
              paddingBottom: insets.bottom,
            },
            // iPad: pull the drawer in to a centered ~600 card.
            { left: SHEET_SIDE_INSET, right: SHEET_SIDE_INSET },
            sheetStyle,
          ]}
        >
          {/* Drag handle */}
          <View className="items-center pt-3 pb-2">
            <View
              className="rounded-full"
              style={{ width: 36, height: 4, backgroundColor: colors.border }}
            />
          </View>

          {/* Title — shared white display-font H2 (matches the model sheet). */}
          <TitleText style={{ marginBottom: verticalScale(12) }}>
            {/* User-facing name is "Style"; the internal type stays 'medium'
                (keys, columns, analytics — display copy only, 2026-07-11). */}
            {type === 'medium' ? 'Choose Style' : 'Choose Vibe'}
          </TitleText>

          {/* Real Face / Dream Art segmented toggle (medium sheet only). */}
          {type === 'medium' && renderMediumToggle()}

          {/* Options list */}
          <ScrollView
            ref={scrollRef}
            className="flex-1 px-4"
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="always"
          >
            {displayList.map((opt) => renderRow(opt))}
            <View style={{ height: insets.bottom + 40 }} />
          </ScrollView>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}
