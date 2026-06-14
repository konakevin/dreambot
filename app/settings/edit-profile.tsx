/**
 * Edit Profile screen
 *
 * Single place a user shapes their full identity — both social (avatar,
 * display name, bio) and dream-side (mediums, vibes, mood, locations,
 * objects, cast). The drill-ins navigate to the existing per-axis screens
 * (formerly under Settings → Account / Dream Engine); Settings index has
 * been slimmed to keep only true app-config rows (notifications, privacy,
 * billing, legal).
 *
 * Routed via the profile screen's [Edit Profile] action pill.
 */

import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { colors } from '@/constants/theme';
import { verticalScale, fontScale } from '@/lib/responsive';
import { useAuthStore } from '@/store/auth';
import { useOnboardingStore } from '@/store/onboarding';
import { usePublicProfile } from '@/hooks/usePublicProfile';
import { useAvatarUpload } from '@/hooks/useAvatarUpload';
import { useAutoSaveProfile } from '@/hooks/useAutoSaveProfile';
import { supabase } from '@/lib/supabase';
import { useQueryClient } from '@tanstack/react-query';
import { showAlert } from '@/components/CustomAlert';
import { Toast } from '@/components/Toast';
import { DreamCastStep } from '@/components/onboarding/DreamCastStep';
import { moderateText } from '@/lib/moderation';

const DISPLAY_NAME_MAX = 50;
const BIO_MAX = 160;

interface DrillRow {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  route: string;
}

// Mediums + Vibes drill-ins were removed when Kevin pivoted away from
// user-curated taste (the nightly engine rolls these on its own, and the
// Create screen exposes the full catalog every render). Dream Cast moved
// from a drill-in row to an inline section below the bio so users can
// swap face photos directly on this screen instead of pushing a separate
// route.
const DREAM_IDENTITY_ROWS: DrillRow[] = [
  { icon: 'options-outline', label: 'Mood', route: '/settings/mood' },
  { icon: 'location-outline', label: 'Locations', route: '/settings/locations' },
];

