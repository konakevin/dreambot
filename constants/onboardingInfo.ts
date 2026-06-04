import type { InfoStepConfig } from '@/components/onboarding/InfoStep';

// Copy for the informational onboarding screens that interleave the
// data-collection steps. Lifted from the dreambotapp.com brochure's pitch
// so onboarding tells the same story as the site.
//
// Button labels are standardized — every step uses plain "Back" / "Next"
// (or "Skip" where the step is genuinely optional), so we DON'T override
// `ctaLabel` here. The InfoStep default is "Next".
//
// Step order in app/(onboarding)/index.tsx:
//   welcome → NIGHTLY_INFO → locations → CAST_INFO → cast →
//   MOOD_INFO → personality → MEET_BOTS_INTRO → bot_selector → reveal

export const NIGHTLY_INFO: InfoStepConfig = {
  eyebrow: 'the nightly thing',
  customMascot: require('@/assets/images/onboarding/mascot-nightly.png'),
  headline: 'DreamBot dreams while you sleep',
  body: 'Every night you’ll wake up to a little custom postcard from one of your favorite places, painted in the mood you set. The next few steps tell DreamBot what to dream about.',
};

export const CAST_INFO: InfoStepConfig = {
  eyebrow: 'the funny part',
  customMascot: require('@/assets/images/onboarding/mascot-cast.png'),
  headline: 'Want to be in the dream postcards?',
  body: 'Add a photo of yourself, and your favorite person if you want company. Most nights you’ll find yourselves painted right into the dream. A quiet little surprise waiting in the morning, no prompting needed.',
};

export const MOOD_INFO: InfoStepConfig = {
  eyebrow: 'the vibe knob',
  customMascot: require('@/assets/images/onboarding/mascot-mood.png'),
  headline: 'Now set the mood',
  body: 'Tell DreamBot how you want your dreams to feel. Peaceful or chaotic, minimal or maximal, real or surreal. It’ll match every night.',
};

// CreateIntroSheet (the one-time sheet on the Create tab) reads this
// config — its own footer copy is hard-coded ("Got it, let's create")
// since it's NOT an onboarding step, so no ctaLabel here either.
export const CREATE_INFO: InfoStepConfig = {
  eyebrow: 'on demand, anytime',
  imageSource: require('@/assets/images/onboarding/create-studio.png'),
  headline: 'A full AI image studio',
  body: 'Type a prompt, pick a model (Flux 2, Nano Banana, GPT Image 2, and more), tap Dream. Each render costs a sparkle or two, and we’ll drop 25 ✨ in your account when you finish setup. Four ways to use it:',
  subFeatures: [
    {
      emoji: '🌙',
      title: 'DreamBot mode',
      body: 'Adds your taste to any prompt. Face-swaps you in too, if you’ve set up Dream Cast.',
    },
    {
      emoji: '🎯',
      title: 'Direct mode',
      body: 'Sends your exact prompt straight to the AI model. No styling, no face swap.',
    },
    {
      emoji: '📸',
      title: 'Restyle a photo',
      body: 'Upload one and pick a medium. We’ll transform it.',
    },
    {
      emoji: '👤',
      title: 'Drop your face in',
      body: 'Upload any reference image and we’ll put you in it.',
    },
  ],
};

export const MEET_BOTS_INTRO: InfoStepConfig = {
  eyebrow: 'the dream team',
  customMascot: require('@/assets/images/onboarding/mascot-bots.png'),
  headline: 'Meet the bots',
  body: 'There’s a fleet of specialized bots posting to the feed around the clock. Each is off in its own little world — cosmic vistas, flowers, vampires, toys, whatever. Follow the ones whose vibe you like and they’ll land in your home feed.',
};
