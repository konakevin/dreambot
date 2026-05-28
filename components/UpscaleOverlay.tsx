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

import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { colors } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import { saveUrlToPhotos } from '@/lib/savePhoto';
import { startHqPoll } from '@/lib/upscalePoll';

type Phase = 'requesting' | 'processing' | 'saving' | 'done' | 'timeout';
interface State {
  visible: boolean;
  uploadId: string | null;
  phase: Phase;
}
type Listener = (s: State) => void;
let listener: Listener | null = null;

export const UpscaleModal = {
  /**
   * Open the modal IMMEDIATELY in a 'requesting' state — call this the instant
   * the user confirms, BEFORE the upscale-image round-trip resolves, so there's
   * no dead ~1s gap where nothing is on screen. Flip to 'processing' (different
   * copy) with setProcessing() once the server confirms the upscale kicked.
   */
  show(uploadId: string) {
    listener?.({ visible: true, uploadId, phase: 'requesting' });
  },
  /** Server confirmed the upscale is running — update the copy. */
  setProcessing(uploadId: string) {
    listener?.({ visible: true, uploadId, phase: 'processing' });
  },
  hide() {
    listener?.({ visible: false, uploadId: null, phase: 'requesting' });
  },
};

export function UpscaleModalHost() {
  const [state, setState] = useState<State>({
    visible: false,
    uploadId: null,
    phase: 'requesting',
  });
  const [phase, setPhase] = useState<Phase>('requesting');
  const opacity = useSharedValue(0);
  const progress = useSharedValue(0);

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

  // Progress bar: ease steadily toward ~92% over the expected upscale time
  // (~17s) so the wait reads as "working," never a frozen spinner. The real
  // completion (poll → saving) snaps it to 100%. Reset each time the modal opens.
  useEffect(() => {
    if (!state.visible) return;
    progress.value = 0;
    progress.value = withTiming(0.92, { duration: 17000, easing: Easing.out(Easing.quad) });
  }, [state.visible, state.uploadId, progress]);

  useEffect(() => {
    if (phase === 'saving' || phase === 'done') {
      progress.value = withTiming(1, { duration: 250 });
    }
  }, [phase, progress]);

  const progressStyle = useAnimatedStyle(() => ({ width: `${progress.value * 100}%` }));

  // The caller drives requesting -> processing (show / setProcessing); mirror
  // that onto the display phase. The poll below then owns saving/done/timeout.
  // Keyed on uploadId so a fresh request resets the copy.
  useEffect(() => {
    setPhase(state.phase);
  }, [state.phase, state.uploadId]);

  // Poll for the HD result while open; auto-save when it lands. Starts the
  // instant the modal opens (even during 'requesting') so a fast cache hit still
  // saves. The resolve logic lives in startHqPoll (pure + unit-tested); this
  // wires it to Supabase, the save action, and the modal's phase/auto-hide.
  useEffect(() => {
    if (!state.visible || !state.uploadId) return;
    const uploadId = state.uploadId;
    return startHqPoll(uploadId, {
      fetchHq: async (id) => {
        const { data } = await supabase
          .from('uploads')
          .select('image_url_hq')
          .eq('id', id)
          .maybeSingle();
        return (data as { image_url_hq?: string | null } | null)?.image_url_hq ?? null;
      },
      onSave: (hq) => saveUrlToPhotos(uploadId, hq, true),
      onPhase: (phase) => {
        setPhase(phase);
        if (phase === 'done') setTimeout(() => UpscaleModal.hide(), 1200);
        // Still cooking on timeout — no action needed: every requester is
        // notified on completion regardless of whether they stayed (server
        // inserts the request with notified_at NULL), so the push/inbox row
        // lands when the HD is ready.
        if (phase === 'timeout') setTimeout(() => UpscaleModal.hide(), 3000);
      },
    });
  }, [state.visible, state.uploadId]);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
  if (!state.visible) return null;

  const copy = {
    requesting: {
      icon: 'sparkles' as const,
      title: 'Preparing your HD…',
      sub: 'One sec.',
      showProgress: true,
      showDismiss: false,
    },
    processing: {
      icon: 'sparkles' as const,
      title: 'Polishing your HD…',
      sub: "Takes about 15 seconds. Keep browsing — we'll save it to your Photos the moment it's ready.",
      showProgress: true,
      showDismiss: true,
    },
    saving: {
      icon: 'download' as const,
      title: 'Saving to your Photos…',
      sub: 'Almost there.',
      showProgress: true,
      showDismiss: false,
    },
    done: {
      icon: 'checkmark-circle' as const,
      title: 'Saved in HD',
      sub: 'Straight to your Photos.',
      showProgress: false,
      showDismiss: false,
    },
    timeout: {
      icon: 'time' as const,
      title: 'Still polishing your HD…',
      sub: "Taking a little longer than usual — we'll notify you the moment it's ready to grab.",
      showProgress: false,
      showDismiss: true,
    },
  }[phase];

  return (
    <Animated.View style={[StyleSheet.absoluteFill, styles.backdrop, animStyle]}>
      <Pressable style={StyleSheet.absoluteFill} onPress={() => {}}>
        <View style={styles.center}>
          <View style={styles.card}>
            <Ionicons name={copy.icon} size={copy.showProgress ? 30 : 40} color={colors.accent} />
            <Text style={styles.title}>{copy.title}</Text>
            <Text style={styles.subtitle}>{copy.sub}</Text>
            {copy.showProgress && (
              <View style={styles.progressTrack}>
                <Animated.View style={[styles.progressFill, progressStyle]} />
              </View>
            )}
            {copy.showDismiss && (
              <Pressable
                style={styles.dismissBtn}
                onPress={() => {
                  // Dismiss just closes the modal — the upscale keeps running
                  // server-side and the user is notified on completion regardless.
                  UpscaleModal.hide();
                }}
                hitSlop={8}
              >
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
  progressTrack: {
    marginTop: 20,
    height: 6,
    width: 210,
    borderRadius: 3,
    backgroundColor: colors.card,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: colors.accent,
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
