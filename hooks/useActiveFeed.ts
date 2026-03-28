import { useState, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useFeed, useFriendsFeed, useFollowingFeed, type FeedItem } from '@/hooks/useFeed';

export type FeedMode = 'default' | 'friends' | 'friendsPosts';

export function useActiveFeed() {
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const [feedMode, setFeedMode] = useState<FeedMode>(mode === 'friends' ? 'friends' : 'default');

  // Sync route param → state
  useEffect(() => {
    if (mode === 'friends') setFeedMode('friends');
  }, [mode]);

  const defaultFeed = useFeed();
  const friendsFeed = useFriendsFeed();
  const followingFeed = useFollowingFeed();

  const activeFeed = feedMode === 'friends' ? friendsFeed
    : feedMode === 'friendsPosts' ? followingFeed
    : defaultFeed;

  const { data: feed = [], isLoading, refetch, isRefetching } = activeFeed;

  return {
    feedMode,
    setFeedMode,
    feed,
    isLoading,
    isRefetching,
    refetch,
  };
}
