import { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Tabs, Redirect } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuthStore } from '@/store/auth';
import { useFeedStore } from '@/store/feed';
import { useExploreStore } from '@/store/explore';
import { ANIM, colors } from '@/constants/theme';
import { useUnreadCount } from '@/hooks/useUnreadCount';

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
  // Subscribe to unread count at the layout level — when the count
  // changes, TabLayout re-renders and passes new options to <Tabs.Screen>,
  // which makes React Navigation re-render the bottom-bar icon. Without
  // this, child-component-internal subscriptions don't propagate to the
  // tab bar (RN's BottomTabBar memoizes options).
  const { data: unreadCount = 0 } = useUnreadCount();
  const tabBarOpacity = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.timing(tabBarOpacity, {
      toValue: hudVisible ? 1 : 0,
      duration: ANIM.HUD_FADE_MS,
      useNativeDriver: true,
    }).start();
  }, [hudVisible]);

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
          {}
          {(() => {
            const { BottomTabBar } = require('@react-navigation/bottom-tabs');
            return <BottomTabBar {...props} />;
          })()}
        </Animated.View>
      )}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'rgba(0,0,0,0.4)',
          borderTopColor: 'rgba(255,255,255,0.08)',
          borderTopWidth: StyleSheet.hairlineWidth,
          position: 'absolute',
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: 'rgba(255,255,255,0.5)',
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
            // Re-tap active Home tab → IG-style scroll-to-top + refetch
            // (the screen subscribes to homeFeedResetToken to do both).
            if (activeTab === 'index') {
              regenerateSeed();
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
            paddingTop: 8,
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
