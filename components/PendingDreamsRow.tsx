/**
 * PendingDreamsRow — the live "cooking" tiles at the top of the Dreams album.
 *
 * Renders the user's queued / in-progress dreams (useInFlightDreams) as grid-
 * sized tiles above the finished dreams. Each tile shows a BrandSpinner (active)
 * inside a determinate ProgressRing (how far) — no stage text, matching the
 * dock's ring language. As a dream completes it drops from the in-flight set and
 * its finished tile appears in the grid below (uploads realtime → my-dreams
 * invalidation). Rendered inside the Dreams-tab header so it scrolls with the
 * grid and needs no PostGrid surgery. See DREAM_TRACKING_PLAN.md.
 *
 * v1: completion is "tile leaves the row, finished tile appears in the grid"
 * rather than a literal in-place crossfade. Failed (dead_letter) dreams are
 * surfaced via the dock + the dream_failed notification, not here yet.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BrandSpinner } from '@/components/BrandSpinner';
import { ProgressRing } from '@/components/ProgressRing';
import { colors } from '@/constants/theme';
import { TILE_WIDTH, TILE_GAP, PORTRAIT_RATIO } from '@/constants/grid';
import { useInFlightDreams, type InFlightDream } from '@/hooks/useInFlightDreams';
import { getDreamStageInfo } from '@/lib/dreamStageLabels';

const TILE_HEIGHT = TILE_WIDTH * PORTRAIT_RATIO;
const RING_SIZE = 56;

function PendingTile({ dream }: { dream: InFlightDream }) {
  const stage = getDreamStageInfo(dream.status, dream.currentStage);
  return (
    <View style={styles.tile}>
      <View style={styles.ringWrap}>
        {/* Determinate ring = how far; BrandSpinner inside = actively working. */}
        <ProgressRing size={RING_SIZE} strokeWidth={4} target={stage.target} sweep={false} />
        <View style={styles.spinnerCenter} pointerEvents="none">
          <BrandSpinner size={26} />
        </View>
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
  ringWrap: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinnerCenter: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
