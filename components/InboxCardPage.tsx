/**
 * InboxCardPage — a fullscreen page for an inbox row that has no post to fill the screen (a follow request, a
 * failed dream, a gift, a reminder, an accepted follow, a pruned post). The row's text and its actions live right
 * on the page, so swiping through the fullscreen inbox (app/inboxFeed.tsx) never has to leave for a sheet.
 */
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/AppText';
import { colors } from '@/constants/theme';
import { verticalScale, horizontalScale, fontScale } from '@/lib/responsive';
import { avatarUrl as resizeAvatar } from '@/lib/imageUrl';
import * as nav from '@/lib/navigate';
import { computeNotificationRoute } from '@/lib/notificationRouting';
import { reopenFailedDreamInCreate, reopenLatestFailedDream } from '@/lib/retryDream';
import { isDreamBotSystemNotification } from '@/lib/systemNotifications';
import { formatTimeAgo, getGroupText, iconForGroup } from '@/lib/inboxGroupText';
import {
  useApproveFollowRequest,
  useApproveFollowAndFollowBack,
  useDenyFollowRequest,
} from '@/hooks/useFollowRequests';
import type { InboxGroup } from '@/hooks/useInboxGrouped';

const DREAMBOT_MASCOT = require('@/assets/images/onboarding/mascot-welcome.png');

interface Props {
  group: InboxGroup;
  cardHeight: number;
  bottomPadding: number;
  /** A post-type row whose post is gone (pruned / deleted) — say so instead of a blank. */
  postGone?: boolean;
}

function FollowRequestButtons({ actorId }: { actorId: string }) {
  const { mutate: approve, isPending: approving } = useApproveFollowRequest();
  const { mutate: approveAndFollow, isPending: approving2 } = useApproveFollowAndFollowBack();
  const { mutate: deny, isPending: denying } = useDenyFollowRequest();
  const busy = approving || approving2 || denying;
  return (
    <View style={s.actions}>
      <TouchableOpacity
        style={s.primaryButton}
        onPress={() => approve(actorId)}
        disabled={busy}
        activeOpacity={0.7}
      >
        <Text style={s.primaryText}>Accept</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={s.outlineButton}
        onPress={() => approveAndFollow(actorId)}
        disabled={busy}
        activeOpacity={0.7}
      >
        <Text style={s.outlineText}>Accept & Follow Back</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={s.quietButton}
        onPress={() => deny(actorId)}
        disabled={busy}
        activeOpacity={0.7}
      >
        <Text style={s.quietText}>Deny</Text>
      </TouchableOpacity>
    </View>
  );
}

