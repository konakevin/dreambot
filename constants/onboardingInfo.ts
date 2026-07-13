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
  // \n forces a balanced two-line break — the natural wrap strands "sleep"
  // alone on line two.
  headline: 'DreamBot dreams\nwhile you sleep',
  body: 'Every night, DreamBot dreams for you. Your favorite places get woven in, and some nights it whisks you somewhere wonderfully unexpected.',
  // The "up next" transition lives in the footnote slot so it reads as its
  // own quiet line under the paragraph instead of bulking up the body.
  footnote: 'Up next: teach it what to dream about',
};

export const CAST_INFO: InfoStepConfig = {
  eyebrow: 'the fun part',
  customMascot: require('@/assets/images/onboarding/mascot-cast.png'),
  // \n forces a balanced break — the natural wrap strands "postcards?" alone.
  headline: 'Want to be in the\ndream postcards?',
  body: 'Most nights you’ll find yourself painted right into the dream. A quiet little surprise waiting in the morning, no prompting needed.',
  footnote: 'Up next: cast yourself and a favorite person in your dreams',
};

export const MOOD_INFO: InfoStepConfig = {
  eyebrow: 'the vibe knob',
  customMascot: require('@/assets/images/onboarding/mascot-mood.png'),
  headline: 'Now set the mood',
  body: 'Tell DreamBot how you want your dreams to feel. Peaceful or chaotic, minimal or maximal, real or surreal. It all shapes what DreamBot dreams up for you.',
  footnote: 'Up next: a few sliders to dial in your vibe',
};

// CreateIntroSheet (the one-time sheet on the Create tab) reads this
// config — its own footer copy is hard-coded ("Got it, let's create")
// since it's NOT an onboarding step, so no ctaLabel here either.
export const CREATE_INFO: InfoStepConfig = {
  eyebrow: 'how create works',
  headline: 'A full AI image studio',
  body: 'Enter your prompt, pick a style, and tap Dream. A few things to know:',
  // Filled icon variants (not -outline) — the outline glyphs carry so little
  // ink at 20px that the accent tint reads as disabled-gray.
  subFeatures: [
    {
      icon: 'sparkles',
      title: 'DreamBot mode',
      body: 'Mention yourself (“me”) or your +1 (“my partner”) and your Dream Cast is painted right into the dream. Add styles and vibes to shape the look.',
    },
    {
      icon: 'color-wand',
      title: 'DreamSmart',
      body: 'We curate the AI Model list to the ones tuned for your chosen style, so the look lands. Toggle it off any time to browse every model.',
    },
    {
      icon: 'flash',
      title: 'Direct mode',
      body: 'Sends your prompt straight to the model you pick. No personalization, style, or vibe.',
    },
    {
      icon: 'color-palette',
      title: 'Restyle a photo',
      body: 'Upload a photo, pick a look, and turn it into a work of art.',
    },
    {
      icon: 'people',
      title: 'Cast any photo',
      body: 'Upload a photo of anyone to cast them in a dream. These use the uploaded photo instead of your Dream Cast.',
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
