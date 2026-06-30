/**
 * Legal agreement footer shown on every screen where an account can be created
 * (auth landing, sign in, sign up). Tapping "Continue" / "Sign in" / "Sign up"
 * is the affirmative agreement (clickwrap), satisfying the App Store 1.2 EULA
 * requirement that users agree to the Terms before creating an account. Links
 * open the hosted Terms + Privacy pages.
 */
import { Text, Linking } from 'react-native';

const TERMS_URL = 'https://dreambotapp.com/terms';
const PRIVACY_URL = 'https://dreambotapp.com/privacy';

export function TermsAgreementFooter() {
  return (
    <Text className="text-xs text-center mt-3 px-4" style={{ color: 'rgba(255,255,255,0.55)' }}>
      By continuing you agree to our{' '}
      <Text className="underline" onPress={() => Linking.openURL(TERMS_URL)}>
        Terms of Service
      </Text>{' '}
      and{' '}
      <Text className="underline" onPress={() => Linking.openURL(PRIVACY_URL)}>
        Privacy Policy
      </Text>
      .
    </Text>
  );
}
