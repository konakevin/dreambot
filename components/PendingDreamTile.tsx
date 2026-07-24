/**
 * PendingDreamTile — a single "cooking" tile woven into the Dreams grid (top
 * cells) while a dream renders. Grid-sized so it flows with the finished tiles;
 * shows a BrandSpinner (active) inside a determinate ProgressRing (how far), no
 * text. When the dream completes it drops from the in-flight set and its
 * finished tile takes a grid cell (uploads realtime → my-dreams invalidation).
 * See DREAM_TRACKING_PLAN.md.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BrandSpinner } from '@/components/BrandSpinner';
import { ProgressRing } from '@/components/ProgressRing';
import { colors } from '@/constants/theme';
import { TILE_WIDTH, TILE_HEIGHT } from '@/constants/grid';
import { useDreamProgress } from '@/hooks/useDreamProgress';
import type { InFlightDream } from '@/hooks/useInFlightDreams';

const RING_SIZE = 56;

export function PendingDreamTile({ dream }: { dream: InFlightDream }) {
  const { target } = useDreamProgress(dream);
  return (
    <View style={styles.tile}>
      <View style={styles.ringWrap}>
        {/* Determinate ring = how far; BrandSpinner inside = actively working. */}
        <ProgressRing size={RING_SIZE} strokeWidth={4} target={target} sweep={false} />
        <View style={styles.center} pointerEvents="none">
          <BrandSpinner size={26} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    width: TILE_WIDTH,
    height: TILE_HEIGHT,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringWrap: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
