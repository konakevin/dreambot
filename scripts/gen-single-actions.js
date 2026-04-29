#!/usr/bin/env node
/**
 * gen-single-actions.js — Generate single character action pool entries via Sonnet.
 *
 * Single character action pool is the playful counterpart to the dual_actions
 * pool. Single face swap means we only have one face to keep visible, so the
 * pool can be MUCH more creative, expressive, and dynamic than the dual one.
 *
 * Usage:
 *   node scripts/gen-single-actions.js --count 200
 *   node scripts/gen-single-actions.js --count 80 --existing-file /tmp/single-actions-200.json
 */

const fs = require('fs');
const path = require('path');

function readEnvFile() {
  try {
    const lines = fs.readFileSync('.env.local', 'utf8').split('\n');
    const env = {};
    for (const line of lines) {
      const eq = line.indexOf('=');
      if (eq > 0) env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
    }
    return env;
  } catch {
    return {};
  }
}
const envFile = readEnvFile();
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY || envFile.ANTHROPIC_API_KEY;
if (!ANTHROPIC_KEY) {
  console.error('Missing ANTHROPIC_API_KEY');
  process.exit(1);
}

const args = process.argv.slice(2);
const COUNT = parseInt(args.find((_, i, a) => a[i - 1] === '--count') ?? '200', 10);
const EXISTING_FILE = args.find((_, i, a) => a[i - 1] === '--existing-file');

// Seed exemplars — CANDID is the through-line. Real moments captured in
// photos. Sometimes contemplative, sometimes active, sometimes a casual
// playful gesture. NOT staged skits or theatrical bits. Every entry
// should feel like something you'd actually see in someone's vacation
// camera roll or a thoughtful selfie moment.
//
// THREE BLENDS:
//   1. Candid contemplative / observational (leaning on rail, hand on tree)
//   2. Candid active / physical (climbing, mid-leap, splashing)
//   3. Light playful gestures (peace sign, shaka, double thumbs up,
//      mid-laugh, mid-stretch — natural things in photos, NOT skits)
const EXEMPLARS = [
  // — Candid contemplative / observational —
  'leaning on a railing with elbows resting, looking out over the view',
  'crouched to examine a small detail on the ground, one hand reaching toward it',
  'standing at a vista with hands on hips, taking in the whole scene',
  'sitting on a ledge with feet dangling, leaning back on hands relaxed',
  'leaning against a tree trunk with shoulder against bark, hands in pockets',
  'kneeling beside a small flower or animal with one hand extended gently',
  'sitting on a bench or step with one foot up, leaning forward over a knee',
  'crouched by water dipping fingers in to test the temperature',
  'tucked against a sheltered nook with both hands wrapped around a warm mug',
  'standing at the base of a towering structure with head tilted up in awe',
  'leaning over a balcony with elbows resting, taking in the city below',
  'sitting cross-legged on a wall with elbows on knees, taking in the view',
  'walking along a trail with one hand brushing tall grass at their side',
  'standing in a doorway with one hand on the frame, glancing back inside',
  'reaching out to touch a textured wall or rock face with curious expression',
  // — Candid active / physical —
  'climbing onto a large rock with one hand pulling for the next hold, foot braced',
  'mid-leap from one stepping stone to another, arms out for balance',
  'walking along a fallen log with arms spread wide, focused expression',
  'pulling themselves up onto a low wall with both hands gripping the edge',
  'splashing through shallow water with one foot kicking up a spray',
  'wading ankle-deep in shallow water with pants rolled up, hands on hips',
  'mid-stretch with arms reaching overhead, taking in fresh air with a yawn',
  'crouched to skip a stone across the water with a flick of the wrist',
  'climbing a set of stone steps with one hand on a railing',
  'mid-stride along a path with a backpack and one hand on the strap',
  // — Light playful gestures (natural in photos, not skits) —
  'mid-laugh tossing head back with one hand pressed to chest',
  'mid-bite of street food held in both hands, eyes wide with delight',
  'flashing a casual peace sign with one hand near their face, smiling',
  'throwing a shaka with one hand, relaxed posture, easy smile',
  'pointing finger guns at the camera with a sly grin',
  'giving a casual double thumbs up with arms relaxed at chest height',
  'mid-wave with one hand raised, the other on hip, friendly smile',
  'taking a selfie holding a phone or camera up at arm length, free hand on hip',
  'mid-laugh with hand brought to mouth, caught off guard',
  'tossing a stone or coin in the air to catch, eyes tracking it casually',
];

