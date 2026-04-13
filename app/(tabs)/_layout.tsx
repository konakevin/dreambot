import { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Tabs, Redirect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth';
import { useFeedStore } from '@/store/feed';
import { ANIM } from '@/constants/theme';
import { useUnreadCount } from '@/hooks/useUnreadCount';

export default function TabLayout() {
  const { session, initialized } = useAuthStore();
  const bumpProfileReset = useFeedStore((s) => s.bumpProfileReset);
  const regenerateSeed = useFeedStore((s) => s.regenerateSeed);
  const activeTab = useFeedStore((s) => s.activeTab);
  const setActiveTab = useFeedStore((s) => s.setActiveTab);
  const hudVisible = useFeedStore((s) => s.hudVisible);
  const tabBarOpacity = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.timing(tabBarOpacity, {
      toValue: hudVisible ? 1 : 0,
      duration: ANIM.HUD_FADE_MS,
      useNativeDriver: true,
    }).start();
  }, [hudVisible]);
  const queryClient = useQueryClient();
  const { data: unreadCount = 0 } = useUnreadCount();

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
            if (activeTab === 'index') {
              regenerateSeed();
            }
            setActiveTab('index');
          },
        }}
      />
      <Tabs.Screen
        name="top"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" size={size} color={color} />
          ),
        }}
        listeners={{
          tabPress: () => {
            if (activeTab === 'top') regenerateSeed();
            setActiveTab('top');
          },
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="moon-outline" size={size} color={color} />
          ),
        }}
        listeners={{
          tabPress: () => {
            setActiveTab('create');
          },
        }}
      />
      <Tabs.Screen
        name="inbox"
        options={{
          tabBarStyle: {
            backgroundColor: '#000000',
            borderTopColor: 'rgba(255,255,255,0.08)',
            borderTopWidth: StyleSheet.hairlineWidth,
            position: 'absolute',
            paddingTop: 8,
          },
          tabBarIcon: ({ color, size }) => (
            <View>
              <Ionicons name="chatbubble-outline" size={size} color={color} />
              {unreadCount > 0 && (
                <View style={tabStyles.badge}>
                  <Text style={tabStyles.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
                </View>
              )}
            </View>
          ),
        }}
        listeners={{
          tabPress: () => {
            setActiveTab('inbox');
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
            <Ionicons name="person-outline" size={size} color={color} />
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
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: '#E8485F',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
});
