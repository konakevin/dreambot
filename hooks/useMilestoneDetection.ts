import { useState, useRef, useCallback } from 'react';
import { checkMilestone, type MilestoneHit } from '@/lib/milestones';

export type MilestoneState = (MilestoneHit & { postId: string }) | null;

/**
 * Detects vote milestones. Triggers immediately on vote.
 *
 * Owns: milestoneHit state.
 */
export function useMilestoneDetection() {
  const [milestoneHit, setMilestoneHit] = useState<MilestoneState>(null);

  const checkAndTrigger = useCallback((vote: 'rad' | 'bad', radVotes: number, postId: string) => {
    const hit = vote === 'rad' ? checkMilestone(radVotes) : null;
    if (hit) setMilestoneHit({ ...hit, postId });
  }, []);

  const clear = useCallback(() => {
    setMilestoneHit(null);
  }, []);

  /** True if this postId has an active milestone */
  const isActive = useCallback((postId: string) => {
    return milestoneHit?.postId === postId;
  }, [milestoneHit]);

  return {
    milestoneHit,
    isActive,
    checkAndTrigger,
    clear,
  };
}
