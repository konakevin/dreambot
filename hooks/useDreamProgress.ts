/**
 * useDreamProgress — a live, ticking render-progress value for one dream. Drives
 * the dock rings, album pending tiles, and the loading bar so a long stage
 * (dual face swap) keeps advancing over its estimate instead of freezing at a
 * checkpoint. Returns the time-based `target` (0..1) + the stage `label`.
 * See lib/dreamStageProgress.ts / DREAM_TRACKING_PLAN.md.
 */

import { useEffect, useState } from 'react';
import { dreamProgressTarget } from '@/lib/dreamStageProgress';
import {
  getDreamStageInfo,
  pickEarlyLabel,
  pickRenderLabel,
  pickFaceSwapLabel,
} from '@/lib/dreamStageLabels';

interface DreamProgressInput {
  status: string | null | undefined;
  currentStage: string | null | undefined;
  stageUpdatedAt: string | null | undefined;
}

const TICK_MS = 400;

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

  useEffect(() => {
    const tick = () =>
      setTarget(dreamProgressTarget(status, currentStage, stageUpdatedAt, Date.now()));
    tick();
    const id = setInterval(tick, TICK_MS);
    return () => clearInterval(id);
  }, [status, currentStage, stageUpdatedAt]);

  // getDreamStageInfo already applies "completed wins" precedence and tags the
  // rotating stages with `pool`, so swap in the matching stable pick here.
  const info = getDreamStageInfo(status, currentStage);
  const label =
    info.pool === 'early'
      ? earlyLabel
      : info.pool === 'render'
        ? renderLabel
        : info.pool === 'face_swap'
          ? faceSwapLabel
          : info.label;

  return { target, label };
}
