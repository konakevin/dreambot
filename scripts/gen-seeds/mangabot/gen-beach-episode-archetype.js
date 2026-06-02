#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/beach_episode_archetype.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} BEACH-EPISODE ARCHETYPE entries — characters mid-summer-vacation. K-On!/Free!/Lucky-Star/Nichijou bright-joy register. MIX GENDERS roughly 50/50.

Each 12-22 words. Role + summer-vacation-coded tone + signature visual.

VARIETY:
- 14% ENERGETIC-GIRL (sporty-summer leader / class-genki running ahead / pep-squad on vacation)
- 12% SHY-BOY (quiet bookish boy adjusting glasses / introvert with sketchbook on towel / reserved senior)
- 12% SWIM-CLUB-SURFER (swim-team boy with goggles / surf-club girl with board under arm / freestyle racer)
- 10% OLDER-SISTER-TYPE (responsible upperclassman with sunscreen / mom-friend with cooler / club-captain organizing)
- 10% SHY-KID (younger sibling clutching float-ring / first-time-beachgoer nervous / cousin tagging along)
- 8% SPORTY-TWIN (matching-rashguard siblings / twin-tail volleyball duo / brother-and-sister pair)
- 8% FOOD-VENDOR (shaved-ice cart attendant in apron / yakisoba-stall server / coconut-vendor)
- 6% BEACH-CLEANER/LIFEGUARD (lifeguard boy on duty / beach-patrol with whistle / cleanup volunteer)
- 6% PHOTOGRAPHER-FRIEND (camera-toting yearbook kid / film-camera enthusiast / phone-photographer)
- 6% NATURALIST (tide-pool collector with bucket / shell-hunter girl / crab-spotter boy)
- 4% TEACHER-CHAPERONE (young homeroom teacher in modest swim-cover / coach in tracksuit / mentor-figure)
- 4% MUSICIAN (ukulele-strummer on sand / guitarist by bonfire / harmonica-player at dusk)

DO write:
- Energetic genki girl on swim-club trip with arm raised in cheer, register: pure-joy
- Shy bookish boy adjusting glasses under parasol with manga in lap, register: quiet-content
- Swim-club captain boy with goggles up and whistle, register: focused-sporty
- Older-sister upperclassman organizing cooler-spread on towel, register: gentle-warm
- Shaved-ice cart attendant girl in striped apron mid-scoop, register: cheerful-busy
- Lifeguard boy on chair scanning horizon with whistle, register: alert-friendly
- Tide-pool collector kid crouched with bucket inspecting shell, register: curious-wonder
- Twin-sibling pair in matching rashguards mid-high-five, register: sibling-bond

DO NOT: cheesecake / "voluptuous" / "sultry beauty" / "bombshell" / pin-up-coded / oiled-skin / bikini-thong models. Multiple per entry.

Return ONLY JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
