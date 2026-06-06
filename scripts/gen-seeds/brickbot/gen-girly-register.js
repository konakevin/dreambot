#!/usr/bin/env node
/**
 * BRICKBOT_GIRLY_REGISTER — pastel-cute LEGO line/heritage lock.
 * Audit 2026-06-05: 50 → 200.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/brickbot_girly_register.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} REGISTER entries for BrickBot's girly path — a register is a pastel-cute LEGO LINE / SUBGENRE / HERITAGE that defines look. Each entry: ONE CAPS prefix + em-dash + 25-40 word body.

━━━ THE BAR ━━━
Every entry names a pastel-cute heritage (LEGO Friends, Elves, DOTS, Disney Princess, Belville, Scala, etc.) and locks PALETTE + MINI-DOLL/MINIFIG kit + SCENE ANCHOR (one structural detail unique to the register). Sonnet must produce visibly distinct registers — not interchangeable "cute" beats.

━━━ VARIETY MANDATE (distribute across categories) ━━━
- ~5 LEGO PASTEL LINES: Friends-Heartlake, Elves-Elvendale, DOTS-craft, Disney-Princess, Belville, Scala, Trolls World
- ~4 FAIRY-TALE: Cinderella ballroom, Snow-White cottage, Sleeping-Beauty castle, Beauty-and-the-Beast library, Rapunzel tower
- ~4 PRINCESS-CASTLE: Pastel-castle court, candy-coronation, royal-tea-party, princess-stable
- ~3 MERMAID / OCEAN: mermaid-lagoon, undersea-palace, coral-castle, pearl-ballroom
- ~3 UNICORN / RAINBOW: unicorn-meadow, rainbow-stable, pegasus-court, star-pony
- ~3 BAKERY / CANDY: cupcake-bakery, ice-cream parlor, candy-shop, lollipop-store
- ~3 BOUTIQUE / FASHION: Parisian boutique, hat-shop, dress-shop, jewelry-shop
- ~3 BALLET / DANCE: ballerina-studio, recital-stage, swan-lake set, music-box stage
- ~3 SPA / SLUMBER: spa-day, slumber-party, manicure-salon, vanity-room
- ~2 GARDEN / TEA: tea-party-garden, rose-bower, fairy-meadow, butterfly-greenhouse
- ~2 BIRTHDAY-PARTY: pastel-birthday, confetti-celebration, balloon-room
- ~1 SCHOOL DAY: pastel academy
- ~1 WINTER-PRINCESS: pearl-ice palace
- ~1 SPRING-FESTIVAL: garden festival

━━━ FORMAT ━━━
Each entry: ONE line, all-caps prefix (2-6 hyphenated/spaced words), em-dash, 25-40 word body. Body must mention PALETTE + MINI-DOLL/MINIFIG kit + SCENE ANCHOR. Touchpoints:
"FRIENDS-HEARTLAKE SIGNATURE — pastel pink + lavender + mint + sand palette, LEGO Friends mini-doll cast in cute casual outfits, modern boutiques + cafes + a pet-grooming salon as scene anchor"
"ELVES-ELVENDALE SIGNATURE — teal + lavender + gold + rose palette, fairy + elf mini-dolls with translucent-wing pieces + flower-crowns, ornate treetop-city + crystal-orb gates as anchor"
"CUPCAKE BAKERY SIGNATURE — bubblegum-pink + cream + mint + butter-yellow palette, baker mini-dolls in striped aprons + chef hats, pastel-pink bakery with cupcake-tier displays + spinning-wheel oven"

━━━ BANS ━━━
- NO masculine vocab
- NO photoreal vocab
- NO licensed franchise IP verbatim
- NO duplicating registers
- NO grim / dark / harsh

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
