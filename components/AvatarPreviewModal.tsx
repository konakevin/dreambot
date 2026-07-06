/**
 * AvatarPreviewModal — tap-to-expand a profile photo to a full, centered view
 * (Instagram-style): dark scrim, the avatar enlarged as a circle, an @handle,
 * and a close button. Tap anywhere (or the X) to dismiss.
 *
 * 2026-07-05 de-jank (Kevin: "flashes black then the image pops in"):
 *   • The circle now scales up smoothly (0.55 → 1 spring) instead of the
 *     Modal fade just revealing a static layout.
 *   • The full-size image gets the 128px avatar-transform URI as an
 *     expo-image placeholder — that thumb is already in memory cache from
 *     the profile header, so the circle has pixels from frame 0 and the
 *     full-res crossfades over it. (Raw URI alone was a cache miss → the
 *     circle rendered empty over the scrim until decode finished.)
 */

import { useEffect } from 'react';
import { Modal, TouchableOpacity, View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/AppText';
import { colors } from '@/constants/theme';
import { fontScale, verticalScale } from '@/lib/responsive';
import { avatarUrl as avatarThumbUrl } from '@/lib/imageUrl';

interface Props {
  visible: boolean;
  avatarUrl: string | null;
  /** Handle shown under the photo (without the leading @). */
  username?: string | null;
  onClose: () => void;
}

const { width } = Dimensions.get('window');
const SIZE = Math.min(width - 64, 340);

export function AvatarPreviewModal({ visible, avatarUrl, username, onClose }: Props) {
  const initial = (username || '?')[0]?.toUpperCase() ?? '?';

  // Scale-in on every open. The Modal's own fade handles the scrim; the
  // circle springs up from 55% so the reveal reads as an expansion, not a
  // static layout appearing.
  const scale = useSharedValue(0.55);
  useEffect(() => {
    if (visible) {
      scale.value = 0.55;
      scale.value = withSpring(1, { damping: 16, stiffness: 180 });
    } else {
      scale.value = withTiming(0.55, { duration: 120 });
    }
  }, [visible, scale]);
  const scaleStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <Animated.View style={[styles.image, scaleStyle]}>
          {avatarUrl ? (
            <Image
              source={{ uri: avatarUrl }}
              placeholder={{ uri: avatarThumbUrl(avatarUrl) }}
              placeholderContentFit="cover"
              transition={150}
              style={styles.fill}
              contentFit="cover"
            />
          ) : (
            <View style={[styles.fill, styles.fallback]}>
              <Text style={styles.initial}>{initial}</Text>
            </View>
          )}
        </Animated.View>
        {username ? <Text style={styles.username}>@{username}</Text> : null}
        <TouchableOpacity style={styles.close} onPress={onClose} hitSlop={12}>
          <Ionicons name="close" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: { width: SIZE, height: SIZE, borderRadius: 9999, overflow: 'hidden' },
  fill: { width: '100%', height: '100%' },
  fallback: { backgroundColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  initial: { color: '#FFFFFF', fontSize: SIZE * 0.4, fontWeight: '700' },
  username: {
    color: '#FFFFFF',
    fontSize: fontScale(17),
    fontWeight: '700',
    marginTop: verticalScale(20),
  },
  close: { position: 'absolute', top: verticalScale(56), right: 20 },
});
