/**
 * GalleryCarousel — multi-image "gallery" pager for a post (migration 356).
 * Rendered by DreamCard in place of the single hero <Image> when a post has
 * more than one image.
 *
 * NAVIGATION: tap-driven, NOT swipe (Kevin 2026-07-09). Tapping the left/right
 * edge of the image steps prev/next; a horizontal swipe is left entirely to the
 * card's existing gestures (swipe-to-profile on the main feed) and a vertical
 * swipe to the VerticalPager (next post/bot). This deliberately avoids nesting a
 * horizontal pan inside the vertical pager + pinch, which made diagonal swipes
 * unreliably page to the next post. The card owns the tap-zone logic (it needs
 * the tap's X and must coexist with double-tap-to-like); this component is a
 * pure index-controlled slide.
 */
import React, { useEffect } from 'react';
import { Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import { Image, type ImageContentFit } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import type { GalleryImage } from '@/components/DreamCard';
import { OVERLAY_PILL_ACTIVE_BG } from '@/components/OverlayPill';
import { horizontalScale, verticalScale, fontScale } from '@/lib/responsive';

interface Props {
  images: GalleryImage[];
  /** Controlled current page (owned by DreamCard, driven by edge taps). */
  index: number;
  fitMode: ImageContentFit;
  /** Fallback thumbhash (the post's cover) for images that lack their own. */
  coverThumbhash?: string | null;
  recyclingKey: string;
}

function GalleryCarouselImpl({ images, index, fitMode, coverThumbhash, recyclingKey }: Props) {
  const { width } = useWindowDimensions();
  const count = images.length;
  const clamped = Math.max(0, Math.min(count - 1, index));

  const trackStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withTiming(-clamped * width, {
          duration: 240,
          easing: Easing.out(Easing.cubic),
        }),
      },
    ],
  }));

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Animated.View style={[styles.track, { width: width * count }, trackStyle]}>
        {images.map((img, i) => {
          const shouldMount = Math.abs(i - clamped) <= 1; // window current ± 1
          return (
            <View key={`${recyclingKey}-${i}`} style={{ width }}>
              {shouldMount && (
                <Image
                  source={{ uri: img.display ?? img.url }}
                  style={StyleSheet.absoluteFill}
                  contentFit={fitMode}
                  cachePolicy="memory-disk"
                  recyclingKey={`${recyclingKey}-${i}`}
                  transition={150}
                  placeholder={
                    img.thumbhash
                      ? { thumbhash: img.thumbhash }
                      : coverThumbhash
                        ? { thumbhash: coverThumbhash }
                        : null
                  }
                  placeholderContentFit={fitMode}
                />
              )}
            </View>
          );
        })}
      </Animated.View>
    </View>
  );
}

export const GalleryCarousel = React.memo(GalleryCarouselImpl);

// Max dot-slots shown at once. Beyond this the window slides and the outer
// dots shrink to "peek" size, so a 10-image album never renders a cramped row
// and the capsule width stays constant regardless of count.
const DOT_WINDOW = 5;

type DotKind = 'active' | 'idle' | 'peek';

/** The visible dot slots for the current index — a sliding window of the album
 *  with peek dots at the edges when there's more beyond the window. */
function windowedDots(count: number, index: number): { key: number; kind: DotKind }[] {
  if (count <= DOT_WINDOW) {
    return Array.from({ length: count }, (_, i) => ({
      key: i,
      kind: i === index ? 'active' : 'idle',
    }));
  }
  const start = Math.max(0, Math.min(index - Math.floor(DOT_WINDOW / 2), count - DOT_WINDOW));
  const slots: { key: number; kind: DotKind }[] = [];
  for (let i = start; i < start + DOT_WINDOW; i++) {
    let kind: DotKind = i === index ? 'active' : 'idle';
    const moreLeft = i === start && start > 0;
    const moreRight = i === start + DOT_WINDOW - 1 && start + DOT_WINDOW < count;
    if ((moreLeft || moreRight) && kind !== 'active') kind = 'peek';
    slots.push({ key: i, kind });
  }
  return slots;
}

