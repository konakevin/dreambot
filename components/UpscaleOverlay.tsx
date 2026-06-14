/**
 * UpscaleModal — dismissable status modal for an on-demand HD upscale.
 *
 * Nothing is auto-upscaled anymore; the first download of a post triggers the
 * upscale (upscale-image Edge Function) which runs ~15s server-side. This modal
 * is shown while we wait: it is DISMISSABLE (the upscale keeps running + the
 * user gets a `download_ready` push when done), and if left open it POLLS the
 * upload row and AUTO-SAVES the moment the HD image lands. See UPSCALE_QUEUE_PLAN.md.
 *
 * Honest waiting UX: a spinner + rotating flavor text — NOT a progress bar.
 * Replicate doesn't stream per-step progress back to us (we only poll for the
 * finished image), so any bar would be a timer-faked guess that stalls on slow
 * runs. The rotating line keeps it feeling alive without claiming progress.
 *
 * Imperative API like Toast — mount UpscaleModalHost once in _layout, call
 * UpscaleModal.show(uploadId) from anywhere.
 */

import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { colors } from '@/constants/theme';
import { verticalScale, fontScale } from '@/lib/responsive';
import { supabase } from '@/lib/supabase';
import { saveUrlToPhotos } from '@/lib/savePhoto';
import { startHqPoll } from '@/lib/upscalePoll';

// Rotated every few seconds while waiting (flavor, not progress — see header).
const WAITING_MESSAGES = [
  'Polishing every pixel…',
  'Sharpening the dream…',
  'Coaxing out the fine details…',
  'Dusting on the HD sparkle…',
  'Making it poster-worthy…',
];
const WAITING_SUB = "Keep browsing. We'll save it to your Photos the moment it's ready.";

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
   * no dead ~1s gap where nothing is on screen. Flip to 'processing' with
   * setProcessing() once the server confirms the upscale kicked.
   */
  show(uploadId: string) {
    listener?.({ visible: true, uploadId, phase: 'requesting' });
  },
  /** Server confirmed the upscale is running. */
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
  const [msgIdx, setMsgIdx] = useState(0);
  const opacity = useSharedValue(0);

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

  // The caller drives requesting -> processing (show / setProcessing); mirror
  // that onto the display phase. The poll below then owns saving/done/timeout.
  // Keyed on uploadId so a fresh request resets the copy.
  useEffect(() => {
    setPhase(state.phase);
  }, [state.phase, state.uploadId]);

  const isActive = phase === 'requesting' || phase === 'processing';

  // Rotate the witty line every few seconds while waiting so the spinner reads
  // as alive. Resets when a new wait starts; stops once we leave the wait.
  useEffect(() => {
    if (!isActive) return;
    setMsgIdx(0);
    const id = setInterval(() => setMsgIdx((i) => (i + 1) % WAITING_MESSAGES.length), 3000);
    return () => clearInterval(id);
  }, [isActive]);

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
      onPhase: (next) => {
        setPhase(next);
        if (next === 'done') setTimeout(() => UpscaleModal.hide(), 1200);
        // Still cooking on timeout — no action needed: every requester is
        // notified on completion regardless of whether they stayed (server
        // inserts the request with notified_at NULL), so the push/inbox row
        // lands when the HD is ready.
        if (next === 'timeout') setTimeout(() => UpscaleModal.hide(), 3000);
      },
    });
  }, [state.visible, state.uploadId]);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
  if (!state.visible) return null;

  const copy = {
    requesting: { icon: 'sparkles' as const, title: '', sub: WAITING_SUB, showDismiss: false },
    processing: { icon: 'sparkles' as const, title: '', sub: WAITING_SUB, showDismiss: true },
    saving: {
      icon: 'download' as const,
      title: 'Saving to your Photos…',
      sub: 'Almost there.',
      showDismiss: false,
    },
    done: {
      icon: 'checkmark-circle' as const,
      title: 'Saved in HD',
      sub: 'Straight to your Photos.',
      showDismiss: false,
    },
    timeout: {
      icon: 'time' as const,
      title: 'Still polishing your HD…',
      sub: "Taking longer than usual. We'll notify you the moment it's ready to grab.",
      showDismiss: true,
    },
  }[phase];

  // Active + 'saving' show a spinner; terminal states (done/timeout) show an icon.
  const showSpinner = isActive || phase === 'saving';
  const title = isActive ? WAITING_MESSAGES[msgIdx] : copy.title;

  return (
    <Animated.View style={[StyleSheet.absoluteFill, styles.backdrop, animStyle]}>
      <Pressable style={StyleSheet.absoluteFill} onPress={() => {}}>
        <View style={styles.center}>
          <View style={styles.card}>
            {showSpinner ? (
              <ActivityIndicator size="large" color={colors.accent} />
            ) : (
              <Ionicons name={copy.icon} size={40} color={colors.accent} />
            )}
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{copy.sub}</Text>
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
    paddingVertical: verticalScale(28),
    paddingHorizontal: 32,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    maxWidth: 320,
  },
  title: {
    color: colors.textPrimary,
    fontSize: fontScale(17),
    fontWeight: '700',
    marginTop: verticalScale(18),
    textAlign: 'center',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: fontScale(13),
    marginTop: verticalScale(8),
    textAlign: 'center',
    lineHeight: fontScale(18),
  },
  dismissBtn: {
    marginTop: verticalScale(18),
    paddingVertical: verticalScale(10),
    paddingHorizontal: 24,
    borderRadius: 20,
    backgroundColor: colors.accent,
  },
  dismissText: { color: '#FFFFFF', fontSize: fontScale(14), fontWeight: '700' },
});
