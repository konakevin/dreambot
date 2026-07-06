/**
 * Hashtag page — /hashtag/[tag]. Tapping a #tag anywhere (captions, search)
 * lands here: gradient #tag header + post count + the standard PostGrid of
 * matching public posts (post_hashtags, migration 331), reverse-chron.
 * Instagram shape — see HASHTAGS_PLAN.md.
 */

import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/AppText';
import { PostGrid } from '@/components/PostGrid';
import { useHashtagCount } from '@/hooks/useHashtagPosts';
import { normalizeTag } from '@/lib/hashtags';
import * as nav from '@/lib/navigate';
import { colors } from '@/constants/theme';
import { verticalScale, fontScale } from '@/lib/responsive';

export default function HashtagScreen() {
  const { tag: rawTag } = useLocalSearchParams<{ tag: string }>();
  const tag = normalizeTag(String(rawTag ?? ''));
  const { data: count } = useHashtagCount(tag);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => nav.back()}
          activeOpacity={0.7}
          hitSlop={12}
          style={styles.headerBack}
        >
          <Ionicons name="chevron-back" size={26} color={colors.textPrimary} />
        </TouchableOpacity>
        {/* Absolutely centered title — same drift fix as the Inbox header
            (unequal flanks make space-between centering read off-center).
            Plain white, not GradientTitle — the gradient is the brand
            wordmark treatment; a user-authored tag isn't one (Kevin
            2026-07-05). */}
        <View pointerEvents="none" style={styles.headerTitleCenter}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            #{tag}
          </Text>
        </View>
      </View>
      {count != null && count > 0 && (
        <Text style={styles.countText}>{count === 1 ? '1 dream' : `${count} dreams`}</Text>
      )}
      <PostGrid source={{ type: 'hashtag', tag }} emptyText="No dreams with this tag yet" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: verticalScale(12),
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  headerBack: {
    marginLeft: -6,
  },
  headerTitleCenter: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: fontScale(17),
    fontWeight: '700',
    maxWidth: 280,
  },
  countText: {
    color: colors.textSecondary,
    fontSize: fontScale(13),
    fontWeight: '600',
    textAlign: 'center',
    paddingVertical: verticalScale(10),
  },
});
