/**
 * Settings → Notifications
 *
 * Push-only model (simplified from the old Push×Inbox grid):
 *   • Master "Push notifications" switch (inverts push_paused).
 *   • 7 per-category PUSH toggles. The categories already aggregate the
 *     fine-grained types — Likes = post-likes + comment-likes, Comments =
 *     comments + replies, Your dreams = nightly + manual — so granular control
 *     is retained without a row per event type.
 *
 * The in-app inbox always receives everything (it's your activity history —
 * manage it by clearing rows, not prefs), so there is no inbox column.
 *
 * OS-permission honesty: if push is disabled at the iOS level, no banner is
 * delivered regardless of these toggles — so when the OS permission isn't
 * granted we render the master as off + disabled and surface an "Open Settings"
 * deep-link. Re-checked on focus so returning from iOS Settings refreshes it.
 */

import { useCallback, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Switch,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Text } from '@/components/AppText';
import { useFocusEffect } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { ScreenLayout } from '@/components/ScreenLayout';
import { colors } from '@/constants/theme';
import { verticalScale, fontScale } from '@/lib/responsive';
import {
  NOTIFICATION_CATEGORIES,
  isCategoryEnabled,
  useNotificationSettings,
  useToggleNotificationPref,
  useTogglePushPaused,
  type NotificationCategory,
  type NotificationSettings,
} from '@/hooks/useNotificationSettings';

const CATEGORY_DESCRIPTIONS: Record<NotificationCategory, string> = {
  Likes: 'When someone likes your dream or comment',
  Comments: 'New comments + replies on your posts',
  Mentions: 'When someone @mentions you in a comment',
  Follows: 'Follow requests + new followers',
  Shares: 'When someone sends you a post',
  Reposts: 'When someone reposts your dream',
  'Your dreams': 'Your nightly + finished dreams',
};

