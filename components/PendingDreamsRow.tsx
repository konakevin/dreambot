/**
 * PendingDreamsRow — the live "cooking" tiles at the top of the Dreams album.
 *
 * Renders the user's queued / in-progress dreams (useInFlightDreams) as grid-
 * sized tiles above the finished dreams, each showing its current stage. As a
 * dream completes it drops from the in-flight set and its finished tile appears
 * in the grid below (driven by the uploads realtime → my-dreams invalidation).
 * Rendered inside the Dreams-tab header so it scrolls with the grid and needs no
 * PostGrid surgery. See DREAM_TRACKING_PLAN.md.
 *
 * v1: completion is "tile leaves the row, finished tile appears in the grid"
 * rather than a literal in-place crossfade (which would need pending items woven
 * into the grid data). Failed (dead_letter) dreams are surfaced via the dock
 * flash + the dream_failed notification, not here yet.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/components/AppText';
import { BrandSpinner } from '@/components/BrandSpinner';
import { colors } from '@/constants/theme';
import { fontScale, verticalScale } from '@/lib/responsive';
import { TILE_WIDTH, TILE_GAP, PORTRAIT_RATIO } from '@/constants/grid';
import { useInFlightDreams, type InFlightDream } from '@/hooks/useInFlightDreams';
import { getDreamStageInfo } from '@/lib/dreamStageLabels';

const TILE_HEIGHT = TILE_WIDTH * PORTRAIT_RATIO;

function PendingTile({ dream }: { dream: InFlightDream }) {
  const stage = getDreamStageInfo(dream.status, dream.currentStage);
  return (
    <View style={styles.tile}>
      <BrandSpinner size={30} />
      <View style={styles.labelScrim}>
        <Text style={styles.label} numberOfLines={1} allowFontScaling={false}>
          {stage.label}
        </Text>
      </View>
    </View>
  );
}

export function PendingDreamsRow() {
  const { data: inFlight = [] } = useInFlightDreams();
  if (inFlight.length === 0) return null;
  return (
    <View style={styles.row}>
      {inFlight.map((d) => (
        <PendingTile key={d.id} dream={d} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: TILE_GAP,
    // Sit flush above the grid's first row (grid is edge-to-edge, gap 1).
    marginBottom: TILE_GAP,
  },
  tile: {
    width: TILE_WIDTH,
    height: TILE_HEIGHT,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  labelScrim: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 6,
    paddingVertical: verticalScale(6),
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
  },
  label: {
    color: colors.bodyOnDark,
    fontSize: fontScale(10),
    fontWeight: '600',
    letterSpacing: 0.1,
  },
});