export default function EditProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const { data: profile, isLoading } = usePublicProfile(user?.id ?? '');
  const { mutate: uploadAvatar, isPending: avatarUploading } = useAvatarUpload();

  // Onboarding-store editing mode + auto-save — mirrors
  // /settings/dream-cast.tsx so the embedded DreamCastStep persists
  // photo/relationship changes through the existing useAutoSaveProfile
  // debounce (1.5s + on unmount).
  useEffect(() => {
    useOnboardingStore.getState().setIsEditing(true);
    return () => {
      useOnboardingStore.getState().setIsEditing(false);
    };
  }, []);
  useAutoSaveProfile();

  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [saving, setSaving] = useState(false);

  // Hydrate inputs from the loaded profile. Effect (not useState init) so
  // that the inputs update when the query resolves AFTER first render —
  // initial render shows blanks, then fills in once the RPC returns.
  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name ?? '');
      setBio(profile.bio ?? '');
    }
  }, [profile]);

  const dirty =
    !!profile && (displayName !== (profile.display_name ?? '') || bio !== (profile.bio ?? ''));

  async function handleSave() {
    if (!user || saving) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSaving(true);
    try {
      // Null-out empty strings so the DB row stores NULL when the user
      // clears the field (UI then shows the @username fallback).
      const trimmedDisplayName = displayName.trim();
      const trimmedBio = bio.trim();

      // Moderate both user-facing free-text fields BEFORE the DB write.
      // Without this, profanity / harassment in display_name + bio ships
      // straight to the public profile. (Architect audit 2026-06-06.)
      if (trimmedDisplayName) {
        const modName = await moderateText(trimmedDisplayName);
        if (!modName.passed) {
          throw new Error(modName.reason ?? 'Display name contains inappropriate language');
        }
      }
      if (trimmedBio) {
        const modBio = await moderateText(trimmedBio);
        if (!modBio.passed) {
          throw new Error(modBio.reason ?? 'Bio contains inappropriate language');
        }
      }

      const payload = {
        display_name: trimmedDisplayName ? trimmedDisplayName.slice(0, DISPLAY_NAME_MAX) : null,
        bio: trimmedBio ? trimmedBio.slice(0, BIO_MAX) : null,
      };
      const { error } = await supabase.from('users').update(payload).eq('id', user.id);
      if (error) throw error;
      // Refresh profile data wherever it's consumed.
      await queryClient.invalidateQueries({ queryKey: ['publicProfile', user.id] });
      Toast.show('Profile saved', 'checkmark-circle');
      router.back();
    } catch (e) {
      showAlert('Save failed', (e as Error).message ?? 'Try again in a moment.');
    } finally {
      setSaving(false);
    }
  }

  function handleChangePhoto() {
    showAlert('Profile picture', '', [
      {
        text: 'Choose from library',
        onPress: async () => {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') {
            showAlert('Permission needed', 'Allow photo library access in Settings.');
            return;
          }
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
          });
          if (!result.canceled && result.assets[0]) {
            uploadAvatar(result.assets[0].uri);
          }
        },
      },
      {
        text: 'Take photo',
        onPress: async () => {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== 'granted') {
            showAlert('Permission needed', 'Allow camera access in Settings.');
            return;
          }
          const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
          });
          if (!result.canceled && result.assets[0]) {
            uploadAvatar(result.assets[0].uri);
          }
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }

  return (
    <SafeAreaView style={styles.root}>
      {/* Top bar — back / title / Save */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12} style={styles.topBarIcon}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Edit Profile</Text>
        <TouchableOpacity
          onPress={handleSave}
          disabled={!dirty || saving}
          hitSlop={12}
          style={styles.topBarIcon}
        >
          <Text style={[styles.saveText, (!dirty || saving) && styles.saveTextDisabled]}>
            {saving ? '…' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Avatar block */}
          <View style={styles.avatarBlock}>
            <TouchableOpacity onPress={handleChangePhoto} activeOpacity={0.8}>
              {profile?.avatar_url ? (
                <Image
                  source={{ uri: profile.avatar_url }}
                  style={styles.avatar}
                  contentFit="cover"
                />
              ) : (
                <View style={[styles.avatar, styles.avatarFallback]}>
                  <Text style={styles.avatarInitial}>
                    {(profile?.username || '?')[0]?.toUpperCase() ?? '?'}
                  </Text>
                </View>
              )}
              {avatarUploading && (
                <View style={styles.avatarSpinner}>
                  <ActivityIndicator color="#FFF" />
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={handleChangePhoto} hitSlop={8}>
              <Text style={styles.changePhotoText}>Change Photo</Text>
            </TouchableOpacity>
          </View>

          {/* Display Name */}
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Display Name</Text>
            <TextInput
              style={styles.input}
              value={displayName}
              onChangeText={(t) => setDisplayName(t.slice(0, DISPLAY_NAME_MAX))}
              placeholder={profile?.username ?? 'your name'}
              placeholderTextColor={colors.textSecondary}
              maxLength={DISPLAY_NAME_MAX}
              editable={!isLoading}
            />
            <Text style={styles.charCount}>
              {displayName.length} / {DISPLAY_NAME_MAX}
            </Text>
          </View>

          {/* Bio */}
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Bio</Text>
            <TextInput
              style={[styles.input, styles.inputMultiline]}
              value={bio}
              onChangeText={(t) => setBio(t.slice(0, BIO_MAX))}
              placeholder="One line about you"
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={3}
              maxLength={BIO_MAX}
              editable={!isLoading}
            />
            <Text style={styles.charCount}>
              {bio.length} / {BIO_MAX}
            </Text>
          </View>

          {/* Dream Cast — inline editor. Embedding DreamCastStep with
              embedded=true skips its outer ScrollView + onboarding hero
              chrome, leaving just the slots + privacy note in the host
              ScrollView's flow. Auto-saves via useAutoSaveProfile above. */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>DREAM CAST</Text>
            <DreamCastStep embedded onNext={() => {}} onBack={() => {}} />
          </View>

          {/* Dream identity drill-ins (Mood / Locations / Objects). Mediums
              + Vibes + Dream Cast no longer appear here — see comment by
              the DREAM_IDENTITY_ROWS array. */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>DREAM IDENTITY</Text>
            <View style={styles.sectionCard}>
              {DREAM_IDENTITY_ROWS.map((row, i) => (
                <TouchableOpacity
                  key={row.label}
                  style={[
                    styles.drillRow,
                    i < DREAM_IDENTITY_ROWS.length - 1 && styles.drillRowBorder,
                  ]}
                  onPress={() => router.push(row.route as never)}
                  activeOpacity={0.7}
                >
                  <Ionicons name={row.icon} size={20} color={colors.textSecondary} />
                  <Text style={styles.drillLabel}>{row.label}</Text>
                  <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: verticalScale(8),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  topBarIcon: {
    minWidth: 56,
    alignItems: 'center',
  },
  topBarTitle: {
    color: colors.textPrimary,
    fontSize: fontScale(16),
    fontWeight: '700',
  },
  saveText: {
    color: colors.accent,
    fontSize: fontScale(16),
    fontWeight: '700',
  },
  saveTextDisabled: {
    color: colors.textSecondary,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: verticalScale(40),
    gap: 20,
  },
  avatarBlock: {
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.surface,
  },
  avatarFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    color: colors.textPrimary,
    fontSize: fontScale(36),
    fontWeight: '700',
  },
  avatarSpinner: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  changePhotoText: {
    color: colors.accent,
    fontSize: fontScale(14),
    fontWeight: '600',
  },
  field: {
    gap: 6,
  },
  fieldLabel: {
    color: colors.textSecondary,
    fontSize: fontScale(12),
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: verticalScale(10),
    color: colors.textPrimary,
    fontSize: fontScale(15),
  },
  inputMultiline: {
    minHeight: 72,
    textAlignVertical: 'top',
  },
  charCount: {
    color: colors.textSecondary,
    fontSize: fontScale(11),
    alignSelf: 'flex-end',
  },
  section: {
    gap: 8,
  },
  sectionLabel: {
    color: colors.textSecondary,
    fontSize: fontScale(11),
    fontWeight: '700',
    letterSpacing: 0.5,
    marginLeft: 4,
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  drillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: verticalScale(14),
  },
  drillRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  drillLabel: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: fontScale(15),
    fontWeight: '500',
  },
});
