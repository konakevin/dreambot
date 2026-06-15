import { showAlert } from '@/components/CustomAlert';
import { Toast } from '@/components/Toast';
import { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  ActivityIndicator,
  Switch,
  Linking,
} from 'react-native';
import { Text } from '@/components/AppText';
import Constants from 'expo-constants';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ScreenLayout } from '@/components/ScreenLayout';
import * as ImagePicker from 'expo-image-picker';
import * as nav from '@/lib/navigate';
import * as Haptics from 'expo-haptics';
import { useAuthStore } from '@/store/auth';
import { usePublicProfile } from '@/hooks/usePublicProfile';
import { useAvatarUpload } from '@/hooks/useAvatarUpload';
import { supabase } from '@/lib/supabase';
import { useQueryClient } from '@tanstack/react-query';
import { useFeedStore } from '@/store/feed';
import { useOnboardingStore } from '@/store/onboarding';
import { resetCreateIntro } from '@/components/CreateIntroSheet';
import { resetFeedIntro } from '@/components/FeedIntroGate';
import { resetMediumsIntro } from '@/components/MediumsIntroSheet';
import { isVibeProfile } from '@/types/vibeProfile';
import { colors } from '@/constants/theme';
import { verticalScale, fontScale } from '@/lib/responsive';
import { moderateText } from '@/lib/moderation';
import { useAdminShowDeleteButton, useAdminShowModelBadge } from '@/lib/adminPrefs';

function SettingsRow({
  icon,
  label,
  onPress,
  destructive,
  trailing,
}: {
  icon: string;
  label: string;
  onPress: () => void;
  destructive?: boolean;
  trailing?: React.ReactNode;
}) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      <Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={20} color={colors.accent} />
      <Text style={[styles.rowLabel, destructive && styles.destructiveText]}>{label}</Text>
      {trailing === null ? null : (
        <View style={styles.rowTrailing}>
          {trailing}
          <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
        </View>
      )}
    </TouchableOpacity>
  );
}

function trialDaysLeftLabel(proTrialEndsAt: string): string {
  const msLeft = new Date(proTrialEndsAt).getTime() - Date.now();
  if (msLeft <= 0) return 'Trial ended';
  const days = Math.max(0, Math.floor(msLeft / (24 * 60 * 60 * 1000)));
  if (days === 0) return 'Last day';
  if (days === 1) return '1 day left';
  return `${days} days left`;
}

