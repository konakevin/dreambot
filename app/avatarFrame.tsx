/**
 * Move and Scale — frame a profile picture in the circle, then save it.
 *
 * Opened from the dream picker, a dream's long-press "Use as profile picture", and
 * the library / camera rows of the profile-picture sheet. Pinch to zoom (up to the
 * sharpness limit), drag to move. At zoom 1 a tall dream fills the circle's width,
 * so only up/down does anything until you zoom in.
 *
 * "Use as profile picture" crops the square on the phone (lib/avatarPicture.ts) and
 * hands it to the existing avatar upload, so the saved file is a copy and nothing
 * about the framing lives on the server.
 *
 * Params: uri (a dream URL or a local photo), source (dream | library | camera),
 * from=picker (a save closes the dream picker too).
 */
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Text } from '@/components/AppText';
import { GradientButton } from '@/components/GradientButton';
import { GradientTitle } from '@/components/GradientTitle';
import { Toast } from '@/components/Toast';
import { showAlert } from '@/components/CustomAlert';
import { colors } from '@/constants/theme';
import { useAvatarUpload } from '@/hooks/useAvatarUpload';
import {
  baseScale,
  cropRect,
  initialCrop,
  panStep,
  pinchStep,
  type CropState,
} from '@/lib/avatarCrop';
import {
  DREAM_FOCUS_Y,
  cropAvatar,
  prepareAvatarSource,
  type PreparedPicture,
} from '@/lib/avatarPicture';
import { fontScale, horizontalScale, verticalScale } from '@/lib/responsive';

const GUTTER = horizontalScale(16);
const FRAME_INSET = horizontalScale(24);
const NAV_H = horizontalScale(32);

