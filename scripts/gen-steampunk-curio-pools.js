#!/usr/bin/env node
/**
 * Generator for SteamBot steampunk-curio path-bespoke pools:
 *   - STEAMPUNK_CURIO_DISPLAY_REGISTER (museum-display framing context)
 *   - STEAMPUNK_CURIO_ORNATE_FLOURISH (micro-detail ornaments — pickN:3)
 *
 * Usage: node scripts/gen-steampunk-curio-pools.js --pool display_register --count 30
 *        node scripts/gen-steampunk-curio-pools.js --pool ornate_flourish --target 150
 */

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const Anthropic = require('@anthropic-ai/sdk');
const { SONNET } = require('./lib/models');

const args = Object.fromEntries(
  process.argv
    .slice(2)
    .map((s, i, a) => (s.startsWith('--') ? [s.slice(2), a[i + 1] ?? true] : null))
    .filter(Boolean)
);
const POOL = args.pool;
const TARGET = parseInt(args.target || '0', 10);
const BATCH = parseInt(args.batch || '25', 10);
const COUNT = parseInt(args.count || (TARGET ? '0' : '30'), 10);

if (!POOL) {
  console.error('Usage: --pool {habitat|ornate_flourish} --count N OR --target N');
  process.exit(1);
}

const POOL_FILES = {
  habitat: 'steampunk_curio_habitat.json',
  ornate_flourish: 'steampunk_curio_ornate_flourish.json',
};
const OUT = path.resolve(__dirname, 'bots/steambot/seeds', POOL_FILES[POOL]);

