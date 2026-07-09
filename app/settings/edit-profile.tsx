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

import { useState, useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { KeyboardSwipeDismiss } from '@/components/KeyboardSwipeDismiss';
import { Text, TextInput } from '@/components/AppText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '@/constants/theme';
import { verticalScale, fontScale } from '@/lib/responsive';
import { useAuthStore } from '@/store/auth';
import { useOnboardingStore } from '@/store/onboarding';
import { usePublicProfile } from '@/hooks/usePublicProfile';
import { useAvatarUpload } from '@/hooks/useAvatarUpload';
import { showAvatarConfirm } from '@/components/AvatarConfirm';
import { useAutoSaveProfile } from '@/hooks/useAutoSaveProfile';
import { supabase } from '@/lib/supabase';
import { useQueryClient } from '@tanstack/react-query';
import { showAlert } from '@/components/CustomAlert';
import { PostActionSheet } from '@/components/PostActionSheet';
import { GradientTitle } from '@/components/GradientTitle';
import { Toast } from '@/components/Toast';
import { DreamCastStep } from '@/components/onboarding/DreamCastStep';
import { moderateText, isModerationError, MODERATION_BLOCKED_MESSAGE } from '@/lib/moderation';

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
  { icon: 'location-outline', label: 'Locations', route: '/settings/locations' },
  { icon: 'options-outline', label: 'Mood', route: '/settings/mood' },
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

  // Display name + bio AUTO-SAVE on blur (and on unmount), matching the rest of
  // the screen (photos / locations / vibes already auto-save). No Save button.
  // `savedRef` holds the last-persisted values so a blur with no real change is
  // a no-op, and so we don't rely on the publicProfile refetch landing first.
  const savedRef = useRef({ name: '', bio: '' });
  const hydratedRef = useRef(false);
  const savingTextRef = useRef(false);

  // Hydrate inputs once, when the query first resolves (initial render shows
  // blanks). Only once — re-hydrating on every profile change would clobber
  // in-progress edits when our own save invalidates + refetches.
  useEffect(() => {
    if (profile && !hydratedRef.current) {
      hydratedRef.current = true;
      const n = profile.display_name ?? '';
      const b = profile.bio ?? '';
      setDisplayName(n);
      setBio(b);
      savedRef.current = { name: n, bio: b };
    }
  }, [profile]);

  // Moderate (changed fields only) then persist name + bio. Called on blur.
  const commitProfileText = useCallback(async () => {
    if (!user || savingTextRef.current) return;
    const trimmedName = displayName.trim();
    const trimmedBio = bio.trim();
    const nameChanged = trimmedName !== savedRef.current.name;
    const bioChanged = trimmedBio !== savedRef.current.bio;
    if (!nameChanged && !bioChanged) return;

    savingTextRef.current = true;
    try {
      // Moderate the free-text fields BEFORE the DB write so profanity /
      // harassment never reaches the public profile. (Architect audit
      // 2026-06-06.) Only re-moderate a field that actually changed.
      if (nameChanged && trimmedName) {
        const modName = await moderateText(trimmedName);
        if (!modName.passed) {
          throw new Error(modName.reason ?? 'Display name contains inappropriate language');
        }
      }
      if (bioChanged && trimmedBio) {
        const modBio = await moderateText(trimmedBio);
        if (!modBio.passed) {
          throw new Error(modBio.reason ?? 'Bio contains inappropriate language');
        }
      }

      // Null-out empty strings so the DB stores NULL when cleared (UI then
      // shows the @username fallback).
      const payload = {
        display_name: trimmedName ? trimmedName.slice(0, DISPLAY_NAME_MAX) : null,
        bio: trimmedBio ? trimmedBio.slice(0, BIO_MAX) : null,
      };
      const { error } = await supabase.from('users').update(payload).eq('id', user.id);
      if (error) {
        // Server-side moderation trigger (migration 276) → friendly copy.
        if (isModerationError(error)) throw new Error(MODERATION_BLOCKED_MESSAGE);
        throw error;
      }
      savedRef.current = { name: trimmedName, bio: trimmedBio };
      await queryClient.invalidateQueries({ queryKey: ['publicProfile', user.id] });
      Toast.show('Saved', 'checkmark-circle');
    } catch (e) {
      // Keep the user's text so they can fix it; surface why it didn't save.
      showAlert('Couldn’t save', (e as Error).message ?? 'Try again in a moment.');
    } finally {
      savingTextRef.current = false;
    }
  }, [user, displayName, bio, queryClient]);

  // Safety net: also commit on unmount in case they navigate away without the
  // field blurring first. Ref keeps the latest closure.
  const commitRef = useRef(commitProfileText);
  commitRef.current = commitProfileText;
  useEffect(() => {
    return () => {
      void commitRef.current();
    };
  }, []);

  // Profile-picture source picker — slide-up action sheet (same sheet the
  // profile tab uses for its avatar), replacing the old alert menu.
  const [photoSheetOpen, setPhotoSheetOpen] = useState(false);

  async function chooseFromLibrary() {
    // No allowsEditing → iOS uses the modern PHPicker: faster to open and
    // needs no library-permission prompt (the avatar renders cover-cropped
    // in a circle, so a square crop step isn't needed). Loop so "Choose
    // another" in the confirm re-opens the picker.
    for (;;) {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.8,
      });
      if (result.canceled || !result.assets[0]) return;
      const choice = await showAvatarConfirm(result.assets[0].uri);
      if (choice === 'use') {
        uploadAvatar(result.assets[0].uri);
        return;
      }
      if (choice === 'cancel') return;
      // 'retry' → loop, re-open the picker
    }
  }

  async function takePhoto() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      showAlert('Permission needed', 'Allow camera access in Settings.');
      return;
    }
    // Loop so "Choose another" in the confirm re-opens the camera.
    for (;;) {
      const result = await ImagePicker.launchCameraAsync({
        quality: 0.8,
      });
      if (result.canceled || !result.assets[0]) return;
      const choice = await showAvatarConfirm(result.assets[0].uri);
      if (choice === 'use') {
        uploadAvatar(result.assets[0].uri);
        return;
      }
      if (choice === 'cancel') return;
      // 'retry' → loop, re-open the camera
    }
  }

  function handleChangePhoto() {
    setPhotoSheetOpen(true);
  }

  return (
    <SafeAreaView style={styles.root}>
      {/* Top bar — back / title. Everything auto-saves (name + bio on blur,
          photos/locations/vibes via useAutoSaveProfile), so there's no Save
          button; the right spacer keeps the title centered. */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12} style={styles.topBarIcon}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <GradientTitle>Edit Profile</GradientTitle>
        <View style={styles.topBarIcon} />
      </View>

      {/* KeyboardSwipeDismiss: a deliberate downward swipe anywhere on the form
          drops the keyboard — `interactive` alone can't engage when the form
          fits the viewport or the drag lands on a TextInput (Kevin 2026-07-09). */}
      <KeyboardSwipeDismiss>
        <KeyboardAwareScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
          bottomOffset={verticalScale(24)}
        >
          <Text style={styles.sectionLabel}>PROFILE</Text>

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
              <Text style={styles.changePhotoText}>
                {profile?.avatar_url ? 'Change Photo' : 'Upload Photo'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Display Name */}
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Display Name</Text>
            <TextInput
              style={styles.input}
              value={displayName}
              onChangeText={(t) => setDisplayName(t.slice(0, DISPLAY_NAME_MAX))}
              onBlur={commitProfileText}
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
              onBlur={commitProfileText}
              placeholder="Say something dreamy…"
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

          {/* All dream settings grouped under ONE header. Compact drill-ins
              (Locations / Mood) first so every option is visible above the fold,
              then the taller inline Dream Cast editor (embedded=true skips
              DreamCastStep's outer ScrollView + onboarding chrome; auto-saves via
              useAutoSaveProfile above). */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>DREAM SETTINGS</Text>
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
            <View style={{ marginTop: verticalScale(8) }}>
              <DreamCastStep embedded onNext={() => {}} onBack={() => {}} />
            </View>
          </View>
        </KeyboardAwareScrollView>
      </KeyboardSwipeDismiss>

      <PostActionSheet
        visible={photoSheetOpen}
        onClose={() => setPhotoSheetOpen(false)}
        title="Profile picture"
        titleImageUrl={profile?.avatar_url ?? null}
        rows={[
          {
            key: 'library',
            label: 'Choose from library',
            icon: 'images-outline',
            group: 'primary',
            onPress: () => void chooseFromLibrary(),
          },
          {
            key: 'camera',
            label: 'Take photo',
            icon: 'camera-outline',
            group: 'primary',
            onPress: () => void takePhoto(),
          },
        ]}
      />
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
