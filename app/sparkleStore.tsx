import { useEffect, useState } from 'react';
// RN's ScrollView (NOT gesture-handler's) so it coexists with the swipe-back
// Pan via activeOffsetX/failOffsetY — the proven pattern used by every other
// screen. A gesture-handler ScrollView competes with the swipe-back Pan in the
// same RNGH gesture arena (janky scroll + blocked swipe-back). See subscribe.tsx.
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Linking,
  ScrollView,
} from 'react-native';
import { Text } from '@/components/AppText';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenLayout } from '@/components/ScreenLayout';
import { GradientTitle } from '@/components/GradientTitle';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useEngineConfig } from '@/hooks/useEngineConfig';
import { GiftFriendPicker, type GiftRecipient } from '@/components/GiftFriendPicker';
import { GiftSparklesSheet } from '@/components/GiftSparklesSheet';
import { type PurchasesPackage } from 'react-native-purchases';
import { colors } from '@/constants/theme';
import { Toast } from '@/components/Toast';
import {
  useSparkleBalance,
  useSparklePackages,
  usePurchaseSparkles,
  useRestorePurchases,
} from '@/hooks/useSparkles';
import { useSparklePacks } from '@/hooks/useSparklePacks';
import { trackSparkleStoreOpened, trackSparklePurchaseTapped } from '@/lib/analytics';
import { verticalScale, fontScale } from '@/lib/responsive';

// ONE purple for the whole screen — the app's accent token. Everything
// interactive/accented (icons, selected border, radio, CTA) uses it, so the
// design stays calm + matches the Plans screen. The brand rainbow gradient is
// reserved for a SINGLE moment: the title.
const ACCENT = colors.accent;

/** Flavor copy per sparkle pack — appears under the grid when selected.
 *  Uses the actual sparkle count so the copy never gets out of sync with
 *  the pack lineup. premium-render math uses /3 (3 sparkles per premium
 *  model render — Flux 2 Max / GPT Image 1 / Nano Banana Pro). */
function getPackCopy(sparkles: number): string {
  const premium = Math.floor(sparkles / 3);
  if (sparkles <= 20) {
    return `A quick top-up. ${sparkles} standard renders or ${premium} premium.`;
  }
  if (sparkles <= 50) {
    return `Casual use: ${sparkles} standard renders or ${premium} premium. A couple weeks of dreaming.`;
  }
  if (sparkles <= 100) {
    return `Most popular. About a month of regular renders. ${sparkles} standard or ${premium} premium.`;
  }
  if (sparkles <= 250) {
    return `Best value: months of renders with room for premium models. ${sparkles} standard or ${premium} premium.`;
  }
  return `Power user: half a year of renders, plenty for premium models. ${sparkles} standard or ${premium} premium.`;
}

