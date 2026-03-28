import { useState, useRef, useCallback } from 'react';
import { checkMilestone, type MilestoneHit } from '@/lib/milestones';

const MILESTONE_DELAY = 650; // ms — matches VoteButton burst duration

export type MilestoneState = (MilestoneHit & { postId: string }) | null;

/**
 * Detects vote milestones and manages the delayed reveal.
 *
 * Owns: milestoneHit, milestonePending, timer.
 * The 650ms delay lets the button burst animation complete before the overlay appears.
 */
export function useMilestoneDetection() {
  const [milestoneHit, setMilestoneHit] = useState<MilestoneState>(null);
  const [milestonePending, setMilestonePending] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const checkAndTrigger = useCallback((vote: 'rad' | 'bad', radVotes: number, postId: string) => {
    const hit = vote === 'rad' ? checkMilestone(radVotes) : null;
    if (!hit) return;

    setMilestonePending(postId);
    timerRef.current = setTimeout(() => {
      setMilestoneHit({ ...hit, postId });
      timerRef.current = null;
    }, MILESTONE_DELAY);
  }, []);

  const clear = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setMilestoneHit(null);
    setMilestonePending(null);
  }, []);

  /** True if this postId has a milestone (pending or active) */
  const isActive = useCallback((postId: string) => {
    return milestoneHit?.postId === postId || milestonePending === postId;
  }, [milestoneHit, milestonePending]);

  return {
    milestoneHit,
    milestonePending,
    isActive,
    checkAndTrigger,
    clear,
  };
}
