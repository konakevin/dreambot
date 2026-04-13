/**
 * ScreenLayout — shared wrapper for all pushed and modal screens.
 *
 * Enforces consistent SafeAreaView, background, and header rendering.
 * Tab screens (Home, Explore, Create, Inbox, Profile) may use this with
 * header="none" for fullscreen feeds, or use their own layout.
 *
 * Usage:
 *   <ScreenLayout header="back" title="Settings">
 *     <ScrollView>...</ScrollView>
 *   </ScreenLayout>
 *
 *   <ScreenLayout header="close" title="Comments">
 *     <FlatList>...</FlatList>
 *   </ScreenLayout>
 *
 *   <ScreenLayout header="none">
 *     <FullScreenFeed>...</FullScreenFeed>
 *   </ScreenLayout>
 */

import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSwipeBack } from '@/hooks/useSwipeBack';
import { colors } from '@/constants/theme';
import { HEADER_H_PAD, HEADER_V_PAD, NAV_ICON_SIZE, NAV_HIT_SLOP } from '@/constants/layout';

interface ScreenLayoutProps {
  /** Header type: 'back' for pushed screens, 'close' for modals, 'none' for fullscreen */
  header?: 'back' | 'close' | 'none';
  /** Title shown in the header (centered for 'back', left-aligned for 'close') */
  title?: string;
  /** Optional action element on the opposite side of the back/close button */
  rightAction?: React.ReactNode;
  /** Optional left action (replaces the default back/close button) */
  leftAction?: React.ReactNode;
  /** Whether to enable swipe-right-to-dismiss (default: true for 'back', false for others) */
  swipeBack?: boolean;
  /** SafeAreaView edges to respect (default: ['top']) */
  edges?: Edge[];
  /** Background color override */
  bg?: string;
  children: React.ReactNode;
}

export function ScreenLayout({
  header = 'back',
  title,
  rightAction,
  leftAction,
  swipeBack,
  edges = ['top'],
  bg = colors.background,
  children,
}: ScreenLayoutProps) {
  const enableSwipe = swipeBack ?? header === 'back';
  const { translateX, panHandlers } = useSwipeBack();

  const content = (
    <SafeAreaView style={[s.root, { backgroundColor: bg }]} edges={edges}>
      {header !== 'none' && (
        <View style={s.header}>
          <View style={s.headerSide}>
            {leftAction ?? (
              <TouchableOpacity
                onPress={() => (header === 'close' ? router.dismiss() : router.back())}
                hitSlop={NAV_HIT_SLOP}
              >
                <Ionicons
                  name={header === 'close' ? 'close' : 'chevron-back'}
                  size={NAV_ICON_SIZE}
                  color={colors.textPrimary}
                />
              </TouchableOpacity>
            )}
          </View>
          {title ? (
            <Text style={s.title} numberOfLines={1}>
              {title}
            </Text>
          ) : (
            <View style={s.titleSpacer} />
          )}
          <View style={s.headerSide}>
            {rightAction ?? <View style={{ width: NAV_ICON_SIZE }} />}
          </View>
        </View>
      )}
      {children}
    </SafeAreaView>
  );

  if (!enableSwipe) return content;

  return (
    <Animated.View style={[s.swipeRoot, { transform: [{ translateX }] }]} {...panHandlers}>
      {content}
    </Animated.View>
  );
}

const s = StyleSheet.create({
  swipeRoot: { flex: 1 },
  root: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: HEADER_H_PAD,
    paddingVertical: HEADER_V_PAD,
  },
  headerSide: {
    width: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: '700',
  },
  titleSpacer: { flex: 1 },
});
