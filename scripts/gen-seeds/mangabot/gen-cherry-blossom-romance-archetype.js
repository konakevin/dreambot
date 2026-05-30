#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/cherry_blossom_romance_archetype.json',
  total: 25, batch: 25, append: true,
  metaPrompt: (n) => `Write ${n} ROMANCE ARCHETYPE entries — characters in tender romantic moments. 5cm-per-second / Toradora / Your-Lie-In-April / Honey-Clover tradition.

Each 12-22 words. Role + romantic-coded tone + signature visual.

VARIETY:
- 18% SCHOOL-STUDENT (high-school confessor / shy first-year / graduating senior / class-rep)
- 14% CHILDHOOD-FRIEND (childhood-friend on visit / hometown-reunion / sibling-of-friend / next-door-neighbor)
- 12% YOUNG-PROFESSIONAL (office-worker on coffee-break / barista with secret-crush / new-hire shy / mentor-figure)
- 10% UNIVERSITY-STUDENT (college senior / library-studier / club-officer / mid-semester traveler)
- 10% MUSICIAN (pianist / violinist / cellist / guitarist with stage-fright / vocalist)
- 8% LETTER-WRITER (pen-pal correspondent / postcard-sender / love-letter writer)
- 8% PHOTOGRAPHER (camera-toting hobbyist / yearbook-photographer / film-camera enthusiast)
- 8% RAIN-MET STRANGER (umbrella-share / commute-met / coffee-shop-regular)
- 6% ARTIST (sketchbook-with-someone's-portrait / painter / book-illustrator)
- 6% LONG-DISTANCE (about-to-leave / about-to-return / waiting-at-station)

DO write:
- High-school first-year confessor with letter clutched, register: nervous-tender
- Childhood friend visiting hometown with sketchbook, register: nostalgic
- Young office-worker mid-coffee-break with secret-photo, register: pining
- College pianist mid-rehearsal at conservatory, register: dreamy-focused
- Pen-pal correspondent reading just-arrived letter, register: hopeful

DO NOT: cheesecake-coded / dramatic / multiple per entry.

Return ONLY JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
