# DragonBot — New Paths Build Plan (2026-06-10)

**Brief (Kevin):** DragonBot needs more *dragons* and high-fantasy paths. "Any nerd who likes reading high fantasy should be a kid in a candy store." Currently it isn't.

**Audit finding:** Of 15 active paths, **only `dragon-scene` has a dragon as the hero**. 8 are character paths, ~6 are landscape/architecture. The bot is starved of dragons + deep fantasy. This plan adds **17 new paths** across 3 tiers to fix that.

**Workflow per path (the proven StarBot recipe):**
1. Bespoke archetype (`archetypes.js`) + template (`archetype-templates.js`)
2. Path file `paths/<name>.js` = `{ archetype, pools }`
3. 6 bespoke pool recipes in `gen-dragonbot-pool.js` → gen **MVP-25** each (programmatic dedup)
4. Wire `pools.js` + `index.js` (pathBuilders, paths, promptPrefixByPath, sensory, polish-skip, chaos-skip)
5. Post a **5-batch** for Kevin to test in isolation; inspect my own results
6. Tweak **≤2 rounds** if it drifts, then flag + move on
7. Commit per path (or per small group) as a checkpoint. Scale pools 25→200 only after Kevin's review.

**DragonBot conventions:** minimal wrappers (`promptPrefix: ''`), per-path painterly `promptPrefixByPath`, gpt-2 → `dragonbot_gpt_clean` clean medium, declarative archetype system (same as StarBot).

---

## STATUS

| # | Tier | Path | Built | Pools@25 | Posted | Tweaks | Committed | Scaled@200 |
|---|------|------|:-----:|:--------:|:------:|:------:|:---------:|:----------:|
| 1 | 1 | dragon-rider | ✅ | ✅ | ✅ | 3 | ✅ | ✅ |
| 2 | 1 | ~~dragon-hoard~~ | ❌ KILLED | – | – | 2 | ✅ | – |
| 3 | 1 | dragon-battle | ✅ | ✅ | ✅ | 0 | ✅ | ✅ |
| 4 | 1 | dragon-flight | ✅ | ✅ | (skip) | 0 | ✅ | ✅ |
| 5 | 1 | dragon-brood | ✅ | ✅ | ✅ | 4 | ✅ | scaling |
| 6 | 1 | dragon-breeds | ✅ | ✅ | ✅ | 0 | ✅ | scaling |
| 7 | 2 | clash-of-armies | ✅ | ✅ | ✅ | 1 | ✅ | scaling |
| 8 | 2 | magic-unleashed | ✅ | ✅ | ✅ | 0 | ✅ | (bulk) |
| 9 | 2 | mythic-bestiary | ✅ | ✅ | ✅ | 0 | ✅ | (bulk) |
| 10 | 2 | fae-court | ⬜ | ⬜ | ⬜ | – | ⬜ | ⬜ |
| 11 | 2 | dungeon-delve | ⬜ | ⬜ | ⬜ | – | ⬜ | ⬜ |
| 12 | 2 | necromancer | ⬜ | ⬜ | ⬜ | – | ⬜ | ⬜ |
| 13 | 3 | wizard-tower | ⬜ | ⬜ | ⬜ | – | ⬜ | ⬜ |
| 14 | 3 | dwarven-hold | ⬜ | ⬜ | ⬜ | – | ⬜ | ⬜ |
| 15 | 3 | elven-city | ⬜ | ⬜ | ⬜ | – | ⬜ | ⬜ |
| 16 | 3 | sky-castle | ⬜ | ⬜ | ⬜ | – | ⬜ | ⬜ |
| 17 | 3 | arcane-library | ⬜ | ⬜ | ⬜ | – | ⬜ | ⬜ |

---

## PATH DESIGNS (axes per path)

### TIER 1 — DRAGONS as the hero (the core fix)

**1. dragon-rider** — a rider mounted on a dragon in flight or battle (the iconic image).
- `dragon` (the mount: breed + anatomy + scale-color) · `rider` (the figure: armor/class/pose) · `action` (soaring / diving / takeoff / mid-battle / banking through cloud) · `setting` (epic biome + sky) · `mount_detail` (saddle/reins/wing-membrane) · *cond 40%* `drama` (fire-breath / storm / enemy riders / a flock)

