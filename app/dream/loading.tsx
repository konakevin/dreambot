/**
 * Loading Screen — shows mascot animation while generating the dream.
 * Triggers generation on mount, navigates to reveal on completion.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  AppState,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/theme';
import { randomMascot } from '@/constants/mascots';
import { useDreamCreate } from '@/hooks/useDreamCreate';
import { useDreamStore } from '@/store/dream';
import { supabase } from '@/lib/supabase';
import { Toast } from '@/components/Toast';
import type { PhotoClassification } from '@/lib/dreamApi';
import { DreamFailureCard } from '@/components/DreamFailureCard';

// Self / relationship detection — kept in sync with the matching regexes
// on the Create screen. Used once at mount to decide whether to surface
// the longer-wait subline (face-swap renders take noticeably more time).
const SELF_REF_REGEX = /\b(I|I'm|I'll|I'd|I've|me|myself|mine|selfie)\b/i;
const RELATIONSHIP_REGEX =
  /\bmy\s+(partner|wife|husband|girlfriend|boyfriend|spouse|fiancée?|friend|bestie|buddy|bff|pal|mom|dad|mother|father|brother|sister|son|daughter|family|hubby|wifey|dog|cat|pet|puppy|kitten|pup|kitty|pupper|doggo)\b/i;

export default function DreamLoadingScreen() {
  const mascotUrl = useRef(randomMascot()).current;
  const { generate } = useDreamCreate();
  const started = useRef(false);
  const queued = useRef(false);
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
  // failure card is rendered and the spinner is hidden.
  const failure = useDreamStore((s) => s.activeJobFailure);
  const setActiveJobFailure = useDreamStore((s) => s.setActiveJobFailure);

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

  // Auto-opt-in to the completion push if the user BACKGROUNDS the app while
  // a render is still in flight. The Edge Function already runs the render
  // to completion via EdgeRuntime.waitUntil, but its push gate
  // (shouldSendCompletionNotification) only fires when notify_on_complete
  // is true on dream_jobs. Without this listener, a user who just hits home
  // mid-render gets the render but no push — Kevin's launch-list item
  // ("backgrounding during render… needs to send a push"). The RPC is the
  // same idempotent upsert (migration 195) used by the explicit "Queue This"
  // tap below, so the two paths compose: whichever happens first sets the
  // flag, the second is a cheap no-op. queued.current dedups within-session.
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state !== 'background') return;
      if (queued.current) return;
      const jobId = useDreamStore.getState().activeJobId;
      if (!jobId) return;
      queued.current = true;
      void (async () => {
        try {
          await supabase.rpc('request_dream_notification', { p_job_id: jobId });
        } catch (e) {
          if (__DEV__) console.warn('[loading] auto-request notification on background failed', e);
        }
      })();
    });
    return () => sub.remove();
  }, []);

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

  return (
    <SafeAreaView style={s.container}>
      <View style={s.content}>
        <Image source={{ uri: mascotUrl }} style={s.mascot} contentFit="cover" />
        {!failure && (
          <>
            <ActivityIndicator size="large" color={colors.accent} style={s.spinner} />
            <Text style={s.tip}>Working on it — hold tight.</Text>
            {isFaceSwap && (
              <Text style={s.subtip}>Face swaps take a little longer — feel free to queue it.</Text>
            )}
            {showQueue && (
              <TouchableOpacity style={s.queueBtn} onPress={handleQueue} activeOpacity={0.7}>
                <Ionicons name="time-outline" size={16} color="#FFFFFF" />
                <Text style={s.queueText}>Queue This</Text>
              </TouchableOpacity>
            )}
          </>
        )}
        {failure && (
          <DreamFailureCard
            failure={failure}
            onRetry={handleRetry}
            onDismiss={handleDismissFailure}
          />
        )}
      </View>

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
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 24,
  },
  mascot: {
    width: 160,
    height: 160,
    borderRadius: 32,
  },
  spinner: {
    marginTop: 8,
  },
  tip: {
    color: colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  subtip: {
    color: colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
    marginTop: -16,
    paddingHorizontal: 8,
  },
  queueBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.accent,
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
