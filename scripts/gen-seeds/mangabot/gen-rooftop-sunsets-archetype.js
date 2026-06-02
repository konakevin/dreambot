#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/rooftop_sunsets_archetype.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} ROOFTOP-CHARACTER ARCHETYPE entries — who's ON the rooftop. Tokyo school / apartment / cafe-rooftop register.

Each 12-22 words. Role + reason-on-rooftop + tone.

VARIETY:
- 16% AFTER-SCHOOL-STUDENT (high-school senior with lunch / class-rep skipping practice / club-officer with notes)
- 14% LATE-SHIFT WORKER (programmer on break / nightclub-bouncer / restaurant-server out for smoke / hospital-nurse mid-shift)
- 12% ARTIST-WITH-VIEW (sketcher with notebook / photographer with tripod / painter with easel)
- 12% MUSICIAN-PRACTICE (guitarist mid-strum / pianist on apartment-piano / singer mid-song)
- 10% CHEF-COOK (apartment-chef on rooftop-grill / pizza-cook mid-toss / udon-cook mid-stir)
- 8% YOUNG-PROFESSIONAL (coffee-break worker / lunch-break OL / smoke-break engineer)
- 6% PHILOSOPHER (reader with novel / journal-writer / contemplator with notebook)
- 6% PARTY-HOST (rooftop-party host with drinks / barbecue cook / dinner-host)
- 6% PET-OWNER (cat-cuddler on rooftop / dog-walker / bird-watcher with binoculars)
- 4% ATHLETE (cyclist resting / climber post-route / runner stretching)
- 4% INVENTOR (kite-flyer / drone-pilot / model-rocket builder)

DO write:
- High-school senior with lunch-box on rooftop, register: thoughtful-tired
- Late-shift programmer on coffee-break, register: weary-content
- Photographer with tripod set up, register: focused-creative
- Apartment-chef on rooftop-grill mid-toss, register: confident-joyful
- Rooftop-party host with drinks-tray, register: relaxed-social

DO NOT: heroic/dramatic roles / multiple per entry.

Return ONLY JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