async function callSonnet(prompt) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8192,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  if (!res.ok) throw new Error(`Sonnet API error: ${res.status}`);
  const data = await res.json();
  return data.content[0].text;
}

function buildPrompt(count, existing) {
  return `You are generating body pose descriptions for an AI image generator. These describe what ONE PERSON is doing in a scene — body position and action only.

POOL: SINGLE CHARACTER (one person being expressive in a scene)

ABSOLUTE RULES (every entry must follow ALL of these):
1. Describe what ONE person is doing — verbs first, expressive action
2. The person's FACE / HEAD must remain visible toward the camera. Three-quarter view, eyes and nose visible. NEVER backs to camera, NEVER full profile away, NEVER face hidden behind hands or arms.
3. BODY ACTION ONLY — describe what they're doing physically. NEVER describe eye direction with phrases like "looking at X" or "gazing at Y". Words like "alight with thrill" or "expression caught mid-laugh" are fine because they describe expression, not direction.
4. Stationary OR dynamic — sitting still is fine, but mid-leap/mid-twirl/mid-cast is even better. We want a MIX.
5. Scene-neutral — props are generic (rope, ledge, book, staff, orb, branch, flame). The actual setting comes from elsewhere.
6. One line per entry, lowercase, no quotes, no numbering
7. 12-25 words per entry — concise and specific

POOL PHILOSOPHY — CANDID, ABOVE ALL.

This pool is for a person's nightly dream renders. The vibe is real-person
candid photo energy — the kind of photo a partner takes of you on a trip,
or a self-timer selfie that captures a real moment. Sometimes you're being
contemplative, sometimes you're being active, sometimes you're flashing a
casual peace sign or laughing mid-step. NEVER staged theatrical "skits" —
the previous batches generated stuff like "fake-pushing tower with strain
face" and "balancing pancakes on head" and those produce unnatural awkward
images. Cut that energy entirely.

THREE BLENDS — generate roughly evenly:

1. CANDID CONTEMPLATIVE / OBSERVATIONAL (~40%):
   - Leaning on a rail watching the view, hand on a tree, walking a trail
   - Sitting on a ledge / wall / step in a relaxed pose
   - Crouched to examine something, kneeling by a flower, reaching to touch a wall
   - Hands wrapped around a mug, tucked into a sheltered nook
   - Standing at the base of something tall with head tilted up
   - Quiet moments. Stillness with subtle action — wind in hair, hand resting on a surface

2. CANDID ACTIVE / PHYSICAL (~30%):
   - Climbing onto rocks, mid-leap between stones, walking a fallen log
   - Splashing through water, wading, mid-stretch, mid-stride along a path
   - Pulling up onto a wall, climbing stairs, skipping a stone
   - REAL physical things a real person can do without looking absurd

3. LIGHT PLAYFUL GESTURES (~30%):
   - Casual gestures real people make in photos: peace sign, shaka, double
     thumbs up, finger guns at camera, mid-wave, casual point at the scene
   - Mid-laugh with hand to chest or mouth, mid-bite of food, mid-stretch with yawn
   - Selfie pose with phone/camera held up
   - Tossing something in the air and catching it, casual relaxed energy
   - These are NATURAL photo gestures — not theatrical bits

ABSOLUTELY BANNED — produces awkward unnatural renders:
- Theatrical skits: "fake-wrestling teddy bear", "pretending to push tower",
  "balancing pancakes on head", "fake-stuck in doorway", "Hamlet skull pose"
- Costume bits: "wearing cape made from towel", "wearing comically oversized hat"
- Pretending: "pretending to lift heavy rock with grunt face", "fake-spit-take"
- Corny fantasy hero: "drawing a sword", "casting a spell", "hero stance with cape", "brandishing weapon", "warrior pose"
- Action figure void poses with no scene context
- "Looking at camera / gazing at X" — face direction, not action
- Backs to camera, full profile, faces hidden
- Bland filler: "sitting against wall with knees drawn up", "arms wrapped around shins"

ENERGY CHECK: every entry should feel like an actual moment someone would
photograph and post. Real. Candid. Sometimes thoughtful, sometimes playful.
NEVER theatrical. If it sounds like a comedy sketch, cut it.

FORMAT — match these exemplars EXACTLY in style, length, and energy:
${existing.slice(0, 15).map(e => `- ${e}`).join('\n')}

MORE EXEMPLARS (for variety reference):
${existing.slice(15, 30).map(e => `- ${e}`).join('\n')}

DEDUPLICATION — do NOT repeat or rephrase any of these existing entries:
${existing.map(e => `- ${e}`).join('\n')}

Generate exactly ${count} NEW entries. Each must be genuinely different from every existing entry — different verb, different prop/object, different body configuration, different energy level. Vary the intensity: some high-action freeze-frames, some mid-action, some calm-but-engaged. Output ONLY the entries, one per line, no bullets, no numbering, no quotes.`;
}

