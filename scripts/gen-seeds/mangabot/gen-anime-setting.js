#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/anime_setting.json',
  total: 200,
  batch: 50,
  append: true,
  maxTokens: 4000,
  metaPrompt: (n) => `Write ${n} ANIME SETTING descriptions for MangaBot's character paths. Each entry is 25-40 words. The "setting" is the immediate place + atmosphere where an anime character is out and about — NOT adventuring, just being in a beautifully-rendered slice-of-anime-life moment.

CONTEXT: Lush, vibrant, frame-worthy anime poster moments. Wonder, beauty, style. Draw from ALL anime genres: slice-of-life / shoujo / shonen / seinen / sports / fantasy / cyberpunk / historical / supernatural / magical-girl / cozy / urban. The character will be the LEAD subject, but the setting MUST be visually rich enough to share the spotlight.

Categories — rotate widely across these:
- Cafés / coffee shops (interior corner with rain-streaked window / outdoor table under awning / barista counter view / morning light through blinds)
- School settings (rooftop at sunset / classroom by window / hallway after dismissal / gym during practice / library aisle)
- Nature (cherry-blossom park path / forest stream stepping-stones / mountain trail with wildflowers / lakeside dock / autumn maple grove)
- Urban Japan (train platform / shopping arcade / convenience store interior / vending-machine alley / shrine torii gate / neon-lit shopping street / pedestrian crossing in rain)
- Festivals / events (matsuri food stalls / lantern-lit summer festival / fireworks on a riverbank / hanami picnic blanket / new-year shrine visit)
- Hot springs / onsen (steam-filled outdoor bath / wooden walkway / inn courtyard at dusk)
- Cozy interiors (small kotatsu room / minimalist apartment with city view / artist's cluttered studio / used-bookstore aisle)
- Cyberpunk (neon-soaked alley / rooftop overlooking neo-Tokyo / rain-wet street with holograms / arcade interior)
- Historical / fantasy (samurai-era teahouse / shrine maiden's path / fantasy village square / floating-island ruins / magic-academy library)
- Travel (bullet train interior view / ferry deck / countryside bus stop / station platform with departing train)

EVERY entry must include:
- Specific place type (named — café / rooftop / arcade / festival / onsen / etc.)
- Time-of-day or weather-of-the-moment hint (golden hour / morning fog / midday clear / rainy night / snowy dusk / fireworks-evening)
- 2-3 atmospheric anchor details (steam from cup / lanterns swaying / cherry petals drifting / neon reflections in puddles / kotatsu glow / etc.)
- Hint that NO crowd is needed — empty-or-near-empty so the character is the lead

ABSOLUTELY BANNED:
- NO combat / NO violence / NO weapon-drawn (this is "out and about")
- NO crowded scenes (one or two distant figures OK; never busy)
- NO interior-of-a-house generic-living-room (boring); always a specific evocative place
- NO "training" / "fighting" / "questing" framing
- NO modern Western-only settings (this is anime aesthetic — Japan-coded or anime-fantasy)

Examples (write fresh):
- "Small wood-paneled café interior at golden-hour, single window seat near rain-streaked glass, steam rising from a ceramic cup on the table, soft amber pendant lights, an empty bentwood chair across the table, jazz vinyl crackling distantly"
- "School rooftop at twilight with fading violet sky, chain-link fence wrapping the perimeter, cherry blossom petals drifting in the soft breeze, water tower silhouetted against dusk, distant neon signs flickering on across the city below"
- "Neon-soaked Tokyo alley at midnight after rainfall, pavement reflecting pink-and-cyan signs, vending machines glowing pale blue, steam rising from a metal grate, narrow corridor of izakaya lanterns and hand-painted signage extending into the distance"
- "Forest shrine path at morning mist, weathered stone torii gates receding into the white haze, mossy stone lanterns lining the steps, cedar trunks rising into low clouds, bird-call echoing distantly through the silence"

Output ONLY a valid JSON array of ${n} strings (25-40 words each). No preamble, no commentary.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
