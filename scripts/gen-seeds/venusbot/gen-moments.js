#!/usr/bin/env node
/**
 * Generate 50 NARRATIVE MOMENTS — full-body scenes where she is mid-action.
 * Used in full-body path. Film-noir-meets-sci-fi assassin moments.
 *
 * Each is a CHARGED scene — she's in the middle of a plot (plotting,
 * conspiring, executing, observing). Solo composition — she is the
 * only figure in frame. Targets referenced offscreen only.
 *
 * Output: scripts/bots/venusbot/seeds/moments.json
 *
 * Note: each entry is an OBJECT { kind, text } for the kind tagging the
 * full-body brief uses ("PLOTTING MOMENT", "CONSPIRING MOMENT", etc.)
 */

const { generatePool } = require('../../lib/seedGenHelper');

generatePool({
  outPath: 'scripts/bots/venusbot/seeds/moments.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} NARRATIVE MOMENTS for a cyborg-assassin femme fatale. Each is a full-body scene where she's in the middle of a plot — plotting, conspiring, studying, preparing. Film noir meets sci-fi assassin.

━━━ OUTPUT SHAPE (IMPORTANT) ━━━

Each entry is a JSON OBJECT with two keys: { "kind": "...", "text": "..." }

- "kind": one of "plotting" | "conspiring" | "studying" | "preparing" | "surveilling" | "executing" | "contemplating"
- "text": 25-45 word scene description

━━━ SOLO COMPOSITION — NON-NEGOTIABLE ━━━

She is ALWAYS alone in the frame. Targets, marks, accomplices can be REFERENCED in narration (she is studying photos of a target, she is watching an offscreen mark through a window, she is setting up a hit) — but never rendered in the frame. Zero second figures. Zero bodies. Zero crowd.

━━━ WHAT MAKES A GOOD MOMENT ━━━

- Specific setting (ornate penthouse, moonlit rooftop, marble ballroom, dim hotel corridor, candle-lit boudoir, neon alley, cathedral, vault, train car, helipad, garden maze)
- She's doing something with intent (her hand/body is in motion or pointed toward something)
- The moment is LOADED — something is about to happen or just happened
- Noir atmosphere (shadows, candle-light, rain, fog, marble, velvet) OR sci-fi futurism
- Solo silhouette — she fills the frame as the only figure

━━━ BANNED ━━━

- No second figures in the frame ("a man at the bar", "her accomplice", "a fallen body")
- No "pose"/"modeling"/"editorial" language
- No specific props that could plant ideas — vary widely
- No repeating the same setting / prop / action across entries

━━━ OUTPUT ━━━

JSON array of ${n} objects. Example shape: [{"kind":"plotting","text":"..."}, ...]

No preamble, no numbering, no quotes wrapping the whole array.`,
  maxTokens: 4000,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
