const MILESTONES = [10, 25, 50, 100, 250, 500, 1000] as const;

export interface MilestoneHit {
  milestone: number;
  tier: number; // 1-4, controls animation intensity
  message: string;
}

const MESSAGES: Record<number, string[]> = {
  10:   ["You're the 10th to vote this RAD!", "10 rads deep — you sealed it!"],
  25:   ["You just dropped rad #25!", "25 rads and counting — you made it happen!"],
  50:   ["You're #50! Half a hundred rads!", "50 rads! You pushed it over the edge!"],
  100:  ["YOU are the 100th rad!", "100 rads! You just made history!"],
  250:  ["250 rads — you're part of something big!", "You just landed rad #250!"],
  500:  ["500 RADS. You lit the fuse!", "You're #500 — absolute legend!"],
  1000: ["ONE THOUSAND. You are the one.", "1,000 rads — you completed the mission!"],
};

function pickMessage(milestone: number): string {
  const pool = MESSAGES[milestone];
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Check if casting a rad vote would hit a milestone.
 * Pass the CURRENT rad_votes (before the new vote).
 * Returns null if no milestone is hit.
 */
export function checkMilestone(currentRadVotes: number): MilestoneHit | null {
  const next = currentRadVotes + 1;
  if (!(MILESTONES as readonly number[]).includes(next)) return null;
  const tier = next >= 500 ? 4 : next >= 100 ? 3 : next >= 50 ? 2 : 1;
  return { milestone: next, tier, message: pickMessage(next) };
}
