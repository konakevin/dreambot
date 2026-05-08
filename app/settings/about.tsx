/**
 * Settings → About DreamBot
 * Personal "behind the app" screen — Kevin's voice, motivation,
 * thanks to family + wife + soundtrack bands. Brand-correct warmth
 * without the mascot voice taking over.
 */

import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { ScreenLayout } from '@/components/ScreenLayout';
import { colors } from '@/constants/theme';

const MASCOT = require('@/assets/images/splash-icon.png');

export default function AboutScreen() {
  return (
    <ScreenLayout header="back" title="About DreamBot">
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.heroWrap}>
          <Image source={MASCOT} style={styles.mascot} contentFit="contain" />
          <Text style={styles.heroTitle}>About DreamBot</Text>
          <Text style={styles.heroSub}>a note from the human who built it</Text>
        </View>

        <View style={styles.body}>
          <Text style={styles.paragraph}>
            Hi, I&rsquo;m <Text style={styles.bold}>Kevin</Text> — the human behind DreamBot. (The
            robot up there is the cute one. I&rsquo;m the one who needs more sleep.)
          </Text>

          <Text style={styles.paragraph}>
            Honestly? I built DreamBot because every other AI tool felt like work. Master the
            prompts, tune the parameters, learn the syntax. I wanted something for the rest of us —
            approachable, a little whimsical, a little funny. The &ldquo;everyman&rdquo; AI app,
            with a tiny robot mascot and a sense of humor.
          </Text>

          <Text style={styles.paragraph}>
            But the real spark was this: what if the bots dreamed for{' '}
            <Text style={styles.bold}>you</Text> while you slept? You&rsquo;d wake up and
            there&rsquo;d be a personalized piece of art waiting, made just for you overnight. And
            what if the dream could even include you — your face and your favorite person&rsquo;s,
            both painted into a fantasy scene together? That&rsquo;s where it really clicked.
          </Text>

          <Text style={styles.paragraph}>
            So DreamBot ended up being three things at once: a feed of beautiful AI art from named
            bot personalities, an overnight surprise dreamed just for you, and a friendly create
            mode for when you want to drive. All wrapped around one idea — AI should feel like
            wonder, not work.
          </Text>

          <Text style={styles.paragraph}>
            I built DreamBot solo, over many months, mostly late at night, in a home office that
            quietly became a cave.
          </Text>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>With love and thanks</Text>

          <Text style={styles.paragraph}>
            To my wife, <Text style={styles.bold}>Stephanie</Text> — for letting me disappear into
            my cave for months while I chased this idea down a dozen rabbit holes. Your patience is
            the only reason this app exists. I love you, and I owe you a thousand date nights.
          </Text>

          <Text style={styles.paragraph}>
            To <Text style={styles.bold}>my family</Text> — thanks for believing in me, even from
            afar.
          </Text>

          <Text style={styles.paragraph}>
            To <Text style={styles.bold}>Hannah</Text> and <Text style={styles.bold}>Nick</Text> —
            thanks for testing, listening to me blab about this app for hours, and getting dragged
            into every new batch of renders.
          </Text>

          <Text style={styles.paragraph}>
            And to the bands whose albums became DreamBot&rsquo;s unofficial soundtrack — playing on
            repeat through every late-night coding session:
          </Text>

          <View style={styles.bandList}>
            <Text style={styles.band}>Stick Figure</Text>
            <Text style={styles.band}>The Elovaters</Text>
            <Text style={styles.band}>The Hip Abduction</Text>
            <Text style={styles.band}>The Movement</Text>
            <Text style={styles.band}>Cannons</Text>
            <Text style={styles.band}>John Mayer</Text>
          </View>

          <Text style={styles.paragraph}>
            If DreamBot has a vibe, you wrote half of it. Thank you.
          </Text>

          <View style={styles.divider} />

          <Text style={styles.signoff}>— Kevin</Text>
          <Text style={styles.signoffSmall}>sweet dreams, fresh daily 💫</Text>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: 80 },
  heroWrap: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
    gap: 8,
  },
  mascot: {
    width: 140,
    height: 140,
    marginBottom: 8,
  },
  heroTitle: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  heroSub: {
    color: colors.textSecondary,
    fontSize: 13,
    fontStyle: 'italic',
  },
  body: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  paragraph: {
    color: colors.textPrimary,
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 16,
  },
  bold: {
    fontWeight: '700',
    color: colors.accent,
  },
  divider: {
    height: 0.5,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 16,
  },
  bandList: {
    gap: 6,
    marginBottom: 16,
    paddingLeft: 8,
  },
  band: {
    color: colors.accent,
    fontSize: 15,
    fontWeight: '600',
  },
  signoff: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  signoffSmall: {
    color: colors.textSecondary,
    fontSize: 13,
    fontStyle: 'italic',
    marginTop: 4,
  },
});
