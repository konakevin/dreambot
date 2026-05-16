#!/usr/bin/env node
/**
 * Generator for STEAMPUNK_MEN_OUTDOOR_MOMENTS pool — candid mid-action
 * moments of a STEAMPUNK MAN in scenic open-air Victorian-industrial
 * settings. Mirror of steampunk-women-outdoor-moments tuned for male-coded
 * energy (handsome / dashing / rugged / intent / capable).
 */

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const Anthropic = require('@anthropic-ai/sdk');
const { SONNET } = require('./lib/models');

const OUT = path.resolve(__dirname, 'bots/steambot/seeds/steampunk_men_outdoor_moments.json');
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
    .filter((w) => w.length > 4 && !['hands', 'with', 'from', 'into', 'over', 'past', 'looking', 'standing'].includes(w))
    .slice(0, 4)
    .join('|');
}

const RECIPE = `Generate CANDID PORTRAIT moments of a steampunk MAN in sophisticated/scenic steampunk settings. Each is ONE comma-separated line, 25-40 words.

These are CANDID PORTRAIT shots — not action shots, not dashing/running. Think a film-still or painted-illustration cover where he is STILL or QUIETLY-OCCUPIED in a beautifully-rendered steampunk location. The camera caught him in a quiet candid moment. He is HANDSOME, DASHING, RUGGED, INTENT, CAPABLE — never sexy / seductive / smoldering.

SETTINGS (rotate widely):
- airship promenade deck (relaxed, not stormy) — leaning on brass rail, gazing out
- luxury dirigible compartment / smoking lounge — seated in a leather club chair, brandy at hand
- gentleman's club / sophisticated steampunk soiree — at a billiard table, banquet, gallery opening
- city plaza / cobblestone street at dusk under gas-lamps — pausing in passage
- atrium / glass-roofed conservatory — beside a brass orrery or fountain
- clocktower balcony / spire lookout / lighthouse gallery — at the rail with a telescope
- harbor wharf / mooring dock — beside a dirigible mooring line at sunrise
- carriage interior / private railway car — seated against velvet upholstery
- brass-trimmed rooftop garden — beside a wrought-iron table set for tea or whisky
- alpine signal-station / mountain observatory — at the brass telescope
- airship helm — STANDING at the wheel, hand resting (NOT in storm)
- private steampunk library / drawing room (sophisticated parlor OK if scenic)
- ornate steampunk theatre box / opera balcony
- workbench in an ornate atelier — leaning over a brass invention, holding a magnifier
- military command deck / officers' mess
- foundry mezzanine / brass machine-shop catwalk (with him as observer not laborer)

POSE patterns (rotate):
- STANDING relaxed at railing / column / lamppost, hand resting, looking off-camera
- LEANING against brass pipework / wrought-iron column / wall, gazing thoughtfully
- SEATED in a leather club chair / banquet table / window-seat, brass tumbler in hand
- SEATED at a workbench inspecting a brass invention through a loupe
- STANDING at a helm wheel / telescope / brass instrument, one hand on it
- WALKING SLOWLY through a plaza / corridor / promenade, greatcoat tails barely moving
- PAUSED mid-step glancing at a pocket-watch / map / telegram
- HOLDING aloft a lantern / chronometer / pistol / brass instrument
- LEANING over a railing to look down at a courtyard / harbor / city below
- HANDS gently clasping a brass spyglass / mechanical bird / sextant / cane / pipe

ATMOSPHERIC PROPS (weave one in):
- wind LIGHTLY moving his hair / coat-tail / cravat (not whipping)
- dusk-glow / golden-hour rim light / lantern-amber / gaslamp pools / moonlit
- mist drifting softly / steam venting gently in distance / pipe-smoke curling
- distant dirigible / mooring lights / brass spires / glass-roof reflections

GOOD examples (note: STILL pose + scenic setting + small steampunk prop):
- standing at the brass rail of an airship promenade deck at golden hour, one gloved hand resting on the polished rail, gazing out over copper-lit cloudtops
- seated in a leather wing-back chair in a private gentlemen's club, brass tumbler of whisky in hand, dusk fire-glow lighting his features
- leaning against a fluted brass column on a clocktower balcony at dusk, wind lightly stirring his greatcoat, distant city sprawling in amber gaslight
- pausing mid-step on a gas-lit cobblestone plaza beneath a copper street-lamp, hand on the brim of his top-hat, coat-tail just barely lifted
- seated at a private dirigible compartment's mahogany desk, pocket-watch open in his hand, dusk pouring through the panoramic porthole
- standing beside the brass orrery of a glass-roofed atrium, sunlight pouring through panes, one hand resting on a rotating planetary arm
- at the wheel of a moored airship in calm harbor at sunrise, hand draped easily on polished helm spokes, brass mooring lines glinting
- pausing on a wrought-iron balcony of a steampunk opera house, programme in hand, distant orchestra warming through open doors
- leaning over a workbench in an ornate atelier, brass loupe to one eye, inspecting a tiny clockwork bird in his gloved palm
- mid-stride through an iron-and-glass railway terminus at dawn, pocket-watch in hand, locomotives venting steam in the distance

ABSOLUTE BANS — DO NOT WRITE:
- ACTION verbs: hauling, lunging, mid-leap, mid-strike, mid-ascent, mid-spin, leaping, vaulting, rolling, sprinting, racing, charging, dashing, fleeing
- DRAMATIC stakes: rain-lashed, storm, explosion, fire, chase, pursuit, collapsing, debris, shockwave
- workshop labor verbs: tightening, pipetting, soldering, measuring, adjusting valves, calibrating, hammering (he OBSERVES craftsmanship — he doesn't toil at it in candid shots)
- ANY female-coded vocabulary: gown, dress, skirt, lace cuff, makeup, kohl, eyeliner, jewelry-collar, choker, jewel-trim
- sexy, sensual, sultry, seductive, smoldering, come-hither, shirtless, bare-chested, open-shirt, oiled-pecs

Output: ONE moment per line. No numbering. No quotes. No commentary. Just the moments, comma-separated phrases internally.`;

async function generateBatch(n) {
  const resp = await anthropic.messages.create({
    model: SONNET,
    max_tokens: 4000,
    messages: [{ role: 'user', content: `${RECIPE}\n\nGenerate ${n} candid-portrait steampunk-man moments now.` }],
  });
  return resp.content[0].text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !/^[\d#\-\*]/.test(l.slice(0, 2)));
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
