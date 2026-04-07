/**
 * LikesSheet — slide-in panel showing who liked a post.
 * Each row is tappable to navigate to that user's profile.
 * Uses absolute positioning instead of Modal to stay in the navigation context.
 */

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Dimensions,
  Pressable,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useEffect } from 'react';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { avatarUrl as resizeAvatar } from '@/lib/imageUrl';
import { colors } from '@/constants/theme';
import { usePostLikes } from '@/hooks/usePostLikes';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SHEET_WIDTH = SCREEN_WIDTH * 0.75;

interface Props {
  uploadId: string | null;
  visible: boolean;
  onClose: () => void;
}

export function LikesSheet({ uploadId, visible, onClose }: Props) {
  const { data: likes = [], isLoading } = usePostLikes(visible ? uploadId : null);
  const insets = useSafeAreaInsets();
  const translateX = useSharedValue(SHEET_WIDTH);

  useEffect(() => {
    translateX.value = withTiming(visible ? 0 : SHEET_WIDTH, { duration: 250 });
  }, [visible, translateX]);

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: visible ? 1 : 0,
    pointerEvents: visible ? ('auto' as const) : ('none' as const),
  }));

  function handleUserPress(userId: string) {
    router.push(`/user/${userId}`);
  }

  return (
    <Animated.View style={[StyleSheet.absoluteFill, s.overlay, backdropStyle]}>
      <Pressable style={s.backdrop} onPress={onClose} />
      <Animated.View style={[s.sheet, sheetStyle]}>
        <View style={[s.header, { paddingTop: insets.top + 14 }]}>
          <Text style={s.title}>Likes</Text>
          <TouchableOpacity onPress={onClose} hitSlop={12}>
            <Ionicons name="close" size={22} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <ActivityIndicator size="small" color={colors.accent} style={s.loading} />
        ) : likes.length === 0 ? (
          <Text style={s.empty}>No likes yet</Text>
        ) : (
          <FlatList
            data={likes}
            keyExtractor={(item) => item.id}
            style={s.list}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={s.row}
                onPress={() => handleUserPress(item.id)}
                activeOpacity={0.7}
              >
                <Image
                  source={{ uri: item.avatar_url ? resizeAvatar(item.avatar_url) : undefined }}
                  style={s.avatar}
                  contentFit="cover"
                  cachePolicy="memory-disk"
                />
                <Text style={s.username} numberOfLines={1}>
                  {item.username}
                </Text>
              </TouchableOpacity>
            )}
          />
        )}
      </Animated.View>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  overlay: {
    zIndex: 100,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    width: SHEET_WIDTH,
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: '700',
  },
  loading: {
    marginTop: 40,
  },
  empty: {
    color: colors.textSecondary,
    fontSize: 15,
    textAlign: 'center',
    marginTop: 40,
  },
  list: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
  },
  username: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
  },
});
