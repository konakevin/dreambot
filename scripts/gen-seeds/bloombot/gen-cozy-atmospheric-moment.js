#!/usr/bin/env node
/**
 * BLOOMBOT_COZY_ATMOSPHERIC_MOMENT — small intimate domestic moments
 * inside a cozy flower-filled interior. Dust-motes in a sunbeam, tabby
 * cat on a cushion, tea steam, half-eaten shortbread, embroidery hoop
 * mid-stitch, rain-streaks on leaded glass. Tiny, still, observed.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/bloombot/seeds/bloombot_cozy_atmospheric_moment.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} ATMOSPHERIC MOMENT entries for BloomBot's cozy path — small intimate domestic vignettes inside a cozy flower-filled cottage / cabin / nook interior. Each entry is one descriptive line, 25-45 words, starting with a CAPS NAME, em-dash, then body. The moment is OBSERVED, STILL, INTIMATE — like a Vermeer or Ozu detail.

━━━ THE BAR ━━━
Every entry names a SPECIFIC tiny human-scale moment that adds emotional warmth and aliveness to a cozy interior. Dust-motes drifting in a sunbeam. A cat curled on a cushion. Tea-steam from a porcelain cup. A bite taken from a biscuit. A petal resting on a sill. A needle pushed through embroidery linen. Half-finished tasks, mid-action stillness, small living things, weathered domestic detail. Pinterest-cozy.

━━━ EXAMPLE PHRASINGS (mirror this register) ━━━
"DUST-MOTES IN A SUNBEAM — single amber sunbeam slanting across a side-table, individual dust-motes drifting upward in slow suspension, the only visible movement in the otherwise perfectly still room"
"TABBY CAT ON FADED CUSHION — small ginger tabby curled tight on a sun-warmed chair cushion, one paw draped over its nose, tail wrapped close, soft rise-and-fall of ribs implied"
"TEA STEAM FROM A FLORAL CUP — thin wisp of fragrant steam curling from a hand-painted porcelain cup, the tea dark amber, a single loose leaf circling slowly at the bottom"
"HALF-EATEN SHORTBREAD ON A SAUCER — one shortbread biscuit with a single bite taken, resting on a blue-ringed saucer beside an unfinished cup, powdered sugar still on the plate edge"
"COPPER KETTLE AT THE VERGE — copper kettle on a cast-iron trivet, first thin thread of steam escaping the spout, the body just beginning to tremble with the effort of whistling"

━━━ VARIETY MANDATE (distribute across these categories) ━━━
- ~3 LIGHT-IN-AIR (sunbeam through window, dust-mote dance, lamp-glow on wood, candle-glow on quilt, hearth-glow on rug)
- ~3 SMALL CREATURES (tabby cat curled, terrier asleep, songbird at window, bee on the sill, moth at the lamp, mouse-shadow under shelf)
- ~3 STEAM / VAPOR (kettle whistling, tea-cup steam, soup-bowl steam, breath-fog on cold pane, broth-pot steam)
- ~3 FOOD / BEVERAGE MID-USE (half-eaten biscuit, sliced apple core, jam-spoon balanced, broken loaf, dripping honey-stick, scraped jam-jar)
- ~3 NEEDLEWORK / CRAFT (embroidery mid-stitch, knitting needles in skein, half-mended sock, watercolor brush in jar, ink-pen on letter)
- ~3 SLEEPING / RESTING (open book over chest, slippers by hearth, knit blanket half-pulled, eyeglasses on a journal, folded shawl on chair-back)
- ~3 NATURE MEETING INTERIOR (single petal on sill, bee-buzz at window, leaf blown indoors, raindrops on pane, snow-glow at window, frost-leaf on the glass)
- ~3 RAIN / WEATHER OUTSIDE (rain-streaks on leaded glass, snow piling on sill, wind-rattle of shutter, distant thunder hum, fog at the pane)
- ~2 CLOCK / TIME (mantel clock chiming, candle wax pooling, pocket-watch open on linen, sundial-shadow on tile through window)
- ~3 FIRE / FLAME (single candle burning low, hearth-ember glow, oil-lamp wick crackle, kindling about to catch, log shifting in coals)
- ~3 SCENT (lavender bunch drying, herb-jar lid ajar, beeswax candle puddle, bread-crust on rack, fresh-cut bouquet, citrus peel curl)
- ~3 DROPLETS / WATER (condensation on a glass, single bead on a vase rim, watering-can drip on tile, wet umbrella by door)
- ~3 INK / PAPER (open journal mid-page, dried ink on a quill, folded letter on linen, pressed flower between pages, wax-seal cooling)

━━━ BANS ━━━
- NO people / no figures / no hands (this is an unpeopled vignette).
- NO photographer-name drops.
- NO modern electronics (no phones, no laptops, no LED).
- NO bare "cozy atmosphere" — name the SPECIFIC observed detail.
- NO action-verb chaos — the moment is STILL or barely-moving.

━━━ FORMAT ━━━
Each entry: 25-45 words. Format: "NAME CAPS — body text describing the specific tiny observed detail + small qualifier of light/sound/scent".

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
