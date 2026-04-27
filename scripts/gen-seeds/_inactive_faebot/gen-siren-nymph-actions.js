#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/faebot/seeds/siren_nymph_actions.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} SIREN NYMPH POSE descriptions for classical erotic oil paintings. These are provocative, steamy figure study poses in the tradition of Waterhouse, Bouguereau, Frazetta. She is sensual, magnetic, confident. These will be inserted into a comma-separated image prompt — write them as comma-separated descriptive phrases.

Each entry: 12-20 words. A specific provocative pose described through composition and body line.

━━━ THE ENERGY ━━━
She is MAGNETIC. Every pose radiates sensuality through her body line — arched spines, the S-curve of her hip, arms stretched overhead, head tilted back. She touches herself with lazy confidence — fingertips trailing down her waist, hand in her own hair. Think the most provocative classical painting poses: Ingres' Odalisque, Titian's Venus, Klimt's reclining women.

━━━ CATEGORIES TO COVER ━━━
- Arched backward over stone, spine curved, throat to the sky, water glistening on her skin
- Rising slowly from dark water, arms lifted overhead, head tilted back, water streaming off her shoulders
- Reclining in shallow water, one knee bent, arms above her head, body forming a long sinuous S-curve
- Leaning forward from mossy ledge, wet hair heavy, looking up through dark lashes with burning intensity
- Pressed back against waterfall rock, chin lifted, water cascading down her shoulders
- Stretched on her side in warm moss, propped on elbow, free hand trailing down her own waist
- Standing waist-deep in moonlit pool, arms crossed behind her head, every curve silhouetted
- Kneeling at pool's edge, leaning back, spine deeply arched, hair dragging the water behind her
- Twisted to look over her shoulder, spine forming serpentine curve, wet skin catching firelight
- Floating face-up in dark water, hair spreading like a halo, arms drifting wide
- Seated at hot spring edge, leaning back, eyes closed, steam curling around her, lips slightly parted
- Draped stomach-down over moss-covered boulder, chin on arms, watching with smoldering half-closed eyes

━━━ CRITICAL BANS ━━━
- NO words: "nude", "naked", "bare", "exposed", "breast", "chest", "nipple"
- NO: "thighs apart", "legs spread", "straddling", "on all fours", "moaning"
- NO: "seductive pose", "come-hither", "beckoning the viewer", "posing for", "looking at the viewer"
- Describe the POSE through body line and composition — spine, shoulder, hip, silhouette
- Write as comma-separated descriptive phrases, NOT full sentences

━━━ RULES ━━━
- Every pose should be PROVOCATIVE and STEAMY through body line and composition
- She is always WET — water, steam, dew — skin glistening
- Emphasis on curves, arches, silhouette, the sculptural line of her body
- Frame as art composition — the body line and the feeling, not specific anatomy

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: primary body position (arched/reclining/rising/kneeling/standing/floating/twisted) + wet element (water/steam/dew/moonlight).

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
