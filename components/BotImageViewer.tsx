/**
 * Fullscreen swipeable image viewer for bot post thumbnails.
 * Horizontal pager-style FlatList scrolls between the bot's thumbnails.
 * Pull-down gesture dismisses (failOffsetX keeps horizontal paging intact).
 */

import { useRef, useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  Dimensions,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

export function BotImageViewer({
  urls,
  initialIndex,
  onClose,
}: {
  urls: string[];
  initialIndex: number;
  onClose: () => void;
}) {
  const listRef = useRef<FlatList<string>>(null);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(0);

  function handleScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const idx = Math.round(e.nativeEvent.contentOffset.x / SCREEN_W);
    if (idx !== currentIndex) {
      setCurrentIndex(idx);
      Haptics.selectionAsync();
    }
  }

  function handleClose() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  }

  const DISMISS_DISTANCE = 120;
  const DISMISS_VELOCITY = 800;
  const panGesture = Gesture.Pan()
    .activeOffsetY([10, 9999])
    .failOffsetX([-15, 15])
    .onUpdate((e) => {
      translateY.value = Math.max(0, e.translationY);
    })
    .onEnd((e) => {
      const shouldDismiss = e.translationY > DISMISS_DISTANCE || e.velocityY > DISMISS_VELOCITY;
      if (shouldDismiss) {
        translateY.value = withTiming(SCREEN_H, { duration: 200 }, () => {
          runOnJS(onClose)();
        });
      } else {
        translateY.value = withSpring(0, { damping: 18, stiffness: 220 });
      }
    });

  const contentStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));
  const backdropStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateY.value, [0, SCREEN_H * 0.4], [1, 0], Extrapolation.CLAMP),
  }));

  return (
    <Modal visible animationType="fade" transparent onRequestClose={onClose}>
      <View style={vs.root}>
        <Animated.View style={[StyleSheet.absoluteFillObject, vs.backdrop, backdropStyle]} />
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[vs.page, contentStyle]}>
            <FlatList
              ref={listRef}
              data={urls}
              keyExtractor={(url, idx) => `${idx}-${url}`}
              horizontal
              // snapToInterval instead of pagingEnabled: the iOS paging settle
              // ignores new touches until it completes, killing rapid swipes.
              // decelerationRate="fast" restores the quick page-settle feel
              // pagingEnabled provided implicitly. 2026-06-12.
              snapToInterval={SCREEN_W}
              snapToAlignment="start"
              disableIntervalMomentum
              decelerationRate="fast"
              showsHorizontalScrollIndicator={false}
              initialScrollIndex={initialIndex}
              getItemLayout={(_, index) => ({
                length: SCREEN_W,
                offset: SCREEN_W * index,
                index,
              })}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              renderItem={({ item }) => (
                <View style={vs.page}>
                  <Image source={{ uri: item }} style={vs.image} contentFit="contain" />
                </View>
              )}
            />
          </Animated.View>
        </GestureDetector>

        <View style={[vs.closeWrap, { top: insets.top + 36 }]} pointerEvents="box-none">
          <TouchableOpacity
            style={vs.closeBtn}
            onPress={handleClose}
            activeOpacity={0.7}
            hitSlop={12}
          >
            <Ionicons name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const vs = StyleSheet.create({
  root: {
    flex: 1,
  },
  backdrop: {
    backgroundColor: '#000000',
  },
  page: {
    width: SCREEN_W,
    height: SCREEN_H,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: SCREEN_W,
    height: SCREEN_H,
  },
  closeWrap: {
    position: 'absolute',
    right: 12,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
