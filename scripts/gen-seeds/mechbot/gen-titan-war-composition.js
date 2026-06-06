#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mechbot/seeds/titan_war_composition.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} VERTIGO-INDUCING CAMERA-COMPOSITION descriptions for MechBot's titan-war-machines path. Each describes a specific cinematic camera-angle for a KILOMETER-SCALE COMBAT TITAN. Pacific Rim / 40K Imperator / AT-AT / Attack on Titan colossus lineage. The scale gap between titan and ground-level reference (humans / vehicles / buildings / jets) IS the punchline — composition must MAKE THE VIEWER FEEL THE SCALE.

Each entry: 28-46 words. Format: "ANGLE-NAME-IN-CAPS — full multi-clause camera-angle description naming the camera position, what fills the frame, what's used as a scale-prover, the resulting vertigo / awe / scale-collapse feeling." Comma-separated phrases.

━━━ THE BAR ━━━
Every entry must induce VERTIGO — neck-craned, jaw-dropped, "how is something that big real" feeling. Camera positioned at HUMAN-scale or VEHICLE-scale (or extreme low / high) with the titan towering at impossible proportion. SCALE PROVER mandatory — a person / car / building / jet / cloud-layer / mountain — to give the viewer ONE familiar-scale thing they can measure the titan against.

━━━ VARIETY MANDATE (~16 camera-position families across the batch) ━━━

- WORM'S-EYE UP THE SHIN/LEG (camera flush against ground looking straight up, foot dominating, leg receding into vanishing point)
- FLY-BETWEEN-LEGS (camera at ground level between two leg-columns mid-stride, fleeing convoy visible through the gap)
- KAIJU-STEP-DESCENDING (foot hammering downward, concrete erupting in pressure-ring, shock-fractures racing to camera)
- AERIAL-ORBIT-AROUND-HEAD (camera at titan's skull altitude banking around cranial silhouette, jets reduced to gnats)
- DWARFED-SKYLINE-ESTABLISHING (wide cinematic frame, skyline reaching only to knee, atmospheric haze layering distance)
- SLOT-CANYON-BETWEEN-BUILDINGS (camera in alley between glass towers, titan's shin filling the slot of sky above)
- CRACKED-PAVEMENT-FOREGROUND (extreme low POV, buckled asphalt + overturned transport in foreground, knee clears thirty-story block)
- HELICOPTER-PASS ALONGSIDE TORSO (camera at jet altitude tracking ribcage plating, ground reduced to circuit-board)
- CLIFF-EDGE-VANTAGE (camera at human eye on cliff rim, titan rising from water, waist clears clifftop)
- MID-FALL-CAMERA (POV tumbling in free-fall past titan's chest, armor streaking upward through motion-blur)
- SCRAPING-CLOUD-LAYER (cloud-deck altitude, titan's skull and shoulders punching through overcast, jets at cloud-line)
- OVER-THE-SHOULDER-FROM-SOLDIER (POV behind single infantryman in rubble, titan fills entire background sky)
- BENEATH-THE-FALLING-FOOT (camera looking up as foot descends from zenith, sky vanishing section by section)
- STREET-LEVEL-WITH-DEBRIS (camera at ankle height, frozen falling-facade chunk in foreground, hip-joint cresting tower-height)
- AERIAL-WIDE-WITH-JETS-IN-FOREGROUND (high-altitude with squadron of strike-fighters in foreground formation, titan dwarfs wingspans)
- DRONE-AT-WAIST-CIRCLE (drone POV orbiting at titan's waist altitude, panel-rivets museum-detail-sharp, cityscape miles below)
- BANK-CAMERA-MOUNTAIN-PEAK (camera mounted on alpine peak, titan walking across valley floor, mountain-range used as ruler)
- LOOKING-PAST-BARN-FAMILY (camera through farmhouse doorway, family silhouetted against horizon, titan's silhouette beyond)
- OCEAN-SURFACE-BREAK (camera at sea-level, titan rising from ocean, container-ships dwarfed beside calf)
- BOMBER-WING-POV (camera mounted on bomber's wing, titan's torso fills frame at matched altitude, formation-mates as scale)
- PAVED-PLAZA-RECEDING (camera at ground level in central plaza, titan walking away, footprints crushed into ground)
- TUNNEL-MOUTH-FRAMED (camera deep in subway tunnel, mouth-arch framing titan beyond, commuters running toward camera as scale)
- HIGH-RISE-WINDOW-INTERIOR (camera inside office tower, executive desks in foreground silhouette, titan filling view-window)
- DUST-CLOUD-RECEDING-WAKE (camera in titan's pulverized wake, dust-cloud filling frame, ground reduced to broken pulp under each footprint)

━━━ MUST INCLUDE per entry (CHECKLIST — all 4) ━━━
1. CAMERA POSITION explicitly named (worm's-eye / aerial / drone / over-shoulder / fly-between-legs / etc.)
2. FRAME-DOMINATION (what fills the frame — foot / shin / torso / head / silhouette)
3. SCALE-PROVER (named referent — person / jet / building / mountain / car / convoy / cloud-layer)
4. VERTIGO PAYOFF (the feeling — neck-crane / free-fall / silhouette-overwhelm / impossibility)

━━━ BANS ━━━

- NO closeup / portrait / bust language — titan is BIG and FAR
- NO interior / clean studio — outdoor combat scale always
- NO Pacific Rim / Jaeger / Kaiju / Imperator / Eva / Mech-X4 BY NAME
- NO Star Wars AT-AT / AT-ST / IP language
- NO "intimate" / "quiet" / "contemplative" register — biblical-war-scale only
- NO scale-prover OMITTED — every entry names ONE measurable referent
- NO bilateral symmetry repeat angle — vary the camera position each entry

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering. One full composition description per string. Each starts with the angle-name in CAPS, em-dash, then the body. Comma-separated phrases.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
