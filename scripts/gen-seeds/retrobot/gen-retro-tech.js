#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/retrobot/seeds/retro_tech.json',
  total: 200,
  batch: 50, append: true,
  metaPrompt: (n) => `You are writing ${n} RETRO TECH scene descriptions for RetroBot — the technology that defined growing up, 1980-1995. No people visible. Pure scene/environment.

Each entry: 10-20 words. One specific retro tech scene or detail.

━━━ CATEGORIES ━━━
- CRT monitor (green-screen terminal, amber phosphor glow, scanlines visible)
- Dial-up modem (blinking lights, phone cord plugged in, AOL loading screen)
- Game console setup (NES, SNES, Sega Genesis, Atari — cartridge in slot, controllers)
- Desktop computer (beige tower, floppy disk drive, big CRT monitor, keyboard)
- Boombox (dual cassette deck, antenna extended, EQ bars, mixtape playing)
- Walkman (orange foam headphones, auto-reverse, belt clip)
- VCR (blinking 12:00, tape halfway in, rewind machine next to it)
- Cordless phone (long antenna, charge cradle, coiled cord on wall unit)
- Pager / beeper (on a nightstand, green display, belt holster)
- Floppy disk collection (3.5" colorful disks, labeled in marker, disk holder)
- Dot-matrix printer (tractor-feed paper, perforated edges, printing in progress)
- Answering machine (micro-cassette, blinking red light, "you have 3 messages")
- GeoCities webpage on screen (under construction GIF, guestbook, hit counter)
- CD-ROM game (jewel case open, disc on desk, game manual, install screen)
- Portable CD player (anti-skip, headphones, disc visible through window)
- Calculator watch / digital watch on desk
- Polaroid camera (photo developing, white border, shaking not required)

━━━ RULES ━━━
- PURE SCENE — no people, no hands, no silhouettes
- 1980-1995 era — technology when it was still new and exciting
- The magic of technology when you didn't take it for granted
- Gender-neutral — everyone used this tech

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
