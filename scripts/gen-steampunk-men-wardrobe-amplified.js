#!/usr/bin/env node
/**
 * Generator for STEAMPUNK_MEN_WARDROBE_AMPLIFIED pool — amplified-steampunk
 * gentleman's attire. Mirror of women's amplified-wardrobe tuned for
 * period-accurate Victorian-industrial men. NEVER cross-pollutes with
 * female-coded vocab (no gowns / dresses / skirts / lace cuffs / corsets /
 * makeup / décolletage etc.).
 */

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const Anthropic = require('@anthropic-ai/sdk');
const { SONNET } = require('./lib/models');

const OUT = path.resolve(__dirname, 'bots/steambot/seeds/steampunk_men_wardrobe_amplified.json');
const args = Object.fromEntries(
  process.argv
    .slice(2)
    .map((s, i, a) => (s.startsWith('--') ? [s.slice(2), a[i + 1] ?? true] : null))
    .filter(Boolean)
);
const TARGET = parseInt(args.target || '0', 10);
const BATCH = parseInt(args.batch || '25', 10);
const COUNT = parseInt(args.count || (TARGET ? '0' : '30'), 10);

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function signatureOf(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 4 && !['brass', 'copper', 'leather', 'wearing'].includes(w))
    .slice(0, 5)
    .join('|');
}

const RECIPE = `Generate ornate amplified-steampunk MEN's attire. Each is ONE comma-separated line, 50-80 words, describing a single fully-detailed Victorian-industrial men's outfit.

THE OUTFIT MUST READ AS UNMISTAKABLY STEAMPUNK GENTLEMAN'S ATTIRE — every entry has visible MECHANICAL complexity integrated into the wardrobe, not just Victorian fashion with brass buttons.

Variety mandate — distribute silhouettes ACROSS the batch (no more than 3 of any one silhouette per 30 entries):
- ~20% tailored frock-coat + waistcoat + breeches/trousers + cravat
- ~15% military officer's greatcoat + uniform trousers + sash + epaulettes
- ~15% leather aviator coat + flight breeches + boots + harness
- ~10% gentleman explorer kit (khaki coat + cargo-pants + bandolier + boots)
- ~10% Victorian gentleman's smoking jacket + waistcoat + trousers + slippers (sophisticated indoor)
- ~10% engineer's vest + rolled-sleeve shirt + work-trousers + apron (workshop register)
- ~10% riding-coat + waistcoat + breeches + tall boots
- ~10% naval officer's coat + trousers + dirk + sextant
- alchemist's robe-coat / morning-suit / dandy's brocade-coat OK as occasional outliers

EVERY entry MUST include 3+ of these AMPLIFIED-STEAMPUNK elements (mechanical complexity ON the outfit):
- visible CLOCKWORK MECHANISM (exposed gears on lapel / cuff / shoulder pauldron / belt-buckle)
- working PRESSURE-GAUGE or BAROMETER set into the outfit (waistcoat front / wrist cuff / chest-plate)
- PNEUMATIC TUBES / brass pipework running from a backpack / harness / chest-rig
- BRASS PROSTHETIC LIMB (arm / leg / hand) with exposed pistons, cables, joint articulation
- COG / GEAR ornaments (lapel-pin / cufflink / waistcoat-button / belt-buckle / cravat-pin)
- STEAM-VENT or release-valve built into the garment (shoulder / hip / back)
- CHRONOGRAPH / pocket-watch / sextant / brass instrument worn ON the outfit
- GOGGLES (pushed up onto forehead / hanging at neck / over eyes)
- MECHANICAL HARNESS with visible articulation (back-mounted wings / jet-pack / spider-arms)
- BRASS-PLATED BANDOLIER with mechanical pouches / ammunition / vials
- CLOCKWORK AUTOMATON ornaments (brass bird perched on shoulder / mechanical pet on chain)
- TESLA-COIL / voltage device strapped to belt or chest
- BRASS-REINFORCED collar / cuffs / boots with visible mechanical detail

LAYERED + ORNATE NON-NEGOTIABLE:
- Multiple visible fabric layers (shirt UNDER waistcoat UNDER coat, etc.)
- Period-accurate Victorian gentleman's structure
- 3+ named fabric layers + 3+ amplified-steampunk elements minimum

HANDSOME THROUGH CRAFTSMANSHIP — NEVER seductive:
- NEVER shirtless / bare-chested / open-shirt
- NEVER beefcake / oiled-pecs / sleeveless tank
- Rolled sleeves over a workbench are FINE (working not undressing)
- Fully dressed Victorian gentleman at all times

GOOD examples:
- Charcoal wool military officer's greatcoat with brass-piston shoulder pauldrons linked by pneumatic copper tubing running to a riveted backpack canister at the lower back, fitted crimson waistcoat with three working pressure-gauge bezels across the chest and copper-button placket, ivory linen high-collar shirt with grey silk cravat pinned with a gear-cog tie-pin, charcoal wool officer's breeches tucked into tall black boots with brass-reinforced toe-caps and pressure-release valves at the ankles, leather chest-bandolier holding brass altimeter and sextant, dark grey gloves with articulated knuckle-plates
- Oxblood leather aviator coat with brass-piston shoulder pauldrons venting copper steam-release wisps, fitted black wool waistcoat over cream linen high-collar shirt with brass collar-studs, navy gabardine flight breeches with side-stripe of brass-cage reinforcement, tall brown boots with chronograph-set ankle-cuffs and gear-etched toe-caps, leather chest-rig with brass altimeter dial mounted center-sternum, pneumatic copper tube running from rig to a small backpack canister, brass goggles pushed up onto forehead, fingerless brown gloves with articulated knuckle gears

ABSOLUTE BANS:
- modern dress codes (no jeans, no t-shirts, no modern clothing)
- pure Victorian without steampunk amplification (every entry MUST have mechanical complexity)
- ANY female-coded vocabulary: gown, dress, skirt, corset, bustle, bodice, lace overlay, embroidered cuff, jewel-trim, brocade-trim (unless on a brocade waistcoat — period-male), décolletage, jewelry-collar, choker, jewel-collar, makeup, kohl
- sexy / sultry / seductive / smoldering / cleavage / bare
- shirtless / open-shirt / oiled / beefcake

Output: ONE outfit per line. No numbering. No quotes. No commentary.`;

