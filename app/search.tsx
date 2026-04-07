import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { useSearchUsers, type SearchUser } from '@/hooks/useSearchUsers';
import { useFollowingIds } from '@/hooks/useFollowingIds';
import { useToggleFollow } from '@/hooks/useToggleFollow';
import { useFriendIds } from '@/hooks/useFriendIds';
import { useSendFriendRequest } from '@/hooks/useSendFriendRequest';
import { useFriendshipStatus } from '@/hooks/useFriendshipStatus';
import { avatarUrl as resizeAvatar } from '@/lib/imageUrl';
import { colors } from '@/constants/theme';

function SearchRow({ user }: { user: SearchUser }) {
  const { data: followingIds = new Set<string>() } = useFollowingIds();
  const { data: friendIds = new Set<string>() } = useFriendIds();
  const { mutate: toggleFollow } = useToggleFollow();
  const { mutate: sendRequest } = useSendFriendRequest();
  const { data: friendshipStatus = 'none' } = useFriendshipStatus(user.id);
  const isFollowing = followingIds.has(user.id);
  const isFriend = friendIds.has(user.id);

  return (
    <TouchableOpacity
      style={s.row}
      onPress={() => router.replace(`/user/${user.id}`)}
      activeOpacity={0.7}
    >
      {user.avatarUrl ? (
        <Image
          source={{ uri: resizeAvatar(user.avatarUrl) }}
          style={s.avatar}
          cachePolicy="memory-disk"
        />
      ) : (
        <View style={s.avatarFallback}>
          <Text style={s.avatarText}>{(user.username || '?')[0].toUpperCase()}</Text>
        </View>
      )}

      <View style={s.userInfo}>
        <Text style={s.username}>{user.username}</Text>
      </View>

      <View style={s.actions}>
        {!isFriend && friendshipStatus === 'none' && (
          <TouchableOpacity
            style={s.dreamButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              sendRequest(user.id);
            }}
            activeOpacity={0.7}
            hitSlop={8}
          >
            <Text style={s.dreamButtonText}>Dream</Text>
          </TouchableOpacity>
        )}
        {friendshipStatus === 'pending_sent' && (
          <View style={s.sentPill}>
            <Text style={s.sentText}>Sent</Text>
          </View>
        )}
        {isFriend && (
          <View style={s.friendPill}>
            <Ionicons name="checkmark-circle" size={12} color="#4CAA64" />
          </View>
        )}
        {!isFriend && !isFollowing && friendshipStatus !== 'pending_sent' && (
          <TouchableOpacity
            style={s.followButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              toggleFollow({ userId: user.id, currentlyFollowing: false });
            }}
            activeOpacity={0.7}
            hitSlop={8}
          >
            <Text style={s.followButtonText}>Follow</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const { data: results = [], isLoading } = useSearchUsers(query);
  const { data: friendIds = new Set<string>() } = useFriendIds();

  // Sort friends first
  const sortedResults = [...results].sort((a, b) => {
    const aFriend = friendIds.has(a.id) ? 0 : 1;
    const bFriend = friendIds.has(b.id) ? 0 : 1;
    return aFriend - bFriend;
  });

  return (
    <SafeAreaView style={s.root}>
      {/* Header with close button */}
      <View style={s.header}>
        <Text style={s.headerTitle}>Search</Text>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12} style={s.closeButton}>
          <Ionicons name="close" size={26} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Search input */}
      <View style={s.searchWrap}>
        <Ionicons name="search" size={16} color={colors.textSecondary} style={s.searchIcon} />
        <TextInput
          style={s.searchInput}
          placeholder="Search by username"
          placeholderTextColor={colors.textSecondary}
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
          autoCorrect={false}
          autoFocus
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')} hitSlop={8}>
            <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Results */}
      <FlatList
        data={sortedResults}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <SearchRow user={item} />}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <View style={s.empty}>
            {isLoading ? (
              <ActivityIndicator color={colors.textSecondary} />
            ) : query.length >= 2 ? (
              <Text style={s.emptyText}>No users found</Text>
            ) : (
              <Text style={s.emptyText}>Type a username to search</Text>
            )}
          </View>
        }
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '800',
  },
  closeButton: {
    padding: 4,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, color: colors.textPrimary, fontSize: 15, height: 44 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.card,
    gap: 12,
  },
  avatar: { width: 44, height: 44, borderRadius: 22 },
  avatarFallback: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: colors.textPrimary, fontSize: 16, fontWeight: '700' },
  userInfo: { flex: 1, gap: 2 },
  username: { color: colors.textPrimary, fontSize: 15, fontWeight: '600' },
  actions: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  dreamButton: {
    backgroundColor: colors.accent,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  dreamButtonText: { color: '#000000', fontSize: 12, fontWeight: '800' },
  followButton: {
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  followButtonText: { color: colors.accent, fontSize: 12, fontWeight: '600' },
  sentPill: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  sentText: { color: colors.textSecondary, fontSize: 12, fontWeight: '600' },
  friendPill: { padding: 4 },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyText: { color: colors.textSecondary, fontSize: 14 },
});
