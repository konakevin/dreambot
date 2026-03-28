import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UNLOCK_THRESHOLD = 10;

/**
 * Tracks vote count and manages Streak mode unlock gate.
 *
 * Owns: totalVoteCount, streakUnlocked, showStreakIntro.
 * Persists to AsyncStorage across sessions.
 */
export function useStreakUnlock() {
  const [totalVoteCount, setTotalVoteCount] = useState(0);
  const [streakUnlocked, setStreakUnlocked] = useState(false);
  const [showStreakIntro, setShowStreakIntro] = useState(false);

  // Load from AsyncStorage on mount
  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem('total_vote_count'),
      AsyncStorage.getItem('streak_intro_seen'),
    ]).then(([count, introSeen]) => {
      const n = parseInt(count ?? '0', 10);
      setTotalVoteCount(n);
      setStreakUnlocked(n >= UNLOCK_THRESHOLD);
      if (n >= UNLOCK_THRESHOLD && !introSeen) setShowStreakIntro(true);
    });
  }, []);

  /** Called after each vote to increment count and check unlock */
  const recordVote = useCallback(() => {
    setTotalVoteCount((prev) => {
      const next = prev + 1;
      AsyncStorage.setItem('total_vote_count', String(next));
      if (next >= UNLOCK_THRESHOLD) {
        setStreakUnlocked(true);
        // Only show intro if they haven't seen it before (checked on mount)
        AsyncStorage.getItem('streak_intro_seen').then((seen) => {
          if (!seen) setShowStreakIntro(true);
        });
      }
      return next;
    });
  }, []);

  /** Called when user dismisses the intro overlay */
  const dismissIntro = useCallback(() => {
    setShowStreakIntro(false);
    AsyncStorage.setItem('streak_intro_seen', '1');
  }, []);

  return {
    totalVoteCount,
    streakUnlocked,
    showStreakIntro,
    recordVote,
    dismissIntro,
  };
}
