#!/usr/bin/env node
/**
 * Generator for SteamBot cozy-steampunk path-bespoke pools:
 *   - COZY_STEAMPUNK_ROOM (dreamy interior settings)
 *   - COZY_STEAMPUNK_FLORA (flower arrangements + plants — pickN:3)
 *   - COZY_STEAMPUNK_WINDOW_VIEW (beautiful outside seen through window)
 *   - COZY_STEAMPUNK_INTRICATE_DETAIL (ornate steampunk fixtures — pickN:2)
 *   - COZY_STEAMPUNK_QUIET_MOMENT (40%-gated comforting human-trace detail)
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
  console.error('Usage: --pool {room|flora|window|detail|moment} --count N OR --target N');
  process.exit(1);
}

const POOL_FILES = {
  room: 'cozy_steampunk_room.json',
  flora: 'cozy_steampunk_flora.json',
  window: 'cozy_steampunk_window_view.json',
  detail: 'cozy_steampunk_intricate_detail.json',
  moment: 'cozy_steampunk_quiet_moment.json',
};
const OUT = path.resolve(__dirname, 'bots/steambot/seeds', POOL_FILES[POOL]);

const RECIPES = {
  room: `Generate COZY DREAMY ROOM descriptions for a steampunk interior. Each is ONE comma-separated line, 30-50 words, describing a beautiful Victorian-industrial INTERIOR SPACE — the kind of room you'd want to step into and never leave.

The room is multi-functional comfort — bedrooms, reading nooks, conservatories, boudoirs, library-bedchambers — all decorated with steampunk furniture, fixtures, soft fabrics, intricate details. The space INVITES you in.

Variety mandate (rotate widely):
- ~20% brass-bed bedchamber (ornate brass bedstead with quilted velvet coverlet, mahogany side-tables, oriental rug)
- ~15% conservatory / glass-roofed reading-room (rattan chairs, climbing vines, brass-and-iron-framed glass roof, leaded-glass windows)
- ~15% study / library-bedchamber (mahogany bookshelves to ceiling, leather wing-back chairs, brass reading-lamps, daybed)
- ~10% boudoir / dressing-chamber (vanity with brass-rim mirror, velvet stool, silk-papered walls)
- ~10% solarium / tower-room (round room with tall arched windows, brass telescope, daybed beneath)
- ~10% music-room with daybed (self-playing pianoforte, velvet fainting-couch, brass music-stand)
- ~10% greenhouse-bedroom hybrid (bed surrounded by potted ferns, climbing wisteria, glass walls)
- ~10% airship gondola interior (rich velvet upholstered cabin, brass-framed porthole, mahogany paneling)
- ~5% steam-bath chamber (ornate brass plumbing, marble basin, steam-curling glass roof)

Each entry has:
- The ROOM TYPE
- KEY FURNITURE (bed / chair / sofa / table / vanity / shelves)
- MATERIAL SIGNATURE (velvet / brass / mahogany / leather / silk / marble)
- AMBIENT TOUCHES (rugs / cushions / drapes / shelving)
- A WINDOW OR GLASS WALL implied (we need a window to look through)

GOOD examples:
- Ornate brass bedchamber with quilted emerald-velvet coverlet on a tall four-poster bed, mahogany side-tables, oriental rug, tall arched window with brass-framed panes filling one wall, deep velvet drapes pulled back
- Conservatory reading-nook with rattan chaise lounges beneath a brass-and-iron-framed glass-dome roof, leaded-glass windows wrapping the curved wall, climbing wisteria draped across the upper brass framework
- Tower solarium with three tall arched windows in a round room, brass telescope mounted on tripod, velvet daybed with embroidered cushions beneath the windows, oriental rug warming polished mahogany floor

ABSOLUTE BANS:
- the window view itself (this slot is the ROOM, view is separate)
- modern furniture / modern fixtures
- empty / austere / minimalist register (always intricate + lived-in)
- workshop / workbench / factory rooms (this is COMFORTING not laboring)

Output: ONE room per line. No numbering. No quotes.`,

  flora: `Generate FLORA descriptions for a cozy steampunk room. Each is ONE comma-separated line, 15-25 words, describing flowers / plants / botanical elements that soften the room's steampunk industrial edges with life.

These are render IN ADDITION to the room — flora that lives WITHIN the room (vases on tables, climbing plants on architecture, potted ferns, hanging gardens).

Variety mandate:
- ~25% fresh-cut flowers in vases (peonies / roses / lilies / hydrangeas / wildflowers in crystal / brass / porcelain vases)
- ~20% potted plants (ferns / palms / aspidistra / orchid / tropical / orange-tree-in-tub)
- ~15% climbing vines / hanging gardens (wisteria over window-frame / ivy along the cornice / climbing roses on brass trellis)
- ~10% dried-flower or pressed-flower display (Victorian botanical specimens under glass / pressed-flower frames)
- ~10% terrarium / Wardian case (glass cabinet with mosses and miniature ferns / brass-framed terrarium)
- ~10% petal-scatter (rose petals scattered on a side-table / fallen blossoms on the floor)
- ~10% wreath / garland (laurel-and-rose garland on the mantel / floral wreath on the door)

Each entry has:
- The FLORAL TYPE (specific flowers/plants)
- The CONTAINER or PLACEMENT (vase type / pot / climbing on / hanging from)
- WHERE in the room (side-table / window-sill / corner / mantel / arch)
- ATMOSPHERIC touch (in soft light / catching the breeze / heavy with bloom)

GOOD examples:
- Massive crystal vase of fresh-cut white peonies on the bedside table, blooms heavy and overripe, petals just beginning to drift onto the polished mahogany
- Climbing wisteria cascading from a brass trellis at the window-arch, lavender-purple clusters trailing nearly to the floor in soft profusion
- Potted Boston fern on a wrought-iron stand beside the wing-back chair, fronds spilling outward in a green-fountain shape
- Wardian-case terrarium on the side-table, brass-framed glass holding moss-and-fern miniature world, condensation softly beading the panes
- Hanging copper-banded basket of trailing English ivy above the writing desk, vines descending in soft green curtain

ABSOLUTE BANS:
- the room itself (this slot is FLORA only)
- modern plastic plants / fake flowers
- aggressive / thorny / unfriendly flora (this is SOFT comforting)

Output: ONE flora per line. No numbering. No quotes.`,

  window: `Generate WINDOW VIEW descriptions for a cozy steampunk room. Each is ONE comma-separated line, 25-40 words, describing the BEAUTIFUL OUTSIDE SCENE visible through the room's tall window or glass wall.

The window is a portal into wonder. The view amplifies the dreamy register — sunset over rooftops, distant airships, rainstorm aqua sky, cloudtops from a sky-tower.

Variety mandate (rotate widely):
- ~15% sunset (copper-rose-gold gradient sky, distant city silhouette, sun just setting)
- ~15% rainstorm sky (aqua-blue-green storm sky, rain-streaked windowpane, distant lightning, atmospheric depth)
- ~15% dawn (cool-blue-to-amber gradient, sun cresting, mist rising from rooftops)
- ~10% airships in sky (distant dirigibles drifting at various heights, brass running-lights, sky activity)
- ~10% cloudtops (above-the-clouds view — endless rolling cloudtops at altitude, sun-shafts piercing)
- ~10% twilight / dusk (deep blue-violet sky, first stars, gaslamps lighting in the distance below)
- ~10% urban rooftop vista (Victorian rooftops with chimneys / clocktower / dome silhouettes / distant spires)
- ~5% garden / countryside (rolling green hills, sheep-dotted meadows, distant manor)
- ~5% sea view (coastline at sunset, lighthouse rock, ships in harbor)
- ~5% snow / winter (snow-dusted rooftops, falling flakes, distant warm windows)

Each entry has:
- The SKY / WEATHER condition (specific gradient or phenomenon)
- The FOREGROUND OUTSIDE (rooftops / chimneys / treetops / distant city)
- ATMOSPHERIC quality (haze / clarity / mist / rain on glass)
- A SPECIFIC ELEMENT making it interesting (airship, lighthouse, clocktower, mountain, etc.)

GOOD examples:
- Copper-rose-gold sunset gradient sky behind a distant Victorian city of brass-domed rooftops and clockwork-spire silhouettes, sun just dropping to the horizon
- Aqua-blue-green storm sky cleared after rain, distant lightning forking far off, rooftops glossy and wet, rainbow-arc fading on the horizon
- Endless rolling cloudtops far below the high tower-window, sun-shafts piercing here and there, two brass-and-fabric dirigibles drifting in the middle distance
- Twilight cityscape with first gas-lamps lighting in amber-pool sequence below, deep blue-violet sky stretching to the horizon, mountains far beyond
- Rain-streaked windowpane with the city blurred to soft impressionist patches beyond, distant clocktower a vertical silhouette, lamp-lit warmth glowing in scattered windows
- Above-the-clouds view from an airship promenade window, sun blazing golden across cloud-sea, second dirigible drifting in the deep distance

ABSOLUTE BANS:
- the room interior (this slot is JUST the outside view)
- modern objects in the view (no skyscrapers, no jets, no electric grids)
- heavy fog-bath that hides the view (haze for depth only)
- gritty industrial-soot register (this is DREAMY)

Output: ONE window view per line. No numbering. No quotes.`,

  detail: `Generate INTRICATE STEAMPUNK DETAIL descriptions for a cozy room's fixtures. Each is ONE comma-separated line, 15-25 words, describing a small ornate Victorian-industrial detail on the room's furniture / fittings / fixtures.

These are render IN ADDITION to the room — micro-craftsmanship details that saturate the steampunk register without the room feeling industrial.

Variety mandate:
- ~20% brass / copper fittings (ornate door-handle / curtain-rod / bedpost-finial / lamp-arm)
- ~15% clockwork ornaments (clockwork-bird on the mantel / mechanical music-box / tiny brass automaton)
- ~15% gas / oil lighting fixtures (brass gas-sconce / pearl-glass-shade lamp / copper chandelier)
- ~15% tooled leather / inlaid wood (leather-bound book-spines / inlaid mahogany surface / tooled-leather chair-back)
- ~10% mechanical conveniences (brass dumb-waiter / pneumatic-tube to kitchen / clockwork pull-cord)
- ~10% glass-and-brass containers (apothecary jars / Wardian cases / glass-globe lamps)
- ~10% mirrors / reflective surfaces (brass-rimmed mirror / mother-of-pearl inlay / silver-gilt frame)
- ~5% writing / reading kit (brass-and-glass inkwell / brass magnifying-glass / leather portfolio)

Each entry has:
- The DETAIL TYPE
- The MATERIAL SIGNATURE (brass / copper / mahogany / leather / glass / mother-of-pearl)
- WHERE in the room (on the mantel / by the bed / above the door / at the desk)
- ATMOSPHERIC TOUCH (catching lamplight / softly ticking / engraved with scrollwork)

GOOD examples:
- Brass clockwork-songbird mounted on the mantel, tiny copper wings folded, soft tick-tick of internal mechanism audible
- Pearl-glass-shaded gas-lamp on the writing desk, brass arm articulated, warm amber pool spilling onto leather blotter
- Ornate brass-and-glass apothecary jar on the side-table holding dried lavender, copper-and-cork stopper engraved with maker's mark
- Mother-of-pearl-inlaid mahogany jewelry box on the vanity, lid raised showing velvet-lined compartments with tiny brass instruments
- Brass-rimmed oval mirror above the dressing-table, frame scrollwork wreathed with engraved roses, glass spotted with age

ABSOLUTE BANS:
- the room itself (this slot is DETAIL only)
- modern objects
- the window view

Output: ONE detail per line. No numbering. No quotes.`,

  moment: `Generate QUIET MOMENT descriptions for a cozy steampunk room — small comforting human-trace details that suggest someone JUST WAS HERE. Each is ONE comma-separated line, 15-25 words.

These are 40%-gated — sometimes the room is empty-but-recently-inhabited (book left open, tea cooling, cat curled), sometimes pure inhabited-space without the human-trace.

Variety mandate:
- ~20% book / reading (open book face-down on bed / leather volume on side-table / stack of letters)
- ~15% drink / tea (teacup cooling on saucer / brandy decanter and half-empty glass / coffee pot with steam)
- ~15% writing (unfinished letter on desk / open journal with pen across / sealed envelope ready)
- ~10% sleeping animal (cat curled on velvet chair / small dog on rug / parrot on perch)
- ~10% discarded clothing (silk dressing-gown over chair-back / kid gloves on dresser / shawl draped)
- ~10% smoking (pipe in ashtray with smoke curling / cigar in crystal dish / cigarette case open)
- ~10% music (sheet music spread on piano / phonograph still playing / instrument on stand)
- ~10% craft-in-progress (embroidery hoop with needle / paint-palette on easel / open jewelry-making kit)

Each entry has:
- The TRACE OBJECT
- WHERE it sits (on the bed / on the side-table / on the chair-back)
- THE HUMAN SUGGESTION (just-set-down / mid-task / cooling / half-finished)

GOOD examples:
- Open book face-down on the rumpled bed, leather binding worn, reader paused mid-chapter and stepped briefly away
- Teacup cooling on its saucer at the bedside, brass pot still warm, the air smelling faintly of bergamot
- Sleeping orange cat curled tightly on the velvet armchair, brass collar-bell glinting, paw twitching in dream
- Silk dressing-gown draped over the foot of the bed, ivory-and-rose pattern catching the lamplight, sash trailing
- Pipe smoldering in the brass ashtray on the side-table, single thread of smoke rising in a slow curl

ABSOLUTE BANS:
- a primary human figure (this is a TRACE only — they JUST stepped out)
- modern objects
- the room or window themselves

Output: ONE quiet moment per line. No numbering. No quotes.`,
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