/**
 * GalleryNav — the album's all-in-one navigation control (2026-07-11).
 *
 * One translucent capsule, bottom-center above the metadata: `‹  ● ▬ ● ●  ›`.
 * Replaces the old floating mid-card chevrons + separate dots. Two ways to move:
 * tap a chevron here, or (still, in DreamCard) tap the left/right image edge —
 * the image edge IS the big swipe-like target, so the capsule stays a compact
 * tap-only control (no in-capsule scrub, which would just duplicate edge-tap in
 * a smaller, worse zone).
 *
 * Responsive + stable: the chevron slots are ALWAYS reserved (fixed width) and
 * the chevron fades within its slot at the ends, so the indicator stays exactly
 * centered and never jumps. The indicator windows to DOT_WINDOW so the capsule
 * width is constant from 2 to 10 images.
 */
export function GalleryNav({
  count,
  index,
  onStep,
}: {
  count: number;
  index: number;
  onStep: (next: number) => void;
}) {
  const canPrev = index > 0;
  const canNext = index < count - 1;

  const stepTo = (next: number) => {
    const clamped = Math.max(0, Math.min(count - 1, next));
    if (clamped !== index) {
      onStep(clamped);
      Haptics.selectionAsync();
    }
  };

  // Fade the chevrons in/out within their (reserved) slots at the ends.
  const leftOpacity = useSharedValue(canPrev ? 1 : 0);
  const rightOpacity = useSharedValue(canNext ? 1 : 0);
  useEffect(() => {
    leftOpacity.value = withTiming(canPrev ? 1 : 0, { duration: 160 });
  }, [canPrev, leftOpacity]);
  useEffect(() => {
    rightOpacity.value = withTiming(canNext ? 1 : 0, { duration: 160 });
  }, [canNext, rightOpacity]);
  const leftStyle = useAnimatedStyle(() => ({ opacity: leftOpacity.value }));
  const rightStyle = useAnimatedStyle(() => ({ opacity: rightOpacity.value }));

  const slots = windowedDots(count, index);

  return (
    <View style={styles.navCapsule}>
      <Pressable
        onPress={() => stepTo(index - 1)}
        disabled={!canPrev}
        hitSlop={14}
        style={styles.navSlot}
      >
        <Animated.View style={leftStyle}>
          <Ionicons name="chevron-back" size={fontScale(26)} color="#FFFFFF" />
        </Animated.View>
      </Pressable>
      <View style={styles.navDots}>
        {slots.map((s) => (
          <View
            key={s.key}
            style={[
              styles.dotBase,
              s.kind === 'active'
                ? styles.dotActive
                : s.kind === 'peek'
                  ? styles.dotPeek
                  : styles.dotIdle,
            ]}
          />
        ))}
      </View>
      <Pressable
        onPress={() => stepTo(index + 1)}
        disabled={!canNext}
        hitSlop={14}
        style={styles.navSlot}
      >
        <Animated.View style={rightStyle}>
          <Ionicons name="chevron-forward" size={fontScale(26)} color="#FFFFFF" />
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  track: { flexDirection: 'row', height: '100%' },
  // One dark translucent capsule (matches the feed/bot pill + bottom scrim).
  navCapsule: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: OVERLAY_PILL_ACTIVE_BG,
    borderRadius: 999,
    height: verticalScale(40),
    paddingHorizontal: horizontalScale(4),
  },
  // Fixed-width chevron slot — always present so the indicator stays centered.
  navSlot: {
    width: horizontalScale(38),
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: horizontalScale(6),
    paddingHorizontal: horizontalScale(2),
  },
  dotBase: { borderRadius: 999 },
  dotActive: {
    width: horizontalScale(18),
    height: horizontalScale(7),
    backgroundColor: '#FFFFFF',
  },
  dotIdle: {
    width: horizontalScale(7),
    height: horizontalScale(7),
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  dotPeek: {
    width: horizontalScale(5),
    height: horizontalScale(5),
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
});
