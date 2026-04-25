#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/coquettebot/seeds/cottagecore_scenes.json',
  total: 200,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} COTTAGECORE SCENE descriptions for CoquetteBot's cottagecore-scene path — places girls want to LIVE IN. Fairy doors, pink velvet bedrooms, ballet studios, Parisian cafés, rose bookshops. Setting is hero, no characters needed.

Each entry: 15-30 words. One specific cottagecore / princess / coquette setting.

━━━ CATEGORIES ━━━
- Pink velvet bedrooms (canopy bed, satin curtains, rose accent pillows)
- Fairy doors in moss-covered tree trunks (impossibly tiny, glowing inside)
- Ballet studios (pink-bar, mirror-walls, wooden floor, bouquets in corner)
- Parisian cafés (gold-trim, rose-gold chairs, pastel macaroons on display)
- Rose-bookshops (book-stacks, rose vines climbing shelves)
- Secret garden gates (rose-vine wrapped iron gate, pastel stone path)
- Victorian conservatories (glass dome, pink geraniums, wicker chairs)
- Pink marble bathrooms (claw-foot tub, rose-petal floating, candle-lit)
- Vanity rooms (pink-velvet chair, crystal perfume, strings of pearls)
- Afternoon tea sitting rooms (rose-patterned wallpaper, tea service on silver)
- Princess library (rose-carpet, stained-glass rosette window, cozy reading nook)
- Paris balcony (iron railing, roses spilling over, pastel Parisian view)
- Cherry-blossom tea houses (gauzy curtains, low tatami, rose china)
- Cottage kitchens (checkerboard floor, fresh roses in vase, copper pots)
- Ivy-covered cottages exterior (pink door, window-boxes of roses)
- Velvet parlor dressing rooms (wardrobe with tulle gowns visible)
- Garden greenhouses (pastel flowers, warm sun-filtered light, wicker furniture)
- Peach-painted artist studios (easel, wildflowers, natural window light)
- Ballerinas' backstage (vanity with mirrors, tulle tutus on rack, pearls)
- Apothecary shop interiors (dusty-pink labels, bouquets, rose-water bottles)
- Wedding-chapel cottage interiors (pale-peach, rose-garlanded archway)

━━━ RULES ━━━
- Interior or enclosed scene — the SPACE is hero
- Soft pink / pastel / dreamy
- No humans (settings only)
- Every detail precious / romantic / feminine

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
