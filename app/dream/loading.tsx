/**
 * Loading Screen — shows mascot animation while generating the dream.
 * Triggers generation on mount, navigates to reveal on completion.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, AppState } from 'react-native';
import { Text } from '@/components/AppText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/theme';
import { verticalScale, fontScale } from '@/lib/responsive';
import { useDreamCreate } from '@/hooks/useDreamCreate';
import { useDreamStore } from '@/store/dream';
import { supabase } from '@/lib/supabase';
import { Toast } from '@/components/Toast';
import type { PhotoClassification } from '@/lib/dreamApi';
import { DreamFailureCard } from '@/components/DreamFailureCard';
import { MagicalLoadingStage } from '@/components/MagicalLoadingStage';
import { decideDreamJobRecovery } from '@/lib/dreamJobRecovery';
import { clearDreamInFlight } from '@/lib/dreamInFlightMarker';

// How long recovery polls without ever seeing a dream_jobs row before
// concluding the Edge Function never started (connect/boot failure) and failing
// fast. Generous enough to cover the upsert race + cold start, far short of the
// 90s processing-poll backstop.
const NO_JOB_GRACE_MS = 12_000;

export default function DreamLoadingScreen() {
  const { generate } = useDreamCreate();
  // resume=1 — entered from a COLD-START recovery (resumeInFlightDream), NOT a
  // fresh create. The render is already in flight server-side; we must POLL it,
  // never call generate() again (that would charge + render a second time).
  const { resume, watch } = useLocalSearchParams<{ resume?: string; watch?: string }>();
  const isResume = resume === '1';
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
  // Timestamp (ms) when transport-failure recovery began. Drives the no-job
  // grace window: if we poll past NO_JOB_GRACE_MS and dream_jobs STILL has no
  // row, the Edge Function never started → fail fast instead of spinning the
  // full 90s. 0 = not in recovery.
  const recoveryStartedAt = useRef(0);
  const [showQueue, setShowQueue] = useState(false);
  // Set to the dream_queue job id when a dream is ENQUEUED (DREAM_QUEUE_ENABLED).
  // Drives the realtime-wait effect below. Null on the synchronous path.
  const [queueWaitId, setQueueWaitId] = useState<string | null>(null);

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
  // True once recovery has CONCLUDED that a recoverable (transport-level)
  // failure is terminal — either dream_jobs reported failed/nsfw, or the 90s
  // poll window elapsed. Until this flips, a transport-level failure keeps the
  // spinner up instead of flashing the failure card. This is what kills the
  // "lost connection" flash when the user backgrounds mid-render and returns:
  // the suspended fetch rejects on resume, setting a recoverable failure, but
  // the render is usually still in flight server-side (or already done), so we
  // must NOT paint the card until recovery says it really failed.
  const [recoveryFailed, setRecoveryFailed] = useState(false);

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
    // Cold-start resume: the render is already in flight (or done) server-side.
    // Do NOT call generate() — that would double-charge + double-render. Just
    // mark started and let the recovery poll (effect below) drive to reveal.
    if (isResume) return;
    // Watch path: a dream was already enqueued elsewhere (e.g. a failed-dream
    // RETRY re-enqueued server-side). Just subscribe to its queue row — never
    // re-generate (that would double-charge).
    if (watch) {
      started.current = true;
      setActiveJobFailure(null);
      setQueueWaitId(watch);
      return;
    }
    started.current = true;

    // Reset any prior failure state when a new generation starts
    setActiveJobFailure(null);
    setRecoveryFailed(false);
    recoveryStartedAt.current = 0;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    generate(requestConfirmation).then((status) => {
      // If user already queued, don't navigate — Edge Function handled persistence
      if (queued.current) return;

      if (status === 'done') {
        router.replace('/dream/reveal');
      } else if (status === 'queued') {
        // Enqueued onto dream_queue — don't navigate; wait on its realtime
        // channel (effect below) while the spinner keeps showing.
        setQueueWaitId(useDreamStore.getState().activeJobId);
      } else if (status === 'cancelled') {
        // User cancelled at classification modal — back to Create, no charge
        router.back();
      } else if (status === 'insufficient') {
        // Not enough sparkles — the premium gate is already showing; return to
        // Create so the user isn't stranded on the loading spinner.
        router.back();
      }
      // status === 'error' → stay on this screen and let the failure card
      // (driven by activeJobFailure in the store) take over. The user can
      // tap "Try Again" or "Back to Dream" from there.
    });
  }, [generate, setActiveJobFailure, isResume, watch]);

  // ── Queue path: wait on the dream_queue realtime channel ──────────────────
  // The worker renders the job (globally-capped concurrency + retry) and flips
  // its status. On 'completed' we hydrate the result from the uploads row +
  // reveal; on 'dead_letter' we show the failure card (the worker already
  // refunded). Robust against the render finishing before we subscribe (initial
  // catch-up fetch) and against a realtime drop (periodic poll backstop).
  useEffect(() => {
    if (!queueWaitId) return;
    let settled = false;

    const finishCompleted = async (uploadId: string | null | undefined) => {
      if (settled || queued.current || !uploadId) return;
      const { data: up } = await supabase
        .from('uploads')
        .select('id, image_url, ai_prompt, dream_medium, dream_vibe')
        .eq('id', uploadId)
        .maybeSingle();
      if (!up || settled || queued.current) return;
      settled = true;
      setResult({
        imageUrl: up.image_url,
        prompt: up.ai_prompt ?? '',
        aiConcept: null,
        dreamMode: null,
        archetype: null,
        resolvedMedium: up.dream_medium ?? null,
        resolvedVibe: up.dream_vibe ?? null,
        uploadId: up.id,
      });
      router.replace('/dream/reveal');
    };

    const handleRow = (row: { status?: string; upload_id?: string | null }) => {
      if (settled || queued.current) return;
      if (row.status === 'completed') {
        void finishCompleted(row.upload_id);
      } else if (row.status === 'dead_letter') {
        settled = true;
        setActiveJobFailure({
          jobId: queueWaitId,
          message: "Your dream couldn't render",
          refunded: true,
          refundReason: null,
          isNsfw: false,
          isPreFlightModeration: false,
        });
      }
    };

    const channel = supabase
      .channel(`dream_queue:${queueWaitId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'dream_queue', filter: `id=eq.${queueWaitId}` },
        (payload) => handleRow(payload.new as { status?: string; upload_id?: string | null })
      )
      .subscribe();

    // Catch-up: the render may have finished in the gap before we subscribed.
    void supabase
      .from('dream_queue')
      .select('status, upload_id')
      .eq('id', queueWaitId)
      .maybeSingle()
      .then(({ data }) => {
        if (data) handleRow(data);
      });

    // Backstop poll in case realtime drops mid-wait (no hard timeout — the user
    // is watching and can "Queue This" to leave).
    const poll = setInterval(() => {
      if (settled || queued.current) return;
      void supabase
        .from('dream_queue')
        .select('status, upload_id')
        .eq('id', queueWaitId)
        .maybeSingle()
        .then(({ data }) => {
          if (data) handleRow(data);
        });
    }, 6000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(poll);
    };
  }, [queueWaitId, setResult, setActiveJobFailure]);

  function handleRetry() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setActiveJobFailure(null);
    setRecoveryFailed(false);
    setIsRecovering(false);
    recoveryStartedAt.current = 0;
    started.current = false;
    // Re-trigger the generation effect by setting started back to false and
    // forcing a re-mount via router.replace to the same path
    router.replace('/dream/loading');
  }

  function handleDismissFailure() {
    setActiveJobFailure(null);
    void clearDreamInFlight();
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

      // No-job grace: only fail-fast on a missing row once we've actually been
      // in recovery (recoveryStartedAt set) past the grace window. The
      // AppState-foreground path can call tryRecover with no active failure
      // (recoveryStartedAt = 0) — there, a missing row stays a no-op.
      const noJobGraceExceeded =
        recoveryStartedAt.current > 0 && Date.now() - recoveryStartedAt.current >= NO_JOB_GRACE_MS;
      const decision = decideDreamJobRecovery({
        job,
        queued: queued.current,
        noJobGraceExceeded,
      });
      switch (decision.action) {
        case 'navigate':
          setResult(decision.result);
          setActiveJobFailure(null);
          setIsRecovering(false);
          router.replace('/dream/reveal');
          return;
        case 'fail':
          setRecoveryFailed(true);
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

  // Cold-start resume kickoff: entered via /dream/loading?resume=1 from
  // resumeInFlightDream. The render is already in flight server-side, so enter
  // recovery immediately — the poll effect drives us to reveal once done (or
  // keeps the spinner while still processing). generate() was already skipped.
  useEffect(() => {
    if (!isResume || started.current) return;
    started.current = true;
    recoveryStartedAt.current = Date.now();
    setIsRecovering(true);
    void tryRecover();
  }, [isResume, tryRecover]);

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
    // Recoverable (transport-level) failure — typically the backgrounded fetch
    // rejecting on resume. Enter recovery immediately: this (a) holds the
    // spinner up via showSpinner and (b) guarantees the 5s poll + 90s timeout
    // run even if this first tryRecover() throws, so we can never hang on an
    // infinite spinner. tryRecover then navigates / keeps polling / marks failed.
    if (!recoveryStartedAt.current) recoveryStartedAt.current = Date.now();
    setIsRecovering(true);
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
        // Polling window elapsed — recovery is over, so let the failure card
        // show now (the refund-stuck-jobs sweeper takes it from here).
        setRecoveryFailed(true);
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
    // User chose to leave + be pinged — they'll deep-link via the completion
    // push, so drop the resume marker (don't also pop reveal on next launch).
    void clearDreamInFlight();
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

  // A "recoverable" failure is a transport-level drop (NOT a server NSFW
  // block, pre-flight moderation, or confirmed refund) — typically the
  // suspended fetch rejecting when the user returns from backgrounding. The
  // render is durable server-side, so we keep the spinner up for these until
  // recovery CONCLUDES they're terminal (recoveryFailed). Without this guard
  // the failure card flashed for a frame between the catch firing and the
  // recovery poll setting isRecovering.
  const isRecoverableFailure =
    !!failure && !failure.refunded && !failure.isNsfw && !failure.isPreFlightModeration;
  const showSpinner = !failure || isRecovering || (isRecoverableFailure && !recoveryFailed);

  return (
    <View style={s.container}>
      {showSpinner ? (
        // Single centered column: mascot + wave loader + "Dreaming" +
        // the wait/queue hint + Queue This button. All one
        // unit — no floating title up top with a disconnected CTA at
        // the bottom. SafeAreaView keeps the bottom of the stack clear
        // of the home indicator since the button is no longer absolutely
        // positioned.
        <SafeAreaView style={s.scene} edges={['bottom']}>
          <MagicalLoadingStage />
          <View style={s.cta}>
            {showQueue && (
              <>
                <Text style={s.queueHint}>
                  This may take a moment. Feel free to queue it and we’ll notify you when it’s done.
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
              style={{ marginBottom: verticalScale(12) }}
            />
            <Text style={s.modalTitle}>
              {pendingConfirm?.type === 'group' ? 'Multiple people detected' : 'Photo hard to read'}
            </Text>
            <Text style={s.modalBody}>
              {pendingConfirm?.type === 'group'
                ? 'Adding your likeness only works for single-subject photos. We’ll describe everyone and include them in the scene, but it won’t be an exact match.'
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
  // Bottom overlay: floats over the magical stage so the wait hint +
  // Queue This button sit safely above the home indicator
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
    paddingBottom: verticalScale(16),
    // One uniform gap down the whole column (matches stage + cta) so the
    // spacing reads even instead of grouped-then-jumpy.
    gap: verticalScale(26),
  },
  cta: {
    alignItems: 'center',
    gap: verticalScale(26),
  },
  // Casual queue prompt above the Queue This button — muted gray so it
  // doesn't compete with the lavender pill, with breathing room to the
  // button below.
  queueHint: {
    color: colors.textSecondary,
    fontSize: fontScale(13),
    textAlign: 'center',
    maxWidth: 300,
    lineHeight: fontScale(18),
  },
  failureWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  queueBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 18,
    paddingVertical: verticalScale(11),
    borderRadius: 22,
    backgroundColor: colors.accent,
    shadowColor: colors.accent,
    shadowOpacity: 0.6,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
  },
  queueText: {
    color: '#FFFFFF',
    fontSize: fontScale(14),
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
    fontSize: fontScale(18),
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: verticalScale(8),
  },
  modalBody: {
    color: colors.textSecondary,
    fontSize: fontScale(14),
    textAlign: 'center',
    lineHeight: fontScale(20),
    marginBottom: verticalScale(20),
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  modalBtn: {
    flex: 1,
    paddingVertical: verticalScale(12),
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
    fontSize: fontScale(14),
    fontWeight: '600',
  },
  modalBtnPrimary: {
    backgroundColor: colors.accent,
  },
  modalBtnPrimaryText: {
    color: '#FFFFFF',
    fontSize: fontScale(14),
    fontWeight: '700',
  },
});
