#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/ghibli_character_role.json',
  total: 200,
  batch: 15,
  append: true,
  metaPrompt: (n) => `Write ${n} CHARACTER-ROLE entries for a MangaBot ghibli-countryside keyframe. Each entry describes the figure(s) in the frame BY ROLE only, never named. Studio Ghibli rural archetypes — Kiki / Mei / Satsuki / Chihiro / Sheeta / Granny Sosuke / Mononoke village kids. No urban, no armor, no weapons.

Each entry: 10-22 words. Specifies role + outfit + bearing. SOLO mostly; OCCASIONAL pair.

GHIBLI RURAL ROLE DISTRIBUTION:
- 22% WANDERING GIRL (with satchel / parasol / sketchbook — Kiki/Chihiro/Sheeta vibe)
- 16% YOUNG COUNTRYSIDE BOY (curious explorer with hat / fishing rod / walking stick)
- 14% OLD GRANDMA / OBAACHAN (white-haired, kimono / yukata / cardigan, slow movement)
- 10% VILLAGE CHILDREN (one or two small kids playing / chasing / observing)
- 9% YOUNG WOMAN GARDENING (rural-worker garb, hands-in-soil energy)
- 8% TEA-FARMING / RICE-PLANTING ADULT (work-clothes, straw hat, basket)
- 7% TRAVELER WITH PARASOL (kimono-clad walker, parasol-shaded, satchel)
- 6% SHRINE MAIDEN / MIKO (red-and-white miko-robe in pastoral setting)
- 4% PAIR — INTERGENERATIONAL (child + grandma, or two siblings)
- 4% LONE FARMER WITH ANIMAL (gentle cow / goat / chicken nearby)

DO write:
- A wandering girl in a sky-blue dress with a leather satchel slung across her shoulder, dust-touched hem
- A young countryside boy in a faded straw hat with a wooden walking stick, shorts and a button-up tucked in
- An elderly grandma in a soft-grey kimono leaning slightly on a wooden cane, hair tied in white bun
- Two village children, one in a yellow sundress and one in patched shorts, laughing mid-chase
- A young woman in a faded rural smock, hands soil-stained, hair tied back in a kerchief
- A traveler with a paper parasol in a pale-yellow kimono, satchel and walking-staff in hand
- A young shrine maiden in red-and-white miko-robe walking through a pastoral garden, prayer-beads visible
- A pair — small girl in red overalls walking hand-in-hand with elderly grandmother in pale-grey yukata
- A lone farmer in indigo work-clothes and a wide straw hat, walking beside a brown cow

DO NOT write:
- Named characters (Kiki / Mei / Chihiro / etc.)
- Modern dress / urban / military / cyberpunk
- Armor / weapons / heroic combat poses
- Adult sexuality / fetishy framing
- Specific facial features locking a particular look
- Multiple-figure groups (>3) — usually 1, occasionally 2

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
