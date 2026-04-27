#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/faebot/seeds/fairy_settings.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} FAIRY SETTING descriptions for FaeBot's fairy path. MINIATURE-SCALE environments — the fairy is 3-6 inches tall, so describe settings FROM HER PERSPECTIVE where flowers are trees and mushrooms are houses.

Each entry: 10-20 words. A specific miniature-scale fairy environment.

━━━ CATEGORIES TO COVER ━━━
- Underneath a toadstool cap, using it as a shelter from the rain
- On top of a sunflower head, looking out over the garden below
- Inside a hollow acorn shell lined with spider silk and moss
- Among foxglove bells, each flower a room she can enter
- On a lily pad floating on a still pond, dragonflies overhead
- Inside a bird's abandoned nest, repurposed as a fairy dwelling
- On a windowsill herb garden pot, between thyme and rosemary stalks
- Among dandelion seed heads, each parachute taller than she is
- On a mossy log, bracket fungi forming a staircase along the side
- Inside a glass jam jar left in the garden, refracted rainbow light
- Among dewdrop-covered spider webs at dawn, each drop a crystal ball
- On a wild strawberry patch, berries the size of her head

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: plant/object type + scale reference + indoor/outdoor.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
