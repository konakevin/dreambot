/**
 * AvatarConfirm — a quick "use this photo?" preview confirm before an avatar
 * upload commits. Mirrors the global imperative pattern of CustomAlert /
 * PremiumGateSheet: mount <AvatarConfirmProvider> once at the app root, then
 * `const ok = await showAvatarConfirm(uri)` from anywhere (useChangeAvatar +
 * the Edit Profile screen). Shows the just-cropped image so the user can
 * eyeball it before it replaces their profile picture.
 */

import { useState, useCallback, useRef } from 'react';
import { View, Modal, Pressable, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from '@/components/AppText';
import { colors, gradients } from '@/constants/theme';
import { verticalScale, horizontalScale, fontScale } from '@/lib/responsive';

/** 'use' = upload it, 'retry' = let me pick another, 'cancel' = abandon. */
export type AvatarConfirmResult = 'use' | 'retry' | 'cancel';

// Global imperative entry point (set by the provider on mount).
let globalShow: ((uri: string) => Promise<AvatarConfirmResult>) | null = null;

/**
 * Show the confirm. Resolves 'use' (upload), 'retry' (re-open the picker), or
 * 'cancel' (abandon — tapped outside / back). Falls back to 'use' if the
 * provider isn't mounted, so the upload flow never dead-ends.
 */
export function showAvatarConfirm(uri: string): Promise<AvatarConfirmResult> {
  if (globalShow) return globalShow(uri);
  return Promise.resolve('use');
}

export function AvatarConfirmProvider({ children }: { children: React.ReactNode }) {
  const [uri, setUri] = useState<string | null>(null);
  const resolverRef = useRef<((r: AvatarConfirmResult) => void) | null>(null);

  const show = useCallback((u: string) => {
    setUri(u);
    return new Promise<AvatarConfirmResult>((resolve) => {
      resolverRef.current = resolve;
    });
  }, []);
  // Register the global imperative entry point (cheap; runs each render).
  globalShow = show;

  const finish = useCallback((r: AvatarConfirmResult) => {
    const resolve = resolverRef.current;
    resolverRef.current = null;
    setUri(null); // start dismissing the modal
    // For 'retry' the caller immediately re-presents the native image picker.
    // iOS silently drops a picker presented while a modal is still animating
    // out, so let the dismiss finish before resolving (→ before the re-launch).
    if (r === 'retry') {
      setTimeout(() => resolve?.(r), 350);
    } else {
      resolve?.(r);
    }
  }, []);

  return (
    <>
      {children}
      <Modal
        visible={!!uri}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => finish('cancel')}
      >
        <Pressable style={styles.overlay} onPress={() => finish('cancel')}>
          <Pressable style={styles.card} onPress={() => {}}>
            <Text style={styles.title}>Use this photo?</Text>
            {uri ? <Image source={{ uri }} style={styles.preview} contentFit="cover" /> : null}
            <View style={styles.row}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => finish('retry')}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelText}>Choose another</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.useBtnWrap}
                onPress={() => finish('use')}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={gradients.brand}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.useBtn}
                >
                  <Text style={styles.useText}>Use photo</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const PREVIEW = horizontalScale(180);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: horizontalScale(24),
  },
  card: {
    width: '100%',
    maxWidth: horizontalScale(340),
    backgroundColor: colors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: verticalScale(24),
    paddingHorizontal: horizontalScale(20),
    alignItems: 'center',
    gap: verticalScale(18),
  },
  title: {
    color: colors.textPrimary,
    fontSize: fontScale(18),
    fontWeight: '800',
  },
  preview: {
    width: PREVIEW,
    height: PREVIEW,
    borderRadius: PREVIEW / 2,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  row: {
    flexDirection: 'row',
    gap: horizontalScale(10),
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: verticalScale(14),
    borderRadius: 50,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    color: colors.textSecondary,
    fontSize: fontScale(15),
    fontWeight: '600',
  },
  useBtnWrap: {
    flex: 1,
  },
  useBtn: {
    paddingVertical: verticalScale(14),
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  useText: {
    color: '#0F0F14',
    fontSize: fontScale(15),
    fontWeight: '700',
  },
});