**2. dragon-hoard** — a colossal dragon coiled on a mountain of treasure in its lair.
- `dragon` (the hoard-keeper, coiled/draped) · `hoard` (gold mounds / gems / crowns / weapons / artifacts) · `lair` (volcanic cavern / crystal grotto / ruined vault / cathedral-cave) · `dragon_pose` (sleeping / roused / guarding / one eye open) · `lair_light` (treasure-glow / lava / crystal / shaft of light) · *cond 40%* `intruder` (a tiny thief / knight / a single egg)

**3. dragon-battle** — a dragon mid-combat: fire on a castle/army, or two dragons clashing.
- `dragon` (the combatant) · `combat_action` (breathing fire / strafing / clawing / mid-clash / seizing prey) · `target` (besieged castle / army / knights / a rival dragon) · `battle_setting` (siege / battlefield / storm-sky) · `breath_effect` (fire / frost / lightning) · *cond 40%* `drama` (collapsing tower / catapults / a hero's last stand)

**4. dragon-flight** — a majestic dragon soaring over an epic vista (aerial; distinct from dragon-scene's grounded subject).
- `dragon` (the flyer) · `flight_pose` (soaring / banking / diving / climbing / gliding low) · `vista_below` (mountains / sea / forest / a distant city / canyon) · `sky` (sunset / storm / sea of cloud / aurora / dawn) · `wing_moment` (sun through membrane / mist trailing / wing-tip near a peak) · *cond 40%* `drama` (a flock / a storm / sunbeams / a distant castle)

**5. dragon-brood** — many dragons: a wheeling flock, a roost, a brood + parent.
- `brood_subject` (wheeling flock / cliff roost / nesting brood + mother / a migration) · `setting` (volcanic spires / besieged city sky / ancient mountain roost / a dragon graveyard) · `dominant_dragon` (the largest / the leader / the mother) · `brood_activity` (circling / roosting / mass take-off / feeding hatchlings) · `sky_atmosphere` · *cond 40%* `drama`

**6. dragon-breeds** — varied dragon species as portrait-heroes (a bestiary engine).
- `breed` (frost wyrm / fire drake / sea serpent / Eastern feathered / storm-dragon / forest/moss dragon / bone-dragon / volcanic / crystalline / shadow) · `signature_feature` (what defines this breed) · `habitat` (matching biome) · `breed_pose` (regal portrait / menacing rear / coiled / mid-roar) · `element_effect` (frost breath / lightning / bioluminescence) · *cond 40%* `drama`

### TIER 2 — high-fantasy candy store (beyond dragons)

**7. clash-of-armies** — massed fantasy battle, siege, banners, war-magic.
- `armies` (men vs orcs / undead horde / elf host / dwarves) · `battle_action` (charge / siege-assault / shield-wall clash / last stand) · `battlefield` (castle siege / open field / mountain pass / burning city) · `war_magic` (battle-spells / fireballs / explosions / banners) · `scale_detail` (thousands of troops, siege engines) · *cond 40%* `drama` (a dragon overhead / a hero / a breaking line)

**8. magic-unleashed** — a colossal spell event: summoning, portal, wizard's duel, ritual.
- `spell_event` (summoning / portal tear / meteor-fall / wizard's duel / forbidden ritual / time-stop) · `caster` (the wizard/figure or two duelists) · `magic_effect` (arcane energy / runes / elemental storm / reality-warp) · `setting` (arcane circle / ruin / tower-top / battlefield) · `magic_scale` (sky-filling / colossal) · *cond 40%* `drama`

**9. mythic-bestiary** — non-dragon high-fantasy monsters as heroes.
- `creature` (griffon / kraken / treant / phoenix / troll / demon / basilisk / chimera / giant / hydra) · `creature_detail` (anatomy/texture/glow) · `creature_action` (rearing / emerging / mid-attack / regal) · `habitat` (matching biome) · `encounter` (a tiny adventurer/knight for scale) · *cond 40%* `drama`

**10. fae-court** — high elves, fae courts, enchanted glades, ethereal beings.
- `fae_subject` (elven monarch / fae court / sprite swarm / a single ethereal being) · `enchanted_setting` (moonlit glade / mushroom ring / crystal grove / blossom court) · `ethereal_detail` (gossamer wings / glowing motes / flowering crowns) · `fae_atmosphere` (moonlight / bioluminescence / drifting petals) · `surprise` (a deer / a will-o-wisp / a tiny door) · *cond 40%* `drama`

**11. dungeon-delve** — adventurers in torch-lit depths, treasure, lurking monsters.
- `dungeon` (crypt / cavern / ruined vault / sewer / sunken temple) · `party` (a small adventuring party with torches/lanterns) · `dungeon_detail` (treasure chest / bones / traps / glowing runes / a sarcophagus) · `lurking_threat` (eyes in the dark / a monster half-seen / a guardian) · `torch_mood` (torchlight / crystal-glow / shaft of light) · *cond 40%* `drama`

**12. necromancer** — lich, undead legion, bone-dragon, dark fantasy.
- `undead_subject` (lich / death-knight / undead horde / bone-dragon / wraith-lord) · `dark_setting` (cursed crypt / blighted field / necropolis / ritual chamber) · `necro_magic` (green soul-flame / dark runes / raising the dead) · `undead_detail` (skeletons / wraiths / bone-banners) · `dark_atmosphere` (sickly green glow / fog / blood-moon) · *cond 40%* `drama`

### TIER 3 — adjacent high-fantasy locales

**13. wizard-tower** — a wizard's tower, interior or exterior, dense with arcana.
- `tower` (spire / floating / cliffside / gnarled / ruined) · `arcane_detail` (orbs / floating books / experiments / star-charts / a great lens) · `tower_setting` (stormy peak / enchanted forest / floating isle / city rooftop) · `magic_atmosphere` · `occupant` (a tiny wizard / a familiar / an apprentice) · *cond 40%* `drama`

**14. dwarven-hold** — a dwarven forge-hold / underground kingdom.
- `hold` (great forge / vast mountain hall / deep mine / runic throne-hall) · `dwarven_detail` (anvils / gold-veined stone / runes / colossal carved pillars / lava channels) · `forge_activity` (sparks / molten metal / smiths at work) · `hold_scale` (cathedral-vast underground) · `occupant` (tiny dwarves) · *cond 40%* `drama`

**15. elven-city** — an elven treetop / crystalline city.
- `elven_city` (treetop city / crystal spires / waterfall city / moonlit haven) · `elven_detail` (graceful arches / glowing trees / slender bridges / living architecture) · `city_setting` (ancient forest / cliffs over a lake / a vale) · `elven_atmosphere` (ethereal light / fireflies / dawn-mist) · `occupant` (tiny elves) · *cond 40%* `drama`

**16. sky-castle** — a floating castle / sky-kingdom.
- `sky_structure` (floating castle / chain of sky-isles / cloud-city / airborne fortress) · `structure_detail` (waterfalls pouring into sky / hanging chains / spires / sky-bridges) · `sky_setting` (above a sea of cloud / among floating isles / aurora sky / golden dawn) · `sky_atmosphere` · `scale_prover` (airships / dragons / tiny figures) · *cond 40%* `drama`

**17. arcane-library** — the great arcane library / hall of knowledge.
- `library` (endless vertical stacks / floating-book hall / star-dome reading room / forbidden archive) · `arcane_detail` (glowing tomes / a great orrery / floating scrolls / candle-lit desks) · `library_scale` (cathedral-vast, vertiginous) · `occupant` (a tiny scholar / robed figures / a librarian) · `library_atmosphere` (dust-mote shafts / candlelight / arcane glow) · *cond 40%* `drama`

---

## NOTES / LESSONS (updated as we build)
- _(per-path tweaks + failure modes recorded here as we go)_
