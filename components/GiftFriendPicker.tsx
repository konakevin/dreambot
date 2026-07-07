/**
 * GiftFriendPicker — choose who to gift sparkles to (Gift Sparkles Phase 1,
 * GIFT_SPARKLES_PLAN.md §2.2). Opens from the Sparkle Store's "Gift to a
 * friend" card. Defaults to the people you follow; the search field widens to
 * any dreamer (useSearchUsers). Selecting hands off to GiftSparklesSheet.
 */

import { useState } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, FlatList, Pressable } from 'react-native';
import { Text, TextInput } from '@/components/AppText';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { avatarUrl as resizeAvatar } from '@/lib/imageUrl';
import { useFollowingIds } from '@/hooks/useFollowingIds';
import { useSearchUsers } from '@/hooks/useSearchUsers';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { colors } from '@/constants/theme';
import { verticalScale, fontScale, isTabletDevice } from '@/lib/responsive';

export interface GiftRecipient {
  id: string;
  username: string;
  avatarUrl: string | null;
}

interface Props {
  onSelect: (recipient: GiftRecipient) => void;
  onClose: () => void;
}

export function GiftFriendPicker({ onSelect, onClose }: Props) {
  const [query, setQuery] = useState('');
  const debounced = useDebouncedValue(query, 250);
  const { data: followingIds = new Set<string>() } = useFollowingIds();

  // Default list: people you follow (bots excluded — can't receive gifts).
  const { data: following = [] } = useQuery({
    queryKey: ['giftFollowing', followingIds.size],
    queryFn: async (): Promise<GiftRecipient[]> => {
      if (followingIds.size === 0) return [];
      const { data, error } = await supabase
        .from('users')
        .select('id, username, avatar_url, is_bot')
        .in('id', [...followingIds].slice(0, 100));
      if (error) throw error;
      return (data ?? [])
        .filter((u) => !u.is_bot)
        .map((u) => ({ id: u.id, username: u.username ?? 'dreamer', avatarUrl: u.avatar_url }));
    },
    staleTime: 60_000,
  });

  const { data: searchResults = [] } = useSearchUsers(
    debounced.trim().length >= 2 ? debounced : ''
  );
  const showingSearch = debounced.trim().length >= 2;
  const rows: GiftRecipient[] = showingSearch
    ? searchResults.map((u) => ({ id: u.id, username: u.username, avatarUrl: u.avatarUrl ?? null }))
    : following;

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      {/* Tappable backdrop — the dimmed area above the sheet dismisses, same
          as the X (matches GiftSparklesSheet). stopPropagation on the sheet
          keeps inner taps from falling through to the dismiss. */}
      <Pressable style={s.backdrop} onPress={onClose}>
        <Pressable
          style={[s.sheet, isTabletDevice && { maxWidth: 600, alignSelf: 'center' }]}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={s.handle} />
          <View style={s.headerRow}>
            <Text style={s.title}>Who&apos;s it for?</Text>
            <TouchableOpacity onPress={onClose} hitSlop={10}>
              <Ionicons name="close" size={22} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          <TextInput
            style={s.search}
            placeholder="Search dreamers"
            placeholderTextColor={colors.textSecondary}
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <FlatList
            data={rows}
            keyExtractor={(r) => r.id}
            style={s.list}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              <Text style={s.empty}>
                {showingSearch ? 'No dreamers found' : 'Follow some dreamers to gift them sparkles'}
              </Text>
            }
            renderItem={({ item }) => (
              <TouchableOpacity style={s.row} activeOpacity={0.7} onPress={() => onSelect(item)}>
                {item.avatarUrl ? (
                  <Image
                    source={{ uri: resizeAvatar(item.avatarUrl) }}
                    style={s.avatar}
                    cachePolicy="memory-disk"
                  />
                ) : (
                  <View style={s.avatarFallback}>
                    <Text style={s.avatarText}>{item.username[0]?.toUpperCase() ?? '?'}</Text>
                  </View>
                )}
                <Text style={s.username}>{item.username}</Text>
                <Ionicons name="gift-outline" size={18} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  sheet: {
    width: '100%',
    height: '70%',
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: verticalScale(10),
    gap: verticalScale(12),
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { color: colors.textPrimary, fontSize: fontScale(18), fontWeight: '800' },
  search: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: verticalScale(9),
    color: colors.textPrimary,
    fontSize: fontScale(14),
  },
  list: { flex: 1 },
  empty: {
    color: colors.textSecondary,
    fontSize: fontScale(14),
    textAlign: 'center',
    marginTop: verticalScale(30),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: verticalScale(10),
  },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  avatarFallback: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: colors.textPrimary, fontSize: fontScale(15), fontWeight: '700' },
  username: { color: colors.textPrimary, fontSize: fontScale(15), fontWeight: '600', flex: 1 },
});
