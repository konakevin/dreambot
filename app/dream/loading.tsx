/**
 * Loading Screen — shows mascot animation while generating the dream.
 * Triggers generation on mount, navigates to reveal on completion.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, AppState } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/theme';
import { useDreamCreate } from '@/hooks/useDreamCreate';
import { useDreamStore } from '@/store/dream';
import { supabase } from '@/lib/supabase';
import { Toast } from '@/components/Toast';
import type { PhotoClassification } from '@/lib/dreamApi';
import { DreamFailureCard } from '@/components/DreamFailureCard';
import { MagicalLoadingStage } from '@/components/MagicalLoadingStage';
import { decideDreamJobRecovery } from '@/lib/dreamJobRecovery';

// Self / relationship detection — kept in sync with the matching regexes
// on the Create screen. Used once at mount to decide whether to surface
// the longer-wait subline (face-swap renders take noticeably more time).
const SELF_REF_REGEX = /\b(I|I'm|I'll|I'd|I've|me|myself|mine|selfie)\b/i;
const RELATIONSHIP_REGEX =
  /\bmy\s+(partner|wife|husband|girlfriend|boyfriend|spouse|fiancée?|friend|bestie|buddy|bff|pal|mom|dad|mother|father|brother|sister|son|daughter|family|hubby|wifey|dog|cat|pet|puppy|kitten|pup|kitty|pupper|doggo)\b/i;

export default function DreamLoadingScreen() {
  const { generate } = useDreamCreate();
  const started = useRef(false);
  // queued = user EXPLICITLY tapped "Queue This" and left the loading screen.
  // When true, the recovery flow short-circuits ('noop') so a finished render
  // doesn't yank the user back from wherever they navigated.
  const queued = useRef(false);
  // notificationRequested = the AppState background handler has already fired
  // request_dream_notification once. Just a dedup so brief background bounces
  // don't re-fire the RPC. Must stay SEPARATE from `queued` — a user who tabs
  // to Slack briefly hasn't queued; they're still watching the loading
  // screen, so recovery must run when they come back.
  const notificationRequested = useRef(false);
  const [showQueue, setShowQueue] = useState(false);

  // Decide once on mount whether the longer-wait subline applies. We
  // can't know exact render time (Replicate variance is large), so the
  // copy stays static — but face-swap paths add a real per-render step
  // worth flagging so the user doesn't feel like the app is stuck.
  const isFaceSwap = useRef(
    (() => {
      const { config } = useDreamStore.getState();
      if (config.photoBase64 && config.photoStyle === 'new_scene') return true;
      const prompt = config.userPrompt ?? '';
      return SELF_REF_REGEX.test(prompt) || RELATIONSHIP_REGEX.test(prompt);
    })()
  ).current;
  // Failure state set by useDreamCreate's catch block. When non-null, the
  // failure card is rendered and the spinner is hidden — UNLESS isRecovering
  // is true, in which case we re-show the spinner (render likely still in
  // flight server-side; we're polling dream_jobs).
  const failure = useDreamStore((s) => s.activeJobFailure);
  const setActiveJobFailure = useDreamStore((s) => s.setActiveJobFailure);
  const setResult = useDreamStore((s) => s.setResult);
  // True while we're polling dream_jobs after a transport-level disconnect.
  // The render is durable (EdgeRuntime.waitUntil) so the server may finish
  // even though the client lost the response. We don't show the failure
  // card while this is true — we keep the loading spinner up and poll.
  const [isRecovering, setIsRecovering] = useState(false);

  // Classification confirmation modal — shown when photo is ambiguous (group/unclear).
  // The Promise resolver is held in a ref so the generate() hook can await user input.
  const [pendingConfirm, setPendingConfirm] = useState<PhotoClassification | null>(null);
  const confirmResolver = useRef<((proceed: boolean) => void) | null>(null);

  function requestConfirmation(classification: PhotoClassification): Promise<boolean> {
    setPendingConfirm(classification);
    return new Promise<boolean>((resolve) => {
      confirmResolver.current = resolve;
    });
  }

  function handleConfirmProceed() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setPendingConfirm(null);
    confirmResolver.current?.(true);
    confirmResolver.current = null;
  }

  function handleConfirmCancel() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPendingConfirm(null);
    confirmResolver.current?.(false);
    confirmResolver.current = null;
  }

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    // Reset any prior failure state when a new generation starts
    setActiveJobFailure(null);

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    generate(requestConfirmation).then((status) => {
      // If user already queued, don't navigate — Edge Function handled persistence
      if (queued.current) return;

      if (status === 'done') {
        router.replace('/dream/reveal');
      } else if (status === 'cancelled') {
        // User cancelled at classification modal — back to Create, no charge
        router.back();
      }
      // status === 'error' → stay on this screen and let the failure card
      // (driven by activeJobFailure in the store) take over. The user can
      // tap "Try Again" or "Back to Dream" from there.
    });
  }, [generate, setActiveJobFailure]);

  function handleRetry() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setActiveJobFailure(null);
    started.current = false;
    // Re-trigger the generation effect by setting started back to false and
    // forcing a re-mount via router.replace to the same path
    router.replace('/dream/loading');
  }

  function handleDismissFailure() {
    setActiveJobFailure(null);
    router.back();
  }

  // Show "Queue This" button immediately
  useEffect(() => {
    setShowQueue(true);
  }, []);

  // Single recovery check: query dream_jobs by activeJobId and decide what to
  // do. Called from three places:
  //   1. AppState foreground transition (user tabbed back to the app)
  //   2. failure-watch effect (transport-level catch fired)
  //   3. polling effect (every 5s while isRecovering)
  //
  // Outcomes:
  //   - status='done' + upload_id → load result, navigate to reveal.
  //   - status='failed' or 'nsfw' → exit recovery, let the failure card show.
  //   - status='processing' → enter (or stay in) recovery: hide failure card,
  //     keep polling.
  const tryRecover = useCallback(async () => {
    const jobId = useDreamStore.getState().activeJobId;
    if (!jobId) return;
    try {
      const { data: job } = await supabase
        .from('dream_jobs')
        .select(
          'status, upload_id, result_image_url, result_prompt, result_medium, result_vibe, error'
        )
        .eq('id', jobId)
        .maybeSingle();

      const decision = decideDreamJobRecovery({ job, queued: queued.current });
      switch (decision.action) {
        case 'navigate':
          setResult(decision.result);
          setActiveJobFailure(null);
          setIsRecovering(false);
          router.replace('/dream/reveal');
          return;
        case 'fail':
          setIsRecovering(false);
          return;
        case 'poll':
          // Render still in flight server-side. If a failure card was up, the
          // showSpinner branch keeps the spinner visible while we keep polling.
          setIsRecovering(true);
          return;
        case 'noop':
          return;
      }
    } catch (e) {
      if (__DEV__) console.warn('[loading] tryRecover failed', e);
    }
  }, [setResult, setActiveJobFailure]);

  // AppState foreground recovery: when the user tabs back to the app, check
  // if the render completed while we were backgrounded. ALSO auto-opt-in to
  // the completion push the first time the user hits home so the gate in
  // shouldSendCompletionNotification fires once the render lands — the
  // server-side activity gate (migration 224) means a user who briefly
  // backgrounds and comes back won't see a stale banner.
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'background' && !notificationRequested.current && !queued.current) {
        const jobId = useDreamStore.getState().activeJobId;
        if (jobId) {
          notificationRequested.current = true;
          void (async () => {
            try {
              await supabase.rpc('request_dream_notification', { p_job_id: jobId });
            } catch (e) {
              if (__DEV__)
                console.warn('[loading] auto-request notification on background failed', e);
            }
          })();
        }
        return;
      }
      if (state === 'active') {
        void tryRecover();
      }
    });
    return () => sub.remove();
  }, [tryRecover]);

  // Failure-watch: when the catch block fires a transport-level failure
  // (refunded:false, not NSFW, not pre-flight moderation), immediately
  // poll dream_jobs to see if the render actually completed server-side.
  // Most of Kevin's "lost connection" sightings are this — the render
  // succeeded (push fired, upload persisted) but the client's await rejected.
  useEffect(() => {
    if (!failure) return;
    if (failure.refunded || failure.isNsfw || failure.isPreFlightModeration) return;
    void tryRecover();
  }, [failure, tryRecover]);

  // While isRecovering, poll dream_jobs every 5s. Exit after 90s if still
  // processing — the refund-stuck-jobs sweeper takes over within 5min.
  useEffect(() => {
    if (!isRecovering) return;
    let ticks = 0;
    const interval = setInterval(() => {
      ticks++;
      if (ticks > 18) {
        clearInterval(interval);
        setIsRecovering(false);
        // Polling exhausted. If no failure card is set, synthesize one so
        // the user isn't left staring at an infinite spinner.
        if (!useDreamStore.getState().activeJobFailure) {
          const jobId = useDreamStore.getState().activeJobId;
          if (jobId) {
            setActiveJobFailure({
              jobId,
              message: 'render_timeout',
              refunded: false,
              refundReason: null,
              isNsfw: false,
              isPreFlightModeration: false,
            });
          }
        }
        return;
      }
      void tryRecover();
    }, 5_000);
    return () => clearInterval(interval);
  }, [isRecovering, setActiveJobFailure, tryRecover]);

  function handleQueue() {
    queued.current = true;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Opt this job into a completion notification. Dreams default to NO ping
    // (migration 191) so a user who WAITS here isn't double-notified — but a
    // user who taps "Queue This" is leaving, so they DO want it. Capture the id
    // before we clear it below. Best-effort: a failure just means no push.
    const jobId = useDreamStore.getState().activeJobId;
    if (jobId) {
      // Retry once: this flag drives the completion notification, so a transient
      // network blip here would SILENTLY cost the user their "we'll notify you"
      // ping. The RPC is an idempotent upsert (migration 195), so re-running it
      // is safe. Fire-and-forget — we don't block the user leaving on it.
      void (async () => {
        for (let attempt = 0; attempt < 2; attempt++) {
          try {
            const { error } = await supabase.rpc('request_dream_notification', {
              p_job_id: jobId,
            });
            if (!error) return;
            if (attempt === 1 && __DEV__)
              console.warn('[loading] request_dream_notification failed (after retry)', error);
          } catch (e) {
            if (attempt === 1 && __DEV__)
              console.warn('[loading] request_dream_notification threw (after retry)', e);
          }
        }
      })();
    }
    // Clear the active job so the stale guard in useDreamCreate discards the result
    useDreamStore.getState().setActiveJobId(null);
    Toast.show("We'll notify you when it's ready", 'checkmark-circle');
    // Return to where the dream started. DLT dreams were pushed from the
    // Dream-Like-This screen, so pop back to it instead of dumping the user on
    // the Create tab (with the prompt lingering). loading is always reached via
    // push, so back() lands on the origin. stylePrompt/dltRecipe are set only
    // by the DLT flow, never by Create.
    const { config } = useDreamStore.getState();
    const fromDlt = config.dltRecipe !== null || config.stylePrompt !== null;
    if (fromDlt) {
      router.back();
    } else {
      router.replace('/(tabs)/create');
    }
  }

  // Show the spinner when there's no failure OR when we're actively
  // recovering (render likely still in flight server-side).
  const showSpinner = !failure || isRecovering;

  return (
    <View style={s.container}>
      {showSpinner ? (
        // Single centered column: mascot + wave loader + "Dreaming" +
        // (face-swap subtip) + queue hint + Queue This button. All one
        // unit — no floating title up top with a disconnected CTA at
        // the bottom. SafeAreaView keeps the bottom of the stack clear
        // of the home indicator since the button is no longer absolutely
        // positioned.
        <SafeAreaView style={s.scene} edges={['bottom']}>
          <MagicalLoadingStage />
          <View style={s.cta}>
            {isFaceSwap && <Text style={s.subtip}>Face swaps take a little longer.</Text>}
            {showQueue && (
              <>
                <Text style={s.queueHint}>
                  Don’t want to wait? Tap below and we’ll notify you when it’s done.
                </Text>
                <TouchableOpacity style={s.queueBtn} onPress={handleQueue} activeOpacity={0.7}>
                  <Ionicons name="time-outline" size={16} color="#FFFFFF" />
                  <Text style={s.queueText}>Queue This</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </SafeAreaView>
      ) : (
        <SafeAreaView style={s.failureWrap}>
          <DreamFailureCard
            failure={failure}
            onRetry={handleRetry}
            onDismiss={handleDismissFailure}
          />
        </SafeAreaView>
      )}

      {/* Classification confirmation — fires when photo is group/unclear, BEFORE sparkle spent */}
      <Modal
        visible={!!pendingConfirm}
        transparent
        animationType="fade"
        onRequestClose={handleConfirmCancel}
      >
        <View style={s.modalBackdrop}>
          <View style={s.modalCard}>
            <Ionicons
              name={pendingConfirm?.type === 'group' ? 'people-outline' : 'help-circle-outline'}
              size={32}
              color={colors.accent}
              style={{ marginBottom: 12 }}
            />
            <Text style={s.modalTitle}>
              {pendingConfirm?.type === 'group' ? 'Multiple people detected' : 'Photo hard to read'}
            </Text>
            <Text style={s.modalBody}>
              {pendingConfirm?.type === 'group'
                ? 'Face-swap only works for single-subject photos. We’ll describe everyone and include them in the scene — but it won’t be an exact likeness.'
                : 'We had trouble identifying the subject. Results may surprise you.'}
            </Text>
            <View style={s.modalActions}>
              <TouchableOpacity
                style={[s.modalBtn, s.modalBtnSecondary]}
                onPress={handleConfirmCancel}
                activeOpacity={0.7}
              >
                <Text style={s.modalBtnSecondaryText}>Upload Different</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.modalBtn, s.modalBtnPrimary]}
                onPress={handleConfirmProceed}
                activeOpacity={0.7}
              >
                <Text style={s.modalBtnPrimaryText}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  // Bottom overlay: floats over the magical stage so the face-swap
  // subtip + Queue This button sit safely above the home indicator
  // without painting a backdrop over the sparkle field.
  // Single centered column for the loading state. The MagicalLoadingStage
  // sits above the CTA cluster with a generous gap so the upper "what's
  // happening" block and the lower "what you can do" block read as
  // separated but related — one cohesive screen, not two floating
  // islands like the previous absolute-positioned overlay produced.
  scene: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 16,
    gap: 40,
  },
  cta: {
    alignItems: 'center',
    gap: 12,
  },
  // Casual queue prompt right above the Queue This button — muted gray
  // so it doesn't compete with the lavender pill. Tight 12px gap to the
  // button below so the eye reads "this sentence + this button" as one
  // CTA group.
  queueHint: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    maxWidth: 300,
    lineHeight: 18,
  },
  failureWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  subtip: {
    color: 'rgba(196,181,253,0.85)', // muted purple, matches the sparkle palette
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  queueBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 22,
    backgroundColor: colors.accent,
    shadowColor: colors.accent,
    shadowOpacity: 0.6,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
  },
  queueText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  modalTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalBody: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalBtnSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalBtnSecondaryText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  modalBtnPrimary: {
    backgroundColor: colors.accent,
  },
  modalBtnPrimaryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