async function generateBatch(n) {
  const resp = await anthropic.messages.create({
    model: SONNET,
    max_tokens: 5500,
    messages: [{ role: 'user', content: `${RECIPE}\n\nGenerate ${n} amplified-steampunk men's outfits now.` }],
  });
  return resp.content[0].text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 30 && !/^[\d#\-\*]/.test(l.slice(0, 2)));
}

(async () => {
  if (TARGET) {
    let existing = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : [];
    const sigs = new Set(existing.map(signatureOf));
    console.log(`Appending: existing ${existing.length} — target ${TARGET}`);
    while (existing.length < TARGET) {
      const need = Math.min(BATCH, TARGET - existing.length);
      const batch = await generateBatch(Math.ceil(need * 1.3));
      const fresh = batch.filter((b) => !sigs.has(signatureOf(b)));
      for (const f of fresh) {
        if (existing.length >= TARGET) break;
        existing.push(f);
        sigs.add(signatureOf(f));
      }
      fs.writeFileSync(OUT, JSON.stringify(existing, null, 2));
      console.log(`  ${existing.length}/${TARGET}`);
    }
    return;
  }
  const batch = await generateBatch(COUNT);
  const sigs = new Set();
  const deduped = batch.filter((b) => {
    const sig = signatureOf(b);
    if (sigs.has(sig)) return false;
    sigs.add(sig);
    return true;
  });
  fs.writeFileSync(OUT, JSON.stringify(deduped, null, 2));
  console.log(`Wrote ${deduped.length} entries to ${OUT}`);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
