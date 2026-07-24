/**
 * useDreamProgress — a live, ticking render-progress value for one dream. Drives
 * the dock rings, album pending tiles, and the loading bar so a long stage
 * (dual face swap) keeps advancing over its estimate instead of freezing at a
 * checkpoint. Returns the time-based `target` (0..1) + the stage `label`.
 * See lib/dreamStageProgress.ts / DREAM_TRACKING_PLAN.md.
 */

import { useEffect, useState } from 'react';
import { dreamProgressTarget } from '@/lib/dreamStageProgress';
import { getDreamStageInfo } from '@/lib/dreamStageLabels';

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

  useEffect(() => {
    const tick = () =>
      setTarget(dreamProgressTarget(status, currentStage, stageUpdatedAt, Date.now()));
    tick();
    const id = setInterval(tick, TICK_MS);
    return () => clearInterval(id);
  }, [status, currentStage, stageUpdatedAt]);

  return { target, label: getDreamStageInfo(status, currentStage).label };
}
