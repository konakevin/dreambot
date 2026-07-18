/**
 * Change Password — inline, in-app password change for a logged-in
 * password-login user (Settings → Change password). No email round-trip: the
 * user is already authenticated, so we verify their CURRENT password (IG-style
 * re-auth) and then set the new one on the live session.
 *
 * The email-based recovery flow (app/reset-password.tsx) is a SEPARATE thing —
 * it's only for the logged-OUT "Forgot password" case on the login screen,
 * where the user can't prove who they are without an emailed link.
 *
 * OAuth-only accounts (Google/Facebook/Apple) never reach this screen: the
 * Settings row is gated on `hasPasswordLogin` and shows a "managed by <provider>"
 * explainer instead.
 */

import { useState } from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { Text, TextInput } from '@/components/AppText';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { ScreenLayout } from '@/components/ScreenLayout';
import { showAlert } from '@/components/CustomAlert';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';

const MIN_LEN = 8;

export default function ChangePasswordScreen() {
  const user = useAuthStore((s) => s.user);
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    const email = user?.email;
    if (!email) {
      showAlert('No email on file', 'This account has no email/password to change.');
      return;
    }
    if (!current) {
      showAlert('Enter your current password', 'Type your current password to confirm it’s you.');
      return;
    }
    if (next.length < MIN_LEN) {
      showAlert('Password too short', `Use at least ${MIN_LEN} characters.`);
      return;
    }
    if (next !== confirm) {
      showAlert('Passwords don’t match', 'Please re-enter the same new password in both fields.');
      return;
    }
    if (next === current) {
      showAlert(
        'Choose a different password',
        'Your new password must be different from your current one.'
      );
      return;
    }

    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Verify the CURRENT password by re-authenticating. A successful sign-in
    // just refreshes the same user's session; failure means the current
    // password was wrong. We never call updateUser until this passes, so an
    // unlocked-phone bystander can't silently change the password.
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email,
      password: current,
    });
    if (verifyError) {
      setLoading(false);
      showAlert(
        'Current password is incorrect',
        'Double-check your current password and try again.'
      );
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({ password: next });
    setLoading(false);
    if (updateError) {
      showAlert('Couldn’t update password', updateError.message);
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    showAlert('Password updated', 'Your new password is ready to use.', [
      { text: 'Done', onPress: () => router.back() },
    ]);
  }

  return (
    <ScreenLayout header="back" title="Change password">
      <KeyboardAwareScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        bottomOffset={24}
      >
        <View className="flex-1 px-6 pt-4">
          <Text className="text-text-secondary mb-8">
            Enter your current password, then choose a new one.
          </Text>

          <Text className="text-text-secondary text-xs mb-2 ml-1">CURRENT PASSWORD</Text>
          <View className="bg-card border border-border rounded-2xl px-4 py-4 flex-row items-center mb-5">
            <TextInput
              className="flex-1 text-white text-base"
              placeholder="Your current password"
              placeholderTextColor="#3E4144"
              value={current}
              onChangeText={setCurrent}
              secureTextEntry={!showCurrent}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              onPress={() => setShowCurrent(!showCurrent)}
              className="ml-2 w-8 h-8 items-center justify-center"
            >
              <Ionicons name={showCurrent ? 'eye-off' : 'eye'} size={18} color="#71767B" />
            </TouchableOpacity>
          </View>

          <Text className="text-text-secondary text-xs mb-2 ml-1">NEW PASSWORD</Text>
          <View className="bg-card border border-border rounded-2xl px-4 py-4 flex-row items-center mb-5">
            <TextInput
              className="flex-1 text-white text-base"
              placeholder={`At least ${MIN_LEN} characters`}
              placeholderTextColor="#3E4144"
              value={next}
              onChangeText={setNext}
              secureTextEntry={!showNew}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              onPress={() => setShowNew(!showNew)}
              className="ml-2 w-8 h-8 items-center justify-center"
            >
              <Ionicons name={showNew ? 'eye-off' : 'eye'} size={18} color="#71767B" />
            </TouchableOpacity>
          </View>

          <Text className="text-text-secondary text-xs mb-2 ml-1">CONFIRM NEW PASSWORD</Text>
          <View className="bg-card border border-border rounded-2xl px-4 py-4 mb-8">
            <TextInput
              className="text-white text-base"
              placeholder="Re-enter your new password"
              placeholderTextColor="#3E4144"
              value={confirm}
              onChangeText={setConfirm}
              secureTextEntry={!showNew}
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
        </View>
      </KeyboardAwareScrollView>
    </ScreenLayout>
  );
}
