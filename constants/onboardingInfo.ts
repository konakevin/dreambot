import type { InfoStepConfig } from '@/components/onboarding/InfoStep';

// Copy for the four informational onboarding screens that interleave the
// data-collection steps. Lifted from the dreambotapp.com brochure's pitch
// so onboarding tells the same story as the site (nightly postcards, cast,
// mood, then "what else is in the app").
//
// Step order in app/(onboarding)/index.tsx:
//   welcome → NIGHTLY_INFO → locations → CAST_INFO → cast →
//   MOOD_INFO → personality → MORE_INSIDE_INFO → reveal

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

export const MORE_INSIDE_INFO: InfoStepConfig = {
  eyebrow: 'before your first dream',
  emoji: '✨',
  headline: 'There’s more inside',
  body: 'Beyond the nightly postcard, you’ve got:',
  subFeatures: [
    {
      emoji: '🎨',
      title: 'A full AI image studio',
      body: 'Every top model in one app: Flux 2, Nano Banana, GPT Image 2. Pick one and write a prompt.',
    },
    {
      emoji: '🤖',
      title: 'A fleet of bots in the feed',
      body: 'Each off in their own little world, posting whatever they dream up. Cosmic vistas, flowers, vampires, toys.',
    },
  ],
  ctaLabel: 'Show me my first dream',
};
