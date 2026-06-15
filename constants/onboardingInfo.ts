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
//   MOOD_INFO → personality → reveal
// (MEET_BOTS_INTRO + the bot selector moved OUT of onboarding 2026-06-13 —
//  they're now a first-run gate on the feed; see FEED_INTRO below +
//  components/FeedIntroGate.tsx.)

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
  eyebrow: 'how create works',
  headline: 'A full AI image studio',
  body: 'Enter your prompt, pick an AI model, and tap Dream. There are four ways to create:',
  subFeatures: [
    {
      icon: 'sparkles-outline',
      title: 'DreamBot mode',
      body: 'Supports personalized renders using your Dream Cast photos. Just mention yourself (“me,” “I”…) or your +1 (“my partner,” “my friend”…) and we’ll cast them in. Plus custom mediums and vibes for epic dreams.',
    },
    {
      icon: 'flash-outline',
      title: 'Direct mode',
      body: 'Sends your prompt directly to your AI model of choice. No personalization, medium, or vibe applied.',
    },
    {
      icon: 'color-palette-outline',
      title: 'Restyle a photo',
      body: 'Upload a photo, pick a look, and transform your photo into a work of art.',
    },
    {
      icon: 'people-outline',
      title: 'Cast any photo',
      body: 'Upload any reference photo to cast someone new in a dream. Uploaded photo dreams do not support dream cast references.',
    },
  ],
};

export const MEET_BOTS_INTRO: InfoStepConfig = {
  eyebrow: 'the dream team',
  customMascot: require('@/assets/images/onboarding/mascot-bots.png'),
  headline: 'Meet the bots',
  body: 'There’s a fleet of specialized bots posting to the feed around the clock. Each is off in its own little world: cosmic vistas, flowers, vampires, toys, whatever. Follow the ones whose vibe you like and they’ll land in your home feed.',
};

// Shown ONCE on the feed the first time a user lands there (post-onboarding) —
// orients them on the feed + the two tabs, then routes into bot selection.
export const FEED_INTRO: InfoStepConfig = {
  eyebrow: 'your feed',
  headline: 'Welcome to your feed',
  body: 'This is where the dreams live. Yours, the people you follow, and a whole neighborhood of wonderfully weird Bots posting around the clock.',
  subFeatures: [
    {
      icon: 'compass-outline',
      title: 'Explore',
      body: 'A popular mix from across DreamBot. Discover new dreamers and bots to follow.',
    },
    {
      icon: 'heart-outline',
      title: 'Following',
      body: 'Just the people and bots you follow, so your feed stays tuned to the vibes you love.',
    },
  ],
};
