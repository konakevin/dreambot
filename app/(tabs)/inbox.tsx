import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useInbox, type InboxItem } from '@/hooks/useInbox';
import { useMarkShareSeen } from '@/hooks/useMarkShareSeen';
import { useFeedStore } from '@/store/feed';
import type { PendingPost } from '@/store/feed';
import { colors } from '@/constants/theme';

function formatTimeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return 'now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return `${Math.floor(days / 7)}w`;
}

function InboxRow({ item, onPress }: { item: InboxItem; onPress: () => void }) {
  return (
    <TouchableOpacity
      style={[styles.row, !item.isSeen && styles.rowUnseen]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Sender avatar */}
      {item.senderAvatarUrl ? (
        <Image source={{ uri: item.senderAvatarUrl }} style={styles.avatar} />
      ) : (
        <View style={styles.avatarFallback}>
          <Text style={styles.avatarText}>{item.senderUsername[0].toUpperCase()}</Text>
        </View>
      )}

      {/* Text */}
      <View style={styles.textCol}>
        <Text style={styles.senderLine} numberOfLines={1}>
          <Text style={styles.senderName}>@{item.senderUsername}</Text>
          <Text style={styles.sentLabel}> sent you a post</Text>
        </Text>
        {item.caption ? (
          <Text style={styles.caption} numberOfLines={1}>{item.caption}</Text>
        ) : (
          <Text style={styles.caption} numberOfLines={1}>by @{item.postUsername}</Text>
        )}
      </View>

      {/* Post thumbnail */}
      <Image
        source={{ uri: item.thumbnailUrl ?? item.imageUrl }}
        style={styles.thumbnail}
        contentFit="cover"
      />

      {/* Time + unseen dot */}
      <View style={styles.timeCol}>
        <Text style={styles.time}>{formatTimeAgo(item.sharedAt)}</Text>
        {!item.isSeen && <View style={styles.unseenDot} />}
      </View>
    </TouchableOpacity>
  );
}

export default function InboxScreen() {
  const { data: inbox = [], isLoading } = useInbox();
  const { mutate: markSeen } = useMarkShareSeen();
  const setPendingPost = useFeedStore((s) => s.setPendingPost);

  function handleTapShare(item: InboxItem) {
    // Mark as seen
    if (!item.isSeen) {
      markSeen(item.shareId);
    }

    // Inject the shared post into the feed deck
    const feedItem: PendingPost = {
      id: item.uploadId,
      user_id: item.postUserId,
      categories: item.categories,
      image_url: item.imageUrl,
      media_type: item.mediaType,
      thumbnail_url: item.thumbnailUrl,
      width: item.width,
      height: item.height,
      caption: item.caption,
      created_at: item.postCreatedAt,
      total_votes: item.totalVotes,
      rad_votes: item.radVotes,
      bad_votes: item.badVotes,
      username: item.postUsername,
      avatar_url: item.postAvatarUrl,
    };

    setPendingPost(feedItem);

    // Navigate to Home tab (Explore feed)
    router.replace('/(tabs)');
  }

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Inbox</Text>
      </View>

      <FlatList
        data={inbox}
        keyExtractor={(item) => item.shareId}
        renderItem={({ item }) => (
          <InboxRow item={item} onPress={() => handleTapShare(item)} />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            {isLoading ? (
              <ActivityIndicator color={colors.textSecondary} />
            ) : (
              <>
                <Ionicons name="paper-plane-outline" size={40} color="rgba(255,255,255,0.2)" />
                <Text style={styles.emptyTitle}>No shared posts yet</Text>
                <Text style={styles.emptySubtitle}>When vibers share posts with you, they'll show up here</Text>
              </>
            )}
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '800',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.card,
    gap: 12,
  },
  rowUnseen: {
    backgroundColor: 'rgba(255,215,0,0.04)',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarFallback: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: colors.textPrimary, fontSize: 16, fontWeight: '700' },
  textCol: {
    flex: 1,
    gap: 2,
  },
  senderLine: {
    fontSize: 14,
  },
  senderName: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  sentLabel: {
    color: colors.textSecondary,
    fontWeight: '500',
  },
  caption: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  thumbnail: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: colors.card,
  },
  timeCol: {
    alignItems: 'center',
    gap: 4,
    minWidth: 28,
  },
  time: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '500',
  },
  unseenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFD700',
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    gap: 10,
  },
  emptyTitle: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: '700',
  },
  emptySubtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
