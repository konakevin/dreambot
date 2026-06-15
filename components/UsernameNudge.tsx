/**
 * UsernameNudge — the one-time "pick your @handle" picker.
 *
 * Reused by two callers:
 *   • the home-tab claim nudge (auto-shown to users still on an auto-assigned
 *     handle), where the secondary action is "Maybe later" (snooze);
 *   • the Settings username row while unconfirmed, where it's "Cancel".
 *
 * Saving is the ONE-TIME confirm: it writes `username` + `username_confirmed =
 * true`, which locks the handle (callers then show it read-only). Dismissing
 * does NOT confirm, so a user who skips is never stranded on @dreamer####.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, Modal, Pressable, ActivityIndicator } from 'react-native';
import { Text, TextInput } from '@/components/AppText';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { moderateText } from '@/lib/moderation';
import { useAuthStore } from '@/store/auth';
import { GradientButton } from '@/components/GradientButton';
import { colors } from '@/constants/theme';
import { verticalScale, fontScale } from '@/lib/responsive';

const HANDLE_RE = /^[a-z0-9_]{3,20}$/;

type Availability = 'idle' | 'checking' | 'available' | 'taken' | 'invalid';

interface Props {
  currentUsername: string;
  /** Secondary (dismiss) button label — "Maybe later" on the home nudge,
   *  "Cancel" in Settings. */
  secondaryLabel: string;
  /** Dismiss without confirming (snooze / close). */
  onSecondary: () => void;
  /** Called after a successful confirm. */
  onSaved: () => void;
}

export function UsernameNudge({ currentUsername, secondaryLabel, onSecondary, onSaved }: Props) {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const [value, setValue] = useState(currentUsername);
  const [availability, setAvailability] = useState<Availability>('idle');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const checkSeq = useRef(0);

  const normalized = value.trim().toLowerCase();
  const unchanged = normalized === currentUsername.toLowerCase();

  // Debounced availability check. Skips when unchanged (your own handle) or
  // when the format is invalid.
  useEffect(() => {
    setError(null);
    if (unchanged) {
      setAvailability('idle');
      return;
    }
    if (!HANDLE_RE.test(normalized)) {
      setAvailability('invalid');
      return;
    }
    setAvailability('checking');
    const seq = ++checkSeq.current;
    const t = setTimeout(async () => {
      const { data } = await supabase
        .from('users')
        .select('id')
        .eq('username', normalized)
        .maybeSingle();
      if (seq !== checkSeq.current) return; // a newer keystroke superseded this
      setAvailability(data ? 'taken' : 'available');
    }, 300);
    return () => clearTimeout(t);
  }, [normalized, unchanged]);

  const canSave = !saving && (unchanged || availability === 'available');

  const handleSave = useCallback(async () => {
    if (!user || saving) return;
    if (!HANDLE_RE.test(normalized)) {
      setError('Use 3–20 letters, numbers, or underscores.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const mod = await moderateText(normalized);
      if (!mod.passed) {
        setError(mod.reason ?? 'That username isn’t allowed.');
        return;
      }
      const { error: upErr } = await supabase
        .from('users')
        .update({ username: normalized, username_confirmed: true })
        .eq('id', user.id);
      if (upErr) {
        // 23505 = unique_violation (someone claimed it between check + save).
        if (upErr.code === '23505' || /duplicate|unique/i.test(upErr.message)) {
          setAvailability('taken');
          setError('That username was just taken — try another.');
          return;
        }
        throw upErr;
      }
      await supabase.auth.updateUser({ data: { username: normalized } });
      queryClient.invalidateQueries({ queryKey: ['usernameStatus', user.id] });
      queryClient.invalidateQueries({ queryKey: ['publicProfile', user.id] });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onSaved();
    } catch (e) {
      setError((e as Error).message ?? 'Couldn’t save. Try again.');
    } finally {
      setSaving(false);
    }
  }, [user, saving, normalized, queryClient, onSaved]);

  const hint = (() => {
    if (error) return { text: error, color: colors.error };
    if (unchanged) return { text: 'This is your current handle.', color: colors.textSecondary };
    switch (availability) {
      case 'invalid':
        return { text: '3–20 letters, numbers, or underscores.', color: colors.textSecondary };
      case 'checking':
        return { text: 'Checking…', color: colors.textSecondary };
      case 'available':
        return { text: 'Available', color: colors.success };
      case 'taken':
        return { text: 'That username is taken.', color: colors.error };
      default:
        return { text: ' ', color: colors.textSecondary };
    }
  })();

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onSecondary}>
      <View style={s.backdrop}>
        <View style={s.card}>
          <Text style={s.title}>Choose your username</Text>
          <Text style={s.subtitle}>
            This is your @handle — how people find and mention you. You can set it once, then it’s
            locked.
          </Text>

          <View style={s.inputRow}>
            <Text style={s.at}>@</Text>
            <TextInput
              style={s.input}
              value={value}
              onChangeText={(t) => setValue(t.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={20}
              placeholder="username"
              placeholderTextColor={colors.textMuted ?? colors.textSecondary}
              returnKeyType="done"
              onSubmitEditing={() => canSave && handleSave()}
            />
            {availability === 'checking' ? (
              <ActivityIndicator size="small" color={colors.textSecondary} />
            ) : availability === 'available' ? (
              <Ionicons name="checkmark-circle" size={18} color={colors.success} />
            ) : availability === 'taken' ? (
              <Ionicons name="close-circle" size={18} color={colors.error} />
            ) : null}
          </View>
          <Text style={[s.hint, { color: hint.color }]} numberOfLines={2}>
            {hint.text}
          </Text>

          <GradientButton
            label={saving ? 'Saving…' : 'Save'}
            onPress={handleSave}
            disabled={!canSave}
          />
          <Pressable onPress={onSecondary} hitSlop={8} style={s.secondary}>
            <Text style={s.secondaryText}>{secondaryLabel}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.72)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
  },
  title: {
    color: colors.textPrimary,
    fontSize: fontScale(20),
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: fontScale(13),
    lineHeight: fontScale(19),
    textAlign: 'center',
    marginTop: verticalScale(6),
    marginBottom: verticalScale(18),
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: verticalScale(10),
  },
  at: { color: colors.textSecondary, fontSize: fontScale(17), fontWeight: '700' },
  input: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: fontScale(17),
    fontWeight: '600',
    padding: 0,
  },
  hint: {
    fontSize: fontScale(12),
    marginTop: verticalScale(6),
    marginBottom: verticalScale(16),
    minHeight: fontScale(16),
  },
  secondary: {
    alignSelf: 'center',
    paddingVertical: verticalScale(12),
    marginTop: verticalScale(4),
  },
  secondaryText: { color: colors.textSecondary, fontSize: fontScale(15), fontWeight: '600' },
});
