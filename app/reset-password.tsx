/**
 * Set-new-password screen — the landing point for the password-recovery deep
 * link (`dreambot://reset-password`). The deep-link handler in `_layout.tsx`
 * establishes the recovery session FIRST, then routes here, so by the time this
 * screen mounts `supabase.auth.updateUser({ password })` has a live session to
 * act on.
 *
 * Lives at the TOP level (not inside `(auth)/`) on purpose: the `(auth)` group
 * redirects any active session straight to `/(tabs)`, and a recovery session IS
 * a session — so a reset screen nested there would never render.
 */

import { showAlert } from '@/components/CustomAlert';
import { useState } from 'react';
import {
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Text, TextInput } from '@/components/AppText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';

const MIN_LEN = 8;

export default function ResetPasswordScreen() {
  const session = useAuthStore((s) => s.session);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // The recovery session is set by the deep-link handler before we navigate
  // here. If it's missing the link was already used or expired.
  const hasRecoverySession = !!session;

  async function handleSubmit() {
    if (password.length < MIN_LEN) {
      showAlert('Password too short', `Use at least ${MIN_LEN} characters.`);
      return;
    }
    // eslint-disable-next-line security/detect-possible-timing-attacks -- UI confirm-field equality, not a secret comparison
    if (password !== confirm) {
      showAlert('Passwords don’t match', 'Please re-enter the same password in both fields.');
      return;
    }
    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      showAlert('Couldn’t update password', error.message);
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    showAlert('Password updated', 'You’re all set — your new password is ready to use.', [
      { text: 'Done', onPress: () => router.replace('/(tabs)') },
    ]);
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View className="px-4 pt-4 pb-8">
            <TouchableOpacity
              onPress={() => router.replace('/(tabs)')}
              className="w-11 h-11 items-center justify-center"
            >
              <Ionicons name="close" size={26} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View className="flex-1 px-6">
            <Text className="text-3xl mb-2">🔒</Text>
            <Text className="text-white text-2xl font-bold mb-1">Set a new password</Text>

            {hasRecoverySession ? (
              <>
                <Text className="text-text-secondary mb-8">
                  Choose a new password for your account.
                </Text>

                <Text className="text-text-secondary text-xs mb-2 ml-1">NEW PASSWORD</Text>
                <View className="bg-card border border-border rounded-2xl px-4 py-4 flex-row items-center mb-5">
                  <TextInput
                    className="flex-1 text-white text-base"
                    placeholder={`At least ${MIN_LEN} characters`}
                    placeholderTextColor="#3E4144"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    className="ml-2 w-8 h-8 items-center justify-center"
                  >
                    <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={18} color="#71767B" />
                  </TouchableOpacity>
                </View>

                <Text className="text-text-secondary text-xs mb-2 ml-1">CONFIRM PASSWORD</Text>
                <View className="bg-card border border-border rounded-2xl px-4 py-4 mb-8">
                  <TextInput
                    className="text-white text-base"
                    placeholder="Re-enter your password"
                    placeholderTextColor="#3E4144"
                    value={confirm}
                    onChangeText={setConfirm}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>

                <TouchableOpacity
                  className={`bg-[#A78BFA] rounded-full py-4 items-center ${loading ? 'opacity-70' : ''}`}
                  onPress={handleSubmit}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text className="text-white font-bold text-base">Update password</Text>
                  )}
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text className="text-text-secondary mb-8">
                  This reset link has expired or was already used. Head to Settings → Change
                  password to send a fresh one.
                </Text>
                <TouchableOpacity
                  className="bg-[#A78BFA] rounded-full py-4 items-center"
                  onPress={() => router.replace('/(tabs)')}
                  activeOpacity={0.8}
                >
                  <Text className="text-white font-bold text-base">Back to app</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
