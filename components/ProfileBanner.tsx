/**
 * ProfileBanner — the Dreamscape header image (migration 554).
 *
 * A full-bleed picture that runs under the status bar and fades into the page:
 * a short dark fade at the top so the nav icons read, and an eased fade at the
 * bottom that ends in the page black, where the avatar + name sit (children are
 * laid over the bottom). Used by ProfileHeader on both profile screens and by
 * the header picker's live preview, so the preview is exactly the real header.
 */

import type { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { Image, type ImageLoadEventData } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/constants/theme';
import { easedScrim, headerContentPosition } from '@/lib/profileHeaders';
import { horizontalScale, verticalScale } from '@/lib/responsive';

const BOTTOM_SCRIM = easedScrim(14, 1);
const TOP_FADE: [string, string, string] = ['rgba(0,0,0,0.55)', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0)'];
/** The bottom fade starts this far down the banner. */
const SCRIM_START = 0.3;

interface Props {
  url: string;
  focalY: number;
  height: number;
  /** Laid over the bottom of the banner (avatar + name row). */
  children?: ReactNode;
  /** Real image size, for the picker's drag math. */
  onImageLoad?: (width: number, height: number) => void;
}

export function ProfileBanner({ url, focalY, height, children, onImageLoad }: Props) {
  return (
    <View style={[styles.root, { height }]}>
      <Image
        source={{ uri: url }}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        contentPosition={headerContentPosition(focalY)}
        cachePolicy="memory-disk"
        transition={200}
        onLoad={(e: ImageLoadEventData) => onImageLoad?.(e.source.width, e.source.height)}
      />
      <LinearGradient
        pointerEvents="none"
        colors={TOP_FADE}
        style={[styles.topFade, { height: height * 0.3 }]}
      />
      <LinearGradient
        pointerEvents="none"
        colors={BOTTOM_SCRIM.colors}
        locations={BOTTOM_SCRIM.locations}
        style={[styles.bottomScrim, { top: height * SCRIM_START }]}
      />
      {children ? <View style={styles.overlay}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  topFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
  },
  bottomScrim: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -1,
  },
  overlay: {
    position: 'absolute',
    left: horizontalScale(16),
    right: horizontalScale(16),
    bottom: verticalScale(12),
  },
});
