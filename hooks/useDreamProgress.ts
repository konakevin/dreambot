/**
 * useDreamProgress — a live, ticking render-progress value for one dream. Drives
 * the dock rings, album pending tiles, and the loading bar so a long stage
 * (dual face swap) keeps advancing over its estimate instead of freezing at a
 * checkpoint. Returns the time-based `target` (0..1) + the stage `label`.
 * See lib/dreamStageProgress.ts / DREAM_TRACKING_PLAN.md.
 */

import { useEffect, useRef, useState } from 'react';
import { dreamProgressTarget } from '@/lib/dreamStageProgress';
import {
  getDreamStageInfo,
  pickEarlyLabel,
  pickRenderLabel,
  pickFaceSwapLabel,
  isWaitingForSlot,
  QUEUED_LABEL,
} from '@/lib/dreamStageLabels';

interface DreamProgressInput {
  status: string | null | undefined;
  currentStage: string | null | undefined;
  stageUpdatedAt: string | null | undefined;
}

const TICK_MS = 400;
// A genuinely-queued dream shows "Opening a dream portal" only after it's waited
// this long — so the fast path (a render slot is free, claimed in <1s) never
// flashes it, and only a real wait (queued behind e.g. the nightly heavy batch)
// surfaces the distinct queue state instead of the conjuring pool.
const QUEUE_GRACE_MS = 4000;

export function useDreamProgress({ status, currentStage, stageUpdatedAt }: DreamProgressInput): {
  target: number;
  label: string;
} {
  const [target, setTarget] = useState(() =>
    dreamProgressTarget(status, currentStage, stageUpdatedAt, Date.now())
  );

  // Draw ONE magical phrase per pool and hold each for this dream's lifetime, so
  // they don't reshuffle on every 400ms progress tick. Lazy initializers = one
  // pick per mount; each is shown only while its own pooled stage is active.
  const [earlyLabel] = useState(pickEarlyLabel);
  const [renderLabel] = useState(pickRenderLabel);
  const [faceSwapLabel] = useState(pickFaceSwapLabel);

  // When the dream first started genuinely waiting for a slot (queued, unclaimed).
  // Reset the moment it gets claimed, so a re-queue after a transient failure
  // starts its grace window fresh.
  const queuedSinceRef = useRef<number | null>(null);

  useEffect(() => {
    if (isWaitingForSlot(status, currentStage)) {
      if (queuedSinceRef.current == null) queuedSinceRef.current = Date.now();
    } else {
      queuedSinceRef.current = null;
    }
    const tick = () =>
      setTarget(dreamProgressTarget(status, currentStage, stageUpdatedAt, Date.now()));
    tick();
    const id = setInterval(tick, TICK_MS);
    return () => clearInterval(id);
  }, [status, currentStage, stageUpdatedAt]);

  // A real queue wait (past the grace window) shows the distinct portal label; the
  // 400ms tick re-renders this, so it flips over once the grace elapses.
  const showPortal =
    isWaitingForSlot(status, currentStage) &&
    queuedSinceRef.current != null &&
    Date.now() - queuedSinceRef.current >= QUEUE_GRACE_MS;

  // getDreamStageInfo already applies "completed wins" precedence and tags the
  // rotating stages with `pool`, so swap in the matching stable pick here.
  const info = getDreamStageInfo(status, currentStage);
  const label = showPortal
    ? QUEUED_LABEL
    : info.pool === 'early'
      ? earlyLabel
      : info.pool === 'render'
        ? renderLabel
        : info.pool === 'face_swap'
          ? faceSwapLabel
          : info.label;

  return { target, label };
}
