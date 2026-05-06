#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dinobot/seeds/aerial_actions.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} ACTION descriptions for DinoBot's aerial-perspectives path. Each entry describes what's happening in the frame — flight motion or aerial-camera moment, 12-18 words.

━━━ ACTION CATEGORIES ━━━

PTEROSAUR FLIGHT (heavy emphasis):
- Soaring on thermal updrafts, wings locked flat, riding rising hot air with no wing-beat
- Mid wing-beat downstroke, membrane stretched taut, body propelled forward
- Banking hard around a mountain face, one wing-tip kissing rock
- Diving toward water, jaws open, wings half-folded for precision strike
- Mid-snatch — pulled fish from ocean surface, water-spray trailing wing-tips
- Cresting over a cliff edge into open updraft, wings just unfurling
- Gliding through canopy gap, wings raked back to fit between trunks
- Carrying prey/branch in feet back to nest, slow heavy wing-beats
- Mating display — wing-flutter and crest-display in mid-air, two pterosaurs circling
- Just-launched from a cliff, legs trailing, wings beating hard for altitude
- Hovering briefly over tide pool, wings cupping air for stationary lift
- Pack-flight in formation — multiple pterosaurs drafting in V across sky
- Buffeted by storm-front, struggling to maintain altitude, wing-tips bending
- Drinking on the wing — beak skimming surface of glassy water

CLIFF / ROOKERY:
- Colony departure at dawn — hundreds of pterosaurs lifting off cliff face simultaneously
- Returning to cliff nest at dusk, wings flared for landing brake
- Squabble between two pterosaurs at nesting ledge, wings flared in display

AERIAL-CAMERA OF GROUND DINOS:
- Helicopter-cam tracking a herd across open plain, dust trails visible from altitude
- Top-down view of a sauropod wading, neck-arc visible through clear water
- Drone-altitude view of a predator stalking through canopy gap
- Bird's-eye view of mosasaurus surfacing from clear shallows
- Aerial view of a kill-site with predator dragging prey, scavengers circling above

ATMOSPHERIC INTERACTIONS:
- Wing-shadow racing across landscape below as the pterosaur passes overhead
- Vapor cone from wing-tip in cold air, contrail-like trail
- Silhouetted against sun, wings catching backlight in translucent membrane glow
- Diving through cloud-layer, momentarily lost then re-emerging
- Buffeted by lightning-strike updraft, wings flailing for control

━━━ EVERY ENTRY MUST INCLUDE ━━━
- A specific flight verb (soaring / diving / banking / cresting / gliding) OR aerial-camera angle (helicopter / drone / bird's-eye / top-down)
- Wing/body language detail (membrane stretched / raked back / half-folded / cupping)
- Implied environment interaction (sky / cliff / water / canopy / ground)

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: primary flight-verb + body engagement + environment interaction.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
