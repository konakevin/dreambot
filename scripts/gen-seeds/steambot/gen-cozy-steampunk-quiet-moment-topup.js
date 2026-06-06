#!/usr/bin/env node
/**
 * SteamBot COZY_STEAMPUNK_QUIET_MOMENT top-up (Stage 2 backfill 2026-06-05).
 *
 * Used by cozy-steampunk path — small in-room intimate-still-life moments
 * the camera quietly observes (no character active in frame). Existing 50
 * entries cycle: tea cooling, sleeping cat, books face-down, unfinished
 * letters, gloves on dressers, half-empty glasses, dog on hearthrug.
 *
 * REGISTER: Edwardian-Victorian gentle-domestic still-life. Single object
 * caught mid-pause. 16-26 words. Specific tactile detail. No characters
 * visible — implicit human just-left or just-resting.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/steambot/seeds/cozy_steampunk_quiet_moment.json',
  total: 200,
  batch: 25,
  maxTokens: 16000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} new QUIET-MOMENT still-life entries for SteamBot's cozy-steampunk path. Each entry is a small in-room intimate object/scene caught mid-pause — the camera quietly observes a paused domestic moment in an Edwardian-Victorian steampunk parlour, study, or bedchamber. NO active character in frame; the human is implied (just-stepped-away, asleep nearby, mid-thought).

Each entry: 16-26 words. ONE specific paused-still-life element. Soft tactile detail. Single sentence.

━━━ EXAMPLE PHRASINGS (mirror register exactly) ━━━

"Open book face-down on the rumpled bed, leather binding creased with use, reader paused mid-chapter and stepped briefly away"
"Teacup cooling on its saucer at the bedside, brass pot still warm, air carrying a faint bergamot sweetness"
"Sleeping tortoiseshell cat curled tightly on the velvet armchair, brass collar-bell catching lamplight, small paws tucked beneath her chin"
"Pipe smoldering in the brass ashtray on the side-table, single ribbon of smoke rising in an unhurried curl"
"Unfinished letter spread open on the writing desk, ink still wet at the last line, pen laid carefully aside"
"Small brown dog sleeping on the hearthrug, chin flat on his paws, ears soft, dream twitching his velvet muzzle"

━━━ VARIETY MANDATE (distribute across ${n} new entries) ━━━

WRITING / CORRESPONDENCE (~10%):
- Letters / journals / ledgers / sealed envelopes / blotters / inkwells / quill rests / wax-seal stamps
- Half-written notes, opened correspondence, weighted papers, pressed-flower bookmarks

BOOKS / READING (~10%):
- Books face-down / spine-up / on a chair / stacked / open mid-paragraph
- Reading lenses, bookmarks (silk ribbon / pressed leaf / playing card / brass clip), reading lamps

TEA / DRINK SET (~10%):
- Teacups / saucers / teapots / bone china / sugar tongs / strainers / steeping tea
- Brandy / port / sherry / coffee / cocoa — decanters, glasses with rim-marks, cooling cups

SMOKING / SCENTS (~6%):
- Pipes (clay / briar / meerschaum) / tobacco pouches / matchsafes / cigar cases / ashtrays with intact ash curls

PETS (~10%):
- Sleeping cats (tortoiseshell / black / tabby / ginger), dogs (terrier / spaniel / mastiff / brown / black)
- Caged or perched birds (parrots / canaries / songbirds / messenger pigeons mid-rest)
- Curled foxes / domesticated otters / clockwork-companion at rest

CLOTHING / ACCESSORIES (~10%):
- Gloves on dressers / hats on hooks / boots beside the bed / cravats untied / a discarded waistcoat
- Brooches / cufflinks / pocket-watches / brass-and-enamel hatpins / monocle on a ribbon

MUSIC / ART (~8%):
- Sheet music / piano with raised lid / violin in its case / cello propped / open music-box mid-melody
- Easels with wet brushstrokes / palette / drying pastels / unfinished still-life painted

SEWING / NEEDLEWORK / HOBBY (~6%):
- Embroidery hoops / knitting needles in a sock / spinning wheel paused mid-yarn / mending baskets
- Jewelry-making trays / model-clockwork half-built / botanical-press in mid-operation

CLOCKWORK / SMALL MACHINERY AT REST (~10%):
- Pocket-watches face-up on a side-table / pendulum clock between ticks / wind-up music-box mid-melody
- Brass orrery slowly rotating / barometer needle stilled / table-top steam-toy cooling
- Small clockwork pet (brass-cat / brass-bird / clockwork-mouse) at rest, gears barely turning

DOMESTIC / DECORATIVE (~10%):
- Vases with cut flowers (roses / camellias / lavender / mums) / fruit bowl with one bitten apple
- Mirrors / hand-mirrors / brushes laid on vanities / perfume bottles uncorked / lacquered combs

FOOD / KITCHEN (~6%):
- Half-eaten cake on a plate, brass fork resting / honey jar with a wooden dipper / bread on a board
- Apple core on a porcelain plate / cinnamon roll on a saucer / cookies on a tin tray
- Marmalade jar open with butter knife / brass biscuit-tin half-uncovered

SCIENCE / INSTRUMENT (~8%):
- Microscope on a desk, slide ready / telescope at a window, dust on the lens / brass sextant in its case
- Specimen jars / dried botanical pressings / mineral samples / labeled bottle racks

OUTDOOR-INDOOR / WINDOW DETAILS (~6%):
- Curtains parted with a sliver of rain-streaked glass visible / window-seat cushion still warm
- Garden gloves on the sill / pot of herbs on the ledge / opened umbrella drying upside-down

━━━ FORMAT RULES ━━━

- 16-26 words. ONE complete sentence.
- Lead with the noun (the object), describe its STATE, then add one sensory detail (smell / texture / warmth / light / sound).
- Pause-language welcomed: "still warm", "mid-stitch", "half-written", "barely cooled", "paused mid-thought".

━━━ HARD MANDATES ━━━

- Edwardian-Victorian steampunk register — brass, copper, velvet, leather, lacquer, ivory, gold-leaf, mahogany, walnut.
- NO active human in frame — moment is paused, character implicit.
- One specific object per entry — no stacking multiple unrelated items.
- Soft warm lamplight implied (gaslight, candlelight, oil-lamp, hearth-glow, brass-sconce).

━━━ HARD BANS ━━━

- NO characters performing actions in frame (this is "paused-just-left" still-life).
- NO modern objects (no electricity, no phone, no plastic).
- NO horror / dark / decay imagery — cozy register only.
- NO repeating the SAME object across entries (no two "teacup on saucer" entries).
- NO photographer / camera language.

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