export default function AvatarFrameScreen() {
  const params = useLocalSearchParams<{ uri?: string; source?: string; from?: string }>();
  const insets = useSafeAreaInsets();
  const { mutate: uploadAvatar, isPending: uploading } = useAvatarUpload();

  const [picture, setPicture] = useState<PreparedPicture | null>(null);
  const [stage, setStage] = useState<{ w: number; h: number } | null>(null);
  const [cropping, setCropping] = useState(false);
  const saving = cropping || uploading;

  // The circle: as wide as the screen allows, leaving room above and below.
  const frame = stage ? Math.min(stage.w - FRAME_INSET * 2, stage.h - verticalScale(96)) : 0;

  // ── Load the picture (download a dream, bake camera rotation) ──
  useEffect(() => {
    const uri = params.uri;
    if (!uri) return;
    let alive = true;
    prepareAvatarSource(uri)
      .then((p) => {
        if (alive) setPicture(p);
      })
      .catch((e: unknown) => {
        if (__DEV__) console.warn('[avatarFrame] prepare failed', e);
        if (!alive) return;
        showAlert('Couldn’t open that picture', 'Try another one.', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      });
    return () => {
      alive = false;
    };
  }, [params.uri]);

  // ── Framing state (UI thread) ──
  const zoom = useSharedValue(1);
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const lastScale = useSharedValue(1);
  const lastTX = useSharedValue(0);
  const lastTY = useSharedValue(0);

  // Start framing once the picture and the circle size are both known.
  useEffect(() => {
    if (!picture || !frame) return;
    const start = initialCrop(picture, frame, params.source === 'dream' ? DREAM_FOCUS_Y : 0.5);
    zoom.value = start.zoom;
    x.value = start.x;
    y.value = start.y;
  }, [picture, frame, params.source, zoom, x, y]);

  const gesture = useMemo(() => {
    if (!picture || !stage || !frame) return Gesture.Tap().enabled(false);
    const pic = { width: picture.width, height: picture.height };
    const cx = stage.w / 2;
    const cy = stage.h / 2;
    const apply = (next: CropState) => {
      'worklet';
      zoom.value = next.zoom;
      x.value = next.x;
      y.value = next.y;
    };
    const pinch = Gesture.Pinch()
      .onStart(() => {
        lastScale.value = 1;
      })
      .onUpdate((e) => {
        const ratio = e.scale / lastScale.value;
        lastScale.value = e.scale;
        apply(
          pinchStep(pic, frame, { zoom: zoom.value, x: x.value, y: y.value }, ratio, {
            x: e.focalX - cx,
            y: e.focalY - cy,
          })
        );
      });
    const pan = Gesture.Pan()
      .maxPointers(2)
      .onStart(() => {
        lastTX.value = 0;
        lastTY.value = 0;
      })
      .onUpdate((e) => {
        const dx = e.translationX - lastTX.value;
        const dy = e.translationY - lastTY.value;
        lastTX.value = e.translationX;
        lastTY.value = e.translationY;
        apply(panStep(pic, frame, { zoom: zoom.value, x: x.value, y: y.value }, dx, dy));
      });
    return Gesture.Simultaneous(pinch, pan);
  }, [picture, stage, frame, zoom, x, y, lastScale, lastTX, lastTY]);

  const pictureStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }, { translateY: y.value }, { scale: zoom.value }],
  }));

  // Size of the picture at zoom 1, centred on the circle.
  const base = picture && frame ? baseScale(picture, frame) : 0;
  const shownW = picture ? picture.width * base : 0;
  const shownH = picture ? picture.height * base : 0;

  async function handleUse() {
    if (!picture || !frame || saving) return;
    setCropping(true);
    try {
      const rect = cropRect(picture, frame, { zoom: zoom.value, x: x.value, y: y.value });
      const cropped = await cropAvatar(picture, rect);
      uploadAvatar(cropped, {
        onSuccess: () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          Toast.show('Profile picture updated', 'checkmark-circle');
          router.dismiss(params.from === 'picker' ? 2 : 1);
        },
      });
    } catch (e: unknown) {
      if (__DEV__) console.warn('[avatarFrame] crop failed', e);
      showAlert('Couldn’t save that picture', 'Try again in a moment.');
    } finally {
      setCropping(false);
    }
  }

  // The dim ring around the circle: a transparent hole in a very thick border.
  const ring = stage ? Math.max(stage.w, stage.h) : 0;

  return (
    <View style={styles.root}>
      <View style={[styles.nav, { paddingTop: insets.top + verticalScale(6) }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.navChip}
          hitSlop={10}
          accessibilityLabel="Back"
        >
          <Ionicons name="chevron-back" size={horizontalScale(20)} color={colors.textPrimary} />
        </TouchableOpacity>
        <GradientTitle adjustsFontSizeToFit>Move and Scale</GradientTitle>
        <View style={styles.navChipSpacer} />
      </View>

      <GestureDetector gesture={gesture}>
        <View
          style={styles.stage}
          onLayout={(e) =>
            setStage({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height })
          }
        >
          {picture && stage && frame ? (
            <>
              <Animated.View
                style={[
                  {
                    position: 'absolute',
                    width: shownW,
                    height: shownH,
                    left: stage.w / 2 - shownW / 2,
                    top: stage.h / 2 - shownH / 2,
                  },
                  pictureStyle,
                ]}
              >
                <Image source={{ uri: picture.uri }} style={styles.fill} contentFit="fill" />
              </Animated.View>
              <View
                pointerEvents="none"
                style={[
                  styles.ring,
                  {
                    width: frame + ring * 2,
                    height: frame + ring * 2,
                    borderRadius: frame / 2 + ring,
                    borderWidth: ring,
                    left: stage.w / 2 - frame / 2 - ring,
                    top: stage.h / 2 - frame / 2 - ring,
                  },
                ]}
              />
              <View
                pointerEvents="none"
                style={[
                  styles.circleEdge,
                  {
                    width: frame,
                    height: frame,
                    borderRadius: frame / 2,
                    left: stage.w / 2 - frame / 2,
                    top: stage.h / 2 - frame / 2,
                  },
                ]}
              />
              <Text style={[styles.hint, { top: stage.h / 2 + frame / 2 + verticalScale(14) }]}>
                Pinch to zoom, drag to move
              </Text>
            </>
          ) : (
            <ActivityIndicator color={colors.textSecondary} style={styles.loading} />
          )}
        </View>
      </GestureDetector>

      <View style={[styles.footer, { paddingBottom: insets.bottom + verticalScale(10) }]}>
        <GradientButton
          label={saving ? 'Saving…' : 'Use as profile picture'}
          onPress={() => void handleUse()}
          disabled={!picture || saving}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: GUTTER,
    paddingBottom: verticalScale(8),
    zIndex: 2,
  },
  navChip: {
    width: NAV_H,
    height: NAV_H,
    borderRadius: NAV_H / 2,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navChipSpacer: { width: NAV_H },
  stage: { flex: 1, overflow: 'hidden' },
  fill: { width: '100%', height: '100%' },
  ring: { position: 'absolute', borderColor: 'rgba(0,0,0,0.62)' },
  circleEdge: {
    position: 'absolute',
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: 'rgba(255,255,255,0.7)',
  },
  hint: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    color: colors.subtleOnDark,
    fontSize: fontScale(13),
  },
  loading: { flex: 1 },
  footer: { paddingHorizontal: GUTTER, paddingTop: verticalScale(10) },
});
