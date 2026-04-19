/**
 * Loading Screen — shows mascot animation while generating the dream.
 * Triggers generation on mount, navigates to reveal on completion.
 */

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/theme';
import { randomMascot } from '@/constants/mascots';
import { useDreamCreate } from '@/hooks/useDreamCreate';
import { useDreamStore } from '@/store/dream';
import { Toast } from '@/components/Toast';
import type { PhotoClassification } from '@/lib/dreamApi';

const TIPS = [
  'Dreaming up something special...',
  'Mixing colors and light...',
  'Channeling your vibe...',
  'Painting your imagination...',
  'Almost there...',
];

export default function DreamLoadingScreen() {
  const mascotUrl = useRef(randomMascot()).current;
  const tipIndex = useRef(0);
  const { generate } = useDreamCreate();
  const started = useRef(false);
  const queued = useRef(false);
  const [showQueue, setShowQueue] = useState(false);

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

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    generate(requestConfirmation).then((status) => {
      // If user already queued, don't navigate — Edge Function handled persistence
      if (queued.current) return;

      if (status === 'done') {
        router.replace('/dream/reveal');
      } else if (status === 'cancelled') {
        // User cancelled at classification modal — back to Create, no charge
        router.back();
      } else {
        // Error — go back to configure (or create if no configure step)
        router.back();
      }
    });
  }, [generate]);

  // Show "Queue This" button immediately
  useEffect(() => {
    setShowQueue(true);
  }, []);

  // Cycle tips every 4 seconds
  const [tip, setTip] = useState(TIPS[0]);
  useEffect(() => {
    const interval = setInterval(() => {
      tipIndex.current = (tipIndex.current + 1) % TIPS.length;
      setTip(TIPS[tipIndex.current]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  function handleQueue() {
    queued.current = true;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Clear the active job so the stale guard in useDreamCreate discards the result
    useDreamStore.getState().setActiveJobId(null);
    Toast.show("We'll notify you when it's ready", 'checkmark-circle');
    router.replace('/(tabs)/create');
  }

  return (
    <SafeAreaView style={s.container}>
      <View style={s.content}>
        <Image source={{ uri: mascotUrl }} style={s.mascot} contentFit="cover" />
        <ActivityIndicator size="large" color={colors.accent} style={s.spinner} />
        <Text style={s.tip}>{tip}</Text>
        {showQueue && (
          <TouchableOpacity style={s.queueBtn} onPress={handleQueue} activeOpacity={0.7}>
            <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
            <Text style={s.queueText}>Queue This</Text>
          </TouchableOpacity>
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
  queueBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  queueText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
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