function dedupCheck(newEntries, existing) {
  const issues = [];
  const existingLower = existing.map(e => e.toLowerCase());

  for (let i = 0; i < newEntries.length; i++) {
    const entry = newEntries[i].toLowerCase();

    // Check for near-duplicates against existing
    for (const ex of existingLower) {
      const words1 = new Set(entry.split(/\s+/));
      const words2 = new Set(ex.split(/\s+/));
      const overlap = [...words1].filter(w => words2.has(w) && w.length > 3).length;
      const similarity = overlap / Math.max(words1.size, words2.size);
      if (similarity > 0.6) {
        issues.push({ index: i, entry: newEntries[i], reason: `too similar to existing: "${ex}"`, similarity: (similarity * 100).toFixed(0) + '%' });
      }
    }

    // Check for near-duplicates within new entries
    for (let j = 0; j < i; j++) {
      const other = newEntries[j].toLowerCase();
      const words1 = new Set(entry.split(/\s+/));
      const words2 = new Set(other.split(/\s+/));
      const overlap = [...words1].filter(w => words2.has(w) && w.length > 3).length;
      const similarity = overlap / Math.max(words1.size, words2.size);
      if (similarity > 0.6) {
        issues.push({ index: i, entry: newEntries[i], reason: `too similar to new #${j + 1}: "${newEntries[j]}"`, similarity: (similarity * 100).toFixed(0) + '%' });
      }
    }

    // Rule violations
    if (/\blooking at\b|\bgazing at\b|\bstaring at\b|\bwatching\b|\beye contact\b|\blocked eyes\b/i.test(entry)) {
      issues.push({ index: i, entry: newEntries[i], reason: 'FACE DIRECTION detected (use action verbs not gaze verbs)' });
    }
    if (/\bback to camera\b|\bfrom behind\b|\brear view\b|\bsilhouette\b|\bback turned\b|\bface hidden\b|\bface obscured\b|\bface buried\b|\bcovering their face\b/i.test(entry)) {
      issues.push({ index: i, entry: newEntries[i], reason: 'FACE NOT VISIBLE detected' });
    }
    if (/\bstanding still\b|\bstanding posed\b|\bstanding (with )?arms (at|by) (their |the )?sides?\b/i.test(entry)) {
      issues.push({ index: i, entry: newEntries[i], reason: 'BORING STATIC POSE detected (be expressive)' });
    }
    if (/\bsitting against\b|\bsitting (with )?(legs |knees |arms )?wrapped\b|\barms (wrapped|around) (their |the )?(shins?|knees?|legs)\b|\bknees drawn (up )?to (the )?chest\b/i.test(entry)) {
      issues.push({ index: i, entry: newEntries[i], reason: 'BORING SIT-WITH-KNEES detected' });
    }
    if (/\bleaning against (a |the )?(wall|tree|rock|fence|post|pillar|column).*arms (crossed|folded)\b/i.test(entry)) {
      issues.push({ index: i, entry: newEntries[i], reason: 'BORING LEAN+ARMS-CROSSED detected' });
    }
    if (/\bcross-legged (with )?hands relaxed\b|\bsitting cross-legged.*lap\b/i.test(entry)) {
      issues.push({ index: i, entry: newEntries[i], reason: 'BORING CROSS-LEGGED RELAXED detected' });
    }
    if (/\bbrandishing\b|\bdrawing a sword\b|\bcasting a spell\b|\bcasting magic\b|\bmagical sparkles\b|\bhero stance\b|\bfist raised victorious\b|\bbattle cry\b|\bunsheathing\b|\bsorcery\b|\bglowing (weapon|sword|wand|staff)\b|\bconjure\b|\bsorcerer\b|\bwarrior pose\b/i.test(entry)) {
      issues.push({ index: i, entry: newEntries[i], reason: 'CORNY FANTASY HERO detected' });
    }

    const wordCount = entry.split(/\s+/).length;
    if (wordCount > 30) {
      issues.push({ index: i, entry: newEntries[i], reason: `too long (${wordCount} words)` });
    }
    if (wordCount < 8) {
      issues.push({ index: i, entry: newEntries[i], reason: `too short (${wordCount} words)` });
    }
  }

  return issues;
}

