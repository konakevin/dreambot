import { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Tabs, Redirect } from 'expo-router';
import { BottomTabBar } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuthStore } from '@/store/auth';
import { useFeedStore } from '@/store/feed';
import { useExploreStore } from '@/store/explore';
import { ANIM, colors } from '@/constants/theme';
import { verticalScale } from '@/lib/responsive';
import { useNewNotificationCount } from '@/hooks/useNewNotificationCount';

// Pure render — receives unreadCount as a prop. The subscription lives at
// TabLayout level so parent re-renders propagate new options to RN's tab
// bar (RN doesn't re-call tabBarIcon unless options change or focus
// switches — child-internal state changes aren't observed by the bar).
function ProfileTabIcon({
  color,
  size,
  unreadCount,
}: {
  color: string;
  size: number;
  unreadCount: number;
}) {
  return (
    <View>
      <Ionicons name="person-outline" size={size} color={color} />
      {unreadCount > 0 && <View style={tabStyles.dot} />}
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
  const insets = useSafeAreaInsets();
  // Tab-bar bottom padding: prefer the safe-area inset (home indicator on
  // newer phones), fall back to a sensible floor so icons don't sit flush
  // against the screen edge on devices without a home indicator (older
  // iPhones, iPhone SE 3rd gen with `Display Zoom: Default`).
  const tabBarBottomPad = insets.bottom > 0 ? insets.bottom : verticalScale(8);
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
          {/* Default bottom tab bar from Expo Router */}
          <BottomTabBar {...props} />
        </Animated.View>
      )}
      screenOptions={{
        headerShown: false,
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
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
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
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle-outline" size={size} color={color} />
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
          tabBarIcon: ({ color, size }) => <Ionicons name="search" size={size} color={color} />,
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
          tabBarIcon: ({ color, size }) => (
            <ProfileTabIcon color={color} size={size} unreadCount={unreadCount} />
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
    backgroundColor: colors.accent,
    // Subtle dark ring keeps the dot readable when the tab bar
    // background lightens (active tint state)
    borderWidth: 1,
    borderColor: '#000000',
  },
});
