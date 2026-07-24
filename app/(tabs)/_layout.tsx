import { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, Pressable } from 'react-native';
import { Tabs, Redirect } from 'expo-router';
import { BottomTabBar, type BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
// Aliased: this file already uses core RN `Animated` for the tab-bar fade.
import Reanimated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuthStore } from '@/store/auth';
import { useFeedStore } from '@/store/feed';
import { useExploreStore } from '@/store/explore';
import { ANIM, colors } from '@/constants/theme';
import { verticalScale } from '@/lib/responsive';
import { useNewNotificationCount } from '@/hooks/useNewNotificationCount';
import { useUnseenDreamsCount } from '@/hooks/useUnseenDreamsCount';
import { RenderDock } from '@/components/RenderDock';

const ReanimatedView = Reanimated.View;

// Tab-bar button with the TikTok-style pressed "squish": the icon scales down
// while the finger is DOWN and returns to form on lift. No opacity/darken — the
// 5-star tab bars (TikTok's squish, IG's instant selection flip) never dim
// (Kevin 2026-07-21). The squish fires on press-IN, i.e. BEFORE release can
// trigger a first-visit screen mount, so the down-state is always instant;
// worst case on a heavy first mount the icon stays squished a beat longer,
// which reads as "held", not broken. NOT a function-form Pressable style —
// the React Compiler silently drops those (project memory 2026-07-01). Props
// are hand-picked (not spread): the bottom-tabs button prop shape isn't
// assignable to Pressable's.
const TAB_PRESS_SCALE = 0.92;
function TabBarPressButton(props: BottomTabBarButtonProps) {
  const scale = useSharedValue(1);
  const squishStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={props.accessibilityState}
      accessibilityLabel={props.accessibilityLabel}
      testID={props.testID}
      onPress={props.onPress ?? undefined}
      onLongPress={props.onLongPress ?? undefined}
      style={props.style}
      onPressIn={() => {
        // One quick squish down… (timing, not springs — a bouncy release
        // oscillated like a rubber icon; TikTok's is a single clean
        // down-and-back with zero overshoot. Kevin 2026-07-21.)
        scale.value = withTiming(TAB_PRESS_SCALE, {
          duration: 80,
          easing: Easing.out(Easing.quad),
        });
      }}
      onPressOut={() => {
        // …and straight back to form. No spring, no wobble.
        scale.value = withTiming(1, { duration: 130, easing: Easing.out(Easing.quad) });
      }}
    >
      <ReanimatedView
        style={[{ flex: 1, alignItems: 'center', justifyContent: 'center' }, squishStyle]}
      >
        {props.children}
      </ReanimatedView>
    </Pressable>
  );
}

// Pure render — receives unreadCount as a prop. The subscription lives at
// TabLayout level so parent re-renders propagate new options to RN's tab
// bar (RN doesn't re-call tabBarIcon unless options change or focus
// switches — child-internal state changes aren't observed by the bar).
function ProfileTabIcon({
  color,
  size,
  focused,
  showDot,
}: {
  color: string;
  size: number;
  focused: boolean;
  showDot: boolean;
}) {
  return (
    <View>
      {/* Filled when active, outline at rest — matches every other tab. */}
      <Ionicons name={focused ? 'person' : 'person-outline'} size={size} color={color} />
      {showDot && <View style={tabStyles.dot} />}
    </View>
  );
}

