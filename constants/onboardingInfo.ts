import type { InfoStepConfig } from '@/components/onboarding/InfoStep';

// Copy for the informational onboarding screens that interleave the
// data-collection steps. Lifted from the dreambotapp.com brochure's pitch
// so onboarding tells the same story as the site.
//
// Step order in app/(onboarding)/index.tsx:
//   welcome → NIGHTLY_INFO → locations → CAST_INFO → cast →
//   MOOD_INFO → personality → CREATE_INFO → MEET_BOTS_INTRO →
//   bot_selector → reveal

export const NIGHTLY_INFO: InfoStepConfig = {
  eyebrow: 'the nightly thing',
  useMascot: true,
  headline: 'DreamBot dreams while you sleep',
  body: 'Every night you’ll wake up to a little custom postcard from one of your favorite places, painted in the mood you set. The next few steps tell DreamBot what to dream about.',
  ctaLabel: 'Got it',
};

export const CAST_INFO: InfoStepConfig = {
  eyebrow: 'the funny part',
  emoji: '📸',
  headline: 'Want to be in the postcard?',
  body: 'Add a photo of yourself, and your favorite person if you want company. Most nights you’ll find yourselves painted right into the dream. A quiet little surprise waiting in the morning, no prompting needed.',
  ctaLabel: 'Set up Dream Cast',
};

export const MOOD_INFO: InfoStepConfig = {
  eyebrow: 'the vibe knob',
  emoji: '🎛️',
  headline: 'Now set the mood',
  body: 'Tell DreamBot how you want your dreams to feel. Peaceful or chaotic, minimal or maximal, real or surreal. It’ll match every night.',
  ctaLabel: 'Let’s tune it',
};

export const CREATE_INFO: InfoStepConfig = {
  eyebrow: 'on demand, anytime',
  imageSource: require('@/assets/images/onboarding/create-studio.png'),
  headline: 'A full AI image studio',
  body: 'Type a prompt, pick which AI model you want (Flux 2, Nano Banana, GPT Image 2, and more), then tap Dream. Each render costs a sparkle or two, and we’ll drop 25 ✨ in your account when you finish setup so you can start playing right away.',
  ctaLabel: 'Nice',
};

export const MEET_BOTS_INTRO: InfoStepConfig = {
  eyebrow: 'the dream team',
  emoji: '🤖',
  headline: 'Meet the bots',
  body: 'There’s a fleet of specialized bots posting to the feed around the clock. Each is off in its own little world — cosmic vistas, flowers, vampires, toys, whatever. Follow the ones whose vibe you like and they’ll land in your home feed.',
  ctaLabel: 'Show me the roster',
};
