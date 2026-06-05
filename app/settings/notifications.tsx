/**
 * Settings → Notifications
 *
 * Phase 3 of NOTIFICATIONS_ARCHITECTURE.md.
 *
 * Layout:
 *   • Master "Push notifications" switch (D10 — inverts push_paused).
 *   • 7×2 toggle grid (Push | Inbox) for the categories from D5.
 *   • "Your dreams" inbox switch is locked on per D8 — surfaced visually with
 *     a small lock icon + dimmed opacity, blocked at the server too.
 *
 * The grid header lives outside the 7 rows so the "Push / Inbox" column
 * labels read once instead of per-row. Each row's switches drive optimistic
 * mutations via useNotificationSettings hooks; failed writes roll back.
 *
 * Pref invalidation: useToggleNotificationPref invalidates inboxGrouped +
 * newNotificationCount when the inbox channel changes, so flipping a
 * category off makes it disappear from the feed + the badge on the next
 * focus.
 */

import { useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { ScreenLayout } from '@/components/ScreenLayout';
import { colors } from '@/constants/theme';
import {
  NOTIFICATION_CATEGORIES,
  isCategoryEnabled,
  useNotificationSettings,
  useToggleNotificationPref,
  useTogglePushPaused,
  type NotificationCategory,
  type NotificationChannel,
  type NotificationSettings,
} from '@/hooks/useNotificationSettings';

const CATEGORY_DESCRIPTIONS: Record<NotificationCategory, string> = {
  Likes: 'When someone likes your dream or comment',
  Comments: 'New comments + replies on your posts',
  Mentions: 'When someone @mentions you in a comment',
  Follows: 'Follow requests + new followers',
  Shares: 'When someone sends you a post',
  'Twins & Fuses': 'When someone twins or fuses your dream',
  'Your dreams': 'Your nightly dreams + downloads',
};

function GridHeader() {
  return (
    <View style={styles.gridHeader}>
      <View style={{ flex: 1 }} />
      <Text style={styles.gridHeaderLabel}>Push</Text>
      <Text style={styles.gridHeaderLabel}>Inbox</Text>
    </View>
  );
}

function CategoryRow({
  category,
  settings,
  onToggle,
}: {
  category: NotificationCategory;
  settings: NotificationSettings | undefined;
  onToggle: (channel: NotificationChannel, enabled: boolean) => void;
}) {
  const pushEnabled = isCategoryEnabled(settings, category, 'push');
  const inboxEnabled = isCategoryEnabled(settings, category, 'inbox');
  const inboxLocked = category === 'Your dreams'; // D8

  return (
    <View style={styles.gridRow}>
      <View style={styles.gridLabelCol}>
        <Text style={styles.gridLabel}>{category}</Text>
        <Text style={styles.gridSublabel} numberOfLines={2}>
          {CATEGORY_DESCRIPTIONS[category]}
        </Text>
      </View>
      <View style={styles.gridSwitchCol}>
        <Switch
          value={pushEnabled}
          onValueChange={(v) => onToggle('push', v)}
          trackColor={{ false: colors.border, true: colors.accent }}
          thumbColor="#FFFFFF"
        />
      </View>
      <View style={styles.gridSwitchCol}>
        {inboxLocked ? (
          <View style={styles.lockedSwitchWrap}>
            <Switch
              value
              disabled
              trackColor={{ false: colors.border, true: colors.accent }}
              thumbColor="#FFFFFF"
              style={{ opacity: 0.55 }}
            />
            <Ionicons
              name="lock-closed"
              size={11}
              color={colors.textTertiary}
              style={styles.lockIcon}
            />
          </View>
        ) : (
          <Switch
            value={inboxEnabled}
            onValueChange={(v) => onToggle('inbox', v)}
            trackColor={{ false: colors.border, true: colors.accent }}
            thumbColor="#FFFFFF"
          />
        )}
      </View>
    </View>
  );
}

export default function NotificationsSettingsScreen() {
  const { data: settings, isLoading } = useNotificationSettings();
  const togglePref = useToggleNotificationPref();
  const togglePushPaused = useTogglePushPaused();

  const handleToggleCategory = useCallback(
    (category: NotificationCategory) => (channel: NotificationChannel, enabled: boolean) => {
      Haptics.selectionAsync();
      togglePref.mutate({ category, channel, enabled });
    },
    [togglePref]
  );

  const handleTogglePush = useCallback(
    (allow: boolean) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      // Inverted: master switch reads "allow push" but persists as push_paused.
      togglePushPaused.mutate(!allow);
    },
    [togglePushPaused]
  );

  const pushAllowed = !settings?.push_paused;

  return (
    <ScreenLayout header="back" title="Notifications">
      <ScrollView contentContainerStyle={styles.scroll}>
        {isLoading && !settings ? (
          <View style={styles.center}>
            <ActivityIndicator color={colors.textSecondary} />
          </View>
        ) : (
          <>
            <Text style={styles.sectionHeader}>PUSH</Text>
            <View style={styles.section}>
              <View style={styles.masterRow}>
                <Ionicons name="notifications-outline" size={20} color={colors.accent} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.masterLabel}>Push notifications</Text>
                  <Text style={styles.masterSublabel}>
                    {pushAllowed
                      ? 'Banners appear when the app is closed'
                      : 'All pushes paused — inbox still works'}
                  </Text>
                </View>
                <Switch
                  value={pushAllowed}
                  onValueChange={handleTogglePush}
                  trackColor={{ false: colors.border, true: colors.accent }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>

            <Text style={styles.sectionHeader}>CATEGORIES</Text>
            <View style={styles.section}>
              <GridHeader />
              {NOTIFICATION_CATEGORIES.map((cat) => (
                <CategoryRow
                  key={cat}
                  category={cat}
                  settings={settings}
                  onToggle={handleToggleCategory(cat)}
                />
              ))}
            </View>

            <Text style={styles.footerCopy}>
              Your dreams stay in your inbox so you don&apos;t miss your own creations.
            </Text>
          </>
        )}
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: 60 },
  center: { paddingTop: 80, alignItems: 'center' },
  sectionHeader: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.8,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  section: {
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
    marginBottom: 16,
  },
  // Master push row — wide, single switch, mirrors settings/index Privacy row.
  masterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  masterLabel: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '500',
  },
  masterSublabel: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  // Grid header: column labels above the 7 category rows.
  gridHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  gridHeaderLabel: {
    color: colors.textTertiary,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.6,
    width: 64,
    textAlign: 'center',
  },
  // Each category row: label/sublabel + 2 switch cells (width = 64 each).
  gridRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  gridLabelCol: {
    flex: 1,
    paddingRight: 8,
  },
  gridLabel: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '500',
  },
  gridSublabel: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  gridSwitchCol: {
    width: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Locked switch (D8: Your dreams inbox).
  lockedSwitchWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockIcon: {
    position: 'absolute',
    bottom: -2,
    right: -2,
  },
  footerCopy: {
    color: colors.textSecondary,
    fontSize: 12,
    paddingHorizontal: 16,
    paddingTop: 8,
    lineHeight: 17,
  },
});
