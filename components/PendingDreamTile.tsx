/**
 * PendingDreamTile — a single "cooking" tile woven into the Dreams grid (top
 * cells) while a dream renders. Grid-sized so it flows with the finished tiles;
 * shows a BrandSpinner (active) inside a determinate ProgressRing (how far), no
 * text. When the dream completes it drops from the in-flight set and its
 * finished tile takes a grid cell (uploads realtime → my-dreams invalidation).
 * See DREAM_TRACKING_PLAN.md.
 */

import { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { BrandSpinner } from '@/components/BrandSpinner';
import { ProgressRing } from '@/components/ProgressRing';
import { colors } from '@/constants/theme';
import { TILE_WIDTH, TILE_HEIGHT } from '@/constants/grid';
import { useDreamProgress } from '@/hooks/useDreamProgress';
import type { InFlightDream } from '@/hooks/useInFlightDreams';

const RING_SIZE = 56;

// Memoized on the dream's identity + render-stage fields + the `finished` flag.
// useInFlightDreams hands a FRESH object every refetch (staleTime 0 → refetches
// on focus / socket events), so without this the tile re-renders on churn that
// doesn't change what's shown — restarting the spinner and re-sweeping the ring
// from 0 (Kevin 2026-07-23). Re-render only when the stage or finished-state
// genuinely advances.
//
// `finished` is set once the dream completes: the SAME tile instance (stable
// grid key) flips to a completing ring that fills the rest of the way to 100% +
// a check (ProgressRing owns that finish animation), then the album reveals the
// real image. The spinner hides — the ring finish IS the "done" cue.
export const PendingDreamTile = memo(
  function PendingDreamTile({
    dream,
    finished,
  }: {
    dream: InFlightDream;
    finished?: 'ready' | 'failed';
  }) {
    const { target } = useDreamProgress(dream);
    const state = finished === 'ready' ? 'complete' : finished === 'failed' ? 'failed' : 'active';
    return (
      <View style={styles.tile}>
        <View style={styles.ringWrap}>
          {/* Determinate ring = how far; BrandSpinner inside = actively working
              (hidden once finishing — the ring finish + check is the done cue). */}
          <ProgressRing
            size={RING_SIZE}
            strokeWidth={4}
            target={target}
            state={state}
            sweep={false}
          />
          {state === 'active' ? (
            <View style={styles.center} pointerEvents="none">
              <BrandSpinner size={26} />
            </View>
          ) : null}
        </View>
      </View>
    );
  },
  (prev, next) =>
    prev.finished === next.finished &&
    prev.dream.id === next.dream.id &&
    prev.dream.status === next.dream.status &&
    prev.dream.currentStage === next.dream.currentStage &&
    prev.dream.stageUpdatedAt === next.dream.stageUpdatedAt
);

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
