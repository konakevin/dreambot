/**
 * Settings → Blocked Users
 * Lists everyone the current user has blocked, with a one-tap Unblock.
 * Backed by the get_blocked_users RPC (188) + useToggleBlock (unblock path).
 * This is the only place to unblock without navigating to the user's profile.
 */

import { useCallback } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text } from '@/components/AppText';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { ScreenLayout } from '@/components/ScreenLayout';
import { showAlert } from '@/components/CustomAlert';
import { colors } from '@/constants/theme';
import { verticalScale, fontScale } from '@/lib/responsive';
import { useBlockedUsers, useToggleBlock, type BlockedUser } from '@/hooks/useBlockUser';

export default function BlockedUsersScreen() {
  const { data: blocked, isLoading, isError, refetch } = useBlockedUsers();
  const toggleBlock = useToggleBlock();

  const confirmUnblock = useCallback(
    (u: BlockedUser) => {
      showAlert(
        `Unblock ${u.username}?`,
        'They will be able to see your dreams, follow you, and interact with your posts again.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Unblock',
            onPress: () => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              toggleBlock.mutate({ userId: u.user_id, currentlyBlocked: true });
            },
          },
        ]
      );
    },
    [toggleBlock]
  );

  const renderItem = useCallback(
    ({ item }: { item: BlockedUser }) => (
      <View style={styles.row}>
        {item.avatar_url ? (
          <Image
            source={{ uri: item.avatar_url }}
            style={styles.avatar}
            contentFit="cover"
            transition={150}
          />
        ) : (
          <View style={[styles.avatar, styles.avatarFallback]}>
            <Ionicons name="person" size={20} color={colors.textTertiary} />
          </View>
        )}
        <Text style={styles.username} numberOfLines={1}>
          {item.username}
        </Text>
        <TouchableOpacity
          style={styles.unblockBtn}
          onPress={() => confirmUnblock(item)}
          activeOpacity={0.7}
          disabled={toggleBlock.isPending}
        >
          <Text style={styles.unblockText}>Unblock</Text>
        </TouchableOpacity>
      </View>
    ),
    [confirmUnblock, toggleBlock.isPending]
  );

  return (
    <ScreenLayout header="back" title="Blocked Users">
      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.accent} />
        </View>
      ) : isError ? (
        <View style={styles.center}>
          <Text style={styles.muted}>Couldn&apos;t load blocked users.</Text>
          <TouchableOpacity onPress={() => refetch()} style={styles.retryBtn} activeOpacity={0.7}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : !blocked || blocked.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="ban-outline" size={40} color={colors.textTertiary} />
          <Text style={styles.muted}>You haven&apos;t blocked anyone.</Text>
        </View>
      ) : (
        <FlatList
          data={blocked}
          keyExtractor={(u) => u.user_id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.sep} />}
        />
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 },
  muted: { color: colors.textSecondary, fontSize: fontScale(15), textAlign: 'center' },
  list: { paddingVertical: verticalScale(8) },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: verticalScale(10),
    gap: 12,
  },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.surface },
  avatarFallback: { alignItems: 'center', justifyContent: 'center' },
  username: { flex: 1, color: colors.textPrimary, fontSize: fontScale(16), fontWeight: '600' },
  unblockBtn: {
    paddingHorizontal: 16,
    paddingVertical: verticalScale(8),
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  unblockText: { color: colors.accent, fontSize: fontScale(14), fontWeight: '700' },
  sep: { height: 1, backgroundColor: colors.border, marginLeft: 72 },
  retryBtn: {
    paddingHorizontal: 20,
    paddingVertical: verticalScale(10),
    borderRadius: 20,
    backgroundColor: colors.surface,
  },
  retryText: { color: colors.accent, fontWeight: '700' },
});
