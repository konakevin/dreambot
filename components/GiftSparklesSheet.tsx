/**
 * GiftSparklesSheet — send sparkles to another user (Gift Sparkles Phase 1,
 * migration 334, GIFT_SPARKLES_PLAN.md).
 *
 * Provenance surfaced up front: "X of your Y sparkles are giftable" with the
 * one-line rule. giftable = 0 becomes the store upsell (the buy-for-a-friend
 * funnel) rather than a dead end — `/sparkleStore?giftFor=<id>` bounces back
 * here after purchase. Server owns all validation; this sheet just maps the
 * RPC status strings to friendly copy.
 */

import { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Pressable } from 'react-native';
import { Text, TextInput } from '@/components/AppText';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as nav from '@/lib/navigate';
import { Toast } from '@/components/Toast';
import { avatarUrl as resizeAvatar } from '@/lib/imageUrl';
import { useGiftableBalance, useSendGift, type GiftStatus } from '@/hooks/useGiftSparkles';
import { useEngineConfig } from '@/hooks/useEngineConfig';
import { colors } from '@/constants/theme';
import { verticalScale, fontScale, isTabletDevice } from '@/lib/responsive';

const AMOUNT_CHIPS = [5, 10, 25];

const STATUS_COPY: Record<Exclude<GiftStatus, 'ok'>, string> = {
  disabled: 'Gifting is taking a quick nap. Try again soon.',
  invalid_amount: "That amount isn't giftable right now.",
  invalid_recipient: "This dreamer can't receive gifts.",
  blocked: "This dreamer can't receive gifts.",
  daily_cap: "You've hit today's gifting limit. Come back tomorrow!",
  insufficient_giftable: "You don't have enough giftable sparkles for that.",
};

interface Props {
  recipientId: string;
  recipientUsername: string;
  recipientAvatarUrl?: string | null;
  onClose: () => void;
}

