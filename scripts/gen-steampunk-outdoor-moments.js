#!/usr/bin/env node
/**
 * Generator for STEAMPUNK_WOMEN_OUTDOOR_MOMENTS pool — candid mid-action
 * moments in OPEN-AIR steampunk settings. Replaces the workshop-heavy
 * STEAMPUNK_WOMEN_CANDID_MOMENTS pool as the action slot for
 * sexy-steampunk-woman path.
 *
 * Reference: hearted render of Ethiopian woman hauling brass weather-balloon
 * tether on rain-lashed steamship bridge, ginger hair whipping in wind.
 * That's the energy — outdoor open-air, dramatic but not aerial-floating.
 */

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const Anthropic = require('@anthropic-ai/sdk');
const { SONNET } = require('./lib/models');

const OUT = path.resolve(__dirname, 'bots/steambot/seeds/steampunk_women_outdoor_moments.json');
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
    .filter((w) => w.length > 4 && !['woman', 'with', 'from', 'into', 'over', 'past', 'hair', 'coat'].includes(w))
    .slice(0, 4)
    .join('|');
}

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const RECIPE = `Generate CANDID PORTRAIT moments of a steampunk woman in sophisticated/scenic steampunk settings. Each is ONE comma-separated line, 25-40 words.

These are CANDID PORTRAIT shots — not action shots, not dashing/running/mid-leap. Think a film-still or a painted-illustration cover where she is STILL or QUIETLY-OCCUPIED in a beautifully-rendered steampunk location. The camera caught her in a quiet candid moment.

SETTINGS (rotate widely):
- airship promenade deck (relaxed, not stormy) — leaning on brass rail, gazing out
- luxury dirigible compartment / observation lounge — seated at velvet booth, reading a manifest
- sophisticated steampunk event / ball / soiree — at a banquet table, gallery opening, masquerade
- city plaza / cobblestone street at dusk under gas-lamps — pausing in passage
- atrium / glass-roofed conservatory / botanical garden — beside a brass orrery or fountain
- clocktower balcony / spire lookout / lighthouse gallery — standing at the rail
- harbor wharf / mooring dock — quietly waiting beside a dirigible mooring line
- carriage interior / private railway car — seated against velvet upholstery
- brass-trimmed rooftop garden — beside a wrought-iron table set for tea
- alpine signal-station / mountain observatory — at the brass telescope
- airship helm — STANDING at the wheel, hand resting (NOT in storm, NOT in chaos)
- private steampunk library / drawing room (sophisticated parlor OK if scenic)
- ornate steampunk theatre box / opera balcony
- workbench in an ornate atelier — standing/seated, drafting OR holding a small invention

POSE patterns (rotate):
- STANDING relaxed at railing / column / lamppost, hand resting, looking off-camera
- LEANING against brass pipework / wrought-iron column / wall, gazing thoughtfully
- SEATED at a velvet booth / table / chair, holding a brass object loosely
- SEATED on a low couch / divan / window-seat, posture casual
- STANDING at a helm wheel / telescope / brass instrument, one hand on it
- WALKING SLOWLY through a plaza / corridor / promenade, coat-tails barely moving
- PAUSED mid-step glancing at a brass timepiece / map / letter
- HOLDING aloft a small lantern / chronometer / pocket-watch / signal flag
- LEANING over a railing to look down at a courtyard / harbor / city below
- HANDS gently clasping a brass spyglass / mechanical bird / steam-pistol / sextant

ATMOSPHERIC PROPS (weave one in):
- wind LIGHTLY moving hair (not whipping)
- dusk-glow / golden-hour rim light / lantern-amber / gaslamp pools / moonlit
- mist drifting softly / steam venting gently in distance / smoke curling
- distant dirigible / mooring lights / brass spires / glass-roof reflections

GOOD examples (note: STILL pose + scenic setting + small steampunk prop):
- standing at the brass rail of an airship promenade deck at golden hour, one gloved hand resting on the polished rail, gazing out over copper-lit cloudtops
- seated at a velvet banquet booth in a sophisticated dirigible dining lounge, brass champagne flute idle between her fingers, chandelier crystals catching afternoon light
- leaning against a fluted brass column on a clocktower balcony, dusk wind lightly stirring her hair, distant city sprawling in amber gaslight
- pausing mid-step on a gas-lit cobblestone plaza beneath a copper street-lamp, glancing back over one shoulder, coat-tail just barely lifted
- seated on a low velvet divan in a private dirigible compartment, pocket-watch open in her gloved palm, dusk pouring through the panoramic porthole behind her
- standing beside the brass orrery of a glass-roofed atrium, sunlight pouring through panes, one hand resting on the rotating planetary arm
- at the wheel of a moored airship in calm harbor at sunrise, hand draped easily on the polished helm spokes, brass mooring lines glinting in early light
- pausing on a wrought-iron balcony of a steampunk opera house, programme in hand, distant orchestra warming through the open doors

ABSOLUTE BANS — DO NOT WRITE:
- ACTION verbs: hauling, lunging, mid-leap, mid-stride, mid-strike, mid-ascent, mid-spin, leaping, vaulting, rolling, sprinting, racing, charging, dashing, fleeing, climbing-fast
- DRAMATIC stakes: rain-lashed, storm, explosion, fire, chase, pursuit, collapsing, debris, shockwave, sparks raining
- workshop verbs: tightening, pipetting, soldering, measuring, adjusting, calibrating, repairing
- sexy, sensual, sultry, seductive, voyeuristic, decolletage, bustier, cleavage, midriff, bare
- moisture / sweat / lip / flush / breast / thigh / hip

Output: ONE moment per line. No numbering. No quotes. No commentary. Just the moments, comma-separated phrases internally.`;

async function generateBatch(n) {
  const resp = await anthropic.messages.create({
    model: SONNET,
    max_tokens: 4000,
    messages: [{ role: 'user', content: `${RECIPE}\n\nGenerate ${n} candid open-air steampunk moments now.` }],
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