export default function SettingsScreen() {
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);
  const isPro = useAuthStore((s) => s.isPro);
  const isPaidPro = useAuthStore((s) => s.isPaidPro);
  const isBasic = useAuthStore((s) => s.isBasic);
  const proTrialEndsAt = useAuthStore((s) => s.proTrialEndsAt);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [allowReposts, setAllowReposts] = useState(true);
  const [showAdminDelete, setShowAdminDelete] = useAdminShowDeleteButton();
  const isSuperAdmin = useAuthStore((s) => s.isSuperAdmin);
  const [showModelBadge, setShowModelBadge] = useAdminShowModelBadge();
  useEffect(() => {
    if (!user) return;
    supabase
      .from('users')
      .select('is_admin, is_public, allow_reposts')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        const row = data as unknown as {
          is_admin?: boolean;
          is_public?: boolean;
          allow_reposts?: boolean;
        };
        if (row?.is_admin) setIsAdmin(true);
        if (row?.is_public) setIsPublic(true);
        setAllowReposts(row?.allow_reposts ?? true);
      });
  }, [user]);
  const queryClient = useQueryClient();
  const bumpReset = useFeedStore((s) => s.bumpReset);
  const regenerateSeed = useFeedStore((s) => s.regenerateSeed);
  const { data: profile } = usePublicProfile(user?.id ?? '');
  const { mutate: uploadAvatar, isPending: uploading } = useAvatarUpload();
  const [changingUsername, setChangingUsername] = useState(false);

  // Load vibe profile into onboarding store for settings sub-screens.
  // Set isEditing once on mount, clear on unmount — NOT on focus/blur,
  // because navigating to a sub-screen blurs the index and would toggle it off.
  const vibeProfile = useOnboardingStore((s) => s.profile);
  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from('user_recipes')
        .select('recipe')
        .eq('user_id', user.id)
        .single();
      if (data?.recipe && isVibeProfile(data.recipe)) {
        useOnboardingStore.getState().loadProfile(data.recipe);
      }
      useOnboardingStore.getState().setIsEditing(true);
    })();
    return () => {
      useOnboardingStore.getState().setIsEditing(false);
    };
  }, [user]);

  // Dream-engine summary helpers (artStylesSummary, vibesSummary,
  // locationCount, objectCount, castSummary) used to live here for the
  // inline DREAM ENGINE rows; those rows moved to the Edit Profile
  // screen so the summaries went with them.

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
      ...(profile?.avatar_url
        ? [
            {
              text: 'Delete Photo',
              style: 'destructive' as const,
              onPress: () => {
                showAlert('Delete Photo', 'Are you sure you want to remove your profile picture?', [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                      // Clean up the avatar file in storage too — otherwise
                      // every "Delete Photo" leaves the JPEG orphaned in
                      // the avatars bucket. Path is fixed: <userId>/avatar.jpg.
                      supabase.storage
                        .from('avatars')
                        .remove([`${user!.id}/avatar.jpg`])
                        .catch((e) => {
                          if (__DEV__) console.warn('[settings] storage cleanup failed', e);
                        });
                      await supabase.from('users').update({ avatar_url: null }).eq('id', user!.id);
                      await supabase.auth.updateUser({ data: { avatar_url: null } });
                      queryClient.invalidateQueries({ queryKey: ['publicProfile'] });
                    },
                  },
                ]);
              },
            },
          ]
        : []),
      { text: 'Cancel', style: 'cancel' as const },
    ]);
  }

  function handleChangeUsername() {
    Alert.prompt(
      'Change username',
      'Enter your new username',
      async (newUsername: string) => {
        const trimmed = newUsername.trim().toLowerCase();
        if (!trimmed || trimmed.length < 3) {
          showAlert('Too short', 'Username must be at least 3 characters.');
          return;
        }
        setChangingUsername(true);
        try {
          const modResult = await moderateText(trimmed);
          if (!modResult.passed) {
            showAlert(
              'Invalid username',
              modResult.reason ?? 'Username contains inappropriate content'
            );
            return;
          }
          const { error } = await supabase
            .from('users')
            .update({ username: trimmed })
            .eq('id', user!.id);
          if (error) {
            if (error.message.includes('unique') || error.message.includes('duplicate')) {
              showAlert('Taken', 'That username is already in use.');
            } else {
              showAlert('Error', error.message);
            }
            return;
          }
          await supabase.auth.updateUser({ data: { username: trimmed } });
          queryClient.invalidateQueries({ queryKey: ['publicProfile'] });
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch (err: unknown) {
          showAlert('Error', (err as Error).message);
        } finally {
          setChangingUsername(false);
        }
      },
      'plain-text',
      profile?.username ?? ''
    );
  }

  function handleChangePassword() {
    showAlert('Reset password', `We'll send a reset link to ${user?.email}`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Send link',
        onPress: async () => {
          await supabase.auth.resetPasswordForEmail(user!.email!);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          showAlert('Sent', 'Check your email for the reset link.');
        },
      },
    ]);
  }

  function handleRefreshAll() {
    showAlert('Refresh App', 'Refresh all app data?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Refresh',
        onPress: () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          queryClient.clear();
          regenerateSeed();
          bumpReset();
          router.replace('/(tabs)');
        },
      },
    ]);
  }

  function handleSignOut() {
    showAlert('Sign out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: async () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          await signOut();
          router.replace('/(auth)');
        },
      },
    ]);
  }

  function handleDeleteAccount() {
    showAlert(
      'Delete account',
      'This will permanently delete your account and all your data. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            showAlert('Are you absolutely sure?', 'There is no going back.', [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Yes, delete my account',
                style: 'destructive',
                onPress: async () => {
                  try {
                    // Clean up storage BEFORE the DB cascade nukes the
                    // uploads rows — otherwise the image files orphan in
                    // the bucket forever. RPC returns both base and HQ
                    // (Pro variant) paths for every upload the user owns.
                    // Cast to `never` because the generated types are
                    // stale until codegen runs against the live schema
                    // (same pattern useDeletePost uses for admin_delete_upload).
                    const { data: pathsRaw } = await supabase.rpc('list_my_upload_paths' as never);
                    const paths = (pathsRaw as string[] | null) ?? [];
                    if (paths.length > 0) {
                      // Batch by 100 to stay well under Storage API limits.
                      for (let i = 0; i < paths.length; i += 100) {
                        await supabase.storage
                          .from('uploads')
                          .remove(paths.slice(i, i + 100))
                          .catch((e) => {
                            if (__DEV__) console.warn('[settings] storage cleanup failed', e);
                          });
                      }
                    }

                    // Also clean the avatars bucket: avatar + cast photos
                    // (separate bucket, not covered by list_my_upload_paths).
                    // Build from in-memory state — no extra RPC needed.
                    const avatarPaths: string[] = [];
                    if (profile?.avatar_url) {
                      const m = profile.avatar_url.match(/\/avatars\/(.+?)(\?|$)/);
                      if (m?.[1]) avatarPaths.push(decodeURIComponent(m[1]));
                    }
                    for (const cm of vibeProfile.dream_cast ?? []) {
                      if (!cm.thumb_url) continue;
                      const m = cm.thumb_url.match(/\/avatars\/(.+?)(\?|$)/);
                      if (m?.[1]) avatarPaths.push(decodeURIComponent(m[1]));
                    }
                    if (avatarPaths.length > 0) {
                      await supabase.storage
                        .from('avatars')
                        .remove(avatarPaths)
                        .catch((e) => {
                          if (__DEV__) console.warn('[settings] storage cleanup failed', e);
                        });
                    }

                    const { error } = await supabase.rpc('delete_own_account');
                    if (error) throw error;
                    await signOut();
                    router.replace('/(auth)');
                  } catch (err: unknown) {
                    showAlert('Error', (err as Error).message);
                  }
                },
              },
            ]);
          },
        },
      ]
    );
  }

  const initial = (profile?.username || user?.user_metadata?.username || '?')[0].toUpperCase();

  return (
    <ScreenLayout header="back" title="Settings" titleGradient swipeBack={false}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Avatar hero */}
        <TouchableOpacity style={styles.avatarHero} onPress={handleChangePhoto} activeOpacity={0.8}>
          {uploading ? (
            <View style={styles.avatarLarge}>
              <ActivityIndicator color="#FFFFFF" />
            </View>
          ) : profile?.avatar_url ? (
            <Image source={{ uri: profile.avatar_url }} style={styles.avatarLarge} />
          ) : (
            <View style={styles.avatarLarge}>
              <Text style={styles.avatarLargeText}>{initial}</Text>
            </View>
          )}
          <Text style={styles.changePhotoLabel}>Change photo</Text>
        </TouchableOpacity>

        {/* Profile section — the new Edit Profile screen is the canonical
            home for avatar / display name / bio / dream-identity drill-ins.
            Profile-picture quick-row kept for the muscle-memory path; the
            two converge on the same useAvatarUpload mutation. */}
        <Text style={styles.sectionHeader}>PROFILE</Text>
        <View style={styles.section}>
          <SettingsRow
            icon="person-circle-outline"
            label="Edit Profile"
            onPress={() => nav.push('/settings/edit-profile')}
          />
          <SettingsRow
            icon="person-outline"
            label="Username"
            onPress={handleChangeUsername}
            trailing={
              changingUsername ? (
                <ActivityIndicator size="small" color={colors.textSecondary} />
              ) : (
                <View style={styles.rowTrailing}>
                  <Text style={styles.rowValue}>{profile?.username ?? ''}</Text>
                  <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
                </View>
              )
            }
          />
          {/* Email is the account identity (often owned by an OAuth provider —
              Apple/Google/Facebook), so it's read-only: a static row, not a
              TouchableOpacity, with no chevron, so it doesn't read as tappable. */}
          <View style={styles.row}>
            <Ionicons name="mail-outline" size={20} color={colors.accent} />
            <Text style={styles.rowLabel}>Email</Text>
            <Text style={styles.rowValue}>{user?.email}</Text>
          </View>
        </View>

        {/* Privacy */}
        <Text style={styles.sectionHeader}>PRIVACY</Text>
        <View style={styles.section}>
          <View style={styles.row}>
            <Ionicons name="lock-closed-outline" size={20} color={colors.accent} />
            <View style={{ flex: 1 }}>
              <Text style={styles.rowLabel}>Public Profile</Text>
              <Text
                style={{
                  color: colors.textSecondary,
                  fontSize: fontScale(12),
                  marginTop: verticalScale(2),
                }}
              >
                {isPublic ? 'Everyone can see your posts' : 'Only friends can see your posts'}
              </Text>
            </View>
            <Switch
              value={isPublic}
              onValueChange={async (val) => {
                setIsPublic(val);
                await supabase.from('users').update({ is_public: val }).eq('id', user!.id);
                queryClient.invalidateQueries({ queryKey: ['publicProfile'] });
                if (val) {
                  Toast.show('All pending follow requests approved', 'checkmark-circle');
                }
              }}
              trackColor={{ false: colors.border, true: colors.accent }}
              thumbColor="#FFFFFF"
            />
          </View>
          <View style={styles.row}>
            <Ionicons name="repeat-outline" size={20} color={colors.accent} />
            <View style={{ flex: 1 }}>
              <Text style={styles.rowLabel}>Allow Reposts</Text>
              <Text
                style={{
                  color: colors.textSecondary,
                  fontSize: fontScale(12),
                  marginTop: verticalScale(2),
                }}
              >
                {allowReposts
                  ? 'Others can repost your dreams to their followers'
                  : 'No one can repost your dreams'}
              </Text>
            </View>
            <Switch
              value={allowReposts}
              onValueChange={async (val) => {
                setAllowReposts(val);
                await supabase.from('users').update({ allow_reposts: val }).eq('id', user!.id);
              }}
              trackColor={{ false: colors.border, true: colors.accent }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Sparkles */}
        <Text style={styles.sectionHeader}>SUBSCRIPTION</Text>
        <View style={styles.section}>
          <SettingsRow
            icon="diamond"
            label={isPaidPro || isBasic ? 'Manage plan' : isPro ? 'Choose a plan' : 'Get Premium'}
            trailing={
              isPaidPro ? (
                <Text style={styles.trailingSummary}>Pro</Text>
              ) : isBasic ? (
                <Text style={styles.trailingSummary}>Basic</Text>
              ) : isPro && proTrialEndsAt ? (
                <Text style={styles.trailingSummary}>{trialDaysLeftLabel(proTrialEndsAt)}</Text>
              ) : null
            }
            onPress={() => nav.push('/subscribe')}
          />
        </View>

        <Text style={styles.sectionHeader}>SPARKLES</Text>
        <View style={styles.section}>
          <SettingsRow
            icon="sparkles"
            label="Get Sparkles"
            onPress={() => nav.push('/sparkleStore')}
          />
        </View>

        {/* Bots — browse the full roster with previews + follow toggles
            (post-onboarding equivalent of the onboarding bot selector).
            Inline Follow on cards covers contextual follows; this is the
            discovery/manage surface. */}
        <Text style={styles.sectionHeader}>BOTS</Text>
        <View style={styles.section}>
          <SettingsRow icon="planet" label="Bots" onPress={() => nav.push('/settings/bots')} />
        </View>

        {/* Dream Engine drill-ins (Art Styles / Vibes / Mood / Locations /
            Objects / Dream Cast) used to live here; moved to the Edit
            Profile screen so all identity-shaping rows live in one place.
            The leaf screens themselves still exist at the same routes —
            navigated to via Edit Profile's DREAM IDENTITY section now. */}

        {/* Advanced Mode's AI-model picker now lives inline on the Create
            screen (toggle Advanced Mode → AI Model pill), so the settings
            entry point + /settings/advanced-mode screen were removed. */}

        {isAdmin && (
          <>
            <Text style={styles.sectionHeader}>ADMIN</Text>
            <View style={styles.section}>
              <View style={styles.row}>
                <Ionicons name="close-circle-outline" size={20} color={colors.accent} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowLabel}>One-tap delete button</Text>
                  <Text
                    style={{
                      color: colors.textSecondary,
                      fontSize: fontScale(12),
                      marginTop: verticalScale(2),
                    }}
                  >
                    {showAdminDelete
                      ? 'Red X visible above heart. Single tap deletes (no confirm).'
                      : 'Hidden. Enable for bulk cleanup.'}
                  </Text>
                </View>
                <Switch
                  value={showAdminDelete}
                  onValueChange={(val) => {
                    setShowAdminDelete(val);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  trackColor={{ false: colors.border, true: colors.accent }}
                  thumbColor="#FFFFFF"
                />
              </View>
              {/* AI model badge — supreme-admin only (not regular admins). The
                  badge is double-gated: isSuperAdmin AND this toggle. */}
              {isSuperAdmin && (
                <View style={styles.row}>
                  <Ionicons name="sparkles-outline" size={20} color={colors.accent} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.rowLabel}>AI model badge</Text>
                    <Text
                      style={{
                        color: colors.textSecondary,
                        fontSize: fontScale(12),
                        marginTop: verticalScale(2),
                      }}
                    >
                      {showModelBadge
                        ? 'Shown on every card: which AI rendered it'
                        : 'Hidden. Flip on to see the render model.'}
                    </Text>
                  </View>
                  <Switch
                    value={showModelBadge}
                    onValueChange={(val) => {
                      setShowModelBadge(val);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                    trackColor={{ false: colors.border, true: colors.accent }}
                    thumbColor="#FFFFFF"
                  />
                </View>
              )}
              {/* Debug escape hatch — clears all query cache + reshuffles the
                  feed + resets scroll. Admin-only (was a vague user-facing row). */}
              <SettingsRow
                icon="refresh-outline"
                label="Refresh App"
                onPress={handleRefreshAll}
                trailing={null}
              />
            </View>
          </>
        )}

        <View style={styles.section}>
          {isAdmin && (
            <SettingsRow
              icon="flask"
              label="Run Dream Generator"
              onPress={() => nav.push('/dreamTest')}
            />
          )}
          <SettingsRow
            icon="trash-outline"
            label="Reset Profile + Tutorials (test)"
            onPress={async () => {
              await supabase.from('users').update({ has_ai_recipe: false }).eq('id', user!.id);
              await supabase.from('user_recipes').delete().eq('user_id', user!.id);
              // Also clear the first-run intro flags so the Create-tab tutorials
              // (CreateIntro + MediumsIntro) re-show — otherwise a re-onboard
              // would skip them. Non-fatal if storage hiccups.
              await Promise.all([resetCreateIntro(), resetMediumsIntro(), resetFeedIntro()]).catch(
                () => {}
              );
              useOnboardingStore.getState().reset();
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              router.replace('/(onboarding)');
            }}
            destructive
            trailing={null}
          />
          <SettingsRow
            icon="refresh-outline"
            label="Reset First-Run Tutorials (test)"
            onPress={async () => {
              // Clears ONLY the first-run intro flags (CreateIntro + MediumsIntro)
              // so those tutorial sheets re-show next time — without re-onboarding.
              // Lets us replay the first-run flows over and over.
              await Promise.all([resetCreateIntro(), resetMediumsIntro(), resetFeedIntro()]).catch(
                () => {}
              );
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              showAlert(
                'Tutorials reset',
                'First-run tutorials will show again. Reopen the Create tab to see them.'
              );
            }}
            trailing={null}
          />
        </View>

        {/* Account section */}
        <Text style={styles.sectionHeader}>ACCOUNT</Text>
        <View style={styles.section}>
          <SettingsRow
            icon="lock-closed-outline"
            label="Change password"
            onPress={handleChangePassword}
          />
          <SettingsRow
            icon="notifications-outline"
            label="Push Notifications"
            onPress={() => nav.push('/settings/notifications')}
          />
          <SettingsRow
            icon="ban-outline"
            label="Blocked Users"
            onPress={() => nav.push('/settings/blocked-users')}
          />
          <SettingsRow
            icon="log-out-outline"
            label="Sign out"
            onPress={handleSignOut}
            destructive
            trailing={null}
          />
          <SettingsRow
            icon="trash-outline"
            label="Delete account"
            onPress={handleDeleteAccount}
            destructive
            trailing={null}
          />
        </View>

        {/* Help */}
        <Text style={styles.sectionHeader}>HELP</Text>
        <View style={styles.section}>
          <SettingsRow
            icon="help-circle-outline"
            label="How Create works"
            onPress={async () => {
              // Re-arm the Create-tab teaching sheet, then jump to Create — its
              // useFocusEffect re-checks the seen flag on focus and re-shows it.
              await resetCreateIntro().catch(() => {});
              router.replace('/(tabs)/create');
            }}
          />
        </View>

        {/* About / Legal */}
        <Text style={styles.sectionHeader}>ABOUT</Text>
        <View style={styles.section}>
          <SettingsRow
            icon="information-circle-outline"
            label="About DreamBot"
            onPress={() => nav.push('/settings/about')}
          />
          <SettingsRow
            icon="heart-outline"
            label="Acknowledgements"
            onPress={() => nav.push('/settings/acknowledgements')}
          />
          <SettingsRow
            icon="lock-closed-outline"
            label="Privacy Policy"
            onPress={() => Linking.openURL('https://dreambotapp.com/privacy')}
          />
          <SettingsRow
            icon="document-text-outline"
            label="Terms of Service"
            onPress={() => Linking.openURL('https://dreambotapp.com/terms')}
          />
          <View style={styles.row}>
            <Ionicons name="information-circle-outline" size={20} color={colors.accent} />
            <Text style={[styles.rowLabel, { flex: 1 }]}>Version</Text>
            <Text style={styles.rowValue}>{Constants.expoConfig?.version ?? '1.0.0'}</Text>
          </View>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: verticalScale(12),
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  title: { color: colors.textPrimary, fontSize: fontScale(18), fontWeight: '700' },
  scroll: { paddingBottom: verticalScale(60) },
  avatarHero: {
    alignItems: 'center',
    paddingVertical: verticalScale(28),
    gap: 10,
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarLargeText: { color: colors.textPrimary, fontSize: fontScale(32), fontWeight: '700' },
  changePhotoLabel: { color: colors.accent, fontSize: fontScale(14), fontWeight: '600' },
  sectionHeader: {
    color: colors.textSecondary,
    fontSize: fontScale(11),
    fontWeight: '600',
    letterSpacing: 0.8,
    paddingHorizontal: 16,
    paddingTop: verticalScale(8),
    paddingBottom: verticalScale(8),
  },
  section: {
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
    marginBottom: verticalScale(24),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: verticalScale(14),
    gap: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  rowLabel: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: fontScale(15),
    fontWeight: '500',
  },
  destructiveText: { color: colors.textPrimary },
  trailingSummary: { color: colors.textSecondary, fontSize: fontScale(13), maxWidth: 160 },
  rowTrailing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rowValue: {
    color: colors.textSecondary,
    fontSize: fontScale(14),
  },
});