(async () => {
  let existing = EXEMPLARS;
  if (EXISTING_FILE) {
    try {
      const fileData = JSON.parse(fs.readFileSync(EXISTING_FILE, 'utf8'));
      const fromFile = Array.isArray(fileData) ? fileData : (fileData.entries || []);
      const merged = new Set([...existing, ...fromFile]);
      existing = Array.from(merged);
      console.log(`📁 Loaded ${fromFile.length} from ${EXISTING_FILE} → merged pool: ${existing.length}`);
    } catch (e) {
      console.error(`Failed to load --existing-file ${EXISTING_FILE}: ${e.message}`);
      process.exit(1);
    }
  }
  console.log(`\n🎯 Generating ${COUNT} single character actions via Sonnet...`);
  console.log(`   Existing pool: ${existing.length} entries`);

  const prompt = buildPrompt(COUNT, existing);
  const raw = await callSonnet(prompt);

  const entries = raw
    .split('\n')
    .map(l => l.replace(/^[-•*\d.)\s]+/, '').trim())
    .filter(l => l.length > 10 && !l.startsWith('#') && !l.startsWith('Here'));

  console.log(`\n📋 Sonnet returned ${entries.length} entries\n`);

  const issues = dedupCheck(entries, existing);

  if (issues.length > 0) {
    console.log(`⚠️  ${issues.length} issues found\n`);
    const grouped = {};
    for (const iss of issues) {
      if (!grouped[iss.index]) grouped[iss.index] = [];
      grouped[iss.index].push(iss);
    }
  }

  const cleanEntries = entries.filter((_, i) => !issues.some(iss => iss.index === i));
  console.log(`✅ ${cleanEntries.length} clean entries (${entries.length - cleanEntries.length} removed)\n`);

  const outFile = `/tmp/single-actions-${COUNT}.json`;
  fs.writeFileSync(outFile, JSON.stringify({ total: entries.length, clean: cleanEntries.length, removed: entries.length - cleanEntries.length, entries: cleanEntries, rejected: issues.map(i => ({ entry: entries[i.index], reason: i.reason })) }, null, 2));
  console.log(`📁 Saved to ${outFile}`);

  console.log('\n── CLEAN ENTRIES (sample) ──\n');
  cleanEntries.slice(0, 30).forEach((e, i) => console.log(`  ${i + 1}. ${e}`));
})();