function Actions({ group }: { group: InboxGroup }) {
  const actorId = group.previewActorIds[0] ?? null;
  const route = computeNotificationRoute({
    type: group.type,
    subtype: group.subtype ?? undefined,
    uploadId: group.uploadId ?? undefined,
    actorId: actorId ?? undefined,
    referenceId: group.referenceId ?? undefined,
    commentId: group.commentId ?? undefined,
  });
  switch (group.type) {
    case 'follow_request':
    case 'friend_request':
      return actorId ? <FollowRequestButtons actorId={actorId} /> : null;
    case 'dream_failed': {
      if (group.subtype === 'nightly_failed') return null;
      const reopen = () =>
        void (group.referenceId
          ? reopenFailedDreamInCreate(group.referenceId)
          : reopenLatestFailedDream());
      return (
        <View style={s.actions}>
          <TouchableOpacity style={s.primaryButton} onPress={reopen} activeOpacity={0.7}>
            <Text style={s.primaryText}>
              {group.subtype === 'rejected' ? 'Tweak it' : 'Try again'}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
    case 'sparkle_gift':
      return route ? (
        <View style={s.actions}>
          <TouchableOpacity
            style={s.primaryButton}
            onPress={() => nav.push(route)}
            activeOpacity={0.7}
          >
            <Text style={s.primaryText}>
              {group.subtype === 'thanks' ? 'View profile' : 'Unwrap'}
            </Text>
          </TouchableOpacity>
        </View>
      ) : null;
    case 'follow_accepted':
    case 'friend_accepted':
      return actorId ? (
        <View style={s.actions}>
          <TouchableOpacity
            style={s.outlineButton}
            onPress={() => nav.push(`/user/${actorId}`)}
            activeOpacity={0.7}
          >
            <Text style={s.outlineText}>View profile</Text>
          </TouchableOpacity>
        </View>
      ) : null;
    default:
      return route ? (
        <View style={s.actions}>
          <TouchableOpacity
            style={s.outlineButton}
            onPress={() => nav.push(route)}
            activeOpacity={0.7}
          >
            <Text style={s.outlineText}>Open</Text>
          </TouchableOpacity>
        </View>
      ) : null;
  }
}

export function InboxCardPage({ group, cardHeight, bottomPadding, postGone }: Props) {
  const text = getGroupText(group);
  const icon = iconForGroup(group);
  const isSystem = isDreamBotSystemNotification(group.type, group.subtype);
  const avatar = group.previewAvatars[0] ?? null;
  const body = group.body && group.body.trim().length > 0 ? group.body.trim() : null;
  return (
    <View style={[s.page, { height: cardHeight, paddingBottom: bottomPadding }]}>
      <View style={s.avatarWrap}>
        {isSystem || !avatar ? (
          <Image source={DREAMBOT_MASCOT} style={s.avatar} contentFit="cover" />
        ) : (
          <Image source={{ uri: resizeAvatar(avatar) }} style={s.avatar} contentFit="cover" />
        )}
        <View style={[s.iconBadge, { backgroundColor: icon.color }]}>
          <Ionicons name={icon.name} size={fontScale(16)} color="#FFFFFF" />
        </View>
      </View>
      <Text style={s.subject}>{text.subject}</Text>
      {postGone ? (
        <Text style={s.body}>That post is gone.</Text>
      ) : body ? (
        <Text style={s.body}>{body}</Text>
      ) : null}
      <Text style={s.time}>{formatTimeAgo(group.lastAt)}</Text>
      {postGone ? null : <Actions group={group} />}
    </View>
  );
}

const s = StyleSheet.create({
  page: {
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: horizontalScale(32),
  },
  avatarWrap: { marginBottom: verticalScale(18) },
  avatar: {
    width: horizontalScale(96),
    height: horizontalScale(96),
    borderRadius: horizontalScale(48),
    backgroundColor: colors.surface,
  },
  iconBadge: {
    position: 'absolute',
    right: -horizontalScale(4),
    bottom: -verticalScale(2),
    width: horizontalScale(32),
    height: horizontalScale(32),
    borderRadius: horizontalScale(16),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#000',
  },
  subject: {
    color: '#FFFFFF',
    fontSize: fontScale(22),
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: verticalScale(10),
  },
  body: {
    color: colors.textSecondary,
    fontSize: fontScale(15),
    lineHeight: fontScale(22),
    textAlign: 'center',
    marginBottom: verticalScale(10),
  },
  time: { color: colors.textSecondary, fontSize: fontScale(12), marginBottom: verticalScale(22) },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: horizontalScale(8),
  },
  primaryButton: {
    backgroundColor: colors.accent,
    borderRadius: verticalScale(14),
    paddingHorizontal: horizontalScale(18),
    paddingVertical: verticalScale(10),
  },
  primaryText: { color: '#FFFFFF', fontSize: fontScale(14), fontWeight: '700' },
  outlineButton: {
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: verticalScale(14),
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(10),
  },
  outlineText: { color: '#FFFFFF', fontSize: fontScale(14), fontWeight: '700' },
  quietButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: verticalScale(14),
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(10),
  },
  quietText: { color: colors.textSecondary, fontSize: fontScale(14), fontWeight: '600' },
});