export default function TabLayout() {
  const { session, initialized } = useAuthStore();
  const bumpProfileReset = useFeedStore((s) => s.bumpProfileReset);
  const regenerateSeed = useFeedStore((s) => s.regenerateSeed);
  const activeTab = useFeedStore((s) => s.activeTab);
  const setActiveTab = useFeedStore((s) => s.setActiveTab);
  const hudVisible = useFeedStore((s) => s.hudVisible);
  // Subscribe to new-since-last-view count at the layout level — when the
  // count changes, TabLayout re-renders and passes new options to
  // <Tabs.Screen>, which makes React Navigation re-render the bottom-bar
  // icon. Without this, child-component-internal subscriptions don't
  // propagate to the tab bar (RN's BottomTabBar memoizes options).
  // Migration 223: "viewed = read" — count = notifications created AFTER
  // users.last_inbox_view_at. Same hook drives useBadgeSync (iOS app icon
  // badge), so the home-screen badge and this profile-tab dot are always
  // identical.
  const { data: unreadCount = 0 } = useNewNotificationCount();
  // Same idea for unseen dream renders (migration 397): manual dreams don't hit
  // the inbox (migration 396), so they'd never dot the Profile tab via the
  // notification count. OR the two so the dot means "something new in here."
  // Subscribed at layout level for the same tab-bar propagation reason.
  const { data: unseenDreams = 0 } = useUnseenDreamsCount();
  const insets = useSafeAreaInsets();
  // Tab-bar bottom padding: prefer the safe-area inset (home indicator on
  // newer phones), fall back to a sensible floor so icons don't sit flush
  // against the screen edge on devices without a home indicator (older
  // iPhones, iPhone SE 3rd gen with `Display Zoom: Default`).
  const tabBarBottomPad = insets.bottom > 0 ? insets.bottom : verticalScale(8);
  // Approx tab-bar height (paddingTop + icon row + bottom pad) — used to sit the
  // render dock just above the bar. A few px off is harmless (see RenderDock).
  const tabBarApproxHeight = verticalScale(8) + 30 + tabBarBottomPad;
  const tabBarOpacity = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.timing(tabBarOpacity, {
      toValue: hudVisible ? 1 : 0,
      duration: ANIM.HUD_FADE_MS,
      useNativeDriver: true,
    }).start();
  }, [hudVisible, tabBarOpacity]);

  if (initialized && !session) {
    return <Redirect href="/(auth)" />;
  }

  return (
    <Tabs
      tabBar={(props) => (
        <Animated.View
          style={{ opacity: tabBarOpacity, pointerEvents: hudVisible ? 'auto' : 'none' }}
        >
          {/* Render dock — the "N dreams cooking" pill, floated just above the
            bar. Fades with the tab bar (this wrapper's opacity/pointerEvents) so
            it never clutters the immersive feed. A small gap above the bar lets
            it read as its own floating element, not a second nav row, and keeps
            its tap target clear of the tab icons (Kevin 2026-07-23). */}
          <RenderDock bottomOffset={tabBarApproxHeight + verticalScale(8)} />
          {/* Default bottom tab bar from Expo Router */}
          <BottomTabBar {...props} />
        </Animated.View>
      )}
      screenOptions={{
        headerShown: false,
        // Pressed "down" state on every tab (quick squish while the finger is down).
        tabBarButton: (props) => <TabBarPressButton {...props} />,
        tabBarStyle: {
          backgroundColor: 'rgba(0,0,0,0.4)',
          borderTopColor: 'rgba(255,255,255,0.08)',
          borderTopWidth: StyleSheet.hairlineWidth,
          position: 'absolute',
          paddingTop: verticalScale(8),
          paddingBottom: tabBarBottomPad,
        },
        tabBarActiveTintColor: '#FFFFFF',
        // Lighter than the old 0.5 so unselected tabs stay readable over busy
        // images at the bottom of the feed (still clearly dimmer than active).
        tabBarInactiveTintColor: 'rgba(255,255,255,0.7)',
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />
          ),
        }}
        listeners={{
          tabPress: () => {
            // Re-tap active Home tab → IG-style scroll-to-top + quiet reshuffle
            // (the screen subscribes to homeFeedResetToken; its onRefresh owns
            // the reseed — a second regenerateSeed() here double-refetched:
            // instant refetch on seed A while the quiet flow prefetched seed B).
            if (activeTab === 'index') {
              useFeedStore.getState().bumpHomeFeedReset();
            }
            setActiveTab('index');
          },
        }}
      />
      <Tabs.Screen
        name="bots"
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'robot' : 'robot-outline'}
              size={size + 2}
              color={color}
            />
          ),
        }}
        listeners={{
          tabPress: () => {
            // Re-tap active Bots tab → reset selection to "All" + refresh every
            // bot feed. regenerateSeed bumps feedSeed (in every bots query key)
            // so each bot refetches the latest; bumpBotsReset tells the screen
            // to snap back to the All page + clear per-bot scroll memory.
            if (activeTab === 'bots') {
              regenerateSeed();
              useFeedStore.getState().bumpBotsReset();
            }
            setActiveTab('bots');
          },
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'add-circle' : 'add-circle-outline'}
              size={size}
              color={color}
            />
          ),
        }}
        listeners={{
          tabPress: () => {
            setActiveTab('create');
          },
        }}
      />
      <Tabs.Screen
        name="top"
        options={{
          // Solid black bar (matches profile): the search grid is a browsing
          // surface, not the immersive feed — content showing through the
          // translucent default reads as clutter here (Kevin 2026-07-09).
          tabBarStyle: {
            backgroundColor: '#000000',
            borderTopColor: 'rgba(255,255,255,0.08)',
            borderTopWidth: StyleSheet.hairlineWidth,
            position: 'absolute',
            paddingTop: verticalScale(8),
            paddingBottom: tabBarBottomPad,
          },
          // 'search' has no true filled sibling — 'sharp' is its bolder variant.
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'search-sharp' : 'search-outline'}
              size={size}
              color={color}
            />
          ),
        }}
        listeners={{
          tabPress: () => {
            const { searchActive, setSearchActive } = useExploreStore.getState();
            if (searchActive) {
              setSearchActive(false);
            } else if (activeTab === 'top') {
              // Re-tap active Top tab → scroll-to-top + refetch
              regenerateSeed();
              useFeedStore.getState().bumpTopGridReset();
            }
            setActiveTab('top');
          },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarStyle: {
            backgroundColor: '#000000',
            borderTopColor: 'rgba(255,255,255,0.08)',
            borderTopWidth: StyleSheet.hairlineWidth,
            position: 'absolute',
            paddingTop: verticalScale(8),
            paddingBottom: tabBarBottomPad,
          },
          tabBarIcon: ({ color, size, focused }) => (
            <ProfileTabIcon
              color={color}
              size={size}
              focused={focused}
              showDot={unreadCount > 0 || unseenDreams > 0}
            />
          ),
        }}
        listeners={{
          tabPress: () => {
            setActiveTab('profile');
            bumpProfileReset();
          },
        }}
      />
    </Tabs>
  );
}

const tabStyles = StyleSheet.create({
  dot: {
    position: 'absolute',
    top: -2,
    right: -4,
    width: 9,
    height: 9,
    borderRadius: 5,
    // Match the red inbox/bell badge on the profile screen (colors.like), not
    // the purple accent — same "you have notifications" signal, same color.
    backgroundColor: colors.like,
    // Subtle dark ring keeps the dot readable when the tab bar
    // background lightens (active tint state)
    borderWidth: 1,
    borderColor: '#000000',
  },
});
