import { showAlert } from '@/components/CustomAlert';
import { asDbResult } from '@/lib/dbResult';
import { Toast } from '@/components/Toast';
import { useState, useEffect } from 'react';
import { View, TouchableOpacity, ScrollView, StyleSheet, Switch } from 'react-native';
import { Text } from '@/components/AppText';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Linking from 'expo-linking';
import { ScreenLayout } from '@/components/ScreenLayout';
import * as nav from '@/lib/navigate';
import * as Haptics from 'expo-haptics';
import { useAuthStore } from '@/store/auth';
import { usePublicProfile } from '@/hooks/usePublicProfile';
import { useUsernameStatus } from '@/hooks/useUsernameStatus';
import { useConfirmSurpriseDream } from '@/hooks/useConfirmSurpriseDream';
import { UsernameNudge } from '@/components/UsernameNudge';
import { supabase } from '@/lib/supabase';
import { useQueryClient } from '@tanstack/react-query';
import { useFeedStore } from '@/store/feed';
import { useOnboardingStore } from '@/store/onboarding';
import { CreateIntroSheet } from '@/components/CreateIntroSheet';
import { MediumsIntroSheet } from '@/components/MediumsIntroSheet';
import { resetAllFirstRunFlags } from '@/lib/firstRunFlags';
import { isVibeProfile } from '@/types/vibeProfile';
import { colors } from '@/constants/theme';
import { verticalScale, fontScale } from '@/lib/responsive';
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
  // is_admin is no longer client-readable from the users table (migration 280) —
  // it comes from the auth store, populated via the get_my_account RPC.
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const [isPublic, setIsPublic] = useState(false);
  const [allowReposts, setAllowReposts] = useState(true);
  const [showAdminDelete, setShowAdminDelete] = useAdminShowDeleteButton();
  const isSuperAdmin = useAuthStore((s) => s.isSuperAdmin);
  const [showModelBadge, setShowModelBadge] = useAdminShowModelBadge();
  const { confirm: confirmSurprise, setConfirm: setConfirmSurprise } = useConfirmSurpriseDream();

  // Which auth providers back this account. OAuth-only users (Google/Apple/
  // Facebook) have no email/password identity — "Change password" is
  // meaningless for them, so we show a read-only "managed by" row instead.
  const authProviders: string[] =
    user?.identities?.map((i) => i.provider) ??
    (user?.app_metadata?.providers as string[] | undefined) ??
    (user?.app_metadata?.provider ? [user.app_metadata.provider as string] : []);
  const hasPasswordLogin = authProviders.includes('email');
  const oauthLabel = (() => {
    const p = authProviders.find((x) => x !== 'email');
    if (p === 'google') return 'Google';
    if (p === 'apple') return 'Apple';
    if (p === 'facebook') return 'Facebook';
    return p ? p.charAt(0).toUpperCase() + p.slice(1) : 'your sign-in provider';
  })();
  const showAdmin = isAdmin;
  useEffect(() => {
    if (!user) return;
    supabase
      .from('users')
      .select('is_public, allow_reposts')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        const row = asDbResult<{
          is_public?: boolean;
          allow_reposts?: boolean;
        }>(data);
        if (row?.is_public) setIsPublic(true);
        setAllowReposts(row?.allow_reposts ?? true);
      });
  }, [user]);
  const queryClient = useQueryClient();
  const bumpReset = useFeedStore((s) => s.bumpReset);
  const regenerateSeed = useFeedStore((s) => s.regenerateSeed);
  const { data: profile } = usePublicProfile(user?.id ?? '');
  const { data: usernameStatus } = useUsernameStatus();
  // Username is editable ONCE (while unconfirmed) then locked read-only. The
  // picker modal is the same component the home claim-nudge uses.
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  // Support-section tutorial sheets — shown directly over Settings (no jump
  // into the Create tab).
  const [showCreateIntro, setShowCreateIntro] = useState(false);
  const [showMediumsIntro, setShowMediumsIntro] = useState(false);
  const usernameUnconfirmed = usernameStatus != null && !usernameStatus.confirmed;
  const handleAt = usernameStatus?.username ?? profile?.username ?? '';

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

  function handleChangePassword() {
    showAlert('Reset password', `We'll send a reset link to ${user?.email}`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Send link',
        onPress: async () => {
          // redirectTo deep-links the recovery email back into the app
          // (dreambot://reset-password) where the user actually sets the new
          // password. Without it the link dead-ends on Supabase's Site URL.
          const { error } = await supabase.auth.resetPasswordForEmail(user!.email!, {
            redirectTo: Linking.createURL('reset-password'),
          });
          if (error) {
            showAlert('Couldn’t send link', error.message);
            return;
          }
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

                    // Also clean the avatars + cast-photos buckets: profile
                    // avatar + cast face photos (separate buckets, not covered
                    // by list_my_upload_paths). Build from in-memory state — no
                    // extra RPC needed. Cast photos are in the PRIVATE
                    // `cast-photos` bucket (storage_path); legacy un-migrated
                    // ones may still be a public `avatars` URL (thumb_url).
                    const avatarPaths: string[] = [];
                    const castPaths: string[] = [];
                    if (profile?.avatar_url) {
                      const m = profile.avatar_url.match(/\/avatars\/(.+?)(\?|$)/);
                      if (m?.[1]) avatarPaths.push(decodeURIComponent(m[1]));
                    }
                    for (const cm of vibeProfile.dream_cast ?? []) {
                      if (cm.storage_path) {
                        castPaths.push(cm.storage_path);
                      } else if (cm.thumb_url) {
                        const m = cm.thumb_url.match(/\/avatars\/(.+?)(\?|$)/);
                        if (m?.[1]) avatarPaths.push(decodeURIComponent(m[1]));
                      }
                    }
                    if (avatarPaths.length > 0) {
                      await supabase.storage
                        .from('avatars')
                        .remove(avatarPaths)
                        .catch((e) => {
                          if (__DEV__) console.warn('[settings] storage cleanup failed', e);
                        });
                    }
                    if (castPaths.length > 0) {
                      await supabase.storage
                        .from('cast-photos')
                        .remove(castPaths)
                        .catch((e) => {
                          if (__DEV__) console.warn('[settings] cast cleanup failed', e);
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

  return (
    <ScreenLayout header="back" title="Settings" titleGradient swipeBack={false}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {showAdmin && (
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

        {showAdmin && (
          <View style={styles.section}>
            <SettingsRow
              icon="flask"
              label="Run Dream Generator"
              onPress={() => nav.push('/dreamTest')}
            />
            <SettingsRow
              icon="trash-outline"
              label="Reset Profile + Tutorials (test)"
              onPress={async () => {
                // Purge cast face photos from storage first — the reset RPC
                // can't touch storage, so without this the reset-and-re-onboard
                // test loop leaks orphaned face photos. Owner-RLS lets the client
                // delete its own files. Best-effort (both buckets: new private +
                // legacy public).
                if (user) {
                  for (const bucket of ['cast-photos', 'avatars'] as const) {
                    try {
                      const { data: files } = await supabase.storage
                        .from(bucket)
                        .list(user.id, { limit: 1000 });
                      const paths = (files ?? [])
                        .filter((f) => f.name.startsWith('cast-'))
                        .map((f) => `${user.id}/${f.name}`);
                      if (paths.length) await supabase.storage.from(bucket).remove(paths);
                    } catch {
                      /* non-fatal */
                    }
                  }
                }
                // Server-side reset (migration 287): flips has_ai_recipe, deletes
                // user_recipes, AND releases the free-first-dream claim — the last
                // of which the client can't delete under RLS, and whose absence
                // trapped re-onboarding in the "Try again" loop.
                try {
                  await supabase.rpc('reset_my_profile');
                } catch {
                  /* non-fatal — onboarding store reset + nav still proceed */
                }
                // Also clear the account-bound first-run intro flags (user_first_run,
                // migration 284) so all four tutorials re-show — otherwise a re-onboard
                // would skip them. Non-fatal if the write hiccups.
                await resetAllFirstRunFlags().catch(() => {});
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
                // Clears ONLY the account-bound first-run intro flags (feed / Create
                // / Mediums / Sparkle, in user_first_run) so those tutorial sheets
                // re-show next time — without re-onboarding. Replay the flows freely.
                await resetAllFirstRunFlags().catch(() => {});
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                showAlert(
                  'Tutorials reset',
                  'First-run tutorials will show again. Reopen the Create tab to see them.'
                );
              }}
              trailing={null}
            />
          </View>
        )}

        {/* Premium — surfaced at the TOP as a highlighted card so the upgrade +
            sparkle store are the first thing a user sees. Sell line for
            non-payers; calmer "Manage plan" for paid. (Replaces the old plain
            PREMIUM section that used to sit below Privacy.) */}
        <View style={styles.premiumCard}>
          {!isPaidPro && !isBasic && (
            <View style={styles.premiumHeader}>
              <Text style={styles.premiumTitle}>
                {isPro ? "You're on the free trial" : 'Go Premium'}
              </Text>
              <Text style={styles.premiumSub}>
                {isPro && proTrialEndsAt
                  ? `${trialDaysLeftLabel(proTrialEndsAt)} on your free trial`
                  : 'Nightly dreams, more sparkles, and HD downloads'}
              </Text>
            </View>
          )}
          <SettingsRow
            icon="diamond"
            label={isPaidPro || isBasic ? 'Manage plan' : isPro ? 'Choose a plan' : 'Get Premium'}
            trailing={
              isPaidPro ? (
                <Text style={styles.trailingSummary}>Pro</Text>
              ) : isBasic ? (
                <Text style={styles.trailingSummary}>Basic</Text>
              ) : null
            }
            onPress={() => nav.push('/subscribe')}
          />
          <SettingsRow
            icon="sparkles"
            label="Get Sparkles"
            onPress={() => nav.push('/sparkleStore')}
          />
        </View>

        {/* Avatar + "Change photo" moved to the Profile screen (under the
            avatar) — it doesn't belong in Settings. Edit Profile is the
            canonical home for avatar / display name / bio drill-ins. */}
        <Text style={styles.sectionHeader}>PROFILE</Text>
        <View style={styles.section}>
          <SettingsRow
            icon="person-circle-outline"
            label="Edit Profile"
            onPress={() => nav.push('/settings/edit-profile')}
          />
          {/* Username — editable ONCE while unconfirmed (auto-assigned OAuth
              handles), then locked to a read-only @handle. Email signups land
              confirmed (they typed it), so they only ever see the locked row. */}
          {usernameUnconfirmed ? (
            <SettingsRow
              icon="at-outline"
              label="Username"
              onPress={() => setShowUsernameModal(true)}
              trailing={<Text style={styles.rowValue}>@{handleAt}</Text>}
            />
          ) : (
            <View style={styles.row}>
              <Ionicons name="at-outline" size={20} color={colors.accent} />
              <Text style={styles.rowLabel}>Username</Text>
              <Text style={styles.rowValue}>@{handleAt}</Text>
            </View>
          )}
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
          <SettingsRow
            icon="ban-outline"
            label="Blocked Users"
            onPress={() => nav.push('/settings/blocked-users')}
          />
        </View>

        {/* Bots — browse the full roster with previews + follow toggles
            (post-onboarding equivalent of the onboarding bot selector).
            Inline Follow on cards covers contextual follows; this is the
            discovery/manage surface. */}
        <Text style={styles.sectionHeader}>BOTS</Text>
        <View style={styles.section}>
          <SettingsRow
            icon="planet"
            label="Follow Bots"
            onPress={() => nav.push('/settings/bots')}
          />
        </View>

        {/* Dream Settings — also reachable from Edit Profile, surfaced here too.
            Drill-ins to the same standalone editor screens (NOT a duplicated
            inline editor), so there's only ever one live editor component. */}
        <Text style={styles.sectionHeader}>DREAM SETTINGS</Text>
        <View style={styles.section}>
          <SettingsRow
            icon="people-outline"
            label="Dream Cast"
            onPress={() => nav.push('/settings/dream-cast')}
          />
          <SettingsRow
            icon="location-outline"
            label="Locations"
            onPress={() => nav.push('/settings/locations')}
          />
          <SettingsRow
            icon="options-outline"
            label="Mood"
            onPress={() => nav.push('/settings/mood')}
          />
          <View style={styles.row}>
            <Ionicons name="help-circle-outline" size={20} color={colors.accent} />
            <View style={{ flex: 1 }}>
              <Text style={styles.rowLabel}>Confirm surprise dreams</Text>
              <Text
                style={{
                  color: colors.textSecondary,
                  fontSize: fontScale(12),
                  marginTop: verticalScale(2),
                }}
              >
                {confirmSurprise
                  ? 'Ask before dreaming with no prompt'
                  : 'Dream a surprise right away, no prompt needed'}
              </Text>
            </View>
            <Switch
              value={confirmSurprise}
              onValueChange={(val) => void setConfirmSurprise(val)}
              trackColor={{ false: colors.border, true: colors.accent }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Dream Engine drill-ins (Art Styles / Vibes / Mood / Locations /
            Objects / Dream Cast) used to live here; moved to the Edit
            Profile screen so all identity-shaping rows live in one place.
            The leaf screens themselves still exist at the same routes —
            navigated to via Edit Profile's DREAM IDENTITY section now. */}

        {/* Advanced Mode's AI-model picker now lives inline on the Create
            screen (toggle Advanced Mode → AI Model pill), so the settings
            entry point + /settings/advanced-mode screen were removed. */}

        {/* Account — non-destructive account controls. */}
        <Text style={styles.sectionHeader}>ACCOUNT</Text>
        <View style={styles.section}>
          {hasPasswordLogin ? (
            <SettingsRow
              icon="lock-closed-outline"
              label="Change password"
              onPress={handleChangePassword}
            />
          ) : (
            <SettingsRow
              icon="lock-closed-outline"
              label="Password"
              trailing={<Text style={styles.rowValue}>{`Via ${oauthLabel}`}</Text>}
              onPress={() =>
                showAlert(
                  `Managed by ${oauthLabel}`,
                  `You sign in with ${oauthLabel}, so there’s no DreamBot password to change. Manage your login from your ${oauthLabel} account.`
                )
              }
            />
          )}
          <SettingsRow
            icon="notifications-outline"
            label="Push Notifications"
            onPress={() => nav.push('/settings/notifications')}
          />
        </View>

        {/* Support — help + the about/legal sub-menu. */}
        <Text style={styles.sectionHeader}>SUPPORT</Text>
        <View style={styles.section}>
          <SettingsRow
            icon="help-circle-outline"
            label="How to create"
            onPress={() => setShowCreateIntro(true)}
          />
          <SettingsRow
            icon="color-wand-outline"
            label="Dream modes"
            onPress={() => setShowMediumsIntro(true)}
          />
          <SettingsRow
            icon="information-circle-outline"
            label="About"
            onPress={() => nav.push('/settings/about')}
          />
        </View>

        {/* Destructive — sign out + delete, dead last. */}
        <View style={styles.section}>
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
      </ScrollView>

      {showUsernameModal && usernameStatus && (
        <UsernameNudge
          currentUsername={usernameStatus.username}
          secondaryLabel="Cancel"
          onSecondary={() => setShowUsernameModal(false)}
          onSaved={() => setShowUsernameModal(false)}
        />
      )}

      {/* Reference tutorial sheets, shown directly over Settings — CTA is just
          "Ok" since there's no Create flow to continue into. */}
      <CreateIntroSheet
        visible={showCreateIntro}
        onClose={() => setShowCreateIntro(false)}
        ctaLabel="Ok"
      />
      <MediumsIntroSheet
        visible={showMediumsIntro}
        onClose={() => setShowMediumsIntro(false)}
        ctaLabel="Ok"
      />
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
  // Premium upgrade card — accent-tinted + rounded so it stands out from the
  // plain full-bleed sections. Sits at the top of Settings. Inner SettingsRows
  // render full-bleed and clip to the radius via overflow:hidden.
  premiumCard: {
    marginHorizontal: 16,
    marginBottom: verticalScale(24),
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(167,139,250,0.5)',
    backgroundColor: 'rgba(167,139,250,0.06)',
    overflow: 'hidden',
  },
  premiumHeader: {
    paddingHorizontal: 16,
    paddingTop: verticalScale(14),
    paddingBottom: verticalScale(10),
  },
  premiumTitle: {
    color: colors.textPrimary,
    fontSize: fontScale(16),
    fontWeight: '700',
  },
  premiumSub: {
    color: colors.textSecondary,
    fontSize: fontScale(13),
    lineHeight: fontScale(18),
    marginTop: verticalScale(2),
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
