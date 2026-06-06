/**
 * DreamFailureCard — shown on the loading screen when generation hard-fails.
 *
 * Behavior depends on the failure shape:
 *   - NSFW: shield icon, "your prompt was flagged" + sparkle refunded message
 *   - Refunded: friendly "couldn't render" + sparkle refunded message
 *   - Pending refund: "we'll refund within a few minutes" (sweeper will handle)
 *   - Pre-flight client moderation: same as NSFW but with a different reason string
 *
 * Two CTAs always: "Try Again" (re-enters loading screen with a fresh jobId)
 * and "Back" (returns to the configure/create screen).
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors } from '@/constants/theme';
import { verticalScale, fontScale } from '@/lib/responsive';
import type { DreamFailure } from '@/store/dream';

interface Props {
  failure: DreamFailure;
  onRetry: () => void;
  onDismiss: () => void;
}

interface FailureCopy {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  title: string;
  body: string;
}

function copyFor(failure: DreamFailure): FailureCopy {
  if (failure.isNsfw) {
    return {
      icon: 'shield-checkmark-outline',
      iconColor: colors.accent,
      title: 'Flagged by safety filters',
      body: failure.refunded
        ? 'This dream was flagged by our safety filters. Your sparkle has been refunded — try a different prompt.'
        : "This dream was flagged by our safety filters. We'll refund your sparkle shortly.",
    };
  }
  if (failure.isPreFlightModeration) {
    return {
      icon: 'alert-circle-outline',
      iconColor: '#F59E0B',
      title: 'Prompt not allowed',
      body: failure.refunded
        ? "Your prompt didn't pass our content checks. Sparkle refunded — try rephrasing."
        : "Your prompt didn't pass our content checks. We'll refund your sparkle shortly.",
    };
  }
  if (failure.refunded) {
    return {
      icon: 'cloud-offline-outline',
      iconColor: colors.accent,
      title: "Dream didn't make it through",
      body: 'Something hiccuped during render. Your sparkle has been refunded. Want to try again?',
    };
  }
  // refund pending — transport-level failure, sweeper will catch it
  return {
    icon: 'time-outline',
    iconColor: colors.textSecondary,
    title: 'Lost touch with the dream engine',
    body: "We didn't get a clear answer back. If your dream succeeded, you'll see it on your profile in a moment. Otherwise, your sparkle will be refunded automatically within a few minutes.",
  };
}

export function DreamFailureCard({ failure, onRetry, onDismiss }: Props) {
  const copy = copyFor(failure);

  function handleRetry() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onRetry();
  }

  function handleDismiss() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onDismiss();
  }

  return (
    <View style={s.card}>
      <Ionicons name={copy.icon} size={48} color={copy.iconColor} style={s.icon} />
      <Text style={s.title}>{copy.title}</Text>
      <Text style={s.body}>{copy.body}</Text>
      <View style={s.actions}>
        <TouchableOpacity
          style={[s.btn, s.btnSecondary]}
          onPress={handleDismiss}
          activeOpacity={0.7}
        >
          <Text style={s.btnSecondaryText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[s.btn, s.btnPrimary]} onPress={handleRetry} activeOpacity={0.7}>
          <Text style={s.btnPrimaryText}>Try Again</Text>
        </TouchableOpacity>
      </View>
      {/* Dev-only debug: show the raw error message + reason class for triage */}
      {__DEV__ && (
        <Text style={s.debug}>
          {failure.refundReason ? `[${failure.refundReason}] ` : ''}
          {failure.message}
        </Text>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  icon: {
    marginBottom: verticalScale(12),
  },
  title: {
    color: colors.textPrimary,
    fontSize: fontScale(18),
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: verticalScale(8),
  },
  body: {
    color: colors.textSecondary,
    fontSize: fontScale(14),
    textAlign: 'center',
    lineHeight: fontScale(20),
    marginBottom: verticalScale(20),
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  btn: {
    flex: 1,
    paddingVertical: verticalScale(12),
    borderRadius: 12,
    alignItems: 'center',
  },
  btnSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  btnSecondaryText: {
    color: colors.textSecondary,
    fontSize: fontScale(14),
    fontWeight: '600',
  },
  btnPrimary: {
    backgroundColor: colors.accent,
  },
  btnPrimaryText: {
    color: '#FFFFFF',
    fontSize: fontScale(14),
    fontWeight: '700',
  },
  debug: {
    color: colors.textSecondary,
    fontSize: fontScale(10),
    fontFamily: 'monospace',
    textAlign: 'center',
    opacity: 0.5,
    marginTop: verticalScale(12),
  },
});