export function GiftSparklesSheet({
  recipientId,
  recipientUsername,
  recipientAvatarUrl,
  onClose,
}: Props) {
  const { data: giftable } = useGiftableBalance();
  const { giftMessageMaxLen } = useEngineConfig();
  const sendGift = useSendGift();
  // Amount UX (Kevin 2026-07-06): chips ADD (+5/+10/+25) instead of setting,
  // the number itself is typeable, and −/+ auto-repeat on press-and-hold —
  // reaching 100 is two taps of +25 after a +50 hold, not a hundred taps.
  const [amount, setAmount] = useState(5);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  // Clamp to ALL THREE ceilings up front (giftable balance, per-send cap,
  // daily remainder) so the server's 'daily_cap' rejection is unreachable
  // from a fresh sheet — the wall is felt as a smaller Max, not a failed send.
  const dailyRemaining = giftable
    ? Math.max(0, giftable.maxPerDay - giftable.sentToday)
    : Number.MAX_SAFE_INTEGER;
  const maxSendable = Math.min(
    giftable?.giftable ?? 0,
    giftable?.maxPerSend ?? 100,
    dailyRemaining
  );
  const maxRef = useRef(maxSendable);
  maxRef.current = maxSendable;
  const canSend = amount >= 1 && amount <= maxSendable && !sending;
  const noGiftable = giftable != null && giftable.giftable === 0;
  // Daily wall: has giftable sparkles, but today's allowance is spent.
  const dailyCapped = giftable != null && giftable.giftable > 0 && dailyRemaining === 0;

  async function handleSend() {
    if (!canSend) return;
    setSending(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      const status = await sendGift.mutateAsync({
        recipientId,
        amount,
        message: message.trim() || undefined,
      });
      if (status === 'ok') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Toast.show(`Sent ${amount} sparkles to ${recipientUsername} ✨`, 'gift');
        onClose();
      } else {
        Toast.show(STATUS_COPY[status] ?? "Couldn't send that gift.", 'close-circle');
      }
    } catch {
      Toast.show("Couldn't send that gift. Check your connection.", 'close-circle');
    } finally {
      setSending(false);
    }
  }

  const clampAmount = (a: number) => Math.max(1, Math.min(maxRef.current || 1, a));

  function adjustAmount(delta: number) {
    Haptics.selectionAsync();
    setAmount((a) => clampAmount(a + delta));
  }

  // Press-and-hold auto-repeat on −/+ — starts after 350ms, then steps every
  // 70ms (about 14/sec), so holding + walks the value quickly but readably.
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const holdInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  function startHold(delta: number) {
    stopHold();
    holdTimer.current = setTimeout(() => {
      holdInterval.current = setInterval(() => {
        setAmount((a) => clampAmount(a + delta));
      }, 70);
    }, 350);
  }
  function stopHold() {
    if (holdTimer.current) clearTimeout(holdTimer.current);
    if (holdInterval.current) clearInterval(holdInterval.current);
    holdTimer.current = null;
    holdInterval.current = null;
  }
  useEffect(() => stopHold, []);

  // Typing: digits only while editing; clamp on end so a half-typed "1"
  // (heading for "100") isn't fought mid-keystroke.
  function handleAmountText(text: string) {
    const digits = text.replace(/[^0-9]/g, '');
    setAmount(digits === '' ? 0 : Math.min(maxRef.current || 1, parseInt(digits, 10)));
  }

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={s.backdrop} onPress={onClose}>
        <Pressable
          style={[s.sheet, isTabletDevice && { maxWidth: 600, alignSelf: 'center' }]}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={s.handle} />

          {/* Recipient */}
          <View style={s.recipientRow}>
            {recipientAvatarUrl ? (
              <Image
                source={{ uri: resizeAvatar(recipientAvatarUrl) }}
                style={s.avatar}
                cachePolicy="memory-disk"
              />
            ) : (
              <View style={s.avatarFallback}>
                <Text style={s.avatarText}>{recipientUsername[0]?.toUpperCase() ?? '?'}</Text>
              </View>
            )}
            <View style={{ flex: 1 }}>
              <Text style={s.title}>Gift sparkles</Text>
              <Text style={s.recipientName}>to {recipientUsername}</Text>
            </View>
            <TouchableOpacity onPress={onClose} hitSlop={10}>
              <Ionicons name="close" size={22} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {dailyCapped ? (
            /* Daily wall — friendly, zero-surprise (the send can no longer
               fail with 'daily_cap' from a fresh sheet). */
            <View style={s.upsell}>
              <Text style={s.upsellEmoji}>🌙</Text>
              <Text style={s.upsellTitle}>You&apos;ve spread the magic today</Text>
              <Text style={s.upsellBody}>
                You&apos;ve hit today&apos;s {giftable?.maxPerDay ?? 200}-sparkle gifting limit.
                Come back tomorrow to send more.
              </Text>
            </View>
          ) : noGiftable ? (
            /* Upsell state — the buy-for-a-friend funnel. */
            <View style={s.upsell}>
              <Text style={s.upsellEmoji}>🎁</Text>
              <Text style={s.upsellTitle}>Grab a pack and share the magic</Text>
              <Text style={s.upsellBody}>
                Only sparkles you&apos;ve purchased can be gifted. Pick up a pack and send some{' '}
                {recipientUsername}&apos;s way.
              </Text>
              <TouchableOpacity
                style={s.cta}
                activeOpacity={0.8}
                onPress={() => {
                  onClose();
                  setTimeout(() => nav.push(`/sparkleStore?giftFor=${recipientId}`), 250);
                }}
              >
                <Ionicons name="sparkles" size={16} color="#0B0B10" />
                <Text style={s.ctaText}>Get sparkles</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {/* Giftable balance */}
              <Text style={s.balanceLine}>
                <Text style={s.balanceStrong}>{giftable?.giftable ?? '…'}</Text> of your{' '}
                <Text style={s.balanceStrong}>{giftable?.balance ?? '…'}</Text> sparkles are
                giftable
              </Text>
              <Text style={s.ruleLine}>
                Only sparkles you&apos;ve purchased can be gifted.
                {giftable != null &&
                giftable.sentToday > 0 &&
                dailyRemaining < (giftable?.giftable ?? 0)
                  ? ' ' + String(dailyRemaining) + ' \u2728 left to gift today.'
                  : ''}
              </Text>

              {/* Amount */}
              <View style={s.amountRow}>
                {AMOUNT_CHIPS.map((chip) => (
                  <TouchableOpacity
                    key={chip}
                    style={s.chip}
                    disabled={amount >= maxSendable}
                    onPress={() => {
                      Haptics.selectionAsync();
                      setAmount((a) => clampAmount(a + chip));
                    }}
                  >
                    <Text style={[s.chipText, amount >= maxSendable && s.chipTextDisabled]}>
                      +{chip} ✨
                    </Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={s.chip}
                  disabled={maxSendable < 1 || amount === maxSendable}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setAmount(maxSendable);
                  }}
                >
                  <Text
                    style={[
                      s.chipText,
                      (maxSendable < 1 || amount === maxSendable) && s.chipTextDisabled,
                    ]}
                  >
                    Max
                  </Text>
                </TouchableOpacity>
                <View style={s.stepper}>
                  <TouchableOpacity
                    onPress={() => adjustAmount(-1)}
                    onPressIn={() => startHold(-1)}
                    onPressOut={stopHold}
                    hitSlop={8}
                  >
                    <Ionicons name="remove-circle-outline" size={26} color={colors.textSecondary} />
                  </TouchableOpacity>
                  {/* Typeable — tap the number, punch in 100 directly. */}
                  <TextInput
                    style={s.stepperValue}
                    value={amount === 0 ? '' : String(amount)}
                    onChangeText={handleAmountText}
                    onEndEditing={() => setAmount((a) => clampAmount(a))}
                    keyboardType="number-pad"
                    maxLength={4}
                    selectTextOnFocus
                  />
                  <TouchableOpacity
                    onPress={() => adjustAmount(1)}
                    onPressIn={() => startHold(1)}
                    onPressOut={stopHold}
                    hitSlop={8}
                  >
                    <Ionicons name="add-circle-outline" size={26} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Message */}
              <TextInput
                style={s.messageInput}
                placeholder={'Add a message for ' + recipientUsername + '\u2026 (optional)'}
                placeholderTextColor={colors.textSecondary}
                value={message}
                onChangeText={setMessage}
                maxLength={giftMessageMaxLen}
                multiline
              />

              {/* Send */}
              <TouchableOpacity
                style={[s.cta, !canSend && s.ctaDisabled]}
                activeOpacity={0.8}
                disabled={!canSend}
                onPress={handleSend}
              >
                <Ionicons name="gift" size={16} color="#0B0B10" />
                <Text style={s.ctaText}>
                  {sending ? 'Sending…' : `Send ${amount} ✨ to ${recipientUsername}`}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  sheet: {
    width: '100%',
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: verticalScale(34),
    paddingTop: verticalScale(10),
    gap: verticalScale(14),
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
  },
  recipientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: { width: 44, height: 44, borderRadius: 22 },
  avatarFallback: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: colors.textPrimary, fontSize: fontScale(16), fontWeight: '700' },
  title: { color: colors.textPrimary, fontSize: fontScale(18), fontWeight: '800' },
  recipientName: { color: colors.textSecondary, fontSize: fontScale(14), fontWeight: '600' },
  balanceLine: { color: colors.textPrimary, fontSize: fontScale(15) },
  balanceStrong: { fontWeight: '800', color: '#A78BFA' },
  ruleLine: { color: colors.textSecondary, fontSize: fontScale(12), marginTop: -verticalScale(8) },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: verticalScale(8),
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipText: { color: colors.textPrimary, fontSize: fontScale(14), fontWeight: '700' },
  chipTextDisabled: { color: colors.border },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginLeft: 'auto',
  },
  stepperValue: {
    color: colors.textPrimary,
    fontSize: fontScale(17),
    fontWeight: '800',
    minWidth: 44,
    textAlign: 'center',
    // TextInput now (typeable amount) — kill the platform's default vertical
    // padding so it sits on the same baseline the Text did.
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  messageInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: verticalScale(10),
    color: colors.textPrimary,
    fontSize: fontScale(14),
    // Tall enough to read as "write something here", not a search bar
    // (Kevin 2026-07-06). Text anchors to the top like a compose box.
    minHeight: verticalScale(76),
    maxHeight: verticalScale(110),
    textAlignVertical: 'top',
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#A78BFA',
    borderRadius: 999,
    paddingVertical: verticalScale(13),
  },
  ctaDisabled: { opacity: 0.4 },
  ctaText: { color: '#0B0B10', fontSize: fontScale(15), fontWeight: '800' },
  upsell: { alignItems: 'center', gap: verticalScale(8), paddingVertical: verticalScale(8) },
  upsellEmoji: { fontSize: fontScale(40) },
  upsellTitle: { color: colors.textPrimary, fontSize: fontScale(16), fontWeight: '800' },
  upsellBody: {
    color: colors.textSecondary,
    fontSize: fontScale(13),
    textAlign: 'center',
    lineHeight: fontScale(19),
    marginBottom: verticalScale(6),
  },
});
