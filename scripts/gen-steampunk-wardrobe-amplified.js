#!/usr/bin/env node
/**
 * Generator for STEAMPUNK_WOMEN_WARDROBE_AMPLIFIED pool — outfits where the
 * MECHANICAL STEAMPUNK CONTENT is the dominant signal. Goes beyond
 * "Victorian + brass detail" — every entry has visible clockwork, gauges,
 * pneumatic tubes, cog ornament, or mechanical contraption integrated into
 * the wardrobe itself.
 */

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const Anthropic = require('@anthropic-ai/sdk');
const { SONNET } = require('./lib/models');

const OUT = path.resolve(__dirname, 'bots/steambot/seeds/steampunk_women_wardrobe_amplified.json');
const args = Object.fromEntries(
  process.argv
    .slice(2)
    .map((s, i, a) => (s.startsWith('--') ? [s.slice(2), a[i + 1] ?? true] : null))
    .filter(Boolean)
);
const TARGET = parseInt(args.target || '0', 10);
const BATCH = parseInt(args.batch || '25', 10);
const COUNT = parseInt(args.count || (TARGET ? '0' : '30'), 10);

function signatureOf(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 4 && !['woman', 'with', 'from', 'into', 'over', 'past', 'brass', 'copper', 'leather', 'corset'].includes(w))
    .slice(0, 5)
    .join('|');
}

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const RECIPE = `Generate ornate amplified-steampunk women's outfits. Each is ONE comma-separated line, 50-80 words, describing a single fully-detailed Victorian-industrial outfit.

THE OUTFIT MUST READ AS UNMISTAKABLY STEAMPUNK — every entry has visible MECHANICAL complexity integrated into the wardrobe itself, not just Victorian fashion with brass buttons.

Variety mandate — distribute silhouettes ACROSS the batch (no more than 3 of any one silhouette in 30 entries):
- ~20% ball-gown / opera-gown / formal evening-dress
- ~20% tailored vest + shirt + pants/breeches (no skirt)
- ~15% corset + jacket + skirt
- ~15% corset + coat + breeches/leggings
- ~10% riding-habit (jacket + skirt OR jacket + breeches)
- ~10% pilot/aviator coat + flight gear with leggings or breeches
- ~10% mid-thigh leather coat + corset + leggings/stockings
- aprons / overalls / military-coat OK as occasional outliers but NOT the dominant silhouette

CRITICAL — KEVIN'S EXPLICIT ASK: include dresses, vests, COATS, LEGGINGS, PANTS — make sure leggings + pants + vests are visibly represented (not skirt-dominant). Vest + leggings combos are great. Pants + corset + jacket combos are great.

EVERY entry MUST include 3+ of these AMPLIFIED-STEAMPUNK elements:
- visible CLOCKWORK MECHANISM (exposed gears on bodice / wrist / shoulder pauldron / hem)
- working PRESSURE-GAUGE or BAROMETER set into the outfit (corset front / wrist cuff / chest plate)
- PNEUMATIC TUBES / brass pipework running from a backpack / corset / pauldron
- BRASS PROSTHETIC LIMB (arm / leg) with exposed pistons, cables, joint articulation
- COG / GEAR ornaments (medallion / hairpin / button / brooch / belt-buckle / lapel-pin)
- STEAM-VENT or release-valve built into the garment (shoulder / hip / back)
- CHRONOGRAPH / pocket-watch / sextant / brass instrument worn ON the outfit
- GOGGLES (pushed up to forehead / hanging at neck / over eyes)
- MECHANICAL HARNESS with visible articulation (back-mounted wings / jet-pack / spider-arms / counterbalance frame)
- BRASS-CAGE bodice or skirt-frame with visible internal structure
- CLOCKWORK AUTOMATON ornaments (tiny brass birds / butterflies / beetles / dragonflies / songbirds embroidered or sewn into fabric)
- VOLTAGE / Tesla-coil device strapped to belt or chest

LAYERED + ORNATE NON-NEGOTIABLE:
- Multiple visible fabric layers (corset OVER blouse, jacket OVER corset, etc.)
- Detail at every plane (brass clasps, copper buttons, lace cuffs, embroidered sleeves, jeweled brooches)
- 3+ named fabric layers + 3+ amplified-steampunk elements minimum

TASTEFUL — Victorian opulent NOT modern-skin-show:
- décolletage OK (Victorian fashion)
- corset OK (period accurate)
- NO bare-midriff, NO sheer panels, NO strategic cutouts, NO see-through, NO bare-anything
- NO "sexy", "voyeuristic", "sultry", "seductive"

GOOD examples:
- Oxblood leather aviator coat with brass-piston shoulder pauldrons holding pressure-gauge readouts and copper steam-release valves venting wisps at the sternum, fitted black-and-gold corset bodice with visible brass-cage internal ribs and three working chronograph dials set into the front-panel, cream silk high-collar blouse with copper button-placket and lace wrist-cuffs, charcoal wool riding-breeches tucked into thigh-high brown boots with brass-buckle straps and gear-etched toe-caps, brass-mesh fingerless gloves over articulated mechanical knuckle-plates, leather chest-bandolier with hanging brass altimeter and sextant
- Champagne silk ball-gown with visible brass-cage crinoline showing clockwork-spring frame beneath layered tulle, fitted corset bodice with embedded pressure-gauge bezels around the waist and three exposed cogwheel ornaments climbing the bust-line, copper-mesh shoulder-cape with mechanical brass songbirds sewn into the trim, opera-length brass-segmented gloves over articulated finger-joints with knuckle-mounted gear-rings, antique pocket-watch on copper chain looping from collar to bodice, brass-and-pearl tiara with rotating clockwork-flower mechanism

ABSOLUTE BANS:
- modern dress codes (no jeans, no t-shirts, no modern clothing)
- pure Victorian without steampunk amplification (every entry MUST have mechanical)
- sexy / sultry / seductive / cleavage / midriff
- generic "brass-button jacket" without further mechanical detail

Output: ONE outfit per line. No numbering. No quotes. No commentary.`;

async function generateBatch(n) {
  const resp = await anthropic.messages.create({
    model: SONNET,
    max_tokens: 5500,
    messages: [{ role: 'user', content: `${RECIPE}\n\nGenerate ${n} amplified-steampunk women's outfits now.` }],
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
