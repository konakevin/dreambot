/**
 * Dialog typography — THE one place popup dialogs (alerts, confirm cards, bottom
 * sheets, full-screen gates) get their text styles, so they can't drift apart.
 *
 * Before this (audit 2026-09-19) three scales coexisted: the sheets + gates
 * (title 20/800, body 15/22, secondary 15/600), the compact modal cards (18,
 * 14/20, 14/600) and CustomAlert on its own (18, 15/21, a 700-weight cancel).
 * This module is the sheet scale, the app's readability-passed one, applied to
 * every dialog. Change a role here and every dialog follows.
 *
 * Roles:
 *   eyebrow          small purple all-caps label above a title (onboarding cadence)
 *   title            the dialog's headline
 *   body             the explanation under it
 *   button           label of a compact filled button (alert row buttons); the
 *                    full-width brand CTA stays `GradientButton` (Quicksand)
 *   buttonSecondary  label of the quiet cancel / "not now" action
 *   caption          small supporting text: checkbox labels, hints
 *
 * Compose spacing and one-off colour at the call site:
 *   <Text style={[dialogText.title, s.titleSpacing]}>
 *   <Text style={[dialogText.button, { color: '#0F0F14' }]}>
 * Never put fontSize / fontWeight / lineHeight for these roles back into a
 * dialog's own StyleSheet (locked by __tests__/lib/dialogTextGuard.test.ts).
 */
import { StyleSheet } from 'react-native';
import { colors } from '@/constants/theme';
import { fontScale } from '@/lib/responsive';

export const dialogText = StyleSheet.create({
  eyebrow: {
    color: colors.accentLight,
    fontSize: fontScale(12),
    fontWeight: '700',
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  title: {
    color: colors.textPrimary,
    fontSize: fontScale(20),
    fontWeight: '800',
    textAlign: 'center',
  },
  body: {
    color: colors.textSecondary,
    fontSize: fontScale(15),
    lineHeight: fontScale(22),
    textAlign: 'center',
  },
  button: {
    color: '#FFFFFF',
    fontSize: fontScale(15),
    fontWeight: '700',
  },
  buttonSecondary: {
    color: colors.textSecondary,
    fontSize: fontScale(15),
    fontWeight: '600',
  },
  caption: {
    color: colors.textSecondary,
    fontSize: fontScale(14),
    lineHeight: fontScale(20),
  },
});
