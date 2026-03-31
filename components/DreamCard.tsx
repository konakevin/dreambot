/**
 * DreamCard — shared full-screen image card used across all feed screens.
 * - Double-tap to like with animated heart burst
 * - Swipe left to visit the poster's profile
 */

import { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withTiming, withSequence, withSpring, runOnJS,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import {
  SWIPE_THRESHOLD, ACTIVE_OFFSET, FAIL_OFFSET,
  SWIPE_RESISTANCE, COUNTER_RESISTANCE, SNAP_SPRING, SLIDE_OFF_DURATION,
} from '@/constants/gestures';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface DreamPostItem {
  id: string;
  user_id: string;
  image_url: string;
  caption: string | null;
  username: string;
  avatar_url: string | null;
  is_ai_generated: boolean;
  created_at: string;
}

interface Props {
  item: DreamPostItem;
  bottomPadding: number;
  isLiked: boolean;
  onLike: () => void;
}

export function DreamCard({ item, bottomPadding, isLiked, onLike }: Props) {
  const lastTap = useRef(0);

  // Heart burst animation
  const heartScale = useSharedValue(0);
  const heartOpacity = useSharedValue(0);
  const heartStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
    opacity: heartOpacity.value,
  }));

  // Horizontal swipe
  const translateX = useSharedValue(0);
  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  function doLike() {
    if (!isLiked) onLike();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }

  function goToProfile() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/user/${item.user_id}`);
  }

  // Tap gesture — double tap detection
  const tapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      runOnJS(doLike)();
      heartScale.value = 0;
      heartOpacity.value = 1;
      heartScale.value = withSequence(
        withTiming(1.3, { duration: 200 }),
        withTiming(1, { duration: 100 }),
        withTiming(1, { duration: 400 }),
        withTiming(0, { duration: 200 }),
      );
      heartOpacity.value = withSequence(
        withTiming(1, { duration: 200 }),
        withTiming(1, { duration: 500 }),
        withTiming(0, { duration: 200 }),
      );
    });

  // Horizontal pan — swipe left to visit profile
  const panGesture = Gesture.Pan()
    .activeOffsetX([-ACTIVE_OFFSET, ACTIVE_OFFSET])
    .failOffsetY([-FAIL_OFFSET, FAIL_OFFSET])
    .onUpdate((e) => {
      translateX.value = e.translationX < 0
        ? e.translationX * SWIPE_RESISTANCE
        : e.translationX * COUNTER_RESISTANCE;
    })
    .onEnd((e) => {
      if (e.translationX < -SWIPE_THRESHOLD) {
        translateX.value = withTiming(-SCREEN_WIDTH, { duration: SLIDE_OFF_DURATION }, () => {
          runOnJS(goToProfile)();
          translateX.value = 0;
        });
      } else {
        translateX.value = withSpring(0, SNAP_SPRING);
      }
    });

  const composed = Gesture.Simultaneous(tapGesture, panGesture);

  return (
    <GestureDetector gesture={composed}>
      <Animated.View style={[s.card, cardStyle]}>
        <Image source={{ uri: item.image_url }} style={s.fullImage} contentFit="cover" transition={200} />

        {/* Profile hint on swipe — visible behind the card */}
        <View style={s.profileHint} pointerEvents="none">
          <Ionicons name="person" size={24} color="rgba(255,255,255,0.6)" />
          <Text style={s.profileHintText}>@{item.username}</Text>
        </View>

        {/* Double-tap heart animation */}
        <Animated.View style={[s.heartBurst, heartStyle]} pointerEvents="none">
          <Ionicons name="heart" size={80} color="#FFFFFF" />
        </Animated.View>

        {/* Post info overlay — bottom */}
        <View style={[s.postInfo, { paddingBottom: bottomPadding }]}>
          <TouchableOpacity
            style={s.usernameRow}
            onPress={() => router.push(`/user/${item.user_id}`)}
            activeOpacity={0.7}
          >
            {item.avatar_url ? (
              <Image source={{ uri: item.avatar_url }} style={s.avatar} />
            ) : (
              <View style={s.avatarFallback}>
                <Text style={s.avatarText}>{item.username[0].toUpperCase()}</Text>
              </View>
            )}
            <Text style={s.username}>{item.username}</Text>
            {item.is_ai_generated && <Ionicons name="sparkles" size={14} color="#FFD700" />}
          </TouchableOpacity>
          {item.caption && <Text style={s.caption} numberOfLines={2}>{item.caption}</Text>}
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

const s = StyleSheet.create({
  card: { width: SCREEN_WIDTH, height: SCREEN_HEIGHT, backgroundColor: '#000' },
  fullImage: { ...StyleSheet.absoluteFillObject },
  heartBurst: {
    position: 'absolute', top: '50%', left: '50%',
    marginTop: -40, marginLeft: -40,
  },
  profileHint: {
    position: 'absolute', right: -60, top: '45%',
    alignItems: 'center', gap: 4,
  },
  profileHintText: {
    color: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: '600',
  },
  postInfo: {
    position: 'absolute', bottom: 0, left: 0, right: 70,
    paddingHorizontal: 16, gap: 8,
  },
  usernameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  avatar: {
    width: 32, height: 32, borderRadius: 16,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)',
  },
  avatarFallback: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  username: {
    color: '#FFFFFF', fontSize: 15, fontWeight: '700',
    textShadowColor: 'rgba(0,0,0,0.5)', textShadowRadius: 4,
    textShadowOffset: { width: 0, height: 1 },
  },
  caption: {
    color: 'rgba(255,255,255,0.85)', fontSize: 14, lineHeight: 20,
    textShadowColor: 'rgba(0,0,0,0.5)', textShadowRadius: 4,
    textShadowOffset: { width: 0, height: 1 },
  },
});