const RECIPES = {
  habitat: `Generate HABITAT descriptions for a steampunk animate-curio (little mechanical robot creature). Each is ONE comma-separated line, 25-40 words, describing an IMMERSIVE steampunk environment where the little robot creature LIVES or is encountered.

These are lived-in Victorian-industrial spaces — NOT museum vitrines / NOT Sotheby's catalogs / NOT static pedestals. The creature inhabits the space; the space surrounds the creature.

Variety mandate (rotate widely):
- ~15% inventor's workshop / atelier (brass workbench cluttered with tools, copper coils, blueprints, half-built mechanisms surrounding)
- ~12% glass-roofed conservatory / greenhouse (sunlit panes, hanging brass-iron plants, copper-piped irrigation system)
- ~10% candlelit library / drawing room (leather-bound books, mahogany shelves, brass reading lamps, deep velvet armchair-backs)
- ~10% airship interior (brass-railed promenade deck / dirigible observation lounge / mahogany corridor)
- ~10% mad scientist's lab / alchemy chamber (bubbling retorts, copper coils, glass alembics, leather-bound grimoires)
- ~8% observatory / astronomical chamber (massive brass telescope, copper armillary, star-chart-strewn desk)
- ~8% old book-lined study / curio-cabinet alcove (rich mahogany shelves crowded with specimens, leather chairs)
- ~7% boudoir / parlor with crimson velvet (low brass lamp, lacquered dressing-table, ornate wallpaper)
- ~6% foundry mezzanine (brass beam catwalk over steam-filled workshop floor below, hammers ringing distantly)
- ~6% garden / aviary / wrought-iron-greenhouse exterior (brass fountains, wrought-iron benches, copper-leaved trees)
- ~4% rooftop balcony / brass terrace (gas-lamps below, copper rooftops receding, twilight sky)
- ~4% engine room / steam chamber (riveted brass pipework, pressure gauges, copper steam-vents)

Each entry has:
- The TYPE OF SPACE (workshop / conservatory / library / etc.)
- WHERE the creature is placed in it (on a brass workbench / perched on a leather book-spine / hovering near a sunlit window / on a copper railing)
- Surrounding props (specific Victorian-industrial details — brass tools / leather-bound books / copper pipework / hanging ferns / brass instruments)
- Light quality (warm gas-lamp / candlelit / sunlit through glass / dim amber / forge-red glow / moonlit)
- Atmospheric depth (foreground props near creature → midground environment → deep distance receding into haze)

GOOD examples:
- Inventor's workshop at gaslight, the creature on a brass workbench amid scattered copper coils, leather tool-rolls, half-assembled mechanisms, blueprints curling at edges, warm amber lamp pool catching its surface
- Sunlit glass-roofed conservatory with hanging brass-piped ferns and copper-leafed Victorian plants, the creature on a wrought-iron table beside a wrought-iron sundial, leaded-glass panes catching afternoon light
- Candlelit private library, the creature perched atop a stack of leather-bound grimoires on a mahogany table, brass reading lamp casting amber pools, deep-shadowed bookshelves receding into warm gloom behind
- Airship promenade-deck interior, the creature on a brass railing beside a panoramic porthole, mahogany corridor receding behind, golden-hour sun pouring through the porthole, distant cloudtops glowing
- Mad alchemist's lab with bubbling copper retorts, glass alembics steaming, leather-bound grimoires open, the creature on a brass-and-mahogany worktable amid alchemical glassware, violet flame underlighting

ABSOLUTE BANS:
- museum vitrines / Sotheby's catalog framing / static-display pedestals / "displayed on" / "presented on" / catalog backdrops
- neutral paper backdrops / "floating against backdrop" — this is an IMMERSIVE space
- the creature itself (this slot is JUST the environment around it)
- modern objects (no LED, no plastic, no electronics)
- characters / hands / figures

Output: ONE habitat per line. No numbering. No quotes.`,

  ornate_flourish: `Generate ORNATE FLOURISH micro-details for a steampunk curio. Each is ONE comma-separated line, 12-22 words, describing a single small obsessive detail that ornaments the surface of a fantastical Victorian-industrial object.

These are render IN ADDITION to the object's main features — micro-detail ornaments that obsessively saturate the surface.

Variety mandate:
- ~20% engraving (etched maker's mark / engraved scrollwork / inscribed Latin motto / engraved coordinates)
- ~15% jeweled accents (cabochon ruby inset / emerald cluster / pearl-and-gold rim / diamond pavé)
- ~15% filigree (gold-filigree edging / copper-filigree latticework / silver-filigree wreath)
- ~15% mechanical micro-details (tiny working chronograph dial / miniature pressure-gauge / exposed escapement)
- ~10% patina / wear (verdigris on copper / brass tarnish / soot-fleck / wear-polish)
- ~10% inlay (mother-of-pearl inlay / nacre marquetry / ebony-and-ivory chequering)
- ~10% glass / lens (tiny ground-glass lens / cabochon cut / faceted prism)
- ~5% mechanical (working music-box mechanism / tiny gear-train visible through cutout)

GOOD examples:
- Tiny cabochon ruby set in the brass eye, glowing inner spark catching gallery light
- Hand-engraved makers mark "Brillant et Fils, Paris 1887" curling across the underside
- Gold-filigree wreath of laurel-leaves edging the upper rim, each leaf individually soldered
- Working miniature chronograph dial inset in the lower panel, second-hand still ticking
- Verdigris bloom of pale-green oxidation crowning the upper bezel, hand-burnished elsewhere
- Mother-of-pearl inlay swirling across the lid in a nautilus spiral pattern
- Tiny ground-glass lens set in the brass forehead, magnifying gear-mechanism beneath
- Working music-box mechanism visible through ornate brass cutout, escapement turning slowly

ABSOLUTE BANS:
- full object description (this is JUST a micro-detail)
- modern materials (no plastic, no LED, no neon)
- characters / hands

Output: ONE flourish per line. No numbering. No quotes.`,
};

const RECIPE = RECIPES[POOL];
if (!RECIPE) {
  console.error('Unknown pool:', POOL);
  process.exit(1);
}

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function signatureOf(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 4)
    .slice(0, 4)
    .join('|');
}

async function generateBatch(n) {
  const resp = await anthropic.messages.create({
    model: SONNET,
    max_tokens: 4000,
    messages: [{ role: 'user', content: `${RECIPE}\n\nGenerate ${n} entries now.` }],
  });
  return resp.content[0].text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 15 && !/^[\d#\-\*]/.test(l.slice(0, 2)));
}

(async () => {
  if (TARGET) {
    let existing = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : [];
    const sigs = new Set(existing.map(signatureOf));
    console.log(`[${POOL}] appending: existing ${existing.length} — target ${TARGET}`);
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
  console.log(`[${POOL}] wrote ${deduped.length} entries`);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
