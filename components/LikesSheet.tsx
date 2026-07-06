/**
 * LikesSheet — slide-in panel showing who liked a post.
 * Each row is tappable to navigate to that user's profile.
 * Uses absolute positioning instead of Modal to stay in the navigation context.
 */

import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Dimensions,
  Pressable,
} from 'react-native';
import { Text } from '@/components/AppText';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as nav from '@/lib/navigate';
import { avatarUrl as resizeAvatar } from '@/lib/imageUrl';
import { colors } from '@/constants/theme';
import { verticalScale, fontScale, isTabletDevice } from '@/lib/responsive';
import { usePostLikes } from '@/hooks/usePostLikes';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
// Right-side drawer: 75% of a phone, but capped to a sensible panel width on
// iPad (75% of a wide tablet is far too wide for a list of names).
const SHEET_WIDTH = isTabletDevice ? 420 : SCREEN_WIDTH * 0.75;

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

  // Swipe right to dismiss — the sheet lives on the right edge, so the
  // dismiss direction matches the iOS back-swipe users already do on the
  // profile screen. Drag follows the finger; past a third of the panel (or a
  // flick) it commits, otherwise it springs back. activeOffsetX/failOffsetY
  // keep the vertical likes list scrollable and row taps intact.
  const panGesture = Gesture.Pan()
    .activeOffsetX(10)
    .failOffsetY([-15, 15])
    .onUpdate((e) => {
      translateX.value = Math.max(0, e.translationX);
    })
    .onEnd((e) => {
      if (e.translationX > SHEET_WIDTH / 3 || e.velocityX > 500) {
        translateX.value = withTiming(SHEET_WIDTH, { duration: 200 }, () => {
          runOnJS(onClose)();
        });
      } else {
        translateX.value = withTiming(0, { duration: 200 });
      }
    });

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: visible ? 1 : 0,
    pointerEvents: visible ? ('auto' as const) : ('none' as const),
  }));

  function handleUserPress(userId: string) {
    nav.push(`/user/${userId}`);
  }

  return (
    <Animated.View style={[StyleSheet.absoluteFill, s.overlay, backdropStyle]}>
      <Pressable style={s.backdrop} onPress={onClose} />
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[s.sheet, sheetStyle]}>
          {/* Header matches the app's screen convention: < back on the left
              (no ✕ — Kevin 2026-07-05), title centered on the header box. */}
          <View style={[s.header, { paddingTop: insets.top + 14 }]}>
            <TouchableOpacity onPress={onClose} hitSlop={12} style={s.headerBack}>
              <Ionicons name="chevron-back" size={26} color={colors.textPrimary} />
            </TouchableOpacity>
            {/* Mirror the header's padding so the absolute-centered title sits
                on the same baseline as the chevron (the header box includes
                the safe-area inset). */}
            <View
              pointerEvents="none"
              style={[s.headerTitleCenter, { paddingTop: insets.top + 14 }]}
            >
              <Text style={s.title}>Likes</Text>
            </View>
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
      </GestureDetector>
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
    paddingHorizontal: 16,
    paddingBottom: verticalScale(14),
    borderBottomWidth: StyleSheet.hairlineWidth,
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
    paddingBottom: verticalScale(14),
  },
  title: {
    color: colors.textPrimary,
    fontSize: fontScale(17),
    fontWeight: '700',
  },
  loading: {
    marginTop: verticalScale(40),
  },
  empty: {
    color: colors.textSecondary,
    fontSize: fontScale(15),
    textAlign: 'center',
    marginTop: verticalScale(40),
  },
  list: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: verticalScale(10),
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
  },
  username: {
    color: colors.textPrimary,
    fontSize: fontScale(15),
    fontWeight: '600',
    flex: 1,
  },
});
