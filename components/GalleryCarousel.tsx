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
import React from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { Image, type ImageContentFit } from 'expo-image';
import Animated, { useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import type { GalleryImage } from '@/components/DreamCard';
import { OVERLAY_PILL_ACTIVE_BG } from '@/components/OverlayPill';
import { verticalScale } from '@/lib/responsive';

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

/**
 * Dot indicator — rendered separately by DreamCard inside the HUD so it fades
 * with the caption/actions and sits at the right z-order above the scrim.
 */
export function GalleryDots({ count, index }: { count: number; index: number }) {
  return (
    <View style={styles.dots} pointerEvents="none">
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={[styles.dot, i === index ? styles.dotActive : styles.dotIdle]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  track: { flexDirection: 'row', height: '100%' },
  dots: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    gap: 6,
    // Dark translucent pill (same as the selected feed/bot pill + the edge
    // chevrons) so the dots read on any image color.
    backgroundColor: OVERLAY_PILL_ACTIVE_BG,
    paddingHorizontal: 10,
    paddingVertical: verticalScale(7),
    borderRadius: 12,
  },
  dot: { height: 6, borderRadius: 3 },
  dotActive: { width: 18, backgroundColor: '#FFFFFF' },
  dotIdle: { width: 6, backgroundColor: 'rgba(255,255,255,0.5)' },
});
