/**
 * UpscaleModal — dismissable status modal for an on-demand HD upscale.
 *
 * Nothing is auto-upscaled anymore; the first download of a post triggers the
 * upscale (upscale-image Edge Function) which runs ~15s server-side. This modal
 * is shown while we wait: it is DISMISSABLE (the upscale keeps running + the
 * user gets a `download_ready` push when done), and if left open it POLLS the
 * upload row and AUTO-SAVES the moment the HD image lands. See UPSCALE_QUEUE_PLAN.md.
 *
 * Honest waiting UX: a spinner + one clean line — NOT a progress bar.
 * Replicate doesn't stream per-step progress back to us (we only poll for the
 * finished image), so any bar would be a timer-faked guess that stalls on slow
 * runs. A single static message (no cycling) keeps it calm and honest.
 *
 * Imperative API like Toast — mount UpscaleModalHost once in _layout, call
 * UpscaleModal.show(uploadId) from anywhere.
 */

import { useEffect, useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text } from '@/components/AppText';
import { AnimatedGradientTitle } from '@/components/AnimatedGradientTitle';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { colors } from '@/constants/theme';
import { verticalScale, fontScale } from '@/lib/responsive';
import { supabase } from '@/lib/supabase';
import { saveUrlToPhotos } from '@/lib/savePhoto';
import { startHqPoll } from '@/lib/upscalePoll';
import { Toast } from '@/components/Toast';
import { WaveLoader } from '@/components/WaveLoader';

// One clean, static waiting message — mirrors the Create "generating dream"
// loading copy (app/dream/loading.tsx). No cycling flavor text.
const WAITING_TITLE = 'Upscaling to HD';
const WAITING_SUB = "Dismiss to be notified when it's ready.";

type Phase = 'requesting' | 'processing' | 'saving' | 'done' | 'timeout';
interface State {
  visible: boolean;
  uploadId: string | null;
  phase: Phase;
}
type Listener = (s: State) => void;
let listener: Listener | null = null;
// Which upload the VISIBLE modal is waiting on — read by the notification
// toast glue (app/_layout.tsx) to suppress the redundant "HD download is
// ready" toast while the user is literally watching it finish (Kevin
// 2026-07-08). Cleared on hide, so a dismissed modal (upscale keeps running
// in the background) still gets its completion toast.
let watchedUploadId: string | null = null;

export const UpscaleModal = {
  /**
   * Open the modal IMMEDIATELY in a 'requesting' state — call this the instant
   * the user confirms, BEFORE the upscale-image round-trip resolves, so there's
   * no dead ~1s gap where nothing is on screen. Flip to 'processing' with
   * setProcessing() once the server confirms the upscale kicked.
   */
  show(uploadId: string) {
    watchedUploadId = uploadId;
    listener?.({ visible: true, uploadId, phase: 'requesting' });
  },
  /** Server confirmed the upscale is running. */
  setProcessing(uploadId: string) {
    watchedUploadId = uploadId;
    listener?.({ visible: true, uploadId, phase: 'processing' });
  },
  hide() {
    watchedUploadId = null;
    listener?.({ visible: false, uploadId: null, phase: 'requesting' });
  },
  /** The upload the visible modal is waiting on (null when hidden). */
  watchingUploadId(): string | null {
    return watchedUploadId;
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
    // dismiss: 'hidden' (terminal, no button) | 'disabled' (rendered but not yet
    // safe to dismiss — server hasn't confirmed the job is running) | 'enabled'.
    // Keeping the button MOUNTED from the first frame avoids the layout pop when
    // requesting → processing; we just enable it once dismiss is safe.
    requesting: {
      icon: 'sparkles' as const,
      title: WAITING_TITLE,
      sub: WAITING_SUB,
      dismiss: 'disabled' as const,
    },
    processing: {
      icon: 'sparkles' as const,
      title: WAITING_TITLE,
      sub: WAITING_SUB,
      dismiss: 'enabled' as const,
    },
    saving: {
      icon: 'download' as const,
      title: 'Saving to your Photos…',
      sub: 'Almost there.',
      dismiss: 'hidden' as const,
    },
    done: {
      icon: 'checkmark-circle' as const,
      title: 'Saved in HD',
      sub: 'Straight to your Photos.',
      dismiss: 'hidden' as const,
    },
    timeout: {
      icon: 'time' as const,
      title: 'Still polishing your HD…',
      sub: "Taking longer than usual. We'll notify you the moment it's ready to grab.",
      dismiss: 'enabled' as const,
    },
  }[phase];

  // Active + 'saving' show a spinner; terminal states (done/timeout) show an icon.
  const showSpinner = isActive || phase === 'saving';
  const title = copy.title;

  return (
    <Animated.View style={[StyleSheet.absoluteFill, styles.backdrop, animStyle]}>
      <Pressable style={StyleSheet.absoluteFill} onPress={() => {}}>
        <View style={styles.center}>
          <View style={styles.card}>
            {showSpinner ? (
              <>
                {/* Title ABOVE the loading wave, in the brand logo gradient/font
                  with the continuous flowing gradient. */}
                <AnimatedGradientTitle size={18} weight={700}>
                  {title}
                </AnimatedGradientTitle>
                <View style={styles.waveBelowTitle}>
                  <WaveLoader />
                </View>
              </>
            ) : (
              <>
                <Ionicons name={copy.icon} size={40} color={colors.accent} />
                <Text style={styles.title}>{title}</Text>
              </>
            )}
            <Text style={styles.subtitle}>{copy.sub}</Text>
            {copy.dismiss !== 'hidden' && (
              <Pressable
                style={[
                  styles.dismissBtn,
                  copy.dismiss === 'disabled' && styles.dismissBtnDisabled,
                ]}
                disabled={copy.dismiss === 'disabled'}
                onPress={() => {
                  // Dismiss just closes the modal — the upscale keeps running
                  // server-side and the user is notified on completion regardless.
                  // Confirm that with a toast (mirrors the dream-queue toast in
                  // app/dream/loading.tsx) so backgrounding it gives clear feedback.
                  Toast.show("We'll notify you when it's ready", 'checkmark-circle');
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
  waveBelowTitle: { marginTop: verticalScale(16) },
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
  dismissBtnDisabled: { opacity: 0.4 },
  dismissText: { color: '#FFFFFF', fontSize: fontScale(14), fontWeight: '700' },
});
