/**
 * UpscaleModal — dismissable status modal for an on-demand HD upscale.
 *
 * Nothing is auto-upscaled anymore; the first download of a post triggers the
 * upscale (request-upscale Edge Function) which runs ~17s server-side. This
 * modal is shown while we wait: it is DISMISSABLE (the upscale keeps running +
 * the user gets a `download_ready` push when done), and if left open it POLLS
 * the upload row and AUTO-SAVES the moment the HD image lands. See
 * UPSCALE_QUEUE_PLAN.md.
 *
 * Imperative API like Toast — mount UpscaleModalHost once in _layout, call
 * UpscaleModal.show(uploadId) from anywhere.
 */

import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { colors } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import { saveUrlToPhotos } from '@/lib/savePhoto';

type Phase = 'processing' | 'saving' | 'done' | 'timeout';
interface State {
  visible: boolean;
  uploadId: string | null;
}
type Listener = (s: State) => void;
let listener: Listener | null = null;

export const UpscaleModal = {
  /** Show the modal for an in-flight on-demand upscale of `uploadId`. */
  show(uploadId: string) {
    listener?.({ visible: true, uploadId });
  },
  hide() {
    listener?.({ visible: false, uploadId: null });
  },
};

const POLL_MS = 4000;
const MAX_POLLS = 30; // ~2 min

export function UpscaleModalHost() {
  const [state, setState] = useState<State>({ visible: false, uploadId: null });
  const [phase, setPhase] = useState<Phase>('processing');
  const opacity = useSharedValue(0);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const savingRef = useRef(false);

  useEffect(() => {
    listener = (next) => setState(next);
    return () => {
      listener = null;
    };
  }, []);

  // Animate in/out.
  useEffect(() => {
    opacity.value = withTiming(state.visible ? 1 : 0, { duration: 200 });
  }, [state.visible, opacity]);

  // Poll for the HD result while open; auto-save when it lands.
  useEffect(() => {
    if (!state.visible || !state.uploadId) return;
    const uploadId = state.uploadId;
    setPhase('processing');
    savingRef.current = false;
    let polls = 0;

    const stop = () => {
      if (pollRef.current) clearInterval(pollRef.current);
      pollRef.current = null;
    };

    const tick = async () => {
      polls += 1;
      if (savingRef.current) return;
      const { data } = await supabase
        .from('uploads')
        .select('image_url_hq')
        .eq('id', uploadId)
        .maybeSingle();
      const hq = (data as { image_url_hq?: string | null } | null)?.image_url_hq;
      if (hq) {
        savingRef.current = true;
        stop();
        setPhase('saving');
        await saveUrlToPhotos(uploadId, hq, true);
        setPhase('done');
        setTimeout(() => UpscaleModal.hide(), 1200);
        return;
      }
      if (polls >= MAX_POLLS) {
        stop();
        setPhase('timeout');
        setTimeout(() => UpscaleModal.hide(), 3000);
      }
    };

    pollRef.current = setInterval(tick, POLL_MS);
    return stop;
  }, [state.visible, state.uploadId]);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
  if (!state.visible) return null;

  const copy = {
    processing: {
      icon: 'sparkles' as const,
      title: "You're first to grab this in HD!",
      sub: "Nobody's saved this dream in HD yet — we're hand-polishing it just for you. Hang tight a sec, or keep browsing and we'll ping you the moment it's ready.",
      showSpinner: true,
      showDismiss: true,
    },
    saving: {
      icon: 'download' as const,
      title: 'Saving in HD…',
      sub: 'Almost done.',
      showSpinner: true,
      showDismiss: false,
    },
    done: {
      icon: 'checkmark-circle' as const,
      title: 'Saved in HD',
      sub: 'Straight to your Photos.',
      showSpinner: false,
      showDismiss: false,
    },
    timeout: {
      icon: 'time' as const,
      title: 'Still polishing your HD copy…',
      sub: "This one's taking a tick longer — we'll send a notification the moment it's ready to grab.",
      showSpinner: false,
      showDismiss: true,
    },
  }[phase];

  return (
    <Animated.View style={[StyleSheet.absoluteFill, styles.backdrop, animStyle]}>
      <Pressable style={StyleSheet.absoluteFill} onPress={() => {}}>
        <View style={styles.center}>
          <View style={styles.card}>
            {copy.showSpinner ? (
              <ActivityIndicator size="large" color={colors.accent} />
            ) : (
              <Ionicons name={copy.icon} size={40} color={colors.accent} />
            )}
            <Text style={styles.title}>{copy.title}</Text>
            <Text style={styles.subtitle}>{copy.sub}</Text>
            {copy.showDismiss && (
              <Pressable style={styles.dismissBtn} onPress={() => UpscaleModal.hide()} hitSlop={8}>
                <Text style={styles.dismissText}>Dismiss</Text>
              </Pressable>
            )}
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  backdrop: { backgroundColor: 'rgba(0, 0, 0, 0.78)', zIndex: 9999 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  card: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 28,
    paddingHorizontal: 32,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    maxWidth: 320,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: '700',
    marginTop: 18,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 18,
  },
  dismissBtn: {
    marginTop: 18,
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dismissText: { color: colors.textSecondary, fontSize: 14, fontWeight: '600' },
});