function PackCard({
  pkg,
  isSelected,
  onSelect,
}: {
  pkg: PurchasesPackage;
  isSelected: boolean;
  onSelect: (pkg: PurchasesPackage) => void;
}) {
  const product = pkg.product;
  const packInfo = useSparklePacks();
  const info = packInfo[product.identifier] ?? {
    sparkles: 0,
    icon: 'sparkles-outline',
    label: '',
  };
  const isBestValue = info.label === 'Best Value';
  const isPopular = info.label === 'Popular';

  return (
    <TouchableOpacity
      style={[s.packCard, isSelected && s.packCardSelected]}
      onPress={() => onSelect(pkg)}
      activeOpacity={0.85}
    >
      {/* Left: icon chip */}
      <View style={s.packIcon}>
        <Ionicons
          name={info.icon as keyof typeof Ionicons.glyphMap}
          size={fontScale(20)}
          color={ACCENT}
        />
      </View>

      {/* Middle: sparkles count + price */}
      <View style={{ flex: 1 }}>
        <View style={s.packTitleRow}>
          <Text style={s.packSparkles}>{info.sparkles}</Text>
          <Text style={s.packSparklesLabel}> sparkles</Text>
          {/* BEST VALUE → solid accent pill (matches the Plans "Best value"
              badge). POPULAR → little golden sticker (matches the "Save 33%"
              sticker on the Plans toggle). */}
          {isBestValue && (
            <View style={s.bestValueBadge}>
              <Text style={s.bestValueText}>BEST VALUE</Text>
            </View>
          )}
          {isPopular && (
            <LinearGradient
              colors={['#FFE08A', '#F2A93B']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={s.popularBadge}
            >
              <Text style={s.popularText}>POPULAR</Text>
            </LinearGradient>
          )}
        </View>
        <Text style={s.packPrice}>{product.priceString}</Text>
      </View>

      {/* Right: radio dot */}
      <View style={[s.packRadio, isSelected && s.packRadioSelected]}>
        {isSelected && <View style={s.packRadioInner} />}
      </View>
    </TouchableOpacity>
  );
}

// Toggle to `true` to render the hardcoded MOCK_PACKAGES below instead of
// fetching from RevenueCat. Useful for App Store Connect review
// screenshots when StoreKit / RC sync hasn't completed yet (e.g., right
// after creating new IAP products on the Apple side). Must be `false`
// for production — mock packages can't actually be purchased through
// StoreKit (they'll error out at purchase time).
const USE_MOCK_PACKS_FOR_SCREENSHOT = false;

const MOCK_PACKAGES: PurchasesPackage[] = [
  {
    identifier: 'pack_15',
    product: { identifier: 'com.konakevin.radorbad.sparkles.15_v2', priceString: '$1.99' },
  },
  {
    identifier: 'pack_40',
    product: { identifier: 'com.konakevin.radorbad.sparkles.40_v2', priceString: '$4.99' },
  },
  {
    identifier: 'pack_90',
    product: { identifier: 'com.konakevin.radorbad.sparkles.90_v2', priceString: '$9.99' },
  },
  {
    identifier: 'pack_200',
    product: { identifier: 'com.konakevin.radorbad.sparkles.200_v2', priceString: '$19.99' },
  },
  {
    identifier: 'pack_500',
    product: { identifier: 'com.konakevin.radorbad.sparkles.500_v2', priceString: '$49.99' },
  },
  // Accepted boundary: a minimal offline FALLBACK shaped to RevenueCat's
  // PurchasesPackage[] (the SDK type carries many runtime-only fields we don't
  // populate in a static fallback). Replaced by the live SDK offerings at runtime.
] as unknown as PurchasesPackage[];

export default function SparkleStoreScreen() {
  const { data: balance = 0 } = useSparkleBalance();
  const packInfo = useSparklePacks();
  const { data: livePackages = [], isLoading: liveIsLoading } = useSparklePackages();
  const { mutate: purchase, isPending: purchasing } = usePurchaseSparkles();
  useEffect(() => {
    trackSparkleStoreOpened();
  }, []);
  const { mutate: restore, isPending: restoring } = useRestorePurchases();

  // Gift Sparkles (migration 334). `?giftFor=<userId>` is the bounce-back
  // path from GiftSparklesSheet's zero-giftable upsell: after landing here
  // (and ideally buying), the gift sheet reopens for that recipient.
  const { giftingEnabled } = useEngineConfig();
  const { giftFor } = useLocalSearchParams<{ giftFor?: string }>();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [giftSheetOpen, setGiftSheetOpen] = useState(false);
  const [giftRecipient, setGiftRecipient] = useState<GiftRecipient | null>(null);
  useEffect(() => {
    if (typeof giftFor !== 'string' || !giftFor) return;
    supabase
      .from('users')
      .select('id, username, avatar_url')
      .eq('id', giftFor)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setGiftRecipient({
            id: data.id,
            username: data.username ?? 'dreamer',
            avatarUrl: data.avatar_url,
          });
        }
      });
  }, [giftFor]);

  // Screenshot mode bypasses the live RC data so the new lineup renders
  // even before App Store Connect + RC have synced the new products.
  const packages = USE_MOCK_PACKS_FOR_SCREENSHOT ? MOCK_PACKAGES : livePackages;
  const isLoading = USE_MOCK_PACKS_FOR_SCREENSHOT ? false : liveIsLoading;

  const sorted = [...packages].sort((a, b) => {
    const aInfo = packInfo[a.product.identifier];
    const bInfo = packInfo[b.product.identifier];
    return (aInfo?.sparkles ?? 0) - (bInfo?.sparkles ?? 0);
  });

  // Default selection = "Best Value" pack (or middle pack as fallback).
  const [selectedPkgId, setSelectedPkgId] = useState<string | null>(null);
  useEffect(() => {
    if (selectedPkgId || sorted.length === 0) return;
    const bestValue = sorted.find((p) => packInfo[p.product.identifier]?.label === 'Best Value');
    setSelectedPkgId((bestValue ?? sorted[Math.floor(sorted.length / 2)]).identifier);
  }, [sorted, selectedPkgId, packInfo]);

  const selectedPkg = sorted.find((p) => p.identifier === selectedPkgId) ?? null;
  const selectedInfo = selectedPkg ? packInfo[selectedPkg.product.identifier] : null;

  function handleSelect(pkg: PurchasesPackage) {
    Haptics.selectionAsync();
    setSelectedPkgId(pkg.identifier);
  }

  function handlePurchase() {
    if (!selectedPkg) return;
    trackSparklePurchaseTapped({ pack: selectedPkg.product.identifier });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    purchase(selectedPkg, {
      onSuccess: () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        const info = packInfo[selectedPkg.product.identifier];
        Toast.show(`${info?.sparkles ?? ''} sparkles added!`, 'sparkles');
        // ?giftFor= bounce-back: they came here from the gift sheet's
        // zero-giftable upsell — reopen the gift for that recipient now
        // that they have giftable sparkles.
        if (giftRecipient) setGiftSheetOpen(true);
      },
      onError: (err) => {
        if (err.message === 'cancelled') return;
        Toast.show('Purchase failed. Try again.', 'close-circle');
      },
    });
  }

  return (
    <ScreenLayout
      header="back"
      title="Sparkles"
      centerTitle
      rightAction={
        <View style={s.balancePill}>
          <Ionicons name="sparkles" size={fontScale(13)} color={ACCENT} />
          <Text style={s.balancePillAmount}>{balance.toLocaleString()}</Text>
        </View>
      }
    >
      <View style={{ flex: 1 }}>
        {/* Gifting context (migration 334) — PINNED above the scroll area so
            the "who am I buying for" context can never scroll away. Copy makes
            the two-step explicit: pack lands in YOUR balance, then you choose
            how many to send. */}
        {giftingEnabled && giftRecipient && !giftSheetOpen && (
          <View style={s.giftContextBanner}>
            {/* Banner body reopens the gift sheet (a dismissed sheet was
                otherwise unreachable without re-picking — Kevin 2026-07-06);
                the X exits gifting mode entirely. */}
            <TouchableOpacity
              style={s.giftContextBody}
              activeOpacity={0.7}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setGiftSheetOpen(true);
              }}
            >
              <Ionicons name="gift" size={16} color={ACCENT} />
              <Text style={s.giftContextText}>
                Gifting to <Text style={s.giftContextName}>{giftRecipient.username}</Text>. Buy a
                pack, then choose how many sparkles to send them.
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setGiftRecipient(null)} hitSlop={10}>
              <Ionicons name="close" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        )}
        <ScrollView
          style={s.scrollView}
          contentContainerStyle={s.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero — gradient wordmark title (brand display font + gradient via
              the shared GradientTitle primitive). The balance lives in the
              header's rightAction slot, opposite the back button. */}
          <View style={s.hero}>
            <GradientTitle size={22} weight={700}>
              Choose a pack
            </GradientTitle>
          </View>

          {/* Gift entry (migration 334) — a compact pill ABOVE the fold,
              between the title and the grid. The original placement (a card
              below the pack grid) sat hidden under the sticky purchase footer
              (Kevin 2026-07-06). Hidden while a gifting context is active —
              the banner below takes over. */}
          {giftingEnabled && !giftRecipient && (
            <TouchableOpacity
              style={s.giftPill}
              activeOpacity={0.8}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setPickerOpen(true);
              }}
            >
              <Ionicons name="gift" size={16} color={ACCENT} />
              <Text style={s.giftPillText}>Gifting for a friend?</Text>
              <Ionicons name="chevron-forward" size={14} color={colors.textSecondary} />
            </TouchableOpacity>
          )}

          {isLoading ? (
            <ActivityIndicator
              size="large"
              color={colors.accent}
              style={{ marginTop: verticalScale(40) }}
            />
          ) : sorted.length === 0 ? (
            <View style={s.emptyWrap}>
              <Ionicons name="bag-outline" size={48} color={colors.textSecondary} />
              <Text style={s.emptyText}>Store not available yet</Text>
              <Text style={s.emptySub}>Packs will appear here once the store is configured</Text>
            </View>
          ) : (
            <View style={s.packGrid}>
              {sorted.map((pkg) => (
                <PackCard
                  key={pkg.identifier}
                  pkg={pkg}
                  isSelected={pkg.identifier === selectedPkgId}
                  onSelect={handleSelect}
                />
              ))}
            </View>
          )}

          {/* Restore + legal live IN the scroll (not the pinned footer): they
              must exist on the screen, not stay pinned — and the slim footer
              gives the pack list back ~90pt so it fits without scrolling on
              regular phones and scrolls comfortably on small ones
              (Kevin 2026-07-06: 550 pack hid under the tall footer). */}
          <TouchableOpacity
            style={s.restoreButton}
            onPress={() =>
              restore(undefined, {
                onSuccess: () => Toast.show('Purchases restored', 'checkmark-circle'),
                onError: () => Toast.show('Restore failed', 'close-circle'),
              })
            }
            activeOpacity={0.7}
            disabled={restoring}
          >
            <Text style={s.restoreText}>{restoring ? 'Restoring…' : 'Restore purchases'}</Text>
          </TouchableOpacity>
          <View style={s.legalLinks}>
            <Text
              style={s.legalLink}
              onPress={() => Linking.openURL('https://dreambotapp.com/privacy')}
            >
              Privacy Policy
            </Text>
            <Text style={s.legalDot}> · </Text>
            <Text
              style={s.legalLink}
              onPress={() => Linking.openURL('https://dreambotapp.com/terms')}
            >
              Terms of Use (EULA)
            </Text>
          </View>
        </ScrollView>

        {/* Pinned bottom — SLIM: pack copy + Buy only. Restore + legal moved
            into the scroll content (2026-07-06) so the pack list gets ~90pt
            back and never hides under the footer. */}
        {sorted.length > 0 && (
          <View style={s.stickyFooter}>
            {selectedInfo && <Text style={s.packDetail}>{getPackCopy(selectedInfo.sparkles)}</Text>}
            <TouchableOpacity
              onPress={handlePurchase}
              disabled={!selectedPkg || purchasing}
              activeOpacity={0.85}
            >
              <View style={[s.cta, (!selectedPkg || purchasing) && s.ctaDim]}>
                {purchasing ? (
                  <View style={s.ctaConnecting}>
                    <ActivityIndicator color="#FFFFFF" />
                    <Text style={s.ctaText}>Connecting to App Store…</Text>
                  </View>
                ) : (
                  <Text style={s.ctaText}>
                    {selectedPkg
                      ? `Buy ${selectedInfo?.sparkles ?? ''} sparkles (${selectedPkg.product.priceString})`
                      : 'Select a pack'}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Gift flow (migration 334): picker → gift sheet. */}
      {pickerOpen && (
        <GiftFriendPicker
          onClose={() => setPickerOpen(false)}
          onSelect={(recipient) => {
            setGiftRecipient(recipient);
            setPickerOpen(false);
            setGiftSheetOpen(true);
          }}
        />
      )}
      {giftSheetOpen && giftRecipient && (
        <GiftSparklesSheet
          recipientId={giftRecipient.id}
          recipientUsername={giftRecipient.username}
          recipientAvatarUrl={giftRecipient.avatarUrl}
          onClose={() => setGiftSheetOpen(false)}
        />
      )}
    </ScreenLayout>
  );
}

const s = StyleSheet.create({
  scrollView: { flex: 1 },
  scroll: {
    paddingHorizontal: verticalScale(20),
    // Generous tail so the last pack card fully clears the purchase footer
    // when scrolled to the bottom (was 12 — the 550 pack read as truncated).
    paddingBottom: verticalScale(28),
  },

  // Hero — gradient title + balance pill (mirrors the Plans paywall hero).
  hero: {
    alignItems: 'center',
    marginTop: verticalScale(4),
    marginBottom: verticalScale(12),
  },
  // Balance — a compact surface pill in the header's rightAction slot,
  // opposite the back button (the sparkle icon doubles as the "available" cue).
  balancePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: verticalScale(4),
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: ACCENT + '33',
    borderRadius: verticalScale(14),
    paddingHorizontal: verticalScale(10),
    paddingVertical: verticalScale(5),
  },
  balancePillAmount: {
    color: colors.textPrimary,
    fontSize: fontScale(13),
    fontWeight: '800',
    letterSpacing: -0.2,
  },

  // Pack list — vertical stack of compact pack cards. Each card is a single
  // row: icon chip + sparkle count + price + radio (matches the Plans cards).
  // Gifting-context banner — arrival-from-gift-flow indicator above the grid.
  giftContextBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: verticalScale(20),
    marginBottom: verticalScale(6),
    paddingHorizontal: 12,
    paddingVertical: verticalScale(10),
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(167,139,250,0.45)',
    backgroundColor: 'rgba(167,139,250,0.10)',
  },
  giftContextBody: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  giftContextText: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: fontScale(12.5),
    lineHeight: fontScale(17),
  },
  giftContextName: { fontWeight: '800', color: '#A78BFA' },
  // Gift entry pill (migration 334) — compact, above the fold under the
  // title; the old below-grid card hid under the sticky purchase footer.
  giftPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 8,
    marginBottom: verticalScale(14),
    paddingHorizontal: 14,
    paddingVertical: verticalScale(8),
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  giftPillText: { color: colors.textPrimary, fontSize: fontScale(13), fontWeight: '700' },
  packGrid: {
    gap: verticalScale(12),
  },
  packCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: verticalScale(14),
    backgroundColor: colors.surface,
    borderRadius: verticalScale(18),
    borderWidth: 1,
    borderColor: ACCENT + '22',
    paddingVertical: verticalScale(16),
    paddingHorizontal: verticalScale(16),
  },
  packCardSelected: {
    borderColor: ACCENT,
    backgroundColor: 'rgba(167,139,250,0.08)',
  },
  packIcon: {
    width: verticalScale(40),
    height: verticalScale(40),
    borderRadius: verticalScale(10),
    backgroundColor: ACCENT + '22',
    alignItems: 'center',
    justifyContent: 'center',
  },
  packTitleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
  },
  packSparkles: {
    color: colors.textPrimary,
    fontSize: fontScale(20),
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  packSparklesLabel: {
    color: colors.textPrimary,
    fontSize: fontScale(14),
    fontWeight: '600',
  },
  // BEST VALUE — solid accent pill, dark text (matches the Plans "Best value").
  bestValueBadge: {
    marginLeft: verticalScale(8),
    backgroundColor: ACCENT,
    borderRadius: verticalScale(7),
    paddingHorizontal: verticalScale(8),
    paddingVertical: verticalScale(3),
  },
  bestValueText: {
    color: '#1A1A24',
    fontSize: fontScale(9),
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  // POPULAR — little golden sticker (gold gradient + darker gold rim + dark
  // gold text), the same sticker treatment as the Plans "Save 33%" badge.
  popularBadge: {
    marginLeft: verticalScale(8),
    borderRadius: verticalScale(7),
    paddingHorizontal: verticalScale(8),
    paddingVertical: verticalScale(3),
    borderWidth: 1,
    borderColor: '#C98A1E',
  },
  popularText: {
    color: '#5A3A00',
    fontSize: fontScale(9),
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  packPrice: {
    color: colors.textMuted,
    fontSize: fontScale(13),
    fontWeight: '600',
    marginTop: verticalScale(2),
  },
  // Right-edge selection radio
  packRadio: {
    width: verticalScale(22),
    height: verticalScale(22),
    borderRadius: verticalScale(11),
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  packRadioSelected: {
    borderColor: ACCENT,
  },
  packRadioInner: {
    width: verticalScale(10),
    height: verticalScale(10),
    borderRadius: verticalScale(5),
    backgroundColor: ACCENT,
  },

  // Pinned footer — selection copy + primary CTA, always visible above the
  // fold. paddingBottom clears the home indicator on notched phones.
  stickyFooter: {
    paddingHorizontal: verticalScale(20),
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(24),
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  packDetail: {
    color: colors.textMuted,
    fontSize: fontScale(13),
    lineHeight: fontScale(18),
    textAlign: 'center',
    marginTop: verticalScale(6),
    marginBottom: verticalScale(14),
    paddingHorizontal: verticalScale(12),
  },

  // Primary CTA — same shape as the Plans paywall CTA.
  cta: {
    backgroundColor: ACCENT,
    borderRadius: verticalScale(12),
    paddingVertical: verticalScale(14),
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaDim: {
    opacity: 0.4,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: fontScale(15),
    fontWeight: '800',
  },
  ctaConnecting: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: verticalScale(12),
  },

  // Empty
  emptyWrap: { alignItems: 'center', gap: 8, paddingVertical: verticalScale(40) },
  emptyText: { color: colors.textPrimary, fontSize: fontScale(16), fontWeight: '700' },
  emptySub: { color: colors.textSecondary, fontSize: fontScale(14), textAlign: 'center' },

  // Divider between the purchase area and the sticky footer content (Restore +
  // legal) so the Buy button is never sandwiched. Full-width (negates the
  // footer's horizontal padding).
  footerDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginTop: verticalScale(14),
    marginBottom: verticalScale(10),
    marginHorizontal: -verticalScale(20),
  },
  // Restore + legal links — grouped secondary footer content (mirrors Plans).
  restoreButton: {
    alignItems: 'center',
    paddingVertical: verticalScale(4),
  },
  restoreText: {
    color: colors.textMuted,
    fontSize: fontScale(14),
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  legalLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(8),
  },
  legalLink: {
    fontSize: fontScale(12),
    color: colors.accent,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  legalDot: {
    fontSize: fontScale(12),
    color: colors.textMuted,
  },
});