function CategoryRow({
  category,
  settings,
  disabled,
  onToggle,
}: {
  category: NotificationCategory;
  settings: NotificationSettings | undefined;
  disabled: boolean;
  onToggle: (enabled: boolean) => void;
}) {
  const enabled = isCategoryEnabled(settings, category, 'push');

  return (
    <View style={[styles.row, disabled && styles.rowDisabled]}>
      <View style={styles.rowLabelCol}>
        <Text style={styles.rowLabel}>{category}</Text>
        <Text style={styles.rowSublabel} numberOfLines={2}>
          {CATEGORY_DESCRIPTIONS[category]}
        </Text>
      </View>
      <Switch
        value={!disabled && enabled}
        disabled={disabled}
        onValueChange={onToggle}
        trackColor={{ false: colors.border, true: colors.accent }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
}

export default function NotificationsSettingsScreen() {
  const { data: settings, isLoading } = useNotificationSettings();
  const togglePref = useToggleNotificationPref();
  const togglePushPaused = useTogglePushPaused();

  // OS-level push permission. null = not yet checked. Re-checked on every
  // focus so returning from iOS Settings reflects the new state immediately.
  const [osGranted, setOsGranted] = useState<boolean | null>(null);
  useFocusEffect(
    useCallback(() => {
      let active = true;
      Notifications.getPermissionsAsync().then(({ status }) => {
        if (active) setOsGranted(status === 'granted');
      });
      return () => {
        active = false;
      };
    }, [])
  );

  const osBlocked = osGranted === false;
  const pushAllowed = !osBlocked && !settings?.push_paused;

  const handleToggleCategory = useCallback(
    (category: NotificationCategory) => (enabled: boolean) => {
      Haptics.selectionAsync();
      togglePref.mutate({ category, channel: 'push', enabled });
    },
    [togglePref]
  );

  const handleTogglePush = useCallback(
    (allow: boolean) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      // Master reads "allow push" but persists as push_paused.
      togglePushPaused.mutate(!allow);
    },
    [togglePushPaused]
  );

  return (
    <ScreenLayout header="back" title="Notifications">
      <ScrollView contentContainerStyle={styles.scroll}>
        {isLoading && !settings ? (
          <View style={styles.center}>
            <ActivityIndicator color={colors.textSecondary} />
          </View>
        ) : (
          <>
            {osBlocked && (
              <TouchableOpacity
                style={styles.calloutRow}
                activeOpacity={0.7}
                onPress={() => Linking.openSettings()}
              >
                <Ionicons name="notifications-off-outline" size={20} color={colors.accent} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.calloutLabel}>Notifications are off in iOS Settings</Text>
                  <Text style={styles.calloutSublabel}>
                    Tap to open Settings and allow notifications for DreamBot.
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
              </TouchableOpacity>
            )}

            <Text style={styles.sectionHeader}>PUSH</Text>
            <View style={styles.section}>
              <View style={[styles.masterRow, osBlocked && styles.rowDisabled]}>
                <Ionicons name="notifications-outline" size={20} color={colors.accent} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.masterLabel}>Push notifications</Text>
                  <Text style={styles.masterSublabel}>
                    {osBlocked
                      ? 'Turn on in iOS Settings to receive push'
                      : pushAllowed
                        ? 'Banners appear when the app is closed'
                        : 'All pushes paused. Inbox still works.'}
                  </Text>
                </View>
                <Switch
                  value={pushAllowed}
                  disabled={osBlocked}
                  onValueChange={handleTogglePush}
                  trackColor={{ false: colors.border, true: colors.accent }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>

            <Text style={styles.sectionHeader}>WHAT TO NOTIFY ME ABOUT</Text>
            <View style={styles.section}>
              {NOTIFICATION_CATEGORIES.map((cat) => (
                <CategoryRow
                  key={cat}
                  category={cat}
                  settings={settings}
                  disabled={!pushAllowed}
                  onToggle={handleToggleCategory(cat)}
                />
              ))}
            </View>

            <Text style={styles.footerCopy}>
              Everything still lands in your inbox. These control the push banners only.
            </Text>
          </>
        )}
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: verticalScale(60) },
  center: { paddingTop: verticalScale(80), alignItems: 'center' },
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
    marginBottom: verticalScale(16),
  },
  // Master push row — wide, single switch.
  masterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: verticalScale(14),
    gap: 12,
  },
  masterLabel: {
    color: colors.textPrimary,
    fontSize: fontScale(15),
    fontWeight: '500',
  },
  masterSublabel: {
    color: colors.textSecondary,
    fontSize: fontScale(12),
    marginTop: verticalScale(2),
  },
  // Category row: label/sublabel + single push switch.
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: verticalScale(12),
    gap: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  rowDisabled: {
    opacity: 0.5,
  },
  rowLabelCol: {
    flex: 1,
    paddingRight: 8,
  },
  rowLabel: {
    color: colors.textPrimary,
    fontSize: fontScale(15),
    fontWeight: '500',
  },
  rowSublabel: {
    color: colors.textSecondary,
    fontSize: fontScale(12),
    marginTop: verticalScale(2),
  },
  // OS-permission callout — tappable, deep-links to iOS Settings.
  calloutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: 16,
    marginTop: verticalScale(12),
    marginBottom: verticalScale(4),
    paddingHorizontal: 14,
    paddingVertical: verticalScale(12),
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: colors.accent + '14',
  },
  calloutLabel: {
    color: colors.textPrimary,
    fontSize: fontScale(14),
    fontWeight: '600',
  },
  calloutSublabel: {
    color: colors.textSecondary,
    fontSize: fontScale(12),
    marginTop: verticalScale(2),
    lineHeight: fontScale(17),
  },
  footerCopy: {
    color: colors.textSecondary,
    fontSize: fontScale(12),
    paddingHorizontal: 16,
    paddingTop: verticalScale(8),
    lineHeight: fontScale(17),
  },
});
