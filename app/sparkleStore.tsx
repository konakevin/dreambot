import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenLayout } from '@/components/ScreenLayout';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { type PurchasesPackage } from 'react-native-purchases';
import { colors } from '@/constants/theme';
import { Toast } from '@/components/Toast';
import {
  useSparkleBalance,
  useSparklePackages,
  usePurchaseSparkles,
  useRestorePurchases,
} from '@/hooks/useSparkles';
import { PACK_INFO } from '@/constants/sparklePacks';

const CARD_BORDER = colors.border;
const CARD_BG = colors.card;

function PackCard({
  pkg,
  onPurchase,
  purchasing,
}: {
  pkg: PurchasesPackage;
  onPurchase: (pkg: PurchasesPackage) => void;
  purchasing: boolean;
}) {
  const product = pkg.product;
  const info = PACK_INFO[product.identifier] ?? {
    sparkles: 0,
    icon: 'sparkles-outline',
    label: '',
  };
  const isBestValue = info.label === 'Best Value';
  const isPopular = info.label === 'Popular';

  return (
    <TouchableOpacity
      style={s.packCard}
      onPress={() => onPurchase(pkg)}
      activeOpacity={0.7}
      disabled={purchasing}
    >
      {(isBestValue || isPopular) && (
        <View style={[s.badge, { backgroundColor: isBestValue ? colors.accent : colors.warning }]}>
          <Text style={[s.badgeText, !isBestValue && { color: '#000' }]}>
            {isBestValue ? 'BEST VALUE' : 'POPULAR'}
          </Text>
        </View>
      )}

      <View style={s.iconCircle}>
        <Ionicons
          name={info.icon as keyof typeof Ionicons.glyphMap}
          size={26}
          color={colors.accent}
        />
      </View>

      <Text style={s.packSparkles}>{info.sparkles}</Text>
      <Text style={s.packLabel}>sparkles</Text>

      <View style={[s.priceButton, isBestValue && s.priceButtonFeatured]}>
        {purchasing ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text style={s.priceText}>{product.priceString}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function SparkleStoreScreen() {
  const { data: balance = 0 } = useSparkleBalance();
  const { data: packages = [], isLoading } = useSparklePackages();
  const { mutate: purchase, isPending: purchasing } = usePurchaseSparkles();
  const { mutate: restore, isPending: restoring } = useRestorePurchases();

  const sorted = [...packages].sort((a, b) => {
    const aInfo = PACK_INFO[a.product.identifier];
    const bInfo = PACK_INFO[b.product.identifier];
    return (aInfo?.sparkles ?? 0) - (bInfo?.sparkles ?? 0);
  });

  function handlePurchase(pkg: PurchasesPackage) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    purchase(pkg, {
      onSuccess: () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        const info = PACK_INFO[pkg.product.identifier];
        Toast.show(`${info?.sparkles ?? ''} sparkles added!`, 'sparkles');
      },
      onError: (err) => {
        if (err.message === 'cancelled') return;
        Toast.show('Purchase failed — try again', 'close-circle');
      },
    });
  }

  return (
    <ScreenLayout header="back" title="Get Sparkles">
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Balance hero */}
        <LinearGradient
          colors={['rgba(139,123,238,0.15)', 'rgba(139,123,238,0.03)', 'transparent']}
          style={s.balanceHero}
        >
          <View style={s.balanceGlow}>
            <Ionicons name="sparkles" size={40} color={colors.accent} />
          </View>
          <Text style={s.balanceAmount}>{balance}</Text>
          <Text style={s.balanceLabel}>sparkles available</Text>
        </LinearGradient>

        {/* Section header */}
        <Text style={s.sectionTitle}>Choose a Pack</Text>

        {isLoading ? (
          <ActivityIndicator size="large" color={colors.accent} style={{ marginTop: 40 }} />
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
                onPurchase={handlePurchase}
                purchasing={purchasing}
              />
            ))}
          </View>
        )}

        {/* Restore */}
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
          <Text style={s.restoreText}>{restoring ? 'Restoring...' : 'Restore Purchases'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenLayout>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: { color: colors.textPrimary, fontSize: 18, fontWeight: '700' },
  scroll: { paddingHorizontal: 16, paddingBottom: 60 },

  // Balance hero
  balanceHero: {
    alignItems: 'center',
    paddingVertical: 20,
    marginHorizontal: -16,
    marginBottom: 4,
  },
  balanceGlow: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(139,123,238,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  balanceAmount: {
    color: colors.textPrimary,
    fontSize: 44,
    fontWeight: '900',
    letterSpacing: -2,
  },
  balanceLabel: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },

  // Section
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
  },

  // Pack grid
  packGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 12,
    rowGap: 20,
    justifyContent: 'center',
  },
  packCard: {
    width: '46%',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingTop: 24,
    paddingBottom: 16,
    paddingHorizontal: 12,
  },
  badge: {
    position: 'absolute',
    top: -11,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(139,123,238,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  packSparkles: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -1,
  },
  packLabel: { color: colors.textSecondary, fontSize: 13, fontWeight: '600' },
  priceButton: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 4,
    minWidth: 90,
    alignItems: 'center',
  },
  priceButtonFeatured: {
    backgroundColor: colors.accentDark,
  },
  priceText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },

  // Empty
  emptyWrap: { alignItems: 'center', gap: 8, paddingVertical: 40 },
  emptyText: { color: colors.textPrimary, fontSize: 16, fontWeight: '700' },
  emptySub: { color: colors.textSecondary, fontSize: 14, textAlign: 'center' },

  // Restore
  restoreButton: { alignItems: 'center', paddingVertical: 28 },
  restoreText: { color: colors.textSecondary, fontSize: 14, fontWeight: '600' },
});
