/**
 * GradientTitle — the canonical screen-header title treatment: the DreamBot
 * brand gradient (moon purple → cloud pink → star teal) masked over the title
 * text at the shared nav size. Use this in every screen header so Create,
 * Inbox, Settings, Edit Profile, etc. all read identically.
 *
 * Matches ScreenLayout's `titleGradient` rendering (fontScale(17), weight 700),
 * so screens on ScreenLayout and screens with custom headers stay in sync.
 */

import { Text, StyleSheet, type StyleProp, type TextStyle } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/constants/theme';
import { fontScale } from '@/lib/responsive';

const BRAND_GRADIENT: [string, string, string] = ['#A78BFA', '#F9A8D4', '#5EEAD4'];

interface Props {
  children: string;
  /** Optional style override (e.g. a larger size for a specific surface). */
  style?: StyleProp<TextStyle>;
}

export function GradientTitle({ children, style }: Props) {
  return (
    <MaskedView
      maskElement={
        <Text style={[s.text, style, { color: '#FFFFFF' }]} numberOfLines={1}>
          {children}
        </Text>
      }
    >
      <LinearGradient colors={BRAND_GRADIENT} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <Text style={[s.text, style, { opacity: 0 }]} numberOfLines={1}>
          {children}
        </Text>
      </LinearGradient>
    </MaskedView>
  );
}

const s = StyleSheet.create({
  text: {
    color: colors.textPrimary,
    fontSize: fontScale(17),
    fontWeight: '700',
    textAlign: 'center',
  },
});
