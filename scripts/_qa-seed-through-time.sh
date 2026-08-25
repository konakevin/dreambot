#!/usr/bin/env bash
# QA-seed the Through Time slice to the LOCATION_SEED_PLAYBOOK bar.
# Run AFTER recipes exist (generate-full-location-card.js). Historical = real-ish,
# so NO imagined medium ban (photography allowed). Idempotent-ish; safe to re-run.
#
# NOTE: steps 6/8 (classify, eligibility, reaudit) are GLOBAL scripts. After running,
# VERIFY the eligibility booleans landed on the new spots (dark admin_only cards may be
# skipped by the live-location filter — see LOCATION_SEED_PLAYBOOK curation-gate check).
set -e
cd "$(dirname "$0")/.."
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh"
LOCS=("ancient egypt" "feudal japan" "1920s speakeasy")

# 1. biome CLASS per card
node -e '
require("dotenv").config({path:".env.local"});
const {createClient}=require("@supabase/supabase-js");
const sb=createClient("https://jimftynwrinwenonjrlj.supabase.co",process.env.SUPABASE_SERVICE_ROLE_KEY);
const biomes={"ancient egypt":"ancient_ruins","feudal japan":"temperate_forest","1920s speakeasy":"interior_intimate"};
(async()=>{for(const [n,b] of Object.entries(biomes)){const {error}=await sb.from("location_cards").update({biome:b}).eq("name",n);console.log((error?"ERR ":"biome ")+n+" -> "+b+(error?": "+error.message:""));}})();
'
# 2. bespoke biome_config (axes) + 3. wardrobe pool
for L in "${LOCS[@]}"; do echo "=== biome_config: $L ==="; node scripts/gen-location-biome.js --location "$L"; done
for L in "${LOCS[@]}"; do echo "=== wardrobe: $L ===";     node scripts/gen-location-wardrobe.js --location "$L"; done
# 4. named anchors  + 5. postcards
for L in "${LOCS[@]}"; do echo "=== iconic spots: $L ==="; node scripts/gen-iconic-spots-50.js --location "$L"; done
echo "=== postcards (global, adds pure_scene) ==="; node scripts/gen-postcard-spots.js
# 6. scale classify (global)  + 7. grade (per-location)
echo "=== classify scale (global) ==="; node scripts/classify-iconic-spots.js
for L in "${LOCS[@]}"; do echo "=== grade: $L ==="; node scripts/grade-iconic-spots.js --location "$L"; done
# 8. eligibility booleans (global) + pure-scene reaudit (dry-run first, then write)
echo "=== pure-scene eligible (global) ==="; node scripts/classify-pure-scene-eligible.js
echo "=== character pool (global) ===";      node scripts/qa-character-pool.js
echo "=== reaudit pure-scene (dry sample) ==="; node scripts/reaudit-pure-scene-spots.js --dry-run --sample
# (run --write manually after reviewing the dry-run)
# assign to through_time, dark
node -e '
require("dotenv").config({path:".env.local"});
const {createClient}=require("@supabase/supabase-js");
const sb=createClient("https://jimftynwrinwenonjrlj.supabase.co",process.env.SUPABASE_SERVICE_ROLE_KEY);
const cards=["ancient egypt","feudal japan","1920s speakeasy"];
(async()=>{let s=0;for(const n of cards){const {error}=await sb.from("location_cards").update({picker_category:"through_time",admin_only:true,picker_sort_order:s++}).eq("name",n);console.log((error?"ERR ":"assigned ")+n+" -> through_time (dark)"+(error?": "+error.message:""));}})();
'
# VERIFY eligibility landed on the new spots
node -e '
require("dotenv").config({path:".env.local"});
const {createClient}=require("@supabase/supabase-js");
const sb=createClient("https://jimftynwrinwenonjrlj.supabase.co",process.env.SUPABASE_SERVICE_ROLE_KEY);
(async()=>{for(const k of ["ancient egypt","feudal japan","1920s speakeasy"]){
  const {data}=await sb.from("location_iconic_spots").select("spot_kind,pure_scene_eligible,character_eligible,is_active").eq("location_key",k);
  const n=data.length, ce=data.filter(x=>x.character_eligible).length, ps=data.filter(x=>x.pure_scene_eligible).length, act=data.filter(x=>x.is_active).length;
  const nullEl=data.filter(x=>x.pure_scene_eligible===null&&x.character_eligible===null).length;
  console.log(k+": "+n+" spots, active="+act+", char_elig="+ce+", pure_scene="+ps+", BOTH-null(invisible)="+nullEl);
}})();
'
echo "=== QA seed complete for Through Time slice ==="
