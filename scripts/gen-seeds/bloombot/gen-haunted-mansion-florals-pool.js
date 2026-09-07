#!/usr/bin/env node
// AlphaBot — haunted-mansion-florals candidate path (prototyped for eventual
// promotion to BloomBot, per BOT_SCENE_QUALITY_PLAYBOOK.md / ALPHABOT.md).
//
// Wild, overgrown flowering vines — ivy, dark climbing roses, dried trailing
// vine — consuming an elegant old estate structure (wrought-iron gate,
// mansion facade, garden wall) at moody, fog-touched dusk. Gothic-romantic
// and elegant, NEVER derelict or genuinely scary. MVP-25, four generated
// pools:
//   - structure     : the architectural anchor + how florals consume it
//                      (the base "world" of the shot)
//   - signature     : MONEY-SHOT axis — the one unmistakably iconic floral
//                      moment/detail that anchors the render
//   - atmosphere    : the fog-touched dusk lighting condition
//   - decay_detail  : one small elegant-patina texture detail
//
// Run: node scripts/gen-seeds/alphabot/gen-haunted-mansion-florals-pool.js
const { generatePool } = require('../../lib/seedGenHelper');

const DIR = 'scripts/bots/bloombot/seeds/';

(async () => {
  await generatePool({
    outPath: DIR + 'haunted_mansion_florals_structure.json',
    total: 120,
    batch: 25,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (
      n
    ) => `You are a fine-art gothic-floral concept artist writing STRUCTURE vignettes for BloomBot's Halloween "haunted-mansion-florals" path — an elegant old estate structure being wildly, beautifully consumed by climbing florals. Each entry describes ONE specific architectural anchor + how ivy/roses/dried vine climb, wrap, or cascade over it + one spatial depth cue (what stays crisp up close vs what recedes into fog/dusk behind). Write ${n} entries, ~30-55 words each, one or two flowing sentences (no semicolon-clause format needed here — full prose sentences).

Example entries (this exact format/length, adapt the CONTENT, never reuse verbatim):
"A tall wrought-iron entrance gate stands ajar between two moss-softened stone pillars, its scrollwork nearly swallowed by climbing ivy and thick ropes of dried vine; the gate frames a misty drive receding into deep violet dusk."
"A mansion's grand facade rises pale behind a curtain of dark climbing roses threading through every tall arched window frame, the upper stories fading into soft fog while the lower ivy-choked stonework stays crisp and close."
"An iron garden gazebo, its domed frame nearly lost beneath cascades of trailing dried vine and rose canes, stands alone in a clearing with the misty tree line dissolving into blue-grey dusk behind it."

━━━ ARCHITECTURAL-ANCHOR VARIETY — rotate across ALL of these, never cluster on one ━━━
1. A tall wrought-iron entrance gate between stone pillars
2. A pair of iron garden gates hanging slightly ajar
3. A mansion's grand front facade with tall arched windows
4. A columned veranda or portico
5. An arched garden doorway set into a high stone wall
6. A decorative iron balcony railing
7. A glass-and-iron conservatory frame (most panes intact, a few missing)
8. A tall windowsill with old shutters
9. A stone garden wall with a statue niche or alcove
10. An ornate iron gazebo frame
11. A manor's round tower turret exterior wall
12. A grand iron entrance archway with a hanging lantern hook
13. A stone garden folly or small temple facade
14. An iron fence with decorative pickets running along a drive
15. A carriage-house facade with a loft door
16. A sundial pedestal and low garden wall
17. A wide stone staircase leading up to a columned entrance
18. A wrought-iron greenhouse door standing open
19. A low iron kissing-gate at a garden's edge
20. A stone bridge railing over an ornamental pond

━━━ MANDATORY IN EVERY ENTRY ━━━
- Name the specific structure clearly
- A specific verb for how the florals interact with it (swallowing, threading through, spilling from, curling around, cascading over, consuming)
- ONE spatial/depth cue naming what's near vs what recedes into fog/dusk behind
- Weathering language stays CHARMING ("moss-softened", "weathered", "aged") — never "crumbling", "ruined", "rotting", "abandoned", or "derelict" as the dominant mood

🚫 STRICT BANS: NO people, NO ghosts/skeletons/witches, NO jack-o'-lanterns or costume-Halloween props, NO blood or gore, NO IP-named locations, NO brand names, NO readable text, NO photographer/camera-brand names, NO negation phrasing ("not scary" etc — just write it elegant and gothic-romantic).

Output ONLY a JSON array of ${n} strings, no preamble, no numbering, no markdown fences.`,
  });

  await generatePool({
    outPath: DIR + 'haunted_mansion_florals_signature.json',
    total: 120,
    batch: 25,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (
      n
    ) => `You are writing the MONEY-SHOT signature-floral-moment axis for BloomBot's "haunted-mansion-florals" Halloween path. Each entry describes ONE specific, unmistakably ICONIC floral detail or moment — the single most eye-catching thing in the frame, the detail that must anchor the render when it appears. Write ${n} entries, ~20-40 words each.

Example entries (this exact format/length, adapt the CONTENT, never reuse verbatim):
"A single oversized black-red rose bursts directly through the iron gate's scrollwork, petals velvet-dark and dew-beaded, unmistakably the eye's first stop."
"A dense curtain of trailing wine-dark roses cascades over a broken windowsill, each bloom heavy and glossy, spilling almost to the ground."
"A crown of thorned rose canes arches over the very top of the gate like a natural iron finial, silhouetted against the last violet light."

━━━ SIGNATURE-MOMENT VARIETY — rotate across ALL of these, never cluster on one ━━━
1. One oversized black-red or wine-dark rose bursting directly through iron scrollwork
2. A dense curtain of trailing dark roses cascading over a windowsill or ledge
3. A single moonlit white or silver rose cluster glowing pale against dark ironwork
4. A thick rope of dried vine coiled around an iron bar, studded with rust-orange rosehips
5. A cluster of deep-burgundy roses spilling through a gap in iron pickets, dew-beaded
6. A single perfect dark rose resting on a stone ledge, spotlit by a shaft of dusk light
7. Ivy tendrils reaching across open space between two iron bars, backlit by amber window-glow
8. A crown of thorned rose canes arching over a gate's top like a natural finial
9. A cascade of wine-dark roses pouring down a broken window like a floral waterfall
10. A dried, silvered vine wreath hanging on an iron door, still threaded with dark roses
11. A cluster of climbing roses gripping a cracked stone urn, spilling over its rim
12. A shaft of dusk light catching one perfect dew-beaded rose amid a wall of shadowed ivy
13. A twist of silvery, feathery dried clematis seed-heads tangled through black iron scrollwork
14. A single rose-choked iron finial silhouetted against a fog-lit sky
15. A deep tangle of ivy and rose parting like a curtain around a dark doorway
16. A single dark rose growing improbably from a crack in weathered stone
17. A thick braid of ivy and rose cane wrapped like a garland around a column
18. A cluster of dark roses framing a stained-glass window pane, backlit warm from within
19. A trailing rope of dried vine looping between two finials like a swag of garland
20. A single luminous rose caught mid-bloom against a wall of near-black ivy shadow

━━━ MANDATORY IN EVERY ENTRY ━━━
- Name the SPECIFIC flower/vine (rose color/variety, ivy, dried vine, clematis, rosehip — never generic "flowers")
- Describe it as ONE vivid, camera-worthy moment, not a whole scene
- Elegant and painterly language — dark rose color described as "black-red", "wine-dark", "burgundy" — NEVER compared to blood or gore

🚫 STRICT BANS: NO people, NO horror props, NO blood/gore comparisons, NO IP-named locations, NO brand names, NO readable text, NO photographer/camera-brand names, NO negation phrasing.

Output ONLY a JSON array of ${n} strings, no preamble, no numbering, no markdown fences.`,
  });

  await generatePool({
    outPath: DIR + 'haunted_mansion_florals_atmosphere.json',
    total: 120,
    batch: 25,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (
      n
    ) => `You are writing the ATMOSPHERE/LIGHT axis for BloomBot's "haunted-mansion-florals" Halloween path — the moody, fog-touched dusk lighting condition for a gothic-romantic garden scene. Each entry describes sky + fog/mist + light quality + one specific light-source detail. Write ${n} entries, ~15-35 words each.

Example entries (this exact format/length, adapt the CONTENT, never reuse verbatim):
"Thin silver fog pools ankle-deep around the gate's base, glowing faintly where a single unseen window spills warm amber light through the mist."
"A fat harvest moon hangs low behind drifting fog, rimming every iron edge and rose petal in pale cool light."
"Deep violet dusk settles over the scene, the first stars just visible, while a faint golden glow bleeds from a distant lit window."

━━━ ATMOSPHERE VARIETY — rotate across ALL of these, never cluster on one ━━━
1. Thin fog pooling ankle-deep at the structure's base
2. Deep violet dusk sky with the first stars appearing
3. A fat harvest moon low and glowing behind drifting fog
4. Warm amber window-glow bleeding out through fog
5. Soft blue-grey mist drifting between the ironwork or columns
6. A single antique lamp casting warm pools of light against cool fog
7. Last shafts of golden sunset light cutting through drifting mist
8. Cool moonlight silvering wet stonework, fog low across the ground
9. A hush of still night air lit only by faint starlight
10. Fog thick enough to soften the whole background into a pale wash
11. Warm candlelight glow spilling from a single unseen window
12. Overcast dusk with a diffuse silver-grey light and no hard shadows
13. Fireflies or drifting will-o'-wisp sparks catching light in low mist
14. Rain-damp stone reflecting a faint moonlit sheen through fog
15. A break in the fog revealing a deep indigo starfield above
16. Pale dawn-grey light just before true dusk, mist still clinging low
17. A single shaft of moonlight cutting cleanly through a gap in fog
18. Deep blue "witching hour" twilight, the sky not yet fully dark
19. Warm torchlight-orange glow reflecting off wet ivy leaves through thin mist
20. A slow, heavy fog bank rolling in from one side of the frame

━━━ MANDATORY IN EVERY ENTRY ━━━
- Name the sky/dusk state
- Name the fog or mist behavior
- Name ONE specific light source and its color/quality
- The mood is MOODY and ELEGANT — always enough light for detail to read, NEVER pitch-black or jump-scare-dark

🚫 STRICT BANS: NO people, NO horror props, NO IP-named locations, NO brand names, NO readable text, NO photographer/camera-brand names, NO negation phrasing.

Output ONLY a JSON array of ${n} strings, no preamble, no numbering, no markdown fences.`,
  });

  await generatePool({
    outPath: DIR + 'haunted_mansion_florals_decay_detail.json',
    total: 120,
    batch: 25,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (
      n
    ) => `You are writing the ELEGANT-DECAY DETAIL axis for BloomBot's "haunted-mansion-florals" Halloween path — ONE small architectural or material texture detail that grounds the "elegant, gently weathered, NOT derelict" balance. Each entry describes a single concrete object/material detail with florals interacting with it — never the whole scene. Write ${n} entries, ~15-35 words each.

Example entries (this exact format/length, adapt the CONTENT, never reuse verbatim):
"A tarnished bronze lion's-head door-knocker peers out from a curtain of ivy, one ear nearly swallowed by a trailing leaf."
"A cracked marble urn beside the step spills a fountain of dried vine and rosehips down its weathered flank."
"A patina-green copper lamp post stands wrapped ankle to crown in climbing ivy, its glass long gone but its iron frame proud."

━━━ DETAIL VARIETY — rotate across ALL of these, never cluster on one ━━━
1. A tarnished bronze door-knocker (lion's head, gargoyle, or floral motif) half-swallowed by ivy
2. A cracked marble urn spilling trailing vines like a fountain
3. A weathered stone cherub or angel statue draped in ivy
4. A stained-glass transom window, most panes intact, roses climbing the leadwork
5. A wrought-iron lamp post with vines coiled up it like a living flame
6. A verdigris-green bronze plaque nearly hidden behind leaves
7. A worn stone step softened by moss and fallen petals
8. A rusted iron weathervane, still turning, wreathed in dried vine
9. An old iron boot-scraper by the door, moss-grown
10. A cracked flagstone path disappearing under a carpet of ivy
11. A faded painted shutter, one hinge loose, roses growing through the slats
12. An antique iron lantern hook, vine-wrapped, swinging empty
13. A worn stone sundial half-hidden in climbing roses
14. A patina-green copper gutter or downspout laced with vine
15. A chipped stone finial atop a gatepost, crowned with a single flower cluster
16. A weathered wooden garden bench, one slat replaced by a thick vine
17. An old iron bell mounted beside the door, tangled in climbing rose cane
18. A cracked terracotta planter overflowing with trailing ivy at the base of a column
19. A worn brass house-number plaque, half-obscured by a curtain of leaves
20. A stone birdbath gone mossy-green, rimmed with fallen petals

━━━ MANDATORY IN EVERY ENTRY ━━━
- Name ONE specific object/material with a texture word (tarnished, weathered, patina, worn, cracked, verdigris — NEVER "crumbling", "ruined", "rotting", "decrepit")
- Show florals interacting with it (draped, threaded, spilling, wrapped, climbing through)
- Reads as CHARMING PATINA and craftsmanship, never disrepair

🚫 STRICT BANS: NO people, NO horror props, NO IP-named locations, NO brand names, NO readable text, NO photographer/camera-brand names, NO negation phrasing.

Output ONLY a JSON array of ${n} strings, no preamble, no numbering, no markdown fences.`,
  });
})();
